// ============================================================
// FASE 01: MÓDULO BIBLIOTECA
// TypeScript Interfaces & Types
// Version: 1.0.0
// Date: 2026-02-01
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type BookStatus = 'to_read' | 'reading' | 'completed' | 'abandoned';

export type NoteType = 'note' | 'highlight' | 'quote';

export type ReadingTheme = 'light' | 'sepia' | 'dark';

export type FontSize = 'small' | 'medium' | 'large';

export type BookSearchSource = 'google' | 'openLibrary';

// ============================================================
// DATABASE ENTITIES
// ============================================================

/**
 * Author entity
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
 * Book entity (user's library)
 */
export interface Book {
  id: string;
  user_id: string;
  author_id?: string;

  // Basic data
  title: string;
  description?: string;

  // External IDs
  google_books_id?: string;
  open_library_key?: string;
  isbn10?: string;
  isbn13?: string;

  // Metadata
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
  categories?: string[];

  // Images
  cover_url?: string;
  thumbnail_url?: string;

  // Status & Progress
  status: BookStatus;
  current_page: number;
  progress_percent: number;

  // Timestamps
  created_at: string;
  updated_at: string;
  started_at?: string;
  finished_at?: string;
}

/**
 * Book with author relation
 */
export interface BookWithAuthor extends Book {
  author?: Author;
}

/**
 * Note entity (user's annotations)
 */
export interface Note {
  id: string;
  book_id: string;
  user_id: string;
  type: NoteType;
  content: string;
  page_number?: number;
  chapter?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Book Summary (created by Admin)
 */
export interface BookSummary {
  id: string;
  book_id: string;
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
  book?: Book;
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
// INPUT TYPES (for Server Actions)
// ============================================================

/**
 * Input for creating a book from search
 */
export interface CreateBookFromSearchInput {
  externalId: string;
  source: BookSearchSource;
  status?: BookStatus;

  // Optional overrides
  titleOverride?: string;
  authorOverride?: string;
}

/**
 * Input for creating a book manually
 */
export interface CreateBookManualInput {
  title: string;
  author?: string;
  description?: string;
  isbn13?: string;
  pageCount?: number;
  coverUrl?: string;
  status?: BookStatus;
}

/**
 * Input for updating a book
 */
export interface UpdateBookInput {
  title?: string;
  description?: string;
  status?: BookStatus;
  current_page?: number;
  page_count?: number;
}

/**
 * Input for creating a note
 */
export interface CreateNoteInput {
  book_id: string;
  type: NoteType;
  content: string;
  page_number?: number;
  chapter?: string;
}

/**
 * Input for updating a note
 */
export interface UpdateNoteInput {
  content?: string;
  page_number?: number;
  chapter?: string;
}

/**
 * Input for creating a summary (Admin)
 */
export interface CreateSummaryInput {
  book_id: string;
  title: string;
}

/**
 * Input for creating a chapter (Admin)
 */
export interface CreateChapterInput {
  summary_id: string;
  chapter_number: number;
  title: string;
  subtitle?: string;
  content: string;
}

/**
 * Input for updating a chapter (Admin)
 */
export interface UpdateChapterInput {
  title?: string;
  subtitle?: string;
  content?: string;
  order_index?: number;
}

/**
 * Input for reordering chapters (Admin)
 */
export interface ReorderChaptersInput {
  summary_id: string;
  chapter_ids: string[]; // In new order
}

/**
 * Input for saving reading preferences
 */
export interface SaveReadingPreferencesInput {
  theme?: ReadingTheme;
  font_size?: FontSize;
}

/**
 * Input for saving summary progress
 */
export interface SaveSummaryProgressInput {
  summary_id: string;
  current_chapter: number;
  completed?: boolean;
}

// ============================================================
// FILTER TYPES
// ============================================================

/**
 * Filters for listing books
 */
export interface BookFilters {
  status?: BookStatus | BookStatus[];
  category?: string;
  search?: string;
  author_id?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'title' | 'created_at' | 'updated_at' | 'progress_percent';
  orderDir?: 'asc' | 'desc';
}

/**
 * Filters for listing notes
 */
export interface NoteFilters {
  book_id: string;
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
  book: BookWithAuthor;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showProgress?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
}

/**
 * Props for NoteEditor component
 */
export interface NoteEditorProps {
  bookId: string;
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
  onBookAdded?: (book: Book) => void;
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
];

export const STATUS_LABELS: Record<BookStatus, string> = {
  to_read: 'Quero Ler',
  reading: 'Lendo',
  completed: 'Concluído',
  abandoned: 'Abandonado',
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
