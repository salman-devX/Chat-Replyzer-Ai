import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Briefcase,
  Users,
  Target,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { ASSISTANT_MODES } from '@shared';

export const UseCases: React.FC = () => {
  const deepDives = [
    {
      id: 'personal',
      name: 'Mode A: Friends & Personal',
      tagline: 'Casual chats, Roman Urdu banter & close contacts',
      icon: MessageSquare,
      badge: 'Social & Fun',
      overview: 'Stay responsive with friends and family without being glued to your phone. Features deep cultural intelligence for Roman Urdu, Pakistani/South Asian slang, and relaxed humor.',
      features: [
        'Natural conversational replies in Roman Urdu, Urdu, and English',
        'Configurable slang, emojis, humor level, and message length',
        'Custom phrases you use often (e.g. "Scene on hai", "Bas 5 min me nikal raha")',
        'Contact-specific tone styling for close friends vs acquaintances',
        'Sensitive-topic safeguards (auto-pauses on money requests or arguments)'
      ],
      sampleDialog: {
        incoming: "Bhai kahan ho? Biryani khane chal rahe hain sab!",
        reply: "Aray wah! Bas thora sa kaam baqi hai, 20 minutes me scene banata hoon. Kahan chal rahe hain?"
      }
    },
    {
      id: 'business',
      name: 'Mode B: Business & Customer Support',
      tagline: '24/7 Professional Inquiry & Service Resolution',
      icon: Briefcase,
      badge: 'Commercial',
      overview: 'Instant, professional answers to customer inquiries, store operating hours, return policies, and service pricing based on your approved business knowledge base.',
      features: [
        'Upload custom knowledge base (PDF documents, FAQs, service catalog)',
        'Operating hours awareness (distinguishes between open and closed times)',
        'Automatic ticket escalation for frustrated customers or complex refunds',
        'Multi-platform synchronization across WhatsApp Business and Facebook Pages',
        'Clear AI disclosure option to ensure transparent, ethical communication'
      ],
      sampleDialog: {
        incoming: "Do you ship internationally and what is your return window?",
        reply: "Yes, we ship globally via DHL Express! We offer a 30-day hassle-free return window for all undamaged items. Would you like our shipping rates table?"
      }
    },
    {
      id: 'creator',
      name: 'Mode C: Creator & Influencer',
      tagline: 'Audience Engagement & Collaboration Screening',
      icon: Sparkles,
      badge: 'High Engagement',
      overview: 'Screen brand deal opportunities, share media kit links, and acknowledge loyal followers in your distinctive creator tone without burning out on DMs.',
      features: [
        'Signature creator voice, favorite catchphrases, and greeting style',
        'Automated classification of inbound sponsorship and PR inquiries',
        'Instant delivery of media kit links and booking contact instructions',
        'Smart quarantine for contract details and high-ticket agreements',
        'Works with Instagram Direct and TikTok Business messaging'
      ],
      sampleDialog: {
        incoming: "Love your content! Can you send your media kit for a Q1 gadget campaign?",
        reply: "Hey! Appreciate the love so much. You can review my Q1 media kit and case studies at creator.com/collabs or email my manager directly at brand@creator.com!"
      }
    },
    {
      id: 'sales',
      name: 'Mode D: Sales & Lead Assistant',
      tagline: 'Instant Inbound Qualification & Pipeline Acceleration',
      icon: Target,
      badge: 'Conversion',
      overview: 'Turn warm social media inquiries into qualified leads. Asks the right qualification questions, shares product specs, and flags high-intent buyers for your sales team.',
      features: [
        'Lead qualification logic (budget, timeline, requirements screening)',
        'Product recommendations based on approved feature lists',
        'Follow-up reminders and lead categorization (Hot, Warm, Cold)',
        'Zero deceptive claims: strictly bounded to verified facts',
        'Webhook dispatch to your external CRM or spreadsheet'
      ],
      sampleDialog: {
        incoming: "Looking to deploy messaging automation for our 12-person agency. Pricing?",
        reply: "Hello! Our Growth tier is optimized for agencies of that size, supporting 5,000 monthly replies and 3 team seats at $29/mo. Would you like a 15-minute walkthrough demo?"
      }
    },
    {
      id: 'community',
      name: 'Mode E: Community & Study Groups',
      tagline: 'Guideline Enforcement & Event Coordination',
      icon: GraduationCap,
      badge: 'Community',
      overview: 'Keep study groups, alumni networks, and community channels organized with automated schedule announcements, resource links, and respectful group conduct.',
      features: [
        'Automated answers for meeting schedules, exam topics, and reading lists',
        'Approved community guidelines and conduct reminders',
        'Coordination of group events and zoom/call links',
        'Dispute and harassment escalation to community moderators',
        'Strictly complies with group API permissions and privacy boundaries'
      ],
      sampleDialog: {
        incoming: "When is the next study session for Chapter 4 and where are the notes?",
        reply: "The Chapter 4 study session is tomorrow at 7:00 PM EST. You can download the shared lecture summary notes from drive.google.com/study-ch4!"
      }
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          5 Tailored Modes
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          Purpose-Built for Every Type of Conversation
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          From casual Roman Urdu jokes with friends to 24/7 corporate customer support and creator sponsorship triage.
        </p>
      </div>

      {/* Deep Dives */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {deepDives.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              id={mode.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy-950">{mode.name}</h2>
                    <p className="text-xs text-brand-600 font-medium">{mode.tagline}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {mode.badge}
                </span>
              </div>

              <p className="text-sm text-navy-600 leading-relaxed">
                {mode.overview}
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800">Key Capabilities:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-navy-700">
                  {mode.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Dialog box */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500">Live Sample Conversation:</span>
                <div className="space-y-2">
                  <div className="bg-white border border-slate-200 text-navy-800 px-3.5 py-2 rounded-xl text-xs max-w-md shadow-subtle">
                    <span className="font-semibold text-navy-900 block text-[10px] text-slate-400">Incoming Contact:</span>
                    {mode.sampleDialog.incoming}
                  </div>
                  <div className="bg-brand-600 text-white px-3.5 py-2 rounded-xl text-xs max-w-md ml-auto shadow-sm">
                    <span className="font-semibold block text-[10px] text-brand-200">Chat Replyzer AI:</span>
                    {mode.sampleDialog.reply}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      <div className="max-w-3xl mx-auto px-4 text-center pt-4">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all"
        >
          Choose Your Mode in Onboarding (150 Free Replies)
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
