-- Migration 005 V2: OAuth Email Whitelist (Corrigida)
-- Descrição: Controle de acesso via whitelist de emails para plataforma privada
-- Story: EXIMIA-045
-- Data: 2026-01-31
-- IMPORTANTE: Esta versão corrige problemas de colunas faltantes

-- =====================================================
-- 1. CRIAR/ATUALIZAR TABELA DE EMAILS PERMITIDOS
-- =====================================================

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS public.allowed_emails (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar coluna added_by se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'allowed_emails'
    AND column_name = 'added_by'
  ) THEN
    ALTER TABLE public.allowed_emails
    ADD COLUMN added_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Adicionar coluna notes se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'allowed_emails'
    AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.allowed_emails
    ADD COLUMN notes TEXT;
  END IF;
END $$;

-- =====================================================
-- 2. RLS PARA ALLOWED_EMAILS
-- =====================================================

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Admins can manage allowed emails" ON public.allowed_emails;

-- Criar política atualizada
CREATE POLICY "Admins can manage allowed emails"
  ON public.allowed_emails
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- =====================================================
-- 3. FUNÇÃO DE VERIFICAÇÃO DE EMAIL AUTORIZADO
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_user_email_allowed()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se o email está na whitelist
  IF NOT EXISTS (SELECT 1 FROM public.allowed_emails WHERE email = NEW.email) THEN
    -- Log do bloqueio
    RAISE LOG 'Blocked unauthorized login attempt: %', NEW.email;

    -- Deleta o usuário não autorizado
    DELETE FROM auth.users WHERE id = NEW.id;

    -- Lança exceção
    RAISE EXCEPTION 'Acesso negado: Email % não autorizado para esta plataforma. Entre em contato com o administrador.', NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. TRIGGER PARA VERIFICAR NOVOS USUÁRIOS
-- =====================================================

DROP TRIGGER IF EXISTS check_user_email_allowed_trigger ON auth.users;

CREATE TRIGGER check_user_email_allowed_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_user_email_allowed();

-- =====================================================
-- 5. INSERIR EMAILS INICIAIS PERMITIDOS
-- =====================================================

-- Adicionar admin principal (usando INSERT ... ON CONFLICT)
INSERT INTO public.allowed_emails (email, notes)
VALUES ('hugocapitelli@gmail.com', 'Admin principal - Hugo Capitelli')
ON CONFLICT (email) DO UPDATE
SET notes = EXCLUDED.notes;

-- =====================================================
-- 6. FUNÇÃO HELPER PARA ADICIONAR EMAILS
-- =====================================================

CREATE OR REPLACE FUNCTION public.add_allowed_email(
  p_email TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.allowed_emails (email, added_by, notes)
  VALUES (p_email, auth.uid(), p_notes)
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. FUNÇÃO HELPER PARA REMOVER EMAILS
-- =====================================================

CREATE OR REPLACE FUNCTION public.remove_allowed_email(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.allowed_emails WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.allowed_emails IS 'Whitelist de emails autorizados a acessar a plataforma';
COMMENT ON FUNCTION public.check_user_email_allowed() IS 'Verifica se novo usuário tem email autorizado, caso contrário deleta a conta';
COMMENT ON FUNCTION public.add_allowed_email(TEXT, TEXT) IS 'Helper para adicionar email à whitelist';
COMMENT ON FUNCTION public.remove_allowed_email(TEXT) IS 'Helper para remover email da whitelist';
