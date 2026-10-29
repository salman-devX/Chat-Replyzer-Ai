import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Personal Free",
      price: "$0",
      period: "forever",
      description: "Generous daily free tier for friends, personal contacts, emerging creators, and small community groups.",
      badge: "No Credit Card Needed",
      highlight: false,
      buttonText: "Start Free Now",
      buttonLink: "/signup",
      features: [
        "150 AI-generated replies per day",
        "Resets atomically at 00:00 UTC",
        "All 5 assistant modes unlocked",
        "Roman Urdu, Urdu & English support",
        "WhatsApp, Instagram & Messenger",
        "Smart Pause & Human Takeover alerts",
        "Community & self-serve support"
      ]
    },
    {
      name: "Business Starter",
      price: "$15",
      period: "per month",
      description: "For solopreneurs, local shops, and boutique service providers automating customer inquiries.",
      badge: "Solo Business",
      highlight: false,
      buttonText: "Start 14-Day Free Trial",
      buttonLink: "/signup",
      features: [
        "2,000 AI replies per month",
        "Basic business knowledge base (FAQs & Hours)",
        "1 Administrator team seat",
        "Standard webhook delivery",
        "Email support within 24 hours",
        "Conversation export (CSV/JSON)"
      ]
    },
    {
      name: "Business Growth",
      price: "$29",
      period: "per month",
      description: "Our most popular tier for active e-commerce brands, creators, and lead generation teams.",
      badge: "Most Popular",
      highlight: true,
      buttonText: "Start 14-Day Free Trial",
      buttonLink: "/signup",
      features: [
        "5,000 AI replies per month",
        "Multi-document knowledge base (PDFs, menus, docs)",
        "3 Team seats with role permissions",
        "Custom CRM webhook triggers",
        "Priority token refresh handling",
        "Conversation Lab multi-prompt testing",
        "Priority chat support"
      ]
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For agencies, high-volume call centers, and multi-brand platforms requiring custom SLAs.",
      badge: "Custom Scale",
      highlight: false,
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      features: [
        "25,000+ AI replies per month",
        "Unlimited team seats",
        "Dedicated WhatsApp number coexistence guidance",
        "Custom data retention policies & GDPR purge",
        "Audit logging export for compliance",
        "Dedicated account technical architect",
        "99.9% uptime SLA guarantee"
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Fair & Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
          One AI. Plans for Every Stage.
        </h1>
        <p className="text-base sm:text-lg text-navy-600 max-w-2xl mx-auto">
          Start with <strong>150 free replies every day</strong>. Upgrade only when your messaging volume and business team grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 flex flex-col justify-between space-y-6 transition-all ${
                plan.highlight
                  ? 'bg-white border-2 border-brand-500 shadow-card-hover relative'
                  : 'bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy-950">{plan.name}</h3>
                  {!plan.highlight && (
                    <span className="text-[10px] font-semibold text-navy-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-navy-950">{plan.price}</span>
                  <span className="text-xs text-navy-500 ml-1">/ {plan.period}</span>
                </div>

                <p className="text-xs text-navy-600 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-900 block mb-2.5">
                    What's Included:
                  </span>
                  <ul className="space-y-2 text-xs text-navy-700">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  to={plan.buttonLink}
                  className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold block transition-all shadow-sm ${
                    plan.highlight
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
                      : 'bg-slate-100 text-navy-800 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Billing Transparency Alert */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">Billing Transparency Note</h4>
            <p className="leading-relaxed">
              The <strong>Personal Free tier (150 daily replies)</strong> is permanently accessible without entering any payment credentials. Business plans are configurable in the database by system administrators. Subscriptions operate in billing-ready mode and will only process real card charges upon formal gateway activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
