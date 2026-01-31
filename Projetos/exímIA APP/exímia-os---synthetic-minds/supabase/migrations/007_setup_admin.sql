-- Migration 007: Setup Initial Admin
-- Descrição: Promove o primeiro usuário a admin e garante acesso
-- Story: EXIMIA-045
-- Data: 2026-01-31

-- =====================================================
-- 1. PROMOVER USUÁRIO EXISTENTE A ADMIN (SE EXISTIR)
-- =====================================================

-- Promove o usuário hugocapitelli@gmail.com a admin se já existir
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'hugocapitelli@gmail.com';

-- =====================================================
-- 2. GARANTIR QUE PRIMEIRO USUÁRIO SEJA ADMIN
-- =====================================================

-- Se ainda não existe nenhum admin, promove o primeiro usuário que fizer login
CREATE OR REPLACE FUNCTION public.ensure_first_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se não existe nenhum admin ainda
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    -- Se o email for hugocapitelli@gmail.com, torna admin
    IF NEW.email = 'hugocapitelli@gmail.com' THEN
      NEW.role = 'admin';
      RAISE LOG 'First admin created: %', NEW.email;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para promover primeiro admin ao criar profile
DROP TRIGGER IF EXISTS ensure_first_admin_trigger ON public.profiles;

CREATE TRIGGER ensure_first_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_first_admin();

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION public.ensure_first_admin() IS 'Garante que o primeiro usuário (hugocapitelli@gmail.com) seja promovido a admin';
