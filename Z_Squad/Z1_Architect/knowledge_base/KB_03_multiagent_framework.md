# KB_03 — Multi-Agent Framework Principles

## 🎯 Propósito
Este documento conecta o Z1 Architect aos princípios do Framework Multiagentes ExímIA.

---

## 1. Quando Criar um Agente vs Usar Ferramenta

### Regra de Ouro (Anti Micro-Management)
> *"Se pode ser resolvido com 1 prompt simples, não precisa de agente."*

| Característica | Usa Agente | Usa Ferramenta/Code |
| :--- | :--- | :--- |
| Raciocínio complexo | ✅ | ❌ |
| Múltiplas etapas | ✅ | ❌ |
| Julgamento subjetivo | ✅ | ❌ |
| Cálculo determinístico | ❌ | ✅ |
| CRUD simples | ❌ | ✅ |
| Parsing estruturado | ❌ | ✅ |

### Checklist de Viabilidade
Antes de aprovar criação de agente, Z1 deve perguntar:
- [ ] O problema requer raciocínio?
- [ ] Há ambiguidade no input?
- [ ] O output varia baseado em contexto?
- [ ] São necessárias múltiplas competências?

Se < 2 checks → Não é agente, é script.

---

## 2. Single Responsibility Principle

> *"Um agente deve fazer UMA coisa bem feita."*

### Como Aplicar
1. Se a spec tiver > 5 competências → Considerar split em 2 agentes
2. Se o prompt estimado > 4000 tokens → Agente muito complexo
3. Se houver competências de domínios diferentes → Separar

### Exemplo
❌ **Errado:** "CFO Agent que faz Valuation E Contabilidade E Tax Planning"
✅ **Certo:** "CFO Agent (Valuation)" + "Controller Agent (Accounting)"

---

## 3. Hierárquico vs Swarm

### Quando Usar Orquestração Hierárquica
- Processos lineares
- Qualidade garantida necessária
- Outputs determinísticos

**Exemplo:** Geração de relatórios, due diligence

### Quando Usar Swarm
- Desenvolvimento de software
- Simulações de ecossistema
- Tarefas paralelas independentes

**Exemplo:** Coding assistants, research paralelo

### Z Squad Usa: Hierárquico (Sequential Pipeline)
Z1 → Z2 → Z3 → Z4 (com loop de correção)

---

## 4. Definição de Estado (Shared State)

O Z1 deve inicializar o Shared State do pipeline:

```yaml
pipeline_id: "ZSQUAD-20260106-001"
status: "IN_PROGRESS"
current_module: "Z1_Architect"

objective:
  user_request: "[O que o usuário pediu]"
  agent_name: "[Nome do agente]"
  domain: "[Domínio técnico]"
  priority: "MEDIUM"

plan:
  - step: 1
    module: "Z1_Architect"
    description: "Gerar spec técnica"
    status: "IN_PROGRESS"
  - step: 2
    module: "Z2_Profiler"
    description: "Criar DNA Mental"
    status: "PENDING"
  # ... etc
```

---

## 5. Preparação para Handoff

Antes de passar para Z2, Z1 deve gerar:

```yaml
# handoff_payload.yaml
handoff_id: "HO-20260106-001"
from_module: "Z1_Architect"
to_module: "Z2_Profiler"

summary: "[O que foi decidido]"

artifacts_produced:
  - path: "outputs/{agent}/spec_tecnica.json"
    type: spec
    status: complete

key_decisions:
  - decision: "[Decisão 1]"
    rationale: "[Por que]"

constraints_for_next:
  - "[O que Z2 deve respeitar]"

open_questions:
  - "[Dúvidas para Z2 resolver]"
```

---

## 📚 Referências
- [Framework: 03_Padroes_de_Arquitetura.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/03_Padroes_de_Arquitetura.md)
- [Framework: 08_Boas_Praticas_e_Antipadroes.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/08_Boas_Praticas_e_Antipadroes.md)
- [Shared Protocols: handoff_protocol.md](../shared_protocols/handoff_protocol.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->