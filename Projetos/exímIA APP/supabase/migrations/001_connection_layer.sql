-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION 001: Connection Layer Schema
-- ExímIA APP - BLOCO 1.1
-- Created: 2026-01-27
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════

-- Module types
CREATE TYPE module_type AS ENUM (
  'journey',
  'academy',
  'strategy',
  'brand',
  'prototyper',
  'inbox',
  'system'
);

-- Entity types
CREATE TYPE entity_type AS ENUM (
  -- Journey
  'goal', 'habit', 'book', 'event',
  -- Academy
  'course', 'lesson', 'session',
  -- Strategy
  'initiative', 'cycle', 'kpi',
  -- Brand
  'brand_identity', 'asset', 'palette',
  -- PrototypOS
  'project', 'prd', 'design_system',
  -- Inbox
  'inbox_item'
);

-- Event status
CREATE TYPE event_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Link types
CREATE TYPE link_type AS ENUM ('cascaded', 'suggested', 'manual', 'derived');

-- Link creator
CREATE TYPE link_creator AS ENUM ('system', 'user', 'ai');

-- Suggestion types
CREATE TYPE suggestion_type AS ENUM (
  'create_entity',
  'link_entities',
  'complete_entity',
  'update_entity',
  'enroll_course',
  'start_habit',
  'review_progress',
  'adjust_deadline'
);

-- Suggestion status
CREATE TYPE suggestion_status AS ENUM ('pending', 'shown', 'accepted', 'dismissed', 'snoozed', 'expired');

-- Suggestion priority
CREATE TYPE suggestion_priority AS ENUM ('low', 'medium', 'high');

-- Suggestion display type
CREATE TYPE suggestion_display AS ENUM ('toast', 'card', 'modal', 'notification');

-- Notification types
CREATE TYPE notification_type AS ENUM ('reminder', 'alert', 'suggestion', 'celebration', 'digest', 'system');

-- Notification priority
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- Notification status
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'actioned', 'dismissed');

-- Inbox content types
CREATE TYPE inbox_content_type AS ENUM ('text', 'voice', 'image', 'link', 'file');

-- Inbox sources
CREATE TYPE inbox_source AS ENUM ('quick_capture', 'voice', 'email', 'api', 'share', 'screenshot');

-- Inbox status
CREATE TYPE inbox_status AS ENUM ('inbox', 'processing', 'triaged', 'converted', 'archived');

-- ═══════════════════════════════════════════════════════════════════
-- EVENTS - Event Bus (Sistema Nervoso Central)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  type TEXT NOT NULL,
  source_module module_type NOT NULL,

  -- Payload
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',

  -- Contexto
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  correlation_id UUID,

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Status
  status event_status NOT NULL DEFAULT 'pending'
);

-- Indexes
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'pending';
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_correlation ON events(correlation_id) WHERE correlation_id IS NOT NULL;

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- ENTITY_LINKS - Conexoes Bidirecionais
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS entity_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_module module_type NOT NULL,
  source_type entity_type NOT NULL,
  source_id UUID NOT NULL,

  -- Target
  target_module module_type NOT NULL,
  target_type entity_type NOT NULL,
  target_id UUID NOT NULL,

  -- Metadata
  link_type link_type NOT NULL DEFAULT 'manual',
  relationship TEXT NOT NULL,
  strength DECIMAL(3,2) DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),
  bidirectional BOOLEAN DEFAULT TRUE,

  -- Contexto
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by link_creator NOT NULL DEFAULT 'user',
  created_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,

  -- Unique constraint
  UNIQUE(source_type, source_id, target_type, target_id, user_id)
);

-- Indexes
CREATE INDEX idx_links_source ON entity_links(source_type, source_id);
CREATE INDEX idx_links_target ON entity_links(target_type, target_id);
CREATE INDEX idx_links_user ON entity_links(user_id);
CREATE INDEX idx_links_type ON entity_links(link_type);

-- RLS
ALTER TABLE entity_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own links"
  ON entity_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links"
  ON entity_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON entity_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON entity_links FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- SUGGESTIONS - IA Proativa
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Trigger
  trigger_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  trigger_event_type TEXT,
  trigger_entity_type entity_type,
  trigger_entity_id UUID,
  trigger_entity_title TEXT,

  -- Sugestao
  suggestion_type suggestion_type NOT NULL,
  action_type TEXT NOT NULL,
  action_module module_type NOT NULL,
  action_params JSONB DEFAULT '{}',

  title TEXT NOT NULL,
  description TEXT,
  reasoning TEXT,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),

  -- Pre-preenchimento
  prefilled_data JSONB,

  -- Destino
  target_module module_type,
  target_route TEXT,

  -- UI
  priority suggestion_priority DEFAULT 'medium',
  display_type suggestion_display DEFAULT 'card',

  -- Status
  status suggestion_status DEFAULT 'pending',

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shown_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  snooze_until TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_suggestions_user ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_suggestions_priority ON suggestions(priority);
CREATE INDEX idx_suggestions_expires ON suggestions(expires_at) WHERE status = 'pending';

-- RLS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions"
  ON suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions"
  ON suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
  ON suggestions FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- NOTIFICATIONS - Saida Proativa
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteudo
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,

  -- Acao
  action_url TEXT,
  action_label TEXT,
  actions JSONB,

  -- Contexto
  source_module module_type,
  related_entity_type entity_type,
  related_entity_id UUID,
  related_entity_title TEXT,

  -- Delivery
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
  priority notification_priority DEFAULT 'normal',

  -- Status
  status notification_status DEFAULT 'pending',

  -- Timing
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- INBOX_ITEMS - Entrada Universal
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteudo
  content TEXT NOT NULL,
  content_type inbox_content_type DEFAULT 'text',
  attachments JSONB,

  -- Origem
  source inbox_source DEFAULT 'quick_capture',
  source_metadata JSONB,

  -- Triagem IA
  ai_analysis JSONB,

  -- Status
  status inbox_status DEFAULT 'inbox',

  -- Resultado
  converted_to_module module_type,
  converted_to_type entity_type,
  converted_to_id UUID,

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_inbox_user ON inbox_items(user_id);
CREATE INDEX idx_inbox_status ON inbox_items(status);
CREATE INDEX idx_inbox_created ON inbox_items(created_at DESC);

-- RLS
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inbox items"
  ON inbox_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inbox items"
  ON inbox_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inbox items"
  ON inbox_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inbox items"
  ON inbox_items FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- Function to get all links for an entity (both directions)
CREATE OR REPLACE FUNCTION get_entity_links(
  p_entity_type entity_type,
  p_entity_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  direction TEXT,
  linked_module module_type,
  linked_type entity_type,
  linked_id UUID,
  link_type link_type,
  relationship TEXT,
  strength DECIMAL,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Links where this entity is source
  SELECT
    el.id,
    'outgoing'::TEXT as direction,
    el.target_module as linked_module,
    el.target_type as linked_type,
    el.target_id as linked_id,
    el.link_type,
    el.relationship,
    el.strength,
    el.created_at
  FROM entity_links el
  WHERE el.source_type = p_entity_type
    AND el.source_id = p_entity_id
    AND el.user_id = p_user_id

  UNION ALL

  -- Links where this entity is target (if bidirectional)
  SELECT
    el.id,
    'incoming'::TEXT as direction,
    el.source_module as linked_module,
    el.source_type as linked_type,
    el.source_id as linked_id,
    el.link_type,
    el.relationship,
    el.strength,
    el.created_at
  FROM entity_links el
  WHERE el.target_type = p_entity_type
    AND el.target_id = p_entity_id
    AND el.user_id = p_user_id
    AND el.bidirectional = TRUE
$$;

-- Function to create an event (convenience)
CREATE OR REPLACE FUNCTION create_event(
  p_type TEXT,
  p_source_module module_type,
  p_entity_type entity_type,
  p_entity_id UUID,
  p_data JSONB DEFAULT '{}',
  p_correlation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO events (type, source_module, entity_type, entity_id, data, user_id, correlation_id)
  VALUES (p_type, p_source_module, p_entity_type, p_entity_id, p_data, auth.uid(), p_correlation_id)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE events IS 'Event Bus - Central nervous system of ExímIA OS';
COMMENT ON TABLE entity_links IS 'Bidirectional connections between entities across modules';
COMMENT ON TABLE suggestions IS 'AI-generated proactive suggestions for users';
COMMENT ON TABLE notifications IS 'Proactive notifications and alerts';
COMMENT ON TABLE inbox_items IS 'Universal capture inbox for quick entry';
