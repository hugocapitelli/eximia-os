import React from 'react';
import { Book } from '../../types';
import { ChevronRight, Star } from 'lucide-react';

interface BookCardHorizontalProps {
  book: Book;
  onBookClick: (bookId: string) => void;
  onAuthorClick?: (authorId: string) => void;
}

// Category color mapping
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'CIÊNCIA': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'FILOSOFIA': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  'PSICOLOGIA': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'PRODUTIVIDADE': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'NEGÓCIOS': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'TECNOLOGIA': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  'BIOGRAFIAS': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  default: { bg: 'bg-zinc-800', text: 'text-zinc-400' },
};

export const BookCardHorizontal: React.FC<BookCardHorizontalProps> = ({
  book,
  onBookClick,
  onAuthorClick,
}) => {
  const category = book.category?.toUpperCase() || 'GERAL';
  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

  return (
    <div
      onClick={() => onBookClick(book.id)}
      className="
        group flex gap-5 p-4 bg-[#0A0A0A] border border-[#1F1F22]
        rounded-2xl cursor-pointer transition-all duration-300
        hover:border-zinc-700 hover:bg-zinc-900/50
      "
    >
      {/* Cover */}
      <div className="flex-shrink-0 relative">
        <div
          className="w-24 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg"
          style={{
            backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!book.coverUrl && (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <Star className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Draft Badge */}
        {book.status === 'to_read' && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              RASCUNHO
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        {/* Category Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md w-fit ${categoryStyle.bg}`}>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${categoryStyle.text}`}>
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mt-2 line-clamp-2 group-hover:text-amber-50 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 mt-auto">
          <span
            className="text-sm text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick?.(book.author);
            }}
          >
            {book.author}
          </span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
        </div>
      </div>
    </div>
  );
};

export default BookCardHorizontal;
