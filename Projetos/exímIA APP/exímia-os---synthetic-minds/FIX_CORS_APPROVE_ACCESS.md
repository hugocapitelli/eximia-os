# 🔧 Fix CORS Error - approve-access

## ❌ Erro Atual:
```
Access to fetch at '...approve-access' has been blocked by CORS policy
```

**Causa:** Edge Function precisa de variáveis de ambiente que não estão configuradas.

---

## ✅ Solução: Configurar Secrets no Supabase

### Passo 1: Obter as Keys

1. **Vá para:** https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/settings/api

2. **Copie os valores:**
   - **Project URL:** (começa com `https://vnwxdjjsapcfiezktywj.supabase.co`)
   - **anon/public key:** (começa com `eyJ...`)
   - **service_role key:** (começa com `eyJ...`) ⚠️ **Secreta!**

---

### Passo 2: Configurar no Dashboard

**IMPORTANTE:** Como o Supabase CLI não está funcionando, vamos usar o dashboard.

#### Método 1: Via Dashboard de Secrets (Recomendado se disponível)

1. Vá para: **Edge Functions → Settings** (ou **Project Settings → Edge Functions**)
2. Procure por **"Secrets"** ou **"Environment Variables"**
3. Adicione:

```
SUPABASE_URL = https://vnwxdjjsapcfiezktywj.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [sua-service-role-key-aqui]
SUPABASE_ANON_KEY = [sua-anon-key-aqui]
```

4. Salve

#### Método 2: Atualizar Código da Função (Se não tiver acesso a Secrets)

Se não conseguir adicionar secrets pelo dashboard, podemos hardcodear **temporariamente** (não recomendado para produção):

1. Edite a função `approve-access` no dashboard
2. No topo do arquivo, após os imports, adicione:

```typescript
// ⚠️ TEMPORÁRIO - Substitua pelos valores reais
const SUPABASE_URL = 'https://vnwxdjjsapcfiezktywj.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'SUA_SERVICE_ROLE_KEY_AQUI'
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI'
```

3. Substitua as linhas que usam `Deno.env.get()`:

**DE:**
```typescript
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
```

**PARA:**
```typescript
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
```

4. E também na chamada do send-email:

**DE:**
```typescript
`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
```

**PARA:**
```typescript
`${SUPABASE_URL}/functions/v1/send-email`,
```

**E:**

**DE:**
```typescript
'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
```

**PARA:**
```typescript
'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
```

5. Clique em **Deploy**

---

### Passo 3: Testar

1. **Recarregue a página** do admin (`Ctrl + Shift + R`)
2. **Tente aprovar** uma solicitação
3. ✅ Deve funcionar sem erro CORS!

---

## 🔍 Como Pegar as Keys:

### Service Role Key:

1. https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/settings/api
2. Role para baixo até **"Project API keys"**
3. Clique em **"Reveal"** ao lado de **"service_role"**
4. ⚠️ **Copie com cuidado** (é uma key secreta!)

### Anon Key:

1. Mesma página
2. Está visível em **"anon / public"**
3. Copie

### Project URL:

1. Mesma página
2. Está no topo: **"Project URL"**
3. Copie (ex: `https://vnwxdjjsapcfiezktywj.supabase.co`)

---

## ⚠️ Segurança:

**NUNCA** commite a `service_role key` no git!

- ✅ OK: Usar no dashboard do Supabase (secreto)
- ✅ OK: Usar em Edge Functions (servidor)
- ❌ NUNCA: Colocar no frontend
- ❌ NUNCA: Commitar no git

---

## 🧪 Verificar se Funcionou:

Após configurar e re-deploy:

```
1. Ctrl + Shift + R (reload)
2. Aprovar solicitação
3. Verificar console (F12)
4. ✅ Não deve ter erro CORS
5. ✅ Toast de sucesso deve aparecer
6. ✅ Email deve ser enviado
```

---

## 🆘 Ainda Dá Erro?

**Veja os logs da função:**

1. Dashboard → Edge Functions → `approve-access` → Logs
2. Procure por erros
3. Me envie o erro se aparecer

---

**Configure as secrets/keys e teste novamente!** 🚀
