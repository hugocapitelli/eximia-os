# 📋 Guia de Aplicação das Migrations - Controle de Acesso

## ⚠️ IMPORTANTE: Ordem de Execução

Aplique as migrations **exatamente nesta ordem** no Supabase SQL Editor:

---

## 📝 Passo 1: Migration 005 V2 - OAuth Whitelist (VERSÃO CORRIGIDA)

**Arquivo:** `supabase/migrations/005_oauth_whitelist_v2.sql`

**⚠️ IMPORTANTE:** Use a versão **V2** que corrige problemas de colunas faltantes.

**O que faz:**
- Cria/atualiza tabela `allowed_emails` (whitelist)
- Adiciona colunas `added_by` e `notes` se não existirem
- Adiciona trigger que deleta usuários não autorizados automaticamente
- Adiciona seu email (hugocapitelli@gmail.com) à whitelist
- Funções helper: `add_allowed_email()`, `remove_allowed_email()`

**Como aplicar:**
1. Acesse Supabase Dashboard → SQL Editor
2. Copie todo o conteúdo de `005_oauth_whitelist_v2.sql`
3. Cole no editor e clique em **RUN**

---

## 📝 Passo 2: Migration 006 - Access Requests

**Arquivo:** `supabase/migrations/006_access_requests.sql`

**O que faz:**
- Cria tabela `access_requests` (solicitações de acesso)
- Views para dashboard admin
- Funções: `approve_access_request()`, `reject_access_request()`
- RLS configurado

**Como aplicar:**
1. No SQL Editor
2. Copie todo o conteúdo de `006_access_requests.sql`
3. Cole no editor e clique em **RUN**

---

## 📝 Passo 3: Migration 007 - Setup Admin

**Arquivo:** `supabase/migrations/007_setup_admin.sql`

**O que faz:**
- Promove seu email (hugocapitelli@gmail.com) a role **admin**
- Garante que você seja admin automaticamente

**Como aplicar:**
1. No SQL Editor
2. Copie todo o conteúdo de `007_setup_admin.sql`
3. Cole no editor e clique em **RUN**

---

## ✅ Verificação

Após aplicar todas as migrations, execute este SQL para verificar:

```sql
-- 1. Verificar se seu email está na whitelist
SELECT * FROM public.allowed_emails WHERE email = 'hugocapitelli@gmail.com';

-- 2. Verificar se você é admin (após fazer login pela primeira vez)
SELECT id, email, role FROM public.profiles WHERE email = 'hugocapitelli@gmail.com';

-- 3. Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('allowed_emails', 'access_requests', 'profiles');

-- 4. Verificar as funções foram criadas
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('approve_access_request', 'reject_access_request', 'add_allowed_email');
```

**Resultado Esperado:**
- ✅ 1 linha em `allowed_emails` com seu email
- ✅ 3 tabelas encontradas
- ✅ 3+ funções encontradas

---

## 🔥 Teste o Fluxo Completo

### Teste 1: Whitelist Funcionando
1. Tente fazer login com Google usando um email **não autorizado**
2. Login deve ser **bloqueado** com mensagem de erro
3. Verifique os logs do Supabase → Logs → Auth

### Teste 2: Solicitar Acesso
1. Clique em "Solicitar Acesso" na tela de login
2. Preencha o formulário
3. Envie
4. ✅ Mensagem de sucesso deve aparecer

### Teste 3: Admin - Gerenciar Solicitações
1. Faça login com seu email (hugocapitelli@gmail.com)
2. Navegue: **Admin → Configurações → Controle de Acesso**
3. Veja a solicitação na aba "Solicitações"
4. Clique em **Aprovar** (✓)
5. ✅ Email deve ser adicionado à whitelist automaticamente

### Teste 4: Acesso Aprovado
1. Peça para a pessoa cujo email foi aprovado fazer login
2. ✅ Login deve funcionar normalmente

---

## 🔄 Rollback (Recomeçar do Zero)

Se algo der muito errado e você quiser **remover tudo** e recomeçar:

**Arquivo:** `supabase/migrations/ROLLBACK_access_control.sql`

**⚠️ CUIDADO:** Isso vai deletar:
- Todas as solicitações de acesso
- Toda a whitelist de emails
- Todas as funções e triggers relacionados

**Como usar:**
1. Abra SQL Editor no Supabase
2. Copie todo o conteúdo de `ROLLBACK_access_control.sql`
3. Cole e execute
4. Execute o SELECT de verificação (está no final do arquivo)
5. Se retornar 0 linhas, está limpo!
6. Agora pode aplicar as migrations novamente do zero

---

## 🚨 Troubleshooting

### Erro: "column is_admin does not exist"
**Solução:** Use a versão V2 das migrations. Elas usam `role = 'admin'` em vez de `is_admin`.

### Erro: "column notes does not exist"
**Solução:** Use `005_oauth_whitelist_v2.sql` em vez da versão antiga. A V2 adiciona as colunas automaticamente se não existirem.

### Erro: "relation allowed_emails already exists"
**Solução:** Normal! A migration V2 detecta isso e apenas adiciona as colunas faltantes. Execute normalmente.

### Muitos erros / Quero recomeçar
**Solução:**
1. Execute `ROLLBACK_access_control.sql` (remove tudo)
2. Execute as migrations novamente na ordem: 005_v2 → 006 → 007

### Não sou admin após login
**Solução:** Execute manualmente:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'hugocapitelli@gmail.com';
```

### Tabela access_requests vazia
**Normal!** A tabela só terá dados depois que alguém solicitar acesso pelo formulário.

---

## 📊 Estrutura Final do Banco

Após aplicar todas as migrations, você terá:

```
public.profiles
├── id (UUID)
├── email (TEXT)
├── full_name (TEXT)
├── role (TEXT) → 'admin' | 'user' | 'moderator'
└── ... outros campos

public.allowed_emails
├── email (TEXT) PRIMARY KEY
├── added_by (UUID)
├── created_at (TIMESTAMPTZ)
└── notes (TEXT)

public.access_requests
├── id (UUID)
├── name (TEXT)
├── email (TEXT) UNIQUE
├── company (TEXT)
├── message (TEXT)
├── status (TEXT) → 'pending' | 'approved' | 'rejected'
├── created_at (TIMESTAMPTZ)
├── reviewed_at (TIMESTAMPTZ)
├── reviewed_by (UUID)
└── rejection_reason (TEXT)
```

---

**Criado por:** @dev (Dex)
**Data:** 2026-01-31
**Story:** EXIMIA-045
