# 🚀 Quick Start - Migrations de Controle de Acesso

## ✅ Solução do Erro "column notes does not exist"

Criamos a **versão V2** da migration 005 que:
- ✅ Detecta se a tabela já existe
- ✅ Adiciona colunas faltantes automaticamente
- ✅ Não quebra se você executar múltiplas vezes

---

## 📋 Aplicar Migrations (4 Passos)

### 1️⃣ Migration 005 V2
```
Arquivo: 005_oauth_whitelist_v2.sql
Tempo: ~2 segundos
```

**Abra Supabase SQL Editor → Cole → RUN**

---

### 2️⃣ Migration 006
```
Arquivo: 006_access_requests.sql
Tempo: ~2 segundos
```

**Abra Supabase SQL Editor → Cole → RUN**

---

### 3️⃣ Migration 007
```
Arquivo: 007_setup_admin.sql
Tempo: ~1 segundo
```

**Abra Supabase SQL Editor → Cole → RUN**

---

### 4️⃣ Migration 008 V2 - FIX RLS RECURSION ⚠️
```
Arquivo: 008_fix_rls_recursion_v2.sql
Tempo: ~2 segundos
IMPORTANTE: Corrige erro de recursão infinita!
USE A VERSÃO V2!
```

**Abra Supabase SQL Editor → Cole → RUN**

---

### 5️⃣ Migration 009 - FIX VIEWS PERMISSIONS ⚠️
```
Arquivo: 009_fix_views_permissions.sql
Tempo: ~2 segundos
IMPORTANTE: Corrige erro "permission denied for table users"
```

**Abra Supabase SQL Editor → Cole → RUN**

---

## ✅ Verificação Rápida

Cole este SQL no editor e execute:

```sql
SELECT
  (SELECT COUNT(*) FROM public.allowed_emails) as emails_whitelist,
  (SELECT COUNT(*) FROM public.access_requests) as solicitacoes,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as admins;
```

**Resultado Esperado:**
```
emails_whitelist: 1 (seu email)
solicitacoes: 0 (ainda ninguém solicitou)
admins: 0 ou 1 (será 1 após você fazer login)
```

---

## 🆘 Deu Erro?

### Erro: "infinite recursion detected"
**Solução:** Execute a migration `008_fix_rls_recursion_v2.sql`

### Erro: "function is_admin is not unique"
**Solução:** Execute a migration `008_fix_rls_recursion_v2.sql` (a V2 remove todas as versões antigas primeiro)

### Erro: "permission denied for table users"
**Solução:** Execute a migration `009_fix_views_permissions.sql` (corrige permissões das views)

### Erro: "column notes does not exist"
**Solução:** Execute a migration `005_oauth_whitelist_v2.sql`

### Muitos erros / Quer recomeçar do zero
**Solução:**
```sql
1. Execute: ROLLBACK_access_control.sql
2. Execute: 005_oauth_whitelist_v2.sql
3. Execute: 006_access_requests.sql
4. Execute: 007_setup_admin.sql
5. Execute: 008_fix_rls_recursion_v2.sql
6. Execute: 009_fix_views_permissions.sql
```

### Verificar Status Atual
```sql
-- Ver quais tabelas existem
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND (table_name LIKE '%access%' OR table_name LIKE '%allowed%');

-- Ver se tem a função is_admin
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'is_admin';
```

---

## 📱 Acessar Interface Admin

1. Faça login com: **hugocapitelli@gmail.com**
2. Navegue: **Admin → Configurações**
3. Clique em: **Controle de Acesso**

---

## 🎯 Próximo: Configurar Google OAuth

Depois das migrations, configure o OAuth:

**Supabase Dashboard → Authentication → Providers → Google**

```
Client ID: <SEU_GOOGLE_CLIENT_ID>
Client Secret: <SEU_GOOGLE_CLIENT_SECRET>
```

---

**Dúvidas?** Veja `APPLY_MIGRATIONS_GUIDE.md` para detalhes completos.
