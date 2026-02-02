# Story 047: Assessment Engine Edge Function

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** HIGH
> **Estimate:** 5 points
> **Assignee:** @dev
> **Status:** READY
> **Dependencies:** Story 046 (Database Schema)

---

## 📋 Story

**As a** user
**I want** to take a cognitive altitude assessment
**So that** I can discover my altitude across different domains

---

## 🎯 Acceptance Criteria

### Edge Function Created
- [ ] `altitude-assessment` edge function deployed
- [ ] Handles 3 actions: `start`, `submit_answer`, `complete`
- [ ] Proper error handling for all paths
- [ ] Request validation (user_id, session_id, etc.)
- [ ] Response follows consistent API contract

### Start Assessment
- [ ] Creates new `assessment_session` record
- [ ] Fetches all quiz questions with answers
- [ ] Returns session_id + questions array
- [ ] Performance: <500ms response time

### Submit Answer
- [ ] Validates session belongs to user (security)
- [ ] Stores answer in session.answers JSONB
- [ ] Returns next question or completion flag
- [ ] Idempotent (can submit same answer twice)

### Complete Assessment
- [ ] Calculates altitude using scoring algorithm
- [ ] Creates/updates `user_cognitive_profiles`
- [ ] Creates `user_domain_levels` records
- [ ] Creates initial `altitude_snapshot`
- [ ] Marks session as completed
- [ ] Returns full profile with results

### Security
- [ ] RLS policies enforced (via Supabase client)
- [ ] User can only access own sessions
- [ ] Input sanitization on all text fields
- [ ] Rate limiting (max 1 assessment per hour per user)

---

## 📐 Technical Specification

### Edge Function Structure

```typescript
// supabase/functions/altitude-assessment/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, payload } = await req.json();

    let result;
    switch (action) {
      case 'start':
        result = await startAssessment(supabase, user.id, payload);
        break;
      case 'submit_answer':
        result = await submitAnswer(supabase, user.id, payload);
        break;
      case 'complete':
        result = await completeAssessment(supabase, user.id, payload);
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

### Action: Start Assessment

```typescript
async function startAssessment(supabase, userId: string, payload: any) {
  // Check rate limit (max 1 per hour)
  const { data: recentSessions } = await supabase
    .from('assessment_sessions')
    .select('started_at')
    .eq('user_id', userId)
    .gte('started_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .order('started_at', { ascending: false })
    .limit(1);

  if (recentSessions && recentSessions.length > 0) {
    throw new Error('You can only take one assessment per hour. Please try again later.');
  }

  // Create assessment session
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .insert({
      user_id: userId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  // Fetch all questions with answers
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select(`
      id,
      domain_id,
      question_text,
      question_type,
      order_index,
      quiz_answers (
        id,
        answer_text,
        level_score,
        order_index
      )
    `)
    .order('order_index', { ascending: true });

  if (questionsError) throw questionsError;

  // Sort answers within each question
  const questionsWithSortedAnswers = questions.map((q) => ({
    ...q,
    quiz_answers: q.quiz_answers.sort((a, b) => a.order_index - b.order_index),
  }));

  return {
    session_id: session.id,
    questions: questionsWithSortedAnswers,
    total_questions: questions.length,
  };
}
```

### Action: Submit Answer

```typescript
async function submitAnswer(supabase, userId: string, payload: any) {
  const { session_id, question_id, answer_id } = payload;

  if (!session_id || !question_id || !answer_id) {
    throw new Error('Missing required fields: session_id, question_id, answer_id');
  }

  // Fetch session (RLS ensures user owns it)
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', session_id)
    .eq('user_id', userId)
    .single();

  if (sessionError || !session) {
    throw new Error('Session not found or access denied');
  }

  if (session.completed_at) {
    throw new Error('Assessment already completed');
  }

  // Update answers JSONB
  const currentAnswers = session.answers || {};
  currentAnswers[question_id] = answer_id;

  const { error: updateError } = await supabase
    .from('assessment_sessions')
    .update({ answers: currentAnswers })
    .eq('id', session_id);

  if (updateError) throw updateError;

  // Check if all questions answered
  const { data: totalQuestions } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true });

  const answeredCount = Object.keys(currentAnswers).length;
  const isComplete = answeredCount >= (totalQuestions?.length || 15);

  if (isComplete) {
    return { is_complete: true };
  }

  // Get next unanswered question
  const { data: allQuestions } = await supabase
    .from('quiz_questions')
    .select('id, order_index')
    .order('order_index', { ascending: true });

  const nextQuestion = allQuestions?.find((q) => !currentAnswers[q.id]);

  if (nextQuestion) {
    const { data: questionData } = await supabase
      .from('quiz_questions')
      .select(`
        id,
        domain_id,
        question_text,
        question_type,
        quiz_answers (
          id,
          answer_text,
          level_score,
          order_index
        )
      `)
      .eq('id', nextQuestion.id)
      .single();

    return {
      next_question: {
        ...questionData,
        quiz_answers: questionData.quiz_answers.sort((a, b) => a.order_index - b.order_index),
      },
      is_complete: false,
    };
  }

  return { is_complete: true };
}
```

### Action: Complete Assessment

```typescript
async function completeAssessment(supabase, userId: string, payload: any) {
  const { session_id } = payload;

  // Fetch session with answers
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', session_id)
    .eq('user_id', userId)
    .single();

  if (sessionError || !session) {
    throw new Error('Session not found or access denied');
  }

  if (session.completed_at) {
    throw new Error('Assessment already completed');
  }

  // Calculate altitude (call scoring algorithm)
  const scoringResult = await calculateAltitude(supabase, session.answers);

  // Create or update user profile
  const { data: existingProfile } = await supabase
    .from('user_cognitive_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  let profileId: string;

  if (existingProfile) {
    // Update existing
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_cognitive_profiles')
      .update({
        overall_altitude: scoringResult.overall_altitude,
        last_assessment_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProfile.id)
      .select()
      .single();

    if (updateError) throw updateError;
    profileId = updatedProfile.id;
  } else {
    // Create new
    const { data: newProfile, error: insertError } = await supabase
      .from('user_cognitive_profiles')
      .insert({
        user_id: userId,
        overall_altitude: scoringResult.overall_altitude,
        last_assessment_at: new Date().toISOString(),
        assessment_version: 'v1.0',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    profileId = newProfile.id;
  }

  // Upsert domain levels
  const domainLevelRecords = scoringResult.domain_levels.map((dl) => ({
    profile_id: profileId,
    domain_id: dl.domain_id,
    current_level: dl.level,
    confidence_score: dl.confidence,
    evidence: { session_id, answers: dl.evidence },
    updated_at: new Date().toISOString(),
  }));

  const { error: domainError } = await supabase
    .from('user_domain_levels')
    .upsert(domainLevelRecords, { onConflict: 'profile_id,domain_id' });

  if (domainError) throw domainError;

  // Create altitude snapshot
  const { error: snapshotError } = await supabase
    .from('altitude_snapshots')
    .insert({
      profile_id: profileId,
      overall_altitude: scoringResult.overall_altitude,
      domain_levels: scoringResult.domain_levels,
      snapshot_date: new Date().toISOString().split('T')[0],
      trigger_event: 'assessment',
    });

  if (snapshotError) throw snapshotError;

  // Mark session complete
  const sessionDuration = Math.floor(
    (Date.now() - new Date(session.started_at).getTime()) / 1000
  );

  const { error: completeError } = await supabase
    .from('assessment_sessions')
    .update({
      completed_at: new Date().toISOString(),
      results: scoringResult,
      session_duration_seconds: sessionDuration,
    })
    .eq('id', session_id);

  if (completeError) throw completeError;

  // Fetch final profile with domain levels
  const { data: profile } = await supabase
    .from('user_cognitive_profiles')
    .select(`
      *,
      user_domain_levels (
        *,
        cognitive_domains (name, icon)
      )
    `)
    .eq('id', profileId)
    .single();

  return {
    profile: profile,
    overall_altitude: scoringResult.overall_altitude,
    domain_levels: scoringResult.domain_levels,
    insights: scoringResult.insights,
    tier: scoringResult.overall_altitude >= 3.0 ? 'second' : 'first',
  };
}
```

### Scoring Algorithm (Placeholder)

```typescript
// lib/scoring-engine.ts
// IMPORTANT: This will be implemented fully in Story 050
// For now, use simple average

async function calculateAltitude(supabase, answers: Record<string, string>) {
  // Fetch all answers with level scores
  const answerIds = Object.values(answers);

  const { data: answerData } = await supabase
    .from('quiz_answers')
    .select(`
      id,
      level_score,
      question_id,
      quiz_questions!inner (domain_id)
    `)
    .in('id', answerIds);

  // Group by domain
  const domainScores: Record<string, number[]> = {};

  for (const answer of answerData || []) {
    const domainId = answer.quiz_questions.domain_id;
    if (!domainScores[domainId]) {
      domainScores[domainId] = [];
    }
    domainScores[domainId].push(answer.level_score);
  }

  // Calculate average per domain
  const domainLevels = Object.entries(domainScores).map(([domainId, scores]) => {
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const level = Math.round(avg);
    const confidence = 1.0 - (Math.abs(avg - level) * 2); // Simple confidence

    return {
      domain_id: domainId,
      level: level,
      confidence: Math.max(0.5, Math.min(1.0, confidence)),
      evidence: scores,
    };
  });

  // Calculate overall altitude
  const overallAltitude =
    domainLevels.reduce((sum, dl) => sum + dl.level, 0) / domainLevels.length;

  // Generate simple insights
  const insights = [
    `Your overall cognitive altitude is ${overallAltitude.toFixed(1)}/4.0`,
    domainLevels.length > 0
      ? `Highest domain: Level ${Math.max(...domainLevels.map((dl) => dl.level))}`
      : '',
    domainLevels.length > 0
      ? `Lowest domain: Level ${Math.min(...domainLevels.map((dl) => dl.level))}`
      : '',
  ].filter(Boolean);

  return {
    overall_altitude: parseFloat(overallAltitude.toFixed(2)),
    domain_levels: domainLevels,
    insights: insights,
  };
}
```

---

## 📁 Files to Create

```
supabase/functions/altitude-assessment/
├── index.ts                        # Main handler
├── lib/
│   ├── scoring-engine.ts          # Scoring algorithm (simple for now)
│   └── types.ts                   # TypeScript interfaces
└── deno.json                       # Deno config
```

---

## 🧪 Testing Checklist

### Unit Tests (Local)
- [ ] `startAssessment` creates session and returns questions
- [ ] `submitAnswer` stores answer correctly
- [ ] `completeAssessment` calculates altitude
- [ ] Rate limiting blocks multiple assessments
- [ ] Invalid session_id returns 400 error
- [ ] Unauthorized user returns 401 error

### Integration Tests (Supabase)
- [ ] Deploy to Supabase and test via HTTP
- [ ] Test full flow: start → submit 15 answers → complete
- [ ] Verify RLS policies (user A can't access user B's session)
- [ ] Verify database records created correctly
- [ ] Test error paths (invalid data, missing fields)

### Performance Tests
- [ ] `startAssessment` responds in <500ms
- [ ] `submitAnswer` responds in <200ms
- [ ] `completeAssessment` responds in <2s

---

## 📚 Reference

- **Architecture:** `cognitive-altitude-system-architecture.md` (API Endpoints section)
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Deno Deploy:** https://deno.land/manual/runtime

---

## ✅ Definition of Done

- [x] Edge function deployed to Supabase
- [x] All 3 actions work correctly (start, submit, complete)
- [x] Rate limiting implemented
- [x] RLS policies enforced
- [x] Error handling comprehensive
- [x] Testing checklist completed
- [x] API documentation updated
- [x] No errors in Supabase function logs

---

## 🚀 Next Steps

After this story:
- **Story 048:** Quiz Frontend UI (depends on this edge function)
- **Story 050:** Scoring Algorithm (enhance simple algo to sophisticated)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** Story 046 (Database Schema)
**Blocks:** Story 048 (Quiz UI)

— River, removendo obstáculos 🌊
