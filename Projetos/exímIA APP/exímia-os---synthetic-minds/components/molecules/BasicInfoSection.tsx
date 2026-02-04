import React from 'react';
import { TOKENS } from '../../src/design-tokens';
import { Input } from '../atoms/Input';
import type { BookCatalog, Author } from '../../src/types/biblioteca';

/**
 * BasicInfoSection Molecule Component
 *
 * Displays form fields for basic book information:
 * - Title (required)
 * - Subtitle (optional)
 * - Author (combobox/select)
 * - Publisher (optional)
 * - Published Date (optional)
 *
 * @example
 * <BasicInfoSection
 *   book={book}
 *   authors={authors}
 *   onChange={handleChange}
 *   errors={errors}
 * />
 */

export interface BasicInfoSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Available authors for selection */
  authors: Author[];

  /** Callback when fields change */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  book,
  authors,
  onChange,
  errors = {},
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Informações Básicas
      </h3>

      {/* Title Input - Required */}
      <div>
        <Input
          label="Título do Livro"
          value={book.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Digite o título do livro"
          error={errors.title}
          required
          aria-label="Título do Livro"
        />
      </div>

      {/* Subtitle Input - Optional */}
      <div>
        <Input
          label="Subtítulo"
          value={book.subtitle || ''}
          onChange={(e) => onChange('subtitle', e.target.value)}
          placeholder="Digite o subtítulo (opcional)"
          error={errors.subtitle}
          aria-label="Subtítulo"
        />
      </div>

      {/* Author Select */}
      <div>
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5"
          htmlFor="author-select"
        >
          Autor
        </label>
        <select
          id="author-select"
          value={book.author_id || ''}
          onChange={(e) => onChange('author_id', e.target.value || null)}
          className="w-full rounded-lg transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm"
          aria-label="Selecionar Autor"
        >
          <option value="">Selecionar autor...</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        {errors.author_id && (
          <span className="text-xs text-rose-500 font-medium mt-1 block">
            {errors.author_id}
          </span>
        )}
      </div>

      {/* Publisher Input - Optional */}
      <div>
        <Input
          label="Editora"
          value={book.publisher || ''}
          onChange={(e) => onChange('publisher', e.target.value)}
          placeholder="Digite o nome da editora (opcional)"
          error={errors.publisher}
          aria-label="Editora"
        />
      </div>

      {/* Published Date Input - Optional */}
      <div>
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5"
          htmlFor="published-date"
        >
          Data de Publicação
        </label>
        <input
          id="published-date"
          type="date"
          value={book.published_date || ''}
          onChange={(e) => onChange('published_date', e.target.value || null)}
          className="w-full rounded-lg transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm"
          aria-label="Data de Publicação"
        />
        {errors.published_date && (
          <span className="text-xs text-rose-500 font-medium mt-1 block">
            {errors.published_date}
          </span>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
