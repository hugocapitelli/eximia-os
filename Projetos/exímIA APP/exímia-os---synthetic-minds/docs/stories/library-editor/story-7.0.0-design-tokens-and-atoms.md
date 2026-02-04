# Story 7.0.0: Design Tokens & Atomic Components Foundation

**Epic:** Library Editor Enhancement
**Status:** Ready for Dev
**Priority:** P0 (Blocker - All other phases depend)
**Assignee:** @dev (Dex)
**Estimated:** 4 hours
**Phase:** 0 (Prerequisite)

---

## 📋 Story

As a **UI Developer**,
I want to **establish a design tokens system and create base atomic components**,
So that **all future components inherit consistent styling from exímIA design system and reduce refactoring**.

---

## 🎯 Acceptance Criteria

### Design Tokens File
- [ ] Create `src/design-tokens.ts` with structured token exports
- [ ] Include color palette:
  - [ ] Eximia (gold) - primary brand color
  - [ ] Minds (purple) - secondary brand color
  - [ ] Tech (dark theme) - background/surface/border
- [ ] Include typography tokens:
  - [ ] Font families (Inter, Source Serif 4, JetBrains Mono)
  - [ ] Font weights (300, 400, 500, 600, 700)
- [ ] Include spacing scale (xs, sm, md, lg, xl)
- [ ] Include shadow/glow tokens (goldGlow, purpleGlow)
- [ ] Export BOOK_CATEGORIES with normalized colors using tokens
- [ ] All values should be strings (no hardcoded hex in components)

### Button Atom Component
- [ ] Create `components/atoms/Button.tsx`
- [ ] Variants: primary | secondary | tertiary
- [ ] Colors: gold | purple | ghost
- [ ] Sizes: sm | md | lg
- [ ] Support disabled state
- [ ] Use TOKENS.colors for all styling
- [ ] Export TypeScript interface

### Badge Atom Component
- [ ] Create `components/atoms/Badge.tsx`
- [ ] Display category with proper color from TOKENS.categories
- [ ] Support multiple sizes
- [ ] Export TypeScript interface

### Card Atom Component
- [ ] Create `components/atoms/Card.tsx`
- [ ] Use TOKENS.colors.bg.surface for background
- [ ] Use TOKENS.colors.bg.border for border
- [ ] Use TOKENS.spacing for padding/margin
- [ ] Support optional glow shadow effect
- [ ] Export TypeScript interface

### Index File
- [ ] Create `components/atoms/index.ts` exporting all atoms
- [ ] Create `components/index.ts` exporting all components

---

## 📝 Dev Notes

### Technical Details
- TypeScript interfaces required for all components
- No hardcoded color values - use TOKENS exclusively
- Components should be pure, no business logic
- Props should follow React best practices

### Design System Reference
From `index.html` Tailwind config:
```
Eximia: #fdbf68 (400), #ed7f09 (600), #c55f08 (700)
Minds: #8B5CF6 (500), #7C3AED (600), #6D28D9 (700)
Tech: #050505 (bg), #0A0A0A (surface), #1F1F22 (border)
```

### Testing Requirements
- [ ] Render each component with different props
- [ ] Verify token usage (no hardcoded colors in output CSS)
- [ ] Check accessibility (contrast ratios for buttons)
- [ ] Mobile responsiveness

---

## 🔗 Dependencies

**Blocks:** All other Library Editor stories (7.1.0 → 7.9.0)

**Related Files:**
- `index.html` (contains design system definition)
- `src/types/biblioteca.ts` (BOOK_CATEGORIES)
- New: `src/design-tokens.ts`
- New: `components/atoms/Button.tsx`
- New: `components/atoms/Badge.tsx`
- New: `components/atoms/Card.tsx`

---

## 📊 Dev Agent Record

### Agent Model Used
- claude-haiku-4-5-20251001

### Code Quality Review (CodeRabbit)
**Scheduled:** After implementation
- Check: No hardcoded colors/values
- Check: TypeScript types correctness
- Check: Component composition patterns
- Check: Accessibility compliance

### Debug Log
```
[Pending - Not started]
```

### Completion Notes
```
[Pending - Not started]
```

### File List
**New:**
- src/design-tokens.ts
- components/atoms/Button.tsx
- components/atoms/Badge.tsx
- components/atoms/Card.tsx
- components/atoms/index.ts
- components/index.ts

**Modified:**
- None (this story only creates new files)

### Change Log
```
[Pending - Not started]
```

---

## ✅ Definition of Done
- All atoms exported and importable
- No TS compilation errors
- Design tokens accessible in all components
- Matches exímIA design system specifications
- Code reviewed by CodeRabbit
- Ready for Phase 1 (Database migrations)

