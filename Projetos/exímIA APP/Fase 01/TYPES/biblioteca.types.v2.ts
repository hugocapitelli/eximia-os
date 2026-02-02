// ============================================================
// FASE 01: MÓDULO BIBLIOTECA — V2 (CATÁLOGO GLOBAL)
// TypeScript Interfaces & Types
// Version: 2.0.0
// Date: 2026-02-01
// Aprovado por: Aria (Architect)
// ============================================================

import { z } from 'zod';

// ============================================================
// ENUMS
// ============================================================

export type BookStatus = 'to_read' | 'reading' | 'completed' | 'abandoned';

export type NoteType = 'note' | 'highlight' | 'quote';

export type ReadingTheme = 'light' | 'sepia' | 'dark';

export type FontSize = 'small' | 'medium' | 'large';

export type BookSearchSource = 'google' | 'openLibrary';

export type UserRole = 'user' | 'admin' | 'moderator';

// ============================================================
// ZOD SCHEMAS (para validação runtime)
// ============================================================

export const BookStatusSchema = z.enum(['to_read', 'reading', 'completed', 'abandoned']);
export const NoteTypeSchema = z.enum(['note', 'highlight', 'quote']);
export const ReadingThemeSchema = z.enum(['light', 'sepia', 'dark']);
export const FontSizeSchema = z.enum(['small', 'medium', 'large']);
export const BookSearchSourceSchema = z.enum(['google', 'openLibrary']);

// ============================================================
// DATABASE ENTITIES
// ============================================================

/**
 * User Role entity
 */
export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  granted_at: string;
  granted_by?: string;
}

/**
 * Author entity (global)
 */
export interface Author {
  id: string;
  name: string;
  bio?: string;
  photo_url?: string;
  mind_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Book Catalog entity (global - sem user_id)
 */
export interface BookCatalog {
  id: string;

  // External IDs
  google_books_id?: string;
  open_library_key?: string;
  isbn10?: string;
  isbn13?: string;

  // Book data
  title: string;
  subtitle?: string;
  author_id?: string;
  author_name?: string;
  description?: string;

  // Metadata
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
  categories?: string[];

  // Images
  cover_url?: string;
  thumbnail_url?: string;

  // Stats
  readers_count: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * User Book entity (biblioteca pessoal)
 */
export interface UserBook {
  id: string;
  user_id: string;
  catalog_id: string;

  // Personal data
  status: BookStatus;
  current_page: number;
  rating?: number;
  progress_percent: number;

  // Timestamps
  added_at: string;
  started_at?: string;
  finished_at?: string;
  updated_at: string;
}

/**
 * User Book with Catalog data (view)
 */
export interface UserBookWithCatalog extends UserBook {
  // From catalog
  title: string;
  subtitle?: string;
  author_name?: string;
  description?: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
  categories?: string[];
  cover_url?: string;
  thumbnail_url?: string;
  google_books_id?: string;
  readers_count: number;
  has_summary: boolean;
}

/**
 * Note entity (user's annotations)
 */
export interface Note {
  id: string;
  user_book_id: string;
  user_id: string;
  type: NoteType;
  content: string;
  page_number?: number;
  chapter?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Book Summary (created by Admin, global)
 */
export interface BookSummary {
  id: string;
  catalog_id: string;
  title: string;
  created_by: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Summary Chapter
 */
export interface SummaryChapter {
  id: string;
  summary_id: string;
  chapter_number: number;
  title: string;
  subtitle?: string;
  content: string;
  order_index: number;
  word_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Summary with chapters
 */
export interface SummaryWithChapters extends BookSummary {
  chapters: SummaryChapter[];
  catalog?: BookCatalog;
}

/**
 * User Reading Preferences
 */
export interface UserReadingPreferences {
  id: string;
  user_id: string;
  theme: ReadingTheme;
  font_size: FontSize;
  updated_at: string;
}

/**
 * Summary Reading Progress
 */
export interface SummaryReadingProgress {
  id: string;
  user_id: string;
  summary_id: string;
  current_chapter: number;
  completed: boolean;
  last_read_at: string;
  completed_at?: string;
}

/**
 * Reading Goal
 */
export interface ReadingGoal {
  id: string;
  user_id: string;
  year: number;
  target_books: number;
  created_at: string;
  updated_at: string;
}

/**
 * User Reading Stats (from view)
 */
export interface UserReadingStats {
  user_id: string;
  to_read_count: number;
  reading_count: number;
  completed_count: number;
  abandoned_count: number;
  total_books: number;
  total_pages_read: number;
  current_year: number;
  books_completed_this_year: number;
}

// ============================================================
// EXTERNAL API TYPES
// ============================================================

/**
 * Result from external book search
 */
export interface BookSearchResult {
  externalId: string;
  source: BookSearchSource;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  thumbnailUrl?: string;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
}

/**
 * Google Books API Volume
 */
export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    industryIdentifiers?: Array<{
      type: 'ISBN_10' | 'ISBN_13' | 'OTHER';
      identifier: string;
    }>;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
  };
}

/**
 * Google Books API Search Response
 */
export interface GoogleBooksSearchResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

/**
 * Open Library Search Result
 */
export interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  cover_i?: number;
  number_of_pages_median?: number;
  subject?: string[];
  language?: string[];
}

/**
 * Open Library Search Response
 */
export interface OpenLibrarySearchResponse {
  numFound: number;
  docs: OpenLibrarySearchResult[];
}

// ============================================================
// INPUT SCHEMAS (Zod)
// ============================================================

export const AddBookToCatalogSchema = z.object({
  google_books_id: z.string().optional(),
  open_library_key: z.string().optional(),
  isbn10: z.string().max(13).optional(),
  isbn13: z.string().max(17).optional(),
  title: z.string().min(1).max(500),
  subtitle: z.string().max(500).optional(),
  author_name: z.string().max(255).optional(),
  description: z.string().optional(),
  publisher: z.string().max(255).optional(),
  published_date: z.string().optional(),
  page_count: z.number().int().positive().optional(),
  language: z.string().max(10).default('pt'),
  categories: z.array(z.string()).optional(),
  cover_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
});

export const AddBookToLibrarySchema = z.object({
  catalog_id: z.string().uuid(),
  status: BookStatusSchema.default('to_read'),
});

export const AddBookFromSearchSchema = z.object({
  externalId: z.string(),
  source: BookSearchSourceSchema,
  status: BookStatusSchema.default('to_read'),
});

export const UpdateUserBookSchema = z.object({
  status: BookStatusSchema.optional(),
  current_page: z.number().int().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const CreateNoteSchema = z.object({
  user_book_id: z.string().uuid(),
  type: NoteTypeSchema,
  content: z.string().min(1).max(10000),
  page_number: z.number().int().positive().optional(),
  chapter: z.string().max(255).optional(),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  page_number: z.number().int().positive().optional(),
  chapter: z.string().max(255).optional(),
});

export const CreateSummarySchema = z.object({
  catalog_id: z.string().uuid(),
  title: z.string().min(1).max(500),
});

export const CreateChapterSchema = z.object({
  summary_id: z.string().uuid(),
  chapter_number: z.number().int().positive(),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(500).optional(),
  content: z.string().min(1),
  order_index: z.number().int().min(0),
});

export const UpdateChapterSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  order_index: z.number().int().min(0).optional(),
});

export const ReorderChaptersSchema = z.object({
  summary_id: z.string().uuid(),
  chapter_ids: z.array(z.string().uuid()),
});

export const SaveReadingPreferencesSchema = z.object({
  theme: ReadingThemeSchema.optional(),
  font_size: FontSizeSchema.optional(),
});

export const SaveSummaryProgressSchema = z.object({
  summary_id: z.string().uuid(),
  current_chapter: z.number().int().positive(),
  completed: z.boolean().optional(),
});

// ============================================================
// INPUT TYPES (inferidos dos schemas)
// ============================================================

export type AddBookToCatalogInput = z.infer<typeof AddBookToCatalogSchema>;
export type AddBookToLibraryInput = z.infer<typeof AddBookToLibrarySchema>;
export type AddBookFromSearchInput = z.infer<typeof AddBookFromSearchSchema>;
export type UpdateUserBookInput = z.infer<typeof UpdateUserBookSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type CreateSummaryInput = z.infer<typeof CreateSummarySchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type UpdateChapterInput = z.infer<typeof UpdateChapterSchema>;
export type ReorderChaptersInput = z.infer<typeof ReorderChaptersSchema>;
export type SaveReadingPreferencesInput = z.infer<typeof SaveReadingPreferencesSchema>;
export type SaveSummaryProgressInput = z.infer<typeof SaveSummaryProgressSchema>;

// ============================================================
// FILTER TYPES
// ============================================================

/**
 * Filters for listing user books
 */
export interface UserBookFilters {
  status?: BookStatus | BookStatus[];
  category?: string;
  search?: string;
  has_summary?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'title' | 'added_at' | 'updated_at' | 'progress_percent' | 'rating';
  orderDir?: 'asc' | 'desc';
}

/**
 * Filters for listing catalog books
 */
export interface CatalogFilters {
  search?: string;
  category?: string;
  has_summary?: boolean;
  language?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'title' | 'created_at' | 'readers_count';
  orderDir?: 'asc' | 'desc';
}

/**
 * Filters for listing notes
 */
export interface NoteFilters {
  user_book_id: string;
  type?: NoteType;
  orderBy?: 'created_at' | 'page_number';
  orderDir?: 'asc' | 'desc';
}

// ============================================================
// RESPONSE TYPES
// ============================================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Action result
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ============================================================
// COMPONENT PROPS TYPES
// ============================================================

/**
 * Props for ReadingMode component
 */
export interface ReadingModeProps {
  summary: SummaryWithChapters;
  initialChapter?: number;
  userPreferences?: UserReadingPreferences;
  progress?: SummaryReadingProgress;
}

/**
 * Props for BookCard component
 */
export interface BookCardProps {
  book: UserBookWithCatalog;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showProgress?: boolean;
  showStatus?: boolean;
  showSummaryBadge?: boolean;
  onClick?: () => void;
}

/**
 * Props for CatalogBookCard component
 */
export interface CatalogBookCardProps {
  book: BookCatalog;
  isInLibrary?: boolean;
  onAddToLibrary?: () => void;
  onClick?: () => void;
}

/**
 * Props for NoteEditor component
 */
export interface NoteEditorProps {
  userBookId: string;
  note?: Note;
  defaultType?: NoteType;
  onSave?: (note: Note) => void;
  onCancel?: () => void;
}

/**
 * Props for BookSearchModal component
 */
export interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: (book: UserBookWithCatalog) => void;
}

/**
 * Props for ChapterEditor component (Admin)
 */
export interface ChapterEditorProps {
  summaryId: string;
  chapter?: SummaryChapter;
  onSave?: (chapter: SummaryChapter) => void;
  onCancel?: () => void;
}

/**
 * Props for SummaryEditor component (Admin)
 */
export interface SummaryEditorProps {
  catalogId: string;
  summary?: SummaryWithChapters;
  onSave?: (summary: BookSummary) => void;
  onPublish?: () => void;
}

// ============================================================
// UTILITY TYPES
// ============================================================

/**
 * Theme configuration
 */
export interface ThemeConfig {
  name: ReadingTheme;
  label: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    muted: string;
  };
}

/**
 * Font size configuration
 */
export interface FontSizeConfig {
  name: FontSize;
  label: string;
  size: string;
  lineHeight: string;
}

/**
 * Category with color
 */
export interface CategoryConfig {
  name: string;
  label: string;
  color: string;
  bgColor: string;
}

// ============================================================
// CONSTANTS
// ============================================================

export const THEMES: ThemeConfig[] = [
  {
    name: 'light',
    label: 'Claro',
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#f59e0b',
      muted: '#6b7280',
    },
  },
  {
    name: 'sepia',
    label: 'Sépia',
    colors: {
      background: '#f4ecd8',
      text: '#5c4b37',
      accent: '#b8860b',
      muted: '#8b7355',
    },
  },
  {
    name: 'dark',
    label: 'Escuro',
    colors: {
      background: '#1a1a1a',
      text: '#e5e5e5',
      accent: '#f59e0b',
      muted: '#9ca3af',
    },
  },
];

export const FONT_SIZES: FontSizeConfig[] = [
  { name: 'small', label: 'A-', size: '14px', lineHeight: '1.6' },
  { name: 'medium', label: 'A', size: '18px', lineHeight: '1.7' },
  { name: 'large', label: 'A+', size: '22px', lineHeight: '1.8' },
];

export const BOOK_CATEGORIES: CategoryConfig[] = [
  { name: 'CIENCIA', label: 'Ciência', color: '#3b82f6', bgColor: '#dbeafe' },
  { name: 'FILOSOFIA', label: 'Filosofia', color: '#8b5cf6', bgColor: '#ede9fe' },
  { name: 'PSICOLOGIA', label: 'Psicologia', color: '#ec4899', bgColor: '#fce7f3' },
  { name: 'PRODUTIVIDADE', label: 'Produtividade', color: '#10b981', bgColor: '#d1fae5' },
  { name: 'NEGOCIOS', label: 'Negócios', color: '#f59e0b', bgColor: '#fef3c7' },
  { name: 'TECNOLOGIA', label: 'Tecnologia', color: '#06b6d4', bgColor: '#cffafe' },
  { name: 'BIOGRAFIAS', label: 'Biografias', color: '#ef4444', bgColor: '#fee2e2' },
  { name: 'HISTORIA', label: 'História', color: '#84cc16', bgColor: '#ecfccb' },
  { name: 'FICCAO', label: 'Ficção', color: '#a855f7', bgColor: '#f3e8ff' },
];

export const STATUS_LABELS: Record<BookStatus, string> = {
  to_read: 'Quero Ler',
  reading: 'Lendo',
  completed: 'Concluído',
  abandoned: 'Abandonado',
};

export const STATUS_COLORS: Record<BookStatus, { color: string; bgColor: string }> = {
  to_read: { color: '#6b7280', bgColor: '#f3f4f6' },
  reading: { color: '#f59e0b', bgColor: '#fef3c7' },
  completed: { color: '#10b981', bgColor: '#d1fae5' },
  abandoned: { color: '#ef4444', bgColor: '#fee2e2' },
};

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  note: 'Nota',
  highlight: 'Destaque',
  quote: 'Citação',
};

export const NOTE_TYPE_ICONS: Record<NoteType, string> = {
  note: '📝',
  highlight: '💡',
  quote: '💬',
};

export const NOTE_TYPE_COLORS: Record<NoteType, { color: string; bgColor: string }> = {
  note: { color: '#3b82f6', bgColor: '#dbeafe' },
  highlight: { color: '#f59e0b', bgColor: '#fef3c7' },
  quote: { color: '#8b5cf6', bgColor: '#ede9fe' },
};
