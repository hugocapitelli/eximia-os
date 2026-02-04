import React, { useState } from 'react';
import { Book } from '../../types';
import { BookOpen, Star, User, MoreVertical, Heart, Brain } from 'lucide-react';

interface BookCardVisualProps {
  book: Book;
  onClick?: () => void;
  onToggleFavorite?: (bookId: string) => void;
  onNavigateToAuthor?: (authorName: string) => void;
  showAuthorButton?: boolean;
  hasMind?: boolean;
}

// Color mapping for book categories
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Produtividade': { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-400' },
  'Psicologia': { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' },
  'Filosofia': { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-400' },
  'Ficcao': { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-400' },
  'Produto': { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-400' },
  'Business': { bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-400' },
  'default': { bg: 'bg-zinc-600', border: 'border-zinc-500', text: 'text-zinc-400' },
};

export const BookCardVisual: React.FC<BookCardVisualProps> = ({
  book,
  onClick,
  onToggleFavorite,
  onNavigateToAuthor,
  showAuthorButton = true,
  hasMind = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const colors = CATEGORY_COLORS[book.category || ''] || CATEGORY_COLORS.default;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(book.id);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToAuthor?.(book.author);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0A0A0A] border border-[#1F1F22] rounded-xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer"
      role="article"
      aria-label={`Livro: ${book.title} por ${book.author}`}
    >
      {/* Draft Badge */}
      {book.isDraft && (
        <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-amber-500/90 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-lg">
          RASCUNHO
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-20 p-2 rounded-lg transition-all ${
          isFavorite
            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
            : 'bg-black/50 backdrop-blur-sm text-zinc-400 border border-white/10 opacity-0 group-hover:opacity-100'
        }`}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Book Cover Area */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden">
        {/* Background gradient based on category */}
        <div className={`absolute inset-0 ${colors.bg} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Cover image or placeholder */}
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.title}`}
            className="relative z-10 h-72 w-auto rounded-lg shadow-2xl object-cover"
          />
        ) : (
          <div className={`relative z-10 w-32 h-48 rounded-lg ${colors.bg} bg-opacity-30 border ${colors.border} flex flex-col items-center justify-center gap-2 shadow-2xl`}>
            <BookOpen className={`w-10 h-10 ${colors.text}`} />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider text-center px-2 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${colors.text} bg-white/5 border border-white/10`}>
            {book.category || 'Sem categoria'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 font-serif group-hover:text-amber-50 transition-colors">
          {book.title}
        </h3>

        {/* Author with optional Mind button */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm text-zinc-400">{book.author}</p>
          {showAuthorButton && hasMind && (
            <button
              onClick={handleAuthorClick}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-minds-500/10 border border-minds-500/20 text-minds-400 text-[10px] font-bold uppercase tracking-wider hover:bg-minds-500/20 transition-colors"
              aria-label={`Ver Mind de ${book.author}`}
            >
              <Brain className="w-3 h-3" />
              Mind
            </button>
          )}
        </div>

        {/* Description if available */}
        {book.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
            {book.description}
          </p>
        )}

        {/* Status & Progress */}
        <div className="pt-3 border-t border-[#1F1F22]">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                book.status === 'completed'
                  ? 'text-emerald-500'
                  : book.status === 'reading'
                    ? 'text-amber-500'
                    : 'text-zinc-500'
              }`}
            >
              {book.status === 'to_read' && 'Na Fila'}
              {book.status === 'reading' && 'Lendo'}
              {book.status === 'completed' && 'Concluído'}
            </span>
            {book.totalPage && (
              <span className="text-[10px] text-zinc-600 font-mono">
                {book.currentPage || 0}/{book.totalPage} págs
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-[#1F1F22] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                book.status === 'completed'
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${book.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCardVisual;
