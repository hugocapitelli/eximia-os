-- Migration 008: Fix RLS Infinite Recursion
-- Descrição: Corrige recursão infinita nas políticas RLS de profiles
-- Story: EXIMIA-045
-- Data: 2026-01-31

-- =====================================================
-- 1. CRIAR FUNÇÃO HELPER PARA VERIFICAR SE É ADMIN
-- =====================================================

-- Esta função usa SECURITY DEFINER para contornar RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. RECRIAR POLÍTICAS DE PROFILES SEM RECURSÃO
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
  WITH CHECK (
    auth.uid() = id
    -- Não permite alterar o próprio role
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  );

-- Política 3: Admins podem ver todos os perfis
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Política 4: Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- =====================================================
-- 3. ATUALIZAR POLÍTICAS DE ALLOWED_EMAILS
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage allowed emails" ON public.allowed_emails;

CREATE POLICY "Admins can manage allowed emails"
  ON public.allowed_emails
  FOR ALL
  USING (public.is_admin());

-- =====================================================
-- 4. ATUALIZAR POLÍTICAS DE ACCESS_REQUESTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage access requests" ON public.access_requests;

CREATE POLICY "Admins can manage access requests"
  ON public.access_requests
  FOR ALL
  USING (public.is_admin());

-- Manter política de INSERT público (qualquer um pode solicitar)
DROP POLICY IF EXISTS "Anyone can request access" ON public.access_requests;

CREATE POLICY "Anyone can request access"
  ON public.access_requests
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION public.is_admin(UUID) IS 'Verifica se usuário é admin (SECURITY DEFINER para evitar recursão RLS)';
