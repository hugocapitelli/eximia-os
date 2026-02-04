---
title: "Harven_Analyst (AnalystOS)"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_analyst (analystos)"
  - "visao geral"
  - "papel no sistema"
  - "identidade"
  - "missao"
  - "principios fundamentais"
  - "deteccao de ia"
  - "indicadores analisados"
  - "frases tipicas de llms"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Analyst (AnalystOS)

**Analista de Metricas e Deteccao de IA**

---

## Visao Geral

O Harven_Analyst, codinome AnalystOS, e o agente responsavel por coletar metricas de cada interacao e detectar probabilidade de uso de IA nas respostas dos alunos na plataforma Harven.AI.

### Papel no Sistema

```
Aluno envia mensagem
        |
        v
   [ANALYST] <-- Analisa ANTES de salvar
        |
        +---> Metricas + Flags
        |
        v
  ORGANIZADOR (salva no banco)
        |
        v
   ORIENTADOR (processa resposta)
```

O ANALYST atua como observador silencioso, coletando dados para apoiar decisoes pedagogicas sem interferir no fluxo.

---

## Identidade

| Atributo | Valor |
|----------|-------|
| **Nome** | Harven_Analyst |
| **Codinome** | AnalystOS |
| **Papel** | Analista de Metricas e Deteccao de IA |
| **Dominio** | Quality Analytics & AI Detection |
| **Versao** | 1.0.0 |

---

## Missao

1. **Analisar** cada mensagem do aluno ANTES de salvar no banco
2. **Calcular** probabilidade de texto gerado por IA (0.0 a 1.0)
3. **Coletar** metricas padronizadas de cada interacao
4. **Aplicar** flags de alerta quando necessario
5. **Gerar** relatorio de QA para cada analise

---

## Principios Fundamentais

| Principio | Descricao |
|-----------|-----------|
| **Dados, nao julgamentos** | Coletar e analisar, nao condenar |
| **Professor decide** | Fornece informacoes, nao toma acoes |
| **Copy/paste e legitimo** | NAO e indicador de uso de IA |
| **Padroes de LLM sao detectaveis** | Vocabulario, estrutura, tom |
| **Transparencia** | Criterios claros e explicaveis |

---

## Deteccao de IA

### Indicadores Analisados

| Categoria | Indicadores | Peso |
|-----------|-------------|------|
| **Estilo** | Fluidez excessiva, ausencia de erros, tom impessoal | ALTO |
| **Vocabulario** | Termos rebuscados, formalidade excessiva | ALTO |
| **Estrutura** | Conectores artificiais, conclusoes formulaicas | MEDIO |

### Frases Tipicas de LLMs

```
- "E importante ressaltar que..."
- "Nesse sentido..."
- "Diante do exposto..."
- "Portanto, conclui-se que..."
- "Ademais..."
```

### O que NAO e Indicador de IA

- Copy/paste do material (legitimo)
- Erros de ortografia (indica humano)
- Linguagem informal (indica humano)
- Girias e hesitacoes (indica humano)

---

## Escala de Probabilidade

| Faixa | Classificacao | Flag |
|-------|---------------|------|
| 0.0 - 0.50 | likely_human | Nenhuma |
| 0.51 - 0.70 | uncertain | Nenhuma |
| 0.71 - 1.0 | likely_ai | `alta_probabilidade_texto_IA` |

---

## Input/Output

### Input

```json
{
    "student_message": "Mensagem do aluno",
    "context": {
        "chapter_id": "ch_123",
        "turn_number": 2
    },
    "interaction_metadata": {
        "session_id": "sess_456",
        "timestamp": "2026-01-12T10:30:00Z"
    }
}
```

### Output

```json
{
    "analysis_id": "analysis_20260112_103000_abc",
    "timestamp": "2026-01-12T10:30:00Z",
    "ai_detection": {
        "probability": 0.85,
        "confidence": "high",
        "verdict": "likely_ai",
        "indicators": [...],
        "flag": "alta_probabilidade_texto_IA"
    },
    "metrics": {
        "text": {...},
        "time": {...},
        "quality": {...}
    },
    "flags": ["alta_probabilidade_texto_IA"],
    "observations": ["..."],
    "recommendation": "Revisar manualmente..."
}
```

---

## Estrutura de Arquivos

```
Harven_Analyst/
├── 01_spec/
│   └── spec_tecnica.json          # Especificacao tecnica
├── 02_profile/
│   ├── dna_mental.md              # Personalidade e frameworks
│   └── knowledge_base/
│       ├── KB_01_deteccao_ia.md
│       ├── KB_02_metricas_interacao.md
│       └── KB_03_relatorio_qa.md
├── 03_prompt/
│   ├── prompt_operacional.md      # System prompt
│   └── schemas/
│       ├── input_schema.json
│       └── output_schema.json
├── 04_validation/
│   └── validation_report.md       # Relatorio de auditoria
└── README.md
```

---

## Uso

### Exemplo de Chamada

```python
analyst_input = {
    "student_message": "E importante ressaltar que a sustentabilidade engloba tres dimensoes fundamentais...",
    "context": {
        "chapter_id": "ch_123",
        "turn_number": 1
    }
}

result = analyst.analyze(analyst_input)
# result.ai_detection.probability == 0.85
# result.ai_detection.flag == "alta_probabilidade_texto_IA"
```

### Fluxo de Analise

```
1. Coletar metricas basicas (chars, words, sentences)
2. Analisar indicadores de IA (conectores, vocabulario, estrutura)
3. Analisar indicadores humanos (erros, informalidade, hesitacoes)
4. Ajustar score por tamanho do texto
5. Classificar (likely_human / uncertain / likely_ai)
6. Aplicar flags se necessario
7. Gerar relatorio
```

---

## Metricas Coletadas

| Metrica | Descricao |
|---------|-----------|
| `message_length_chars` | Numero de caracteres |
| `message_length_words` | Numero de palavras |
| `sentence_count` | Numero de frases |
| `has_question` | Contem pergunta |
| `response_time_seconds` | Tempo de resposta |
| `ai_probability` | Probabilidade de IA |
| `topic_relevance` | Relevancia ao tema |
| `depth_of_thought` | Profundidade da resposta |

---

## Flags de Alerta

| Flag | Condicao |
|------|----------|
| `alta_probabilidade_texto_IA` | probability > 0.70 |
| `resposta_muito_rapida` | time < 10s E length > 200 |
| `resposta_muito_curta` | words < 10 |
| `off_topic` | relevance < 0.3 |

---

## Limites

O AnalystOS **NAO**:
- Bloqueia envio de mensagem
- Da nota ou penalidade automatica
- Considera copy/paste como fraude
- Julga o aluno moralmente
- Altera a mensagem do aluno

---

## Integracao

### Recebe de
- **CEO**: Mensagem do aluno para analise

### Envia para
- **CEO**: Relatorio de analise com metricas e flags
- **ORGANIZADOR**: Dados para persistencia

---

## Metricas de Performance

| Metrica | Valor Esperado |
|---------|----------------|
| Precisao de deteccao | > 80% |
| Taxa de falsos positivos | < 10% |
| Tempo de analise | < 1s |

---

## Consideracoes Eticas

- Deteccao NAO e 100% precisa
- Pode ter falsos positivos/negativos
- Deve ser usada como ferramenta, nao sentenca
- Professor tem palavra final
- Foco em apoio pedagogico, nao em "pegar" alunos

---

## Changelog

| Versao | Data | Alteracoes |
|--------|------|------------|
| 1.0.0 | 2026-01-12 | Versao inicial |

---

## Creditos

Criado pela metodologia Z Squad para a plataforma Harven.AI.

**Clones Mentores:**
- Data Scientist (Rigor analitico)
- Linguist (Deteccao de padroes)
- Ethics Advisor (Uso responsavel)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation