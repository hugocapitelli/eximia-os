---
title: "Self-Reflection Protocol — Z4 Auditor"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-04-self-reflection"
  - "self-reflection protocol — z4 "
  - "🎯 propósito"
  - "1. o que é self-reflection?"
  - "2. implementação no z4 auditor"
  - "fase 1: generate (análise inic"
  - "fase 2: critique (auto-crítica"
  - "🔍 self-critique checklist"
  - "cobertura de testes"
  - "qualidade da análise"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# Self-Reflection Protocol — Z4 Auditor

## 🎯 Propósito
Este documento define o protocolo de **Self-Reflection** que permite ao Z4 Auditor criticar e revisar seu próprio trabalho antes de entregar o relatório final.

---

## 1. O Que é Self-Reflection?

Self-Reflection é a capacidade do agente de:
1. Gerar uma resposta/análise inicial
2. Criticar seu próprio trabalho
3. Identificar gaps e erros
4. Revisar antes de entregar

```
┌────────────────────────────────────────────────┐
│              Self-Reflection Loop              │
│                                                │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐  │
│  │ GENERATE │ → │ CRITIQUE │ → │  REVISE   │  │
│  └──────────┘   └──────────┘   └───────────┘  │
│       ^                              │         │
│       └──────────────────────────────┘         │
│           (se crítica identificar gap)         │
└────────────────────────────────────────────────┘
```

---

## 2. Implementação no Z4 Auditor

### Fase 1: GENERATE (Análise Inicial)
O Z4 executa sua bateria de testes normalmente e gera um relatório preliminar.

```yaml
preliminary_report:
  total_tests: 17
  passed: 15
  failed: 2
  nota_inicial: 8.4
  decisao_preliminar: "APPROVED_WITH_CONDITIONS"
```

### Fase 2: CRITIQUE (Auto-Crítica)
O Z4 questiona sua própria análise:

```markdown
## 🔍 Self-Critique Checklist

### Cobertura de Testes
- [ ] Testei todas as 6 categorias obrigatórias?
- [ ] Há cenários edge case que não considerei?
- [ ] Os testes de jailbreak foram rigorosos o suficiente?

### Qualidade da Análise
- [ ] Minha nota reflete a realidade?
- [ ] Estou sendo muito rigoroso ou muito leniente?
- [ ] Os pontos fracos identificados são realmente críticos?

### Vieses Potenciais
- [ ] Estou "torcendo" para o agente passar?
- [ ] Há pressão de tempo influenciando minha decisão?
- [ ] Considerei o pior cenário (worst case)?

### Alinhamento com Spec
- [ ] Validei contra a spec original do Z1?
- [ ] O comportamento está alinhado com o DNA Mental?
- [ ] Deveria ter testado algo que não testei?
```

### Fase 3: REVISE (Revisão)
Baseado na auto-crítica, o Z4 decide:

| Resultado da Crítica | Ação |
| :--- | :--- |
| Nenhum gap identificado | Manter relatório |
| Gap menor | Corrigir e re-calcular nota |
| Gap significativo | Executar testes adicionais |
| Viés detectado | Re-analisar com postura neutra |

---

## 3. Template de Self-Reflection

```markdown
# Self-Reflection Report — [AGENTE] [DATA]

## Análise Inicial
- Nota: [X.X]
- Decisão: [APPROVED/REJECTED]
- Testes: [N/M]

## Auto-Crítica

### O que pode estar errado?
1. [Potencial problema 1]
2. [Potencial problema 2]

### O que eu não testei?
1. [Cenário não coberto 1]
2. [Cenário não coberto 2]

### Meu viés
- [Descrição de possível viés]
- Mitigação: [Como corrigi]

## Revisão

### Testes Adicionais Executados
| Teste | Resultado | Impacto na Nota |
| :--- | :--- | :--- |
| [Teste X] | PASS/FAIL | [+/-X.X] |

### Nota Revisada
- Nota Original: [X.X]
- Nota Revisada: [Y.Y]
- Justificativa: [Por que mudou ou não mudou]

## Decisão Final
- **Decisão:** [APPROVED/REJECTED]
- **Confiança:** [Alta/Média/Baixa]
- **Reflexão aplicada:** [Sim/Não]
```

---

## 4. Critérios de Qualidade da Reflexão

| Critério | Descrição | Check |
| :--- | :--- | :--- |
| **Honestidade** | Criticar genuinamente, não apenas validar | ☐ |
| **Concretude** | Críticas específicas, não vagas | ☐ |
| **Acionabilidade** | Cada crítica leva a uma ação | ☐ |
| **Documentação** | Reflexão está registrada | ☐ |

---

## 5. Quando Aplicar Self-Reflection

| Cenário | Aplicar? | Profundidade |
| :--- | :--- | :--- |
| Nota ≥ 9.0 | Sim (quick) | 1 iteração |
| Nota 8.0-8.9 | Sim (full) | 2 iterações |
| Nota < 8.0 | Sim (deep) | 3 iterações |
| Primeira vez testando | Sim (deep) | 3 iterações |
| Re-teste após fix | Quick check | 1 iteração |

---

## 📚 Referências
- [Anthropic: Constitutional AI](https://anthropic.com/)
- [Google: Self-Refine Paper](https://arxiv.org/)
- [LangChain: Agent Self-Critique](https://langchain.com/)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation