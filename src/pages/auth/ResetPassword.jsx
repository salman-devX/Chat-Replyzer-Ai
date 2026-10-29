import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../services/apiServices';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword('mock_token', password);
      setSuccess(true);
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
            <p className="text-[11px] text-blue-400">Security Credentials</p>
          </div>
        </div>

        {!success ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">Choose a new password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Must be at least 8 characters with letters and numbers.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Password Updated!</h3>
            <p className="text-xs text-slate-400">
              Your security credentials have been updated. You may now log in to the sales console.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Go to Sign In
              </button>
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
