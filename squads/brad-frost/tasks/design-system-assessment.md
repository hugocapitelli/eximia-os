---
task: design-system-assessment
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: system_description
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Detailed description of current design system"

  - campo: assessment_type
    tipo: string
    origem: User Input
    obrigatorio: false
    default: comprehensive
    validacao: "comprehensive, structure-only, or governance-focus"

Saida:
  - campo: audit_report
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: recommendations
    tipo: array
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Step 1: Understand current system structure"
  - "[ ] Step 2: Audit against Atomic Design principles"
  - "[ ] Step 3: Assess documentation quality"
  - "[ ] Step 4: Evaluate design-developer workflow"
  - "[ ] Step 5: Identify gaps and improvement areas"
  - "[ ] Step 6: Provide actionable recommendations"
---

# Design System Assessment

## Purpose

Conduct comprehensive review of existing design system structure, governance,
adoption, and alignment with Atomic Design principles. Provide specific,
actionable recommendations for improvement.

## Execution Steps

### Step 1: Understand Current System

Elicit information about:
- System name, components, and scope
- How organized (Figma? Storybook? Living style guide?)
- Team structure (designers, developers, maintenance)
- Age of system (new, mature, legacy)
- Key challenges or pain points

### Step 2: Audit Structure

Assess against Atomic Design 5 levels:
- **Atoms** — Are fundamentals documented? Design tokens?
- **Molecules** — Simple component groupings clear?
- **Organisms** — Complex sections well-defined?
- **Templates** — Page layouts documented separately?
- **Pages** — Real examples showing end-to-end system?

Output: Structure assessment matrix

### Step 3: Evaluate Documentation

- Is documentation alongside code or separate?
- Do components have clear use cases and variants?
- Are design tokens documented?
- Is shared vocabulary established?
- Accessibility information present?

### Step 4: Assess Designer-Developer Workflow

- How do designers hand off to developers?
- Are there collaboration breakdowns?
- Is naming consistent across design/code?
- How are changes managed?

### Step 5: Identify Gaps

Common gaps Brad identifies:
- Missing atomic level (design tokens)
- Unclear component boundaries
- Documentation out of sync
- No governance/versioning
- Adoption low due to unclear shared vocabulary

### Step 6: Deliver Recommendations

Structure: Current state → Issues → Pragmatic solutions

---

**Task created by brad-frost-squad-creator**
