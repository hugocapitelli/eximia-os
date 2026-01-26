# Story EXIMIA-002: Implementar Design Tokens

**Story ID:** EXIMIA-002
**Epic:** EXIMIA-EPIC-001 (Technical Debt Resolution)
**Sprint:** 1
**Pontos:** 5
**Prioridade:** P0 (Crítico)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter Design Tokens configurados,
**Para que** eu possa construir componentes consistentes sem cores hardcoded.

---

## Contexto

Atualmente o projeto usa cores hardcoded (#FDBF68) diretamente nos componentes. O PRD define um sistema completo de tokens que precisa ser implementado.

---

## Acceptance Criteria

- [ ] Tokens de cores ExímIA (10 shades) configurados
- [ ] Tokens de cores semânticas (success, error, warning, info)
- [ ] Tokens de tipografia (sizes, families)
- [ ] Tokens de espaçamento (scale 4px)
- [ ] Tokens de bordas (radius)
- [ ] Tokens de sombras
- [ ] Tokens de animação
- [ ] globals.css atualizado
- [ ] Cores hardcoded substituídas nos componentes existentes

---

## Technical Details

### Design Tokens CSS

```css
/* src/app/globals.css */

@import "tailwindcss";

/* ==========================================================================
   EXIMIA OS — DESIGN TOKENS
   ========================================================================== */

/* CORES BASE (ExímIA Gold) */
:root {
  --eximia-50:  #FFF9F0;
  --eximia-100: #FEF0DC;
  --eximia-200: #FDE4C4;
  --eximia-300: #FDD59A;
  --eximia-400: #FDBF68;  /* ★ COR PRINCIPAL ★ */
  --eximia-500: #E5A850;
  --eximia-600: #CC9340;
  --eximia-700: #A67530;
  --eximia-800: #805A25;
  --eximia-900: #5C401A;
}

/* CORES SEMÂNTICAS */
:root {
  --success: #22c55e;
  --warning: #FDBF68;
  --error:   #ef4444;
  --info:    #3b82f6;
}

/* BACKGROUND & FOREGROUND */
:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #71717a;
  --card: #18181b;
  --border: #27272a;
}

/* TIPOGRAFIA */
:root {
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-heading: 'Cal Sans', 'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
}

/* ESPAÇAMENTO (4px base) */
:root {
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}

/* BORDAS */
:root {
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-full: 9999px;
}

/* SOMBRAS */
:root {
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* ANIMAÇÃO */
:root {
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
}

/* TAILWIND THEME EXTENSION */
@theme inline {
  --color-eximia-50: var(--eximia-50);
  --color-eximia-100: var(--eximia-100);
  --color-eximia-200: var(--eximia-200);
  --color-eximia-300: var(--eximia-300);
  --color-eximia-400: var(--eximia-400);
  --color-eximia-500: var(--eximia-500);
  --color-eximia-600: var(--eximia-600);
  --color-eximia-700: var(--eximia-700);
  --color-eximia-800: var(--eximia-800);
  --color-eximia-900: var(--eximia-900);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-muted: var(--muted);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
```

### Refatorar Componentes Existentes

**Login.tsx - Antes:**
```tsx
className="focus:ring-[#FDBF68]"
className="bg-[#FDBF68] hover:bg-[#E5A850]"
className="text-[#FDBF68]"
```

**Login.tsx - Depois:**
```tsx
className="focus:ring-eximia-400"
className="bg-eximia-400 hover:bg-eximia-500"
className="text-eximia-400"
```

---

## Tasks

- [ ] Atualizar `globals.css` com todos os tokens
- [ ] Configurar extensão Tailwind com tokens
- [ ] Refatorar `Logo.tsx` para usar tokens
- [ ] Refatorar `login/page.tsx` para usar tokens
- [ ] Refatorar `register/page.tsx` para usar tokens
- [ ] Refatorar `dashboard/page.tsx` para usar tokens
- [ ] Testar visualmente todas as páginas
- [ ] Verificar dark mode funciona

---

## Definition of Done

- [ ] Nenhum #FDBF68 hardcoded no código
- [ ] Todas as páginas usando tokens
- [ ] Visual idêntico ao atual
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── app/
│   ├── globals.css                 [MODIFY]
│   ├── (auth)/
│   │   ├── login/page.tsx          [MODIFY]
│   │   └── register/page.tsx       [MODIFY]
│   └── (dashboard)/
│       └── dashboard/page.tsx      [MODIFY]
└── components/
    └── Logo.tsx                    [MODIFY]
```

---

## Referências

- [PRD Design System](../../00_Core/PRD-Design-System-v5.0.md)
- [Frontend Spec](../frontend/frontend-spec.md)

---

**Story criada pelo Brownfield Discovery Workflow**
**Data:** 2026-01-26
