import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-navy-900/95 text-emerald-200',
    warning: 'border-amber-500/40 bg-navy-900/95 text-amber-200',
    error: 'border-rose-500/40 bg-navy-900/95 text-rose-200',
    info: 'border-blue-500/40 bg-navy-900/95 text-blue-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-once">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium text-white">{toast.message}</span>
      </div>
    </div>
  );
}
