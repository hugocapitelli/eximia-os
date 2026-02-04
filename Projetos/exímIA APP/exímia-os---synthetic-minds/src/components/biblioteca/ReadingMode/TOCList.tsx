import { Check } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';

interface TOCListProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
}

export function TOCList({
  chapters,
  currentChapter,
  onSelectChapter,
}: TOCListProps) {
  return (
    <nav aria-label="Chapters">
      <ul className="py-2">
        {chapters.map((chapter) => {
          const isCurrent = chapter.chapter_number === currentChapter;
          const isPast = chapter.chapter_number < currentChapter;

          return (
            <li key={chapter.id}>
              <button
                onClick={() => onSelectChapter(chapter.chapter_number)}
                className={`
                  w-full text-left px-4 py-3 flex items-start gap-3
                  transition-colors duration-200
                  ${isCurrent
                    ? 'bg-amber-500/20 border-l-4 border-amber-500'
                    : 'hover:bg-current/5 border-l-4 border-transparent'
                  }
                `}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isCurrent
                      ? 'bg-amber-500 text-white'
                      : isPast
                      ? 'bg-green-500 text-white'
                      : 'bg-current/10'
                    }
                  `}
                >
                  {isPast ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    chapter.chapter_number
                  )}
                </span>

                <span className={`flex-1 ${isCurrent ? 'font-medium' : ''}`}>
                  {chapter.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
