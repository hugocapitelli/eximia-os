import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TOKENS } from '../../src/design-tokens';
import Badge from '../atoms/Badge';
import type { BookCatalog, BookCategory } from '../../src/types/biblioteca';

/**
 * CategorizationSection Molecule Component
 *
 * Displays multi-select categories and free-text tags:
 * - Multi-select checkbox for predefined categories
 * - Tags display as chips/badges
 * - Add/remove tag functionality
 * - Uses TOKENS.categories colors for category badges
 *
 * @example
 * <CategorizationSection
 *   book={book}
 *   onChange={handleChange}
 *   errors={errors}
 * />
 */

export interface CategorizationSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Callback when fields change */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

const AVAILABLE_CATEGORIES: BookCategory[] = [
  'produtividade',
  'psicologia',
  'liderança',
  'desenvolvimento pessoal',
  'hábitos',
];

export const CategorizationSection: React.FC<CategorizationSectionProps> = ({
  book,
  onChange,
  errors = {},
  className = '',
}) => {
  const [newTag, setNewTag] = useState('');
  const selectedCategories = book.categories || [];
  const tags = book.tags || [];

  const toggleCategory = (category: BookCategory) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onChange('categories', updated);
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange('tags', [...tags, trimmed]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(
      'tags',
      tags.filter((t) => t !== tagToRemove)
    );
  };

  const getCategoryColor = (categoryName: string) => {
    const category = TOKENS.categories.find((c) => c.name === categoryName);
    return category || { color: TOKENS.colors.eximia[400], bgColor: '#1f1f22' };
  };

  return (
    <div className={`space-y-6 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Categorização
      </h3>

      {/* Categories - Multi-select */}
      <div>
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-3">
          Categorias (Selecione uma ou mais)
        </label>
        <div className="space-y-2">
          {AVAILABLE_CATEGORIES.map((category) => {
            const categoryColor = getCategoryColor(category);
            const isSelected = selectedCategories.includes(category);

            return (
              <label
                key={category}
                className="flex items-center p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-800/50"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 rounded accent-eximia-400 cursor-pointer"
                  aria-label={`Selecionar categoria: ${category}`}
                />
                <span
                  className="ml-3 text-sm font-medium"
                  style={{
                    color: categoryColor.color,
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </label>
            );
          })}
        </div>
        {errors.categories && (
          <span className="text-xs text-rose-500 font-medium mt-2 block">
            {errors.categories}
          </span>
        )}

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedCategories.map((cat) => {
              const catColor = getCategoryColor(cat);
              return (
                <Badge
                  key={cat}
                  textColor={catColor.color}
                  bgColor={catColor.bgColor}
                  size="sm"
                  aria-label={`Categoria selecionada: ${cat}`}
                >
                  {cat}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags - Free-text input */}
      <div>
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2"
          htmlFor="tag-input"
        >
          Tags (Palavras-chave)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            id="tag-input"
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Digite uma tag e pressione Enter"
            className="flex-1 rounded-lg transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm"
            aria-label="Adicionar nova tag"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-tech-bg hover:bg-eximia-500 active:bg-eximia-600 focus:ring-eximia-400 bg-eximia-400"
            style={{ backgroundColor: TOKENS.colors.eximia[400], color: TOKENS.colors.tech.bg }}
            aria-label="Adicionar tag"
          >
            Adicionar
          </button>
        </div>

        {/* Tags Display as Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: TOKENS.colors.minds[50] || '#ede9fe',
                  color: TOKENS.colors.minds[500] || '#8b5cf6',
                  border: `1px solid ${TOKENS.colors.minds[200] || '#e9d5ff'}`,
                }}
                role="button"
                aria-label={`Tag: ${tag}, pressione para remover`}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-75 transition-opacity"
                  aria-label={`Remover tag: ${tag}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorizationSection;
