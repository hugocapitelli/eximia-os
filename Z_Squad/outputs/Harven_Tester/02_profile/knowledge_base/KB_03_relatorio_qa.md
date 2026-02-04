---
title: "KB_03: Estrutura do Relatorio de QA"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-relatorio-qa"
  - "kb_03: estrutura do relatorio "
  - "visao geral"
  - "estrutura do relatorio"
  - "campos detalhados"
  - "verdict"
  - "score"
  - "criteria_results"
  - "summary"
  - "recommendation"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_03: Estrutura do Relatorio de QA

## Visao Geral

O TesterOS deve produzir um relatorio estruturado para cada validacao, permitindo rastreabilidade e aprendizado do sistema.

---

## Estrutura do Relatorio

```json
{
    "verdict": "APPROVED | REJECTED",
    "score": 0.0 - 1.0,
    "criteria_results": {
        "C1_no_direct_answer": {
            "passed": true/false,
            "severity": "CRITICAL",
            "notes": "string"
        },
        "C2_open_question": {...},
        "C3_constructive_feedback": {...},
        "C4_no_labels": {...},
        "C5_natural_flow": {...},
        "C6_topic_connection": {...}
    },
    "summary": {
        "passed_count": int,
        "failed_count": int,
        "critical_failures": [],
        "major_failures": [],
        "minor_issues": []
    },
    "recommendation": "string",
    "observations": ["string"]
}
```

---

## Campos Detalhados

### verdict
- **Tipo:** ENUM
- **Valores:** "APPROVED", "REJECTED"
- **Regra:** REJECTED se qualquer CRITICAL ou MAJOR falhar, ou se score < 0.7

### score
- **Tipo:** Float (0.0 a 1.0)
- **Calculo:** Ver KB_02
- **Threshold:** >= 0.7 para aprovacao

### criteria_results
Objeto com resultado de cada criterio:

```json
{
    "passed": boolean,
    "severity": "CRITICAL | MAJOR | MINOR",
    "notes": "Explicacao do resultado"
}
```

### summary
Resumo executivo dos resultados:

```json
{
    "passed_count": 5,
    "failed_count": 1,
    "critical_failures": [],
    "major_failures": ["C3: Feedback generico"],
    "minor_issues": []
}
```

### recommendation
Acao sugerida:
- Se APPROVED: "Pronto para envio ao aluno"
- Se REJECTED: "Reprocessar via ORIENTADOR com foco em [problema]"

### observations
Lista de observacoes adicionais, mesmo em caso de aprovacao:
- "Feedback poderia ser mais especifico"
- "Pergunta poderia ser mais provocativa"

---

## Templates de Notas por Criterio

### C1 - Sem Resposta Direta

**PASS:**
- "Resposta provoca reflexao sem entregar informacao"
- "Conteudo pedagogico preservado para descoberta do aluno"

**FAIL:**
- "Detectada explicacao completa do conceito [X]"
- "Lista de fatores fornecida diretamente"
- "Linguagem de afirmacao categorica presente"

---

### C2 - Pergunta Aberta

**PASS:**
- "Pergunta aberta presente: '[texto da pergunta]'"
- "Pergunta exige elaboracao e raciocinio"

**FAIL:**
- "Nao termina com pergunta"
- "Pergunta fechada (sim/nao): '[texto]'"
- "Pergunta retorica sem espaco para resposta"

---

### C3 - Feedback Construtivo

**PASS:**
- "Feedback especifico sobre resposta do aluno"
- "Reconhece ponto valido e adiciona nuance"

**FAIL:**
- "Feedback generico: '[texto]'"
- "Feedback ausente - comeca direto com pergunta"
- "Nenhuma referencia ao que o aluno disse"

---

### C4 - Sem Rotulos

**PASS:**
- "Texto limpo, sem rotulos ou formatacao artificial"

**FAIL:**
- "Rotulo detectado: [Feedback]"
- "Formatacao artificial: **Pergunta:**"
- "Numeracao presente: 1., 2."

---

### C5 - Texto Fluido

**PASS:**
- "Texto natural e fluido"

**WARN:**
- "Leve rigidez estrutural, mas aceitavel"
- "Vocabulario poderia ser mais acessivel"

**FAIL:**
- "Texto extremamente robotico"
- "Estruturas artificiais predominantes"

---

### C6 - Conexao Tema

**PASS:**
- "Claramente conectado ao tema do capitulo"

**WARN:**
- "Levemente tangencial, mas ainda relevante"

**FAIL:**
- "Fora do tema do capitulo"
- "Desvio significativo do assunto"

---

## Exemplo de Relatorio APPROVED

```json
{
    "verdict": "APPROVED",
    "score": 0.92,
    "criteria_results": {
        "C1_no_direct_answer": {
            "passed": true,
            "severity": "CRITICAL",
            "notes": "Resposta provoca reflexao sem entregar informacao"
        },
        "C2_open_question": {
            "passed": true,
            "severity": "CRITICAL",
            "notes": "Pergunta aberta presente: 'Como voce aplicaria isso?'"
        },
        "C3_constructive_feedback": {
            "passed": true,
            "severity": "MAJOR",
            "notes": "Feedback especifico sobre observacao do aluno"
        },
        "C4_no_labels": {
            "passed": true,
            "severity": "MAJOR",
            "notes": "Texto limpo, sem rotulos"
        },
        "C5_natural_flow": {
            "passed": true,
            "severity": "MINOR",
            "notes": "Texto natural e fluido"
        },
        "C6_topic_connection": {
            "passed": true,
            "severity": "MINOR",
            "notes": "Claramente conectado ao tema"
        }
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

## Exemplo de Relatorio REJECTED

```json
{
    "verdict": "REJECTED",
    "score": 0,
    "criteria_results": {
        "C1_no_direct_answer": {
            "passed": false,
            "severity": "CRITICAL",
            "notes": "Detectada lista de fatores: 'Os principais riscos sao climaticos, de mercado e sanitarios'"
        },
        "C2_open_question": {
            "passed": true,
            "severity": "CRITICAL",
            "notes": "Pergunta presente no final"
        },
        "C3_constructive_feedback": {
            "passed": true,
            "severity": "MAJOR",
            "notes": "Feedback presente"
        },
        "C4_no_labels": {
            "passed": true,
            "severity": "MAJOR",
            "notes": "Sem rotulos"
        },
        "C5_natural_flow": {
            "passed": true,
            "severity": "MINOR",
            "notes": "Texto fluido"
        },
        "C6_topic_connection": {
            "passed": true,
            "severity": "MINOR",
            "notes": "Conectado ao tema"
        }
    },
    "summary": {
        "passed_count": 5,
        "failed_count": 1,
        "critical_failures": ["C1: Resposta direta detectada"],
        "major_failures": [],
        "minor_issues": []
    },
    "recommendation": "Reprocessar via ORIENTADOR - evitar listar fatores diretamente",
    "observations": [
        "A lista de tipos de risco deveria ser descoberta pelo aluno atraves de perguntas"
    ]
}
```


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation