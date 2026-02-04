---
title: "KB_01 — Decomposition Frameworks"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-decomposition-frameworks"
  - "kb_01 — decomposition framewor"
  - "🎯 propósito"
  - "1. socratic questioning (quest"
  - "o que é?"
  - "as 6 perguntas fundamentais"
  - "exemplo aplicado"
  - "2. mece principle (mckinsey)"
  - "aplicação"
  - "checklist mece"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_01 — Decomposition Frameworks

## 🎯 Propósito
Este documento contém os frameworks de decomposição de problemas usados pelo Z1 Architect para transformar pedidos vagos em especificações técnicas.

---

## 1. Socratic Questioning (Questionamento Socrático)

### O Que É?
Método de investigação profunda através de perguntas encadeadas para revelar premissas ocultas e clarificar requisitos.

### As 6 Perguntas Fundamentais
| # | Pergunta | Propósito |
| :---: | :--- | :--- |
| 1 | **O QUE** exatamente você quer que o agente faça? | Clarificar a ação |
| 2 | **POR QUE** você precisa disso? | Entender o problema raiz |
| 3 | **PARA QUEM** é este agente? | Identificar stakeholders |
| 4 | **QUANDO** ele será usado? | Contexto temporal |
| 5 | **COMO** você saberá se funcionou? | Critérios de sucesso |
| 6 | **O QUE** acontece se falhar? | Riscos e fallbacks |

### Exemplo Aplicado
**Pedido:** "Preciso de um agente CFO"

| Pergunta | Resposta Esperada |
| :--- | :--- |
| O QUE? | Análise financeira para decisões de M&A |
| POR QUE? | Reduzir tempo de due diligence de 2 semanas para 3 dias |
| PARA QUEM? | CEO e Board |
| QUANDO? | Durante processos de aquisição (ad-hoc) |
| COMO MEDIR? | Accuracy do valuation ±10% do valor real |
| SE FALHAR? | Revisão humana obrigatória |

---

## 2. MECE Principle (McKinsey)

### O Que É?
**M**utually **E**xclusive, **C**ollectively **E**xhaustive — Decomposição sem sobreposição e sem lacunas.

### Aplicação
Ao listar competências, garantir que:
- **Cada skill é distinta** (não há overlap)
- **Todas as skills necessárias estão listadas** (não há gaps)

### Checklist MECE
- [ ] Duas skills diferentes podem resolver a mesma tarefa? (Se sim, remover uma)
- [ ] Alguma tarefa não tem skill associada? (Se sim, adicionar)

---

## 3. SMART Goals (Critérios de Sucesso)

### Framework
| Letra | Significado | Exemplo |
| :---: | :--- | :--- |
| S | **Specific** (Específico) | "Calcular fair value via DCF" |
| M | **Measurable** (Mensurável) | "Accuracy ±8%" |
| A | **Achievable** (Alcançável) | "Com dados públicos" |
| R | **Relevant** (Relevante) | "Para decisões de M&A" |
| T | **Time-bound** (Temporal) | "Em < 4 horas" |

### Anti-Pattern
❌ "O agente deve ser bom em finanças"
✅ "O agente deve calcular DCF com accuracy ±8% em < 4h usando dados do Capital IQ"

---

## 4. First Principles Thinking (Elon Musk)

### O Que É?
Decompor um problema até suas verdades fundamentais e reconstruir a partir delas.

### Aplicação
Ao definir um agente, perguntar:
1. **Qual é a função mais básica que ele deve executar?**
2. **O que é absolutamente necessário para isso?**
3. **O que é apenas "nice to have"?**

### Exemplo
**Agente:** CFO
- **Função básica:** Calcular se uma empresa vale o preço pedido.
- **Necessário:** Dados financeiros, fórmula de valuation, comparáveis.
- **Nice to have:** Integração com Slack, dashboard bonito.

---

## 📚 Referências
- [HBR: The Art of Asking Questions](https://hbr.org/)
- [McKinsey: MECE Framework](https://www.mckinsey.com/)
- [Peter Drucker: Management by Objectives](https://drucker.institute/)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation