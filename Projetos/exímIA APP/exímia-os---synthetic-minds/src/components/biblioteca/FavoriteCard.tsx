// FavoriteCard Component - Display a favorited book with progress
// EXIMIA-106

import React from 'react';
import { BookOpen, Trash2, CheckCircle } from 'lucide-react';
import type { UserFavorite, BookCatalog } from '../../types/biblioteca';

interface FavoriteWithProgress extends UserFavorite {
  // Book catalog fields
  title: string;
  author_name?: string;
  cover_url?: string;
  // Progress fields
  has_published_summary?: boolean;
  chapter_count?: number;
  current_chapter?: number;
  summary_completed?: boolean;
}

interface FavoriteCardProps {
  favorite: FavoriteWithProgress;
  onRemove?: () => void;
  onClick?: () => void;
  onStartReading?: () => void;
}

export function FavoriteCard({
  favorite,
  onRemove,
  onClick,
  onStartReading,
}: FavoriteCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const handleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartReading?.();
  };

  const progress = favorite.current_chapter
    ? Math.round((favorite.current_chapter / (favorite.chapter_count || 1)) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Cover Image */}
      <div className="aspect-[2/3] relative bg-gray-100 dark:bg-gray-800">
        {favorite.cover_url ? (
          <img
            src={favorite.cover_url}
            alt={favorite.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📚
          </div>
        )}

        {/* Completed Badge */}
        {favorite.summary_completed && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Concluído
          </div>
        )}

        {/* Reading Overlay for books with summary */}
        {favorite.has_published_summary && !favorite.summary_completed && (
          <button
            onClick={handleRead}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {favorite.current_chapter ? 'Continuar' : 'Ler Resumo'}
            </span>
          </button>
        )}

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remover dos favoritos"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
          {favorite.title}
        </h3>
        {favorite.author_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {favorite.author_name}
          </p>
        )}

        {/* Progress Bar */}
        {favorite.has_published_summary && favorite.current_chapter && !favorite.summary_completed && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Capítulo {favorite.current_chapter}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Summary Badge */}
        {favorite.has_published_summary && !favorite.current_chapter && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Resumo disponível
          </div>
        )}
      </div>
    </div>
  );
}
