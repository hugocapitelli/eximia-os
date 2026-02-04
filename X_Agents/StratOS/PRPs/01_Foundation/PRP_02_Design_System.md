---
title: "PRP-02: Design System & Component Library"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "prp-02-design-system"
  - "prp-02: design system & compon"
  - "1. objetivo"
  - "2. princípios de design"
  - "3. design tokens"
  - "3.1 paleta de cores"
  - "3.2 tipografia"
  - "3.3 espaçamento"
  - "3.4 sombras e efeitos"
  - "4. layout & estrutura"
tags:
  - "galaxy-specialist"
  - "document"
---

# PRP-02: Design System & Component Library

> **Module:** Foundation
> **Priority:** P0 (Critical Path)
> **Estimated Complexity:** High
> **Dependencies:** Tailwind CSS, shadcn/ui, Framer Motion
> **Alinhamento:** Diretrizes visuais do exímIA.OS

---

## 1. Objetivo

Criar um Design System coeso e escalável que implementa a identidade visual "Executive Dashboard" do exímIA.OS, mantendo consistência com a plataforma principal enquanto cria a experiência única do módulo StratOS.

---

## 2. Princípios de Design

| Princípio | Descrição | Implicação |
|-----------|-----------|------------|
| **Executive Dashboard** | Interface para C-Level | Alta densidade de informação, sem gamificação |
| **Light Mode First** | Fundo claro com cards brancos | Estética de papel premium, menos fadiga visual |
| **Amarelo Exímia** | Cor única de destaque | #FDBE66 para CTAs, estados ativos, métricas |
| **Minimal & Clean** | Whitespace generoso | Foco no que é importante |
| **Thin Outline Icons** | Ícones de linha fina | Consistentes, nunca coloridos demais |

---

## 3. Design Tokens

### 3.1 Paleta de Cores

```css
/* ===== PALETA exímIA.OS ===== */

/* Fundos */
--color-bg-base: #EFEEEA;          /* Light Base - Fundo principal */
--color-bg-surface: #FFFFFF;       /* Branco Puro - Cards, sidebar, modals */
--color-bg-elevated: #FFFFFF;      /* Elementos elevados */

/* Cor de Ação (Única) */
--color-accent: #FDBE66;           /* Amarelo Exímia - CTAs, estados ativos */
--color-accent-hover: #FDB347;     /* Amarelo hover (mais saturado) */
--color-accent-light: #FDBE6620;   /* Amarelo 12% - backgrounds sutis */

/* Texto */
--color-text-primary: #1A1A1A;     /* Grafite Escuro - Títulos, texto principal */
--color-text-secondary: #6B6B6B;   /* Cinza - Texto secundário, labels */
--color-text-tertiary: #9CA3AF;    /* Cinza Claro - Placeholders, hints */
--color-text-disabled: #D1D5DB;    /* Disabled text */
--color-text-inverse: #FFFFFF;     /* Texto sobre fundo escuro */

/* Bordas */
--color-border-default: #E5E5E5;   /* Bordas padrão */
--color-border-hover: #D1D5DB;     /* Bordas hover */
--color-border-focus: #FDBE66;     /* Bordas focus (amarelo) */

/* Status Semânticos */
--color-success: #22C55E;          /* Verde - Sucesso / No Prazo / On Track */
--color-warning: #FDBE66;          /* Amarelo Exímia - Atenção / Em Progresso */
--color-error: #EF4444;            /* Vermelho - Erro / Atrasado / Off Track */
--color-info: #3B82F6;             /* Azul - Informacional */

/* Status Codes (Iniciativas) */
--status-not-planned: #9CA3AF;     /* Cinza - Código 0 */
--status-planned: #60A5FA;         /* Azul Claro - Código 1 */
--status-on-track: #22C55E;        /* Verde - Código 2 */
--status-at-risk: #FDBE66;         /* Amarelo - Código 3 */
--status-off-track: #EF4444;       /* Vermelho - Código 4 */
--status-completed: #3B82F6;       /* Azul - Código 5 */

/* BSC Dimension Colors (sutis, usando tons do amarelo e neutros) */
--bsc-financial: #FDBE66;          /* Amarelo (principal) */
--bsc-customer: #3B82F6;           /* Azul */
--bsc-process: #22C55E;            /* Verde */
--bsc-learning: #8B5CF6;           /* Roxo */
```

### 3.2 Tipografia

```css
/* ===== TIPOGRAFIA ===== */

/* Font Family */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - Labels, badges, captions */
--text-sm: 0.875rem;    /* 14px - Body small, table cells */
--text-base: 1rem;      /* 16px - Body default */
--text-lg: 1.125rem;    /* 18px - Subheadings */
--text-xl: 1.25rem;     /* 20px - Section titles */
--text-2xl: 1.5rem;     /* 24px - Page titles */
--text-3xl: 1.875rem;   /* 30px - Hero headings */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 3.3 Espaçamento

```css
/* ===== ESPAÇAMENTO ===== */
/* Uso generoso de whitespace para clareza e foco */

--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

### 3.4 Sombras e Efeitos

```css
/* ===== SOMBRAS (Soft Shadows) ===== */
/* Sombras muito leves e difusas para profundidade sutil */

--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
             0 2px 4px -2px rgba(0, 0, 0, 0.03);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05),
             0 4px 6px -4px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05),
             0 8px 10px -6px rgba(0, 0, 0, 0.03);

/* Sombra para cards elevados */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04),
               0 4px 12px rgba(0, 0, 0, 0.03);

/* Glow para elementos ativos (amarelo) */
--shadow-glow: 0 0 0 3px rgba(253, 190, 102, 0.2);

/* Border Radius (cantos suavemente arredondados) */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;

/* Transitions */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

---

## 4. Layout & Estrutura

### 4.1 Sidebar Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px, #FFFFFF, shadow-card)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐                                    │
│  │                                     │                                    │
│  │  [Logo exímIA.OS]                   │  Logo no topo                      │
│  │                                     │                                    │
│  ├─────────────────────────────────────┤                                    │
│  │                                     │                                    │
│  │  ○  War Room                        │  Item inativo (outline icon)       │
│  │                                     │                                    │
│  │  ⬤  The Forge                       │  Item ATIVO:                       │
│  │  ▌                                  │  - Barra amarela à esquerda        │
│  │                                     │  - Ícone filled ou mais bold       │
│  │                                     │  - Background: #FDBE66 10%         │
│  │                                     │                                    │
│  │  ○  Execution Hub                   │                                    │
│  │                                     │                                    │
│  │  ○  Governance                      │                                    │
│  │                                     │                                    │
│  ├─────────────────────────────────────┤                                    │
│  │                                     │                                    │
│  │  ─────────────────────              │  Divisor                           │
│  │                                     │                                    │
│  │  ○  Configurações                   │                                    │
│  │                                     │                                    │
│  │  ○  Ajuda                           │                                    │
│  │                                     │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
│  Especificações:                                                            │
│  - Largura: 240px                                                           │
│  - Background: #FFFFFF                                                      │
│  - Shadow: shadow-card                                                      │
│  - Ícones: Thin outline (lucide-react ou similar)                          │
│  - Item ativo: Barra amarela 3px + bg amarelo 10%                          │
│  - Padding: 16px                                                            │
│  - Gap entre items: 4px                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAGE LAYOUT                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┬──────────────────────────────────────────────────────────┐   │
│  │          │                                                          │   │
│  │  SIDEBAR │              MAIN CONTENT                                │   │
│  │  240px   │              (flex: 1)                                   │   │
│  │          │                                                          │   │
│  │  #FFFFFF │              #EFEEEA (Light Base)                        │   │
│  │          │                                                          │   │
│  │          │  ┌────────────────────────────────────────────────────┐ │   │
│  │          │  │  PAGE HEADER                                       │ │   │
│  │          │  │  Título + Breadcrumb + Actions                     │ │   │
│  │          │  └────────────────────────────────────────────────────┘ │   │
│  │          │                                                          │   │
│  │          │  ┌────────────────────────────────────────────────────┐ │   │
│  │          │  │                                                    │ │   │
│  │          │  │  CONTENT AREA                                      │ │   │
│  │          │  │  Cards em #FFFFFF com shadow-card                  │ │   │
│  │          │  │                                                    │ │   │
│  │          │  │  Padding: 24px (desktop)                           │ │   │
│  │          │  │  Gap entre cards: 16px                             │ │   │
│  │          │  │                                                    │ │   │
│  │          │  └────────────────────────────────────────────────────┘ │   │
│  │          │                                                          │   │
│  └──────────┴──────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Componentes

### 5.1 Buttons

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BUTTONS                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRIMARY (CTA principal - Amarelo Exímia)                                   │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │   Criar Estratégia    │  │   Criar Estratégia    │  ← hover             │
│  └───────────────────────┘  └───────────────────────┘                      │
│  bg: #FDBE66                 bg: #FDB347                                   │
│  text: #1A1A1A (grafite)     shadow: shadow-glow                           │
│  border-radius: 8px                                                         │
│  padding: 10px 20px                                                         │
│  font-weight: 600                                                           │
│                                                                             │
│  SECONDARY (Ações secundárias)                                              │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │      Cancelar         │  │      Cancelar         │  ← hover             │
│  └───────────────────────┘  └───────────────────────┘                      │
│  bg: #FFFFFF                 bg: #F9FAFB                                   │
│  border: 1px solid #E5E5E5   border: 1px solid #D1D5DB                     │
│  text: #6B6B6B               text: #1A1A1A                                 │
│                                                                             │
│  GHOST (Links em contexto)                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │      Ver mais         │  │      Ver mais         │  ← hover             │
│  └───────────────────────┘  └───────────────────────┘                      │
│  bg: transparent             bg: #F3F4F6                                   │
│  text: #6B6B6B               text: #1A1A1A                                 │
│                                                                             │
│  DESTRUCTIVE (Ações perigosas)                                              │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │       Excluir         │  │       Excluir         │  ← hover             │
│  └───────────────────────┘  └───────────────────────┘                      │
│  bg: #FEF2F2                 bg: #FEE2E2                                   │
│  text: #EF4444               border: 1px solid #EF4444                     │
│                                                                             │
│  ICON BUTTON                                                                │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                                        │
│  │ ⚙   │  │ ↗   │  │ ↻   │  │ ×   │                                        │
│  └─────┘  └─────┘  └─────┘  └─────┘                                        │
│  40x40px, border-radius: 8px                                               │
│                                                                             │
│  SIZES                                                                      │
│  ┌────────┐  ┌──────────────┐  ┌────────────────────┐                      │
│  │  SM    │  │     MD       │  │        LG          │                      │
│  └────────┘  └──────────────┘  └────────────────────┘                      │
│  h: 32px      h: 40px          h: 48px                                     │
│  px: 12px     px: 16px         px: 24px                                    │
│  text: 13px   text: 14px       text: 16px                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Input Fields

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INPUT FIELDS                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Text Input                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Label *                                               (text-primary) │   │
│  │ ┌───────────────────────────────────────────────────────────────┐   │   │
│  │ │ Placeholder text...                               (text-tertiary) │   │
│  │ └───────────────────────────────────────────────────────────────┘   │   │
│  │ Helper text                                        (text-secondary) │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Especificações:                                                            │
│  - bg: #FFFFFF                                                              │
│  - border: 1px solid #E5E5E5                                               │
│  - border-radius: 8px                                                       │
│  - padding: 10px 12px                                                       │
│  - font-size: 14px                                                          │
│                                                                             │
│  Estados:                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ Default          │  │ Focus            │  │ Error            │          │
│  │ ──────────────── │  │ ──────────────── │  │ ──────────────── │          │
│  │ border: #E5E5E5  │  │ border: #FDBE66  │  │ border: #EF4444  │          │
│  │                  │  │ shadow: glow     │  │ bg: #FEF2F2      │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                             │
│  Textarea                                                                   │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ Descrição                                                          │     │
│  │ ┌─────────────────────────────────────────────────────────────┐   │     │
│  │ │                                                             │   │     │
│  │ │ Texto longo aqui...                                         │   │     │
│  │ │                                                             │   │     │
│  │ │                                              200 / 500 chars│   │     │
│  │ └─────────────────────────────────────────────────────────────┘   │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Select / Dropdown                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ Dimensão BSC                                                       │     │
│  │ ┌─────────────────────────────────────────────────────────────┐   │     │
│  │ │ Selecione uma opção                                       ▾ │   │     │
│  │ └─────────────────────────────────────────────────────────────┘   │     │
│  │ ┌─────────────────────────────────────────────────────────────┐   │     │
│  │ │ ⬤ Financeira                                    (se ativo)  │   │     │
│  │ │ ○ Cliente / Mercado                                         │   │     │
│  │ │ ○ Processos Internos                                        │   │     │
│  │ │ ○ Aprendizado e Crescimento                                 │   │     │
│  │ └─────────────────────────────────────────────────────────────┘   │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Cards

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CARDS                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Especificações Base:                                                       │
│  - bg: #FFFFFF                                                              │
│  - border-radius: 12px                                                      │
│  - shadow: shadow-card                                                      │
│  - padding: 20px                                                            │
│                                                                             │
│  BSC Health Card                                                            │
│  ┌─────────────────────────────┐                                            │
│  │ ○ FINANCEIRA                │  Header: thin icon + título               │
│  │ ─────────────────────────── │  Divisor: 1px #E5E5E5                     │
│  │                             │                                           │
│  │      ╭───────╮              │  Círculo de progresso:                    │
│  │     ╱   92%   ╲             │  - Stroke: #FDBE66 (>80%)                 │
│  │    │          │             │  - Stroke: #FDBE66 (60-80%)               │
│  │     ╲        ╱              │  - Stroke: #EF4444 (<60%)                 │
│  │      ╰───────╯              │                                           │
│  │                             │                                           │
│  │ Drivers: 1    Táticas: 3   │  Stats: text-secondary                    │
│  │                             │                                           │
│  │ [        Detalhar        ] │  Botão ghost                              │
│  └─────────────────────────────┘                                            │
│                                                                             │
│  Initiative Card                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 01.01 Projeto Strangler Fig                                  [⋮]   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ Owner: @Hugo          Jan - Jun 2026          Status: ● At Risk     │   │
│  │                                                                      │   │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45%            │   │
│  │                                                                      │   │
│  │ Progress bar: bg #E5E5E5, fill #FDBE66                              │   │
│  │ Fases: 2/5 concluídas                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  AI Suggestion Card                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ◇ SUGESTÃO DE IA                                     Confiança: 92% │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ ○ Driver: "Arquitetura AI-First"                                    │   │
│  │                                                                      │   │
│  │ Dimensão: Processos  │  Deriva de: Desafio #1                       │   │
│  │                                                                      │   │
│  │ Descrição: Modernizar a stack tecnológica...                        │   │
│  │                                                                      │   │
│  │ ┌───────────┐  ┌───────────┐  ┌───────────┐                        │   │
│  │ │ ⬤ Aceitar │  │ ○ Editar  │  │ ○ Rejeitar│                        │   │
│  │ └───────────┘  └───────────┘  └───────────┘                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  border-left: 3px solid #FDBE66                                            │
│                                                                             │
│  SWOT Item Card (Sticky Note style)                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                          │
│  │ FORÇA               │  │ FRAQUEZA            │                          │
│  │ ─────────────────── │  │ ─────────────────── │                          │
│  │ Time técnico        │  │ Dependência de      │                          │
│  │ experiente          │  │ cliente único       │                          │
│  │              [×]    │  │              [×]    │                          │
│  └─────────────────────┘  └─────────────────────┘                          │
│  border-left: 3px #22C55E  border-left: 3px #EF4444                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Status Badges & Progress

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STATUS BADGES & INDICATORS                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Status Badges (Pills)                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ ○ Pendente  │ │ ○ Planejado │ │ ● On Track  │ │ ● At Risk   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  bg: #F3F4F6     bg: #EFF6FF     bg: #F0FDF4     bg: #FFFBEB              │
│  text: #6B6B6B   text: #3B82F6   text: #22C55E   text: #FDBE66            │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐                                           │
│  │ ● Off Track │ │ ✓ Concluído │                                           │
│  └─────────────┘ └─────────────┘                                           │
│  bg: #FEF2F2     bg: #EFF6FF                                               │
│  text: #EF4444   text: #3B82F6                                             │
│                                                                             │
│  border-radius: 9999px (pill)                                              │
│  padding: 4px 10px                                                         │
│  font-size: 12px                                                           │
│  font-weight: 500                                                          │
│                                                                             │
│  Progress Bar                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45%            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  Track: bg #E5E5E5, height 8px, border-radius 4px                          │
│  Fill: #FDBE66 (ou cor do status)                                          │
│                                                                             │
│  Circular Progress (Ring)                                                   │
│       ╭───────╮                                                             │
│      ╱         ╲       Tamanhos: 64px (sm), 96px (md), 128px (lg)          │
│     │    92%    │      Stroke width: 8px                                   │
│      ╲         ╱       Track: #E5E5E5                                      │
│       ╰───────╯        Fill: baseado no status                             │
│                                                                             │
│  Confidence Badge                                                           │
│  ┌─────────────────┐                                                        │
│  │ Confiança: 92%  │  bg: #F0FDF4 (>80%), #FFFBEB (60-80%), #FEF2F2 (<60) │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 AI Panel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI PANEL                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Floating AI Panel (aparece contextualmente)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ◇ StratOS AI                                                  [×]   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ Análise ou sugestão da IA aparece aqui com formatação               │   │
│  │ Markdown suportada.                                                 │   │
│  │                                                                      │   │
│  │ • Item 1                                                            │   │
│  │ • Item 2                                                            │   │
│  │                                                                      │   │
│  │ ┌───────────────┐  ┌───────────────┐                               │   │
│  │ │ ⬤ Primária    │  │ ○ Secundária  │                               │   │
│  │ └───────────────┘  └───────────────┘                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Especificações:                                                            │
│  - bg: #FFFFFF                                                              │
│  - border-left: 3px solid #FDBE66                                          │
│  - shadow: shadow-xl                                                        │
│  - border-radius: 12px                                                      │
│                                                                             │
│  AI Inline Feedback (score em tempo real)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Visão                                                                │   │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │ │ Ser a maior empresa de...                                       │ │   │
│  │ └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                      │   │
│  │ ◇ Clareza: ████████░░ 80%                                           │   │
│  │   ⚠ "Considere ser mais específico sobre o mercado-alvo"            │   │
│  │   [○ Ver 3 Sugestões]                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  AI Loading State                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ◇ StratOS AI está analisando...                                     │   │
│  │                                                                      │   │
│  │        ○ ○ ○  (loading dots com #FDBE66)                            │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  AI Briefing Card (War Room)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ◇ BRIEFING DO DIA (13 Jan 2026)                          [Expandir] │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ ● Deploy Frequency atingiu 6/semana (acima do target)               │   │
│  │ ⚠ Latência P95 subiu 25% - correlação: novo serviço de auth        │   │
│  │ ○ Previsão: Fase 03.01.03 tem 78% chance de atrasar                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Ícones IA: usar ◇ (losango) como símbolo de AI no sistema                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.6 Navigation Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Breadcrumb                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ StratOS  /  The Forge  /  Drivers  /  Driver 01                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  text-secondary para links, text-primary para current                      │
│  separador: /                                                              │
│                                                                             │
│  Step Indicator (Wizard)                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  [1]────[2]────[3]────[4]────[5]────[6]                             │   │
│  │ SWOT  North  Dimen  Driv  Init   Metas                              │   │
│  │        Star  sões   ers   iat.                                      │   │
│  │                                                                      │   │
│  │  ● completed: #22C55E (verde) com check                             │   │
│  │  ⬤ current: #FDBE66 (amarelo) com número, maior                     │   │
│  │  ○ pending: #E5E5E5 (cinza) outline com número                      │   │
│  │                                                                      │   │
│  │  Linha conectora: 2px #E5E5E5, #22C55E quando completo              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Tab Navigation (View Switcher)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [⬤ Árvore]  [○ Kanban]  [○ Gantt]                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  active: bg #FDBE66, text #1A1A1A                                          │
│  inactive: bg transparent, text #6B6B6B                                    │
│  container: bg #F3F4F6, border-radius 8px, padding 4px                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.7 Modals & Toast

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MODALS & TOAST                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Modal                                                                      │
│  ┌─────────────────────────────────────────────────┐                        │
│  │ Título do Modal                            [×]  │                        │
│  │ ───────────────────────────────────────────────  │                        │
│  │                                                 │                        │
│  │  Conteúdo do modal aqui...                      │                        │
│  │                                                 │                        │
│  │  ───────────────────────────────────────────── │                        │
│  │                                                 │                        │
│  │              ┌───────────┐  ┌───────────┐      │                        │
│  │              │ Cancelar  │  │ ⬤ Salvar  │      │                        │
│  │              └───────────┘  └───────────┘      │                        │
│  └─────────────────────────────────────────────────┘                        │
│                                                                             │
│  Backdrop: rgba(0,0,0,0.4)                                                 │
│  Modal: bg #FFFFFF, shadow-xl, border-radius 12px                          │
│                                                                             │
│  Toast Notifications (top-right)                                            │
│                                                                             │
│  Success                                                                    │
│  ┌─────────────────────────────────────────────────┐                        │
│  │ ● Iniciativa salva com sucesso             [×]  │                        │
│  └─────────────────────────────────────────────────┘                        │
│  border-left: 3px #22C55E                                                  │
│                                                                             │
│  Warning                                                                    │
│  ┌─────────────────────────────────────────────────┐                        │
│  │ ⚠ Você tem alterações não salvas           [×]  │                        │
│  └─────────────────────────────────────────────────┘                        │
│  border-left: 3px #FDBE66                                                  │
│                                                                             │
│  Error                                                                      │
│  ┌─────────────────────────────────────────────────┐                        │
│  │ ✗ Erro ao salvar. Tente novamente.         [×]  │                        │
│  └─────────────────────────────────────────────────┘                        │
│  border-left: 3px #EF4444                                                  │
│                                                                             │
│  Base toast: bg #FFFFFF, shadow-lg, border-radius 8px                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Ícones

### 6.1 Estilo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ÍCONES                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Biblioteca recomendada: Lucide React (thin outline)                       │
│                                                                             │
│  Estilo:                                                                    │
│  - Stroke width: 1.5px (thin)                                              │
│  - Cor padrão: #6B6B6B (text-secondary)                                    │
│  - Cor ativo: #FDBE66 (amarelo) ou #1A1A1A (grafite)                       │
│  - Tamanhos: 16px (sm), 20px (md), 24px (lg)                               │
│                                                                             │
│  Navegação:                                                                 │
│  ○ LayoutDashboard   (War Room)                                            │
│  ○ Hammer            (The Forge)                                           │
│  ○ ListTodo          (Execution Hub)                                       │
│  ○ Scale             (Governance)                                          │
│  ○ Settings          (Configurações)                                       │
│  ○ HelpCircle        (Ajuda)                                               │
│                                                                             │
│  Status:                                                                    │
│  ○ CheckCircle       (Concluído - verde)                                   │
│  ○ AlertCircle       (At Risk - amarelo)                                   │
│  ○ XCircle           (Off Track - vermelho)                                │
│  ○ Clock             (Pendente - cinza)                                    │
│                                                                             │
│  Ações:                                                                     │
│  ○ Plus              (Adicionar)                                           │
│  ○ Edit              (Editar)                                              │
│  ○ Trash             (Excluir)                                             │
│  ○ Download          (Exportar)                                            │
│  ○ Share             (Compartilhar)                                        │
│  ○ MoreVertical      (Menu)                                                │
│                                                                             │
│  AI:                                                                        │
│  ◇ (losango)         Símbolo de IA no sistema                              │
│  ○ Sparkles          Sugestões/Magic                                       │
│  ○ Brain             Análise inteligente                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Animações

```typescript
// animations.ts - Framer Motion

export const animations = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Card hover (sutil)
  cardHover: {
    scale: 1.01,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: { duration: 0.15 }
  },

  // AI panel slide
  aiPanelEnter: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Progress bar fill
  progressFill: {
    initial: { width: 0 },
    animate: { width: 'var(--progress)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // Toast notification
  toastEnter: {
    initial: { opacity: 0, y: -10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.15 }
  },

  // Fade in (generic)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  }
}

// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

---

## 8. Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#EFEEEA',
        'bg-surface': '#FFFFFF',

        // Accent (único)
        'accent': '#FDBE66',
        'accent-hover': '#FDB347',
        'accent-light': 'rgba(253, 190, 102, 0.12)',

        // Text
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        'text-tertiary': '#9CA3AF',

        // Borders
        'border-default': '#E5E5E5',
        'border-hover': '#D1D5DB',

        // Status
        'status-success': '#22C55E',
        'status-warning': '#FDBE66',
        'status-error': '#EF4444',
        'status-info': '#3B82F6',

        // BSC Dimensions
        'bsc-financial': '#FDBE66',
        'bsc-customer': '#3B82F6',
        'bsc-process': '#22C55E',
        'bsc-learning': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 0 3px rgba(253, 190, 102, 0.2)',
      },
    },
  },
}
```

---

## 9. Critérios de Aceite

- [ ] Todos os tokens de cor implementados conforme exímIA.OS
- [ ] Light mode como padrão (sem dark mode)
- [ ] Amarelo Exímia (#FDBE66) como única cor de destaque
- [ ] Sidebar 240px com estados corretos
- [ ] Cards com shadow-card sobre bg-base
- [ ] Ícones thin outline (Lucide)
- [ ] Border-radius 8-12px consistente
- [ ] Componentes documentados em Storybook
- [ ] Animações sutis e funcionais


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-specialist