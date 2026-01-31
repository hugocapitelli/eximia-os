// Test Supabase Connection
// Run with: npm run dev (and check browser console)

import { supabase } from './lib/supabase/client'

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test 1: Verify Supabase client configuration
    console.log('Test 1: Verify configuration')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
      console.error('❌ VITE_SUPABASE_URL not configured in .env.local')
      return false
    }

    if (!supabaseKey || supabaseKey === 'your_anon_key') {
      console.error('❌ VITE_SUPABASE_ANON_KEY not configured in .env.local')
      return false
    }

    console.log('✅ Environment variables configured')
    console.log('   URL:', supabaseUrl)
    console.log('   Key:', supabaseKey.substring(0, 20) + '...')

    // Test 2: Get auth session
    console.log('\nTest 2: Auth session')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ Failed to check auth session:', sessionError.message)
      return false
    }

    if (session) {
      console.log('✅ User authenticated:', session.user.email)
      console.log('   User ID:', session.user.id)
    } else {
      console.log('ℹ️ No active session (not logged in)')
      console.log('   👉 Database tables are protected by RLS and require authentication')
    }

    // Test 3: Connection health
    console.log('\nTest 3: Connection health')

    // Just verify the client can make requests (even if RLS blocks them)
    const { error: healthError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    // Error 500 or 401/403 means connection works but RLS is blocking (expected without auth)
    // Only fail on network/config errors
    if (healthError) {
      if (healthError.code === 'PGRST116' || healthError.message.includes('JWT')) {
        console.log('⚠️ RLS policies are active (expected without login)')
        console.log('   Connection to Supabase is working correctly!')
      } else {
        console.error('❌ Database error:', healthError.message)
        console.error('   This might indicate a configuration problem')
        return false
      }
    } else {
      console.log('✅ Database accessible')
    }

    console.log('\n🎉 Supabase client is configured correctly!')
    console.log('📋 Next steps:')
    console.log('   1. Create a user in Supabase Dashboard (Authentication → Users)')
    console.log('   2. Implement login page to authenticate')
    console.log('   3. Access protected data (Academy, Biblioteca) after login')

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
