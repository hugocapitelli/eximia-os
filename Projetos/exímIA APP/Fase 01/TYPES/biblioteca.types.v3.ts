// ============================================================
// FASE 01: MÓDULO BIBLIOTECA — V3 (CATÁLOGO + FAVORITOS)
// TypeScript Interfaces & Types
// Version: 3.0.0
// Date: 2026-02-01
// ============================================================

import { z } from 'zod';

// ============================================================
// ENUMS
// ============================================================

export type NoteType = 'note' | 'highlight' | 'quote';
export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type BookSearchSource = 'google' | 'openLibrary';
export type UserRole = 'user' | 'admin' | 'moderator';

// ============================================================
// ZOD SCHEMAS
// ============================================================

export const NoteTypeSchema = z.enum(['note', 'highlight', 'quote']);
export const ReadingThemeSchema = z.enum(['light', 'sepia', 'dark']);
export const FontSizeSchema = z.enum(['small', 'medium', 'large']);
export const BookSearchSourceSchema = z.enum(['google', 'openLibrary']);

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
 * Book Catalog entity (global)
 */
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
}

/**
 * Book Catalog with summary info (view)
 */
export interface BookCatalogView extends BookCatalog {
  summary_id?: string;
  has_published_summary: boolean;
  chapter_count: number;
  author_bio?: string;
  author_photo?: string;
}

/**
 * User Favorite entity
 */
export interface UserFavorite {
  id: string;
  user_id: string;
  catalog_id: string;
  favorited_at: string;
}

/**
 * User Favorite with catalog data (view)
 */
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

/**
 * Book Summary entity
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
 * Summary Chapter entity
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
 * Summary with chapters and catalog
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
 * User Note entity
 */
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
}

/**
 * Reading Goal entity
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
 * User Stats (view)
 */
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
// INPUT SCHEMAS (Zod)
// ============================================================

export const AddBookToCatalogSchema = z.object({
  google_books_id: z.string().optional(),
  open_library_key: z.string().optional(),
  isbn13: z.string().max(17).optional(),
  isbn10: z.string().max(13).optional(),
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

export const AddBookFromSearchSchema = z.object({
  externalId: z.string(),
  source: BookSearchSourceSchema,
});

export const ToggleFavoriteSchema = z.object({
  catalog_id: z.string().uuid(),
});

export const CreateNoteSchema = z.object({
  catalog_id: z.string().uuid(),
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
// INPUT TYPES
// ============================================================

export type AddBookToCatalogInput = z.infer<typeof AddBookToCatalogSchema>;
export type AddBookFromSearchInput = z.infer<typeof AddBookFromSearchSchema>;
export type ToggleFavoriteInput = z.infer<typeof ToggleFavoriteSchema>;
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

export const NOTE_TYPE_CONFIG: Record<NoteType, { label: string; icon: string; color: string; bgColor: string }> = {
  note: { label: 'Nota', icon: '📝', color: '#3b82f6', bgColor: '#dbeafe' },
  highlight: { label: 'Destaque', icon: '💡', color: '#f59e0b', bgColor: '#fef3c7' },
  quote: { label: 'Citação', icon: '💬', color: '#8b5cf6', bgColor: '#ede9fe' },
};
