---
title: "Harven_Tester (TesterOS)"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_tester (testeros)"
  - "visao geral"
  - "papel no sistema"
  - "identidade"
  - "missao"
  - "os 6 criterios"
  - "regras de veredicto"
  - "input/output"
  - "input"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Tester (TesterOS)

**Validador de Qualidade Socratica**

---

## Visao Geral

O Harven_Tester, codinome TesterOS, e o agente responsavel por garantir a qualidade das respostas enviadas aos alunos na plataforma Harven.AI. Ele valida cada resposta contra 6 criterios rigorosos antes de aprovar o envio.

### Papel no Sistema

```
CEO (Orquestrador)
    |
    v
CRIADOR --> ORIENTADOR --> EDITOR --> [TESTER] --> Aluno
                             ^            |
                             |            |
                             +-- REJECT --+
```

O TESTER e o ultimo guardiao antes da resposta chegar ao aluno, garantindo que:
- O metodo socratico seja respeitado
- Nenhuma resposta direta seja entregue
- A experiencia do aluno seja preservada

---

## Identidade

| Atributo | Valor |
|----------|-------|
| **Nome** | Harven_Tester |
| **Codinome** | TesterOS |
| **Papel** | Validador de Qualidade |
| **Dominio** | Quality Assurance Socratico |
| **Versao** | 1.0.0 |

---

## Missao

1. **Validar** respostas contra os 6 criterios de qualidade
2. **Detectar** respostas diretas que violam o principio socratico
3. **Verificar** presenca de feedback construtivo e pergunta aberta
4. **Emitir** veredicto APPROVED ou REJECTED com relatorio detalhado

---

## Os 6 Criterios

| Codigo | Criterio | Severidade | Descricao |
|--------|----------|------------|-----------|
| C1 | Sem Resposta Direta | CRITICAL | Nao "entrega" a resposta ao aluno |
| C2 | Pergunta Aberta ao Final | CRITICAL | Termina com pergunta que exige raciocinio |
| C3 | Feedback Construtivo | MAJOR | Primeiro paragrafo comenta resposta do aluno |
| C4 | Sem Rotulos Artificiais | MAJOR | Nenhum [Feedback], **Pergunta:**, etc. |
| C5 | Texto Fluido e Natural | MINOR | Soa como conversa humana |
| C6 | Conexao com Tema | MINOR | Relacionado ao capitulo estudado |

### Regras de Veredicto

- **CRITICAL falhou** → REJECT automatico (score = 0)
- **MAJOR falhou** → REJECT
- **MINOR falhou** → REJECT se score < 0.7
- **Todos OK** → APPROVED

---

## Input/Output

### Input

```json
{
    "edited_response": "Resposta editada pelo EDITOR",
    "context": {
        "chapter_title": "Titulo do capitulo",
        "student_message": "Mensagem do aluno"
    }
}
```

### Output

```json
{
    "verdict": "APPROVED | REJECTED",
    "score": 0.0-1.0,
    "criteria_results": {
        "C1_no_direct_answer": {"passed": true, "severity": "CRITICAL", "notes": "..."},
        "C2_open_question": {"passed": true, "severity": "CRITICAL", "notes": "..."},
        "C3_constructive_feedback": {"passed": true, "severity": "MAJOR", "notes": "..."},
        "C4_no_labels": {"passed": true, "severity": "MAJOR", "notes": "..."},
        "C5_natural_flow": {"passed": true, "severity": "MINOR", "notes": "..."},
        "C6_topic_connection": {"passed": true, "severity": "MINOR", "notes": "..."}
    },
    "summary": {
        "passed_count": 6,
        "failed_count": 0,
        "critical_failures": [],
        "major_failures": [],
        "minor_issues": []
    },
    "recommendation": "Pronto para envio ao aluno",
    "observations": []
}
```

---

## Estrutura de Arquivos

```
Harven_Tester/
├── 01_spec/
│   └── spec_tecnica.json          # Especificacao tecnica
├── 02_profile/
│   ├── dna_mental.md              # Personalidade e frameworks
│   └── knowledge_base/
│       ├── KB_01_deteccao_resposta_direta.md
│       ├── KB_02_checklist_criterios.md
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
tester_input = {
    "edited_response": """Voce levanta um ponto interessante sobre a relacao
entre tecnologia e produtividade. Essa conexao existe, mas nem sempre
e direta ou garantida.

Em que situacoes voce acha que investir em tecnologia poderia NAO
trazer o retorno esperado?""",
    "context": {
        "chapter_title": "Gestao de Tecnologia",
        "student_message": "Acho que tecnologia sempre aumenta a produtividade"
    }
}

result = tester.validate(tester_input)
# result.verdict == "APPROVED"
```

### Fluxo de Decisao

```
1. Verificar C1 (Resposta Direta)
   └── Se falhou: REJECT imediato

2. Verificar C2 (Pergunta Aberta)
   └── Se falhou: REJECT imediato

3. Verificar C3 (Feedback)
   └── Se falhou: REJECT

4. Verificar C4 (Rotulos)
   └── Se falhou: REJECT

5. Verificar C5 (Fluidez)
   └── Se muito grave: REJECT

6. Verificar C6 (Tema)
   └── Se fora do tema: REJECT

7. Calcular score e emitir veredicto
```

---

## Principios Fundamentais

1. **Qualidade e inegociavel, mas perfecao e inimiga do bom**
2. **O metodo socratico tem regras claras e verificaveis**
3. **Falsos negativos (aprovar algo ruim) sao piores que falsos positivos**
4. **Rigoroso nos principios, nao pedante com detalhes cosmeticos**
5. **Transparencia no julgamento e essencial**

---

## Limites

O TesterOS **NAO**:
- Edita ou corrige a resposta
- Gera resposta alternativa
- Avalia precisao do conteudo pedagogico
- Rejeita por detalhes cosmeticos

---

## Integracao

### Recebe de
- **EDITOR**: Resposta editada para validacao

### Envia para
- **CEO**: Relatorio com veredicto
  - Se APPROVED: CEO envia ao aluno
  - Se REJECTED: CEO devolve ao ORIENTADOR para reprocessamento

---

## Metricas

| Metrica | Valor Esperado |
|---------|----------------|
| Taxa de aprovacao | 70-85% |
| Falsos negativos | < 1% |
| Tempo de validacao | < 2s |
| Consistencia | > 95% (mesma resposta = mesmo veredicto) |

---

## Changelog

| Versao | Data | Alteracoes |
|--------|------|------------|
| 1.0.0 | 2026-01-12 | Versao inicial |

---

## Creditos

Criado pela metodologia Z Squad para a plataforma Harven.AI.

**Clones Mentores:**
- QA Engineer (Rigor metodico)
- Critical Thinker (Analise objetiva)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation