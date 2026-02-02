// TableOfContents Component - Sidebar/drawer for chapter navigation
// EXIMIA-204

import { X, CheckCircle } from 'lucide-react';
import type { SummaryChapter } from '../../../types/biblioteca';

interface TableOfContentsProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (chapterNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TableOfContents({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TableOfContentsProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Sumário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Fechar sumário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters List */}
        <nav className="overflow-y-auto h-[calc(100%-60px)] p-4">
          <ul className="space-y-2">
            {chapters.map((chapter) => {
              const isCurrent = chapter.chapter_number === currentChapter;
              const isCompleted = chapter.chapter_number < currentChapter;

              return (
                <li key={chapter.id}>
                  <button
                    onClick={() => onSelectChapter(chapter.chapter_number)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {/* Chapter Number / Check */}
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : isCurrent
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        chapter.chapter_number
                      )}
                    </span>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isCurrent ? '' : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {chapter.title}
                      </p>
                      {chapter.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
