import React from 'react';
import { ShieldAlert, CheckCircle2, FileText, Ban, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Terms & Conditions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-navy-500">
            Effective Date: October 20, 2026 • Version 2.4
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-8 text-xs sm:text-sm text-navy-700 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">1. Acceptance of Terms</h3>
            <p>
              By creating an account, connecting messaging integrations, or accessing Chat Replyzer AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all provisions, you must immediately discontinue use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">2. Compliance with Third-Party Platform Policies</h3>
            <p>
              Chat Replyzer AI operates solely through authorized official APIs provided by Meta Platforms, Inc. and TikTok Inc. You expressly agree to adhere to all governing third-party policies, including:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-navy-600">
              <li><strong>Meta Business Platform Terms:</strong> WhatsApp Business Policy and Meta Developer Guidelines.</li>
              <li><strong>Instagram Community Standards & Messaging Terms:</strong> Prohibition of unauthorized broadcast scraping.</li>
              <li><strong>TikTok Business Developer Policies:</strong> Strict compliance with commercial messaging approval requirements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">3. Acceptable Use & Anti-Spam Policy</h3>
            <p>
              You agree not to use Chat Replyzer AI to:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-navy-600">
              <li>Transmit unsolicited bulk messages, spam, or high-frequency phishing links.</li>
              <li>Deceptively impersonate a human for fraudulent purposes (we recommend enabling the AI Disclosure badge).</li>
              <li>Promote hate speech, violent threats, sexual exploitation, or illegal substances.</li>
              <li>Attempt to circumvent server-enforced quotas (such as the 150 daily free reply limit) through automated request spoofing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">4. Daily Free Quota & Service Limits</h3>
            <p>
              The Personal Free tier entitles registered accounts to 150 AI-generated outgoing replies per UTC day. When this quota is reached, automated replies pause automatically until 00:00 UTC. We do not guarantee uninterrupted availability during upstream provider outages or Meta API maintenance windows.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">5. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by applicable law, Chat Replyzer AI and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from lost business profits, account standing penalties imposed by external platforms for user policy violations, or third-party service interruptions.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-navy-950">6. Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate our Anti-Spam policy or engage in abuse of our AI infrastructure without prior notice. Users may terminate their account at any time via the account settings panel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
