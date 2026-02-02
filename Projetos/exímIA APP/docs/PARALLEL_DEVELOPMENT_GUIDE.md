# ExímIA APP — Guia de Desenvolvimento Paralelo

**Versão:** 1.0
**Data:** 2026-01-29
**Autor:** River (SM)

---

## Resumo Executivo

Este documento define como executar múltiplas instâncias do `@dev` (Claude Code) em paralelo para acelerar o desenvolvimento do exímIA APP. Com a estratégia correta, é possível reduzir o tempo de desenvolvimento de **~35 dias** para **~12-15 dias**.

### Capacidade de Paralelização

| Fase | Instâncias Paralelas | Stories | Pontos |
|------|---------------------|---------|--------|
| **Fase 1** | 3 instâncias | 001, 002, 009 | 18 pts |
| **Fase 2** | 4 instâncias | 003, 011, 014, 015 | 26 pts |
| **Fase 3** | 3 instâncias | 004-007, 012, 016 | 42 pts |
| **Fase 4** | 3 instâncias | 008, 010, 013 | 34 pts |
| **Fase 5** | 2 instâncias | 017, 018 | 16 pts |

---

## Arquitetura de Tracks

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PARALLEL DEVELOPMENT TRACKS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  FASE 1 ─────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                           │
│  │  TRACK A    │   │  TRACK B    │   │  TRACK C    │                           │
│  │   002       │   │   001       │   │   009       │                           │
│  │  Tokens     │   │  DB Schema  │   │  Supabase   │                           │
│  │  (5 pts)    │   │  (8 pts)    │   │  (5 pts)    │                           │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘                           │
│         │                 │                 │                                   │
│  FASE 2 ─────────────────────────────────────────────────────────────────────  │
│         │                 │                 │                                   │
│         ▼                 │                 │                                   │
│  ┌─────────────┐         │                 │                                   │
│  │  TRACK A    │         │                 │                                   │
│  │   003       │         │                 │                                   │
│  │  Atoms      │         ├─────────────────┼─────────────┐                     │
│  │  (8 pts)    │         │                 │             │                     │
│  └──────┬──────┘         ▼                 ▼             ▼                     │
│         │          ┌───────────┐    ┌───────────┐  ┌───────────┐               │
│         │          │  TRACK B  │    │  TRACK C  │  │  TRACK D  │               │
│         │          │   014     │    │   011     │  │   015     │               │
│         │          │  Inbox    │    │  Journey  │  │  Academy  │               │
│         │          │  (8 pts)  │    │  Schema   │  │  Schema   │               │
│         │          └───────────┘    │  (5 pts)  │  │  (5 pts)  │               │
│         │                           └─────┬─────┘  └─────┬─────┘               │
│  FASE 3 ─────────────────────────────────────────────────────────────────────  │
│         │                                 │              │                     │
│         ▼                                 ▼              ▼                     │
│  ┌─────────────┐                   ┌───────────┐  ┌───────────┐               │
│  │  TRACK A    │                   │  TRACK B  │  │  TRACK C  │               │
│  │ 004→005→    │                   │   012     │  │   016     │               │
│  │ 006→007     │                   │  Journey  │  │  Academy  │               │
│  │ (42 pts)    │                   │   API     │  │  API+UI   │               │
│  └──────┬──────┘                   │  (8 pts)  │  │  (13 pts) │               │
│         │                          └─────┬─────┘  └───────────┘               │
│         │                                │                                     │
│  FASE 4 ─────────────────────────────────────────────────────────────────────  │
│         │                                │                                     │
│         ├────────────────┬───────────────┤                                     │
│         │                │               │                                     │
│         ▼                ▼               ▼                                     │
│  ┌─────────────┐  ┌───────────┐  ┌───────────┐                                │
│  │  TRACK A    │  │  TRACK B  │  │  TRACK C  │                                │
│  │   008       │  │   010     │  │   013     │                                │
│  │  DS Library │  │   Auth    │  │ Journey UI│                                │
│  │  (13 pts)   │  │  (8 pts)  │  │  (13 pts) │                                │
│  └─────────────┘  └─────┬─────┘  └───────────┘                                │
│                         │                                                      │
│  FASE 5 ─────────────────────────────────────────────────────────────────────  │
│                         │                                                      │
│                         ├────────────────┐                                     │
│                         │                │                                     │
│                         ▼                ▼                                     │
│                  ┌───────────┐    ┌───────────┐                               │
│                  │  TRACK A  │    │  TRACK B  │                               │
│                  │   017     │    │   018     │                               │
│                  │ Settings  │    │ Onboard   │                               │
│                  │  (8 pts)  │    │  (8 pts)  │                               │
│                  └───────────┘    └───────────┘                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Instruções por Instância

### Como Abrir uma Nova Instância

1. Abra um novo terminal/janela
2. Navegue até o projeto: `cd "Projetos/exímIA APP/exímia-os---synthetic-minds"`
3. Execute: `claude`
4. Ative o agente dev: `/AIOS:agents:dev`
5. Forneça o contexto da track (copie o bloco abaixo)

---

## FASE 1: Foundation (Paralelo Total)

### Instância 1 — Track A: Design Tokens

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** A - Design System
**Story:** EXIMIA-002 (Design Tokens)
**Pontos:** 5
**Dependências:** Nenhuma
**Próxima story:** EXIMIA-003 (Atoms Base)

### Escopo
Implementar design tokens no Tailwind CSS conforme especificação.

### Arquivos a criar/modificar
- tailwind.config.ts
- src/styles/tokens.css (se necessário)

### Referência
Ler: docs/stories/story-002-design-tokens.md

### Comando inicial
Leia a story e implemente os design tokens. Foque em:
1. Cores (eximia gold, minds purple, semantic)
2. Tipografia (font-family, sizes, weights)
3. Espaçamento (scale 4px)
4. Border radius, shadows
```

### Instância 2 — Track B: Database Schema

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** B - Backend/Database
**Story:** EXIMIA-001 (Connection Layer Schema)
**Pontos:** 8
**Dependências:** Nenhuma
**Próxima story:** EXIMIA-014 (Inbox) ou EXIMIA-011 (Journey Schema)

### Escopo
Criar migration SQL para Connection Layer (entidades, links, sugestões).

### Arquivos a criar
- supabase/migrations/001_connection_layer.sql

### Referência
Ler: docs/stories/story-001-connection-layer-schema.md

### Comando inicial
Leia a story e crie a migration SQL. Inclua:
1. Tabelas: entities, entity_links, suggestions
2. Enums necessários
3. Indexes para performance
4. RLS policies
```

### Instância 3 — Track C: Supabase Setup

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** C - Backend Infrastructure
**Story:** EXIMIA-009 (Supabase Setup)
**Pontos:** 5
**Dependências:** Nenhuma
**Próxima story:** EXIMIA-011 (Journey Schema) ou EXIMIA-015 (Academy Schema)

### Escopo
Configurar cliente Supabase (browser + server + middleware).

### Arquivos a criar
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/lib/supabase/middleware.ts
- src/middleware.ts
- app/api/health/route.ts

### Referência
Ler: docs/stories/story-009-supabase-setup.md

### Comando inicial
Leia a story e configure o Supabase SSR. Foque em:
1. Browser client com tipos
2. Server client com cookies
3. Middleware para sessões
4. Healthcheck endpoint

NOTA: Você precisará das credenciais do Supabase em .env.local
```

---

## FASE 2: Expansão (4 Tracks Paralelos)

> **Pré-requisito:** Fase 1 completa

### Instância 1 — Track A: Atoms Base

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** A - Design System
**Story:** EXIMIA-003 (Atoms Base)
**Pontos:** 8
**Dependências:** EXIMIA-002 (Design Tokens) ✅
**Próxima story:** EXIMIA-004 (Atoms Estendidos)

### Escopo
Criar componentes atômicos base: Button, Input, Badge, Spinner.

### Arquivos a criar
- src/components/ui/button.tsx
- src/components/ui/input.tsx
- src/components/ui/badge.tsx
- src/components/ui/spinner.tsx
- src/components/ui/index.ts

### Referência
Ler: docs/stories/story-003-atoms-base.md

### Padrão
- Use tokens do Tailwind
- Exporte via barrel (index.ts)
- Variantes via props (variant, size)
- Compatível com Radix se necessário
```

### Instância 2 — Track B: Inbox Schema + API

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** B - Connection Layer Features
**Story:** EXIMIA-014 (Inbox Module)
**Pontos:** 8
**Dependências:** EXIMIA-001 (Connection Schema) ✅
**Próxima story:** Nenhuma (track independente)

### Escopo
Implementar Inbox: schema, API, AI analyzer mock, UI.

### Arquivos a criar
- supabase/migrations/003_inbox_module.sql
- src/lib/actions/inbox.ts
- src/lib/ai/inbox-analyzer.ts
- src/components/inbox/QuickCapture.tsx
- src/components/inbox/InboxItemCard.tsx

### Referência
Ler: docs/stories/story-014-inbox-module.md

### Nota
Esta é uma track independente que pode ser completada sem esperar outras.
```

### Instância 3 — Track C: Journey Schema

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** C - Journey Module
**Story:** EXIMIA-011 (Journey Database Schema)
**Pontos:** 5
**Dependências:** EXIMIA-001 ✅, EXIMIA-009 ✅
**Próxima story:** EXIMIA-012 (Journey API)

### Escopo
Criar schema do módulo Journey (goals, habits, key_results, books).

### Arquivos a criar
- supabase/migrations/002_journey_module.sql

### Referência
Ler: docs/stories/story-011-journey-schema.md

### Inclui
- Tabelas: goals, key_results, habits, habit_logs, books
- Enums: goal_status, goal_timeframe, habit_frequency
- Triggers para cálculo automático de progresso
- RLS policies
```

### Instância 4 — Track D: Academy Schema

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** D - Academy Module
**Story:** EXIMIA-015 (Academy Database Schema)
**Pontos:** 5
**Dependências:** EXIMIA-009 (Supabase) ✅
**Próxima story:** EXIMIA-016 (Academy API + UI)

### Escopo
Criar schema do módulo Academy (courses, lessons, enrollments).

### Arquivos a criar
- supabase/migrations/004_academy_module.sql
- supabase/seed/002_academy_seed.sql

### Referência
Ler: docs/stories/story-015-academy-schema.md

### Inclui
- Tabelas: courses, course_modules, lessons, enrollments, lesson_progress, socratic_sessions
- Enums: course_status, lesson_type, enrollment_status
- RLS policies para acesso público/privado
```

---

## FASE 3: Core Development (3 Tracks)

> **Pré-requisito:** Fase 2 completa

### Instância 1 — Track A: Design System Chain

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** A - Design System (Sequencial)
**Stories:** EXIMIA-004 → 005 → 006 → 007
**Pontos:** 42 (8 + 13 + 13 + 8)
**Dependências:** EXIMIA-003 (Atoms Base) ✅

### Escopo Sequencial

**004 - Atoms Estendidos (8 pts)**
- Icon, Avatar, Typography, Checkbox, Radio, Switch, Select, Textarea

**005 - Molecules Core (13 pts)**
- FormField, MetricCard, NavItem, SearchInput, EntityLink, Breadcrumb, Toast, Dropdown, Tabs, Card

**006 - Organisms Essenciais (13 pts)**
- Sidebar, Header, GoalCard, HabitTracker, InboxItem, NotificationPanel, DataTable, CommandPalette

**007 - Templates e Layouts (8 pts)**
- DashboardLayout, AuthLayout, SettingsLayout, ModuleLayout, OnboardingLayout

### Referências
- docs/stories/story-004-atoms-extended.md
- docs/stories/story-005-molecules-core.md
- docs/stories/story-006-organisms.md
- docs/stories/story-007-templates-layouts.md

### Comando
Execute cada story sequencialmente. Ao terminar uma, passe para a próxima.
```

### Instância 2 — Track B: Journey API

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** B - Journey Module
**Story:** EXIMIA-012 (Journey API)
**Pontos:** 8
**Dependências:** EXIMIA-011 (Journey Schema) ✅
**Próxima story:** EXIMIA-013 (Journey UI) - aguarda Track A

### Escopo
Implementar Server Actions para Goals, Habits, Dashboard.

### Arquivos a criar
- src/lib/actions/journey/goals.ts
- src/lib/actions/journey/habits.ts
- src/lib/actions/journey/dashboard.ts
- src/lib/actions/journey/index.ts

### Referência
Ler: docs/stories/story-012-journey-api.md

### Funções a implementar
- createGoal, getGoals, updateGoal, deleteGoal
- createKeyResult, updateKeyResultProgress
- createHabit, getHabits, logHabitCompletion
- getDashboardStats
```

### Instância 3 — Track C: Academy API + UI

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** C - Academy Module
**Story:** EXIMIA-016 (Academy API & UI)
**Pontos:** 13
**Dependências:** EXIMIA-015 (Academy Schema) ✅
**Próxima story:** Nenhuma (track independente)

### Escopo
Implementar API e UI completa do módulo Academy.

### Arquivos a criar
- src/lib/actions/academy/courses.ts
- src/lib/actions/academy/enrollments.ts
- src/lib/actions/academy/progress.ts
- src/components/academy/CourseCard.tsx
- src/components/academy/CourseCatalog.tsx
- src/components/academy/ModuleAccordion.tsx
- src/components/academy/LessonContent.tsx
- app/(dashboard)/academy/courses/[slug]/page.tsx

### Referência
Ler: docs/stories/story-016-academy-api-ui.md

### Nota
Track independente - pode ser completada sem esperar outras.
```

---

## FASE 4: Integration (3 Tracks)

> **Pré-requisito:** Fase 3 completa (especialmente Track A - Templates)

### Instância 1 — Track A: Design Systems Library

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** A - Design System
**Story:** EXIMIA-008 (Design Systems Library)
**Pontos:** 13
**Dependências:** EXIMIA-007 (Templates) ✅
**Próxima story:** Nenhuma (fim do track)

### Escopo
Implementar a biblioteca de Design Systems funcional.

### Arquivos a criar
- src/lib/design-systems/types.ts
- src/lib/design-systems/mock-data.ts
- src/lib/design-systems/export.ts
- src/components/design-systems/DSCard.tsx
- src/components/design-systems/DSEditor.tsx
- src/components/design-systems/TokenEditor.tsx
- app/(dashboard)/design-systems/page.tsx
- app/(dashboard)/design-systems/[id]/page.tsx

### Referência
Ler: docs/stories/story-008-design-systems-library.md

### Features
- Grid de Design Systems
- Editor de tokens
- Preview de componentes
- Export (JSON, CSS, Tailwind)
```

### Instância 2 — Track B: Authentication

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** B - Backend Infrastructure
**Story:** EXIMIA-010 (Authentication Pages)
**Pontos:** 8
**Dependências:** EXIMIA-009 (Supabase) ✅, EXIMIA-007 (Templates) ✅
**Próxima story:** EXIMIA-017 e EXIMIA-018 (Settings e Onboarding)

### Escopo
Implementar páginas de autenticação completas.

### Arquivos a criar
- app/(auth)/layout.tsx
- app/(auth)/login/page.tsx
- app/(auth)/register/page.tsx
- app/(auth)/forgot-password/page.tsx
- app/(auth)/reset-password/page.tsx
- app/auth/callback/route.ts
- app/auth/signout/route.ts
- src/lib/actions/auth.ts

### Referência
Ler: docs/stories/story-010-auth-pages.md

### Features
- Login com email/senha
- Registro com validação
- Forgot/Reset password
- OAuth ready (Google, GitHub)
- Protected routes middleware
```

### Instância 3 — Track C: Journey UI Integration

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** C - Journey Module
**Story:** EXIMIA-013 (Journey UI Integration)
**Pontos:** 13
**Dependências:** EXIMIA-012 (Journey API) ✅, EXIMIA-006 (Organisms) ✅
**Próxima story:** Nenhuma (fim do track)

### Escopo
Integrar UI do Journey com API real + optimistic updates.

### Arquivos a modificar/criar
- app/(dashboard)/journey/page.tsx
- app/(dashboard)/journey/goals/page.tsx
- app/(dashboard)/journey/goals/[id]/page.tsx
- app/(dashboard)/journey/habits/page.tsx
- src/components/journey/GoalList.tsx
- src/components/journey/HabitList.tsx
- src/components/journey/CreateGoalModal.tsx
- src/components/journey/CreateHabitModal.tsx

### Referência
Ler: docs/stories/story-013-journey-ui.md

### Features
- CRUD completo de Goals
- CRUD completo de Habits
- Dashboard com métricas reais
- Optimistic updates
- Loading/error states
```

---

## FASE 5: Polish (2 Tracks)

> **Pré-requisito:** Fase 4 completa (especialmente Auth)

### Instância 1 — Track A: Settings

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** A - User Experience
**Story:** EXIMIA-017 (Settings Pages)
**Pontos:** 8
**Dependências:** EXIMIA-010 (Auth) ✅, EXIMIA-007 (Templates) ✅
**Próxima story:** Nenhuma (fim)

### Escopo
Implementar todas as páginas de configuração.

### Arquivos a criar
- app/(dashboard)/settings/layout.tsx
- app/(dashboard)/settings/profile/page.tsx
- app/(dashboard)/settings/security/page.tsx
- app/(dashboard)/settings/notifications/page.tsx
- app/(dashboard)/settings/appearance/page.tsx
- src/lib/actions/settings/profile.ts
- src/lib/actions/settings/security.ts
- src/components/settings/ProfileForm.tsx
- src/components/settings/AvatarUpload.tsx
- src/components/settings/PasswordForm.tsx

### Referência
Ler: docs/stories/story-017-settings-pages.md
```

### Instância 2 — Track B: Onboarding

```markdown
## CONTEXTO DE DESENVOLVIMENTO

**Track:** B - User Experience
**Story:** EXIMIA-018 (Onboarding Flow)
**Pontos:** 8
**Dependências:** EXIMIA-010 (Auth) ✅, EXIMIA-007 (Templates) ✅
**Próxima story:** Nenhuma (fim)

### Escopo
Implementar fluxo de onboarding de 6 steps.

### Arquivos a criar
- app/(onboarding)/layout.tsx
- app/(onboarding)/onboarding/page.tsx
- src/lib/actions/onboarding.ts
- src/components/onboarding/WelcomeStep.tsx
- src/components/onboarding/ProfileStep.tsx
- src/components/onboarding/GoalsStep.tsx
- src/components/onboarding/FirstGoalStep.tsx
- src/components/onboarding/FirstHabitStep.tsx
- src/components/onboarding/DoneStep.tsx
- src/components/templates/OnboardingLayout.tsx

### Referência
Ler: docs/stories/story-018-onboarding.md

### Modificar
- src/middleware.ts (adicionar redirect para onboarding se novo usuário)
```

---

## Checklist de Sincronização

### Antes de começar uma nova fase

- [ ] Confirmar que todas as stories da fase anterior estão completas
- [ ] Fazer `git pull` para pegar alterações de outras instâncias
- [ ] Verificar se não há conflitos de merge
- [ ] Rodar `npm run typecheck` para garantir integridade

### Durante o desenvolvimento

- [ ] Commitar frequentemente (a cada task completada)
- [ ] Usar prefixo no commit: `feat(story-XXX): descrição`
- [ ] Push ao final de cada story completa
- [ ] Atualizar checkbox na story quando task terminar

### Conflitos comuns e como evitar

| Arquivo | Risco de Conflito | Solução |
|---------|------------------|---------|
| `tailwind.config.ts` | Alto | Track A é owner único |
| `src/components/ui/index.ts` | Médio | Adicione apenas sua exportação |
| `src/middleware.ts` | Alto | Track B (Auth) é owner, outros adicionam depois |
| `package.json` | Baixo | Use `npm install` para resolver |

---

## Estimativa de Tempo

### Desenvolvimento Sequencial (1 instância)
- Total: ~118 pontos
- Velocidade: ~3-4 pts/dia
- **Tempo: ~30-35 dias**

### Desenvolvimento Paralelo (3-4 instâncias)

| Fase | Dias (paralelo) | Pontos |
|------|-----------------|--------|
| Fase 1 | 2-3 dias | 18 pts |
| Fase 2 | 2-3 dias | 26 pts |
| Fase 3 | 4-5 dias | 42 pts |
| Fase 4 | 3-4 dias | 34 pts |
| Fase 5 | 2 dias | 16 pts |
| **Total** | **~12-15 dias** | 136 pts* |

*Nota: Alguns pontos contados em múltiplas fases devido a dependências

---

## Quick Reference: Comandos por Instância

```bash
# Instância 1 (Track A - Design System)
claude
> /AIOS:agents:dev
> [Cole o contexto da Track A]

# Instância 2 (Track B - Backend)
claude
> /AIOS:agents:dev
> [Cole o contexto da Track B]

# Instância 3 (Track C - Journey)
claude
> /AIOS:agents:dev
> [Cole o contexto da Track C]

# Instância 4 (Track D - Academy) - Fase 2+
claude
> /AIOS:agents:dev
> [Cole o contexto da Track D]
```

---

## Matriz de Dependências Completa

| Story | Depende de | Libera |
|-------|-----------|--------|
| 001 | - | 011, 014 |
| 002 | - | 003 |
| 003 | 002 | 004 |
| 004 | 003 | 005 |
| 005 | 004 | 006 |
| 006 | 005 | 007, 013 |
| 007 | 006 | 008, 010, 017, 018 |
| 008 | 007 | - |
| 009 | - | 010, 011, 015 |
| 010 | 007, 009 | 017, 018 |
| 011 | 001, 009 | 012 |
| 012 | 011 | 013 |
| 013 | 006, 012 | - |
| 014 | 001 | - |
| 015 | 009 | 016 |
| 016 | 015 | - |
| 017 | 007, 010 | - |
| 018 | 007, 010 | - |

---

**Documento gerado por River (SM) — Removendo obstáculos para desenvolvimento paralelo**
