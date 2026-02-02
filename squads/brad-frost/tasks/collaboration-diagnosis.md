---
task: collaboration-diagnosis
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_structure
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Description of designer-developer team setup"

  - campo: friction_points
    tipo: array
    origem: User Input
    obrigatorio: true
    validacao: "List of specific collaboration issues"

Saida:
  - campo: diagnosis
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: action_plan
    tipo: markdown
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Step 1: Diagnose root cause (human vs technical)"
  - "[ ] Step 2: Identify communication breakdowns"
  - "[ ] Step 3: Assess shared vocabulary"
  - "[ ] Step 4: Evaluate handoff process"
  - "[ ] Step 5: Prescribe solutions"
---

# Collaboration Diagnosis

## Purpose

Diagnose designer-developer collaboration issues and provide pragmatic
solutions grounded in Brad's philosophy: "It's ultimately the human
relationships part."

## Core Insight

Brad's diagnostic approach:
1. **Listen for the human problem** — Usually NOT technical
2. **Ask "Are teams actually talking to each other?"**
3. **Look for shared vocabulary breakdown**
4. **Identify handoff friction points**
5. **Prescribe communication, not tools**

## Key Recommendations Brad Makes

- Establish shared vocabulary across design and code
- Prototype in browser early (designers see constraints)
- Use living style guides (single source of truth)
- Co-locate documentation (both teams contribute)
- Pattern-driven workflows (build together)

## Output

Diagnosis report with:
- Root cause analysis
- Specific collaboration problems identified
- Step-by-step action plan
- Expected outcomes
- Success metrics

---

**Task created by brad-frost-squad-creator**
