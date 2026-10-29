import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Lock, Mail, ArrowRight, ShieldCheck, PhoneCall, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, loginDemo, loading } = useAuth();
  const [email, setEmail] = useState('alex@truckpilot.ai');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try the demo account.');
    }
  };

  const handleDemoSignIn = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col md:flex-row text-slate-100">
      {/* Left Branding / Value Proposition Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-12 flex-col justify-between border-r border-navy-800 relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-glow-sm">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">TruckPilot</span>
              <p className="text-xs text-blue-400 font-medium">AI Voice Sales Agent for Trucking Call Centers</p>
            </div>
          </div>

          <div className="mt-20 max-w-lg">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Turn cold trucking leads into booked freight meetings on autopilot.
            </h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              TruckPilot deploys conversational voice AI agents that sound human, understand ELD compliance, handle rate objections, and route qualified fleet managers to your senior sales team.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                'Handles multi-fleet objection resolution in under 400ms',
                'Integrates with KeepTruckin, Motive, Samsara & Factoring platforms',
                'Live human supervisor handoff with full conversational context',
                'Continuous pipeline qualification & automated CRM updates'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Stat Banner */}
        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">1,482 Calls Completed Today</div>
              <div className="text-[11px] text-slate-400">Average talk time: 3m 38s • 27.4% qualification rate</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            99.98% SLA
          </span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 p-2 text-white">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TruckPilot</h1>
              <p className="text-xs text-blue-400">AI Voice Sales Platform</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sales Representative Sign In</h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter your credentials or click demo account for instant access.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@truckpilot.ai"
                  className="w-full pl-9 pr-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-blue-600 focus:ring-0"
                />
                Remember this workstation for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-navy-950 px-3 text-slate-500">OR INSTANT EVALUATION</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700 hover:border-indigo-500/50 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition" />
            <span>Launch Interactive Demo (Alex Rivera - Sr. Rep)</span>
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Enterprise single-sign-on (SAML/Okta) enabled for carrier partners.
          </p>
        </div>
      </div>
    </div>
  );
}
