# Story 050: Scoring Algorithm Enhancement

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** MEDIUM
> **Estimate:** 5 points
> **Assignee:** @dev
> **Status:** READY
> **Dependencies:** Story 047 (Edge Function - simple algorithm in place)

---

## 📋 Story

**As a** product owner
**I want** a sophisticated scoring algorithm that accurately measures cognitive altitude
**So that** users receive meaningful and credible results

---

## 🎯 Acceptance Criteria

### Algorithm Requirements
- [ ] Move beyond simple averaging to weighted scoring
- [ ] Account for consistency across domains (altitude concept)
- [ ] Calculate confidence scores based on answer patterns
- [ ] Detect and flag suspicious patterns (all same level, random)
- [ ] Generate personalized insights based on profile

### Scoring Logic
- [ ] Domain-level calculation with confidence weighting
- [ ] Overall altitude considers cross-domain consistency
- [ ] Tier classification (First Tier <3.0, Second Tier ≥3.0)
- [ ] Edge case handling (incomplete data, outliers)
- [ ] Validation against expected distributions

### Insights Generation
- [ ] Identify strongest domain (highest level)
- [ ] Identify growth opportunity (lowest level)
- [ ] Detect altitude blockers (low domains preventing high altitude)
- [ ] Suggest next steps based on profile
- [ ] Tier-specific messaging

### Performance
- [ ] Scoring completes in <1s
- [ ] No blocking operations (pure calculation)
- [ ] Deterministic (same answers = same results)
- [ ] Unit testable with fixtures

---

## 📐 Technical Specification

### Current Implementation (Story 047)

```typescript
// Simple average algorithm (placeholder)
async function calculateAltitude(supabase, answers: Record<string, string>) {
  // Group scores by domain
  // Calculate average per domain
  // Calculate overall altitude as domain average
  // Generate basic insights
}
```

**Problems:**
1. Doesn't account for cross-domain consistency (altitude concept)
2. No confidence scoring
3. Basic insights (not personalized)
4. Doesn't detect suspicious patterns

---

### Enhanced Implementation

#### File Structure

```
supabase/functions/altitude-assessment/
└── lib/
    ├── scoring-engine.ts          # Main scoring logic
    ├── confidence-calculator.ts    # Confidence scoring
    ├── insights-generator.ts       # Personalized insights
    └── types.ts                    # TypeScript interfaces
```

---

### Scoring Engine (Enhanced)

```typescript
// supabase/functions/altitude-assessment/lib/scoring-engine.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { calculateConfidence } from './confidence-calculator';
import { generateInsights } from './insights-generator';

interface AnswerData {
  id: string;
  level_score: number;
  question_id: string;
  quiz_questions: {
    domain_id: string;
  };
}

interface DomainLevel {
  domain_id: string;
  level: number;
  confidence: number;
  raw_scores: number[];
  evidence: number[];
}

interface ScoringResult {
  overall_altitude: number;
  domain_levels: DomainLevel[];
  insights: string[];
  confidence_score: number;
  flags: string[];
}

export async function calculateAltitude(
  supabase: SupabaseClient,
  answers: Record<string, string>
): Promise<ScoringResult> {
  // 1. Fetch answer data with domain info
  const answerIds = Object.values(answers);

  const { data: answerData, error } = await supabase
    .from('quiz_answers')
    .select(
      `
      id,
      level_score,
      question_id,
      quiz_questions!inner (domain_id)
    `
    )
    .in('id', answerIds);

  if (error || !answerData) {
    throw new Error('Failed to fetch answer data');
  }

  // 2. Group scores by domain
  const domainScores: Record<string, number[]> = {};

  for (const answer of answerData) {
    const domainId = answer.quiz_questions.domain_id;
    if (!domainScores[domainId]) {
      domainScores[domainId] = [];
    }
    domainScores[domainId].push(answer.level_score);
  }

  // 3. Calculate domain levels with confidence
  const domainLevels: DomainLevel[] = Object.entries(domainScores).map(
    ([domainId, scores]) => {
      const weightedAvg = calculateWeightedAverage(scores);
      const level = Math.round(weightedAvg);
      const confidence = calculateConfidence(scores, weightedAvg);

      return {
        domain_id: domainId,
        level: level,
        confidence: confidence,
        raw_scores: scores,
        evidence: scores,
      };
    }
  );

  // 4. Calculate overall altitude (weighted by confidence)
  const overallAltitude = calculateOverallAltitude(domainLevels);

  // 5. Calculate cross-domain consistency (altitude concept)
  const consistencyScore = calculateConsistency(domainLevels);

  // 6. Detect suspicious patterns
  const flags = detectSuspiciousPatterns(domainLevels, answerData);

  // 7. Generate personalized insights
  const insights = generateInsights(domainLevels, overallAltitude, consistencyScore);

  return {
    overall_altitude: parseFloat(overallAltitude.toFixed(2)),
    domain_levels: domainLevels,
    insights: insights,
    confidence_score: consistencyScore,
    flags: flags,
  };
}

/**
 * Calculate weighted average favoring consistent patterns
 */
function calculateWeightedAverage(scores: number[]): number {
  if (scores.length === 0) return 0;

  // Simple average for now (can enhance with modal weighting)
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const avg = sum / scores.length;

  // If scores are very consistent, bias toward mode
  const mode = calculateMode(scores);
  const variance = calculateVariance(scores);

  if (variance < 0.5) {
    // Low variance = high consistency = trust mode more
    return mode * 0.7 + avg * 0.3;
  }

  return avg;
}

/**
 * Calculate overall altitude (weighted by domain confidence)
 */
function calculateOverallAltitude(domainLevels: DomainLevel[]): number {
  if (domainLevels.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const dl of domainLevels) {
    const weight = dl.confidence;
    weightedSum += dl.level * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calculate cross-domain consistency (altitude concept)
 * High altitude = consistent thinking across domains
 */
function calculateConsistency(domainLevels: DomainLevel[]): number {
  if (domainLevels.length < 2) return 1.0;

  const levels = domainLevels.map((dl) => dl.level);
  const avg = levels.reduce((sum, l) => sum + l, 0) / levels.length;

  // Calculate variance
  const variance =
    levels.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / levels.length;

  const stdDev = Math.sqrt(variance);

  // Low stdDev = high consistency
  // Normalize to 0-1 scale (assume max stdDev = 2)
  const consistency = Math.max(0, 1 - stdDev / 2);

  return parseFloat(consistency.toFixed(2));
}

/**
 * Detect suspicious answer patterns
 */
function detectSuspiciousPatterns(
  domainLevels: DomainLevel[],
  answerData: AnswerData[]
): string[] {
  const flags: string[] = [];

  // Flag 1: All answers same level
  const allLevels = answerData.map((a) => a.level_score);
  const uniqueLevels = new Set(allLevels);

  if (uniqueLevels.size === 1) {
    flags.push('all_same_level');
  }

  // Flag 2: Perfect score (all L4)
  if (allLevels.every((l) => l === 4)) {
    flags.push('perfect_score');
  }

  // Flag 3: Very low variance (may indicate not reading questions)
  const variance = calculateVariance(allLevels);
  if (variance < 0.3 && uniqueLevels.size <= 2) {
    flags.push('low_variance');
  }

  // Flag 4: Extreme inconsistency (may indicate random)
  const consistency = calculateConsistency(domainLevels);
  if (consistency < 0.3) {
    flags.push('high_inconsistency');
  }

  return flags;
}

/**
 * Helper: Calculate mode (most frequent value)
 */
function calculateMode(numbers: number[]): number {
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  let mode = numbers[0];

  for (const num of numbers) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      mode = num;
    }
  }

  return mode;
}

/**
 * Helper: Calculate variance
 */
function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const variance =
    numbers.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / numbers.length;

  return variance;
}
```

---

### Confidence Calculator

```typescript
// supabase/functions/altitude-assessment/lib/confidence-calculator.ts

/**
 * Calculate confidence score for a domain level
 * Based on:
 * 1. Consistency of answers (low variance = high confidence)
 * 2. Number of questions (more questions = higher confidence)
 * 3. Proximity to boundaries (e.g., 2.9 vs 3.1 = lower confidence)
 */
export function calculateConfidence(scores: number[], average: number): number {
  if (scores.length === 0) return 0;

  // Factor 1: Consistency (variance)
  const variance =
    scores.reduce((sum, s) => sum + Math.pow(s - average, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Low stdDev = high consistency = high confidence
  const consistencyFactor = Math.max(0, 1 - stdDev / 2);

  // Factor 2: Sample size (more questions = higher confidence)
  const sampleSizeFactor = Math.min(1, scores.length / 5); // Assume 5 questions = max

  // Factor 3: Boundary proximity
  const rounded = Math.round(average);
  const distance = Math.abs(average - rounded);

  // Close to boundary (e.g., 2.9 or 3.1) = lower confidence
  const boundaryFactor = 1 - distance * 2;

  // Weighted combination
  const confidence =
    consistencyFactor * 0.5 + sampleSizeFactor * 0.3 + boundaryFactor * 0.2;

  return Math.max(0.5, Math.min(1.0, confidence));
}
```

---

### Insights Generator

```typescript
// supabase/functions/altitude-assessment/lib/insights-generator.ts

interface DomainLevel {
  domain_id: string;
  level: number;
  confidence: number;
}

/**
 * Generate personalized insights based on cognitive profile
 */
export function generateInsights(
  domainLevels: DomainLevel[],
  overallAltitude: number,
  consistency: number
): string[] {
  const insights: string[] = [];

  // Insight 1: Overall altitude
  insights.push(
    `Sua altitude cognitiva geral é ${overallAltitude.toFixed(1)}/4.0, ${
      overallAltitude >= 3.0 ? 'Second Tier' : 'First Tier'
    }.`
  );

  // Insight 2: Strongest domain
  const strongest = domainLevels.reduce((max, dl) =>
    dl.level > max.level ? dl : max
  );
  insights.push(`Seu domínio mais forte está no nível ${strongest.level}.`);

  // Insight 3: Growth opportunity
  const weakest = domainLevels.reduce((min, dl) =>
    dl.level < min.level ? dl : min
  );

  if (weakest.level < strongest.level - 1) {
    insights.push(
      `Maior oportunidade de crescimento: desenvolver domínio no nível ${weakest.level} para ${weakest.level + 1}.`
    );
  }

  // Insight 4: Altitude blocker
  if (overallAltitude < 3.0 && strongest.level >= 3) {
    insights.push(
      `Você tem potencial para Second Tier, mas domínios em níveis baixos estão bloqueando sua altitude geral.`
    );
  }

  // Insight 5: Consistency
  if (consistency >= 0.7) {
    insights.push(
      `Alta consistência entre domínios (${Math.round(
        consistency * 100
      )}%) indica pensamento integrado.`
    );
  } else if (consistency < 0.4) {
    insights.push(
      `Baixa consistência entre domínios sugere desenvolvimento desigual. Foco em equilibrar altitudes pode acelerar crescimento.`
    );
  }

  // Insight 6: Next steps (tier-specific)
  if (overallAltitude >= 3.0) {
    insights.push(
      `Próximo passo: Use a ferramenta "4D Thinking" para praticar síntese em nível L4 (Generative).`
    );
  } else if (overallAltitude >= 2.0) {
    insights.push(
      `Próximo passo: Desenvolva capacidade de integrar perspectivas contraditórias para alcançar L3 (Synthesist).`
    );
  } else {
    insights.push(
      `Próximo passo: Fortaleça pensamento crítico e construção de modelos mentais próprios (L2).`
    );
  }

  return insights;
}
```

---

## 🧪 Testing Checklist

### Unit Tests (Fixtures)

```typescript
// __tests__/scoring-engine.test.ts

import { calculateAltitude } from '../lib/scoring-engine';

describe('Scoring Engine', () => {
  it('calculates correct altitude for balanced profile', () => {
    const answers = {
      q1: 'a1', // L2
      q2: 'a2', // L2
      q3: 'a3', // L2
      // ... all L2
    };

    const result = calculateAltitude(mockSupabase, answers);
    expect(result.overall_altitude).toBeCloseTo(2.0, 1);
  });

  it('detects altitude blocker (high domain blocked by low)', () => {
    // Domain 1: L4, Domain 2: L1, Domain 3: L1
    // Expected: Overall altitude ~2.0, with blocker insight
  });

  it('flags suspicious patterns (all same level)', () => {
    // All answers L3
    // Expected: flag 'all_same_level'
  });

  it('weights confidence correctly (consistent vs inconsistent)', () => {
    // Consistent: [3, 3, 3, 3] → high confidence
    // Inconsistent: [1, 2, 3, 4] → low confidence
  });
});
```

### Integration Tests
- [ ] Run with real quiz data (15 questions × 7 domains)
- [ ] Verify results match expected profiles
- [ ] Test edge cases (1 domain, 7 domains, incomplete)
- [ ] Performance: <1s for 15 questions

### Validation Tests
- [ ] Run against 10+ real user profiles
- [ ] Survey: "Does this result feel accurate?" (target: 75%+ yes)
- [ ] Compare with manual scoring (expert review)

---

## 📚 Reference

- **Cognitive Altitude Concept:** `00_Codex/Knowledge/Cognitive_Development/Thinking_Levels_Framework_LX_Synthesis.md`
- **Statistical Methods:** Mean, Mode, Variance, Standard Deviation
- **Confidence Intervals:** Bayesian approach for small sample sizes

---

## ✅ Definition of Done

- [ ] Enhanced scoring algorithm implemented
- [ ] Confidence calculation accurate
- [ ] Insights generator personalized
- [ ] Suspicious pattern detection works
- [ ] Unit tests pass (>90% coverage)
- [ ] Integration tests pass
- [ ] Performance <1s
- [ ] Validation: 75%+ users agree with results

---

## 🚀 Next Steps

After this story:
- **Story 051:** Quiz Content Creation (15 questions crafted for accuracy)
- **Story 052:** Altitude Dashboard (Phase 2)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** Story 047 (Simple algorithm in place)
**Blocks:** Story 051 (Content needs accurate scoring)

— River, removendo obstáculos 🌊
