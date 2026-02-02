---
task: lookup-scripture
responsavel: "@scripture-researcher"
responsavel_type: Agent
atomic_layer: Task
elicit: true

titulo: "Scripture Lookup - Find Passages by Reference, Keyword, or Theme"
descricao: "Search Bible across all translations by scripture reference, keyword, or biblical theme"

Entrada:
  - campo: query_type
    tipo: enum
    origem: User Input
    obrigatorio: true
    opcoes: ["reference", "keyword", "theme"]
    validacao: "Must be one of the three types"
    descricao: "Type of search: Book:Chapter:Verse, word search, or theme search"

  - campo: query
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "Non-empty string"
    descricao: "The actual search query (e.g., 'John 3:16', 'faith', 'redemption')"

  - campo: translations
    tipo: array
    origem: User Input
    obrigatorio: false
    default: ["King James 1611", "ACF", "NVT"]
    validacao: "Valid translation names from KB_02_TRANSLATIONS"
    descricao: "Which Bible translations to include in results"

  - campo: include_context
    tipo: boolean
    origem: User Input
    obrigatorio: false
    default: true
    descricao: "Include surrounding verses and contextual information"

  - campo: max_results
    tipo: number
    origem: User Input
    obrigatorio: false
    default: 10
    validacao: "Between 1 and 50"
    descricao: "Maximum number of results to return (for keyword searches)"

Saida:
  - campo: passages
    tipo: array
    destino: Return value
    persistido: false
    estrutura: |
      {
        "book": "John",
        "chapter": 3,
        "verse": 16,
        "reference": "John 3:16",
        "translations": {
          "King James 1611": "For God so loved the world...",
          "ACF": "Porque Deus amou o mundo...",
          "NVT": "Porque Deus ama o mundo..."
        },
        "word_count": 45,
        "context_before": "...",
        "context_after": "..."
      }

  - campo: cross_references
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Related passages that connect thematically"

  - campo: theme_classification
    tipo: string
    destino: Return value
    persistido: false
    opcoes: ["Faith", "Love", "Grace", "Hope", "Justice", "Wisdom", "Community", "Suffering", "Worship", "Stewardship"]

  - campo: search_stats
    tipo: object
    destino: Return value
    persistido: false
    estrutura: |
      {
        "total_results": 3,
        "search_time_ms": 127,
        "translations_searched": 3,
        "theme_matched": "faith"
      }

Checklist:
  - "[ ] Step 1: Classify query type from user input"
  - "[ ] Step 2: Validate query format based on type"
  - "[ ] Step 3: Search appropriate index (reference/concordance/theme)"
  - "[ ] Step 4: Retrieve passages in all requested translations"
  - "[ ] Step 5: Include surrounding context if requested"
  - "[ ] Step 6: Generate cross-references from KB_04_THEMES"
  - "[ ] Step 7: Classify to major biblical theme"
  - "[ ] Step 8: Format results with translations side-by-side"
  - "[ ] Step 9: Return complete passage object with metadata"

Exemplos:
  - entrada: |
      query_type: "reference"
      query: "John 3:16"
      translations: ["King James 1611", "ACF", "NVT"]
      include_context: true
    saida: |
      passages: [
        {
          reference: "John 3:16",
          translations: { ... three versions ... },
          context_before: "John 3:15",
          context_after: "John 3:17",
          theme: "Love & Redemption"
        }
      ]

  - entrada: |
      query_type: "keyword"
      query: "faith"
      translations: ["King James 1611"]
      max_results: 5
    saida: |
      passages: [5 passages containing "faith" in KJV]
      cross_references: [related faith passages]
      theme_classification: "Faith & Trust"

  - entrada: |
      query_type: "theme"
      query: "grace"
      translations: ["All"]
    saida: |
      passages: [Major passages on grace across OT/NT]
      cross_references: [connections to related themes]
      theme_classification: "Grace & Mercy"

Notas_Implementacao:
  - Use concordance index from data/bible-concordance.json for fast lookup
  - Preserve exact wording from KB_02_TRANSLATIONS
  - Support partial reference matching (e.g., "3:16" → all books chapter 3:16)
  - Theme matching uses KB_04_THEMES mappings
  - Cache frequent searches for performance

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
