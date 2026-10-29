import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Globe2,
  Users,
  Briefcase,
  HelpCircle,
  Clock,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { ASSISTANT_MODES, SUPPORTED_PLATFORMS, DAILY_FREE_REPLY_LIMIT } from '@shared';

export const Home: React.FC = () => {
  const [selectedDemoMode, setSelectedDemoMode] = useState<'personal' | 'business' | 'creator' | 'sales'>('personal');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Live simulation message sets for demo
  const demoConversations = {
    personal: {
      incoming: "Kahan ho yar? Kal ka dinner plan scene on hai kya?",
      detectedLanguage: "Roman Urdu + English",
      aiReply: "Bas office se nikal raha hoon! Scene 100% on hai bhai, 8:30 PM tak pohanchta hoon. Table book karli?",
      modeBadge: "Friends & Personal",
      tone: "Casual & Witty (Humor 75%, Formality 10%)"
    },
    business: {
      incoming: "Hi, do you offer weekend onboarding support for your enterprise tier?",
      detectedLanguage: "English (Professional)",
      aiReply: "Hello! Yes, our Enterprise tier includes dedicated 24/7 technical onboarding and weekend Slack channel support. Would you like me to share our technical SLA sheet?",
      modeBadge: "Business & Support",
      tone: "Professional & Helpful (Warmth 90%, Formality 85%)"
    },
    creator: {
      incoming: "Hey! We'd love to sponsor your next tech review video. Can we get your rate card?",
      detectedLanguage: "English (Inquiry)",
      aiReply: "Hey there! Thanks so much for reaching out. Please email your campaign brief and timeline to collabs@creator.com and my team will send over our Q4 media kit within 24 hours!",
      modeBadge: "Creator & Influencer",
      tone: "Warm & Filtered (Screening sponsorship leads)"
    },
    sales: {
      incoming: "What is the difference between your 150 daily free plan and the Growth plan?",
      detectedLanguage: "English (Commercial)",
      aiReply: "Great question! The Free tier includes 150 AI replies daily across all 5 modes. The Growth plan expands this to 5,000 monthly replies, team seats, and custom CRM webhooks. Would you like a 14-day trial?",
      modeBadge: "Sales Assistant",
      tone: "High Conversion (Qualification intent)"
    }
  };

  const currentDemo = demoConversations[selectedDemoMode];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 overflow-hidden">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/50 via-sky-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-navy-800 text-xs sm:text-sm font-medium shadow-subtle hover:border-brand-300 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="font-semibold text-brand-600">New:</span> Roman Urdu, Urdu & English Nuanced Messaging
              <ArrowRight className="w-3.5 h-3.5 text-navy-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
              One AI.{' '}
              <span className="gradient-text-brand">
                Every Conversation.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-navy-600 max-w-2xl mx-auto leading-relaxed">
              Orchestrate genuine, personality-tailored AI replies across WhatsApp, Instagram, Messenger, and TikTok. 
              Equipped with smart quiet hours, Roman Urdu support, human takeover, and <strong>150 free replies every day</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Free — 150 Daily Replies
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-navy-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all hover:border-slate-300"
              >
                <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
                See How It Works
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-navy-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Official Developer APIs Only
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-navy-700" />
                AES-256 Token Encryption
              </span>
            </div>
          </div>

          {/* 2. ANIMATED ILLUSTRATIVE DASHBOARD PREVIEW */}
          <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-elevated p-3 sm:p-5">
              {/* Fake Browser / App Chrome */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80"></span>
                  <span className="ml-3 text-xs font-semibold text-navy-600">
                    Chat Replyzer AI Studio — Active Simulation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Remaining Today: 142 / 150
                  </span>
                </div>
              </div>

              {/* Interactive Demo Mode Selector */}
              <div className="flex flex-wrap gap-2 pt-4 pb-4 px-2">
                {(['personal', 'business', 'creator', 'sales'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedDemoMode(mode)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedDemoMode === mode
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                        : 'bg-slate-100 text-navy-700 hover:bg-slate-200/70'
                    }`}
                  >
                    {mode === 'personal' && '🎉 Friends & Personal (Roman Urdu)'}
                    {mode === 'business' && '💼 Business & Customer Support'}
                    {mode === 'creator' && '✨ Creator & Collab Screening'}
                    {mode === 'sales' && '📈 Sales & Lead Assistant'}
                  </button>
                ))}
              </div>

              {/* Chat Canvas Simulation */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 sm:p-8 space-y-6">
                {/* Meta info bar */}
                <div className="flex flex-wrap items-center justify-between text-xs text-navy-600 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy-900">Current Persona:</span>
                    <span className="bg-white px-2.5 py-0.5 rounded-md border border-slate-200 font-medium text-brand-700">
                      {currentDemo.modeBadge}
                    </span>
                  </div>
                  <div>
                    <span className="text-navy-500">Tone Configuration: </span>
                    <span className="font-medium text-navy-800">{currentDemo.tone}</span>
                  </div>
                </div>

                {/* Incoming Message Bubble */}
                <div className="flex items-start gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-navy-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    Contact
                  </div>
                  <div className="space-y-1">
                    <div className="bg-white border border-slate-200/90 text-navy-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-subtle leading-relaxed">
                      {currentDemo.incoming}
                    </div>
                    <span className="text-[11px] text-navy-500 pl-1">
                      Detected: {currentDemo.detectedLanguage} • WhatsApp Cloud API Inbound
                    </span>
                  </div>
                </div>

                {/* AI Reasoning Pill */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                    AI evaluated safety rules: No financial threat detected. Match confidence 98.4%.
                  </div>
                </div>

                {/* Outgoing AI Reply Bubble */}
                <div className="flex items-start gap-3 max-w-xl ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-cyan text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                    AI
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="bg-gradient-to-tr from-brand-600 to-brand-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm shadow-md shadow-brand-500/15 leading-relaxed text-left">
                      {currentDemo.aiReply}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[11px] text-navy-500 pr-1">
                      <span>Automated Reply Sent</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium">Quota: -1 (141 left today)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PLATFORM INTEGRATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Official Developer Integrations
          </h2>
          <h3 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Connected via Authorized APIs Only
          </h3>
          <p className="text-navy-600 text-base leading-relaxed">
            We never request your social passwords or scrape accounts. Every connection follows official Meta Graph and TikTok Business developer protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900 font-bold text-lg border border-slate-200">
                    {platform.id === 'whatsapp' && '💬'}
                    {platform.id === 'instagram' && '📸'}
                    {platform.id === 'messenger' && '⚡'}
                    {platform.id === 'tiktok' && '🎵'}
                  </div>
                  {platform.status === 'connected' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Supported
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Requires Approval
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-navy-950">{platform.name}</h4>
                  <p className="text-xs font-medium text-brand-600 mt-0.5">{platform.tagline}</p>
                </div>

                <div className="space-y-2 text-xs text-navy-600">
                  <div>
                    <span className="font-semibold text-navy-800">Account Type:</span>{' '}
                    <span>{platform.accountRequirement}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-navy-800">Permissions:</span>
                    <ul className="list-disc list-inside text-navy-500 mt-1 font-mono text-[11px] space-y-0.5">
                      {platform.permissions.map((perm) => (
                        <li key={perm}>{perm}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <Link
                  to={`/integrations#${platform.id}`}
                  className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  Setup Guide
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-navy-400">Official API v21.0</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FIVE USER ROLES / ASSISTANT MODES */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Versatile Intelligence
            </h2>
            <h3 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Five Tailored Modes for Every Context
            </h3>
            <p className="text-navy-600 text-base">
              A single engine with specialized tone rules, language capabilities, and safeguard guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ASSISTANT_MODES.map((mode) => (
              <div
                key={mode.id}
                className="rounded-2xl border border-slate-200/90 p-6 bg-slate-50/60 hover:bg-white hover:shadow-card transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-slate-200 text-brand-700">
                    {mode.badge}
                  </span>
                  <Sliders className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy-950">{mode.name}</h4>
                  <p className="text-xs text-brand-600 font-medium mt-0.5">{mode.tagline}</p>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {mode.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/use-cases#${mode.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View Role Features & Presets
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Persona Studio Teaser Box */}
            <div className="rounded-2xl border-2 border-dashed border-brand-300 p-6 bg-brand-50/40 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-navy-950">AI Personality Studio</h4>
                <p className="text-sm text-navy-600 leading-relaxed">
                  Adjust Formality, Humor, Slang, Emoji Density, and Roman Urdu dialect nuances with interactive live preview.
                </p>
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
              >
                Open Studio in Sandbox
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DAILY FREE REPLIES & QUOTA TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-navy-900 text-white p-8 sm:p-12 lg:p-16 shadow-elevated relative overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-700/60 text-xs font-semibold text-brand-200">
                <Zap className="w-3.5 h-3.5 text-accent-cyan" />
                Server-Enforced Quota Guarantee
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                150 Free AI Replies.{' '}
                <span className="text-accent-cyan">Every Single Day.</span>
              </h2>
              <p className="text-brand-100 text-base leading-relaxed">
                We believe you shouldn't have to enter a credit card just to automate conversations with friends, handle social DMs, or test business automation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Resets automatically at 00:00 UTC every day</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Only successfully accepted replies deduct quota</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Incoming webhooks are 100% free forever</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Safe pause when limit reached (no surprise fees)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-white hover:bg-brand-50 transition-colors shadow-sm"
                >
                  Claim 150 Free Replies Daily
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quota Counter Card Visual */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-brand-200">Daily Allowance Meter</p>
                  <p className="text-2xl font-bold text-white mt-1">150 / 150 Available</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent-cyan font-bold">
                  24h
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div className="bg-accent-cyan h-full rounded-full w-full"></div>
                </div>
                <div className="flex justify-between text-xs text-brand-200">
                  <span>0 Used Today</span>
                  <span>150 Remaining</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-brand-200 space-y-2">
                <p className="font-semibold text-white">How Atomic Counters Protect You:</p>
                <p className="leading-relaxed">
                  Our MongoDB engine uses atomic operations to guarantee parallel messages cannot overcharge your allowance, and webhook retry deduplication prevents duplicate replies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & PRIVACY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Privacy & Trust Architecture
          </h2>
          <h3 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Security Built Into the Code, Not Just a Badge
          </h3>
          <p className="text-navy-600 text-base">
            Your conversations and credentials are safeguarded by cryptographic token vaults and official platform compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-navy-950">AES-256 Token Encryption</h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Provider access tokens are encrypted at rest with AES-256-GCM. Tokens are never transmitted to frontend clients or stored in logs.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-navy-950">No Private Training on DMs</h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              We never train public AI models on your private messages. Data retention is strictly configurable by you and deletable at any time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-navy-950">Smart Human Takeover</h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Immediate auto-pause triggered if financial demands, legal threats, or heated arguments occur. You stay in control with 1-click takeover.
            </p>
          </div>
        </div>
      </section>

      {/* 7. PRICING PREVIEW */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Simple, Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Start Free, Scale as Your Business Grows
            </h3>
            <p className="text-navy-600 text-base">
              No hidden contracts. All five assistant modes are unlocked on the free tier.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/70 px-3 py-1 rounded-full">
                  Personal Free
                </span>
                <div>
                  <span className="text-4xl font-extrabold text-navy-950">$0</span>
                  <span className="text-navy-500 text-sm"> / forever</span>
                </div>
                <p className="text-xs text-navy-600">
                  Ideal for personal chats, friends banter, creators starting out, and community groups.
                </p>

                <ul className="space-y-2.5 text-xs text-navy-700 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <strong>150 AI-generated replies per day</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    All 5 assistant modes included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Roman Urdu & English translation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    WhatsApp, Instagram & Messenger
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Smart Pause & Human Takeover
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-semibold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 shadow-sm transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Growth Tier (Highlighted) */}
            <div className="rounded-3xl border-2 border-brand-500 bg-white p-8 shadow-card flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular for Businesses
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                  Business Growth
                </span>
                <div>
                  <span className="text-4xl font-extrabold text-navy-950">$29</span>
                  <span className="text-navy-500 text-sm"> / month</span>
                </div>
                <p className="text-xs text-navy-600">
                  Designed for active stores, support desks, and creators with high direct message volume.
                </p>

                <ul className="space-y-2.5 text-xs text-navy-700 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600" />
                    <strong>5,000 AI replies per month</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600" />
                    Custom Business Knowledge Base (PDFs & FAQs)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600" />
                    3 Team seats with role permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600" />
                    Webhook triggers for external CRMs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600" />
                    Priority Meta API token handling
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-700 bg-slate-200 px-3 py-1 rounded-full">
                  Enterprise
                </span>
                <div>
                  <span className="text-4xl font-extrabold text-navy-950">$99</span>
                  <span className="text-navy-500 text-sm"> / month</span>
                </div>
                <p className="text-xs text-navy-600">
                  For large call centers, support agencies, and multi-brand platforms requiring custom SLA.
                </p>

                <ul className="space-y-2.5 text-xs text-navy-700 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-800" />
                    <strong>25,000+ AI replies per month</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-800" />
                    Dedicated WhatsApp Phone Coexistence Support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-800" />
                    Unlimited Team Seats
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-800" />
                    Custom Data Retention & GDPR Scrubbing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-800" />
                    Dedicated Account Engineer
                  </li>
                </ul>
              </div>

              <Link
                to="/contact"
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-semibold text-navy-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">Got Questions?</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Does Chat Replyzer AI require my Instagram or WhatsApp password?",
              a: "Never. Chat Replyzer AI operates strictly via official Meta Developer Cloud APIs and OAuth permissions. You authorize your account through Meta's secure dialog, and we receive only an encrypted token for authorized messaging scopes."
            },
            {
              q: "How does the 150 daily free replies allowance work?",
              a: "Every user receives 150 free AI-generated outgoing replies every day. Inbound messages and safety checks do not count towards your quota. The quota resets atomically at 00:00 UTC."
            },
            {
              q: "How accurate is the Roman Urdu and Urdu understanding?",
              a: "Our Gemini-backed AI provider abstraction is tuned specifically for colloquial Roman Urdu, mixed Urdu/English, and South Asian slang nuances, ensuring authentic personal banter or respectful customer support."
            },
            {
              q: "What happens if a sensitive financial or legal message arrives?",
              a: "Chat Replyzer AI's Smart Pause instantly pauses automated replies for that specific conversation and immediately alerts you for manual human takeover, preventing incorrect or risky statements."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left font-bold text-navy-950 text-sm flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <span className="text-brand-600 text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <p className="mt-3 text-xs text-navy-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link to="/faq" className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline">
            View all frequently asked questions →
          </Link>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-50 border border-brand-200/80 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Ready to automate your conversations with real personality?
            </h2>
            <p className="text-sm text-navy-600">
              Join thousands of creators, businesses, and friends using Chat Replyzer AI. Set up in less than 5 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              Get Started with 150 Free Replies Daily
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-navy-800 bg-white hover:bg-slate-50 border border-slate-200"
            >
              Explore Full Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
