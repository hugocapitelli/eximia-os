# Story 051: Quiz Content Creation

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** HIGH (Blocker for launch)
> **Estimate:** 13 points (content-heavy)
> **Assignee:** @content + @dev
> **Status:** READY
> **Dependencies:** Story 046 (Database Schema), Story 050 (Scoring Algorithm)

---

## 📋 Story

**As a** content creator
**I want** to craft 15 high-quality quiz questions across 7 domains
**So that** users receive accurate and meaningful cognitive altitude assessments

---

## 🎯 Acceptance Criteria

### Content Requirements
- [ ] 15 total questions (2-3 per domain)
- [ ] Cover all 7 cognitive domains (Business, Psychology, Health, Relationships, Philosophy, Learning, Creativity)
- [ ] Each question has 4 answer options (L0-L1, L2, L3, L4)
- [ ] Questions are scenario-based (not abstract theory)
- [ ] Language is accessible (no jargon)
- [ ] Answers clearly differentiate levels

### Question Quality
- [ ] Each question tests ONE specific domain
- [ ] Answers progress naturally (L0→L4)
- [ ] No "obviously wrong" answers (all plausible)
- [ ] Culturally neutral (no US/Brazil bias)
- [ ] Gender neutral language
- [ ] No trick questions or gotchas

### Technical Implementation
- [ ] Questions inserted into `quiz_questions` table
- [ ] Answers inserted into `quiz_answers` table
- [ ] Correct `level_score` assigned (0-4)
- [ ] `order_index` set for display order
- [ ] Migration file created for seed data

### Validation
- [ ] 3+ people review questions for clarity
- [ ] Pilot test with 5 users (get feedback)
- [ ] Scoring algorithm produces expected results
- [ ] No questions skewed toward single level

---

## 📐 Technical Specification

### Database Structure (Story 046)

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY,
  domain_id UUID REFERENCES cognitive_domains(id),
  level_target INT,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('scenario', 'reaction', 'belief')),
  order_index INT NOT NULL
);

CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id),
  answer_text TEXT NOT NULL,
  level_score INT CHECK (level_score >= 0 AND level_score <= 4),
  reasoning TEXT,
  order_index INT NOT NULL
);
```

---

## 📝 Content Guidelines

### Question Types

1. **Scenario Questions** (Preferred)
   - Present realistic situation
   - Ask how user would respond
   - Tests applied thinking, not theory

2. **Reaction Questions**
   - Describe event or statement
   - Ask for immediate reaction
   - Tests instinctive vs reflective thinking

3. **Belief Questions**
   - Statement about domain
   - Ask level of agreement
   - Tests mental models

---

### Level Progression Framework

Each question should have 4 answers mapping to levels:

| Answer | Level | Characteristics |
|--------|-------|-----------------|
| A | L0-L1 | Instinctive/Conformist - Black & white, follows authority, reactive |
| B | L2 | Individualist - Critical thinking, constructs own model |
| C | L3 | Synthesist - Integrates contradictions, uses perspectives as tools |
| D | L4 | Generative - Creates original perspectives, navigates full complexity |

---

## 📋 Question Bank (15 Questions)

### Domain 1: Business (3 questions)

#### Question B1: Strategic Decision-Making

**Text:**
```
Sua startup precisa decidir entre duas estratégias:
(A) Crescimento rápido com investimento externo
(B) Crescimento orgânico mantendo controle

Como você aborda essa decisão?
```

**Answers:**
- **L1:** "Sigo o conselho do mentor mais respeitado na minha rede."
  - *Reasoning:* Confia em autoridade externa, não constrói modelo próprio

- **L2:** "Analiso prós e contras de cada opção e escolho a que faz mais sentido para minha visão."
  - *Reasoning:* Pensamento crítico, mas binário (ou/ou)

- **L3:** "Exploro se existe uma terceira via que integra vantagens de ambas (ex: investidor estratégico minoritário)."
  - *Reasoning:* Integra contradições, busca síntese

- **L4:** "Questiono a própria pergunta: talvez 'crescimento' não seja a métrica certa agora. Reavalio o contexto."
  - *Reasoning:* Desconstrói premissas, cria nova perspectiva

---

#### Question B2: Competitor Analysis

**Text:**
```
Um concorrente direto lança feature que você planejava. Qual sua reação?
```

**Answers:**
- **L1:** "Copiamos a feature imediatamente para não ficar atrás."
  - *Reasoning:* Reativo, segue mercado

- **L2:** "Analiso se a feature faz sentido para nossa estratégia antes de decidir."
  - *Reasoning:* Pensamento independente

- **L3:** "Vejo como oportunidade: agora sei que há demanda. Posso fazer versão melhor ou diferente."
  - *Reasoning:* Integra múltiplas perspectivas (validação + diferenciação)

- **L4:** "Pergunto: por que estamos competindo nessa dimensão? Talvez devêssemos criar categoria nova."
  - *Reasoning:* Transcende jogo, cria novo território

---

#### Question B3: Business Model

**Text:**
```
Você precisa definir precificação para seu produto. Como decide?
```

**Answers:**
- **L0:** "Cobro o que meus custos exigem + margem padrão do setor."
  - *Reasoning:* Baseado em custo (nível mais básico)

- **L2:** "Pesquiso concorrentes e me posiciono estrategicamente (mais barato, premium, etc)."
  - *Reasoning:* Análise comparativa, construção de modelo

- **L3:** "Testo múltiplas hipóteses (value-based, freemium, usage-based) e integro insights."
  - *Reasoning:* Experimentação, síntese de dados

- **L4:** "Questiono: estamos vendendo o produto certo? Talvez o modelo de negócio em si precise mudar."
  - *Reasoning:* Desconstrói premissa fundamental

---

### Domain 2: Psychology (2 questions)

#### Question P1: Self-Awareness

**Text:**
```
Você recebe feedback negativo sobre algo que considera seu ponto forte. Como reage?
```

**Answers:**
- **L1:** "Fico defensivo e explico por que a pessoa está errada."
  - *Reasoning:* Identidade ameaçada → defesa

- **L2:** "Reflito se há verdade no feedback, mesmo que doa."
  - *Reasoning:* Separação eu/ideia, pensamento crítico

- **L3:** "Exploro: talvez eu seja forte nisso E tenha blind spot específico. Ambos podem ser verdade."
  - *Reasoning:* Integra contradição (forte + cego)

- **L4:** "Questiono minha identidade: por que me apeguei a essa autoimagem? O que isso revela?"
  - *Reasoning:* Meta-cognição, desconstrói identidade

---

#### Question P2: Emotional Intelligence

**Text:**
```
Em conflito com colega, você percebe que ambos estão frustrados. O que faz?
```

**Answers:**
- **L1:** "Evito o conflito ou espero que RH resolva."
  - *Reasoning:* Delegação para autoridade

- **L2:** "Busco entender meu lado e comunicar claramente minha perspectiva."
  - *Reasoning:* Assertividade, mas unilateral

- **L3:** "Crio espaço para entender perspectiva dele antes de defender a minha."
  - *Reasoning:* Integração de perspectivas

- **L4:** "Exploro: talvez o conflito seja sintoma de problema sistêmico maior (estrutura, cultura)."
  - *Reasoning:* Sobe nível de análise (individual → sistema)

---

### Domain 3: Health (2 questions)

#### Question H1: Nutrition

**Text:**
```
Você quer melhorar sua alimentação. Como aborda isso?
```

**Answers:**
- **L1:** "Sigo dieta popular que todos estão fazendo (keto, low-carb, etc)."
  - *Reasoning:* Conformismo, autoridade externa

- **L2:** "Estudo nutrição e monto plano baseado em evidência científica."
  - *Reasoning:* Pensamento crítico, modelo próprio

- **L3:** "Experimento abordagens diferentes e integro o que funciona para MEU corpo."
  - *Reasoning:* Síntese personalizada, contexto

- **L4:** "Questiono: 'melhorar alimentação' para quê? Energia? Longevidade? Prazer? Reavalio objetivo."
  - *Reasoning:* Desconstrói premissa, valores

---

#### Question H2: Fitness

**Text:**
```
Você não está vendo resultados no treino. O que faz?
```

**Answers:**
- **L0:** "Desisto e aceito que não sou pessoa de academia."
  - *Reasoning:* Identidade fixa (não sou X)

- **L2:** "Analiso: talvez treino, dieta ou descanso estejam errados. Ajusto variáveis."
  - *Reasoning:* Troubleshooting sistemático

- **L3:** "Considero: talvez 'resultados' que busco não sejam os certos. Reavalio métricas."
  - *Reasoning:* Integra objetivo + método

- **L4:** "Pergunto: por que associo valor próprio a corpo? Desconstruo relação com fitness."
  - *Reasoning:* Meta-análise, valores profundos

---

### Domain 4: Relationships (2 questions)

#### Question R1: Communication

**Text:**
```
Parceiro(a) age de forma que te incomoda. Como lida?
```

**Answers:**
- **L1:** "Reclamo ou fico quieto(a) esperando que perceba."
  - *Reasoning:* Passivo-agressivo ou evitação

- **L2:** "Comunico claramente o que me incomoda e peço mudança."
  - *Reasoning:* Assertividade direta

- **L3:** "Exploro: talvez o comportamento seja sintoma de necessidade não atendida. Converso sobre isso."
  - *Reasoning:* Sobe nível (comportamento → necessidade)

- **L4:** "Questiono: por que isso me incomoda tanto? O que isso revela sobre mim?"
  - *Reasoning:* Auto-investigação, projeção

---

#### Question R2: Boundaries

**Text:**
```
Amigo pede favor que você não quer fazer. Como responde?
```

**Answers:**
- **L1:** "Faço mesmo sem querer para não decepcionar."
  - *Reasoning:* Conformismo, people-pleasing

- **L2:** "Digo 'não' e explico meus motivos."
  - *Reasoning:* Autonomia, boundaries

- **L3:** "Ofereço alternativa: não posso fazer X, mas posso ajudar de outra forma."
  - *Reasoning:* Integra meus limites + ajudar amigo

- **L4:** "Uso como oportunidade: por que tenho dificuldade de dizer não? Investigo padrão."
  - *Reasoning:* Meta-análise de padrões

---

### Domain 5: Philosophy (2 questions)

#### Question PH1: Meaning-Making

**Text:**
```
Você passa por fase de questionamento: "Qual o sentido da minha vida?" Como lida?
```

**Answers:**
- **L1:** "Busco resposta em religião, livro de autoajuda ou guru."
  - *Reasoning:* Delegação para autoridade

- **L2:** "Reflito sobre meus valores e construo meu próprio sentido."
  - *Reasoning:* Autonomia existencial

- **L3:** "Aceito que sentido pode mudar com contexto. Crio sentido flexível, não fixo."
  - *Reasoning:* Integra mudança, perspectivas múltiplas

- **L4:** "Questiono a pergunta: 'sentido' é conceito útil ou armadilha mental?"
  - *Reasoning:* Desconstrói categoria mental

---

#### Question PH2: Ethics

**Text:**
```
Você pode lucrar com algo legal, mas eticamente questionável. Como decide?
```

**Answers:**
- **L1:** "Se é legal, não há problema."
  - *Reasoning:* Lei = moralidade (conformismo)

- **L2:** "Avalio por meus valores pessoais, independente da lei."
  - *Reasoning:* Moral autônoma

- **L3:** "Considero múltiplas perspectivas (stakeholders, longo prazo, sistêmico) antes de decidir."
  - *Reasoning:* Síntese ética multi-dimensional

- **L4:** "Questiono: que tipo de pessoa quero me tornar? Decisão como prática de caráter."
  - *Reasoning:* Meta-ética (quem sou vs quem quero ser)

---

### Domain 6: Learning (2 questions)

#### Question L1: Meta-Learning

**Text:**
```
Você quer aprender skill nova (programação, idioma, etc). Como começa?
```

**Answers:**
- **L1:** "Faço curso mais popular/recomendado."
  - *Reasoning:* Segue autoridade

- **L2:** "Pesquiso métodos eficazes e monto plano de estudo próprio."
  - *Reasoning:* Pensamento crítico sobre aprendizagem

- **L3:** "Experimento múltiplos métodos (cursos, projetos, mentoria) e integro o que funciona."
  - *Reasoning:* Síntese de abordagens

- **L4:** "Primeiro aprendo como EU aprendo (estilos, bloqueios) para depois escolher método."
  - *Reasoning:* Meta-aprendizagem (aprender a aprender)

---

#### Question L2: Knowledge Integration

**Text:**
```
Você estuda dois frameworks que se contradizem. Como lida?
```

**Answers:**
- **L1:** "Escolho o de autor mais respeitado e descarto o outro."
  - *Reasoning:* Autoridade resolve contradição

- **L2:** "Analiso prós/contras de cada e escolho o que faz mais sentido."
  - *Reasoning:* Pensamento crítico, mas binário

- **L3:** "Exploro: em que contextos cada um é útil? Uso ambos como tools."
  - *Reasoning:* Integração contextual

- **L4:** "Crio framework próprio que sintetiza verdades de ambos."
  - *Reasoning:* Pensamento generativo

---

### Domain 7: Creativity (2 questions)

#### Question C1: Creative Process

**Text:**
```
Você precisa resolver problema criativo (design, copy, estratégia). Como aborda?
```

**Answers:**
- **L1:** "Vejo como outros resolveram e faço similar."
  - *Reasoning:* Cópia, conformismo

- **L2:** "Brainstorm próprio, exploro ideias originais."
  - *Reasoning:* Pensamento independente

- **L3:** "Combino referências diversas (arte, ciência, natureza) para gerar síntese única."
  - *Reasoning:* Cross-pollination, integração

- **L4:** "Questiono as constraints: por que precisa ser resolvido ASSIM? Reavalio problema."
  - *Reasoning:* Desconstrói frame

---

#### Question C2: Artistic Expression

**Text:**
```
Como você encara crítica ao seu trabalho criativo?
```

**Answers:**
- **L1:** "Fico defensivo ou desisto (trabalho = identidade)."
  - *Reasoning:* Ego fundido com criação

- **L2:** "Avalio se crítica é válida e ajusto se fizer sentido."
  - *Reasoning:* Separação obra/identidade

- **L3:** "Uso crítica como input: talvez revele blind spot ou nova perspectiva útil."
  - *Reasoning:* Integra feedback como ferramenta

- **L4:** "Agradeço: crítica revela como outros veem. Não muda obra, mas enriquece compreensão."
  - *Reasoning:* Perspectivas coexistem (não precisa concordar)

---

## 📁 Files to Create

### Migration File

```sql
-- supabase/migrations/20260201000002_seed_quiz_content.sql

-- Insert quiz questions and answers
-- (Full SQL with all 15 questions × 4 answers = 60 inserts)

-- Question B1
INSERT INTO quiz_questions (domain_id, question_text, question_type, order_index, level_target)
VALUES (
  (SELECT id FROM cognitive_domains WHERE name = 'Business'),
  'Sua startup precisa decidir entre duas estratégias: (A) Crescimento rápido com investimento externo (B) Crescimento orgânico mantendo controle. Como você aborda essa decisão?',
  'scenario',
  1,
  NULL
);

-- Answers B1
INSERT INTO quiz_answers (question_id, answer_text, level_score, order_index, reasoning)
VALUES
  ((SELECT id FROM quiz_questions WHERE order_index = 1),
   'Sigo o conselho do mentor mais respeitado na minha rede.',
   1,
   1,
   'Confia em autoridade externa'),

  ((SELECT id FROM quiz_questions WHERE order_index = 1),
   'Analiso prós e contras de cada opção e escolho a que faz mais sentido para minha visão.',
   2,
   2,
   'Pensamento crítico, mas binário'),

  -- ... (continue for all answers)
```

---

## 🧪 Testing Checklist

### Content Review
- [ ] 3 reviewers check for clarity
- [ ] Grammar/spelling check
- [ ] Cultural neutrality check
- [ ] Gender neutrality check

### Pilot Testing
- [ ] 5 users take full quiz
- [ ] Collect feedback on:
  - [ ] Question clarity
  - [ ] Answer plausibility
  - [ ] Time to complete (target: 10-12 min)
  - [ ] Emotional reaction (frustrating? engaging?)

### Scoring Validation
- [ ] Run scoring algorithm on pilot data
- [ ] Verify results match expected levels
- [ ] Check for skewed distributions (all users L2? Red flag)

### Technical Validation
- [ ] All questions load correctly
- [ ] All answers display in correct order
- [ ] Level scores calculated correctly
- [ ] No missing/broken references

---

## 📚 Reference

- **Cognitive Levels:** `00_Codex/Knowledge/Cognitive_Development/Thinking_Levels_Framework_LX_Synthesis.md`
- **Question Design:** Adult Development Theory (Kegan), Spiral Dynamics
- **Content Style Guide:** Accessible, scenario-based, culturally neutral

---

## ✅ Definition of Done

- [ ] 15 questions written (2-3 per domain)
- [ ] 60 answers written (4 per question)
- [ ] Migration file created and tested
- [ ] Content reviewed by 3+ people
- [ ] Pilot tested with 5 users
- [ ] Feedback incorporated
- [ ] Scoring produces expected results
- [ ] All data inserted into database

---

## 🚀 Next Steps

After this story:
- **Phase 1 Complete** 🎉
- **Story 052:** Altitude Dashboard (Phase 2 begins)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** Story 046 (Schema), Story 050 (Scoring)
**Blocks:** Phase 1 Launch

— River, removendo obstáculos 🌊
