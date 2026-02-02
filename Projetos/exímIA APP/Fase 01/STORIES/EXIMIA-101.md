# EXIMIA-101: Setup Database Schema V3

> EPIC-001: Biblioteca Core | Sprint 1 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-101 |
| Título | Setup Database Schema V3 |
| Epic | EPIC-001 |
| Story Points | 5 |
| Sprint | 1 |
| Prioridade | Alta (Blocker) |
| Assignee | @dev |

---

## User Story

**Como** desenvolvedor,
**Quero** ter o schema V3 configurado no Supabase,
**Para** suportar o modelo de Catálogo Global + Favoritos.

---

## Acceptance Criteria

- [ ] **AC1:** Migration `003-biblioteca-schema-v3.sql` executada no Supabase
- [ ] **AC2:** Schema `biblioteca` criado com todas as tabelas:
  - `authors`
  - `book_catalog`
  - `user_favorites`
  - `book_summaries`
  - `summary_chapters`
  - `user_reading_preferences`
  - `summary_reading_progress`
  - `user_notes`
  - `reading_goals`
- [ ] **AC3:** Tabela `user_roles` criada no schema `public`
- [ ] **AC4:** Função `biblioteca.is_admin()` funcionando corretamente
- [ ] **AC5:** RLS habilitado em todas as tabelas
- [ ] **AC6:** Policies configuradas conforme documentação:
  - Catálogo: leitura pública, escrita admin
  - Favoritos: usuário gerencia seus próprios
  - Resumos: leitura de publicados, escrita admin
  - Notas: usuário gerencia suas próprias
- [ ] **AC7:** Triggers de `updated_at` funcionando
- [ ] **AC8:** Trigger de `favorites_count` funcionando (auto-increment/decrement)
- [ ] **AC9:** Views criadas:
  - `catalog_view`
  - `user_favorites_view`
  - `user_stats`
- [ ] **AC10:** Índices de busca (GIN com pg_trgm) criados
- [ ] **AC11:** Bucket `book-covers` criado no Storage com policy pública
- [ ] **AC12:** Types TypeScript gerados via `supabase gen types`

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql`
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Arquitetura: `Fase 01/ARCHITECTURE.md`

### Comandos para Executar

```bash
# 1. Aplicar migration
supabase db push

# 2. Gerar types
supabase gen types typescript --local > src/types/database.types.ts

# 3. Criar admin (substituir USER_ID)
# Execute no SQL Editor do Supabase:
INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID', 'admin');
```

### Verificações de RLS

```sql
-- Testar como admin
SET request.jwt.claims = '{"sub": "ADMIN_USER_ID", "role": "authenticated"}';
INSERT INTO biblioteca.book_catalog (title) VALUES ('Test Book'); -- Deve funcionar

-- Testar como usuário normal
SET request.jwt.claims = '{"sub": "USER_ID", "role": "authenticated"}';
INSERT INTO biblioteca.book_catalog (title) VALUES ('Test Book'); -- Deve FALHAR

SELECT * FROM biblioteca.book_catalog; -- Deve funcionar (leitura pública)
```

---

## Definition of Done

- [ ] Migration executada sem erros
- [ ] Todas as tabelas visíveis no Supabase Dashboard
- [ ] RLS policies testadas (admin vs user)
- [ ] Triggers verificados com INSERT/UPDATE
- [ ] Types gerados e funcionando no projeto
- [ ] Bucket de storage configurado
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- Nenhuma (primeira story do epic)

### Bloqueia
- EXIMIA-102 (Google Books API)
- EXIMIA-103 (Admin Adicionar Livro)
- Todas as outras stories do EPIC-001 e EPIC-002

---

## Out of Scope

- Seed data de teste
- Scripts de migração de dados legados
- Configuração de backups

---

*— River, removendo obstáculos 🌊*
