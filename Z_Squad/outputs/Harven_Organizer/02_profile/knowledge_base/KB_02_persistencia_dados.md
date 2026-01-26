# KB_02: Persistencia de Dados

## Proposito

Este documento define as estruturas de dados e operacoes de persistencia do OrganizerOS.

---

## Estruturas de Dados

### Tabela: chat_sessions

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    chapter_id UUID NOT NULL REFERENCES chapters(id),
    question_id UUID NOT NULL REFERENCES questions(id),
    question_text TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'exported', 'export_failed', 'abandoned')),

    interactions_remaining INT NOT NULL DEFAULT 3
        CHECK (interactions_remaining >= 0 AND interactions_remaining <= 3),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    exported_at TIMESTAMP WITH TIME ZONE,

    retry_count INT NOT NULL DEFAULT 0,
    last_error TEXT
);

CREATE INDEX idx_sessions_status ON chat_sessions(status);
CREATE INDEX idx_sessions_student ON chat_sessions(student_id);
CREATE INDEX idx_sessions_chapter ON chat_sessions(chapter_id);
```

### Tabela: chat_messages

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,

    turn_number INT NOT NULL CHECK (turn_number >= 1 AND turn_number <= 3),
    role VARCHAR(10) NOT NULL CHECK (role IN ('student', 'tutor')),
    content TEXT NOT NULL,

    -- Campos do ANALYST (apenas para mensagens do aluno)
    ai_probability FLOAT CHECK (ai_probability >= 0 AND ai_probability <= 1),
    ai_confidence VARCHAR(10) CHECK (ai_confidence IN ('high', 'medium', 'low')),
    ai_verdict VARCHAR(20) CHECK (ai_verdict IN ('likely_human', 'uncertain', 'likely_ai')),
    flags JSONB DEFAULT '[]',
    metrics JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON chat_messages(session_id);
CREATE INDEX idx_messages_turn ON chat_messages(session_id, turn_number);
CREATE UNIQUE INDEX idx_messages_unique_turn_role
    ON chat_messages(session_id, turn_number, role);
```

### Tabela: export_queue

```sql
CREATE TABLE export_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,

    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'failed', 'completed')),

    retry_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    next_retry_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON export_queue(status);
CREATE INDEX idx_queue_next_retry ON export_queue(next_retry_at)
    WHERE status = 'pending';
CREATE UNIQUE INDEX idx_queue_session ON export_queue(session_id);
```

---

## Operacoes CRUD

### CREATE: Criar Sessao

```sql
INSERT INTO chat_sessions (
    student_id, chapter_id, question_id, question_text
) VALUES (
    :student_id, :chapter_id, :question_id, :question_text
) RETURNING *;
```

### CREATE: Salvar Mensagem

```sql
INSERT INTO chat_messages (
    session_id, turn_number, role, content,
    ai_probability, ai_confidence, ai_verdict, flags, metrics
) VALUES (
    :session_id, :turn_number, :role, :content,
    :ai_probability, :ai_confidence, :ai_verdict, :flags, :metrics
) RETURNING *;
```

### UPDATE: Decrementar Interacoes

```sql
UPDATE chat_sessions
SET
    interactions_remaining = interactions_remaining - 1,
    updated_at = NOW(),
    status = CASE
        WHEN interactions_remaining - 1 = 0 THEN 'completed'
        ELSE status
    END,
    completed_at = CASE
        WHEN interactions_remaining - 1 = 0 THEN NOW()
        ELSE completed_at
    END
WHERE id = :session_id
RETURNING *;
```

### UPDATE: Marcar como Exportado

```sql
UPDATE chat_sessions
SET
    status = 'exported',
    exported_at = NOW(),
    updated_at = NOW()
WHERE id = :session_id
RETURNING *;
```

### UPDATE: Marcar Falha de Export

```sql
UPDATE chat_sessions
SET
    status = 'export_failed',
    retry_count = retry_count + 1,
    last_error = :error_message,
    updated_at = NOW()
WHERE id = :session_id
RETURNING *;
```

### READ: Buscar Sessao com Mensagens

```sql
SELECT
    s.*,
    json_agg(
        json_build_object(
            'id', m.id,
            'turn_number', m.turn_number,
            'role', m.role,
            'content', m.content,
            'ai_probability', m.ai_probability,
            'flags', m.flags,
            'created_at', m.created_at
        ) ORDER BY m.turn_number, m.created_at
    ) as messages
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
WHERE s.id = :session_id
GROUP BY s.id;
```

---

## Transacoes Criticas

### Transacao: Salvar Mensagem da IA e Finalizar

```sql
BEGIN;

-- 1. Inserir mensagem
INSERT INTO chat_messages (session_id, turn_number, role, content)
VALUES (:session_id, :turn_number, 'tutor', :content);

-- 2. Decrementar e potencialmente finalizar
UPDATE chat_sessions
SET
    interactions_remaining = interactions_remaining - 1,
    updated_at = NOW(),
    status = CASE
        WHEN interactions_remaining - 1 = 0 THEN 'completed'
        ELSE status
    END,
    completed_at = CASE
        WHEN interactions_remaining - 1 = 0 THEN NOW()
        ELSE completed_at
    END
WHERE id = :session_id
RETURNING *;

-- 3. Se finalizou, preparar export
-- (logica em codigo: se status == 'completed', compilar payload)

COMMIT;
```

### Transacao: Adicionar a Fila de Export

```sql
BEGIN;

-- 1. Atualizar status da sessao
UPDATE chat_sessions
SET
    status = 'export_failed',
    retry_count = retry_count + 1,
    last_error = :error_message,
    updated_at = NOW()
WHERE id = :session_id;

-- 2. Inserir ou atualizar na fila
INSERT INTO export_queue (session_id, payload, next_retry_at)
VALUES (:session_id, :payload, NOW() + INTERVAL '1 minute')
ON CONFLICT (session_id) DO UPDATE
SET
    retry_count = export_queue.retry_count + 1,
    last_error = :error_message,
    next_retry_at = NOW() + (INTERVAL '1 minute' * POWER(5, export_queue.retry_count)),
    status = 'pending',
    updated_at = NOW();

COMMIT;
```

---

## Validacoes

### Antes de Salvar Mensagem

1. Sessao existe?
2. Sessao esta 'active'?
3. turn_number e valido (1-3)?
4. Nao existe mensagem duplicada (mesmo turn + role)?

### Antes de Finalizar

1. Sessao existe?
2. Sessao esta 'active' ou 'completed'?
3. Todas as mensagens foram salvas?

### Antes de Exportar

1. Sessao esta 'completed' ou 'export_failed'?
2. Payload e valido?
3. Credenciais de API estao configuradas?

---

## Indices de Performance

```sql
-- Busca por status (retry queue)
CREATE INDEX idx_sessions_status ON chat_sessions(status);

-- Busca por aluno
CREATE INDEX idx_sessions_student ON chat_sessions(student_id);

-- Busca por capitulo
CREATE INDEX idx_sessions_chapter ON chat_sessions(chapter_id);

-- Mensagens por sessao
CREATE INDEX idx_messages_session ON chat_messages(session_id);

-- Fila de export
CREATE INDEX idx_queue_next_retry ON export_queue(next_retry_at)
    WHERE status = 'pending';
```

---

## Backup e Recuperacao

### Dados Criticos

| Tabela | Criticidade | Frequencia Backup |
|--------|-------------|-------------------|
| chat_sessions | ALTA | Continuo (WAL) |
| chat_messages | ALTA | Continuo (WAL) |
| export_queue | MEDIA | Diario |

### Retencao

| Dados | Retencao |
|-------|----------|
| Sessoes ativas | Indefinido |
| Sessoes exportadas | 1 ano |
| Fila de export | 30 dias apos sucesso |


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->