# Troubleshooting - Supabase Migrations

## Error: Trigger "on_auth_user_created" already exists

### Problema
```
Error: Failed to run sql query: ERROR: 42710: trigger "on_auth_user_created" for relation "users" already exists
```

Este erro ocorre quando:
1. A migration foi parcialmente aplicada antes
2. Já existe um trigger com esse nome de outra implementação

### Soluções

#### Opção 1: Use a Migration Corrigida (RECOMENDADO)

Em vez de usar `000_profiles_table.sql`, use a versão corrigida:

```sql
-- Use este arquivo:
supabase/migrations/000_profiles_table_fixed.sql
```

Esta versão:
- ✅ Usa `DROP TRIGGER IF EXISTS` antes de criar
- ✅ Usa `CREATE TABLE IF NOT EXISTS`
- ✅ Adiciona `ON CONFLICT DO NOTHING` para evitar duplicatas
- ✅ Dropa e recria as policies RLS

**Como aplicar:**
1. No SQL Editor do Supabase
2. Cole o conteúdo de `000_profiles_table_fixed.sql`
3. Clique em "Run"

---

#### Opção 2: Remover o Trigger Existente

Se você tem certeza que pode remover o trigger existente:

```sql
-- 1. Verificar se o trigger existe
SELECT tgname
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 2. Dropar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Agora aplicar a migration original
-- Cole o conteúdo de 000_profiles_table.sql
```

---

#### Opção 3: Rollback Completo (Se necessário recomeçar)

Se você quiser remover TUDO e recomeçar do zero:

```sql
-- 1. Execute o rollback
-- Cole o conteúdo de supabase/migrations/000_rollback_profiles.sql

-- 2. Verifique que tudo foi removido
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles';
-- Deve retornar vazio

-- 3. Agora aplique a migration fixed
-- Cole o conteúdo de 000_profiles_table_fixed.sql
```

---

## Error: Table "profiles" already exists

### Problema
```
Error: relation "profiles" already exists
```

### Solução
Use a migration fixed que tem `CREATE TABLE IF NOT EXISTS`.

---

## Error: Policy "profiles_select_own" already exists

### Problema
```
Error: policy "profiles_select_own" already exists
```

### Solução
A migration fixed dropa as policies existentes antes de recriá-las:

```sql
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
```

---

## Verificar Status das Migrations

### Verificar se a tabela profiles existe

```sql
SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename = 'profiles'
);
```

### Verificar se o trigger existe

```sql
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

### Verificar RLS policies

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'profiles';
```

### Verificar funções

```sql
SELECT proname, prokind
FROM pg_proc
WHERE proname IN ('handle_new_user', 'update_profiles_updated_at');
```

---

## Ordem Correta de Aplicação

### Primeira Vez (Banco limpo)
```
1. 000_profiles_table_fixed.sql
2. 001_academy_schema.sql
3. 002_biblioteca_schema.sql
4. 003_rls_policies.sql
```

### Se já aplicou parcialmente
```
1. 000_rollback_profiles.sql (limpar)
2. 000_profiles_table_fixed.sql (reaplicar)
3. Continue com as próximas migrations
```

---

## Testar se Funcionou

Após aplicar a migration 000, teste:

### 1. Criar um usuário de teste
```sql
-- No Supabase Dashboard → Authentication → Users
-- Clique em "Add user" → "Create new user"
-- Email: teste@exemplo.com
-- Password: senha123
-- Auto Confirm User: ✅ (marque esta opção)
```

### 2. Verificar se o profile foi criado automaticamente
```sql
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'teste@exemplo.com';
```

Se retornar uma linha, está funcionando! ✅

### 3. Testar RLS (Row Level Security)
```sql
-- Como admin (no SQL Editor), você deve ver todos os profiles
SELECT * FROM public.profiles;

-- Simular acesso como usuário específico (altere o UUID)
SET request.jwt.claim.sub = 'user-uuid-aqui';
SELECT * FROM public.profiles; -- Deve retornar apenas o profile do usuário
```

---

## Ainda com Problemas?

### Coletar Informações de Debug

Execute este script para coletar informações úteis:

```sql
-- Informações de debug
SELECT 'Tabelas' as tipo, tablename as nome
FROM pg_tables
WHERE schemaname = 'public'
UNION ALL
SELECT 'Triggers', tgname
FROM pg_trigger
WHERE tgname LIKE '%profile%' OR tgname LIKE '%user%'
UNION ALL
SELECT 'Policies', policyname
FROM pg_policies
WHERE tablename = 'profiles'
UNION ALL
SELECT 'Funções', proname
FROM pg_proc
WHERE proname LIKE '%profile%' OR proname LIKE '%user%';
```

Copie o resultado e compartilhe para análise.

---

## Rollback de Emergência

Se TUDO der errado e você quiser recomeçar do ZERO:

```sql
-- ATENÇÃO: Isso vai deletar TUDO!
-- Use apenas se tiver certeza

-- 1. Dropar todos os schemas
DROP SCHEMA IF EXISTS biblioteca CASCADE;
DROP SCHEMA IF EXISTS academy CASCADE;

-- 2. Dropar a tabela profiles
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Dropar todas as funções
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_profiles_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS academy.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS biblioteca.update_updated_at() CASCADE;

-- 4. Agora reaplique todas as migrations em ordem
```

---

## Dicas de Prevenção

1. **Sempre use as versões "fixed"** das migrations se aplicando pela primeira vez
2. **Teste em projeto de desenvolvimento** antes de aplicar em produção
3. **Faça backup** antes de aplicar migrations em produção
4. **Use Supabase CLI** para versionamento automático de migrations
5. **Documente** todas as alterações manuais feitas no banco

---

**Última Atualização:** 2026-01-30
**Mantido por:** Dex (Dev Agent)
