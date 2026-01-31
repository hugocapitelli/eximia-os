// Email Service - Cliente para enviar emails via Supabase Edge Function
import { supabase } from '../lib/supabase/client'

export type EmailType = 'welcome' | 'password-reset' | 'access-request-confirmation'

interface SendEmailParams {
  type: EmailType
  to: string
  data?: {
    name?: string
    resetLink?: string
    requestId?: string
  }
}

interface EmailResponse {
  success: boolean
  message: string
  id?: string
  error?: string
}

/**
 * Envia email transacional via Supabase Edge Function + Resend
 */
export async function sendEmail(params: SendEmailParams): Promise<EmailResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params,
    })

    if (error) {
      console.error('Email service error:', error)
      return {
        success: false,
        message: 'Falha ao enviar email',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Email enviado com sucesso',
      id: data?.id,
    }
  } catch (err) {
    console.error('Email service exception:', err)
    return {
      success: false,
      message: 'Erro interno ao enviar email',
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Envia email de boas-vindas para novos usuários
 */
export async function sendWelcomeEmail(to: string, name?: string): Promise<EmailResponse> {
  return sendEmail({
    type: 'welcome',
    to,
    data: { name },
  })
}

/**
 * Envia email de recuperação de senha
 */
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<EmailResponse> {
  return sendEmail({
    type: 'password-reset',
    to,
    data: { resetLink },
  })
}

/**
 * Envia confirmação de solicitação de acesso
 */
export async function sendAccessRequestConfirmation(
  to: string,
  name?: string,
  requestId?: string
): Promise<EmailResponse> {
  return sendEmail({
    type: 'access-request-confirmation',
    to,
    data: { name, requestId },
  })
}
