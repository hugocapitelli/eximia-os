-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION 002: Synthetic Minds Schema
-- ExímIA APP - BLOCO 1.2
-- Created: 2026-01-27
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════

-- Agent tiers
CREATE TYPE agent_tier AS ENUM ('tier_0', 'tier_1', 'tier_2', 'tier_3');

-- Agent status
CREATE TYPE agent_status AS ENUM ('active', 'validating', 'inactive');

-- Conversation status
CREATE TYPE conversation_status AS ENUM ('active', 'archived');

-- Message roles
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- ═══════════════════════════════════════════════════════════════════
-- AGENTS - Mentes Sinteticas
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,

  -- Dominio
  domain TEXT NOT NULL,
  subdomain TEXT,

  -- Tier e Versao
  tier agent_tier NOT NULL DEFAULT 'tier_2',
  version TEXT NOT NULL DEFAULT '1.0',
  status agent_status NOT NULL DEFAULT 'active',

  -- Metricas de Qualidade
  fidelity_score DECIMAL(5,2) CHECK (fidelity_score >= 0 AND fidelity_score <= 100),

  -- Visual
  avatar_url TEXT,

  -- Descricao
  description TEXT NOT NULL,
  use_cases TEXT[] NOT NULL DEFAULT '{}',
  avoid_cases TEXT[] DEFAULT '{}',

  -- Prompt e Conhecimento
  system_prompt TEXT NOT NULL,
  knowledge_bases JSONB DEFAULT '{}',

  -- Metadata
  tags TEXT[] NOT NULL DEFAULT '{}',

  -- Estatisticas
  times_invoked INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) CHECK (avg_rating >= 0 AND avg_rating <= 5),

  -- LLM Config
  default_model TEXT DEFAULT 'gpt-4',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_agents_domain ON agents(domain);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_tier ON agents(tier);
CREATE INDEX idx_agents_tags ON agents USING GIN(tags);

-- Full-text search
CREATE INDEX idx_agents_search ON agents USING GIN(
  to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(domain, ''))
);

-- Agents sao publicos (catalog)
-- Nao precisa de RLS para SELECT, apenas para INSERT/UPDATE/DELETE (admin only)

-- ═══════════════════════════════════════════════════════════════════
-- CONVERSATIONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- Info
  title TEXT,
  status conversation_status NOT NULL DEFAULT 'active',

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Estatisticas
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_agent ON conversations(agent_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- MESSAGES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Content
  role message_role NOT NULL,
  content TEXT NOT NULL,

  -- Tokens
  tokens_used INTEGER,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);

-- RLS (via conversation ownership)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND c.user_id = auth.uid()
    )
  );

-- ═══════════════════════════════════════════════════════════════════
-- AGENT RATINGS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS agent_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  -- Rating
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One rating per user per agent
  UNIQUE(agent_id, user_id)
);

-- Indexes
CREATE INDEX idx_agent_ratings_agent ON agent_ratings(agent_id);
CREATE INDEX idx_agent_ratings_user ON agent_ratings(user_id);

-- RLS
ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all ratings"
  ON agent_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own ratings"
  ON agent_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON agent_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

-- Update conversation stats on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    message_count = message_count + 1,
    total_tokens = total_tokens + COALESCE(NEW.tokens_used, 0),
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Update agent stats on new conversation
CREATE OR REPLACE FUNCTION update_agent_on_conversation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agents
  SET
    times_invoked = times_invoked + 1,
    updated_at = NOW()
  WHERE id = NEW.agent_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_on_conversation
  AFTER INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_on_conversation();

-- Update agent avg_rating on new rating
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agents
  SET avg_rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM agent_ratings
    WHERE agent_id = NEW.agent_id
  )
  WHERE id = NEW.agent_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_rating
  AFTER INSERT OR UPDATE ON agent_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_rating();

-- ═══════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- Search agents by text
CREATE OR REPLACE FUNCTION search_agents(
  p_query TEXT,
  p_domain TEXT DEFAULT NULL,
  p_tier agent_tier DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF agents
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM agents
  WHERE status = 'active'
    AND (p_query IS NULL OR to_tsvector('portuguese', name || ' ' || description || ' ' || domain) @@ plainto_tsquery('portuguese', p_query))
    AND (p_domain IS NULL OR domain = p_domain)
    AND (p_tier IS NULL OR tier = p_tier)
  ORDER BY
    CASE WHEN p_query IS NOT NULL
      THEN ts_rank(to_tsvector('portuguese', name || ' ' || description), plainto_tsquery('portuguese', p_query))
      ELSE fidelity_score
    END DESC NULLS LAST,
    times_invoked DESC
  LIMIT p_limit;
$$;

-- Get conversation with messages
CREATE OR REPLACE FUNCTION get_conversation_with_messages(
  p_conversation_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  conversation JSONB,
  messages JSONB
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    row_to_json(c.*)::JSONB as conversation,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', m.id,
            'role', m.role,
            'content', m.content,
            'tokens_used', m.tokens_used,
            'created_at', m.created_at
          )
          ORDER BY m.created_at ASC
        )
        FROM (
          SELECT * FROM messages
          WHERE conversation_id = p_conversation_id
          ORDER BY created_at DESC
          LIMIT p_limit
        ) m
      ),
      '[]'::JSONB
    ) as messages
  FROM conversations c
  WHERE c.id = p_conversation_id
    AND c.user_id = auth.uid();
$$;

-- ═══════════════════════════════════════════════════════════════════
-- SEED DATA - Sample Agents
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO agents (name, slug, domain, subdomain, tier, version, status, fidelity_score, description, use_cases, avoid_cases, system_prompt, tags) VALUES
(
  'ExímIA Assistant',
  'eximia-assistant',
  'General',
  'Productivity',
  'tier_2',
  '1.0',
  'active',
  90.0,
  'Assistente geral do ExímIA OS. Ajuda com tarefas de produtividade, organização e tomada de decisões.',
  ARRAY['Organizar tarefas', 'Criar metas', 'Planejar projetos', 'Brainstorming'],
  ARRAY['Análise financeira profunda', 'Aconselhamento jurídico'],
  E'Você é o ExímIA Assistant, um assistente de produtividade inteligente.\n\nSeu papel é ajudar o usuário a:\n- Organizar suas tarefas e metas\n- Planejar projetos e iniciativas\n- Tomar decisões informadas\n- Fazer brainstorming de ideias\n\nSeja conciso, proativo e orientado a resultados. Sempre sugira próximos passos concretos.',
  ARRAY['produtividade', 'organizacao', 'metas', 'planejamento']
),
(
  'Strategy Coach',
  'strategy-coach',
  'Strategy',
  'Business',
  'tier_1',
  '1.0',
  'active',
  92.0,
  'Coach estratégico inspirado nos melhores frameworks de negócios. Ajuda a definir visão, missão e planos estratégicos.',
  ARRAY['Definir OKRs', 'Análise SWOT', 'Planejamento estratégico', 'Priorização'],
  ARRAY['Execução operacional', 'Detalhes técnicos'],
  E'Você é um Strategy Coach experiente, versado nos frameworks de:\n- OKRs (Objectives and Key Results)\n- SWOT Analysis\n- Porter''s Five Forces\n- Blue Ocean Strategy\n\nAjude o usuário a pensar estrategicamente sobre seus objetivos e negócios. Faça perguntas poderosas para clarificar a visão. Sempre conecte táticas com estratégia.',
  ARRAY['estrategia', 'okrs', 'negocios', 'planejamento']
),
(
  'Learning Architect',
  'learning-architect',
  'Education',
  'Learning Design',
  'tier_1',
  '1.0',
  'active',
  94.0,
  'Arquiteto de aprendizagem baseado nos princípios de David Kolb e Malcolm Knowles. Cria experiências de aprendizado eficazes.',
  ARRAY['Criar currículos', 'Design de cursos', 'Metodologias de ensino', 'Avaliação de aprendizado'],
  ARRAY['Conteúdo técnico específico', 'Execução de treinamentos'],
  E'Você é um Learning Architect, especialista em design instrucional baseado em:\n- Ciclo de Aprendizagem de Kolb\n- Andragogia de Malcolm Knowles\n- Taxonomia de Bloom\n- Design Thinking para Educação\n\nAjude o usuário a criar experiências de aprendizado transformadoras. Considere diferentes estilos de aprendizagem e sempre sugira atividades práticas.',
  ARRAY['educacao', 'aprendizagem', 'cursos', 'design-instrucional']
);

-- ═══════════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE agents IS 'Synthetic Minds Library - AI agent catalog';
COMMENT ON TABLE conversations IS 'Chat conversations between users and agents';
COMMENT ON TABLE messages IS 'Individual messages in conversations';
COMMENT ON TABLE agent_ratings IS 'User ratings and feedback for agents';
