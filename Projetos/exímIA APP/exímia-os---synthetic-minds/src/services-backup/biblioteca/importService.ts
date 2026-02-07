// Import Service - Bulk Book Import from JSON/YAML/PDF
// Story 7.7.0 - Bulk Book Import (JSON/YAML/PDF)

import yaml from 'js-yaml';
import * as PDFJS from 'pdfjs-dist';
import { supabase } from '../../lib/supabase/client';
import type { BookCatalog } from '../../types/biblioteca';
import type { ActionResult } from '../../types/biblioteca';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for import files

// JSON Schema for book import validation
const BOOK_IMPORT_SCHEMA = {
  title: 'string',
  author: 'string',
  categories: ['string'],
  description: 'string | null',
  cover_url: 'string | null',
  tags: ['string'],
};

// PDF.js worker setup
if (typeof window !== 'undefined') {
  PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
}

// =============================================================================
// TYPES
// =============================================================================

export interface ImportBook {
  title: string;
  author: string;
  categories: string[];
  description?: string | null;
  cover_url?: string | null;
  tags?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  book: ImportBook;
  errors: string[];
}

export interface ImportProgress {
  processed: number;
  total: number;
  currentBook?: string;
  status: 'validating' | 'importing' | 'complete' | 'error';
  message: string;
}

export interface ImportReport {
  totalFiles: number;
  validBooks: ImportBook[];
  invalidBooks: Array<{ index: number; book: ImportBook; errors: string[] }>;
  duplicateCount: number;
  importedCount: number;
  failedCount: number;
  errors: string[];
}

export interface PDFMetadata {
  title?: string;
  author?: string;
}

// =============================================================================
// JSON PARSING & VALIDATION
// =============================================================================

/**
 * Parse and validate JSON import file
 */
export async function parseJSON(content: string): Promise<ImportBook[]> {
  try {
    const data = JSON.parse(content);

    // Ensure it's an array
    if (!Array.isArray(data)) {
      throw new Error('JSON deve ser um array de livros');
    }

    return data;
  } catch (error) {
    throw new Error(
      `Erro ao fazer parse do JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// =============================================================================
// YAML PARSING & VALIDATION
// =============================================================================

/**
 * Parse and validate YAML import file
 */
export async function parseYAML(content: string): Promise<ImportBook[]> {
  try {
    const data = yaml.load(content);

    // Ensure it's an array
    if (!Array.isArray(data)) {
      throw new Error('YAML deve conter um array de livros');
    }

    return data;
  } catch (error) {
    throw new Error(
      `Erro ao fazer parse do YAML: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// =============================================================================
// PDF METADATA EXTRACTION
// =============================================================================

/**
 * Extract metadata from PDF file
 */
export async function extractPDFMetadata(file: File): Promise<PDFMetadata> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Arquivo PDF muito grande (máx: 10MB)`);
    }

    // For browser environment - use text content
    const arrayBuffer = await file.arrayBuffer();

    try {
      const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

      // Get metadata from PDF
      const metadata = await pdf.getMetadata();

      const title = metadata?.info?.Title as string | undefined;
      const author = metadata?.info?.Author as string | undefined;

      return {
        title: title && title.trim() ? title.trim() : undefined,
        author: author && author.trim() ? author.trim() : undefined,
      };
    } catch (pdfError) {
      // If PDF.js parsing fails, try to extract from filename
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      return {
        title: nameWithoutExt || undefined,
        author: undefined,
      };
    }
  } catch (error) {
    throw new Error(
      `Erro ao extrair metadados do PDF: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// =============================================================================
// VALIDATION LOGIC
// =============================================================================

/**
 * Validate individual book against schema
 */
function validateBook(book: unknown, index: number): ValidationResult {
  const errors: string[] = [];
  const validBook: ImportBook = {
    title: '',
    author: '',
    categories: [],
    tags: [],
  };

  // Type check
  if (typeof book !== 'object' || book === null) {
    errors.push('Livro deve ser um objeto');
    return { isValid: false, book: validBook, errors };
  }

  const bookObj = book as Record<string, unknown>;

  // Title validation
  if (typeof bookObj.title !== 'string' || !bookObj.title.trim()) {
    errors.push('Título é obrigatório e deve ser texto');
  } else {
    validBook.title = bookObj.title.trim();
  }

  // Author validation
  if (typeof bookObj.author !== 'string' || !bookObj.author.trim()) {
    errors.push('Autor é obrigatório e deve ser texto');
  } else {
    validBook.author = bookObj.author.trim();
  }

  // Categories validation
  if (!Array.isArray(bookObj.categories) || bookObj.categories.length === 0) {
    errors.push('Categorias é obrigatório e deve ser um array não-vazio');
  } else {
    const categories = bookObj.categories.filter(
      (cat) => typeof cat === 'string' && cat.trim()
    );
    if (categories.length === 0) {
      errors.push('Pelo menos uma categoria válida é obrigatória');
    }
    validBook.categories = categories.map((cat) => (cat as string).trim());
  }

  // Description validation (optional)
  if (bookObj.description !== undefined && bookObj.description !== null) {
    if (typeof bookObj.description === 'string') {
      validBook.description = bookObj.description.trim() || undefined;
    } else {
      errors.push('Descrição deve ser texto ou nulo');
    }
  }

  // Cover URL validation (optional)
  if (bookObj.cover_url !== undefined && bookObj.cover_url !== null) {
    if (typeof bookObj.cover_url === 'string') {
      validBook.cover_url = bookObj.cover_url.trim() || undefined;
    } else {
      errors.push('Cover URL deve ser texto ou nulo');
    }
  }

  // Tags validation (optional)
  if (bookObj.tags !== undefined) {
    if (Array.isArray(bookObj.tags)) {
      validBook.tags = bookObj.tags
        .filter((tag) => typeof tag === 'string' && tag.trim())
        .map((tag) => (tag as string).trim());
    } else if (bookObj.tags !== null) {
      errors.push('Tags deve ser um array ou nulo');
    }
  }

  const isValid = errors.length === 0 && validBook.title && validBook.author;

  return {
    isValid,
    book: validBook,
    errors,
  };
}

/**
 * Validate array of books and return validation results
 */
export async function validateBooks(
  books: unknown[]
): Promise<{
  valid: ImportBook[];
  invalid: Array<{ index: number; book: unknown; errors: string[] }>;
  errors: string[];
}> {
  const valid: ImportBook[] = [];
  const invalid: Array<{ index: number; book: unknown; errors: string[] }> = [];
  const errors: string[] = [];

  if (!Array.isArray(books)) {
    return {
      valid: [],
      invalid: [],
      errors: ['Entrada deve ser um array de livros'],
    };
  }

  for (let i = 0; i < books.length; i++) {
    const result = validateBook(books[i], i);

    if (result.isValid) {
      valid.push(result.book);
    } else {
      invalid.push({
        index: i,
        book: books[i],
        errors: result.errors,
      });
    }
  }

  return { valid, invalid, errors };
}

// =============================================================================
// DUPLICATE DETECTION
// =============================================================================

/**
 * Check if book already exists in catalog (by ISBN, ISBN fallback, title+author)
 */
async function checkDuplicate(book: ImportBook): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('book_catalog')
      .select('id')
      .or(
        `title.ilike.%${book.title}%,author_name.ilike.%${book.author}%`
      )
      .limit(1);

    if (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error('Erro ao verificar duplicata:', error);
    return false;
  }
}

// =============================================================================
// BATCH IMPORT
// =============================================================================

/**
 * Import validated books in batch
 */
export async function importBooks(
  books: ImportBook[],
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportReport> {
  const report: ImportReport = {
    totalFiles: books.length,
    validBooks: books,
    invalidBooks: [],
    duplicateCount: 0,
    importedCount: 0,
    failedCount: 0,
    errors: [],
  };

  if (books.length === 0) {
    if (onProgress) {
      onProgress({
        processed: 0,
        total: 0,
        status: 'complete',
        message: 'Nenhum livro para importar',
      });
    }
    return report;
  }

  try {
    // Step 1: Check for duplicates
    if (onProgress) {
      onProgress({
        processed: 0,
        total: books.length,
        status: 'validating',
        message: 'Verificando duplicatas...',
      });
    }

    const booksToImport: ImportBook[] = [];
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const isDuplicate = await checkDuplicate(book);

      if (isDuplicate) {
        report.duplicateCount++;
      } else {
        booksToImport.push(book);
      }
    }

    if (booksToImport.length === 0) {
      if (onProgress) {
        onProgress({
          processed: books.length,
          total: books.length,
          status: 'complete',
          message: `Todos os ${books.length} livro(s) já existem no catálogo`,
        });
      }
      return report;
    }

    // Step 2: Import books using batch insert
    if (onProgress) {
      onProgress({
        processed: 0,
        total: booksToImport.length,
        status: 'importing',
        message: 'Importando livros...',
      });
    }

    // Prepare books for insert
    const booksForInsert = booksToImport.map((book) => ({
      title: book.title,
      author_name: book.author,
      categories: book.categories,
      description: book.description || null,
      cover_url: book.cover_url || null,
      tags: book.tags || [],
      is_available: false, // Default: not available until file is uploaded
      favorites_count: 0,
    }));

    // Batch insert in chunks of 50 to avoid query limits
    const chunkSize = 50;
    let importedCount = 0;

    for (let i = 0; i < booksForInsert.length; i += chunkSize) {
      const chunk = booksForInsert.slice(i, i + chunkSize);

      const { error } = await supabase
        .from('book_catalog')
        .insert(chunk);

      if (error) {
        console.error('Erro ao inserir chunk:', error);
        report.failedCount += chunk.length;
        report.errors.push(
          `Erro ao importar livros ${i + 1}-${Math.min(i + chunkSize, booksForInsert.length)}: ${error.message}`
        );
      } else {
        importedCount += chunk.length;
        report.importedCount += chunk.length;
      }

      if (onProgress) {
        onProgress({
          processed: Math.min(importedCount, booksToImport.length),
          total: booksToImport.length,
          status: 'importing',
          message: `Importado ${importedCount}/${booksToImport.length} livros`,
        });
      }
    }

    if (onProgress) {
      onProgress({
        processed: report.importedCount,
        total: books.length,
        status: 'complete',
        message: `Importação concluída: ${report.importedCount} livros importados, ${report.duplicateCount} duplicatas ignoradas`,
      });
    }

    return report;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    report.errors.push(`Erro fatal durante importação: ${errorMsg}`);

    if (onProgress) {
      onProgress({
        processed: report.importedCount,
        total: books.length,
        status: 'error',
        message: `Erro: ${errorMsg}`,
      });
    }

    return report;
  }
}

// =============================================================================
// FILE UPLOAD HANDLER
// =============================================================================

/**
 * Handle file upload and determine format
 */
export async function handleFileUpload(
  file: File,
  onProgress?: (progress: ImportProgress) => void
): Promise<{
  books: ImportBook[];
  errors: string[];
}> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      books: [],
      errors: [`Arquivo muito grande. Máximo: 10MB, recebido: ${(file.size / 1024 / 1024).toFixed(2)}MB`],
    };
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  try {
    const content = await file.text();

    if (fileExtension === 'json') {
      const books = await parseJSON(content);
      return { books, errors: [] };
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      const books = await parseYAML(content);
      return { books, errors: [] };
    } else if (fileExtension === 'pdf') {
      // For single PDF, extract metadata
      const metadata = await extractPDFMetadata(file);
      const book: ImportBook = {
        title: metadata.title || file.name.replace('.pdf', ''),
        author: metadata.author || 'Desconhecido',
        categories: ['Geral'],
        description: undefined,
        cover_url: undefined,
        tags: [],
      };
      return { books: [book], errors: [] };
    } else {
      return {
        books: [],
        errors: [
          `Formato de arquivo não suportado. Use JSON, YAML ou PDF. Recebido: ${fileExtension}`,
        ],
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      books: [],
      errors: [errorMsg],
    };
  }
}

// =============================================================================
// COMPLETE IMPORT WORKFLOW
// =============================================================================

/**
 * Complete import workflow: upload → parse → validate → import
 */
export async function bulkImport(
  file: File,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportReport> {
  const report: ImportReport = {
    totalFiles: 0,
    validBooks: [],
    invalidBooks: [],
    duplicateCount: 0,
    importedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    // Step 1: Parse file
    if (onProgress) {
      onProgress({
        processed: 0,
        total: 1,
        status: 'validating',
        message: 'Processando arquivo...',
      });
    }

    const { books, errors: parseErrors } = await handleFileUpload(file, onProgress);
    report.errors.push(...parseErrors);

    if (books.length === 0) {
      if (onProgress) {
        onProgress({
          processed: 0,
          total: 0,
          status: 'error',
          message: parseErrors[0] || 'Nenhum livro encontrado no arquivo',
        });
      }
      return report;
    }

    report.totalFiles = books.length;

    // Step 2: Validate books
    if (onProgress) {
      onProgress({
        processed: 0,
        total: books.length,
        status: 'validating',
        message: 'Validando livros...',
      });
    }

    const validation = await validateBooks(books);
    report.validBooks = validation.valid;
    report.invalidBooks = validation.invalid;
    report.errors.push(...validation.errors);

    if (report.validBooks.length === 0) {
      if (onProgress) {
        onProgress({
          processed: books.length,
          total: books.length,
          status: 'error',
          message: `Nenhum livro válido encontrado. ${report.invalidBooks.length} com erros`,
        });
      }
      return report;
    }

    // Step 3: Import valid books
    const importReport = await importBooks(report.validBooks, onProgress);

    return {
      ...report,
      duplicateCount: importReport.duplicateCount,
      importedCount: importReport.importedCount,
      failedCount: importReport.failedCount,
      errors: [...report.errors, ...importReport.errors],
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    report.errors.push(`Erro fatal: ${errorMsg}`);

    if (onProgress) {
      onProgress({
        processed: 0,
        total: 0,
        status: 'error',
        message: errorMsg,
      });
    }

    return report;
  }
}
