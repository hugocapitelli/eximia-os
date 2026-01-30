# Story PM1-006: Admin Sidebar Section

## Story Info

**Story ID:** PM1-006
**Epic:** PM1 - UX Enhancement Package
**Priority:** P0 (Foundation - IMPLEMENTAR PRIMEIRO)
**Story Points:** 3
**Status:** Ready for Development
**Bloqueia:** PM1-001, PM1-002, PM1-007 (editor modes dependem desta infra)

## User Story

**Como** administrador do exímIA OS,
**Eu quero** uma seção dedicada no sidebar para controles administrativos,
**Para que** eu possa gerenciar cursos e conteúdos de forma centralizada.

## Context

Criar uma nova seção "Admin" no sidebar com submenus para gerenciamento, começando com "Academy Studio" para gestão de cursos.

**IMPORTANTE:** Esta story é FOUNDATION para as demais. Os editor modes de PM1-001, PM1-002 e PM1-007 dependem desta infraestrutura administrativa.

## UX Specifications (Uma)

### Sidebar Structure

```
┌─────────────────────────┐
│ [Logo] exímIA OS        │
│                         │
│ ━━━━━━━━━━━━━━━━━━━━━━ │
│                         │
│ 📥 Inbox                │
│ 🎯 Journey              │
│ 📚 Biblioteca           │
│ 🎓 Academy              │
│ 📊 Strategy             │
│ 💰 Finance              │
│ 🎨 Brand                │
│ 🧠 Minds                │
│ 📝 Content              │
│ 👥 Team                 │
│ 🎨 Design System        │
│                         │
│ ━━━━━━━━━━━━━━━━━━━━━━ │
│                         │
│ ⚙️ ADMIN                │ ← Nova seção
│   ├─ 🎬 Academy Studio  │
│   ├─ 📖 Library Editor  │
│   ├─ 🧩 Content Studio  │
│   └─ 👤 User Management │
│                         │
│ ━━━━━━━━━━━━━━━━━━━━━━ │
│                         │
│ [👤 Profile]  [⚙️ Settings] │
└─────────────────────────┘
```

### Admin Section Design

```css
/* Admin Section Separator */
.admin-separator {
  margin: 1.5rem 0;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-separator::before,
.admin-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #1F1F22;
}

.admin-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #52525b;
}

/* Admin Menu Item */
.admin-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  color: #71717a;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
}

.admin-item:hover {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.admin-item--active {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  font-weight: 500;
}

.admin-item-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.admin-item:hover .admin-item-icon {
  opacity: 1;
}
```

### Admin Menu Items

```typescript
interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  route: string;
}

const ADMIN_MENU: AdminMenuItem[] = [
  {
    id: 'academy-studio',
    label: 'Academy Studio',
    icon: Clapperboard, // ou Video, Film
    description: 'Gerenciar cursos, lições e trilhas',
    route: 'admin-academy',
  },
  {
    id: 'library-editor',
    label: 'Library Editor',
    icon: BookMarked,
    description: 'Gerenciar livros e resumos',
    route: 'admin-library',
  },
  {
    id: 'content-studio',
    label: 'Content Studio',
    icon: Puzzle,
    description: 'Gerenciar conteúdo e mídia',
    route: 'admin-content',
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: UserCog,
    description: 'Gerenciar usuários e permissões',
    route: 'admin-users',
  },
];
```

### Academy Studio Features

```
┌─────────────────────────────────────────────────────────────┐
│  ACADEMY STUDIO                                             │
│  Gerencie cursos, lições e trilhas                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Cursos] [Trilhas] [Lições] [Certificados] [Analytics]│  │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Cursos                               [+ Novo Curso]       │
│  ───────────────────────────────────────────────────       │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 📚 Deep Work Mastery                               │    │
│  │ Status: Publicado | 12 lições | 4h 30min           │    │
│  │ Inscritos: 234 | Conclusão: 67%                    │    │
│  │                                                    │    │
│  │ [Editar] [Preview] [Analytics] [···]               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 📚 Atomic Habits                                   │    │
│  │ Status: Rascunho | 8/15 lições | --                │    │
│  │ Inscritos: -- | Conclusão: --                      │    │
│  │                                                    │    │
│  │ [Editar] [Preview] [Publicar] [···]                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Permission Control

```typescript
interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

type Permission =
  | 'admin.academy.read'
  | 'admin.academy.write'
  | 'admin.library.read'
  | 'admin.library.write'
  | 'admin.content.read'
  | 'admin.content.write'
  | 'admin.users.read'
  | 'admin.users.write';

// Check if admin section should show
const shouldShowAdminSection = (user: User) => {
  return user.permissions.some(p => p.startsWith('admin.'));
};
```

## Acceptance Criteria

### Funcional
- [ ] Nova seção "ADMIN" no sidebar após seções principais
- [ ] Separador visual entre seções regulares e admin
- [ ] Ícone e label para cada item admin
- [ ] Hover effect amber consistente com DS
- [ ] Academy Studio como primeiro item
- [ ] Navegação funcional para cada item
- [ ] Seção só aparece para usuários com permissão (mock)
- [ ] Responsivo: collapsa em mobile (ícone only)

### Infraestrutura para Editor Modes
- [ ] Estado `isAdmin` disponível globalmente
- [ ] Hook `useAdminMode()` para consumir estado
- [ ] Toggle de editor mode visível apenas para admin
- [ ] Transição suave ao entrar/sair do editor mode

### Acessibilidade (WCAG AA)
- [ ] Focus visible em todos itens do menu
- [ ] aria-expanded para seção colapsável
- [ ] Keyboard navigation (Tab, Enter)
- [ ] role="navigation" na seção admin

## Technical Tasks

- [ ] Atualizar `constants.ts` com ADMIN_MENU
- [ ] Atualizar `Sidebar.tsx` com seção admin
- [ ] Criar componente `AdminMenuItem.tsx`
- [ ] Criar página `AdminAcademyStudio.tsx`
- [ ] Adicionar rotas no `App.tsx`
- [ ] Implementar check de permissões (mock)

## Files to Modify/Create

| File | Action |
|------|--------|
| `constants.ts` | Add ADMIN_MENU |
| `components/organisms/Sidebar.tsx` | Modify |
| `components/sidebar/AdminMenuItem.tsx` | Create |
| `components/pages/AdminAcademyStudio.tsx` | Create |
| `components/pages/AdminLibraryEditor.tsx` | Create (placeholder) |
| `App.tsx` | Add admin routes |

## Definition of Done

- [ ] Seção admin visível no sidebar
- [ ] Navegação funcional para todas páginas admin
- [ ] Visual consistente com DS
- [ ] Academy Studio acessível
- [ ] Permissões verificadas (mock - localStorage flag)
- [ ] Hook useAdminMode() exportado e documentado
- [ ] Outras stories (PM1-001, PM1-002, PM1-007) podem usar o hook
- [ ] Acessibilidade verificada

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
