# KB_04 — Layout Patterns for Carousels

**Agente:** Visual Designer
**Categoria:** LAYOUT E COMPOSIÇÃO
**Versão:** 1.0

---

## Fundamentos de Layout

### Por que Layout Importa

Layout is the invisible architecture of design. It determines:
- **Flow** — How the eye moves across the slide
- **Balance** — Visual stability and harmony
- **Hierarchy** — What gets attention first
- **Comprehension** — How easily content is understood

### Princípios Base
```
┌─────────────────────────────────────────────────────────┐
│ 1. ALIGNMENT    → Everything has a visual connection   │
│ 2. REPETITION   → Consistent patterns build familiarity│
│ 3. CONTRAST     → Difference creates interest          │
│ 4. PROXIMITY    → Related items grouped together       │
└─────────────────────────────────────────────────────────┘
```

---

## Grid Systems

### The 4-Column Grid (Standard)
```
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │
├─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │
├─────┼─────┼─────┼─────┤
│  9  │ 10  │ 11  │ 12  │
├─────┼─────┼─────┼─────┤
│ 13  │ 14  │ 15  │ 16  │
└─────┴─────┴─────┴─────┘

1080px / 4 columns = 270px each
Gutter: 20px
Margin: 60px
```

### The Rule of Thirds
```
┌───────────┬───────────┬───────────┐
│           │           │           │
│     A     │     B     │     C     │
│           │           │           │
├───────────┼───────────┼───────────┤
│           │           │           │
│     D     │     E     │     F     │
│           │           │           │
├───────────┼───────────┼───────────┤
│           │           │           │
│     G     │     H     │     I     │
│           │           │           │
└───────────┴───────────┴───────────┘

Power Points: B, D, F, H (intersections)
Place key elements at intersections for dynamic composition
```

### Golden Ratio Grid
```
┌────────────────┬───────────┐
│                │           │
│                │           │
│      61.8%     │   38.2%   │
│                │           │
│                │           │
└────────────────┴───────────┘

Use for text/image splits
Main content: 61.8%
Supporting: 38.2%
```

---

## Layout Templates Essenciais

### 1. Centered Hero
```
┌────────────────────────────────────┐
│                                    │
│    ┌────────────────────────┐      │
│    │                        │      │
│    │    HERO HEADLINE       │      │
│    │    Supporting text     │      │
│    │                        │      │
│    └────────────────────────┘      │
│                                    │
└────────────────────────────────────┘

Best for: Hook slides, CTAs, single statements
```

### 2. Top-Heavy
```
┌────────────────────────────────────┐
│  ┌──────────────────────────────┐  │
│  │      MAIN HEADLINE           │  │
│  │      ───────────────         │  │
│  └──────────────────────────────┘  │
│                                    │
│     Body content here with        │
│     more details and context       │
│                                    │
│                                    │
└────────────────────────────────────┘

Best for: Content slides, explanations
```

### 3. Split (50/50)
```
┌────────────────┬─────────────────┐
│                │                 │
│    VISUAL      │    CONTENT      │
│    IMAGE       │                 │
│    GRAPHIC     │    Headline     │
│                │    Body text    │
│                │                 │
└────────────────┴─────────────────┘

Best for: Comparisons, before/after, image+text
```

### 4. Asymmetric Split (60/40)
```
┌──────────────────────┬────────────┐
│                      │            │
│                      │            │
│      DOMINANT        │  SUPPORT   │
│      CONTENT         │  CONTENT   │
│                      │            │
│                      │            │
└──────────────────────┴────────────┘

Best for: Feature + detail, main + sidebar
```

### 5. Z-Pattern
```
┌────────────────────────────────────┐
│  1 ────────────────────────→ 2     │
│                     ↙              │
│                                    │
│  3 ────────────────────────→ 4     │
│                                    │
└────────────────────────────────────┘

Eye naturally follows Z path
1: Logo/Hook → 2: Visual
3: Content → 4: CTA

Best for: Mixed content slides
```

### 6. F-Pattern (for Lists)
```
┌────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  ━━━━━━━━━━━━━━━━━━━━━             │
│  ━━━━━━━━━━━━━━                    │
│  ━━━━━━━━━━━                       │
│  ━━━━━━━                           │
└────────────────────────────────────┘

Users scan in F-pattern for text-heavy content
Front-load important information

Best for: Lists, bullet points
```

### 7. Card Layout
```
┌────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ Card │  │ Card │  │ Card │     │
│  │  1   │  │  2   │  │  3   │     │
│  └──────┘  └──────┘  └──────┘     │
│                                    │
│  ┌──────┐  ┌──────┐               │
│  │ Card │  │ Card │               │
│  │  4   │  │  5   │               │
│  └──────┘  └──────┘               │
└────────────────────────────────────┘

Best for: Multiple items, features, team members
```

### 8. Full-Bleed Image
```
┌────────────────────────────────────┐
│██████████████████████████████████████│
│████████┌────────────────┐████████████│
│████████│  TEXT OVERLAY  │████████████│
│████████│                │████████████│
│████████└────────────────┘████████████│
│██████████████████████████████████████│
└────────────────────────────────────────┘

Image fills entire slide
Text in overlay box or with shadow

Best for: Impactful visuals, emotional hooks
```

---

## Balance Techniques

### Symmetrical Balance
```
┌────────────────────────────────────┐
│                                    │
│     ████      │      ████         │
│     ████      │      ████         │
│               │                    │
│     ████      │      ████         │
│                                    │
└────────────────────────────────────┘

Creates: Stability, formality, trust
Use for: Corporate, professional content
```

### Asymmetrical Balance
```
┌────────────────────────────────────┐
│                                    │
│  ██████████████                    │
│  ██████████████        ████        │
│                        ████        │
│                ████████████        │
│                                    │
└────────────────────────────────────┘

Creates: Dynamic energy, modern feel
Use for: Creative, tech, startup content
```

### Radial Balance
```
┌────────────────────────────────────┐
│              ████                  │
│         ████      ████             │
│       ████          ████           │
│         ████      ████             │
│              ████                  │
└────────────────────────────────────┘

Creates: Focus, emphasis, unity
Use for: Single key message, data visualization
```

---

## Negative Space (White Space)

### Strategic Emptiness
```
CROWDED (Avoid)              BREATHING ROOM (Good)
┌────────────────────┐       ┌────────────────────┐
│ HEADLINE HEADLINE  │       │                    │
│ Text text text     │       │     HEADLINE       │
│ more text text     │       │                    │
│ even more text     │       │     Text here      │
│ CTA button image   │       │                    │
│ icons text CTA     │       │     [CTA]          │
└────────────────────┘       │                    │
                             └────────────────────┘
```

### Minimum Margins for Instagram
```
Top/Bottom: 60px minimum (80px ideal)
Left/Right: 60px minimum (80px ideal)
Between elements: 20-40px
```

---

## Alignment Systems

### Left-Aligned (Most Common)
```
┌────────────────────────────────────┐
│                                    │
│  HEADLINE                          │
│  ────────────                      │
│  Body text that flows              │
│  naturally from the                │
│  headline above                    │
│                                    │
└────────────────────────────────────┘

Natural reading flow (Western languages)
```

### Center-Aligned
```
┌────────────────────────────────────┐
│                                    │
│          HEADLINE                  │
│       ────────────                 │
│     Body text centered             │
│       for emphasis                 │
│                                    │
└────────────────────────────────────┘

Formal, elegant, but limit to short text
```

### Mixed Alignment (Advanced)
```
┌────────────────────────────────────┐
│                                    │
│  NUMBER     Headline right-aligned │
│    01       ─────────────────────  │
│             Description text here  │
│                                    │
└────────────────────────────────────┘

Creates visual interest through contrast
```

---

## Responsive Considerations

### Safe Zone Layout
```
┌──────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░┌──────────────────────────────┐░ │
│ ░│                              │░ │
│ ░│      SAFE CONTENT AREA       │░ │
│ ░│        (Keep text here)      │░ │
│ ░│                              │░ │
│ ░└──────────────────────────────┘░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│   ⚠️ DANGER ZONE (UI overlays)     │
└──────────────────────────────────────┘

Never place critical content in outer 60px
Bottom 120px reserved for Instagram UI
```

---

## Tools e Recursos

### Grid Generators
- **Gridcalculator**: gridcalculator.dk
- **Modular Grid Pattern**: modulargrid.org
- **Grid.Guide**: grid.guide

### Layout Tools
- **Figma**: Auto-layout and constraints
- **Canva**: Template-based layouts
- **Adobe XD**: Layout grids and guides

### Inspiration
- **Savee.it**: Layout collections
- **Mobbin**: Mobile layouts
- **Behance**: Professional portfolios

---

## Checklist de Layout

- [ ] Grid system defined and consistent
- [ ] Alignment rules established
- [ ] Adequate negative space (breathing room)
- [ ] Visual balance achieved (symmetric or asymmetric)
- [ ] Safe zones respected
- [ ] Eye flow considered (Z, F, or centered)
- [ ] Content properly grouped by proximity
- [ ] Layout varies across slides to prevent monotony

---

## Fontes de Referência
- Josef Müller-Brockmann, "Grid Systems in Graphic Design"
- Massimo Vignelli, "The Vignelli Canon"
- Jan Tschichold, "The New Typography"
- Material Design Layout Guidelines
