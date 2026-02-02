---
task: theme-study
responsavel: "@o-biblista"
responsavel_type: Agent
atomic_layer: Task
elicit: true

titulo: "Comprehensive Theme Study - Explore Biblical Themes in Depth"
descricao: "Systematic exploration of major biblical themes with passages, development, and application"

Entrada:
  - campo: theme
    tipo: string
    origen: User Input
    obrigatorio: true
    validacao: "Valid biblical theme (faith, hope, love, grace, justice, wisdom, community, suffering, worship, stewardship)"
    descricao: "The theme to study"

  - campo: depth
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "comprehensive"
    opcoes: ["overview", "comprehensive", "scholarly"]

  - campo: include_ot_and_nt
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true
    descricao: "Include both Old Testament and New Testament"

  - campo: include_character_examples
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true

  - campo: translations
    tipo: array
    origen: User Input
    obrigatorio: false
    default: ["King James 1611", "ACF", "NVT"]

  - campo: include_practical_application
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true

Saida:
  - campo: theme_definition
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Clear definition of theme biblically"

  - campo: theological_significance
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Why this theme matters in Christian faith"

  - campo: theme_overview
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "High-level exploration of theme"

  - campo: key_passages
    tipo: array
    destino: Return value
    persistido: false
    estrutura: |
      [
        {
          "reference": "John 3:16",
          "translations": { "KJV": "...", "ACF": "..." },
          "significance": "Why this passage is central to theme",
          "context": "What's happening in this passage"
        }
      ]

  - campo: old_testament_development
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How theme develops in OT (if applicable)"
    secoes: ["Foundation", "Key Passages", "Progression", "Anticipation of NT fulfillment"]

  - campo: new_testament_fulfillment
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How theme is developed/fulfilled in NT"
    secoes: ["Jesus's Teaching", "Apostolic Development", "Fulfillment", "Ongoing Reality"]

  - campo: theological_perspectives
    tipo: array
    destino: Return value
    persistido: false
    descricao: "How different traditions understand this theme"
    estrutura: |
      [
        {
          "tradition": "Reformed",
          "emphasis": "What they emphasize about this theme",
          "key_passages": ["Romans 8:29"],
          "distinctive_insight": "Unique contribution of this tradition"
        }
      ]

  - campo: related_themes
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Themes that connect to this one"

  - campo: character_examples
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Biblical figures who exemplify this theme"
    estrutura: |
      [
        {
          "character": "Abraham",
          "story_reference": "Genesis 12-25",
          "how_exemplifies": "Demonstrates faith through obedience despite uncertainty",
          "key_moment": "Willingness to sacrifice Isaac",
          "lesson": "What we learn from their example"
        }
      ]

  - campo: modern_application
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How this theme applies to life today"
    secoes: ["Personal Application", "Relational Application", "Social/Justice Application", "Spiritual Growth", "Practical Steps"]

  - campo: study_guide
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How to study this theme personally"
    estructura: |
      - Read key passages (with translations)
      - Reflection questions
      - Meditation prompts
      - Personal application exercise
      - Prayer focus
      - Weekly habit suggestion

  - campo: reflection_questions
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Deep questions for meditation (5-8 questions)"

  - campo: bibliography
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Recommended scriptures and further reading"

Checklist:
  - "[ ] Step 1: Define theme biblically and clearly"
  - "[ ] Step 2: Explain theological significance"
  - "[ ] Step 3: Identify key passages from KB_04_THEMES"
  - "[ ] Step 4: Trace OT development (if applicable)"
  - "[ ] Step 5: Show NT fulfillment/development"
  - "[ ] Step 6: Present theological perspectives"
  - "[ ] Step 7: Identify related themes"
  - "[ ] Step 8: Highlight character examples"
  - "[ ] Step 9: Suggest modern applications"
  - "[ ] Step 10: Create personal study guide"
  - "[ ] Step 11: Include reflection questions"
  - "[ ] Step 12: Provide bibliography"

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
