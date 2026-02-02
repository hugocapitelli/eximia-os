import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import type { Database } from '../lib/supabase/types'

type Book = Database['biblioteca']['Tables']['books']['Row']
type Note = Database['biblioteca']['Tables']['notes']['Row']
type ReadingGoal = Database['biblioteca']['Tables']['reading_goals']['Row']

export function useBiblioteca() {
  // Get user's books
  const getBooks = async (status?: string) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    let query = supabase
      .from('biblioteca.books')
      .select('*, author:authors(*), progress:reading_progress(*)')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    return { data, error }
  }

  // Add book to biblioteca
  const addBook = async (book: Partial<Book>) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('biblioteca.books')
      .insert({
        ...book,
        user_id: user.user.id,
      })
      .select()
      .single()

    return { data, error }
  }

  // Update book
  const updateBook = async (bookId: string, updates: Partial<Book>) => {
    const { data, error } = await supabase
      .from('biblioteca.books')
      .update(updates)
      .eq('id', bookId)
      .select()
      .single()

    return { data, error }
  }

  // Delete book
  const deleteBook = async (bookId: string) => {
    const { data, error } = await supabase
      .from('biblioteca.books')
      .delete()
      .eq('id', bookId)

    return { data, error }
  }

  // Update reading progress
  const updateProgress = async (
    bookId: string,
    currentPage: number,
    totalPages: number
  ) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('biblioteca.reading_progress')
      .upsert({
        user_id: user.user.id,
        book_id: bookId,
        current_page: currentPage,
        total_pages: totalPages,
      })
      .select()
      .single()

    return { data, error }
  }

  // Add note/highlight/quote
  const addNote = async (
    bookId: string,
    content: string,
    type: 'note' | 'highlight' | 'quote',
    pageNumber?: number,
    color?: string
  ) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('biblioteca.notes')
      .insert({
        user_id: user.user.id,
        book_id: bookId,
        content,
        type,
        page_number: pageNumber,
        color,
      })
      .select()
      .single()

    return { data, error }
  }

  // Get notes for a book
  const getNotes = async (bookId: string, type?: string) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    let query = supabase
      .from('biblioteca.notes')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    return { data, error }
  }

  // Get or create reading goal for current year
  const getReadingGoal = async () => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const currentYear = new Date().getFullYear()

    const { data, error } = await supabase
      .from('biblioteca.reading_goals')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('year', currentYear)
      .single()

    return { data, error }
  }

  // Set reading goal
  const setReadingGoal = async (targetBooksCount: number) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const currentYear = new Date().getFullYear()

    const { data, error } = await supabase
      .from('biblioteca.reading_goals')
      .upsert({
        user_id: user.user.id,
        year: currentYear,
        target_books_count: targetBooksCount,
      })
      .select()
      .single()

    return { data, error }
  }

  return {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    updateProgress,
    addNote,
    getNotes,
    getReadingGoal,
    setReadingGoal,
  }
}
