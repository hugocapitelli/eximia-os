-- Migration 010: Auto-approve trigger
-- Quando access_request é aprovado, automaticamente cria usuário e envia email
-- Resolve problema de CORS usando trigger servidor → servidor

-- Habilitar extensão pg_net (para fazer HTTP calls do PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Função que será executada pelo trigger
CREATE OR REPLACE FUNCTION handle_access_approval()
RETURNS TRIGGER AS $$
DECLARE
  request_id_var text;
  anon_key text;
BEGIN
  -- Só executar se mudou de pending para approved
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN

    request_id_var := NEW.id::text;

    -- Pegar anon key do settings (configurar depois)
    SELECT current_setting('app.supabase_anon_key', true) INTO anon_key;

    IF anon_key IS NULL OR anon_key = '' THEN
      RAISE WARNING 'supabase_anon_key not configured. Run: ALTER DATABASE postgres SET app.supabase_anon_key = ''your-key'';';
      RETURN NEW;
    END IF;

    -- Chamar Edge Function via HTTP (servidor → servidor, sem CORS!)
    PERFORM net.http_post(
      url := 'https://vnwxdjjsapcfiezktywj.supabase.co/functions/v1/approve-access',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object('requestId', request_id_var)
    );

    RAISE LOG 'Trigger executed for access approval: % (%)', NEW.email, request_id_var;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar trigger que dispara DEPOIS da atualização
DROP TRIGGER IF EXISTS on_access_request_approved ON public.access_requests;
CREATE TRIGGER on_access_request_approved
  AFTER UPDATE ON public.access_requests
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
  EXECUTE FUNCTION handle_access_approval();

-- 3. Comentário explicativo
COMMENT ON FUNCTION handle_access_approval() IS
  'Automaticamente cria usuário e envia email quando solicitação é aprovada. Evita CORS usando comunicação servidor-servidor.';

COMMENT ON TRIGGER on_access_request_approved ON public.access_requests IS
  'Dispara handle_access_approval() quando status muda para approved';
