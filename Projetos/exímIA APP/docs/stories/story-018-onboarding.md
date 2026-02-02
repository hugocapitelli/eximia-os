# Story EXIMIA-018: Onboarding Flow

**Story ID:** EXIMIA-018
**Epic:** EXIMIA-EPIC-007 (User Experience)
**Sprint:** 5
**Pontos:** 8
**Prioridade:** P2 (Médio)
**Depende de:** EXIMIA-010 (Auth Pages), EXIMIA-007 (Templates)

---

## User Story

**Como** novo usuário do exímIA APP,
**Quero** ser guiado através de uma configuração inicial,
**Para que** eu entenda o app e configure minhas preferências.

---

## Acceptance Criteria

### Step 1: Welcome
- [ ] Animação de boas-vindas
- [ ] Explicação do que é o ExímIA
- [ ] CTA para começar

### Step 2: Profile Setup
- [ ] Nome
- [ ] Avatar (opcional)
- [ ] Área de atuação

### Step 3: Goals
- [ ] Pergunta: "O que você quer alcançar?"
- [ ] Opções pré-definidas (checkboxes)
- [ ] Opção para pular

### Step 4: First Goal
- [ ] Criar primeira meta (simplificada)
- [ ] Sugestões baseadas em step 3
- [ ] Opção para pular

### Step 5: First Habit
- [ ] Criar primeiro hábito (simplificado)
- [ ] Sugestões comuns
- [ ] Opção para pular

### Step 6: Done
- [ ] Parabéns + animação
- [ ] Resumo do que foi criado
- [ ] CTA para ir ao dashboard

---

## Technical Details

### Onboarding State

```typescript
// lib/actions/onboarding.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface OnboardingData {
  currentStep: number;
  completed: boolean;
  profile?: {
    full_name: string;
    avatar_url?: string;
    area_of_work?: string;
  };
  goals?: string[];
  firstGoal?: { title: string; timeframe: string };
  firstHabit?: { title: string; frequency: string };
}

export async function getOnboardingState(): Promise<OnboardingData> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check user metadata for onboarding state
  const metadata = user.user_metadata || {};

  return {
    currentStep: metadata.onboarding_step || 1,
    completed: metadata.onboarding_completed || false,
    profile: metadata.profile,
    goals: metadata.goals,
    firstGoal: metadata.first_goal,
    firstHabit: metadata.first_habit,
  };
}

export async function updateOnboardingStep(
  step: number,
  data?: Partial<OnboardingData>
) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      onboarding_step: step,
      ...(data?.profile && { profile: data.profile }),
      ...(data?.goals && { goals: data.goals }),
      ...(data?.firstGoal && { first_goal: data.firstGoal }),
      ...(data?.firstHabit && { first_habit: data.firstHabit }),
    },
  });

  if (error) throw new Error(error.message);
}

export async function completeOnboarding() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const metadata = user.user_metadata || {};

  // Create first goal if provided
  if (metadata.first_goal) {
    const { createGoal } = await import("@/lib/actions/journey");
    await createGoal({
      title: metadata.first_goal.title,
      timeframe: metadata.first_goal.timeframe,
      status: "active",
    });
  }

  // Create first habit if provided
  if (metadata.first_habit) {
    const { createHabit } = await import("@/lib/actions/journey");
    await createHabit({
      title: metadata.first_habit.title,
      frequency: metadata.first_habit.frequency,
    });
  }

  // Update profile
  if (metadata.profile) {
    await supabase.auth.updateUser({
      data: {
        full_name: metadata.profile.full_name,
        avatar_url: metadata.profile.avatar_url,
        area_of_work: metadata.profile.area_of_work,
        onboarding_completed: true,
      },
    });
  }

  redirect("/dashboard");
}
```

### Onboarding Pages

```tsx
// app/(onboarding)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { OnboardingLayout } from "@/components/templates/OnboardingLayout";
import { updateOnboardingStep, completeOnboarding } from "@/lib/actions/onboarding";

import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { ProfileStep } from "@/components/onboarding/ProfileStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { FirstGoalStep } from "@/components/onboarding/FirstGoalStep";
import { FirstHabitStep } from "@/components/onboarding/FirstHabitStep";
import { DoneStep } from "@/components/onboarding/DoneStep";

const TOTAL_STEPS = 6;

const stepTitles = [
  "Bem-vindo",
  "Seu Perfil",
  "Seus Objetivos",
  "Primeira Meta",
  "Primeiro Hábito",
  "Tudo Pronto!",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async (stepData?: any) => {
    if (stepData) {
      setData({ ...data, ...stepData });
    }

    if (currentStep < TOTAL_STEPS) {
      await updateOnboardingStep(currentStep + 1, stepData);
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await handleNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return <ProfileStep onNext={handleNext} data={data.profile} />;
      case 3:
        return <GoalsStep onNext={handleNext} data={data.goals} />;
      case 4:
        return <FirstGoalStep onNext={handleNext} suggestions={data.goals} />;
      case 5:
        return <FirstHabitStep onNext={handleNext} />;
      case 6:
        return <DoneStep onComplete={handleNext} data={data} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      stepTitle={stepTitles[currentStep - 1]}
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={currentStep < TOTAL_STEPS ? () => handleNext() : undefined}
      onSkip={currentStep > 1 && currentStep < TOTAL_STEPS ? handleSkip : undefined}
      isNextLoading={isLoading}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
```

### Step Components

```tsx
// components/onboarding/WelcomeStep.tsx
import { Button, Icon } from "@/components/ui";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 mx-auto bg-eximia-400 rounded-2xl flex items-center justify-center">
        <span className="text-4xl font-bold text-zinc-900">E</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Bem-vindo ao ExímIA OS
        </h1>
        <p className="text-lg text-zinc-400 max-w-md mx-auto">
          Seu sistema operacional pessoal para metas, hábitos e aprendizado contínuo.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
        <FeatureCard icon="Target" title="Metas" description="Defina e acompanhe suas metas" />
        <FeatureCard icon="Flame" title="Hábitos" description="Construa rotinas poderosas" />
        <FeatureCard icon="GraduationCap" title="Academy" description="Aprenda de forma estruturada" />
      </div>

      <Button size="lg" onClick={onNext}>
        Começar <Icon name="ArrowRight" size={18} />
      </Button>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-4 bg-zinc-900 rounded-xl">
      <Icon name={icon} size={24} className="text-eximia-400 mb-2" />
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-xs text-zinc-500">{description}</p>
    </div>
  );
}
```

```tsx
// components/onboarding/GoalsStep.tsx
import { useState } from "react";
import { Checkbox, Button } from "@/components/ui";

const GOAL_OPTIONS = [
  { id: "productivity", label: "Ser mais produtivo" },
  { id: "health", label: "Melhorar saúde e bem-estar" },
  { id: "learning", label: "Aprender novas habilidades" },
  { id: "business", label: "Crescer meu negócio" },
  { id: "finance", label: "Organizar finanças" },
  { id: "relationships", label: "Melhorar relacionamentos" },
];

export function GoalsStep({ onNext, data }: { onNext: (data: any) => void; data?: string[] }) {
  const [selected, setSelected] = useState<string[]>(data || []);

  const toggleGoal = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((g) => g !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">O que você quer alcançar?</h2>
        <p className="text-zinc-400 mt-2">Selecione tudo que se aplica</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {GOAL_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleGoal(option.id)}
            className={`
              p-4 rounded-xl text-left transition-all
              ${selected.includes(option.id)
                ? "bg-eximia-400/10 border-2 border-eximia-400"
                : "bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700"
              }
            `}
          >
            <span className={selected.includes(option.id) ? "text-eximia-400" : "text-white"}>
              {option.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => onNext({ goals: selected })} disabled={selected.length === 0}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
```

---

## Tasks

- [ ] Implementar onboarding state management
- [ ] Criar WelcomeStep
- [ ] Criar ProfileStep
- [ ] Criar GoalsStep
- [ ] Criar FirstGoalStep
- [ ] Criar FirstHabitStep
- [ ] Criar DoneStep
- [ ] Integrar com criação de Goal/Habit
- [ ] Adicionar middleware redirect para novo usuário
- [ ] Testar fluxo completo

---

## Definition of Done

- [ ] 6 steps funcionando
- [ ] Profile salvo
- [ ] Goal/Habit criados
- [ ] Redirect para dashboard
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── lib/
│   └── actions/
│       └── onboarding.ts         [CREATE]
└── components/
    └── onboarding/
        ├── WelcomeStep.tsx       [CREATE]
        ├── ProfileStep.tsx       [CREATE]
        ├── GoalsStep.tsx         [CREATE]
        ├── FirstGoalStep.tsx     [CREATE]
        ├── FirstHabitStep.tsx    [CREATE]
        ├── DoneStep.tsx          [CREATE]
        └── index.ts              [CREATE]

app/(onboarding)/
├── layout.tsx                    [CREATE]
└── onboarding/
    └── page.tsx                  [CREATE]

src/components/templates/
└── OnboardingLayout.tsx          [CREATE]

src/middleware.ts                 [MODIFY] (add onboarding redirect)
```

---

**Story criada por River (SM)**
**Data:** 2026-01-29
