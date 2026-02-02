# Story EXIMIA-004: Atoms Estendidos

**Story ID:** EXIMIA-004
**Epic:** EXIMIA-EPIC-002 (Design System Foundation)
**Sprint:** 2
**Pontos:** 8
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-003 (Atoms Base)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter todos os Atoms do Design System implementados,
**Para que** eu possa construir qualquer interface sem criar componentes ad-hoc.

---

## Contexto

O PRD especifica 12+ Atoms. A story 003 cobriu Button, Input, Badge, Spinner.
Esta story implementa os 8 Atoms restantes necessários para o app completo.

---

## Acceptance Criteria

### Icon (Wrapper Lucide)
- [ ] Props: name, size (16/20/24/32), color, strokeWidth
- [ ] Type-safe icon names
- [ ] Fallback para ícone desconhecido

### Avatar
- [ ] 5 sizes: xs, sm, md, lg, xl
- [ ] Fallback com initials
- [ ] Status indicator (online/offline/busy)
- [ ] Suporte a imagem

### Typography
- [ ] Variants: display, h1, h2, h3, h4, body, bodySerif, caption, code
- [ ] Semantic HTML tags (h1-h6, p, span, code)
- [ ] Cores customizáveis
- [ ] Weights configuráveis

### Checkbox
- [ ] States: checked, unchecked, indeterminate
- [ ] Disabled state
- [ ] With label support
- [ ] Focus ring

### Radio
- [ ] RadioGroup container
- [ ] Individual Radio items
- [ ] Disabled state
- [ ] Horizontal/vertical layout

### Switch/Toggle
- [ ] On/off states
- [ ] Loading state
- [ ] Disabled state
- [ ] With label (left/right)

### Select
- [ ] Single select
- [ ] Multi-select
- [ ] Searchable
- [ ] Disabled state
- [ ] Custom option rendering

### Textarea
- [ ] Auto-resize opcional
- [ ] Character count
- [ ] Min/max rows
- [ ] Error/success states

---

## Technical Details

### Icon Component

```tsx
// src/components/ui/Icon/Icon.tsx
import * as LucideIcons from "lucide-react";

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: 16 | 20 | 24 | 32;
  color?: string;
  strokeWidth?: 1.5 | 2 | 2.5;
  className?: string;
}

export function Icon({ name, size = 24, color, strokeWidth = 2, className }: IconProps) {
  const LucideIcon = LucideIcons[name] as React.ComponentType<any>;

  if (!LucideIcon) {
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
```

### Avatar Component

```tsx
// src/components/ui/Avatar/Avatar.tsx
export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-zinc-500",
  busy: "bg-red-500",
};

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function Avatar({ src, alt, name, size = "md", status }: AvatarProps) {
  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={`${sizes[size]} rounded-full object-cover bg-zinc-800`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-eximia-400/20 text-eximia-400 flex items-center justify-center font-semibold`}>
          {name ? getInitials(name) : "?"}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${statusColors[status]}`} />
      )}
    </div>
  );
}
```

### Typography Component

```tsx
// src/components/ui/Typography/Typography.tsx
import { createElement } from "react";

type Variant = "display" | "h1" | "h2" | "h3" | "h4" | "body" | "bodySerif" | "caption" | "code";

export interface TypographyProps {
  variant?: Variant;
  as?: keyof JSX.IntrinsicElements;
  color?: "default" | "muted" | "primary" | "error" | "success";
  weight?: "normal" | "medium" | "semibold" | "bold";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  display: "text-5xl font-bold tracking-tight",
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-medium",
  body: "text-base",
  bodySerif: "text-lg font-serif",
  caption: "text-sm text-zinc-400",
  code: "text-sm font-mono bg-zinc-800 px-1.5 py-0.5 rounded",
};

const defaultTags: Record<Variant, keyof JSX.IntrinsicElements> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  bodySerif: "p",
  caption: "span",
  code: "code",
};

const colorStyles = {
  default: "text-white",
  muted: "text-zinc-400",
  primary: "text-eximia-400",
  error: "text-red-400",
  success: "text-green-400",
};

export function Typography({
  variant = "body",
  as,
  color = "default",
  weight,
  children,
  className,
}: TypographyProps) {
  const tag = as || defaultTags[variant];
  const weightClass = weight ? `font-${weight}` : "";

  return createElement(
    tag,
    { className: `${variantStyles[variant]} ${colorStyles[color]} ${weightClass} ${className || ""}` },
    children
  );
}
```

### Checkbox Component

```tsx
// src/components/ui/Checkbox/Checkbox.tsx
import { Check, Minus } from "lucide-react";
import { forwardRef } from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, checked, disabled, className, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded border-2 border-zinc-600
            peer-checked:bg-eximia-400 peer-checked:border-eximia-400
            peer-focus:ring-2 peer-focus:ring-eximia-400/50
            transition-all flex items-center justify-center
          `}>
            {indeterminate ? (
              <Minus size={14} className="text-zinc-900" />
            ) : checked ? (
              <Check size={14} className="text-zinc-900" />
            ) : null}
          </div>
        </div>
        {label && <span className="text-sm text-zinc-200">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
```

### Switch Component

```tsx
// src/components/ui/Switch/Switch.tsx
import { forwardRef } from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onChange, disabled, loading, label, labelPosition = "right" }, ref) => {
    const handleClick = () => {
      if (!disabled && !loading && onChange) {
        onChange(!checked);
      }
    };

    const toggle = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:ring-offset-2 focus:ring-offset-zinc-900
          ${checked ? "bg-eximia-400" : "bg-zinc-700"}
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    );

    if (!label) return toggle;

    return (
      <label className="inline-flex items-center gap-3 cursor-pointer">
        {labelPosition === "left" && <span className="text-sm text-zinc-200">{label}</span>}
        {toggle}
        {labelPosition === "right" && <span className="text-sm text-zinc-200">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";
```

---

## Tasks

- [ ] Criar `Icon` component com type-safe names
- [ ] Criar `Avatar` component com initials fallback
- [ ] Criar `Typography` component com todas variants
- [ ] Criar `Checkbox` component com indeterminate
- [ ] Criar `Radio` + `RadioGroup` components
- [ ] Criar `Switch` component com loading
- [ ] Criar `Select` component com search
- [ ] Criar `Textarea` component com auto-resize
- [ ] Atualizar exports em `components/ui/index.ts`
- [ ] Testar todos os components isoladamente

---

## Definition of Done

- [ ] 8 novos Atoms implementados
- [ ] TypeScript sem erros
- [ ] Todos os states funcionando
- [ ] Acessibilidade básica (ARIA labels, focus)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/components/ui/
├── Icon/
│   ├── Icon.tsx              [CREATE]
│   └── index.ts              [CREATE]
├── Avatar/
│   ├── Avatar.tsx            [CREATE]
│   └── index.ts              [CREATE]
├── Typography/
│   ├── Typography.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── Checkbox/
│   ├── Checkbox.tsx          [CREATE]
│   └── index.ts              [CREATE]
├── Radio/
│   ├── Radio.tsx             [CREATE]
│   ├── RadioGroup.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── Switch/
│   ├── Switch.tsx            [CREATE]
│   └── index.ts              [CREATE]
├── Select/
│   ├── Select.tsx            [CREATE]
│   └── index.ts              [CREATE]
├── Textarea/
│   ├── Textarea.tsx          [CREATE]
│   └── index.ts              [CREATE]
└── index.ts                  [MODIFY]
```

---

## Referências

- [PRD Design System - Atoms](../../00_Core/PRD-Design-System-v5.0.md#3-atoms)
- [Lucide Icons](https://lucide.dev/icons/)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
