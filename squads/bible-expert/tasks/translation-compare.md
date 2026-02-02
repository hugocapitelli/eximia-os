---
task: translation-compare
responsavel: "@translation-comparator"
responsavel_type: Agent
atomic_layer: Task
elicit: false

titulo: "Multi-Translation Comparison - Analyze Passage Across Bible Versions"
descricao: "Compare same scripture passage across multiple translations to understand nuances and translation approaches"

Entrada:
  - campo: passage_reference
    tipo: string
    origen: User Input
    obrigatorio: true
    validacao: "Valid scripture reference"
    descricao: "E.g., 'John 3:16', 'Romans 8:28'"

  - campo: translations
    tipo: array
    origen: User Input
    obrigatorio: false
    default: ["King James 1611", "ACF", "NVT", "ESV"]
    validacao: "Valid translation names from KB_02"
    descricao: "Which versions to compare"

  - campo: analysis_type
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "side-by-side"
    opcoes: ["side-by-side", "detailed-analysis", "word-study"]

  - campo: highlight_key_words
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true
    descricao: "Highlight words with most significant differences"

  - campo: include_translation_philosophy
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true

  - campo: include_original_language
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: false
    descricao: "Include Greek/Hebrew original words"

Saida:
  - campo: comparison_table
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Side-by-side table of all translations"
    estrutura: |
      | Translation | Text |
      |---|---|
      | King James 1611 | "For God so loved the world..." |
      | ACF | "Porque Deus amou o mundo..." |
      | NVT | "Porque Deus ama o mundo..." |

  - campo: key_word_differences
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Words that vary significantly between versions"
    estrutura: |
      [
        {
          "english_concept": "loved / loves",
          "words_used": ["loved" (KJV), "amou" (ACF), "ama" (NVT)],
          "significance": "Past tense (completed action) vs. timeless present",
          "translation_choice_reason": "Formal vs. contemporary equivalence",
          "meaning_impact": "How this affects interpretation"
        }
      ]

  - campo: translation_philosophies
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Explanation of translation approaches"
    secoes: ["Formal Equivalence (Word-for-Word)", "Dynamic Equivalence (Thought-for-Thought)", "Which translations use each approach"]

  - campo: nuance_analysis
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Deep dive into meaning variations"
    estrutura: |
      - Translation 1 emphasis: "..."
      - Translation 2 emphasis: "..."
      - What's gained/lost in each
      - Combined understanding

  - campo: original_language_insights
    tipo: object
    destino: Return value
    persistido: false
    descricao: "Greek/Hebrew word studies (if requested)"
    estrutura: |
      {
        "greek_words": [
          {
            "word": "agape (ἀγάπη)",
            "meaning": "Divine, self-giving love",
            "translations_used": ["loved" (KJV), "amou" (ACF)],
            "theological_significance": "This specific love type is sacrificial"
          }
        ],
        "hebrew_words": []
      }

  - campo: interpretation_implications
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How translation differences affect understanding"

  - campo: recommendation
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Which translation(s) best capture specific meaning"

Checklist:
  - "[ ] Step 1: Retrieve passage from all requested translations"
  - "[ ] Step 2: Create side-by-side comparison table"
  - "[ ] Step 3: Identify key word differences"
  - "[ ] Step 4: Explain translation philosophies"
  - "[ ] Step 5: Analyze meaning nuances"
  - "[ ] Step 6: Include original language insights (if requested)"
  - "[ ] Step 7: Explain translation choice reasoning"
  - "[ ] Step 8: Show how differences affect interpretation"
  - "[ ] Step 9: Provide combined understanding"
  - "[ ] Step 10: Make recommendations for study"

Notas:
  - Preserve exact wording from KB_02_TRANSLATIONS
  - Show how translation philosophy affects specific word choices
  - Help readers understand what's translation vs. what's scripture
  - Foster deeper appreciation for translation work

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
