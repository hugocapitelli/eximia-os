import React, { useState, useCallback, useRef } from 'react';
import { TOKENS } from '@/design-tokens';
import { Input } from '../atoms/Input';
import Button from '../atoms/Button';
import type { BookCatalog } from '@/types/biblioteca';

/**
 * ContentSection Molecule Component
 *
 * Displays book description management:
 * - Description textarea for manual editing
 * - [Auto-fetch] button to fetch from APIs (debounced)
 * - [Manual edit] button to switch between modes
 * - Loading state during fetch
 *
 * @example
 * <ContentSection
 *   book={book}
 *   onChange={handleChange}
 *   onAutoFetch={handleAutoFetch}
 *   isLoading={isLoading}
 *   errors={errors}
 * />
 */

export interface ContentSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Callback when description changes */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Callback for auto-fetch action */
  onAutoFetch?: (title: string, author: string) => Promise<string | null>;

  /** Loading state during API fetch */
  isLoading?: boolean;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  book,
  onChange,
  onAutoFetch,
  isLoading = false,
  errors = {},
  className = '',
}) => {
  const [autoFetchLoading, setAutoFetchLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAutoFetch = useCallback(async () => {
    if (!onAutoFetch) return;

    const title = book.title || '';
    const author = book.author_name || '';

    if (!title || !author) {
      console.warn('Title and author are required for auto-fetch');
      return;
    }

    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set loading and debounce the fetch
    setAutoFetchLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const fetchedDescription = await onAutoFetch(title, author);
        if (fetchedDescription) {
          onChange('description', fetchedDescription);
        }
      } catch (error) {
        console.error('Auto-fetch error:', error);
      } finally {
        setAutoFetchLoading(false);
      }
    }, 300); // 300ms debounce
  }, [book, onChange, onAutoFetch]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Conteúdo
      </h3>

      {/* Description Label and Action Buttons */}
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
          htmlFor="description-textarea"
        >
          Descrição do Livro
        </label>
        <div className="flex gap-2">
          {onAutoFetch && (
            <Button
              variant="secondary"
              color="gold"
              size="sm"
              onClick={handleAutoFetch}
              disabled={autoFetchLoading || isLoading || !book.title || !book.author_name}
              aria-label="Auto-buscar descrição da API"
            >
              {autoFetchLoading || isLoading ? 'Buscando...' : 'Auto-buscar'}
            </Button>
          )}
          <Button
            variant="secondary"
            color="purple"
            size="sm"
            aria-label="Editar descrição manualmente"
          >
            Editar Manual
          </Button>
        </div>
      </div>

      {/* Description Textarea */}
      <div>
        <textarea
          id="description-textarea"
          value={book.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Digite ou cole a descrição do livro aqui..."
          className="w-full rounded-lg transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-mono"
          rows={6}
          aria-label="Descrição do Livro"
        />
        {errors.description && (
          <span className="text-xs text-rose-500 font-medium mt-2 block">
            {errors.description}
          </span>
        )}
      </div>

      {/* Description Info */}
      <div className="flex justify-between text-xs text-zinc-500">
        <span>
          {(book.description?.length || 0)} caracteres
        </span>
        <span>
          {(book.description?.split(/\s+/).filter((w) => w).length || 0)} palavras
        </span>
      </div>
    </div>
  );
};

export default ContentSection;
