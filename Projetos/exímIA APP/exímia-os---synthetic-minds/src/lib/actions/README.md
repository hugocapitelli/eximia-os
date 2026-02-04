# Server Actions — Biblioteca Module

> EXIMIA-201: Server Actions de Resumos (Leitura)

## Estrutura

```
src/lib/actions/
├── summaries/
│   ├── get.ts              # getSummaryByCatalog, getSummaryWithChapters, getChapter
│   ├── progress.ts         # saveReadingProgress, getReadingProgress, markSummaryAsCompleted
│   ├── get.test.ts
│   ├── progress.test.ts
│   └── index.ts
│
└── preferences/
    ├── reading.ts          # saveReadingPreferences, getReadingPreferences, updateTheme, etc
    ├── reading.test.ts
    └── index.ts
```

## Funções Implementadas

### Summaries — `src/lib/actions/summaries/get.ts`

#### `getSummaryByCatalog(catalogId: string)`
Busca um resumo pelo ID do catálogo.
- ✅ Apenas resumos publicados para usuários normais
- ✅ Admin pode ver resumos não publicados
- ✅ RLS controla acesso

**Retorna:** `ActionResult<BookSummary | null>`

```typescript
const { data, error, code } = await getSummaryByCatalog('catalog-123');
```

#### `getSummaryWithChapters(summaryId: string)`
Busca um resumo com TODOS os seus capítulos (ordenados).
- ✅ Filtra resumos não publicados para usuários normais
- ✅ Inclui dados do catálogo
- ✅ Capítulos ordenados por `order_index`

**Retorna:** `ActionResult<SummaryWithChapters | null>`

```typescript
const result = await getSummaryWithChapters('summary-123');
if (result.success && result.data) {
  console.log(result.data.chapters); // Array de capítulos
}
```

#### `getChapter(summaryId: string, chapterNumber: number)`
Busca um capítulo específico por número.
- ✅ Validação de capítulo existente
- ✅ Retorna conteúdo completo em Markdown

**Retorna:** `ActionResult<SummaryChapter | null>`

```typescript
const chapter = await getChapter('summary-123', 2);
```

---

### Progress — `src/lib/actions/summaries/progress.ts`

#### `saveReadingProgress(input: SaveSummaryProgressInput)`
Salva ou atualiza o progresso de leitura do usuário (UPSERT).
- ✅ Atualiza automaticamente `last_read_at`
- ✅ Marca `completed_at` quando concluído
- ✅ Validação de entrada com Zod
- ✅ RLS: apenas usuário próprio

**Input:**
```typescript
{
  summary_id: string;
  current_chapter: number;  // > 0
  completed?: boolean;
}
```

**Retorna:** `ActionResult<SummaryReadingProgress>`

```typescript
await saveReadingProgress({
  summary_id: 'summary-123',
  current_chapter: 3,
  completed: false,
});
```

#### `getReadingProgress(summaryId: string)`
Recupera o progresso de leitura do usuário.
- ✅ Retorna `null` se não há progresso
- ✅ RLS: apenas próprio progresso

**Retorna:** `ActionResult<SummaryReadingProgress | null>`

```typescript
const progress = await getReadingProgress('summary-123');
```

#### `markSummaryAsCompleted(summaryId: string)`
Marca um resumo como concluído.
- ✅ Seta `completed: true`
- ✅ Atualiza `completed_at`

**Retorna:** `ActionResult<SummaryReadingProgress>`

```typescript
await markSummaryAsCompleted('summary-123');
```

---

### Preferences — `src/lib/actions/preferences/reading.ts`

#### `saveReadingPreferences(input: SaveReadingPreferencesInput)`
Salva preferências de leitura do usuário (UPSERT).
- ✅ Tema: `'light' | 'sepia' | 'dark'`
- ✅ Tamanho da fonte: `'small' | 'medium' | 'large'`
- ✅ Validação de valores
- ✅ RLS: apenas próprio usuário

**Input:**
```typescript
{
  theme?: ReadingTheme;
  font_size?: FontSize;
}
```

**Retorna:** `ActionResult<UserReadingPreferences>`

```typescript
await saveReadingPreferences({
  theme: 'sepia',
  font_size: 'large',
});
```

#### `getReadingPreferences()`
Recupera preferências de leitura do usuário.
- ✅ Retorna **defaults** se não existem
- ✅ Defaults: `{ theme: 'dark', font_size: 'medium' }`

**Retorna:** `ActionResult<UserReadingPreferences | null>`

```typescript
const prefs = await getReadingPreferences();
// Sempre retorna um objeto (defaults ou salvos)
```

#### `updateTheme(theme: ReadingTheme)`
Atualiza apenas o tema.

#### `updateFontSize(fontSize: FontSize)`
Atualiza apenas o tamanho da fonte.

#### `resetReadingPreferences()`
Reseta para valores padrão.

---

## Uso em Componentes

### Exemplo: Componente ReadingMode

```tsx
import { useEffect, useState } from 'react';
import { getSummaryWithChapters, getReadingProgress, saveReadingProgress } from '@/lib/actions/summaries';
import { getReadingPreferences, saveReadingPreferences } from '@/lib/actions/preferences';
import type { SummaryWithChapters, UserReadingPreferences } from '@/types/biblioteca';

export function ReadingMode({ summaryId }: { summaryId: string }) {
  const [summary, setSummary] = useState<SummaryWithChapters | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [prefs, setPrefs] = useState<UserReadingPreferences | null>(null);

  useEffect(() => {
    const load = async () => {
      // Carregar resumo com capítulos
      const summaryRes = await getSummaryWithChapters(summaryId);
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);

        // Carregar progresso do usuário
        const progressRes = await getReadingProgress(summaryId);
        if (progressRes.success && progressRes.data) {
          setCurrentChapter(progressRes.data.current_chapter);
        }
      }

      // Carregar preferências
      const prefsRes = await getReadingPreferences();
      if (prefsRes.success && prefsRes.data) {
        setPrefs(prefsRes.data);
      }
    };

    load();
  }, [summaryId]);

  const handleChapterChange = async (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    await saveReadingProgress({
      summary_id: summaryId,
      current_chapter: chapterNum,
    });
  };

  const handleThemeChange = async (theme: 'light' | 'sepia' | 'dark') => {
    const res = await saveReadingPreferences({ theme });
    if (res.success && res.data) {
      setPrefs(res.data);
    }
  };

  return (
    <div style={{
      backgroundColor: prefs?.theme === 'light' ? '#fff' : '#1a1a1a',
      color: prefs?.theme === 'light' ? '#000' : '#fff',
    }}>
      {/* Componentes de leitura aqui */}
    </div>
  );
}
```

---

## Error Handling

Todas as funções retornam `ActionResult<T>`:

```typescript
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

**Códigos de Erro:**
- `VALIDATION_ERROR` — Input inválido
- `UNAUTHORIZED` — Usuário não autenticado
- `QUERY_ERROR` — Erro ao buscar dados
- `UPSERT_ERROR` — Erro ao salvar dados
- `UNKNOWN_ERROR` — Erro desconhecido

**Tratamento:**
```typescript
const result = await getSummaryByCatalog('catalog-123');

if (!result.success) {
  console.error(`Erro [${result.code}]: ${result.error}`);
  // Handle error
} else {
  console.log(result.data);
}
```

---

## RLS (Row Level Security)

Todas as ações respeitam RLS:

| Tabela | Leitura | Escrita |
|--------|---------|---------|
| `book_summaries` | ✅ Publicados (all) | 🔒 Admin |
| `summary_chapters` | ✅ Publicados (all) | 🔒 Admin |
| `summary_reading_progress` | 🔒 Próprio | 🔒 Próprio |
| `user_reading_preferences` | 🔒 Próprio | 🔒 Próprio |

---

## Testing

Testes incluídos:
- `src/lib/actions/summaries/get.test.ts`
- `src/lib/actions/summaries/progress.test.ts`
- `src/lib/actions/preferences/reading.test.ts`

Para executar testes de integração:
```bash
npm run test:integration
```

---

## Acceptance Criteria — EXIMIA-201

- [x] AC1: Server Action `getSummaryByCatalog` implementada
- [x] AC2: Server Action `getSummaryWithChapters` implementada
- [x] AC3: Server Action `getChapter` implementada
- [x] AC4: Server Action `saveReadingProgress` implementada
- [x] AC5: Server Action `getReadingProgress` implementada
- [x] AC6: Server Action `saveReadingPreferences` implementada
- [x] AC7: Server Action `getReadingPreferences` implementada
- [x] AC8: Apenas resumos com `is_published = true` retornados para usuários normais
- [x] AC9: Admin pode ver resumos não publicados
- [x] AC10: Validação com Zod em todas as actions
- [x] AC11: RLS garante acesso correto

---

*Implementado em: 2026-02-04*
*Story: EXIMIA-201*
*Status: ✅ Ready for Review*
