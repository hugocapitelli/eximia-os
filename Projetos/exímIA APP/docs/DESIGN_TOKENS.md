# ExímIA OS - Design Tokens Reference

**Versão:** 1.0.0
**Atualizado:** 26 Janeiro 2026
**Baseado em:** PRD-Design-System-v5.0.md

---

## Quick Reference

### Como usar

Os tokens estão disponíveis como CSS custom properties e classes Tailwind:

```tsx
// CSS Custom Property
<div style={{ color: 'var(--eximia-400)' }}>ExímIA Gold</div>

// Tailwind Class
<div className="bg-eximia-400 text-zinc-900">ExímIA Gold</div>
```

---

## 1. Color Tokens

### ExímIA Gold (Primary Brand)

| Token | Valor | Tailwind Class | Preview |
|-------|-------|----------------|---------|
| `--eximia-50` | #FFF9F0 | `bg-eximia-50` | Lightest |
| `--eximia-100` | #FEF0DC | `bg-eximia-100` | |
| `--eximia-200` | #FDE4C4 | `bg-eximia-200` | |
| `--eximia-300` | #FDD59A | `bg-eximia-300` | |
| `--eximia-400` | **#FDBF68** | `bg-eximia-400` | **Primary** |
| `--eximia-500` | #E5A850 | `bg-eximia-500` | |
| `--eximia-600` | #CC9340 | `bg-eximia-600` | |
| `--eximia-700` | #A67530 | `bg-eximia-700` | |
| `--eximia-800` | #805A25 | `bg-eximia-800` | |
| `--eximia-900` | #5C401A | `bg-eximia-900` | Darkest |

### Semantic Colors

| Token | Valor | Uso |
|-------|-------|-----|
| `--success` | #22c55e | Estados positivos, confirmações |
| `--warning` | #FDBF68 | Alertas, atenção (usa ExímIA Gold) |
| `--error` | #ef4444 | Erros, ações destrutivas |
| `--info` | #3b82f6 | Informação, links |

### Zinc Scale (Dark Mode Base)

| Token | Valor | Uso |
|-------|-------|-----|
| `--zinc-50` | #fafafa | Texto primário (dark mode) |
| `--zinc-400` | #a1a1aa | Texto muted |
| `--zinc-700` | #3f3f46 | Borders hover |
| `--zinc-800` | #27272a | Borders, cards |
| `--zinc-900` | #18181b | Card backgrounds |
| `--zinc-950` | #09090b | Page background |

---

## 2. Typography

### Font Families

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-heading: 'Cal Sans', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Font Sizes

| Token | Valor | Pixels |
|-------|-------|--------|
| `--text-xs` | 0.75rem | 12px |
| `--text-sm` | 0.875rem | 14px |
| `--text-base` | 1rem | 16px |
| `--text-lg` | 1.125rem | 18px |
| `--text-xl` | 1.25rem | 20px |
| `--text-2xl` | 1.5rem | 24px |
| `--text-3xl` | 1.875rem | 30px |
| `--text-4xl` | 2.25rem | 36px |
| `--text-5xl` | 3rem | 48px |

---

## 3. Spacing (4px base)

| Token | Valor | Pixels |
|-------|-------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |

---

## 4. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 0.25rem (4px) | Badges, small elements |
| `--radius-md` | 0.5rem (8px) | Buttons, inputs |
| `--radius-lg` | 0.75rem (12px) | Cards |
| `--radius-xl` | 1rem (16px) | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## 5. Shadows

| Token | Uso |
|-------|-----|
| `--shadow-sm` | Subtle elevation (buttons) |
| `--shadow-md` | Medium elevation (cards) |
| `--shadow-lg` | High elevation (dropdowns) |
| `--shadow-xl` | Maximum elevation (modals) |
| `--shadow-glow-sm` | ExímIA gold glow (subtle) |
| `--shadow-glow-md` | ExímIA gold glow (medium) |
| `--shadow-glow-lg` | ExímIA gold glow (intense) |

---

## 6. Animation

### Durations

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-150` | 150ms | Fast transitions (hover) |
| `--duration-300` | 300ms | Normal transitions |
| `--duration-500` | 500ms | Slow transitions (modals) |

### Timing Functions

| Token | Uso |
|-------|-----|
| `--ease-out` | Most UI transitions |
| `--ease-in-out` | Bidirectional animations |
| `--ease-spring` | Bouncy, playful feel |

---

## 7. Z-Index Scale

| Token | Valor | Uso |
|-------|-------|-----|
| `--z-dropdown` | 10 | Dropdowns, menus |
| `--z-sticky` | 20 | Sticky headers |
| `--z-fixed` | 30 | Fixed elements |
| `--z-overlay` | 40 | Overlays, backdrops |
| `--z-modal` | 50 | Modals |
| `--z-toast` | 70 | Toast notifications |
| `--z-tooltip` | 80 | Tooltips |

---

## 8. Utility Classes

### Text Gradient

```tsx
<h1 className="text-gradient-eximia">ExímIA Gold Gradient</h1>
```

### Glow Effect

```tsx
<button className="glow-eximia">Hover for glow</button>
```

### Glass Morphism

```tsx
<div className="glass">Frosted glass effect</div>
```

---

## 9. UI Components

### Button Variants

```tsx
import { Button } from "@/components/ui/button";

<Button>Primary (ExímIA Gold)</Button>
<Button variant="secondary">Secondary (Zinc)</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="success">Success</Button>
<Button variant="link">Link</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Badge Variants

```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer here
  </CardFooter>
</Card>
```

### Input

```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Type something..." />
<Input type="email" placeholder="Email" />
<Input disabled placeholder="Disabled" />
```

---

## File Structure

```
src/
├── app/
│   └── globals.css          # Design tokens + Tailwind theme
├── components/
│   └── ui/
│       ├── button.tsx       # Button component
│       ├── input.tsx        # Input component
│       ├── card.tsx         # Card component
│       ├── badge.tsx        # Badge component
│       └── index.ts         # Exports
└── lib/
    └── utils.ts             # cn() utility
```

---

## Next Steps (BLOCO 0.4+)

- [ ] Typography components (Heading, Text, Label)
- [ ] Avatar component
- [ ] Icon system (Lucide)
- [ ] FormField molecule
- [ ] SearchInput molecule
- [ ] MetricCard molecule
- [ ] Sidebar organism
- [ ] Header organism

---

*ExímIA OS Design System v1.0.0*
