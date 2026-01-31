-- Migration 006: Access Requests System
-- Descrição: Sistema completo de solicitação de acesso e gerenciamento de whitelist
-- Story: EXIMIA-045
-- Data: 2026-01-31

-- =====================================================
-- 1. TABELA DE SOLICITAÇÕES DE ACESSO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  UNIQUE(email)
);

-- Index para buscar por status e data
CREATE INDEX idx_access_requests_status ON public.access_requests(status, created_at DESC);
CREATE INDEX idx_access_requests_email ON public.access_requests(email);

-- =====================================================
-- 2. RLS PARA ACCESS REQUESTS
-- =====================================================

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (não autenticada) pode inserir solicitações
CREATE POLICY "Anyone can request access"
  ON public.access_requests
  FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem visualizar, atualizar e deletar
CREATE POLICY "Admins can manage access requests"
  ON public.access_requests
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- =====================================================
-- 3. FUNÇÃO PARA APROVAR SOLICITAÇÃO
-- =====================================================

CREATE OR REPLACE FUNCTION public.approve_access_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
  request_email TEXT;
  request_name TEXT;
BEGIN
  -- Busca email da solicitação
  SELECT email, name INTO request_email, request_name
  FROM public.access_requests
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
  END IF;

  -- Adiciona email à whitelist
  INSERT INTO public.allowed_emails (email, added_by, notes)
  VALUES (request_email, auth.uid(), 'Aprovado via solicitação de acesso: ' || request_name)
  ON CONFLICT (email) DO NOTHING;

  -- Atualiza status da solicitação
  UPDATE public.access_requests
  SET
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = auth.uid()
  WHERE id = request_id;

  RAISE LOG 'Access request approved for: %', request_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. FUNÇÃO PARA REJEITAR SOLICITAÇÃO
-- =====================================================

CREATE OR REPLACE FUNCTION public.reject_access_request(
  request_id UUID,
  reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.access_requests
  SET
    status = 'rejected',
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    rejection_reason = reason
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
  END IF;

  RAISE LOG 'Access request rejected: %', request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. VIEW PARA DASHBOARD ADMIN
-- =====================================================

CREATE OR REPLACE VIEW public.access_requests_dashboard AS
SELECT
  ar.id,
  ar.name,
  ar.email,
  ar.company,
  ar.message,
  ar.status,
  ar.created_at,
  ar.reviewed_at,
  ar.rejection_reason,
  p.full_name as reviewed_by_name
FROM public.access_requests ar
LEFT JOIN public.profiles p ON ar.reviewed_by = p.id
ORDER BY
  CASE ar.status
    WHEN 'pending' THEN 1
    WHEN 'approved' THEN 2
    WHEN 'rejected' THEN 3
  END,
  ar.created_at DESC;

-- RLS para a view
ALTER VIEW public.access_requests_dashboard SET (security_invoker = true);

-- =====================================================
-- 6. VIEW PARA EMAILS AUTORIZADOS COM METADADOS
-- =====================================================

CREATE OR REPLACE VIEW public.allowed_emails_dashboard AS
SELECT
  ae.email,
  ae.created_at,
  ae.notes,
  p.full_name as added_by_name,
  CASE
    WHEN EXISTS (SELECT 1 FROM auth.users u WHERE u.email = ae.email)
    THEN true
    ELSE false
  END as has_account
FROM public.allowed_emails ae
LEFT JOIN public.profiles p ON ae.added_by = p.id
ORDER BY ae.created_at DESC;

-- RLS para a view
ALTER VIEW public.allowed_emails_dashboard SET (security_invoker = true);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.access_requests IS 'Solicitações de acesso à plataforma';
COMMENT ON FUNCTION public.approve_access_request(UUID) IS 'Aprova solicitação e adiciona email à whitelist';
COMMENT ON FUNCTION public.reject_access_request(UUID, TEXT) IS 'Rejeita solicitação de acesso';
COMMENT ON VIEW public.access_requests_dashboard IS 'Dashboard de solicitações para admins';
COMMENT ON VIEW public.allowed_emails_dashboard IS 'Dashboard de emails autorizados com metadados';
