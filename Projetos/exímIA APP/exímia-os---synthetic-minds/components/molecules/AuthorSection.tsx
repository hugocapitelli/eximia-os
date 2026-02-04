import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { TOKENS } from '../../src/design-tokens';
import Button from '../atoms/Button';
import type { BookCatalog, Author } from '../../src/types/biblioteca';

/**
 * AuthorSection Molecule Component
 *
 * Displays author management:
 * - Author combobox/select with search
 * - [+ Add New Author] button for inline author creation
 * - Shows currently selected author
 * - Supports creating new authors without leaving the form
 *
 * @example
 * <AuthorSection
 *   book={book}
 *   authors={authors}
 *   onChange={handleChange}
 *   onAddNewAuthor={handleAddNewAuthor}
 *   errors={errors}
 * />
 */

export interface AuthorSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Available authors for selection */
  authors: Author[];

  /** Callback when author selection changes */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Callback when user clicks "Add New Author" */
  onAddNewAuthor?: () => void;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({
  book,
  authors,
  onChange,
  onAddNewAuthor,
  errors = {},
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter authors based on search
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get currently selected author
  const selectedAuthor = book.author_id
    ? authors.find((a) => a.id === book.author_id)
    : null;

  const handleSelectAuthor = (author: Author) => {
    onChange('author_id', author.id);
    onChange('author_name', author.name);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    onChange('author_id', null);
    onChange('author_name', '');
    setSearchQuery('');
  };

  return (
    <div className={`space-y-4 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Autor
      </h3>

      {/* Author Selection with Search */}
      <div className="relative">
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2"
          htmlFor="author-search"
        >
          Selecionar Autor
        </label>

        {/* Search/Select Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            id="author-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={selectedAuthor ? selectedAuthor.name : 'Pesquisar autor...'}
            className="w-full rounded-lg transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed pl-10 pr-4 py-2 text-sm"
            aria-label="Pesquisar e selecionar autor"
            aria-autocomplete="list"
            aria-expanded={isDropdownOpen}
          />
        </div>

        {/* Dropdown List */}
        {isDropdownOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border z-50 max-h-64 overflow-y-auto"
            style={{
              backgroundColor: TOKENS.colors.tech.surface,
              borderColor: TOKENS.colors.tech.border,
            }}
          >
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => {
                const isSelected = selectedAuthor?.id === author.id;
                return (
                  <button
                    key={author.id}
                    onClick={() => handleSelectAuthor(author)}
                    className={`w-full px-4 py-2 text-sm text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-eximia-400/20 text-eximia-400'
                        : 'text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                    aria-selected={isSelected}
                    type="button"
                  >
                    <div className="font-medium">{author.name}</div>
                    {author.bio && (
                      <div className="text-xs text-zinc-500 truncate">{author.bio}</div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                Nenhum autor encontrado
              </div>
            )}
          </div>
        )}

        {/* Close dropdown on blur */}
        <button
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
          className="sr-only"
          aria-hidden="true"
        />
      </div>

      {/* Selected Author Display */}
      {selectedAuthor && (
        <div
          className="p-3 rounded-lg border flex items-center justify-between"
          style={{
            backgroundColor: `${TOKENS.colors.minds[400]}10`,
            borderColor: TOKENS.colors.minds[400],
          }}
        >
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: TOKENS.colors.minds[400] }}
            >
              {selectedAuthor.name}
            </p>
            {selectedAuthor.bio && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {selectedAuthor.bio}
              </p>
            )}
          </div>
          <button
            onClick={handleClearSelection}
            className="text-zinc-500 hover:text-white transition-colors p-1"
            aria-label={`Remover seleção de autor: ${selectedAuthor.name}`}
          >
            ×
          </button>
        </div>
      )}

      {/* Add New Author Button */}
      {onAddNewAuthor && (
        <div className="pt-2 border-t" style={{ borderColor: TOKENS.colors.tech.border }}>
          <Button
            variant="tertiary"
            color="purple"
            size="sm"
            onClick={onAddNewAuthor}
            icon={<Plus className="w-4 h-4" />}
            aria-label="Adicionar novo autor"
            className="w-full"
          >
            Criar Novo Autor
          </Button>
        </div>
      )}

      {/* Error Message */}
      {errors.author_id && (
        <span className="text-xs text-rose-500 font-medium block">
          {errors.author_id}
        </span>
      )}
    </div>
  );
};

export default AuthorSection;
