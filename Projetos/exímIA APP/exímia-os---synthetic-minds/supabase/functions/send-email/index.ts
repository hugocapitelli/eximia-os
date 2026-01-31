// Supabase Edge Function: send-email
// Envia emails transacionais via Resend API
// Deploy: supabase functions deploy send-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

// Tipos de email suportados
type EmailType = 'welcome' | 'password-reset' | 'access-request-confirmation' | 'access-approved'

interface EmailRequest {
  type: EmailType
  to: string
  data?: {
    name?: string
    resetLink?: string
    requestId?: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
}

// Templates de email
const getEmailTemplate = (type: EmailType, data: EmailRequest['data'] = {}): EmailTemplate => {
  const templates: Record<EmailType, EmailTemplate> = {
    'welcome': {
      subject: 'Bem vindo ao exímIA OS',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
          <!-- Header com gradiente -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, #f59e0b, transparent);"></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <img src="https://vnwxdjjsapcfiezktywj.supabase.co/storage/v1/object/public/assets/email-logo.png" alt="exímIA OS" width="180" style="display: block;">
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 20px 40px 40px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 16px; text-align: center;">
                Bem-vindo(a)${data.name ? `, ${data.name}` : ''}!
              </h1>

              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                Sua conta foi criada com sucesso. Você agora faz parte da comunidade exímIA.
              </p>

              <div style="background-color: #18181b; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #f59e0b; font-size: 14px; font-weight: 600; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Próximos passos
                </h3>
                <ul style="color: #d4d4d8; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Complete seu perfil</li>
                  <li>Explore a Academy</li>
                  <li>Conheça os agentes disponíveis</li>
                </ul>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="https://app.eximiaventures.com.br/dashboard" style="display: inline-block; background-color: #f59e0b; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Acessar Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f10; padding: 24px 40px; border-top: 1px solid #27272a;">
              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                Este email foi enviado por exímIA.<br>
                Se você não criou esta conta, ignore este email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    },

    'password-reset': {
      subject: 'Recupere sua senha - exímIA',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
          <!-- Header com gradiente -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, #f59e0b, transparent);"></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <img src="https://vnwxdjjsapcfiezktywj.supabase.co/storage/v1/object/public/assets/email-logo.png" alt="exímIA OS" width="180" style="display: block;">
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 20px 40px 40px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 16px; text-align: center;">
                Recuperar Senha
              </h1>

              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${data.resetLink || '#'}" style="display: inline-block; background-color: #f59e0b; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin: 0;">
                  <strong style="color: #f59e0b;">⚠️ Importante:</strong><br>
                  Este link expira em 1 hora. Se você não solicitou a recuperação de senha, ignore este email.
                </p>
              </div>

              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 24px 0 0; text-align: center;">
                Se o botão não funcionar, copie e cole este link no navegador:<br>
                <a href="${data.resetLink || '#'}" style="color: #f59e0b; word-break: break-all;">${data.resetLink || '#'}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f10; padding: 24px 40px; border-top: 1px solid #27272a;">
              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                Este email foi enviado por exímIA.<br>
                Se você não solicitou esta recuperação, sua conta está segura.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    },

    'access-approved': {
      subject: '🎉 Acesso aprovado - Configure sua senha | exímIA OS',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
          <!-- Header com gradiente -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, #22c55e, transparent);"></td>
          </tr>

          <!-- Ícone de sucesso -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <div style="color: white; font-size: 32px; font-weight: bold;">✓</div>
              </div>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 16px; text-align: center;">
                Bem-vindo${data.name ? `, ${data.name}` : ''}! 🎉
              </h1>

              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                Sua solicitação de acesso à <strong style="color: #f59e0b;">exímIA OS</strong> foi <strong style="color: #22c55e;">aprovada</strong>!
              </p>

              <!-- Badge de status -->
              <div style="background-color: #18181b; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <div style="display: inline-block; background-color: #22c55e20; border: 1px solid #22c55e40; border-radius: 8px; padding: 12px 24px; margin-bottom: 16px;">
                  <span style="color: #22c55e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    ✓ Acesso Liberado
                  </span>
                </div>
              </div>

              <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                Para começar, você precisa configurar sua senha de acesso. Clique no botão abaixo:
              </p>

              <!-- Botão CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0 32px;">
                    <a href="${data.resetLink || '#'}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                      Configurar Senha →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Próximos passos -->
              <div style="border-left: 3px solid #f59e0b; padding-left: 20px; margin: 24px 0;">
                <h3 style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
                  📌 Próximos Passos:
                </h3>
                <ol style="color: #a1a1aa; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Clique no botão acima para criar sua senha</li>
                  <li>Faça login em: <a href="https://app.eximiaventures.com.br/login" style="color: #f59e0b; text-decoration: none;">app.eximiaventures.com.br</a></li>
                  <li>Complete seu perfil</li>
                  <li>Explore a Academy e comece sua jornada!</li>
                </ol>
              </div>

              <!-- Aviso de segurança -->
              <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin: 0;">
                  <strong style="color: #f59e0b;">⚠️ Importante:</strong><br>
                  Este link expira em 24 horas. Se não configurar sua senha dentro deste prazo, use a opção "Esqueci minha senha" na tela de login.
                </p>
              </div>

              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 24px 0 0; text-align: center;">
                Se o botão não funcionar, copie e cole este link no navegador:<br>
                <a href="${data.resetLink || '#'}" style="color: #f59e0b; word-break: break-all; font-size: 11px;">${data.resetLink || '#'}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f10; padding: 24px 40px; border-top: 1px solid #27272a;">
              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                Este email foi enviado por exímIA.<br>
                Você está recebendo porque sua solicitação de acesso foi aprovada.
              </p>
              <p style="color: #52525b; font-size: 11px; margin: 8px 0 0; text-align: center;">
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
      `
    },

    'access-request-confirmation': {
      subject: 'Solicitação de acesso recebida - exímIA',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
          <!-- Header com gradiente -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, #f59e0b, transparent);"></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <img src="https://vnwxdjjsapcfiezktywj.supabase.co/storage/v1/object/public/assets/email-logo.png" alt="exímIA OS" width="180" style="display: block;">
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 20px 40px 40px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 16px; text-align: center;">
                Solicitação Recebida!
              </h1>

              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                Recebemos sua solicitação de acesso à plataforma exímIA${data.name ? `, ${data.name}` : ''}.
              </p>

              <div style="background-color: #18181b; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <div style="display: inline-block; background-color: #f59e0b20; border: 1px solid #f59e0b40; border-radius: 8px; padding: 12px 24px; margin-bottom: 16px;">
                  <span style="color: #f59e0b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    Status: Em Análise
                  </span>
                </div>
                ${data.requestId ? `
                <p style="color: #71717a; font-size: 12px; margin: 12px 0 0;">
                  ID da solicitação: <code style="color: #d4d4d8; background-color: #27272a; padding: 2px 8px; border-radius: 4px;">${data.requestId}</code>
                </p>
                ` : ''}
              </div>

              <div style="border-left: 3px solid #f59e0b; padding-left: 20px; margin: 24px 0;">
                <h3 style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0 0 8px;">
                  O que acontece agora?
                </h3>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
                  Nossa equipe irá analisar sua solicitação e entrar em contato em breve.
                  Você receberá um email assim que sua conta for aprovada.
                </p>
              </div>

              <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 24px 0 0; text-align: center;">
                Enquanto isso, acompanhe nossas novidades em<br>
                <a href="https://eximiaventures.com.br" style="color: #f59e0b;">eximia.co</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f10; padding: 24px 40px; border-top: 1px solid #27272a;">
              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                Este email foi enviado por exímIA.<br>
                Se você não fez esta solicitação, ignore este email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    }
  }

  return templates[type]
}

// Handler principal
serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verificar API key
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Parse request
    const { type, to, data }: EmailRequest = await req.json()

    // Validação básica
    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, to' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar tipo de email
    const validTypes: EmailType[] = ['welcome', 'password-reset', 'access-request-confirmation', 'access-approved']
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: `Invalid email type. Valid types: ${validTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obter template
    const template = getEmailTemplate(type, data)

    // Enviar via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'exímIA <noreply@eximiaventures.com.br>',
        to: [to],
        subject: template.subject,
        html: template.html,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend error:', resendData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        id: resendData.id
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
