import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Key,
  Webhook,
  Database,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  UserCheck
} from 'lucide-react';

export const Security: React.FC = () => {
  const securityControls = [
    {
      title: "Firebase ID Token Backend Verification",
      icon: Key,
      description: "Every single API request to protected routes requires a valid Firebase ID token signed by Google Auth servers. Tokens are verified cryptographically on the Express backend before executing any database query.",
    },
    {
      title: "AES-256-GCM Token Encryption at Rest",
      icon: Lock,
      description: "OAuth access tokens and refresh tokens received from Meta and TikTok are encrypted at rest using industry-standard AES-256-GCM with unique initialization vectors (IVs). Raw tokens are never transmitted to frontend clients.",
    },
    {
      title: "Cryptographic Webhook Signature Checks",
      icon: Webhook,
      description: "Every incoming webhook payload is verified against the provider's HMAC-SHA256 signature (X-Hub-Signature-256) using your configured app secret. Forged or modified payloads are discarded immediately.",
    },
    {
      title: "Persistent Idempotency & Replay Defense",
      icon: Database,
      description: "Incoming event IDs and message IDs are tracked in an indexed MongoDB ledger with TTL expiration. Repeated webhook retries from Meta or TikTok cannot cause duplicate replies or multiple quota charges.",
    },
    {
      title: "Zero Social Password Collection",
      icon: ShieldCheck,
      description: "We strictly forbid collecting user passwords for WhatsApp, Instagram, Facebook, or TikTok. All connections are provisioned via official OAuth dialogs directly hosted on platform domains.",
    },
    {
      title: "Prompt Injection & Safety Filtering",
      icon: Cpu,
      description: "Incoming messages undergo strict sanitization before reaching the AI engine. Jailbreak prompts and instructions attempting to override system constraints are quarantined and flagged for human takeover.",
    },
    {
      title: "Smart Pause on High-Risk Topics",
      icon: AlertTriangle,
      description: "Automated replies instantly halt when financial demands, bank details, legal threats, or harassment are detected. The conversation enters Human Takeover mode and sends an immediate alert to the owner.",
    },
    {
      title: "Strict Data Minimization & Retention",
      icon: FileCheck,
      description: "We retain only the conversation metadata and messages required for assistant context and your review. Users can download complete data exports or purge all history with 1-click in account settings.",
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Security & Privacy Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          Security as an Architectural Requirement
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          How Chat Replyzer AI safeguards your authorization credentials, protects your privacy, and enforces safety boundaries.
        </p>
      </div>

      {/* Controls Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityControls.map((control, idx) => {
            const Icon = control.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-card hover:shadow-card-hover transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-navy-950">{control.title}</h3>
                  <p className="text-xs text-navy-600 leading-relaxed">{control.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Encryption & Architecture Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-navy-900 font-bold text-base">
            <Lock className="w-5 h-5 text-brand-600" />
            <span>Honest Architectural Disclosure Regarding Encryption</span>
          </div>
          <p className="text-xs text-navy-700 leading-relaxed">
            In compliance with our ethical transparency guidelines, we clearly state that while all communications in transit use TLS 1.3 encryption and stored provider tokens use AES-256 encryption at rest, <strong>we do not claim end-to-end encryption (E2EE)</strong> for messages processed by external AI providers. Inbound and outbound messages must be processed in plaintext by the AI reasoning model (Google Gemini) to generate personalized responses.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero Model Training on Private Messages
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1-Click Token Deletion & Account Purge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
