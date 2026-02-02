# Fase 01 — Módulo Biblioteca

> exímIA APP | Documentação de Produto e Técnica
> Version 3.0.0 | 2026-02-01
> **Modelo: Catálogo Global + Favoritos** | Aprovado por: Aria (Architect)

---

## Visão Geral

A **Fase 01** implementa o **Módulo Biblioteca** completo da plataforma exímIA OS, incluindo:

- **Busca automática** de livros via Google Books API
- **Enriquecimento de dados** (capa + sinopse + metadados)
- **Gestão de biblioteca** pessoal com progress tracking
- **Sistema de notas** (anotações, highlights, quotes)
- **Modo Leitura** de resumos estruturados em capítulos

---

## Estrutura da Pasta

```
Fase 01/
├── README.md                          ← Este arquivo
├── PRD-001-BIBLIOTECA.md              ← Product Requirements Document
├── ARCHITECTURE.md                    ← Arquitetura V2 (NOVO)
│
├── SQL/
│   ├── 001-biblioteca-schema.sql      ← Schema V1 (DEPRECATED)
│   ├── 002-biblioteca-schema-v2.sql   ← Schema V2 (DEPRECATED)
│   └── 003-biblioteca-schema-v3.sql   ← Schema V3 - USAR ESTE ✅
│
├── TYPES/
│   ├── biblioteca.types.ts            ← Types V1 (DEPRECATED)
│   ├── biblioteca.types.v2.ts         ← Types V2 (DEPRECATED)
│   └── biblioteca.types.v3.ts         ← Types V3 - USAR ESTE ✅
│
├── FLOWS/
│   └── user-flows.md                  ← Fluxos de usuário detalhados
│
├── API/
│   └── google-books-mapping.md        ← Integração com APIs externas
│
├── EPICS/
│   ├── EPIC-001-BIBLIOTECA-CORE.md    ← Epic: Funcionalidades core
│   └── EPIC-002-MODO-LEITURA.md       ← Epic: Sistema de resumos
│
└── STORIES/                           ← Stories detalhadas (16 stories)
    ├── EXIMIA-101.md → EXIMIA-108.md  ← EPIC-001 (8 stories)
    └── EXIMIA-201.md → EXIMIA-208.md  ← EPIC-002 (8 stories)
```

> ⚠️ **IMPORTANTE:** Usar arquivos V3 (003-biblioteca-schema-v3.sql e biblioteca.types.v3.ts)

---

## Documentos

### PRD (Product Requirements Document)

**[PRD-001-BIBLIOTECA.md](./PRD-001-BIBLIOTECA.md)**

Documento principal com:
- Requisitos funcionais (RF-001 a RF-007)
- Requisitos não-funcionais
- Arquitetura de dados
- Métricas de sucesso
- Riscos e mitigações

### SQL Schema

**[SQL/001-biblioteca-schema.sql](./SQL/001-biblioteca-schema.sql)**

Schema completo para Supabase PostgreSQL:
- 9 tabelas (`books`, `authors`, `notes`, `book_summaries`, etc.)
- Row Level Security (RLS) configurado
- Triggers automáticos
- Views de estatísticas

### TypeScript Types

**[TYPES/biblioteca.types.ts](./TYPES/biblioteca.types.ts)**

Interfaces e tipos:
- Entidades do banco de dados
- Tipos de input para Server Actions
- Tipos de resposta da API
- Props de componentes
- Constantes (temas, categorias, etc.)

### Fluxos de Usuário

**[FLOWS/user-flows.md](./FLOWS/user-flows.md)**

Diagramas detalhados:
- Fluxo: Buscar e Adicionar Livro
- Fluxo: Gerenciar Biblioteca
- Fluxo: Criar Anotações
- Fluxo: Ler Resumo
- Fluxo Admin: Criar Resumo

### Integração com APIs

**[API/google-books-mapping.md](./API/google-books-mapping.md)**

Documentação técnica:
- Google Books API (primária)
- Open Library API (fallback)
- Mapeamento de campos
- Código de integração
- Upload de capas

### Epics

**[EPICS/EPIC-001-BIBLIOTECA-CORE.md](./EPICS/EPIC-001-BIBLIOTECA-CORE.md)**
- 8 stories (~55 SP)
- Busca, adição, gestão de livros
- Sistema de notas

**[EPICS/EPIC-002-MODO-LEITURA.md](./EPICS/EPIC-002-MODO-LEITURA.md)**
- 8 stories (~40 SP)
- Modo leitura imersivo
- Editor admin de resumos

---

## Roadmap

### Sprint 1: Fundação
- [ ] Setup database schema
- [ ] Integração Google Books API
- [ ] Componentes de busca

### Sprint 2: Core
- [ ] Adição de livros funcional
- [ ] Página da biblioteca com dados reais
- [ ] Página de detalhe do livro

### Sprint 3: Notas
- [ ] CRUD de anotações
- [ ] Interface de notas
- [ ] Filtros e ordenação

### Sprint 4-5: Modo Leitura
- [ ] Componentes do modo leitura
- [ ] Preferências de leitura
- [ ] Progresso de leitura

### Sprint 5-6: Admin
- [ ] Painel admin de resumos
- [ ] Editor de capítulos
- [ ] Publicação de resumos

---

## Dependências Técnicas

### Pacotes NPM

```json
{
  "@tanstack/react-query": "^5.x",
  "zod": "^3.x",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@dnd-kit/core": "^6.x",
  "lucide-react": "^0.x"
}
```

### Variáveis de Ambiente

```env
# Google Books API
GOOGLE_BOOKS_API_KEY=

# Feature Flags
OPEN_LIBRARY_FALLBACK_ENABLED=true
BOOK_COVER_UPLOAD_ENABLED=true

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=book-covers
```

---

## Como Usar Esta Documentação

### Para o Arquiteto (@architect)
1. Leia o PRD para entender os requisitos
2. Revise o SQL schema para validar a modelagem
3. Consulte o API mapping para decisões de integração

### Para Desenvolvedores (@dev)
1. Consulte os Epics para pegar stories
2. Use os Types como base para implementação
3. Siga os Flows para entender comportamentos esperados

### Para QA (@qa)
1. Use os Flows para criar casos de teste
2. Valide contra os Acceptance Criteria nos Epics
3. Teste RLS policies conforme SQL schema

### Para o PM (@pm)
1. Acompanhe progresso pelos Epics
2. Valide entregas contra o PRD
3. Atualize métricas conforme seção 8 do PRD

---

## Status

| Documento | Status | Versão |
|-----------|--------|--------|
| PRD-001-BIBLIOTECA | ✅ Completo | 1.0 |
| SQL Schema | ✅ **V3 Aprovado** | 3.0 |
| TypeScript Types | ✅ **V3 Aprovado** | 3.0 |
| Architecture | ✅ **V3 Aprovado** | 3.0 |
| User Flows | ✅ Completo | 1.0 |
| API Mapping | ✅ Completo | 1.0 |
| EPIC-001 | ✅ Definido | 1.0 |
| EPIC-002 | ✅ Definido | 1.0 |

### Aprovação Técnica

| Role | Nome | Status | Data |
|------|------|--------|------|
| Product Manager | Morgan | ✅ Aprovado | 2026-02-01 |
| Architect | Aria | ✅ **Aprovado** | 2026-02-01 |
| Stakeholder | Hugo | ✅ **Aprovado** | 2026-02-01 |

**Próximo passo:** Início do Sprint 1 - Setup de infraestrutura.

---

## Changelog

### v3.0.0 (2026-02-01)
- **BREAKING:** Modelo simplificado Catálogo + Favoritos
- Renomeada `user_books` → `user_favorites` (apenas toggle de favorito)
- Removido tracking de livro físico (páginas lidas, status)
- Progresso agora é apenas em resumos (`summary_reading_progress`)
- Schema simplificado: 9 tabelas (era 10 na V2)
- Types V3 com interfaces atualizadas
- Architecture V3 com fluxos simplificados
- Aprovação técnica da arquiteta Aria

### v2.0.0 (2026-02-01)
- **BREAKING:** Novo modelo de Catálogo Global
- Nova tabela `book_catalog` (livros únicos globais)
- Renomeada `books` → `user_books` (biblioteca pessoal)
- `book_summaries` agora referencia `catalog_id`
- Adicionada tabela `user_roles` para controle de Admin
- Função `biblioteca.is_admin()` para RLS
- Triggers para `readers_count` automático
- Views: `user_books_with_catalog`, `catalog_with_summary`
- Zod schemas para validação runtime
- Aprovação técnica da arquiteta Aria

### v1.0.0 (2026-02-01)
- Criação inicial de todos os documentos
- PRD completo com 7 requisitos funcionais
- Schema SQL com 9 tabelas
- 16 stories definidas em 2 epics

---

*— Morgan (PM), Atlas (Analyst) & Aria (Architect)*
*exímIA OS — Fase 01*
