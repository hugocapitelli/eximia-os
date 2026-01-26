# ExímIA APP - Frontend/UX Specification

**Projeto:** ExímIA APP
**Data:** 2026-01-26
**Versão:** 1.0
**Agente:** @ux-design-expert (via @architect)

---

## Executive Summary

O frontend do exímIA APP está em estágio inicial com **apenas 1 componente implementado** de um Design System planejado com 50+ componentes. A implementação atual cobre apenas autenticação.

| Métrica | Atual | Planejado |
|---------|-------|-----------|
| **Componentes** | 1 | 50+ |
| **Páginas** | 4 | 20+ |
| **Design Tokens** | 2 | 30+ |
| **Atoms** | 0 | 12+ |
| **Molecules** | 0 | 15+ |
| **Organisms** | 0 | 8+ |

---

## 1. Inventário de Componentes

### 1.1 Componentes Implementados

| Componente | Localização | Linhas | Qualidade |
|------------|-------------|--------|-----------|
| **Logo** | `src/components/Logo.tsx` | 59 | Bom |

**Análise do Logo.tsx:**
- Props tipadas corretamente (`LogoProps`)
- 3 variantes de tamanho (sm, md, lg)
- Gradiente ExímIA Gold implementado
- SVG otimizado inline
- Responsivo

### 1.2 Páginas Implementadas

| Página | Rota | Tipo | Status |
|--------|------|------|--------|
| Home | `/` | Redirect | OK |
| Login | `/login` | Client | OK |
| Register | `/register` | Client | OK |
| Dashboard | `/dashboard` | Server | OK |

### 1.3 Layouts Implementados

| Layout | Localização | Escopo |
|--------|-------------|--------|
| Root | `src/app/layout.tsx` | Global |
| Auth | `src/app/(auth)/layout.tsx` | Login/Register |
| Dashboard | `src/app/(dashboard)/layout.tsx` | Área logada |

---

## 2. Gap Analysis: Design System

### 2.1 Tokens (PRD vs Implementado)

| Categoria | PRD | Implementado | Gap |
|-----------|-----|--------------|-----|
| **Cores ExímIA** | 10 shades | 2 hardcoded | 80% |
| **Cores Semânticas** | 4 | 0 | 100% |
| **Tipografia** | 8 sizes + families | Default | 100% |
| **Espaçamento** | 10 values | Default | 100% |
| **Bordas** | 5 values | Default | 100% |
| **Sombras** | 4 values | 0 | 100% |
| **Animação** | 4 durations | 0 | 100% |

**Tokens Hardcoded no Código:**
```typescript
// Encontrados em Login/Register/Dashboard
"#FDBF68"  // ExímIA Gold (deveria ser token)
"#E5A03A"  // ExímIA Gold Dark
"#E5A850"  // Hover variant
```

### 2.2 Atomic Design Gap

#### Atoms (0 de 12 planejados)

| Atom | Status | PRD Ref |
|------|--------|---------|
| Button | NAO EXISTE | 5 variants, 3 sizes, 6 states |
| Input | NAO EXISTE | 3 variants, validations |
| Badge | NAO EXISTE | 6 variants |
| Icon | NAO EXISTE | Lucide system |
| Avatar | NAO EXISTE | Sizes, fallback |
| Typography | NAO EXISTE | Headings, body, mono |
| Checkbox | NAO EXISTE | - |
| Radio | NAO EXISTE | - |
| Toggle | NAO EXISTE | - |
| Select | NAO EXISTE | - |
| Textarea | NAO EXISTE | - |
| Spinner | NAO EXISTE | - |

#### Molecules (0 de 15 planejados)

| Molecule | Status | PRD Ref |
|----------|--------|---------|
| FormField | NAO EXISTE | Label + Input + Helper |
| MetricCard | NAO EXISTE | Dashboards |
| NavItem | NAO EXISTE | Sidebar navigation |
| SearchInput | NAO EXISTE | Cmd+K |
| EntityLink | NAO EXISTE | Connection Layer UI |
| ProgressBar | NAO EXISTE | Goals, courses |
| AlertBox | NAO EXISTE | Errors, warnings |
| Card | NAO EXISTE | Content container |
| Breadcrumb | NAO EXISTE | Navigation |
| Dropdown | NAO EXISTE | Selects, menus |
| Modal | NAO EXISTE | Dialogs |
| Toast | NAO EXISTE | Notifications |
| Tabs | NAO EXISTE | Tab navigation |
| Tooltip | NAO EXISTE | Help text |
| Kbd | NAO EXISTE | Keyboard shortcuts |

#### Organisms (0 de 8 planejados)

| Organism | Status | PRD Ref |
|----------|--------|---------|
| Sidebar | NAO EXISTE | Main navigation |
| Header | NAO EXISTE | Page header |
| GoalCard | NAO EXISTE | Journey module |
| HabitTracker | NAO EXISTE | Journey module |
| InboxItem | NAO EXISTE | Inbox module |
| NotificationPanel | NAO EXISTE | Notifications |
| SuggestionCard | NAO EXISTE | Connection Layer |
| EntityLinkGraph | NAO EXISTE | Visualização |

#### Templates (2 de 5 planejados)

| Template | Status | PRD Ref |
|----------|--------|---------|
| AuthLayout | EXISTE (básico) | Login/Register |
| DashboardLayout | EXISTE (básico) | Dashboard |
| ModuleLayout | NAO EXISTE | Journey, Academy, etc |
| SettingsLayout | NAO EXISTE | Settings pages |
| OnboardingLayout | NAO EXISTE | Onboarding flow |

---

## 3. Análise de Código Existente

### 3.1 globals.css

```css
/* Atual: 27 linhas */
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* Dark mode básico */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

**Problemas:**
1. Apenas 2 tokens definidos
2. Sem paleta ExímIA Gold
3. Sem tokens de espaçamento
4. Sem tokens de tipografia
5. Fonte Arial (deveria ser Inter/Cal Sans)

### 3.2 Padrões de UI Observados

**Login/Register Pages:**
- Cores hardcoded (#FDBF68)
- Tailwind classes diretas (bom)
- Estados de loading básicos
- Validação apenas client-side
- Sem skeleton/shimmer
- Sem error boundaries

**Dashboard Page:**
- Server component (bom)
- Design minimalista
- Sem métricas reais
- Sem sidebar

### 3.3 Consistência Visual

| Aspecto | Análise |
|---------|---------|
| **Cores** | Consistente (#FDBF68) mas hardcoded |
| **Bordas** | Consistente (rounded-lg) |
| **Espaçamento** | Inconsistente (space-y-6, space-y-8) |
| **Tipografia** | Inconsistente |
| **Estados** | Apenas loading/error básicos |

---

## 4. UX Issues Identificados

### 4.1 Críticos

| ID | Issue | Impacto | Solução |
|----|-------|---------|---------|
| UX-001 | Sem Design System | UI inconsistente | Implementar Atomic Design |
| UX-002 | Sem componentes reutilizáveis | Duplicação de código | Criar component library |
| UX-003 | Sem feedback visual adequado | UX pobre | Implementar loading states |

### 4.2 Altos

| ID | Issue | Impacto | Solução |
|----|-------|---------|---------|
| UX-004 | Cores hardcoded | Manutenção difícil | Criar design tokens |
| UX-005 | Sem dark mode toggle | Preferência ignorada | Implementar theme switch |
| UX-006 | Sem skeleton loading | Perceived performance | Adicionar skeletons |
| UX-007 | Formulários sem validação visual | Erros confusos | Adicionar FormField molecule |

### 4.3 Médios

| ID | Issue | Impacto | Solução |
|----|-------|---------|---------|
| UX-008 | Sem breadcrumbs | Navegação confusa | Adicionar breadcrumbs |
| UX-009 | Sem sidebar | Navegação limitada | Implementar Sidebar organism |
| UX-010 | Sem notificações toast | Feedback silencioso | Implementar Toast system |
| UX-011 | Sem keyboard shortcuts | Power users | Implementar Cmd+K |

---

## 5. Accessibility Audit

### 5.1 WCAG Compliance

| Critério | Status | Notas |
|----------|--------|-------|
| **Contraste** | PARCIAL | #FDBF68 em bg escuro OK |
| **Keyboard Nav** | PARCIAL | Tab funciona, sem skip links |
| **Screen Reader** | POBRE | Sem ARIA labels |
| **Focus Indicators** | BOM | Ring outline presente |
| **Motion** | N/A | Sem animações ainda |

### 5.2 Issues de Acessibilidade

1. **Sem labels ARIA** em inputs
2. **Sem role="main"** no conteúdo
3. **Sem skip links** para navegação
4. **Sem anúncios** de loading/error para screen readers

---

## 6. Responsividade

### 6.1 Breakpoints Definidos (PRD)

| Name | Width | Status |
|------|-------|--------|
| `xs` | 0px | Não configurado |
| `sm` | 640px | Tailwind default |
| `md` | 768px | Tailwind default |
| `lg` | 1024px | Tailwind default |
| `xl` | 1280px | Tailwind default |
| `2xl` | 1536px | Tailwind default |

### 6.2 Mobile Experience

| Aspecto | Status |
|---------|--------|
| **PWA Manifest** | NAO EXISTE |
| **Service Worker** | NAO EXISTE |
| **Bottom Navigation** | NAO EXISTE |
| **Touch Gestures** | NAO EXISTE |
| **Offline Support** | NAO EXISTE |

---

## 7. Performance Frontend

### 7.1 Métricas Atuais

| Métrica | Target (PRD) | Estimado |
|---------|--------------|----------|
| **LCP** | < 2.5s | ~1.5s (auth apenas) |
| **FID** | < 100ms | OK |
| **CLS** | < 0.1 | OK |
| **Bundle Size** | < 300KB | ~150KB (mínimo) |

### 7.2 Otimizações Pendentes

- [ ] Code splitting por módulo
- [ ] Image optimization
- [ ] Font optimization (next/font)
- [ ] Lazy loading de componentes
- [ ] React Query para data fetching

---

## 8. Estrutura de Arquivos Recomendada

### 8.1 Atual

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── auth/
│   │   ├── callback/route.ts
│   │   └── signout/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Logo.tsx           ← ÚNICO COMPONENTE
├── lib/
│   └── supabase/
└── middleware.ts
```

### 8.2 Recomendada (PRD)

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── ...
│   ├── molecules/
│   │   ├── FormField/
│   │   ├── MetricCard/
│   │   └── ...
│   ├── organisms/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── ...
│   └── templates/
│       ├── DashboardLayout/
│       └── ...
├── modules/
│   ├── journey/
│   ├── academy/
│   ├── brand/
│   ├── strategy/
│   └── prototyper/
├── app/
└── lib/
```

---

## 9. Débitos Técnicos de Frontend

### 9.1 Críticos (P0)

| ID | Débito | Área | Esforço |
|----|--------|------|---------|
| FE-001 | Design Tokens não implementados | Tokens | 8h |
| FE-002 | Atoms não implementados | Components | 24h |
| FE-003 | Molecules não implementados | Components | 24h |
| FE-004 | Organisms não implementados | Components | 32h |

### 9.2 Altos (P1)

| ID | Débito | Área | Esforço |
|----|--------|------|---------|
| FE-005 | Sidebar não existe | Navigation | 8h |
| FE-006 | PWA não configurado | Mobile | 8h |
| FE-007 | Storybook não configurado | DX | 4h |
| FE-008 | Testes de componentes | QA | 16h |

### 9.3 Médios (P2)

| ID | Débito | Área | Esforço |
|----|--------|------|---------|
| FE-009 | Keyboard shortcuts | UX | 4h |
| FE-010 | Toast notifications | UX | 4h |
| FE-011 | Dark mode toggle | UX | 2h |
| FE-012 | Skeleton loading | UX | 4h |

---

## 10. Recomendações

### 10.1 Prioridade Imediata (Semana 1-2)

1. **Criar Design Tokens**
   ```css
   :root {
     --eximia-400: #FDBF68;
     --eximia-500: #E5A850;
     /* ... */
   }
   ```

2. **Implementar Atoms Base**
   - Button (5 variants)
   - Input (validations)
   - Badge
   - Icon (Lucide)

3. **Refatorar cores hardcoded**
   - Substituir `#FDBF68` por tokens

### 10.2 Curto Prazo (Semanas 3-4)

1. **Implementar Molecules**
   - FormField
   - MetricCard
   - NavItem

2. **Implementar Organisms**
   - Sidebar
   - Header

3. **Configurar Storybook**
   - Documentar componentes
   - Visual regression

### 10.3 Médio Prazo (Semanas 5-8)

1. **Implementar módulos Journey e Academy UI**
2. **Configurar PWA**
3. **Adicionar testes de componentes**
4. **Implementar Connection Layer UI**

---

## 11. Estimativa de Esforço Total

| Categoria | Componentes | Esforço |
|-----------|-------------|---------|
| Design Tokens | 7 categorias | 8h |
| Atoms | 12 | 24h |
| Molecules | 15 | 24h |
| Organisms | 8 | 32h |
| Templates | 3 (novos) | 12h |
| Storybook | Setup + docs | 8h |
| PWA | Config + SW | 8h |
| Testes | Component tests | 16h |
| **TOTAL** | - | **~132h** |

---

## 12. Conclusão

O frontend do exímIA APP está em estado **INICIAL** com:

- **1 componente** de 50+ planejados (2%)
- **0% do Design System** implementado
- **4 páginas básicas** (auth + dashboard placeholder)
- **~132 horas** de trabalho estimado para MVP completo

**Recomendação Principal:** Priorizar implementação de Design Tokens e Atoms base antes de construir features. Isso garantirá consistência visual e reduzirá retrabalho.

---

**Documento gerado automaticamente pelo Brownfield Discovery Workflow**
**Agente:** @ux-design-expert (via @architect)
**Data:** 2026-01-26
