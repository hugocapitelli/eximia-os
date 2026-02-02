# 🚀 Deploy Sistema de Aprovação de Acesso com Email

## ✅ O Que Foi Implementado:

Quando você **aprovar uma solicitação de acesso** no painel admin:

1. ✅ Adiciona email à whitelist
2. ✅ **Cria conta automaticamente** no Supabase Auth
3. ✅ **Gera link temporário** de configuração de senha (24h)
4. ✅ **Envia email automaticamente** via Resend com template customizado

---

## 📋 Pré-requisitos (Já Configurados):

- ✅ Resend API Key configurada
- ✅ Edge Function `send-email` existente
- ✅ Templates de email prontos

---

## 🔧 Deploy em 2 Passos:

### Passo 1: Re-Deploy da Edge Function

A Edge Function `send-email` foi atualizada com o novo template `access-approved`.

```bash
# 1. Navegar até o projeto
cd "C:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Projetos\exímIA APP\exímia-os---synthetic-minds"

# 2. Re-deploy da função
supabase functions deploy send-email
```

**Saída esperada:**
```
Deploying send-email (project ref: vnwxdjjsapcfiezktywj)
✓ Deployed send-email
```

---

### Passo 2: Verificar Permissões Admin

Certifique-se de que você tem permissão para criar usuários:

```sql
-- No Supabase SQL Editor, execute:
SELECT email, role FROM public.profiles WHERE email = 'hugocapitelli@gmail.com';
```

**Resultado esperado:**
```
email                    | role
-------------------------|-------
hugocapitelli@gmail.com  | admin
```

Se não for `admin`, execute:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'hugocapitelli@gmail.com';
```

---

## ✅ Teste Completo:

### 1. Criar Solicitação de Teste

1. Abra uma aba anônima
2. Vá para a tela de login
3. Clique em **"Solicitar Acesso"**
4. Preencha com email real que você controla
5. Envie

### 2. Aprovar no Painel Admin

1. Faça login como admin (`hugocapitelli@gmail.com`)
2. Navegue: **Admin → Configurações → Controle de Acesso**
3. Você verá a solicitação na aba "Solicitações"
4. Clique no botão **verde (✓)** para aprovar

### 3. Verificar o Fluxo

**O que acontece:**

1. ✅ Toast de sucesso aparece: _"Solicitação aprovada! Conta criada e email de boas-vindas enviado."_
2. ✅ Solicitação move para "Aprovada"
3. ✅ Email aparece na aba "Emails Autorizados"
4. ✅ Usuário criado em: **Authentication → Users** (Supabase Dashboard)
5. ✅ **Email enviado** para o usuário

### 4. Verificar Email Recebido

O usuário receberá um email com:
- ✅ Badge "Acesso Liberado" (verde)
- ✅ Botão "Configurar Senha →"
- ✅ Link que expira em 24h
- ✅ Instruções de próximos passos

### 5. Configurar Senha

1. Usuário clica no link do email
2. É redirecionado para `/reset-password`
3. Define nova senha
4. Faz login normalmente

---

## 🔍 Monitoramento e Logs:

### Ver Logs da Edge Function:

```bash
# Em tempo real
supabase functions logs send-email --tail

# Ou no dashboard
# Supabase → Edge Functions → send-email → Logs
```

### Ver Emails Enviados:

1. Acesse: https://resend.com/emails
2. Veja todos os emails enviados, status de entrega, aberturas, etc.

### Ver Usuários Criados:

1. Supabase Dashboard → **Authentication → Users**
2. Filtre por email ou data de criação

---

## 🎨 Customização do Email:

O template está em:
```
supabase/functions/send-email/index.ts
```

Procure por `'access-approved'` e customize:
- Cores (#22c55e = verde, #f59e0b = amber)
- Textos
- Logo (troque div por `<img>`)
- URL do app

Após customizar:
```bash
supabase functions deploy send-email
```

---

## 🆘 Troubleshooting:

### Erro: "Failed to create user"

**Causa:** Email já existe no auth.users

**Solução:**
- Verifique em Authentication → Users
- Se existir, delete o usuário antigo ou use outro email

### Erro: "Failed to send email"

**Causa:** Resend API Key ou rate limit

**Solução:**
```bash
# Verificar se API key está configurada
supabase secrets list

# Se não estiver, configurar
supabase secrets set RESEND_API_KEY=re_sua_key
supabase functions deploy send-email
```

### Email não chega

**Verifique:**
1. Pasta de spam
2. Resend Dashboard → Emails → Ver status de entrega
3. Domínio verificado no Resend
4. Edge Function logs: `supabase functions logs send-email`

### Toast de erro mas solicitação foi aprovada

**Normal!** Se a conta for criada mas email falhar:
- Whitelist foi atualizada ✅
- Conta foi criada ✅
- Usuário pode usar "Esqueci minha senha" para receber link

---

## 📊 Resumo do Fluxo Completo:

```
1. Usuário solicita acesso
   ↓
2. Admin aprova no painel
   ↓
3. Sistema adiciona à whitelist
   ↓
4. Sistema cria conta no Supabase Auth
   ↓
5. Sistema gera link de senha (24h)
   ↓
6. Edge Function envia email via Resend
   ↓
7. Usuário recebe email
   ↓
8. Usuário clica no link
   ↓
9. Usuário configura senha
   ↓
10. Usuário faz login ✅
```

---

## 🎉 Pronto!

Após o deploy:

1. ✅ Edge Function atualizada com template de aprovação
2. ✅ Fluxo completo de aprovação funcionando
3. ✅ Emails automáticos com design profissional
4. ✅ Contas criadas automaticamente

**Próximo:** Teste aprovando uma solicitação real!

---

**Criado por:** @dev (Dex)
**Data:** 2026-01-31
**Story:** EXIMIA-045 (Finalização)
