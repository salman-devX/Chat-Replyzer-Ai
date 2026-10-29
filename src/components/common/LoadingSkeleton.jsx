import React from 'react';

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-navy-800/80 rounded-lg w-full mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-3 bg-navy-900/50 rounded-lg border border-navy-800/40">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-navy-800 rounded"
              style={{ width: `${Math.max(40, (100 / cols) * (0.8 + ((i + j) % 3) * 0.2))}%` }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-navy-900/70 p-5 rounded-xl border border-navy-800 space-y-3">
          <div className="h-3 w-1/3 bg-navy-800 rounded"></div>
          <div className="h-7 w-2/3 bg-navy-700 rounded"></div>
          <div className="h-3 w-1/2 bg-navy-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}
