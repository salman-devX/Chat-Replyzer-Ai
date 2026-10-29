import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  User,
  PhoneOff,
  Headphones,
  Pause,
  Play,
  FileText,
  Volume2,
  Mic,
  Activity,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  Flame
} from 'lucide-react';
import { liveCallTranscript } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export function LiveCall() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  // Call timer simulation
  const [seconds, setSeconds] = useState(84);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriptIndex, setTranscriptIndex] = useState(6);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState('ai'); // 'ai' or 'customer'

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Alternate speaking states every 4 seconds for realistic live animation
  useEffect(() => {
    if (isPaused) return;
    const speakerInterval = setInterval(() => {
      setActiveSpeaker((prev) => (prev === 'ai' ? 'customer' : 'ai'));
    }, 4500);
    return () => clearInterval(speakerInterval);
  }, [isPaused]);

  // Format seconds to mm:ss
  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const visibleTranscript = liveCallTranscript.slice(0, transcriptIndex);

  const handleNextMessage = () => {
    if (transcriptIndex < liveCallTranscript.length) {
      setTranscriptIndex((i) => i + 1);
    }
  };

  const handleEndCall = () => {
    showToast('Call ended. Generating AI conversation summary...');
    navigate(`/calls/${id || 'call-501'}/summary`);
  };

  const handleConfirmHandoff = () => {
    setIsHandoffModalOpen(false);
    showToast('Call transferred to Alex Rivera (Senior Rep). Audio stream bridged.');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/calls"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Call Center
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE AUDIO STREAM ACTIVE
          </span>
          <span className="font-mono text-sm font-bold text-white bg-navy-900 px-3 py-1 rounded-lg border border-navy-800">
            {formatDuration(seconds)}
          </span>
        </div>
      </div>

      {/* Main Two Column Live Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Side: Customer Profile & Real-time AI Intelligence (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Customer Snapshot */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">ABC Logistics</h3>
                  <p className="text-xs text-slate-400">Marcus Vance • Fleet Operations Director</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-xs border border-red-500/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> HOT
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-500">Fleet</span>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">42 Rigs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-500">Target</span>
                  <div className="font-bold text-blue-400 text-xs mt-0.5">ELD + Fuel</div>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-500">Score</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">82/100</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs border-t border-navy-800/80 pt-3 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Provider:</span>
                  <span className="text-amber-400 font-medium">Motive (KeepTruckin)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span>Dallas, TX (Midwest Corridor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">USDOT:</span>
                  <span className="font-mono text-slate-400">#3948191</span>
                </div>
              </div>
            </div>

            {/* Real-Time Telemetry & Objection Radar */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Live AI Speech Diagnostics
                </span>
                <span className="text-[10px] font-mono text-emerald-400">340ms latency</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Current Intent Detected:</span>
                <p className="text-white font-semibold mt-0.5">
                  Price Comparison & Contract Buyout Feasibility
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Active Objection Detected:
                </span>
                <div className="mt-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
                  &ldquo;45 days remaining on Motive contract; driver downtime fears&rdquo;
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Suggested Battle-Card:
                </span>
                <div className="mt-1 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 leading-relaxed">
                  Offer 45-day invoice buyout credit + 4-minute plug-and-play hot swap.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Stepper */}
          <div className="p-3 bg-navy-950/70 border border-navy-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">Interactive Demo:</span>
            <button
              onClick={handleNextMessage}
              disabled={transcriptIndex >= liveCallTranscript.length}
              className="px-3 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-blue-400 hover:text-white font-medium disabled:opacity-40"
            >
              Simulate Next Live Turn →
            </button>
          </div>
        </div>

        {/* Right Side: Live Conversation Stream (8 cols) */}
        <div className="lg:col-span-8 bg-navy-900 border border-navy-800 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden">
          {/* Audio Visualizer Header */}
          <div className="p-4 bg-navy-950/90 border-b border-navy-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                {activeSpeaker === 'ai' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-navy-950 animate-ping"></span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">TruckPilot Voice Agent v2.4</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    DeepVoice Neural
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Speaking Rate: 1.05x</span>
                  <span>•</span>
                  <span className="text-emerald-400">
                    {activeSpeaker === 'ai' ? '● AI Speaking' : '● Customer Speaking'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Wave Bars Animation */}
            <div className="flex items-center gap-1.5 h-7 px-3 bg-navy-900 rounded-xl border border-navy-800">
              <span className="voice-bar-1 w-1 bg-indigo-400 rounded-full"></span>
              <span className="voice-bar-2 w-1 bg-blue-400 rounded-full"></span>
              <span className="voice-bar-3 w-1 bg-indigo-300 rounded-full"></span>
              <span className="voice-bar-4 w-1 bg-sky-400 rounded-full"></span>
              <span className="voice-bar-5 w-1 bg-emerald-400 rounded-full"></span>
              <span className="text-[10px] font-mono text-slate-400 ml-2">Audio HD</span>
            </div>
          </div>

          {/* Transcript Message Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[460px]">
            {visibleTranscript.map((msg) => {
              const isAi = msg.speaker === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAi ? '' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-xs max-w-lg space-y-1 shadow-sm ${
                      isAi
                        ? 'bg-navy-950 border border-navy-800 text-slate-200'
                        : 'bg-blue-600/15 border border-blue-500/30 text-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className={`font-semibold ${isAi ? 'text-indigo-400' : 'text-blue-300'}`}>
                        {msg.speakerName}
                      </span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {!isAi && (
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Call Action Control Bar */}
          <div className="p-4 bg-navy-950/95 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700 text-slate-200 text-xs font-medium transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                {isPaused ? 'Resume AI Pitch' : 'Pause Audio'}
              </button>

              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700 text-slate-200 text-xs font-medium transition"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Add Live Note
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Prominent Human Handoff Button */}
              <button
                onClick={() => setIsHandoffModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm transition"
              >
                <Headphones className="w-4 h-4" />
                Transfer Call to Human
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                End Call & Summarize
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Human Handoff Confirmation Modal */}
      <Modal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        title="Escalate & Bridge Human Sales Rep"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            The AI agent will smoothly inform Marcus Vance that a senior fleet executive is stepping in, bridge your SIP line with zero audio drop, and pass the active context transcript.
          </p>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
            <span className="text-slate-400 text-[11px]">Pre-configured Verbal Bridge Script:</span>
            <p className="text-indigo-300 italic">
              &ldquo;Marcus, our Senior Freight Specialist Alex Rivera is right here in our Dallas operations center. Let me connect him directly into this call to lock in your contract buyout credit.&rdquo;
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsHandoffModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmHandoff}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
            >
              Bridge My Softphone Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Live Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Live Supervisor Note"
      >
        <div className="space-y-4 text-xs">
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type note for Alex Rivera or CRM record..."
            className="w-full p-3 bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast('Supervisor note pinned to call session');
                setIsNoteModalOpen(false);
                setNoteText('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Attach Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
