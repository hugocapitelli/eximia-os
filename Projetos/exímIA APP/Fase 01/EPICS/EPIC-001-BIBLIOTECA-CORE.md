# EPIC-001: Biblioteca Core

> Módulo Biblioteca — Catálogo Global + Sistema de Favoritos
> Fase 01 | Version 3.0.0 | 2026-02-01
> Arquitetura: V3 Aprovada por Aria (Architect)

---

## Visão Geral do Epic

| Campo | Valor |
|-------|-------|
| Epic ID | EPIC-001 |
| Título | Biblioteca Core — Catálogo, Favoritos e Notas |
| PRD Relacionado | PRD-001-BIBLIOTECA |
| Owner | Morgan (PM) |
| Tech Lead | Aria (Architect) |
| Story Points Total | ~50 SP |
| Sprints Estimados | 3 |

---

## Objetivo

Implementar o core do módulo Biblioteca com modelo **Catálogo Global**:
1. Admin busca e adiciona livros ao catálogo via Google Books API
2. Usuários navegam o catálogo e favoritam livros
3. Sistema de notas pessoais nos livros favoritados
4. Integração com resumos (EPIC-002)

---

## Modelo de Dados V3

```
┌─────────────────┐         ┌─────────────────┐
│  book_catalog   │◄────────│ user_favorites  │
│  (Admin adiciona)│         │ (Usuário toggle)│
└────────┬────────┘         └─────────────────┘
         │
         ▼
┌─────────────────┐
│ book_summaries  │
│ (Admin cria)    │
└─────────────────┘
```

---

## Stories

### EXIMIA-101: Setup Database Schema V3

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 1 |
| Arquivos | `SQL/003-biblioteca-schema-v3.sql` |

**User Story:**
Como desenvolvedor, quero ter o schema V3 configurado no Supabase, para suportar o modelo de Catálogo + Favoritos.

**Ver:** `STORIES/EXIMIA-101.md`

---

### EXIMIA-102: Integração Google Books API

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 1 |
| Dependências | EXIMIA-101 |

**User Story:**
Como Admin, quero buscar livros via Google Books API, para adicionar ao catálogo global.

**Ver:** `STORIES/EXIMIA-102.md`

---

### EXIMIA-103: Admin — Adicionar Livro ao Catálogo

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 1 |
| Dependências | EXIMIA-102 |

**User Story:**
Como Admin, quero adicionar livros da busca ao catálogo, para disponibilizar para todos os usuários.

**Ver:** `STORIES/EXIMIA-103.md`

---

### EXIMIA-104: Página Explorar (Catálogo)

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 2 |
| Dependências | EXIMIA-103 |

**User Story:**
Como usuário, quero navegar pelo catálogo de livros, para descobrir e favoritar livros.

**Ver:** `STORIES/EXIMIA-104.md`

---

### EXIMIA-105: Sistema de Favoritos

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 2 |
| Dependências | EXIMIA-104 |

**User Story:**
Como usuário, quero favoritar livros do catálogo, para criar minha lista de favoritos.

**Ver:** `STORIES/EXIMIA-105.md`

---

### EXIMIA-106: Página Favoritos (Meus Livros)

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 2 |
| Dependências | EXIMIA-105 |

**User Story:**
Como usuário, quero ver meus livros favoritados, para acompanhar minha lista e acessar resumos.

**Ver:** `STORIES/EXIMIA-106.md`

---

### EXIMIA-107: Página de Detalhe do Livro

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 2 |
| Dependências | EXIMIA-104 |

**User Story:**
Como usuário, quero ver os detalhes de um livro, para conhecer mais sobre ele e acessar resumos/notas.

**Ver:** `STORIES/EXIMIA-107.md`

---

### EXIMIA-108: Sistema de Notas

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 3 |
| Dependências | EXIMIA-107 |

**User Story:**
Como usuário, quero criar notas em livros favoritados, para guardar insights e citações.

**Ver:** `STORIES/EXIMIA-108.md`

---

## Critérios de Done do Epic

- [ ] Schema V3 migrado e testado
- [ ] Admin pode buscar e adicionar livros ao catálogo
- [ ] Catálogo visível para todos usuários
- [ ] Favoritos funcionando com contador automático
- [ ] Sistema de notas funcional
- [ ] Zero dados mockados
- [ ] RLS testado e funcionando
- [ ] Performance < 2s para operações principais
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Code review aprovado
- [ ] Deploy em staging validado

---

## Dependências

### Internas
- Supabase configurado e acessível
- Sistema de autenticação funcionando (BLOCO 0.1)
- user_roles com admin configurado

### Externas
- Google Books API Key
- Supabase Storage (bucket book-covers)

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API rate limit | Média | Alto | Fallback Open Library + cache |
| Capas indisponíveis | Alta | Baixo | Placeholder + armazenamento |
| Performance catálogo grande | Baixa | Médio | Paginação + índices |

---

*— River, removendo obstáculos 🌊*
