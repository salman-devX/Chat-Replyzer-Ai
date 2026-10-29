import React from 'react';
import { ShieldCheck, Lock, Eye, Trash2, Globe, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Legal & Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-navy-500">
            Effective Date: October 20, 2026 • Last Reviewed: October 20, 2026
          </p>
        </div>

        {/* Core Guarantees Banner */}
        <div className="bg-brand-50/70 border border-brand-200/90 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            Our Architectural Privacy Guarantees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-navy-700">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5"></span>
              <span><strong>Zero Model Training:</strong> We never train AI foundation models on your private messages.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5"></span>
              <span><strong>Encrypted Credentials:</strong> Provider tokens stored with AES-256-GCM encryption at rest.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5"></span>
              <span><strong>No Password Collection:</strong> We never ask for or store your social media account passwords.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5"></span>
              <span><strong>1-Click Data Erasure:</strong> Purge all stored conversation logs and account records at any time.</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-8 text-xs sm:text-sm text-navy-700 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">1. Information We Collect</h3>
            <p>
              When you use Chat Replyzer AI, we collect only the minimum data required to facilitate automated conversational messaging:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-navy-600">
              <li><strong>Account Credentials:</strong> Name, email address, and authentication identifiers managed via Firebase Authentication.</li>
              <li><strong>Encrypted OAuth Tokens:</strong> Scoped access tokens and refresh tokens granted by Meta (WhatsApp, Instagram, Messenger) or TikTok through official OAuth authorization.</li>
              <li><strong>Message Metadata:</strong> Message IDs, timestamps, contact identifiers, and message bodies required for prompt context evaluation and unified inbox display.</li>
              <li><strong>Usage Analytics:</strong> Atomic counts of incoming events and outgoing replies to enforce your 150 daily free reply quota.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">2. How We Process Messages & AI Reasoning</h3>
            <p>
              Incoming messages are received via verified webhooks (validated via HMAC-SHA256 signatures). The message text is analyzed in-memory by our AI engine (Google Gemini API abstraction) solely to generate an appropriate response based on your active Assistant Profile settings. We do not sell, rent, or lease your conversation logs to third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">3. Third-Party Integrations & Sub-processors</h3>
            <p>
              Chat Replyzer AI interfaces directly with:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-navy-600">
              <li><strong>Meta Platforms, Inc.:</strong> For WhatsApp Cloud API, Instagram Graph API, and Facebook Messenger.</li>
              <li><strong>TikTok Inc.:</strong> For approved TikTok Business messaging APIs.</li>
              <li><strong>Google Firebase:</strong> For identity verification and authentication token issuance.</li>
              <li><strong>Google Gemini API:</strong> For AI text generation and tone analysis.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">4. Data Retention & Your Rights (GDPR & CCPA)</h3>
            <p>
              You maintain full ownership of your data. Under applicable data privacy laws, you possess the right to:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-navy-600">
              <li>Request an electronic export of all stored conversations and settings.</li>
              <li>Rectify inaccurate personal details via your account settings.</li>
              <li>Revoke connected integration tokens instantly, which triggers automatic deletion from our cryptographic key vault.</li>
              <li>Permanently delete your account and all associated historical records via our self-serve deletion workflow.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">5. Contact Our Data Protection Officer</h3>
            <p>
              If you have inquiries regarding our data handling practices or wish to submit a privacy request, please contact our security team at <a href="mailto:privacy@chatreplyzer.ai" className="text-brand-600 font-semibold underline">privacy@chatreplyzer.ai</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
