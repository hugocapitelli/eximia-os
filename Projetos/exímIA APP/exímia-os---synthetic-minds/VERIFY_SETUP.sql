-- =====================================================
-- SCRIPT DE VERIFICAÇÃO COMPLETA
-- =====================================================
-- Execute este script no Supabase SQL Editor para verificar
-- se tudo está configurado corretamente
-- =====================================================

-- 1. Verificar se as tabelas existem
SELECT 'TABELAS' as categoria, table_name as nome
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'allowed_emails', 'access_requests')
ORDER BY table_name;

-- =====================================================

-- 2. Verificar se a função is_admin existe
SELECT 'FUNÇÕES' as categoria, routine_name as nome
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'is_admin';

-- =====================================================

-- 3. Verificar usuários na tabela profiles
SELECT
  'USUÁRIOS' as categoria,
  email,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- =====================================================

-- 4. Verificar whitelist de emails
SELECT
  'WHITELIST' as categoria,
  email,
  notes,
  created_at
FROM public.allowed_emails
ORDER BY created_at DESC;

-- =====================================================

-- 5. Verificar se hugocapitelli@gmail.com é admin
SELECT
  'STATUS ADMIN' as categoria,
  CASE
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'hugocapitelli@gmail.com' AND role = 'admin')
    THEN '✅ SIM - Você é admin!'
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'hugocapitelli@gmail.com')
    THEN '❌ NÃO - Você existe mas não é admin'
    ELSE '❌ NÃO ENCONTRADO - Você ainda não fez login'
  END as status;

-- =====================================================

-- 6. Promover hugocapitelli@gmail.com a admin (se necessário)
-- Descomente a linha abaixo se você NÃO for admin ainda:

-- UPDATE public.profiles SET role = 'admin' WHERE email = 'hugocapitelli@gmail.com';

-- =====================================================

-- 7. Verificar políticas RLS
SELECT
  'POLÍTICAS RLS' as categoria,
  schemaname,
  tablename,
  policyname,
  CASE
    WHEN cmd = 'r' THEN 'SELECT'
    WHEN cmd = 'w' THEN 'UPDATE'
    WHEN cmd = 'a' THEN 'INSERT'
    WHEN cmd = 'd' THEN 'DELETE'
    WHEN cmd = '*' THEN 'ALL'
  END as operacao
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'allowed_emails', 'access_requests')
ORDER BY tablename, policyname;

-- =====================================================

-- 8. Testar a função is_admin (retornará NULL no SQL Editor)
SELECT
  'TESTE is_admin()' as categoria,
  public.is_admin() as resultado,
  'NULL é normal no SQL Editor (você não está autenticado como usuário)' as nota;

-- =====================================================
-- RESUMO
-- =====================================================

SELECT
  '✅ VERIFICAÇÃO COMPLETA' as resultado,
  'Se você viu dados nas seções acima, está tudo OK!' as mensagem,
  'Agora teste fazendo login no app' as proximo_passo;
