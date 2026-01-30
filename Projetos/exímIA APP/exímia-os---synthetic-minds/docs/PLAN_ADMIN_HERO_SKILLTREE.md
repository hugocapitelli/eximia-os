# Implementation Plan: Admin Pages, Hero Carousel & Skill Tree

## Overview

This plan covers three major changes requested:
1. **Admin Mode Pages** - Implement all placeholder admin pages
2. **Hero Carousel Redesign** - Wider layout with purple/magenta gradient
3. **Skill Tree Fix** - Ensure correct card-based visualization

---

## 1. Admin Mode Pages Implementation

### Current State
- Navigation structure already complete in `constants.ts` (NAV_ITEMS_ADMIN)
- Sidebar toggle and routing already functional
- Only `AdminAcademyStudio` is fully implemented
- Other routes return placeholder divs

### Pages to Implement

| Page ID | Label | Parent Section | Priority |
|---------|-------|----------------|----------|
| `admin-tracks` | Gerenciar Trilhas | Academy Studio | P1 |
| `admin-carousel` | Hero Carousel | Academy Studio | P1 |
| `admin-books` | Gerenciar Livros | Library Editor | P2 |
| `admin-authors` | Gerenciar Autores | Library Editor | P2 |
| `admin-components` | Componentes | DS Manager | P3 |
| `admin-tokens` | Tokens | DS Manager | P3 |
| `admin-settings` | Configurações | - | P3 |

### Implementation Pattern (Follow AdminAcademyStudio)

```tsx
// Standard Admin Page Structure
const AdminPage = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Page Name' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={IconComponent}
          title="Page Title"
          description="Page description"
          onAddNew={handleAdd}
          onGenerateAI={handleAI}
          addNewLabel="Add Item"
        />

        {/* Page-specific content */}
      </div>
    </div>
  );
};
```

### Files to Create

```
components/pages/
├── AdminTrackManager.tsx      # Gerenciar Trilhas (standalone from Academy Studio)
├── AdminHeroCarouselEditor.tsx # Hero Carousel Editor
├── AdminLibraryBooks.tsx       # Gerenciar Livros
├── AdminLibraryAuthors.tsx     # Gerenciar Autores
├── AdminDSComponents.tsx       # Design System Components
├── AdminDSTokens.tsx           # Design System Tokens
└── AdminSettings.tsx           # Configurações
```

### Files to Modify

1. **App.tsx** - Update route cases from placeholders to actual components
2. **components/admin/index.ts** - Export new components

---

## 2. Hero Carousel Redesign

### Current Issues
- Width constrained by parent container
- Background uses dark gradient (`from-[#0A0A0A] to-[#1a1a1a]`)
- Standard card styling

### Target Design (Image 2 & 3)
- Full-width within container
- Purple/magenta wave gradient background
- Centered content
- More prominent visual presence

### Implementation Changes

#### A. Width Adjustment
```tsx
// HeroCarousel.tsx - Current container
<div className="relative overflow-hidden rounded-2xl border border-[#1F1F22] bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a]">

// Updated - wider with max-width removed or increased
<div className="relative w-full overflow-hidden rounded-2xl border border-[#1F1F22]/50">
```

#### B. Gradient Background (Purple/Magenta Wave)
```tsx
// New gradient styling inspired by Image 3
<div
  className="absolute inset-0"
  style={{
    background: `
      linear-gradient(135deg,
        #1a0a2e 0%,           /* Deep purple */
        #2d1b4e 20%,          /* Dark violet */
        #4a2c6a 40%,          /* Purple */
        #7b3f8e 60%,          /* Magenta */
        #5c2d6b 80%,          /* Purple fade */
        #1a0a2e 100%          /* Deep purple */
      )
    `,
  }}
/>

// Wave overlay effect
<div
  className="absolute inset-0 opacity-50"
  style={{
    background: `
      radial-gradient(ellipse 80% 50% at 50% 120%,
        rgba(168, 85, 247, 0.4) 0%,
        rgba(236, 72, 153, 0.2) 40%,
        transparent 70%
      )
    `,
  }}
/>
```

#### C. CSS Animation for Wave Effect
```css
/* Add to globals.css or inline */
@keyframes wave-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); }
}
```

### Files to Modify
1. **components/academy/HeroCarousel.tsx** - Update styling
2. **components/pages/AcademyDashboard.tsx** - Adjust container if needed

---

## 3. Skill Tree Visualization Fix

### Current State Analysis
Looking at Image 4, the correct visualization is:
- **2-column card grid** (NOT a tree graph)
- Each card shows: Skill Name, Category Label, Percentage, Progress Bar
- Progress bars are amber/orange colored
- Clean, simple card design

### Issue Identified
The `AcademySkillTree.tsx` page has a view toggle between 'tree' and 'grid':
- `tree` view → Uses `SkillTreeGrid` component
- `grid` view → Uses inline 3-column grid

The `SkillTreeGrid` component was updated to show 2-column cards (correct design).
The issue may be:
1. Default view is 'grid' instead of 'tree'
2. Or the page is using old view mode

### Solution

#### A. Set Default View to Use SkillTreeGrid
```tsx
// AcademySkillTree.tsx
const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree'); // Default to 'tree'
```

#### B. Simplify - Remove View Toggle
Since the "tree" view is actually the correct card grid, consider:
- Removing the view toggle entirely
- Using only SkillTreeGrid component
- Cleaner UX with single visualization

#### C. Ensure SkillTreeGrid Shows Correct Layout
```tsx
// SkillTreeGrid.tsx - Should render:
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {skills.map((skill) => (
    <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-bold text-white">{skill.name}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            {skill.category}
          </p>
        </div>
        <span className="text-2xl font-bold text-amber-500">{skill.progress}%</span>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${skill.progress}%` }}
          />
        </div>
      </div>
    </div>
  ))}
</div>
```

### Files to Modify
1. **components/pages/AcademySkillTree.tsx** - Fix default view or simplify
2. **components/academy/SkillTreeGrid.tsx** - Verify correct implementation

---

## Implementation Order

### Phase 1: Quick Fixes (Immediate)
1. ✅ Fix Skill Tree default view
2. ✅ Update Hero Carousel gradient and width

### Phase 2: Admin Pages - Priority 1
3. Create `AdminTrackManager.tsx`
4. Create `AdminHeroCarouselEditor.tsx`
5. Update `App.tsx` routes

### Phase 3: Admin Pages - Priority 2
6. Create `AdminLibraryBooks.tsx`
7. Create `AdminLibraryAuthors.tsx`
8. Update `App.tsx` routes

### Phase 4: Admin Pages - Priority 3
9. Create `AdminDSComponents.tsx`
10. Create `AdminDSTokens.tsx`
11. Create `AdminSettings.tsx`
12. Final `App.tsx` updates

---

## File Change Summary

### New Files (7)
```
components/pages/AdminTrackManager.tsx
components/pages/AdminHeroCarouselEditor.tsx
components/pages/AdminLibraryBooks.tsx
components/pages/AdminLibraryAuthors.tsx
components/pages/AdminDSComponents.tsx
components/pages/AdminDSTokens.tsx
components/pages/AdminSettings.tsx
```

### Modified Files (4)
```
App.tsx                                    # Route updates
components/academy/HeroCarousel.tsx        # Gradient & width
components/pages/AcademySkillTree.tsx      # Default view fix
components/pages/AcademyDashboard.tsx      # Carousel container (if needed)
```

---

## Design Tokens Reference

### Admin Theme
- Primary: `#f59e0b` (amber-500)
- Background: `rgba(245, 158, 11, 0.05-0.2)`
- Border: `rgba(245, 158, 11, 0.2)`

### Hero Carousel Gradient
- Deep Purple: `#1a0a2e`
- Violet: `#2d1b4e`
- Purple: `#4a2c6a`
- Magenta: `#7b3f8e`

### Skill Tree Cards
- Background: `#0A0A0A`
- Border: `#1F1F22`
- Progress: `#f59e0b` (amber-500)
- Category Labels: amber-500, blue-400, emerald-400, violet-400

---

## Estimated Scope

| Change | New Files | Modified Files | Complexity |
|--------|-----------|----------------|------------|
| Admin Pages | 7 | 1 | Medium |
| Hero Carousel | 0 | 2 | Low |
| Skill Tree | 0 | 1-2 | Low |
| **Total** | **7** | **4-5** | Medium |

---

## Acceptance Criteria

### Admin Pages
- [ ] All admin navigation items route to functional pages
- [ ] Each page follows AdminPanel pattern
- [ ] Save/unsaved state management works
- [ ] Breadcrumb navigation functional

### Hero Carousel
- [ ] Full-width within AcademyDashboard
- [ ] Purple/magenta gradient background
- [ ] Smooth wave-like visual effect
- [ ] All existing functionality preserved

### Skill Tree
- [ ] Displays 2-column card grid
- [ ] Each card shows: name, category, percentage, progress bar
- [ ] Amber/orange progress bar color
- [ ] Matches Image 4 design exactly

---

*Plan created by @architect (Aria) - 2026-01-29*
