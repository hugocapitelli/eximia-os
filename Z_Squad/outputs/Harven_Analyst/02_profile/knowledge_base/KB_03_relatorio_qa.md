# KB_03: Relatorio de QA (Quality Assurance)

## Proposito

Este documento define a estrutura do relatorio de QA gerado pelo AnalystOS para cada interacao, padronizando a comunicacao de resultados.

---

## Estrutura do Relatorio

```json
{
    "analysis_id": "string",
    "timestamp": "datetime",
    "student_message": "string",

    "ai_detection": {
        "probability": 0.0-1.0,
        "confidence": "high | medium | low",
        "verdict": "likely_human | uncertain | likely_ai",
        "indicators": [
            {
                "type": "string",
                "description": "string",
                "weight": 0.0-1.0
            }
        ],
        "flag": "string | null"
    },

    "metrics": {
        "text": {...},
        "time": {...},
        "context": {...},
        "quality": {...}
    },

    "flags": ["string"],

    "observations": ["string"],

    "recommendation": "string"
}
```

---

## Campos Detalhados

### analysis_id
- **Tipo:** string (UUID)
- **Descricao:** Identificador unico da analise
- **Formato:** "analysis_[timestamp]_[random]"

### ai_detection.verdict

| Valor | Probabilidade | Significado |
|-------|---------------|-------------|
| `likely_human` | 0.0 - 0.50 | Texto provavelmente humano |
| `uncertain` | 0.51 - 0.70 | Incerteza na classificacao |
| `likely_ai` | 0.71 - 1.0 | Texto provavelmente gerado por IA |

### ai_detection.confidence

| Valor | Condicao | Significado |
|-------|----------|-------------|
| `high` | Texto > 200 chars, multiplos indicadores | Alta confianca na analise |
| `medium` | Texto 100-200 chars, alguns indicadores | Confianca moderada |
| `low` | Texto < 100 chars, poucos indicadores | Baixa confianca, texto curto |

### observations
Lista de observacoes em linguagem natural para o professor:
- "Texto apresenta vocabulario incomum para contexto academico"
- "Estrutura muito formal para resposta de chat"
- "Presenca de hesitacoes indica origem humana"

### recommendation
Acao sugerida:
- "Nenhuma acao necessaria"
- "Revisar manualmente se necessario"
- "Considerar conversar com aluno sobre uso de IA"

---

## Templates de Observacoes

### Para Alta Probabilidade de IA

```
- "Texto apresenta caracteristicas compativeis com geracao por LLM"
- "Detectados conectores tipicos de texto gerado por IA: [lista]"
- "Vocabulario excessivamente formal para o contexto"
- "Estrutura de texto muito bem organizada, sem hesitacoes naturais"
- "Ausencia de erros de digitacao em texto longo"
```

### Para Baixa Probabilidade de IA

```
- "Texto apresenta caracteristicas tipicamente humanas"
- "Presenca de linguagem informal e expressoes coloquiais"
- "Erros de digitacao consistentes com escrita humana"
- "Hesitacoes e autocorrecoes presentes"
- "Experiencias pessoais mencionadas"
```

### Para Casos Incertos

```
- "Analise inconclusiva devido ao tamanho do texto"
- "Mistura de indicadores humanos e artificiais"
- "Texto pode ter sido editado apos geracao"
- "Recomenda-se avaliacao contextual pelo professor"
```

---

## Exemplos de Relatorios

### Exemplo 1: Provavel IA (Flag Aplicada)

```json
{
    "analysis_id": "analysis_20260112_103000_abc123",
    "timestamp": "2026-01-12T10:30:00Z",
    "student_message": "E importante ressaltar que a sustentabilidade no agronegocio engloba tres dimensoes fundamentais...",

    "ai_detection": {
        "probability": 0.85,
        "confidence": "high",
        "verdict": "likely_ai",
        "indicators": [
            {
                "type": "artificial_connectors",
                "description": "Detectado: 'E importante ressaltar', 'Nesse sentido', 'Portanto, conclui-se'",
                "weight": 0.25
            },
            {
                "type": "formal_vocabulary",
                "description": "Vocabulario excessivamente formal: 'engloba', 'imperativa', 'viabilidade'",
                "weight": 0.20
            },
            {
                "type": "perfect_structure",
                "description": "Estrutura perfeita introducao-desenvolvimento-conclusao",
                "weight": 0.20
            },
            {
                "type": "impersonal_tone",
                "description": "Ausencia total de expressoes pessoais",
                "weight": 0.20
            }
        ],
        "flag": "alta_probabilidade_texto_IA"
    },

    "metrics": {
        "text": {
            "message_length_chars": 485,
            "message_length_words": 78,
            "sentence_count": 4,
            "avg_words_per_sentence": 19.5,
            "has_question": false
        },
        "time": {
            "response_time_seconds": 35
        },
        "quality": {
            "topic_relevance": 0.92,
            "depth_of_thought": "moderate"
        }
    },

    "flags": ["alta_probabilidade_texto_IA"],

    "observations": [
        "Texto apresenta caracteristicas compativeis com geracao por LLM",
        "Detectados multiplos conectores tipicos de ChatGPT",
        "Vocabulario excessivamente formal para contexto de chat",
        "Ausencia de hesitacoes ou expressoes pessoais"
    ],

    "recommendation": "Revisar manualmente. Considerar conversar com aluno sobre uso de IA."
}
```

### Exemplo 2: Provavel Humano (Sem Flag)

```json
{
    "analysis_id": "analysis_20260112_104500_def456",
    "timestamp": "2026-01-12T10:45:00Z",
    "student_message": "Bom, eu acho que sustentabilidade no agro e bem complicado ne. Tipo, o produtor precisa ganhar dinheiro...",

    "ai_detection": {
        "probability": 0.15,
        "confidence": "high",
        "verdict": "likely_human",
        "indicators": [
            {
                "type": "informal_language",
                "description": "Linguagem informal: 'ne', 'tbm', 'q'",
                "weight": -0.20
            },
            {
                "type": "personal_expression",
                "description": "Expressao pessoal: 'eu acho', 'Na fazenda do meu tio'",
                "weight": -0.15
            },
            {
                "type": "typing_patterns",
                "description": "Abreviacoes tipicas de digitacao rapida",
                "weight": -0.10
            }
        ],
        "flag": null
    },

    "metrics": {
        "text": {
            "message_length_chars": 198,
            "message_length_words": 42,
            "sentence_count": 4,
            "avg_words_per_sentence": 10.5,
            "has_question": false
        },
        "time": {
            "response_time_seconds": 28
        },
        "quality": {
            "topic_relevance": 0.85,
            "depth_of_thought": "moderate"
        }
    },

    "flags": [],

    "observations": [
        "Texto apresenta caracteristicas tipicamente humanas",
        "Presenca de linguagem informal e abreviacoes",
        "Mencao a experiencia pessoal (fazenda do tio)",
        "Estilo de escrita consistente com chat informal"
    ],

    "recommendation": "Nenhuma acao necessaria."
}
```

### Exemplo 3: Incerto (Sem Flag, Observacao)

```json
{
    "analysis_id": "analysis_20260112_110000_ghi789",
    "timestamp": "2026-01-12T11:00:00Z",
    "student_message": "Acho importante.",

    "ai_detection": {
        "probability": 0.40,
        "confidence": "low",
        "verdict": "uncertain",
        "indicators": [],
        "flag": null
    },

    "metrics": {
        "text": {
            "message_length_chars": 16,
            "message_length_words": 2,
            "sentence_count": 1,
            "avg_words_per_sentence": 2,
            "has_question": false
        }
    },

    "flags": ["resposta_muito_curta"],

    "observations": [
        "Texto muito curto para analise confiavel",
        "Nao foi possivel identificar padroes significativos",
        "Resposta pode indicar baixo engajamento"
    ],

    "recommendation": "Texto muito curto para analise. Considerar engajamento do aluno."
}
```

---

## Uso do Relatorio

### Armazenamento
- Salvar com cada mensagem do aluno
- Indexar por session_id, student_id, chapter_id
- Permitir busca por flags

### Visualizacao para Professor
- Dashboard com flags de alerta
- Filtro por probabilidade de IA
- Detalhes on-demand

### Auditoria
- Manter historico completo
- Permitir revisao de decisoes
- Suportar apelacoes de alunos
