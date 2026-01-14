# KB_02 — Schema Design Patterns

## 🎯 Propósito
Este documento contém padrões de design de JSON Schemas para validação de I/O de agentes.

---

## 1. Por Que Usar Schemas?

| Benefício | Descrição |
| :--- | :--- |
| **Validação** | Garantir que inputs/outputs têm formato correto |
| **Documentação** | Schema é auto-documentado |
| **Integração** | Facilita APIs e pipelines |
| **Debugging** | Erros de formato são detectados antes da execução |

---

## 2. JSON Schema 101

### Tipos Básicos
```json
{"type": "string"}
{"type": "number"}
{"type": "integer"}
{"type": "boolean"}
{"type": "array", "items": {"type": "string"}}
{"type": "object", "properties": {...}}
```

### Validações Comuns
```json
{
  "type": "string",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[A-Za-z]+$"
}

{
  "type": "number",
  "minimum": 0,
  "maximum": 100
}

{
  "type": "string",
  "enum": ["GO", "NO-GO", "GO-CONDICIONAL"]
}
```

---

## 3. Padrões para Input Schema

### 3.1 Estrutura Base
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Input Schema",
  "type": "object",
  "required": ["tipo_analise", "dados"],
  "properties": {
    "tipo_analise": {
      "type": "string",
      "enum": ["M&A", "CAPEX", "Valuation"]
    },
    "dados": {
      "type": "object",
      "required": ["empresa", "revenue"],
      "properties": {
        "empresa": {"type": "string", "minLength": 1},
        "revenue": {"type": "integer", "minimum": 0}
      }
    },
    "contexto": {
      "type": "string",
      "description": "Informações adicionais (opcional)"
    }
  }
}
```

### 3.2 Padrões de Campos
| Campo | Tipo | Validação Típica |
| :--- | :--- | :--- |
| `empresa_nome` | string | minLength: 1 |
| `revenue` | integer | minimum: 0 |
| `percentual` | number | minimum: 0, maximum: 1 |
| `data` | string | format: "date" |
| `decisao` | string | enum: ["GO", "NO-GO"] |

---

## 4. Padrões para Output Schema

### 4.1 Estrutura Base
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Output Schema",
  "type": "object",
  "required": ["recomendacao", "confianca", "rationale"],
  "properties": {
    "recomendacao": {
      "type": "string",
      "enum": ["GO", "NO-GO", "GO-CONDICIONAL"]
    },
    "confianca": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Nível de confiança (0-1)"
    },
    "metricas": {
      "type": "object",
      "properties": {
        "fair_value": {"type": "integer"},
        "fit_score": {"type": "integer", "minimum": 0, "maximum": 50}
      }
    },
    "rationale": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["categoria", "finding"],
        "properties": {
          "categoria": {"type": "string"},
          "finding": {"type": "string"},
          "impacto": {"type": "string", "enum": ["POSITIVO", "NEGATIVO", "NEUTRO"]}
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "timestamp": {"type": "string", "format": "date-time"},
        "versao_agente": {"type": "string"},
        "tempo_processamento_ms": {"type": "integer"}
      }
    }
  }
}
```

---

## 5. Padrões de Validação Customizada

### 5.1 Conditional Validation
```json
{
  "if": {
    "properties": {"tipo_analise": {"const": "M&A"}}
  },
  "then": {
    "required": ["dados_transacao"]
  }
}
```

### 5.2 Cross-Field Validation
```yaml
# validation_rules.yaml
regras:
  - id: VR-001
    validacao: |
      IF revenue == 0:
        WARNING "Revenue zero - validar se empresa opera"

  - id: VR-002
    validacao: |
      IF multiplo > 15:
        WARNING "Múltiplo alto - verificar premissas"
```

---

## 6. Checklist de Qualidade

- [ ] Todos os campos obrigatórios estão em `required`
- [ ] Tipos são os mais restritivos possíveis
- [ ] Enums são usados para valores finitos
- [ ] Ranges (min/max) são definidos para números
- [ ] Descrições claras para cada campo
- [ ] Metadata inclui timestamp e versão

---

## 📚 Referências
- [JSON Schema Specification](https://json-schema.org/)
- [The_Recruiter: PIPELINE_10_FASES.md (Fase 6)](../../The_Recruiter/PIPELINE_10_FASES.md)
