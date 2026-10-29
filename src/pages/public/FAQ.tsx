import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ArrowRight } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'language', name: 'Roman Urdu & Tone' },
    { id: 'integrations', name: 'Platform APIs' },
    { id: 'quotas', name: '150 Free Replies' },
    { id: 'security', name: 'Security & Privacy' },
  ];

  const faqs = [
    {
      category: 'general',
      q: 'What is Chat Replyzer AI?',
      a: 'Chat Replyzer AI is a multi-platform conversational assistant that helps individuals, creators, and businesses automate authentic messaging responses across WhatsApp, Instagram, Messenger, and TikTok. It understands Roman Urdu and colloquial slang, and features instant human takeover.'
    },
    {
      category: 'quotas',
      q: 'How does the 150 daily free replies allowance work?',
      a: 'Every user gets 150 free AI-generated outgoing replies every day. Inbound messages, webhook deliveries, and safety checks are completely free and never consume your quota. Counters reset atomically at 00:00 UTC.'
    },
    {
      category: 'language',
      q: 'Does Chat Replyzer AI understand Roman Urdu and South Asian slang?',
      a: 'Yes! Our AI prompt engine and Gemini provider abstraction are explicitly tuned for colloquial Roman Urdu (e.g., "Kahan ho bhai?", "Scene on hai", "Kitna discount milega?"), mixed Urdu/English, and regional slang, producing natural replies rather than literal machine translations.'
    },
    {
      category: 'integrations',
      q: 'Do you ever ask for my social media password or account login?',
      a: 'Never. Chat Replyzer AI operates strictly via official Meta Developer Cloud APIs and TikTok Business APIs. All authorizations take place via official OAuth dialogues hosted directly by Meta and TikTok. We never see, store, or ask for your social account passwords.'
    },
    {
      category: 'integrations',
      q: 'Can my WhatsApp or Instagram account get banned for using this?',
      a: 'Because we use only official Meta Graph APIs, Cloud APIs, and compliant webhooks, your account is protected against the bans associated with unofficial scraping bots, unofficial WhatsApp Web emulators, or reverse-engineered scripts.'
    },
    {
      category: 'security',
      q: 'Are my private direct messages used to train AI models?',
      a: 'No. We have an explicit architectural zero-training policy. Your messages are processed in real-time solely to generate the specific reply and are never fed into foundation model training datasets.'
    },
    {
      category: 'security',
      q: 'How does Smart Pause and Human Takeover work?',
      a: 'If an incoming message involves sensitive financial transactions, legal claims, intense hostility, or unverified identity, Chat Replyzer AI instantly halts automated replies for that specific conversation and alerts you so you can reply personally.'
    },
    {
      category: 'quotas',
      q: 'What happens when I hit my 150 daily free replies limit?',
      a: 'When your 150 replies are exhausted, automated replies safely pause until the 00:00 UTC reset. You will receive an in-app notification. We will never charge your card or enroll you in surprise fees.'
    },
    {
      category: 'general',
      q: 'Can I test my assistant without sending real messages to contacts?',
      a: 'Yes! Our Conversation Lab lets you simulate incoming messages in Roman Urdu or English and preview the AI response instantly in your browser without contacting anyone.'
    }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (idx: number) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Knowledge & Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-xl mx-auto">
          Find answers about official integrations, Roman Urdu nuance, the 150 daily free quota, and security.
        </p>

        {/* Search input */}
        <div className="max-w-md mx-auto pt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. Roman Urdu, password, 150 replies)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-navy-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-navy-500 text-sm">
            No matching questions found. Try a different search term or view all questions.
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = !!openItems[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left font-bold text-navy-950 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-brand-600 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-navy-600 leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-sm text-navy-600 mb-3">Still have questions?</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200"
        >
          Contact Our Support Team
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
