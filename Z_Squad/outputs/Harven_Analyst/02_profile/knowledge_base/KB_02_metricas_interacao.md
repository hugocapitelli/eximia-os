# KB_02: Metricas de Interacao

## Proposito

Este documento define as metricas coletadas em cada interacao do chat socratico, padronizando a coleta de dados para analise posterior.

---

## Metricas Obrigatorias

### 1. Metricas de Texto

| Metrica | Tipo | Descricao | Exemplo |
|---------|------|-----------|---------|
| `message_length_chars` | int | Numero de caracteres | 342 |
| `message_length_words` | int | Numero de palavras | 58 |
| `sentence_count` | int | Numero de frases | 4 |
| `avg_words_per_sentence` | float | Media de palavras por frase | 14.5 |
| `has_question` | boolean | Contem pergunta | true |

### 2. Metricas de Tempo

| Metrica | Tipo | Descricao | Exemplo |
|---------|------|-----------|---------|
| `timestamp` | datetime | Momento da mensagem | "2026-01-12T10:30:00Z" |
| `response_time_seconds` | int | Tempo desde ultima msg IA | 45 |
| `session_duration_seconds` | int | Tempo total da sessao | 180 |

### 3. Metricas de Contexto

| Metrica | Tipo | Descricao | Exemplo |
|---------|------|-----------|---------|
| `turn_number` | int | Numero do turno (1-3) | 2 |
| `interactions_remaining` | int | Interacoes restantes | 1 |
| `chapter_id` | string | ID do capitulo | "ch_123" |
| `session_id` | string | ID da sessao | "sess_456" |

---

## Metricas de Deteccao de IA

| Metrica | Tipo | Descricao | Exemplo |
|---------|------|-----------|---------|
| `ai_probability` | float | Probabilidade de IA (0.0-1.0) | 0.72 |
| `ai_detection_confidence` | string | Confianca da analise | "high" |
| `ai_indicators_found` | array | Indicadores detectados | ["conectores_artificiais", "vocabulario_rebuscado"] |
| `ai_flag` | string/null | Flag aplicada | "alta_probabilidade_texto_IA" |

---

## Metricas de Qualidade

| Metrica | Tipo | Descricao | Exemplo |
|---------|------|-----------|---------|
| `response_quality_score` | float | Score de qualidade (0.0-1.0) | 0.85 |
| `engagement_level` | string | Nivel de engajamento | "high" |
| `topic_relevance` | float | Relevancia ao tema (0.0-1.0) | 0.90 |
| `depth_of_thought` | string | Profundidade da resposta | "superficial" / "moderate" / "deep" |

---

## Flags de Alerta

| Flag | Condicao | Descricao |
|------|----------|-----------|
| `alta_probabilidade_texto_IA` | ai_probability > 0.70 | Texto pode ser gerado por IA |
| `resposta_muito_rapida` | response_time < 10s AND length > 200 | Resposta longa em tempo curto |
| `resposta_muito_curta` | message_length_words < 10 | Resposta com poucas palavras |
| `off_topic` | topic_relevance < 0.3 | Resposta fora do tema |
| `padrao_copy_paste` | detectado copy do material | Texto copiado (NAO e negativo) |

---

## Estrutura do Objeto Metrics

```json
{
    "text_metrics": {
        "message_length_chars": 342,
        "message_length_words": 58,
        "sentence_count": 4,
        "avg_words_per_sentence": 14.5,
        "has_question": false
    },
    "time_metrics": {
        "timestamp": "2026-01-12T10:30:00Z",
        "response_time_seconds": 45,
        "session_duration_seconds": 180
    },
    "context_metrics": {
        "turn_number": 2,
        "interactions_remaining": 1,
        "chapter_id": "ch_123",
        "session_id": "sess_456",
        "student_id": "student_789"
    },
    "ai_detection": {
        "probability": 0.72,
        "confidence": "high",
        "indicators_found": ["conectores_artificiais", "vocabulario_rebuscado"],
        "flag": "alta_probabilidade_texto_IA"
    },
    "quality_metrics": {
        "response_quality_score": 0.85,
        "engagement_level": "high",
        "topic_relevance": 0.90,
        "depth_of_thought": "moderate"
    },
    "flags": ["alta_probabilidade_texto_IA"]
}
```

---

## Calculo de Metricas Derivadas

### Engagement Level

```
Se response_time < 30s E message_length_words > 30:
    engagement = "high"
Se response_time < 60s E message_length_words > 15:
    engagement = "medium"
Senao:
    engagement = "low"
```

### Depth of Thought

```
Se message_length_words > 100 E has_question E topic_relevance > 0.7:
    depth = "deep"
Se message_length_words > 50 E topic_relevance > 0.5:
    depth = "moderate"
Senao:
    depth = "superficial"
```

### Topic Relevance

```
Analisa presenca de termos-chave do capitulo no texto
Calcula overlap semantico com conteudo do capitulo
Retorna score 0.0-1.0
```

---

## Agregacoes por Sessao

Ao finalizar uma sessao, calcular:

| Agregacao | Descricao |
|-----------|-----------|
| `avg_response_time` | Media de tempo de resposta |
| `total_words_written` | Total de palavras escritas |
| `avg_ai_probability` | Media de probabilidade de IA |
| `flags_triggered` | Lista de todos os flags |
| `overall_engagement` | Engajamento geral da sessao |
| `overall_depth` | Profundidade geral das respostas |

---

## Uso das Metricas

### Para o Professor

- Ver flags de alerta por aluno
- Analisar padroes de engajamento
- Identificar alunos que precisam de apoio
- Revisar sessoes com alta probabilidade de IA

### Para o Sistema

- Melhorar algoritmos de deteccao
- Ajustar thresholds baseado em dados
- Identificar padroes de uso
- Otimizar experiencia do aluno

### Para Analytics

- Relatorios de uso por curso/capitulo
- Tendencias de engajamento ao longo do tempo
- Comparativos entre turmas
- Eficacia das perguntas socraticas


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->