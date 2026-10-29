import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export function EmptyState({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-navy-900/40 rounded-xl border border-dashed border-navy-700/60 my-6">
      <div className="p-4 rounded-full bg-navy-800/80 border border-navy-700 text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
