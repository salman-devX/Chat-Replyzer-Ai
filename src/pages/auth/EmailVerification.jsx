import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export function EmailVerification() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.join('').length === 6) {
      setVerified(true);
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
            <p className="text-[11px] text-blue-400">Security Two-Factor Check</p>
          </div>
        </div>

        {!verified ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">Verify your identity</h2>
              <p className="text-xs text-slate-400 mt-1">
                We sent a 6-digit security verification code to your registered company device.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-between gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-mono font-bold bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition flex items-center justify-center gap-2"
              >
                Verify & Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-400">
              Didn&apos;t receive code?{' '}
              <button className="text-blue-400 hover:underline">Resend code</button>
            </p>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Device Authorized</h3>
            <p className="text-xs text-slate-400">
              Your workstation session has been successfully cryptographic authenticated.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center"
              >
                Proceed to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
