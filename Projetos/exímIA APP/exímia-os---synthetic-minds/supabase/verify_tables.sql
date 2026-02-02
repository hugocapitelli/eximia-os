-- ============================================================================
-- VERIFICAÇÃO: Confirmar que todas as tabelas foram criadas
-- Execute este script no SQL Editor do Supabase para verificar
-- ============================================================================

-- Listar todas as tabelas criadas
SELECT
  schemaname as "Schema",
  tablename as "Tabela",
  CASE
    WHEN schemaname = 'public' THEN '✅ Foundation'
    WHEN schemaname = 'academy' THEN '🎓 Academy'
    WHEN schemaname = 'biblioteca' THEN '📚 Biblioteca'
    ELSE schemaname
  END as "Módulo"
FROM pg_tables
WHERE schemaname IN ('public', 'academy', 'biblioteca')
ORDER BY schemaname, tablename;

-- Contagem de tabelas por schema
SELECT
  schemaname as "Schema",
  COUNT(*) as "Qtd Tabelas"
FROM pg_tables
WHERE schemaname IN ('public', 'academy', 'biblioteca')
GROUP BY schemaname
ORDER BY schemaname;

-- Verificar se RLS está habilitado
SELECT
  schemaname as "Schema",
  tablename as "Tabela",
  CASE
    WHEN rowsecurity THEN '✅ RLS Ativo'
    ELSE '❌ RLS Inativo'
  END as "Segurança"
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname IN ('public', 'academy', 'biblioteca')
ORDER BY schemaname, tablename;

-- Verificar triggers
SELECT
  tgname as "Trigger",
  tgrelid::regclass as "Tabela",
  CASE
    WHEN tgname LIKE '%auth%' THEN '🔐 Auth'
    WHEN tgname LIKE '%updated_at%' THEN '⏰ Timestamp'
    ELSE '📌 Outro'
  END as "Tipo"
FROM pg_trigger
WHERE tgrelid::regclass::text LIKE 'public.%'
   OR tgrelid::regclass::text LIKE 'academy.%'
   OR tgrelid::regclass::text LIKE 'biblioteca.%'
ORDER BY tgrelid::regclass;

-- Resumo final
SELECT
  'public' as schema, 1 as esperado, COUNT(*) as criadas
FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles'
UNION ALL
SELECT
  'academy', 10, COUNT(*)
FROM pg_tables WHERE schemaname = 'academy'
UNION ALL
SELECT
  'biblioteca', 5, COUNT(*)
FROM pg_tables WHERE schemaname = 'biblioteca';
