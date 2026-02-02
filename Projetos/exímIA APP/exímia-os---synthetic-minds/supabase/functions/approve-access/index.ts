// Supabase Edge Function: approve-access
// Aprova solicitação de acesso, cria usuário e envia email
// Deploy: supabase functions deploy approve-access

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ApproveAccessRequest {
  requestId: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase com service_role key (admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request
    const { requestId }: ApproveAccessRequest = await req.json()

    if (!requestId) {
      return new Response(
        JSON.stringify({ error: 'Missing requestId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Buscar dados da solicitação
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('access_requests')
      .select('*')
      .eq('id', requestId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found or already processed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Aprovar solicitação (adiciona à whitelist via RPC)
    const { error: approveError } = await supabaseAdmin.rpc('approve_access_request', {
      request_id: requestId,
    })

    if (approveError) {
      throw new Error(`Failed to approve request: ${approveError.message}`)
    }

    // 3. Criar usuário no auth
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: request.email,
      email_confirm: true,
      user_metadata: {
        full_name: request.name,
      },
    })

    if (createUserError) {
      // Se falhar, pode ser porque usuário já existe
      console.error('Error creating user:', createUserError)

      // Retornar sucesso parcial
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Request approved but user creation failed (user may already exist)',
          userCreated: false,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Gerar link de redefinição de senha
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: request.email,
    })

    if (resetError) {
      throw new Error(`Failed to generate reset link: ${resetError.message}`)
    }

    // 5. Enviar email via função send-email
    const sendEmailResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
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
      console.error('Failed to send email:', await sendEmailResponse.text())
      // Não falhar a operação se email não enviar
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Access approved, user created, and email sent',
        userId: authData.user.id,
        userCreated: true,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
