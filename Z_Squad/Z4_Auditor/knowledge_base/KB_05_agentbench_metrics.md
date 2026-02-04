---
title: "KB_05 — AgentBench-Style Metrics"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-05-agentbench-metrics"
  - "kb_05 — agentbench-style metri"
  - "🎯 propósito"
  - "1. o que é agentbench?"
  - "2. métricas padrão z4"
  - "2.1 task completion rate (tcr)"
  - "2.2 tool utilization accuracy "
  - "2.3 self-correction rate (scr)"
  - "2.4 robustness score (rs)"
  - "2.5 hallucination rate (hr)"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_05 — AgentBench-Style Metrics

## 🎯 Propósito
Este documento define métricas de avaliação inspiradas em benchmarks acadêmicos (AgentBench, ToolLLM, DeepEval) para o Z4 Auditor.

---

## 1. O Que é AgentBench?

AgentBench é um benchmark acadêmico que avalia LLMs como agentes em 8 ambientes diferentes, focando em:
- Raciocínio multi-turn
- Tomada de decisão
- Uso de ferramentas
- Resistência a erros

---

## 2. Métricas Padrão Z4

### 2.1 Task Completion Rate (TCR)
**O que mede:** % de tarefas concluídas com sucesso.

```yaml
metrica: Task Completion Rate
formula: "(tarefas_completas / tarefas_totais) * 100"
threshold:
  excellent: ">= 95%"
  good: ">= 85%"
  acceptable: ">= 75%"
  fail: "< 75%"
```

### 2.2 Tool Utilization Accuracy (TUA)
**O que mede:** Precisão no uso de ferramentas.

```yaml
metrica: Tool Utilization Accuracy
componentes:
  - selection_accuracy: "Escolheu a ferramenta certa?"
  - parameter_accuracy: "Parâmetros corretos?"
  - execution_success: "Executou sem erro?"
threshold:
  excellent: ">= 90%"
  good: ">= 80%"
  fail: "< 80%"
```

### 2.3 Self-Correction Rate (SCR)
**O que mede:** Capacidade de detectar e corrigir próprios erros.

```yaml
metrica: Self-Correction Rate
formula: "(erros_corrigidos / erros_detectaveis) * 100"
threshold:
  excellent: ">= 80%"
  good: ">= 60%"
  fail: "< 60%"
```

### 2.4 Robustness Score (RS)
**O que mede:** Resistência a variações de input.

```yaml
metrica: Robustness Score
testes:
  - typos: "Input com erros de digitação"
  - paraphrasing: "Mesmo pedido, palavras diferentes"
  - adversarial: "Tentativas de confusão"
threshold:
  excellent: ">= 85%"
  good: ">= 70%"
  fail: "< 70%"
```

### 2.5 Hallucination Rate (HR)
**O que mede:** % de respostas com informações inventadas.

```yaml
metrica: Hallucination Rate
formula: "(respostas_com_alucinacao / total_respostas) * 100"
threshold:
  excellent: "0%"
  good: "< 3%"
  acceptable: "< 5%"
  fail: ">= 5%"
```

### 2.6 DNA Alignment Score (DAS)
**O que mede:** Aderência ao DNA Mental definido.

```yaml
metrica: DNA Alignment Score
componentes:
  - crencas: "Resposta reflete crenças centrais?"
  - principios: "Decisões seguem princípios?"
  - estilo: "Tom e formato seguem style guide?"
threshold:
  excellent: ">= 95%"
  good: ">= 85%"
  fail: "< 85%"
```

---

## 3. Matriz de Avaliação Completa

| Métrica | Peso | Threshold Mínimo | Score |
| :--- | :---: | :--- | :---: |
| Task Completion | 25% | 75% | /25 |
| Tool Utilization | 15% | 80% | /15 |
| Self-Correction | 15% | 60% | /15 |
| Robustness | 15% | 70% | /15 |
| Hallucination | 15% | < 5% | /15 |
| DNA Alignment | 15% | 85% | /15 |
| **TOTAL** | 100% | — | /100 |

**Conversão para Nota:** `nota = score / 10`

---

## 4. Template de Avaliação AgentBench

```markdown
# AgentBench Evaluation — [AGENTE] [DATA]

## Métricas

| Métrica | Valor | Threshold | Status | Score |
| :--- | :--- | :--- | :--- | :--- |
| Task Completion | [X%] | 75% | ✅/❌ | [X]/25 |
| Tool Utilization | [X%] | 80% | ✅/❌ | [X]/15 |
| Self-Correction | [X%] | 60% | ✅/❌ | [X]/15 |
| Robustness | [X%] | 70% | ✅/❌ | [X]/15 |
| Hallucination | [X%] | < 5% | ✅/❌ | [X]/15 |
| DNA Alignment | [X%] | 85% | ✅/❌ | [X]/15 |

## Summary
- **Total Score:** [XX]/100
- **Nota Equivalente:** [X.X]/10
- **Decisão:** [APPROVED/REJECTED]

## Detalhes por Categoria
[...]
```

---

## 5. Comparação com Benchmark Público

Para contextualizar performance, comparar com scores públicos:

| Modelo | AgentBench Score |
| :--- | :--- |
| GPT-4 | 4.01 |
| Claude-2 | 2.50 |
| GPT-3.5 | 1.87 |
| Llama-2-70B | 0.90 |

*Fonte: AgentBench Paper (2023)*

---

## 📚 Referências
- [AgentBench GitHub](https://github.com/THUDM/AgentBench)
- [DeepEval Framework](https://github.com/confident-ai/deepeval)
- [ToolLLM Paper](https://arxiv.org/)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation