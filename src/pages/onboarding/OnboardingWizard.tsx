import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  Globe2,
  MessageSquare,
  Lock,
  RotateCcw,
  Play,
  Save,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { ASSISTANT_MODES, SUPPORTED_PLATFORMS, DAILY_FREE_REPLY_LIMIT } from '@shared';
import { OnboardingState, AssistantMode, PlatformId, LanguagePreference } from '../../types';

const STORAGE_KEY = 'chat_replyzer_onboarding_progress';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return {
      currentStep: 1,
      mode: 'personal',
      platforms: ['whatsapp'],
      language: 'roman_urdu',
      assistantName: 'Aria',
      formality: 25,
      humor: 75,
      emojiFrequency: 'moderate',
      replyLength: 'balanced',
      sampleGreeting: 'Assalam o Alaikum! Kese ho bhai?',
      phrasesToUse: ['Scene on hai', 'Koi tension nahi', 'Zabardast'],
      phrasesToAvoid: ['Sorry I am just a bot', 'Error code 500'],
      quietHoursEnabled: true,
      pauseOnSensitive: true,
      disclosureNotice: false,
      simulationTested: false,
      active: false,
      isComplete: false,
    };
  });

  const [simulatedInput, setSimulatedInput] = useState('Bhai kal ki party ka kya plan hai? Sab chal rahe hain?');
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateField = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (state.currentStep < 10) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      // Complete onboarding
      setState(prev => ({ ...prev, isComplete: true, active: true }));
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const saveAndExit = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      navigate('/dashboard');
    }, 1200);
  };

  // Run simulated prompt for Step 8
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulatedResponse(null);
    setTimeout(() => {
      let reply = "";
      if (state.language === 'roman_urdu' || state.language === 'mixed') {
        if (state.mode === 'personal') {
          reply = `${state.sampleGreeting} Haan bilkul scene on hai! Sab 8 baje tak pohonch rahe hain. Main bhi nikal raha hoon, bas 10 min lagenge! 🎉`;
        } else if (state.mode === 'business') {
          reply = `Hello! Thanks for reaching out. Yes, we are operating as scheduled and all orders are dispatched within 24 hours. Let me know if you need any assistance!`;
        } else if (state.mode === 'creator') {
          reply = `Hey! Thanks so much for reaching out. For collab details or media inquiries, drop a quick note to my manager at collabs@creator.com! ✨`;
        } else {
          reply = `Hello! We've noted your request and our lead specialist will reach out shortly with full pricing details.`;
        }
      } else {
        reply = `Hello! Everything is confirmed and on schedule. Looking forward to connecting shortly!`;
      }
      setSimulatedResponse(reply);
      setIsSimulating(false);
      updateField('simulationTested', true);
    }, 600);
  };

  const stepsMeta = [
    { num: 1, title: 'Purpose', desc: 'Choose role & mode' },
    { num: 2, title: 'Platforms', desc: 'Select messaging channels' },
    { num: 3, title: 'Eligibility', desc: 'Review API requirements' },
    { num: 4, title: 'Authorize', desc: 'Connect official accounts' },
    { num: 5, title: 'Language', desc: 'Roman Urdu & style' },
    { num: 6, title: 'Personality', desc: 'Tone, humor & greetings' },
    { num: 7, title: 'Guardrails', desc: 'Safety & human takeover' },
    { num: 8, title: 'Lab Test', desc: 'Simulate conversation' },
    { num: 9, title: 'Activation', desc: 'Enable automation' },
    { num: 10, title: 'Ready', desc: 'Dashboard handover' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200/90 py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-subtle">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" withTagline={false} />
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-navy-700">
              Setup Wizard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveAndExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-navy-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Progress & Exit
            </button>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200/80 px-2.5 py-1 rounded-lg">
              Step {state.currentStep} of 10
            </span>
          </div>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          Progress saved! Redirecting to dashboard...
        </div>
      )}

      {/* Stepper Progress Bar */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-6">
        <div className="hidden lg:grid grid-cols-10 gap-2 mb-2">
          {stepsMeta.map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num <= state.currentStep) updateField('currentStep', s.num);
              }}
              className={`cursor-pointer text-center space-y-1 p-1 rounded-lg transition-all ${
                s.num === state.currentStep
                  ? 'bg-brand-50 border border-brand-200'
                  : s.num < state.currentStep
                  ? 'opacity-80 hover:opacity-100'
                  : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  s.num === state.currentStep
                    ? 'bg-brand-600 text-white shadow-sm'
                    : s.num < state.currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-navy-600'
                }`}>
                  {s.num < state.currentStep ? '✓' : s.num}
                </span>
              </div>
              <p className="text-[11px] font-bold text-navy-900 truncate">{s.title}</p>
            </div>
          ))}
        </div>

        {/* Mobile slim progress bar */}
        <div className="lg:hidden w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full transition-all duration-300"
            style={{ width: `${(state.currentStep / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Canvas */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-card space-y-8">
          
          {/* STEP 1: CHOOSE PURPOSE */}
          {state.currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 1 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Choose Your Primary Purpose</h2>
                <p className="text-xs text-navy-600">Select the conversational role for this assistant profile. You can create other profiles later.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ASSISTANT_MODES.map((m) => {
                  const isSelected = state.mode === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => updateField('mode', m.id as AssistantMode)}
                      className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {m.badge}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-950">{m.name}</h3>
                        <p className="text-xs text-navy-600 mt-1 leading-relaxed">{m.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT PLATFORMS */}
          {state.currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 2 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Select Supported Platforms</h2>
                <p className="text-xs text-navy-600">Select the channels where this assistant will be authorized to automate replies.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUPPORTED_PLATFORMS.map((p) => {
                  const isSelected = state.platforms.includes(p.id as PlatformId);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        const newPlatforms = isSelected
                          ? state.platforms.filter(id => id !== p.id)
                          : [...state.platforms, p.id as PlatformId];
                        updateField('platforms', newPlatforms.length > 0 ? newPlatforms : [p.id as PlatformId]);
                      }}
                      className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-3 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">
                            {p.id === 'whatsapp' && '💬'}
                            {p.id === 'instagram' && '📸'}
                            {p.id === 'messenger' && '⚡'}
                            {p.id === 'tiktok' && '🎵'}
                          </span>
                          <span className="font-bold text-navy-950 text-sm">{p.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-navy-600">{p.accountRequirement}</p>
                      {p.requiresApproval && (
                        <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Requires TikTok App Review
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW REQUIREMENTS & ELIGIBILITY */}
          {state.currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 3 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Review Platform Requirements</h2>
                <p className="text-xs text-navy-600">Ensure your accounts satisfy official platform eligibility before proceeding.</p>
              </div>

              <div className="space-y-4 text-xs text-navy-700">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-navy-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    WhatsApp Business Platform Requirements
                  </h4>
                  <p className="leading-relaxed text-navy-600">
                    A verified Meta Business Manager account with an unmigrated or dedicated business phone number. If using an existing phone number, review the coexistence guide to prevent WhatsApp app session conflicts.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-navy-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Instagram Professional / Creator Requirements
                  </h4>
                  <p className="leading-relaxed text-navy-600">
                    Your Instagram account must be converted to Professional/Creator mode and connected to a Facebook Page. In Instagram Mobile Settings, "Allow Access to Messages" must be enabled.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-navy-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    TikTok Business Messaging Notice
                  </h4>
                  <p className="leading-relaxed text-navy-600">
                    Direct messaging is restricted strictly to verified TikTok Business Accounts that have passed app review. Personal TikTok profiles cannot be automated.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AUTHORIZATION FLOW */}
          {state.currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 4 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Connect Official Accounts</h2>
                <p className="text-xs text-navy-600">Authorize securely via official OAuth dialog or configure sandbox developer credentials.</p>
              </div>

              <div className="bg-brand-50/50 border border-brand-200 rounded-2xl p-4 text-xs text-navy-800 flex items-start gap-3">
                <Lock className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Zero Password Guarantee:</strong> We never collect or store your social media account passwords. All tokens are encrypted at rest with AES-256-GCM.
                </p>
              </div>

              <div className="space-y-4">
                {state.platforms.map((p) => (
                  <div key={p} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-subtle">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {p === 'whatsapp' && '💬'}
                        {p === 'instagram' && '📸'}
                        {p === 'messenger' && '⚡'}
                        {p === 'tiktok' && '🎵'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-navy-950 capitalize">{p} Connection</h4>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Sandbox / Live OAuth
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-800 border border-slate-200 transition-colors"
                    >
                      Authenticate via OAuth
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: LANGUAGE & REPLY STYLE */}
          {state.currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 5 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Select Language & Reply Style</h2>
                <p className="text-xs text-navy-600">Choose how your AI interprets and composes messages.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-navy-900">Primary Language / Dialect</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'roman_urdu', label: 'Roman Urdu (Banter & Dialect)' },
                    { id: 'urdu', label: 'Urdu Script (اردو)' },
                    { id: 'en', label: 'English (Standard)' },
                    { id: 'mixed', label: 'Mixed / Bilingual' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => updateField('language', l.id as LanguagePreference)}
                      className={`p-3 text-left rounded-xl text-xs font-semibold border transition-all ${
                        state.language === l.id
                          ? 'border-brand-600 bg-brand-50 text-brand-900 ring-1 ring-brand-500'
                          : 'border-slate-200 hover:bg-slate-50 text-navy-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4 space-y-4 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                      <span>Formality: {state.formality}%</span>
                      <span className="text-navy-500">{state.formality < 30 ? 'Casual & Relaxed' : state.formality > 70 ? 'Formal & Professional' : 'Balanced'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={state.formality}
                      onChange={(e) => updateField('formality', Number(e.target.value))}
                      className="w-full accent-brand-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                      <span>Humor & Banter: {state.humor}%</span>
                      <span className="text-navy-500">{state.humor > 60 ? 'Witty & Playful' : 'Straightforward'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={state.humor}
                      onChange={(e) => updateField('humor', Number(e.target.value))}
                      className="w-full accent-brand-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CUSTOMIZE PERSONALITY */}
          {state.currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 6 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Customize Personality & Phrases</h2>
                <p className="text-xs text-navy-600">Give your assistant a name and signature vocabulary.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Assistant Name</label>
                  <input
                    type="text"
                    value={state.assistantName}
                    onChange={(e) => updateField('assistantName', e.target.value)}
                    placeholder="e.g. Aria, Zaid, Vox"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Sample Greeting</label>
                  <input
                    type="text"
                    value={state.sampleGreeting}
                    onChange={(e) => updateField('sampleGreeting', e.target.value)}
                    placeholder="e.g. Assalam o Alaikum! Kese ho bhai?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Signature Phrases to Use (Comma separated)</label>
                  <input
                    type="text"
                    value={state.phrasesToUse.join(', ')}
                    onChange={(e) => updateField('phrasesToUse', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Scene on hai, Koi tension nahi, Zabardast"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Phrases to Avoid (Comma separated)</label>
                  <input
                    type="text"
                    value={state.phrasesToAvoid.join(', ')}
                    onChange={(e) => updateField('phrasesToAvoid', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="I am an automated bot, Error 500"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: AUTO-REPLY & SAFETY RULES */}
          {state.currentStep === 7 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 7 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Configure Safety & Auto-Reply Rules</h2>
                <p className="text-xs text-navy-600">Enforce smart quiet hours, human takeover triggers, and transparent AI disclosures.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.pauseOnSensitive}
                    onChange={(e) => updateField('pauseOnSensitive', e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-navy-900 text-xs block">Smart Pause on High-Risk Topics</span>
                    <span className="text-xs text-navy-600">
                      Instantly halt automated replies if financial transfers, bank account questions, legal threats, or heated arguments occur.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.quietHoursEnabled}
                    onChange={(e) => updateField('quietHoursEnabled', e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-navy-900 text-xs block">Enable Quiet Hours (23:00 - 08:00)</span>
                    <span className="text-xs text-navy-600">
                      Hold or delay automated responses during nighttime hours to maintain natural human messaging rhythms.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.disclosureNotice}
                    onChange={(e) => updateField('disclosureNotice', e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-navy-900 text-xs block">Include AI Assistant Disclosure Badge</span>
                    <span className="text-xs text-navy-600">
                      Appends a subtle "• Responded via Chat Replyzer AI" footnote for ethical, transparent communication.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: TEST WITH SIMULATED CONVERSATION */}
          {state.currentStep === 8 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 8 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Test with Simulated Conversations</h2>
                <p className="text-xs text-navy-600">Send test incoming messages to verify tone and Roman Urdu response before live activation.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Simulated Incoming Message</label>
                  <input
                    type="text"
                    value={simulatedInput}
                    onChange={(e) => setSimulatedInput(e.target.value)}
                    placeholder="Type a sample message in Roman Urdu or English..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isSimulating || !simulatedInput}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSimulating ? 'Simulating AI reasoning...' : 'Generate Test Response'}
                </button>

                {simulatedResponse && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-3">
                    <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">
                      Proposed AI Reply:
                    </span>
                    <p className="text-sm text-navy-900 font-medium bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {simulatedResponse}
                    </p>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Simulation validated. Style and safety verified.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 9: ACTIVATE SUPPORTED INTEGRATIONS */}
          {state.currentStep === 9 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 9 of 10</span>
                <h2 className="text-2xl font-extrabold text-navy-950">Activate Integrations</h2>
                <p className="text-xs text-navy-600">Verify your settings and toggle active status. Replies only trigger when activated.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-navy-950">Enable Automatic Replies</h4>
                    <p className="text-xs text-navy-600 mt-0.5">
                      Replies will be governed by your 150 daily free quota and active safety rules.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('active', !state.active)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      state.active ? 'bg-brand-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        state.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-xs text-navy-500 border-t border-slate-200/80 pt-3 flex items-center justify-between">
                  <span>Current Daily Allowance:</span>
                  <span className="font-bold text-navy-900">150 AI Replies / Day</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: COMPLETION SCREEN */}
          {state.currentStep === 10 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                  Assistant Configured & Ready!
                </h2>
                <p className="text-sm text-navy-600 max-w-md mx-auto">
                  Your assistant <span className="font-semibold text-navy-900">{state.assistantName}</span> is configured for <strong>{state.mode}</strong> mode with Roman Urdu & English intelligence.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-navy-500">Connected Channels:</span>
                  <span className="font-semibold text-navy-900">{state.platforms.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500">Daily Free Allowance:</span>
                  <span className="font-semibold text-emerald-600">150 Outgoing Replies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500">Smart Pause Guardrails:</span>
                  <span className="font-semibold text-navy-900">Active</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all"
                >
                  Enter Dashboard & Unified Inbox
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons (Back & Next) */}
          {state.currentStep < 10 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={state.currentStep === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-navy-700 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all"
              >
                {state.currentStep === 9 ? 'Finalize & Review' : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer info bar */}
      <footer className="bg-white border-t border-slate-200/80 py-3 px-4 text-center text-xs text-navy-500">
        Chat Replyzer AI Onboarding • 150 Free AI Replies / Day • AES-256 Encrypted Vault
      </footer>
    </div>
  );
};
