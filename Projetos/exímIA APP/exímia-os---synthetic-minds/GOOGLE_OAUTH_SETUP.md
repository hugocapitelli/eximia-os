# Google OAuth Setup Guide - exímIA OS

Este guia mostra como configurar o Google OAuth para permitir login social na plataforma.

---

## 📋 Pré-requisitos

- Conta Google Cloud Console
- Acesso ao Supabase Dashboard do projeto
- Domínio/URL da aplicação

---

## 🔧 Passo 1: Google Cloud Console

### 1.1 - Criar/Selecionar Projeto

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Clique em "Select a project" no topo
3. Crie um novo projeto ou selecione existente
   - Nome sugerido: **exímIA OS**

### 1.2 - Configurar OAuth Consent Screen

1. No menu lateral, vá para **APIs & Services > OAuth consent screen**
2. Selecione **External** (para usuários externos)
3. Preencha as informações:
   - **App name:** exímIA OS
   - **User support email:** seu-email@exemplo.com
   - **App logo:** (opcional) logo da plataforma
   - **Developer contact:** seu-email@exemplo.com
4. Clique em **Save and Continue**
5. Em **Scopes**, adicione:
   - `userinfo.email`
   - `userinfo.profile`
6. Clique em **Save and Continue**
7. Em **Test users** (modo desenvolvimento):
   - Adicione emails de teste se necessário
8. Clique em **Save and Continue**

### 1.3 - Criar OAuth 2.0 Credentials

1. No menu lateral, vá para **APIs & Services > Credentials**
2. Clique em **+ CREATE CREDENTIALS > OAuth 2.0 Client ID**
3. Preencha:
   - **Application type:** Web application
   - **Name:** exímIA OS Web Client
4. Em **Authorized JavaScript origins**, adicione:
   - `http://localhost:3005` (desenvolvimento)
   - `https://seu-dominio.com` (produção)
5. Em **Authorized redirect URIs**, adicione:
   - `https://vnwxdjjsapcfiezktywj.supabase.co/auth/v1/callback`

   ⚠️ **IMPORTANTE:** Substitua `vnwxdjjsapcfiezktywj` pelo seu **project-ref** do Supabase

   **Como encontrar o project-ref:**
   - Vá para Supabase Dashboard
   - URL do projeto: `https://supabase.com/dashboard/project/[PROJECT-REF]`
   - Ou em **Settings > API** → veja a URL

6. Clique em **CREATE**
7. **COPIE e SALVE:**
   - **Client ID:** `xxx.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-xxx`

---

## 🔐 Passo 2: Supabase Dashboard

### 2.1 - Habilitar Google Provider

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: **exímIA OS**
3. No menu lateral, vá para **Authentication > Providers**
4. Encontre **Google** na lista
5. Clique em **Enable**

### 2.2 - Configurar Credentials

1. Cole as credenciais do Google Cloud:
   - **Client ID:** (copiado no passo 1.3)
   - **Client Secret:** (copiado no passo 1.3)
2. Em **Redirect URL**, copie a URL:
   - Formato: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
   - Esta URL já foi adicionada no Google Cloud Console (passo 1.3.5)
3. Clique em **Save**

### 2.3 - Testar Configuração

1. No Supabase Dashboard, vá para **Authentication > Users**
2. Clique em **Add user > Sign up via OAuth**
3. Selecione **Google**
4. Faça login com sua conta Google de teste
5. Verifique se o usuário foi criado em **Users**

---

## 🧪 Passo 3: Testar na Aplicação

### 3.1 - Testar Localmente

1. Certifique-se de que o dev server está rodando:
   ```bash
   npm run dev
   ```

2. Acesse: `http://localhost:3005/login`

3. Clique no botão **Google**

4. Você será redirecionado para a tela de consentimento do Google

5. Após autorizar, será redirecionado para `/auth/callback`

6. Se sucesso, será redirecionado para a home da aplicação

### 3.2 - Verificar Logs

Se algo der errado, verifique:

1. **Console do navegador** (F12) - erros JavaScript
2. **Network tab** (F12) - requests falhando
3. **Supabase Dashboard > Logs** - erros de auth

---

## ❓ Troubleshooting

### Erro: "Redirect URI mismatch"

**Causa:** A redirect URI no Google Cloud não está correta.

**Solução:**
1. Verifique o project-ref do Supabase
2. Certifique-se que a URL no Google Cloud é exatamente:
   `https://[SEU-PROJECT-REF].supabase.co/auth/v1/callback`

### Erro: "OAuth configuration not found"

**Causa:** Credentials não foram salvos no Supabase.

**Solução:**
1. Verifique se o Google provider está **Enabled** no Supabase
2. Confirme que Client ID e Secret foram salvos
3. Tente copiar e colar novamente as credentials

### Erro: "Access blocked: This app's request is invalid"

**Causa:** OAuth Consent Screen não configurado corretamente.

**Solução:**
1. Volte ao Google Cloud Console
2. Configure OAuth Consent Screen (passo 1.2)
3. Adicione scopes necessários: `userinfo.email`, `userinfo.profile`

### Botão Google não aparece

**Causa:** Imports ou código incorreto.

**Solução:**
1. Verifique se `react-hot-toast` está instalado
2. Verifique imports no LoginForm.tsx
3. Veja console do navegador para erros

---

## 🎉 Configuração Completa!

Se tudo funcionou, agora você tem:

✅ Login com email/senha
✅ Login com Google OAuth
✅ Recuperação de senha por email
✅ Toast notifications
✅ Rotas protegidas

---

## 📚 Recursos Adicionais

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [React Hot Toast Docs](https://react-hot-toast.com/)

---

**Criado por:** @dev (Dex)
**Data:** 2026-01-31
**Story:** EXIMIA-045
