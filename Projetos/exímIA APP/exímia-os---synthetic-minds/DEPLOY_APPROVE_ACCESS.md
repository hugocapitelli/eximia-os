# 🚀 Deploy Edge Function: approve-access

## 🔧 Problema Resolvido:

O erro **"User not allowed"** acontecia porque o frontend não pode criar usuários (requer `service_role key` que não deve estar no frontend).

**Solução:** Edge Function que usa `service_role key` de forma segura.

---

## 📋 Deploy Manual via Dashboard:

### 1. Acessar Dashboard do Supabase

Vá para: https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/functions

### 2. Criar Nova Edge Function

1. Clique em **"New Edge Function"** ou **"Create a new function"**
2. Nome da função: `approve-access`
3. Clique em **"Create function"**

### 3. Copiar o Código

Abra o arquivo:
```
supabase/functions/approve-access/index.ts
```

**Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)

### 4. Colar no Editor

1. Cole o código no editor do dashboard
2. Clique em **"Deploy"** ou **"Save"**

### 5. Aguardar Deploy

- ✅ Deve aparecer: _"Function deployed successfully"_
- Tempo: ~10-20 segundos

---

## ✅ Verificar Deploy:

### No Dashboard:

1. Vá em: **Edge Functions**
2. Deve aparecer: `approve-access` (status: Active)

### Testar Invocação:

No dashboard, clique em **"Invoke"** e teste com:

```json
{
  "requestId": "id-de-uma-solicitacao-real"
}
```

(Substitua por ID real de uma solicitação pendente)

---

## 🎯 O Que Esta Função Faz:

Quando você clicar em **Aprovar (✓)** no painel admin:

1. ✅ Chama a Edge Function `approve-access`
2. ✅ Função usa `service_role key` (segura)
3. ✅ Adiciona email à whitelist
4. ✅ Cria conta no Supabase Auth
5. ✅ Gera link de senha (24h)
6. ✅ Envia email via `send-email`
7. ✅ Retorna sucesso para o frontend

---

## 🔐 Segurança:

- ✅ `service_role key` fica apenas no servidor (Edge Function)
- ✅ Frontend só chama a função (não tem acesso à key)
- ✅ RLS ainda protege as tabelas
- ✅ Apenas admins podem chamar (validado no frontend)

---

## 🧪 Testar Após Deploy:

1. **Criar nova solicitação:**
   - Aba anônima → Login → Solicitar Acesso
   - Use email real que você controla

2. **Aprovar no admin:**
   - Admin → Controle de Acesso
   - Clique no ✓ verde

3. **Verificar:**
   - ✅ Toast: _"Solicitação aprovada! Conta criada e email enviado."_
   - ✅ Usuário criado em: Authentication → Users
   - ✅ Email recebido (verifique spam)

---

## 🆘 Troubleshooting:

### Erro ao criar função:
- Nome deve ser exatamente: `approve-access` (com hífen)
- Verifique se copiou todo o código

### Erro ao invocar:
- Verifique logs: Edge Functions → approve-access → Logs
- Certifique-se que `SUPABASE_SERVICE_ROLE_KEY` está configurada nos secrets

### Email não envia:
- Edge Function chama `send-email` que já deve estar deployada
- Verifique logs de ambas as funções

---

## ✅ Checklist:

- [ ] Edge Function `approve-access` criada
- [ ] Código colado e deployado
- [ ] Função aparece como "Active"
- [ ] Teste de aprovação funciona
- [ ] Email é recebido

---

**Faça o deploy agora e teste aprovando uma solicitação!** 🚀
