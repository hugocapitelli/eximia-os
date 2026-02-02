# Story PM2-004: Biblioteca Minimalista Redesign

## Story Info

**Story ID:** PM2-004
**Epic:** PM2 - Visual Refinement Package
**Priority:** P1
**Story Points:** 5
**Status:** Ready for Development

## User Story

**Como** usuário da Journey Library,
**Eu quero** uma biblioteca com visual mais minimalista e moderno,
**Para que** a experiência de explorar livros seja mais elegante e diferenciada.

## Context

Referências visuais: Imagens 2, 3, 4, 5 (Lendária)
- Imagem 2: Página Explorar com hero, lançamentos, coleções, catálogo
- Imagem 3: Página Autores com tipografia estilizada
- Imagem 4: Página de detalhe do livro
- Imagem 5: Página de perfil do autor

**Problema atual:** Explorar e Favoritos têm visual idêntico. Precisam ser diferenciados.

## Target Structure

### Tab: Explorar
```
┌─────────────────────────────────────────────────────────────────┐
│  EXPLORAR  │  AUTORES  │  MEUS LIVROS  │  CURSOS  │  COMUNIDADE │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ CURADORIA EXCLUSIVA • 19 obras                    [amber]   ││
│  │                                                              ││
│  │    Expanda sua Consciência.                                 ││
│  │    Sabedoria secular potencializada por IA.                 ││
│  │                                      [EXPLORAR BIBLIOTECA →]││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  NOVIDADES                                                       │
│  Lançamentos                                                     │
│  ┌────────────────────────┐  ┌────────────────────────┐         │
│  │ [Cover] CIÊNCIA        │  │ [Cover] FILOSOFIA      │         │
│  │         O Início...    │  │         O Mito...      │         │
│  │         David Deutsch  │  │         Albert Camus   │         │
│  └────────────────────────┘  └────────────────────────┘         │
│                                                                  │
│  CURADORIA                                           VER TODAS → │
│  Coleções                                                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                      │
│  │ [📚]Naval │ │ [📚] IA   │ │ [📚]Alta  │                      │
│  │   5 livros│ │  10 livros│ │  Perform. │                      │
│  └───────────┘ └───────────┘ └───────────┘                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  [TODOS] [BIOGRAFIAS] [CIÊNCIA] [FILOSOFIA] [PSICOLOGIA] ...    │
│                                                                  │
│  CATÁLOGO COMPLETO                                               │
│  19 obras                                                        │
│  [Book Grid]                                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Tab: Favoritos (Diferenciado)
```
┌─────────────────────────────────────────────────────────────────┐
│  EXPLORAR  │  AUTORES  │  MEUS LIVROS  │  CURSOS  │  COMUNIDADE │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                   [violet]  ││
│  │    Sua Biblioteca Pessoal                                   ││
│  │    Organize suas leituras e acompanhe seu progresso.        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  LENDO AGORA                                                     │
│  ┌────────────────────────┐                                     │
│  │ [Cover] 45% ████░░░░   │                                     │
│  │         O Início...    │                                     │
│  └────────────────────────┘                                     │
│                                                                  │
│  LISTA DE DESEJOS                                                │
│  [Book Grid - to_read status]                                    │
│                                                                  │
│  CONCLUÍDOS                                                      │
│  [Book Grid - completed status]                                  │
│                                                                  │
│  [Empty State se vazio: "Comece a construir sua biblioteca"]    │
└─────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### AC1: Diferenciação Visual Explorar vs Favoritos
- [ ] **Explorar:** Accent amber (#f59e0b), hero "Expanda sua Consciência"
- [ ] **Favoritos:** Accent violet (#8B5CF6), hero "Sua Biblioteca Pessoal"
- [ ] Gradientes de fundo diferentes
- [ ] Seções diferentes (Explorar: Lançamentos/Coleções/Catálogo; Favoritos: Lendo/Desejos/Concluídos)

### AC2: Hero Section (LibraryHero)
- [ ] Badge superior: "CURADORIA EXCLUSIVA • N obras"
- [ ] Título grande estilizado
- [ ] Subtítulo em text-zinc-400
- [ ] CTA button à direita
- [ ] Background com gradient sutil

### AC3: Lançamentos (BookCardHorizontal)
- [ ] Card horizontal: cover à esquerda, info à direita
- [ ] Category badge (ex: CIÊNCIA, FILOSOFIA)
- [ ] Título, autor, link para autor
- [ ] 2 cards por linha em desktop

### AC4: Coleções (CollectionCard)
- [ ] Card compacto com ícone
- [ ] Nome da coleção
- [ ] Contagem de livros
- [ ] 3-4 cards por linha

### AC5: Category Chips (CategoryChips)
- [ ] Filter chips horizontais scrolláveis
- [ ] Chip ativo: bg-white text-black
- [ ] Chips inativos: bg-zinc-800 text-zinc-400

### AC6: Catálogo Grid
- [ ] Header: "CATÁLOGO COMPLETO" + count
- [ ] Grid de BookCardVisual (já existe)
- [ ] 4 colunas desktop, 2 mobile

### AC7: Página de Autor (AuthorDetailPage)
- [ ] Header com foto circular grande
- [ ] Nome em tipografia bold
- [ ] Bio em card com borda sutil
- [ ] Grid de livros do autor
- [ ] Botão "Começar a Ler"

## New Components

### LibraryHero.tsx
```typescript
interface LibraryHeroProps {
  variant: 'explore' | 'favorites';
  bookCount: number;
  onCTA?: () => void;
}
```

### BookCardHorizontal.tsx
```typescript
interface BookCardHorizontalProps {
  book: Book;
  onBookClick: (bookId: string) => void;
  onAuthorClick?: (authorId: string) => void;
}
```

### CollectionCard.tsx
```typescript
interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    icon: string;
    bookCount: number;
  };
  onClick: (collectionId: string) => void;
}
```

### CategoryChips.tsx
```typescript
interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}
```

### AuthorCard.tsx
```typescript
interface AuthorCardProps {
  author: Author;
  onClick: (authorId: string) => void;
}
```

## Files to Create

| File | Description |
|------|-------------|
| `components/library/LibraryHero.tsx` | Hero section with variants |
| `components/library/BookCardHorizontal.tsx` | Horizontal book card |
| `components/library/CollectionCard.tsx` | Collection card |
| `components/library/CategoryChips.tsx` | Category filter chips |
| `components/library/AuthorCard.tsx` | Circular author card |
| `components/pages/AuthorDetailPage.tsx` | Author profile page |

## Files to Modify

| File | Changes |
|------|---------|
| `components/pages/JourneyLibrary.tsx` | Major refactor with new layout |
| `components/pages/BookDetailPage.tsx` | Update to match image 4 style |
| `App.tsx` | Add AuthorDetailPage route |

## Color Tokens

```typescript
// Explorar
explore: {
  accent: '#f59e0b',       // amber-500
  accentLight: '#fbbf24',  // amber-400
  bgGradient: 'from-amber-900/20 to-transparent',
}

// Favoritos
favorites: {
  accent: '#8B5CF6',       // violet-500
  accentLight: '#A78BFA',  // violet-400
  bgGradient: 'from-violet-900/20 to-transparent',
}
```

## Testing Checklist

- [ ] Explorar tem visual amber
- [ ] Favoritos tem visual violet
- [ ] Hero renderiza corretamente
- [ ] Lançamentos (horizontal cards) funcionam
- [ ] Coleções renderizam
- [ ] Category chips filtram
- [ ] Catálogo grid funciona
- [ ] Autor card clicável
- [ ] Author detail page funciona
- [ ] Responsivo mobile

## Definition of Done

- [ ] Explorar redesenhado com novo layout
- [ ] Favoritos diferenciado visualmente
- [ ] Todos os novos componentes criados
- [ ] AuthorDetailPage implementado
- [ ] Navegação entre páginas funciona
- [ ] Visual minimalista alcançado

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 1-1.5 dias
