---
task: analyze-passage
responsavel: "@o-biblista"
responsavel_type: Agent
atomic_layer: Task
elicit: true

titulo: "Deep Passage Analysis - Theological Interpretation with Context"
descricao: "Provide comprehensive theological analysis of a scripture passage with historical, cultural, and modern application context"

Entrada:
  - campo: passage_reference
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Valid scripture reference (e.g., John 3:16, Romans 8:28)"
    descricao: "The scripture passage to analyze"

  - campo: analysis_depth
    tipo: enum
    origem: User Input
    obrigatorio: false
    default: "standard"
    opcoes: ["quick", "standard", "deep", "scholarly"]
    descricao: "How detailed the analysis should be"

  - campo: include_original_languages
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: false
    descricao: "Include Greek/Hebrew word study insights"

  - campo: theological_framework
    tipo: enum
    origem: User Input
    obrigatorio: false
    validacao: "From KB_03_THEOLOGY options"
    opcoes: ["Reformed", "Arminian", "Catholic", "Orthodox", "Pentecostal", "Evangelical", "Balanced"]
    default: "Balanced"
    descricao: "Which theological tradition to emphasize"

  - campo: include_commentaries
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: true

Saida:
  - campo: passage_text
    tipo: object
    destino: Return value
    persistido: false
    estrutura: |
      {
        "reference": "John 3:16",
        "translations": { "KJV": "...", "ACF": "..." },
        "word_count": 45
      }

  - campo: historical_context
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "When/where written, cultural setting, original audience"
    secoes: ["Time Period", "Cultural Context", "Original Audience", "Historical Significance"]

  - campo: theological_interpretation
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "What the passage teaches theologically"
    secoes: ["Core Teaching", "Theological Implications", "Broader Biblical Narrative", "Framework Analysis"]

  - campo: literary_context
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How this fits in surrounding passage and book"

  - campo: practical_application
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How modern believers apply this passage"
    secoes: ["Modern Significance", "Life Application", "Spiritual Principles", "Practical Steps"]

  - campo: cross_references
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Related passages throughout scripture"

  - campo: alternative_interpretations
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Other valid ways to understand this passage"
    estrutura: |
      [
        {
          "interpretation": "Description of view",
          "tradition": "Which tradition holds this",
          "strengths": "Why this view makes sense",
          "considerations": "Challenges or nuances"
        }
      ]

  - campo: original_language_insights
    tipo: object
    destino: Return value
    persistido: false
    descricao: "Greek/Hebrew word studies (if requested)"
    estrutura: |
      {
        "greek_words": [{"word": "agape", "meaning": "divine love", "significance": "..."}],
        "hebrew_words": [],
        "translation_notes": "..."
      }

Checklist:
  - "[ ] Step 1: Retrieve passage in multiple translations"
  - "[ ] Step 2: Research historical and cultural context"
  - "[ ] Step 3: Identify literary genre and structure"
  - "[ ] Step 4: Explain core theological teaching"
  - "[ ] Step 5: Connect to broader biblical narrative"
  - "[ ] Step 6: Present framework-specific interpretation"
  - "[ ] Step 7: Identify alternative valid interpretations"
  - "[ ] Step 8: Suggest modern life application"
  - "[ ] Step 9: Provide cross-references"
  - "[ ] Step 10: Include original language insights (if requested)"
  - "[ ] Step 11: Format for readability"

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
