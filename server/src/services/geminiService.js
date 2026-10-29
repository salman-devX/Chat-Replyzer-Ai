import { config } from '../config/env.js';

// ============================================================
//  SAFETY GUARDRAILS
// ============================================================
export const evaluateSafetyGuardrails = (text, profile = {}) => {
  const lower = (text || '').toLowerCase();
  const policy = profile.sensitiveTopicsPolicy || {
    pauseOnFinancial: true, pauseOnThreats: true,
    pauseOnLegal: true, pauseOnEscalation: true,
  };
  const fin = ['easypaisa','jazzcash','transfer money','bank account','iban','pese bhejo','paise transfer','send money','credit card','cvv','otp','bitcoin','usdt','crypto transfer','bhejo paise','raqam bhejo','advance de do','paisa bhejo','pin code'];
  const thr = ['police','lawyer','sue you','court case','fir darj','jail','threat','blackmail','fraud company','scam','harassment','thanay','wakeel'];
  const esc = ['talk to human','human agent','speak to a person','real person','asli insan se baat','manager se baat karwao','kisi bande se baat'];
  if (policy.pauseOnFinancial && fin.some(k => lower.includes(k))) return { triggered:true, category:'financial', reason:'Safety Alert: Financial data detected. Smart Pause initiated.', confidence:98 };
  if (policy.pauseOnThreats && thr.some(k => lower.includes(k))) return { triggered:true, category:'legal_threat', reason:'Safety Alert: Legal threat detected. Automation suspended.', confidence:96 };
  if (policy.pauseOnEscalation && esc.some(k => lower.includes(k))) return { triggered:true, category:'escalation', reason:'Human agent requested.', confidence:99 };
  return { triggered:false, category:'none', reason:'', confidence:100 };
};

// ============================================================
//  ZERO-REPETITION CACHE  (last 20 replies per contact)
// ============================================================
const replyCache = new Map();
function pickUnique(pool, contactId) {
  if (!pool || pool.length === 0) return '';
  const seen = replyCache.get(contactId) || [];
  const fresh = pool.filter(r => !seen.includes(r));
  const src = fresh.length > 0 ? fresh : pool;
  const picked = src[Math.floor(Math.random() * src.length)];
  seen.push(picked);
  if (seen.length > 20) seen.shift();
  replyCache.set(contactId, seen);
  return picked;
}

// ============================================================
//  ROMAN URDU NORMALIZER
// ============================================================
export function normalizeRomanUrdu(text = '') {
  let s = (text || '').toLowerCase().trim();
  s = s.replace(/[?!.,_#@*&^~"']/g, ' ');
  // negation
  s = s.replace(/\bnhi\b|\bnai\b|\bnahi\b|\bnahin\b|\bnahe\b|\bni\b/g, 'nahi');
  // common words
  s = s.replace(/\bthek\b|\bthk\b|\bthik\b|\btheek\b/g, 'theek');
  s = s.replace(/\bkch\b|\bkuch\b/g, 'kuch');
  s = s.replace(/\bbhe\b|\bbh\b|\bbhi\b/g, 'bhi');
  s = s.replace(/\bseen\b|\bsene\b|\bsceen\b|\bscene\b|\bsen\b/g, 'scene');
  s = s.replace(/\bkru\b|\bkro\b|\bkarun\b|\bkrna\b|\bkarna\b|\bkry\b|\bkare\b/g, 'karna');
  s = s.replace(/\brhna\b|\brahna\b|\breh\b|\brahun\b/g, 'rahna');
  s = s.replace(/\brabty\b|\brabte\b|\brabta\b/g, 'rabta');
  s = s.replace(/\bkiu\b|\bkyo\b|\bkyun\b|\bkio\b/g, 'kyun');
  s = s.replace(/\bkidr\b|\bkidhar\b/g, 'kidhar');
  s = s.replace(/\bkahan\b|\bkhan\b|\bkdr\b/g, 'kahan');
  s = s.replace(/\b(ha|he|hy|hai)\b/g, 'hai');
  s = s.replace(/\baj\b|\baaj\b/g, 'aaj');
  s = s.replace(/\bsham\b|\bshaam\b/g, 'sham');
  s = s.replace(/\bkya\b|\bkia\b/g, 'kya');
  s = s.replace(/\byar\b|\byaar\b|\byr\b/g, 'yar');
  s = s.replace(/\bbhai\b|\bbhae\b|\bbro\b/g, 'bhai');
  // body/illness
  s = s.replace(/\bdmg\b|\bdimag\b|\bdemage\b|\bdimage\b|\bdimagh\b|\bdemag\b/g, 'dimag');
  s = s.replace(/\bdrd\b|\bdard\b|\bderd\b/g, 'dard');
  s = s.replace(/\bsr\b|\bser\b|\bsar\b|\bsir\b/g, 'sar');
  s = s.replace(/\btbiyat\b|\btabiyat\b|\btabiat\b/g, 'tabiat');
  s = s.replace(/\bbkhar\b|\bbukhar\b|\bfever\b/g, 'bukhar');
  s = s.replace(/\bkharab\b|\bkhrab\b/g, 'kharab');
  // emotional
  s = s.replace(/\bpreshan\b|\bpareshan\b|\bprshan\b/g, 'pareshan');
  s = s.replace(/\bthaka\b|\bthakk\b|\bthka\b/g, 'thaka');
  s = s.replace(/\bfikr\b|\bfikar\b/g, 'fikar');
  // activity
  s = s.replace(/\bprogram\b|\bprogam\b|\bprgm\b/g, 'program');
  s = s.replace(/\bplan\b|\bplaan\b/g, 'plan');
  s = s.replace(/\bbnana\b|\bbanana\b/g, 'banana');
  s = s.replace(/\bmtlb\b|\bmtlab\b|\bmatlab\b/g, 'matlab');
  s = s.replace(/\bphr\b|\bphir\b/g, 'phir');
  s = s.replace(/\babhi\b|\babi\b/g, 'abhi');
  s = s.replace(/\bkab\b/g, 'kab');
  s = s.replace(/\bkyun\b|\bq\b/g, 'kyun');
  return s.replace(/\s+/g, ' ').trim();
}

// ============================================================
//  INTENT ANALYZER — returns { intent, sentiment, topic, question, subject }
// ============================================================
function analyzeIntent(raw, norm) {
  const has = (...w) => w.every(x => norm.includes(x));
  const hasAny = (...w) => w.some(x => norm.includes(x));
  const isQ = norm.includes('?') || norm.includes('kya') || norm.includes('kyun') ||
               norm.includes('kab') || norm.includes('kahan') || norm.includes('kaisa') ||
               norm.includes('kon') || norm.includes('kitna');

  // SENTIMENT
  let sentiment = 'neutral';
  if (hasAny('sad','rona','dukh','takleef','pareshan','bura','dard','bukhar','beemar','dimag kharab','sar dard','thaka','thak','neend nahi') ||
      (norm.includes('nahi') && hasAny('theek','acha','maza','sukoon'))) {
    sentiment = 'distressed';
  } else if (hasAny('khush','maza','achi','zabardast','awesome','great','badhiya','sahi','perfect','jindabad','enjoy','fun')) {
    sentiment = 'happy';
  } else if (hasAny('gussa','tang','bore','bakwas','annoyed','irritat','chill') || norm.includes('mat karo') || norm.includes('choro')) {
    sentiment = 'irritated';
  }

  // TOPIC
  let topic = 'general';
  if (hasAny('chai','tea','coffee','qahwa')) topic = 'chai';
  if (hasAny('khana','biryani','burger','pizza','lunch','dinner','breakfast','bhooka','bhookh','kha')) topic = 'food';
  if (hasAny('cricket','match','score','team','bowling','batting','ipl','psl')) topic = 'cricket';
  if (hasAny('kaam','office','job','kaam','project','meeting','deadline','boss','salary')) topic = 'work';
  if (hasAny('ghar','home','family','bhai','behen','ammi','abu','mama','papa')) topic = 'family';
  if (hasAny('dost','friend','yar','bhai','group','party','hangout')) topic = 'friends';
  if (hasAny('phone','mobile','net','internet','wifi','app','game','pc','laptop')) topic = 'tech';
  if (hasAny('movie','film','drama','series','youtube','tiktok','reel','netflix')) topic = 'entertainment';
  if (hasAny('paise','money','shopping','sale','price','mehnga','sasta')) topic = 'money';
  if (hasAny('sona','neend','nind','so ja','raat','uthna','subah')) topic = 'sleep';
  if (hasAny('safar','travel','ghumna','trip','bahar','city','karachi','lahore','islamabad')) topic = 'travel';

  // INTENT
  let intent = 'chat';
  if (has('nahi','banana') || has('nahi','karna') || has('nahi','chahta') || (norm.includes('nahi') && norm.includes('program')) || (norm.includes('nahi') && norm.includes('kuch') && norm.length < 50)) {
    intent = 'refusal';
  } else if (has('sar','dard') || has('dimag','kharab') || has('tabiat','kharab') || norm.includes('bukhar') || norm.includes('beemar') || has('thaka','hoon') || (norm.includes('nahi') && norm.includes('theek') && norm.includes('hoon'))) {
    intent = 'illness';
  } else if (norm.includes('pareshan mat') || norm.includes('tang mat') || norm.includes('chor do') || norm.includes('choro') || has('band','karo') || norm.includes('disturb mat')) {
    intent = 'leave_alone';
  } else if (hasAny('sad','rona','rone','dukh','takleef','cry','bereef') || has('nahi','acha','lag')) {
    intent = 'sad';
  } else if (norm.includes('gussa') || norm.includes('lara') || norm.includes('jhagra') || norm.includes('fight')) {
    intent = 'angry';
  } else if (hasAny('milna','milo','kab','aao','aana','bahar','chai pite','ghumte')) {
    intent = 'meetup';
  } else if (isQ && (norm.includes('kahan') || norm.includes('kidhar'))) {
    intent = 'location_q';
  } else if (isQ && (norm.includes('kya kar') || norm.includes('kya ho') || norm.includes('kya chal'))) {
    intent = 'activity_q';
  } else if (isQ && (norm.includes('kab') || norm.includes('free'))) {
    intent = 'time_q';
  } else if (isQ && norm.includes('kaisa') && norm.length < 30) {
    intent = 'how_are_you';
  } else if (norm.length < 20 && hasAny('haan','ok','theek','sahi','done','acha','bilkul')) {
    intent = 'agreement';
  } else if (norm.length < 15 && hasAny('haha','lol','hehe','lmao')) {
    intent = 'laugh';
  } else if (norm.length < 15 && hasAny('salam','hello','hi','assalam','hey','hy')) {
    intent = 'greeting';
  } else if (norm.includes('scene') || has('kya','plan') || has('kya','program')) {
    intent = 'plan';
  } else if (norm.includes('khana') || norm.includes('bhooka') || topic === 'food') {
    intent = 'food_talk';
  } else if (norm.includes('kya soch') || norm.includes('tera kya') || norm.includes('aur suna') || norm.includes('tu suna') || norm.includes('tu bata')) {
    intent = 'counter_inquiry';
  } else if (norm.includes('nahi samjha') || norm.includes('samjh nahi') || norm.includes('matlab') || norm.includes('kya matlab')) {
    intent = 'confused';
  } else if (sentiment === 'happy') {
    intent = 'positive_share';
  } else if (norm.includes('raste') || norm.includes('traffic') || norm.includes('pohanch') || norm.includes('nikal')) {
    intent = 'travel_update';
  }

  return { intent, sentiment, topic, isQ, subject: null };
}

// ============================================================
//  CONTENT-AWARE RESPONSE GENERATOR
//  Reads what was ACTUALLY said and reflects it in the reply
// ============================================================
function generateContextualReply(raw, norm, analysis, conversationHistory, contactId) {
  const { intent, sentiment, topic } = analysis;
  const has = (...w) => w.every(x => norm.includes(x));
  const hasAny = (...w) => w.some(x => norm.includes(x));

  // Extract meaningful words from the raw message to mirror back
  const words = raw.trim().split(/\s+/);
  const msgIsShort = words.length <= 4;

  switch (intent) {

    // ── REFUSAL ("kuch nahi karna", "nahi banana") ─────────────────────────
    case 'refusal':
      return pickUnique([
        'Acha theek hai, koi baat nahi yar! Waise bata kya chal raha hai phir?',
        'Ok ok, pressure nahi deta. Tu bata apna kya haal hai aaj kal?',
        'Arey chor yar wo sab. Tu sunao, aur kya scene hai?',
        'Fine bhai, koi masla nahi. Waise ghar pe sab theek hai?',
        'Samajh gaya, choro. Tu bata aaj din kaisa gaya tera?',
      ], contactId);

    // ── ILLNESS ("sar me dard", "dimag kharab", "bukhar") ─────────────────
    case 'illness': {
      const hasSarDard = has('sar','dard') || norm.includes('sar dard');
      const hasDimag = has('dimag','kharab');
      const hasBukhar = norm.includes('bukhar');
      const hasBeemar = norm.includes('beemar') || has('theek','nahi');
      if (hasBukhar) return pickUnique([
        'Oh yar bukhar hai? Paracetamol lo aur rest karo, pani zyada peo.',
        'Bukhar me phone chhoro bhai, lete jao. Khayal rakhna.',
        'Arey beemar ho tum? Dawai li? Araam karo pehle, baad me baat karte hain.',
      ], contactId);
      if (hasSarDard) return pickUnique([
        'Sar dard ho raha hai? Kuch kha ke Panadol lo yar, lete jao thodi der.',
        'Sar me dard hai? Acha phone rakho, rest karo. Dawai li?',
        'Ohhh yar sar dard! Screen se door jao thori der, aankhen band karo.',
      ], contactId);
      if (hasDimag) return pickUnique([
        'Dimag kharab hai? Kisi ne dimaag kharab kiya ya aese hi stress hai?',
        'Arey yar dimag pakra hua hai? Batao kya ho gaya, kaun hai jo pareshan kar raha hai?',
        'Dimag kharab hai matlab kuch hua hai kya? Khul ke bata kya masla hai.',
      ], contactId);
      return pickUnique([
        'Oh yar theek nahi ho? Kya hua bhai? Dawai li? Rest karo please.',
        'Arey theek nahi lag raha? Batao kya takleef hai, seriously khayal rakhna apna.',
        'Beemar ho? Yar rest karo pehle, baad me baat karte hain. Take care.',
      ], contactId);
    }

    // ── LEAVE ALONE ("pareshan mat karo", "chor do") ────────────────────
    case 'leave_alone':
      return pickUnique([
        'Acha theek hai yar, bilkul disturb nahi karta. Take care apna.',
        'Ok ok samajh gaya, rest karo. Pohancho tum, baad me baat karte hain.',
        'Sorry bhai, tera haal poocha to sahi. Araam karo, khayal rakhna.',
        'Theek hai yar, main kahan jata hoon. Get well soon!',
      ], contactId);

    // ── SAD ──────────────────────────────────────────────────────────────
    case 'sad':
      return pickUnique([
        'Kya hua yar? Sab theek hai? Batao mujhe, main yahan hoon.',
        'Arey kya ho gaya bhai? Dil chhota mat karo, khul ke batao kya scene hai.',
        'Yar lagta hai kuch hua hai, baat karo na. Kya masla ho gaya?',
        'Pareshan lag rahe ho, koi baat nahi, batao kya chal raha hai?',
      ], contactId);

    // ── ANGRY ────────────────────────────────────────────────────────────
    case 'angry':
      return pickUnique([
        'Yar kya hua? Gussa kyun hai? Batao to sahi kya scene hai.',
        'Arey bhai gusse me kyon ho? Kisi ne kuch kiya hai kya? Batao.',
        'Oye oye gussa khatam karo, pehle baat karo kya ho gaya.',
        'Teri baat sun raha hoon, kya hua exactly? Khul ke batao.',
      ], contactId);

    // ── MEETUP ("milte hain", "chai peete hain") ─────────────────────────
    case 'meetup':
      return pickUnique([
        'Haan bilkul yar, kab milna chahte ho? Main free hoon.',
        'Bata kab aur kahan, main pohanch jata hoon!',
        'Yar sham ko chalte hain, koi acha si jagah batao.',
        'Pakka milte hain! Chai wali jagah ya kuch aur plan hai?',
        'On hai yar! Tu bata kab free ho, main nikal ta hoon.',
      ], contactId);

    // ── GREETING ─────────────────────────────────────────────────────────
    case 'greeting':
      return pickUnique([
        'Walaikum salam yar! Kya haal hai, sab theek thaak?',
        'Haan bhai! Kya scene hai aaj kal tera?',
        'Salam! Kaafi din ho gaye baat kiye. Kya chal raha hai?',
        'Haan haan bhai, bol kya haal hai?',
        'Yar! Batao kya chal raha hai teri side?',
      ], contactId);

    // ── HOW ARE YOU ───────────────────────────────────────────────────────
    case 'how_are_you':
      return pickUnique([
        'Alhamdulillah yar, sab theek thaak! Tu bata apna kya haal hai?',
        'Mast hoon bhai! Bas thori routine chal rahi hai. Tu suna, kya scene hai?',
        'Theek hoon yar, kuch khas nahi. Tu bata kya ho raha hai teri life me?',
        'Fit faat! Tu sunao, kab se yaad aya main?',
      ], contactId);

    // ── LOCATION QUESTION ("kahan ho") ────────────────────────────────────
    case 'location_q':
      return pickUnique([
        'Ghar pe hi hoon bhai, raat ko kahin jaana hai. Tu bata tu kahan hai?',
        'Abhi ghar pe hi baitha hoon yar. Tu kahan pohancha?',
        'Bas nikla tha thodi der, ab ghar wapas. Kidhar ho tum?',
        'Office se abhi nikla hoon, thori der me ghar. Tu bata?',
      ], contactId);

    // ── ACTIVITY QUESTION ("kya kar rahe ho") ─────────────────────────────
    case 'activity_q':
      return pickUnique([
        'Kuch khas nahi yar, bas mobile chala raha tha. Tu bata kya chal raha hai?',
        'Abhi thora so ke utha hoon, ab free hoon. Tu suna kya scene hai?',
        'Ghar pe hi baitha tha yar, aese hi time pass. Tu bata?',
        'Bas kuch kaam kar raha tha, ab free hoon. Kya ho raha hai teri side?',
      ], contactId);

    // ── TIME QUESTION ("kab free ho") ─────────────────────────────────────
    case 'time_q':
      return pickUnique([
        'Aaj sham ke baad free hoon yar. Tera kya plan hai?',
        'Abhi thora kaam hai, kal se free hoon completely. Kab chahiye tha?',
        'Yar kal tak free ho jata hoon. Tu bata kya plan bana raha hai?',
        'Shaam 6 ke baad sab khatam. Tu nikal sakta hai?',
      ], contactId);

    // ── PLAN / SCENE ────────────────────────────────────────────────────
    case 'plan':
      return pickUnique([
        'Sham ko koi plan banate hain yar! Kahan chalna hai batao?',
        'On hai bhai! Tu bata kahan chalein, main tayar hoon.',
        'Yar chai ka program bana lete hain, koi achi jagah batao.',
        'Scene on karo bhai! Kab aur kahan — tu decide karo.',
        'Bilkul chalte hain! F-7 ya Monal ya tera koi idea hai?',
      ], contactId);

    // ── FOOD TALK ─────────────────────────────────────────────────────────
    case 'food_talk': {
      const isBiryani = norm.includes('biryani');
      const isBurger = norm.includes('burger');
      const isLunch = norm.includes('lunch') || norm.includes('dinner');
      const isBhookha = norm.includes('bhooka') || norm.includes('bhookh');
      if (isBhookha) return pickUnique(['Bhooka hoon main bhi yar! Kuch order karte hain?','Yar bhooki baat mat karo, ab to khana hi mangwana padega!','Acha chalo kuch order karo, mujhe bhi bhookh lag rahi hai sun ke!'], contactId);
      if (isBiryani) return pickUnique(['Biryani ka zikr kiya to mujhe bhi bhookh lag gayi!','Yar biryani! Kahan se lani hai, batao plan banate hain.','Oye biryani! Sach me ya sirf baat kar rahe ho? Kab milna hai?'], contactId);
      if (isBurger) return pickUnique(['Burger! Kahan se? Dera ya Student Biryani wali side?','Burger ka sun ke mooh me paani aa gaya yar.'], contactId);
      return pickUnique(['Khana khaya? Yar tu khana khao pehle, phir baat karo.','Khane ki baat karte karte mujhe bhi bhookh lag gayi.','Acha kya kha rahe ho? Mujhe bhi batao!'], contactId);
    }

    // ── COUNTER INQUIRY ("tu suna", "aur batao") ──────────────────────────
    case 'counter_inquiry':
      return pickUnique([
        'Main bhi bas theek thaak yar, routine chal rahi hai. Tu suna kya scene hai?',
        'Alhamdulillah sab fit faat! Tu bata kya naya hua hai teri side?',
        'Meri toh wahi daily life hai yar. Tu sunao, koi nayi baat?',
        'Bas abhi free hua tha, teri yaad aayi. Tu bata kya program hai?',
      ], contactId);

    // ── CONFUSED ──────────────────────────────────────────────────────────
    case 'confused':
      return pickUnique([
        'Arey sorry yar! Main keh raha tha k agar free ho to milte hain.',
        'Seedha bol raha hoon bhai — milne ka plan bana raha tha bas.',
        'Sorry samjha nahi main — kya nahi samjha tera? Batao.',
      ], contactId);

    // ── AGREEMENT ("ok", "theek hai", "done") ─────────────────────────────
    case 'agreement':
      return pickUnique([
        'Done bhai! Pakka.',
        'Sahi hai yar!',
        'Perfect, phir milte hain.',
        'Theek hai bhai, sab set!',
        'Haan pakka, on hai yar!',
      ], contactId);

    // ── LAUGH ("hahaha", "lol") ────────────────────────────────────────────
    case 'laugh':
      return pickUnique([
        'Hahaha yar tu bhi na!',
        'Sach me bahut funny tha!',
        'Hahaha aur suno koi nayi baat?',
        'Yar hasa diya tune toh!',
      ], contactId);

    // ── TRAVEL UPDATE ("raste me", "traffic") ─────────────────────────────
    case 'travel_update':
      return pickUnique([
        'Aaram se aao yar, koi jaldi nahi. Pohanch ke batana.',
        'Sahi hai bhai, drive safely! Main wait kar raha hoon.',
        'Traffic ka mazaq mat karo, aese hi phans jaate hain. Aao aaram se.',
      ], contactId);

    // ── POSITIVE SHARE ────────────────────────────────────────────────────
    case 'positive_share':
      return pickUnique([
        'Waah yar, yeh to suno! Kya hua exactly? Aur batao!',
        'Sach me? Mast news hai yar! Detail me batao?',
        'Haan yar! Acha hua. Aur kya chal raha hai?',
        'Zabardast! Tu bata poori baat, main sun raha hoon.',
      ], contactId);

    // ── GENERAL CHAT (catch-all) — content-aware ──────────────────────────
    default: {
      // If it's a question, acknowledge & ask back
      if (analysis.isQ) {
        return pickUnique([
          'Acha samjha yar. Tu bata kya soch raha hai?',
          'Haan yar, main bhi yahi soch raha tha. Kya lagta hai tujhe?',
          'Arey yeh to achi baat kahi! Aur kuch batao?',
          'Sach me yar, khul ke baat karo. Main sun raha hoon.',
          'Interesting baat hai! Tu seedha bata kya chahta hai?',
        ], contactId);
      }

      // If short message, ask them to continue
      if (msgIsShort) {
        return pickUnique([
          'Haan yar, bol aage. Kya hua?',
          'Haan bhai sun raha hoon, aur bata.',
          'Bolo bolo, kya scene hai?',
          'Haan? Aur?',
          'Main yahan hoon yar, baat karo.',
        ], contactId);
      }

      // Longer message — engage genuinely
      return pickUnique([
        'Acha yar, samajh gaya. Aur kya hua phir?',
        'Haan yar, sahi baat hai. Kya sochte ho iske baare me?',
        'Yar sun ke acha laga. Aur kuch batao?',
        'Sach me? Khul ke baat karo yar, main sunna chahta hoon.',
        'Theek theek, lekin yeh bata — aage kya plan hai?',
        'Main samajh raha hoon yar. Tum theek ho na aakhir me?',
        'Sahi lag raha hai yar. Tu bata ab kya karna chahta hai?',
        'Interesting yar! Aur kya chal raha hai is sab ke saath?',
      ], contactId);
    }
  }
}

// ============================================================
//  MAIN EXPORT — analyzeAndRespondContextually
// ============================================================
export const analyzeAndRespondContextually = (
  incomingText, profile = {}, conversationHistory = [], contactId = 'default'
) => {
  const raw = (incomingText || '').trim();
  const norm = normalizeRomanUrdu(raw);
  const mode = profile.mode || 'personal';

  // Media handling
  if (raw.includes('[Voice Note') || raw.includes('[Audio Message]') || raw.includes('audioMessage')) {
    return pickUnique(['Yar abhi drive kar raha hoon, audio nahi sun sakta. Text me likh do kya scene hai?','Bhai abhi busy hoon, audio nahi ho rahi. Short me text likh do.','Yar meeting me hoon, audio nahi chal sakti. Text me bata do please.'], contactId);
  }
  if (raw.includes('[Image Message]') || raw.includes('imageMessage')) {
    return pickUnique(['Haan mil gayi pic! Kya scene hai iska?','Dekh raha hoon bhai, ek minute.','Acha ruko, abhi internet thora slow hai. Kya cheez hai ye?'], contactId);
  }

  // Business/Creator/Sales modes
  if (mode === 'business') {
    const n = norm;
    if (n.includes('price') || n.includes('cost') || n.includes('kitne') || n.includes('fees')) return 'Assalam o Alaikum! Our packages are flexible. Please share your requirements and we will send the complete details right away.';
    if (n.includes('time') || n.includes('open') || n.includes('location') || n.includes('address')) return 'We are open Monday to Saturday, 9 AM to 6 PM. Feel free to visit or drop your query!';
    return 'Thank you for contacting us! A team member will assist you shortly.';
  }
  if (mode === 'creator') {
    if (norm.includes('collab') || norm.includes('sponsor') || norm.includes('rate card')) return 'Hey! Please share your campaign brief and my team will review it right away!';
    return 'Hey! Thank you for the love. Drop your message and I will catch up soon!';
  }
  if (mode === 'sales') return 'Assalam o Alaikum! We would love to schedule a quick 5-minute call. What time works best for you?';

  // Personal mode — full intent analysis
  const analysis = analyzeIntent(raw, norm);
  return generateContextualReply(raw, norm, analysis, conversationHistory, contactId);
};

// ============================================================
//  GENERATE AI REPLY — tries Gemini LLM first, falls back
// ============================================================
export const generateAiReply = async (
  incomingText, profile = {}, conversationHistory = [], contactId = 'default'
) => {
  const safety = evaluateSafetyGuardrails(incomingText, profile);
  if (safety.triggered) {
    return { success:false, safetyInterception:true, reason:safety.reason, replyText:'', safety };
  }

  // Try Gemini API
  if (config.aiApiKey) {
    const configuredModel = config.geminiModel || 'gemini-3.1-flash-lite';
    const models = [
      configuredModel,
      'gemini-3.1-flash-lite',
      'gemini-3.1-flash-lite-preview',
      'gemini-flash-lite-latest',
      'gemini-3.8-flash',
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    const systemPromptText = profile.customInstructions || `Tum WhatsApp par apne jigri dost (close friend) ke sath casual Roman Urdu me chat kar rahe ho.
Tumhara andaaz: 100% genuine Pakistani dost jo WhatsApp par natural chat karta hai (alfaaz: "yar", "jani", "bhai", "kya scene hai", "tension na le", "chalo done hai", "sahi hai", "mast").

CRITICAL HUMAN CONVERSATION RULES:
1. Aglay dost ki baat ko PEHLY achi tarah samjho:
   - Agar wo bore ho raha hai, to fun baatein karo, masti karo, ya mashwara do (movie, gaming, bahar chalte hain).
   - Agar wo milne ya program ka keh raha hai (e.g. "kal milty hn", "chai pe chalte hain"), to fauran time ya jagah confirm karo ya "done hai!" bolo.
   - Agar beemar / sar dard / tabiat kharab hai, to dosti wali hamdardi aur rest karne ka kaho, befikri dikhao.
   - Agar wo shikwa kare ke "tum apni sunaye ja rahe ho", to fauran maazrat karke bolo "Arey sorry yar, main bilkul sun raha hoon, bol kya keh raha tha?".
   - Agar wo "theek", "hmm", "acha" bole, to chat roko mat, agay barhao aur koi interesting baat chhero.
2. CONTINUOUS CONVERSATION:
   - Pichli chat ki puri history ko dhyan me rakho aur latest baat se 100% judi hui baat bolo.
   - Kabhi disconnected ya achanak be-tukki baat mat karo.
3. ZERO REPETITION:
   - KABHI bhi ek hi jumla, sawal ya dialogue repeat mat karo. Har reply fresh aur alag honi chahiye.
4. ABSOLUTELY NO AI FEELING:
   - KABHI mat kaho ke tum AI ho, bot ho ya assistant ho.
   - KABHI formal robotic salam/durood mat do jab chat pehle se chal rahi ho.
   - WhatsApp style: Short, casual aur natural (1-2 lines maximum).`;

    for (const modelName of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.aiApiKey}`;

        const contents = [];
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          for (const turn of conversationHistory.slice(-10)) {
            if (turn.text && turn.text.trim()) {
              contents.push({
                role: (turn.role === 'model' || turn.role === 'assistant') ? 'model' : 'user',
                parts: [{ text: turn.text.trim() }],
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: incomingText.trim() }],
        });

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPromptText }],
            },
            contents,
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 120,
            },
          }),
          signal: AbortSignal.timeout(8000),
        });

        const data = await res.json();
        const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt && txt.trim()) {
          const reply = txt.trim()
            .replace(/^(Me|You|AI|Bot|Friend|Dost|Model|User):\s*/i, '')
            .replace(/^["']|["']$/g, '')
            .trim();

          if (reply.length > 2) {
            console.log(`✨ [Gemini:${modelName}] "${reply}"`);
            return { success:true, safetyInterception:false, replyText:reply, provider:`Gemini(${modelName})`, safety };
          }
        } else if (data?.error) {
          console.warn(`⚠️ [Gemini:${modelName}] ${data.error.code}: ${data.error.message}`);
        }
      } catch (e) {
        console.warn(`⚠️ [Gemini:${modelName}] ${e.message}`);
      }
    }
  }

  // Fallback: Intelligent Contextual Brain
  const reply = analyzeAndRespondContextually(incomingText, profile, conversationHistory, contactId);
  console.log(`🧠 [ContextualBrain] "${reply}"`);
  return { success:true, safetyInterception:false, replyText:reply, provider:'Chat Replyzer Contextual Brain', safety };
};
