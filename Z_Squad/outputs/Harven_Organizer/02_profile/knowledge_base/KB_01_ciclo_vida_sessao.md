# KB_01: Ciclo de Vida da Sessao

## Proposito

Este documento define os estados possiveis de uma sessao de chat socratico e as transicoes entre eles.

---

## Estados da Sessao

### 1. active

**Descricao:** Sessao em andamento, aceitando mensagens

**Caracteristicas:**
- interactions_remaining > 0
- Aluno pode enviar mensagens
- IA pode responder
- Mensagens sao salvas normalmente

**Transicoes possiveis:**
- -> `completed`: Quando interactions_remaining == 0
- -> `abandoned`: Quando timeout de inatividade (opcional)

---

### 2. completed

**Descricao:** 3 interacoes completadas, aguardando exportacao

**Caracteristicas:**
- interactions_remaining == 0
- Aluno nao pode mais enviar mensagens
- Todas as mensagens foram salvas
- Payload de exportacao foi compilado

**Transicoes possiveis:**
- -> `exported`: Quando exportacao para Moodle sucede
- -> `export_failed`: Quando exportacao falha

---

### 3. exported

**Descricao:** Exportado com sucesso para Moodle

**Caracteristicas:**
- Dados foram enviados para Moodle
- exported_at esta preenchido
- Estado final (sem mais transicoes)

**Transicoes possiveis:**
- Nenhuma (estado final)

---

### 4. export_failed

**Descricao:** Falha na exportacao, na fila de retry

**Caracteristicas:**
- Exportacao tentou mas falhou
- Sessao esta na export_queue
- retry_count > 0
- last_error contem detalhes

**Transicoes possiveis:**
- -> `exported`: Quando retry sucede
- -> `export_failed`: Quando retry falha (incrementa contador)

---

### 5. abandoned (opcional)

**Descricao:** Sessao abandonada por inatividade

**Caracteristicas:**
- Aluno nao interagiu por tempo prolongado
- interactions_remaining > 0
- Nao sera exportada

**Transicoes possiveis:**
- Nenhuma (estado final)

---

## Diagrama de Estados

```
                    +------------------+
                    |                  |
                    v                  |
    +--------+    3 turnos    +------------+
    | active | ------------> | completed  |
    +--------+               +------------+
        |                         |
        | (timeout)               | export
        v                         v
  +-----------+            +-----------+     sucesso    +----------+
  | abandoned |            |  export   | ------------> | exported |
  +-----------+            |  attempt  |               +----------+
                           +-----------+
                                |
                                | falha
                                v
                         +--------------+
                         | export_failed|<----+
                         +--------------+     |
                                |             |
                                | retry       | falha
                                v             |
                           +-----------+      |
                           |  retry    |------+
                           |  attempt  |
                           +-----------+
                                |
                                | sucesso
                                v
                           +----------+
                           | exported |
                           +----------+
```

---

## Regras de Transicao

### active -> completed

**Trigger:** Mensagem da IA salva quando interactions_remaining == 1

**Processo:**
```
1. Salvar mensagem da IA
2. Decrementar interactions_remaining (1 -> 0)
3. Atualizar status para 'completed'
4. Preencher completed_at
5. Compilar payload de exportacao
6. Disparar export em background
```

### completed -> exported

**Trigger:** Resposta 2xx da API do Moodle

**Processo:**
```
1. Receber resposta de sucesso
2. Atualizar status para 'exported'
3. Preencher exported_at
4. Remover da export_queue (se estava)
5. Logar sucesso
```

### completed -> export_failed

**Trigger:** Resposta de erro da API do Moodle

**Processo:**
```
1. Receber resposta de erro (4xx, 5xx, timeout)
2. Atualizar status para 'export_failed'
3. Registrar last_error
4. Adicionar a export_queue
5. Agendar next_retry_at
6. Logar falha
```

### export_failed -> exported

**Trigger:** Retry bem sucedido

**Processo:**
```
1. Executar retry
2. Receber resposta de sucesso
3. Atualizar status para 'exported'
4. Preencher exported_at
5. Remover da export_queue
6. Logar sucesso
```

### export_failed -> export_failed (retry falhou)

**Trigger:** Retry falhou

**Processo:**
```
1. Executar retry
2. Receber resposta de erro
3. Incrementar retry_count
4. Atualizar last_error
5. Agendar proximo next_retry_at
6. Se retry_count >= 3: notificar admin
7. Logar falha
```

---

## Contadores e Limites

### interactions_remaining

| Valor | Significado |
|-------|-------------|
| 3 | Sessao recem criada, nenhuma interacao |
| 2 | 1 interacao completa |
| 1 | 2 interacoes completas |
| 0 | Sessao finalizada |

**Regra:** Decrementar APOS salvar mensagem da IA (nao do aluno)

### retry_count

| Valor | Acao |
|-------|------|
| 0 | Primeira tentativa de export |
| 1 | Primeira retry |
| 2 | Segunda retry |
| 3+ | Notificar admin, continuar tentando |

### Backoff Exponencial

| Retry | Tempo de espera |
|-------|-----------------|
| 1 | 1 minuto |
| 2 | 5 minutos |
| 3 | 15 minutos |
| 4+ | 30 minutos |

---

## Queries Uteis

### Buscar sessoes ativas

```sql
SELECT * FROM chat_sessions
WHERE status = 'active'
AND updated_at > NOW() - INTERVAL '1 hour';
```

### Buscar sessoes para retry

```sql
SELECT * FROM export_queue
WHERE status = 'pending'
AND next_retry_at <= NOW()
ORDER BY next_retry_at ASC
LIMIT 10;
```

### Buscar sessoes com muitos retries

```sql
SELECT s.*, q.retry_count, q.last_error
FROM chat_sessions s
JOIN export_queue q ON s.id = q.session_id
WHERE s.status = 'export_failed'
AND q.retry_count >= 3
ORDER BY q.created_at ASC;
```


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->