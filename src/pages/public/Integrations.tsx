import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  ArrowRight,
  Info,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SUPPORTED_PLATFORMS } from '@shared';

export const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'whatsapp' | 'instagram' | 'messenger' | 'tiktok'>('all');

  const detailedIntegrations = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Platform',
      icon: '💬',
      tagline: 'Meta WhatsApp Cloud API v21.0',
      status: 'Live & Operational',
      statusColor: 'emerald',
      accountType: 'Meta Business Manager + Dedicated Phone Number',
      requiredPermissions: [
        'whatsapp_business_messaging',
        'whatsapp_business_management'
      ],
      capabilities: [
        'Inbound message webhook verification',
        'Outbound AI-generated replies',
        'Interactive quick-reply buttons',
        'Phone coexistence flow guidance'
      ],
      coexistenceNote: 'Phone Coexistence: If you use the standard WhatsApp mobile app on this number, migrating to Cloud API requires creating a Meta Business portfolio. If using official coexistence, ensure your number is registered with an approved Meta Business Solution Provider.',
      setupInstructions: [
        'Log in to developers.facebook.com and create a Meta Business App.',
        'Add the "WhatsApp" product to your Meta application.',
        'Obtain your Phone Number ID and WhatsApp Business Account ID (WABA).',
        'Configure the Webhook URL: https://api.chatreplyzer.ai/api/webhooks/whatsapp with your chosen verify_token.',
        'Subscribe to the "messages" webhook field.',
        'Generate a System User Access Token with whatsapp_business_messaging permission and paste it into your Chat Replyzer dashboard.'
      ],
      troubleshooting: 'If messages are not triggering replies, verify that your Webhook subscription shows a green checkmark in Meta App Dashboard and that your System User token has not expired.'
    },
    {
      id: 'instagram',
      name: 'Instagram Direct Messaging',
      icon: '📸',
      tagline: 'Meta Instagram Graph API v21.0',
      status: 'Live & Operational',
      statusColor: 'emerald',
      accountType: 'Instagram Professional / Creator Account linked to a Facebook Page',
      requiredPermissions: [
        'instagram_basic',
        'instagram_manage_messages',
        'pages_manage_metadata',
        'pages_read_engagement'
      ],
      capabilities: [
        'Direct message text replies',
        'Story mention alerts and acknowledgments',
        'Story reply triggers',
        'Human takeover handoff'
      ],
      coexistenceNote: 'Account Eligibility: Personal Instagram profiles cannot connect to messaging APIs per Meta terms. You can convert to a Free Creator or Business profile in the Instagram mobile app under Settings > Account Type.',
      setupInstructions: [
        'Ensure your Instagram account is switched to Professional or Creator mode.',
        'Connect your Instagram profile to an active Facebook Page.',
        'Under Instagram Settings > Messages and Story Replies > Connected Tools, enable "Allow Access to Messages".',
        'In Meta App Dashboard, configure the Webhook URL for "instagram" messages.',
        'Authorize Chat Replyzer AI via the official Meta Login dialog to grant message management scopes.'
      ],
      troubleshooting: 'Ensure "Allow Access to Messages" is toggled ON inside the Instagram mobile app. If disabled by the user, Meta rejects incoming webhook events.'
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      icon: '⚡',
      tagline: 'Meta Pages Messaging Platform',
      status: 'Live & Operational',
      statusColor: 'emerald',
      accountType: 'Facebook Business Page with Administrator or Task Access',
      requiredPermissions: [
        'pages_messaging',
        'pages_read_engagement',
        'pages_show_list'
      ],
      capabilities: [
        'Page inbox automated replies',
        'Persistent menu commands',
        'Quick reply suggestions',
        'Standard handoff protocol to human agent'
      ],
      coexistenceNote: 'Page Requirements: Messenger bots only bind to Facebook Pages, never personal Facebook profiles, in strict compliance with Meta Platform Terms.',
      setupInstructions: [
        'Navigate to your Meta App Dashboard and add the "Messenger" product.',
        'Select the Facebook Page you wish to automate.',
        'Generate a Page Access Token and configure webhook subscription for "messages" and "messaging_postbacks".',
        'Paste your encrypted Page Token into Chat Replyzer AI.'
      ],
      troubleshooting: 'If replies fail, confirm your Facebook Page is Published and the Page Access Token has not been invalidated by a page admin password reset.'
    },
    {
      id: 'tiktok',
      name: 'TikTok Business Messaging',
      icon: '🎵',
      tagline: 'TikTok Business Direct Message API',
      status: 'Requires Platform Approval',
      statusColor: 'amber',
      accountType: 'Registered TikTok Business Account with Verified App Review',
      requiredPermissions: [
        'business.message.read',
        'business.message.write'
      ],
      capabilities: [
        'Direct message reply generation (Business accounts)',
        'Keyword auto-response hooks',
        'Customer inquiry classification'
      ],
      coexistenceNote: 'Honest Status: TikTok requires an explicit manual Business App Review for direct messaging scopes. Private user DMs on personal accounts are not supported by official TikTok APIs.',
      setupInstructions: [
        'Register as a TikTok Developer at business-api.tiktok.com.',
        'Submit your application for the "Direct Message Management" scope.',
        'Once approved by TikTok review, input your Client Key and Client Secret into Chat Replyzer AI.',
        'Complete the official TikTok OAuth flow.'
      ],
      troubleshooting: 'If your status shows "Requires Platform Approval", you must wait for TikTok developer review before live messages can be processed.'
    }
  ];

  const filteredIntegrations = activeTab === 'all'
    ? detailedIntegrations
    : detailedIntegrations.filter(i => i.id === activeTab);

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Official Developer APIs
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          Platform Integrations & Eligibility
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          Honest documentation of official capabilities, required permissions, and step-by-step setup instructions for each platform.
        </p>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'all', label: 'All Platforms' },
            { id: 'whatsapp', label: 'WhatsApp Cloud API' },
            { id: 'instagram', label: 'Instagram Direct' },
            { id: 'messenger', label: 'Facebook Messenger' },
            { id: 'tiktok', label: 'TikTok Business' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-navy-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Detail Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all space-y-8"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-subtle">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-navy-950">{item.name}</h2>
                  <p className="text-xs text-brand-600 font-medium">{item.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.statusColor === 'emerald'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    item.statusColor === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></span>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-navy-900 block">Required Account Type:</span>
                <p className="text-navy-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {item.accountType}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-navy-900 block">API Permissions Required:</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-navy-700 space-y-1">
                  {item.requiredPermissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coexistence / Notice Callout */}
            <div className="bg-brand-50/50 border border-brand-200/80 rounded-2xl p-4 text-xs text-navy-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{item.coexistenceNote}</p>
            </div>

            {/* Setup Instructions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                Official Setup Protocol:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-navy-700 pl-1">
                {item.setupInstructions.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="text-navy-600 max-w-xl">
                <span className="font-bold text-navy-800">Troubleshooting Tip: </span>
                {item.troubleshooting}
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm flex-shrink-0"
              >
                Connect in Setup Wizard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
