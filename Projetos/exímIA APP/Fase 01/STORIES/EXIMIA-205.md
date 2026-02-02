# EXIMIA-205: Progresso de Leitura

> EPIC-002: Modo Leitura | Sprint 4 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-205 |
| Título | Tracking de Progresso de Leitura |
| Epic | EPIC-002 |
| Story Points | 5 |
| Sprint | 4 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** que meu progresso seja salvo automaticamente,
**Para** continuar de onde parei.

---

## Acceptance Criteria

- [ ] **AC1:** Progresso salvo ao mudar de capítulo
- [ ] **AC2:** Ao reabrir resumo, continua no último capítulo lido
- [ ] **AC3:** Debounce no save (máximo 1 chamada por 2 segundos)
- [ ] **AC4:** Modal de conclusão ao terminar último capítulo:
  - Mensagem de parabéns
  - Estatísticas (tempo, capítulos)
  - Botões: "Reler", "Voltar à Biblioteca"
- [ ] **AC5:** `completed = true` quando finaliza último capítulo
- [ ] **AC6:** `completed_at` timestamp registrado
- [ ] **AC7:** Funciona offline: localStorage como buffer
- [ ] **AC8:** Sync automático quando voltar online
- [ ] **AC9:** Indicador visual de "salvando..." discreto
- [ ] **AC10:** Progresso visível na página de favoritos (EXIMIA-106)
- [ ] **AC11:** Badge de "Concluído" no card após finalizar

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Interface: `SummaryReadingProgress`
- Schema: `SaveSummaryProgressSchema`

### Estrutura de Arquivos

```
src/components/biblioteca/ReadingMode/
├── CompletionModal.tsx       # Modal de conclusão
├── SavingIndicator.tsx       # Indicador de salvamento
└── ...

src/hooks/
└── useReadingProgress.ts     # Hook de progresso
```

### Hook de Progresso

```tsx
// src/hooks/useReadingProgress.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SummaryReadingProgress } from '@/types/biblioteca';
import { saveReadingProgress } from '@/lib/actions/summaries/progress';

const STORAGE_KEY_PREFIX = 'reading-progress-';
const DEBOUNCE_MS = 2000;

interface UseReadingProgressProps {
  summaryId: string;
  totalChapters: number;
  initialProgress?: SummaryReadingProgress | null;
  onComplete?: () => void;
}

interface UseReadingProgressReturn {
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  completed: boolean;
  isSaving: boolean;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export function useReadingProgress({
  summaryId,
  totalChapters,
  initialProgress,
  onComplete,
}: UseReadingProgressProps): UseReadingProgressReturn {
  const [currentChapter, setCurrentChapterState] = useState(
    initialProgress?.current_chapter || 1
  );
  const [completed, setCompleted] = useState(initialProgress?.completed || false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'offline'>('synced');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY_PREFIX}${summaryId}`;

  // Carregar do localStorage como fallback
  useEffect(() => {
    if (!initialProgress) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentChapterState(parsed.currentChapter || 1);
          setCompleted(parsed.completed || false);
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [initialProgress, storageKey]);

  // Função de save com debounce
  const saveProgress = useCallback(async (chapter: number, isComplete: boolean) => {
    // Salvar no localStorage imediatamente
    localStorage.setItem(storageKey, JSON.stringify({
      currentChapter: chapter,
      completed: isComplete,
      updatedAt: Date.now(),
    }));
    setSyncStatus('pending');

    // Cancelar save anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce o save no banco
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);

      try {
        const result = await saveReadingProgress({
          summary_id: summaryId,
          current_chapter: chapter,
          completed: isComplete,
        });

        if (result.success) {
          setSyncStatus('synced');
          // Limpar localStorage após sync
          localStorage.removeItem(storageKey);
        } else {
          setSyncStatus('offline');
        }
      } catch (error) {
        setSyncStatus('offline');
      } finally {
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);
  }, [summaryId, storageKey]);

  // Função exposta para mudar capítulo
  const setCurrentChapter = useCallback((chapter: number) => {
    setCurrentChapterState(chapter);

    const isComplete = chapter >= totalChapters && !completed;

    if (isComplete) {
      setCompleted(true);
      onComplete?.();
    }

    saveProgress(chapter, isComplete || completed);
  }, [totalChapters, completed, saveProgress, onComplete]);

  // Sync quando voltar online
  useEffect(() => {
    const handleOnline = async () => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSyncStatus('pending');
        try {
          const parsed = JSON.parse(stored);
          const result = await saveReadingProgress({
            summary_id: summaryId,
            current_chapter: parsed.currentChapter,
            completed: parsed.completed,
          });
          if (result.success) {
            setSyncStatus('synced');
            localStorage.removeItem(storageKey);
          }
        } catch (e) {
          // Keep pending
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [summaryId, storageKey]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentChapter,
    setCurrentChapter,
    completed,
    isSaving,
    syncStatus,
  };
}
```

### Modal de Conclusão

```tsx
// src/components/biblioteca/ReadingMode/CompletionModal.tsx
'use client';

import { CheckCircle, BookOpen, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompletionModalProps {
  isOpen: boolean;
  bookTitle: string;
  totalChapters: number;
  onReread: () => void;
  onClose: () => void;
}

export function CompletionModal({
  isOpen,
  bookTitle,
  totalChapters,
  onReread,
  onClose,
}: CompletionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">
          Parabéns!
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-6">
          Você concluiu a leitura de{' '}
          <span className="font-semibold text-foreground">{bookTitle}</span>
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500">
              {totalChapters}
            </div>
            <div className="text-sm text-muted-foreground">
              Capítulos lidos
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              100%
            </div>
            <div className="text-sm text-muted-foreground">
              Completo
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReread}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RotateCcw className="w-5 h-5" />
            Reler do início
          </button>

          <button
            onClick={() => router.push('/biblioteca/favoritos')}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <BookOpen className="w-5 h-5" />
            Voltar aos Favoritos
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Indicador de Salvamento

```tsx
// src/components/biblioteca/ReadingMode/SavingIndicator.tsx
'use client';

import { Cloud, CloudOff, Check } from 'lucide-react';

interface SavingIndicatorProps {
  status: 'synced' | 'pending' | 'offline';
  isSaving: boolean;
}

export function SavingIndicator({ status, isSaving }: SavingIndicatorProps) {
  if (status === 'synced' && !isSaving) {
    return null; // Não mostrar nada quando está tudo ok
  }

  return (
    <div className="fixed bottom-20 right-4 z-10">
      <div className="bg-black/70 text-white text-xs px-3 py-2 rounded-full flex items-center gap-2">
        {isSaving ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Salvando...</span>
          </>
        ) : status === 'pending' ? (
          <>
            <Cloud className="w-4 h-4 text-yellow-400" />
            <span>Sincronizando...</span>
          </>
        ) : status === 'offline' ? (
          <>
            <CloudOff className="w-4 h-4 text-red-400" />
            <span>Offline - salvo localmente</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span>Salvo</span>
          </>
        )}
      </div>
    </div>
  );
}
```

### Integração no ReadingMode

```tsx
// Atualização em ReadingMode.tsx
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { CompletionModal } from './CompletionModal';
import { SavingIndicator } from './SavingIndicator';

// No componente:
const [showCompletion, setShowCompletion] = useState(false);

const {
  currentChapter,
  setCurrentChapter,
  completed,
  isSaving,
  syncStatus,
} = useReadingProgress({
  summaryId: summary.id,
  totalChapters: summary.chapters.length,
  initialProgress: progress,
  onComplete: () => setShowCompletion(true),
});

// No render:
<SavingIndicator status={syncStatus} isSaving={isSaving} />

<CompletionModal
  isOpen={showCompletion}
  bookTitle={summary.catalog?.title || summary.title}
  totalChapters={summary.chapters.length}
  onReread={() => {
    setCurrentChapter(1);
    setShowCompletion(false);
  }}
  onClose={() => setShowCompletion(false)}
/>
```

---

## Definition of Done

- [ ] Progresso salva ao mudar capítulo
- [ ] Continua do último capítulo ao reabrir
- [ ] Debounce de 2 segundos funcionando
- [ ] Modal de conclusão implementado
- [ ] `completed` e `completed_at` setados
- [ ] localStorage como fallback offline
- [ ] Sync automático ao reconectar
- [ ] Indicador de salvamento discreto
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-201 (Server Actions de Progresso)
- EXIMIA-202 (Componente ReadingMode)

### Bloqueia
- Nenhuma

---

## Out of Scope

- Histórico de leituras anteriores
- Estatísticas de tempo de leitura
- Conquistas/gamification
- Compartilhar conclusão

---

*— River, removendo obstáculos 🌊*
