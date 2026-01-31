# 📧 Setup Resend Email - Sistema de Boas-Vindas

## 🎯 O Que Isso Faz:

Quando você **aprovar uma solicitação de acesso**:
1. ✅ Adiciona email à whitelist
2. ✅ **Cria conta automaticamente** no Supabase Auth
3. ✅ **Gera link de configuração de senha**
4. ✅ **Envia email de boas-vindas** via Resend com o link

---

## 📋 Pré-requisitos:

1. Conta no [Resend](https://resend.com)
2. Supabase CLI instalado
3. Domínio configurado no Resend (ou usar domínio de teste)

---

## 🔧 Passo 1: Configurar Resend

### 1.1 - Criar Conta no Resend

1. Acesse: https://resend.com
2. Crie uma conta gratuita
3. Verifique seu email

### 1.2 - Obter API Key

1. No dashboard do Resend, vá em **API Keys**
2. Clique em **Create API Key**
3. Nome: `exímIA OS Production`
4. Permissões: **Full Access** (ou apenas **Send Emails**)
5. **Copie a API Key** (começa com `re_...`)

### 1.3 - Configurar Domínio (Opcional mas Recomendado)

**Opção A: Usar domínio próprio**
1. No Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite: `eximia.ventures` (ou seu domínio)
4. Adicione os registros DNS (MX, TXT, CNAME)
5. Aguarde verificação (~10 min)

**Opção B: Usar domínio de teste do Resend**
- Emails serão enviados de: `onboarding@resend.dev`
- Limite: 100 emails/dia
- Pode cair em spam

---

## 🚀 Passo 2: Deploy da Edge Function

### 2.1 - Instalar Supabase CLI

```bash
# Windows (via Chocolatey)
choco install supabase

# macOS (via Homebrew)
brew install supabase/tap/supabase

# Linux
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
```

### 2.2 - Login no Supabase CLI

```bash
supabase login
```

Siga as instruções para autenticar.

### 2.3 - Link ao Projeto

```bash
cd "C:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Projetos\exímIA APP\exímia-os---synthetic-minds"

supabase link --project-ref vnwxdjjsapcfiezktywj
```

### 2.4 - Configurar Secrets

```bash
# Adicionar API Key do Resend
supabase secrets set RESEND_API_KEY=re_sua_api_key_aqui

# Adicionar URL do app (opcional)
supabase secrets set APP_URL=http://localhost:3005
```

### 2.5 - Deploy da Edge Function

```bash
supabase functions deploy send-welcome-email
```

**Saída esperada:**
```
Deploying send-welcome-email (project ref: vnwxdjjsapcfiezktywj)
✓ Deployed send-welcome-email
```

---

## ✅ Passo 3: Testar a Função

### 3.1 - Testar via SQL Editor (Supabase Dashboard)

```sql
-- Simular aprovação de solicitação
SELECT http(
  'POST'::http_method,
  'https://vnwxdjjsapcfiezktywj.supabase.co/functions/v1/send-welcome-email',
  ARRAY[http_header('Authorization', 'Bearer ' || current_setting('request.jwt.claims')::json->>'token')],
  'application/json'::text,
  jsonb_build_object(
    'email', 'teste@exemplo.com',
    'name', 'Usuário Teste',
    'resetPasswordLink', 'https://exemplo.com/reset'
  )::text
);
```

### 3.2 - Testar via Interface Admin

1. Faça login como admin
2. Vá em: **Admin → Controle de Acesso**
3. Crie uma solicitação de teste (ou use uma real)
4. Clique em **Aprovar** (✓)
5. ✅ Verifique:
   - Toast de sucesso
   - Email recebido na caixa de entrada
   - Conta criada em **Authentication → Users**

---

## 🎨 Customizar Email

O template do email está em:
```
supabase/functions/send-welcome-email/index.ts
```

**Personalizações possíveis:**
- Logo (substitua o div colorido por `<img>`)
- Cores (altere `#f59e0b` para sua cor principal)
- Texto e mensagens
- Domínio do remetente (`from: 'exímIA OS <noreply@eximia.ventures>'`)

Após customizar, execute:
```bash
supabase functions deploy send-welcome-email
```

---

## 🔐 Segurança e Permissões

### Invocar a Edge Function Requer:

1. **Usuário autenticado** (token JWT válido)
2. **Role = admin** (verificado no código do AdminAccessControl)

A Edge Function **não verifica** se é admin (confia no frontend), então:
- ⚠️ **Nunca exponha** a URL da função publicamente
- ⚠️ Use apenas via admin interface

### RLS nas Funções Admin do Supabase:

O código usa `supabase.auth.admin.createUser()` que requer **service_role key**. No frontend, isso é feito via **Supabase Client** que usa a **anon key** + **RLS policies**.

---

## 🆘 Troubleshooting

### Erro: "RESEND_API_KEY not configured"
**Solução:**
```bash
supabase secrets set RESEND_API_KEY=re_sua_chave
supabase functions deploy send-welcome-email
```

### Erro: "Failed to send email"
**Causas possíveis:**
1. API Key inválida → Verifique no Resend Dashboard
2. Domínio não verificado → Use domínio de teste ou verifique DNS
3. Rate limit → Resend free tier: 100 emails/dia, 3000/mês

### Email não chega:
1. Verifique **spam/lixo eletrônico**
2. Domínio de teste (`@resend.dev`) pode ser bloqueado
3. Verifique logs: Resend Dashboard → **Logs**
4. Verifique Supabase: **Edge Functions → Logs**

### Erro: "permission denied"
Certifique-se de que está logado como admin antes de aprovar solicitações.

---

## 📊 Monitoramento

### Logs da Edge Function:

```bash
supabase functions logs send-welcome-email
```

Ou no dashboard: **Edge Functions → send-welcome-email → Logs**

### Resend Dashboard:

- **Logs** → Ver todos os emails enviados
- **Analytics** → Métricas de entrega, abertura, etc.

---

## 🎉 Resumo

Após configurar tudo:

1. ✅ Resend API Key configurada
2. ✅ Edge Function deployada
3. ✅ Emails de boas-vindas automáticos ao aprovar solicitações
4. ✅ Contas criadas automaticamente com link de senha

**Próximo:** Teste aprovando uma solicitação real no painel admin!

---

**Criado por:** @dev (Dex)
**Data:** 2026-01-31
**Story:** EXIMIA-045
