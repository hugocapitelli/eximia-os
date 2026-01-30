---
task: copy-generation-bible-inspired
responsavel: "@copy-alchemist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

titulo: "Bible-Inspired Copy Generation - Create Persuasive Copy from Scripture"
descricao: "Generate compelling copy inspired by biblical passages and principles"

Entrada:
  - campo: copy_type
    tipo: enum
    origen: User Input
    obrigatorio: true
    opcoes: ["headline", "email", "sales-page", "vsl", "social-post", "ad-copy", "story", "testimonial"]

  - campo: target_passage_or_principle
    tipo: string
    origen: User Input
    obrigatorio: true
    validacao: "Valid scripture reference or principle name"
    descricao: "E.g., 'John 3:16', 'grace', 'faith', 'hope'"

  - campo: target_audience
    tipo: string
    origen: User Input
    obrigatorio: false
    descricao: "Who is this copy for? (e.g., 'entrepreneurs', 'people struggling with fear')"

  - campo: business_context
    tipo: string
    origen: User Input
    obrigatorio: false
    descricao: "What is being sold/offered? (e.g., 'online course', 'coaching', 'app')"

  - campo: tone
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "inspiring"
    opcoes: ["inspiring", "challenging", "comforting", "educational", "motivational", "intimate"]

  - campo: primary_benefit
    tipo: string
    origen: User Input
    obrigatorio: false
    descricao: "Main transformation/benefit being offered"

  - campo: cta
    tipo: string
    origen: User Input
    obrigatorio: false
    descricao: "Call-to-action (e.g., 'Join now', 'Learn more', 'Get started')"

  - campo: length_preference
    tipo: enum
    origen: User Input
    obrigatorio: false
    default: "medium"
    opcoes: ["short", "medium", "long"]

Saida:
  - campo: generated_copy
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "The actual copy (formatted for type)"

  - campo: headline
    tipo: string
    destino: Return value
    persistido: false
    descricao: "Attention-getting headline"

  - campo: body_copy
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Main persuasive content"

  - campo: call_to_action
    tipo: string
    destino: Return value
    persistido: false
    descricao: "Clear CTA"

  - campo: principle_explanation
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Why this principle was chosen and how it applies"

  - campo: biblical_principle_extracted
    tipo: string
    destino: Return value
    persistido: false
    descricao: "The core principle used from scripture"

  - campo: scriptural_foundation
    tipo: object
    destino: Return value
    persistido: false
    estrutura: |
      {
        "primary_passage": "John 3:16",
        "passage_translations": { "KJV": "...", "ACF": "..." },
        "supporting_passages": ["Romans 8:28", "1 John 4:8"],
        "principle_from_scripture": "God's unconditional love",
        "how_it_connects": "The product embodies this principle by..."
      }

  - campo: persuasive_elements_identified
    tipo: array
    destino: Return value
    persistido: false
    descricao: "Which persuasion techniques from KB_05 are used"

  - campo: authenticity_rating
    tipo: number
    destino: Return value
    persistido: false
    range: "0-100"
    descricao: "How authentic/grounded this copy is in actual biblical principle"

  - campo: copywriting_notes
    tipo: markdown
    destino: Return value
    persistido: false
    descricao: "Why this copy works and how to use it"

Checklist:
  - "[ ] Step 1: Identify biblical principle or passage"
  - "[ ] Step 2: Understand target audience deeply"
  - "[ ] Step 3: Analyze passage for persuasive elements"
  - "[ ] Step 4: Extract timeless principle"
  - "[ ] Step 5: Connect principle to audience need"
  - "[ ] Step 6: Write compelling headline"
  - "[ ] Step 7: Craft body copy with story/evidence"
  - "[ ] Step 8: Create clear CTA"
  - "[ ] Step 9: Ensure authenticity and alignment"
  - "[ ] Step 10: Document scriptural foundation"
  - "[ ] Step 11: Provide usage guidance"

Restricciones:
  - Never fabricate scripture or misquote
  - Ensure copy is truthful and doesn't manipulate
  - Connect genuinely to principle, not superficially
  - Avoid using scripture as mere decoration
  - Respect both scripture and audience

Status: ready-for-implementation
Ultimo_Update: 2026-01-27
