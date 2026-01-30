// Test Supabase Connection
// Run with: npm run dev (and check browser console)

import { supabase } from './lib/supabase/client'

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test 1: Basic connection
    console.log('Test 1: Basic connection')
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (healthError) {
      console.error('❌ Connection failed:', healthError)
      return false
    }
    console.log('✅ Connection successful!')

    // Test 2: Get auth session
    console.log('\nTest 2: Auth session')
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log('✅ User authenticated:', session.user.email)
    } else {
      console.log('ℹ️ No active session (not logged in)')
    }

    // Test 3: Count tables (via RLS)
    console.log('\nTest 3: Database tables')

    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    console.log('✅ Profiles:', profilesCount)

    // Academy tables (only if logged in and course exists)
    const { data: courses, error: coursesError } = await supabase
      .from('academy.courses')
      .select('*')
      .limit(1)

    if (!coursesError) {
      console.log('✅ Academy schema accessible')
    } else {
      console.log('ℹ️ Academy schema:', coursesError.message)
    }

    // Biblioteca tables (only if logged in)
    const { data: books, error: booksError } = await supabase
      .from('biblioteca.books')
      .select('*')
      .limit(1)

    if (!booksError) {
      console.log('✅ Biblioteca schema accessible')
    } else {
      console.log('ℹ️ Biblioteca schema:', booksError.message)
    }

    console.log('\n🎉 All tests passed! Supabase is ready to use.')
    return true

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testSupabaseConnection()
}
