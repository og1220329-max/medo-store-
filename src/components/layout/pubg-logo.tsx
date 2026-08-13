export function PubgLogo({ className = "h-11" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Helmet Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-11 drop-shadow-[0_2px_10px_rgba(223,1,18,0.3)]"
        >
          {/* Helmet Base Dome */}
          <path
            d="M32 6C18 6 9 16 7 28C6 34 6 42 9 47C10 49 13 49 16 48C17 44 19 41 23 41H41C45 41 47 44 48 48C51 49 54 49 55 47C58 42 58 34 57 28C55 16 46 6 32 6Z"
            fill="url(#helmetGrad)"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          {/* Helmet Rim / Trim */}
          <path
            d="M10 32C10 32 20 30 32 30C44 30 54 32 54 32"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          {/* Level 3 Visor Frame */}
          <rect
            x="13"
            y="23"
            width="38"
            height="18"
            rx="3"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Visor Glass Slot */}
          <rect
            x="16"
            y="26"
            width="32"
            height="11"
            rx="2"
            fill="#05070B"
            stroke="#334155"
            strokeWidth="1"
          />
          {/* Visor Glass Inner Glow / Grid */}
          <path
            d="M20 28H44"
            stroke="#DF0112"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
          <path
            d="M24 26V37M32 26V37M40 26V37"
            stroke="#1E293B"
            strokeWidth="1"
          />
          {/* Chin Strap attachment */}
          <circle cx="11" cy="38" r="2.5" fill="#475569" stroke="#64748B" strokeWidth="1" />
          <circle cx="53" cy="38" r="2.5" fill="#475569" stroke="#64748B" strokeWidth="1" />
          {/* Gradients */}
          <defs>
            <linearGradient id="helmetGrad" x1="32" y1="6" x2="32" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#64748B" />
              <stop offset="0.4" stopColor="#334155" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span className="font-black text-white text-xl tracking-wider uppercase font-sans">
          PUBG
        </span>
        <span className="font-black text-[#DF0112] text-sm tracking-[0.2em] uppercase font-sans -mt-0.5">
          STORE
        </span>
      </div>
    </div>
  );
}
