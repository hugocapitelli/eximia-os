---
task: performance-strategy
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_performance_metrics
    tipo: object
    origem: User Input
    obrigatorio: false
    validacao: "Current performance stats (if available)"

  - campo: performance_challenges
    tipo: array
    origem: User Input
    obrigatorio: false
    validacao: "Known performance issues"

Saida:
  - campo: performance_strategy
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: implementation_plan
    tipo: markdown
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Step 1: Measure current performance"
  - "[ ] Step 2: Identify bottlenecks"
  - "[ ] Step 3: Define performance budget"
  - "[ ] Step 4: Design culture shift"
  - "[ ] Step 5: Create implementation roadmap"
---

# Performance Strategy

## Purpose

Define performance as a design feature (not an afterthought) with team-wide
culture shift, metrics, and implementation plan.

## Brad's Philosophy

"Good performance is good design."

Performance is not:
- Just a developer concern
- Something to optimize "later"
- Only about lighthouse scores

Performance IS:
- A design decision
- Everyone's responsibility
- A user experience feature
- Part of system design

## Key Areas

**Performance Culture:**
- Performance budgets (not afterthoughts)
- Real user monitoring
- Core Web Vitals as success metrics
- Cross-team responsibility

**Technical Strategy:**
- Image optimization (WebP, AVIF, lazy loading)
- Code splitting and bundle optimization
- Font loading strategies
- Critical rendering path
- Asset optimization

**Design System Integration:**
- Token-based constraints (avoid hero images by default)
- Component API that encourages efficiency
- Documentation that emphasizes performance
- Test performance during design phase

---

**Task created by brad-frost-squad-creator**
