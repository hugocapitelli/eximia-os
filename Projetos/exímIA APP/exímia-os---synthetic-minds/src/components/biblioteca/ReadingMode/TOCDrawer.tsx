import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';
import { TOCList } from './TOCList';

interface TOCDrawerProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TOCDrawer({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TOCDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const firstFocusable = drawerRef.current?.querySelector('button');
      firstFocusable?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/50 z-30
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Contents"
        className={`
          fixed right-0 top-0 h-full w-[85%] max-w-sm bg-inherit z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-current/10">
            <h2 className="font-semibold text-lg">Contents</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-current/10"
              aria-label="Close contents"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TOCList
              chapters={chapters}
              currentChapter={currentChapter}
              onSelectChapter={onSelectChapter}
            />
          </div>

          <div className="px-4 py-4 border-t border-current/10 text-sm text-center opacity-70">
            Chapter {currentChapter} of {chapters.length}
          </div>
        </div>
      </div>
    </>
  );
}
