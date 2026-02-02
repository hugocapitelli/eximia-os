# Story 048: Quiz Frontend UI

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** HIGH
> **Estimate:** 8 points
> **Assignee:** @dev
> **Status:** READY
> **Dependencies:** Story 047 (Edge Function)

---

## 📋 Story

**As a** user
**I want** an intuitive and engaging quiz interface
**So that** I can complete my cognitive altitude assessment without friction

---

## 🎯 Acceptance Criteria

### Quiz Flow
- [ ] User can start assessment from dashboard
- [ ] Questions display one at a time (no pagination)
- [ ] Progress indicator shows completion (e.g., "Question 3 of 15")
- [ ] Answer selection is clear and accessible
- [ ] User can navigate back to previous questions
- [ ] Submit triggers validation and next question
- [ ] Complete flow redirects to results page

### UI/UX Requirements
- [ ] Mobile-responsive design (works on all devices)
- [ ] Smooth transitions between questions
- [ ] Loading states during API calls
- [ ] Error handling with retry option
- [ ] Accessibility: keyboard navigation + ARIA labels
- [ ] Visual feedback on answer selection
- [ ] Session persistence (refresh doesn't lose progress)

### Performance
- [ ] Initial load <2s
- [ ] Question transition <300ms
- [ ] Answer submission <500ms
- [ ] Optimistic UI updates (instant feedback)

### State Management
- [ ] Quiz state in Zustand store
- [ ] Session ID persisted to localStorage
- [ ] Answers cached locally before submission
- [ ] Graceful recovery from network errors

---

## 📐 Technical Specification

### File Structure

```
apps/web/src/
├── pages/
│   └── altitude-assessment.tsx        # Main quiz page
├── components/
│   └── altitude/
│       ├── QuizStart.tsx              # Start screen
│       ├── QuizQuestion.tsx           # Single question display
│       ├── QuizProgress.tsx           # Progress bar
│       ├── QuizNavigation.tsx         # Back/Next buttons
│       └── QuizLoading.tsx            # Loading states
├── hooks/
│   └── useAltitudeQuiz.ts             # Quiz logic hook
└── store/
    └── altitudeQuizStore.ts           # Zustand state
```

---

### Component: QuizStart

```tsx
// components/altitude/QuizStart.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuizStartProps {
  onStart: () => void;
  isLoading: boolean;
}

export function QuizStart({ onStart, isLoading }: QuizStartProps) {
  return (
    <Card className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">
        Descubra Sua Altitude Cognitiva
      </h1>

      <p className="text-lg text-muted-foreground mb-6">
        Este assessment de 15 questões vai identificar seu nível de pensamento
        através de 7 domínios fundamentais.
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="font-semibold">Tempo estimado: 10-12 minutos</p>
            <p className="text-sm text-muted-foreground">
              Não há limite de tempo, responda com calma
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-semibold">Seja honesto, não estratégico</p>
            <p className="text-sm text-muted-foreground">
              Não há respostas "certas" ou "erradas"
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-2xl">💾</span>
          <div>
            <p className="font-semibold">Progresso salvo automaticamente</p>
            <p className="text-sm text-muted-foreground">
              Você pode sair e voltar depois
            </p>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={onStart}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando...' : 'Começar Assessment'}
      </Button>
    </Card>
  );
}
```

---

### Component: QuizQuestion

```tsx
// components/altitude/QuizQuestion.tsx

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface Answer {
  id: string;
  answer_text: string;
  level_score: number;
}

interface Question {
  id: string;
  question_text: string;
  quiz_answers: Answer[];
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) {
  return (
    <Card className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-8 leading-relaxed">
        {question.question_text}
      </h2>

      <RadioGroup
        value={selectedAnswer || ''}
        onValueChange={onAnswerSelect}
        className="space-y-4"
      >
        {question.quiz_answers.map((answer, index) => (
          <div
            key={answer.id}
            className={`
              flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer
              ${
                selectedAnswer === answer.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }
            `}
            onClick={() => onAnswerSelect(answer.id)}
          >
            <RadioGroupItem value={answer.id} id={answer.id} />
            <Label
              htmlFor={answer.id}
              className="flex-1 cursor-pointer text-base leading-relaxed"
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {answer.answer_text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
}
```

---

### Component: QuizProgress

```tsx
// components/altitude/QuizProgress.tsx

import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">
          Questão {current} de {total}
        </p>
        <p className="text-sm text-muted-foreground">
          {Math.round(percentage)}% completo
        </p>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
```

---

### Component: QuizNavigation

```tsx
// components/altitude/QuizNavigation.tsx

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  isLoading: boolean;
}

export function QuizNavigation({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  isLastQuestion,
  isLoading,
}: QuizNavigationProps) {
  return (
    <div className="max-w-3xl mx-auto flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack || isLoading}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>

      <Button onClick={onNext} disabled={!canGoNext || isLoading}>
        {isLoading ? (
          'Processando...'
        ) : isLastQuestion ? (
          'Finalizar'
        ) : (
          <>
            Próxima
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
```

---

### Hook: useAltitudeQuiz

```typescript
// hooks/useAltitudeQuiz.ts

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAltitudeQuizStore } from '@/store/altitudeQuizStore';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question_text: string;
  quiz_answers: Array<{
    id: string;
    answer_text: string;
    level_score: number;
  }>;
}

export function useAltitudeQuiz() {
  const router = useRouter();
  const {
    sessionId,
    questions,
    currentQuestionIndex,
    answers,
    setSessionId,
    setQuestions,
    setCurrentQuestionIndex,
    setAnswer,
    reset,
  } = useAltitudeQuizStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  const startAssessment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: functionError } = await supabase.functions.invoke(
        'altitude-assessment',
        {
          body: {
            action: 'start',
            payload: {},
          },
        }
      );

      if (functionError) throw functionError;

      setSessionId(data.session_id);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to start assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answerId: string) => {
    setAnswer(currentQuestion.id, answerId);

    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: functionError } = await supabase.functions.invoke(
        'altitude-assessment',
        {
          body: {
            action: 'submit_answer',
            payload: {
              session_id: sessionId,
              question_id: currentQuestion.id,
              answer_id: answerId,
            },
          },
        }
      );

      if (functionError) throw functionError;

      if (data.is_complete) {
        // Complete assessment
        await completeAssessment();
      } else {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setIsLoading(false);
    }
  };

  const completeAssessment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: functionError } = await supabase.functions.invoke(
        'altitude-assessment',
        {
          body: {
            action: 'complete',
            payload: {
              session_id: sessionId,
            },
          },
        }
      );

      if (functionError) throw functionError;

      // Navigate to results
      router.push(`/altitude-results?session=${sessionId}`);
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to complete assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goNext = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer);
    }
  };

  return {
    sessionId,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    isLoading,
    error,
    canGoBack: currentQuestionIndex > 0,
    canGoNext: !!selectedAnswer,
    isLastQuestion: currentQuestionIndex === questions.length - 1,
    startAssessment,
    submitAnswer,
    goBack,
    goNext,
    setAnswer,
  };
}
```

---

### Store: altitudeQuizStore

```typescript
// store/altitudeQuizStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Question {
  id: string;
  question_text: string;
  quiz_answers: Array<{
    id: string;
    answer_text: string;
    level_score: number;
  }>;
}

interface AltitudeQuizStore {
  sessionId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>; // question_id -> answer_id

  setSessionId: (id: string) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answerId: string) => void;
  reset: () => void;
}

export const useAltitudeQuizStore = create<AltitudeQuizStore>()(
  persist(
    (set) => ({
      sessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},

      setSessionId: (id) => set({ sessionId: id }),
      setQuestions: (questions) => set({ questions }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, answerId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answerId },
        })),
      reset: () =>
        set({
          sessionId: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
        }),
    }),
    {
      name: 'altitude-quiz-storage',
    }
  )
);
```

---

### Page: altitude-assessment.tsx

```tsx
// pages/altitude-assessment.tsx

import { useState, useEffect } from 'react';
import { useAltitudeQuiz } from '@/hooks/useAltitudeQuiz';
import { QuizStart } from '@/components/altitude/QuizStart';
import { QuizQuestion } from '@/components/altitude/QuizQuestion';
import { QuizProgress } from '@/components/altitude/QuizProgress';
import { QuizNavigation } from '@/components/altitude/QuizNavigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AltitudeAssessmentPage() {
  const {
    sessionId,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    isLoading,
    error,
    canGoBack,
    canGoNext,
    isLastQuestion,
    startAssessment,
    goBack,
    goNext,
    setAnswer,
  } = useAltitudeQuiz();

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setHasStarted(true);
    }
  }, [sessionId]);

  const handleStart = async () => {
    await startAssessment();
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="container py-12">
        <QuizStart onStart={handleStart} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="container py-12">
      {error && (
        <Alert variant="destructive" className="max-w-3xl mx-auto mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentQuestion && (
        <>
          <QuizProgress
            current={currentQuestionIndex + 1}
            total={totalQuestions}
          />

          <QuizQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={(answerId) => setAnswer(currentQuestion.id, answerId)}
          />

          <QuizNavigation
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            onBack={goBack}
            onNext={goNext}
            isLastQuestion={isLastQuestion}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] QuizStart renders correctly
- [ ] QuizQuestion displays all answers
- [ ] Answer selection updates state
- [ ] Progress bar calculates percentage correctly
- [ ] Navigation buttons enable/disable appropriately

### Integration Tests
- [ ] Full quiz flow (start → answer 15 → complete)
- [ ] Back button works correctly
- [ ] Session persistence (refresh mid-quiz)
- [ ] Error recovery (network failure)
- [ ] Edge case: rapid clicking doesn't double-submit

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces progress
- [ ] Focus management correct
- [ ] Color contrast meets WCAG AA

### Performance Tests
- [ ] Initial load <2s
- [ ] Question transitions smooth (60fps)
- [ ] No layout shift during load

---

## 📚 Reference

- **Shadcn UI Components:** https://ui.shadcn.com/
- **Zustand Docs:** https://docs.pmnd.rs/zustand/getting-started/introduction
- **Supabase Functions:** https://supabase.com/docs/guides/functions/invoke

---

## ✅ Definition of Done

- [ ] All components created and styled
- [ ] Quiz flow works end-to-end
- [ ] Mobile responsive (tested on 3 devices)
- [ ] Accessibility tested (keyboard + screen reader)
- [ ] State persists on refresh
- [ ] Error handling comprehensive
- [ ] Testing checklist completed
- [ ] Code review passed

---

## 🚀 Next Steps

After this story:
- **Story 049:** Results Page with Radar Chart (displays altitude profile)
- **Story 050:** Scoring Algorithm Enhancement (from simple to sophisticated)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** Story 047 (Edge Function)
**Blocks:** Story 049 (Results Page)

— River, removendo obstáculos 🌊
