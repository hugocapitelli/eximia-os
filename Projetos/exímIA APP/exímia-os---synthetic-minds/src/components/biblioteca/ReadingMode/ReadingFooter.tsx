// ReadingFooter Component - Chapter navigation
// EXIMIA-202

import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface ReadingFooterProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReadingFooter({
  currentChapter,
  totalChapters,
  onPrev,
  onNext,
  isFirst,
  isLast,
}: ReadingFooterProps) {
  return (
    <footer className="sticky bottom-0 border-t border-current/10 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-current/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="text-sm">
          {currentChapter} / {totalChapters}
        </span>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-current/10 transition-colors"
        >
          <span className="hidden sm:inline">
            {isLast ? 'Concluir' : 'Próximo'}
          </span>
          {isLast ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </footer>
  );
}
