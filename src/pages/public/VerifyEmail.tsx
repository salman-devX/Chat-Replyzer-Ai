import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { MailCheck, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { currentUser, resendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setResentSuccess(false);
    try {
      await resendVerificationEmail();
      setResentSuccess(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" withTagline={false} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            Verify your email address
          </h1>
          <p className="text-sm text-navy-600">
            Confirm your identity to enable live messaging platform integrations
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card text-center space-y-6">
          <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-200/80">
            <MailCheck className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-navy-700">
              We sent a verification link to:
            </p>
            <p className="font-semibold text-navy-950 text-base bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200 inline-block">
              {currentUser?.email || 'your-account@domain.com'}
            </p>
            <p className="text-xs text-navy-500 pt-1">
              Click the link inside the email to complete verification and unlock full outgoing automation.
            </p>
          </div>

          {resentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>A fresh verification link has been sent to your inbox.</span>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-navy-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending email...' : 'Resend Verification Email'}
            </button>

            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-navy-500">
          Need help? <Link to="/contact" className="text-brand-600 underline font-medium">Contact support</Link>
        </div>
      </div>
    </div>
  );
};
