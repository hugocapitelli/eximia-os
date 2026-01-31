# Configuração de Emails com Resend

Este guia explica como configurar o envio de emails transacionais usando **Resend** via **Supabase Edge Functions**.

## Tipos de Email Disponíveis

| Tipo | Descrição | Uso |
|------|-----------|-----|
| `welcome` | Boas-vindas | Após criação de conta |
| `password-reset` | Recuperação de senha | Quando usuário solicita reset |
| `access-request-confirmation` | Confirmação de solicitação | Quando solicita acesso à plataforma |

---

## Passo 1: Criar conta no Resend

1. Acesse [resend.com](https://resend.com) e crie uma conta
2. Vá em **API Keys** e crie uma nova key
3. Copie a key (formato: `re_xxxxxxxxxxxx`)

---

## Passo 2: Configurar domínio (Recomendado)

Para enviar emails do seu domínio (ex: `noreply@eximiaventures.com.br`):

1. No Resend, vá em **Domains** > **Add Domain**
2. Adicione seu domínio (ex: `eximiaventures.com.br`)
3. Configure os registros DNS no seu provedor:
   - **SPF** (TXT record)
   - **DKIM** (TXT record)
   - **DMARC** (TXT record - opcional mas recomendado)
4. Aguarde verificação (pode levar até 48h)

> **Nota**: Sem domínio verificado, emails são enviados de `onboarding@resend.dev` (limite de 100/dia)

---

## Passo 3: Configurar Supabase Edge Functions

### 3.1 Instalar Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (qualquer plataforma)
npm install -g supabase
```

### 3.2 Login e link do projeto

```bash
# Login
supabase login

# Linkar projeto (use o ID do seu projeto Supabase)
supabase link --project-ref vnwxdjjsapcfiezktywj
```

### 3.3 Configurar secrets

```bash
# Adicionar API key do Resend
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx

# Opcional: Email de origem customizado
supabase secrets set RESEND_FROM_EMAIL="exímIA <noreply@eximiaventures.com.br>"
```

### 3.4 Deploy da Edge Function

```bash
# Deploy da função send-email
supabase functions deploy send-email
```

---

## Passo 4: Executar migration (opcional)

Para rastrear emails enviados:

```bash
# Via Supabase CLI
supabase db push

# Ou manualmente no SQL Editor do Supabase Dashboard
# Cole o conteúdo de: supabase/migrations/005_email_logs.sql
```

---

## Uso no Frontend

### Importar o serviço

```typescript
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAccessRequestConfirmation
} from '../services/emailService'
```

### Enviar email de boas-vindas

```typescript
const result = await sendWelcomeEmail(
  'usuario@email.com',
  'Nome do Usuário' // opcional
)

if (result.success) {
  console.log('Email enviado:', result.id)
} else {
  console.error('Erro:', result.error)
}
```

### Enviar email de recuperação de senha

```typescript
const resetLink = `${window.location.origin}/reset-password?token=xxx`

const result = await sendPasswordResetEmail(
  'usuario@email.com',
  resetLink
)
```

### Enviar confirmação de solicitação de acesso

```typescript
const result = await sendAccessRequestConfirmation(
  'usuario@email.com',
  'Nome do Usuário', // opcional
  'REQ-12345'        // ID da solicitação (opcional)
)
```

---

## Integração com Supabase Auth

### Substituir email de reset do Supabase

No arquivo `ForgotPassword.tsx`, você pode usar o Resend em vez do Supabase:

```typescript
// Opção A: Usar Supabase Auth (atual - usa template padrão do Supabase)
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
})

// Opção B: Usar Resend (templates customizados)
// 1. Gerar token manualmente ou usar Supabase para gerar
// 2. Enviar email via Resend com o link
const resetLink = `${window.location.origin}/reset-password?token=${token}`
await sendPasswordResetEmail(email, resetLink)
```

> **Nota**: Para substituir completamente o email de reset do Supabase, você precisa:
> 1. Desabilitar emails automáticos no Supabase Dashboard
> 2. Implementar geração de token customizada
> 3. Usar a Edge Function para enviar

---

## Testar localmente

### Executar Edge Function localmente

```bash
# Iniciar Supabase local (requer Docker)
supabase start

# Servir functions localmente
supabase functions serve send-email --env-file .env.local
```

### Testar via curl

```bash
curl -X POST http://localhost:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "type": "welcome",
    "to": "test@example.com",
    "data": { "name": "Test User" }
  }'
```

---

## Estrutura de Arquivos

```
supabase/
├── functions/
│   ├── send-email/
│   │   └── index.ts          # Edge Function principal
│   └── _shared/
│       └── resend.ts         # Utilitários compartilhados
├── migrations/
│   └── 005_email_logs.sql    # Tabela de logs (opcional)
└── EMAIL_SETUP.md            # Este arquivo

src/
└── services/
    └── emailService.ts       # Cliente para chamar a Edge Function
```

---

## Troubleshooting

### "RESEND_API_KEY not configured"
- Verifique se configurou o secret: `supabase secrets list`
- Re-deploy após adicionar: `supabase functions deploy send-email`

### "Failed to send email"
- Verifique se a API key é válida no dashboard do Resend
- Verifique limites de envio (100/dia sem domínio verificado)
- Verifique se o domínio está verificado para emails customizados

### Emails não chegam
- Verifique pasta de spam
- Confirme DNS do domínio no Resend
- Verifique logs: `supabase functions logs send-email`

### CORS errors
- A Edge Function já inclui headers CORS
- Verifique se está chamando a URL correta da função

---

## Custos

**Resend:**
- Free: 100 emails/dia, 3.000/mês
- Pro: $20/mês para 50.000 emails

**Supabase Edge Functions:**
- Free tier: 500.000 invocações/mês
- Geralmente suficiente para uso normal

---

## Próximos Passos

1. [ ] Criar conta no Resend
2. [ ] Configurar domínio (opcional mas recomendado)
3. [ ] Adicionar secret `RESEND_API_KEY`
4. [ ] Deploy da Edge Function
5. [ ] Testar envio de cada tipo de email
6. [ ] Integrar nos fluxos de auth do app
