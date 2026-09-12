import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  // Height & text size mappings
  const sizeClasses = {
    sm: {
      text: 'text-base',
      circle: 'w-4 h-4',
      tagline: 'text-[9px]',
    },
    md: {
      text: 'text-xl',
      circle: 'w-5 h-5',
      tagline: 'text-[10px]',
    },
    lg: {
      text: 'text-3xl',
      circle: 'w-7 h-7',
      tagline: 'text-xs',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <div className="flex items-center font-bold tracking-tight">
        {/* Cargo */}
        <span className={`${currentSize.text} font-extrabold text-[#00a2ff] tracking-tight`}>
          Cargo
        </span>

        {/* M */}
        <span className={`${currentSize.text} font-extrabold text-[#00a2ff] ml-[1px]`}>
          M
        </span>

        {/* The signature circular refresh/cycle arrow 'o' */}
        <span className="inline-flex items-center justify-center mx-[1.5px] relative align-middle">
          <svg
            className={`${currentSize.circle} shrink-0`}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Blue Circle */}
            <circle cx="50" cy="50" r="48" fill="#00a2ff" />

            {/* Top-Right Cycle Arrow */}
            <path
              d="M 28 50 C 28 36 38 25 53 25 C 61 25 68 28 73 34 L 73 24 L 82 37 L 66 40 L 70 34 C 66 30 60 27 53 27 C 41 27 31 37 31 50 Z"
              fill="white"
            />

            {/* Bottom-Left Cycle Arrow */}
            <path
              d="M 72 50 C 72 64 62 75 47 75 C 39 75 32 72 27 66 L 27 76 L 18 63 L 34 60 L 30 66 C 34 70 40 73 47 73 C 59 73 69 63 69 50 Z"
              fill="white"
            />
          </svg>
        </span>

        {/* ve */}
        <span className={`${currentSize.text} font-extrabold text-[#00a2ff]`}>
          ve
        </span>
      </div>

      {showTagline && (
        <span className={`ml-2.5 text-slate-400 font-medium ${currentSize.tagline}`}>
          Port Clearance & EDI Engine
        </span>
      )}
    </div>
  );
}
