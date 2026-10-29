import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout, isFirebaseLive } = useAuth();

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: 'Integrations', path: '/integrations' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Security', path: '/security' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo size="md" withTagline={false} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-navy-700 hover:text-navy-950 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isFirebaseLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200" title="Running in self-contained developer sandbox. Add real Firebase keys in .env when ready.">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Dev Sandbox Mode
              </span>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                        {currentUser.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-navy-800 max-w-[100px] truncate">
                      {currentUser.displayName}
                    </span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-slate-200 py-1.5 hidden group-hover:block transition-all z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-xs text-navy-500 truncate">
                      {currentUser.email}
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-navy-700 hover:bg-slate-50">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      App Dashboard
                    </Link>
                    <Link to="/onboarding" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-navy-700 hover:bg-slate-50">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Setup Wizard
                    </Link>
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-navy-700 hover:text-navy-950 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all hover:shadow-md"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-navy-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-navy-800 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 shadow-sm"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
