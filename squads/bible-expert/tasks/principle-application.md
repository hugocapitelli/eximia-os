

---
task: principle-application
responsavel: "@daily-guide"
responsavel_type: Agent
atomic_layer: Task
elicit: true

titulo: "Biblical Principle Application - Apply Scripture to Real-Life Situations"
descricao: "Take biblical principles and apply them to specific life situations for practical wisdom"

Entrada:
  - campo: biblical_principle
    tipo: string
    origen: User Input
    obrigatorio: true
    validacao: "Valid principle from scripture or theme"
    descricao: "E.g., 'faith', 'grace', 'justice', 'trust', or specific passage reference"

  - campo: situation
    tipo: string
    origen: User Input
    obrigatorio: true
    validacao: "Non-empty description of real situation"
    descricao: "The real-world situation where principle applies"

  - campo: context
    tipo: enum
    origen: User Input
    obrigatorio: false
    opcoes: ["business", "personal", "relationship", "leadership", "creative", "financial", "health", "spiritual", "family", "career", "other"]
    descricao: "Domain where principle applies"

  - campo: emotional_state
    tipo: enum
    origen: User Input
    obrigatorio: false
    opcoes: ["struggling", "uncertain", "fearful", "hopeful", "confused", "discouraged", "searching"]
    descricao: "How person is feeling about situation"

  - campo: seek_wisdom
    tipo: boolean
    origen: User Input
    obrigatorio: false
    default: true
    descricao: "Person actively seeking biblical wisdom"

Saida:
  - campo: principle_explanation
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Clear explanation of the biblical principle"
    estrutura: |
      - What is this principle?
      - Where does scripture teach it?
      - Why does it matter?
      - How did biblical figures apply it?

  - campo: situation_analysis
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Understanding the specific situation deeply"
    estrutura: |
      - What's really happening here?
      - What's the core challenge?
      - What are you struggling with?
      - What do you need?

  - campo: principle_to_situation_bridge
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "How principle directly addresses situation"
    estrutura: |
      - Why this principle is relevant NOW
      - What it offers your situation
      - How it changes perspective
      - What becomes possible

  - campo: practical_steps
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Concrete actions to take"
    estrutura: |
      [
        {
          "step": 1,
          "action": "Specific, doable action",
          "why": "How this applies principle",
          "expected_outcome": "What might result",
          "timeframe": "When/how often",
          "difficulty": "easy | moderate | challenging"
        }
      ]

  - campo: scriptural_foundation
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Key scriptures supporting principle"
    estrutura: |
      [
        {
          "reference": "John 3:16",
          "translations": { "KJV": "...", "ACF": "..." },
          "relevance": "How this passage supports the principle",
          "insight": "What it teaches specifically"
        }
      ]

  - campo: character_example
    tipo: object
    destino: Return value
    persistido: false
    descricao: "Biblical figure who exemplified this"
    estrutura: |
      {
        "character": "Abraham",
        "situation": "Called to leave home and trust God",
        "how_applied": "Obeyed despite uncertainty",
        "result": "Became father of many nations",
        "lesson": "Faith means trusting when you can't see the way"
      }

  - campo: obstacles_and_responses
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Common obstacles you might face"
    estrutura: |
      [
        {
          "obstacle": "Fear of making wrong choice",
          "biblical_response": "Scripture about God's guidance",
          "how_to_overcome": "Practical suggestion",
          "truth_to_remember": "Core truth to hold onto"
        }
      ]

  - campo: prayer_focus
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Direction for prayer about situation"

  - campo: encouragement
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Words of hope and affirmation"

  - campo: follow_up_suggestion
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "What to do after initial application (check-in, study, etc.)"

Checklist:
  - "[ ] Step 1: Understand the biblical principle deeply"
  - "[ ] Step 2: Understand the person's situation fully"
  - "[ ] Step 3: See how principle directly addresses situation"
  - "[ ] Step 4: Identify relevant scriptures"
  - "[ ] Step 5: Generate practical, doable steps"
  - "[ ] Step 6: Anticipate obstacles"
  - "[ ] Step 7: Provide scriptural encouragement"
  - "[ ] Step 8: Suggest prayer focus"
  - "[ ] Step 9: Offer follow-up guidance"
  - "[ ] Step 10: Format for personal reflection"

Restricciones:
  - Don't give definitive advice ("you must do X")
  - Invite discernment ("consider", "explore", "pray about")
  - Acknowledge complexity and uncertainty
  - Respect person's autonomy and decision-making
  - Refer to professionals when needed (mental health, medical, legal)
  - Remain compassionate and encouraging

Status: ready-for-implementation
Ultimo_Update: 2026-01-27


#galaxy-operational