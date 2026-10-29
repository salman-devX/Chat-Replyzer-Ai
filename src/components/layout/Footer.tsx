import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { ShieldCheck, CheckCircle2, Lock, Sparkles, MessageSquare, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 text-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" withTagline={true} />
            <p className="text-sm text-navy-600 max-w-sm leading-relaxed">
              Empowering personal contacts, creators, customer support teams, and businesses with authentic, nuanced AI conversations across WhatsApp, Instagram, Messenger, and TikTok.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-navy-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Official Platform APIs Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Lock className="w-3 h-3 text-slate-500" />
                AES-256 Token Encryption
              </span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-3.5">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-600">
              <li><Link to="/features" className="hover:text-brand-600 transition-colors">Features Overview</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing & 150 Free Tier</Link></li>
              <li><Link to="/integrations" className="hover:text-brand-600 transition-colors">Platform Integrations</Link></li>
              <li><Link to="/dashboard/lab" className="hover:text-brand-600 transition-colors">Conversation Lab</Link></li>
            </ul>
          </div>

          {/* Use Cases Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-3.5">
              5 Assistant Modes
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-600">
              <li><Link to="/use-cases#personal" className="hover:text-brand-600 transition-colors">Friends & Personal (Roman Urdu)</Link></li>
              <li><Link to="/use-cases#business" className="hover:text-brand-600 transition-colors">Business & Support</Link></li>
              <li><Link to="/use-cases#creator" className="hover:text-brand-600 transition-colors">Creator & Influencer</Link></li>
              <li><Link to="/use-cases#sales" className="hover:text-brand-600 transition-colors">Sales & Lead Qualification</Link></li>
              <li><Link to="/use-cases#community" className="hover:text-brand-600 transition-colors">Community & Study Groups</Link></li>
            </ul>
          </div>

          {/* Trust & Company Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-3.5">
              Trust & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-600">
              <li><Link to="/security" className="hover:text-brand-600 transition-colors">Security & Privacy Architecture</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-brand-600 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-brand-600 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-brand-600 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer and Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-xs text-navy-500 space-y-3">
          <p className="leading-relaxed">
            <strong>Platform Disclaimer:</strong> Chat Replyzer AI integrates strictly with authorized official developer APIs and webhooks provided by Meta Platforms, Inc. (WhatsApp Business Platform / Cloud API, Instagram Graph API, Messenger Platform) and TikTok Inc. Chat Replyzer AI is an independent software application and is not endorsed by, sponsored by, or directly affiliated with Meta Platforms, WhatsApp, Instagram, or TikTok.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>&copy; {new Date().getFullYear()} Chat Replyzer AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All Systems Normal
              </span>
              <span>•</span>
              <span className="text-navy-600">Daily Quota: 150 Free / User</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
