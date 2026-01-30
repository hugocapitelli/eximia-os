# Story PM2-001: Admin Mode Complete

## Story Info

**Story ID:** PM2-001
**Epic:** PM2 - Visual Refinement Package
**Priority:** P0 (Foundation)
**Story Points:** 8
**Status:** Ready for Development

## User Story

**Como** administrador do exímIA OS,
**Eu quero** um sistema completo de administração com visual glassmorphism,
**Para que** eu possa gerenciar conteúdo de todas as seções do app.

## Context

Atualmente existe `useAdminMode.ts` com toggle básico. Precisamos expandir para um sistema completo com:
- Academy Studio (cursos, trilhas, featured, skills)
- Library Editor (livros, autores, capítulos)
- DS Manager (componentes, tokens)

## UX Specifications

### Admin Visual Pattern (Glassmorphism)

```css
.admin-panel {
  background: rgba(245, 158, 11, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
}

.admin-header {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%);
}

.admin-button-primary {
  background: #f59e0b;
  color: #000;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}
```

### Admin Dashboard Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN MODE DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ ACADEMY     │  │ LIBRARY     │  │ DS MANAGER  │             │
│  │ STUDIO      │  │ EDITOR      │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### AC1: Enhanced useAdminMode Hook
- [ ] `activeModule`: track which admin section is active
- [ ] `unsavedChanges`: flag for unsaved edits
- [ ] `setActiveModule()`: setter for active module
- [ ] `markUnsaved()` / `clearUnsaved()`: manage save state

### AC2: AdminPanel Component
- [ ] Glassmorphism visual (amber 5%, blur 12px)
- [ ] Icon + title + description
- [ ] Action buttons (Gerar com AI, Novo Item)
- [ ] Consistent across all admin sections

### AC3: AdminHeader Component
- [ ] Breadcrumb navigation (Admin > Academy > Courses)
- [ ] Save button (disabled if no changes)
- [ ] Unsaved changes indicator
- [ ] Back navigation

### AC4: Academy Studio Features
- [ ] Course Manager: list, add, edit, delete, reorder, publish/draft
- [ ] Track Manager: list, add, edit, delete, assign courses
- [ ] Featured Carousel: select/reorder featured courses
- [ ] Skill Tree Editor: visual editor for skills (future)

### AC5: Library Editor Features
- [ ] Book Manager: list, add, edit, delete
- [ ] Author Manager: list, add, edit, link to Minds
- [ ] Collection Manager: curate book collections

### AC6: DS Manager Features
- [ ] Component Registry: add/edit components
- [ ] Token Editor: manage design tokens (future)

### AC7: Admin Routes
- [ ] `/admin/academy-studio` → Academy Studio
- [ ] `/admin/academy-studio/courses` → Course Manager
- [ ] `/admin/academy-studio/tracks` → Track Manager
- [ ] `/admin/library-editor` → Library Editor
- [ ] `/admin/library-editor/books` → Book Manager
- [ ] `/admin/ds-manager` → DS Manager

## Technical Tasks

### Phase 1: Foundation
- [ ] Enhance `hooks/useAdminMode.ts` with new state
- [ ] Create `components/admin/AdminPanel.tsx`
- [ ] Create `components/admin/AdminHeader.tsx`
- [ ] Add admin routes to `App.tsx`

### Phase 2: Academy Studio
- [ ] Create `components/admin/CourseManager.tsx`
- [ ] Create `components/admin/TrackManager.tsx`
- [ ] Create `components/admin/FeaturedManager.tsx`
- [ ] Create `pages/AdminAcademyStudio.tsx`

### Phase 3: Library Editor
- [ ] Create `components/admin/BookManager.tsx`
- [ ] Create `components/admin/AuthorManager.tsx`
- [ ] Create `pages/AdminLibraryEditor.tsx`

### Phase 4: DS Manager
- [ ] Create `pages/AdminDSManager.tsx`
- [ ] Integrate with useDSLibrary hook

## Files to Create

| File | Description |
|------|-------------|
| `components/admin/AdminPanel.tsx` | Base admin panel with glassmorphism |
| `components/admin/AdminHeader.tsx` | Header with breadcrumbs, save |
| `components/admin/CourseManager.tsx` | Course CRUD table |
| `components/admin/TrackManager.tsx` | Track CRUD table |
| `components/admin/FeaturedManager.tsx` | Featured carousel editor |
| `components/admin/BookManager.tsx` | Book CRUD table |
| `components/admin/AuthorManager.tsx` | Author CRUD table |
| `components/pages/AdminAcademyStudio.tsx` | Academy admin page |
| `components/pages/AdminLibraryEditor.tsx` | Library admin page |
| `components/pages/AdminDSManager.tsx` | DS admin page |

## Files to Modify

| File | Changes |
|------|---------|
| `hooks/useAdminMode.ts` | Add module tracking, unsaved state |
| `App.tsx` | Add admin routes |
| `constants.ts` | Update NAV_ITEMS_ADMIN if needed |

## Component Interfaces

```typescript
// AdminPanel.tsx
interface AdminPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

// AdminHeader.tsx
interface AdminHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  onSave?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

// CourseManager.tsx
interface CourseManagerProps {
  courses: AcademyCourse[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
  onTogglePublish: (id: string) => void;
}
```

## Definition of Done

- [ ] Admin Mode toggle shows/hides admin section in sidebar
- [ ] All admin pages render with glassmorphism style
- [ ] Course Manager allows full CRUD
- [ ] Track Manager allows full CRUD
- [ ] Book Manager allows full CRUD
- [ ] Navigation between admin sections works
- [ ] Unsaved changes warning before leaving
- [ ] Visual consistency with exímIA dark theme

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 2-3 dias
