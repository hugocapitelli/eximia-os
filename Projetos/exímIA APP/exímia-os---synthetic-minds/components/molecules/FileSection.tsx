import React, { useState } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { TOKENS } from '@/design-tokens';
import Button from '../atoms/Button';
import type { BookCatalog, BookFile } from '@/types/biblioteca';

/**
 * FileSection Molecule Component
 *
 * Displays PDF/EPUB file management:
 * - File upload for PDF or EPUB files
 * - Progress bar during upload
 * - Delete button to remove file
 * - File validation and error messages
 *
 * @example
 * <FileSection
 *   book={book}
 *   bookFile={bookFile}
 *   onChange={handleChange}
 *   onFileUpload={handleFileUpload}
 *   onFileDelete={handleFileDelete}
 *   uploadProgress={progress}
 *   isLoading={isLoading}
 *   errors={errors}
 * />
 */

export interface FileSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Current book file (if exists) */
  bookFile?: BookFile | null;

  /** Callback when fields change */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Callback for file upload */
  onFileUpload?: (file: File) => Promise<string>;

  /** Callback for file delete */
  onFileDelete?: (fileId: string) => Promise<void>;

  /** Upload progress (0-100) */
  uploadProgress?: number;

  /** Loading state during upload */
  isLoading?: boolean;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/epub+zip'];
const ALLOWED_EXTENSIONS = ['.pdf', '.epub'];

export const FileSection: React.FC<FileSectionProps> = ({
  book,
  bookFile,
  onChange,
  onFileUpload,
  onFileDelete,
  uploadProgress = 0,
  isLoading = false,
  errors = {},
  className = '',
}) => {
  const [uploadError, setUploadError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isValidMime = ALLOWED_FILE_TYPES.includes(file.type);
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidMime || !hasValidExt) {
      setUploadError('Tipo de arquivo não permitido. Use PDF ou EPUB');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`Arquivo muito grande. Máximo: 50MB (arquivo atual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }

    setUploadError('');

    // Update book_file_path (for UI purposes)
    onChange('book_file_path', file.name);

    // Upload if handler provided
    if (onFileUpload) {
      try {
        const uploadedPath = await onFileUpload(file);
        onChange('book_file_path', uploadedPath);
        onChange('is_available', true);
      } catch (error) {
        setUploadError('Erro ao fazer upload do arquivo. Tente novamente.');
        console.error('File upload error:', error);
        onChange('book_file_path', null);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async () => {
    if (!bookFile || !onFileDelete) return;

    setDeleteLoading(true);
    try {
      await onFileDelete(bookFile.id);
      onChange('book_file_path', null);
      onChange('is_available', false);
    } catch (error) {
      setUploadError('Erro ao deletar arquivo. Tente novamente.');
      console.error('File delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!book.book_file_path) return null;
    const ext = book.book_file_path.split('.').pop()?.toLowerCase();
    return <FileText className="w-5 h-5" style={{ color: TOKENS.colors.eximia[400] }} />;
  };

  return (
    <div className={`space-y-4 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Arquivo do Livro
      </h3>

      {/* File Upload Area */}
      <div>
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-3"
          htmlFor="book-file-input"
        >
          Upload de PDF ou EPUB
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            id="book-file-input"
            type="file"
            accept=".pdf,.epub,application/pdf,application/epub+zip"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            aria-label="Fazer upload do arquivo do livro"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-dashed transition-all duration-200 p-6 text-center hover:border-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: TOKENS.colors.eximia[400],
              backgroundColor: `${TOKENS.colors.eximia[400]}10`,
            }}
            aria-label="Clique para selecionar arquivo do livro"
          >
            <Upload
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: TOKENS.colors.eximia[400] }}
            />
            <p className="text-sm font-medium" style={{ color: TOKENS.colors.eximia[400] }}>
              {isLoading ? 'Enviando arquivo...' : 'Clique para selecionar arquivo'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              PDF ou EPUB (máx. 50MB)
            </p>
          </button>
        </div>

        {/* Upload Progress Bar */}
        {isLoading && uploadProgress > 0 && (
          <div className="mt-3">
            <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: TOKENS.colors.tech.border }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: TOKENS.colors.eximia[400],
                }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {uploadProgress}% enviado
            </p>
          </div>
        )}

        {uploadError && (
          <span className="text-xs text-rose-500 font-medium mt-2 block">
            {uploadError}
          </span>
        )}
      </div>

      {/* File Display */}
      {book.book_file_path && (
        <div
          className="p-4 rounded-lg border flex items-center justify-between"
          style={{
            backgroundColor: `${TOKENS.colors.eximia[400]}10`,
            borderColor: TOKENS.colors.eximia[400],
          }}
        >
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <p className="text-sm font-medium text-white">
                {book.book_file_path}
              </p>
              <p className="text-xs text-zinc-500">
                {book.is_available ? 'Disponível para leitura' : 'Arquivo pendente'}
              </p>
            </div>
          </div>
          {onFileDelete && bookFile && (
            <Button
              variant="secondary"
              color="gold"
              size="sm"
              onClick={handleDeleteFile}
              disabled={deleteLoading}
              aria-label="Deletar arquivo do livro"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Info Text */}
      {!book.book_file_path && (
        <p className="text-xs text-zinc-500">
          Faça upload de um arquivo PDF ou EPUB para que os leitores possam acessar o conteúdo completo do livro. Os uploads são assíncronos - você pode salvar o livro enquanto o arquivo é enviado.
        </p>
      )}
    </div>
  );
};

export default FileSection;
