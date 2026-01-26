# Named Protocols — Z Squad Standard

## 🎯 Propósito
Este documento define o padrão de **Named Protocols** para todos os módulos Z Squad, inspirado no Business_Modeler.

> *"Protocol A: The Architect. Protocol B: The Stress Test. Protocol C: The Pattern Shift."*
> — Business_Modeler

---

## 1. O Que São Named Protocols?

Named Protocols são **workflows com nomes memoráveis** que facilitam comunicação e execução. Em vez de descrever um processo, você invoca pelo nome.

**Benefícios:**
- Comunicação clara entre módulos
- Documentação auto-explicativa
- Facilita treinamento
- Permite composição de workflows

---

## 2. Convenção de Nomes

```
Protocol [LETRA]: "The [NOME]" ([VERBO])
```

**Exemplos:**
- Protocol A: "The Architect" (Drafting)
- Protocol B: "The Stress Test" (Validation)
- Protocol C: "The Pattern Shift" (Innovation)

---

## 3. Named Protocols por Módulo

### Z1 Architect

| Protocol | Nome | Trigger | Output |
| :--- | :--- | :--- | :--- |
| **A** | The Gatekeeper | Request vago | Refined request |
| **B** | The Decomposer | Request claro | Competency map |
| **C** | The Scoper | Competencies | Spec técnica |

### Z2 Profiler

| Protocol | Nome | Trigger | Output |
| :--- | :--- | :--- | :--- |
| **A** | The Matchmaker | Spec técnica | Clones selecionados |
| **B** | The Synthesizer | Clones | DNA Mental |
| **C** | The Curator | DNA Mental | Knowledge Base |

### Z3 Engineer

| Protocol | Nome | Trigger | Output |
| :--- | :--- | :--- | :--- |
| **A** | The Composer | DNA + KB | System prompt |
| **B** | The Schematizer | Prompt | Input/Output schemas |
| **C** | The Optimizer | Prompt longo | Prompt otimizado |

### Z4 Auditor

| Protocol | Nome | Trigger | Output |
| :--- | :--- | :--- | :--- |
| **A** | The Planner | Prompt completo | Test plan |
| **B** | The Executor | Test plan | Test results |
| **C** | The Judge | Test results | Validation report |
| **D** | The Stressor | Agente | Stress test results |

### Z5 Evolver

| Protocol | Nome | Trigger | Output |
| :--- | :--- | :--- | :--- |
| **A** | The Watcher | Agente em produção | Metrics |
| **B** | The Detector | Metrics anormais | Drift alert |
| **C** | The Proposer | Drift confirmado | Evolution ticket |
| **D** | The Deployer | Ticket aprovado | New version |

---

## 4. Invocação de Protocols

### Sintaxe
```
Invoke: Z[N].Protocol.[LETRA]
Input: [dados]
```

### Exemplo de Cadeia
```yaml
pipeline:
  - step: 1
    invoke: "Z1.Protocol.A"  # The Gatekeeper
    input: "Crie um agente de finanças"
    output: "Refined request with context"
    
  - step: 2
    invoke: "Z1.Protocol.B"  # The Decomposer
    input: "{{step1.output}}"
    output: "Competency map"
    
  - step: 3
    invoke: "Z1.Protocol.C"  # The Scoper
    input: "{{step2.output}}"
    output: "spec_tecnica.json"
```

---

## 5. Composição de Protocols

Protocols podem ser compostos para workflows complexos:

### "Full Pipeline" (Z1→Z4)
```yaml
composite_protocol:
  name: "Full Creation Pipeline"
  steps:
    - Z1.Protocol.A → Z1.Protocol.B → Z1.Protocol.C
    - Z2.Protocol.A → Z2.Protocol.B → Z2.Protocol.C
    - Z3.Protocol.A → Z3.Protocol.B
    - Z4.Protocol.A → Z4.Protocol.B → Z4.Protocol.C
```

### "Quick Validation" (Z4 only)
```yaml
composite_protocol:
  name: "Quick Validation"
  steps:
    - Z4.Protocol.A  # Minimal test plan
    - Z4.Protocol.B  # Execute
    - Z4.Protocol.C  # Judge
```

---

## 6. Template de Protocol Definition

```yaml
# Protocol Definition Template
protocol:
  module: "Z1_Architect"
  letter: "A"
  name: "The Gatekeeper"
  
  trigger:
    input_type: "Raw user request"
    conditions:
      - "Request is vague or ambiguous"
      
  process:
    steps:
      1. "Apply Step-Back Prompting"
      2. "Add CONTEXT/INTENT/HYDE_SEED"
      3. "Validate scope"
      
  output:
    type: "gatekeeper_result.yaml"
    schema: "shared_protocols/structured_outputs.md#GatekeeperResult"
    
  next:
    success: "Z1.Protocol.B"
    failure: "Reject and explain"
```

---

## 📚 Referências
- [Business_Modeler: Protocols A/B/C](../../X_Agents/Business_Modeler/agente_core.md)
- [Z Squad: Handoff Protocol](./handoff_protocol.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->