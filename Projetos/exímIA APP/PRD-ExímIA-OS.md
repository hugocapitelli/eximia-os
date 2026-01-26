# ExímIA OS
## Product Requirements Document

**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Por:** ExímIA Ventures
**Status:** Em Evolução Contínua

> **Changelog v5.0:**
> - Connection Layer expandida para 60% do PRD (Event Bus, Entity Links, Suggestion Engine, Cascading Rules)
> - Análise UX/UI completa aplicando Atomic Design (Brad Frost) com 13 subseções
> - Design System atualizado com cor base #FDBF68 (ExímIA Gold)
> - Seções de Roadmap e timeline removidas
> - Duplicatas removidas, estrutura limpa
>
> **Changelog v4.2:** Clone Reviews (Elon Musk + Brad Frost). Finance Module proposto.
>
> **Changelog v4.1:** Especificações técnicas de Connection Layer, Inbox, Notifications e PWA.

---

# Sumário

1. [Manifesto](#1-manifesto)
2. [O Produto](#2-o-produto)
3. [Design System](#3-design-system)
4. [CONNECTION LAYER — O Coração do Sistema](#4-connection-layer) ⭐ **60% DO PRD**
   - 4.1 Filosofia: Sistema Nervoso Central
   - 4.2 Event Bus — Sistema de Eventos
   - 4.3 Entity Links — Conexões Bidirecionais
   - 4.4 Suggestion Engine — IA Proativa
   - 4.5 Cascading Rules — Automações
   - 4.6 Cross-Module Workflows
   - 4.7 Inbox — Entrada Universal
   - 4.8 Notifications — Saída Proativa
   - 4.9 Connection Layer — Métricas de Saúde
5. [Módulos da Plataforma](#5-módulos-da-plataforma)
   - 5.1 Journey — Execução Pessoal
   - 5.2 Academy — IA Socrática ⭐ **ESTRATÉGICO**
   - 5.3 Brand — Gestão de Marca
   - 5.4 Strategy (StratOS) — Planejamento
6. [PrototypOS](#6-prototypos)
7. [API & Endpoints](#7-api--endpoints)
8. [Mobile & PWA](#8-mobile--pwa)
9. [UX/UI Architecture — Atomic Design Analysis](#9-uxui-architecture) ⭐ **NOVO (Brad Frost)**
   - 9.1 Filosofia: Sistemas, Não Páginas
   - 9.2 Design Tokens — Partículas Subatômicas
   - 9.3 Atoms — Elementos Indivisíveis
   - 9.4 Molecules — Combinações Funcionais
   - 9.5 Organisms — Seções Complexas
   - 9.6 Templates — Layouts Estruturais
   - 9.7 Pages — Instâncias Reais
   - 9.8 Component States Matrix
   - 9.9 Responsive Behavior
   - 9.10 Pattern Library Structure
   - 9.11 Documentation & Collaboration
   - 9.12 Acessibilidade (a11y)
   - 9.13 Performance Considerations
10. [Métricas de Sucesso](#10-métricas-de-sucesso)
11. [Análise Crítica](#11-análise-crítica)
12. [Clone Reviews: Elon Musk & Brad Frost](#12-clone-reviews)
13. [Finance Module — Proposta](#13-finance-module)
14. [Glossário](#14-glossário)

---

# 1. Manifesto

## Por Empreendedores. Para Empreendedores.

### O Problema: Ferramentas Isoladas Criam Ilhas

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│       O "TETO DE VIDRO" DA AUTOMAÇÃO                                   │
│                                                                        │
│   Processos Fragmentados          Ilhas de           Empresa          │
│   Dependência Humana         →    Eficiência    →   Inteligente       │
│   Falta de Padrão                                                      │
│                                                                        │
│         🏝️  🏝️  🏝️                    🌐                              │
│        (O Problema)               (O Objetivo)                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

Como empreendedores, vivemos um paradoxo: **temos acesso a mais ferramentas do que nunca, mas nunca estivemos tão fragmentados**.

| O Sintoma | A Dor Real |
|-----------|------------|
| **Processos Fragmentados** | IA pontual, sem conexão com o core. Usamos ChatGPT aqui, Notion ali, planilha acolá — nada conversa. |
| **Dependência Humana** | A operação para se ninguém apertar o botão. Cada integração requer um humano no meio. |
| **Falta de Padrão** | A qualidade varia conforme quem opera. Sem processos, cada execução é uma aventura. |

O resultado? **Ilhas de Eficiência** — pequenas vitórias isoladas que nunca escalam, nunca se conectam, nunca compõem algo maior.

### O Objetivo: A Empresa Inteligente

O ExímIA OS existe para quebrar esse teto de vidro.

Não construímos mais uma ferramenta. Construímos **o sistema nervoso central** do empreendedor exímio — onde estratégia, execução, aprendizado e marca fluem como um organismo vivo.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    EMPRESA INTELIGENTE                          │
│                                                                 │
│         Strategy ←──→ Journey ←──→ Academy                     │
│              ↕            ↕           ↕                         │
│           Brand ←────→ PrototypOS ←───┘                        │
│                                                                 │
│         Tudo conectado. Tudo fluindo. Tudo inteligente.        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Nossa Filosofia

> *"Ser exímio não é sobre perfeição. É sobre a busca incansável pela excelência em tudo que fazemos — e sobre ter sistemas que sustentem essa busca."*

| Princípio | O que significa |
|-----------|-----------------|
| **Sistema > Ferramenta** | Não vendemos features. Vendemos a capacidade de operar com inteligência. |
| **Conexão > Acumulação** | Menos módulos perfeitos, mais pontes entre eles. |
| **Proatividade > Reatividade** | O sistema antecipa, não apenas responde. |
| **Padrão > Heroísmo** | Qualidade não pode depender de quem está operando. |

### Para Quem Construímos

O ExímIA OS é para o empreendedor que:

- Está **cansado de ser o middleware humano** entre suas ferramentas
- Entende que **escalar exige sistemas**, não mais horas de trabalho
- Busca **padrão e previsibilidade** em vez de depender de "boas intenções"
- Quer uma plataforma que **cresce junto com ele**, não contra ele
- Sabe que **a ferramenta certa economiza anos**, não minutos

---

# 2. O Produto

## 2.1 Visão Geral

O **ExímIA OS** é o sistema operacional para empreendedores exímios — uma plataforma que transforma ilhas de eficiência em uma empresa verdadeiramente inteligente.

```
┌─────────────────────────────────────────────────────────────────┐
│                       ExímIA OS                                 │
│              "Da Fragmentação à Inteligência"                   │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│   Journey   │   Academy   │    Brand    │    PrototypOS        │
│  (Execução) │ (Aprend.IA) │   (Marca)   │    (Produtos)        │
├─────────────┴─────────────┴─────────────┴──────────────────────┤
│                     Strategy (StratOS)                          │
│                   "A Camada de Direção"                         │
├─────────────────────────────────────────────────────────────────┤
│                    CONNECTION LAYER                             │
│        "O que transforma ilhas em continente"                   │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Os Cinco Workspaces + Connection Layer

| Workspace | Propósito | Conexões |
|-----------|-----------|----------|
| **Journey** | Execução diária: metas, hábitos, leituras, calendário | Recebe cascateamento de Strategy, alimenta Brand |
| **Academy** | Aprendizado profundo com IA Socrática | Sugere conteúdo baseado em Goals, desenvolve competências para Strategy |
| **Brand** | Gestão de identidade e voz de marca | Informa tom de PrototypOS, recebe insights de Journey |
| **PrototypOS** | Design e prototipagem de produtos | Usa Brand guidelines, gera iniciativas para Strategy |
| **Strategy** | Planejamento estratégico que cascateia | Define direção que desce para todos os módulos |
| **Connection Layer** | A cola invisível entre tudo | Automações, sugestões, insights cross-module |

## 2.3 Stack Tecnológico

### Frontend
```
React 18 + TypeScript 5
├── Vite 5 (Build)
├── Tailwind CSS 3 (Estilização)
├── shadcn/ui + Radix (Componentes)
├── Inter (Tipografia)
├── Lucide (Ícones)
└── Google GenAI SDK (IA)
```

### Backend
```
Python 3.11 + FastAPI
├── SQLAlchemy 2 (ORM)
├── PostgreSQL (Database)
├── Pydantic 2 (Validação)
├── OpenAI API (Agentes IA)
└── Supabase (Storage + Auth)
```

---

# 3. Design System

## 3.1 Filosofia Visual: "Soft Business"

O ExímIA OS adota a estética **Soft Business** — um equilíbrio entre a seriedade de ferramentas empresariais e a sofisticação de produtos premium.

### Princípios de Design

| Princípio | Aplicação |
|-----------|-----------|
| **Consistent Containment** | Todas as ferramentas vivem dentro de "janelas" que simulam uma experiência desktop-app na web |
| **Data Density** | Otimizado para legibilidade e densidade de informação — respeita a inteligência do usuário |
| **Stark Contrast** | Dark mode com contraste alto; Light mode suave e profissional |
| **Minimal Chrome** | Interface desaparece para o conteúdo brilhar |

## 3.2 Paleta de Cores

### Cor Primária: Dourado ExímIA (#FDBF68)

O dourado suave representa **sofisticação, clareza e excelência** — valores centrais para o empreendedor exímio. Escolhemos um tom mais quente e menos saturado que transmite profissionalismo sem agressividade.

### Escala Completa: ExímIA Gold

```css
/* Cor Base: #FDBF68 */
--eximia-50:   #FFF9F0;    /* Background suave */
--eximia-100:  #FEF0DC;    /* Highlight sutil */
--eximia-200:  #FDE4C2;    /* Borders ativos */
--eximia-300:  #FDD59A;    /* Elementos secundários */
--eximia-400:  #FDBF68;    /* ★ COR PRINCIPAL ★ */
--eximia-500:  #E5A850;    /* Hover Light Mode */
--eximia-600:  #CC9040;    /* Active state */
--eximia-700:  #A67530;    /* Text on light bg */
--eximia-800:  #805A24;    /* Strong accent */
--eximia-900:  #5C4018;    /* Darkest shade */
```

### Light Mode: Slate/ExímIA Gold

```css
/* Superfícies */
--surface:        #FFFFFF;     /* Background principal */
--surface-raised: #FAFAFA;     /* Cards elevados */
--highlight:      #FFF9F0;     /* Elementos destacados (eximia-50) */

/* Ações */
--primary:        #FDBF68;     /* Cor de ação principal */
--primary-hover:  #E5A850;     /* Estado hover */
--primary-active: #CC9040;     /* Estado pressed */

/* Neutros */
--background:  #FAFAFA;        /* Fundo geral */
--subtle:      #F1F5F9;        /* Separadores sutis (slate-100) */
--border:      #E2E8F0;        /* Bordas (slate-200) */
--border-focus: #FDBF68;       /* Bordas em foco */
--body:        #64748B;        /* Texto secundário (slate-500) */
--heading:     #1E293B;        /* Texto principal (slate-800) */
--muted:       #94A3B8;        /* Texto desabilitado (slate-400) */
```

### Dark Mode: Zinc/ExímIA Gold

```css
/* Superfícies */
--surface:        #18181B;     /* Background principal (zinc-900) */
--surface-raised: #27272A;     /* Cards elevados (zinc-800) */
--highlight:      #3F3F46;     /* Elementos destacados (zinc-700) */

/* Ações */
--primary:        #FDBF68;     /* Cor de ação principal */
--primary-hover:  #FDD59A;     /* Estado hover (mais claro no dark) */
--primary-active: #E5A850;     /* Estado pressed */

/* Neutros */
--background:  #09090B;        /* Fundo geral (zinc-950) */
--subtle:      #18181B;        /* Separadores sutis */
--border:      #3F3F46;        /* Bordas (zinc-700) */
--border-focus: #FDBF68;       /* Bordas em foco */
--body:        #A1A1AA;        /* Texto secundário (zinc-400) */
--heading:     #FAFAFA;        /* Texto principal (zinc-50) */
--muted:       #71717A;        /* Texto desabilitado (zinc-500) */
```

### Cores Semânticas

| Cor | Light | Dark | Hex | Uso |
|-----|-------|------|-----|-----|
| **Success** | `emerald-500` | `emerald-400` | `#10B981` / `#34D399` | Confirmações, progresso, streaks |
| **Warning** | `amber-500` | `amber-400` | `#F59E0B` / `#FBBF24` | Alertas, prazos próximos |
| **Destructive** | `rose-500` | `rose-400` | `#F43F5E` / `#FB7185` | Erros, ações destrutivas |
| **Info** | `sky-500` | `sky-400` | `#0EA5E9` / `#38BDF8` | Informações, dicas, insights |
| **Connection** | `violet-500` | `violet-400` | `#8B5CF6` / `#A78BFA` | Links entre módulos |

## 3.3 Tipografia

**Fonte Principal:** Inter

Escolhida por sua legibilidade excepcional e otimização para densidade de dados.

| Elemento | Tamanho | Peso | Line Height |
|----------|---------|------|-------------|
| **Display** | 48px / 3rem | 700 (Bold) | 1.1 |
| **H1 / Page Title** | 30px / 1.875rem | 600 (Semi) | 1.2 |
| **H2 / Section** | 24px / 1.5rem | 600 (Semi) | 1.3 |
| **Body / Default** | 16px / 1rem | 400 (Regular) | 1.5 |
| **Label / Mono** | 14px / 0.875rem | 500 (Medium) | 1.4 |
| **Caption** | 12px / 0.75rem | 400 (Regular) | 1.4 |

**Fonte Mono:** JetBrains Mono (código, dados técnicos)

## 3.4 Componentes

### Button System

| Variante | Uso | Light Mode | Dark Mode |
|----------|-----|------------|-----------|
| **Primary** | CTAs principais | `bg-[#FDBF68] text-slate-900 hover:bg-[#E5A850]` | `bg-[#FDBF68] text-zinc-900 hover:bg-[#FDD59A]` |
| **Secondary** | Ações secundárias | `bg-slate-100 text-slate-900 hover:bg-slate-200` | `bg-zinc-800 text-zinc-100 hover:bg-zinc-700` |
| **Outline** | Ações terciárias | `border-[#FDBF68] text-[#CC9040] hover:bg-[#FFF9F0]` | `border-[#FDBF68] text-[#FDBF68] hover:bg-zinc-800` |
| **Ghost** | Ações sutis | `text-slate-600 hover:bg-slate-100` | `text-zinc-400 hover:bg-zinc-800` |
| **Destructive** | Ações perigosas | `bg-rose-500 text-white hover:bg-rose-600` | `bg-rose-500 text-white hover:bg-rose-400` |
| **Disabled** | Inativo | `bg-slate-100 text-slate-400 cursor-not-allowed` | `bg-zinc-800 text-zinc-600 cursor-not-allowed` |

### Estados de Botão

```css
/* Focus Ring — usando cor primária */
--ring-color: #FDBF68;
--ring-offset: 2px;
--ring-width: 2px;

/* Transições */
--transition: all 150ms ease-in-out;
```

### Card System

```
┌─────────────────────────────────────┐
│ • • •                    CARD_TITLE │  ← Window Chrome
├─────────────────────────────────────┤
│                                     │
│         Conteúdo do Card            │  ← Content Area
│                                     │
├─────────────────────────────────────┤
│ Footer / Actions                    │  ← Optional Footer
└─────────────────────────────────────┘
```

**Window Chrome Pattern:** Padrão de container que simula janela de aplicativo desktop.

### Form Controls

| Componente | Características |
|------------|-----------------|
| **Input** | Borda sutil, foco com ring amber, placeholder slate-400 |
| **Select** | Dropdown com animação suave, ícone chevron |
| **Toggle** | Switch com transição 200ms, estados on/off claros |
| **Checkbox** | Rounded corners, checkmark animado, accent amber |

## 3.5 Espaçamento & Layout

### Sistema de Espaçamento (4px base)

```
xs:   4px   (gap-1)
sm:   8px   (gap-2)
md:   16px  (gap-4)
lg:   24px  (gap-6)
xl:   32px  (gap-8)
2xl:  48px  (gap-12)
3xl:  64px  (gap-16)
```

### Border Radius

```
sm:   4px   (rounded-sm)
md:   6px   (rounded-md)
lg:   8px   (rounded-lg)
xl:   12px  (rounded-xl)
2xl:  16px  (rounded-2xl)
```

### Breakpoints

```
sm:   640px   (Mobile landscape)
md:   768px   (Tablet)
lg:   1024px  (Desktop)
xl:   1280px  (Large desktop)
2xl:  1536px  (Ultra-wide)
```

## 3.6 Animações & Micro-interações

| Animação | Duração | Easing | Uso |
|----------|---------|--------|-----|
| **fade-in** | 200ms | ease-out | Elementos aparecendo |
| **slide-up** | 300ms | ease-out | Modais, cards |
| **scale** | 150ms | ease-in-out | Botões hover |
| **accordion** | 200ms | ease-out | Expansão/colapso |

---

# 4. CONNECTION LAYER — O Coração do Sistema

> **"O valor não está nas features — está na CONEXÃO entre elas."**
> — Elon Musk Clone Analysis

A Connection Layer é o **diferencial competitivo absoluto** do ExímIA OS. Sem ela, somos apenas 5 apps isolados competindo com ferramentas melhores. COM ela, somos o único sistema que realmente conecta a vida do empreendedor.

**Esta seção representa 60% do PRD porque a Connection Layer É o produto.**

---

## 4.1 Filosofia: Sistema Nervoso Central

### O Problema que Resolvemos

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ANTES: ILHAS ISOLADAS                                                │
│                                                                        │
│   [Journey]     [Academy]     [Brand]     [Strategy]     [Prototyp]   │
│      ↓             ↓            ↓            ↓              ↓         │
│   (dados)       (dados)      (dados)      (dados)        (dados)      │
│                                                                        │
│   Nenhuma comunicação. Usuário é o "middleware humano".               │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   DEPOIS: SISTEMA NERVOSO CENTRAL                                      │
│                                                                        │
│                      ┌─────────────────┐                              │
│                      │ CONNECTION LAYER │                              │
│                      │   (Event Bus)    │                              │
│                      └────────┬────────┘                              │
│            ┌──────────┬───────┼───────┬──────────┐                    │
│            ↓          ↓       ↓       ↓          ↓                    │
│       [Journey]  [Academy] [Brand] [Strategy] [Prototyp]              │
│            ↑          ↑       ↑       ↑          ↑                    │
│            └──────────┴───────┴───────┴──────────┘                    │
│                    (comunicação bidirecional)                          │
│                                                                        │
│   Tudo conectado. Sistema antecipa. Usuário decide.                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

| Princípio | Descrição | Exemplo |
|-----------|-----------|---------|
| **Event-Driven** | Toda ação gera evento. Eventos propagam. | `goal.created` → sugere cursos em Academy |
| **Bidirectional Links** | Conexões são de ida E volta | Goal ↔ Initiative (ambos sabem do outro) |
| **Proactive Intelligence** | Sistema age sem ser pedido | "Sua meta está atrasada. Quer ajustar?" |
| **Context Preservation** | Contexto viaja entre módulos | Brand voice disponível ao escrever PRD |
| **User in Control** | Sistema sugere, usuário decide | Toda automação pode ser desligada |

---

## 4.2 Event Bus — Sistema de Eventos

O Event Bus é a **espinha dorsal** da Connection Layer. Todo evento significativo é publicado e pode ser consumido por qualquer módulo.

### Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                           EVENT BUS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRODUCERS                    EVENT STORE                 CONSUMERS │
│  ─────────                    ───────────                 ───────── │
│                                                                     │
│  [Journey] ──publish──→  ┌─────────────┐  ──subscribe──→ [Academy]  │
│  [Academy] ──publish──→  │   Events    │  ──subscribe──→ [Strategy] │
│  [Strategy]──publish──→  │   Queue     │  ──subscribe──→ [Journey]  │
│  [Brand]   ──publish──→  │  (Redis/    │  ──subscribe──→ [Notif]    │
│  [Prototyp]──publish──→  │   Postgres) │  ──subscribe──→ [Suggest]  │
│                          └─────────────┘                            │
│                                 │                                   │
│                          [Event Log]                                │
│                        (Histórico)                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Modelo: Event

```typescript
interface SystemEvent {
  id: string;

  // Identificação
  type: string;              // "goal.created", "habit.completed", etc.
  source_module: ModuleType; // "journey" | "academy" | "strategy" | "brand" | "prototyper"

  // Payload
  entity_type: EntityType;
  entity_id: string;
  data: Record<string, any>; // Dados específicos do evento

  // Contexto
  user_id: string;
  workspace_id?: string;
  correlation_id?: string;   // Para rastrear cadeia de eventos

  // Timing
  timestamp: Date;
  processed_at?: Date;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

type ModuleType = 'journey' | 'academy' | 'strategy' | 'brand' | 'prototyper' | 'inbox' | 'system';

type EntityType =
  | 'goal' | 'habit' | 'book' | 'event'           // Journey
  | 'course' | 'lesson' | 'session'               // Academy
  | 'initiative' | 'cycle' | 'kpi'                // Strategy
  | 'brand_identity' | 'asset' | 'palette'        // Brand
  | 'project' | 'prd' | 'design_system';          // PrototypOS
```

### Catálogo Completo de Eventos

#### Journey Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `goal.created` | Usuário cria meta | `{goal, category, scope}` | Academy (sugerir cursos), Strategy (linkar initiative) |
| `goal.completed` | Meta marcada concluída | `{goal, completion_date}` | Notifications (celebrar), Strategy (atualizar initiative) |
| `goal.progress_updated` | Progresso alterado | `{goal, old_progress, new_progress}` | Strategy (sync KPI) |
| `goal.deadline_approaching` | Faltam ≤7 dias | `{goal, days_remaining}` | Notifications (alertar) |
| `goal.overdue` | Passou do deadline | `{goal, days_overdue}` | Notifications (alertar), Suggestions (ajustar) |
| `habit.completed` | Hábito marcado hoje | `{habit, streak, date}` | Notifications (se milestone) |
| `habit.streak_broken` | Streak zerado | `{habit, old_streak}` | Notifications (encorajar) |
| `habit.streak_milestone` | 7, 30, 100 dias | `{habit, milestone}` | Notifications (celebrar) |
| `book.started` | Começou a ler | `{book, author}` | Academy (sugerir curso relacionado) |
| `book.completed` | Terminou livro | `{book, notes_count}` | Suggestions (criar goal de aplicação) |
| `book.quote_saved` | Salvou citação | `{book, quote}` | Brand (disponibilizar para copy) |

#### Academy Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `course.enrolled` | Usuário se matriculou | `{course, reason}` | Journey (linkar goal se existir) |
| `course.completed` | Finalizou curso | `{course, score, certificate}` | Notifications (celebrar), Journey (sugerir goal) |
| `lesson.completed` | Finalizou lição | `{lesson, course, progress}` | — |
| `socratic.session_completed` | Terminou diálogo | `{session, score, insights}` | Journey (atualizar goal se linkado) |
| `skill.unlocked` | Completou skill path | `{skill, level}` | Brand (atualizar expertise), Strategy (sugerir initiative) |

#### Strategy Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `initiative.created` | Nova iniciativa | `{initiative, cycle, priority}` | **Journey (criar goal automaticamente)** |
| `initiative.status_changed` | Status alterado | `{initiative, old_status, new_status}` | Journey (atualizar goal linkado) |
| `initiative.completed` | Iniciativa concluída | `{initiative, outcomes}` | Notifications (celebrar), Journey (completar goal) |
| `cycle.started` | Ciclo iniciou | `{cycle, objectives}` | Notifications (informar) |
| `cycle.ending_soon` | Faltam ≤14 dias | `{cycle, days_remaining}` | Notifications (review reminder) |
| `kpi.threshold_crossed` | KPI passou limite | `{kpi, threshold, direction}` | Notifications (alertar) |

#### Brand Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `brand.voice_updated` | Tom de voz alterado | `{voice_tone, guidelines}` | PrototypOS (atualizar contexto PRD) |
| `brand.colors_updated` | Paleta alterada | `{colors}` | PrototypOS (atualizar design system) |
| `brand.asset_added` | Novo asset | `{asset, type}` | — |

#### PrototypOS Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `project.created` | Novo projeto | `{project}` | Strategy (sugerir criar initiative) |
| `prd.generated` | PRD gerado | `{prd, project}` | — |
| `design_system.exported` | DS exportado | `{design_system, format}` | Brand (sync se relevante) |

### API de Eventos

```typescript
// Publicar evento
POST /api/events
{
  "type": "goal.created",
  "entity_type": "goal",
  "entity_id": "goal_123",
  "data": {
    "title": "Lançar MVP",
    "category": "business",
    "scope": "quarterly"
  }
}

// Stream de eventos (SSE)
GET /api/events/stream?modules=journey,academy

// Histórico de eventos
GET /api/events?entity_id=goal_123
GET /api/events?type=goal.*&since=2026-01-01

// Replay de evento (para debug)
POST /api/events/:id/replay
```

---

## 4.3 Entity Links — Conexões Bidirecionais

Entity Links são **conexões persistentes** entre entidades de diferentes módulos. Diferente de eventos (que são momentâneos), links permanecem e podem ser navegados.

### Tipos de Links

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `cascaded` | Criado automaticamente por regra | Initiative → Goal (automático) |
| `suggested` | Sistema sugeriu, usuário aceitou | Book → Course (sugestão aceita) |
| `manual` | Usuário criou explicitamente | Goal → Habit (usuário linkou) |
| `derived` | Inferido por IA | Goal ↔ Goal (mesma categoria) |

### Modelo: EntityLink

```typescript
interface EntityLink {
  id: string;

  // Source (origem)
  source_module: ModuleType;
  source_type: EntityType;
  source_id: string;

  // Target (destino)
  target_module: ModuleType;
  target_type: EntityType;
  target_id: string;

  // Metadata
  link_type: 'cascaded' | 'suggested' | 'manual' | 'derived';
  relationship: string;        // "parent_of", "supports", "related_to", etc.
  strength: number;            // 0-1, relevância do link
  bidirectional: boolean;      // Se true, target também "vê" source

  // Contexto
  created_by: 'system' | 'user' | 'ai';
  created_reason?: string;     // "Created from initiative cascade"

  // Timestamps
  created_at: Date;
  last_accessed_at?: Date;     // Para ranking de relevância
}
```

### Matriz de Links Possíveis

```
                   │ Goal │ Habit │ Book │ Course │ Initiative │ Brand │ Project │
───────────────────┼──────┼───────┼──────┼────────┼────────────┼───────┼─────────┤
Goal               │  ─   │  ✓    │  ✓   │   ✓    │     ✓      │       │         │
Habit              │  ✓   │  ─    │      │   ✓    │            │       │         │
Book               │  ✓   │       │  ─   │   ✓    │            │   ✓   │         │
Course             │  ✓   │  ✓    │  ✓   │   ─    │     ✓      │       │         │
Initiative         │  ✓   │       │      │   ✓    │     ─      │       │    ✓    │
Brand              │      │       │  ✓   │        │            │   ─   │    ✓    │
Project            │      │       │      │        │     ✓      │   ✓   │    ─    │
```

### Link Graph Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ENTITY LINK GRAPH                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Initiative: Lançar MVP]                                           │
│         │                                                           │
│         │ cascaded (strength: 1.0)                                  │
│         ↓                                                           │
│  [Goal: Desenvolver plataforma]──manual──→[Habit: Codar 2h/dia]    │
│         │                                                           │
│         │ suggested (strength: 0.85)                                │
│         ↓                                                           │
│  [Course: React Avançado]──related──→[Book: Clean Code]            │
│         │                                                           │
│         │ derived (strength: 0.7)                                   │
│         ↓                                                           │
│  [Project: ExímIA OS]──uses──→[Brand: ExímIA Identity]             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### API de Links

```typescript
// Criar link manual
POST /api/links
{
  "source_type": "goal",
  "source_id": "goal_123",
  "target_type": "habit",
  "target_id": "habit_456",
  "relationship": "supports"
}

// Buscar links de uma entidade
GET /api/links?entity_type=goal&entity_id=goal_123
// Retorna todos os links onde goal_123 é source OU target

// Buscar links por tipo
GET /api/links?link_type=cascaded&source_module=strategy

// Grafo de links (para visualização)
GET /api/links/graph?root_type=initiative&root_id=init_123&depth=3

// Deletar link
DELETE /api/links/:id
```

### Link Navegation UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  Goal: Lançar MVP do ExímIA OS                                      │
│  ────────────────────────────────────────────────                   │
│                                                                     │
│  📊 Progress: 45%                                                   │
│  📅 Deadline: 30 Mar 2026                                           │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│  🔗 CONNECTIONS (4)                                                 │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  ⬆️ DERIVES FROM                                                    │
│  ├─ 🎯 Initiative: Q1 - Lançar Plataforma [Strategy]               │
│                                                                     │
│  ➡️ SUPPORTS                                                        │
│  ├─ ✓ Habit: Codar 2h por dia (streak: 23) [Journey]               │
│  └─ ✓ Habit: Review PRs toda manhã [Journey]                        │
│                                                                     │
│  📚 LEARNING                                                        │
│  └─ 📖 Course: React Avançado (60% complete) [Academy]              │
│                                                                     │
│  [+ Add Connection]                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.4 Suggestion Engine — IA Proativa

O Suggestion Engine é o cérebro da Connection Layer. Ele analisa contexto, eventos e links para gerar sugestões relevantes.

### Como Funciona

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SUGGESTION ENGINE FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Event Bus] ──→ [Trigger Detection] ──→ [Context Gathering]       │
│                          │                       │                  │
│                          ↓                       ↓                  │
│                   [Rule Matching] ←──── [User Preferences]          │
│                          │                                          │
│                          ↓                                          │
│                 [Suggestion Generation]                             │
│                          │                                          │
│                    ┌─────┴─────┐                                    │
│                    ↓           ↓                                    │
│            [Immediate]    [Queued]                                  │
│            (in-app)       (notification)                            │
│                    ↓           ↓                                    │
│                    └─────┬─────┘                                    │
│                          ↓                                          │
│                   [User Decision]                                   │
│                   ↙     ↓     ↘                                     │
│            [Accept] [Dismiss] [Snooze]                              │
│                 ↓       ↓         ↓                                 │
│           [Execute] [Learn]  [Reschedule]                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Modelo: Suggestion

```typescript
interface Suggestion {
  id: string;
  user_id: string;

  // Trigger
  trigger_event_id: string;
  trigger_event_type: string;
  trigger_entity: {
    type: EntityType;
    id: string;
    title: string;
  };

  // Sugestão
  suggestion_type: SuggestionType;
  action: SuggestionAction;
  title: string;
  description: string;
  reasoning: string;           // "Porque você criou a meta X..."
  confidence: number;          // 0-1

  // Pré-preenchimento
  prefilled_data?: Record<string, any>;

  // Destino
  target_module: ModuleType;
  target_route?: string;        // Deep link para executar

  // UI
  priority: 'low' | 'medium' | 'high';
  display_type: 'toast' | 'card' | 'modal' | 'notification';

  // Status
  status: 'pending' | 'shown' | 'accepted' | 'dismissed' | 'snoozed' | 'expired';

  // Timing
  created_at: Date;
  shown_at?: Date;
  decided_at?: Date;
  expires_at: Date;
  snooze_until?: Date;
}

type SuggestionType =
  | 'create_entity'      // Criar nova entidade
  | 'link_entities'      // Conectar entidades
  | 'complete_entity'    // Marcar como concluído
  | 'update_entity'      // Atualizar algo
  | 'enroll_course'      // Matricular em curso
  | 'start_habit'        // Iniciar hábito
  | 'review_progress'    // Revisar progresso
  | 'adjust_deadline';   // Ajustar prazo

interface SuggestionAction {
  type: string;          // "create_goal", "enroll_course", etc.
  module: ModuleType;
  params: Record<string, any>;
}
```

### Regras de Sugestão

```yaml
# suggestions_rules.yaml

rules:
  # Quando cria Goal de educação → sugerir cursos
  - name: goal_to_courses
    trigger:
      event: goal.created
      conditions:
        - goal.category in ['education', 'professional', 'skill']
    action:
      type: suggest_courses
      params:
        search_query: "{{goal.title}}"
        limit: 3
    suggestion:
      type: enroll_course
      title: "Cursos para {{goal.title}}"
      description: "Encontramos cursos que podem ajudar você a alcançar esta meta"
      confidence: 0.8
      priority: medium
      display_type: card
      expires_in: 7d

  # Quando Initiative é criada → criar Goal automaticamente
  - name: initiative_to_goal
    trigger:
      event: initiative.created
      conditions:
        - initiative.status == 'active'
    action:
      type: create_goal
      auto_execute: true  # Executa sem perguntar
      params:
        title: "{{initiative.title}}"
        scope: quarterly
        category: business
        linked_initiative: "{{initiative.id}}"
    notification:
      type: info
      title: "Meta criada automaticamente"
      body: "A meta '{{initiative.title}}' foi criada a partir da iniciativa"

  # Quando livro é concluído → sugerir criar goal de aplicação
  - name: book_to_application_goal
    trigger:
      event: book.completed
    action:
      type: create_goal
      auto_execute: false
    suggestion:
      type: create_entity
      title: "Aplicar aprendizados de '{{book.title}}'"
      description: "Você terminou o livro! Que tal criar uma meta para aplicar o que aprendeu?"
      confidence: 0.75
      priority: low
      prefilled_data:
        title: "Aplicar conceitos de {{book.title}}"
        category: education
        linked_books: ["{{book.id}}"]

  # Quando streak quebra → encorajar retomada
  - name: streak_broken_encouragement
    trigger:
      event: habit.streak_broken
      conditions:
        - habit.old_streak >= 7  # Só se tinha streak significativo
    action:
      type: encourage
    notification:
      type: celebration  # Tom positivo, não punitivo
      title: "Recomeçar é uma vitória"
      body: "Você teve um streak de {{habit.old_streak}} dias em '{{habit.name}}'. Que tal começar de novo hoje?"

  # Quando Goal está atrasado → sugerir ajuste
  - name: goal_overdue_adjustment
    trigger:
      event: goal.overdue
      conditions:
        - goal.days_overdue >= 7
    action:
      type: adjust_deadline
    suggestion:
      type: update_entity
      title: "Revisar prazo de '{{goal.title}}'?"
      description: "Esta meta está {{goal.days_overdue}} dias atrasada. Quer ajustar o prazo ou quebrar em tarefas menores?"
      confidence: 0.9
      priority: high
      display_type: modal
```

### Suggestion UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  💡 SUGGESTION                                               [×]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📚 Cursos para "Melhorar comunicação"                             │
│  ─────────────────────────────────────────                          │
│                                                                     │
│  Encontramos cursos que podem ajudar você a alcançar esta meta.    │
│                                                                     │
│  Sugestões:                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🎓 Comunicação Assertiva para Líderes          [Matricular] │   │
│  │    4h · Academy · 4.8★                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🎓 Apresentações Executivas                    [Matricular] │   │
│  │    6h · Academy · 4.6★                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ℹ️ Baseado na meta "Melhorar comunicação" criada há 2min         │
│                                                                     │
│  [Ignorar]                                    [Ver todos os cursos] │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.5 Cascading Rules — Automações

Cascading Rules são automações que executam **automaticamente** quando certas condições são atendidas. Diferente de Suggestions, não pedem permissão.

### Regras de Cascateamento Ativas

| Trigger | Condição | Ação Automática | Pode Desativar? |
|---------|----------|-----------------|-----------------|
| `initiative.created` | status == 'active' | Criar Goal em Journey | ✅ Sim |
| `initiative.completed` | — | Completar Goal linkado | ✅ Sim |
| `initiative.status_changed` | new_status == 'critical' | Alertar via Notification | ✅ Sim |
| `goal.completed` | has_linked_initiative | Atualizar Initiative progress | ❌ Não |
| `habit.streak_milestone` | milestone in [7, 30, 100] | Criar celebração | ✅ Sim |
| `course.completed` | has_linked_goal | Atualizar Goal progress | ❌ Não |
| `brand.voice_updated` | — | Invalidar cache em PrototypOS | ❌ Não |

### Modelo: CascadeRule

```typescript
interface CascadeRule {
  id: string;
  name: string;
  description: string;

  // Trigger
  trigger_event: string;
  conditions: RuleCondition[];

  // Action
  actions: CascadeAction[];

  // Config
  enabled: boolean;
  user_can_disable: boolean;

  // Stats
  executions_count: number;
  last_executed_at?: Date;
}

interface CascadeAction {
  type: 'create' | 'update' | 'delete' | 'notify' | 'link';
  target_module: ModuleType;
  target_type?: EntityType;
  params: Record<string, any>;

  // Templating
  template?: string;  // Handlebars-style: "{{initiative.title}}"
}
```

### Configuração de Cascades (User Settings)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ AUTOMAÇÕES                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STRATEGY → JOURNEY                                                 │
│  ─────────────────────────                                          │
│  [✓] Criar meta automaticamente quando iniciativa é ativada        │
│  [✓] Completar meta quando iniciativa é concluída                  │
│  [✓] Alertar quando iniciativa vira "crítica"                      │
│                                                                     │
│  JOURNEY → ACADEMY                                                  │
│  ─────────────────────────                                          │
│  [✓] Sugerir cursos quando criar meta de educação                  │
│  [ ] Matricular automaticamente (desativado por padrão)            │
│                                                                     │
│  HABIT MILESTONES                                                   │
│  ─────────────────────────                                          │
│  [✓] Celebrar streaks de 7, 30 e 100 dias                          │
│  [✓] Enviar notificação quando streak quebrar                      │
│                                                                     │
│  BRAND → PROTOTYPOS                                                 │
│  ─────────────────────────                                          │
│  [✓] Usar voz da marca em PRDs gerados (não desativável)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.6 Cross-Module Workflows

Workflows são **sequências de ações** que atravessam múltiplos módulos. São a expressão máxima da Connection Layer.

### Workflow: Lançamento de Produto

```
┌─────────────────────────────────────────────────────────────────────┐
│                   WORKFLOW: PRODUCT LAUNCH                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. STRATEGY                                                        │
│     └─ Criar Cycle "Q1 2026"                                        │
│        └─ Criar Initiative "Lançar MVP"                             │
│                          │                                          │
│                    [CASCATA]                                        │
│                          ↓                                          │
│  2. JOURNEY                                                         │
│     └─ Goal criado automaticamente                                  │
│        ├─ User adiciona Habits de suporte                           │
│        └─ User linka livros relevantes                              │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  3. ACADEMY                                                         │
│     └─ Cursos sugeridos baseado em Goal                             │
│        └─ User se matricula                                         │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  4. PROTOTYPOS                                                      │
│     └─ Criar projeto vinculado                                      │
│        └─ PRD gerado com Brand voice                                │
│                          │                                          │
│                    [CASCATA]                                        │
│                          ↓                                          │
│  5. BRAND                                                           │
│     └─ Brand guidelines aplicadas                                   │
│        └─ Assets organizados por projeto                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  RESULTADO: Todos os módulos trabalhando juntos                     │
│  USER EFFORT: Criou 1 initiative, sistema fez o resto               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Workflow: Desenvolvimento de Competência

```
┌─────────────────────────────────────────────────────────────────────┐
│                   WORKFLOW: SKILL DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. JOURNEY                                                         │
│     └─ User cria Goal "Aprender React"                              │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  2. ACADEMY                                                         │
│     └─ 3 cursos sugeridos                                           │
│        └─ User escolhe e se matricula                               │
│           └─ Link: Course ↔ Goal (auto)                             │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  3. JOURNEY (Books)                                                 │
│     └─ Livros sugeridos sobre React                                 │
│        └─ Link: Book ↔ Goal (auto)                                  │
│                          │                                          │
│                   [PROGRESSO]                                       │
│                          ↓                                          │
│  4. JOURNEY (Habits)                                                │
│     └─ Habit sugerido "Estudar React 30min/dia"                     │
│        └─ Link: Habit ↔ Goal (manual)                               │
│                          │                                          │
│               [CONCLUSÃO DO CURSO]                                  │
│                          ↓                                          │
│  5. JOURNEY                                                         │
│     └─ Goal progress atualizado automaticamente                     │
│        └─ Sugestão: criar Goal de aplicação prática                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.7 Inbox — Entrada Universal

O Inbox é o **ponto de entrada único** do sistema. Tudo começa aqui antes de ser organizado.

### Filosofia

> "Capture primeiro, organize depois."

O empreendedor não pode parar para decidir onde cada ideia vai. O Inbox recebe TUDO e depois o sistema (ou IA) ajuda a triar.

### Modelo: InboxItem

```typescript
interface InboxItem {
  id: string;
  user_id: string;

  // Conteúdo
  content: string;
  content_type: 'text' | 'voice' | 'image' | 'link' | 'file';
  attachments?: Attachment[];

  // Origem
  source: 'quick_capture' | 'voice' | 'email' | 'api' | 'share' | 'screenshot';
  source_metadata?: Record<string, any>;

  // Triagem IA
  ai_analysis?: {
    suggested_module: ModuleType;
    suggested_entity_type: EntityType;
    confidence: number;
    reasoning: string;
    extracted_entities?: {
      title?: string;
      date?: Date;
      category?: string;
      tags?: string[];
    };
  };

  // Status
  status: 'inbox' | 'processing' | 'triaged' | 'converted' | 'archived';

  // Resultado
  converted_to?: {
    module: ModuleType;
    entity_type: EntityType;
    entity_id: string;
  };

  // Timestamps
  created_at: Date;
  processed_at?: Date;
}
```

### Fluxo de Triagem

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INBOX TRIAGE FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CAPTURA                                                            │
│  ────────                                                           │
│  [Cmd+Shift+I] → Quick text capture                                 │
│  [Voice]       → Gravação + transcrição                             │
│  [Share]       → De outros apps                                     │
│  [Email]       → Forward para inbox@eximia.app                      │
│                                                                     │
│         ↓                                                           │
│  ┌─────────────┐                                                    │
│  │   INBOX     │                                                    │
│  │  (pending)  │                                                    │
│  └──────┬──────┘                                                    │
│         ↓                                                           │
│  ┌─────────────┐     ┌──────────────────┐                          │
│  │ IA ANALYSIS │ ──→ │ Sugestão         │                          │
│  │ (auto)      │     │ "Parece um Goal" │                          │
│  └──────┬──────┘     │ [85% confiança]  │                          │
│         ↓            └──────────────────┘                           │
│  ┌─────────────────────────────────────┐                           │
│  │         USER DECISION               │                           │
│  │                                     │                           │
│  │  [✓ Aceitar] [✏️ Editar] [📁 Manual]│                           │
│  │                                     │                           │
│  └──────┬──────────────┬───────────────┘                           │
│         ↓              ↓                                            │
│  ┌─────────────┐ ┌─────────────┐                                   │
│  │ AUTO CREATE │ │ MANUAL PICK │                                   │
│  │ (Journey)   │ │ (modal)     │                                   │
│  └──────┬──────┘ └──────┬──────┘                                   │
│         ↓              ↓                                            │
│  ┌─────────────────────────────────────┐                           │
│  │      ENTITY CREATED + LINKED        │                           │
│  │  + Link: InboxItem → Created Entity │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Inbox UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  📥 INBOX                                           [+ Quick Add]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📋 3 items para processar                                          │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🎤 "Preciso lembrar de fazer call com investidor sexta"     │   │
│  │    há 2 min · voice capture                                  │   │
│  │                                                               │   │
│  │    💡 Sugestão: Criar Evento no Calendar                     │   │
│  │       📅 Sexta-feira, 10:00 · "Call com investidor"         │   │
│  │       [85% confiança]                                        │   │
│  │                                                               │   │
│  │    [✓ Criar evento]  [✏️ Editar]  [Converter em...]         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📝 "Ideia: integrar com Notion para sync de docs"           │   │
│  │    há 15 min · quick capture                                 │   │
│  │                                                               │   │
│  │    💡 Sugestão: Criar Goal em Journey                        │   │
│  │       🎯 "Integrar com Notion" · Categoria: Tech             │   │
│  │       [72% confiança]                                        │   │
│  │                                                               │   │
│  │    [✓ Criar goal]  [✏️ Editar]  [Converter em...]           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔗 https://article-about-leadership.com                      │   │
│  │    há 1 hora · share                                         │   │
│  │                                                               │   │
│  │    💡 Sugestão: Salvar para leitura                          │   │
│  │       📚 Adicionar à Library · "Leadership article"          │   │
│  │       [60% confiança]                                        │   │
│  │                                                               │   │
│  │    [✓ Salvar]  [📁 Arquivar]  [🗑️ Descartar]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.8 Notifications — Saída Proativa

O sistema de Notifications é a **saída proativa** da Connection Layer. É como o sistema "fala" com o usuário sem ser perguntado.

### Tipos de Notificação

| Tipo | Ícone | Quando | Tom |
|------|-------|--------|-----|
| **Reminder** | ⏰ | Tempo-baseado | Gentil |
| **Alert** | ⚠️ | Condição de negócio | Urgente |
| **Suggestion** | 💡 | IA detectou oportunidade | Curioso |
| **Celebration** | 🎉 | Conquista | Festivo |
| **Digest** | 📊 | Agendado | Informativo |
| **System** | ℹ️ | Status técnico | Neutro |

### Modelo: Notification

```typescript
interface Notification {
  id: string;
  user_id: string;

  // Conteúdo
  type: 'reminder' | 'alert' | 'suggestion' | 'celebration' | 'digest' | 'system';
  title: string;
  body: string;
  icon?: string;

  // Ação
  action_url?: string;
  action_label?: string;
  actions?: NotificationAction[];  // Múltiplas ações

  // Contexto
  source_module?: ModuleType;
  related_entity?: {
    type: EntityType;
    id: string;
    title: string;
  };

  // Delivery
  channels: ('in_app' | 'push' | 'email')[];
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Status
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'actioned' | 'dismissed';

  // Timing
  scheduled_for?: Date;
  sent_at?: Date;
  read_at?: Date;
  actioned_at?: Date;
}

interface NotificationAction {
  label: string;
  action: string;  // "complete_habit", "open_goal", etc.
  params?: Record<string, any>;
  style?: 'primary' | 'secondary' | 'destructive';
}
```

### Regras de Proatividade

```yaml
# notification_rules.yaml

schedules:
  # Daily habit reminder
  - name: daily_habit_reminder
    cron: "0 20 * * *"  # 20:00 todos os dias
    query:
      habits:
        status: active
        today_completed: false
    action:
      type: reminder
      channel: [push, in_app]
      title: "Hábitos do dia"
      body: "Você tem {{count}} hábitos para completar hoje"
      actions:
        - label: "Ver hábitos"
          action: "open"
          params: { route: "/journey/habits" }
        - label: "Completar todos"
          action: "complete_all_habits"

  # Weekly digest
  - name: weekly_digest
    cron: "0 18 * * 0"  # Domingo 18:00
    action:
      type: digest
      channel: [email]
      template: weekly_summary
      include:
        - habits_summary
        - goals_progress
        - courses_completed
        - suggestions_accepted

conditions:
  # Goal deadline approaching
  - name: goal_deadline_alert
    trigger:
      schedule: "0 9 * * *"  # Check diário às 9h
    query:
      goals:
        status: in_progress
        deadline: { $lte: "+7d" }
    action:
      type: alert
      priority: high
      channel: [push, in_app]
      title: "{{goal.title}} vence em {{days_remaining}} dias"
      body: "Progresso atual: {{goal.progress}}%"

  # Streak milestone celebration
  - name: streak_celebration
    trigger:
      event: habit.completed
    condition: streak in [7, 30, 100, 365]
    action:
      type: celebration
      channel: [push, in_app]
      title: "🎉 {{streak}} dias de {{habit.name}}!"
      body: "Você é incrível! Continue assim."
```

### Notification Center UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔔 NOTIFICATIONS                                    [Mark all read]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TODAY                                                              │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  🎉 NEW                                                    2min ago │
│  ─────────────────────────────────────────────────────────────      │
│  30 dias de "Meditar"!                                              │
│  Você manteve seu streak por um mês inteiro.                        │
│  [Compartilhar] [Ver hábito]                                        │
│                                                                     │
│  ⚠️                                                       9:00 AM  │
│  ─────────────────────────────────────────────────────────────      │
│  "Lançar MVP" vence em 5 dias                                       │
│  Progresso atual: 67%. Quer revisar as tarefas?                     │
│  [Ver meta] [Ajustar prazo]                                         │
│                                                                     │
│  💡                                                       Yesterday │
│  ─────────────────────────────────────────────────────────────      │
│  Curso recomendado para "Melhorar apresentações"                    │
│  "Apresentações Executivas" - 4.8★ - 6 horas                        │
│  [Ver curso] [Ignorar]                                              │
│                                                                     │
│  EARLIER                                                            │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  📊                                                    Last Sunday  │
│  ─────────────────────────────────────────────────────────────      │
│  Seu resumo semanal está pronto                                     │
│  3 metas avançaram · 5 hábitos mantidos · 2 cursos completados      │
│  [Ver resumo completo]                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.9 Connection Layer — Métricas de Saúde

A Connection Layer tem suas próprias métricas para garantir que está funcionando.

### Dashboard de Conexão

```
┌─────────────────────────────────────────────────────────────────────┐
│              CONNECTION LAYER HEALTH DASHBOARD                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EVENTOS (últimas 24h)                                              │
│  ─────────────────────────                                          │
│  Published: 847          Processed: 842          Failed: 5          │
│  ████████████████████████████████████████████░░ 99.4%               │
│                                                                     │
│  LINKS ATIVOS                                                       │
│  ─────────────────────────                                          │
│  Total: 1,234            Cascaded: 456           Manual: 778        │
│  Avg links/entity: 3.2   Most connected: Goals (4.1 avg)            │
│                                                                     │
│  SUGESTÕES (últimos 7 dias)                                         │
│  ─────────────────────────                                          │
│  Generated: 89           Accepted: 31            Dismissed: 42      │
│  Acceptance Rate: 34.8%  ████████░░░░░░░░░░░░░░                     │
│                                                                     │
│  CASCADES (últimos 7 dias)                                          │
│  ─────────────────────────                                          │
│  Triggered: 23           Executed: 23            User reverted: 2   │
│  Success Rate: 91.3%     █████████████████████░                     │
│                                                                     │
│  TOP CROSS-MODULE PATHS                                             │
│  ─────────────────────────                                          │
│  1. Strategy → Journey → Academy      (34 interactions)             │
│  2. Journey → Academy                 (28 interactions)             │
│  3. Inbox → Journey                   (21 interactions)             │
│  4. Strategy → Journey → Habits       (18 interactions)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 5. Módulos da Plataforma

> **Nota:** Os módulos são os "organs" do sistema. A Connection Layer é o que os faz funcionar como um organismo.

## 5.1 Journey — Execução Pessoal

O módulo Journey é o núcleo de execução diária do empreendedor exímio.

### Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Visão consolidada: metas ativas, hábitos do dia, próximos eventos | `/journey` |
| **Goals** | Gestão hierárquica de metas (Life → Yearly → Quarterly → Monthly → Task) | `/journey/goals` |
| **Habits** | Tracking de hábitos com streaks, completions e analytics | `/journey/habits` |
| **Library** | Biblioteca pessoal de livros com notas, citações e progresso | `/journey/library` |
| **Authors** | Perfis de autores influentes com insights extraídos | `/journey/authors` |
| **Calendar** | Calendário integrado com Google Calendar | `/journey/calendar` |

### Modelo: Goal (Meta)

```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;

  // Classificação
  category: 'business' | 'personal' | 'health' | 'finance' | 'education';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scope: 'life' | 'yearly' | 'quarterly' | 'monthly' | 'weekly';

  // Hierarquia
  type: 'objective' | 'key_result' | 'task';
  parent_id?: string;

  // Status
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  progress: number; // 0-100

  // Datas
  start_date?: Date;
  deadline?: Date;

  // Conexões (Connection Layer)
  linked_habits: string[];
  linked_books: string[];
  linked_initiatives: string[]; // De Strategy
  kpis: KPI[];

  // Meta
  tags: string[];
  created_at: Date;
  updated_at: Date;
}
```

### Modelo: Habit (Hábito)

```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;

  // Configuração
  frequency: 'daily' | 'weekly' | 'monthly';
  target_days?: number[];
  color: string;
  icon?: string;

  // Tracking
  streak: number;
  best_streak: number;
  completion_rate: number;
  completions: HabitCompletion[];

  // Conexão
  linked_goal?: string;

  // Status
  status: 'active' | 'paused' | 'archived';
}
```

### Modelo: Book (Livro)

```typescript
interface Book {
  id: string;

  // Info básica
  title: string;
  author: string;
  cover_url?: string;
  isbn?: string;

  // Progresso
  total_pages: number;
  current_page: number;
  status: 'to_read' | 'reading' | 'completed' | 'abandoned';

  // Avaliação
  rating?: number;
  is_favorite: boolean;

  // Conteúdo
  notes: BookNote[];
  quotes: BookQuote[];
  summary?: string;

  // Conexão
  linked_goals: string[];

  // Datas
  started_at?: Date;
  finished_at?: Date;
}
```

---

## 5.2 Academy — IA Socrática

> **⭐ ESTRATÉGICO:** Academy é pilar de receita. Piloto para Harven.AI. Não negociável.

O módulo Academy é um **sistema de aprendizado profundo** que utiliza IA para criar experiências educacionais transformadoras.

### Filosofia: Método Socrático

> *"Uma boa pergunta vale mais que mil respostas."*

| Abordagem Tradicional | Abordagem ExímIA Academy |
|----------------------|-------------------------|
| Conhecimento transmitido | Conhecimento emerge |
| Erro deve ser evitado | Erro é essencial |
| IA dá respostas | IA faz perguntas |
| Avalia memorização | Avalia pensamento crítico |
| Progresso linear | Progresso adaptativo |

### Pipeline de 6 Agentes

```
[Conteúdo] → [Creator] → [Socrates] → [Analyst] → [Editor] → [Tester] → [Organizer]
               ↓            ↓            ↓           ↓          ↓           ↓
           Perguntas    Diálogo     Detecção    Polimento   Validação  Persistência
```

### Conexões com Connection Layer

| Evento | Ação |
|--------|------|
| `goal.created` (category: education) | Sugerir cursos relevantes |
| `course.completed` | Atualizar Goal linkado |
| `skill.unlocked` | Atualizar Brand expertise |

---

## 5.3 Brand — Gestão de Marca

Plataforma completa para construir, manter e evoluir a identidade de marca.

### Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Overview da saúde da marca | `/brand` |
| **Visual Identity** | Cores, tipografia, logos, elementos visuais | `/brand/visual` |
| **Voice & Messaging** | Tom de voz, mensagens-chave, copywriting guidelines | `/brand/voice` |
| **Asset Library** | Biblioteca organizada de arquivos da marca | `/brand/assets` |
| **Workflows** | Fluxos de aprovação para materiais | `/brand/workflow` |
| **Press Kit** | Material para imprensa e mídia | `/brand/press` |
| **Brand Check** | Verificador de consistência powered by IA | `/brand/check` |
| **Creative Sandbox** | Área de experimentação e ideação | `/brand/creative` |

### Modelo: BrandIdentity

```typescript
interface BrandIdentity {
  id: string;

  // Essência
  name: string;
  tagline?: string;
  mission?: string;
  vision?: string;
  values: string[];

  // Personalidade
  archetypes: string[];
  voice_tone: 'formal' | 'casual' | 'playful' | 'authoritative';
  personality_traits: string[];

  // Visual
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  logo_url?: string;

  // Relacionamentos
  palettes: ColorPalette[];
  assets: BrandAsset[];
  guidelines: BrandGuideline[];
}
```

---

## 5.4 Strategy (StratOS) — Planejamento Estratégico

Sistema de planejamento e execução estratégica que cascateia para todos os módulos.

### Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Organizations** | Gestão de múltiplas organizações/projetos | `/strategy/organizations` |
| **Cycle Hub** | Dashboard de ciclos estratégicos ativos | `/strategy` |
| **The Forge** | Ideação e refinamento de iniciativas | `/strategy/forge/:cycleId` |
| **War Room** | Coordenação de execução em tempo real | `/strategy/war-room/:cycleId` |
| **Execution Hub** | Tracking de progresso e KPIs | `/strategy/execution/:cycleId` |
| **Hoshin Kanri** | Planejamento estratégico visual | `/strategy/hoshin-kanri` |

### Modelo: StrategicCycle

```typescript
interface StrategicCycle {
  id: string;
  organization_id: string;

  // Info
  title: string;
  type: 'annual' | 'quarterly' | 'monthly';
  period: string;

  // Status
  status: 'draft' | 'active' | 'review' | 'archived';
  progress: number;
  health: 'on_track' | 'attention' | 'critical';

  // Conteúdo
  vision?: string;
  objectives: Initiative[];

  // Datas
  start_date: Date;
  end_date: Date;
}
```

### Modelo: Initiative

```typescript
interface Initiative {
  id: string;
  cycle_id: string;

  // Identificação
  code: string;
  title: string;
  description?: string;

  // Classificação
  type: 'strategic' | 'tactical' | 'operational';
  priority: 'must_have' | 'should_have' | 'nice_to_have';

  // Responsabilidade
  owner: string;
  team: string[];

  // Status
  status: 'not_planned' | 'planned' | 'in_progress' | 'on_track' | 'attention' | 'critical' | 'completed';
  progress: number;

  // Tempo
  start_date?: Date;
  end_date?: Date;

  // Métricas
  kpis: KPI[];

  // Cascateamento (Connection Layer)
  cascaded_goals: string[]; // Goals em Journey que derivam desta iniciativa

  // Hierarquia
  parent_id?: string;
}
```

---

# 6. PrototypOS

## 6.1 Visão

O PrototypOS é a ferramenta de **design e prototipagem de produtos** — onde ideias se transformam em especificações executáveis.

### Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Lista de projetos ativos | `/prototyper` |
| **PRD Generator** | Gerador de Product Requirements Document | `/prototyper/new` |
| **PRP Generator** | Gerador de Product Requirement Prompt | `/prototyper/project/:id/prp` |
| **Design Systems** | Biblioteca de design systems salvos | `/prototyper/design-systems` |
| **Project Board** | Kanban de desenvolvimento | `/prototyper/project/:id/board` |
| **Visual Builder** | Construtor de identidade visual | `/prototyper/project/:id/visuals` |
| **Agent Config** | Configuração de agentes IA | `/prototyper/settings` |

## 6.2 Design Systems Library

A seção **Design Systems** permite salvar, organizar e reutilizar design systems de cada projeto.

### Modelo: DesignSystem

```typescript
interface DesignSystem {
  id: string;
  project_id?: string;

  // Info
  name: string;
  description?: string;
  version: string;
  thumbnail_url?: string;

  // Cores
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  // Tipografia
  typography: {
    font_family_display: string;
    font_family_body: string;
    font_family_mono: string;
    scale: TypographyScale[];
  };

  // Espaçamento, Radius, Shadows
  spacing: { base: number; scale: number[]; };
  radius: Record<string, string>;
  shadows: Record<string, string>;

  // Componentes
  components: DesignSystemComponent[];

  // Meta
  created_at: Date;
  updated_at: Date;
}
```

### Exportação

| Formato | Descrição |
|---------|-----------|
| **JSON** | Estrutura completa para backup/import |
| **CSS Variables** | Custom properties prontas para uso |
| **Tailwind Config** | Configuração para tailwind.config.js |
| **Figma Tokens** | Compatível com Tokens Studio |
| **Style Dictionary** | Formato para build de tokens |

---

# 7. API & Endpoints

## 7.1 Autenticação

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
POST   /api/auth/logout
```

## 7.2 Journey

```
# Goals
GET/POST   /api/journey/goals
GET/PUT/DELETE /api/journey/goals/:id
PATCH  /api/journey/goals/:id/progress

# Habits
GET/POST   /api/journey/habits
PUT/DELETE /api/journey/habits/:id
POST   /api/journey/habits/:id/complete

# Books
GET/POST   /api/journey/books
GET/PUT/DELETE /api/journey/books/:id
POST   /api/journey/books/:id/notes
POST   /api/journey/books/:id/quotes

# Events
GET/POST   /api/journey/events
PUT/DELETE /api/journey/events/:id
```

## 7.3 Academy

```
GET    /api/academy/academies
GET    /api/academy/academies/:id/courses
GET    /api/academy/courses/:id
POST   /api/academy/courses/:id/enroll
POST   /api/academy/lessons/:id/complete
POST   /api/academy/socratic/start
POST   /api/academy/socratic/message
GET    /api/academy/badges
```

## 7.4 Brand

```
GET/PUT    /api/brand/identity
GET/POST   /api/brand/palettes
DELETE     /api/brand/palettes/:id
GET/POST   /api/brand/assets
DELETE     /api/brand/assets/:id
```

## 7.5 Strategy

```
GET/POST   /api/strategy/organizations
GET/POST   /api/strategy/cycles
PUT        /api/strategy/cycles/:id
GET/POST   /api/strategy/initiatives
PATCH      /api/strategy/initiatives/:id/status
```

## 7.6 PrototypOS

```
GET/POST   /api/prototyper/projects
PUT/DELETE /api/prototyper/projects/:id
GET/POST   /api/prototyper/design-systems
PUT/DELETE /api/prototyper/design-systems/:id
POST       /api/prototyper/design-systems/:id/export
```

---

# 8. Mobile & PWA

## 8.1 Estratégia: PWA-First

O ExímIA OS adota **Progressive Web App** como estratégia mobile — experiência nativa sem fricção de app stores.

### Por que PWA?

| Benefício | Impacto |
|-----------|---------|
| **Deploy único** | Mesma codebase para web e mobile |
| **Sem app store** | Atualizações instantâneas |
| **Offline-first** | Funciona sem conexão |
| **Push notifications** | Proatividade real |
| **Instalável** | Ícone na home screen |

## 8.2 Funcionalidades Offline

| Módulo | Funciona Offline? | Sync Strategy |
|--------|-------------------|---------------|
| **Inbox** | ✅ Captura local | Queue para sync |
| **Habits** | ✅ Completar hábitos | Sync on reconnect |
| **Goals** | ⚠️ Leitura apenas | Cache-first |
| **Academy** | ⚠️ Conteúdo baixado | Explicit download |
| **Strategy** | ❌ Online required | — |

## 8.3 Componentes Mobile-Specific

### Bottom Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      [Conteúdo Principal]                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🏠 Home  │  ✓ Habits  │  + Capture  │  📚 Learn  │  ⚙️ More   │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Actions (FAB)

- Capture de texto
- Capture de voz
- Completar hábito
- Iniciar foco

### Gestures

| Gesto | Ação |
|-------|------|
| **Swipe right** | Completar hábito |
| **Swipe left** | Adiar/Pular |
| **Long press** | Menu de contexto |
| **Pull down** | Refresh |

## 8.4 Push Notifications

```typescript
interface PushConfig {
  // Tipos habilitados
  habit_reminders: boolean;
  goal_alerts: boolean;
  suggestions: boolean;
  weekly_digest: boolean;

  // Timing
  reminder_time: string; // "20:00"
  quiet_hours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
  };
}
```

## 8.5 Requisitos Técnicos

```yaml
PWA Manifest:
  display: standalone
  orientation: portrait
  theme_color: "#FDBF68"  # ExímIA Gold
  background_color: "#18181b"  # Zinc-900

Service Worker:
  strategy: stale-while-revalidate
  offline_page: /offline
  cache_limit: 50MB

Capacidades:
  - Push Notifications
  - Background Sync
  - Share Target (receber shares de outros apps)
  - Shortcuts (ações rápidas do ícone)
```

---

# 9. UX/UI Architecture — Atomic Design Analysis

> *"Build systems, not pages. A design system is a library of solved problems."*
> — Brad Frost

Esta seção aplica a metodologia **Atomic Design** ao ExímIA OS, criando uma arquitetura de interface que é escalável, consistente e colaborativa.

---

## 9.1 Filosofia: Sistemas, Não Páginas

### Por Que Atomic Design?

| Problema Tradicional | Solução Atomic Design |
|---------------------|----------------------|
| Cada página é desenhada do zero | Componentes reutilizáveis |
| Inconsistência visual entre módulos | Vocabulário compartilhado |
| Designer e dev falam línguas diferentes | Pattern Library unificada |
| Difícil manter quando escala | Sistema modular e escalável |
| Testes fragmentados | Componentes testáveis isoladamente |

### Os 5 Níveis do Atomic Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ATOMIC DESIGN HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [PAGES]        → Instâncias reais com conteúdo                         │
│     ↑             /journey, /strategy/forge, /brand/visual              │
│                                                                         │
│  [TEMPLATES]    → Layouts estruturais sem conteúdo                      │
│     ↑             DashboardLayout, ModuleLayout, SettingsLayout         │
│                                                                         │
│  [ORGANISMS]    → Seções complexas da UI                                │
│     ↑             Sidebar, Header, GoalCard, HabitTracker               │
│                                                                         │
│  [MOLECULES]    → Grupos funcionais de átomos                           │
│     ↑             SearchInput, MetricCard, NavItem, FormField           │
│                                                                         │
│  [ATOMS]        → Elementos indivisíveis                                │
│                   Button, Input, Badge, Icon, Avatar, Typography        │
│                                                                         │
│  [TOKENS]       → Subatômicos: cores, espaçamentos, tipografia          │
│                   --eximia-400, --radius-md, --font-heading              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Design Tokens — As Partículas Subatômicas

> *"Tokens são a linguagem que conecta design e código."*

### Token Categories

| Categoria | Exemplos | Responsabilidade |
|-----------|----------|------------------|
| **Color** | `--eximia-400`, `--success-500` | Paleta de cores |
| **Typography** | `--font-size-lg`, `--line-height-relaxed` | Sistema tipográfico |
| **Spacing** | `--space-4`, `--space-8` | Grid e espaçamentos |
| **Radius** | `--radius-sm`, `--radius-full` | Bordas arredondadas |
| **Shadow** | `--shadow-sm`, `--shadow-lg` | Elevação |
| **Motion** | `--duration-fast`, `--ease-out` | Animações |
| **Breakpoint** | `--bp-sm`, `--bp-lg` | Responsividade |

### Token Architecture

```css
/* ==========================================================================
   EXIMIA OS — DESIGN TOKENS
   ========================================================================== */

/* CORES BASE (ExímIA Gold) */
:root {
  --eximia-50:  #FFF9F0;
  --eximia-100: #FEF0DC;
  --eximia-200: #FDE4C4;
  --eximia-300: #FDD59A;
  --eximia-400: #FDBF68;  /* ★ COR PRINCIPAL ★ */
  --eximia-500: #E5A850;
  --eximia-600: #CC9340;
  --eximia-700: #A67530;
  --eximia-800: #805A25;
  --eximia-900: #5C401A;
}

/* CORES SEMÂNTICAS */
:root {
  --success: #22c55e;
  --warning: #FDBF68;
  --error:   #ef4444;
  --info:    #3b82f6;
}

/* TIPOGRAFIA */
:root {
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-heading: 'Cal Sans', 'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
}

/* ESPAÇAMENTO (4px base) */
:root {
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}

/* BORDAS */
:root {
  --radius-sm:   0.25rem;  /* 4px */
  --radius-md:   0.5rem;   /* 8px */
  --radius-lg:   0.75rem;  /* 12px */
  --radius-xl:   1rem;     /* 16px */
  --radius-full: 9999px;
}

/* SOMBRAS */
:root {
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* ANIMAÇÃO */
:root {
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

## 9.3 Atoms — Elementos Indivisíveis

### Button Atoms

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BUTTON SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  VARIANTS                                                               │
│  ─────────────────────────────────────────────────────────────────────  │
│  [Primary]  → CTAs principais         bg-[#FDBF68] text-zinc-900        │
│  [Secondary]→ Ações secundárias       bg-zinc-700 text-white            │
│  [Ghost]    → Ações terciárias        bg-transparent hover:bg-zinc-800  │
│  [Danger]   → Ações destrutivas       bg-red-600 text-white             │
│  [Success]  → Confirmações            bg-green-600 text-white           │
│                                                                         │
│  SIZES                                                                  │
│  ─────────────────────────────────────────────────────────────────────  │
│  [sm] → height: 32px, padding: 8px 12px, font-size: 14px                │
│  [md] → height: 40px, padding: 10px 16px, font-size: 14px               │
│  [lg] → height: 48px, padding: 12px 24px, font-size: 16px               │
│                                                                         │
│  STATES                                                                 │
│  ─────────────────────────────────────────────────────────────────────  │
│  :default  → Estado base                                                │
│  :hover    → Cursor sobre (brightness + shadow)                         │
│  :focus    → Foco de teclado (ring outline)                             │
│  :active   → Clicado (scale 0.98)                                       │
│  :disabled → Desabilitado (opacity 0.5, cursor not-allowed)             │
│  :loading  → Carregando (spinner + pointer-events: none)                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Input Atoms

```typescript
interface InputAtom {
  variant: 'default' | 'filled' | 'outline';
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'focus' | 'error' | 'success' | 'disabled';

  // Features
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  clearable?: boolean;
}
```

### Badge Atoms

| Variant | Uso | Estilo |
|---------|-----|--------|
| **Default** | Informação neutra | `bg-zinc-700 text-zinc-200` |
| **Primary** | Destaque | `bg-[#FDBF68]/20 text-[#FDBF68]` |
| **Success** | Status positivo | `bg-green-500/20 text-green-400` |
| **Warning** | Atenção | `bg-yellow-500/20 text-yellow-400` |
| **Error** | Problema | `bg-red-500/20 text-red-400` |
| **Outline** | Sutil | `border border-zinc-600 text-zinc-400` |

### Icon System

```typescript
interface IconAtom {
  name: string;        // Nome do ícone (Lucide Icons)
  size: 16 | 20 | 24 | 32;
  color?: string;      // Herda por padrão
  strokeWidth?: 1.5 | 2 | 2.5;
}

// Ícones por Categoria
const iconCategories = {
  navigation: ['Home', 'ChevronRight', 'ArrowLeft', 'Menu', 'X'],
  actions:    ['Plus', 'Edit', 'Trash', 'Check', 'Copy', 'Share'],
  objects:    ['Goal', 'Book', 'Calendar', 'User', 'Folder', 'File'],
  status:     ['CheckCircle', 'XCircle', 'AlertTriangle', 'Info'],
  modules:    ['Compass', 'BookOpen', 'Palette', 'Target', 'Layers']
};
```

---

## 9.4 Molecules — Combinações Funcionais

### FormField Molecule

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FORM FIELD                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ Label ────────────────────────────────────────────────────────┐     │
│  │ Email *                                                   [?]  │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌─ Input ────────────────────────────────────────────────────────┐     │
│  │ ✉️  email@exemplo.com                                      ✓  │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌─ Helper/Error ─────────────────────────────────────────────────┐     │
│  │ ✓ Email válido                                                 │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

COMPOSIÇÃO:
FormField = Label + Input + HelperText
          = Atom   + Atom + Atom
```

### MetricCard Molecule

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          METRIC CARD                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────┐                    │
│  │  ↗ Tasks Completed                    [Weekly]  │  ← Header          │
│  │                                                 │                    │
│  │     147                                         │  ← Value           │
│  │     ████████████████░░░░ 73%                    │  ← Progress        │
│  │                                                 │                    │
│  │     +23 vs last week                     ▲ 18%  │  ← Comparison      │
│  └─────────────────────────────────────────────────┘                    │
│                                                                         │
│  COMPOSIÇÃO:                                                            │
│  MetricCard = Icon + Typography + ProgressBar + Badge                   │
│             = Atom + Atom       + Molecule    + Atom                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### NavItem Molecule

```typescript
interface NavItemMolecule {
  icon: IconAtom;
  label: string;
  href: string;
  badge?: BadgeAtom;       // Notificação
  isActive?: boolean;
  isCollapsed?: boolean;   // Só mostra ícone
  subItems?: NavItemMolecule[];
}

// Estados visuais
const navItemStates = {
  default:  'text-zinc-400 hover:text-white hover:bg-zinc-800',
  active:   'text-[#FDBF68] bg-[#FDBF68]/10 border-l-2 border-[#FDBF68]',
  disabled: 'text-zinc-600 cursor-not-allowed',
};
```

### SearchInput Molecule

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔍  Buscar em todos os módulos...                          ⌘K  [×]    │
└─────────────────────────────────────────────────────────────────────────┘

COMPOSIÇÃO: Icon + Input + Kbd + ClearButton
COMPORTAMENTO:
- Foco global via Cmd+K
- Busca federada em todos módulos
- Resultados agrupados por módulo
- Histórico de buscas recentes
```

---

## 9.5 Organisms — Seções Complexas

### Sidebar Organism

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              SIDEBAR                                       │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  [LOGO]  ExímIA OS                                              [▢]│  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ Quick Actions ─────────────────────────────────────────────────────┐  │
│  │  [+ Nova Meta]  [+ Captura Rápida]                                  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ Navigation ────────────────────────────────────────────────────────┐  │
│  │  ◉ Journey                                                     [12]│  │
│  │    ├─ Dashboard                                                     │  │
│  │    ├─ Goals                                                         │  │
│  │    ├─ Habits                                                   [3] │  │
│  │    └─ Library                                                       │  │
│  │  ○ Academy                                                          │  │
│  │  ○ Brand                                                            │  │
│  │  ○ Strategy                                                         │  │
│  │  ○ PrototypOS                                                       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ System ────────────────────────────────────────────────────────────┐  │
│  │  ⚙ Settings                                                         │  │
│  │  📥 Inbox                                                      [5] │  │
│  │  🔔 Notifications                                              [2] │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ User ──────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] Hugo Capitelli                                        PRO │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

COMPOSIÇÃO:
Sidebar = Logo + QuickActions + NavGroup[] + UserCard
        = Atom + Molecule     + Molecule[] + Molecule
```

### Header Organism

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                        │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ← Journey / Goals / Trimestre Q1                                         │
│     Breadcrumb                                                            │
│                                                                           │
│  ┌─ Page Title ────────────────────────────────────────────────────────┐  │
│  │  🎯 Metas do Trimestre                               [+ Nova Meta]  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ Actions Bar ───────────────────────────────────────────────────────┐  │
│  │  [🔍 Buscar...]  [Filtros ▼]  [Ordenar ▼]  [··· Mais]              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

COMPOSIÇÃO:
Header = Breadcrumb + PageTitle + Button + ActionsBar
       = Molecule   + Molecule  + Atom   + Molecule
```

### GoalCard Organism

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              GOAL CARD                                     │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  [HIGH] 🎯  Lançar MVP do ExímIA Finance               [···]        │  │
│  │  Q1 2026 • 45 dias restantes                                        │  │
│  │                                                                     │  │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░  35%                              │  │
│  │                                                                     │  │
│  │  ┌─ Key Results ─────────────────────────────────────────────────┐  │  │
│  │  │  ✓ Definir MVP scope                                     100%│  │  │
│  │  │  ◐ Desenvolver backend                                    60%│  │  │
│  │  │  ○ Desenvolver frontend                                    0%│  │  │
│  │  └───────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌─ Links ───────────────────────────────────────────────────────┐  │  │
│  │  │  📊 Initiative: EXIMIA-2026-001                               │  │  │
│  │  │  📚 Book: Lean Startup                                        │  │  │
│  │  │  🎓 Course: Product Management                                │  │  │
│  │  └───────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  [👤 Hugo] [💬 3] [📎 2]                          [Ver Detalhes →] │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

COMPOSIÇÃO:
GoalCard = Badge + Icon + Typography + ProgressBar + KeyResultList + EntityLinks + MetaInfo + Button
```

---

## 9.6 Templates — Layouts Estruturais

### DashboardLayout Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD LAYOUT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┬───────────────────────────────────────────────────────────┐   │
│  │         │                                                           │   │
│  │         │  ┌─ Header ───────────────────────────────────────────┐   │   │
│  │         │  │  [Breadcrumb]  [Title]  [Actions]                  │   │   │
│  │         │  └────────────────────────────────────────────────────┘   │   │
│  │ Sidebar │                                                           │   │
│  │ (240px) │  ┌─ Content Area ─────────────────────────────────────┐   │   │
│  │         │  │                                                     │   │   │
│  │         │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐               │   │   │
│  │         │  │  │ Metric  │ │ Metric  │ │ Metric  │               │   │   │
│  │         │  │  │ Card    │ │ Card    │ │ Card    │               │   │   │
│  │         │  │  └─────────┘ └─────────┘ └─────────┘               │   │   │
│  │         │  │                                                     │   │   │
│  │         │  │  ┌─────────────────────────────────────────────┐   │   │   │
│  │         │  │  │                                             │   │   │   │
│  │         │  │  │            Main Content Area                │   │   │   │
│  │         │  │  │                                             │   │   │   │
│  │         │  │  └─────────────────────────────────────────────┘   │   │   │
│  │         │  │                                                     │   │   │
│  │         │  └─────────────────────────────────────────────────────┘   │   │
│  │         │                                                           │   │
│  └─────────┴───────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

SLOT AREAS:
- sidebar: Sidebar Organism (fixed 240px)
- header: Header Organism
- metrics: MetricCard[] (responsive grid)
- content: Page-specific content
```

### SettingsLayout Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SETTINGS LAYOUT                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┬───────────────────────────────────────────────────────────┐   │
│  │         │  Settings                                          [×]    │   │
│  │         │                                                           │   │
│  │ Settings│  ┌─ Content ──────────────────────────────────────────┐   │   │
│  │ Nav     │  │                                                     │   │   │
│  │ (200px) │  │  Section Title                                      │   │   │
│  │         │  │  ─────────────────────────────────                  │   │   │
│  │  Profile│  │                                                     │   │   │
│  │  Account│  │  ┌─ Setting Row ─────────────────────────────────┐  │   │   │
│  │  Notif. │  │  │  Label                                [Toggle]│  │   │   │
│  │  Billing│  │  │  Description text here                        │  │   │   │
│  │  API    │  │  └───────────────────────────────────────────────┘  │   │   │
│  │         │  │                                                     │   │   │
│  │         │  │  ┌─ Setting Row ─────────────────────────────────┐  │   │   │
│  │         │  │  │  Label                              [Dropdown]│  │   │   │
│  │         │  │  │  Description text here                        │  │   │   │
│  │         │  │  └───────────────────────────────────────────────┘  │   │   │
│  │         │  │                                                     │   │   │
│  │         │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────┴───────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.7 Pages — Instâncias Reais

### Page: Journey Dashboard

```
/journey

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ← Journey                                                                  │
│                                                                             │
│  🚀 Bom dia, Hugo!                                     25 de Janeiro, 2026  │
│  Você tem 3 hábitos pendentes e 2 metas atrasadas.                         │
│                                                                             │
│  ┌─ Métricas Rápidas ──────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Metas    │  │ Hábitos  │  │ Livros   │  │ Streak   │            │   │
│  │  │ 8/12     │  │ 5/8      │  │ 3 lendo  │  │ 45 dias  │            │   │
│  │  │ 67%      │  │ 63%      │  │ ▲12      │  │ 🔥 best  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Hábitos de Hoje ───────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ○ Meditação (15min)                                    [Completar] │   │
│  │  ○ Leitura (30min)                                      [Completar] │   │
│  │  ✓ Exercício (45min)                                     Concluído  │   │
│  │  ○ Journaling                                           [Completar] │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Metas em Foco ─────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  [GoalCard: Lançar MVP ExímIA Finance - 35%]                        │   │
│  │  [GoalCard: Ler 24 livros em 2026 - 12%]                            │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Sugestões da IA ────────────────────────────────────────[Ver Todas]┐   │
│  │                                                                      │   │
│  │  💡 Baseado na sua meta de liderança, encontramos um curso          │   │
│  │     relevante na Academy: "Liderança Situacional"                   │   │
│  │                                                    [Ver] [Dispensar]│   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Page: Inbox

```
/inbox

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📥 Inbox                                                [+ Captura Rápida] │
│  12 itens não processados                                                   │
│                                                                             │
│  ┌─ Filtros ───────────────────────────────────────────────────────────┐   │
│  │  [Todos] [Texto] [Voz] [Links]                    [Ordenar: Recente]│   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Item ──────────────────────────────────────────────────────────────┐   │
│  │  🎤 "Ideia para novo módulo de networking..."          há 2 horas   │   │
│  │                                                                      │   │
│  │  Sugestão IA: 💡 → Journey / Goal (Confiança: 78%)                  │   │
│  │                                                                      │   │
│  │  [✓ Aceitar] [Editar Destino] [Arquivar]                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Item ──────────────────────────────────────────────────────────────┐   │
│  │  📝 "Revisar proposta comercial para cliente X"         há 5 horas  │   │
│  │                                                                      │   │
│  │  Sugestão IA: 💡 → Strategy / Task (Confiança: 92%)                 │   │
│  │                                                                      │   │
│  │  [✓ Aceitar] [Editar Destino] [Arquivar]                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ Item ──────────────────────────────────────────────────────────────┐   │
│  │  🔗 https://article.com/design-systems                  há 1 dia    │   │
│  │                                                                      │   │
│  │  Sugestão IA: 💡 → Journey / Book (Confiança: 65%)                  │   │
│  │                                                                      │   │
│  │  [✓ Aceitar] [Editar Destino] [Arquivar]                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.8 Component States Matrix

Cada componente deve ter estados documentados para garantir consistência.

### State Documentation Template

| State | Visual Change | Trigger | Accessibility |
|-------|--------------|---------|---------------|
| **Default** | Estado base | Render inicial | — |
| **Hover** | Brightness +10%, subtle shadow | Mouse over | — |
| **Focus** | Ring outline (2px, offset 2px) | Tab navigation | `focus-visible` |
| **Active** | Scale 0.98, darker bg | Mouse down | — |
| **Loading** | Spinner, disabled interactions | Async operation | `aria-busy="true"` |
| **Disabled** | Opacity 0.5, cursor not-allowed | Prop `disabled` | `aria-disabled="true"` |
| **Error** | Red border, error icon | Validation fail | `aria-invalid="true"` |
| **Success** | Green border, check icon | Validation pass | — |

---

## 9.9 Responsive Behavior

### Breakpoint System

| Name | Min Width | Target Device |
|------|-----------|---------------|
| `xs` | 0px | Mobile (portrait) |
| `sm` | 640px | Mobile (landscape) |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Ultra-wide |

### Component Responsiveness

```
SIDEBAR
────────
Desktop (lg+): Fixed 240px, always visible
Tablet (md):   Collapsible, 80px when collapsed
Mobile (<md):  Hidden, drawer overlay on menu tap

METRIC CARDS
────────
Desktop: 4 columns
Tablet:  2 columns
Mobile:  1 column (stacked)

GOAL CARDS
────────
Desktop: 2-3 columns grid
Tablet:  2 columns
Mobile:  1 column, compact variant
```

---

## 9.10 Pattern Library Structure

### Recommended File Organization

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Icon/
│   │   ├── Avatar/
│   │   └── Typography/
│   │
│   ├── molecules/
│   │   ├── FormField/
│   │   ├── MetricCard/
│   │   ├── NavItem/
│   │   ├── SearchInput/
│   │   └── EntityLink/
│   │
│   ├── organisms/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── GoalCard/
│   │   ├── HabitTracker/
│   │   ├── InboxItem/
│   │   └── NotificationPanel/
│   │
│   ├── templates/
│   │   ├── DashboardLayout/
│   │   ├── SettingsLayout/
│   │   ├── ModuleLayout/
│   │   └── AuthLayout/
│   │
│   └── index.ts          # Export all
│
├── modules/
│   ├── journey/
│   │   └── pages/        # Page implementations
│   ├── academy/
│   ├── brand/
│   ├── strategy/
│   └── prototyper/
│
└── app/                  # Next.js App Router
    ├── (auth)/
    ├── (dashboard)/
    │   ├── journey/
    │   ├── academy/
    │   └── ...
    └── layout.tsx
```

---

## 9.11 Documentation & Collaboration

> *"A design system without documentation is like IKEA furniture without instructions."*

### Storybook Setup

Cada componente deve ter stories documentando:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};
```

### Collaboration Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DESIGN-DEV COLLABORATION                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DESIGN                                                              │
│     Designer cria componente no Figma                                   │
│     ↓                                                                   │
│  2. HANDOFF                                                             │
│     Documentação de tokens, estados, comportamentos                     │
│     ↓                                                                   │
│  3. IMPLEMENTATION                                                      │
│     Dev implementa em React + Storybook                                 │
│     ↓                                                                   │
│  4. REVIEW                                                              │
│     Designer valida implementação no Storybook                          │
│     ↓                                                                   │
│  5. PUBLISH                                                             │
│     Componente entra na Pattern Library                                 │
│     ↓                                                                   │
│  6. USE                                                                 │
│     Equipe usa componente em features                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9.12 Acessibilidade (a11y)

### Requisitos Mínimos

| Critério | Requisito | Verificação |
|----------|-----------|-------------|
| **Contraste** | WCAG AA (4.5:1 texto, 3:1 UI) | Contrast checker |
| **Keyboard** | Todos elementos focáveis via Tab | Manual testing |
| **Screen Reader** | ARIA labels, roles, live regions | VoiceOver/NVDA |
| **Motion** | Respeitar `prefers-reduced-motion` | CSS media query |
| **Focus** | Indicador visível (ring outline) | Visual check |

### ARIA Patterns

```typescript
// Goal Card com ARIA
<article
  aria-labelledby={`goal-${id}-title`}
  aria-describedby={`goal-${id}-progress`}
  role="article"
>
  <h3 id={`goal-${id}-title`}>{title}</h3>
  <div
    id={`goal-${id}-progress`}
    role="progressbar"
    aria-valuenow={progress}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`${progress}% completo`}
  >
    <div style={{ width: `${progress}%` }} />
  </div>
</article>
```

---

## 9.13 Performance Considerations

> *"Good performance is good design."*

### Component Performance Rules

| Rule | Implementation |
|------|----------------|
| **Lazy Loading** | Módulos carregam sob demanda (`next/dynamic`) |
| **Image Optimization** | Usar `next/image` para avatares, capas |
| **Virtualization** | Listas longas usam `react-window` |
| **Memoization** | Componentes caros com `React.memo` |
| **Bundle Splitting** | Cada módulo é chunk separado |

### Metrics Targets

| Metric | Target | Tool |
|--------|--------|------|
| **LCP** | < 2.5s | Lighthouse |
| **FID** | < 100ms | Lighthouse |
| **CLS** | < 0.1 | Lighthouse |
| **Bundle Size** | < 300KB (initial) | Bundle Analyzer |
| **TTI** | < 3.5s | Lighthouse |

---

# 10. Métricas de Sucesso — O Que Realmente Importa

## 10.1 Métricas Primárias (North Star)

| Métrica | Definição | Target v4.0 |
|---------|-----------|-------------|
| **Weekly Active Users (WAU)** | Usuários únicos que acessam ≥3x/semana | Baseline |
| **Cross-Module Engagement** | % de sessões com ≥2 módulos usados | > 40% |
| **Task Completion Rate** | Metas marcadas como concluídas | > 60% |

## 10.2 Métricas de Conexão (O Diferencial)

| Métrica | O Que Mede | Por Que Importa |
|---------|------------|-----------------|
| **Link Density** | Links por entidade | Quão conectado está o sistema |
| **Cascade Success Rate** | % de cascateamentos aceitos | Connection Layer funcionando |
| **Suggestion Acceptance** | % de sugestões aceitas pela IA | Relevância das recomendações |
| **Cross-Module Navigation** | Cliques entre módulos/sessão | Fluidez do sistema |

## 10.3 Métricas por Módulo

### Journey

| Métrica | Cálculo | Target |
|---------|---------|--------|
| Habit Completion Rate | Completados / (Ativos × Dias) | > 70% |
| Goal Completion Rate | Concluídos / Criados (30d) | > 50% |
| Streak Retention | Usuários com streak ≥7 dias | > 30% |
| Library Activity | Livros em progresso / usuário | > 2 |

### Academy

| Métrica | Cálculo | Target |
|---------|---------|--------|
| Course Completion | Cursos finalizados / Iniciados | > 40% |
| Socratic Engagement | Msgs por sessão socrática | ≥ 3 |
| Return Rate | Voltou em 7 dias após sessão | > 60% |

### Strategy

| Métrica | Cálculo | Target |
|---------|---------|--------|
| Initiative Progress | Avg progress de iniciativas ativas | > 65% |
| Cascade Adoption | Iniciativas com Goals linkados | > 80% |
| Cycle Completion | Ciclos finalizados no prazo | > 70% |

## 10.4 Métricas de Proatividade

| Métrica | O Que Mede | Target |
|---------|------------|--------|
| **Notification Open Rate** | Notificações abertas / enviadas | > 50% |
| **Reminder Effectiveness** | Ações tomadas após reminder | > 30% |
| **Digest Read Rate** | Digests abertos / enviados | > 60% |
| **Inbox Zero Time** | Tempo médio para processar inbox | < 48h |

## 10.5 Métricas de Saúde do Produto

| Métrica | Definição | Alarme |
|---------|-----------|--------|
| **Churn Rate** | Usuários inativos ≥30d | > 10% |
| **Time to Value** | Tempo até primeira ação significativa | > 5 min |
| **Error Rate** | Erros / requests | > 1% |
| **Load Time (P95)** | Tempo de carregamento | > 3s |

## 10.6 Dashboard de Métricas

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT HEALTH DASHBOARD                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WAU            Cross-Module      Task Completion   Churn       │
│  ████████ 847   ████░░░░ 42%     █████████ 67%     ██░░ 8%     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CONEXÃO                                                        │
│  Link Density: 3.2/entity   Cascade Success: 78%               │
│  Suggestion Accept: 31%     Cross-Module Nav: 2.4/session      │
├─────────────────────────────────────────────────────────────────┤
│  PROATIVIDADE                                                   │
│  Notification Open: 52%     Reminder Effect: 34%               │
│  Digest Read: 61%           Inbox Zero: 36h avg                │
└─────────────────────────────────────────────────────────────────┘
```

## 10.7 Anti-Métricas (O Que NÃO Medir)

| Métrica Vaidosa | Por que evitar | Alternativa |
|-----------------|----------------|-------------|
| Total de usuários cadastrados | Não mostra uso real | WAU |
| Features entregues | Não mostra impacto | Task Completion |
| Linhas de código | Quantidade ≠ Qualidade | Error Rate |
| Tempo no app | Pode indicar confusão | Actions/session |

---

# 11. Análise Crítica: O Que Estamos Ignorando

## 11.1 O Diagnóstico Honesto

Olhando para o ExímIA OS com olhos críticos, identificamos **gaps fundamentais** que estão nos impedindo de entregar a promessa de "Empresa Inteligente".

### O Óbvio Que Estamos Ignorando

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   "Construímos módulos bonitos, mas esquecemos de construir PONTES."  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Os Gaps Críticos

### Gap 1: A Connection Layer é um Conceito, Não uma Realidade

**O que dizemos:** "Tudo conectado. Tudo fluindo."

**O que temos:** Módulos isolados que não conversam.

| Deveria Acontecer | Acontece Hoje |
|-------------------|---------------|
| Iniciativa em Strategy cria automaticamente Goal em Journey | Usuário cria manualmente em dois lugares |
| Livro sobre "Liderança" é sugerido quando Goal é "Desenvolver time" | Biblioteca vive isolada, sem contexto |
| Hábito "Estudar 30min" sugere conteúdo relevante da Academy | Academy não sabe o que o usuário está tentando alcançar |
| Brand voice está disponível quando escrevo PRD no PrototypOS | PrototypOS não tem acesso ao Brand |

**Por que não vemos:** Estamos tão ocupados construindo features que esquecemos de construir o SISTEMA.

---

### Gap 2: O Sistema é Reativo, Não Proativo

**O que dizemos:** "IA como parceira de pensamento."

**O que temos:** IA que só fala quando perguntamos.

| Deveria Acontecer | Acontece Hoje |
|-------------------|---------------|
| "Você não completou o hábito X em 3 dias. Algo aconteceu?" | Silêncio |
| "Sua meta Y está 2 semanas atrasada. Quer revisar o prazo?" | Silêncio |
| "Baseado no seu histórico, domingo é seu melhor dia para leitura" | Silêncio |
| "Achei um artigo relevante para sua iniciativa Z" | Silêncio |

**Por que não vemos:** Confundimos "ter IA" com "usar IA de forma inteligente".

---

### Gap 3: Dependência 100% Humana (Ironia)

**O que dizemos:** "Resolvemos a dependência humana."

**O que temos:** Sistema que só funciona se o humano fizer TUDO.

| O Sistema Deveria | O Sistema Faz |
|-------------------|---------------|
| Lembrar o usuário de completar hábitos | Nada |
| Enviar resumo diário/semanal | Nada |
| Automatizar tarefas recorrentes | Nada |
| Criar eventos automaticamente de deadlines | Nada |

**Por que não vemos:** Focamos em "o que o usuário pode fazer" em vez de "o que o sistema pode fazer pelo usuário".

---

### Gap 4: Zero Automação

**O que dizemos:** "Eliminar ilhas de eficiência."

**O que temos:** Nenhum workflow automatizado.

**O que está faltando:**
- Triggers: "Quando X acontecer, faça Y"
- Schedules: "Todo domingo às 20h, gere resumo semanal"
- Rules: "Se hábito não completado por 3 dias, enviar lembrete"
- Cascades: "Quando iniciativa criada, gerar goals automaticamente"

**Por que não vemos:** Automação requer arquitetura de eventos que não temos.

---

### Gap 5: Onde Está o Dinheiro?

**O que dizemos:** "Para empreendedores."

**O que temos:** Zero módulo financeiro.

| Todo Empreendedor Precisa | Temos? |
|---------------------------|--------|
| Controle de fluxo de caixa | ❌ |
| Metas financeiras | ❌ |
| Acompanhamento de receita/despesa | ❌ |
| Métricas de negócio (MRR, CAC, LTV) | ❌ |

**Por que não vemos:** Assumimos que "produtividade" é suficiente. Não é. Dinheiro é o sangue do negócio.

---

### Gap 6: Onde Está o Tempo?

**O que dizemos:** "Respeitar seu tempo."

**O que temos:** Nenhum tracking de tempo.

| Deveria Existir | Existe? |
|-----------------|---------|
| Time tracking por meta/projeto | ❌ |
| Pomodoro / Focus sessions | ❌ |
| Análise de onde o tempo está indo | ❌ |
| Estimativa vs. tempo real | ❌ |

**Por que não vemos:** Focamos em "o que fazer" mas não em "quanto tempo leva".

---

### Gap 7: Onde Estão as Pessoas?

**O que dizemos:** "Sistema para escalar."

**O que temos:** Experiência 100% individual.

| Empreendedores Precisam | Temos? |
|-------------------------|--------|
| CRM básico (contatos, relacionamentos) | ❌ |
| Delegação de tarefas | ❌ |
| Compartilhar metas com sócios | ❌ |
| Networking e follow-ups | ❌ |

**Por que não vemos:** Construímos para o "lobo solitário", mas ninguém escala sozinho.

---

### Gap 8: Onde Está a Captura Rápida?

**O que dizemos:** "Ferramenta que flui."

**O que temos:** Nenhuma forma rápida de capturar.

| Deveria Existir | Existe? |
|-----------------|---------|
| Quick capture / Inbox universal | ❌ |
| Voice memo | ❌ |
| Captura de imagem/screenshot | ❌ |
| Bookmark de conteúdo externo | ❌ |

**Por que não vemos:** Focamos na organização, não na entrada de dados.

---

### Gap 9: Onde Está o Mobile?

**O que dizemos:** "Sistema operacional do empreendedor."

**O que temos:** Zero experiência mobile.

| Realidade | Impacto |
|-----------|---------|
| Empreendedores estão sempre em movimento | Sistema inacessível quando mais precisam |
| Hábitos são completados no celular | Usuário não consegue marcar |
| Ideias surgem a qualquer momento | Sem forma de capturar |

**Por que não vemos:** Web-first virou web-only.

---

## 11.3 O Diagnóstico Raiz

### Por Que Não Estamos Vendo Isso?

| Viés | Manifestação |
|------|--------------|
| **Feature-first thinking** | Medimos sucesso por features entregues, não por problemas resolvidos |
| **Builder's blindspot** | Estamos tão dentro que não vemos de fora |
| **Complexity avoidance** | Connection Layer é difícil, então adiamos |
| **MVP hangover** | Continuamos em mentalidade MVP quando já deveríamos ter sistema |
| **Tech-driven roadmap** | Construímos o que é fácil, não o que é necessário |

### A Pergunta Que Devemos Fazer

> "Se o ExímIA OS desaparecesse amanhã, o que os usuários sentiriam falta que NÃO conseguiriam em outro lugar?"

Resposta honesta atual: **Quase nada**. Cada módulo nosso tem competidor melhor.

O diferencial seria a CONEXÃO — mas ela não existe de verdade.

---

## 11.4 O Plano de Ação

### Prioridade 1: Connection Layer Real

```
Antes de adicionar QUALQUER nova feature:
1. Implementar event system interno
2. Criar links bidirecionais entre entidades
3. Construir suggestion engine básico
4. Fazer Strategy cascatear para Journey
```

### Prioridade 2: Proatividade Básica

```
1. Sistema de notificações
2. Lembretes de hábitos
3. Alertas de metas atrasadas
4. Resumo semanal automático
```

### Prioridade 3: Quick Capture

```
1. Inbox universal
2. Hotkey global para captura
3. Voice-to-text básico
4. Processo de "triagem" do inbox
```

### Prioridade 4: Mobile PWA

```
1. Experiência responsiva completa
2. PWA com offline básico
3. Notificações push
4. Widget de hábitos
```

### O Que NÃO Fazer Agora

- ❌ Mais features isoladas
- ❌ Módulo financeiro completo (complexidade alta)
- ❌ CRM completo (scope creep)
- ❌ Integrações externas (antes de resolver interno)

---

## 11.5 Métricas de Sucesso Real

### Métricas Atuais (Vaidade)

- Número de usuários cadastrados
- Features entregues
- Linhas de código

### Métricas Que Deveríamos Medir

| Métrica | Por que importa |
|---------|-----------------|
| **Cross-module interactions** | Usuários estão usando a CONEXÃO? |
| **Daily Active Use** | Voltam todo dia ou só cadastram? |
| **Habit completion rate** | O sistema está ajudando de verdade? |
| **Goal completion rate** | Metas estão sendo alcançadas? |
| **Time to value** | Quanto tempo até usuário ver valor? |

---

## 11.6 Conclusão da Análise

### O Estado Atual

Construímos **5 apps isolados dentro de um casca chamada ExímIA OS**.

Criticamos "ferramentas isoladas que criam ilhas" enquanto criamos exatamente isso.

### O Estado Desejado

Um **sistema nervoso central** onde cada ação em um módulo reverbera inteligentemente nos outros.

### O Caminho

```
De: Módulos bonitos → Para: Conexões poderosas
De: Feature-first   → Para: System-first
De: Reativo         → Para: Proativo
De: Web-only        → Para: Everywhere
De: User does all   → Para: System helps
```

### O Compromisso

> "Antes de construir a próxima feature brilhante, vamos fazer as que existem conversarem."

---

# 12. Clone Reviews: Elon Musk & Brad Frost

> **Metodologia:** Utilizamos os clones validados do eximIA.OS para análise crítica do PRD. Cada clone aplica sua expertise única ao projeto.

---

## 12.1 Análise Elon Musk — First Principles Review

*Source: Clone Elon Musk v2.0 | Fidelidade: 94%*

### O Problema Decomposto

```
PROBLEMA: Empreendedores têm ferramentas fragmentadas

DECOMPOSIÇÃO (First Principles):
├── Realidade física: Dados existem em lugares diferentes
├── Realidade humana: Atenção é finita, contexto se perde
├── Solução atual: +1 ferramenta (adiciona complexidade)
└── Solução correta: -N ferramentas (reduz para essencial)

VERDADE FUNDAMENTAL:
O valor não está nas features — está na CONEXÃO entre elas.
```

### 5-Step Engineering Process Aplicado

| Passo | Aplicação ao ExímIA OS | Ação |
|-------|------------------------|------|
| **1. Question Requirements** | "Precisamos de 5 workspaces?" | Validar se ALL são core |
| **2. Delete** | Brand pode ser parte de Strategy? Academy pode ser externo? | Merge ou kill |
| **3. Simplify** | Connection Layer tem complexidade justificada? | Simplificar event model |
| **4. Accelerate** | MVP em 12 semanas → pode ser 4? | Ship faster |
| **5. Automate** | Automação vem DEPOIS de manual funcionar | Resist automation creep |

### Crítica Direta

> *"Vocês dizem que o diferencial é conexão, mas descrevem 70+ features antes de especificar a Connection Layer. Isso é backwards. A Connection Layer deveria ser 60% do PRD, não 10%."*

### Recomendações Elon (Revisadas)

| Recomendação Original | Decisão | Justificativa |
|-----------------------|---------|---------------|
| ~~Delete Academy do MVP~~ | **❌ REJEITADA** | Academy é pilar estratégico de receita. Piloto para Harven.AI. Não negociável. |
| Merge Brand em PrototypOS | ⚠️ Avaliar | Pode fazer sentido no futuro. Por ora, mantém separado. |
| **Connection Layer FIRST** | **✅ ACEITA** | Esta é a recomendação central. Expandir para 60% do PRD. |
| v0.1 em 2 semanas | ⚠️ Adaptar | Agressivo mas inspira urgência. |
| **Proactive Insights = O Moat** | **✅ ACEITA** | Diferencial real. Sistema que fala com você. |

### O Que Mantemos do Elon

> *"O valor não está nas features — está na CONEXÃO entre elas."*

Esta é a verdade fundamental. Connection Layer é prioridade absoluta.

### Métricas que Importam (Elon's Pick)

| Métrica | Por que é a única que importa |
|---------|-------------------------------|
| **Cross-Module Actions/Day** | Prova que conexão funciona |
| **Time to First Insight Received** | Prova que proatividade funciona |
| **Manual Actions Eliminated/Week** | Prova que automação entrega valor |

---

## 12.2 Análise Brad Frost — Design System Review

*Source: Clone Brad Frost v1.0 | Fidelidade: 95%*

### Diagnóstico Inicial

> *"Y'all have a color system and components, but that's not a design system. A design system is about the human relationships part — shared vocabulary, documentation that lives with code, and cross-disciplinary collaboration."*

### Atomic Design Assessment

| Nível | Status Atual | Gap | Recomendação |
|-------|--------------|-----|--------------|
| **Atoms** | ✅ Definido (cores, tipografia) | — | Documentar como tokens |
| **Molecules** | ⚠️ Implícito | Sem catálogo | Criar pattern library |
| **Organisms** | ⚠️ Implícito | Sem nomenclatura | Nomear e documentar |
| **Templates** | ❌ Ausente | Layout não especificado | Definir page layouts |
| **Pages** | ❌ Ausente | Sem exemplos reais | Screenshots de reference |

### Problemas Identificados

1. **Tokens sem estrutura semântica**
   ```
   Atual:    --amber-500: #f59e0b
   Deveria:  --color-primary: var(--amber-500)
             --color-action: var(--color-primary)
   ```
   *Separar estrutura (o que faz) de estética (como parece).*

2. **Componentes sem estados documentados**
   - Buttons: onde está hover, focus, disabled, loading?
   - Cards: onde está empty state, error state, skeleton?

3. **Falta de "Window Chrome" spec**
   - Mencionado mas não especificado
   - Qual é o padrão exato? Bordas, shadows, header height?

4. **Sem Design Tokens file**
   - JSON/YAML de tokens exportáveis
   - Figma tokens sync
   - Tailwind config generation

### Estrutura Recomendada

```
design-system/
├── tokens/
│   ├── colors.json         ← Escala completa
│   ├── semantic-colors.json ← Mapeamento funcional
│   ├── typography.json
│   ├── spacing.json
│   └── shadows.json
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx  ← Storybook
│   │   └── Button.docs.mdx     ← Documentação
│   ├── Input/
│   └── ...
├── molecules/
│   ├── SearchField/
│   ├── FormGroup/
│   └── ...
├── organisms/
│   ├── Header/
│   ├── Sidebar/
│   ├── WindowChrome/         ← O padrão container
│   └── ...
├── templates/
│   ├── DashboardLayout/
│   ├── FormLayout/
│   └── ...
└── pages/
    └── examples/
```

### Ação Imediata (Brad's Pick)

1. **Criar Storybook** — Pattern Lab para React. Documentação viva.
2. **Nomear o "Window Chrome"** — É um organism. Documente: `<WindowCard title="" actions={[]}>`
3. **Semantic Tokens** — Camada de abstração entre cores e uso
4. **Component States** — Cada componente precisa de 5+ estados documentados

### Frase Final

> *"Build systems, not pages. Vocês estão descrevendo pages (Journey, Academy, Brand) sem ter descrito o sistema que as compõe. Invertam: sistema primeiro, pages depois."*

---

# 13. Finance Module — Proposta de Integração

> **Fonte:** PRD ExímIA Finance v2 (rewritten by Elon Clone)
> **Status:** Proposta para v5.0+

## 13.1 Por que Finance no ExímIA OS?

### Alinhamento com Manifesto

| Problema Identificado | Finance Resolve? |
|-----------------------|------------------|
| "Ferramentas isoladas criam ilhas" | ✅ Unifica PF + PJ em um lugar |
| "Dependência humana" | ✅ Insights proativos |
| "Falta de padrão" | ✅ Categorização consistente |

### Sinergias com Módulos Existentes

| Conexão | Como Funciona |
|---------|---------------|
| **Strategy → Finance** | Iniciativas têm budget. Finance mostra burn rate. |
| **Journey → Finance** | Goals financeiros (ex: "Economizar 10k"). Tracking automático. |
| **Finance → Notifications** | "Você gastou 2x em Marketing este mês" |
| **Finance → Inbox** | Captura de despesas via foto/voz |

## 13.2 Escopo Mínimo (v0.1 Finance)

Baseado no PRD do Elon Clone — radically scoped:

| Feature | Status | Justificativa |
|---------|--------|---------------|
| Multi-workspace (Personal + Business) | ✅ Core | É O diferenciador |
| Contas bancárias manuais | ✅ Core | Inventário básico |
| Cartões de crédito manuais | ✅ Core | Inventário básico |
| Transações manuais | ✅ Core | Entrada de dados |
| Categorização manual | ✅ Core | Organizaão |
| Totais simples | ✅ Core | "Quanto tenho?" |
| 1 insight proativo | ✅ Core | Prova de conceito |
| AI categorization | ❌ Depois | Nice-to-have |
| Open Finance | ❌ Depois | Complexidade |
| Gráficos elaborados | ❌ Depois | Vaidade |
| Orçamentos | ❌ Depois | Não é core |

**Total: 7 features.** Original tinha 70+. Redução de 90%.

## 13.3 Modelos de Dados

### Workspace (Já existe — reutilizar)

Finance usa o mesmo conceito de workspace que Strategy. Um usuário pode ter:
- Workspace "Pessoal" (PF)
- Workspace "Minha Empresa" (PJ)
- Workspace "Side Project" (PJ2)

### Account (Conta Bancária)

```typescript
interface FinanceAccount {
  id: string;
  workspace_id: string; // Link com workspace existente

  name: string;
  bank: string;
  balance: number;
  currency: 'BRL'; // Brazil first

  // Connection Layer
  linked_goals?: string[]; // Goals de Journey que envolvem esta conta

  created_at: Date;
  updated_at: Date;
}
```

### Card (Cartão de Crédito)

```typescript
interface FinanceCard {
  id: string;
  workspace_id: string;

  name: string;
  last_four?: string;
  credit_limit: number;
  current_balance: number;
  closing_day: number; // 1-31
  due_day: number;     // 1-31

  created_at: Date;
}
```

### Transaction

```typescript
interface Transaction {
  id: string;
  workspace_id: string;
  account_id?: string;
  card_id?: string;

  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;

  // Connection Layer
  linked_goal?: string;      // Se relacionado a um Goal
  linked_initiative?: string; // Se é gasto de uma Initiative

  created_at: Date;
}
```

## 13.4 Proactive Insights Engine

O diferencial do Finance é ser **anti-dashboard**. O app FALA com você.

### v0.1 Insights

| Insight | Trigger | Mensagem |
|---------|---------|----------|
| **Spending Spike** | Categoria > 150% média 3 meses | "Você gastou 2x em [X] este mês" |
| **MEI Alert** | Receita anual > 70% de R$81k | "Seu MEI está em X% do limite" |
| **Card Limit** | Uso > 80% do limite | "[Cartão] está em 85% do limite" |
| **Negative Forecast** | Projeção < 0 em 30 dias | "Saldo pode ficar negativo em [data]" |

### Integração com Notification System

```yaml
# finance_insights.yaml
triggers:
  - name: spending_spike
    cron: "0 20 * * *"  # Diário às 20h
    condition: category_spend > (avg_3_months * 1.5)
    action:
      type: alert
      channels: [push, in_app]
      title: "Gasto acima do normal"
      body: "{{category}} está {{percent}}% acima da média"
```

## 13.5 Decisão Arquitetural

### Opção A: Finance como Módulo Interno

```
ExímIA OS
├── Journey
├── Academy
├── Brand
├── Strategy
├── PrototypOS
└── Finance ← Novo módulo
```

**Prós:** Conexão nativa, UX unificada
**Contras:** Aumenta escopo, atrasa Connection Layer

### Opção B: Finance como App Separado + API

```
ExímIA OS ←→ ExímIA Finance (app standalone)
    ↑               ↑
    └───── API ─────┘
```

**Prós:** Ship faster, valida demanda isoladamente
**Contras:** Mais infra, menos conexão

### Recomendação (Elon Style)

> **Opção A, mas DEPOIS da Connection Layer funcionar.**

Sequência correta:
1. Connection Layer funcionando (Strategy ↔ Journey)
2. Validar que cross-module works
3. Adicionar Finance como terceiro módulo conectado
4. Cada insight financeiro conecta a Goals/Initiatives

---

# 14. Glossário

| Termo | Definição |
|-------|-----------|
| **Workspace** | Área/módulo do sistema (Journey, Academy, Brand, etc.) |
| **Goal** | Meta ou objetivo com deadline, progresso e hierarquia |
| **Habit** | Comportamento recorrente rastreado diariamente |
| **Streak** | Sequência de dias consecutivos completando hábito |
| **Connection Layer** | Camada de inteligência que conecta todos os módulos via eventos e links |
| **Event Bus** | Sistema de publicação/assinatura de eventos entre módulos |
| **Entity Link** | Conexão bidirecional entre duas entidades de módulos diferentes |
| **Cascateamento** | Quando uma entidade em um módulo gera entidades em outros automaticamente |
| **Suggestion Engine** | Motor de IA que sugere ações baseado em contexto cross-module |
| **Inbox** | Ponto de entrada universal para captura rápida de qualquer informação |
| **Smart Triage** | Processo de IA que classifica e roteia itens do Inbox |
| **Proatividade** | Capacidade do sistema de antecipar necessidades e agir sem ser solicitado |
| **Digest** | Resumo automático periódico (diário/semanal) de atividades e métricas |
| **Socratic Session** | Diálogo de 3 turnos com tutor IA usando método socrático |
| **Initiative** | Projeto estratégico dentro de um ciclo que cascateia para Goals |
| **Design System** | Conjunto de tokens, componentes e padrões de design |
| **PWA** | Progressive Web App — aplicação web instalável com recursos nativos |
| **Offline-first** | Arquitetura que prioriza funcionamento sem conexão |
| **North Star Metric** | Métrica principal que indica sucesso do produto |
| **Cross-Module Engagement** | Interação entre diferentes módulos na mesma sessão |

---

# Sobre a ExímIA Ventures

Somos empreendedores construindo para empreendedores.

Conhecemos a dor das ferramentas fragmentadas porque vivemos ela. Conhecemos o "teto de vidro" da automação porque batemos nele.

O ExímIA OS é nossa tentativa de fazer diferente — não mais uma ferramenta, mas o SISTEMA que conecta tudo.

**Nosso compromisso:** Ser brutalmente honestos sobre onde estamos e implacavelmente focados em onde queremos chegar.

---

*Este documento evolui junto com o produto.*
*Versão 4.2 — 25 Janeiro 2026*

*Por empreendedores. Para empreendedores.*
*Da fragmentação à inteligência.*

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **4.2** | 25/01/2026 | + Clone Reviews (Elon Musk First Principles + Brad Frost Atomic Design); + Finance Module proposal; + Design System gaps |
| **4.1** | 25/01/2026 | + Connection Layer spec completa; + Inbox module; + Notifications system; + Mobile/PWA requirements; + Métricas de sucesso; Roadmap reorientado |
| 4.0 | Jan 2026 | Análise crítica; Academy Socrática |
| 3.5 | — | Features base implementadas |
