# EXIMIA-206: Rota e Integração com Favoritos

> EPIC-002: Modo Leitura | Sprint 4 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-206 |
| Título | Rota de Leitura e Integração |
| Epic | EPIC-002 |
| Story Points | 5 |
| Sprint | 4 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** acessar o modo leitura a partir dos meus favoritos,
**Para** ler resumos disponíveis de forma fluida.

---

## Acceptance Criteria

- [ ] **AC1:** Rota `/biblioteca/livro/[id]/ler` implementada
- [ ] **AC2:** Verifica se resumo existe para o `catalog_id`
- [ ] **AC3:** Verifica se resumo está publicado (`is_published = true`)
- [ ] **AC4:** 404 se não existe resumo ou não está publicado
- [ ] **AC5:** Carrega dados:
  - Summary com chapters
  - Progresso do usuário
  - Preferências de leitura
- [ ] **AC6:** Renderiza `ReadingMode` com dados
- [ ] **AC7:** Botão "Voltar" retorna para página do livro
- [ ] **AC8:** SEO: meta tags dinâmicas (título do livro)
- [ ] **AC9:** Loading state com skeleton enquanto carrega
- [ ] **AC10:** Integração com favoritos:
  - Badge "Resumo disponível" nos cards (EXIMIA-104, EXIMIA-106)
  - Botão "Ler Resumo" na aba Resumo (EXIMIA-107)
  - Botão "Continuar Lendo" se tem progresso

---

## Technical Notes

### Estrutura de Arquivos

```
src/app/(platform)/biblioteca/livro/[id]/
├── page.tsx                # Página de detalhe (EXIMIA-107)
├── ler/
│   ├── page.tsx            # Página de leitura
│   ├── loading.tsx         # Skeleton
│   └── not-found.tsx       # 404
└── layout.tsx
```

### Página de Leitura

```tsx
// src/app/(platform)/biblioteca/livro/[id]/ler/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSummaryByCatalog, getSummaryWithChapters } from '@/lib/actions/summaries/get';
import { getReadingProgress } from '@/lib/actions/summaries/progress';
import { getReadingPreferences } from '@/lib/actions/preferences/reading';
import { getCatalogBook } from '@/lib/actions/catalog/get';
import { ReadingMode } from '@/components/biblioteca/ReadingMode';

interface ReadPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const bookResult = await getCatalogBook(params.id);

  if (!bookResult.success || !bookResult.data) {
    return { title: 'Resumo não encontrado' };
  }

  return {
    title: `Lendo: ${bookResult.data.title} | exímIA`,
    description: `Resumo de ${bookResult.data.title}`,
  };
}

export default async function ReadPage({ params }: ReadPageProps) {
  // Buscar resumo pelo catalog_id
  const summaryResult = await getSummaryByCatalog(params.id);

  if (!summaryResult.success || !summaryResult.data) {
    notFound();
  }

  const summary = summaryResult.data;

  // Verificar se está publicado (para não-admins já filtrado pela action)
  if (!summary.is_published) {
    notFound();
  }

  // Carregar dados em paralelo
  const [fullSummaryResult, progressResult, preferencesResult] = await Promise.all([
    getSummaryWithChapters(summary.id),
    getReadingProgress(summary.id),
    getReadingPreferences(),
  ]);

  if (!fullSummaryResult.success || !fullSummaryResult.data) {
    notFound();
  }

  const fullSummary = fullSummaryResult.data;
  const progress = progressResult.success ? progressResult.data : null;
  const preferences = preferencesResult.success ? preferencesResult.data : null;

  return (
    <ReadingMode
      summary={fullSummary}
      progress={progress}
      userPreferences={preferences}
    />
  );
}
```

### Loading State

```tsx
// src/app/(platform)/biblioteca/livro/[id]/ler/loading.tsx
export default function ReadingLoading() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded animate-pulse" />
            <div className="w-32 h-5 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
            </div>
            <div className="w-20 h-8 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="flex-1 py-8">
        <div className="container max-w-[650px] mx-auto px-4">
          {/* Chapter Header */}
          <div className="mb-8 text-center">
            <div className="w-24 h-4 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
            <div className="w-64 h-8 bg-white/10 rounded mx-auto animate-pulse" />
          </div>

          {/* Content Lines */}
          <div className="space-y-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-white/10 rounded animate-pulse"
                style={{ width: `${Math.random() * 30 + 70}%` }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="sticky bottom-0 border-t border-white/10 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-24 h-8 bg-white/10 rounded animate-pulse" />
          <div className="w-16 h-5 bg-white/10 rounded animate-pulse" />
          <div className="w-24 h-8 bg-white/10 rounded animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
```

### 404 Page

```tsx
// src/app/(platform)/biblioteca/livro/[id]/ler/not-found.tsx
import { BookX } from 'lucide-react';
import Link from 'next/link';

export default function ReadNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BookX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Resumo não disponível</h1>
        <p className="text-muted-foreground mb-6">
          Este livro ainda não possui um resumo publicado.
        </p>
        <Link
          href="/biblioteca"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg inline-block"
        >
          Voltar à Biblioteca
        </Link>
      </div>
    </div>
  );
}
```

### Integração com Cards

```tsx
// Atualização em CatalogBookCard.tsx (EXIMIA-104)
// Adicionar badge de resumo disponível

{book.has_published_summary && (
  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
    <BookOpen className="w-3 h-3" />
    Resumo
  </div>
)}
```

```tsx
// Atualização em FavoriteCard.tsx (EXIMIA-106)
// Adicionar botão de leitura

{favorite.has_published_summary && (
  <Link
    href={`/biblioteca/livro/${favorite.id}/ler`}
    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <span className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
      <BookOpen className="w-4 h-4" />
      {favorite.current_chapter ? 'Continuar' : 'Ler Resumo'}
    </span>
  </Link>
)}
```

```tsx
// Atualização em ResumoTab.tsx (EXIMIA-107)
// Link para modo leitura

<Link
  href={`/biblioteca/livro/${catalogId}/ler`}
  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium"
>
  <BookOpen className="w-5 h-5" />
  {progress && !progress.completed
    ? `Continuar do Capítulo ${progress.current_chapter}`
    : 'Iniciar Leitura'}
</Link>
```

### Client Wrapper para Voltar

```tsx
// src/app/(platform)/biblioteca/livro/[id]/ler/page.tsx
// Wrapper client para handler de voltar

'use client';

import { useRouter } from 'next/navigation';

function ReadingPageClient({ summary, progress, preferences }) {
  const router = useRouter();

  return (
    <ReadingMode
      summary={summary}
      progress={progress}
      userPreferences={preferences}
      onBack={() => router.back()}
    />
  );
}
```

---

## Definition of Done

- [ ] Rota `/biblioteca/livro/[id]/ler` funcional
- [ ] Validações de resumo existente e publicado
- [ ] 404 adequado para resumos inexistentes
- [ ] Dados carregados corretamente
- [ ] SEO com meta tags
- [ ] Loading state
- [ ] Botão voltar funcional
- [ ] Badges integrados nos cards
- [ ] Botões de leitura nos favoritos
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-105 (Sistema de Favoritos)
- EXIMIA-202 (Componente ReadingMode)

### Bloqueia
- Nenhuma (última story de integração)

---

## Out of Scope

- Deep linking para capítulo específico
- Compartilhamento de link de leitura
- Modo de apresentação

---

*— River, removendo obstáculos 🌊*
