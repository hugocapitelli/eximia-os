// Manual Add Book Modal - Story 7.6.0
// Allows library admins to manually add books with comprehensive form fields

'use client';

/**
 * ManualAddBookModal Component - Story 7.6.0
 *
 * A comprehensive modal for manually adding books to the library catalog.
 *
 * Accessibility Features:
 * - role="dialog" and aria-modal="true"
 * - Focus trapped inside modal (Tab/Shift+Tab cycle)
 * - Escape key closes modal
 * - All form fields have associated labels
 * - Error messages announced via role="alert"
 * - Logical tab order through all sections
 * - Backdrop click closes modal
 * - Focus returned to trigger button on close
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { COLORS, TYPOGRAPHY, SPACING } from '@/design-tokens';
import { BOOK_CATEGORIES } from '@/types/biblioteca';
import { createAuthor, addBookToCatalog } from '@/services/biblioteca';
import { useFocusTrap, useKeyboardNavigation } from '../../src/hooks/useAccessibility';
import type { BookCatalog, Author } from '@/types/biblioteca';
import { CreateAuthorInlineModal } from './CreateAuthorInlineModal';

// ============================================================
// TYPES
// ============================================================

interface ManualAddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: (book: BookCatalog) => void;
}

interface FormData {
  title: string;
  subtitle: string;
  authorId: string;
  authorName: string;
  description: string;
  publisher: string;
  publishedDate: string;
  pageCount: string;
  language: string;
  categories: string[];
  tags: string;
  isbn13: string;
  isbn10: string;
}

interface FormErrors {
  title?: string;
  authorName?: string;
  categories?: string;
  [key: string]: string | undefined;
}

// ============================================================
// COMPONENT
// ============================================================

export const ManualAddBookModal: React.FC<ManualAddBookModalProps> = ({
  isOpen,
  onClose,
  onBookAdded,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    authorId: '',
    authorName: '',
    description: '',
    publisher: '',
    publishedDate: '',
    pageCount: '',
    language: 'pt',
    categories: [],
    tags: '',
    isbn13: '',
    isbn10: '',
  });

  // ============================================================
  // EFFECTS
  // ============================================================

  // Focus trap inside modal
  useFocusTrap(isOpen, modalRef);

  // Keyboard navigation (Escape to close)
  useKeyboardNavigation(() => onClose(), undefined, modalRef);

  // Body scroll management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input');
      firstInput?.focus();
    }
  }, [isOpen]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleAuthorInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      authorName: value,
    }));

    // Filter authors
    if (value.trim().length > 0) {
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAuthors(filtered);
      setShowAuthorDropdown(true);
    } else {
      setFilteredAuthors([]);
      setShowAuthorDropdown(false);
    }

    // Clear error
    if (errors.authorName) {
      setErrors((prev) => ({
        ...prev,
        authorName: undefined,
      }));
    }
  };

  const handleAuthorSelect = (author: Author) => {
    setFormData((prev) => ({
      ...prev,
      authorId: author.id,
      authorName: author.name,
    }));
    setShowAuthorDropdown(false);
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    // Clear error
    if (errors.categories) {
      setErrors((prev) => ({
        ...prev,
        categories: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Autor é obrigatório';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Selecione pelo menos uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthorCreated = (author: Author) => {
    setAuthors((prev) => [...prev, author]);
    setFormData((prev) => ({
      ...prev,
      authorId: author.id,
      authorName: author.name,
    }));
    setIsCreatingAuthor(false);
    setShowAuthorDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare book data
      const bookData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle || undefined,
        author_id: formData.authorId || undefined,
        author_name: formData.authorName.trim(),
        description: formData.description || undefined,
        publisher: formData.publisher || undefined,
        published_date: formData.publishedDate || undefined,
        page_count: formData.pageCount ? parseInt(formData.pageCount, 10) : undefined,
        language: formData.language || 'pt',
        categories: formData.categories.length > 0 ? formData.categories : undefined,
        isbn13: formData.isbn13 || undefined,
        isbn10: formData.isbn10 || undefined,
      };

      const result = await addBookToCatalog(bookData);

      if (result.success && result.data) {
        toast.success('Livro adicionado com sucesso!');
        onBookAdded?.(result.data);
        onClose();
        // Reset form
        setFormData({
          title: '',
          subtitle: '',
          authorId: '',
          authorName: '',
          description: '',
          publisher: '',
          publishedDate: '',
          pageCount: '',
          language: 'pt',
          categories: [],
          tags: '',
          isbn13: '',
          isbn10: '',
        });
        setErrors({});
      } else {
        toast.error(result.error || 'Falha ao adicionar livro');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      toast.error('Erro ao adicionar livro');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          role="none"
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1F1F22] shrink-0">
            <h2 id="modal-title" className="text-xl font-bold text-white tracking-tight">
              Adicionar Livro Manualmente
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-lg"
              aria-label="Fechar modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Informações Básicas
                </h3>

                <Input
                  label="Título *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Digite o título do livro"
                  error={errors.title}
                  disabled={isLoading}
                  required
                />

                <Input
                  label="Subtítulo"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Digite o subtítulo (opcional)"
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Autor *
                  </label>
                  <div className="relative">
                    <Input
                      name="authorName"
                      value={formData.authorName}
                      onChange={(e) => handleAuthorInputChange(e.target.value)}
                      placeholder="Selecione ou digite o nome do autor"
                      error={errors.authorName}
                      disabled={isLoading}
                      required
                    />

                    {/* Author Dropdown */}
                    {showAuthorDropdown && filteredAuthors.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#121214] border border-[#1F1F22] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredAuthors.map((author) => (
                          <button
                            key={author.id}
                            type="button"
                            onClick={() => handleAuthorSelect(author)}
                            className="w-full text-left px-3 py-2 hover:bg-[#1F1F22] transition-colors text-sm text-zinc-200"
                          >
                            {author.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Create New Author Button */}
                  <button
                    type="button"
                    onClick={() => setIsCreatingAuthor(true)}
                    className="flex items-center gap-2 text-xs text-eximia-400 hover:text-eximia-300 transition-colors font-medium mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    Criar Novo Autor
                  </button>
                </div>
              </div>

              {/* Section 2: Publisher Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Detalhes de Publicação
                </h3>

                <Input
                  label="Editora"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Nome da editora"
                  disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Data de Publicação"
                    name="publishedDate"
                    type="date"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <Input
                    label="Páginas"
                    name="pageCount"
                    type="number"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ISBN-13"
                    name="isbn13"
                    value={formData.isbn13}
                    onChange={handleInputChange}
                    placeholder="978-..."
                    disabled={isLoading}
                  />

                  <Input
                    label="ISBN-10"
                    name="isbn10"
                    value={formData.isbn10}
                    onChange={handleInputChange}
                    placeholder="..."
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Idioma
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg h-10 px-4 transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900/50 focus:ring-offset-2 focus:ring-offset-black text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                    >
                      <option value="pt">Português</option>
                      <option value="en">Inglês</option>
                      <option value="es">Espanhol</option>
                      <option value="fr">Francês</option>
                      <option value="de">Alemão</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Categories */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                    Categorias *
                  </h3>
                  <p className="text-xs text-zinc-500">Selecione pelo menos uma categoria</p>
                </div>

                {errors.categories && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="flex items-center gap-2 p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs text-rose-500">{errors.categories}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {BOOK_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategoryToggle(category.name)}
                      disabled={isLoading}
                      aria-pressed={formData.categories.includes(category.name)}
                      aria-label={`${category.label}${formData.categories.includes(category.name) ? ' (selecionado)' : ''}`}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${
                        formData.categories.includes(category.name)
                          ? `bg-[${category.color}] text-white border-2 border-[${category.color}]`
                          : `bg-[#121214] border-2 border-[#1F1F22] text-zinc-300 hover:border-[#2F2F32] focus:ring-zinc-600`
                      }`}
                      style={
                        formData.categories.includes(category.name)
                          ? {
                              backgroundColor: category.color,
                              borderColor: category.color,
                              color: 'white',
                            }
                          : {}
                      }
                    >
                      {formData.categories.includes(category.name) && (
                        <CheckCircle className="w-3 h-3 inline mr-1" aria-hidden="true" />
                      )}
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: Description & Tags */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Conteúdo
                </h3>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Descrição/Sinopse
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição completa do livro"
                    disabled={isLoading}
                    rows={4}
                    className="w-full rounded-lg px-4 py-2 transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900/50 focus:ring-offset-2 focus:ring-offset-black text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>

                <Input
                  label="Tags (separadas por vírgula)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="desenvolvimento pessoal, hábitos, liderança"
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1F1F22] shrink-0">
            <Button
              type="button"
              variant="secondary"
              color="gold"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              color="gold"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Livro'}
            </Button>
          </div>
        </div>
      </div>

      {/* Create Author Modal */}
      {isCreatingAuthor && (
        <CreateAuthorInlineModal
          isOpen={isCreatingAuthor}
          onClose={() => setIsCreatingAuthor(false)}
          onAuthorCreated={handleAuthorCreated}
        />
      )}
    </>
  );
};
