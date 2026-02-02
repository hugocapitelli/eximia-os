# Story EXIMIA-003: Criar Atoms Base

**Story ID:** EXIMIA-003
**Epic:** EXIMIA-EPIC-001 (Technical Debt Resolution)
**Sprint:** 1
**Pontos:** 8
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-002 (Design Tokens)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter componentes Atoms base implementados,
**Para que** eu possa construir interfaces consistentes rapidamente.

---

## Contexto

O PRD define 12+ Atoms. Esta story foca nos 4 mais críticos:
- **Button** - CTAs e ações
- **Input** - Formulários
- **Badge** - Status e tags
- **Spinner** - Loading states

---

## Acceptance Criteria

### Button
- [ ] 5 variants: primary, secondary, ghost, danger, success
- [ ] 3 sizes: sm, md, lg
- [ ] 6 states: default, hover, focus, active, disabled, loading
- [ ] Suporte a ícone (left/right)
- [ ] Loading state com spinner

### Input
- [ ] 3 variants: default, filled, outline
- [ ] States: default, focus, error, success, disabled
- [ ] Suporte a ícone (left/right)
- [ ] Helper text
- [ ] Error message

### Badge
- [ ] 6 variants: default, primary, success, warning, error, outline
- [ ] 2 sizes: sm, md

### Spinner
- [ ] 3 sizes: sm, md, lg
- [ ] Cor customizável

---

## Technical Details

### Estrutura de Arquivos

```
src/
└── components/
    └── ui/
        ├── Button/
        │   ├── Button.tsx
        │   └── index.ts
        ├── Input/
        │   ├── Input.tsx
        │   └── index.ts
        ├── Badge/
        │   ├── Badge.tsx
        │   └── index.ts
        ├── Spinner/
        │   ├── Spinner.tsx
        │   └── index.ts
        └── index.ts
```

### Button Component

```tsx
// src/components/ui/Button/Button.tsx
import { forwardRef } from "react";
import { Spinner } from "../Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: "bg-eximia-400 hover:bg-eximia-500 text-zinc-900 font-semibold",
  secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
  ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, leftIcon, rightIcon, children, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg transition-all
          focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:ring-offset-2 focus:ring-offset-zinc-900
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-[0.98]
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### Input Component

```tsx
// src/components/ui/Input/Input.tsx
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "outline";
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", error, success, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    const stateClasses = error
      ? "border-red-500 focus:ring-red-500"
      : success
      ? "border-green-500 focus:ring-green-500"
      : "border-zinc-800 focus:ring-eximia-400";

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-zinc-900 border rounded-lg
              text-white placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${stateClasses}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? "text-red-400" : "text-zinc-500"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
```

### Badge Component

```tsx
// src/components/ui/Badge/Badge.tsx
export interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variants = {
  default: "bg-zinc-700 text-zinc-200",
  primary: "bg-eximia-400/20 text-eximia-400",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  error: "bg-red-500/20 text-red-400",
  outline: "border border-zinc-600 text-zinc-400 bg-transparent",
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

export function Badge({ variant = "default", size = "md", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
```

### Spinner Component

```tsx
// src/components/ui/Spinner/Spinner.tsx
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

### Index Exports

```tsx
// src/components/ui/index.ts
export * from "./Button";
export * from "./Input";
export * from "./Badge";
export * from "./Spinner";
```

---

## Tasks

- [ ] Criar estrutura de pastas `components/ui/`
- [ ] Implementar `Button` component
- [ ] Implementar `Input` component
- [ ] Implementar `Badge` component
- [ ] Implementar `Spinner` component
- [ ] Criar exports em `index.ts`
- [ ] Refatorar Login page para usar novos componentes
- [ ] Refatorar Register page para usar novos componentes
- [ ] Testar todos os variants e states

---

## Definition of Done

- [ ] 4 Atoms implementados
- [ ] Todos os variants funcionando
- [ ] Login/Register usando os novos Atoms
- [ ] TypeScript sem erros
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── components/
│   └── ui/
│       ├── Button/
│       │   ├── Button.tsx          [CREATE]
│       │   └── index.ts            [CREATE]
│       ├── Input/
│       │   ├── Input.tsx           [CREATE]
│       │   └── index.ts            [CREATE]
│       ├── Badge/
│       │   ├── Badge.tsx           [CREATE]
│       │   └── index.ts            [CREATE]
│       ├── Spinner/
│       │   ├── Spinner.tsx         [CREATE]
│       │   └── index.ts            [CREATE]
│       └── index.ts                [CREATE]
└── app/
    └── (auth)/
        ├── login/page.tsx          [MODIFY]
        └── register/page.tsx       [MODIFY]
```

---

## Referências

- [PRD Design System - Atoms](../../00_Core/PRD-Design-System-v5.0.md#3-atoms)
- [Frontend Spec](../frontend/frontend-spec.md)

---

**Story criada pelo Brownfield Discovery Workflow**
**Data:** 2026-01-26
