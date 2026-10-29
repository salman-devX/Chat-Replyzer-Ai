import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
  linkTo?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  withTagline = false,
  linkTo = '/',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const badgeSizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon: Dual Speech Bubbles with Neural Wave */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-sm shadow-brand-500/20 ${iconSizes[size]}`}>
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <svg
            className="w-5/6 h-5/6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Primary message bubble */}
            <path
              d="M3 8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V12C21 14.7614 18.7614 17 16 17H12L7 20V17H8C5.23858 17 3 14.7614 3 12V8Z"
              fill="url(#brandGradient)"
            />
            {/* Neural pulse dots */}
            <circle cx="8.5" cy="10" r="1.5" fill="white" />
            <circle cx="12" cy="10" r="1.5" fill="white" />
            <circle cx="15.5" cy="10" r="1.5" fill="#A5F3FC" />
            <defs>
              <linearGradient id="brandGradient" x1="3" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="0.6" stopColor="#4F46E5" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-navy-900 ${textSizes[size]}`}>
            Chat Replyzer
          </span>
          <span className={`font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 rounded-md uppercase tracking-wider ${badgeSizes[size]}`}>
            AI
          </span>
        </div>
        {withTagline && (
          <span className="text-[11px] font-medium text-navy-500 tracking-tight mt-0.5">
            One AI. Every Conversation.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
