# Story 049: Results Page with Radar Chart

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** HIGH
> **Estimate:** 8 points
> **Assignee:** @dev
> **Status:** READY
> **Dependencies:** Story 047 (Edge Function), Story 048 (Quiz UI)

---

## 📋 Story

**As a** user
**I want** to see my cognitive altitude results visualized beautifully
**So that** I understand my profile and feel motivated to improve

---

## 🎯 Acceptance Criteria

### Results Display
- [ ] Overall altitude score displayed prominently (e.g., "2.7/4.0")
- [ ] Tier classification shown ("First Tier" or "Second Tier")
- [ ] Radar chart shows all 7 domain levels
- [ ] Domain breakdown list with level per domain
- [ ] Confidence scores displayed per domain
- [ ] Personalized insights based on results

### Visualization Requirements
- [ ] Radar chart is interactive (hover shows values)
- [ ] Chart is responsive (mobile + desktop)
- [ ] Smooth animations on load
- [ ] Color-coded by tier (warm for first, cool for second)
- [ ] Accessible alternative (table view for screen readers)

### User Actions
- [ ] "View Dashboard" CTA to altitude tracker
- [ ] "Retake Assessment" option (with rate limit message)
- [ ] "Share Results" functionality (optional)
- [ ] "Download PDF" option (optional for v2)

### Performance
- [ ] Page loads in <2s
- [ ] Chart renders in <1s
- [ ] No layout shift during load

---

## 📐 Technical Specification

### File Structure

```
apps/web/src/
├── pages/
│   └── altitude-results.tsx           # Main results page
├── components/
│   └── altitude/
│       ├── ResultsOverview.tsx        # Overall score card
│       ├── ResultsRadarChart.tsx      # Recharts radar
│       ├── ResultsDomainList.tsx      # Domain breakdown
│       ├── ResultsInsights.tsx        # Personalized insights
│       └── ResultsActions.tsx         # CTAs
└── lib/
    └── altitude-utils.ts              # Helper functions
```

---

### Component: ResultsOverview

```tsx
// components/altitude/ResultsOverview.tsx

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResultsOverviewProps {
  overallAltitude: number;
  tier: 'first' | 'second';
}

export function ResultsOverview({ overallAltitude, tier }: ResultsOverviewProps) {
  const tierColor = tier === 'second' ? 'bg-blue-500' : 'bg-amber-500';
  const tierLabel = tier === 'second' ? 'Second Tier' : 'First Tier';

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
      <Badge className={`${tierColor} text-white mb-4`}>{tierLabel}</Badge>

      <h1 className="text-5xl font-bold mb-2">
        {overallAltitude.toFixed(1)}
        <span className="text-2xl text-muted-foreground">/4.0</span>
      </h1>

      <p className="text-lg text-muted-foreground mb-6">
        Sua Altitude Cognitiva Geral
      </p>

      <div className="max-w-md mx-auto">
        {tier === 'first' ? (
          <p className="text-sm leading-relaxed">
            Você está no <strong>First Tier</strong>, onde a maioria das pessoas
            opera. Foco em desenvolver síntese através de múltiplas perspectivas
            para alcançar Second Tier.
          </p>
        ) : (
          <p className="text-sm leading-relaxed">
            Parabéns! Você alcançou o <strong>Second Tier</strong>, demonstrando
            capacidade de integrar contradições e criar perspectivas originais.
          </p>
        )}
      </div>
    </Card>
  );
}
```

---

### Component: ResultsRadarChart

```tsx
// components/altitude/ResultsRadarChart.tsx

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface DomainLevel {
  domain_id: string;
  current_level: number;
  confidence_score: number;
  cognitive_domains: {
    name: string;
    icon: string;
  };
}

interface ResultsRadarChartProps {
  domainLevels: DomainLevel[];
}

export function ResultsRadarChart({ domainLevels }: ResultsRadarChartProps) {
  // Transform data for Recharts
  const chartData = domainLevels.map((dl) => ({
    domain: dl.cognitive_domains.name,
    level: dl.current_level,
    fullMark: 4,
  }));

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Perfil Cognitivo por Domínio
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 4]}
            tickCount={5}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Radar
            name="Nível"
            dataKey="level"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          L0-L1: Instinctual/Conformist
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          L2: Individualist
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          L3-L4: Synthesist/Generative
        </div>
      </div>
    </Card>
  );
}
```

---

### Component: ResultsDomainList

```tsx
// components/altitude/ResultsDomainList.tsx

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DomainLevel {
  domain_id: string;
  current_level: number;
  confidence_score: number;
  cognitive_domains: {
    name: string;
    icon: string;
    description: string;
  };
}

interface ResultsDomainListProps {
  domainLevels: DomainLevel[];
}

const LEVEL_NAMES = {
  0: 'Instinctual',
  1: 'Conformist',
  2: 'Individualist',
  3: 'Synthesist',
  4: 'Generative',
};

export function ResultsDomainList({ domainLevels }: ResultsDomainListProps) {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Breakdown por Domínio</h2>

      <div className="space-y-6">
        {domainLevels.map((dl) => {
          const levelName = LEVEL_NAMES[dl.current_level as keyof typeof LEVEL_NAMES];
          const percentage = (dl.current_level / 4) * 100;

          return (
            <div key={dl.domain_id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dl.cognitive_domains.icon}</span>
                  <div>
                    <p className="font-semibold">{dl.cognitive_domains.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Nível {dl.current_level} - {levelName}
                    </p>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Confiança: {Math.round(dl.confidence_score * 100)}%</span>
                        <Info className="w-4 h-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{dl.cognitive_domains.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

---

### Component: ResultsInsights

```tsx
// components/altitude/ResultsInsights.tsx

import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Lock } from 'lucide-react';

interface ResultsInsightsProps {
  insights: string[];
  tier: 'first' | 'second';
}

export function ResultsInsights({ insights, tier }: ResultsInsightsProps) {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Insights Personalizados</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <p className="text-sm leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>

      {tier === 'first' && (
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold mb-2">Próximo Passo: Alcançar Second Tier</p>
              <p className="text-sm text-muted-foreground mb-4">
                Para transcender para Second Tier (L3+), você precisa desenvolver
                a capacidade de integrar perspectivas contraditórias sem colapsar
                em defensividade.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                <span>Use a ferramenta "4D Thinking" para praticar síntese</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tier === 'second' && (
        <div className="mt-8 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-semibold mb-2">Second Tier Unlocked 🎉</p>
              <p className="text-sm text-muted-foreground">
                Você desbloqueou acesso aos agentes de maior altitude (Tier 3)
                e à ferramenta "4D Thinking" avançada.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
```

---

### Component: ResultsActions

```tsx
// components/altitude/ResultsActions.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, RefreshCw, Share2 } from 'lucide-react';
import { useRouter } from 'next/router';

interface ResultsActionsProps {
  canRetake: boolean;
  onRetake: () => void;
}

export function ResultsActions({ canRetake, onRetake }: ResultsActionsProps) {
  const router = useRouter();

  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-4">Próximas Ações</h2>

      <div className="space-y-3">
        <Button
          className="w-full justify-start"
          size="lg"
          onClick={() => router.push('/altitude-dashboard')}
        >
          <BarChart3 className="w-5 h-5 mr-3" />
          Ver Dashboard Completo
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          size="lg"
          onClick={onRetake}
          disabled={!canRetake}
        >
          <RefreshCw className="w-5 h-5 mr-3" />
          {canRetake ? 'Refazer Assessment' : 'Refazer (disponível em 1h)'}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          size="lg"
          onClick={() => {
            // TODO: Implement share functionality
            console.log('Share functionality coming soon');
          }}
        >
          <Share2 className="w-5 h-5 mr-3" />
          Compartilhar Resultados
        </Button>
      </div>
    </Card>
  );
}
```

---

### Page: altitude-results.tsx

```tsx
// pages/altitude-results.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { ResultsOverview } from '@/components/altitude/ResultsOverview';
import { ResultsRadarChart } from '@/components/altitude/ResultsRadarChart';
import { ResultsDomainList } from '@/components/altitude/ResultsDomainList';
import { ResultsInsights } from '@/components/altitude/ResultsInsights';
import { ResultsActions } from '@/components/altitude/ResultsActions';
import { Loader2 } from 'lucide-react';

interface AssessmentResults {
  overall_altitude: number;
  tier: 'first' | 'second';
  domain_levels: any[];
  insights: string[];
  profile: any;
}

export default function AltitudeResultsPage() {
  const router = useRouter();
  const { session } = router.query;

  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    fetchResults();
  }, [session]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch session results
      const { data: sessionData, error: sessionError } = await supabase
        .from('assessment_sessions')
        .select('results, completed_at')
        .eq('id', session)
        .eq('user_id', user.id)
        .single();

      if (sessionError) throw sessionError;
      if (!sessionData.completed_at) throw new Error('Assessment not completed');

      // Fetch full profile with domain levels
      const { data: profileData, error: profileError } = await supabase
        .from('user_cognitive_profiles')
        .select(
          `
          *,
          user_domain_levels (
            *,
            cognitive_domains (name, icon, description)
          )
        `
        )
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      setResults({
        overall_altitude: sessionData.results.overall_altitude,
        tier: sessionData.results.tier,
        domain_levels: profileData.user_domain_levels,
        insights: sessionData.results.insights || [],
        profile: profileData,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = async () => {
    // Check rate limit (max 1 per hour)
    const { data: recentSessions } = await supabase
      .from('assessment_sessions')
      .select('completed_at')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .gte('completed_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order('completed_at', { ascending: false })
      .limit(1);

    if (recentSessions && recentSessions.length > 0) {
      alert('Você só pode refazer o assessment uma vez por hora.');
      return;
    }

    router.push('/altitude-assessment');
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <p className="text-lg text-destructive mb-4">
            {error || 'Resultados não encontrados'}
          </p>
          <Button onClick={() => router.push('/altitude-assessment')}>
            Fazer Assessment
          </Button>
        </div>
      </div>
    );
  }

  const canRetake = true; // Will be calculated based on rate limit

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-4xl mx-auto">
        <ResultsOverview
          overallAltitude={results.overall_altitude}
          tier={results.tier}
        />
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
        <ResultsRadarChart domainLevels={results.domain_levels} />
        <ResultsDomainList domainLevels={results.domain_levels} />
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ResultsInsights insights={results.insights} tier={results.tier} />
        </div>
        <div>
          <ResultsActions canRetake={canRetake} onRetake={handleRetake} />
        </div>
      </div>
    </div>
  );
}
```

---

### Utility Functions

```typescript
// lib/altitude-utils.ts

export function getLevelName(level: number): string {
  const names: Record<number, string> = {
    0: 'Instinctual',
    1: 'Conformist',
    2: 'Individualist',
    3: 'Synthesist',
    4: 'Generative',
  };
  return names[level] || 'Unknown';
}

export function getLevelColor(level: number): string {
  if (level <= 1) return 'red';
  if (level === 2) return 'amber';
  return 'blue';
}

export function getTierFromAltitude(altitude: number): 'first' | 'second' {
  return altitude >= 3.0 ? 'second' : 'first';
}

export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] ResultsOverview renders correct tier
- [ ] Radar chart displays all 7 domains
- [ ] Domain list shows correct levels
- [ ] Insights render correctly
- [ ] Actions CTAs work

### Integration Tests
- [ ] Full flow: complete quiz → see results
- [ ] Results persist on refresh
- [ ] Retake rate limit enforced
- [ ] Dashboard navigation works

### Visual Regression Tests
- [ ] Chart renders correctly on mobile
- [ ] Layout doesn't shift during load
- [ ] Colors match tier (first vs second)

### Accessibility Tests
- [ ] Screen reader announces scores
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Alternative text for chart (table view)

---

## 📚 Reference

- **Recharts Docs:** https://recharts.org/en-US/api/RadarChart
- **Shadcn UI:** https://ui.shadcn.com/
- **Accessibility (Charts):** https://www.w3.org/WAI/tutorials/charts/

---

## ✅ Definition of Done

- [ ] All components created and styled
- [ ] Radar chart works (responsive + interactive)
- [ ] Domain breakdown displays correctly
- [ ] Insights personalized based on tier
- [ ] CTAs functional (dashboard, retake, share)
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Testing checklist completed

---

## 🚀 Next Steps

After this story:
- **Story 050:** Scoring Algorithm Enhancement (sophisticated altitude calculation)
- **Story 051:** Quiz Content Creation (15 questions × 7 domains)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** Story 047 (Edge Function), Story 048 (Quiz UI)
**Blocks:** Phase 2 (Dashboard stories)

— River, removendo obstáculos 🌊
