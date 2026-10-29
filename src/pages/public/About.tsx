import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { ShieldCheck, Sparkles, Globe, Heart, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Our Story & Vision
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          One AI. Every Conversation.
        </h1>
        <p className="text-base sm:text-lg text-navy-600 leading-relaxed">
          Chat Replyzer AI was created to solve a fundamental disconnect in modern communication: artificial intelligence was either too robotic, too complicated for individuals, or built with dangerous unauthorized scraping tools that risk account bans.
        </p>
      </div>

      {/* Core Principles */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">Cultural & Language Nuance</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              Real conversations aren't sterile corporate memos. We pioneered true Roman Urdu, South Asian colloquialisms, and customizable humor so your replies sound like <em>you</em>, not an automated chatbot.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">100% Official Authorization</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              We reject shady QR scraping and password-sniffing scripts. We operate exclusively through official Meta Graph and TikTok Business APIs, protecting your account standing and user safety.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">Ethical & Transparent AI</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              We never train public models on your private DMs. If a financial transfer, dispute, or threat is detected, our Smart Pause halts automation and requests your manual human takeover immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Commitment to Free Access */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-50/70 border border-brand-200 rounded-3xl p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-brand-600" />
            <h3 className="text-xl font-bold text-navy-950">Our 150 Daily Free Replies Commitment</h3>
          </div>
          <p className="text-sm text-navy-700 leading-relaxed">
            We believe that basic conversational automation shouldn't be locked behind expensive corporate paywalls. That's why every single user receives <strong>150 free replies every day</strong> across all 5 assistant modes forever.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Join Chat Replyzer AI Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
