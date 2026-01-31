# 🎯 Implementação da Solução com Database Trigger

## O Que Mudou?

**ANTES (com CORS):**
```
Frontend → Edge Function → Criar usuário + Email
    ❌ CORS bloqueava a requisição OPTIONS
```

**AGORA (sem CORS):**
```
Frontend → Atualiza banco de dados
           ↓ (trigger automático)
       Edge Function → Criar usuário + Email
    ✅ Tudo servidor → servidor, zero CORS!
```

---

## 📋 Passo a Passo

### 1️⃣ Executar Migration

Vá no **SQL Editor** do Supabase:
https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/sql/new

Cole e execute:

```sql
-- Habilitar extensão pg_net
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Função que será executada pelo trigger
CREATE OR REPLACE FUNCTION handle_access_approval()
RETURNS TRIGGER AS $$
DECLARE
  request_id_var text;
  anon_key text;
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN

    request_id_var := NEW.id::text;
    SELECT current_setting('app.supabase_anon_key', true) INTO anon_key;

    IF anon_key IS NULL OR anon_key = '' THEN
      RAISE WARNING 'supabase_anon_key not configured';
      RETURN NEW;
    END IF;

    PERFORM net.http_post(
      url := 'https://vnwxdjjsapcfiezktywj.supabase.co/functions/v1/approve-access',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object('requestId', request_id_var)
    );

    RAISE LOG 'Trigger executed: % (%)', NEW.email, request_id_var;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_access_request_approved ON public.access_requests;
CREATE TRIGGER on_access_request_approved
  AFTER UPDATE ON public.access_requests
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
  EXECUTE FUNCTION handle_access_approval();
```

Clique em **"Run"**.

---

### 2️⃣ Configurar Secret (Anon Key)

No **mesmo SQL Editor**, execute:

```sql
ALTER DATABASE postgres SET app.supabase_anon_key = 'SUA_ANON_KEY_AQUI';
```

**Onde pegar a Anon Key:**
1. Vá em: https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/settings/api
2. Copie a **"anon / public"** key (está visível)
3. Cole no comando acima

Clique em **"Run"**.

---

### 3️⃣ Verificar se pg_net Foi Habilitado

Execute este SQL para confirmar:

```sql
SELECT * FROM pg_available_extensions WHERE name = 'pg_net';
```

**Se retornar vazio:**
- A extensão não está disponível no seu plano do Supabase
- **Alternativa:** Vou te dar outra solução mais simples

**Se retornar resultado:**
- ✅ Está tudo pronto!

---

### 4️⃣ Testar

1. **Reinicie o servidor frontend:**
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

2. **Abra o painel:**
   http://localhost:3005/settings/admin/access-control

3. **Clique em aprovar** (✓ verde)

4. **Deve aparecer:**
   - ✅ Toast: "Solicitação aprovada! Usuário será criado e email enviado automaticamente."
   - ✅ Solicitação some da lista de pendentes
   - ✅ Email aparece na lista de autorizados

5. **Verificar Edge Function Logs:**
   - Vá em: https://supabase.com/dashboard/project/vnwxdjjsapcfiezktywj/functions/approve-access/logs
   - Deve aparecer os logs de execução (🚀 POST request received, etc.)

---

## 🔍 Troubleshooting

### Se der erro: "extension pg_net is not available"

Execute no SQL Editor:

```sql
-- Verificar extensões disponíveis
SELECT name, installed_version, default_version, comment
FROM pg_available_extensions
WHERE name LIKE '%net%' OR name LIKE '%http%';
```

**Se não aparecer pg_net:**
- Seu plano do Supabase não tem essa extensão
- Vou te dar uma **solução alternativa** com webhook simples

---

### Se o trigger não executar

Verifique os logs do banco:

```sql
-- Ver logs recentes
SELECT * FROM pg_stat_statements WHERE query LIKE '%handle_access_approval%';
```

Ou verifique se o trigger foi criado:

```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_access_request_approved';
```

---

## ✅ Checklist de Sucesso

- [ ] Migration executada sem erros
- [ ] Anon key configurada no database settings
- [ ] pg_net habilitado
- [ ] Trigger criado
- [ ] Frontend atualizado (já feito automaticamente)
- [ ] Servidor reiniciado
- [ ] Teste de aprovação funcionou
- [ ] Email recebido

---

## 🆘 Se pg_net Não Estiver Disponível

Me avise e vou te dar uma solução alternativa usando:
- **Polling:** Frontend verifica se status mudou e chama Edge Function
- **Webhook simples:** Outra Edge Function que é chamada pelo trigger via HTTP direto

---

**Execute o Passo 1 e me conte o resultado!** 🚀
