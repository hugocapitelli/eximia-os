# Story PM2-002: Hero Carousel Refinement

## Story Info

**Story ID:** PM2-002
**Epic:** PM2 - Visual Refinement Package
**Priority:** P1
**Story Points:** 3
**Status:** Ready for Development

## User Story

**Como** usuário da Academy,
**Eu quero** um carrossel hero mais moderno e minimalista,
**Para que** a experiência visual seja mais elegante e profissional.

## Context

O HeroCarousel atual funciona mas tem problemas visuais:
- Botões de navegação sempre visíveis (devem aparecer só no hover)
- Indicadores de página fora do container
- Sem animação de slide na transição

Referência visual: Imagem 1 (Lendária hero)

## Current vs Target

### Current
```
[◀]  ┌──────────────────────────────┐  [▶]   ← Sempre visíveis
     │        Conteúdo              │
     └──────────────────────────────┘
                    ● ○ ○ ○                    ← Fora do container
```

### Target
```
┌──────────────────────────────────────────┐
│                                          │
│  [◀]      Conteúdo               [▶]    │   ← Só no hover
│                                          │
│                 ● ○ ○ ○                  │   ← Dentro, bottom
└──────────────────────────────────────────┘
```

## Acceptance Criteria

### AC1: Botões Hover-Only
- [ ] Botões prev/next invisíveis por default (opacity-0)
- [ ] Aparecem com fade no hover do container (opacity-100)
- [ ] Transição suave: `transition-opacity duration-300`
- [ ] Botões com background semi-transparente para melhor visibilidade

### AC2: Indicadores Dentro do Container
- [ ] Indicadores posicionados `absolute bottom-6 left-1/2 -translate-x-1/2`
- [ ] Dentro do container do carrossel
- [ ] Dot ativo: `bg-white w-6` (pill shape)
- [ ] Dots inativos: `bg-white/30 hover:bg-white/50`
- [ ] Gap entre dots: `gap-2`

### AC3: Animação de Slide
- [ ] Transição slide-in ao mudar de curso
- [ ] Direção: slide-right quando avança, slide-left quando volta
- [ ] Duração: 500ms ease-out
- [ ] Conteúdo anterior sai enquanto novo entra

### AC4: Visual Minimalista
- [ ] Remover elementos visuais desnecessários
- [ ] Gradiente de fundo mais sutil
- [ ] Tipografia limpa (título grande, subtítulo menor)
- [ ] Botões CTA discretos até hover

## Technical Implementation

### State Changes
```typescript
// Adicionar ao HeroCarousel.tsx
const [isHovering, setIsHovering] = useState(false);
const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
```

### Container with Hover Detection
```tsx
<div
  className="relative w-full overflow-hidden rounded-2xl"
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>
```

### Navigation Buttons
```tsx
<button
  onClick={handlePrev}
  className={`
    absolute left-4 top-1/2 -translate-y-1/2 z-20
    p-3 rounded-full bg-black/40 backdrop-blur-sm
    text-white/80 hover:text-white hover:bg-black/60
    transition-all duration-300
    ${isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
  `}
>
  <ChevronLeft className="w-6 h-6" />
</button>
```

### Indicators Inside Container
```tsx
{/* Indicators - INSIDE container, bottom */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
  {courses.map((_, idx) => (
    <button
      key={idx}
      onClick={() => goToSlide(idx)}
      className={`
        h-2 rounded-full transition-all duration-300
        ${idx === currentIndex
          ? 'bg-white w-6'
          : 'bg-white/30 hover:bg-white/50 w-2'
        }
      `}
      aria-label={`Ir para slide ${idx + 1}`}
    />
  ))}
</div>
```

### Slide Animation (index.html)
```javascript
// Adicionar ao tailwind.config.keyframes
slideInRight: {
  '0%': { transform: 'translateX(100%)', opacity: '0' },
  '100%': { transform: 'translateX(0)', opacity: '1' },
},
slideInLeft: {
  '0%': { transform: 'translateX(-100%)', opacity: '0' },
  '100%': { transform: 'translateX(0)', opacity: '1' },
},

// Adicionar ao animation
'slide-in-right': 'slideInRight 0.5s ease-out forwards',
'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
```

### Slide Content with Animation
```tsx
<div
  key={currentCourse.id}
  className={`
    ${slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
  `}
>
  {/* Course content */}
</div>
```

## Files to Modify

| File | Changes |
|------|---------|
| `components/academy/HeroCarousel.tsx` | Hover state, indicators position, slide animation |
| `index.html` | Add slideInRight/slideInLeft keyframes |

## Testing Checklist

- [ ] Hover sobre carrossel mostra botões
- [ ] Mouse out esconde botões com fade
- [ ] Indicadores visíveis dentro do container
- [ ] Click em indicador muda slide
- [ ] Animação de slide funciona ao avançar
- [ ] Animação de slide funciona ao voltar
- [ ] Autoplay continua funcionando
- [ ] Touch swipe funciona no mobile
- [ ] Responsividade mantida

## Definition of Done

- [ ] Botões aparecem apenas no hover
- [ ] Indicadores dentro do container (bottom)
- [ ] Animação slide em transições
- [ ] Visual minimalista alcançado
- [ ] Sem regressões de funcionalidade
- [ ] Testado em desktop e mobile

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 2-3 horas
