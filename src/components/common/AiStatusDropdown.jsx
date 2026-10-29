import React, { useState, useRef, useEffect } from 'react';
import { Bot, Activity, PhoneCall, CheckCircle2, Zap, Power, ShieldCheck, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AiStatusDropdown() {
  const { aiStatus, toggleAiAgent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700/80 hover:border-blue-500/50 transition text-xs font-medium text-slate-200 shadow-sm"
      >
        <span className="relative flex h-2 w-2">
          {aiStatus.online && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${aiStatus.online ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
        </span>
        <span className="font-semibold text-white tracking-wide">
          {aiStatus.online ? 'AI Agent Online' : 'AI Agent Paused'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Status Panel Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">{aiStatus.name}</h4>
                <p className="text-[10px] text-slate-400">{aiStatus.model}</p>
              </div>
            </div>
            <button
              onClick={toggleAiAgent}
              className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                aiStatus.online
                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
              }`}
              title={aiStatus.online ? 'Pause Agent' : 'Resume Agent'}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-blue-400" /> Active Calls
              </span>
              <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                {aiStatus.online ? aiStatus.activeCalls : 0}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed Today
              </span>
              <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                {aiStatus.callsCompletedToday}
              </span>
            </div>
          </div>

          {/* System Status Details */}
          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Zap className="w-3 h-3 text-amber-400" /> Voice Latency
              </span>
              <span className="font-mono text-emerald-400 font-semibold">{aiStatus.latencyMs} ms</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> SIP Carrier Uptime
              </span>
              <span className="font-mono text-slate-200">{aiStatus.uptime}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Activity className="w-3 h-3 text-purple-400" /> Human Handoffs
              </span>
              <span className="font-mono text-slate-200">{aiStatus.handoffsToday} today</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-navy-800 flex justify-between items-center text-[10px]">
            <span className="text-emerald-400 font-medium">● Telephony Cluster Healthy</span>
            <span className="text-slate-500">v2.4.1</span>
          </div>
        </div>
      )}
    </div>
  );
}
