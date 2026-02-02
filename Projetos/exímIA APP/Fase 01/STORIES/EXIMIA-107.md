# EXIMIA-107: Página de Detalhe do Livro

> EPIC-001: Biblioteca Core | Sprint 2 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-107 |
| Título | Página de Detalhe do Livro |
| Epic | EPIC-001 |
| Story Points | 5 |
| Sprint | 2 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** ver os detalhes de um livro,
**Para** conhecer mais sobre ele e acessar resumos/notas.

---

## Acceptance Criteria

- [ ] **AC1:** Rota `/biblioteca/livro/[id]` implementada
- [ ] **AC2:** Server Action `getCatalogBook(id)` utilizada
- [ ] **AC3:** Header com:
  - Capa em destaque
  - Título e subtítulo
  - Autor (link se houver página de autor)
  - Contador de favoritos
  - Botão de favoritar (toggle)
- [ ] **AC4:** Metadados exibidos:
  - Editora
  - Data de publicação
  - Número de páginas
  - ISBN
  - Idioma
  - Categorias (como tags)
- [ ] **AC5:** Tabs de conteúdo:
  - **Sinopse** — descrição do livro
  - **Resumo** — link para modo leitura se disponível
  - **Notas** — notas do usuário (EXIMIA-108)
- [ ] **AC6:** Aba Sinopse:
  - Descrição completa (expandível se muito longa)
- [ ] **AC7:** Aba Resumo:
  - Se tem resumo publicado: card com info + botão "Ler Resumo"
  - Se não tem: mensagem "Resumo não disponível ainda"
  - Mostrar progresso se usuário já começou
- [ ] **AC8:** Estado de 404 se livro não existe
- [ ] **AC9:** Loading state com skeleton
- [ ] **AC10:** Responsivo: layout adaptativo
- [ ] **AC11:** SEO: meta tags dinâmicas (título, descrição)

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- View: `catalog_view`

### Estrutura de Arquivos

```
src/app/(platform)/biblioteca/livro/
├── [id]/
│   ├── page.tsx            # Página de detalhe
│   ├── loading.tsx         # Skeleton
│   └── not-found.tsx       # 404
└── layout.tsx

src/components/biblioteca/
├── BookDetail/
│   ├── BookDetailHeader.tsx
│   ├── BookDetailMeta.tsx
│   ├── BookDetailTabs.tsx
│   ├── SinopseTab.tsx
│   ├── ResumoTab.tsx
│   └── NotasTab.tsx        # EXIMIA-108
└── index.ts
```

### Página de Detalhe

```tsx
// src/app/(platform)/biblioteca/livro/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getCatalogBook } from '@/lib/actions/catalog/get';
import { getSummaryByCatalog } from '@/lib/actions/summaries/get';
import { checkFavorites } from '@/lib/actions/favorites/check';
import { BookDetailHeader } from '@/components/biblioteca/BookDetail/BookDetailHeader';
import { BookDetailTabs } from '@/components/biblioteca/BookDetail/BookDetailTabs';

interface BookDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: BookDetailPageProps) {
  const result = await getCatalogBook(params.id);

  if (!result.success || !result.data) {
    return { title: 'Livro não encontrado' };
  }

  const book = result.data;
  return {
    title: `${book.title} | Biblioteca exímIA`,
    description: book.description?.slice(0, 160) || `Detalhes do livro ${book.title}`,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const [bookResult, summaryResult, favoriteResult] = await Promise.all([
    getCatalogBook(params.id),
    getSummaryByCatalog(params.id),
    checkFavorites([params.id]),
  ]);

  if (!bookResult.success || !bookResult.data) {
    notFound();
  }

  const book = bookResult.data;
  const summary = summaryResult.success ? summaryResult.data : null;
  const isFavorite = favoriteResult.success ? favoriteResult.data?.[params.id] : false;

  return (
    <div className="container max-w-4xl py-8">
      <BookDetailHeader
        book={book}
        isFavorite={isFavorite}
      />

      <BookDetailTabs
        book={book}
        summary={summary}
      />
    </div>
  );
}
```

### Header Component

```tsx
// src/components/biblioteca/BookDetail/BookDetailHeader.tsx
'use client';

import { Heart, Share2, ExternalLink } from 'lucide-react';
import { BookCatalogView } from '@/types/biblioteca';
import { useFavorite } from '@/hooks/useFavorite';

interface BookDetailHeaderProps {
  book: BookCatalogView;
  isFavorite: boolean;
}

export function BookDetailHeader({ book, isFavorite: initialFavorite }: BookDetailHeaderProps) {
  const { isFavorite, toggle, isLoading } = useFavorite(book.id, initialFavorite);

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Capa */}
      <div className="flex-shrink-0">
        <div className="relative w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-6xl">
              📚
            </div>
          )}

          {book.has_published_summary && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              Resumo Disponível
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        {book.subtitle && (
          <p className="text-xl text-muted-foreground mb-4">{book.subtitle}</p>
        )}

        <p className="text-lg mb-4">
          por <span className="font-medium">{book.author_name || 'Autor desconhecido'}</span>
        </p>

        {/* Metadados rápidos */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          {book.publisher && <span>{book.publisher}</span>}
          {book.published_date && <span>{book.published_date}</span>}
          {book.page_count && <span>{book.page_count} páginas</span>}
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={toggle}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </button>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-4 h-4" />
            {book.favorites_count}
          </span>
        </div>

        {/* Categorias */}
        {book.categories && book.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {book.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Aba de Resumo

```tsx
// src/components/biblioteca/BookDetail/ResumoTab.tsx
import { BookOpen, CheckCircle } from 'lucide-react';
import { BookSummary, SummaryReadingProgress } from '@/types/biblioteca';
import Link from 'next/link';

interface ResumoTabProps {
  catalogId: string;
  summary: BookSummary | null;
  progress?: SummaryReadingProgress | null;
  chapterCount: number;
}

export function ResumoTab({ catalogId, summary, progress, chapterCount }: ResumoTabProps) {
  if (!summary) {
    return (
      <div className="py-12 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Resumo não disponível</h3>
        <p className="text-muted-foreground">
          Este livro ainda não possui um resumo publicado.
        </p>
      </div>
    );
  }

  const progressPercent = progress
    ? Math.round((progress.current_chapter / chapterCount) * 100)
    : 0;

  return (
    <div className="py-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{summary.title}</h3>
            <p className="text-muted-foreground mb-4">
              {chapterCount} capítulos disponíveis
            </p>

            {progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Seu progresso</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {progress.completed && (
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                    <CheckCircle className="w-4 h-4" />
                    Concluído!
                  </p>
                )}
              </div>
            )}

            <Link
              href={`/biblioteca/livro/${catalogId}/ler`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              <BookOpen className="w-5 h-5" />
              {progress && !progress.completed
                ? `Continuar do Capítulo ${progress.current_chapter}`
                : 'Iniciar Leitura'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Definition of Done

- [ ] Página implementada com dados reais
- [ ] Header com todas as informações
- [ ] Tabs funcionando (Sinopse, Resumo, Notas)
- [ ] Aba Resumo com link para modo leitura
- [ ] Botão de favoritar funcional
- [ ] 404 para livros inexistentes
- [ ] SEO com meta tags
- [ ] Loading state
- [ ] Responsivo
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-104 (Página Explorar - para navegação)

### Bloqueia
- EXIMIA-108 (Sistema de Notas - Aba Notas)
- EXIMIA-206 (Rota de Leitura)

---

## Out of Scope

- Edição de dados do livro
- Comentários públicos
- Avaliações/rating

---

*— River, removendo obstáculos 🌊*
