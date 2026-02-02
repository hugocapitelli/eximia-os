// BookCard Component - Display a book from catalog
// EXIMIA-104

import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import type { BookCatalog } from '../../types/biblioteca';

interface BookCardProps {
  book: BookCatalog & {
    has_published_summary?: boolean;
    chapter_count?: number;
  };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
}

export function BookCard({
  book,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: BookCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Cover Image */}
      <div className="aspect-[2/3] relative bg-gray-100 dark:bg-gray-800">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📚
          </div>
        )}

        {/* Summary Badge */}
        {book.has_published_summary && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Resumo
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
          {book.title}
        </h3>
        {book.author_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {book.author_name}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          {book.favorites_count > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {book.favorites_count}
            </span>
          )}
          {book.chapter_count > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {book.chapter_count} cap
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
