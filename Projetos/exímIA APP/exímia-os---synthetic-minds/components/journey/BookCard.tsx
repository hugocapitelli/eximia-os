import React from 'react';
import { Book } from '../../types';
import { BookOpen, MoreVertical } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      {/* Cover Placeholder */}
      <div className="w-20 h-28 bg-zinc-200 dark:bg-zinc-800 rounded-md flex-shrink-0 flex items-center justify-center text-zinc-400 shadow-inner">
         {book.coverUrl ? (
             <div className="w-full h-full bg-cover bg-center rounded-md opacity-80" style={{ backgroundImage: `url(${book.coverUrl})` }} />
         ) : (
            <BookOpen className="w-8 h-8" />
         )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start">
           <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2 font-serif">{book.title}</h4>
              <p className="text-xs text-zinc-500">{book.author}</p>
           </div>
           <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>

        <div className="mt-auto">
            <div className="flex justify-between items-end mb-1">
               <span className={`text-[10px] uppercase font-bold tracking-wider ${book.status === 'completed' ? 'text-emerald-500' : 'text-eximia-600 dark:text-eximia-400'}`}>
                   {book.status === 'to_read' ? 'Na Fila' : (book.status === 'reading' ? 'Lendo' : 'Concluído')}
               </span>
               <span className="text-[10px] text-zinc-500 font-mono">
                  {book.currentPage}/{book.totalPage}
               </span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${book.status === 'completed' ? 'bg-emerald-500' : 'bg-eximia-400'}`}
                    style={{ width: `${book.progress}%` }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};