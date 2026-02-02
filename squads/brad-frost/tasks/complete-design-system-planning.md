---
task: complete-design-system-planning
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: project_name
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Project or application name"

  - campo: project_description
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Detailed description of what you're building"

  - campo: target_users
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Who are the primary users/audience"

  - campo: key_features
    tipo: array
    origem: User Input
    obrigatorio: true
    validacao: "List of main features or pages"

  - campo: team_size
    tipo: number
    origem: User Input
    obrigatorio: false
    default: "1"
    validacao: "Number of designers and developers"

  - campo: timeline_weeks
    tipo: number
    origem: User Input
    obrigatorio: false
    default: "12"
    validacao: "Expected project duration"

  - campo: existing_system
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: false
    validacao: "Does existing design system exist?"

  - campo: include_token_analysis
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: true
    validacao: "Include LLM token economy analysis"

Saida:
  - campo: design_system_specification
    tipo: markdown
    destino: Return value
    persistido: true

  - campo: atomic_design_blueprint
    tipo: yaml
    destino: Return value
    persistido: true

  - campo: component_inventory
    tipo: json
    destino: Return value
    persistido: true

  - campo: token_economy_analysis
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: implementation_roadmap
    tipo: markdown
    destino: Return value
    persistido: true

  - campo: governance_guide
    tipo: markdown
    destino: Return value
    persistido: true

Checklist:
  - "[ ] Step 1: Understand project scope and requirements"
  - "[ ] Step 2: Define Atomic Design component hierarchy"
  - "[ ] Step 3: Create component inventory (atoms → organisms)"
  - "[ ] Step 4: Design design tokens system"
  - "[ ] Step 5: Plan collaboration workflow"
  - "[ ] Step 6: Analyze LLM token economy (if requested)"
  - "[ ] Step 7: Create implementation roadmap"
  - "[ ] Step 8: Document governance and maintenance"
  - "[ ] Step 9: Generate all deliverables as files"
---

# Complete Design System Planning
## Atomic Design from Zero to Production

## Purpose

Comprehensive, one-stop design system planning task that takes your project
description and generates a **complete, production-ready Atomic Design system
specification** including:

- Component hierarchy and inventory
- Design tokens system
- Collaboration workflow
- LLM token economy analysis
- Implementation roadmap
- Governance guidelines

This is the **definitive "tell me what you're building and I'll design your
entire design system"** task.

## Story Reference

- **Squad:** brad-frost
- **Use Case:** Project launch, greenfield design system creation

---

## Execution Steps

### Step 1: Understand Project Scope

Elicit comprehensive project details:

```yaml
Project Profile:
  name: "Your Project Name"
  description: "What you're building and why"
  target_audience: "Who uses it"
  key_features:
    - Feature 1
    - Feature 2
    - Feature 3
  team_structure: "Designers, developers, PM"
  timeline: "12 weeks"
  existing_system: false (greenfield)
```

**Output:** Project specification

---

### Step 2: Define Atomic Design Hierarchy

Based on project, Brad defines:

```yaml
ATOMS (Fundamentals):
  design_tokens:
    colors: [primary, secondary, neutral, semantic]
    typography: [families, sizes, weights, line-heights]
    spacing: [scales from 4px to 64px]
    borders: [widths, styles, colors]
    shadows: [elevation system]
    animations: [durations, easing]

  primitive_elements:
    - Buttons (styles: primary, secondary, ghost, etc.)
    - Inputs (text, email, password, etc.)
    - Labels
    - Icons
    - Badges
    - Dividers

MOLECULES (Simple Components):
  - Form Field (label + input + error)
  - Breadcrumb
  - Tab
  - Card (simple)
  - Menu Item
  - Avatar Group

ORGANISMS (Complex Sections):
  - Header/Navigation
  - Footer
  - Form (multi-field)
  - Card Grid
  - Data Table
  - Modal Dialog

TEMPLATES (Page Layouts):
  - [Landing Page]
  - [Dashboard Layout]
  - [Settings Layout]
  - [Product Detail Layout]

PAGES (Real Instances):
  - Homepage (actual content)
  - Admin Dashboard (real data)
  - User Profile (example account)
```

**Output:** Component hierarchy YAML

---

### Step 3: Create Component Inventory

Brad creates detailed inventory:

```json
{
  "components": [
    {
      "id": "button-primary",
      "level": "atom",
      "name": "Button (Primary)",
      "variants": ["default", "hover", "active", "disabled"],
      "tokens_required": ["color-primary", "font-button", "space-2"],
      "estimated_tokens": 150,
      "reused_in": ["form-field", "card-cta", "dialog-actions"]
    },
    {
      "id": "form-field",
      "level": "molecule",
      "name": "Form Field",
      "components": ["label (atom)", "input (atom)", "error-text (atom)"],
      "variants": ["text", "email", "password", "number"],
      "estimated_tokens": 400,
      "reused_in": ["login-form (organism)", "signup-form (organism)"]
    }
    // ... more components
  ],
  "total_atoms": 8,
  "total_molecules": 12,
  "total_organisms": 5,
  "total_templates": 4,
  "total_pages": 8,
  "system_size": "small (25 core components)"
}
```

**Output:** Component inventory JSON

---

### Step 4: Design Design Tokens System

Brad specifies complete token architecture:

```yaml
DESIGN TOKENS SPECIFICATION:

token_categories:
  color:
    global:
      - --color-primary: #007bff
      - --color-secondary: #6c757d
      - --color-success: #28a745
    semantic:
      - --color-text-primary: (on light) #000000
      - --color-text-secondary: (on light) #666666
      - --color-border: #ddd

  typography:
    families:
      - --font-body: "Inter, system-ui"
      - --font-heading: "Poppins, system-ui"
    sizes:
      - --font-size-xs: 12px
      - --font-size-sm: 14px
      - --font-size-md: 16px
      - --font-size-lg: 18px
      - --font-size-xl: 24px
    weights:
      - --font-weight-regular: 400
      - --font-weight-semibold: 600
      - --font-weight-bold: 700

  spacing:
    - --space-1: 4px
    - --space-2: 8px
    - --space-3: 12px
    - --space-4: 16px
    - --space-5: 24px
    - --space-6: 32px
    - --space-7: 48px
    - --space-8: 64px

  layout:
    - --breakpoint-mobile: 480px
    - --breakpoint-tablet: 768px
    - --breakpoint-desktop: 1024px
    - --container-max-width: 1200px

  shadows:
    - --shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
    - --shadow-md: 0 4px 6px rgba(0,0,0,0.1)
    - --shadow-lg: 0 10px 15px rgba(0,0,0,0.1)

naming_convention: "--[category]-[subcategory]-[variant]"
governance: "Token changes require design+eng review"
tools: "CSS variables, design token CLI, Figma plugins"
```

**Output:** Design tokens specification

---

### Step 5: Plan Collaboration Workflow

Brad specifies how teams work together:

```yaml
COLLABORATION WORKFLOW:

Designer-Developer Handoff:
  1. Designers create components in Figma
  2. Name components using shared vocabulary (Atomic levels)
  3. Annotate with token usage and variants
  4. Developers implement in code
  5. Both maintain same naming and structure

Code Structure:
  src/
  ├── tokens/
  │   ├── colors.css
  │   ├── typography.css
  │   └── spacing.css
  ├── atoms/
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   └── ...
  ├── molecules/
  │   ├── FormField.tsx
  │   ├── Card.tsx
  │   └── ...
  ├── organisms/
  │   ├── Header.tsx
  │   └── ...
  └── pages/
      ├── HomePage.tsx
      └── ...

Documentation:
  - Living style guide (Storybook)
  - Each component has usage guidelines
  - Design tokens documented
  - No "secret" patterns in code

Communication:
  - Weekly design system sync (30 min)
  - Shared Slack channel for questions
  - GitHub discussions for proposals
  - Design system owns naming, not individual preferences
```

**Output:** Collaboration workflow guide

---

### Step 6: Analyze LLM Token Economy (If Requested)

If `include_token_economy_analysis: true`:

Runs token-economy-analysis internally with project details:

```
Component Count: 25 (8 atoms, 12 molecules, 5 organisms)
Team Size: 3 developers
Timeline: 12 weeks

WITHOUT Atomic Design:
  - Estimated tokens: 187,500
  - Cost (Sonnet): $562

WITH Atomic Design (Your Plan):
  - Estimated tokens: 22,500
  - Cost (Sonnet): $67

💰 SAVINGS: $495 (88% reduction)
⏱️ TIME SAVINGS: ~80 engineering hours
```

**Output:** Token economy analysis

---

### Step 7: Create Implementation Roadmap

Brad structures phased rollout:

```yaml
IMPLEMENTATION ROADMAP:

Phase 0 (Week 1-2): Foundation
  - [ ] Design tokens defined and validated
  - [ ] Storybook setup with token documentation
  - [ ] Atoms implemented (buttons, inputs, labels)
  - [ ] GitHub structure created
  - [ ] Team trained on system

Phase 1 (Week 3-4): Core Components
  - [ ] All molecules implemented
  - [ ] Design-dev handoff workflow established
  - [ ] First form and card components
  - [ ] Initial Figma library synced

Phase 2 (Week 5-8): Feature Implementation
  - [ ] Organisms built using molecules
  - [ ] Pages built using templates
  - [ ] Responsive design tested
  - [ ] Accessibility audit completed

Phase 3 (Week 9-12): Polish & Launch
  - [ ] Performance optimization
  - [ ] Documentation complete
  - [ ] Team trained fully
  - [ ] System goes live

Success Metrics:
  - All team members using shared components
  - Zero duplicate components in codebase
  - < 5 min to implement new feature
  - 100% accessibility compliance
```

**Output:** Implementation roadmap

---

### Step 8: Document Governance & Maintenance

Brad establishes long-term system health:

```yaml
DESIGN SYSTEM GOVERNANCE:

Decision Making:
  - Design System Council: PM, lead designer, lead engineer
  - Monthly reviews
  - Component proposal process (RFC)
  - Token changes require consensus

Adding Components:
  1. Check if component exists (reuse first)
  2. If new, document use case
  3. Design + dev both sign off
  4. Implement with tests
  5. Document in Storybook
  6. Add to Figma library
  7. Announce in team

Removing Components:
  1. 2-week deprecation notice
  2. All usages must migrate
  3. Archived in Storybook
  4. Team notified

Versioning:
  - Semantic versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Breaking changes (token names, component APIs)
  - MINOR: New components, token additions
  - PATCH: Documentation, style tweaks

Maintenance Schedule:
  - Daily: Monitor issues/questions
  - Weekly: Design system sync
  - Bi-weekly: Team usage metrics
  - Monthly: Council review + versioning decision
  - Quarterly: Audit + improvement planning

Performance Budget:
  - Component bundle size tracked
  - CSS specificity limits enforced
  - No unnecessary dependencies

Adoption Metrics:
  - % of code using design system
  - Time to implement features
  - Accessibility score
  - Design-dev alignment
```

**Output:** Governance guide

---

### Step 9: Generate All Deliverables

Brad creates files you can immediately use:

```
📁 generated/
├── DESIGN_SYSTEM_SPECIFICATION.md
├── COMPONENT_INVENTORY.json
├── DESIGN_TOKENS.yaml
├── COLLABORATION_WORKFLOW.md
├── IMPLEMENTATION_ROADMAP.md
├── GOVERNANCE_GUIDE.md
├── TOKEN_ECONOMY_ANALYSIS.md
└── QUICK_START.md
```

---

## Output Deliverables

### 1. Design System Specification
Complete markdown document with:
- Project overview
- Atomic Design application
- Design principles
- Component structure
- Token architecture
- Collaboration model
- Success metrics

### 2. Atomic Design Blueprint
YAML file with:
- Full component hierarchy
- Variants and states
- Token mappings
- Composition rules
- Naming conventions

### 3. Component Inventory
JSON file with:
- All components listed
- Level classification
- Variants
- Token dependencies
- Reuse patterns

### 4. Token Economy Analysis (Optional)
Financial impact analysis:
- WITH vs WITHOUT Atomic Design
- Cost per model (Haiku, Sonnet, Opus, etc.)
- ROI calculation
- Strategic recommendations

### 5. Implementation Roadmap
Phased timeline:
- What to build when
- Dependencies and ordering
- Success criteria per phase
- Risk mitigation

### 6. Governance Guide
Long-term sustainability:
- Decision making
- Adding/removing components
- Versioning strategy
- Maintenance schedule
- Adoption metrics

---

## Real-World Example Output

**Project:** E-commerce marketplace platform

```markdown
# Design System for ShopHub

## Overview
Platform connecting sellers and buyers. Needs consistent UI across:
- Seller dashboard
- Buyer marketplace
- Admin controls
- Mobile responsive

## Atomic Design Structure

### Atoms (8 components)
- Button (primary, secondary, ghost)
- Input (text, email, number, password)
- Label
- Badge
- Icon
- Divider
- Spinner
- Avatar

### Molecules (12 components)
- Form Field
- Breadcrumb
- Tab
- Search Box
- Card
- Rating
- Pagination
- Menu Item
- Price Display
- Product Tag
- Notification
- Action Menu

### Organisms (5 components)
- Header/Navigation
- Footer
- Product Grid
- Filter Sidebar
- Checkout Form

### Templates (4 layouts)
- Marketplace Dashboard
- Product Detail Page
- Seller Dashboard
- Admin Controls

### Pages (Real instances)
- Homepage (electronics category)
- Product Detail (example laptop)
- Seller Dashboard (example seller)
- Checkout (sample order)

## Design Tokens
- Colors: 12 semantic + 40 component-specific
- Typography: 2 families, 8 sizes, 3 weights
- Spacing: 8-step scale
- Breakpoints: mobile, tablet, desktop

## Timeline
- Phase 0 (2 weeks): Foundation
- Phase 1 (2 weeks): Core molecules
- Phase 2 (4 weeks): Feature implementation
- Phase 3 (4 weeks): Polish and launch

## Expected Savings
- WITHOUT system: 412,500 tokens ($1,237 Sonnet)
- WITH system: 49,500 tokens ($148 Sonnet)
- ROI: $1,089 direct + $40,000 engineering time
```

---

## Success Criteria

✅ Complete project understanding captured
✅ Atomic Design levels clearly defined
✅ Component inventory comprehensive
✅ Design tokens system specified
✅ Collaboration workflow documented
✅ Implementation roadmap realistic
✅ Governance plan sustainable
✅ All deliverables generated and ready to use

---

## Related Tasks

- `teach-atomic-design` — Understand the framework
- `token-economy-analysis` — Deep dive on ROI
- `design-tokens-strategy` — Tokens in detail
- `component-library-review` — Review existing system

---

## Metadata

```yaml
version: 1.0.0
created: 2026-01-27
updated: 2026-01-27
author: brad-frost-squad-creator
tags:
  - atomic-design
  - planning
  - design-systems
  - greenfield
  - comprehensive
  - one-shot

difficulty: advanced
duration: 45-90 minutes
interactive: true
elicit: true

category: Design System Architecture
primary_use: "Project launch, greenfield system design"
```

---

*Task created by squad-creator for Brad Frost Atomic Design Squad*
*The comprehensive "tell me what you're building, I'll design your entire design system" task*
