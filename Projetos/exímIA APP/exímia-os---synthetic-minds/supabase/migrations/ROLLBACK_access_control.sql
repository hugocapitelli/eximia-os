-- =====================================================
-- ROLLBACK SCRIPT - Access Control Migrations
-- =====================================================
-- Use este script se precisar REMOVER todas as migrations
-- de controle de acesso e começar do zero.
--
-- ⚠️ ATENÇÃO: Isso vai DELETAR todas as solicitações de
-- acesso e whitelist. Use apenas se souber o que está fazendo!
-- =====================================================

-- 1. Remover triggers
DROP TRIGGER IF EXISTS check_user_email_allowed_trigger ON auth.users;
DROP TRIGGER IF EXISTS ensure_first_admin_trigger ON public.profiles;

-- 2. Remover funções
DROP FUNCTION IF EXISTS public.check_user_email_allowed() CASCADE;
DROP FUNCTION IF EXISTS public.approve_access_request(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.reject_access_request(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.add_allowed_email(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.remove_allowed_email(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_first_admin() CASCADE;

-- 3. Remover views
DROP VIEW IF EXISTS public.access_requests_dashboard CASCADE;
DROP VIEW IF EXISTS public.allowed_emails_dashboard CASCADE;

-- 4. Remover tabelas (com CASCADE para remover dependências)
DROP TABLE IF EXISTS public.access_requests CASCADE;
DROP TABLE IF EXISTS public.allowed_emails CASCADE;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute este SELECT após o rollback para verificar
-- que tudo foi removido:

SELECT 'Tables' as type, table_name as name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('allowed_emails', 'access_requests')

UNION ALL

SELECT 'Functions' as type, routine_name as name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'check_user_email_allowed',
  'approve_access_request',
  'reject_access_request',
  'add_allowed_email',
  'remove_allowed_email',
  'ensure_first_admin'
);

-- Se este SELECT retornar vazio (0 linhas), o rollback foi completo!
