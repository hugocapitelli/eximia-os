---
task: copy-analysis-biblical
responsavel: "@copy-alchemist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

titulo: "Biblical Copy Analysis - Evaluate Copy Against Biblical Principles"
descricao: "Review marketing/sales copy against biblical values and principles"

Entrada:
  - campo: copy_text
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Non-empty text (any length)"

  - campo: stated_values
    tipo: array
    origem: User Input
    obrigatorio: false
    opcoes: ["truth", "honesty", "justice", "stewardship", "love", "grace", "integrity", "faith", "service"]

  - campo: biblical_framework
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "christian-values"
    opcoes: ["truth", "love", "justice", "grace", "stewardship", "integrity", "all"]

  - campo: depth
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "standard"
    opcoes: ["surface", "standard", "deep"]

Saida:
  - campo: alignment_score
    tipo: number
    destino: Return value
    persistido: false
    range: "0-100"
    descricao: "Overall biblical alignment score"

  - campo: score_breakdown
    tipo: object
    destino: Return value
    persistido: false
    estrutura: |
      {
        "truthfulness": 85,
        "stewardship": 90,
        "respect_for_autonomy": 75,
        "justice_consideration": 80,
        "overall": 82
      }

  - campo: strengths
    tipo: array
    destino: Return value
    persistido: false
    descricao: "What the copy does well biblically"
    estrutura: |
      [
        {
          "principle": "Truthfulness",
          "observation": "All claims are verifiable and accurate",
          "strength": "Builds trust through honesty"
        }
      ]

  - campo: concerns
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Areas that may conflict with biblical principles"
    estrutura: |
      [
        {
          "principle": "Stewardship",
          "issue": "Artificial urgency language used",
          "concern": "May manipulate rather than invite",
          "suggestion": "Replace with clear value proposition"
        }
      ]

  - campo: biblical_principles_applied
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Which biblical principles this copy demonstrates"

  - campo: supporting_scriptures
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Relevant scriptures"

  - campo: improvement_suggestions
    tipo: array
    destino: Return value
    persistido: false
    descricao: "How to strengthen biblical alignment"

  - campo: red_flags_identified
    tipo: array
    destino: Return value
    persistido: false
    opcoes: ["artificial_urgency", "false_scarcity", "manipulation", "exaggeration", "exclusionary_language", "misleading_claims", "pressure_tactics", "gatekeeping"]

  - campo: overall_verdict
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Summary assessment"

Checklist:
  - "[ ] Step 1: Analyze copy for truthfulness of claims"
  - "[ ] Step 2: Evaluate stewardship of language/influence"
  - "[ ] Step 3: Check for manipulative or coercive tactics"
  - "[ ] Step 4: Assess values alignment"
  - "[ ] Step 5: Identify respect for reader autonomy"
  - "[ ] Step 6: Score each principle"
  - "[ ] Step 7: Document strengths"
  - "[ ] Step 8: Identify concerns"
  - "[ ] Step 9: Suggest improvements"
  - "[ ] Step 10: Provide scriptural foundation"
  - "[ ] Step 11: Generate overall score"

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
