import React from 'react';

interface ReadingProgressProps {
  progress: number; // 0-100
  showLabel?: boolean;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  progress,
  showLabel = true,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <>
      {/* Progress Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-1 bg-[#1F1F22] z-[100]"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de leitura: ${clampedProgress}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-100 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Progress Label */}
      {showLabel && (
        <div className="fixed bottom-3 right-6 z-[100]">
          <span className="text-[11px] font-semibold text-zinc-500">
            {clampedProgress}%
          </span>
        </div>
      )}
    </>
  );
};

export default ReadingProgress;
