import React from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  Sliders,
  Webhook,
  ShieldAlert,
  Send,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  UserCheck
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Official Platform Authorization',
      badge: 'Zero Passwords Stored',
      icon: Link2,
      description: 'You connect your WhatsApp Business, Instagram Professional, Facebook Page, or TikTok Business account via official OAuth dialogs. We securely store encrypted OAuth tokens using AES-256-GCM. We never see or store your social account passwords.',
      details: [
        'Official Meta Graph API v21.0 & TikTok Business API',
        'Scoped permissions (least-privilege messaging access)',
        '1-click revocation and token deletion at any time'
      ]
    },
    {
      step: '02',
      title: 'Tune Personality & Language Nuance',
      badge: 'Roman Urdu & 5 Modes',
      icon: Sliders,
      description: 'Choose one of 5 modes (Personal, Support, Creator, Sales, Community). Set your Formality, Humor, Emoji density, and language preference (Roman Urdu, Urdu, English, or Mixed). Add custom greetings, phrases to use, and phrases to avoid.',
      details: [
        'Slider controls for tone, humor, and length',
        'Colloquial South Asian slang & dialect intelligence',
        'Knowledge base integration for business FAQs and PDF docs'
      ]
    },
    {
      step: '03',
      title: 'Real-Time Webhook Verification',
      badge: 'HMAC-SHA256 Signatures',
      icon: Webhook,
      description: 'When an incoming message arrives, the platform sends a secure webhook event to our server. We immediately verify the cryptographic signature (X-Hub-Signature-256) and record the unique message ID to prevent duplicate processing from webhook retries.',
      details: [
        'hub.challenge handshake verification',
        'Atomic idempotency checks against replay attacks',
        'Prompt injection sanitization on raw message text'
      ]
    },
    {
      step: '04',
      title: 'Safety Evaluation & AI Reasoning',
      badge: 'Smart Pause Active',
      icon: ShieldAlert,
      description: 'Before responding, our safety engine analyzes the message context. If the message requests money, involves legal threats, or displays intense anger, automated replies pause instantly and notify you for human takeover. Otherwise, Gemini generates the tailored response.',
      details: [
        'Instant detection of financial, legal, or abusive prompts',
        'Respects quiet hours and rate-limit caps per contact',
        'Provider abstraction ensures reliable sub-second inference'
      ]
    },
    {
      step: '05',
      title: 'Delivery & Quota Accounting',
      badge: '150 Free / Day',
      icon: Send,
      description: 'The response is delivered to the recipient through the official platform API. Our server atomically increments your daily usage counter. If your 150 daily free replies are reached, automated replies safely pause until the 00:00 UTC reset without surprise charges.',
      details: [
        'Real-time delivery status feedback',
        'Only successfully accepted replies deduct quota',
        'Full conversation logs accessible in your unified dashboard'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Architecture & Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          How Chat Replyzer AI Works
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          A step-by-step breakdown of how messages are authorized, verified, processed, and safeguarded.
        </p>
      </div>

      {/* Steps List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex md:flex-col items-center justify-between w-full md:w-28 flex-shrink-0">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-600 font-mono">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mt-2">
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-navy-950">{item.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.badge}
                  </span>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800 mb-2">Technical Safeguards:</h4>
                  <ul className="space-y-1.5 text-xs text-navy-600">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="max-w-3xl mx-auto px-4 text-center pt-6">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all"
        >
          Set Up Your Assistant (Free 150 Replies)
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
