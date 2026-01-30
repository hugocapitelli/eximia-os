# Epic PM1: UX Enhancement Package - exímIA OS

## Epic Overview

**Epic ID:** PM1
**Epic Name:** UX Enhancement Package - Premium Visual Overhaul
**Sprint:** Sprint 7
**Priority:** High
**Status:** Ready for Development

## Description

Este pacote de melhorias visa elevar a experiência do usuário do exímIA OS para um padrão premium, com foco em:
- Engajamento visual através de carrosséis e cards modernos
- Gamificação com visual RPG na Skill Tree
- Redesign completo da Biblioteca seguindo referência Lendária
- Experiência de leitura imersiva fullscreen
- Painel administrativo estruturado
- DS Library funcional com componentes atomic design

## Business Value

- **Aumento de engajamento**: Carrossel hero e cards visuais aumentam tempo na plataforma
- **Retenção**: Gamificação (Skill Tree RPG) incentiva progressão contínua
- **Usabilidade**: Leitura fullscreen e navegação intuitiva reduzem atrito
- **Escalabilidade**: Admin panel e DS Library permitem crescimento sustentável

## Stories neste Epic

| ID | Nome | Prioridade | Story Points | Status | Depende de |
|----|------|------------|--------------|--------|------------|
| PM1-006 | Admin Sidebar Section | P0 | 3 | Ready | - |
| PM1-001 | Hero Carousel | P1 | 5 | Ready | PM1-006 |
| PM1-004 | Biblioteca Visual Redesign | P1 | 8 | Ready | - |
| PM1-005 | Fullscreen Reading Page | P1 | 5 | Ready | PM1-004 |
| PM1-002 | Trilhas Redesign | P2 | 5 | Ready | PM1-006 |
| PM1-007 | DS Library Functional | P2 | 8 | Ready | PM1-006 |
| PM1-003 | Skill Tree RPG Visual | P3 | 8 | Ready | - |

## Story Dependencies

```
PM1-006 (Admin Sidebar) ──┬──► PM1-001 (Hero Carousel)
   [FOUNDATION]           ├──► PM1-002 (Trilhas Redesign)
                          └──► PM1-007 (DS Library)

PM1-004 (Biblioteca) ─────────► PM1-005 (Reading Fullscreen)
```

## Priority Matrix

### P0 - Foundation (Implementar PRIMEIRO)
- **PM1-006**: Admin Sidebar - **BLOCKER** para PM1-001, PM1-002, PM1-007 (editor modes dependem desta infra)

### P1 - Alta Prioridade (Após P0)
- **PM1-001**: Hero Carousel - Alto impacto visual, primeira impressão
- **PM1-004**: Biblioteca Visual - Core feature com referência visual clara
- **PM1-005**: Reading Fullscreen - Experiência de uso diária (depende de PM1-004)

### P2 - Média Prioridade
- **PM1-002**: Trilhas Redesign - Melhoria visual significativa
- **PM1-007**: DS Library - Valor técnico a longo prazo

### P3 - Menor Prioridade
- **PM1-003**: Skill Tree RPG - Complexidade alta, MVP primeiro recomendado

## Design System Context

```
Theme: Dark Mode Premium
Base: #050505
Accent: amber (amber-500, amber-400)
Grays: zinc scale (zinc-100 to zinc-900)
Borders: #1F1F22
Typography:
  - Headers: text-xs font-bold tracking-widest uppercase
  - Body: font-serif for reading content
Effects:
  - Glassmorphism: backdrop-blur-md bg-opacity-80
  - Shadows: shadow-[0_0_15px_rgba(255,255,255,0.4)] for active states
```

## Technical Dependencies

- React 18 with TypeScript
- Tailwind CSS v3.x
- Lucide React icons
- Existing component library (atoms, molecules, organisms)
- Local state management with useState/useRef

## Acceptance Criteria (Epic Level)

- [ ] Todos os 7 stories implementados e testados
- [ ] Consistência visual com DS existente
- [ ] Responsividade mobile-first (breakpoints: 640px, 1024px, 1280px)
- [ ] Performance: < 100ms para transições, < 16ms per frame (60fps)
- [ ] Acessibilidade: WCAG AA compliance (contraste, focus, aria-labels)
- [ ] Zero regressões em features existentes
- [ ] Keyboard navigation funcional em todas as features
- [ ] Persistência de dados funcional (localStorage → Supabase migration path)

## UX Review

Todas as stories passaram por revisão UX com Uma (UX Design Expert).
Especificações detalhadas incluem wireframes, código de exemplo e métricas.

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
