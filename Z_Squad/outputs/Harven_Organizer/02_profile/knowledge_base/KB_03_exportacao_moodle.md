# KB_03: Exportacao para Moodle

## Proposito

Este documento define o formato de exportacao, integracao com API do Moodle e estrategias de retry.

---

## Payload de Exportacao

### Estrutura Completa

```json
{
    "session_id": "uuid",
    "student": {
        "id": "uuid",
        "external_id": "string (Moodle user ID)",
        "name": "string",
        "email": "string"
    },
    "chapter": {
        "id": "uuid",
        "title": "string",
        "course_id": "uuid"
    },
    "question": {
        "id": "uuid",
        "text": "string",
        "type": "socratic"
    },
    "conversation": [
        {
            "turn": 1,
            "student_message": {
                "content": "string",
                "timestamp": "datetime",
                "ai_probability": 0.0-1.0,
                "ai_verdict": "likely_human | uncertain | likely_ai",
                "flags": []
            },
            "tutor_response": {
                "content": "string",
                "timestamp": "datetime"
            }
        },
        {
            "turn": 2,
            "...": "..."
        },
        {
            "turn": 3,
            "...": "..."
        }
    ],
    "metrics": {
        "total_words_student": 150,
        "total_words_tutor": 200,
        "avg_response_time_seconds": 45,
        "avg_ai_probability": 0.25,
        "flags_triggered": ["resposta_muito_curta"]
    },
    "session_info": {
        "started_at": "datetime",
        "completed_at": "datetime",
        "duration_seconds": 300,
        "total_interactions": 3
    },
    "metadata": {
        "platform_version": "1.0.0",
        "exported_at": "datetime"
    }
}
```

---

## API do Moodle

### Endpoint

```
POST {MOODLE_BASE_URL}/webservice/rest/server.php
```

### Parametros

| Parametro | Valor |
|-----------|-------|
| wstoken | Token de autenticacao |
| wsfunction | harven_submit_socratic_session |
| moodlewsrestformat | json |

### Headers

```
Content-Type: application/json
Authorization: Bearer {MOODLE_API_TOKEN}
```

### Request Body

```json
{
    "wsfunction": "harven_submit_socratic_session",
    "session_data": "{payload JSON stringified}"
}
```

### Response: Sucesso

```json
{
    "success": true,
    "moodle_submission_id": "12345",
    "message": "Session submitted successfully"
}
```

### Response: Erro

```json
{
    "success": false,
    "errorcode": "invalidtoken",
    "message": "Invalid token - token not found"
}
```

---

## Codigos de Erro

### Erros Retryable (tentar novamente)

| Codigo | Descricao | Acao |
|--------|-----------|------|
| 500 | Internal Server Error | Retry com backoff |
| 502 | Bad Gateway | Retry com backoff |
| 503 | Service Unavailable | Retry com backoff |
| 504 | Gateway Timeout | Retry com backoff |
| timeout | Request timeout | Retry com backoff |
| ECONNRESET | Connection reset | Retry imediato |

### Erros Nao-Retryable (nao tentar novamente)

| Codigo | Descricao | Acao |
|--------|-----------|------|
| 400 | Bad Request | Logar, notificar dev |
| 401 | Unauthorized | Verificar token, notificar admin |
| 403 | Forbidden | Verificar permissoes |
| 404 | Not Found | Verificar endpoint |
| 422 | Unprocessable Entity | Verificar payload |

---

## Estrategia de Retry

### Backoff Exponencial

```python
def calculate_next_retry(retry_count):
    base_delay = 60  # 1 minuto
    multiplier = 5
    max_delay = 1800  # 30 minutos

    delay = min(base_delay * (multiplier ** retry_count), max_delay)
    return datetime.now() + timedelta(seconds=delay)
```

### Tabela de Delays

| Retry # | Delay | Tempo Acumulado |
|---------|-------|-----------------|
| 1 | 1 min | 1 min |
| 2 | 5 min | 6 min |
| 3 | 25 min | 31 min |
| 4+ | 30 min | +30 min cada |

### Limite de Retries

- **Soft limit:** 3 retries -> Notificar admin
- **Hard limit:** 10 retries -> Parar de tentar, marcar como falha permanente
- **Maximo de idade:** 7 dias -> Expirar da fila

---

## Processo de Exportacao

### Fluxo Principal

```
1. Sessao muda para 'completed'
2. Compilar payload de exportacao
3. Iniciar export em background thread
4. Enviar request para Moodle API
5. Processar resposta:
   - Se sucesso: marcar 'exported'
   - Se erro retryable: adicionar a fila
   - Se erro nao-retryable: logar e notificar
```

### Compilacao do Payload

```python
def compile_export_payload(session):
    # 1. Carregar todas as mensagens
    messages = get_messages_by_session(session.id)

    # 2. Agrupar por turno
    conversation = []
    for turn in range(1, 4):
        student_msg = find_message(messages, turn, 'student')
        tutor_msg = find_message(messages, turn, 'tutor')

        if student_msg and tutor_msg:
            conversation.append({
                'turn': turn,
                'student_message': format_student_message(student_msg),
                'tutor_response': format_tutor_message(tutor_msg)
            })

    # 3. Calcular metricas agregadas
    metrics = calculate_session_metrics(messages)

    # 4. Montar payload
    return {
        'session_id': session.id,
        'student': get_student_info(session.student_id),
        'chapter': get_chapter_info(session.chapter_id),
        'question': get_question_info(session.question_id),
        'conversation': conversation,
        'metrics': metrics,
        'session_info': get_session_info(session),
        'metadata': get_metadata()
    }
```

---

## Worker de Retry

### Configuracao

```python
RETRY_WORKER_CONFIG = {
    'interval_seconds': 60,      # Checar a cada minuto
    'batch_size': 10,            # Processar 10 por vez
    'max_concurrent': 5,         # 5 requests simultaneos
    'timeout_seconds': 30        # Timeout por request
}
```

### Processo do Worker

```python
async def retry_worker():
    while True:
        # 1. Buscar itens prontos para retry
        items = await get_pending_exports(
            limit=BATCH_SIZE,
            next_retry_before=datetime.now()
        )

        # 2. Processar em paralelo
        tasks = [process_retry(item) for item in items]
        await asyncio.gather(*tasks)

        # 3. Dormir ate proximo ciclo
        await asyncio.sleep(INTERVAL_SECONDS)

async def process_retry(queue_item):
    try:
        # Marcar como processing
        await update_queue_status(queue_item.id, 'processing')

        # Tentar exportar
        response = await export_to_moodle(queue_item.payload)

        if response.success:
            # Sucesso!
            await mark_session_exported(queue_item.session_id)
            await remove_from_queue(queue_item.id)
        else:
            raise ExportError(response.error)

    except Exception as e:
        # Falha - atualizar para proximo retry
        await handle_retry_failure(queue_item, str(e))
```

---

## Monitoramento

### Metricas a Coletar

| Metrica | Descricao |
|---------|-----------|
| exports_total | Total de exports tentados |
| exports_success | Exports bem sucedidos |
| exports_failed | Exports com falha |
| exports_retried | Exports que precisaram de retry |
| export_latency_ms | Latencia de export |
| queue_size | Tamanho atual da fila |
| queue_age_seconds | Idade do item mais antigo |

### Alertas

| Condicao | Severidade | Acao |
|----------|------------|------|
| queue_size > 100 | WARNING | Notificar equipe |
| queue_size > 500 | CRITICAL | Investigar imediatamente |
| export_success_rate < 90% | WARNING | Verificar API Moodle |
| item com retry_count >= 3 | INFO | Revisar manualmente |
| item com idade > 24h | WARNING | Investigar bloqueio |

---

## Seguranca

### Credenciais

| Credencial | Armazenamento | Rotacao |
|------------|---------------|---------|
| MOODLE_API_TOKEN | Environment variable | 90 dias |
| MOODLE_BASE_URL | Config file | N/A |

### Boas Praticas

1. **Nunca logar tokens** - Mascarar em logs
2. **HTTPS obrigatorio** - Nunca HTTP
3. **Timeout configurado** - Evitar conexoes pendentes
4. **Rate limiting** - Respeitar limites da API
5. **Validar resposta** - Verificar estrutura antes de confiar


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->