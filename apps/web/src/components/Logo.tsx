interface LogoProps {
  size?: "sm" | "md" | "lg";
  showOS?: boolean;
}

export function Logo({ size = "md", showOS = true }: LogoProps) {
  const sizes = {
    sm: { symbol: 28, main: "text-xl", os: "text-[13px]" },
    md: { symbol: 40, main: "text-3xl", os: "text-base" },
    lg: { symbol: 56, main: "text-5xl", os: "text-lg" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Symbol */}
      <svg
        width={s.symbol}
        height={s.symbol}
        viewBox="0 0 120 136"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBF68" />
            <stop offset="100%" stopColor="#E5A03A" />
          </linearGradient>
        </defs>
        <path
          d="M58.88,132.06c0,2.84,2.96,4.72,5.53,3.5l51-24.09c3.04-1.44,4.99-4.51,4.98-7.89l-.02-23.87v-1.81s-.06-60.95-.06-60.95c0-3.57-2.31-6.73-5.72-7.81L87.3.46c-5.29-1.68-10.7,2.27-10.69,7.83l.04,38.51c.01,11.07,7.12,20.88,17.63,24.32l23.61,7.78-53.28,21.38c-3.48,1.39-5.75,4.77-5.75,8.51l.02,23.27Z"
          fill="url(#logoGold)"
        />
        <path
          d="M61.33,3.85c-.02-2.84-2.99-4.7-5.56-3.47L4.93,24.8C1.9,26.27-.02,29.35,0,32.73l.18,23.87v1.81s.47,60.94.47,60.94c.03,3.57,2.36,6.71,5.77,7.77l27.35,8.51c5.3,1.65,10.68-2.34,10.64-7.89l-.29-38.51c-.08-11.07-7.26-20.83-17.79-24.21l-23.66-7.62,53.14-21.73c3.47-1.42,5.72-4.8,5.69-8.55l-.17-23.27Z"
          fill="white"
        />
      </svg>

      {/* Wordmark */}
      <div className="relative">
        <span className={`${s.main} font-black tracking-tight`}>
          <span className="text-white">exím</span>
          <span className="bg-gradient-to-r from-[#FDBF68] to-[#E5A03A] bg-clip-text text-transparent">IA</span>
        </span>
        {showOS && (
          <span
            className={`${s.os} absolute bottom-0 -right-9 font-black tracking-widest bg-gradient-to-r from-[#FDBF68] to-[#E5A03A] bg-clip-text text-transparent`}
          >
            OS
          </span>
        )}
      </div>
    </div>
  );
}
