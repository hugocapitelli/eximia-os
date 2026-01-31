# 🔧 RLS Infinite Recursion Fix

## Problema Identificado

**Erro:** `infinite recursion detected in policy for relation "profiles"`

### Causa Raiz

A função `is_admin()` criada na migration 003 causa recursão infinita:

```sql
-- Função problemática
CREATE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles  -- ← Acessa profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy problemática
CREATE POLICY "Admins can do everything"
  ON public.profiles FOR ALL
  USING (public.is_admin());  -- ← Chama is_admin() que acessa profiles novamente!
```

**Loop infinito:**
1. Usuário tenta acessar `profiles`
2. RLS executa policy "Admins can do everything"
3. Policy chama `is_admin()`
4. `is_admin()` tenta SELECT em `profiles`
5. RLS executa policy novamente → **recursão infinita!**

---

## Solução

Migration 004 corrige o problema:

### 1. Remove policies problemáticas da tabela `profiles`
- Remove `"Admins can do everything"` que causa recursão
- Recria policies usando apenas `auth.uid()` (sem função auxiliar)

### 2. Atualiza função `is_admin()`
- Muda de `SECURITY DEFINER` para `SECURITY INVOKER`
- Adiciona tratamento de exceção
- Agora funciona corretamente para outras tabelas (academy, biblioteca)

### 3. Adiciona policy para service role
- Permite operações de admin via backend (usando service_role key)

---

## Como Aplicar

### 1. Abra o Supabase Dashboard

**SQL Editor** → Cole o conteúdo de:
```
supabase/migrations/004_fix_rls_recursion.sql
```

### 2. Execute a migration

Clique em **Run** ou pressione **Ctrl+Enter**

### 3. Verifique as policies

Execute para confirmar:
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';
```

**Resultado esperado:**
- ✅ `Users can read their own profile`
- ✅ `Users can update their own profile`
- ✅ `Service role full access`
- ❌ `Admins can do everything` (removida)

---

## Impacto

### ✅ O que funciona agora

- Usuários autenticados podem ler e atualizar seus próprios perfis
- Backend (service role) pode fazer operações administrativas
- Função `is_admin()` funciona corretamente em outras tabelas (academy, biblioteca)
- **Sem recursão infinita!**

### ⚠️ Limitações

- Usuários normais não podem ver perfis de outros usuários
- Para operações de admin (listar todos usuários, promover admin, etc.), use:
  - Backend com `service_role` key (não expor no frontend!)
  - Ou adicione custom policies conforme necessário

---

## Próximos Passos

Após aplicar a migration:

1. Recarregue a aplicação no navegador
2. Verifique que não há mais erro de recursão
3. Teste de conexão deve passar
4. Crie um usuário e teste login/acesso aos dados

---

**Status:** 🔴 Crítico - Aplicar imediatamente
**Complexidade:** 🟢 Simples - 1 migration SQL
**Impacto:** 🟢 Positivo - Resolve erro bloqueador

— Dex, consertando bugs 🔨
