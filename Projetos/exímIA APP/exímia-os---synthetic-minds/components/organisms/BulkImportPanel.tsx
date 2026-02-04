// Bulk Import Panel - JSON/YAML/PDF Book Import Component
// Story 7.7.0 - Bulk Book Import

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../atoms/Button';
import {
  bulkImport,
  validateBooks,
  handleFileUpload,
  type ImportBook,
  type ImportReport,
  type ImportProgress,
} from '../../services/biblioteca/importService';

interface BulkImportPanelProps {
  onImportComplete?: (report: ImportReport) => void;
  className?: string;
}

type PanelStep = 'upload' | 'preview' | 'progress' | 'result';

export function BulkImportPanel({
  onImportComplete,
  className = '',
}: BulkImportPanelProps) {
  // State management
  const [step, setStep] = useState<PanelStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [booksToImport, setBooksToImport] = useState<ImportBook[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ index: number; book: ImportBook; errors: string[] }>
  >([]);
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    processed: 0,
    total: 0,
    status: 'validating',
    message: '',
  });
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========================================================================
  // FILE UPLOAD HANDLER
  // ========================================================================

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    const allowedExtensions = ['json', 'yaml', 'yml', 'pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension || '')) {
      toast.error(
        `Tipo de arquivo não suportado. Use: JSON, YAML ou PDF. Recebido: ${fileExtension}`
      );
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        `Arquivo muito grande. Máximo: 10MB, recebido: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      );
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  // ========================================================================
  // FILE PROCESSING
  // ========================================================================

  const processFile = async (file: File) => {
    setIsLoading(true);
    setStep('preview');

    try {
      // Step 1: Parse file
      const { books, errors: parseErrors } = await handleFileUpload(file);

      if (parseErrors.length > 0) {
        toast.error(parseErrors[0]);
        setStep('upload');
        setIsLoading(false);
        return;
      }

      if (books.length === 0) {
        toast.error('Nenhum livro encontrado no arquivo');
        setStep('upload');
        setIsLoading(false);
        return;
      }

      // Step 2: Validate books
      const validation = await validateBooks(books);
      setBooksToImport(validation.valid);
      setValidationErrors(validation.invalid);

      // Show validation results
      if (validation.invalid.length > 0) {
        toast.error(
          `${validation.invalid.length} livro(s) com erro(s) de validação`
        );
      }

      if (validation.valid.length === 0) {
        toast.error('Nenhum livro válido encontrado no arquivo');
        setStep('upload');
        setIsLoading(false);
        return;
      }

      toast.success(`${validation.valid.length} livro(s) pronto(s) para importar`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Erro ao processar arquivo: ${errorMsg}`);
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================================
  // IMPORT HANDLER
  // ========================================================================

  const handleImport = async () => {
    if (booksToImport.length === 0) {
      toast.error('Nenhum livro para importar');
      return;
    }

    setStep('progress');
    setIsLoading(true);

    try {
      const report = await bulkImport(selectedFile!, (progress) => {
        setImportProgress(progress);
      });

      setImportReport(report);
      setStep('result');

      // Trigger callback
      if (onImportComplete) {
        onImportComplete(report);
      }

      // Show success message
      if (report.importedCount > 0) {
        toast.success(
          `${report.importedCount} livro(s) importado(s) com sucesso!`
        );
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Erro durante importação: ${errorMsg}`);
      setStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================================
  // RESET HANDLER
  // ========================================================================

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setBooksToImport([]);
    setValidationErrors([]);
    setImportReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ========================================================================
  // UPLOAD STEP
  // ========================================================================

  const renderUploadStep = () => (
    <div className="bulk-import-upload">
      <div className="upload-container">
        <div className="upload-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h3>Importar Livros em Lote</h3>
        <p>Selecione um arquivo JSON, YAML ou PDF para importar múltiplos livros</p>

        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml,.pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="file-input"
            aria-label="Selecionar arquivo para importação"
          />
          <Button
            type="button"
            disabled={isLoading}
            className="file-input-button"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? `${selectedFile.name}` : 'Escolher Arquivo'}
          </Button>
        </div>

        <div className="file-formats">
          <h4>Formatos Suportados:</h4>
          <div className="format-grid">
            <div className="format-card">
              <span className="format-name">JSON</span>
              <code>{`[{"title": "...", "author": "..."}]`}</code>
            </div>
            <div className="format-card">
              <span className="format-name">YAML</span>
              <code>- title: ...\n  author: ...</code>
            </div>
            <div className="format-card">
              <span className="format-name">PDF</span>
              <code>Extrai título e autor do arquivo</code>
            </div>
          </div>
        </div>

        <div className="schema-info">
          <h4>Schema JSON/YAML Esperado:</h4>
          <pre>{`[
  {
    "title": "string (obrigatório)",
    "author": "string (obrigatório)",
    "categories": ["string"] (obrigatório)",
    "description": "string (opcional)",
    "cover_url": "string (opcional)",
    "tags": ["string"] (opcional)
  }
]`}</pre>
        </div>
      </div>
    </div>
  );

  // ========================================================================
  // PREVIEW STEP
  // ========================================================================

  const renderPreviewStep = () => (
    <div className="bulk-import-preview">
      <div className="preview-header">
        <h3>Preview - Validação de Livros</h3>
        <p>
          {booksToImport.length} livro(s) válido(s)
          {validationErrors.length > 0 && ` · ${validationErrors.length} com erro(s)`}
        </p>
      </div>

      {/* Valid Books */}
      {booksToImport.length > 0 && (
        <div className="preview-section">
          <h4 className="valid-title">✓ Livros Válidos ({booksToImport.length})</h4>
          <div className="books-list">
            {booksToImport.map((book, index) => (
              <div key={index} className="book-preview-item">
                <div className="book-preview-header">
                  <span className="book-index">{index + 1}</span>
                  <div className="book-preview-title">
                    <strong>{book.title}</strong>
                    <span className="book-author">{book.author}</span>
                  </div>
                </div>
                <div className="book-preview-details">
                  {book.categories && book.categories.length > 0 && (
                    <div className="book-categories">
                      {book.categories.map((cat, i) => (
                        <span key={i} className="category-badge">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="book-tags">
                      {book.tags.map((tag, i) => (
                        <span key={i} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {book.description && (
                    <p className="book-description">{book.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invalid Books */}
      {validationErrors.length > 0 && (
        <div className="preview-section errors">
          <h4 className="error-title">✗ Livros com Erros ({validationErrors.length})</h4>
          <div className="errors-list">
            {validationErrors.map((item, index) => (
              <div key={index} className="error-item">
                <div className="error-header">
                  <span className="error-index">#{item.index + 1}</span>
                  <span className="error-count">{item.errors.length} erro(s)</span>
                </div>
                <ul className="error-messages">
                  {item.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="preview-actions">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleImport}
          disabled={isLoading || booksToImport.length === 0}
          loading={isLoading}
        >
          Importar {booksToImport.length} Livro(s)
        </Button>
      </div>
    </div>
  );

  // ========================================================================
  // PROGRESS STEP
  // ========================================================================

  const renderProgressStep = () => (
    <div className="bulk-import-progress">
      <div className="progress-header">
        <h3>Importando Livros</h3>
        <p>{importProgress.message}</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar-wrapper">
          <div className="progress-info">
            <span className="progress-label">
              {importProgress.processed} / {importProgress.total}
            </span>
            <span className="progress-percent">
              {importProgress.total > 0
                ? Math.round((importProgress.processed / importProgress.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${importProgress.total > 0 ? (importProgress.processed / importProgress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {importProgress.currentBook && (
          <div className="progress-current">
            <span className="spinner">⟳</span>
            <span>{importProgress.currentBook}</span>
          </div>
        )}
      </div>

      <div className="progress-status">
        <span className={`status-badge ${importProgress.status}`}>
          {importProgress.status === 'validating' && 'Validando...'}
          {importProgress.status === 'importing' && 'Importando...'}
          {importProgress.status === 'complete' && 'Concluído'}
          {importProgress.status === 'error' && 'Erro'}
        </span>
      </div>
    </div>
  );

  // ========================================================================
  // RESULT STEP
  // ========================================================================

  const renderResultStep = () => {
    if (!importReport) {
      return (
        <div className="bulk-import-result">
          <p>Nenhum relatório disponível</p>
          <Button type="button" onClick={handleReset}>
            Voltar
          </Button>
        </div>
      );
    }

    return (
      <div className="bulk-import-result">
        <div className="result-header">
          <h3>Resultado da Importação</h3>
        </div>

        <div className="result-stats">
          <div className="stat-card success">
            <span className="stat-icon">✓</span>
            <div className="stat-content">
              <span className="stat-label">Importados</span>
              <span className="stat-value">{importReport.importedCount}</span>
            </div>
          </div>

          <div className={`stat-card ${importReport.duplicateCount > 0 ? 'warning' : 'neutral'}`}>
            <span className="stat-icon">⟲</span>
            <div className="stat-content">
              <span className="stat-label">Duplicatas</span>
              <span className="stat-value">{importReport.duplicateCount}</span>
            </div>
          </div>

          <div className={`stat-card ${importReport.failedCount > 0 ? 'error' : 'neutral'}`}>
            <span className="stat-icon">✗</span>
            <div className="stat-content">
              <span className="stat-label">Falhados</span>
              <span className="stat-value">{importReport.failedCount}</span>
            </div>
          </div>

          <div className={`stat-card ${importReport.invalidBooks.length > 0 ? 'warning' : 'neutral'}`}>
            <span className="stat-icon">⚠</span>
            <div className="stat-content">
              <span className="stat-label">Inválidos</span>
              <span className="stat-value">{importReport.invalidBooks.length}</span>
            </div>
          </div>
        </div>

        {/* Errors */}
        {importReport.errors.length > 0 && (
          <div className="result-errors">
            <h4>Erros Encontrados:</h4>
            <ul className="error-list">
              {importReport.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        <div className="result-summary">
          <p>
            <strong>Total de livros processados:</strong> {importReport.totalFiles}
          </p>
          <p>
            <strong>Livros importados com sucesso:</strong> {importReport.importedCount}
          </p>
          {importReport.duplicateCount > 0 && (
            <p>
              <strong>Livros duplicados (ignorados):</strong>{' '}
              {importReport.duplicateCount}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <Button type="button" onClick={handleReset}>
            Importar Mais Livros
          </Button>
        </div>
      </div>
    );
  };

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <div className={`bulk-import-panel ${step} ${className}`}>
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'progress' && renderProgressStep()}
      {step === 'result' && renderResultStep()}
    </div>
  );
}
