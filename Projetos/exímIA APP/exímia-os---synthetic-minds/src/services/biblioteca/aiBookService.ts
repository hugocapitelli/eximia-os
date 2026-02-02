// AI Book Service - OpenAI integration for book information
// Uses Supabase Edge Function as proxy to protect API key

import { supabase } from '../../lib/supabase/client';
import type { BookSearchResult } from '../../types/biblioteca';

interface AIBookInfo {
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  publishedDate?: string;
  pageCount?: number;
  language: string;
  isbn13?: string;
  keyInsights?: string[];
}

interface AIBookSuggestion {
  title: string;
  author: string;
  reason: string;
}

/**
 * Generate book information using AI when not found in APIs
 */
export async function generateBookInfo(
  title: string,
  author?: string
): Promise<AIBookInfo | null> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-book-info', {
      body: {
        action: 'generate_info',
        title,
        author,
      },
    });

    if (error) {
      console.error('AI book info error:', error);
      return null;
    }

    return data as AIBookInfo;
  } catch (error) {
    console.error('AI book info error:', error);
    return null;
  }
}

/**
 * Enhance book data with AI-generated description and categories
 */
export async function enhanceBookData(
  book: Partial<BookSearchResult>
): Promise<Partial<BookSearchResult>> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-book-info', {
      body: {
        action: 'enhance',
        title: book.title,
        authors: book.authors,
        existingDescription: book.description,
        existingCategories: book.categories,
      },
    });

    if (error) {
      console.error('AI enhance error:', error);
      return book;
    }

    return {
      ...book,
      description: data.description || book.description,
      categories: data.categories || book.categories,
    };
  } catch (error) {
    console.error('AI enhance error:', error);
    return book;
  }
}

/**
 * Get AI book suggestions based on a topic or theme
 */
export async function getAIBookSuggestions(
  topic: string,
  count: number = 5
): Promise<AIBookSuggestion[]> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-book-info', {
      body: {
        action: 'suggest',
        topic,
        count,
      },
    });

    if (error) {
      console.error('AI suggestions error:', error);
      return [];
    }

    return data.suggestions || [];
  } catch (error) {
    console.error('AI suggestions error:', error);
    return [];
  }
}

/**
 * Convert AI book info to BookSearchResult format
 */
export function aiInfoToSearchResult(aiInfo: AIBookInfo): BookSearchResult {
  return {
    externalId: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: 'ai' as any,
    title: aiInfo.title,
    authors: aiInfo.authors,
    description: aiInfo.description,
    categories: aiInfo.categories,
    publishedDate: aiInfo.publishedDate,
    pageCount: aiInfo.pageCount,
    language: aiInfo.language || 'pt',
    isbn13: aiInfo.isbn13,
  };
}
