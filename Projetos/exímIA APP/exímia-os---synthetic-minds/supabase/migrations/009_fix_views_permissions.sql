-- Migration 009: Fix Views Permissions
-- Descrição: Corrige permissões das views para não acessar auth.users
-- Story: EXIMIA-045
-- Data: 2026-01-31

-- =====================================================
-- 1. REMOVER VIEWS ANTIGAS
-- =====================================================

DROP VIEW IF EXISTS public.access_requests_dashboard CASCADE;
DROP VIEW IF EXISTS public.allowed_emails_dashboard CASCADE;

-- =====================================================
-- 2. RECRIAR VIEW DE ACCESS REQUESTS (SEM auth.users)
-- =====================================================

CREATE VIEW public.access_requests_dashboard AS
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

-- =====================================================
-- 3. RECRIAR VIEW DE ALLOWED EMAILS (SEM auth.users)
-- =====================================================

CREATE VIEW public.allowed_emails_dashboard AS
SELECT
  ae.email,
  ae.created_at,
  ae.notes,
  p.full_name as added_by_name,
  -- Verifica se tem perfil (se fez login alguma vez)
  CASE
    WHEN EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.email = ae.email)
    THEN true
    ELSE false
  END as has_account
FROM public.allowed_emails ae
LEFT JOIN public.profiles p ON ae.added_by = p.id
ORDER BY ae.created_at DESC;

-- =====================================================
-- 4. CONFIGURAR PERMISSÕES DAS VIEWS
-- =====================================================

-- Permitir que usuários autenticados leiam as views
GRANT SELECT ON public.access_requests_dashboard TO authenticated;
GRANT SELECT ON public.allowed_emails_dashboard TO authenticated;

-- =====================================================
-- 5. CRIAR POLÍTICAS RLS PARA AS VIEWS
-- =====================================================

-- Habilitar RLS nas views
ALTER VIEW public.access_requests_dashboard SET (security_invoker = false);
ALTER VIEW public.allowed_emails_dashboard SET (security_invoker = false);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON VIEW public.access_requests_dashboard IS 'Dashboard de solicitações para admins (sem acesso a auth.users)';
COMMENT ON VIEW public.allowed_emails_dashboard IS 'Dashboard de emails autorizados (sem acesso a auth.users)';
