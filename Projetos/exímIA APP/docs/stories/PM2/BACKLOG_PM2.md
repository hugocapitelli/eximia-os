# PM2 Backlog: Visual Refinement Package

## Epic Overview

**Epic ID:** PM2
**Epic Name:** Visual Refinement & Admin Mode
**Total Story Points:** 29
**Status:** Ready for Development
**Created:** 2026-01-29

## Story Summary

| ID | Story | Points | Priority | Status | Dependencies |
|----|-------|--------|----------|--------|--------------|
| PM2-007 | Skill Tree View Fix | 2 | P0 | Ready | - |
| PM2-001 | Admin Mode Complete | 8 | P0 | Ready | - |
| PM2-002 | Hero Carousel Refinement | 3 | P1 | Ready | - |
| PM2-003 | Trilhas Full-Width Redesign | 3 | P1 | Ready | - |
| PM2-004 | Biblioteca Minimalista | 5 | P1 | Ready | - |
| PM2-005 | Reading Page Redesign | 5 | P1 | Ready | - |
| PM2-006 | DS Library Editor Mode | 3 | P2 | Ready | PM2-001 |

## Implementation Order (Recommended)

### Sprint 1 (14 points)

```
Phase 1: Quick Wins
├── PM2-007: Skill Tree Fix (2 pts) ← Debug, rápido
├── PM2-002: Hero Carousel (3 pts) ← Visual impact
└── PM2-003: Trilhas Full-Width (3 pts) ← Simplificação

Phase 2: Foundation
└── PM2-001: Admin Mode (8 pts) ← Base para outros
    ├── hooks/useAdminMode.ts enhancement
    ├── AdminPanel component
    ├── AdminHeader component
    └── Basic managers (Course, Track)
```

### Sprint 2 (15 points)

```
Phase 3: Major Refactors
├── PM2-004: Biblioteca Minimalista (5 pts)
│   ├── LibraryHero component
│   ├── Horizontal/Collection cards
│   ├── AuthorDetailPage
│   └── JourneyLibrary refactor
│
├── PM2-005: Reading Page (5 pts)
│   ├── Floating header
│   ├── TOC glassmorphism right
│   └── Theme/font controls
│
└── PM2-006: DS Library Editor (3 pts)
    └── Apply glassmorphism pattern
```

## File Changes Summary

### New Files (18)

```
components/admin/
├── AdminPanel.tsx
├── AdminHeader.tsx
├── CourseManager.tsx
├── TrackManager.tsx
├── FeaturedManager.tsx
├── BookManager.tsx
└── AuthorManager.tsx

components/academy/
└── TrackCardFullWidth.tsx

components/library/
├── LibraryHero.tsx
├── BookCardHorizontal.tsx
├── CollectionCard.tsx
├── CategoryChips.tsx
└── AuthorCard.tsx

components/pages/
├── AdminAcademyStudio.tsx
├── AdminLibraryEditor.tsx
├── AdminDSManager.tsx
└── AuthorDetailPage.tsx
```

### Modified Files (11)

```
hooks/
└── useAdminMode.ts (enhance)

components/academy/
└── HeroCarousel.tsx (hover, indicators, animation)

components/reading/
├── ReadingPage.tsx (major layout update)
├── ReadingHeader.tsx (floating pill)
└── TOCCard.tsx (right side, glassmorphism)

components/pages/
├── AcademyDashboard.tsx (use TrackCardFullWidth)
├── AcademySkillTree.tsx (debug fixes)
├── JourneyLibrary.tsx (major refactor)
├── BookDetailPage.tsx (style update)
└── DesignSystemLibrary.tsx (glassmorphism)

App.tsx (new routes)
index.html (new animations)
```

## Visual Patterns Established

### Glassmorphism (Admin/Editor)
```css
background: rgba(245, 158, 11, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(245, 158, 11, 0.2);
border-radius: 16px;
```

### Glassmorphism (TOC/Cards)
```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Color Differentiation
```
Explorar: amber (#f59e0b)
Favoritos: violet (#8B5CF6)
Admin: amber with glow
```

## Definition of Done (Epic)

- [ ] PM2-007: Skill Tree view funciona corretamente
- [ ] PM2-001: Admin Mode com Academy Studio, Library Editor, DS Manager
- [ ] PM2-002: Hero Carousel minimalista com hover e slide
- [ ] PM2-003: Trilhas full-width empilhadas
- [ ] PM2-004: Biblioteca diferenciada (Explorar vs Favoritos)
- [ ] PM2-005: Reading Page com TOC glassmorphism à direita
- [ ] PM2-006: DS Library Editor com visual consistente
- [ ] Visual minimalista em toda a aplicação
- [ ] Responsivo mobile/tablet/desktop
- [ ] Sem regressões de funcionalidade

---

**Arquiteto:** Aria
**Scrum Master:** River
**Data:** 2026-01-29
