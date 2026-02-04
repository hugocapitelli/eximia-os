---
task: component-library-review
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: component_inventory
    tipo: array
    origem: User Input
    obrigatorio: true
    validacao: "List of components in library"

  - campo: review_focus
    tipo: string
    origem: User Input
    obrigatorio: false
    default: comprehensive
    validacao: "api-design, documentation, reusability, or comprehensive"

Saida:
  - campo: review_report
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: improvement_roadmap
    tipo: array
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Step 1: Catalog all components"
  - "[ ] Step 2: Evaluate component APIs"
  - "[ ] Step 3: Assess documentation quality"
  - "[ ] Step 4: Test reusability patterns"
  - "[ ] Step 5: Check accessibility"
  - "[ ] Step 6: Provide improvement roadmap"
---

# Component Library Review

## Purpose

Comprehensive review of component library design including API design,
documentation, reusability, accessibility, and alignment with
Atomic Design principles.

## Evaluation Framework

**API Design:**
- Clear prop interfaces
- Sensible defaults
- Composition patterns
- Single responsibility principle

**Documentation:**
- Clear use cases for each component
- Variant documentation
- Accessibility notes
- Code examples
- When not to use guidance

**Reusability:**
- Component boundaries clear?
- Duplication between components?
- Composition vs. prop complexity?
- Flexibility vs. prescriptiveness?

**Accessibility:**
- Keyboard navigation
- ARIA attributes
- Color contrast
- Focus management
- Screen reader testing

---

**Task created by brad-frost-squad-creator**

#galaxy-operational