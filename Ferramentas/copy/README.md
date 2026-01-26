# ✍️ Copy - Elite Copywriting Squad v3.1

**Command:** `/copy`
**Independence:** ✅ 100% Self-Contained
**Version:** 3.1.0

> Um time de copywriters lendários organizados por Tier para criar peças de alta conversão com metodologia research-first.

---

## O Que Há de Novo na v3.1

### Copy Discovery Pipeline v2.0
Pipeline automatizado para projetos completos:
- **7 workflows** por tipo de projeto (full-launch, paid-traffic, high-ticket, etc.)
- **Master Decision Matrix** - 5 perguntas antes de iniciar
- **Clone Combos** - combinações validadas de copywriters
- **Parallel Execution** - Headlines e Bullets rodam simultaneamente

### Tier System (v3.0)
Copywriters agora são organizados por função, não "qualidade":
- **Tier 0 (Diagnóstico):** SEMPRE primeiro - avalia antes de escrever
- **Tier 1 (Masters $500M+):** Execução de copy de alta performance
- **Tier 2 (Systematizers):** Frameworks e sistemas reproduzíveis
- **Tier 3 (Format Specialists):** Expertise em formatos específicos
- **TOOL:** Sugarman 30 Triggers (checklist pós-copy)

### Research-First Methodology
Todas as tasks agora têm documentos de pesquisa com 500+ linhas.

### Agentes Arquivados
Alex Hormozi, Dan Koe, Frank Kern e Ramit Sethi foram movidos para `archive/` por não serem copywriters de direct response.

---

## Sistema de Tiers

```
┌─────────────────────────────────────────────────────────────┐
│                     COPY CHIEF v3.0                         │
│              Orquestrador do Time de Tiers                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 0 - DIAGNÓSTICO (sempre primeiro)                      │
├─────────────────────────────────────────────────────────────┤
│ @claude-hopkins   → Scientific Advertising, Auditoria       │
│ @eugene-schwartz  → 5 Awareness Levels, Sophistication      │
│ @robert-collier   → Enter the Conversation [planned]        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 1 - DOCUMENTED MASTERS ($500M+)                        │
├─────────────────────────────────────────────────────────────┤
│ @gary-halbert     → Sales Letters, Storytelling Visceral    │
│ @gary-bencivenga  → Bullets, Fascinations, 80% win rate     │
│ @david-ogilvy     → Premium Branding, Research-based        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 2 - MODERN SYSTEMATIZERS                               │
├─────────────────────────────────────────────────────────────┤
│ @dan-kennedy      → Urgência, 3Ms, NO B.S. (NOT 4Ms!)       │
│ @todd-brown       → Big Ideas, Unique Mechanisms, E5        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 3 - FORMAT SPECIALISTS                                 │
├─────────────────────────────────────────────────────────────┤
│ @jon-benson       → VSL (Video Sales Letter) - Inventor     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ TOOL - POST-COPY VALIDATION                                 │
├─────────────────────────────────────────────────────────────┤
│ *sugarman-check   → 30 Psychological Triggers Checklist     │
│                     (Aplicar APÓS escrever copy)            │
└─────────────────────────────────────────────────────────────┘
```

### Quando Usar Cada Tier

| Tier | Quando Usar |
|------|-------------|
| **Tier 0** | SEMPRE primeiro - antes de escrever qualquer copy |
| **Tier 1** | Após diagnóstico, para execução de alta performance |
| **Tier 2** | Quando precisar de processo estruturado e frameworks |
| **Tier 3** | Quando precisar de expertise em formato específico (VSL) |
| **TOOL** | APÓS escrever copy, ANTES de publicar |

---

## Agentes Ativos (9 + 1 Tool)

### Orchestrator

| Agente | ID | Função |
|--------|-----|--------|
| **Copy Chief** | `@copy-chief` | Orquestrador do time - diagnóstico e delegação |

### Tier 0 - Diagnóstico

| Agente | ID | Especialidade |
|--------|-----|---------------|
| **Claude Hopkins** | `@claude-hopkins` | Scientific Advertising - Auditoria & Testes |
| **Eugene Schwartz** | `@eugene-schwartz` | 5 Levels of Awareness & Market Sophistication |

### Tier 1 - Masters ($500M+)

| Agente | ID | Especialidade | Resultados |
|--------|-----|---------------|------------|
| **Gary Halbert** | `@gary-halbert` | Sales Letters, Storytelling | $1B+ vendas |
| **Gary Bencivenga** | `@gary-bencivenga` | Bullets, Fascinations | 80% win rate |
| **David Ogilvy** | `@david-ogilvy` | Branding, Copy Elegante | Campanhas icônicas |

### Tier 2 - Systematizers

| Agente | ID | Especialidade | Key Framework |
|--------|-----|---------------|---------------|
| **Dan Kennedy** | `@dan-kennedy` | Urgência, Escassez, NO B.S. | 3Ms (NOT 4Ms!) |
| **Todd Brown** | `@todd-brown` | Big Ideas, Mechanisms | E5 Method |

### Tier 3 - Format Specialists

| Agente | ID | Especialidade | Resultados |
|--------|-----|---------------|------------|
| **Jon Benson** | `@jon-benson` | VSL Scripts | Inventou o formato, $1B+ |

### Tool (Not Clone)

| Tool | Comando | Função |
|------|---------|--------|
| **Sugarman 30 Triggers** | `*sugarman-check` | Checklist de validação pós-copy |

**IMPORTANTE:** Joe Sugarman não é um copywriter ativável. É uma FERRAMENTA de checklist.

---

## Agentes Arquivados

Os seguintes agentes foram movidos para `archive/agents/` por não serem copywriters de direct response:

| Agente | Razão |
|--------|-------|
| Alex Hormozi | Business strategist, não copywriter |
| Dan Koe | Content creator, não direct response |
| Frank Kern | Marketing strategist, não copywriter |
| Ramit Sethi | Personal finance educator, não copywriter |

Para reativar, mova de `archive/agents/` para `agents/` e atualize `config.yaml`.

---

## Workflow Padrão (Tier-Based)

### Standard Workflow

```
1. *diagnose           → Tier 0 avalia o projeto (awareness + sophistication)
2. *recommend          → Copy Chief seleciona copywriter ideal
3. @copywriter         → Executa o projeto
4. *audit-copy         → Hopkins audita resultado
5. *sugarman-check     → 30 Triggers validation
6. Entrega final
```

### Quick Workflow (Projetos Menores)

```
1. *diagnose           → Diagnóstico rápido
2. @copywriter         → Execução
3. *sugarman-check     → Validação final
```

### Acesso Direto (Se Já Sabe o Copywriter)

```
@gary-halbert
*sales-page
```

---

## Comandos do Copy Chief

### Workflow Commands

| Comando | Descrição |
|---------|-----------|
| `*help` | Ver todos os comandos |
| `*diagnose` | Iniciar diagnóstico Tier 0 |
| `*diagnose-awareness` | Schwartz: identificar nível de consciência |
| `*diagnose-sophistication` | Schwartz: identificar estágio de sofisticação |
| `*briefing` | Iniciar briefing completo |
| `*recommend` | Recomendar copywriter ideal |

### Creation Commands

| Comando | Descrição |
|---------|-----------|
| `*sales-page` | Página de vendas (delega para copywriter) |
| `*email-sequence` | Sequência de emails |
| `*vsl` | Script de VSL (delega para Jon Benson) |
| `*ads` | Anúncios (Facebook/Google/Instagram) |
| `*headlines` | Headlines e hooks |
| `*lead-magnet` | Copy para lead magnet |
| `*webinar` | Script de webinar |
| `*upsell` | Página de upsell/downsell |
| `*landing` | Landing page de captura |

### Quality Commands

| Comando | Descrição |
|---------|-----------|
| `*audit-copy` | Hopkins: auditoria científica |
| `*sugarman-check` | Aplicar 30 Triggers checklist |
| `*review` | Revisar e melhorar copy existente |

### Team Commands

| Comando | Descrição |
|---------|-----------|
| `*team` | Ver time completo por tier |
| `*tier0` | Ver copywriters de diagnóstico |
| `*tier1` | Ver masters documentados |
| `*tier2` | Ver systematizers |
| `*tier3` | Ver especialistas de formato |

---

## Tasks (37 tasks)

### Agent Creation Tasks (6)

| Task | Descrição |
|------|-----------|
| `create-copywriter-agent` | Criar novo agente copywriter |
| `extract-communication-dna` | Extrair DNA de comunicação |
| `extract-frameworks` | Extrair frameworks |
| `extract-signature-phrases` | Extrair frases assinatura (v2.0, 1197 linhas) |
| `build-authority-arsenal` | Construir arsenal de autoridade |
| `create-objection-algorithms` | Criar algoritmos de objeção |

### Diagnosis Tasks (3)

| Task | Descrição | Tier |
|------|-----------|------|
| `audit-copy-hopkins` | Auditoria científica Hopkins | 0 |
| `setup-split-test` | Setup de split test | 0 |
| `audit-landing-page` | Auditoria de landing page | 0 |

### Research Tasks (2)

| Task | Descrição |
|------|-----------|
| `avatar-research` | Pesquisa de avatar |
| `copysearch` | Pesquisa de copy competidora |

### Creation Tasks - Sales Pages & Funnels (8)

| Task | Descrição |
|------|-----------|
| `create-sales-page` | Página de vendas |
| `create-landing-page` | Landing page |
| `create-upsell-page` | Página de upsell |
| `create-downsell-page` | Página de downsell |
| `create-order-bump` | Order bump |
| `create-thank-you-page` | Thank you page |
| `create-lead-magnet` | Lead magnet (v2.0, 1249 linhas) |
| `create-abandoned-cart` | Carrinho abandonado (v2.0, 1165 linhas) |

### Creation Tasks - Email (4)

| Task | Descrição |
|------|-----------|
| `create-email-sequence` | Sequência de emails |
| `create-launch-emails` | Emails de lançamento |
| `create-cold-email` | Cold email |
| `create-newsletter` | Newsletter |

### Creation Tasks - Video & Ads (6)

| Task | Descrição |
|------|-----------|
| `vsl-script` | Script de VSL |
| `create-video-hook` | Hook de video |
| `create-ad-copy` | Copy de anúncios |
| `create-ad-script` | Script de anúncio |
| `create-youtube-ads` | Anúncios YouTube |
| `create-native-ads` | Native ads |

### Creation Tasks - Other (6)

| Task | Descrição |
|------|-----------|
| `create-headlines` | Headlines & hooks |
| `create-bullets` | Bullets & fascinations |
| `create-webinar-script` | Script de webinar |
| `create-close-script` | Script de close |
| `create-offer` | Criar oferta |
| `evaluate-offer` | Avaliar oferta |

### Collaboration Tasks (2)

| Task | Descrição |
|------|-----------|
| `blend` | Combinar estilos de copywriters |
| `copy-debate` | Debate entre copywriters |

---

## Templates (12)

### Core Templates

- `sales-page-tmpl.yaml`
- `email-sequence-tmpl.yaml`
- `ad-copy-tmpl.yaml`
- `vsl-tmpl.yaml`

### Agent Creation Templates

- `copywriter-agent-tmpl.yaml`
- `communication-dna-tmpl.yaml`
- `frameworks-extraction-tmpl.yaml`
- `signature-phrases-tmpl.yaml`
- `authority-arsenal-tmpl.yaml`
- `objection-algorithms-tmpl.yaml`

### Collaboration Templates

- `blend-tmpl.yaml`
- `debate-tmpl.yaml`

---

## Checklists (6)

| Checklist | Descrição |
|-----------|-----------|
| `copy-quality-checklist.md` | Qualidade de copy |
| `copywriter-quality-checklist.md` | Qualidade por copywriter |
| `hopkins-audit-checklist.md` | Auditoria Hopkins (Tier 0) |
| `copywriter-agent-creation-checklist.md` | Criação de agente |
| `avatar-research-checklist.md` | Pesquisa de avatar |
| `copysearch-checklist.md` | Pesquisa de copy |

---

## Research Documents (6)

Metodologia research-first: cada task tem um documento de pesquisa com 500+ linhas.

| Research | Linhas | Task Upgraded |
|----------|--------|---------------|
| `signature-phrases-methodology-research.md` | 698 | `extract-signature-phrases` |
| `lead-magnet-methodology-research.md` | 689 | `create-lead-magnet` |
| `abandoned-cart-methodology-research.md` | 720 | `create-abandoned-cart` |
| `close-script-methodology-research.md` | - | `create-close-script` |
| `copy-blending-methodology-research.md` | - | `blend` |
| `authority-arsenal-methodology-research.md` | - | `build-authority-arsenal` |

---

## Guia de Escolha de Copywriter

### Por Tipo de Projeto

| Projeto | Copywriter | Por quê |
|---------|------------|---------|
| Sales page longa | @gary-halbert | Storytelling visceral |
| Marca premium | @david-ogilvy | Elegância, credibilidade |
| Mercado saturado | @todd-brown | Big idea, mecanismo único |
| Testes A/B | @claude-hopkins | Scientific advertising |
| Urgência/escassez | @dan-kennedy | NO B.S., deadline |
| Bullets/fascinations | @gary-bencivenga | 80% win rate |
| VSL | @jon-benson | Inventor do formato |
| Diagnóstico | @eugene-schwartz | 5 awareness levels |

### Por Nível de Awareness (Schwartz)

| Awareness Level | Copywriter | Abordagem |
|-----------------|------------|-----------|
| Unaware | @gary-halbert | Story-driven, big idea |
| Problem Aware | @dan-kennedy | P.A.S., agitate problem |
| Solution Aware | @todd-brown | Unique mechanism |
| Product Aware | @gary-bencivenga | Bullets, fascinations |
| Most Aware | @dan-kennedy | Deal, urgency, scarcity |

---

## Pack Structure

```
expansion-packs/copy/
├── agents/                     # 9 agentes ativos + 1 tool reference
│   ├── copy-chief.md           # Orchestrador v3.0
│   ├── claude-hopkins.md       # Tier 0
│   ├── eugene-schwartz.md      # Tier 0
│   ├── gary-halbert.md         # Tier 1
│   ├── gary-bencivenga.md      # Tier 1
│   ├── david-ogilvy.md         # Tier 1
│   ├── dan-kennedy.md          # Tier 2
│   ├── todd-brown.md           # Tier 2
│   ├── jon-benson.md           # Tier 3
│   └── joe-sugarman.md         # TOOL (30 Triggers)
├── archive/                    # Agentes arquivados
│   └── agents/
│       ├── alex-hormozi.md
│       ├── dan-koe.md
│       ├── frank-kern.md
│       └── ramit-sethi.md
├── scripts/                    # Pipeline automation
│   └── copy-discovery.sh       # Copy Discovery Pipeline v2.0
├── tasks/                      # 48 tasks
├── templates/                  # 12+ templates
│   └── pipeline/               # Pipeline templates
│       ├── prompt.md           # Phase prompt template
│       └── state.json          # State tracking template
├── checklists/                 # 12 checklists
├── data/
│   └── copywriting-kb.md
├── docs/
│   ├── frameworks/             # 8 framework documents
│   └── research/               # 6 research documents
├── projects/                   # PRDs de upgrade
├── config.yaml                 # v3.1.0
└── README.md                   # Este arquivo
```

---

## Integração MMOS (Preparado)

Este pack está preparado para integração com MMOS (Mind Mapping Operating System):

```yaml
mmos_integration:
  enabled: false  # Ativar quando disponível
  mind_mapping:
    claude-hopkins: claude_hopkins
    eugene-schwartz: eugene_schwartz
    gary-halbert: gary_halbert
    gary-bencivenga: gary_bencivenga
    david-ogilvy: david_ogilvy
    dan-kennedy: dan_kennedy
    todd-brown: todd_brown
    jon-benson: jon_benson
    joe-sugarman: joe_sugarman  # Tool only
```

Quando ativado:
- Agentes usarão **clones cognitivos reais**
- Análise profunda de cada obra dos mestres
- Padrões linguísticos extraídos via MMOS pipeline
- Respostas baseadas em como o copywriter REALMENTE pensava

---

## Créditos

Este pack é uma homenagem aos maiores copywriters da história:

### Era Clássica
- **Claude Hopkins** (1866-1932) - Scientific Advertising
- **David Ogilvy** (1911-1999) - Father of Advertising
- **Eugene Schwartz** (1927-1995) - Breakthrough Advertising

### Era Direta
- **Gary Halbert** (1938-2007) - The Prince of Print
- **Gary Bencivenga** (1946-) - World's Greatest Living Copywriter
- **Joe Sugarman** (1938-2022) - Triggers & Storytelling

### Era Transição
- **Dan Kennedy** (1954-) - The Millionaire Maker

### Era Moderna
- **Todd Brown** - E5 Method Creator
- **Jon Benson** - Inventor of the VSL

---

## Copy Discovery Pipeline v2.0

Pipeline automatizado para projetos de copy completos. Executa tasks em sequência com sessões Claude frescas por fase.

### Uso

```bash
# Full launch (default)
./scripts/copy-discovery.sh makers-campaign

# Workflow específico
./scripts/copy-discovery.sh facebook-ads paid-traffic

# Com mais iterações
./scripts/copy-discovery.sh coaching-offer high-ticket 15

# Ver ajuda
./scripts/copy-discovery.sh --help
```

### Workflows Disponíveis

| Workflow | Duração | Melhor Para |
|----------|---------|-------------|
| `full-launch` | 5-7 dias | Curso, membership, lançamento de produto |
| `paid-traffic` | 2-3 dias | Facebook, Google, YouTube ads |
| `high-ticket` | 7-10 dias | Coaching, consultoria, programas $5k+ |
| `organic` | Contínuo | Personal brand, construção de autoridade |
| `email-system` | Setup+ | Monetização de lista, automação |
| `optimization` | 3-5 dias | CRO, melhorar funnels existentes |
| `direct-mail` | 2-3 semanas | B2B, premium, produtos físicos |

### Master Decision Matrix

Responda ANTES de iniciar o pipeline:

1. **Awareness Level** - Unaware → Most Aware (Schwartz)
2. **Market Sophistication** - Stage 1 → 5 (Schwartz)
3. **Price Point** - Low / Mid / High / Premium
4. **Traffic Temperature** - Cold / Warm / Hot
5. **Primary Output** - VSL / Letter / Email / Ad / etc.

### Fases do Pipeline

```
Phase 1: TIER 0 Foundation (Schwartz/Collier)
    └── diagnose-awareness + diagnose-sophistication + mental-conversation

Phase 2: TIER 2 Strategy (Kennedy/Todd Brown/RMBC)
    └── avatar-research + rmbc-method

Phase 3a + 3b: PARALLEL
    ├── [3a] Headlines (Halbert)
    └── [3b] Bullets (Bencivenga)

Phase 4: Offer Stack (Kennedy)
    └── create-offer

Phase 5: Copy Execution (Benson/Makepeace)
    └── vsl-script + write-visceral-copy

Phase 6: Email Sequences (Chaperon/Sugarman)
    └── soap-opera-sequence + abandoned-cart

Phase 7: Optimization (Hopkins)
    └── audit-copy-hopkins
```

### Clone Combos que Funcionam

| Combo | Por quê |
|-------|---------|
| Schwartz + Anyone | Sempre diagnóstico primeiro |
| Todd Brown + Georgi | Mechanism + Production |
| Halbert + Makepeace | Story + Emotion |
| Chaperon + Settle | Hybrid email |
| Bencivenga + Lampropoulos | Bullet power |
| Kennedy + Todd Brown | Avatar + Differentiation |
| Hopkins + Sugarman | Testing + Triggers |

### Combos com Cuidado

| Combo | Problema |
|-------|----------|
| Halbert + Carlton | Style conflict |
| Ogilvy + Makepeace | Sophisticated vs Visceral |
| All 30 Sugarman triggers | Overkill = distrust |
| Settle + Chaperon same list | Confuses expectations |

### Output Structure

```
outputs/copy/{project-slug}/
├── copy-state.json           # Estado do pipeline
├── progress.log              # Log de progresso
├── diagnosis/
│   ├── awareness.yaml        # Nível de consciência
│   ├── sophistication.yaml   # Sofisticação do mercado
│   └── mental-conversation.md
├── research/
│   └── avatar.md             # Avatar profundo
├── foundation/
│   └── rmbc-brief.md         # RMBC framework
├── copy/
│   ├── headlines.md          # 25+ headlines
│   ├── bullets.md            # 50+ fascinations
│   ├── vsl-script.md         # VSL completo
│   └── visceral-sections.md  # Copy emocional
├── offer/
│   └── offer-stack.md        # Offer irresistível
├── email/
│   ├── soap-opera.md         # SOS sequence
│   └── abandoned-cart.md     # Cart recovery
└── testing/
    └── hopkins-audit.md      # Scientific audit
```

---

## Quick Start

```
@copy-chief

*diagnose

[Tier 0 analisa seu projeto]

*recommend

[Copy Chief recomenda copywriter ideal]

@gary-halbert

*sales-page

[Executa com copywriter selecionado]

*sugarman-check

[Valida com 30 Triggers]
```

---

**Pronto para criar copy que converte? Ative o Copy Chief e comece com *diagnose!**

```
@copy-chief

*diagnose
```

---

---

## eximIA.OS Integration

Este pack está **totalmente integrado** com o ecossistema eximIA.OS:

### Registro de Agentes
Todos os copywriters estão registrados em `agent_registry.yaml`:
- Seção: `copy_squad`
- 10 agentes: Copy Chief + 8 copywriters + Sugarman Tool

### Roteamento via Maestro
O The Maestro roteia automaticamente para Copy Squad quando detecta:
- `sales page`, `VSL`, `headline`, `email sequence`
- `copywriting`, `texto persuasivo`, `copy`
- `urgência`, `escassez`, `bullets`

### Colaborações
| Agent | Colaboração |
|-------|-------------|
| **The_CMO** | Brand positioning, GTM |
| **The_Veritas** | Market research |
| **The_CFO** | Pricing, offer structure |

### Invocação
```
# Via Maestro (automático)
"Preciso de uma sales page para meu curso"
→ Maestro roteia para Copy Chief

# Direto (manual)
@copy-chief
*diagnose
```

---

*Copy v3.1.0*
*Elite Copywriting Squad - Tier System + Discovery Pipeline*
*Research-First Methodology*
*Integrated with: eximIA.OS v1.0*
*Last Updated: 2026-01-23*
