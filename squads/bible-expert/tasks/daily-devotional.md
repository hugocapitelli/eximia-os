

---
task: daily-devotional
responsavel: "@daily-guide"
responsavel_type: Agent
atomic_layer: Task
elicit: false

titulo: "Daily Devotional Generation - Complete Daily Spiritual Guidance"
descricao: "Generate complete devotional content for spiritual growth and daily application"

Entrada:
  - campo: focus_area
    tipo: string
    origem: System / User Input
    obrigatorio: false
    descricao: "Specific theme or topic (defaults to daily rotation)"

  - campo: length
    tipo: enum
    origem: User Input
    obrigatorio: false
    default: "medium"
    opcoes: ["short", "medium", "long"]

  - campo: tone
    tipo: enum
    origem: User Input
    obrigatorio: false
    default: "encouraging"
    opcoes: ["encouraging", "challenging", "meditative", "practical"]

  - campo: day_of_week
    tipo: enum
    origem: System
    obrigatorio: false
    opcoes: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    descricao: "For themed daily approach"

Saida:
  - campo: title
    tipo: string
    destino: Return value
    persistido: false
    descricao: "Engaging devotional title"

  - campo: scripture_passages
    tipo: array
    destino: Return value
    persistido: false
    estrutura: |
      [
        {
          "reference": "John 3:16",
          "translations": {
            "King James 1611": "For God so loved...",
            "ACF": "Porque Deus amou...",
            "NVT": "Porque Deus ama..."
          },
          "is_primary": true
        }
      ]

  - campo: opening_reflection
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Personal/relatable introduction to theme (2-3 sentences)"

  - campo: main_reflection
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Heart of devotional (300-500 words)"
    estrutura: |
      - Context (historical, cultural, literary)
      - Core Truth (main teaching)
      - Depth (theological implications)
      - Connection (broader narrative)
      - Modern Bridge (relevance today)

  - campo: practical_application
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How to apply this today (150-250 words)"
    estrutura: |
      - Real Situation (specific, relatable)
      - The Principle (how passage addresses it)
      - Concrete Step (what to actually DO)
      - Expected Outcome (what might change)

  - campo: prayer
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Closing prayer or meditation"
    estrutura: |
      - Address (Father God, etc.)
      - Acknowledgment (truth from passage)
      - Request (specific prayer)
      - Commitment (statement of intent)
      - Closing (Amen)

  - campo: reflection_questions
    tipo: array
    destino: Return value
    persistido: false
    descricao: "3-5 questions for deeper meditation"

  - campo: related_passages
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Cross-references for further study (2-4 passages)"

  - campo: theme_tag
    tipo: string
    destino: Return value
    persistido: false
    opcoes: ["Faith", "Love", "Grace", "Hope", "Justice", "Wisdom", "Community", "Suffering", "Worship", "Stewardship"]

  - campo: suggested_reading_time
    tipo: number
    destino: Return value
    persistido: false
    descricao: "Estimated minutes to read/meditate"

Checklist:
  - "[ ] Step 1: Select or determine scripture for day"
  - "[ ] Step 2: Write engaging, relevant title"
  - "[ ] Step 3: Provide opening hook into topic"
  - "[ ] Step 4: Write main reflection with all sections"
  - "[ ] Step 5: Include scripture in multiple translations"
  - "[ ] Step 6: Suggest practical application"
  - "[ ] Step 7: Compose meaningful closing prayer"
  - "[ ] Step 8: Add 3-5 reflection questions"
  - "[ ] Step 9: Include cross-references"
  - "[ ] Step 10: Tag with primary theme"
  - "[ ] Step 11: Format for readability and engagement"

Estrutura_Completa:
  - Title
  - Opening Reflection
  - Scripture (multiple translations)
  - Main Reflection
  - Practical Application
  - Prayer/Meditation
  - Reflection Questions
  - Related Passages
  - Reading Time

Status: ready-for-implementation
Ultimo_Update: 2026-01-27


#galaxy-operational