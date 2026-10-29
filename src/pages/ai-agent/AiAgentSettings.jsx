import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Volume2,
  Sliders,
  ShieldCheck,
  Headphones,
  PhoneCall,
  Save,
  CheckCircle2,
  Power,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AiAgentSettings() {
  const { aiStatus, toggleAiAgent, showToast } = useApp();

  const [agentName, setAgentName] = useState('TruckPilot Voice Agent v2.4');
  const [selectedVoice, setSelectedVoice] = useState('Alloy (Direct & Confident)');
  const [tone, setTone] = useState('Consultative');
  const [responseLength, setResponseLength] = useState('Concise (15-25 words)');
  const [qualificationStyle, setQualificationStyle] = useState('Pain-Point First');
  const [maxCallDuration, setMaxCallDuration] = useState(8); // mins
  const [maxRetries, setMaxRetries] = useState(3);
  const [businessHours, setBusinessHours] = useState('08:00 AM - 06:00 PM CST');

  // Guardrail Rules Toggles
  const [rules, setRules] = useState({
    neverInventPricing: true,
    useApprovedOnly: true,
    escalateUncertain: true,
    transferOnHumanRequest: true,
    respectOptOut: true,
  });

  // Handoff Trigger Toggles
  const [handoffs, setHandoffs] = useState({
    customerRequestsHuman: true,
    pricingException: true,
    legalContractQuestion: true,
    customerComplaint: true,
    sensitiveIssue: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('AI Voice Agent parameters successfully deployed!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Master Toggle */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-glow-ai">
            <Bot className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                AI Sales Agent Configuration
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${
                aiStatus.online
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${aiStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                {aiStatus.online ? 'Active & Calling' : 'Suspended / Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fine-tune voice persona, conversation guidelines, safety guardrails, and human escalation rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAiAgent}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              aiStatus.online
                ? 'bg-rose-600/15 border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white'
                : 'bg-emerald-600/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {aiStatus.online ? 'Pause Agent Outreach' : 'Resume Agent Outreach'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Agent Identity */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Agent Identity & Neural Voice Model
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Agent Prompt Identifier</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Voice Profile (Ultra-Low Latency TTS)</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
                <option value="Alloy (Direct & Confident)">Alloy (Direct & Confident - Recommended for Logistics)</option>
                <option value="Nova (Energetic & Engaging)">Nova (Energetic & Engaging)</option>
                <option value="Echo (Authoritative & Steady)">Echo (Authoritative & Steady)</option>
                <option value="Onyx (Deep & Professional)">Onyx (Deep & Professional)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Standard Introduction Prompt</label>
            <div className="p-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-300 font-mono text-[11px] leading-relaxed">
              &ldquo;Hi {'{Contact_First_Name}'}, this is Jordan calling from TruckPilot Logistics Intelligence. I noticed {'{Carrier_Name}'} recently added trucks along the {'{Primary_Corridor}'}. How is your current ELD and telematics setup handling that extra capacity?&rdquo;
            </div>
          </div>
        </div>

        {/* Section 2: Sales Behavior & Personality */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Sales Persona & Conversational Cadence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Conversational Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
                <option value="Consultative">Consultative (Peer-to-peer fleet advisor)</option>
                <option value="Assertive">Assertive (High-velocity closing focus)</option>
                <option value="Friendly">Friendly & Informative (Warm outreach)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Response Length Limit</label>
              <select
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
                <option value="Concise (15-25 words)">Concise (15-25 words - Keeps dialogue fast)</option>
                <option value="Detailed (30-50 words)">Detailed (30-50 words - Elaborates specs)</option>
                <option value="Micro-turns (under 15 words)">Micro-turns (Under 15 words - High ping-pong)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Qualification Framework</label>
              <select
                value={qualificationStyle}
                onChange={(e) => setQualificationStyle(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
                <option value="Pain-Point First">Pain-Point First (Fuel Margins & Software Costs)</option>
                <option value="Compliance Audit First">Compliance Audit First (FMCSA & DOT score)</option>
                <option value="Contract Expiration">Contract Expiration (Identify renewal window)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Safety Guardrail Rules */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety & Operational Rules (Hard Guardrails)
            </h3>
            <span className="text-[11px] text-slate-400">Strictly enforced at inference time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'neverInventPricing', label: 'Never invent pricing discounts', desc: 'Agent must quote only authorized wholesale matrix figures from knowledge base.' },
              { key: 'useApprovedOnly', label: 'Use only approved company information', desc: 'Restricts responses to verified FMCSA regulatory specifications.' },
              { key: 'escalateUncertain', label: 'Escalate uncertain requests', desc: 'Triggers supervisor transfer if customer question confidence drops below 85%.' },
              { key: 'transferOnHumanRequest', label: 'Transfer when human is requested', desc: 'Immediately bridges softphone when customer says "representative" or "human".' },
              { key: 'respectOptOut', label: 'Respect opt-out and DNC requests', desc: 'Adds carrier USDOT to suppression list upon request without pushback.' },
            ].map((r) => (
              <div
                key={r.key}
                onClick={() => setRules({ ...rules, [r.key]: !rules[r.key] })}
                className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex items-start justify-between cursor-pointer hover:border-navy-700 transition"
              >
                <div className="pr-3">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    {rules[r.key] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {r.label}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rules[r.key]}
                  onChange={() => {}} // handled by parent div
                  className="mt-1 rounded bg-navy-900 border-navy-700 text-blue-600 focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Human Handoff Rules */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Headphones className="w-4 h-4 text-purple-400" />
            Automatic Human Rep Handoff Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'customerRequestsHuman', title: 'Verbal Rep Request', sub: 'Detected "human", "real person", "agent"' },
              { key: 'pricingException', title: 'Pricing Exception', sub: 'Discount requested > $25/truck limit' },
              { key: 'legalContractQuestion', title: 'Contract / Legal Review', sub: 'Indemnification, liquidated damages terms' },
              { key: 'customerComplaint', title: 'Active Dissatisfaction', sub: 'High frustration sentiment score' },
              { key: 'sensitiveIssue', title: 'Multi-Terminal RFP', sub: 'Fleets exceeding 100 power units' },
            ].map((h) => (
              <div
                key={h.key}
                onClick={() => setHandoffs({ ...handoffs, [h.key]: !handoffs[h.key] })}
                className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex items-center justify-between cursor-pointer hover:border-navy-700 transition"
              >
                <div>
                  <div className="font-semibold text-white">{h.title}</div>
                  <div className="text-[10px] text-slate-400">{h.sub}</div>
                </div>
                <input
                  type="checkbox"
                  checked={handoffs[h.key]}
                  onChange={() => {}}
                  className="rounded bg-navy-900 border-navy-700 text-purple-600 focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Telephony & Call Settings */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-400" />
            Telephony SIP Trunk & Timing Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Call Duration: {maxCallDuration} Minutes</label>
              <input
                type="range"
                min="3"
                max="15"
                value={maxCallDuration}
                onChange={(e) => setMaxCallDuration(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-500">Auto-wrap up after threshold</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Retry Attempts on No-Answer</label>
              <select
                value={maxRetries}
                onChange={(e) => setMaxRetries(Number(e.target.value))}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
                <option value={1}>1 Attempt</option>
                <option value={2}>2 Attempts (spaced 24h)</option>
                <option value={3}>3 Attempts (standard cadence)</option>
                <option value={4}>4 Attempts (aggressive)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Calling Window (Carrier Timezone)</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              >
              </input>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Deploy Tuning to Live Cluster
          </button>
        </div>
      </form>
    </div>
  );
}
