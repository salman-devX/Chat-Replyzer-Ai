import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Sliders,
  Clock,
  Layers,
  Lock,
  ArrowRight,
  Cpu,
  UserCheck
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Globe2,
      title: "Multi-Platform Harmonization",
      description: "Manage WhatsApp Cloud API, Instagram Direct, Facebook Messenger, and TikTok from a single synchronized control center without switching apps.",
      tag: "Connectivity"
    },
    {
      icon: Sparkles,
      title: "Roman Urdu, Urdu & Colloquial Slang",
      description: "Understands and responds in natural Roman Urdu (e.g., 'Kese ho bhai? Sab theek?'), classic Urdu script, or fluent English with natural cultural nuance.",
      tag: "Language"
    },
    {
      icon: Sliders,
      title: "AI Personality Studio",
      description: "Fine-tune 5 dimensions: Formality (0-100), Humor (0-100), Warmth, Emoji Density, and Reply Length. Add sample phrases to use and words to avoid.",
      tag: "Customization"
    },
    {
      icon: UserCheck,
      title: "Smart Pause & Human Takeover",
      description: "Detects sensitive topics like financial transfers, legal threats, and customer complaints, instantly halting automated replies to request manual intervention.",
      tag: "Safeguards"
    },
    {
      icon: Clock,
      title: "Quiet Hours & Frequency Capping",
      description: "Establish automated active hours based on your timezone. Set limits on how many replies an individual contact can trigger per hour.",
      tag: "Automation"
    },
    {
      icon: Zap,
      title: "150 Free Replies Daily Allowance",
      description: "Enjoy 150 free AI-generated outgoing replies every day with atomic counter resets. No sudden bill spikes or hidden fees.",
      tag: "Quota Guarantee"
    },
    {
      icon: Cpu,
      title: "Gemini AI Provider Abstraction",
      description: "Architected behind a modular AI interface powered by Google Gemini, ensuring low latency, high context awareness, and safety filtering.",
      tag: "AI Architecture"
    },
    {
      icon: Lock,
      title: "AES-256 Token Encryption at Rest",
      description: "Official provider credentials and refresh tokens are encrypted at rest with military-grade AES-256-GCM. Frontend clients never access raw tokens.",
      tag: "Security"
    },
    {
      icon: Layers,
      title: "Interactive Conversation Lab",
      description: "Test simulated incoming prompts against your configured personality directly in your browser without sending real messages to contacts.",
      tag: "Testing Playground"
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Core Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          Everything You Need for Intelligent Messaging
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          Explore how Chat Replyzer AI combines official platform APIs, Roman Urdu intelligence, and strict security controls.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/80">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-brand-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-950">{item.title}</h3>
                  <p className="text-xs text-navy-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="bg-brand-50 border border-brand-200 rounded-3xl p-8 sm:p-10 space-y-4">
          <h2 className="text-2xl font-bold text-navy-950">Test Chat Replyzer AI in Action</h2>
          <p className="text-sm text-navy-600 max-w-xl mx-auto">
            Create your account today and configure your first assistant in under 5 minutes with 150 free replies.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
