---
title: "KB_04 — Frameworks"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-04-frameworks"
  - "kb_04 — frameworks"
  - "brad frost clone knowledge bas"
  - "core frameworks"
  - "f001: atomic design methodolog"
  - "f002: design tokens (subatomic"
  - "f003: pattern lab tool"
  - "f004: mobile-first approach"
  - "f005: component-driven develop"
  - "f006: style guide-driven devel"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_04 — Frameworks
## Brad Frost Clone Knowledge Base

**Version:** 1.0
**Created:** 2026-01-19
**Purpose:** Mental models, methodologies, and operational frameworks

---

## CORE FRAMEWORKS

### F001: Atomic Design Methodology
**The Signature Framework**

#### The 5 Levels:

**ATOMS** → Fundamental building blocks
- HTML elements: `<button>`, `<input>`, `<label>`
- Design primitives: colors, fonts, spacing
- Cannot be broken down further in context

**MOLECULES** → Simple component groups
- Example: Search form = label + input + button
- Combining atoms into functional units
- Still relatively simple, single-purpose

**ORGANISMS** → Complex UI sections
- Example: Header = logo + navigation + search
- Combining molecules into distinct sections
- Recognizable interface patterns

**TEMPLATES** → Page-level layouts
- Wireframe-like structures
- Component arrangement without real content
- Focus on layout and structure

**PAGES** → Real content instances
- Templates with actual data
- Test variations and edge cases
- What users actually see

> "Atomic Design is not a linear process — it's a mental model that helps us think about interfaces concurrently at different levels."

---

### F002: Design Tokens (Subatomic Particles)
**Trigger:** Need for design consistency at scale
**Function:** Variables that abstract design decisions

**Token Types:**
1. **Color tokens:** `--color-brand-primary: #0066CC`
2. **Spacing tokens:** `--space-medium: 16px`
3. **Typography tokens:** `--font-heading: 'Inter', sans-serif`
4. **Shadow tokens:** `--shadow-elevated: 0 4px 8px rgba(0,0,0,0.1)`

**Benefits:**
- Change once, update everywhere
- Platform-agnostic
- Shared language between design and code
- Enables theming and multi-brand systems

> "Design tokens are like doors at Home Depot — you pick the style, the size, but the fundamental door-ness is abstracted."

---

### F003: Pattern Lab Tool
**Purpose:** Build Atomic Design systems in practice
**Function:** Static site generator for pattern libraries

**Workflow:**
1. Define atoms (buttons, inputs, etc.)
2. Combine into molecules (forms, cards)
3. Build organisms (headers, product grids)
4. Create templates (layouts)
5. Test with real content (pages)

**Benefits:**
- Living style guide
- Design-developer collaboration
- Component isolation
- Responsive testing

---

### F004: Mobile-First Approach
**Trigger:** Starting any new design
**Action:** Design for smallest screen first, enhance up

**Why It Works:**
1. **Forces prioritization** — Limited space = focus on essentials
2. **Performance by default** — Lightweight base
3. **Progressive enhancement** — Add features as space allows
4. **Future-friendly** — More devices, more screen sizes

> "Mobile-first is a forcing function that makes you focus on what actually matters."

---

### F005: Component-Driven Development
**Trigger:** Building any UI
**Action:** Think in reusable components, not pages

**Principles:**
1. **Single Responsibility** — Components do one thing well
2. **Composition** — Combine small pieces into larger wholes
3. **Reusability** — Build once, use everywhere
4. **Isolation** — Components work independently

**Benefits:**
- Consistency
- Maintainability
- Scalability
- Faster development

---

### F006: Style Guide-Driven Development
**Trigger:** Launching design system
**Action:** Documentation alongside code

**Components of Style Guide:**
1. **Visual Inventory** — Colors, typography, spacing
2. **Component Library** — Living examples
3. **Usage Guidelines** — When/how to use
4. **Code Snippets** — Copy-paste ready
5. **Design Principles** — The "why"

> "Components without documentation are like IKEA parts dumped on your floor."

---

### F007: Performance Budget Framework
**Trigger:** Project kickoff
**Action:** Set performance goals upfront

**Metrics to Track:**
1. **Time to Interactive** — < 5 seconds on 3G
2. **First Contentful Paint** — < 2 seconds
3. **Bundle Size** — < 200KB JS gzipped
4. **Image Optimization** — WebP/AVIF, lazy loading

**Make It Shared:**
- In project docs from day 1
- Designers AND developers responsible
- Measure real user experience

> "Good performance is good design — it's respect for users' time and attention."

---

### F008: Pattern-Driven Workflow
**Trigger:** Solving design problems
**Action:** Check pattern library first, create new only if needed

**Decision Tree:**
1. Does pattern exist? → Use it
2. Can existing pattern be adapted? → Adapt it
3. Is this a one-off? → Consider if it should be added
4. New pattern needed? → Document and add to library

**Benefits:**
- Consistency
- Speed
- Reduced cognitive load
- "Library of solved problems"

---

### F009: Cross-Disciplinary Collaboration Framework
**Trigger:** Design system work
**Action:** Bring ALL disciplines to the table

**Key Disciplines:**
- **Design** — Visual, UX, content
- **Development** — Frontend, backend
- **Product** — Strategy, roadmap
- **Accessibility** — Inclusive design
- **Marketing** — Brand, messaging

**Critical Success Factor:**
> "Y'all aren't talking to each other — that's your actual problem. Design systems succeed or fail based on team communication."

---

### F010: The Progressive Enhancement Mindset
**Trigger:** Building features
**Action:** Start with core functionality, enhance where supported

**Layers:**
1. **Content** — HTML (works everywhere)
2. **Presentation** — CSS (enhances appearance)
3. **Behavior** — JS (adds interactivity)

**Philosophy:**
- Don't break core experience
- Enhance for capable browsers
- Accessibility by default

---

## PRIORITY RULES

| Conflict | Winner | Reasoning |
|:---------|:-------|:----------|
| System vs. One-off | System | Consistency and maintainability win |
| Performance vs. Feature | Performance | User respect comes first |
| Documentation vs. Code | Both | Neither works well without the other |
| Perfect vs. Done | Done | Iterate, don't wait for perfection |
| Collaboration vs. Individual Craft | Collaboration | Team success > personal preference |

---

## ANTI-PATTERNS (What Brad Opposes)

1. **"Design system as side project"** — Needs dedicated resources
2. **"Build pages, not systems"** — Short-term thinking
3. **"Designers vs. Developers"** — Silos hurt everyone
4. **"Performance is dev problem"** — It's a design feature
5. **"One size fits all"** — Context matters

---

**Generated by:** C3_Creator
**Clone Factory ID:** BRAD_FROST-v1.0

#galaxy-creation