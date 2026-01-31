-- Migration: Email Logs Table
-- Rastreia emails enviados para debugging e analytics
-- Executar: psql -h db.vnwxdjjsapcfiezktywj.supabase.co -U postgres -d postgres -f 005_email_logs.sql

-- Tabela de logs de email
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Destinatário e tipo
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'password-reset', 'access-request-confirmation')),

  -- Status do envio
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  resend_id TEXT, -- ID retornado pela API do Resend

  -- Metadados
  metadata JSONB DEFAULT '{}',
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,

  -- Associar ao usuário (opcional)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para queries comuns
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);

-- RLS: Apenas admins podem ver logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins (role = 'admin') podem ver todos os logs
CREATE POLICY "Admins can view all email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Service role pode inserir (usado pela Edge Function)
CREATE POLICY "Service role can insert email logs"
  ON email_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Service role pode atualizar status
CREATE POLICY "Service role can update email logs"
  ON email_logs
  FOR UPDATE
  TO service_role
  USING (true);

-- Comentários
COMMENT ON TABLE email_logs IS 'Rastreia emails transacionais enviados via Resend';
COMMENT ON COLUMN email_logs.resend_id IS 'ID único do email retornado pela API do Resend';
COMMENT ON COLUMN email_logs.metadata IS 'Dados adicionais do email (nome, requestId, etc)';
