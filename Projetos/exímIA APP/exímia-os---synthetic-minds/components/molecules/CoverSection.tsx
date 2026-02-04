import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { TOKENS } from '@/design-tokens';
import { Input } from '../atoms/Input';
import Button from '../atoms/Button';
import type { BookCatalog } from '@/types/biblioteca';

/**
 * CoverSection Molecule Component
 *
 * Displays cover image management:
 * - URL input for cover image
 * - File upload for cover image
 * - Preview thumbnail of cover
 * - Delete button to remove cover
 * - Image validation and preview
 *
 * @example
 * <CoverSection
 *   book={book}
 *   onChange={handleChange}
 *   onFileUpload={handleFileUpload}
 *   isLoading={isLoading}
 *   errors={errors}
 * />
 */

export interface CoverSectionProps {
  /** Book data */
  book: Partial<BookCatalog>;

  /** Callback when fields change */
  onChange: (field: keyof BookCatalog, value: any) => void;

  /** Callback for file upload */
  onFileUpload?: (file: File) => Promise<string>;

  /** Loading state during upload */
  isLoading?: boolean;

  /** Validation errors by field */
  errors?: Record<string, string>;

  /** Optional CSS class */
  className?: string;
}

const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const CoverSection: React.FC<CoverSectionProps> = ({
  book,
  onChange,
  onFileUpload,
  isLoading = false,
  errors = {},
  className = '',
}) => {
  const [previewError, setPreviewError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      setPreviewError('Tipo de imagem não permitido. Use JPG, PNG ou WebP');
      return;
    }

    // Validate file size
    if (file.size > MAX_COVER_SIZE) {
      setPreviewError(`Arquivo muito grande. Máximo: 5MB (arquivo atual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }

    setPreviewError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      onChange('cover_url', previewUrl);
    };
    reader.readAsDataURL(file);

    // Upload if handler provided
    if (onFileUpload) {
      try {
        const uploadedUrl = await onFileUpload(file);
        onChange('cover_url', uploadedUrl);
      } catch (error) {
        setPreviewError('Erro ao fazer upload da imagem. Tente novamente.');
        console.error('Cover upload error:', error);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveCover = () => {
    onChange('cover_url', null);
    setPreviewError('');
  };

  return (
    <div className={`space-y-4 ${className}`} style={{ padding: TOKENS.spacing.lg }}>
      {/* Section Title */}
      <h3
        className="text-lg font-semibold"
        style={{ color: TOKENS.colors.eximia[400] }}
      >
        Capa do Livro
      </h3>

      {/* Cover URL Input */}
      <div>
        <Input
          label="URL da Capa"
          value={book.cover_url || ''}
          onChange={(e) => onChange('cover_url', e.target.value || null)}
          placeholder="https://exemplo.com/capa.jpg"
          error={errors.cover_url}
          aria-label="URL da Capa do Livro"
        />
      </div>

      {/* File Upload Area */}
      <div>
        <label
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-3"
          htmlFor="cover-file-input"
        >
          Upload de Arquivo
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            id="cover-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            aria-label="Fazer upload do arquivo de capa"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-dashed transition-all duration-200 p-6 text-center hover:border-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: TOKENS.colors.eximia[400],
              backgroundColor: `${TOKENS.colors.eximia[400]}10`,
            }}
            aria-label="Clique para selecionar arquivo de capa"
          >
            <Upload
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: TOKENS.colors.eximia[400] }}
            />
            <p className="text-sm font-medium" style={{ color: TOKENS.colors.eximia[400] }}>
              {isLoading ? 'Enviando...' : 'Clique para selecionar imagem'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              JPG, PNG ou WebP (máx. 5MB)
            </p>
          </button>
        </div>
        {previewError && (
          <span className="text-xs text-rose-500 font-medium mt-2 block">
            {previewError}
          </span>
        )}
      </div>

      {/* Cover Preview */}
      {book.cover_url && (
        <div className="space-y-3">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
            Prévia da Capa
          </label>
          <div
            className="relative rounded-lg overflow-hidden border"
            style={{ borderColor: TOKENS.colors.tech.border }}
          >
            <img
              src={book.cover_url}
              alt="Prévia da capa do livro"
              className="w-full h-64 object-cover"
              onError={() => setPreviewError('Erro ao carregar a imagem. Verifique a URL.')}
            />
            <button
              onClick={handleRemoveCover}
              className="absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 hover:bg-black/50"
              aria-label="Remover capa"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Info Text */}
      {!book.cover_url && (
        <p className="text-xs text-zinc-500">
          Adicione uma capa para o livro usando uma URL ou fazendo upload de um arquivo.
        </p>
      )}
    </div>
  );
};

export default CoverSection;
