import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import type { Database } from '../lib/supabase/types'

type Course = Database['academy']['Tables']['courses']['Row']
type Enrollment = Database['academy']['Tables']['enrollments']['Row']

export function useAcademy() {
  // Get published courses
  const getCourses = async () => {
    const { data, error } = await supabase
      .from('academy.courses')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    return { data, error }
  }

  // Get course by slug
  const getCourse = async (slug: string) => {
    const { data, error } = await supabase
      .from('academy.courses')
      .select('*, modules(*, lessons(*))')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    return { data, error }
  }

  // Enroll in course
  const enrollCourse = async (courseId: string) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('academy.enrollments')
      .insert({
        user_id: user.user.id,
        course_id: courseId,
        status: 'active'
      })
      .select()
      .single()

    return { data, error }
  }

  // Get user enrollments
  const getEnrollments = async () => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('academy.enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', user.user.id)
      .order('enrolled_at', { ascending: false })

    return { data, error }
  }

  // Update lesson progress
  const updateLessonProgress = async (
    lessonId: string,
    enrollmentId: string,
    completed: boolean
  ) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('academy.lesson_progress')
      .upsert({
        user_id: user.user.id,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        is_completed: completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .select()
      .single()

    return { data, error }
  }

  return {
    getCourses,
    getCourse,
    enrollCourse,
    getEnrollments,
    updateLessonProgress,
  }
}
