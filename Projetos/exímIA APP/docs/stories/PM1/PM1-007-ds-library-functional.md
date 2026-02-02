# Story PM1-007: DS Library Functional

## Story Info

**Story ID:** PM1-007
**Epic:** PM1 - UX Enhancement Package
**Priority:** P2 (Média)
**Story Points:** 8
**Status:** Ready for Development
**Depende de:** PM1-006 (Admin Sidebar - para botão "Adicionar Componente")

## User Story

**Como** desenvolvedor/designer do exímIA OS,
**Eu quero** uma DS Library funcional que salva componentes atomic design,
**Para que** eu tenha uma documentação viva dos componentes do sistema.

## Context

A DS Library atual é estática/mockada. O objetivo é torná-la funcional, salvando e documentando os componentes reais do exímIA OS seguindo a metodologia Atomic Design (Atoms, Molecules, Organisms, Templates).

## UX Specifications (Uma)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  DESIGN SYSTEM LIBRARY                                      │
│  Componentes do exímIA OS                                   │
│                                                             │
│  [🔍 Buscar componente...]                    [+ Adicionar] │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [ATOMS ●] [MOLECULES] [ORGANISMS] [TEMPLATES] [ALL]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ATOMS                                         12 components│
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ [Preview]    │ │ [Preview]    │ │ [Preview]    │        │
│  │              │ │              │ │              │        │
│  │ ─────────────│ │ ─────────────│ │ ─────────────│        │
│  │ Button       │ │ Input        │ │ Badge        │        │
│  │ atoms/button │ │ atoms/input  │ │ atoms/badge  │        │
│  │ 4 variants   │ │ 3 variants   │ │ 6 variants   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Typography   │ │ Icon         │ │ Avatar       │        │
│  │ atoms/typo   │ │ atoms/icon   │ │ atoms/avatar │        │
│  │ 8 variants   │ │ 50+ icons    │ │ 3 sizes      │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Card Design

```css
/* Component Card */
.ds-component-card {
  background: #0A0A0A;
  border: 1px solid #1F1F22;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.ds-component-card:hover {
  border-color: rgba(251, 191, 36, 0.3);
  transform: translateY(-2px);
}

/* Preview Area */
.ds-preview {
  height: 120px;
  background: #0F0F0F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid #1F1F22;
}

/* Component Info */
.ds-info {
  padding: 1rem;
}

.ds-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fafafa;
  margin-bottom: 0.25rem;
}

.ds-path {
  font-size: 11px;
  font-family: monospace;
  color: #52525b;
  margin-bottom: 0.5rem;
}

.ds-meta {
  font-size: 11px;
  color: #71717a;
}
```

### Category Tabs

```typescript
type DSCategory = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'all';

const CATEGORY_COLORS: Record<DSCategory, string> = {
  atoms: '#3b82f6',      // blue
  molecules: '#22c55e',  // green
  organisms: '#f59e0b',  // amber
  templates: '#a855f7',  // purple
  all: '#71717a',        // gray
};
```

### Component Detail Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Button                                              [×]    │
│  atoms/button                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Preview] [Code] [Props] [Usage] [Changelog]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  PREVIEW                                                    │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  Variant: [Primary ▼]  Size: [MD ▼]  State: [Default ▼]   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [ Primary Button ]                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  VARIANTS                                                   │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  [Primary] [Secondary] [Ghost] [Danger]                    │
│                                                             │
│  PROPS                                                      │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  | Prop     | Type              | Default   | Required |   │
│  |----------|-------------------|-----------|----------|   │
│  | variant  | ButtonVariant     | 'primary' | No       |   │
│  | size     | 'sm' | 'md' | 'lg'| 'md'      | No       |   │
│  | disabled | boolean           | false     | No       |   │
│  | icon     | ReactNode         | undefined | No       |   │
│  | onClick  | () => void        | undefined | No       |   │
│                                                             │
│  CODE                                                       │
│  ───────────────────────────────────────────────────────   │
│  ```tsx                                                     │
│  import { Button } from '@/components/atoms/Button';        │
│                                                             │
│  <Button variant="primary" size="md">                       │
│    Click me                                                 │
│  </Button>                                                  │
│  ```                                                        │
│                                                [📋 Copy]    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Structure

```typescript
interface DSComponent {
  id: string;
  name: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates';
  path: string; // e.g., 'components/atoms/Button.tsx'
  description: string;

  // Variants
  variants: ComponentVariant[];

  // Props documentation
  props: ComponentProp[];

  // Code examples
  examples: CodeExample[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  version: string;
  author?: string;

  // Relations
  usedBy?: string[]; // IDs of components that use this one
  uses?: string[];   // IDs of components this one uses
}

interface ComponentVariant {
  name: string;
  description?: string;
  preview?: string; // Screenshot or render function
}

interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description?: string;
}

interface CodeExample {
  title: string;
  code: string;
  language: 'tsx' | 'css' | 'ts';
}
```

### exímIA OS Components to Document

```typescript
const EXIMIA_COMPONENTS: DSComponent[] = [
  // ATOMS
  { category: 'atoms', name: 'Button', path: 'components/atoms/Button.tsx' },
  { category: 'atoms', name: 'Input', path: 'components/atoms/Input.tsx' },
  { category: 'atoms', name: 'Badge', path: 'components/atoms/Badge.tsx' },
  { category: 'atoms', name: 'Typography', path: 'components/atoms/Typography.tsx' },
  { category: 'atoms', name: 'Icon', path: 'components/atoms/Icon.tsx' },
  { category: 'atoms', name: 'Avatar', path: 'components/atoms/Avatar.tsx' },
  { category: 'atoms', name: 'Spinner', path: 'components/atoms/Spinner.tsx' },
  { category: 'atoms', name: 'Checkbox', path: 'components/atoms/Checkbox.tsx' },

  // MOLECULES
  { category: 'molecules', name: 'SearchBar', path: 'components/molecules/SearchBar.tsx' },
  { category: 'molecules', name: 'FormField', path: 'components/molecules/FormField.tsx' },
  { category: 'molecules', name: 'StatCard', path: 'components/molecules/StatCard.tsx' },
  { category: 'molecules', name: 'NavItem', path: 'components/molecules/NavItem.tsx' },
  { category: 'molecules', name: 'ProgressBar', path: 'components/molecules/ProgressBar.tsx' },

  // ORGANISMS
  { category: 'organisms', name: 'Sidebar', path: 'components/organisms/Sidebar.tsx' },
  { category: 'organisms', name: 'Header', path: 'components/organisms/Header.tsx' },
  { category: 'organisms', name: 'CourseCard', path: 'components/academy/CourseCard.tsx' },
  { category: 'organisms', name: 'BookCard', path: 'components/journey/BookCard.tsx' },
  { category: 'organisms', name: 'MindCard', path: 'components/minds/MindCard.tsx' },

  // TEMPLATES
  { category: 'templates', name: 'DashboardLayout', path: 'components/templates/DashboardLayout.tsx' },
  { category: 'templates', name: 'PageHeader', path: 'components/templates/PageHeader.tsx' },
  { category: 'templates', name: 'ListPage', path: 'components/templates/ListPage.tsx' },
];
```

### Storage Strategy

```typescript
// Option 1: JSON file in project
const DS_LIBRARY_PATH = 'src/design-system/library.json';

// Option 2: localStorage for quick iteration
const DS_STORAGE_KEY = 'eximia-ds-library';

// Option 3: Supabase for persistence
const DS_TABLE = 'design_system_components';

// Recommended: Start with localStorage, migrate to Supabase later
const useDSLibrary = () => {
  const [components, setComponents] = useState<DSComponent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DS_STORAGE_KEY);
    if (stored) {
      setComponents(JSON.parse(stored));
    } else {
      // Initialize with EXIMIA_COMPONENTS
      setComponents(EXIMIA_COMPONENTS);
    }
  }, []);

  const saveComponent = (component: DSComponent) => {
    const updated = [...components.filter(c => c.id !== component.id), component];
    setComponents(updated);
    localStorage.setItem(DS_STORAGE_KEY, JSON.stringify(updated));
  };

  return { components, saveComponent };
};
```

## Acceptance Criteria

### Funcional
- [ ] Grid de componentes por categoria
- [ ] Tabs para filtrar: Atoms, Molecules, Organisms, Templates, All
- [ ] Search funcional (filtra por nome e path)
- [ ] Card com preview, nome, path, count de variants
- [ ] Modal de detalhes ao clicar
- [ ] Tabs no modal: Preview, Code, Props, Usage
- [ ] Preview interativo com seletor de variant
- [ ] Tabela de props documentados
- [ ] Code snippets com botão copy (clipboard API)
- [ ] Botão "Adicionar Componente" (admin only - usa PM1-006)
- [ ] Persistência em localStorage
- [ ] Todos os componentes existentes documentados (mínimo 20)

### Acessibilidade (WCAG AA)
- [ ] Focus visible em cards e tabs
- [ ] Modal trap focus (Tab não sai do modal)
- [ ] Escape fecha modal
- [ ] aria-selected em tabs
- [ ] Code blocks com role="code"
- [ ] Botão copy anuncia sucesso para screen reader

### Responsividade
- [ ] Grid adapta: 1col (mobile) → 3col (desktop)
- [ ] Modal fullscreen em mobile
- [ ] Tabs horizontais scrolláveis em mobile

### Performance
- [ ] Grid performa com 50+ componentes
- [ ] Preview lazy loaded
- [ ] Search debounced (300ms)
- [ ] Modal não bloqueia thread principal

## Technical Tasks

- [ ] Criar componente `DSLibrary.tsx`
- [ ] Criar componente `DSComponentCard.tsx`
- [ ] Criar componente `DSComponentModal.tsx`
- [ ] Criar componente `DSPreview.tsx`
- [ ] Criar componente `DSPropsTable.tsx`
- [ ] Criar hook `useDSLibrary.ts`
- [ ] Mapear componentes existentes
- [ ] Documentar props de cada componente
- [ ] Adicionar code examples
- [ ] Implementar search
- [ ] Implementar persistência

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/ds/DSLibrary.tsx` | Create |
| `components/ds/DSComponentCard.tsx` | Create |
| `components/ds/DSComponentModal.tsx` | Create |
| `components/ds/DSPreview.tsx` | Create |
| `components/ds/DSPropsTable.tsx` | Create |
| `components/ds/DSCodeBlock.tsx` | Create |
| `hooks/useDSLibrary.ts` | Create |
| `data/ds-components.ts` | Create (initial data) |
| `components/pages/DesignSystemLibrary.tsx` | Modify |

## Definition of Done

- [ ] Todos os componentes atuais documentados (mínimo 20)
- [ ] Preview funcional para cada componente
- [ ] Props documentados com tipos e defaults
- [ ] Code examples com copy funcional
- [ ] Search funcionando (debounced)
- [ ] Persistência funcionando (localStorage)
- [ ] Visual consistente com DS
- [ ] Responsividade testada (mobile/desktop)
- [ ] Acessibilidade verificada (keyboard, modal trap)
- [ ] Performance ok (50+ componentes a 60fps)

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
