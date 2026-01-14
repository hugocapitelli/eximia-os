# Z Squad Pipeline Guide — For The CEO

## 🎯 Propósito
Este guia explica como acionar o Z Squad para criar novos agentes e como usar os agentes já criados.

---

## 📋 Table of Contents

1. [Visão Geral do Pipeline](#1-visão-geral-do-pipeline)
2. [Como Solicitar um Novo Agente](#2-como-solicitar-um-novo-agente)
3. [Como Usar um Agente Existente](#3-como-usar-um-agente-existente)
4. [Onde Encontrar os Agentes](#4-onde-encontrar-os-agentes)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Visão Geral do Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                     Z SQUAD PIPELINE                              │
│                                                                   │
│   📝 Request  →  Z1  →  Z2  →  Z3  →  Z4  →  ✅ Agente Pronto   │
│                   │      │      │      │                         │
│               Arquiteto Profiler Engenheiro Auditor              │
│               (Spec)   (DNA)   (Prompt)  (Teste)                 │
└──────────────────────────────────────────────────────────────────┘
```

| Módulo | Função | Output Principal |
| :--- | :--- | :--- |
| **Z1 Architect** | Define escopo e competências | `spec_tecnica.json` |
| **Z2 Profiler** | Cria personalidade e conhecimento | `dna_mental.md` |
| **Z3 Engineer** | Monta o prompt operacional | `prompt_operacional.md` |
| **Z4 Auditor** | Testa e valida | `validation_report.md` |
| **Z5 Evolver** | Monitora e evolui | `agent_registry.yaml` |

---

## 2. Como Solicitar um Novo Agente

### Passo 1: Formular o Request
Quanto mais específico, melhor:

```
❌ Ruim: "Crie um agente de finanças"
✅ Bom: "Crie um agente CFO focado em valuation e M&A para startups"
```

### Passo 2: Acionar o Z Squad
Diga ao seu assistant:
```
"Use o Z Squad para criar um agente [DESCRIÇÃO]"
```

### Passo 3: Revisar Spec (Z1)
O Z1 vai perguntar se precisa de clarificações. Responda para refinar.

### Passo 4: Aguardar Pipeline
O pipeline Z1→Z4 vai rodar automaticamente, gerando todos os artefatos.

### Passo 5: Revisar Relatório (Z4)
Confira o `validation_report.md` para ver a nota e possíveis issues.

### Passo 6: Usar o Agente
Se APPROVED, o agente está pronto em `outputs/{Agent_Name}/`.

---

## 3. Como Usar um Agente Existente

### Opção A: Via Chat com LLM

1. Abra o arquivo `outputs/{Agent_Name}/03_prompt/prompt_operacional.md`
2. Copie **todo o conteúdo**
3. Cole como System Prompt no seu LLM (Claude, GPT, etc.)
4. Converse normalmente — o agente já está configurado!

### Opção B: Via API

```python
import openai  # ou anthropic

# Carregar o prompt
with open("outputs/CFO_Agent/03_prompt/prompt_operacional.md") as f:
    system_prompt = f.read()

# Usar na API
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Faça um DCF para minha startup"}
    ]
)
```

---

## 4. Onde Encontrar os Agentes

### Localização
```
Z_Squad/
└── outputs/
    └── {Agent_Name}/
        ├── README.md              # Leia primeiro!
        ├── 01_spec/
        ├── 02_profile/
        ├── 03_prompt/             # O prompt está aqui
        └── 04_validation/
```

### Registry
Todos os agentes criados estão registrados em:
```
Z_Squad/Z5_Evolver/agent_registry.yaml
```

---

## 5. Troubleshooting

### "O agente está dando respostas erradas"
1. Verifique se copiou o prompt **completo**
2. Confira o `validation_report.md` — há issues conhecidas?
3. Solicite uma evolução ao Z5

### "Preciso de uma competência que o agente não tem"
1. Abra um Evolution Ticket com Z5
2. Ou solicite um novo agente com escopo expandido

### "O agente foi REJECTED pelo Z4"
1. Leia os motivos no `validation_report.md`
2. O Z Squad vai tentar corrigir (loop Z3-Z4)
3. Se persistir, revise a spec com Z1

---

## 📊 Agentes Disponíveis

| Agente | Status | Score | Uso |
| :--- | :--- | :--- | :--- |
| CFO Agent | ✅ Validated | 9.2 | Corporate Finance, Valuation, M&A |

*Atualizado automaticamente pelo Z5 Evolver.*

---

## 🔗 Links Úteis

- [Agent Folder Structure](../templates/agent_folder_structure.md)
- [Handoff Protocol](../shared_protocols/handoff_protocol.md)
- [Named Protocols](../shared_protocols/named_protocols.md)

---

**Última atualização:** 2026-01-06
**Mantido por:** Z Squad
