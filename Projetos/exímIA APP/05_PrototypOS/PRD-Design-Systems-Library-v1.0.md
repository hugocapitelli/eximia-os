# PRD — Design Systems Library
**Módulo:** 05_PrototypOS (Extension)
**Versão:** 1.0
**Data:** 26 Janeiro 2026
**Status:** 📋 **PROPOSTA** — Baseada em Alan's Demo

---

## Sumário Executivo

> **Inspiration:** Demo de Alan (YouTube 1:42:00-1:46:00) mostrando biblioteca organizada de design systems reutilizáveis.

A **Design Systems Library** é uma proposta de organização centralizada de design systems criados no PrototypOS, permitindo que toda equipe exímIA tenha acesso a templates, tokens e componentes validados.

**Filosofia:** *"Build once, reuse everywhere."*

**Diferencial:** Design systems não ficam presos em projetos individuais — vivem em biblioteca compartilhada e evolutiva.

**Estratégia:** Reduzir tempo de setup de novos projetos de horas para minutos através de design systems pré-configurados.

**Nota:** ✅ PRD atualizado com screenshots do vídeo de Alan (26/01/2026). UI/UX baseada na implementação real do LendárIA.OS Design System.

---

## Casos de Uso

### Startup lançando MVP
**Sem Library:** 10h configurando DS do zero
**Com Library:** 5 min selecionando DS pronto
**Ganho:** 99% faster setup

### Agência com múltiplos clientes
**Sem Library:** 30h/ano criando DS repetidos
**Com Library:** 14h/ano (reutilização)
**Ganho:** 53% reduction

---

## Design System Real — LendárIA.OS (Observado)

### Tabs de Navegação

```
┌────────────────────────────────────────────────────────────────┐
│  [DESIGN SYSTEM]                                               │
│                                                                │
│  Tabs:                                                         │
│  ● Visão Geral                                                 │
│  ○ Identidade & Marca                                          │
│  ○ Tokens                                                      │
│  ○ Biblioteca UI                                               │
│  ○ Templates & Páginas                                         │
│  ○ Documentação                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1. Identidade Verbal Universal

**Observado no screenshot:**

```yaml
# FIVU v2.0 — Academia Lendár[IA]
title: "Identidade Verbal Universal"
subtitle: "A voz da Academia Lendár[IA]. Um framework vivo para comunicação
           institucional, fundamentado em documentos culturais, manifestos
           e princípios de liderança."
founder: "Alan Nicolas"
since: "15/01/2020"
corpus: "15.832 palavras"

# 1. Núcleo Identitário
missão:
  - "Unir e potencializar pessoas lendárias com IA para construírem
     soluções e negócios que imortalizem seu legado."

visão:
  - "Ser referência global em educação de IA generativa aplicada a
     negócios, com um portfólio de startups de sucesso internacional."

posicionamento:
  - "Somos um ecossistema de educação & inovação que potencializa pessoas
     a negócios com inteligência artificial generativa."

# 2. Arquétipos da Marca
arquétipos:
  rebelde:  # Primário
    motivação: "Desafiar o status quo e recusar a mediocridade."
    manifestação: "Enquanto muitos os chamam de loucos, nós os
                   reconhecemos como gênios."
  mago:  # Secundário
    motivação: "Transformar realidade e conhecimento em revolução."
    manifestação: "Alquimistas do conhecimento, arquitetos do impossível."
  sábio:  # Terciário
    motivação: "Buscar a verdade através da transparência radical."
    manifestação: "Contexto, não controle. Verdade, bondade e utilidade."
```

### 2. Cores Lendárias (Sistema de 8%)

**Observado:**

```
┌────────────────────────────────────────────────────────────────┐
│  Cores Lendárias.                                              │
│  Simples. Preciso. Funcional. A cor aparece apenas quando a   │
│  experiência sem comprometer a estética minimalista.           │
│                                                                │
│  A Regra dos 8%                                                │
│  Nada em excesso. Nada sem motivo.                             │
│  8% é o máximo que a cor pode ocupar em uma tela. Além da     │
│  Aplicação. O                                                  │
│  restante deve ser inspirado pelo background e tipografia.     │
│                                                                │
│  ◉ Escala Monocromática                                        │
│  Do branco ao preto, cada tom de cinza é calculado em          │
│  múltiplos de 8.                                               │
│                                                                │
│  ████████████████  ← Escala visual de 16 tons                  │
│  █ █ █ █ █ █ █ █                                               │
│  00 08 16 24 32 40 48 56 64 72 80 88 96 100% (preto)          │
│                                                                │
│  ◉◉ Cor Primária Ativa                                         │
│  [Temas: ▼ Descrição]                                          │
│  [Cores & Temas ▼]                                             │
│  [Espaçamentos ▼]                                              │
│  [Escala ▼]                                                    │
│  [Missão ▼]                                                    │
└────────────────────────────────────────────────────────────────┘
```

**Sistema de Cores:**
- **Monocromático:** 16 tons de cinza (0%, 8%, 16%, 24%, ..., 96%, 100%)
- **Regra dos 8%:** Cor ativa não pode ocupar mais de 8% da tela
- **Backgrounds:** Sempre em tons de cinza (nunca cor)
- **Tipografia:** Preto ou cinza escuro

### 3. Tipografia

**Observado:**

```
┌────────────────────────────────────────────────────────────────┐
│  Tipografia                                                    │
│  Uma dupla tipográfica projetada para máxima legibilidade.     │
│  Inter para UI (padrão SemiBold). Source Serif 4 para textos   │
│  longos.                                                       │
│                                                                │
│    Aa                           Aa                             │
│   Inter                    Source Serif 4                      │
│   Títulos, UI & Chamadas   Textos longos, parágrafos e citações│
│   Peso padrão para UI: SemiBold (600)                          │
│                        Fluídas & leitura suave                 │
│                                                                │
│  Escala Tipográfica                                            │
│                                                                │
│  Hero / Display                                                │
│  H1 / 64px / Bold         Academia Lendária                    │
│                                                                │
│  H1                                                            │
│  48px / Bold              Academia Lendária                    │
│                                                                │
│  H2 / 32px                Academia Lendária                    │
│  H3 / 24px                Academia Lendária                    │
│  H4 / 20px                Academia Lendária                    │
│  Body / 16px              Academia Lendária                    │
│  Caption / 14px           Academia Lendária                    │
└────────────────────────────────────────────────────────────────┘
```

**Escala Tipográfica:**
- Hero: 64px, Inter Bold
- H1: 48px, Inter Bold
- H2: 32px, Inter SemiBold
- H3: 24px, Inter SemiBold
- H4: 20px, Inter Medium
- Body: 16px, Source Serif 4 Regular
- Caption: 14px, Inter Regular

---

## Estrutura da Biblioteca (Proposta ExímIA OS)

```
Design_Systems_Library/
├── saas_platform/
│   ├── v1.0/
│   │   ├── tokens.json
│   │   │   ├── colors.json        ← Sistema de 8% inspirado em Alan
│   │   │   ├── typography.json    ← Inter + Source Serif 4
│   │   │   ├── spacing.json       ← Múltiplos de 8px
│   │   │   └── identity.yaml      ← FIVU (Identidade Verbal)
│   │   ├── components/
│   │   ├── templates/
│   │   ├── screenshots/
│   │   └── README.md
│   └── v2.0/
├── ecommerce/
├── marketing_website/
└── mobile_app/
```

---

## Metadata de Cada Design System

```yaml
name: "SaaS Platform Design System"
version: "1.0"
category: "Web Application"
tags: ["SaaS", "Dashboard", "B2B"]
use_cases: ["Harven.AI", "StratOS", "Agenda Cheia"]
tech_stack:
  framework: ["React", "Tailwind CSS"]

tokens:
  colors: 12
  typography_scales: 5
  spacing_scale: 8

components:
  atoms: 15
  molecules: 8
  organisms: 5

screenshots:
  - dashboard_light.png
  - dashboard_dark.png
```

---

## Fluxos de Uso

### 1. Criar projeto a partir de DS
1. User: "Novo Projeto" → "Usar Design System"
2. Busca: "SaaS Platform"
3. Preview com screenshots
4. Instancia DS (<1 minuto)
5. Projeto pronto

### 2. Salvar DS para Library
1. User termina DS no PrototypOS
2. "Salvar na Library"
3. Preenche metadata + screenshots
4. Validação automática
5. Publicado na biblioteca

### 3. Atualizar DS da Library
1. Library notifica: "v2.0 disponível"
2. User vê changelog
3. Escolhe: atualizar ou manter v1.0
4. Merge inteligente preserva customizações

---

## Implementation Plan

**Total: 34 hours**

- Phase 1: Infrastructure (8h)
- Phase 2: Library UI (12h)
- Phase 3: Publishing Flow (6h)
- Phase 4: Sync & Update (8h)

---

## Success Metrics

| Métrica | Target |
|---------|--------|
| **DS in Library** | ≥5 by Q2 2026 |
| **Projects using Library** | ≥60% of new projects |
| **Setup Time Reduction** | -90% (10h → <1h) |
| **Reuse Rate** | Each DS used in ≥2 projects |

---

## Próximos Passos

1. ⏳ Assistir vídeo do Alan (1:42:00-1:46:00) para capturar detalhes da UI
2. ⏳ Prototype UI no Figma
3. ⏳ Validar com time design
4. ⏳ Implementar MVP (Q2 2026)

---

## Decisão

**Status:** 📋 PROPOSTA — Aguardando revisão do vídeo do Alan

**Prioridade:** Média (após Connection Layer e Academy consolidados)

**Rationale:** Alta reusabilidade e ROI, mas não é bloqueador crítico para v5.0

---

## Referências

- **Inspiration:** Alan's demo (YouTube 1:42:00-1:46:00)
- [PRD-PrototypOS-v5.0.md](./PRD-PrototypOS-v5.0.md)
- [PRD-Design-System-v5.0.md](../00_Core/PRD-Design-System-v5.0.md)

---

*Design Systems Library v1.0 — Build Once, Reuse Everywhere*
*ExímIA OS — 2026*
