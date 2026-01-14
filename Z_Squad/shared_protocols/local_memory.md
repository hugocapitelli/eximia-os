# Local Memory Architecture — Z Squad

## 🎯 Propósito
Este documento define a arquitetura de **memória local** para cada módulo do Z Squad, evitando context overload e melhorando performance.

---

## 1. O Problema: Context Overload

> *"Jogar todo o histórico de conversas para todos os agentes o tempo todo."*
> — Antipadrão do Framework Multiagentes

### Sintomas
- Token limit excedido
- Agente se confunde com informação irrelevante
- Latência alta
- Custos elevados

### Solução
Cada módulo mantém apenas a memória necessária para sua função.

---

## 2. Tipos de Memória

| Tipo | Descrição | Escopo | Exemplo |
| :--- | :--- | :--- | :--- |
| **Working Memory** | Contexto da tarefa atual | Sessão | "Estou criando CFO Agent" |
| **Short-Term Memory** | Artefatos recentes | Pipeline | "Spec técnica do Z1" |
| **Long-Term Memory** | Conhecimento persistente | Permanente | "KB_01_frameworks.md" |

---

## 3. Memória por Módulo

### Z1 Architect
```yaml
z1_memory:
  working:
    - user_request: "[Pedido original]"
    - clarifications: "[Perguntas e respostas]"
    - current_iteration: 1
  
  short_term:
    # Nada - Z1 é o início do pipeline
    
  long_term:
    - KB_01_decomposition_frameworks.md
    - KB_02_competency_mapping.md
    - KB_03_multiagent_framework.md
    
  NOT_IN_MEMORY:
    - Resultados de Z2, Z3, Z4 (ainda não existem)
    - Histórico de outros agentes criados
```

### Z2 Profiler
```yaml
z2_memory:
  working:
    - current_clone: "[Clone sendo analisado]"
    - extracted_frameworks: []
    - dna_draft: "[Rascunho atual]"
  
  short_term:
    - spec_tecnica.json     # Do Z1 (via Handoff)
    - clones_sugeridos: []  # Extraído da spec
    
  long_term:
    - KB_01_dna_mental_guide.md
    - KB_02_clone_catalog.md
    - cloner_registry.yaml  # De @The_Cloner
    
  NOT_IN_MEMORY:
    - User request original (já sumarizado na spec)
    - Histórico de conversas Z1
    - Resultados de Z3, Z4
```

### Z3 Engineer
```yaml
z3_memory:
  working:
    - prompt_sections: {}
    - token_count: 0
    - current_iteration: 1
  
  short_term:
    - dna_mental.md         # Do Z2
    - style_guide.md        # Do Z2
    - knowledge_base/       # Do Z2 (resumido)
    - spec_tecnica.json     # Do Z1 (apenas scope e kpis)
    
  long_term:
    - KB_01_prompt_patterns.md
    - KB_02_schema_design.md
    - system_prompt_template.md
    
  NOT_IN_MEMORY:
    - Detalhes de clone selection do Z2
    - User request original
    - Histórico de conversas Z1/Z2
```

### Z4 Auditor
```yaml
z4_memory:
  working:
    - tests_executed: []
    - current_test: null
    - reflection_notes: []
  
  short_term:
    - prompt_operacional.md  # Do Z3
    - input_schema.json      # Do Z3
    - output_schema.json     # Do Z3
    - dna_mental.md          # Do Z2 (para validar alinhamento)
    - spec_tecnica.json      # Do Z1 (para validar scope)
    
  long_term:
    - KB_01_test_methodologies.md
    - KB_02_failure_modes.md
    - KB_04_self_reflection.md
    
  NOT_IN_MEMORY:
    - Processo de criação do prompt (apenas resultado)
    - Clones consultados pelo Z2
    - User request original
```

### Z5 Evolver
```yaml
z5_memory:
  working:
    - agents_being_monitored: []
    - current_alert: null
  
  short_term:
    - recent_logs: "[Últimas 24h]"
    - validation_report.md   # Último do Z4
    
  long_term:
    - KB_01_monitoring_metrics.md
    - KB_02_evolution_patterns.md
    - agent_registry.yaml    # Todas as versões
    - evolution_history.yaml # Histórico de evoluções
    
  NOT_IN_MEMORY:
    - Detalhes de criação (apenas resultado final)
    - Logs antigos (> 7 dias, arquivados)
```

---

## 4. Regras de Transferência

### O que passa no Handoff
| Do Módulo | Para Módulo | O que passa | O que NÃO passa |
| :--- | :--- | :--- | :--- |
| Z1 → Z2 | spec_tecnica.json | Processo de decomposição |
| Z2 → Z3 | dna + kb + style | Clones não selecionados |
| Z3 → Z4 | prompt + schemas | Rascunhos descartados |
| Z4 → Delivery | validation + agente | Testes individuais |

### Formato
Sempre usar `handoff_payload.yaml` com **summary**, não raw data.

---

## 5. Benefícios

| Aspecto | Sem Local Memory | Com Local Memory |
| :--- | :--- | :--- |
| Token usage | ~8000 tokens/módulo | ~2500 tokens/módulo |
| Latência | Alta (parsing longo) | Baixa |
| Confusão | Alta (info irrelevante) | Baixa |
| Custo | $$$$ | $$ |

---

## 📚 Referências
- [ZenML: Agent Memory Management](https://zenml.io/)
- [LangGraph: Stateful Agents](https://langgraph.dev/)
- [Framework Multiagentes: 05_Fluxos_de_Comunicacao.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/05_Fluxos_de_Comunicacao.md)
