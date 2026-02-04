import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { BookOpen, Star, User, MoreVertical, Heart, Brain } from 'lucide-react';
import { TOKENS } from '@/design-tokens';

interface BookCardVisualProps {
  book: Book;
  onClick?: () => void;
  onToggleFavorite?: (bookId: string) => void;
  onNavigateToAuthor?: (authorName: string) => void;
  showAuthorButton?: boolean;
  hasMind?: boolean;
}

// Map categories to design tokens
const getCategoryTokenColor = (categoryName: string) => {
  const normalized = categoryName?.toLowerCase().trim() || '';
  const category = TOKENS.categories.find(
    (c) => c.name === normalized || c.label.toLowerCase() === normalized
  );
  return category || TOKENS.categories[0]; // Default to first category
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
  const navigate = useNavigate();
  const categoryToken = getCategoryTokenColor(book.category || '');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(book.id);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToAuthor?.(book.author);
  };

  // Story 7.9.0: Handle read summary button click
  const handleReadSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.id) {
      navigate(`/biblioteca/summary/${book.id}/read`);
    }
  };

  // Story 7.9.0: Handle read book button click (only if available)
  const handleReadBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.id) {
      navigate(`/biblioteca/book/${book.id}/read`);
    }
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

      {/* Book Cover Area - Enhanced height to h-80 */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden group/cover">
        {/* Background gradient based on category */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover/cover:opacity-30"
          style={{ backgroundColor: categoryToken.bgColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Cover image or placeholder - Enhanced to h-72 */}
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.title}`}
            className="relative z-10 h-72 w-auto rounded-lg shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="relative z-10 w-32 h-48 rounded-lg bg-opacity-30 border flex flex-col items-center justify-center gap-2 shadow-2xl transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: categoryToken.bgColor,
              borderColor: categoryToken.color,
            }}
          >
            <BookOpen className="w-10 h-10" style={{ color: categoryToken.color }} />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider text-center px-2 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge - Using TOKENS.categories color */}
        <div className="mb-2">
          <span
            className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 border transition-colors"
            style={{
              color: categoryToken.color,
              borderColor: categoryToken.color,
            }}
          >
            {book.category || 'Sem categoria'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 font-serif group-hover:text-amber-50 transition-colors">
          {book.title}
        </h3>

        {/* Author with optional Mind button */}
        <div className="flex items-center gap-2 mb-2">
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

        {/* Tags display - Below title, with truncate and ellipsis */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {book.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[8px] font-medium uppercase tracking-wider text-zinc-400 bg-white/5 border border-white/10 line-clamp-1 truncate"
              >
                {tag}
              </span>
            ))}
            {book.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded text-[8px] font-medium text-zinc-500">
                +{book.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description snippet - 3 lines max with line-clamp-3 */}
        {book.description && (
          <p className="text-xs text-zinc-500 line-clamp-3 mb-3 flex-grow">
            {book.description}
          </p>
        )}

        {/* Status & Progress */}
        <div className="pt-3 border-t border-[#1F1F22] mb-3 mt-auto">
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

        {/* Story 7.9.0: Dual Read Buttons */}
        <div className="space-y-2">
          {/* Always show: [Ler Resumo] button */}
          <button
            onClick={handleReadSummary}
            className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ease-out text-black hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
            style={{
              backgroundColor: TOKENS.colors.eximia[400],
              color: TOKENS.colors.tech.bg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = TOKENS.colors.eximia[500];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = TOKENS.colors.eximia[400];
            }}
            aria-label="Ler resumo do livro"
          >
            Ler Resumo
          </button>

          {/* Conditionally show: [Ler Livro] button (if is_available === true) */}
          {(book as any).is_available && (
            <button
              onClick={handleReadBook}
              className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ease-out text-black hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black group/tooltip"
              style={{
                backgroundColor: TOKENS.colors.eximia[400],
                color: TOKENS.colors.tech.bg,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = TOKENS.colors.eximia[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = TOKENS.colors.eximia[400];
              }}
              title="Livro disponível para leitura"
              aria-label="Ler livro completo"
            >
              Ler Livro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCardVisual;
