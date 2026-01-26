# PRP-03: AI Services & Orchestration Layer

> **Module:** Foundation
> **Priority:** P0 (Critical Path)
> **Estimated Complexity:** High
> **Dependencies:** Vercel AI SDK, Anthropic API, OpenAI API

---

## 1. Objetivo

Criar a camada de serviços de IA que orquestra todas as interações com LLMs, incluindo context building, prompt composition, response parsing e fallback handling. Esta camada é o "cérebro" que habilita o StratOS a ser um co-piloto de estratégia.

---

## 2. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI SERVICES ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         AI ORCHESTRATOR                              │   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   Context   │  │    Mode     │  │   Prompt    │  │  Response   │ │   │
│  │  │   Builder   │→ │  Selector   │→ │  Composer   │→ │   Parser    │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │         ↑               ↑               ↑               ↓           │   │
│  │         │               │               │               │           │   │
│  │  ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐   │   │
│  │  │    User     │ │   Action    │ │  Templates  │ │   Schema    │   │   │
│  │  │   Context   │ │    Type     │ │    (RAG)    │ │  Validator  │   │   │
│  │  │ + Strategy  │ │             │ │             │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                       │   │
│  └────────────────────────────┬────────────────────────────────────────┘   │
│                               │                                             │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         LLM GATEWAY                                  │   │
│  │                                                                       │   │
│  │  ┌───────────────┐        ┌───────────────┐                         │   │
│  │  │   Anthropic   │        │    OpenAI     │                         │   │
│  │  │   (Claude)    │  ←──   │   (GPT-4)     │  ← Fallback             │   │
│  │  │   PRIMARY     │        │   FALLBACK    │                         │   │
│  │  └───────────────┘        └───────────────┘                         │   │
│  │                                                                       │   │
│  │  Features:                                                           │   │
│  │  • Streaming responses                                               │   │
│  │  • Automatic retries (3x exponential backoff)                       │   │
│  │  • Fallback provider switching                                       │   │
│  │  • Rate limiting (60 req/min per user)                              │   │
│  │  • Cost tracking per request                                        │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       KNOWLEDGE BASES (RAG)                          │   │
│  │                                                                       │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │   │
│  │  │  Hoshin   │ │  Industry │ │    KPI    │ │   Best    │            │   │
│  │  │Methodology│ │ Benchmarks│ │  Library  │ │ Practices │            │   │
│  │  │           │ │           │ │           │ │           │            │   │
│  │  │ KB_01.md  │ │  Dynamic  │ │ Static DB │ │ Templates │            │   │
│  │  │ KB_02.md  │ │ (Search)  │ │           │ │           │            │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. AI Modes (Tipos de Agente)

### 3.1 Catálogo de Modos

| Mode ID | Nome | Propósito | Trigger | Output |
|---------|------|-----------|---------|--------|
| `swot_researcher` | SWOT Researcher | Sugerir itens SWOT baseado no contexto | Botão "Sugerir Itens" | Lista de itens por quadrante |
| `swot_provocateur` | SWOT Provocateur | Questionar inconsistências | Botão "Provocar" | Lista de questionamentos |
| `swot_synthesizer` | Challenge Synthesizer | Gerar desafios do SWOT | Botão "Sintetizar" | Lista de desafios |
| `northstar_refiner` | North Star Refiner | Melhorar clareza de visão/propósito | Real-time (debounced) | Score + sugestões |
| `driver_suggester` | Driver Suggester | Sugerir drivers estratégicos | Botão "Gerar Drivers" | Lista de drivers |
| `driver_validator` | Driver Validator | Validar lógica do driver | Auto após criação | Warnings/OK |
| `tactical_decomposer` | Tactical Decomposer | Sugerir iniciativas táticas | Botão "Sugerir Táticas" | Lista de táticas |
| `operational_generator` | Operational Generator | Gerar fases operacionais | Botão "Gerar Fases" | Lista de operacionais |
| `kpi_architect` | KPI Architect | Sugerir KPIs e metas | Botão "Sugerir KPIs" | Lista de KPIs |
| `benchmark_finder` | Benchmark Finder | Buscar benchmarks de mercado | Auto com KPI | Benchmark data |
| `briefing_writer` | Daily Briefing Writer | Gerar briefing executivo | Scheduled (6am) | Briefing JSON |
| `alert_analyst` | Alert Analyst | Identificar riscos e alertas | Real-time | Lista de alertas |
| `review_summarizer` | Review Summarizer | Resumir discussões | Botão "Resumir" | Summary text |
| `action_extractor` | Action Item Extractor | Extrair ações de texto | Auto após mensagem | Lista de actions |

---

## 4. Especificações de Prompt

### 4.1 SWOT Researcher

```yaml
mode_id: swot_researcher
model: claude-3-5-sonnet (default) / gpt-4-turbo (fallback)
max_tokens: 2000
temperature: 0.7

system_prompt: |
  Você é um analista estratégico especializado em diagnóstico SWOT para
  empresas de tecnologia. Seu papel é sugerir itens relevantes para cada
  quadrante baseado no contexto fornecido.

  Regras:
  1. Seja específico ao setor informado
  2. Evite clichês genéricos (ex: "time dedicado")
  3. Considere tendências de mercado atuais
  4. Inclua fatores que o usuário pode não ter considerado
  5. Para cada item, explique brevemente o porquê

user_prompt_template: |
  ## Contexto da Empresa
  - Nome: {{company_name}}
  - Setor: {{industry}}
  - Tamanho: {{company_size}} pessoas
  - Estágio: {{stage}}
  - Descrição: {{description}}

  ## SWOT Atual
  **Forças:** {{strengths | join(", ") or "Nenhuma informada"}}
  **Fraquezas:** {{weaknesses | join(", ") or "Nenhuma informada"}}
  **Oportunidades:** {{opportunities | join(", ") or "Nenhuma informada"}}
  **Ameaças:** {{threats | join(", ") or "Nenhuma informada"}}

  ## Tarefa
  Sugira {{suggestions_per_quadrant | default(3)}} itens adicionais para
  cada quadrante que o usuário pode não ter considerado.

  Para cada item, forneça:
  1. O item em si (conciso, máx 10 palavras)
  2. Rationale (por que é relevante)
  3. Confiança (high/medium/low)

output_schema:
  type: object
  properties:
    strengths:
      type: array
      items:
        type: object
        properties:
          item: { type: string }
          rationale: { type: string }
          confidence: { type: string, enum: [high, medium, low] }
    weaknesses:
      type: array
      items: { $ref: "#/properties/strengths/items" }
    opportunities:
      type: array
      items: { $ref: "#/properties/strengths/items" }
    threats:
      type: array
      items: { $ref: "#/properties/strengths/items" }
```

### 4.2 North Star Refiner

```yaml
mode_id: northstar_refiner
model: claude-3-5-sonnet
max_tokens: 1500
temperature: 0.5

system_prompt: |
  Você é um especialista em branding estratégico e comunicação executiva.
  Seu papel é avaliar e refinar declarações de Visão e Propósito empresarial.

  Critérios de avaliação:
  1. Especificidade (0-100): Evita termos vagos?
  2. Memorabilidade (0-100): É fácil de lembrar?
  3. Diferenciação (0-100): Distingue dos concorrentes?
  4. Inspiração (0-100): Motiva o time?

  Seja construtivo e sugira melhorias concretas.

user_prompt_template: |
  ## Input
  **Tipo:** {{type}} (vision | purpose | value)
  **Texto atual:** "{{text}}"
  **Setor:** {{industry}}

  ## Tarefa
  1. Avalie o texto nos 4 critérios
  2. Calcule score geral (média ponderada)
  3. Se score < 70, gere 3 versões alternativas
  4. Indique o principal ponto de melhoria

output_schema:
  type: object
  properties:
    scores:
      type: object
      properties:
        specificity: { type: number, minimum: 0, maximum: 100 }
        memorability: { type: number, minimum: 0, maximum: 100 }
        differentiation: { type: number, minimum: 0, maximum: 100 }
        inspiration: { type: number, minimum: 0, maximum: 100 }
        overall: { type: number, minimum: 0, maximum: 100 }
    feedback: { type: string }
    suggestions:
      type: array
      items: { type: string }
      maxItems: 3
    improvement_focus: { type: string }
```

### 4.3 Driver Suggester

```yaml
mode_id: driver_suggester
model: claude-3-5-sonnet
max_tokens: 3000
temperature: 0.6

system_prompt: |
  Você é um estrategista sênior especializado em Hoshin Kanri.
  Seu papel é traduzir desafios estratégicos em Drivers acionáveis.

  Regras da metodologia:
  1. Driver deve atacar um desafio específico do SWOT
  2. Cada Driver tem: Intenção (o que), Escopo (como), Conexão (por que)
  3. Máximo 5 drivers por ciclo estratégico
  4. Distribuir entre as 4 dimensões do BSC
  5. Driver deve ser mensurável e ter dono claro

  Dimensões BSC:
  - financial: Objetivos financeiros e de crescimento
  - customer: Clientes, mercado, proposta de valor
  - process: Processos internos, operações, tecnologia
  - learning: Pessoas, cultura, capacitação

user_prompt_template: |
  ## North Star
  **Visão:** {{vision}}
  **Propósito:** {{purpose}}

  ## Desafios Identificados (SWOT)
  {{#each challenges}}
  - {{this.text}} (origem: {{this.source}})
  {{/each}}

  ## Drivers Já Definidos ({{existing_drivers.length}}/5)
  {{#each existing_drivers}}
  - [{{this.dimension}}] {{this.name}}
  {{/each}}

  ## Cobertura Atual por Dimensão
  - Financeira: {{coverage.financial}}
  - Cliente: {{coverage.customer}}
  - Processos: {{coverage.process}}
  - Aprendizado: {{coverage.learning}}

  ## Tarefa
  Sugira até {{max_suggestions | default(3)}} drivers estratégicos que:
  1. Ataquem desafios não cobertos
  2. Equilibrem as dimensões BSC
  3. Estejam alinhados com o North Star
  4. Sejam específicos e acionáveis

output_schema:
  type: object
  properties:
    suggestions:
      type: array
      items:
        type: object
        properties:
          name: { type: string, maxLength: 50 }
          dimension: { type: string, enum: [financial, customer, process, learning] }
          intention: { type: string, maxLength: 200 }
          scope: { type: string, maxLength: 200 }
          north_star_connection: { type: string, maxLength: 200 }
          source_challenge: { type: string }
          confidence: { type: number, minimum: 0, maximum: 1 }
    coverage_analysis:
      type: object
      properties:
        financial: { type: number }
        customer: { type: number }
        process: { type: number }
        learning: { type: number }
    recommendations:
      type: array
      items: { type: string }
```

### 4.4 KPI Architect

```yaml
mode_id: kpi_architect
model: claude-3-5-sonnet
max_tokens: 2500
temperature: 0.5

system_prompt: |
  Você é um especialista em métricas e indicadores de desempenho.
  Seu papel é sugerir KPIs relevantes para iniciativas estratégicas.

  Tipos de KPI:
  - Resultado (Lagging): Mede o outcome final
  - Processo (Leading): Mede atividades que levam ao resultado

  Boas práticas:
  1. Mix de leading e lagging indicators
  2. Métricas devem ser SMART
  3. Baseline deve ser realista
  4. Target deve ser desafiador mas atingível
  5. Frequência adequada ao ciclo de feedback

user_prompt_template: |
  ## Iniciativa
  **Nome:** {{initiative.name}}
  **Código:** {{initiative.code}}
  **Descrição:** {{initiative.description}}
  **Driver vinculado:** {{initiative.driver_name}}
  **Duração:** {{initiative.start_date}} - {{initiative.end_date}}

  ## Setor da Empresa
  {{industry}}

  ## KPIs Já Definidos
  {{#each existing_kpis}}
  - {{this.name}} ({{this.type}})
  {{/each}}

  ## Tarefa
  Sugira {{max_suggestions | default(3)}} KPIs para esta iniciativa.
  Para cada KPI, forneça benchmark de mercado quando disponível.

output_schema:
  type: object
  properties:
    suggestions:
      type: array
      items:
        type: object
        properties:
          name: { type: string }
          type: { type: string, enum: [resultado, processo] }
          formula: { type: string }
          baseline: { type: string }
          target: { type: string }
          stretch: { type: string }
          frequency: { type: string, enum: [daily, weekly, monthly, quarterly] }
          benchmark:
            type: object
            properties:
              value: { type: string }
              source: { type: string }
              context: { type: string }
          relevance_score: { type: number, minimum: 0, maximum: 100 }
    coverage_analysis:
      type: object
      properties:
        has_lagging: { type: boolean }
        has_leading: { type: boolean }
        recommendation: { type: string }
```

### 4.5 Daily Briefing Writer

```yaml
mode_id: briefing_writer
model: claude-3-5-sonnet
max_tokens: 2000
temperature: 0.4

system_prompt: |
  Você é um analista de gestão estratégica que gera briefings executivos.

  Seu papel:
  1. Identificar vitórias e celebrar progresso
  2. Alertar sobre riscos e tendências negativas
  3. Fazer previsões baseadas em padrões históricos
  4. Sugerir ações concretas e acionáveis

  Tom: Direto, baseado em dados, sem jargões.
  Formato: Conciso, bullet points, priorizado por impacto.

user_prompt_template: |
  ## Data
  {{today}}

  ## Snapshot da Estratégia
  - Ciclo: {{cycle.name}}
  - Drivers: {{cycle.drivers_count}}
  - Iniciativas: {{cycle.initiatives_count}}
  - Saúde geral: {{cycle.health_score}}%

  ## Métricas (últimos 30 dias)
  {{#each metrics}}
  - {{this.name}}: {{this.current}} (target: {{this.target}}, trend: {{this.trend}})
  {{/each}}

  ## Iniciativas e Status
  {{#each initiatives}}
  - {{this.code}} {{this.name}}: {{this.status}} ({{this.progress}}%)
    {{#if this.is_delayed}}⚠️ Atrasado {{this.days_delayed}} dias{{/if}}
  {{/each}}

  ## Atualizações Recentes (últimas 48h)
  {{#each recent_updates}}
  - [{{this.timestamp}}] {{this.user}}: {{this.action}} em {{this.target}}
  {{/each}}

  ## Tarefa
  Gere um briefing executivo com:
  1. Vitórias (máx 3) - o que está indo bem
  2. Alertas (máx 3) - o que precisa de atenção
  3. Previsões (máx 2) - tendências identificadas
  4. Ações sugeridas (máx 2) - próximos passos concretos

output_schema:
  type: object
  properties:
    briefing_date: { type: string, format: date }
    executive_summary: { type: string, maxLength: 200 }
    wins:
      type: array
      maxItems: 3
      items:
        type: object
        properties:
          metric: { type: string }
          achievement: { type: string }
          impact: { type: string }
    alerts:
      type: array
      maxItems: 3
      items:
        type: object
        properties:
          severity: { type: string, enum: [high, medium] }
          issue: { type: string }
          correlation: { type: string }
          suggestion: { type: string }
    predictions:
      type: array
      maxItems: 2
      items:
        type: object
        properties:
          initiative: { type: string }
          probability: { type: number, minimum: 0, maximum: 1 }
          outcome: { type: string }
          timeframe: { type: string }
    suggested_actions:
      type: array
      maxItems: 2
      items:
        type: object
        properties:
          action: { type: string }
          owner: { type: string }
          rationale: { type: string }
          priority: { type: string, enum: [high, medium] }
```

---

## 5. API Endpoints

```yaml
# Core AI Endpoints

POST /api/ai/generate
  description: Generic AI generation endpoint
  body:
    mode: string (required) # Mode ID from catalog
    context: object (required) # Context data for prompt
    options:
      stream: boolean # Enable streaming (default: true)
      model_override: string # Force specific model
  response:
    stream: ReadableStream | # If streaming
    result: object # If not streaming
  headers:
    X-AI-Request-ID: string # For tracking
    X-AI-Tokens-Used: number # Usage tracking

POST /api/ai/swot/suggest
  description: Suggest SWOT items
  body:
    company_context: object
    current_swot: object
    suggestions_per_quadrant: number
  response:
    suggestions: SWOTSuggestions

POST /api/ai/swot/synthesize
  description: Generate strategic challenges from SWOT
  body:
    swot: object
    max_challenges: number
  response:
    challenges: Challenge[]

POST /api/ai/northstar/evaluate
  description: Evaluate and refine North Star
  body:
    type: "vision" | "purpose" | "value"
    text: string
    industry: string
  response:
    evaluation: NorthStarEvaluation

POST /api/ai/drivers/suggest
  description: Suggest strategic drivers
  body:
    north_star: object
    challenges: Challenge[]
    existing_drivers: Driver[]
    max_suggestions: number
  response:
    suggestions: DriverSuggestion[]

POST /api/ai/initiatives/decompose
  description: Decompose driver into initiatives
  body:
    driver: Driver
    initiative_type: "tactical" | "operational"
  response:
    suggestions: InitiativeSuggestion[]

POST /api/ai/kpis/suggest
  description: Suggest KPIs for initiative
  body:
    initiative: Initiative
    industry: string
    existing_kpis: KPI[]
  response:
    suggestions: KPISuggestion[]

POST /api/ai/briefing/generate
  description: Generate daily briefing
  body:
    cycle_id: string
    date: string
  response:
    briefing: DailyBriefing

POST /api/ai/review/summarize
  description: Summarize review discussion
  body:
    discussion: Message[]
  response:
    summary: string
    action_items: ActionItem[]

# Feedback & Training
POST /api/ai/feedback
  description: Record user feedback on AI suggestion
  body:
    request_id: string
    suggestion_id: string
    action: "accepted" | "edited" | "rejected"
    edited_content?: object
  response:
    success: boolean
```

---

## 6. Implementação Técnica

### 6.1 AI Service Class

```typescript
// lib/ai/ai-service.ts

import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { streamText, generateText } from 'ai'

interface AIRequest {
  mode: AIMode
  context: Record<string, any>
  options?: {
    stream?: boolean
    modelOverride?: string
  }
}

interface AIResponse<T> {
  result: T
  metadata: {
    requestId: string
    model: string
    tokensUsed: number
    latencyMs: number
  }
}

export class AIService {
  private providers = {
    primary: anthropic('claude-3-5-sonnet-20241022'),
    fallback: openai('gpt-4-turbo')
  }

  async generate<T>(request: AIRequest): Promise<AIResponse<T>> {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    // Build context
    const context = await this.buildContext(request)

    // Select mode and compose prompt
    const mode = this.getModeConfig(request.mode)
    const prompt = this.composePrompt(mode, context)

    // Execute with retry and fallback
    const result = await this.executeWithFallback(prompt, mode, request.options)

    // Parse and validate response
    const parsed = this.parseResponse<T>(result, mode.outputSchema)

    // Track usage
    await this.trackUsage(requestId, {
      mode: request.mode,
      tokensUsed: result.usage.totalTokens,
      latencyMs: Date.now() - startTime
    })

    return {
      result: parsed,
      metadata: {
        requestId,
        model: result.model,
        tokensUsed: result.usage.totalTokens,
        latencyMs: Date.now() - startTime
      }
    }
  }

  async stream(request: AIRequest): AsyncGenerator<string> {
    const context = await this.buildContext(request)
    const mode = this.getModeConfig(request.mode)
    const prompt = this.composePrompt(mode, context)

    const { textStream } = await streamText({
      model: this.providers.primary,
      system: mode.systemPrompt,
      prompt: prompt,
      maxTokens: mode.maxTokens,
      temperature: mode.temperature
    })

    for await (const chunk of textStream) {
      yield chunk
    }
  }

  private async executeWithFallback(
    prompt: string,
    mode: ModeConfig,
    options?: AIRequest['options']
  ) {
    const maxRetries = 3

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const provider = attempt < 2
          ? this.providers.primary
          : this.providers.fallback

        return await generateText({
          model: provider,
          system: mode.systemPrompt,
          prompt: prompt,
          maxTokens: mode.maxTokens,
          temperature: mode.temperature
        })
      } catch (error) {
        if (attempt === maxRetries - 1) throw error
        await this.delay(Math.pow(2, attempt) * 1000) // Exponential backoff
      }
    }
  }

  private composePrompt(mode: ModeConfig, context: Record<string, any>): string {
    // Use Handlebars-style template rendering
    return this.renderTemplate(mode.userPromptTemplate, context)
  }

  private parseResponse<T>(result: any, schema: JSONSchema): T {
    // Extract JSON from response
    const jsonMatch = result.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      result.text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])

    // Validate against schema
    this.validateSchema(parsed, schema)

    return parsed as T
  }
}
```

### 6.2 Context Builder

```typescript
// lib/ai/context-builder.ts

export class ContextBuilder {
  constructor(
    private db: Database,
    private cache: Cache
  ) {}

  async build(
    userId: string,
    cycleId: string,
    contextType: ContextType
  ): Promise<AIContext> {
    // Get user context
    const user = await this.db.users.findById(userId)
    const organization = await this.db.organizations.findById(user.organizationId)

    // Get cycle context
    const cycle = await this.db.cycles.findById(cycleId)

    // Build context based on type
    switch (contextType) {
      case 'swot':
        return this.buildSWOTContext(cycle, organization)
      case 'drivers':
        return this.buildDriversContext(cycle, organization)
      case 'initiatives':
        return this.buildInitiativesContext(cycle)
      case 'kpis':
        return this.buildKPIsContext(cycle)
      case 'briefing':
        return this.buildBriefingContext(cycle)
      default:
        return this.buildGenericContext(cycle, organization)
    }
  }

  private async buildSWOTContext(cycle: Cycle, org: Organization) {
    return {
      company_name: org.name,
      industry: org.industry,
      company_size: org.size,
      stage: org.stage,
      description: org.description,
      current_swot: cycle.swot || {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      }
    }
  }

  private async buildDriversContext(cycle: Cycle, org: Organization) {
    const challenges = cycle.challenges || []
    const existingDrivers = await this.db.drivers.findByCycleId(cycle.id)

    const coverage = {
      financial: existingDrivers.filter(d => d.dimension === 'financial').length,
      customer: existingDrivers.filter(d => d.dimension === 'customer').length,
      process: existingDrivers.filter(d => d.dimension === 'process').length,
      learning: existingDrivers.filter(d => d.dimension === 'learning').length
    }

    return {
      vision: cycle.northStar?.vision,
      purpose: cycle.northStar?.purpose,
      challenges,
      existing_drivers: existingDrivers,
      coverage,
      industry: org.industry
    }
  }

  private async buildBriefingContext(cycle: Cycle) {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get metrics with history
    const metrics = await this.db.metrics.findByCycleIdWithHistory(
      cycle.id,
      thirtyDaysAgo,
      today
    )

    // Get initiatives with status
    const initiatives = await this.db.initiatives.findByCycleIdWithStatus(cycle.id)

    // Get recent updates
    const recentUpdates = await this.db.activityLog.findRecent(cycle.id, 48)

    return {
      today: today.toISOString().split('T')[0],
      cycle: {
        name: cycle.name,
        drivers_count: cycle.driversCount,
        initiatives_count: cycle.initiativesCount,
        health_score: this.calculateHealthScore(initiatives)
      },
      metrics: metrics.map(m => ({
        name: m.name,
        current: m.currentValue,
        target: m.target,
        trend: this.calculateTrend(m.history)
      })),
      initiatives: initiatives.map(i => ({
        code: i.code,
        name: i.name,
        status: i.status,
        progress: i.progress,
        is_delayed: i.isDelayed,
        days_delayed: i.daysDelayed
      })),
      recent_updates: recentUpdates
    }
  }
}
```

### 6.3 Rate Limiter

```typescript
// lib/ai/rate-limiter.ts

export class AIRateLimiter {
  private limits = {
    perMinute: 60,
    perHour: 500,
    perDay: 5000
  }

  async checkLimit(userId: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const now = Date.now()

    // Check minute limit
    const minuteKey = `ai:ratelimit:${userId}:minute:${Math.floor(now / 60000)}`
    const minuteCount = await this.redis.incr(minuteKey)
    await this.redis.expire(minuteKey, 60)

    if (minuteCount > this.limits.perMinute) {
      return {
        allowed: false,
        retryAfter: 60 - (now % 60000) / 1000
      }
    }

    // Check hour limit
    const hourKey = `ai:ratelimit:${userId}:hour:${Math.floor(now / 3600000)}`
    const hourCount = await this.redis.incr(hourKey)
    await this.redis.expire(hourKey, 3600)

    if (hourCount > this.limits.perHour) {
      return {
        allowed: false,
        retryAfter: 3600 - (now % 3600000) / 1000
      }
    }

    return { allowed: true }
  }
}
```

---

## 7. Métricas e Monitoramento

### 7.1 Métricas de IA

| Métrica | Descrição | Target | Alerta |
|---------|-----------|--------|--------|
| `ai_acceptance_rate` | % de sugestões aceitas | > 60% | < 40% |
| `ai_edit_rate` | % de sugestões editadas | < 30% | > 50% |
| `ai_rejection_rate` | % de sugestões rejeitadas | < 20% | > 40% |
| `ai_latency_p95` | Tempo de resposta P95 | < 5s | > 10s |
| `ai_error_rate` | % de requests com erro | < 1% | > 5% |
| `ai_fallback_rate` | % usando provider fallback | < 5% | > 20% |
| `ai_tokens_per_request` | Média de tokens por request | < 2000 | > 4000 |
| `ai_cost_per_user_day` | Custo médio por usuário/dia | < $0.50 | > $1.00 |

### 7.2 Tracking Events

```typescript
// Eventos a serem trackados
const AI_EVENTS = {
  SUGGESTION_GENERATED: 'ai.suggestion.generated',
  SUGGESTION_ACCEPTED: 'ai.suggestion.accepted',
  SUGGESTION_EDITED: 'ai.suggestion.edited',
  SUGGESTION_REJECTED: 'ai.suggestion.rejected',
  BRIEFING_GENERATED: 'ai.briefing.generated',
  BRIEFING_VIEWED: 'ai.briefing.viewed',
  ERROR_OCCURRED: 'ai.error',
  FALLBACK_USED: 'ai.fallback.used',
  RATE_LIMITED: 'ai.rate_limited'
}
```

---

## 8. Critérios de Aceite

### 8.1 Funcionalidade Core
- [ ] Todos os 14 modos de IA implementados
- [ ] Streaming funcionando para sugestões longas
- [ ] Fallback para OpenAI quando Anthropic falha
- [ ] Rate limiting por usuário funcionando
- [ ] Retry com exponential backoff implementado

### 8.2 Qualidade
- [ ] Acceptance rate > 50% nos primeiros testes
- [ ] Latência P95 < 5 segundos
- [ ] Zero hallucinations em dados factuais (benchmarks)
- [ ] JSON output válido em 99%+ dos casos

### 8.3 Observabilidade
- [ ] Todas as métricas sendo coletadas
- [ ] Dashboard de AI health no admin
- [ ] Alertas configurados para métricas críticas
- [ ] Logs estruturados para debugging

### 8.4 Segurança
- [ ] Nenhum dado sensível nos prompts
- [ ] API keys rotacionadas e seguras
- [ ] Audit log de todas requests AI
- [ ] Content filtering para respostas

---

## 9. Knowledge Bases

### 9.1 KB_01: Hoshin Kanri Methodology

```markdown
# Conhecimento: Metodologia Hoshin Kanri

## Hierarquia
1. North Star (Visão + Propósito)
2. Drivers Estratégicos (max 5)
3. Iniciativas Táticas
4. Iniciativas Operacionais
5. Metas/KPIs

## Regras
- Todo driver deve derivar de um desafio SWOT
- Máximo 5 drivers por ciclo
- Toda iniciativa deve ter owner e prazo
- Metas devem ter baseline e target

## BSC Dimensions
- Financeira: ROI, receita, margem
- Cliente: NPS, churn, CAC, LTV
- Processos: Lead time, qualidade, eficiência
- Aprendizado: Competências, cultura, inovação
```

### 9.2 KB_02: KPI Library

```json
{
  "categories": {
    "saas": {
      "revenue": ["MRR", "ARR", "ARPU", "Revenue Growth Rate"],
      "acquisition": ["CAC", "CAC Payback", "Lead Conversion Rate"],
      "retention": ["Churn Rate", "NRR", "Logo Retention"],
      "engagement": ["DAU/MAU", "Feature Adoption", "Time in App"]
    },
    "technology": {
      "delivery": ["Deploy Frequency", "Lead Time", "MTTR"],
      "quality": ["Bug Escape Rate", "Test Coverage", "Uptime"],
      "performance": ["Latency P95", "Error Rate", "Availability"]
    },
    "people": {
      "talent": ["Time to Hire", "Offer Acceptance Rate", "Turnover"],
      "engagement": ["eNPS", "1:1 Completion", "Training Hours"]
    }
  }
}
```

---

## 10. Custos Estimados

| Modelo | Custo Input | Custo Output | Est. Mensal (1000 users) |
|--------|-------------|--------------|--------------------------|
| Claude 3.5 Sonnet | $3/M tokens | $15/M tokens | ~$2,000 |
| GPT-4 Turbo | $10/M tokens | $30/M tokens | ~$500 (fallback) |
| **Total** | | | **~$2,500/mês** |

Estratégias de otimização:
1. Cache de respostas similares
2. Prompt compression
3. Batch requests quando possível
4. Use modelos menores para validação simples


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->