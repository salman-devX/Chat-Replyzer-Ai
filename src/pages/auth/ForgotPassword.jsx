import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../services/apiServices';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-navy-900 border border-navy-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">TruckPilot</span>
            <p className="text-[11px] text-blue-400">Account Recovery</p>
          </div>
        </div>

        {!submitted ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">Reset your password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your work email address and we will dispatch a secure password reset token.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="salesrep@truckpilot.ai"
                    className="w-full pl-9 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition flex items-center justify-center gap-2"
              >
                {loading ? 'Sending link...' : 'Send Recovery Instructions'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400">
              We sent password reset instructions to <span className="text-white font-medium">{email}</span>. Please inspect your inbox or spam folder.
            </p>
            <div className="pt-2">
              <Link
                to="/reset-password"
                className="inline-block text-xs text-blue-400 hover:underline"
              >
                Proceed to Reset Password Screen (Demo flow) →
              </Link>
            </div>
          </div>
        )}

        <div className="border-t border-navy-800 pt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
