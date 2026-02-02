# PRD-001: Módulo Biblioteca

> **Product Requirements Document**
> Versão: 1.0.0
> Data: 2026-02-01
> Status: Draft
> Owner: Morgan (PM)

---

## 1. Visão Geral

### 1.1 Objetivo

Criar um módulo de **Biblioteca Digital** completo que permite:
- Busca e adição automática de livros via APIs externas
- Gestão de coleção pessoal com tracking de leitura
- Sistema de anotações e comentários por usuário
- **Resumos estruturados** criados pelo Admin e lidos por todos os usuários

### 1.2 Problema

Atualmente a plataforma exímIA OS possui:
- Componentes UI mockados sem dados reais
- Nenhuma integração com APIs de livros
- Nenhum sistema funcional de leitura de resumos
- Dados estáticos em `constants.ts`

### 1.3 Solução

Sistema completo com:
1. **Busca Inteligente**: Pesquisa em Google Books/Open Library
2. **Enriquecimento Automático**: Capa + sinopse + metadados
3. **Gestão de Leitura**: Progress tracking e status
4. **Sistema de Notas**: Anotações, highlights, quotes
5. **Modo Leitura**: Resumos em capítulos com navegação

---

## 2. Requisitos Funcionais

### RF-001: Busca Automática de Livros

| ID | RF-001 |
|----|--------|
| Título | Busca e Adição Automática de Livros |
| Prioridade | MUST HAVE |
| Story Points | 8 |

**Descrição:**
O usuário deve poder buscar livros por título ou autor. O sistema consulta APIs externas e retorna resultados com preview.

**Critérios de Aceite:**
- [ ] Campo de busca com debounce (300ms)
- [ ] Consulta Google Books API como fonte primária
- [ ] Fallback para Open Library se Google não retornar
- [ ] Exibe lista de até 10 resultados
- [ ] Cada resultado mostra: capa thumbnail, título, autor(es), ano
- [ ] Busca funciona com título parcial (mínimo 3 caracteres)
- [ ] Loading state durante busca
- [ ] Mensagem de "nenhum resultado" quando aplicável

**Fluxo:**
```
1. Usuário clica "Adicionar Livro"
2. Modal de busca abre
3. Usuário digita no campo de pesquisa
4. Sistema aguarda 300ms (debounce)
5. Exibe spinner de loading
6. Retorna lista de resultados
7. Usuário clica em um resultado → RF-002
```

---

### RF-002: Preview e Confirmação de Adição

| ID | RF-002 |
|----|--------|
| Título | Preview do Livro Antes de Adicionar |
| Prioridade | MUST HAVE |
| Story Points | 5 |

**Descrição:**
Ao selecionar um livro da busca, exibe modal de preview com todos os dados antes de confirmar adição.

**Critérios de Aceite:**
- [ ] Modal exibe: capa grande, título completo, autor(es), sinopse
- [ ] Exibe metadados: editora, ano, páginas, ISBN, idioma
- [ ] Campo para selecionar status inicial (Quero Ler, Lendo, Concluído)
- [ ] Botão "Adicionar à Biblioteca"
- [ ] Botão "Cancelar" retorna à busca
- [ ] Validação: não permite adicionar livro já na biblioteca

**Dados do Preview:**
```typescript
{
  title: string;
  authors: string[];
  description: string;      // Sinopse
  coverUrl: string;         // Capa alta resolução
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  isbn13?: string;
  isbn10?: string;
  categories?: string[];
  language?: string;
}
```

---

### RF-003: Capa Automática

| ID | RF-003 |
|----|--------|
| Título | Fetch e Storage de Capas |
| Prioridade | MUST HAVE |
| Story Points | 3 |

**Descrição:**
Ao adicionar livro, sistema baixa a capa da API externa e salva no Supabase Storage.

**Critérios de Aceite:**
- [ ] Download da imagem de capa da URL fornecida pela API
- [ ] Upload para Supabase Storage bucket `book-covers`
- [ ] Caminho: `book-covers/{user_id}/{book_id}.jpg`
- [ ] Fallback: se não houver capa, usar placeholder padrão
- [ ] Armazena URL original como backup (`thumbnail_url`)
- [ ] Otimização: resize para max 400x600px antes do upload

---

### RF-004: Sinopse Automática

| ID | RF-004 |
|----|--------|
| Título | Sinopse da Editora (Automática) |
| Prioridade | MUST HAVE |
| Story Points | 2 |

**Descrição:**
A descrição/sinopse vem automaticamente da API e é armazenada como conteúdo readonly.

**Critérios de Aceite:**
- [ ] Campo `description` populado da API
- [ ] Exibido na aba "Sinopse" da página do livro
- [ ] Usuário NÃO pode editar (readonly)
- [ ] Se não houver sinopse, exibe "Sinopse não disponível"
- [ ] Suporta texto longo (TEXT no DB)

---

### RF-005: Sistema de Notas e Comentários

| ID | RF-005 |
|----|--------|
| Título | Anotações, Highlights e Quotes |
| Prioridade | MUST HAVE |
| Story Points | 8 |

**Descrição:**
Usuário pode criar anotações pessoais associadas aos livros da sua biblioteca.

**Critérios de Aceite:**
- [ ] Três tipos de anotação: `note`, `highlight`, `quote`
- [ ] Cada anotação vinculada a um livro
- [ ] Página opcional (campo `page_number`)
- [ ] Capítulo opcional (campo `chapter`)
- [ ] CRUD completo: criar, editar, deletar
- [ ] Listagem na aba "Anotações" do livro
- [ ] Filtro por tipo de anotação
- [ ] Ordenação por data ou página
- [ ] Anotações são PRIVADAS (apenas do usuário)

**Interface:**
```
┌─────────────────────────────────────┐
│ ▼ Nota  │ ▼ Highlight │ ▼ Quote    │  ← Filtros
├─────────────────────────────────────┤
│ 📝 Nota - Página 45                 │
│ "Insight importante sobre..."       │
│ ────────────────────────────────    │
│ 💡 Highlight - Página 78            │
│ "O autor menciona que..."           │
│ ────────────────────────────────    │
│ 💬 Quote - Página 102               │
│ "Citação exata do livro"            │
└─────────────────────────────────────┘
```

---

### RF-006: Modo Leitura de Resumos (Admin → Todos)

| ID | RF-006 |
|----|--------|
| Título | Sistema de Resumos Estruturados |
| Prioridade | MUST HAVE |
| Story Points | 13 |

**Descrição:**
ADMIN cria resumos estruturados em capítulos. Todos os usuários podem ler via Modo Leitura dedicado.

**Critérios de Aceite — ADMIN:**
- [ ] Painel de criação de resumos (área admin)
- [ ] Vincula resumo a um livro existente
- [ ] Editor de capítulos com:
  - Número do capítulo
  - Título do capítulo
  - Subtítulo (opcional)
  - Conteúdo (Markdown ou rich text)
- [ ] Reordenação de capítulos via drag-and-drop
- [ ] Preview do modo leitura antes de publicar
- [ ] Botão Publicar/Despublicar
- [ ] Apenas admins podem criar/editar/deletar resumos

**Critérios de Aceite — USUÁRIO:**
- [ ] Acesso via aba "Resumos" ou botão "Ler Resumo"
- [ ] Modo Leitura em tela cheia com:
  - Header: botão voltar + título do livro
  - Controles de tema: claro / sépia / escuro
  - Controles de fonte: A- / A / A+
  - Sumário lateral (colapsável)
- [ ] Navegação entre capítulos:
  - Botões Anterior / Próximo
  - Contador "Capítulo X de Y"
  - Clique no sumário pula para capítulo
- [ ] Preferências salvas por usuário (tema, fonte)
- [ ] Progresso de leitura salvo automaticamente
- [ ] Ao retornar, continua de onde parou

**Referência Visual:**
```
┌──────────────────────────────────────────────────────────┐
│ ← LEITURA  Os Anjos Bons Da Nossa N... │ ◐ ● ◑ │ A- A A+ │ ☰ │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              Os Anjos Bons Da Nossa                      │
│                    Natureza                              │
│                      ───                                 │
│                                                          │
│  CAPÍTULO 1                              ┌─────────────┐ │
│  Introducao                              │  SUMÁRIO    │ │
│  Por que o foco profundo importa         │ 1. Intro ◀  │ │
│  ───                                     │ 2. A Ideia  │ │
│                                          │ 3. A Arte   │ │
│  O trabalho profundo e a capacidade      │ 4. Práticas │ │
│  de focar sem distracao em uma tarefa    │ 5. Conclusão│ │
│  cognitivamente exigente.                │             │ │
│                                          │ Cap 1 de 5  │ │
│                                          └─────────────┘ │
│──────────────────────────────────────────────────────────│
│ ‹ Anterior              1 / 5              Próximo ›     │
└──────────────────────────────────────────────────────────┘
```

---

### RF-007: Progress Tracking

| ID | RF-007 |
|----|--------|
| Título | Acompanhamento de Progresso de Leitura |
| Prioridade | SHOULD HAVE |
| Story Points | 5 |

**Descrição:**
Sistema rastreia progresso de leitura tanto do livro físico quanto dos resumos.

**Critérios de Aceite:**
- [ ] Campo `current_page` no livro
- [ ] Cálculo automático de `progress_percent`
- [ ] Transição automática de status:
  - `to_read` → `reading` quando current_page > 0
  - `reading` → `completed` quando current_page >= total_pages
- [ ] Barra de progresso visual nos cards
- [ ] Progresso separado para resumos (por capítulo)

---

## 3. Requisitos Não-Funcionais

### RNF-001: Performance

| Requisito | Meta |
|-----------|------|
| Tempo de busca | < 2 segundos |
| Carregamento de página | < 1 segundo |
| Upload de capa | < 5 segundos |
| Mudança de capítulo | < 300ms |

### RNF-002: Segurança

| Requisito | Implementação |
|-----------|---------------|
| API Keys | Server-side apenas (não expor no client) |
| RLS | Todas as tabelas com Row Level Security |
| Autenticação | Supabase Auth obrigatório |
| Admin | Role-based access para resumos |

### RNF-003: Usabilidade

| Requisito | Descrição |
|-----------|-----------|
| Responsivo | Funciona em mobile, tablet, desktop |
| Offline | Preferências de leitura em localStorage |
| Acessibilidade | Contraste adequado nos 3 temas |
| Feedback | Loading states em todas as operações |

---

## 4. Arquitetura de Dados

### 4.1 Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐
│     authors     │       │      users      │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ name            │       │ email           │
│ mind_id (FK?)   │       │ role            │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ N:1                     │
         ▼                         │
┌─────────────────┐                │
│      books      │◄───────────────┤ 1:N (owner)
│─────────────────│                │
│ id (PK)         │                │
│ user_id (FK)    │────────────────┘
│ author_id (FK)  │
│ title           │
│ description     │ ← Sinopse automática
│ cover_url       │
│ google_books_id │
│ status          │
│ current_page    │
│ total_pages     │
└────────┬────────┘
         │
    ┌────┴────┬────────────────┐
    │         │                │
    │ 1:N     │ 1:1            │ 1:N
    ▼         ▼                ▼
┌────────┐ ┌─────────────┐ ┌──────────────┐
│ notes  │ │book_summaries│ │reading_prog  │
│────────│ │─────────────│ │──────────────│
│ id     │ │ id          │ │ id           │
│ book_id│ │ book_id     │ │ book_id      │
│ user_id│ │ created_by  │ │ user_id      │
│ type   │ │ is_published│ │ current_page │
│ content│ │ title       │ │ progress_%   │
│ page   │ └──────┬──────┘ └──────────────┘
└────────┘        │
                  │ 1:N
                  ▼
          ┌─────────────────┐
          │summary_chapters │
          │─────────────────│
          │ id              │
          │ summary_id      │
          │ chapter_number  │
          │ title           │
          │ subtitle        │
          │ content         │
          │ order_index     │
          └─────────────────┘
```

### 4.2 Schemas SQL

Ver arquivo: `Fase 01/SQL/001-biblioteca-schema.sql`

---

## 5. Integrações Externas

### 5.1 Google Books API

| Item | Valor |
|------|-------|
| Base URL | `https://www.googleapis.com/books/v1/volumes` |
| Auth | API Key (server-side) |
| Rate Limit | 1000 requests/dia (free tier) |
| Docs | https://developers.google.com/books |

**Endpoint de Busca:**
```
GET /volumes?q={query}&key={API_KEY}&maxResults=10
```

**Campos Utilizados:**
- `volumeInfo.title`
- `volumeInfo.authors[]`
- `volumeInfo.description`
- `volumeInfo.imageLinks.thumbnail`
- `volumeInfo.imageLinks.large`
- `volumeInfo.publisher`
- `volumeInfo.publishedDate`
- `volumeInfo.pageCount`
- `volumeInfo.industryIdentifiers[]`
- `volumeInfo.categories[]`
- `volumeInfo.language`

### 5.2 Open Library API (Fallback)

| Item | Valor |
|------|-------|
| Base URL | `https://openlibrary.org` |
| Auth | Nenhuma (público) |
| Rate Limit | Ilimitado (fair use) |
| Docs | https://openlibrary.org/developers/api |

**Endpoint de Busca:**
```
GET /search.json?q={query}&limit=10
```

---

## 6. Componentes de Interface

### 6.1 Novos Componentes

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `BookSearchModal` | Modal de busca com input e resultados | P0 |
| `BookSearchInput` | Input com debounce e ícone | P0 |
| `BookSearchResults` | Lista de resultados da busca | P0 |
| `BookPreviewModal` | Preview completo antes de adicionar | P0 |
| `NoteEditor` | Editor de notas/highlights/quotes | P1 |
| `NoteList` | Lista filtrada de anotações | P1 |
| `ReadingMode` | Container do modo leitura | P0 |
| `ReadingHeader` | Header com controles | P0 |
| `ThemeToggle` | Seletor de tema (3 opções) | P0 |
| `FontSizeControl` | Controle A-/A/A+ | P0 |
| `TableOfContents` | Sumário lateral colapsável | P0 |
| `ChapterContent` | Renderização do capítulo | P0 |
| `ChapterNavigation` | Anterior/Próximo + contador | P0 |
| `AdminSummaryEditor` | Editor de resumos (admin) | P1 |
| `ChapterEditor` | Editor individual de capítulo | P1 |

### 6.2 Componentes Existentes (Refatorar)

| Componente | Mudança Necessária |
|------------|-------------------|
| `JourneyLibrary.tsx` | Remover mocks, usar Server Actions |
| `BookDetailPage.tsx` | Conectar abas ao backend real |
| `BookCardHorizontal.tsx` | Aceitar dados da API |
| `LibraryHero.tsx` | Stats reais do banco |

---

## 7. Server Actions

### 7.1 Estrutura de Arquivos

```
src/lib/actions/
├── books/
│   ├── search.ts        # Busca externa
│   ├── create.ts        # Criar livro
│   ├── read.ts          # Buscar livros
│   ├── update.ts        # Atualizar livro
│   ├── delete.ts        # Deletar livro
│   └── progress.ts      # Progress tracking
├── notes/
│   ├── create.ts
│   ├── read.ts
│   ├── update.ts
│   └── delete.ts
├── summaries/
│   ├── read.ts          # Buscar resumos (público)
│   └── progress.ts      # Progresso de leitura
├── admin/
│   └── summaries/
│       ├── create.ts    # Criar resumo (admin)
│       ├── update.ts    # Editar resumo (admin)
│       ├── delete.ts    # Deletar resumo (admin)
│       └── publish.ts   # Publicar/despublicar
└── preferences/
    └── reading.ts       # Preferências de leitura
```

### 7.2 Interfaces TypeScript

Ver arquivo: `Fase 01/TYPES/biblioteca.types.ts`

---

## 8. Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Livros adicionados/usuário | > 5 | COUNT(books) GROUP BY user |
| Taxa de conclusão de resumos | > 60% | completed_chapters / total |
| Notas por livro | > 3 | COUNT(notes) / COUNT(books) |
| Tempo médio no modo leitura | > 5 min | Analytics |
| Busca → Adição conversion | > 40% | searches / books_added |

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Google Books API rate limit | Média | Alto | Implementar Open Library como fallback |
| Capas indisponíveis | Alta | Médio | Placeholder padrão + upload manual |
| Performance em listas grandes | Média | Médio | Paginação + virtual scrolling |
| Complexidade do editor admin | Alta | Alto | Usar biblioteca existente (TipTap) |

---

## 10. Cronograma Sugerido

### Sprint 1: Fundação
- [ ] Schema de banco de dados
- [ ] Server Actions de busca
- [ ] Integração Google Books API
- [ ] Componentes de busca

### Sprint 2: Core
- [ ] Adição de livros funcional
- [ ] Upload de capas
- [ ] Listagem real (remover mocks)
- [ ] Página de detalhe conectada

### Sprint 3: Notas
- [ ] CRUD de anotações
- [ ] Interface de notas
- [ ] Filtros e ordenação

### Sprint 4: Modo Leitura
- [ ] Schema de resumos/capítulos
- [ ] Componentes do modo leitura
- [ ] Navegação e preferências
- [ ] Progresso de leitura

### Sprint 5: Admin
- [ ] Painel admin de resumos
- [ ] Editor de capítulos
- [ ] Publicação de resumos

---

## 11. Dependências

### Pacotes NPM

```json
{
  "@tanstack/react-query": "^5.x",
  "zod": "^3.x",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "lucide-react": "^0.x"
}
```

### Variáveis de Ambiente

```env
# Google Books
GOOGLE_BOOKS_API_KEY=

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=book-covers

# Feature Flags
OPEN_LIBRARY_FALLBACK_ENABLED=true
```

---

## 12. Aprovações

| Role | Nome | Status | Data |
|------|------|--------|------|
| Product Manager | Morgan | ✅ Draft | 2026-02-01 |
| Tech Lead | Aria | ⏳ Pending | - |
| Stakeholder | Hugo | ⏳ Pending | - |

---

## Anexos

- `Fase 01/SQL/001-biblioteca-schema.sql` — Schema completo
- `Fase 01/TYPES/biblioteca.types.ts` — Interfaces TypeScript
- `Fase 01/FLOWS/user-flows.md` — Fluxos de usuário detalhados
- `Fase 01/API/google-books-mapping.md` — Mapeamento de campos

---

*— Morgan, planejando o futuro 📊*
