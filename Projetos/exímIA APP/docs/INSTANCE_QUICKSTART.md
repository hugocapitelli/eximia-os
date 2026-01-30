# Quick Start — Copie e Cole para Iniciar Instâncias

> Abra este arquivo e copie o bloco da instância que deseja iniciar.

---

## FASE 1 (Início — Sem dependências)

### INSTÂNCIA 1A — Design Tokens
```
/AIOS:agents:dev

CONTEXTO: Track A - Design System | Story EXIMIA-002 | 5 pts

TAREFA: Implementar design tokens no Tailwind CSS.

ARQUIVOS:
- tailwind.config.ts [MODIFY]
- src/styles/tokens.css [CREATE se necessário]

REFERÊNCIA: docs/stories/story-002-design-tokens.md

COMANDO: Leia a story e implemente todos os design tokens (cores, tipografia, espaçamento, sombras).

PRÓXIMO: Após completar, avise. A próxima story é EXIMIA-003 (Atoms Base).
```

### INSTÂNCIA 1B — Database Schema Connection Layer
```
/AIOS:agents:dev

CONTEXTO: Track B - Backend | Story EXIMIA-001 | 8 pts

TAREFA: Criar migration SQL para Connection Layer.

ARQUIVOS:
- supabase/migrations/001_connection_layer.sql [CREATE]

REFERÊNCIA: docs/stories/story-001-connection-layer-schema.md

COMANDO: Leia a story e crie a migration com tabelas entities, entity_links, suggestions + enums, indexes, RLS.

PRÓXIMO: Após completar, avise. Libera EXIMIA-011 e EXIMIA-014.
```

### INSTÂNCIA 1C — Supabase Setup
```
/AIOS:agents:dev

CONTEXTO: Track C - Infrastructure | Story EXIMIA-009 | 5 pts

TAREFA: Configurar cliente Supabase SSR.

ARQUIVOS:
- src/lib/supabase/client.ts [CREATE]
- src/lib/supabase/server.ts [CREATE]
- src/lib/supabase/middleware.ts [CREATE]
- src/middleware.ts [CREATE]
- app/api/health/route.ts [CREATE]

REFERÊNCIA: docs/stories/story-009-supabase-setup.md

COMANDO: Leia a story e configure Supabase. Precisa de credenciais em .env.local.

PRÓXIMO: Após completar, avise. Libera EXIMIA-010, 011, 015.
```

---

## FASE 2 (Requer Fase 1 completa)

### INSTÂNCIA 2A — Atoms Base
```
/AIOS:agents:dev

CONTEXTO: Track A - Design System | Story EXIMIA-003 | 8 pts
DEPENDE DE: EXIMIA-002 (Tokens) ✅

TAREFA: Criar componentes atômicos base.

ARQUIVOS:
- src/components/ui/button.tsx [CREATE]
- src/components/ui/input.tsx [CREATE]
- src/components/ui/badge.tsx [CREATE]
- src/components/ui/spinner.tsx [CREATE]
- src/components/ui/index.ts [CREATE]

REFERÊNCIA: docs/stories/story-003-atoms-base.md

COMANDO: Leia a story e implemente Button, Input, Badge, Spinner usando os tokens.

PRÓXIMO: EXIMIA-004 (Atoms Estendidos)
```

### INSTÂNCIA 2B — Inbox Module
```
/AIOS:agents:dev

CONTEXTO: Track B - Connection Layer | Story EXIMIA-014 | 8 pts
DEPENDE DE: EXIMIA-001 (Connection Schema) ✅

TAREFA: Implementar módulo Inbox completo.

ARQUIVOS:
- supabase/migrations/003_inbox_module.sql [CREATE]
- src/lib/actions/inbox.ts [CREATE]
- src/lib/ai/inbox-analyzer.ts [CREATE]
- src/components/inbox/QuickCapture.tsx [CREATE]
- src/components/inbox/InboxItemCard.tsx [CREATE]

REFERÊNCIA: docs/stories/story-014-inbox-module.md

COMANDO: Leia a story e implemente schema, API, AI mock e UI do Inbox.

PRÓXIMO: Nenhum (track independente completa)
```

### INSTÂNCIA 2C — Journey Schema
```
/AIOS:agents:dev

CONTEXTO: Track C - Journey Module | Story EXIMIA-011 | 5 pts
DEPENDE DE: EXIMIA-001 ✅, EXIMIA-009 ✅

TAREFA: Criar schema do módulo Journey.

ARQUIVOS:
- supabase/migrations/002_journey_module.sql [CREATE]

REFERÊNCIA: docs/stories/story-011-journey-schema.md

COMANDO: Leia a story e crie migration com goals, key_results, habits, habit_logs, books + triggers.

PRÓXIMO: EXIMIA-012 (Journey API)
```

### INSTÂNCIA 2D — Academy Schema
```
/AIOS:agents:dev

CONTEXTO: Track D - Academy Module | Story EXIMIA-015 | 5 pts
DEPENDE DE: EXIMIA-009 (Supabase) ✅

TAREFA: Criar schema do módulo Academy.

ARQUIVOS:
- supabase/migrations/004_academy_module.sql [CREATE]
- supabase/seed/002_academy_seed.sql [CREATE]

REFERÊNCIA: docs/stories/story-015-academy-schema.md

COMANDO: Leia a story e crie migration com courses, modules, lessons, enrollments, progress.

PRÓXIMO: EXIMIA-016 (Academy API + UI)
```

---

## FASE 3 (Requer Fase 2 completa)

### INSTÂNCIA 3A — Design System Chain (LONGA)
```
/AIOS:agents:dev

CONTEXTO: Track A - Design System | Stories EXIMIA-004 → 005 → 006 → 007 | 42 pts
DEPENDE DE: EXIMIA-003 (Atoms) ✅

TAREFA: Executar 4 stories sequenciais do Design System.

ORDEM:
1. EXIMIA-004 (8 pts) - Atoms Estendidos: Icon, Avatar, Typography, Checkbox, Radio, Switch, Select, Textarea
2. EXIMIA-005 (13 pts) - Molecules: FormField, MetricCard, NavItem, SearchInput, EntityLink, Breadcrumb, Toast, Dropdown, Tabs, Card
3. EXIMIA-006 (13 pts) - Organisms: Sidebar, Header, GoalCard, HabitTracker, InboxItem, NotificationPanel, DataTable, CommandPalette
4. EXIMIA-007 (8 pts) - Templates: DashboardLayout, AuthLayout, SettingsLayout, ModuleLayout, OnboardingLayout

REFERÊNCIAS:
- docs/stories/story-004-atoms-extended.md
- docs/stories/story-005-molecules-core.md
- docs/stories/story-006-organisms.md
- docs/stories/story-007-templates-layouts.md

COMANDO: Execute cada story em sequência. Commit ao final de cada uma.

PRÓXIMO: EXIMIA-008 (Design Systems Library)
```

### INSTÂNCIA 3B — Journey API
```
/AIOS:agents:dev

CONTEXTO: Track B - Journey Module | Story EXIMIA-012 | 8 pts
DEPENDE DE: EXIMIA-011 (Journey Schema) ✅

TAREFA: Implementar Server Actions para Journey.

ARQUIVOS:
- src/lib/actions/journey/goals.ts [CREATE]
- src/lib/actions/journey/habits.ts [CREATE]
- src/lib/actions/journey/dashboard.ts [CREATE]
- src/lib/actions/journey/index.ts [CREATE]

REFERÊNCIA: docs/stories/story-012-journey-api.md

COMANDO: Leia a story e implemente CRUD de Goals, Habits e Dashboard stats.

PRÓXIMO: EXIMIA-013 (Journey UI) - aguarda Track A completar 006
```

### INSTÂNCIA 3C — Academy API + UI
```
/AIOS:agents:dev

CONTEXTO: Track C - Academy Module | Story EXIMIA-016 | 13 pts
DEPENDE DE: EXIMIA-015 (Academy Schema) ✅

TAREFA: Implementar API e UI completa do Academy.

ARQUIVOS:
- src/lib/actions/academy/courses.ts [CREATE]
- src/lib/actions/academy/enrollments.ts [CREATE]
- src/lib/actions/academy/progress.ts [CREATE]
- src/components/academy/CourseCard.tsx [CREATE]
- src/components/academy/CourseCatalog.tsx [CREATE]
- src/components/academy/ModuleAccordion.tsx [CREATE]
- src/components/academy/LessonContent.tsx [CREATE]
- app/(dashboard)/academy/courses/[slug]/page.tsx [CREATE]

REFERÊNCIA: docs/stories/story-016-academy-api-ui.md

COMANDO: Leia a story e implemente catálogo, enrollment, progress tracking.

PRÓXIMO: Nenhum (track independente completa)
```

---

## FASE 4 (Requer Fase 3 completa)

### INSTÂNCIA 4A — Design Systems Library
```
/AIOS:agents:dev

CONTEXTO: Track A - Design System | Story EXIMIA-008 | 13 pts
DEPENDE DE: EXIMIA-007 (Templates) ✅

TAREFA: Implementar biblioteca de Design Systems.

ARQUIVOS:
- src/lib/design-systems/types.ts [CREATE]
- src/lib/design-systems/mock-data.ts [CREATE]
- src/lib/design-systems/export.ts [CREATE]
- src/components/design-systems/DSCard.tsx [CREATE]
- src/components/design-systems/DSEditor.tsx [CREATE]
- app/(dashboard)/design-systems/page.tsx [CREATE]
- app/(dashboard)/design-systems/[id]/page.tsx [CREATE]

REFERÊNCIA: docs/stories/story-008-design-systems-library.md

COMANDO: Leia a story e implemente grid, editor e export de Design Systems.

PRÓXIMO: Nenhum (Design System completo!)
```

### INSTÂNCIA 4B — Authentication
```
/AIOS:agents:dev

CONTEXTO: Track B - Auth | Story EXIMIA-010 | 8 pts
DEPENDE DE: EXIMIA-009 ✅, EXIMIA-007 ✅

TAREFA: Implementar páginas de autenticação.

ARQUIVOS:
- app/(auth)/layout.tsx [CREATE]
- app/(auth)/login/page.tsx [CREATE]
- app/(auth)/register/page.tsx [CREATE]
- app/(auth)/forgot-password/page.tsx [CREATE]
- app/(auth)/reset-password/page.tsx [CREATE]
- app/auth/callback/route.ts [CREATE]
- app/auth/signout/route.ts [CREATE]
- src/lib/actions/auth.ts [CREATE]

REFERÊNCIA: docs/stories/story-010-auth-pages.md

COMANDO: Leia a story e implemente login, registro, forgot/reset password.

PRÓXIMO: Libera EXIMIA-017 e 018
```

### INSTÂNCIA 4C — Journey UI Integration
```
/AIOS:agents:dev

CONTEXTO: Track C - Journey Module | Story EXIMIA-013 | 13 pts
DEPENDE DE: EXIMIA-012 ✅, EXIMIA-006 ✅

TAREFA: Integrar UI do Journey com API real.

ARQUIVOS:
- app/(dashboard)/journey/page.tsx [MODIFY]
- app/(dashboard)/journey/goals/page.tsx [MODIFY]
- app/(dashboard)/journey/goals/[id]/page.tsx [CREATE]
- app/(dashboard)/journey/habits/page.tsx [MODIFY]
- src/components/journey/GoalList.tsx [CREATE]
- src/components/journey/HabitList.tsx [CREATE]
- src/components/journey/CreateGoalModal.tsx [CREATE]
- src/components/journey/CreateHabitModal.tsx [CREATE]

REFERÊNCIA: docs/stories/story-013-journey-ui.md

COMANDO: Leia a story e integre UI com API + optimistic updates.

PRÓXIMO: Nenhum (Journey Module completo!)
```

---

## FASE 5 (Requer Fase 4 completa — especialmente Auth)

### INSTÂNCIA 5A — Settings Pages
```
/AIOS:agents:dev

CONTEXTO: Track A - UX | Story EXIMIA-017 | 8 pts
DEPENDE DE: EXIMIA-010 ✅, EXIMIA-007 ✅

TAREFA: Implementar páginas de configuração.

ARQUIVOS:
- app/(dashboard)/settings/layout.tsx [CREATE]
- app/(dashboard)/settings/profile/page.tsx [CREATE]
- app/(dashboard)/settings/security/page.tsx [CREATE]
- app/(dashboard)/settings/notifications/page.tsx [CREATE]
- app/(dashboard)/settings/appearance/page.tsx [CREATE]
- src/lib/actions/settings/profile.ts [CREATE]
- src/lib/actions/settings/security.ts [CREATE]
- src/components/settings/ProfileForm.tsx [CREATE]
- src/components/settings/AvatarUpload.tsx [CREATE]
- src/components/settings/PasswordForm.tsx [CREATE]

REFERÊNCIA: docs/stories/story-017-settings-pages.md

COMANDO: Leia a story e implemente todas as páginas de settings.

PRÓXIMO: Nenhum (Settings completo!)
```

### INSTÂNCIA 5B — Onboarding Flow
```
/AIOS:agents:dev

CONTEXTO: Track B - UX | Story EXIMIA-018 | 8 pts
DEPENDE DE: EXIMIA-010 ✅, EXIMIA-007 ✅

TAREFA: Implementar fluxo de onboarding de 6 steps.

ARQUIVOS:
- app/(onboarding)/layout.tsx [CREATE]
- app/(onboarding)/onboarding/page.tsx [CREATE]
- src/lib/actions/onboarding.ts [CREATE]
- src/components/onboarding/WelcomeStep.tsx [CREATE]
- src/components/onboarding/ProfileStep.tsx [CREATE]
- src/components/onboarding/GoalsStep.tsx [CREATE]
- src/components/onboarding/FirstGoalStep.tsx [CREATE]
- src/components/onboarding/FirstHabitStep.tsx [CREATE]
- src/components/onboarding/DoneStep.tsx [CREATE]
- src/components/templates/OnboardingLayout.tsx [CREATE]
- src/middleware.ts [MODIFY - adicionar redirect]

REFERÊNCIA: docs/stories/story-018-onboarding.md

COMANDO: Leia a story e implemente os 6 steps do onboarding.

PRÓXIMO: Nenhum (Onboarding completo! MVP DONE!)
```

---

## Checklist de Conclusão de Fase

```markdown
## Fase X Completa?

- [ ] Todas as stories da fase estão com status ✅
- [ ] `git pull` executado em todas as instâncias
- [ ] `npm run typecheck` passando
- [ ] `npm run lint` passando
- [ ] Nenhum conflito de merge pendente
- [ ] Stories marcadas como completas no BACKLOG_INDEX.md

→ Se tudo OK, avançar para próxima fase
```

---

## Dicas de Produtividade

1. **Abra as instâncias em terminais diferentes** (VS Code split, Windows Terminal tabs, etc.)
2. **Nomeie cada terminal** com o Track (A, B, C, D)
3. **Faça commits frequentes** para evitar conflitos
4. **Use branches separadas** se preferir: `feat/track-a-design-system`, `feat/track-b-backend`
5. **Sincronize no final de cada story** (git pull + push)

---

**Gerado por River (SM)**
