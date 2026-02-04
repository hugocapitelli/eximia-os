// ============================================================
// FASE 01: MÓDULO BIBLIOTECA — V3 (CATÁLOGO + FAVORITOS)
// TypeScript Interfaces & Types
// Version: 3.0.0
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type NoteType = 'note' | 'highlight' | 'quote';
export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type BookSearchSource = 'google' | 'openLibrary' | 'ai';
export type UserRole = 'user' | 'admin' | 'moderator';

// ============================================================
// DATABASE ENTITIES
// ============================================================

export interface Author {
  id: string;
  name: string;
  bio?: string;
  photo_url?: string;
  mind_id?: string;
  created_at: string;
  updated_at: string;

  // Story 7.1.0: New fields for author profiles
  biography?: string;
  social_links?: Record<string, string>;
  is_verified?: boolean;
}

export interface BookCatalog {
  id: string;
  google_books_id?: string;
  open_library_key?: string;
  isbn13?: string;
  isbn10?: string;
  title: string;
  subtitle?: string;
  author_id?: string;
  author_name?: string;
  description?: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
  categories?: string[];
  cover_url?: string;
  thumbnail_url?: string;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  added_by?: string;

  // Story 7.1.0: New fields for library enhancements
  tags?: string[];
  book_file_path?: string;
  is_available?: boolean;
  synopsys_source?: 'api' | 'manual' | 'ai';
  synopsys_fetched_at?: string;
}

export interface BookCatalogView extends BookCatalog {
  summary_id?: string;
  has_published_summary: boolean;
  chapter_count: number;
  author_bio?: string;
  author_photo?: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  catalog_id: string;
  favorited_at: string;
}

export interface UserFavoriteView extends BookCatalog {
  favorite_id: string;
  user_id: string;
  favorited_at: string;
  summary_id?: string;
  has_published_summary: boolean;
  chapter_count: number;
  current_chapter?: number;
  summary_completed?: boolean;
  last_read_at?: string;
}

export interface BookSummary {
  id: string;
  catalog_id: string;
  title: string;
  created_by: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // UI convenience fields
  status?: 'draft' | 'published';
  version?: number;
  chapter_count?: number;
}

export type BookCategory =
  | 'produtividade'
  | 'psicologia'
  | 'liderança'
  | 'desenvolvimento pessoal'
  | 'hábitos';

export interface BibliotecaStats {
  totalFavorites: number;
  inProgress: number;
  completed: number;
  notStarted: number;
}

// Story 7.1.0: New types for file and tag management
export interface BookFile {
  id: string;
  catalog_id: string;
  file_path: string;
  file_type: 'pdf' | 'epub' | 'json' | 'yaml';
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface BookTag {
  id: string;
  catalog_id: string;
  tag: string;
  created_at: string;
}

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

export interface SummaryWithChapters extends BookSummary {
  chapters: SummaryChapter[];
  catalog?: BookCatalog;
}

export interface UserReadingPreferences {
  id: string;
  user_id: string;
  theme: ReadingTheme;
  font_size: FontSize;
  updated_at: string;
}

export interface SummaryReadingProgress {
  id: string;
  user_id: string;
  summary_id: string;
  current_chapter: number;
  completed: boolean;
  last_read_at: string;
  completed_at?: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  catalog_id: string;
  type: NoteType;
  content: string;
  page_number?: number;
  chapter?: string;
  created_at: string;
  updated_at: string;
  // Optional joined catalog for display
  catalog?: {
    title: string;
    author_name?: string;
    cover_url?: string;
  };
}

export interface ReadingGoal {
  id: string;
  user_id: string;
  year: number;
  target_books: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  favorites_count: number;
  summaries_completed: number;
  notes_count: number;
}

// ============================================================
// EXTERNAL API TYPES
// ============================================================

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

export interface GoogleBooksSearchResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

// ============================================================
// INPUT TYPES
// ============================================================

export interface AddBookToCatalogInput {
  google_books_id?: string;
  open_library_key?: string;
  isbn13?: string;
  isbn10?: string;
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
}

export interface ToggleFavoriteInput {
  catalog_id: string;
}

export interface CreateNoteInput {
  catalog_id: string;
  type: NoteType;
  content: string;
  page_number?: number;
  chapter?: string;
}

export interface UpdateNoteInput {
  content?: string;
  page_number?: number;
  chapter?: string;
}

export interface CreateSummaryInput {
  catalog_id: string;
  title: string;
}

export interface CreateChapterInput {
  summary_id: string;
  chapter_number: number;
  title: string;
  subtitle?: string;
  content: string;
  order_index: number;
}

export interface UpdateChapterInput {
  title?: string;
  subtitle?: string;
  content?: string;
  order_index?: number;
}

export interface ReorderChaptersInput {
  summary_id: string;
  chapter_ids: string[];
}

export interface SaveReadingPreferencesInput {
  theme?: ReadingTheme;
  font_size?: FontSize;
}

export interface SaveSummaryProgressInput {
  summary_id: string;
  current_chapter: number;
  completed?: boolean;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface CatalogFilters {
  search?: string;
  category?: string;
  has_summary?: boolean;
  language?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'title' | 'created_at' | 'favorites_count';
  orderDir?: 'asc' | 'desc';
}

export interface FavoriteFilters {
  has_summary?: boolean;
  summary_completed?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'title' | 'favorited_at';
  orderDir?: 'asc' | 'desc';
}

export interface NoteFilters {
  catalog_id: string;
  type?: NoteType;
  orderBy?: 'created_at' | 'page_number';
  orderDir?: 'asc' | 'desc';
}

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface ReadingModeProps {
  summary: SummaryWithChapters;
  initialChapter?: number;
  userPreferences?: UserReadingPreferences;
  progress?: SummaryReadingProgress;
  onBack?: () => void;
}

export interface BookCardProps {
  book: BookCatalogView;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

export interface FavoriteCardProps {
  favorite: UserFavoriteView;
  onRemove?: () => void;
  onClick?: () => void;
}

export interface NoteEditorProps {
  catalogId: string;
  note?: UserNote;
  defaultType?: NoteType;
  onSave?: (note: UserNote) => void;
  onCancel?: () => void;
}

export interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: (book: BookCatalog) => void;
}

export interface ChapterEditorProps {
  summaryId: string;
  chapter?: SummaryChapter;
  onSave?: (chapter: SummaryChapter) => void;
  onCancel?: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

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

export interface FontSizeConfig {
  name: FontSize;
  label: string;
  size: string;
  lineHeight: string;
}

export interface CategoryConfig {
  name: string;
  label: string;
  color: string;
  bgColor: string;
}

export const THEMES: ThemeConfig[] = [
  {
    name: 'light',
    label: 'Claro',
    colors: { background: '#ffffff', text: '#1a1a1a', accent: '#f59e0b', muted: '#6b7280' },
  },
  {
    name: 'sepia',
    label: 'Sépia',
    colors: { background: '#f4ecd8', text: '#5c4b37', accent: '#b8860b', muted: '#8b7355' },
  },
  {
    name: 'dark',
    label: 'Escuro',
    colors: { background: '#1a1a1a', text: '#e5e5e5', accent: '#f59e0b', muted: '#9ca3af' },
  },
];

export const FONT_SIZES: FontSizeConfig[] = [
  { name: 'small', label: 'A-', size: '14px', lineHeight: '1.6' },
  { name: 'medium', label: 'A', size: '18px', lineHeight: '1.7' },
  { name: 'large', label: 'A+', size: '22px', lineHeight: '1.8' },
];

export const BOOK_CATEGORIES: CategoryConfig[] = [
  { name: 'produtividade', label: 'Produtividade', color: '#10b981', bgColor: '#d1fae5' },
  { name: 'psicologia', label: 'Psicologia', color: '#ec4899', bgColor: '#fce7f3' },
  { name: 'liderança', label: 'Liderança', color: '#f59e0b', bgColor: '#fef3c7' },
  { name: 'desenvolvimento pessoal', label: 'Desenvolvimento Pessoal', color: '#8b5cf6', bgColor: '#ede9fe' },
  { name: 'hábitos', label: 'Hábitos', color: '#06b6d4', bgColor: '#cffafe' },
];

export const NOTE_TYPE_CONFIG: Record<NoteType, { label: string; icon: string; color: string; bgColor: string }> = {
  note: { label: 'Nota', icon: '📝', color: '#3b82f6', bgColor: '#dbeafe' },
  highlight: { label: 'Destaque', icon: '💡', color: '#f59e0b', bgColor: '#fef3c7' },
  quote: { label: 'Citação', icon: '💬', color: '#8b5cf6', bgColor: '#ede9fe' },
};
