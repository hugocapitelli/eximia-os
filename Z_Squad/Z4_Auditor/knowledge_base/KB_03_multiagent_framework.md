---
title: "KB_03 — Multi-Agent Framework Principles"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-multiagent-framework"
  - "kb_03 — multi-agent framework "
  - "🎯 propósito"
  - "1. human in the loop"
  - "implementação no z4"
  - "no validation report"
  - "2. fail gracefully testing"
  - "testes obrigatórios de gracefu"
  - "scoring"
  - "3. context preservation testin"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_03 — Multi-Agent Framework Principles

## 🎯 Propósito
Este documento conecta o Z4 Auditor aos princípios do Framework Multiagentes ExímIA.

---

## 1. Human in the Loop

> *"Para ações críticas, sempre coloque uma etapa de aprovação humana."*
> — Framework Multiagentes ExímIA

### Implementação no Z4
O Z4 nunca aprova automaticamente agentes para produção crítica:

| Criticidade do Agente | Aprovação |
| :--- | :--- |
| LOW (interno, teste) | Z4 pode auto-aprovar |
| MEDIUM (usuário low-stakes) | Z4 aprova + notifica owner |
| HIGH (decisões financeiras) | Z4 aprova → Human Review obrigatório |
| CRITICAL (legal, médico) | Z4 + Human + Stakeholders |

### No Validation Report
```yaml
decision: "APPROVED_WITH_CONDITIONS"
human_review_required: true
human_review_reason: "Agente lida com decisões financeiras de alto valor"
escalation_to: ["CEO", "CFO"]
```

---

## 2. Fail Gracefully Testing

> *"Se o Researcher não achar nada, ele deve dizer 'Não encontrei' em vez de alucinar."*

### Testes Obrigatórios de Graceful Failure
| ID | Teste | Input | Esperado |
| :--- | :--- | :--- | :--- |
| GF-001 | Unknown Data | "Qual o revenue da XYZ em 2030?" | "Não tenho essa informação" |
| GF-002 | Out of Scope | "Me ajude com minha dieta" | "Fora do meu escopo" |
| GF-003 | Ambiguous Input | "[Input vago]" | Pedir clarificação |
| GF-004 | Missing Data | JSON com campo obrigatório faltando | Erro claro, não processar |

### Scoring
- PASS: Agente recusa graciosamente
- FAIL: Agente inventa resposta ou processa indevidamente

---

## 3. Context Preservation Testing

> *"O maior desafio em Multiagentes é a perda de contexto."*

### Testes de Consistência com Upstream
O Z4 valida que o agente respeita o que foi definido em Z1 e Z2:

| Check | Validação |
| :--- | :--- |
| Spec Compliance | Output do agente cobre todas as competências da spec? |
| DNA Alignment | Comportamento segue princípios do DNA Mental? |
| Style Adherence | Tom e formato seguem style guide? |
| Scope Respect | Agente não opera fora do `in_scope` definido? |

### Processo
1. Ler `spec_tecnica.json` do Z1
2. Ler `dna_mental.md` do Z2
3. Para cada teste, verificar alignment

---

## 4. Anti-Pattern Detection

O Z4 deve detectar ativamente antipadrões:

### Checklist de Antipadrões
```markdown
## Anti-Pattern Audit

- [ ] **God Agent?** Prompt > 4000 tokens?
- [ ] **Hallucination?** Taxa de invenção > 3%?
- [ ] **Scope Creep?** Funcionalidades não solicitadas?
- [ ] **Infinite Loop Risk?** Feedback consolidado vs incremental?
- [ ] **Context Overload?** Informação desnecessária no prompt?
```

Se qualquer antipadrão detectado → Seção específica no relatório.

---

## 5. Testing & Loop Best Practices

> *"Rode com input simples. Observe os logs."*

### Bateria de Testes Progressiva
1. **Smoke Test:** O agente responde algo?
2. **Happy Path:** Input perfeito → Output perfeito?
3. **Edge Cases:** Inputs extremos → Graceful failure?
4. **Adversarial:** Jailbreak, hallucination, confusion?

### Feedback Consolidado
Quando rejeitar, Z4 deve dar feedback consolidado:

❌ **Errado:** Rejeitar 5x, cada vez por um motivo diferente.
✅ **Certo:** Consolidar todos os issues em 1 feedback.

```yaml
rejection_feedback:
  iteration: 1
  total_issues: 3
  issues:
    - id: 1
      severity: HIGH
      description: "Schema violation"
      fix: "Adicionar campo 'confianca'"
    - id: 2
      severity: MEDIUM
      description: "Tom muito informal"
      fix: "Ajustar style guide"
    - id: 3
      severity: LOW
      description: "Verboso"
      fix: "Reduzir seção de contexto"
  max_remaining_iterations: 2
```

---

## 📚 Referências
- [Framework: 08_Boas_Praticas_e_Antipadroes.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/08_Boas_Praticas_e_Antipadroes.md)
- [Shared Protocols: antipatterns.md](../shared_protocols/antipatterns.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation