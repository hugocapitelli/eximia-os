# Cognitive Altitude System - Architecture Plan

> **Arquitetura completa** para implementação do Sistema de Altitude Cognitiva na exímIA
> **Architect:** Aria (🏛️ @architect)
> **Data:** 2026-02-01
> **Status:** Architecture Proposal
> **Priority:** HIGH
> **Complexity:** HIGH (Cross-stack, multi-phase, novel feature)

---

## 📋 EXECUTIVE SUMMARY

### Vision

Transformar a exímIA de uma plataforma de produtividade em IA para a **primeira plataforma de elevação cognitiva** do mercado. Implementar sistema completo de assessment, tracking e desenvolvimento de altitude cognitiva baseado no framework de 5 dimensões de pensamento.

### Breakthrough Differentiation

```
Competidores: "Execute tasks faster with AI"
exímIA: "Think better. Your mind is how you interact with reality."
```

### Strategic Impact

| Impacto | Descrição |
|---------|-----------|
| **Market Position** | Categoria própria: "Cognitive Elevation Platform" |
| **User Stickiness** | Gamificação vertical cria lock-in emocional |
| **Product-Market Fit** | Ataca dor real: "smart but dumb" phenomenon |
| **Monetization** | Premium tier baseado em altitude unlock |
| **Data Moat** | Cognitive profiles únicos no mercado |

---

## 🎯 SYSTEM OVERVIEW

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                  COGNITIVE ALTITUDE SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  ASSESSMENT  │  │   TRACKING   │  │  DEVELOPMENT │         │
│  │    ENGINE    │  │    ENGINE    │  │    ENGINE    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
│                    ┌───────▼────────┐                           │
│                    │  ALTITUDE DB   │                           │
│                    │   (Supabase)   │                           │
│                    └───────┬────────┘                           │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                 │
│  ┌──────▼───────┐  ┌───────▼──────┐  ┌───────▼──────┐         │
│  │  FRONTEND    │  │   BACKEND    │  │   AGENTS     │         │
│  │  (Next.js)   │  │  (Supabase)  │  │  (Prompts)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5 Major Features

1. **Altitude Assessment Quiz** (MVP)
2. **Altitude Tracker Dashboard** (V1)
3. **4D Thinking Tool** (V1)
4. **Domain Unlock System** (V2)
5. **Agent Cognitive Profiles** (V2)

---

## 📐 PHASE 1: ASSESSMENT ENGINE (MVP)

### Goal

Identificar altitude cognitiva atual do usuário em 5-7 domínios principais.

### Database Schema

```sql
-- Cognitive Altitude Tables
CREATE TABLE cognitive_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cognitive_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INT NOT NULL CHECK (level_number >= 0 AND level_number <= 4),
  name TEXT NOT NULL, -- 'Instinctual', 'Conformist', etc.
  description TEXT,
  tier TEXT CHECK (tier IN ('first', 'second')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES cognitive_domains(id),
  level_target INT, -- Which level this question targets
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('scenario', 'reaction', 'belief')),
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES quiz_questions(id),
  answer_text TEXT NOT NULL,
  level_score INT, -- 0-4, which level this answer indicates
  reasoning TEXT, -- Why this answer indicates this level
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Overall metrics
  overall_altitude DECIMAL(3,2), -- Average altitude across domains

  -- Metadata
  assessment_version TEXT,
  last_assessment_at TIMESTAMPTZ,

  UNIQUE(user_id)
);

CREATE TABLE user_domain_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES cognitive_domains(id),
  current_level INT CHECK (current_level >= 0 AND current_level <= 4),
  confidence_score DECIMAL(3,2), -- 0-1, how confident we are
  evidence JSONB, -- Store quiz answers, behaviors, etc.
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(profile_id, domain_id)
);

CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES user_cognitive_profiles(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  answers JSONB, -- Store all answers for analysis
  results JSONB, -- Store calculated levels
  session_duration_seconds INT
);

-- Indexes
CREATE INDEX idx_user_profiles ON user_cognitive_profiles(user_id);
CREATE INDEX idx_domain_levels ON user_domain_levels(profile_id, domain_id);
CREATE INDEX idx_quiz_questions_domain ON quiz_questions(domain_id);
CREATE INDEX idx_assessment_sessions_user ON assessment_sessions(user_id);
```

### API Endpoints (Supabase Edge Functions)

```typescript
// /api/altitude/start-assessment
POST /altitude/start-assessment
Request: { user_id: string }
Response: {
  session_id: string,
  questions: QuizQuestion[],
  total_questions: number
}

// /api/altitude/submit-answer
POST /altitude/submit-answer
Request: {
  session_id: string,
  question_id: string,
  answer_id: string
}
Response: {
  next_question?: QuizQuestion,
  is_complete: boolean
}

// /api/altitude/complete-assessment
POST /altitude/complete-assessment
Request: { session_id: string }
Response: {
  profile: CognitiveProfile,
  domain_levels: DomainLevel[],
  overall_altitude: number,
  insights: string[]
}

// /api/altitude/get-profile
GET /altitude/profile/:user_id
Response: {
  profile: CognitiveProfile,
  domain_levels: DomainLevel[],
  history: AssessmentSession[]
}
```

### Frontend Components

```typescript
// components/altitude/AltitudeAssessmentQuiz.tsx
interface QuizProps {
  onComplete: (profile: CognitiveProfile) => void;
}

// State machine: welcome → questions → processing → results
// 15-20 questions, ~5-7 minutes total
// Progress bar with domain indicator
// Scenario-based questions (not academic)

// components/altitude/AltitudeResultsView.tsx
// Visual representation of altitude across domains
// Radar chart + altitude score
// Unlock suggestions
// Share/save results

// components/altitude/QuestionCard.tsx
// Scenario presentation
// 4 answer options (each maps to level)
// Visual feedback
// Timer (optional)
```

### Assessment Algorithm

```typescript
// lib/altitude/scoring-engine.ts

interface ScoringConfig {
  domains: DomainConfig[];
  weighting: WeightingStrategy;
}

function calculateAltitude(
  answers: QuizAnswer[],
  config: ScoringConfig
): CognitiveProfile {

  // 1. Group answers by domain
  const domainAnswers = groupByDomain(answers);

  // 2. Calculate level per domain
  const domainLevels = domainAnswers.map(domain => {
    const levelScores = countLevelResponses(domain.answers);
    const dominantLevel = findDominantLevel(levelScores);
    const confidence = calculateConfidence(levelScores);

    return {
      domain: domain.name,
      level: dominantLevel,
      confidence: confidence
    };
  });

  // 3. Calculate overall altitude (weighted average)
  const overallAltitude = calculateWeightedAverage(
    domainLevels,
    config.weighting
  );

  // 4. Identify blocking domains
  const blockers = identifyBlockers(domainLevels);

  // 5. Generate insights
  const insights = generateInsights(domainLevels, blockers);

  return {
    overall_altitude: overallAltitude,
    domain_levels: domainLevels,
    blocking_domains: blockers,
    insights: insights,
    tier: overallAltitude >= 3.0 ? 'second' : 'first'
  };
}
```

### Quiz Content Strategy

**7 Core Domains:**
1. Business/Strategy
2. Psychology/Self-Awareness
3. Health/Fitness
4. Relationships/EQ
5. Philosophy/Meaning
6. Learning/Growth
7. Creativity/Expression

**Question Types:**

```yaml
scenario_questions:
  example: |
    "Seu time discorda da sua decisão estratégica. Você:"
    a) "Sou o líder, minha decisão vale" (L1)
    b) "Explico minha lógica detalhadamente" (L2)
    c) "Busco entender a perspectiva deles primeiro" (L3)
    d) "Vejo essa tensão como oportunidade de algo novo emergir" (L4)

reaction_questions:
  example: |
    "Quando alguém critica sua abordagem, você:"
    a) "Me sinto atacado e defendo" (L1)
    b) "Argumento baseado em evidências" (L2)
    c) "Considero que pode haver verdade na crítica" (L3)
    d) "Fico curioso sobre que insight eu estava perdendo" (L4)

belief_questions:
  example: |
    "Sobre diferentes filosofias de vida:"
    a) "Existe uma certa, as outras estão erradas" (L1)
    b) "A minha é a mais lógica" (L2)
    c) "Todas têm verdades parciais" (L3)
    d) "Cada uma revela um aspecto único da realidade" (L4)
```

### MVP Scope

**In:**
- ✅ 15-20 questions covering 7 domains
- ✅ Scoring algorithm with confidence
- ✅ Results page with radar chart
- ✅ Basic insights ("You're strong in X, blocked by Y")
- ✅ Save to database
- ✅ Retake capability

**Out (V2):**
- ❌ Adaptive questioning (changes based on answers)
- ❌ Historical tracking
- ❌ Peer comparison
- ❌ Detailed development plan
- ❌ Integration with Academy content

---

## 📊 PHASE 2: ALTITUDE TRACKER DASHBOARD (V1)

### Goal

Visualização completa e gamificada da altitude cognitiva do usuário.

### Database Additions

```sql
-- Track progress over time
CREATE TABLE altitude_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id),
  overall_altitude DECIMAL(3,2),
  domain_levels JSONB,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  trigger_event TEXT, -- 'assessment', 'content_complete', 'milestone'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Unlock system
CREATE TABLE domain_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id),
  target_domain_id UUID REFERENCES cognitive_domains(id),
  target_level INT,
  required_domains JSONB, -- [{ domain_id, min_level }]
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE altitude_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('altitude', 'level', 'unlock', 'streak')),
  requirement_value JSONB,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id),
  achievement_id UUID REFERENCES altitude_achievements(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, achievement_id)
);
```

### Dashboard Components

```typescript
// components/altitude/AltitudeDashboard.tsx
interface DashboardProps {
  profileId: string;
}

// Layout:
// ┌─────────────────────────────────────────────────────┐
// │  OVERALL ALTITUDE: 2.3                              │
// │  ████████████████████░░░░░░░░░░ (Second Tier: 46%)  │
// └─────────────────────────────────────────────────────┘
// ┌──────────────────────┬──────────────────────────────┐
// │  DOMAIN BREAKDOWN    │  UNLOCK TREE                 │
// │  (Radar Chart)       │  (Skill Tree Visual)         │
// └──────────────────────┴──────────────────────────────┘
// ┌─────────────────────────────────────────────────────┐
// │  PROGRESS OVER TIME (Line Chart)                    │
// └─────────────────────────────────────────────────────┘
// ┌──────────────────────┬──────────────────────────────┐
// │  ACHIEVEMENTS        │  NEXT STEPS                  │
// └──────────────────────┴──────────────────────────────┘

// components/altitude/DomainRadarChart.tsx
// D3/Recharts radar chart
// 7 domains, L0-L4 scale
// Visual comparison with ideal target

// components/altitude/UnlockSkillTree.tsx
// Visual representation of unlock requirements
// Inspired by RPG skill trees
// Show: locked (gray), unlockable (yellow), unlocked (green)

interface UnlockNode {
  domain: string;
  currentLevel: number;
  targetLevel: number;
  requires: { domain: string; minLevel: number }[];
  isUnlocked: boolean;
  isUnlockable: boolean; // All requirements met
}

// components/altitude/ProgressChart.tsx
// Time-series chart of altitude over time
// Multiple lines (overall + key domains)
// Milestone markers

// components/altitude/AchievementBadges.tsx
// Badge collection
// Earned vs available
// Tooltips with unlock requirements

// components/altitude/NextStepsCard.tsx
// AI-generated suggestions based on:
// - Blocking domains
// - Unlock proximity
// - User interests
// Integration with Academy content
```

### Gamification Mechanics

```typescript
// lib/altitude/gamification-engine.ts

interface GamificationConfig {
  achievements: Achievement[];
  unlockRules: UnlockRule[];
  milestones: Milestone[];
}

// Achievement Types
const achievements: Achievement[] = [
  {
    id: 'first_tier_complete',
    name: 'Awakening',
    description: 'Reach Level 2 in all domains',
    icon: '🌅',
    requirement: { type: 'all_domains_min', value: 2 },
    tier: 'bronze'
  },
  {
    id: 'second_tier_entry',
    name: 'The Shift',
    description: 'Reach Second Tier (Altitude 3.0)',
    icon: '🚀',
    requirement: { type: 'altitude_min', value: 3.0 },
    tier: 'gold'
  },
  {
    id: 'polymath_unlock',
    name: 'Renaissance Mind',
    description: 'Reach Level 3 in 5+ domains',
    icon: '🎨',
    requirement: { type: 'domains_at_level', level: 3, count: 5 },
    tier: 'platinum'
  }
];

// Unlock Logic
function checkUnlocks(
  profile: CognitiveProfile
): DomainUnlock[] {

  return domains.map(domain => {
    const currentLevel = profile.getDomainLevel(domain);
    const targetLevel = currentLevel + 1;

    if (targetLevel > 4) return null; // Max level

    const requirements = getUnlockRequirements(domain, targetLevel);
    const meetsRequirements = requirements.every(req =>
      profile.getDomainLevel(req.domain) >= req.minLevel
    );

    return {
      domain: domain,
      currentLevel: currentLevel,
      targetLevel: targetLevel,
      requires: requirements,
      isUnlockable: meetsRequirements,
      isUnlocked: false // Not yet triggered
    };
  }).filter(Boolean);
}

// Unlock Requirements Matrix
const unlockMatrix: UnlockRequirements = {
  business: {
    L4: [
      { domain: 'psychology', minLevel: 3 },
      { domain: 'philosophy', minLevel: 2 },
      { domain: 'health', minLevel: 2 }
    ],
    L3: [
      { domain: 'psychology', minLevel: 2 },
      { domain: 'relationships', minLevel: 2 }
    ]
  },
  psychology: {
    L4: [
      { domain: 'philosophy', minLevel: 3 },
      { domain: 'relationships', minLevel: 3 }
    ]
  },
  // ... etc
};
```

### V1 Scope

**In:**
- ✅ Full dashboard with all sections
- ✅ Radar chart visualization
- ✅ Unlock tree (static logic, predefined matrix)
- ✅ Progress over time (snapshots)
- ✅ 10-15 achievements
- ✅ Next steps suggestions

**Out (V2):**
- ❌ AI-generated personalized development plans
- ❌ Peer comparison/leaderboards
- ❌ Social features (share progress)
- ❌ Integration with Academy (automated recommendations)
- ❌ Streaks and habit tracking

---

## 🧠 PHASE 3: 4D THINKING TOOL (V1)

### Goal

Interactive tool que força usuário a ver problema através dos 4 quadrants.

### Database Schema

```sql
CREATE TABLE thinking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  problem_statement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  insights_generated JSONB
);

CREATE TABLE quadrant_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES thinking_sessions(id),
  quadrant TEXT CHECK (quadrant IN ('inner_individual', 'outer_individual', 'inner_collective', 'outer_collective')),
  reflection_text TEXT,
  ai_suggestions JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track patterns over time
CREATE TABLE thinking_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id),
  dominant_quadrant TEXT,
  quadrant_usage_stats JSONB, -- { inner_individual: 45%, ... }
  blind_spot_quadrants TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Frontend Components

```typescript
// components/altitude/FourDThinkingTool.tsx

interface ThinkingToolProps {
  onComplete: (insights: Insight[]) => void;
}

// UI Flow:
// Step 1: Problem Statement Input
// Step 2: 4 Quadrants Exploration (sequential or free-form)
// Step 3: Synthesis & Insights
// Step 4: Action Items

// components/altitude/QuadrantCard.tsx
interface QuadrantCardProps {
  quadrant: 'inner_individual' | 'outer_individual' | 'inner_collective' | 'outer_collective';
  problem: string;
  onReflection: (text: string) => void;
}

// Each quadrant card has:
// - Title & description
// - Guiding questions
// - Text area for reflection
// - AI suggestion button
// - Examples/prompts

const quadrantGuides = {
  inner_individual: {
    title: "Inner Individual",
    subtitle: "Seus pensamentos, emoções, crenças",
    questions: [
      "Como EU penso sobre isso?",
      "Quais emoções estou sentindo?",
      "Quais crenças estão moldando minha visão?",
      "Estou sendo preciso ou emocional?"
    ],
    aiPrompt: "Ajude-me a explorar minha psicologia interna sobre: {problem}"
  },
  outer_individual: {
    title: "Outer Individual",
    subtitle: "Suas ações, comportamentos, físico",
    questions: [
      "Que AÇÕES posso tomar?",
      "Que comportamentos preciso mudar?",
      "Como meu corpo/energia está afetando isso?",
      "Quais são os passos concretos?"
    ],
    aiPrompt: "Sugira ações práticas para: {problem}"
  },
  inner_collective: {
    title: "Inner Collective",
    subtitle: "Cultura, narrativas, valores sociais",
    questions: [
      "Como a CULTURA contribui para isso?",
      "Que narrativas sociais influenciam?",
      "Quais são os valores do grupo?",
      "Como a sociedade vê esse problema?"
    ],
    aiPrompt: "Analise aspectos culturais de: {problem}"
  },
  outer_collective: {
    title: "Outer Collective",
    subtitle: "Sistemas, estruturas, instituições",
    questions: [
      "Quais SISTEMAS estão envolvidos?",
      "Tecnologia? Mercado? Instituições?",
      "Como a infraestrutura afeta isso?",
      "Quais são as forças estruturais?"
    ],
    aiPrompt: "Identifique sistemas e estruturas relevantes para: {problem}"
  }
};

// components/altitude/SynthesisView.tsx
// After all 4 quadrants explored:
// - Show all reflections side-by-side
// - AI-generated synthesis
// - Identify contradictions
// - Generate novel insights
// - Suggest action items
```

### AI Integration

```typescript
// lib/altitude/synthesis-engine.ts

interface SynthesisRequest {
  problem: string;
  quadrantReflections: QuadrantReflection[];
  userAltitude: number;
}

async function generateSynthesis(
  req: SynthesisRequest
): Promise<Synthesis> {

  const prompt = `
You are a synthesis expert helping a user think through a complex problem using the 4 Quadrants framework.

Problem: ${req.problem}

User's reflections:
- Inner Individual: ${req.quadrantReflections.inner_individual}
- Outer Individual: ${req.quadrantReflections.outer_individual}
- Inner Collective: ${req.quadrantReflections.inner_collective}
- Outer Collective: ${req.quadrantReflections.outer_collective}

User's cognitive altitude: ${req.userAltitude}/4.0

Tasks:
1. Identify patterns across quadrants
2. Spot contradictions or tensions
3. Generate 3-5 novel insights that emerge from integrating all 4 perspectives
4. Suggest 2-3 concrete action items
5. Identify which quadrant(s) the user is naturally gravitating towards (potential blind spots)

Format as JSON:
{
  "patterns": string[],
  "contradictions": string[],
  "insights": string[],
  "actionItems": string[],
  "dominantQuadrants": string[],
  "blindSpots": string[]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### V1 Scope

**In:**
- ✅ 4 quadrant exploration UI
- ✅ Guided questions per quadrant
- ✅ AI suggestions (optional)
- ✅ Synthesis generation
- ✅ Save sessions
- ✅ Track dominant quadrants

**Out (V2):**
- ❌ Historical session comparison
- ❌ Templates for common problem types
- ❌ Collaborative thinking (team sessions)
- ❌ Integration with Synthetic Minds (specific clone perspectives)
- ❌ Spaced repetition for insights

---

## 🔧 PHASE 4: AGENT COGNITIVE PROFILES (V2)

### Goal

Mapear altitude cognitiva de cada agente e clone para melhor seleção e orquestração.

### Database Schema

```sql
CREATE TABLE agent_cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE, -- 'the_maestro', 'elon_musk', etc.
  agent_type TEXT CHECK (agent_type IN ('tier3', 'tier2', 'tier1', 'clone')),
  overall_altitude DECIMAL(3,2),
  domain_levels JSONB,
  cognitive_strengths TEXT[],
  cognitive_blind_spots TEXT[],
  best_for TEXT, -- Use cases where this agent excels
  avoid_for TEXT, -- Use cases where agent has blind spots
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Track which agent works best for which altitude levels
CREATE TABLE agent_altitude_affinity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agent_cognitive_profiles(agent_id),
  works_best_for_altitude_range NUMRANGE, -- e.g., [2.0, 3.5)
  problem_complexity TEXT CHECK (problem_complexity IN ('tactical', 'strategic', 'philosophical')),
  effectiveness_score DECIMAL(3,2)
);
```

### Agent Profile Examples

```yaml
the_maestro:
  agent_id: the_maestro
  agent_type: tier3
  overall_altitude: 4.0
  domain_levels:
    orchestration: L4
    systems_thinking: L4
    psychology: L3
    execution: L2
  cognitive_strengths:
    - Generative synthesis across domains
    - Holds contradictions without collapse
    - Meta-cognitive awareness
  cognitive_blind_spots:
    - Can over-complicate simple tasks
    - May lack deep domain expertise
  best_for: "Complex, multi-agent orchestration requiring original insights"
  avoid_for: "Tactical execution requiring deep domain expertise"

elon_musk_clone:
  agent_id: elon_musk
  agent_type: clone
  overall_altitude: 3.25
  domain_levels:
    engineering: L4
    business: L4
    systems_thinking: L4
    social_eq: L1
  cognitive_strengths:
    - First-principles thinking
    - Cross-domain innovation
    - Rapid iteration
  cognitive_blind_spots:
    - Low EQ, can be abrasive
    - May ignore human factors
  best_for: "Complex systems design, technical strategy, impossible problems"
  avoid_for: "Relationship management, emotional situations, team dynamics"

naval_ravikant_clone:
  agent_id: naval_ravikant
  agent_type: clone
  overall_altitude: 3.5
  domain_levels:
    business: L4
    philosophy: L4
    psychology: L3
    spirituality: L3
  cognitive_strengths:
    - Philosophical + business synthesis
    - Long-term thinking
    - Wisdom-based decision making
  cognitive_blind_spots:
    - Can be too abstract for tactical needs
  best_for: "Strategic decisions, philosophical integration, meaning-making"
  avoid_for: "Urgent tactical execution, purely technical problems"
```

### Agent Selection Algorithm

```typescript
// lib/agents/cognitive-agent-selector.ts

interface AgentSelectionRequest {
  problem: string;
  problemType: 'tactical' | 'strategic' | 'philosophical';
  userAltitude: number;
  requiredDomains: string[];
  preferredApproach?: 'practical' | 'innovative' | 'wise';
}

async function selectOptimalAgent(
  req: AgentSelectionRequest
): Promise<AgentRecommendation[]> {

  // 1. Filter agents by problem type
  let candidates = await getAgentsByProblemType(req.problemType);

  // 2. Score based on domain match
  candidates = candidates.map(agent => ({
    ...agent,
    domainMatchScore: calculateDomainMatch(
      agent.domain_levels,
      req.requiredDomains
    )
  }));

  // 3. Consider altitude affinity
  // Higher altitude users may need higher altitude agents
  // But sometimes lower altitude agent is better for tactical work
  candidates = candidates.map(agent => ({
    ...agent,
    altitudeAffinityScore: calculateAltitudeAffinity(
      agent.overall_altitude,
      req.userAltitude,
      req.problemType
    )
  }));

  // 4. Apply approach preference
  if (req.preferredApproach) {
    candidates = candidates.map(agent => ({
      ...agent,
      approachScore: scoreApproach(agent, req.preferredApproach)
    }));
  }

  // 5. Combine scores and rank
  candidates = candidates.map(agent => ({
    ...agent,
    totalScore: (
      agent.domainMatchScore * 0.4 +
      agent.altitudeAffinityScore * 0.3 +
      agent.approachScore * 0.3
    )
  }));

  // 6. Sort and return top 3
  return candidates
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3)
    .map(agent => ({
      agent_id: agent.agent_id,
      name: agent.name,
      altitude: agent.overall_altitude,
      score: agent.totalScore,
      reasoning: generateReasoningText(agent, req),
      caveats: agent.cognitive_blind_spots
    }));
}
```

### Integration with Maestro

```typescript
// Update The_Maestro prompt to include cognitive awareness

const maestroPromptAddition = `
## Cognitive Altitude Awareness

You have access to cognitive profiles of all agents. When selecting agents:

1. Match agent altitude to problem complexity
2. Consider user's altitude (avoid agents too far above/below)
3. Be aware of agent blind spots
4. Combine agents to cover all 4 quadrants when needed

Agent Profiles:
${JSON.stringify(agentProfiles, null, 2)}

Selection Guidelines:
- L4 problems → Use Tier 3 agents (Maestro, Veritas, Intellex)
- L2-3 problems → Use Tier 2 agents or specialized clones
- L1 problems → Use tactical agents or simple automation
- Cross-domain synthesis → Naval, Elon (high polymath altitude)
- Tactical execution → Domain specialists
- Emotional/social → High EQ clones (avoid Elon)
`;
```

### V2 Scope

**In:**
- ✅ Cognitive profiles for all Tier 3 agents
- ✅ Cognitive profiles for top 5 clones
- ✅ Agent selection algorithm
- ✅ Integration with Maestro
- ✅ Admin UI to edit profiles

**Out (V3):**
- ❌ Automatic profile generation from agent performance
- ❌ User feedback on agent effectiveness
- ❌ A/B testing different agent selections
- ❌ Dynamic profile updates based on usage patterns

---

## 🎨 FRONTEND ARCHITECTURE

### New Pages/Routes

```typescript
// src/pages/altitude/index.ts
export { default as AltitudeDashboard } from './AltitudeDashboard';
export { default as AltitudeAssessment } from './AltitudeAssessment';
export { default as FourDThinkingTool } from './FourDThinkingTool';
export { default as DomainExplorer } from './DomainExplorer';
export { default as AltitudeAchievements } from './AltitudeAchievements';

// Route structure:
// /altitude → Dashboard (overview)
// /altitude/assessment → Take/retake quiz
// /altitude/4d-tool → 4D thinking sessions
// /altitude/domains/:domain → Deep dive into specific domain
// /altitude/achievements → Badge collection
// /altitude/history → Progress over time
```

### Component Library

```typescript
// components/altitude/
├── AltitudeDashboard.tsx          // Main dashboard
├── AltitudeAssessmentQuiz.tsx     // Quiz component
├── QuestionCard.tsx               // Individual question
├── AltitudeResultsView.tsx        // Results after quiz
├── DomainRadarChart.tsx           // Radar visualization
├── UnlockSkillTree.tsx            // Skill tree UI
├── UnlockNode.tsx                 // Single node in tree
├── ProgressChart.tsx              // Time-series chart
├── AchievementBadges.tsx          // Badge collection
├── NextStepsCard.tsx              // Suggestions
├── FourDThinkingTool.tsx          // Main 4D tool
├── QuadrantCard.tsx               // Single quadrant
├── SynthesisView.tsx              // Synthesis results
├── DomainDetailView.tsx           // Deep dive per domain
├── AltitudeScore.tsx              // Score display component
└── shared/
    ├── LevelBadge.tsx             // L0-L4 badge
    ├── TierIndicator.tsx          // First/Second tier
    └── ProgressBar.tsx            // Altitude progress
```

### State Management

```typescript
// lib/stores/altitudeStore.ts
import create from 'zustand';

interface AltitudeState {
  // Current user profile
  profile: CognitiveProfile | null;
  domainLevels: DomainLevel[];

  // Assessment state
  currentAssessment: AssessmentSession | null;
  assessmentProgress: number;

  // 4D Tool state
  activeThinkingSession: ThinkingSession | null;

  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  startAssessment: () => Promise<void>;
  submitAnswer: (questionId: string, answerId: string) => Promise<void>;
  completeAssessment: () => Promise<CognitiveProfile>;
  startThinkingSession: (problem: string) => Promise<void>;
  updateQuadrantReflection: (quadrant: Quadrant, text: string) => Promise<void>;
  generateSynthesis: () => Promise<Synthesis>;
}

const useAltitudeStore = create<AltitudeState>((set, get) => ({
  profile: null,
  domainLevels: [],
  currentAssessment: null,
  assessmentProgress: 0,
  activeThinkingSession: null,

  fetchProfile: async (userId) => {
    const profile = await api.altitude.getProfile(userId);
    set({ profile: profile.profile, domainLevels: profile.domain_levels });
  },

  // ... etc
}));
```

### Design System Integration

```typescript
// Altitude-specific tokens
const altitudeTokens = {
  colors: {
    level0: '#8B5CF6', // Violet (Instinctual)
    level1: '#3B82F6', // Blue (Conformist)
    level2: '#10B981', // Green (Individualist)
    level3: '#F59E0B', // Amber (Synthesist - First of Second Tier)
    level4: '#EF4444', // Red (Generative - Peak)

    firstTier: '#6B7280', // Gray
    secondTier: '#F59E0B', // Gold

    unlocked: '#10B981',
    unlockable: '#F59E0B',
    locked: '#6B7280'
  },

  gradients: {
    altitudeProgress: 'linear-gradient(90deg, #3B82F6 0%, #F59E0B 60%, #EF4444 100%)'
  },

  spacing: {
    radarSize: '400px',
    skillNodeSize: '80px'
  }
};
```

---

## 🔌 BACKEND ARCHITECTURE

### Supabase Edge Functions

```typescript
// supabase/functions/altitude-assessment/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const { action, payload } = await req.json();

  switch (action) {
    case 'start':
      return startAssessment(payload);
    case 'submit_answer':
      return submitAnswer(payload);
    case 'complete':
      return completeAssessment(payload);
    default:
      return new Response('Invalid action', { status: 400 });
  }
});

async function startAssessment({ user_id }) {
  // 1. Create session
  const session = await db.assessment_sessions.insert({
    user_id,
    started_at: new Date()
  });

  // 2. Fetch questions (adaptive or static)
  const questions = await db.quiz_questions
    .select('*, quiz_answers(*)')
    .order('order_index');

  return {
    session_id: session.id,
    questions: questions,
    total_questions: questions.length
  };
}

async function submitAnswer({ session_id, question_id, answer_id }) {
  // 1. Record answer
  await db.assessment_sessions.update(session_id, {
    answers: db.raw('jsonb_set(answers, ...)') // Append answer
  });

  // 2. Get next question (or mark complete)
  const session = await db.assessment_sessions.findOne(session_id);
  const answeredCount = Object.keys(session.answers).length;
  const totalQuestions = await db.quiz_questions.count();

  if (answeredCount >= totalQuestions) {
    return { is_complete: true };
  }

  const nextQuestion = await getNextQuestion(session);
  return {
    next_question: nextQuestion,
    is_complete: false
  };
}

async function completeAssessment({ session_id }) {
  // 1. Fetch session answers
  const session = await db.assessment_sessions.findOne(session_id);

  // 2. Calculate altitude
  const scoringResult = calculateAltitude(session.answers);

  // 3. Create or update profile
  const profile = await upsertCognitiveProfile({
    user_id: session.user_id,
    overall_altitude: scoringResult.overall_altitude,
    last_assessment_at: new Date()
  });

  // 4. Update domain levels
  await updateDomainLevels(profile.id, scoringResult.domain_levels);

  // 5. Create snapshot
  await createAltitudeSnapshot(profile.id, scoringResult);

  // 6. Check achievements
  const newAchievements = await checkAchievements(profile.id);

  // 7. Update session
  await db.assessment_sessions.update(session_id, {
    completed_at: new Date(),
    results: scoringResult
  });

  return {
    profile: profile,
    domain_levels: scoringResult.domain_levels,
    overall_altitude: scoringResult.overall_altitude,
    insights: scoringResult.insights,
    new_achievements: newAchievements
  };
}
```

```typescript
// supabase/functions/altitude-synthesis/index.ts
// 4D Thinking Tool synthesis
serve(async (req) => {
  const { session_id, quadrant_reflections } = await req.json();

  // 1. Fetch session
  const session = await db.thinking_sessions.findOne(session_id);

  // 2. Generate synthesis using OpenAI
  const synthesis = await generateSynthesis({
    problem: session.problem_statement,
    quadrantReflections: quadrant_reflections,
    userAltitude: await getUserAltitude(session.user_id)
  });

  // 3. Update session
  await db.thinking_sessions.update(session_id, {
    completed_at: new Date(),
    insights_generated: synthesis
  });

  // 4. Update thinking patterns
  await updateThinkingPatterns(session.user_id, quadrant_reflections);

  return synthesis;
});
```

### Row Level Security (RLS)

```sql
-- Cognitive Profiles
ALTER TABLE user_cognitive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_cognitive_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_cognitive_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Assessment Sessions
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON assessment_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON assessment_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Agent Profiles (public read)
ALTER TABLE agent_cognitive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agent profiles"
  ON agent_cognitive_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update agent profiles"
  ON agent_cognitive_profiles FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );
```

### Caching Strategy

```typescript
// lib/cache/altitude-cache.ts

// Cache profile for 5 minutes (frequently accessed)
const profileCache = new Map<string, { profile: CognitiveProfile, expiry: number }>();

export async function getCachedProfile(userId: string): Promise<CognitiveProfile> {
  const cached = profileCache.get(userId);

  if (cached && cached.expiry > Date.now()) {
    return cached.profile;
  }

  const profile = await api.altitude.getProfile(userId);

  profileCache.set(userId, {
    profile: profile,
    expiry: Date.now() + 5 * 60 * 1000 // 5 min
  });

  return profile;
}

// Invalidate cache on profile update
export function invalidateProfileCache(userId: string) {
  profileCache.delete(userId);
}
```

---

## 🚀 DEPLOYMENT & DEVOPS

### Phase Rollout Plan

```yaml
Phase 1 - MVP (Week 1-2):
  - Database schema deployment
  - Assessment quiz (15 questions, static)
  - Basic results page
  - Save to database

  Deploy:
    - Supabase migrations
    - Edge function: altitude-assessment
    - Frontend: /altitude/assessment route

  Validation:
    - 10 beta users complete quiz
    - Verify scoring accuracy
    - Collect qualitative feedback

Phase 2 - Dashboard (Week 3-4):
  - Full dashboard UI
  - Radar chart
  - Unlock tree (static matrix)
  - Progress tracking
  - 10 achievements

  Deploy:
    - Additional migrations (snapshots, achievements)
    - Frontend: /altitude dashboard
    - Cron job: daily snapshot

  Validation:
    - Dashboard loads in <2s
    - Charts render correctly
    - Achievements trigger properly

Phase 3 - 4D Tool (Week 5-6):
  - 4D thinking tool UI
  - AI synthesis integration
  - Save sessions
  - Pattern tracking

  Deploy:
    - Edge function: altitude-synthesis
    - OpenAI integration
    - Frontend: /altitude/4d-tool

  Validation:
    - Synthesis quality (manual review)
    - Response time <5s
    - User completes 3+ sessions

Phase 4 - Agent Profiles (Week 7-8):
  - Agent profile database
  - Admin UI for editing
  - Selection algorithm
  - Maestro integration

  Deploy:
    - Agent profiles seeded
    - Admin page
    - Updated Maestro prompt

  Validation:
    - Agent selection accuracy
    - Maestro uses profiles correctly
    - Performance impact minimal
```

### Infrastructure Requirements

```yaml
Supabase:
  database:
    - 10 new tables
    - 15 RLS policies
    - 20 indexes
    - Estimated rows (1 year): 50k profiles, 200k sessions

  edge_functions:
    - altitude-assessment (moderate usage)
    - altitude-synthesis (low usage, OpenAI call)

  storage:
    - Minimal (no file uploads for this feature)

  auth:
    - No changes (use existing)

External APIs:
  openai:
    - Usage: Synthesis generation (~500 calls/month initially)
    - Model: GPT-4
    - Cost: ~$50-100/month

  analytics:
    - Track: quiz completion rate, dashboard engagement
    - Tools: PostHog or Mixpanel

Performance:
  - Quiz load: <500ms
  - Dashboard load: <2s (with charts)
  - Synthesis generation: <5s
  - Database queries: <100ms (with proper indexes)
```

### Monitoring & Alerts

```typescript
// Metrics to track
const altitudeMetrics = {
  engagement: [
    'quiz_started',
    'quiz_completed',
    'quiz_completion_rate',
    'dashboard_visits',
    '4d_tool_sessions_started',
    '4d_tool_sessions_completed'
  ],

  performance: [
    'quiz_load_time',
    'dashboard_load_time',
    'synthesis_generation_time',
    'db_query_time'
  ],

  errors: [
    'quiz_submission_errors',
    'synthesis_generation_errors',
    'db_connection_errors'
  ],

  business: [
    'avg_altitude_score',
    'second_tier_users_pct',
    'achievement_unlock_rate',
    'retake_rate'
  ]
};

// Alerts
const alerts = [
  {
    metric: 'quiz_completion_rate',
    threshold: 0.5,
    condition: 'below',
    action: 'Investigate UX friction in quiz'
  },
  {
    metric: 'synthesis_generation_time',
    threshold: 10000, // 10s
    condition: 'above',
    action: 'Check OpenAI API latency'
  },
  {
    metric: 'db_query_time',
    threshold: 500, // 500ms
    condition: 'above',
    action: 'Review query performance, add indexes'
  }
];
```

---

## 🎯 SUCCESS METRICS

### Phase 1 (MVP) - Success Criteria

```yaml
Engagement:
  - 50% of activated users complete assessment
  - 80% completion rate once started
  - <5% abandon rate

Accuracy:
  - Qualitative validation: users agree with results (80%+)
  - No egregious misclassifications

Performance:
  - Quiz loads in <1s
  - Results calculated in <2s
  - Zero critical errors

User Feedback:
  - Survey: "Was this valuable?" → 70% yes
  - Survey: "Results felt accurate?" → 75% yes
```

### Phase 2 (Dashboard) - Success Criteria

```yaml
Engagement:
  - 40% of users visit dashboard weekly
  - 10% of users unlock at least 1 achievement in first month
  - Avg session duration >2min

Virality:
  - 15% of users share results (if we add share feature)

Performance:
  - Dashboard loads in <2s
  - Charts render without jank
  - Realtime updates when completing content
```

### Phase 3 (4D Tool) - Success Criteria

```yaml
Engagement:
  - 20% of users try 4D tool at least once
  - 30% of those complete 3+ sessions
  - Avg session duration 8-12min (indicates real thinking)

Quality:
  - User survey: "Synthesis was insightful" → 70% agree
  - Return rate: 40% use tool multiple times

Performance:
  - Synthesis generates in <5s
  - AI cost per session <$0.10
```

### Phase 4 (Agent Profiles) - Success Criteria

```yaml
Internal Metrics:
  - Agent selection accuracy (manual review): 80%+
  - Maestro uses profiles in 60%+ of orchestrations
  - Zero performance degradation

User-Facing:
  - Users see more relevant agent suggestions
  - Qualitative: "The right clone for the job"
```

---

## 🔐 SECURITY & PRIVACY

### Data Sensitivity

```yaml
Low Sensitivity:
  - Quiz questions (public)
  - Agent profiles (public)
  - Achievement definitions (public)

Medium Sensitivity:
  - User cognitive profile (personal, not financial/health)
  - Assessment answers (personal preferences)
  - 4D thinking reflections (potentially private thoughts)

High Sensitivity:
  - None (no financial, health, or identifying data)
```

### Privacy Measures

```typescript
// 1. No PII in cognitive profiles
// Altitude scores are NOT linked to real names in analytics

// 2. User control
interface PrivacySettings {
  shareProfile: boolean; // Allow sharing with others
  includeInAggregates: boolean; // Include in platform stats
  allowResearch: boolean; // Use for research (anonymized)
}

// 3. Data retention
const dataRetention = {
  assessment_sessions: '2 years',
  thinking_sessions: '1 year',
  snapshots: 'indefinite (for progress tracking)',

  deletion_policy: 'On account deletion, cascade delete all altitude data'
};

// 4. Anonymization for research
async function exportAnonymizedData() {
  return await db.query(`
    SELECT
      overall_altitude,
      domain_levels,
      created_at,
      -- NO user_id, NO email, NO name
      age_bracket, -- e.g., '25-34'
      industry -- if we collect this
    FROM user_cognitive_profiles
    WHERE include_in_aggregates = true
  `);
}
```

### RLS Policies (Already Covered)

All tables have RLS enabled. Users can only access their own data.

---

## 💰 COST ANALYSIS

### Development Cost (Time)

```yaml
Phase 1 (MVP):
  Backend: 3-4 days
    - Schema design: 0.5 day
    - Edge functions: 1 day
    - Scoring algorithm: 1 day
    - Testing: 0.5-1 day

  Frontend: 4-5 days
    - Quiz UI: 2 days
    - Results page: 1.5 days
    - Integration: 0.5 day
    - Polish: 1 day

  Total: 7-9 days (1.5-2 weeks)

Phase 2 (Dashboard):
  Backend: 2-3 days
    - Additional tables: 0.5 day
    - Unlock logic: 1 day
    - Achievements: 1 day
    - Testing: 0.5 day

  Frontend: 6-8 days
    - Dashboard layout: 1 day
    - Radar chart: 1.5 days
    - Skill tree: 2-3 days
    - Progress chart: 1 day
    - Achievements: 1 day
    - Polish: 0.5-1 day

  Total: 8-11 days (2 weeks)

Phase 3 (4D Tool):
  Backend: 2-3 days
    - Schema: 0.5 day
    - OpenAI integration: 1 day
    - Edge function: 1 day
    - Testing: 0.5 day

  Frontend: 4-5 days
    - 4 Quadrant UI: 2 days
    - Synthesis view: 1.5 days
    - Integration: 0.5 day
    - Polish: 0.5-1 day

  Total: 6-8 days (1.5 weeks)

Phase 4 (Agent Profiles):
  Backend: 2 days
    - Schema: 0.5 day
    - Selection algorithm: 1 day
    - Testing: 0.5 day

  Content: 3 days
    - Profile all agents: 2 days
    - Maestro integration: 1 day

  Frontend: 2 days
    - Admin UI: 2 days

  Total: 7 days (1.5 weeks)

GRAND TOTAL: 28-35 days (6-7 weeks)
```

### Operational Cost (Monthly)

```yaml
Supabase:
  - Pro plan: $25/month (already paying)
  - Additional DB usage: ~$5-10/month
  - Edge functions: $2/month

  Subtotal: $32-37/month

OpenAI:
  - GPT-4 synthesis calls: ~500/month
  - Cost per call: ~$0.10
  - Total: $50/month

  Subtotal: $50/month

Analytics:
  - PostHog free tier: $0
  - Or Mixpanel: $25/month

  Subtotal: $0-25/month

TOTAL MONTHLY: $82-112/month

Annual: ~$1000-1350/year
```

### ROI Calculation

```yaml
Assumptions:
  - 100 active users in first 3 months
  - 30% conversion to premium tier
  - Premium tier: +$10/month (altitude features)

Revenue (Year 1):
  - Month 1-3: 30 premium users × $10 × 3 months = $900
  - Month 4-12: 50 premium users × $10 × 9 months = $4500
  - Total: $5400

Costs (Year 1):
  - Development: $0 (internal)
  - Operations: $1200
  - Total: $1200

Net: +$4200

ROI: 350%

BUT:
  - Strategic value >> direct revenue
  - Category differentiation
  - User stickiness
  - Data moat
  - Brand positioning
```

---

## 🧪 TESTING STRATEGY

### Unit Tests

```typescript
// __tests__/altitude/scoring-engine.test.ts
describe('Altitude Scoring Engine', () => {
  test('calculates correct altitude for balanced profile', () => {
    const answers = mockAnswers({ /* all L2 */ });
    const result = calculateAltitude(answers, config);
    expect(result.overall_altitude).toBe(2.0);
  });

  test('identifies blocking domains correctly', () => {
    const answers = mockAnswers({
      business: 'L3',
      psychology: 'L1', // blocker
      health: 'L1' // blocker
    });
    const result = calculateAltitude(answers, config);
    expect(result.blocking_domains).toContain('psychology');
    expect(result.blocking_domains).toContain('health');
  });

  test('handles edge cases (all L0, all L4)', () => {
    // ...
  });
});

// __tests__/altitude/unlock-system.test.ts
describe('Domain Unlock System', () => {
  test('correctly identifies unlockable domains', () => {
    const profile = mockProfile({
      business: 2,
      psychology: 2,
      health: 1
    });
    const unlocks = checkUnlocks(profile);
    expect(unlocks.find(u => u.domain === 'business' && u.targetLevel === 3).isUnlockable).toBe(true);
  });

  test('blocks when requirements not met', () => {
    // ...
  });
});
```

### Integration Tests

```typescript
// __tests__/altitude/assessment-flow.test.ts
describe('Assessment Flow (E2E)', () => {
  test('complete assessment flow', async () => {
    // 1. Start assessment
    const { session_id, questions } = await api.startAssessment({ user_id: testUser });
    expect(session_id).toBeDefined();
    expect(questions).toHaveLength(15);

    // 2. Submit answers
    for (const q of questions) {
      const answer = q.quiz_answers[0];
      const result = await api.submitAnswer({
        session_id,
        question_id: q.id,
        answer_id: answer.id
      });

      if (result.is_complete) break;
    }

    // 3. Complete assessment
    const profile = await api.completeAssessment({ session_id });
    expect(profile.overall_altitude).toBeGreaterThanOrEqual(0);
    expect(profile.overall_altitude).toBeLessThanOrEqual(4);
    expect(profile.domain_levels).toHaveLength(7);
  });
});
```

### User Acceptance Testing (UAT)

```yaml
Test Scenarios:
  1. New User Takes Assessment:
    - Click "Take Assessment"
    - Answer all 15 questions
    - See results page
    - Verify accuracy subjectively
    - Save profile

  2. Returning User Views Dashboard:
    - Navigate to /altitude
    - See overall altitude
    - See radar chart
    - See unlock tree
    - Identify next steps

  3. User Retakes Assessment:
    - After 1 week, retake
    - See updated profile
    - See progress chart shows change

  4. User Uses 4D Tool:
    - Enter problem
    - Fill all 4 quadrants
    - Generate synthesis
    - Receive insights
    - Save session

  5. Admin Edits Agent Profile:
    - Navigate to admin
    - Edit Elon Musk profile
    - Save changes
    - Verify Maestro uses updated profile
```

---

## 📖 DOCUMENTATION PLAN

### User-Facing Docs

```markdown
# Cognitive Altitude Guide

## What is Cognitive Altitude?

Your altitude is how HIGH you can think across multiple domains.

Think of it like a skill tree in a video game:
- **Level 0-1:** You're just starting (beginner)
- **Level 2:** You can think critically (intermediate)
- **Level 3-4:** You can integrate contradictions and create original insights (advanced)

## Why It Matters

Most people are "smart but dumb":
- Expert in ONE domain (e.g., business)
- Beginner in others (e.g., health, relationships, philosophy)

This creates a ceiling. You LITERALLY can't see solutions that require higher altitude.

## The Assessment

Take our 5-minute quiz to discover your cognitive profile.

You'll see:
- Your altitude across 7 domains
- Which domains are blocking your growth
- Personalized next steps

## The Dashboard

Track your progress over time:
- **Radar Chart:** Visual map of your cognitive landscape
- **Unlock Tree:** See what you need to level up
- **Achievements:** Gamified milestones
- **Progress:** How you're growing

## 4D Thinking Tool

Stuck on a problem? Use our 4D tool to see it from 4 perspectives:
1. Inner Individual (your thoughts/emotions)
2. Outer Individual (your actions/behaviors)
3. Inner Collective (culture/narratives)
4. Outer Collective (systems/structures)

Our AI will synthesize your reflections into novel insights.

## FAQ

**Q: Is higher altitude always better?**
A: Not always. Level 2 specialists are valuable. But OVERALL altitude determines your ceiling.

**Q: Can I improve my altitude?**
A: Absolutely! Neuroplasticity is real. Develop neglected domains.

**Q: How accurate is the assessment?**
A: It's a snapshot, not gospel. But it reveals patterns.
```

### Developer Docs

```markdown
# Altitude System Developer Guide

## Architecture Overview

[Diagrams]

## Database Schema

[ERD + table descriptions]

## API Reference

### Assessment API

POST /altitude/start-assessment
POST /altitude/submit-answer
POST /altitude/complete-assessment
GET /altitude/profile/:user_id

[Detailed specs]

### 4D Tool API

POST /altitude/thinking-session/start
PUT /altitude/thinking-session/:id/quadrant
POST /altitude/thinking-session/:id/synthesize

[Detailed specs]

## Scoring Algorithm

[Pseudocode + explanation]

## Adding New Domains

1. Insert into `cognitive_domains` table
2. Add questions to `quiz_questions`
3. Update unlock matrix in `domain-unlock-matrix.json`
4. Update frontend domain list

## Adding New Achievements

[Step-by-step guide]
```

---

## 🎬 GO-TO-MARKET PLAN

### Launch Sequence

```yaml
Week 1-2 (Internal Alpha):
  - Deploy Phase 1 (MVP)
  - 5-10 internal users test
  - Fix critical bugs
  - Refine quiz questions based on feedback

Week 3-4 (Closed Beta):
  - Invite 50 beta users (email list)
  - Deploy Phase 2 (Dashboard)
  - Collect qualitative feedback
  - A/B test messaging

Week 5-6 (Public Beta):
  - Announce on social media
  - "Early access to cognitive altitude tracking"
  - Deploy Phase 3 (4D Tool)
  - Monitor metrics closely

Week 7-8 (Full Launch):
  - Deploy Phase 4 (Agent Profiles)
  - PR push: "exímIA: First Cognitive Elevation Platform"
  - Content marketing: blog posts, videos
  - Paid ads (if budget)
  - Partnerships (psychology influencers, productivity creators)
```

### Messaging Strategy

```yaml
Positioning:
  - Primary: "Cognitive Elevation Platform"
  - Secondary: "AI that makes you think better, not just do more"

Target Audiences:
  1. Knowledge Workers (L2):
    - Pain: Stuck in career, despite being "smart"
    - Message: "Discover why you're blocked and unlock new levels"

  2. Founders/Executives (L2-L3):
    - Pain: Hit ceiling, can't scale beyond current altitude
    - Message: "Your mind is your limit. Elevate it."

  3. Personal Development Enthusiasts (L3):
    - Pain: Consume content but don't transform
    - Message: "Measure what matters: cognitive altitude"

Value Props:
  - "First platform to track cognitive development, not just productivity"
  - "Gamified self-awareness"
  - "AI agents matched to YOUR altitude"
  - "Think higher. Do better."

Social Proof:
  - Testimonials from beta users
  - Before/after altitude scores
  - "I unlocked Business L4 after developing Psychology"
```

### Content Marketing

```yaml
Blog Posts:
  - "Why Smart People Make Dumb Decisions"
  - "The Altitude Ceiling: How Your Blind Spots Block Growth"
  - "First Tier vs Second Tier Thinking"
  - "Polymath vs Specialist: The Altitude Advantage"

Videos:
  - "What is Cognitive Altitude?" (explainer, 3 min)
  - "My Altitude Assessment Results" (founder transparency, 8 min)
  - "How to Unlock Business L4" (educational, 12 min)

Social Media:
  - Daily tips on elevating thinking
  - User progress stories
  - Framework visualizations (infographics)
  - Memes about "smart but dumb" phenomenon

Partnerships:
  - Psychology YouTubers (e.g., HealthyGamerGG vibe)
  - Productivity influencers
  - Philosophy/wisdom accounts
```

---

## 🚧 RISKS & MITIGATION

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scoring algorithm inaccurate | Medium | High | Extensive beta testing, qualitative validation |
| Performance issues with charts | Low | Medium | Use lightweight chart lib (Recharts), optimize |
| OpenAI API rate limits | Low | Medium | Implement queueing, fallback to cheaper model |
| Database scale issues | Low | Low | Proper indexing, Supabase can scale |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users don't find value | Medium | High | Extensive user research, iterate on feedback |
| Quiz too long/boring | Medium | Medium | Keep to 15 questions, scenario-based (not academic) |
| Results feel inaccurate | Medium | High | Confidence scoring, allow retakes, transparency |
| Feature too complex | Low | Medium | Progressive disclosure, excellent onboarding |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No market demand | Low | High | We already have user pain point ("smart but stuck") |
| Competitors copy | Medium | Low | Execution moat, data moat, first-mover advantage |
| Can't monetize | Low | Medium | Premium tier for unlocks, coach marketplace |
| Ethical concerns | Low | Medium | Transparency, no selling data, user control |

---

## 📅 TIMELINE SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                     IMPLEMENTATION TIMELINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Week 1-2:  Phase 1 (MVP - Assessment)                          │
│  Week 3-4:  Phase 2 (Dashboard)                                 │
│  Week 5-6:  Phase 3 (4D Tool)                                   │
│  Week 7-8:  Phase 4 (Agent Profiles)                            │
│                                                                 │
│  Week 1-2:  Internal Alpha                                      │
│  Week 3-4:  Closed Beta (50 users)                              │
│  Week 5-6:  Public Beta                                         │
│  Week 7-8:  Full Launch + Marketing Push                        │
│                                                                 │
│  Total: 8 weeks (2 months)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ DECISION POINTS

### Architecture Decisions

1. **Database: Supabase (PostgreSQL)**
   - ✅ Already using
   - ✅ RLS for security
   - ✅ Edge functions for API
   - ❌ Alternative: Separate microservice → Overkill for V1

2. **Charts: Recharts**
   - ✅ React-friendly
   - ✅ Lightweight
   - ✅ Good docs
   - ❌ Alternative: D3.js → More powerful but steeper learning curve

3. **AI: OpenAI GPT-4**
   - ✅ Best synthesis quality
   - ❌ Cost: ~$50/month initially
   - ❌ Alternative: GPT-3.5 → Cheaper but lower quality

4. **Assessment: Static Questions (V1)**
   - ✅ Simpler to implement
   - ✅ Easier to validate
   - ❌ Less personalized
   - 🔮 V2: Adaptive questioning (IRT-based)

5. **Unlock Matrix: Hardcoded (V1)**
   - ✅ Designer-controlled
   - ✅ Predictable
   - ❌ Not data-driven
   - 🔮 V2: ML-based recommendations

### Product Decisions

1. **Domains: 7 Core Domains**
   - Business, Psychology, Health, Relationships, Philosophy, Learning, Creativity
   - ✅ Covers most of life
   - ❌ Could add more (politics, spirituality, finance)
   - 🔮 V2: Allow custom domains

2. **Quiz Length: 15 Questions**
   - ✅ Completable in 5-7 min
   - ❌ Less granular than 30+ questions
   - Tradeoff: Completion rate > Precision

3. **Freemium Model: Assessment Free, Advanced Features Premium**
   - ✅ Low barrier to entry
   - ✅ Viral potential (share results)
   - ✅ Upsell to dashboard, 4D tool, unlocks

---

## 📊 APPENDIX: SAMPLE DATA

### Sample Quiz Questions

```json
[
  {
    "id": "q1",
    "domain": "business",
    "level_target": 2,
    "question_text": "Seu concorrente lança um produto similar ao seu. Sua reação:",
    "answers": [
      {
        "id": "q1a1",
        "text": "Copio as features deles imediatamente",
        "level_score": 1,
        "reasoning": "Conformist - segue o que outros fazem"
      },
      {
        "id": "q1a2",
        "text": "Analiso o que eles fizeram de diferente e adapto minha estratégia",
        "level_score": 2,
        "reasoning": "Individualist - pensa criticamente e adapta"
      },
      {
        "id": "q1a3",
        "text": "Vejo isso como validação de mercado e busco diferenciar por outro ângulo",
        "level_score": 3,
        "reasoning": "Synthesist - integra múltiplas perspectivas"
      },
      {
        "id": "q1a4",
        "text": "Reconheço que competição revela algo sobre necessidade não atendida que ambos estamos errando",
        "level_score": 4,
        "reasoning": "Generative - cria perspectiva original"
      }
    ]
  },
  {
    "id": "q2",
    "domain": "psychology",
    "level_target": 3,
    "question_text": "Quando alguém critica você de forma dura, você:",
    "answers": [
      {
        "id": "q2a1",
        "text": "Me sinto atacado e contra-ataco ou me fecho",
        "level_score": 1
      },
      {
        "id": "q2a2",
        "text": "Defendo meu ponto com argumentos lógicos",
        "level_score": 2
      },
      {
        "id": "q2a3",
        "text": "Considero que pode haver verdade na crítica, mesmo se mal comunicada",
        "level_score": 3
      },
      {
        "id": "q2a4",
        "text": "Fico genuinamente curioso sobre o insight que eu estava perdendo",
        "level_score": 4
      }
    ]
  }
]
```

### Sample Unlock Matrix

```json
{
  "business": {
    "L3_to_L4": {
      "requires": [
        { "domain": "psychology", "min_level": 3 },
        { "domain": "philosophy", "min_level": 2 },
        { "domain": "health", "min_level": 2 }
      ],
      "reasoning": "Business L4 (generative strategy) requires deep self-awareness, big-picture thinking, and sustainable energy"
    },
    "L2_to_L3": {
      "requires": [
        { "domain": "psychology", "min_level": 2 },
        { "domain": "relationships", "min_level": 2 }
      ],
      "reasoning": "Business L3 (synthesis) requires understanding people and collaboration"
    }
  },
  "psychology": {
    "L3_to_L4": {
      "requires": [
        { "domain": "philosophy", "min_level": 3 },
        { "domain": "relationships", "min_level": 3 }
      ],
      "reasoning": "Psychology L4 (original models of mind) requires philosophical depth and real-world validation"
    }
  }
}
```

---

## 🎯 CONCLUSION

This architecture provides a **complete, phased approach** to implementing the Cognitive Altitude System in exímIA.

**Key Strengths:**
- ✅ Phased rollout (MVP → Full)
- ✅ Pragmatic tech choices (Supabase, React, OpenAI)
- ✅ Clear success metrics
- ✅ Gamification for engagement
- ✅ Novel market positioning

**Next Steps:**
1. **Review & Approve** this architecture
2. **Create PRD** (can use @pm for this)
3. **Break into Stories** (can use @po for this)
4. **Kickoff Development** (Phase 1 first)

**Estimated Timeline:** 8 weeks to full launch
**Estimated Cost:** ~$1200/year operational
**Expected ROI:** 350%+ Year 1 (conservative)

---

**Architect:** Aria 🏛️
**Date:** 2026-02-01
**Status:** Ready for Review
**Next Owner:** @pm (for PRD creation)

— Aria, arquitetando o futuro 🏗️
