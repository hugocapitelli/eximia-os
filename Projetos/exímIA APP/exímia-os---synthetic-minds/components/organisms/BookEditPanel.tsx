import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { TOKENS } from '../../src/design-tokens';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import BasicInfoSection from '../molecules/BasicInfoSection';
import CategorizationSection from '../molecules/CategorizationSection';
import ContentSection from '../molecules/ContentSection';
import CoverSection from '../molecules/CoverSection';
import FileSection from '../molecules/FileSection';
import AuthorSection from '../molecules/AuthorSection';
import type { BookCatalog, Author, BookFile, ActionResult } from '../../src/types/biblioteca';

/**
 * BookEditPanel Organism Component
 *
 * Comprehensive book editor with 6 major sections:
 * 1. BasicInfoSection - Title, subtitle, author, publisher, published_date
 * 2. CategorizationSection - Categories (multi-select) and tags (free-text)
 * 3. ContentSection - Description textarea + auto-fetch + manual edit
 * 4. CoverSection - Cover URL + file upload + preview
 * 5. FileSection - PDF/EPUB upload + progress + delete
 * 6. AuthorSection - Author combobox + add new author
 *
 * Features:
 * - Form validation with error messages
 * - Unsaved changes warning
 * - Async file uploads (non-blocking)
 * - Loading states for uploads
 * - Error handling and recovery
 *
 * @example
 * <BookEditPanel
 *   book={book}
 *   authors={authors}
 *   bookFile={bookFile}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   onAutoFetchDescription={handleAutoFetch}
 *   onUploadCover={handleCoverUpload}
 *   onUploadFile={handleFileUpload}
 *   onDeleteFile={handleFileDelete}
 *   onAddAuthor={handleAddAuthor}
 * />
 */

export interface BookEditPanelProps {
  /** Book to edit */
  book: Partial<BookCatalog>;

  /** Available authors */
  authors: Author[];

  /** Current book file (if exists) */
  bookFile?: BookFile | null;

  /** Callback when save is clicked */
  onSave: (book: Partial<BookCatalog>) => Promise<ActionResult<any>>;

  /** Callback when cancel is clicked */
  onCancel?: () => void;

  /** Callback for auto-fetch description */
  onAutoFetchDescription?: (title: string, author: string) => Promise<string | null>;

  /** Callback for cover file upload */
  onUploadCover?: (file: File) => Promise<string>;

  /** Callback for book file upload */
  onUploadFile?: (file: File) => Promise<string>;

  /** Callback for file delete */
  onFileDelete?: (fileId: string) => Promise<void>;

  /** Callback when user wants to add new author */
  onAddAuthor?: () => void;

  /** Optional CSS class */
  className?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const BookEditPanel: React.FC<BookEditPanelProps> = ({
  book,
  authors,
  bookFile,
  onSave,
  onCancel,
  onAutoFetchDescription,
  onUploadCover,
  onUploadFile,
  onFileDelete,
  onAddAuthor,
  className = '',
}) => {
  const [formData, setFormData] = useState<Partial<BookCatalog>>(book);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(book);
    setHasUnsavedChanges(hasChanges);
  }, [formData, book]);

  // Warn on page leave if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Field change handler
  const handleFieldChange = useCallback((field: keyof BookCatalog, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = 'Selecione pelo menos uma categoria';
    }

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Save handler
  const handleSave = useCallback(async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrors(
        Object.keys(formData).reduce((acc, field) => {
          if (field === 'title' && (!formData[field as keyof BookCatalog] || formData[field as keyof BookCatalog]?.toString().trim().length === 0)) {
            acc.title = 'Título é obrigatório';
          }
          if (field === 'categories' && (!formData.categories || formData.categories.length === 0)) {
            acc.categories = 'Selecione pelo menos uma categoria';
          }
          return acc;
        }, {} as FormErrors)
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await onSave(formData);
      if (result.success) {
        setSuccessMessage('Livro salvo com sucesso!');
        setHasUnsavedChanges(false);
      } else {
        setErrorMessage(result.error || 'Erro ao salvar livro');
      }
    } catch (error) {
      setErrorMessage('Erro inesperado ao salvar livro');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, validateForm]);

  // Auto-fetch description
  const handleAutoFetch = useCallback(
    async (title: string, author: string) => {
      if (!onAutoFetchDescription) return null;

      setIsLoading(true);
      try {
        const description = await onAutoFetchDescription(title, author);
        return description;
      } catch (error) {
        console.error('Auto-fetch error:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onAutoFetchDescription]
  );

  // Cover upload handler
  const handleCoverUpload = useCallback(
    async (file: File) => {
      if (!onUploadCover) return '';

      setIsLoading(true);
      try {
        const url = await onUploadCover(file);
        setSuccessMessage('Capa enviada com sucesso!');
        return url;
      } catch (error) {
        setErrorMessage('Erro ao enviar capa');
        console.error('Cover upload error:', error);
        return '';
      } finally {
        setIsLoading(false);
      }
    },
    [onUploadCover]
  );

  // File upload handler
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!onUploadFile) return '';

      setIsLoading(true);
      setUploadProgress(0);
      try {
        // Simulate progress updates (in real scenario, this would come from fetch)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const path = await onUploadFile(file);
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Reset progress after delay
        setTimeout(() => setUploadProgress(0), 1000);

        setSuccessMessage('Arquivo enviado com sucesso!');
        return path;
      } catch (error) {
        setErrorMessage('Erro ao enviar arquivo');
        console.error('File upload error:', error);
        setUploadProgress(0);
        return '';
      } finally {
        setIsLoading(false);
      }
    },
    [onUploadFile]
  );

  // File delete handler
  const handleFileDelete = useCallback(
    async (fileId: string) => {
      if (!onFileDelete) return;

      setIsLoading(true);
      try {
        await onFileDelete(fileId);
        setSuccessMessage('Arquivo deletado com sucesso!');
      } catch (error) {
        setErrorMessage('Erro ao deletar arquivo');
        console.error('File delete error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [onFileDelete]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Messages */}
      {successMessage && (
        <Card className="border-green-500/30 bg-green-500/10">
          <p className="text-sm text-green-400">{successMessage}</p>
        </Card>
      )}

      {errorMessage && (
        <Card className="border-rose-500/30 bg-rose-500/10">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-400">{errorMessage}</p>
          </div>
        </Card>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <p className="text-sm text-amber-400">
            Você tem alterações não salvas. Clique em "Salvar" para manter as mudanças.
          </p>
        </Card>
      )}

      {/* Basic Info Section */}
      <Card glow="gold">
        <BasicInfoSection
          book={formData}
          authors={authors}
          onChange={handleFieldChange}
          errors={errors}
        />
      </Card>

      {/* Categorization Section */}
      <Card glow="gold">
        <CategorizationSection
          book={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      </Card>

      {/* Content Section */}
      <Card glow="purple">
        <ContentSection
          book={formData}
          onChange={handleFieldChange}
          onAutoFetch={handleAutoFetch}
          isLoading={isLoading}
          errors={errors}
        />
      </Card>

      {/* Cover Section */}
      <Card glow="gold">
        <CoverSection
          book={formData}
          onChange={handleFieldChange}
          onFileUpload={handleCoverUpload}
          isLoading={isLoading}
          errors={errors}
        />
      </Card>

      {/* File Section */}
      <Card glow="gold">
        <FileSection
          book={formData}
          bookFile={bookFile}
          onChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
          uploadProgress={uploadProgress}
          isLoading={isLoading}
          errors={errors}
        />
      </Card>

      {/* Author Section */}
      <Card glow="purple">
        <AuthorSection
          book={formData}
          authors={authors}
          onChange={handleFieldChange}
          onAddNewAuthor={onAddAuthor}
          errors={errors}
        />
      </Card>

      {/* Actions */}
      <div
        className="flex gap-4 sticky bottom-0 p-6 rounded-xl border"
        style={{
          backgroundColor: TOKENS.colors.tech.surface,
          borderColor: TOKENS.colors.tech.border,
        }}
      >
        {onCancel && (
          <Button
            variant="secondary"
            color="ghost"
            size="md"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Cancelar edição"
          >
            Cancelar
          </Button>
        )}
        <Button
          variant="primary"
          color="gold"
          size="md"
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
          aria-label="Salvar alterações do livro"
          className="flex-1"
        >
          {isSaving ? 'Salvando...' : 'Salvar Livro'}
        </Button>
      </div>
    </div>
  );
};

export default BookEditPanel;
