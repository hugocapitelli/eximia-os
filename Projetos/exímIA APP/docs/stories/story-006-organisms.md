# Story EXIMIA-006: Organisms Essenciais

**Story ID:** EXIMIA-006
**Epic:** EXIMIA-EPIC-002 (Design System Foundation)
**Sprint:** 2
**Pontos:** 13
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-005 (Molecules Core)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter Organisms essenciais implementados,
**Para que** eu possa montar páginas completas rapidamente.

---

## Contexto

Organisms são seções complexas compostas de múltiplas Molecules.
Esta story implementa os 8 Organisms críticos para o app.

---

## Acceptance Criteria

### Sidebar
- [ ] Logo + collapse button
- [ ] Quick actions (New Goal, Quick Capture)
- [ ] Navigation sections com NavItems
- [ ] Module sections separadas (AI / Business)
- [ ] User card com avatar + name
- [ ] Collapsed state (só ícones)
- [ ] Mobile drawer mode

### Header
- [ ] Breadcrumb
- [ ] Page title + icon
- [ ] Action buttons
- [ ] Search input (opcional)
- [ ] Filters dropdown (opcional)

### GoalCard
- [ ] Priority badge
- [ ] Title + description
- [ ] Progress bar com porcentagem
- [ ] Key Results list (expandable)
- [ ] Entity Links section
- [ ] Meta info (assignee, comments, attachments)
- [ ] Quick actions menu

### HabitTracker
- [ ] List de HabitRows
- [ ] Progress ring geral
- [ ] Stats (streak, completion rate)
- [ ] Today/week/month toggle
- [ ] Quick complete (swipe ou click)

### InboxItem
- [ ] Type icon (text, voice, link)
- [ ] Content preview
- [ ] Timestamp
- [ ] AI suggestion badge
- [ ] Action buttons (Accept, Edit, Archive)

### NotificationPanel
- [ ] Header com count + mark all read
- [ ] Notification list (scrollable)
- [ ] Empty state
- [ ] Load more / pagination
- [ ] Grouped by date

### DataTable
- [ ] Column headers (sortable)
- [ ] Rows com selection
- [ ] Pagination
- [ ] Bulk actions bar
- [ ] Empty state
- [ ] Loading state

### CommandPalette
- [ ] Modal overlay
- [ ] SearchInput
- [ ] Command groups
- [ ] Keyboard navigation
- [ ] Recent commands
- [ ] ⌘K trigger

---

## Technical Details

### Sidebar Component

```tsx
// src/components/organisms/Sidebar/Sidebar.tsx
import { useState } from "react";
import { Icon, Avatar, Badge, Button, NavItem } from "@/components/ui";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const aiModules = [
  { icon: "Sparkles", label: "Synthetic Minds", href: "/minds" },
  { icon: "MessageSquare", label: "Inbox", href: "/inbox", badge: 5 },
];

const businessModules = [
  { icon: "Compass", label: "Journey", href: "/journey", subItems: [
    { label: "Dashboard", href: "/journey" },
    { label: "Goals", href: "/journey/goals" },
    { label: "Habits", href: "/journey/habits" },
    { label: "Library", href: "/journey/library" },
  ]},
  { icon: "GraduationCap", label: "Academy", href: "/academy" },
  { icon: "Palette", label: "Brand", href: "/brand" },
  { icon: "Target", label: "Strategy", href: "/strategy" },
  { icon: "Layers", label: "PrototypOS", href: "/prototypos" },
];

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>("Journey");

  return (
    <aside className={`
      flex flex-col h-screen bg-zinc-950 border-r border-zinc-800
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-eximia-400 rounded-lg flex items-center justify-center">
              <span className="font-bold text-zinc-900">E</span>
            </div>
            <span className="font-semibold text-white">ExímIA OS</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
        >
          <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 space-y-2">
          <Button variant="primary" className="w-full justify-start">
            <Icon name="Plus" size={16} />
            <span>Nova Meta</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Zap" size={16} />
            <span>Captura Rápida</span>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* AI Section */}
        <div>
          {!collapsed && (
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              AI
            </span>
          )}
          <div className="mt-2 space-y-1">
            {aiModules.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon as any}
                label={item.label}
                href={item.href}
                badge={item.badge}
                isCollapsed={collapsed}
              />
            ))}
          </div>
        </div>

        {/* Business Section */}
        <div>
          {!collapsed && (
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Business
            </span>
          )}
          <div className="mt-2 space-y-1">
            {businessModules.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon as any}
                label={item.label}
                href={item.href}
                isCollapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-zinc-800">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <Avatar name="Hugo Capitelli" size="sm" status="online" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Hugo Capitelli</p>
              <Badge variant="primary" size="sm">PRO</Badge>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
```

### Header Component

```tsx
// src/components/organisms/Header/Header.tsx
import { Breadcrumb, SearchInput, Button, Icon } from "@/components/ui";
import * as LucideIcons from "lucide-react";

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  icon?: keyof typeof LucideIcons;
  description?: string;
  actions?: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({
  breadcrumbs,
  title,
  icon,
  description,
  actions,
  showSearch,
  onSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <div className="p-4 space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-eximia-400/10 rounded-lg">
                <Icon name={icon} size={24} className="text-eximia-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && <p className="text-sm text-zinc-400">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Search */}
        {showSearch && (
          <SearchInput
            placeholder="Buscar..."
            onChange={onSearch}
          />
        )}
      </div>
    </header>
  );
}
```

### GoalCard Component

```tsx
// src/components/organisms/GoalCard/GoalCard.tsx
import { useState } from "react";
import { Card, CardContent, Badge, Icon, Button, Avatar } from "@/components/ui";

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
}

interface EntityLink {
  module: string;
  type: string;
  label: string;
  href: string;
}

interface GoalCardProps {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  progress: number;
  dueDate: string;
  daysRemaining: number;
  keyResults: KeyResult[];
  entityLinks?: EntityLink[];
  assignee?: { name: string; avatar?: string };
  commentsCount?: number;
  attachmentsCount?: number;
  onView?: (id: string) => void;
}

const priorityConfig = {
  high: { label: "HIGH", variant: "error" as const },
  medium: { label: "MED", variant: "warning" as const },
  low: { label: "LOW", variant: "default" as const },
};

export function GoalCard({
  id,
  title,
  description,
  priority,
  progress,
  dueDate,
  daysRemaining,
  keyResults,
  entityLinks,
  assignee,
  commentsCount,
  attachmentsCount,
  onView,
}: GoalCardProps) {
  const [showKRs, setShowKRs] = useState(false);
  const config = priorityConfig[priority];

  return (
    <Card hoverable onClick={() => onView?.(id)}>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} size="sm">{config.label}</Badge>
            <Icon name="Target" size={18} className="text-eximia-400" />
          </div>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
            <Icon name="MoreHorizontal" size={18} />
          </Button>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-zinc-500">{dueDate} • {daysRemaining} dias restantes</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-400">Progresso</span>
            <span className="font-medium text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-eximia-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Key Results */}
        {keyResults.length > 0 && (
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowKRs(!showKRs); }}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
            >
              <Icon name={showKRs ? "ChevronDown" : "ChevronRight"} size={16} />
              <span>{keyResults.length} Key Results</span>
            </button>
            {showKRs && (
              <div className="mt-2 space-y-2 pl-4 border-l border-zinc-800">
                {keyResults.map((kr) => (
                  <div key={kr.id} className="flex items-center gap-2 text-sm">
                    <Icon
                      name={kr.completed ? "CheckCircle" : "Circle"}
                      size={14}
                      className={kr.completed ? "text-green-400" : "text-zinc-600"}
                    />
                    <span className={kr.completed ? "text-zinc-500 line-through" : "text-zinc-300"}>
                      {kr.title}
                    </span>
                    <span className="ml-auto text-zinc-500">{kr.progress}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Entity Links */}
        {entityLinks && entityLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entityLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 hover:text-white"
              >
                <span>{link.module}:</span>
                <span className="text-zinc-300">{link.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            {assignee && <Avatar name={assignee.name} src={assignee.avatar} size="xs" />}
            {commentsCount !== undefined && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Icon name="MessageSquare" size={12} />
                {commentsCount}
              </span>
            )}
            {attachmentsCount !== undefined && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Icon name="Paperclip" size={12} />
                {attachmentsCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm">
            Ver Detalhes <Icon name="ArrowRight" size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### InboxItem Component

```tsx
// src/components/organisms/InboxItem/InboxItem.tsx
import { Card, CardContent, Badge, Icon, Button } from "@/components/ui";

interface AISuggestion {
  module: string;
  type: string;
  confidence: number;
}

interface InboxItemProps {
  id: string;
  type: "text" | "voice" | "link";
  content: string;
  timestamp: string;
  suggestion?: AISuggestion;
  onAccept?: (id: string) => void;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const typeIcons = {
  text: "FileText",
  voice: "Mic",
  link: "Link",
} as const;

export function InboxItem({
  id,
  type,
  content,
  timestamp,
  suggestion,
  onAccept,
  onEdit,
  onArchive,
}: InboxItemProps) {
  return (
    <Card hoverable>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Icon name={typeIcons[type]} size={18} className="text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white">{content}</p>
            <p className="text-xs text-zinc-500 mt-1">{timestamp}</p>
          </div>
        </div>

        {suggestion && (
          <div className="flex items-center gap-2 p-2 bg-eximia-400/5 border border-eximia-400/20 rounded-lg">
            <Icon name="Sparkles" size={16} className="text-eximia-400" />
            <span className="text-sm text-zinc-300">
              Sugestão: <span className="text-eximia-400">{suggestion.module} / {suggestion.type}</span>
            </span>
            <Badge variant="primary" size="sm">{suggestion.confidence}%</Badge>
          </div>
        )}

        <div className="flex items-center gap-2">
          {onAccept && (
            <Button size="sm" onClick={() => onAccept(id)}>
              <Icon name="Check" size={14} /> Aceitar
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(id)}>
              Editar Destino
            </Button>
          )}
          {onArchive && (
            <Button variant="ghost" size="sm" onClick={() => onArchive(id)}>
              Arquivar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Tasks

- [ ] Criar `Sidebar` organism com collapse state
- [ ] Criar `Header` organism com breadcrumb
- [ ] Criar `GoalCard` organism com KRs expandable
- [ ] Criar `HabitTracker` organism
- [ ] Criar `InboxItem` organism com AI suggestion
- [ ] Criar `NotificationPanel` organism
- [ ] Criar `DataTable` organism
- [ ] Criar `CommandPalette` organism com ⌘K
- [ ] Atualizar exports em `components/organisms/index.ts`
- [ ] Testar composição com Molecules

---

## Definition of Done

- [ ] 8 Organisms implementados
- [ ] Composição com Atoms/Molecules funcionando
- [ ] TypeScript sem erros
- [ ] Responsividade básica
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/components/organisms/
├── Sidebar/
│   ├── Sidebar.tsx           [CREATE]
│   └── index.ts              [CREATE]
├── Header/
│   ├── Header.tsx            [CREATE]
│   └── index.ts              [CREATE]
├── GoalCard/
│   ├── GoalCard.tsx          [CREATE]
│   └── index.ts              [CREATE]
├── HabitTracker/
│   ├── HabitTracker.tsx      [CREATE]
│   └── index.ts              [CREATE]
├── InboxItem/
│   ├── InboxItem.tsx         [CREATE]
│   └── index.ts              [CREATE]
├── NotificationPanel/
│   ├── NotificationPanel.tsx [CREATE]
│   └── index.ts              [CREATE]
├── DataTable/
│   ├── DataTable.tsx         [CREATE]
│   └── index.ts              [CREATE]
├── CommandPalette/
│   ├── CommandPalette.tsx    [CREATE]
│   └── index.ts              [CREATE]
└── index.ts                  [CREATE]
```

---

## Referências

- [PRD Design System - Organisms](../../00_Core/PRD-Design-System-v5.0.md#5-organisms)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
