# Phase Gates — Z Squad Protocol

## 🎯 Propósito
Define os critérios **PASS/FAIL** formais para cada módulo do Z Squad.

> *"Cada fase tem gates PASS/FAIL explícitos."*
> — X_Agente v4.0

---

## 1. O Que São Phase Gates?

Phase Gates são **checkpoints obrigatórios** que devem ser validados antes de prosseguir para o próximo módulo. Se um gate falha, o módulo deve corrigir antes de passar o handoff.

---

## 2. Gates por Módulo

### Z1 Architect Gate

| Check | Critério | PASS | FAIL |
| :--- | :--- | :--- | :--- |
| G1.1 | Gatekeeper aplicado | Request refinado | Request vago |
| G1.2 | Domínio definido | Claro e específico | Genérico |
| G1.3 | Competências mapeadas | 3-8 com níveis | <3 ou >8 |
| G1.4 | Escopo definido | In/Out scope claros | Ambíguo |
| G1.5 | Clones sugeridos | 2-4 relevantes | 0 ou irrelevantes |
| G1.6 | spec_tecnica.json | Válido e completo | Inválido/incompleto |

**Gate Decision:**
- **PASS:** 6/6 checks ✅
- **CONDITIONAL:** 4-5 checks (corrigir antes de Z2)
- **FAIL:** <4 checks (refazer Z1)

---

### Z2 Profiler Gate

| Check | Critério | PASS | FAIL |
| :--- | :--- | :--- | :--- |
| G2.1 | Clones selecionados | 2-4 com justificativa | 0 ou sem justificativa |
| G2.2 | DNA Mental | Cobre 100% competências | <100% cobertura |
| G2.3 | Crenças definidas | ≥5 documentadas | <5 |
| G2.4 | Princípios IF/THEN | ≥5 testáveis | <5 ou vagos |
| G2.5 | KB segregado | TEORIA/ESTRATEGIA/INVARIANTES | Monolítico |
| G2.6 | Style guide | Tom e formato claros | Vago |
| G2.7 | Design Review | APPROVED (2/3 clones) | REJECTED |

**Gate Decision:**
- **PASS:** 7/7 checks ✅
- **CONDITIONAL:** 5-6 checks (corrigir antes de Z3)
- **FAIL:** <5 checks (refazer Z2)

---

### Z3 Engineer Gate

| Check | Critério | PASS | FAIL |
| :--- | :--- | :--- | :--- |
| G3.1 | Token budget | ≤8000 tokens | >8000 |
| G3.2 | Seções XML | Todas presentes | Faltando |
| G3.3 | Invariantes | ≥15 formais | <15 |
| G3.4 | Circuit breakers | ≥5 HALTs | <5 |
| G3.5 | Exemplos few-shot | ≥4 | <4 |
| G3.6 | Adversarial examples | ≥3 | <3 |
| G3.7 | Schemas válidos | Input + Output JSON | Inválidos |
| G3.8 | Anti-hallucination | Regras explícitas | Ausente |

**Gate Decision:**
- **PASS:** 8/8 checks ✅
- **CONDITIONAL:** 6-7 checks (corrigir antes de Z4)
- **FAIL:** <6 checks (refazer Z3)

---

### Z4 Auditor Gate

| Check | Critério | PASS | FAIL |
| :--- | :--- | :--- | :--- |
| G4.1 | Test suite executado | 100% testes | <100% |
| G4.2 | Competency tests | ≥90% pass | <90% |
| G4.3 | Anti-hallucination | 100% pass | <100% |
| G4.4 | Jailbreak resistance | 100% pass | <100% |
| G4.5 | Stress tests | ≥90% pass | <90% |
| G4.6 | Self-reflection | Aplicada | Não aplicada |
| G4.7 | Risk heatmap | Zero CRITICAL | ≥1 CRITICAL |
| G4.8 | Quality checklist | 10/10 | <8/10 |
| G4.9 | Nota global | ≥8.5/10 | <8.5 |

**Gate Decision:**
- **PASS:** 9/9 checks ✅ → APPROVED
- **CONDITIONAL:** 7-8 checks → APPROVED_WITH_CONDITIONS
- **FAIL:** <7 checks → REJECTED

---

## 3. Gate Validation Template

```yaml
gate_validation:
  module: "Z[N]_[Name]"
  timestamp: "[ISO 8601]"
  
  checks:
    - id: "G[N].1"
      description: "[Check description]"
      result: PASS | FAIL
      notes: "[Optional notes]"
      
  summary:
    total_checks: [N]
    passed: [N]
    failed: [N]
    
  decision: PASS | CONDITIONAL | FAIL
  
  conditions:
    - "[If conditional, what to fix]"
    
  next_step: "Z[N+1]_[Name]" | "Refazer Z[N]"
```

---

## 4. Escalation Rules

| Situação | Ação |
| :--- | :--- |
| FAIL em qualquer módulo | Retornar ao módulo anterior |
| 2x FAIL consecutivos | Escalar para humano |
| CRITICAL risk em Z4 | HALT, escalar para humano |

---

## 📚 Referências
- [X_Agente: FASE_09_FINAL_ASSEMBLY](../../outputs/x_agente_cfo/FASE_09_FINAL_ASSEMBLY_SUMMARY.md)
- [Z Squad: Handoff Protocol](./handoff_protocol.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->