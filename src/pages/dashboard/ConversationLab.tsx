import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Copy,
  RotateCcw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ASSISTANT_MODES, SUPPORTED_PLATFORMS } from '@shared';
import { AssistantMode, PlatformId } from '../../types';

export const ConversationLab: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<AssistantMode>('personal');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('whatsapp');
  const [incomingMessage, setIncomingMessage] = useState('Bhai kal sham ko meeting rakh lein ya scene off hai?');
  const [styleMode, setStyleMode] = useState<'casual' | 'professional' | 'friendly' | 'concise'>('casual');
  const [simulatedResults, setSimulatedResults] = useState<{
    reply: string;
    reasoning: string;
    safetyScore: number;
    safetyStatus: 'passed' | 'paused_financial' | 'paused_threat';
    detectedIntent: string;
    language: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      // Check for safety keywords
      const lower = incomingMessage.toLowerCase();
      let status: 'passed' | 'paused_financial' | 'paused_threat' = 'passed';
      let reasoning = "Standard conversational prompt. No high-risk triggers detected.";

      if (lower.includes('easypaisa') || lower.includes('jazzcash') || lower.includes('transfer') || lower.includes('pese bhejo') || lower.includes('bank')) {
        status = 'paused_financial';
        reasoning = "SAFETY INTERCEPTION: Detected financial transfer request. Smart Pause halted automatic reply and triggered human takeover notification.";
      } else if (lower.includes('police') || lower.includes('threat') || lower.includes('court') || lower.includes('lawyer')) {
        status = 'paused_threat';
        reasoning = "SAFETY INTERCEPTION: Detected legal/threat keywords. Automated messaging suspended.";
      }

      let generatedReply = "";
      if (status !== 'passed') {
        generatedReply = "[SYSTEM PAUSED] Automated reply prevented by safety policy. Notification dispatched to account owner for manual response.";
      } else {
        if (styleMode === 'casual') {
          generatedReply = "Assalam o Alaikum! Haan bilkul sham ko scene on hai bhai! 6 baje chai par milte hain? ☕";
        } else if (styleMode === 'professional') {
          generatedReply = "Hello! Yes, tomorrow evening works well for our meeting. Shall we schedule it for 6:00 PM via Google Meet?";
        } else if (styleMode === 'friendly') {
          generatedReply = "Hey! Absolutely, I'd love to connect tomorrow evening! Let me know what time suits you best. 😊";
        } else {
          generatedReply = "Confirmed for tomorrow evening at 6:00 PM. See you then!";
        }
      }

      setSimulatedResults({
        reply: generatedReply,
        reasoning,
        safetyScore: status === 'passed' ? 99 : 24,
        safetyStatus: status,
        detectedIntent: "Meeting Coordination / Schedule Confirmation",
        language: "Roman Urdu + English"
      });
      setIsRunning(false);
    }, 550);
  };

  const copyReply = () => {
    if (simulatedResults?.reply) {
      navigator.clipboard.writeText(simulatedResults.reply);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200/80">
              Interactive AI Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
            Conversation Lab
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Simulate incoming prompts, compare 4 reply styles, and inspect safety rule guardrails without sending real messages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Offline Testing Sandbox (Safe Mode)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Parameters (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
            <h2 className="text-base font-bold text-navy-950">Test Configuration</h2>

            {/* Mode & Platform selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Conversational Role</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as AssistantMode)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 font-medium"
                >
                  {ASSISTANT_MODES.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Target Platform Channel</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as PlatformId)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 font-medium"
                >
                  {SUPPORTED_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style mode comparison tabs */}
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">Reply Style Variant</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'casual', label: 'Casual & Banter' },
                  { id: 'friendly', label: 'Friendly & Warm' },
                  { id: 'professional', label: 'Professional' },
                  { id: 'concise', label: 'Ultra Concise' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleMode(s.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      styleMode === s.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                        : 'border-slate-200 hover:bg-slate-50 text-navy-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-navy-800">Sample Incoming Message</label>
                <span className="text-[11px] text-navy-500">Supports Roman Urdu, Urdu & English</span>
              </div>
              <textarea
                rows={4}
                value={incomingMessage}
                onChange={(e) => setIncomingMessage(e.target.value)}
                placeholder="Type any test phrase (e.g. 'Bhai kal meeting ka kya scene hai?' or 'Can I get a refund?')..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-navy-500 text-[11px] font-semibold">Try sample triggers:</span>
              <button
                type="button"
                onClick={() => setIncomingMessage("Bhai kal dinner ka scene on hai ya off?")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-700 text-[11px]"
              >
                Roman Urdu Banter
              </button>
              <button
                type="button"
                onClick={() => setIncomingMessage("Can you send your product pricing and weekend SLA?")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-700 text-[11px]"
              >
                Business Pricing
              </button>
              <button
                type="button"
                onClick={() => setIncomingMessage("Bhai 50,000 rupay Easypaisa kardo emergency hai!")}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] border border-rose-200"
              >
                Financial Trigger (Test Smart Pause)
              </button>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isRunning || !incomingMessage}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              {isRunning ? 'Analyzing Nuance & Safety Rules...' : 'Execute Lab Simulation'}
            </button>
          </div>
        </div>

        {/* Results & Safety Inspection Column (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-navy-950">Simulation Results</h3>
            {simulatedResults && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                simulatedResults.safetyStatus === 'passed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {simulatedResults.safetyStatus === 'passed' ? 'Safety Passed' : 'Smart Pause Triggered'}
              </span>
            )}
          </div>

          {simulatedResults ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block mb-1">
                  Proposed Output
                </span>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                  simulatedResults.safetyStatus === 'passed'
                    ? 'bg-brand-50/50 border-brand-200 text-navy-900'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <p>{simulatedResults.reply}</p>
                </div>
              </div>

              {simulatedResults.safetyStatus === 'passed' && (
                <button
                  onClick={copyReply}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copyFeedback ? 'Copied to Clipboard!' : 'Copy Reply Text'}
                </button>
              )}

              {/* Safety inspection box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-navy-900 block text-[11px]">Safety & Reason Inspector:</span>
                <p className="text-navy-600 leading-relaxed text-[11px]">{simulatedResults.reasoning}</p>

                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-navy-500">Detected Language:</span>
                    <span className="font-semibold text-navy-900">{simulatedResults.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500">Confidence Score:</span>
                    <span className="font-semibold text-emerald-600">{simulatedResults.safetyScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-navy-400 space-y-2">
              <FlaskConical className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Click "Execute Lab Simulation" to preview how your assistant responds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
