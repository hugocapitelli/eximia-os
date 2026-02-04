import { X } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';
import { TOCList } from './TOCList';

interface TOCSidebarProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TOCSidebar({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TOCSidebarProps) {
  return (
    <aside
      className={`
        fixed right-0 top-0 h-full w-72 bg-current/5 border-l border-current/10
        transform transition-transform duration-300 ease-in-out z-20
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{ paddingTop: '64px' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-current/10">
          <h2 className="font-semibold">Contents</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-current/10"
            aria-label="Close contents"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TOCList
            chapters={chapters}
            currentChapter={currentChapter}
            onSelectChapter={onSelectChapter}
          />
        </div>

        <div className="px-4 py-3 border-t border-current/10 text-sm text-center opacity-70">
          Chapter {currentChapter} of {chapters.length}
        </div>
      </div>
    </aside>
  );
}
