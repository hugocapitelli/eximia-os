-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Connection Layer
-- ExímIA APP - BLOCO 1.1
-- Execute after migrations are applied
-- ═══════════════════════════════════════════════════════════════════════════

-- Note: This seed requires a valid user_id.
-- Replace 'YOUR_USER_ID' with an actual user UUID from auth.users

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE EVENTS
-- ═══════════════════════════════════════════════════════════════════════════

-- Sample events will be created automatically when entities are created
-- through the application. This file provides example data for testing.

-- To create test events manually (replace user_id):
/*
INSERT INTO events (type, source_module, entity_type, entity_id, data, user_id, status) VALUES
('goal.created', 'journey', 'goal', gen_random_uuid(), '{"title": "Completar curso de TypeScript"}', 'YOUR_USER_ID', 'completed'),
('habit.completed', 'journey', 'habit', gen_random_uuid(), '{"name": "Exercício matinal", "streak": 7}', 'YOUR_USER_ID', 'completed'),
('inbox.captured', 'inbox', 'inbox_item', gen_random_uuid(), '{"content": "Ideia para novo projeto"}', 'YOUR_USER_ID', 'completed');
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE ENTITY LINKS
-- ═══════════════════════════════════════════════════════════════════════════

-- Entity links connect different entities across modules
-- These are created when users link items or when AI suggests connections

-- Example links (replace IDs):
/*
INSERT INTO entity_links (
  source_module, source_type, source_id,
  target_module, target_type, target_id,
  link_type, relationship, strength, bidirectional,
  created_by, created_reason, user_id
) VALUES
(
  'journey', 'goal', 'GOAL_UUID',
  'journey', 'habit', 'HABIT_UUID',
  'manual', 'supports', 0.8, true,
  'user', 'Hábito criado para suportar meta',
  'YOUR_USER_ID'
),
(
  'inbox', 'inbox_item', 'INBOX_UUID',
  'journey', 'goal', 'GOAL_UUID',
  'suggested', 'related_to', 0.6, false,
  'ai', 'Item parece relacionado à meta de produtividade',
  'YOUR_USER_ID'
);
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE SUGGESTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- AI-generated suggestions appear based on user activity

-- Example suggestions (replace IDs):
/*
INSERT INTO suggestions (
  trigger_entity,
  suggestion_type, action, title, description, reasoning,
  confidence, target_module, target_route,
  priority, display_type, status,
  user_id
) VALUES
(
  '{"module": "inbox", "type": "inbox_item", "id": "INBOX_UUID"}',
  'convert',
  '{"type": "create_goal", "prefilled": {"title": "Aprender TypeScript"}}',
  'Criar meta de aprendizado',
  'Esta captura parece ser uma meta de aprendizado. Deseja convertê-la em um Goal?',
  'Detectado padrão de objetivo educacional com base nas palavras-chave.',
  0.85, 'journey', '/journey/goals/new',
  'high', 'toast', 'pending',
  'YOUR_USER_ID'
),
(
  '{"module": "journey", "type": "habit", "id": "HABIT_UUID"}',
  'link',
  '{"type": "link_entities", "target": {"module": "journey", "type": "goal", "id": "GOAL_UUID"}}',
  'Conectar hábito à meta',
  'Este hábito parece relacionado à sua meta de saúde. Deseja criar uma conexão?',
  'O hábito de exercício está alinhado com a meta de perder peso.',
  0.78, null, null,
  'medium', 'card', 'pending',
  'YOUR_USER_ID'
);
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Notifications inform users of events, suggestions, and reminders

-- Example notifications (replace IDs):
/*
INSERT INTO notifications (
  type, title, body, icon,
  action_url, action_label,
  source_module, related_entity,
  channels, priority, status,
  user_id
) VALUES
(
  'suggestion',
  'Nova sugestão disponível',
  'A IA detectou uma possível conexão entre seus itens.',
  'sparkles',
  '/suggestions', 'Ver sugestão',
  'system', '{"type": "suggestion", "id": "SUGGESTION_UUID"}',
  ARRAY['push', 'in_app'], 'medium', 'pending',
  'YOUR_USER_ID'
),
(
  'reminder',
  'Hora do hábito!',
  'Não esqueça de completar seu hábito de exercício matinal.',
  'clock',
  '/journey/habits', 'Ver hábitos',
  'journey', '{"type": "habit", "id": "HABIT_UUID"}',
  ARRAY['push'], 'high', 'pending',
  'YOUR_USER_ID'
);
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE INBOX ITEMS
-- ═══════════════════════════════════════════════════════════════════════════

-- Inbox items capture raw thoughts, ideas, and inputs

-- Example inbox items (replace IDs):
/*
INSERT INTO inbox_items (
  content, content_type, source, source_metadata,
  ai_analysis, status,
  user_id
) VALUES
(
  'Preciso estudar mais TypeScript para o projeto',
  'text', 'manual', '{}',
  '{"category": "learning", "suggested_module": "academy", "keywords": ["typescript", "estudar", "projeto"], "confidence": 0.82}',
  'pending',
  'YOUR_USER_ID'
),
(
  'Ideia: criar um app de tracking de hábitos com gamificação',
  'text', 'manual', '{}',
  '{"category": "project", "suggested_module": "prototyos", "keywords": ["app", "hábitos", "gamificação"], "confidence": 0.75}',
  'pending',
  'YOUR_USER_ID'
),
(
  'Marcar dentista para próxima semana',
  'text', 'manual', '{}',
  '{"category": "task", "suggested_module": "inbox", "keywords": ["dentista", "marcar", "semana"], "confidence": 0.90, "due_hint": "próxima semana"}',
  'pending',
  'YOUR_USER_ID'
);
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER: Create test data function
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to create test data for a specific user
-- Usage: SELECT create_test_connection_data('user-uuid-here');

CREATE OR REPLACE FUNCTION create_test_connection_data(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_inbox_id UUID;
  v_event_id UUID;
  v_suggestion_id UUID;
BEGIN
  -- Create a sample inbox item
  INSERT INTO inbox_items (content, content_type, source, status, user_id)
  VALUES ('Ideia de teste: implementar feature X', 'text', 'manual', 'pending', p_user_id)
  RETURNING id INTO v_inbox_id;

  -- Create an event for the inbox capture
  INSERT INTO events (type, source_module, entity_type, entity_id, data, user_id, status)
  VALUES ('inbox.captured', 'inbox', 'inbox_item', v_inbox_id,
          jsonb_build_object('content', 'Ideia de teste: implementar feature X'),
          p_user_id, 'completed')
  RETURNING id INTO v_event_id;

  -- Create a suggestion based on the inbox item
  INSERT INTO suggestions (
    trigger_event_id, trigger_entity, suggestion_type, action,
    title, description, reasoning, confidence,
    target_module, target_route, priority, display_type, status, user_id
  )
  VALUES (
    v_event_id,
    jsonb_build_object('module', 'inbox', 'type', 'inbox_item', 'id', v_inbox_id),
    'convert',
    jsonb_build_object('type', 'create_task', 'prefilled', jsonb_build_object('title', 'Implementar feature X')),
    'Converter em tarefa',
    'Este item parece ser uma tarefa. Deseja convertê-lo?',
    'Detectado padrão de ação baseado em palavras-chave.',
    0.85,
    'journey', '/journey/tasks/new',
    'medium', 'toast', 'pending',
    p_user_id
  )
  RETURNING id INTO v_suggestion_id;

  -- Create a notification for the suggestion
  INSERT INTO notifications (
    type, title, body, icon, action_url, action_label,
    source_module, related_entity, channels, priority, status, user_id
  )
  VALUES (
    'suggestion',
    'Nova sugestão da IA',
    'Detectamos uma possível tarefa no seu inbox.',
    'sparkles',
    '/suggestions', 'Ver sugestão',
    'system',
    jsonb_build_object('type', 'suggestion', 'id', v_suggestion_id),
    ARRAY['in_app'], 'low', 'pending',
    p_user_id
  );

  RETURN 'Test data created: inbox_item=' || v_inbox_id || ', event=' || v_event_id || ', suggestion=' || v_suggestion_id;
END;
$$;

COMMENT ON FUNCTION create_test_connection_data IS 'Creates sample Connection Layer data for testing. Usage: SELECT create_test_connection_data(''user-uuid'');';
