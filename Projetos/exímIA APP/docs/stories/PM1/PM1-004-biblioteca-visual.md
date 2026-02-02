# Story PM1-004: Biblioteca Visual Redesign

## Story Info

**Story ID:** PM1-004
**Epic:** PM1 - UX Enhancement Package
**Priority:** P1 (Alta)
**Story Points:** 8
**Status:** Ready for Development

## User Story

**Como** usuário da Biblioteca,
**Eu quero** uma interface visual moderna com capas de livros reais,
**Para que** eu tenha uma experiência mais imersiva e similar a uma biblioteca real.

## Context

Baseado na imagem de referência (Lendaria), a Biblioteca precisa de um redesign visual completo incluindo:
- Grid de livros com capas reais
- Badge "RASCUNHO" em cards
- Favoritos funcionais (estrela)
- Botão de autor para navegar ao Mind

## UX Specifications (Uma)

### Reference Analysis (Lendaria)

Elementos identificados na referência:
- Cards com aspect ratio de capa de livro (2:3)
- Hover effect com elevação
- Badge de status no canto superior
- Ícone de favorito (estrela)
- Gradiente escuro na base para título
- Autor como link clicável

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  BIBLIOTECA                                                  │
│  Sua coleção pessoal de conhecimento                        │
│                                                              │
│  [Explorar] [Autores] [Favoritos ★] [Cursos] [Comunidade]   │
│                                                              │
│  ────────────────────────────────────────────────────────   │
│                                                              │
│  [All ●] [Reading] [To Read] [Completed]                    │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ [RASCUNHO] │ │            │ │            │ │     ★      ││
│  │            │ │            │ │            │ │            ││
│  │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  ││
│  │  ▓ CAPA ▓  │ │  ▓ CAPA ▓  │ │  ▓ CAPA ▓  │ │  ▓ CAPA ▓  ││
│  │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  │ │  ▓▓▓▓▓▓▓▓  ││
│  │            │ │            │ │            │ │            ││
│  │ ─────────  │ │ ─────────  │ │ ─────────  │ │ ─────────  ││
│  │ Deep Work  │ │ Atomic     │ │ Zero to    │ │ The Lean   ││
│  │ Cal Newport│ │ James Clear│ │ Peter Thiel│ │ Eric Ries  ││
│  │ ████░░ 60% │ │ ██░░░░ 30% │ │            │ │ ██████ 100%││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │    ...     │ │    ...     │ │    ...     │ │    ...     ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Book Card Design

```css
/* Book Card Container */
.book-card {
  aspect-ratio: 2/3;
  background: #0A0A0A;
  border: 1px solid #1F1F22;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  border-color: rgba(251, 191, 36, 0.3);
}

/* Cover Image */
.book-cover {
  width: 100%;
  height: 70%;
  object-fit: cover;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
}

/* Info Area (bottom 30%) */
.book-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.95));
}

/* Draft Badge */
.badge-draft {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.9);
  color: #000;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.15em;
  border-radius: 4px;
  text-transform: uppercase;
}

/* Favorite Star */
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  transform: scale(1.1);
}

.favorite-btn--active {
  background: rgba(245, 158, 11, 0.3);
}

.favorite-btn--active svg {
  fill: #f59e0b;
  color: #f59e0b;
}

/* Progress Bar */
.book-progress {
  height: 4px;
  background: #2a2a2a;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.book-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Author Link */
.book-author {
  color: #71717a;
  font-size: 12px;
  transition: color 0.2s;
}

.book-author:hover {
  color: #f59e0b;
  text-decoration: underline;
}
```

### Component Structure

```typescript
interface BookCardProps {
  book: Book;
  onNavigate: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
  onAuthorClick: (authorName: string) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
  authorHasMind?: boolean; // Se autor tem clone/Mind
  coverUrl?: string;
  status: 'to_read' | 'reading' | 'completed';
  progress: number; // 0-100
  isDraft?: boolean;
  isFavorite: boolean;
  category?: string;
  rating?: number;
}
```

### Features Implementation

#### 1. Draft Badge
```typescript
// Mostrar quando livro tem anotações incompletas ou resumo em progresso
{book.isDraft && (
  <span className="badge-draft">RASCUNHO</span>
)}
```

#### 2. Favorites Functionality
```typescript
const [favorites, setFavorites] = useState<string[]>([]);

const toggleFavorite = (bookId: string) => {
  setFavorites(prev =>
    prev.includes(bookId)
      ? prev.filter(id => id !== bookId)
      : [...prev, bookId]
  );
  // Persist to storage/API
};

// Filter for Favoritos tab
const favoriteBooks = books.filter(b => favorites.includes(b.id));
```

#### 3. Author Mind Link
```typescript
// No BookCard, autor é clicável se tem Mind
<button
  onClick={(e) => {
    e.stopPropagation();
    onAuthorClick(book.author);
  }}
  className={`book-author ${book.authorHasMind ? 'has-mind' : ''}`}
>
  {book.author}
  {book.authorHasMind && <Brain className="w-3 h-3 ml-1 inline" />}
</button>
```

### Grid Layout

```css
/* Responsive Grid */
.books-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 640px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .books-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

## Acceptance Criteria

### Funcional
- [ ] Cards com aspect ratio 2:3 (formato livro)
- [ ] Imagem de capa ocupando 70% do card
- [ ] Gradient overlay na base para legibilidade
- [ ] Badge "RASCUNHO" no canto superior esquerdo
- [ ] Botão favorito (estrela) no canto superior direito
- [ ] Favorito funcional com persistência (localStorage)
- [ ] Hover effect com elevação e scale
- [ ] Nome do autor clicável
- [ ] Ícone de Mind se autor tem clone (Brain icon)
- [ ] Barra de progresso para livros em leitura
- [ ] Grid responsivo (2-5 colunas)
- [ ] Tab "Favoritos" filtra apenas favoritos

### Acessibilidade (WCAG AA)
- [ ] Contraste mínimo 4.5:1 para texto sobre gradient
- [ ] Focus visible em cards e botão favorito
- [ ] aria-label em botão favorito ("Adicionar/Remover dos favoritos")
- [ ] aria-pressed para estado do favorito
- [ ] Keyboard navigation (Tab entre cards, Enter para abrir)
- [ ] role="button" no autor clicável

### Performance
- [ ] Grid performa com 50+ cards sem lag
- [ ] Lazy loading de imagens de capa
- [ ] Animações hover a 60fps
- [ ] Skeleton loading enquanto carrega capas

### Persistência
- [ ] Favoritos persistem em localStorage
- [ ] Migration path para Supabase documentado

## Technical Tasks

- [ ] Criar componente `BookCardVisual.tsx`
- [ ] Atualizar `JourneyLibrary.tsx` com novo grid
- [ ] Implementar estado de favoritos
- [ ] Adicionar persistência (localStorage/API)
- [ ] Implementar lógica de Mind link
- [ ] Adicionar mock covers aos dados
- [ ] Atualizar animações de hover

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/journey/BookCardVisual.tsx` | Create |
| `components/pages/JourneyLibrary.tsx` | Modify |
| `hooks/useFavorites.ts` | Create |
| `constants.ts` | Add cover URLs to books |

## Definition of Done

- [ ] Visual match com referência Lendaria
- [ ] Favoritos funcionais com persistência (localStorage)
- [ ] Links de autor funcionando (navegação para Mind)
- [ ] Responsividade testada (mobile 2col → desktop 5col)
- [ ] Performance ok (50+ cards a 60fps)
- [ ] Acessibilidade verificada (keyboard nav, aria-labels)
- [ ] Lazy loading de imagens funcionando
- [ ] Testes em Chrome, Firefox, Safari

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
