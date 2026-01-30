# Story PM1-001: Hero Carousel

## Story Info

**Story ID:** PM1-001
**Epic:** PM1 - UX Enhancement Package
**Priority:** P1 (Alta)
**Story Points:** 5
**Status:** Ready for Development
**Depende de:** PM1-006 (Admin Sidebar - para controles admin do carrossel)

## User Story

**Como** usuário da Academy,
**Eu quero** ver um carrossel de cursos recomendados no hero,
**Para que** eu descubra rapidamente conteúdos relevantes selecionados pelos administradores.

## Context

Atualmente o hero da Academy exibe um card estático "Construa o Futuro". Este deve ser transformado em um carrossel dinâmico com cursos destacados, definidos pelo administrador.

## UX Specifications (Uma)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  [Hero Card Slide 1]                                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ CURSO DESTACADO                                   │  │
│  │ ══════════════════                                │  │
│  │ Deep Work: Foco Total                             │  │
│  │ Domine a arte da concentração profunda            │  │
│  │                                                   │  │
│  │ [🎓 12 Lições] [⏱ 4h] [⭐ 4.9]                   │  │
│  │                                                   │  │
│  │ [▶ Iniciar Curso]  [♡ Favoritar]                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│            ● ○ ○ ○ ○  (indicadores)                    │
│                                                         │
│  [‹]                                           [›]      │
└─────────────────────────────────────────────────────────┘
```

### Behavior Specifications

| Feature | Specification |
|---------|---------------|
| Auto-play | Sim, 5 segundos por slide |
| Pause on hover | Sim |
| Touch swipe | Sim (mobile) |
| Keyboard nav | ← → arrows |
| Indicators | Dots clicáveis |
| Transition | Fade + slide (300ms ease-out) |
| Loop | Infinito |

### Visual Design

```css
/* Hero Card */
.hero-card {
  background: linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%);
  border: 1px solid #1F1F22;
  border-radius: 1rem;
  padding: 2.5rem;
  min-height: 280px;
}

/* Active indicator */
.indicator-active {
  background: white;
  box-shadow: 0 0 15px rgba(255,255,255,0.4);
}

/* Navigation arrows */
.nav-arrow {
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(8px);
  border: 1px solid #1F1F22;
}
```

### Component Structure

```typescript
interface HeroCarouselProps {
  courses: FeaturedCourse[];
  autoPlayInterval?: number; // default 5000ms
  onCourseClick: (courseId: string) => void;
}

interface FeaturedCourse {
  id: string;
  title: string;
  subtitle: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  thumbnail?: string;
  isFeatured: boolean;
  featuredOrder: number; // admin-defined order
}
```

### Admin Control

```typescript
// Em editor mode, admin pode:
interface AdminCarouselControls {
  addCourse: () => void;        // Selecionar curso para destacar
  removeCourse: (id: string) => void;
  reorderCourses: (ids: string[]) => void;
  setAutoPlay: (enabled: boolean) => void;
  setInterval: (ms: number) => void;
}
```

## Acceptance Criteria

- [ ] Hero exibe carrossel com cursos destacados
- [ ] Auto-play funciona com intervalo de 5 segundos
- [ ] Pausa no hover
- [ ] Navegação por setas (teclado e mouse)
- [ ] Indicadores (dots) clicáveis
- [ ] Transição suave (fade + slide)
- [ ] Loop infinito
- [ ] Responsivo em mobile (touch swipe)
- [ ] Admin pode adicionar/remover cursos do carrossel
- [ ] Admin pode reordenar cursos (drag & drop)
- [ ] Fallback para card estático se não houver cursos destacados

## Technical Tasks

- [ ] Criar componente `HeroCarousel.tsx`
- [ ] Implementar hook `useCarousel` para lógica de auto-play
- [ ] Adicionar estado `featuredCourses` ao AcademyDashboard
- [ ] Implementar controles admin no editor mode
- [ ] Adicionar animações CSS para transições
- [ ] Implementar touch swipe para mobile
- [ ] Adicionar keyboard navigation
- [ ] Testar acessibilidade (aria-labels, focus management)

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/academy/HeroCarousel.tsx` | Create |
| `components/pages/AcademyDashboard.tsx` | Modify |
| `hooks/useCarousel.ts` | Create |
| `constants.ts` | Add FEATURED_COURSES mock |

## Definition of Done

- [ ] Código implementado e funcionando
- [ ] Revisão de código aprovada
- [ ] Testes manuais passando
- [ ] Responsividade testada (mobile/tablet/desktop)
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
