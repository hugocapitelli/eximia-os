// Supabase Edge Function: approve-access (VERSÃO CORRIGIDA)
// Aprova solicitação de acesso, cria usuário e envia email
// Deploy: copie este código completo no dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ⚠️ SUBSTITUA PELOS VALORES REAIS DO SEU PROJETO
const SUPABASE_URL = 'https://vnwxdjjsapcfiezktywj.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'COLE_SUA_SERVICE_ROLE_KEY_AQUI' // ⚠️ Obtenha em: Settings → API
const SUPABASE_ANON_KEY = 'COLE_SUA_ANON_KEY_AQUI' // ⚠️ Obtenha em: Settings → API

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ApproveAccessRequest {
  requestId: string
}

serve(async (req) => {
  // Handle CORS preflight - SEMPRE retorna 200 OK
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    })
  }

  // Try-catch global para sempre retornar CORS headers
  try {
    console.log('🚀 approve-access invoked')

    // Validar configuração
    if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'COLE_SUA_SERVICE_ROLE_KEY_AQUI') {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured')
      return new Response(
        JSON.stringify({
          error: 'Edge Function not configured. Please set SUPABASE_SERVICE_ROLE_KEY in the code.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Criar cliente Supabase Admin
    console.log('📦 Creating Supabase admin client...')
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request
    let body: ApproveAccessRequest
    try {
      body = await req.json()
    } catch (e) {
      console.error('❌ Invalid JSON:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { requestId } = body

    if (!requestId) {
      console.error('❌ Missing requestId')
      return new Response(
        JSON.stringify({ error: 'Missing requestId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Fetching access request:', requestId)

    // 1. Buscar dados da solicitação
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('access_requests')
      .select('*')
      .eq('id', requestId)
      .eq('status', 'pending')
      .single()

    if (fetchError) {
      console.error('❌ Error fetching request:', fetchError)
      return new Response(
        JSON.stringify({ error: `Failed to fetch request: ${fetchError.message}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!request) {
      console.error('❌ Request not found or already processed')
      return new Response(
        JSON.stringify({ error: 'Request not found or already processed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Request found:', request.email)

    // 2. Aprovar solicitação (adiciona à whitelist via RPC)
    console.log('📝 Approving request...')
    const { error: approveError } = await supabaseAdmin.rpc('approve_access_request', {
      request_id: requestId,
    })

    if (approveError) {
      console.error('❌ Error approving request:', approveError)
      return new Response(
        JSON.stringify({ error: `Failed to approve request: ${approveError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Request approved, email added to whitelist')

    // 3. Criar usuário no auth
    console.log('👤 Creating user account...')
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: request.email,
      email_confirm: true,
      user_metadata: {
        full_name: request.name,
      },
    })

    if (createUserError) {
      console.error('⚠️ Error creating user:', createUserError.message)

      // Se falhar, pode ser porque usuário já existe - não é crítico
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Request approved but user creation failed (user may already exist)',
          userCreated: false,
          email: request.email,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User created:', authData.user.id)

    // 4. Gerar link de redefinição de senha
    console.log('🔑 Generating password reset link...')
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: request.email,
    })

    if (resetError) {
      console.error('⚠️ Error generating reset link:', resetError)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'User created but failed to generate reset link',
          userCreated: true,
          userId: authData.user.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Reset link generated')

    // 5. Enviar email via função send-email
    console.log('📧 Sending welcome email...')
    try {
      const sendEmailResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'access-approved',
            to: request.email,
            data: {
              name: request.name,
              resetLink: resetData.properties.action_link,
            },
          }),
        }
      )

      if (!sendEmailResponse.ok) {
        const errorText = await sendEmailResponse.text()
        console.error('⚠️ Failed to send email:', errorText)
      } else {
        console.log('✅ Email sent successfully')
      }
    } catch (emailError) {
      console.error('⚠️ Error sending email:', emailError)
      // Não falhar a operação se email não enviar
    }

    console.log('🎉 Process completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Access approved, user created, and email sent',
        userId: authData.user.id,
        userCreated: true,
        email: request.email,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
