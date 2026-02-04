---
task: teach-atomic-design
responsavel: "@brad-frost"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: audience_level
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "beginner, intermediate, or advanced"

  - campo: focus_area
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: "atoms, molecules, organisms, templates, pages, or comprehensive"

  - campo: use_examples
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: true

Saida:
  - campo: lesson_content
    tipo: markdown
    destino: Return value
    persistido: false

  - campo: comprehension_check
    tipo: array
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Step 1: Assess audience knowledge level"
  - "[ ] Step 2: Select focus area (or teach comprehensive)"
  - "[ ] Step 3: Explain the level with analogies"
  - "[ ] Step 4: Provide real-world examples"
  - "[ ] Step 5: Give actionable application guidance"
  - "[ ] Step 6: Summarize with key takeaways"
---

# Teach Atomic Design

## Purpose

Provide an interactive, progressive lesson on the Atomic Design methodology.
The lesson adapts to audience level (beginner, intermediate, advanced) and
can focus on specific levels (atoms, molecules, organisms, etc.) or teach
the complete framework.

## Story Reference

- **Squad:** brad-frost
- **Use Case:** Education, team training, design system foundation building

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] User has indicated their audience level or knowledge baseline
    tipo: validation
    blocker: false
    validacao: "Audience level provided or will be asked"
    error_message: "Cannot adapt lesson without knowing audience"

  - [ ] User has indicated which level(s) to focus on
    tipo: preference
    blocker: false
    validacao: "Focus area provided or will default to comprehensive"
    error_message: "Will teach comprehensive framework if not specified"
```

## Execution Steps

### Step 1: Diagnose Audience & Tailor Level

```javascript
// Elicit user input
const audienceLevel = elicit("What's your audience's experience level?", {
  options: ["Beginner (no design systems experience)", "Intermediate", "Advanced"],
});

const focusArea = elicit("Which Atomic Design level should we focus on?", {
  options: [
    "Atoms (fundamentals)",
    "Molecules (simple components)",
    "Organisms (complex sections)",
    "Templates (page layouts)",
    "Pages (real instances)",
    "Comprehensive (all 5 levels)",
  ],
});

const useExamples = elicit("Include real-world examples?", {
  default: true,
});
```

**Output:** Personalized lesson outline

### Step 2: Explain Atomic Design Foundation

For **Beginner**:
```
"Atomic Design is a mental model—a way to think about building user interfaces.
Think of chemistry: just like elements bond to form molecules, your UI elements
combine into increasingly complex components.

This approach helps teams:
- Build modular, reusable components
- Maintain consistency across products
- Scale design systems effectively
- Communicate clearly between design and development

It has 5 levels, like Russian nesting dolls."
```

For **Intermediate**:
```
"Atomic Design provides a systematic approach to organizing UI components
by hierarchy and reusability. It's not a strict top-down process—it's a
mental model you apply at different scales simultaneously.

Key principle: 'Build systems, not pages.' This means thinking about
reusable patterns rather than one-off page designs."
```

For **Advanced**:
```
"Atomic Design transcends a classification system—it's a philosophy about
modularity, composition, and governance. At scale, it forces decisions
about token architecture, pattern library boundaries, and multi-brand systems."
```

### Step 3: Teach Selected Level(s)

#### If Atoms:
```markdown
## Atoms — The Fundamental Building Blocks

**What are atoms?**
The smallest, most basic elements of your UI:
- Design tokens (colors, typography, spacing)
- HTML primitive elements (buttons, inputs, labels)
- Icons, images, animations
- Base styles with no applied layout

**Why atoms matter:**
- Single responsibility (one purpose each)
- Reusable across all components
- Foundation for everything else
- Easy to maintain and update globally

**Example (HTML/CSS):**
- Button element: `<button>Click me</button>`
- Color token: `--color-primary: #007bff`
- Typography: `font-family: Inter; font-size: 16px; line-height: 1.5`

**Real-world application:**
In a design system, atoms are typically documented in:
- Color palette (with accessibility ratios)
- Typography scale (with weights, sizes, line-heights)
- Spacing system (tokens like $space-1, $space-2, etc.)
- Icons library
- Animation library
```

#### If Molecules:
```markdown
## Molecules — Simple Component Combinations

**What are molecules?**
Simple groups of atoms bonded together to form a simple, functional unit:
- Search form (label + input + button atoms)
- Navigation menu (list + links atoms)
- Card header (text + icon atoms)
- Form field (label + input + validation message atoms)

**Why molecules matter:**
- Single, focused responsibility (but more complex than atoms)
- Reusable across templates
- Logical groupings for documentation
- Foundation for organisms

**Pattern:**
Molecules = Multiple atoms + single responsibility

**Example:**
```
<div class="form-field">
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="you@example.com">
  <span class="validation-message">Invalid email format</span>
</div>
```

This molecule combines:
- Label atom
- Input atom
- Validation message atom
```

#### If Organisms:
```markdown
## Organisms — Complex Component Sections

**What are organisms?**
Relatively complex UI components composed of groups of molecules and/or atoms:
- Header (logo + navigation + search)
- Footer (links, social icons, copyright)
- Card grid (multiple cards with metadata)
- Form (multiple form fields, submission buttons)

**Why organisms matter:**
- Still maintain single responsibility (but broader)
- Can stand alone or within pages
- Good documentation level for design systems
- Help design-developer handoff

**Pattern:**
Organisms = Multiple molecules + atoms + single responsibility
```

#### If Templates:
```markdown
## Templates — Page-Level Layouts

**What are templates?**
Page layouts showing how organisms, molecules, and atoms fit together.
Templates are *layout* and *structure*, not *content*:

- Blog post template (header + sidebar + main + footer)
- Product listing template (filters + grid + pagination)
- Checkout template (summary + form + sidebar)

**Why templates matter:**
- Show how components relate spatially
- Test reusability at page scale
- Identify missing organisms/molecules
- Enable responsive design testing

**Key concept:**
Templates show the *arrangement* of components, with placeholder content
(like wireframes). This separates structure from content.
```

#### If Pages:
```markdown
## Pages — Real Content Instances

**What are pages?**
Real instances of templates with actual content. This is where you:
- Test that the system works with real data
- Ensure responsive design works in practice
- Verify that components have edge cases
- Validate performance with real content

**Why pages matter:**
- Proves the system works end-to-end
- Reveals edge cases components must handle
- Tests performance with real assets
- Validates accessibility with real content

**Example:**
If your template is "Blog Post Template," your page is
"The blog post about Atomic Design" with actual text, images, etc.
```

### Step 4: Provide Real-World Application

```javascript
if (useExamples) {
  // Provide domain-specific examples
  outputExample(`
    ## How Atomic Design Applies to [User's Domain]

    For a SaaS product, here's how levels map:

    **Atoms:** Form inputs, buttons, badges, colors, icons
    **Molecules:** Form fields (label + input + error), breadcrumbs, tabs
    **Organisms:** Form sections, data tables, dialogs, headers
    **Templates:** Account settings page, dashboard layout, billing page
    **Pages:** "John's account settings with 3 domains," "May 2026 billing report"

    Each level serves a specific documentation and development purpose.
  `);
}
```

### Step 5: Provide Comprehension Check

```javascript
const checkQuestions = [
  {
    question: "What's the main purpose of Atomic Design?",
    correctAnswers: [
      "To create a mental model for building scalable component systems",
      "To help teams think modularly and systematically",
    ],
  },
  {
    question: "What's the key difference between atoms and molecules?",
    correctAnswers: [
      "Atoms are single, indivisible elements; molecules are combinations of atoms",
    ],
  },
  {
    question: "Why do we use templates instead of just building pages?",
    correctAnswers: [
      "To separate structure/layout from content, test reusability, and guide design",
    ],
  },
];

comprehensionChecks = await runQuestions(checkQuestions);
```

## Error Handling

### Error 1: User Doesn't Understand Analogy

```yaml
error: ANALOGY_MISUNDERSTANDING
cause: "Chemistry analogy didn't resonate"
resolution: "Switch to construction or IKEA analogy"
recovery: "Offer different metaphors: 'Think of building with LEGO blocks' or 'Like constructing a house from blueprints'"
```

### Error 2: User Wants to Skip to Implementation

```yaml
error: IMPATIENT_USER
cause: "User wants to build system immediately"
resolution: "Acknowledge urgency but emphasize foundations matter"
recovery: "Offer: 'Let's quickly map your current components to Atomic Design levels, then build the system'"
```

## Post-Conditions

```yaml
post-conditions:
  - [ ] User can explain Atomic Design's 5 levels
    tipo: learning
    blocker: false
    validacao: "User can answer comprehension questions"
    error_message: "Consider going over a specific level again"

  - [ ] User understands how to apply to their domain
    tipo: application
    blocker: false
    validacao: "User can map their components to levels"
    error_message: "Offer domain-specific workshop"

  - [ ] User is ready to audit/build their design system
    tipo: readiness
    blocker: false
    validacao: "User confirms understanding"
    error_message: "Offer follow-up design-system-assessment task"
```

## Metadata

```yaml
version: 1.0.0
created: 2026-01-27
updated: 2026-01-27
author: brad-frost-squad-creator
tags:
  - atomic-design
  - education
  - teaching
  - design-systems
  - framework

difficulty: beginner-to-advanced
duration: 15-45 minutes
interactive: true
elicit: true
```

---

*Task created by squad-creator for Brad Frost Atomic Design Squad*

#galaxy-operational