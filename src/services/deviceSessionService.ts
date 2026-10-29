// Device Session & Real WhatsApp Web Auto-Reply Service
import { io, Socket } from 'socket.io-client';

export type PlatformId = 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
export type AssistantRole = 'personal' | 'business' | 'creator' | 'sales' | 'custom';
export type LanguagePreference = 'roman_urdu' | 'urdu' | 'en' | 'mixed';

export interface ConnectedDevice {
  id: string;
  platform: PlatformId;
  platformName: string;
  accountIdentifier: string; // Phone number or @handle
  deviceName: string;       // e.g. "iPhone 15 Pro", "Samsung S24"
  connectedAt: string;
  status: 'connected' | 'connecting' | 'paused';
  autoReplyEnabled: boolean;
  batteryLevel?: number;
  sessionToken: string;
}

export interface ActivityMessage {
  id: string;
  platform: PlatformId;
  contactName: string;
  contactIdentifier: string;
  incomingText: string;
  replyText: string;
  roleUsed: string;
  language: string;
  timestamp: string;
  status: 'replied' | 'paused_safety' | 'manual_takeover';
  safetyFlag?: string;
}

export interface AiPersonalityConfig {
  role: AssistantRole;
  roleName: string;
  language: LanguagePreference;
  formality: number; // 0 (casual) to 100 (formal)
  humor: number;     // 0 to 100
  sampleGreeting: string;
  sampleSignoff: string;
  customInstructions: string;
  pauseOnFinancial: boolean;
  pauseOnThreats: boolean;
}

const STORAGE_KEY_DEVICES = 'chat_replyzer_linked_devices';
const STORAGE_KEY_MESSAGES = 'chat_replyzer_real_messages';
const STORAGE_KEY_PERSONALITY = 'chat_replyzer_active_personality';
const STORAGE_KEY_GLOBAL_AUTO_REPLY = 'chat_replyzer_global_autoreply';

export const BACKEND_URL =
  (import.meta as any).env?.VITE_SOCKET_URL ||
  (import.meta as any).env?.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

export const DEFAULT_PERSONALITY: AiPersonalityConfig = {
  role: 'personal',
  roleName: 'Friends & Personal',
  language: 'roman_urdu',
  formality: 20,
  humor: 75,
  sampleGreeting: 'Assalam o Alaikum! Kese ho bhai?',
  sampleSignoff: 'Chalo phir milte hain!',
  customInstructions: 'Natural Roman Urdu conversational tone. Warm, friendly, authentic friend persona.',
  pauseOnFinancial: true,
  pauseOnThreats: true,
};

export const ROLE_DEFINITIONS: Record<AssistantRole, { name: string; tagline: string; description: string; sample: string }> = {
  personal: {
    name: 'Friends & Personal',
    tagline: 'Casual chats, banter & close connections',
    description: 'Replies naturally in Roman Urdu, Urdu, and conversational English. Perfect for personal WhatsApp chats.',
    sample: 'Scene 100% on hai bhai! Bas 15 minute me pohanchta hoon. Table book karli?',
  },
  business: {
    name: 'Business & Customer Support',
    tagline: '24/7 Professional Inquiry & FAQs',
    description: 'Polite, clear, and informative responses for business operating hours, pricing, and client queries.',
    sample: 'Hello! Thank you for reaching out to us. Our operating hours are 9 AM – 6 PM PKT. How may we assist you today?',
  },
  creator: {
    name: 'Creator & Influencer Collabs',
    tagline: 'Screen brand partnerships & audience DMs',
    description: 'Screens brand collaboration inquiries, media kit requests, and polite fan engagement.',
    sample: 'Hey! Thanks for getting in touch. For collaboration proposals and rate cards, please email collabs@... with campaign details.',
  },
  sales: {
    name: 'Sales & Inbound Lead Qualification',
    tagline: 'Qualify buyer intent & book meetings',
    description: 'Engages inbound leads, answers product specs, and guides prospects to schedule calls.',
    sample: 'Assalam o Alaikum! Yes, we have availability for that package this month. Would you prefer a quick 10-minute demo call tomorrow?',
  },
  custom: {
    name: 'Custom User Prompt',
    tagline: 'Your exact personal instructions & tone',
    description: 'Define your own exact personality, vocabulary, and specific replies.',
    sample: 'Custom persona configured by account owner.',
  },
};

// ─── Real Socket.IO Client Bridge ──────────────────────────────────────────────

let socket: Socket | null = null;
type StateListener = (state: any) => void;
const listeners: Set<StateListener> = new Set();

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('📡 [Frontend] Connected to backend Socket.IO on port 5000');
      socket?.emit('whatsapp:get-state');
    });

    socket.on('whatsapp:state', (data) => {
      handleIncomingBackendState(data);
    });

    socket.on('whatsapp:qr', ({ qr }) => {
      listeners.forEach((fn) => fn({ type: 'qr', qr }));
    });

    socket.on('whatsapp:connected', ({ user }) => {
      const dev: ConnectedDevice = {
        id: `wa_${Date.now()}`,
        platform: 'whatsapp',
        platformName: 'WhatsApp',
        accountIdentifier: user.phone || '+92 300 0000000',
        deviceName: `${user.name || 'WhatsApp Phone'} (Linked Device)`,
        connectedAt: user.connectedAt || 'Just now',
        status: 'connected',
        autoReplyEnabled: true,
        sessionToken: user.id || 'real_wa_session',
      };
      addLinkedDevice(dev);
      listeners.forEach((fn) => fn({ type: 'connected', device: dev }));
    });

    socket.on('whatsapp:disconnected', () => {
      removeLinkedDevice('whatsapp');
      listeners.forEach((fn) => fn({ type: 'disconnected' }));
    });
  }
  return socket;
}

function handleIncomingBackendState(data: any) {
  if (data?.user && data.status === 'connected') {
    const dev: ConnectedDevice = {
      id: `wa_live`,
      platform: 'whatsapp',
      platformName: 'WhatsApp',
      accountIdentifier: data.user.phone || '+92 300 0000000',
      deviceName: `${data.user.name || 'WhatsApp Phone'} (Linked Device)`,
      connectedAt: data.user.connectedAt || 'Active',
      status: 'connected',
      autoReplyEnabled: data.autoReplyEnabled ?? true,
      sessionToken: data.user.id || 'real_wa_session',
    };
    addLinkedDevice(dev);
  } else if (data.status === 'disconnected') {
    removeLinkedDevice('whatsapp');
  }

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    saveRealMessages(data.messages);
  }

  listeners.forEach((fn) => fn({ type: 'state', data }));
}

export function subscribeToWhatsAppState(listener: StateListener): () => void {
  listeners.add(listener);
  getSocket(); // ensure connected
  return () => {
    listeners.delete(listener);
  };
}

// ─── Backend API Operations ────────────────────────────────────────────────────

export async function fetchRealWhatsAppStatus(sessionId = 'default'): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/whatsapp/status?sessionId=${sessionId}`);
    return await res.json();
  } catch (e) {
    console.warn('Backend not responding yet:', e);
    return { success: false, status: 'disconnected' };
  }
}

export async function startRealWhatsAppSession(sessionId = 'default'): Promise<{ success: boolean; qr?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/whatsapp/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to start WhatsApp session:', e);
    return { success: false };
  }
}

export async function disconnectRealWhatsApp(sessionId = 'default'): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/whatsapp/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    removeLinkedDevice('whatsapp');
  } catch (e) {
    console.error('Failed to disconnect WhatsApp:', e);
  }
}

export async function syncConfigToBackend(autoReplyEnabled: boolean, personality: AiPersonalityConfig): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/whatsapp/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        autoReplyEnabled,
        personality: {
          mode: personality.role,
          name: personality.roleName,
          language: personality.language,
          formality: personality.formality,
          humor: personality.humor,
          sampleGreeting: personality.sampleGreeting,
          sampleSignoff: personality.sampleSignoff,
          customInstructions: personality.customInstructions,
          sensitiveTopicsPolicy: {
            pauseOnFinancial: personality.pauseOnFinancial,
            pauseOnThreats: personality.pauseOnThreats,
          },
        },
      }),
    });
  } catch (e) {
    console.warn('Sync to backend failed:', e);
  }
}

// ─── Local Storage Operations ──────────────────────────────────────────────────

export function getLinkedDevices(): ConnectedDevice[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_DEVICES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLinkedDevices(devices: ConnectedDevice[]): void {
  localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
}

export function addLinkedDevice(device: ConnectedDevice): ConnectedDevice[] {
  const current = getLinkedDevices();
  const filtered = current.filter(d => d.platform !== device.platform);
  const updated = [...filtered, device];
  saveLinkedDevices(updated);
  return updated;
}

export function removeLinkedDevice(platform: PlatformId): ConnectedDevice[] {
  const current = getLinkedDevices();
  const updated = current.filter(d => d.platform !== platform);
  saveLinkedDevices(updated);
  return updated;
}

export function getRealMessages(): ActivityMessage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRealMessages(messages: ActivityMessage[]): void {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

export function addRealMessage(message: ActivityMessage): ActivityMessage[] {
  const current = getRealMessages();
  const updated = [message, ...current];
  saveRealMessages(updated);
  return updated;
}

export function clearRealMessages(): void {
  localStorage.removeItem(STORAGE_KEY_MESSAGES);
}

export function getPersonalityConfig(): AiPersonalityConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PERSONALITY);
    return data ? JSON.parse(data) : DEFAULT_PERSONALITY;
  } catch {
    return DEFAULT_PERSONALITY;
  }
}

export function savePersonalityConfig(config: AiPersonalityConfig): void {
  localStorage.setItem(STORAGE_KEY_PERSONALITY, JSON.stringify(config));
  const autoReply = getGlobalAutoReply();
  syncConfigToBackend(autoReply, config);
}

export function getGlobalAutoReply(): boolean {
  const data = localStorage.getItem(STORAGE_KEY_GLOBAL_AUTO_REPLY);
  return data !== null ? data === 'true' : true;
}

export function setGlobalAutoReply(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY_GLOBAL_AUTO_REPLY, String(enabled));
  const personality = getPersonalityConfig();
  syncConfigToBackend(enabled, personality);
}

// ─── AI Response & Safety Engine ───────────────────────────────────────────────

export interface GeneratedReplyResult {
  reply: string;
  status: 'replied' | 'paused_safety';
  safetyReason?: string;
  detectedLanguage: string;
}

export function processIncomingMessage(
  incomingText: string,
  config: AiPersonalityConfig = getPersonalityConfig(),
  conversationHistory: Array<{ role: string; text: string }> = []
): GeneratedReplyResult {
  const lower = incomingText.toLowerCase().trim();
  const hasHistory = Array.isArray(conversationHistory) && conversationHistory.length > 0;

  // Safety Checks (Smart Pause for high-risk topics)
  if (config.pauseOnFinancial) {
    const financialKeywords = [
      'easypaisa', 'jazzcash', 'transfer', 'pese bhej', 'paise bhej',
      'bank account', 'iban', 'paisa bhejo', 'money transfer', 'credit card',
      'otp', 'pin code', 'password', 'urgent payment'
    ];
    for (const kw of financialKeywords) {
      if (lower.includes(kw)) {
        return {
          reply: '⚠️ [SMART PAUSE ACTIVATED] Financial transfer or sensitive credential request detected. AI reply halted to protect your account. Please respond manually.',
          status: 'paused_safety',
          safetyReason: `Detected financial transfer keyword ("${kw}"). AI halted.`,
          detectedLanguage: 'Roman Urdu / Financial Alert'
        };
      }
    }
  }

  if (config.pauseOnThreats) {
    const threatKeywords = ['police', 'fir', 'court', 'lawyer', 'threat', 'gali', 'report'];
    for (const kw of threatKeywords) {
      if (lower.includes(kw)) {
        return {
          reply: '⚠️ [SMART PAUSE ACTIVATED] Legal or conflict keyword detected. AI reply suspended.',
          status: 'paused_safety',
          safetyReason: `Sensitive topic detected ("${kw}").`,
          detectedLanguage: 'Legal / Escalation Alert'
        };
      }
    }
  }

  // Role-Based Response Generation
  let reply = '';
  const detectedLang = (lower.includes('kahan') || lower.includes('bhai') || lower.includes('kya') || lower.includes('hai') || lower.includes('yar') || lower.includes('chalo') || lower.includes('sham'))
    ? 'Roman Urdu'
    : 'English';

  const clean = lower.replace(/[?!.,_#@*]/g, ' ').replace(/\s+/g, ' ').trim();

  // Media / Voice Note Handling
  if (incomingText.includes('[Voice Note') || incomingText.includes('[Audio Message]') || lower.includes('voice note') || lower.includes('audio')) {
    return {
      reply: 'Yar abhi drive kar raha hoon / thora busy hoon, audio nahi chal sakti. Text likh kar bata do jaldi se kya baat hai?',
      status: 'replied',
      detectedLanguage: 'Roman Urdu (Voice Note Handler)'
    };
  }

  if (incomingText.includes('[Image Message]') || lower.includes('pic dekho') || lower.includes('tasveer')) {
    return {
      reply: 'Haan bhai pic mil gayi! Zabardast lag rahi hai. Kya scene hai iska?',
      status: 'replied',
      detectedLanguage: 'Roman Urdu (Image Handler)'
    };
  }

  if (config.role === 'personal') {
    // 0. Emotional state: Mood kharab, pareshan, tension, gussa
    if (
      clean.includes('mood khrab') || clean.includes('mood kharab') || clean.includes('tension') ||
      clean.includes('pareshan') || clean.includes('dimag kharab') || clean.includes('sad') || clean.includes('gussa')
    ) {
      pool = [
        'Arey bhai kya hua? Kiska dimagh kharab hai, tension na lo yar! Mujhe batao kya masla hua hai?',
        'Chhor na yar, mood khrab mat kar. Bata kya khana hai, zinger mangwaye ya biryani? Chill kar!',
        'Kya scene ho gaya bhai? Sab theek to hai na? Mujh se share karo kya baat hui hai.'
      ];
    }
    // 1. "Tu sna" / "Tu sunao" / "Tum sunao"
    else if (
      clean === 'tu sna' || clean === 'tu suna' || clean === 'tm sna' || clean === 'tum sunao' ||
      clean.includes('tu sna') || clean.includes('tu suna') || clean.includes('tum sunao') ||
      clean.includes('tm snao') || clean.includes('ap sunao') || clean.includes('aur suna') ||
      clean.includes('or sunao')
    ) {
      pool = [
        'Main bhi theek thaak yar! Bas abhi ghar pohncha tha. Tu bata kya scene chal raha hai?',
        'Alhamdulillah sab fit faat! Tu sunao, koi nayi tazi?',
        'Bas yaar normal routine chal rahi hai, thora sa rest kar raha tha. Tu bata kya kar raha hai?'
      ];
    }
    // 2. "Kis ko" / "Kisko" / "Kis cheez ko"
    else if (
      clean === 'kis ko' || clean === 'kisko' || clean.includes('kis ko') ||
      clean.includes('kis chez') || clean.includes('konsi') || clean.includes('kisko dekh') ||
      clean.includes('kis ki baat')
    ) {
      pool = [
        'Arey wahi apne sham wale milne ke scene ki baat kar raha hoon bhai!',
        'Wahi jo pehle baat chal rahi thi hamari, tum batao kya program banaya hai?',
        'Are main to aese hi keh raha tha k jo plan tha usko finalize karte hain!'
      ];
    }
    // 3. "Kya kh rhy ho" / "Kya keh rahe ho" / "Kya bol rahy ho"
    else if (
      clean.includes('kya kh rhy') || clean.includes('kya keh') || clean.includes('kya kh rh') ||
      clean.includes('kya bol') || clean.includes('samjh nahi') || clean.includes('samjh nhi') ||
      clean.includes('matlab')
    ) {
      pool = [
        'Yar main simple keh raha tha k sham ko free ho to batao, koi chai ka program banate hain!',
        'Kuch khas nahi bhai, bas aese hi baat kar raha tha. Tu bata tu kahan hai abhi?',
        'Main keh raha tha k chalo kahin bahar nikalty hain, bohat din ho gaye!'
      ];
    }
    // 4. "Kya kr rhy ho" / "Kya kar rahe ho" / "Free ho"
    else if (
      clean.includes('kya kr rhy') || clean.includes('kya kar rahe') || clean.includes('kya kr rha') ||
      clean.includes('kya kar rha') || clean.includes('free ho') || clean.includes('busy ho')
    ) {
      pool = [
        'Kuch khas nahi yar, bas phone use kar raha tha aur chill kar raha tha. Tu bata tu kya kar raha hai?',
        'Bas thora sa kaam wrap up kar raha hoon, 15-20 min me bilkul free. Bolo kya scene hai?',
        'Ghar pe hi baitha tha aese hi time pass kar raha tha. Tu sunao kahan ho?'
      ];
    }
    // 5. Scene / Plan / Sham ko
    else if (
      clean.includes('aj sham') || clean.includes('sham ko') || clean.includes('shaam') ||
      clean.includes('scene') || clean.includes('plan') || clean.includes('program') ||
      clean.includes('kya krna ha') || clean.includes('kya karna hai')
    ) {
      pool = [
        'Haan yar sham ko scene 100% on hai! Chai pe milte hain, tu time bata kab nikle?',
        'Sham ko bilkul free hoon bhai, batao kahan chalna hai?',
        'Scene on hai! 7 ya 8 baje ke qareeb milte hain, kidhar chalain phir?'
      ];
    }
    // 6. Kahan ho / Kidhar
    else if (clean.includes('kahan') || clean.includes('kidhar') || clean.includes('kdr') || clean.includes('kidr')) {
      pool = [
        'Ghar pe hi hoon bhai abhi, thori der me nikalna hai. Tu kahan pohncha?',
        'Bas raste me hoon yar, 15 min me pohanch raha hoon!'
      ];
    }
    // 7. Kese ho / Kaisa hai
    else if (clean.includes('kese ho') || clean.includes('kaisa hai') || clean.includes('how are you')) {
      pool = [
        'Alhamdulillah bilkul fit faat bhai! Tu bata sab khairiyat?',
        'Main theek thaak yar! Tu sunao kahan ghayab ho aj kal?'
      ];
    }
    // 8. Greetings (Hi, Hello, Salam)
    else if (clean === 'h' || clean === 'hi' || clean === 'hello' || clean === 'hey' || clean.includes('salam')) {
      pool = hasHistory
        ? ['Haan bhai bolo, kya scene hai?', 'Haan yar, sun raha hoon bolo.']
        : ['Walaikum Assalam bhai! Kese ho? Sab theek?', 'Walaikum Assalam yar! Kya chal raha hai aj kal?'];
    }
    // 9. Agreement (Theek hai, Done, OK)
    else if (clean.includes('ok') || clean.includes('theek') || clean.includes('done') || clean.includes('sahi') || clean.includes('acha')) {
      pool = [
        'Done hai bhai! 👍',
        'Sahi hai yar, scene done karo phir.',
        'Zabardast! Time se milte hain.'
      ];
    } else {
      pool = [
        'Acha sahi, samjh gaya! Aur batao kya chal raha hai?',
        'Haan bilkul yar, theek keh rahe ho.',
        'Sahi hai bhai, tension na lo chill karo!'
      ];
    }

    // Never repeat the last reply
    const lastReply = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].text : '';
    const nonRepeated = pool.filter(r => r !== lastReply);
    reply = nonRepeated.length > 0
      ? nonRepeated[Math.floor(Math.random() * nonRepeated.length)]
      : pool[Math.floor(Math.random() * pool.length)];

  } else if (config.role === 'business') {
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('rate') || lower.includes('cost') || lower.includes('kitne')) {
      reply = `Hello! Thank you for your inquiry. Our standard pricing packages start with flexible tiers designed for your needs. May we know your specific requirements to share our official catalog?`;
    } else if (lower.includes('time') || lower.includes('hour') || lower.includes('timing') || lower.includes('open')) {
      reply = `Our official support and office hours are Monday to Saturday, 9:00 AM – 6:00 PM PKT. Our team typically responds within 30 minutes during work hours.`;
    } else if (lower.includes('meeting') || lower.includes('call') || lower.includes('demo')) {
      reply = `We would be delighted to arrange a brief product demo. Please let us know your preferred date and time, and we will send a calendar invite immediately.`;
    } else {
      reply = `Thank you for contacting our team. We have received your message and an agent will assist you shortly. If urgent, please reply with 'URGENT'.`;
    }
  } else if (config.role === 'creator') {
    if (lower.includes('collab') || lower.includes('sponsor') || lower.includes('brand') || lower.includes('deal')) {
      reply = `Hey! Thanks for reaching out. We would love to explore a brand collaboration. Please send your campaign brief and deliverables to collabs@creator.com, and my management will review by tomorrow!`;
    } else if (lower.includes('video') || lower.includes('post') || lower.includes('love') || lower.includes('fan')) {
      reply = `Thank you so much for the love and support! ❤️ Really means the world. New content dropping very soon, stay tuned!`;
    } else {
      reply = `Hey there! Thanks for your DM. Received loud and clear, will get back to you as soon as I wrap up today's shoot! ✨`;
    }
  } else if (config.role === 'sales') {
    if (lower.includes('discount') || lower.includes('offer') || lower.includes('deal')) {
      reply = `We currently have special onboarding packages for new partners this quarter! How many team members will be using the platform?`;
    } else {
      reply = `Assalam o Alaikum! Thanks for showing interest in our solutions. What is the primary business goal you are looking to achieve this month?`;
    }
  } else {
    reply = `${config.sampleGreeting} ${config.customInstructions ? `[Custom AI Profile Active]: ${config.customInstructions}` : 'Message received! Thanks for connecting.'}`;
  }

  return {
    reply,
    status: 'replied',
    detectedLanguage: detectedLang
  };
}
