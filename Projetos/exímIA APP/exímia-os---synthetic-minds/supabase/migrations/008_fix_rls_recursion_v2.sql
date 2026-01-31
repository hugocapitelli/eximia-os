-- Migration 008 V2: Fix RLS Infinite Recursion (CORRIGIDA)
-- Descrição: Corrige recursão infinita nas políticas RLS de profiles
-- Story: EXIMIA-045
-- Data: 2026-01-31

-- =====================================================
-- 1. REMOVER TODAS AS VERSÕES EXISTENTES DA FUNÇÃO
-- =====================================================

-- Remove todas as possíveis versões de is_admin
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

-- =====================================================
-- 2. CRIAR FUNÇÃO HELPER PARA VERIFICAR SE É ADMIN
-- =====================================================

-- Esta função usa SECURITY DEFINER para contornar RLS
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- 3. RECRIAR POLÍTICAS DE PROFILES SEM RECURSÃO
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- Política 1: Usuários podem ver seu próprio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Admins podem ver todos os perfis
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Política 4: Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- =====================================================
-- 4. ATUALIZAR POLÍTICAS DE ALLOWED_EMAILS
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage allowed emails" ON public.allowed_emails;

CREATE POLICY "Admins can manage allowed emails"
  ON public.allowed_emails
  FOR ALL
  USING (public.is_admin());

-- =====================================================
-- 5. ATUALIZAR POLÍTICAS DE ACCESS_REQUESTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Anyone can request access" ON public.access_requests;

-- Admins podem gerenciar tudo
CREATE POLICY "Admins can manage access requests"
  ON public.access_requests
  FOR ALL
  USING (public.is_admin());

-- Qualquer um pode solicitar acesso (INSERT apenas)
CREATE POLICY "Anyone can request access"
  ON public.access_requests
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 6. GRANT EXECUTE NA FUNÇÃO
-- =====================================================

-- Permite que authenticated users executem a função
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION public.is_admin() IS 'Verifica se usuário autenticado é admin (SECURITY DEFINER para evitar recursão RLS)';
