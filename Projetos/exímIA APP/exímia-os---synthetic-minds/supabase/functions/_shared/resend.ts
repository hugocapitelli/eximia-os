// Shared Resend utilities for Edge Functions

export const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
export const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'exímIA <noreply@eximiaventures.com.br>'

export interface ResendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  reply_to?: string
  tags?: { name: string; value: string }[]
}

export interface ResendResponse {
  id?: string
  error?: {
    message: string
    statusCode: number
  }
}

/**
 * Envia email via Resend API
 */
export async function sendViaResend(params: ResendEmailParams): Promise<ResendResponse> {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable not set')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: params.from || RESEND_FROM_EMAIL,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      reply_to: params.reply_to,
      tags: params.tags,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: {
        message: data.message || 'Failed to send email',
        statusCode: response.status,
      }
    }
  }

  return { id: data.id }
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * CORS headers padrão
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
