# Story EXIMIA-005: Molecules Core

**Story ID:** EXIMIA-005
**Epic:** EXIMIA-EPIC-002 (Design System Foundation)
**Sprint:** 2
**Pontos:** 13
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-004 (Atoms Estendidos)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter Molecules essenciais implementadas,
**Para que** eu possa compor interfaces complexas rapidamente.

---

## Contexto

Molecules são combinações de Atoms que formam unidades funcionais.
O PRD especifica 15+ Molecules. Esta story foca nas 10 mais críticas para o app.

---

## Acceptance Criteria

### FormField
- [ ] Composição: Label + Input/Select/Textarea + HelperText
- [ ] Required indicator (*)
- [ ] Tooltip de ajuda opcional
- [ ] Error/success states propagados

### MetricCard
- [ ] Icon + Label + Value + Trend
- [ ] Progress bar opcional
- [ ] Comparison (vs previous period)
- [ ] Click handler opcional

### NavItem
- [ ] Icon + Label + Badge
- [ ] Active/hover/disabled states
- [ ] Collapsible (só ícone)
- [ ] Sub-items suporte

### SearchInput
- [ ] Icon de busca
- [ ] Keyboard shortcut indicator (⌘K)
- [ ] Clear button
- [ ] Loading state

### EntityLink
- [ ] Icon do módulo + Label
- [ ] Badge de tipo
- [ ] Preview on hover (opcional)
- [ ] Click navigation

### Breadcrumb
- [ ] Items separados por chevron
- [ ] Current item não clicável
- [ ] Truncation para paths longos
- [ ] Home icon opcional

### Toast/Notification
- [ ] 4 variants: info, success, warning, error
- [ ] Title + description
- [ ] Close button
- [ ] Auto-dismiss timer
- [ ] Action button opcional

### Dropdown
- [ ] Trigger button
- [ ] Menu items
- [ ] Dividers
- [ ] Icons em items
- [ ] Keyboard navigation

### Tabs
- [ ] TabList container
- [ ] TabTrigger items
- [ ] TabContent panels
- [ ] Horizontal/vertical layout
- [ ] Icons em tabs

### Card
- [ ] Header (title + description)
- [ ] Content area
- [ ] Footer (actions)
- [ ] Hover effect
- [ ] Click handler opcional

---

## Technical Details

### FormField Component

```tsx
// src/components/ui/FormField/FormField.tsx
import { Input, InputProps } from "../Input";
import { Icon } from "../Icon";

export interface FormFieldProps extends InputProps {
  label: string;
  required?: boolean;
  tooltip?: string;
}

export function FormField({ label, required, tooltip, error, helperText, ...inputProps }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-zinc-200">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {tooltip && (
          <div className="group relative">
            <Icon name="HelpCircle" size={14} className="text-zinc-500 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block">
              <div className="bg-zinc-800 text-xs text-zinc-300 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {tooltip}
              </div>
            </div>
          </div>
        )}
      </div>
      <Input error={error} helperText={helperText} {...inputProps} />
    </div>
  );
}
```

### MetricCard Component

```tsx
// src/components/ui/MetricCard/MetricCard.tsx
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import * as LucideIcons from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: keyof typeof LucideIcons;
  trend?: { value: number; label: string };
  progress?: { current: number; total: number };
  onClick?: () => void;
}

export function MetricCard({ label, value, icon, trend, progress, onClick }: MetricCardProps) {
  const trendColor = trend && trend.value > 0 ? "text-green-400" : trend && trend.value < 0 ? "text-red-400" : "text-zinc-400";
  const trendIcon = trend && trend.value > 0 ? "TrendingUp" : trend && trend.value < 0 ? "TrendingDown" : "Minus";

  return (
    <div
      onClick={onClick}
      className={`
        bg-zinc-900 border border-zinc-800 rounded-xl p-4
        ${onClick ? "cursor-pointer hover:border-zinc-700 transition-colors" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-400">{label}</span>
        {icon && <Icon name={icon} size={20} className="text-zinc-500" />}
      </div>

      <div className="text-3xl font-bold text-white mb-2">{value}</div>

      {progress && (
        <div className="mb-2">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-eximia-400 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-zinc-500 mt-1">
            {progress.current}/{progress.total}
          </span>
        </div>
      )}

      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <Icon name={trendIcon as any} size={16} />
          <span>{trend.value > 0 ? "+" : ""}{trend.value}%</span>
          <span className="text-zinc-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
```

### NavItem Component

```tsx
// src/components/ui/NavItem/NavItem.tsx
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import * as LucideIcons from "lucide-react";

export interface NavItemProps {
  icon: keyof typeof LucideIcons;
  label: string;
  href?: string;
  badge?: number | string;
  isActive?: boolean;
  isCollapsed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function NavItem({
  icon,
  label,
  href,
  badge,
  isActive,
  isCollapsed,
  disabled,
  onClick,
  children,
}: NavItemProps) {
  const baseClasses = `
    flex items-center gap-3 px-3 py-2 rounded-lg transition-all
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  const stateClasses = isActive
    ? "bg-eximia-400/10 text-eximia-400 border-l-2 border-eximia-400"
    : "text-zinc-400 hover:text-white hover:bg-zinc-800";

  const content = (
    <>
      <Icon name={icon} size={20} />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{label}</span>
          {badge && (
            <Badge variant="primary" size="sm">
              {badge}
            </Badge>
          )}
        </>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={`${baseClasses} ${stateClasses}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${stateClasses} w-full text-left`}
    >
      {content}
    </button>
  );
}
```

### SearchInput Component

```tsx
// src/components/ui/SearchInput/SearchInput.tsx
import { useState } from "react";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  shortcut?: string;
}

export function SearchInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Buscar...",
  loading,
  shortcut = "⌘K",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(displayValue);
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
        {loading ? <Spinner size="sm" /> : <Icon name="Search" size={18} />}
      </div>

      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-20 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg
          text-white placeholder-zinc-500
          focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:border-transparent
          transition-all
        "
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {displayValue && (
          <button onClick={handleClear} className="text-zinc-500 hover:text-white">
            <Icon name="X" size={16} />
          </button>
        )}
        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded">
          {shortcut}
        </kbd>
      </div>
    </div>
  );
}
```

### Toast Component

```tsx
// src/components/ui/Toast/Toast.tsx
import { useEffect } from "react";
import { Icon } from "../Icon";

export interface ToastProps {
  id: string;
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: { label: string; onClick: () => void };
}

const variants = {
  info: { icon: "Info", bg: "bg-blue-500/10", border: "border-blue-500/20", iconColor: "text-blue-400" },
  success: { icon: "CheckCircle", bg: "bg-green-500/10", border: "border-green-500/20", iconColor: "text-green-400" },
  warning: { icon: "AlertTriangle", bg: "bg-yellow-500/10", border: "border-yellow-500/20", iconColor: "text-yellow-400" },
  error: { icon: "XCircle", bg: "bg-red-500/10", border: "border-red-500/20", iconColor: "text-red-400" },
};

export function Toast({ id, variant = "info", title, description, duration = 5000, onClose, action }: ToastProps) {
  const config = variants[variant];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border
      ${config.bg} ${config.border}
      shadow-lg animate-slide-up
    `}>
      <Icon name={config.icon as any} size={20} className={config.iconColor} />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{title}</p>
        {description && <p className="text-sm text-zinc-400 mt-0.5">{description}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-eximia-400 hover:underline mt-2"
          >
            {action.label}
          </button>
        )}
      </div>

      <button onClick={() => onClose(id)} className="text-zinc-500 hover:text-white">
        <Icon name="X" size={18} />
      </button>
    </div>
  );
}
```

### Breadcrumb Component

```tsx
// src/components/ui/Breadcrumb/Breadcrumb.tsx
import { Icon } from "../Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const allItems = showHome ? [{ label: "Home", href: "/" }, ...items] : items;

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <Icon name="ChevronRight" size={14} className="text-zinc-600" />}

            {isLast ? (
              <span className="text-zinc-200 font-medium">{item.label}</span>
            ) : (
              <a
                href={item.href}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {index === 0 && showHome ? (
                  <Icon name="Home" size={14} />
                ) : (
                  item.label
                )}
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

### Card Component

```tsx
// src/components/ui/Card/Card.tsx
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden
        ${hoverable || onClick ? "hover:border-zinc-700 transition-colors cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 border-b border-zinc-800 ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-white">{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-400 mt-1">{children}</p>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 border-t border-zinc-800 flex items-center gap-2 ${className}`}>{children}</div>;
}
```

---

## Tasks

- [ ] Criar `FormField` molecule
- [ ] Criar `MetricCard` molecule
- [ ] Criar `NavItem` molecule
- [ ] Criar `SearchInput` molecule
- [ ] Criar `EntityLink` molecule
- [ ] Criar `Breadcrumb` molecule
- [ ] Criar `Toast` molecule + ToastProvider context
- [ ] Criar `Dropdown` molecule
- [ ] Criar `Tabs` molecule (TabList, TabTrigger, TabContent)
- [ ] Criar `Card` molecule (Card, CardHeader, CardContent, CardFooter)
- [ ] Atualizar exports em `components/ui/index.ts`

---

## Definition of Done

- [ ] 10 Molecules implementadas
- [ ] TypeScript sem erros
- [ ] Composição com Atoms funcionando
- [ ] Acessibilidade básica
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/components/ui/
├── FormField/
│   ├── FormField.tsx         [CREATE]
│   └── index.ts              [CREATE]
├── MetricCard/
│   ├── MetricCard.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── NavItem/
│   ├── NavItem.tsx           [CREATE]
│   └── index.ts              [CREATE]
├── SearchInput/
│   ├── SearchInput.tsx       [CREATE]
│   └── index.ts              [CREATE]
├── EntityLink/
│   ├── EntityLink.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── Breadcrumb/
│   ├── Breadcrumb.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── Toast/
│   ├── Toast.tsx             [CREATE]
│   ├── ToastProvider.tsx     [CREATE]
│   └── index.ts              [CREATE]
├── Dropdown/
│   ├── Dropdown.tsx          [CREATE]
│   └── index.ts              [CREATE]
├── Tabs/
│   ├── Tabs.tsx              [CREATE]
│   └── index.ts              [CREATE]
├── Card/
│   ├── Card.tsx              [CREATE]
│   └── index.ts              [CREATE]
└── index.ts                  [MODIFY]
```

---

## Referências

- [PRD Design System - Molecules](../../00_Core/PRD-Design-System-v5.0.md#4-molecules)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
