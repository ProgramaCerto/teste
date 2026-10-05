import React from 'react';

interface CertoFlowLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const CertoFlowLogo: React.FC<CertoFlowLogoProps> = ({
  size = 48,
  showText = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Definition Stylized C with Circular Fluid Arrow Logo in Opera Blue */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="cf_brand_gradient" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00A3FF" />
          </linearGradient>
          <filter id="cf_glow_subtle" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0066FF" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Circular Flow Track */}
        <circle cx="50" cy="50" r="44" stroke="#EDF4FF" strokeWidth="4" />

        {/* Dynamic Stylized "C" Body Fusing into a Circular Motion Arrow */}
        <path
          d="M 68 28 C 63 20 54 16 46 16 C 28 16 16 29 16 50 C 16 71 29 84 48 84 C 64 84 75 75 79 62 C 80 58 77 55 73 55 C 69.5 55 67 57 65.5 60 C 62 69 55 74 48 74 C 34 74 26 63 26 50 C 26 37 34 26 46 26 C 53 26 59 29 63 35 L 56 39 C 54.5 40 55 42.5 57 42.5 L 80 42.5 C 81.5 42.5 82.5 41.5 82.5 40 L 82.5 17 C 82.5 15 80.5 14.5 79 16 L 73 22 Z"
          fill="url(#cf_brand_gradient)"
          filter="url(#cf_glow_subtle)"
        />

        {/* Flow Core Orbit */}
        <circle cx="50" cy="50" r="8" fill="url(#cf_brand_gradient)" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1F1F] font-['Outfit']">
            Certo<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">Flow</span>
          </span>
        </div>
      )}
    </div>
  );
};
