import React from 'react';
import { Book } from '../../types';
import { ChevronRight, Star } from 'lucide-react';
import { TOKENS } from '../../src/design-tokens';

interface BookCardHorizontalProps {
  book: Book;
  onBookClick: (bookId: string) => void;
  onAuthorClick?: (authorId: string) => void;
}

// Map categories to design tokens
const getCategoryTokenColor = (categoryName: string) => {
  const normalized = categoryName?.toLowerCase().trim() || '';
  const category = TOKENS.categories.find(
    (c) => c.name === normalized || c.label.toLowerCase() === normalized
  );
  return category || TOKENS.categories[0]; // Default to first category
};

export const BookCardHorizontal: React.FC<BookCardHorizontalProps> = ({
  book,
  onBookClick,
  onAuthorClick,
}) => {
  const categoryToken = getCategoryTokenColor(book.category || '');

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
        {/* Category Badge - Using TOKENS.categories color */}
        <div
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md w-fit"
          style={{
            backgroundColor: `${categoryToken.bgColor}30`,
            border: `1px solid ${categoryToken.color}`,
          }}
        >
          <span
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: categoryToken.color }}
          >
            {book.category || 'Sem categoria'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mt-2 line-clamp-2 group-hover:text-amber-50 transition-colors">
          {book.title}
        </h3>

        {/* Tags display */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 mb-1">
            {book.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[7px] font-medium uppercase tracking-wider text-zinc-400 bg-white/5 border border-white/10 line-clamp-1 truncate"
              >
                {tag}
              </span>
            ))}
            {book.tags.length > 2 && (
              <span className="px-1.5 py-0.5 rounded text-[7px] font-medium text-zinc-500">
                +{book.tags.length - 2}
              </span>
            )}
          </div>
        )}

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
