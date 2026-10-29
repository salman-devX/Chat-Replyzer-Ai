import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { ASSISTANT_MODES } from '@shared';
import { AssistantProfile, AssistantMode, LanguagePreference, EmojiFrequency, ReplyLength } from '../../types';

export const PersonalityStudio: React.FC = () => {
  const [profile, setProfile] = useState<AssistantProfile>({
    name: 'Aria',
    mode: 'personal',
    platforms: ['whatsapp', 'instagram'],
    language: 'roman_urdu',
    formality: 20,
    humor: 80,
    emojiFrequency: 'moderate',
    replyLength: 'balanced',
    warmth: 85,
    sampleGreeting: 'Assalam o Alaikum! Kese ho bhai?',
    sampleSignoff: 'Chalo milte hain phir!',
    phrasesToUse: ['Scene on hai', 'Zabardast', 'Koi masla nahi'],
    phrasesToAvoid: ['I am an AI bot', 'System error', 'Please hold'],
    sensitiveTopicsPolicy: {
      pauseOnFinancial: true,
      pauseOnThreats: true,
      pauseOnLegal: true,
      pauseOnEscalation: true,
      pauseOnUrgent: false,
    },
    quietHours: {
      enabled: true,
      start: '23:00',
      end: '08:00',
      timezone: 'Asia/Karachi',
    },
    maxResponseFrequency: 10,
    humanTakeover: {
      enabled: true,
      notifyEmail: true,
      notifyInApp: true,
      disclosureNotice: false,
    },
    isPaused: false,
  });

  const [savedNotification, setSavedNotification] = useState(false);
  const [testPrompt, setTestPrompt] = useState('Bhai kal sham ko cricket match dekhne ka kya program hai?');
  const [previewReply, setPreviewReply] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const handleSave = () => {
    localStorage.setItem('chat_replyzer_active_profile', JSON.stringify(profile));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const generateLivePreview = () => {
    setIsGeneratingPreview(true);
    setTimeout(() => {
      let reply = "";
      if (profile.language === 'roman_urdu' || profile.language === 'mixed') {
        if (profile.humor > 60) {
          reply = `${profile.sampleGreeting} Cricket ka match aur mera inkar? Kabhi nahi! Scene 100% on hai, bas popcorn aur biryani tayar rakhna! 🏏🔥 ${profile.sampleSignoff}`;
        } else {
          reply = `${profile.sampleGreeting} Haan kal sham ka cricket match dekhne ka plan bilkul ready hai. 7 baje tak shuru karte hain.`;
        }
      } else {
        reply = `Hello! The cricket match plan is confirmed for tomorrow evening. Looking forward to watching together!`;
      }
      setPreviewReply(reply);
      setIsGeneratingPreview(false);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200/80">
              Voice & Tone Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
            AI Personality Studio
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Tune your assistant's humor, formality, Roman Urdu vocabulary, and smart pause guardrails.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Personality settings saved and synced across active platform integrations!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Mode */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-950">Identity & Conversational Mode</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Assistant Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Active Mode</label>
                <select
                  value={profile.mode}
                  onChange={(e) => setProfile({ ...profile, mode: e.target.value as AssistantMode })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {ASSISTANT_MODES.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">Language & Dialect</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'roman_urdu', label: 'Roman Urdu' },
                  { id: 'urdu', label: 'Urdu (اردو)' },
                  { id: 'en', label: 'English' },
                  { id: 'mixed', label: 'Mixed / Bilingual' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, language: lang.id as LanguagePreference })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      profile.language === lang.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                        : 'border-slate-200 hover:bg-slate-50 text-navy-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tone Sliders */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-5">
            <h2 className="text-base font-bold text-navy-950">Tone & Behavior Controls</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                  <span>Formality: {profile.formality}%</span>
                  <span className="text-navy-500">{profile.formality < 30 ? 'Casual & Colloquial' : profile.formality > 70 ? 'Corporate & Formal' : 'Balanced'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.formality}
                  onChange={(e) => setProfile({ ...profile, formality: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                  <span>Humor & Wit: {profile.humor}%</span>
                  <span className="text-navy-500">{profile.humor > 60 ? 'Banter & Playful' : 'Serious & Direct'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.humor}
                  onChange={(e) => setProfile({ ...profile, humor: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                  <span>Warmth & Friendliness: {profile.warmth}%</span>
                  <span className="text-navy-500">{profile.warmth > 70 ? 'High Warmth' : 'Moderate'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.warmth}
                  onChange={(e) => setProfile({ ...profile, warmth: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Emoji Frequency</label>
                <select
                  value={profile.emojiFrequency}
                  onChange={(e) => setProfile({ ...profile, emojiFrequency: e.target.value as EmojiFrequency })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none"
                >
                  <option value="none">No Emojis</option>
                  <option value="low">Low (1 per reply)</option>
                  <option value="moderate">Moderate (Natural flow)</option>
                  <option value="high">High (Expressive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Reply Length</label>
                <select
                  value={profile.replyLength}
                  onChange={(e) => setProfile({ ...profile, replyLength: e.target.value as ReplyLength })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none"
                >
                  <option value="concise">Concise (1-2 sentences)</option>
                  <option value="balanced">Balanced (2-3 sentences)</option>
                  <option value="detailed">Detailed (In-depth explanations)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Phrases to Use & Avoid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-950">Vocabulary Customization</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Preferred Greeting</label>
                <input
                  type="text"
                  value={profile.sampleGreeting}
                  onChange={(e) => setProfile({ ...profile, sampleGreeting: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Preferred Sign-Off</label>
                <input
                  type="text"
                  value={profile.sampleSignoff}
                  onChange={(e) => setProfile({ ...profile, sampleSignoff: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Phrases to Use (Comma separated)
              </label>
              <input
                type="text"
                value={profile.phrasesToUse.join(', ')}
                onChange={(e) => setProfile({ ...profile, phrasesToUse: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Phrases to Avoid (Comma separated)
              </label>
              <input
                type="text"
                value={profile.phrasesToAvoid.join(', ')}
                onChange={(e) => setProfile({ ...profile, phrasesToAvoid: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900"
              />
            </div>
          </div>

          {/* Smart Pause & Safety Rules */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-950">Safety Guardrails & Smart Pause</h2>

            <div className="space-y-3">
              {[
                { key: 'pauseOnFinancial', label: 'Halt on Financial Transfers, Easypaisa, or Bank Demands' },
                { key: 'pauseOnThreats', label: 'Halt on Threats, Abuse, or Intense Arguments' },
                { key: 'pauseOnLegal', label: 'Halt on Legal Questions or Compliance Claims' },
                { key: 'pauseOnEscalation', label: 'Halt when Contact Requests Human Agent ("talk to human")' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(profile.sensitiveTopicsPolicy as any)[item.key]}
                    onChange={(e) => setProfile({
                      ...profile,
                      sensitiveTopicsPolicy: {
                        ...profile.sensitiveTopicsPolicy,
                        [item.key]: e.target.checked
                      }
                    })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-xs font-medium text-navy-800">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Column (1 Col Sticky) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-navy-950">Live Preview Canvas</h3>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Simulation Only
            </span>
          </div>

          <p className="text-xs text-navy-500">
            Test how your changes affect replies without contacting anyone:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-navy-700 mb-1">Incoming Test Prompt</label>
              <textarea
                rows={3}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none"
              />
            </div>

            <button
              onClick={generateLivePreview}
              disabled={isGeneratingPreview || !testPrompt}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingPreview ? 'Evaluating Style...' : 'Preview AI Reply'}
            </button>

            {previewReply && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-2">
                <span className="text-[10px] font-bold text-brand-700 uppercase">Simulated AI Response:</span>
                <p className="text-xs text-navy-800 leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-200 shadow-subtle">
                  {previewReply}
                </p>
                <div className="flex items-center justify-between text-[10px] text-navy-500 pt-1">
                  <span>Language: {profile.language}</span>
                  <span className="text-emerald-600 font-semibold">Zero messages sent</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
