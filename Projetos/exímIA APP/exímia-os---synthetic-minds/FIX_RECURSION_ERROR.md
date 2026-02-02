# 🔧 Solução Rápida - Erro de Recursão Infinita

## ❌ Erro que Você Está Vendo:

```
ERROR: infinite recursion detected in policy for relation "profiles"
Failed to load resource: the server responded with a status of 500
```

---

## ✅ Solução em 1 Passo:

### Execute Esta Migration:

**Arquivo:** `008_fix_rls_recursion_v2.sql`

1. Abra **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Copie TODO o conteúdo de `008_fix_rls_recursion_v2.sql`
4. Cole no editor
5. Clique em **RUN**

**Tempo:** ~3 segundos

---

## 🔍 O Que Esta Migration Faz:

1. ✅ Remove todas as versões antigas da função `is_admin()`
2. ✅ Cria nova função `is_admin()` com `SECURITY DEFINER`
3. ✅ Recria todas as políticas RLS sem recursão:
   - `profiles` (4 políticas)
   - `allowed_emails` (1 política)
   - `access_requests` (2 políticas)
4. ✅ Adiciona permissões de execução

---

## ✅ Verificar se Funcionou:

Após executar, rode este SQL no SQL Editor:

```sql
-- Teste 1: Função is_admin existe?
SELECT public.is_admin();

-- Teste 2: Consegue acessar as tabelas?
SELECT COUNT(*) FROM public.allowed_emails;
SELECT COUNT(*) FROM public.access_requests;
SELECT COUNT(*) FROM public.profiles;
```

**✅ Resultado Esperado:** Todos retornam valores SEM erro 500

---

## 🎯 Após Aplicar:

1. Recarregue a página de **Controle de Acesso** no app
2. Os erros 500 devem desaparecer
3. Você verá as solicitações e whitelist normalmente

---

## 🆘 Ainda Deu Erro?

### Erro: "function is_admin is not unique"
**Causa:** A V2 não foi usada.
**Solução:** Certifique-se de usar `008_fix_rls_recursion_v2.sql` (não a v1)

### Erro: "permission denied"
**Solução:** Execute este SQL antes:
```sql
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
```

### Muitos erros / Quer recomeçar do zero
1. Execute: `ROLLBACK_access_control.sql`
2. Execute na ordem:
   - `005_oauth_whitelist_v2.sql`
   - `006_access_requests.sql`
   - `007_setup_admin.sql`
   - `008_fix_rls_recursion_v2.sql`

---

## 📊 Estrutura das Políticas Corrigidas:

**ANTES (❌ causava recursão):**
```sql
CREATE POLICY "profiles_select_admin"
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE ...) -- ← Loop infinito!
  );
```

**DEPOIS (✅ sem recursão):**
```sql
-- Função SECURITY DEFINER (contorna RLS)
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE ...);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política usa a função
CREATE POLICY "profiles_select_admin"
  USING (public.is_admin()); -- ← Sem recursão!
```

---

**Execute `008_fix_rls_recursion_v2.sql` agora e teste!** 🚀
