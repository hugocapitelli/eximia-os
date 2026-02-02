// Supabase Edge Function: send-welcome-email
// Envia email de boas-vindas via Resend quando acesso é aprovado

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailPayload {
  email: string
  name: string
  resetPasswordLink: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pegar dados do request
    const { email, name, resetPasswordLink }: WelcomeEmailPayload = await req.json()

    // Validar campos obrigatórios
    if (!email || !name || !resetPasswordLink) {
      throw new Error('Missing required fields: email, name, resetPasswordLink')
    }

    // Enviar email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'exímIA OS <noreply@eximia.ventures>',
        to: [email],
        subject: '🎉 Bem-vindo à exímIA OS - Configure sua senha',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #27272A; border-radius: 16px; overflow: hidden;">

                    <!-- Header com borda amber -->
                    <tr>
                      <td style="height: 2px; background: linear-gradient(90deg, transparent, #f59e0b, transparent);"></td>
                    </tr>

                    <!-- Logo e título -->
                    <tr>
                      <td style="padding: 40px 40px 20px;">
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; margin-bottom: 24px;"></div>
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Bem-vindo, ${name}! 🎉</h1>
                      </td>
                    </tr>

                    <!-- Conteúdo -->
                    <tr>
                      <td style="padding: 0 40px 40px;">
                        <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          Sua solicitação de acesso à <strong style="color: #f59e0b;">exímIA OS</strong> foi aprovada!
                        </p>

                        <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          Para começar, você precisa configurar sua senha. Clique no botão abaixo para criar sua senha de acesso:
                        </p>

                        <!-- Botão CTA -->
                        <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px; padding: 14px 32px; text-align: center;">
                              <a href="${resetPasswordLink}" style="color: #000000; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                                Configurar Senha
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Informações adicionais -->
                        <div style="background-color: #18181B; border: 1px solid #27272A; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                          <p style="margin: 0 0 12px; color: #ffffff; font-weight: 600; font-size: 14px;">
                            📌 Próximos Passos:
                          </p>
                          <ol style="margin: 0; padding-left: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.8;">
                            <li>Clique no botão acima para configurar sua senha</li>
                            <li>Faça login em: <a href="${Deno.env.get('APP_URL') || 'http://localhost:3005'}/login" style="color: #f59e0b; text-decoration: none;">exímIA OS</a></li>
                            <li>Explore a plataforma e comece sua jornada!</li>
                          </ol>
                        </div>

                        <!-- Nota de segurança -->
                        <p style="margin: 0; color: #71717a; font-size: 12px; line-height: 1.6;">
                          <strong>Nota de Segurança:</strong> Este link expira em 24 horas. Se não configurar sua senha dentro deste prazo, solicite um novo link de redefinição na tela de login.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #18181B; padding: 24px 40px; border-top: 1px solid #27272A;">
                        <p style="margin: 0 0 8px; color: #71717a; font-size: 12px;">
                          Você está recebendo este email porque sua solicitação de acesso à plataforma exímIA OS foi aprovada.
                        </p>
                        <p style="margin: 0; color: #52525b; font-size: 12px;">
                          © ${new Date().getFullYear()} exímIA Ventures. Todos os direitos reservados.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await resendResponse.json()

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
