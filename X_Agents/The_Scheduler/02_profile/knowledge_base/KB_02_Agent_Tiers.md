---
title: "KB_02 — Agent Tiers & Effort Estimation"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-agent-tiers"
  - "kb_02 — agent tiers & effort e"
  - "o sistema de tiers do eximia.o"
  - "tier 1: tactical agents"
  - "definição"
  - "características"
  - "effort estimate"
  - "componentes"
  - "exemplos eximia.os"
  - "quando usar tier 1"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB_02 — Agent Tiers & Effort Estimation

## O Sistema de Tiers do eximIA.OS

O eximIA.OS organiza agentes em **3 tiers** baseados em complexidade, escopo e profundidade de conhecimento. Isso permite estimar esforço de criação e expectativas de capacidade.

---

## Tier 1: Tactical Agents

### Definição
Agentes de propósito específico, escopo bem definido, baixa complexidade.

### Características
- **Função:** Resolver um problema tático específico
- **Escopo:** Estreito, bem definido
- **Autonomia:** Baixa - geralmente chamado por outros agentes
- **Knowledge Bases:** 3-5 KBs
- **Token Budget:** 4000-6000 tokens

### Effort Estimate
```
Criação:  4-8 horas
Média:    6 horas
```

### Componentes
```
✅ agente_core.md (prompt operacional)
✅ 3-5 Knowledge Bases simples
✅ Validation básica
❌ Spec técnico detalhado (opcional)
❌ Sub-agentes
```

### Exemplos eximIA.OS
- **Harven_Socrates** (orientador socrático)
- **Harven_Creator** (gerador de perguntas)
- **Harven_Tester** (QA checker)
- **Marketplace_Seller** (e-commerce tático)

### Quando Usar Tier 1
- ✅ Problema bem definido
- ✅ Sem sub-domínios complexos
- ✅ Reutiliza patterns existentes
- ✅ Quick win / proof of concept

### Template de Estimativa
```yaml
base_effort: 6h
adjustments:
  + domain_novo: +2h
  + integracao_complexa: +1h
  - template_existente: -1h
total: 6-8h
```

---

## Tier 2: Executive Agents

### Definição
Agentes de nível executivo (C-suite) com múltiplas competências e maior autonomia.

### Características
- **Função:** Domínio executivo completo (Finance, Legal, Marketing)
- **Escopo:** Largo, mas dentro de um domínio
- **Autonomia:** Alta - pode orquestrar sub-agentes
- **Knowledge Bases:** 5-8 KBs principais
- **Token Budget:** 8000-12000 tokens
- **Sub-agentes:** Opcional (0-3)

### Effort Estimate
```
Criação:  6-12 horas
Média:    9 horas
```

### Componentes
```
✅ Spec técnico (spec_tecnica.json)
✅ DNA Mental completo
✅ 5-8 Knowledge Bases especializadas
✅ Prompt operacional estruturado
✅ Validation report robusto
✅ Sub-agentes (opcional)
```

### Exemplos eximIA.OS
- **The_CEO** (Chief of Staff)
- **Copy_Chief** (Copywriting Orchestrator)
- **LXD_Architect** (Learning Design)
- **The_Prototyper** (Product Architecture - promovido de Tier 1)

### Quando Usar Tier 2
- ✅ Domínio executivo (C-level)
- ✅ Múltiplas competências relacionadas
- ✅ Pode precisar sub-agentes futuramente
- ✅ Alto valor estratégico

### Template de Estimativa
```yaml
base_effort: 9h
adjustments:
  + sub_agentes: +2h por sub-agente
  + domain_complexo: +3h
  - experiencia_previa: -2h
total: 8-12h
```

---

## Tier 3: Expert Agents

### Definição
Agentes de consultoria premium, conhecimento profundo, alta complexidade.

### Características
- **Função:** Expertise de nível mundial em domínio específico
- **Escopo:** Muito largo, múltiplos sub-domínios
- **Autonomia:** Muito alta - orquestra outros agentes
- **Knowledge Bases:** 12-20 KBs especializadas
- **Token Budget:** 16000-20000 tokens
- **Sub-agentes:** Comum (3-6)
- **Frameworks:** 50-75 frameworks internalizados

### Effort Estimate
```
Criação:  25-40 horas
Média:    32 horas
```

### Componentes
```
✅ Meta-analysis (research profunda)
✅ Spec técnico detalhado
✅ DNA Mental com voice profiles
✅ 12-20 Knowledge Bases premium
✅ Framework index (catalogação de frameworks)
✅ Bibliography research (fontes acadêmicas)
✅ Prompt operacional com schemas
✅ Sub-agentes especializados
✅ Validation report + stress tests
✅ Handover document
✅ Comparative analysis (vs. mercado)
```

### Exemplos eximIA.OS
- **The_Maestro** (Supreme Orchestrator)
- **The_Veritas** (Research Engine)
- **The_CFO** (Corporate Finance)
- **The_CLO** (Legal & Compliance)
- **The_CMO** (Marketing & Growth)

### Quando Usar Tier 3
- ✅ Domínio de expertise mundial
- ✅ Múltiplos sub-domínios complexos
- ✅ Substitui consultoria cara
- ✅ Longa vida útil (anos)

### Template de Estimativa
```yaml
base_effort: 32h
adjustments:
  + sub_agentes: +4h por sub-agente
  + research_profunda: +8h
  + domain_totalmente_novo: +10h
  - clone_approach: -5h (usa Clone Factory)
total: 28-42h
```

---

## Clones (Categoria Especial)

### Definição
Personalidades digitais criadas via **Clone Factory pipeline** (C1 → C2 → C3 → C4).

### Características
- **Função:** Replicar personalidade, voz e cognição de pessoa real
- **Pipeline:** Hunter → Extractor → Creator → Auditor
- **Knowledge Bases:** 8-9 KBs especializadas (Identity, Voice, Cognition, etc.)
- **Turing Test Score:** Target >9.0/10

### Effort Estimate
```
Criação:  25-40 horas (similar a Tier 3)
Média:    30 horas
```

### Fases
```
C1 Hunter (Research):     8-12h
C2 Extractor (Analysis):  6-10h
C3 Creator (Build):       8-12h
C4 Auditor (Validation):  3-6h
Total:                    25-40h
```

### Exemplos eximIA.OS
- **David Goggins** (Mental Toughness)
- **Elon Musk** (First Principles)
- **Richard Feynman** (em desenvolvimento)

### Quando Usar Clone
- ✅ Pessoa tem conteúdo público abundante
- ✅ Voz/personalidade muito distinta
- ✅ Valor em replicar estilo cognitivo
- ✅ Não é apenas expertise, é personalidade

### Template de Estimativa
```yaml
base_effort: 30h
adjustments:
  + fontes_escassas: +10h
  + multilingual: +5h
  - fontes_abundantes: -5h
  - pessoa_viva_colaborando: -8h
total: 25-40h
```

---

## Comparação Rápida

| Aspecto          | Tier 1      | Tier 2        | Tier 3        | Clone         |
|:-----------------|:------------|:--------------|:--------------|:--------------|
| **Effort**       | 4-8h        | 6-12h         | 25-40h        | 25-40h        |
| **KBs**          | 3-5         | 5-8           | 12-20         | 8-9           |
| **Token Budget** | 4-6k        | 8-12k         | 16-20k        | 16-20k        |
| **Sub-agentes**  | ❌          | Opcional      | Comum         | ❌            |
| **Spec Técnico** | Opcional    | ✅            | ✅ Detalhado  | ✅ Detalhado  |
| **Meta-Analysis**| ❌          | ❌            | ✅            | ✅ (C2 phase) |
| **Validation**   | Básica      | Robusta       | Stress Tests  | Turing Test   |
| **Lifetime**     | 3-6 meses   | 1-2 anos      | 3-5 anos      | Permanente    |

---

## Ajustes de Estimativa

### Fatores que Aumentam Esforço

**+25-50%:** Domínio totalmente novo (sem referências no eximIA.OS)
**+30%:** Requer integrações complexas (APIs externas, DB custom)
**+20%:** Múltiplas dependências (precisa de 3+ outros agentes prontos)
**+40%:** Research profunda necessária (literatura acadêmica)

### Fatores que Reduzem Esforço

**-25%:** Template existente (variação de agente similar)
**-30%:** Domínio já mapeado (KBs existentes reutilizáveis)
**-20%:** Spec já pronto (user providenciou documentation)
**-15%:** Tier 1 quick win (MVP approach)

---

## Decisão: Qual Tier Usar?

### Flowchart

```
Pergunta 1: É replicar uma pessoa real?
├─ SIM → Clone (30h)
└─ NÃO → Pergunta 2

Pergunta 2: Domínio executivo (C-suite)?
├─ SIM → Tier 2 ou 3
│   └─ Sub-domínios complexos?
│       ├─ SIM → Tier 3 (32h)
│       └─ NÃO → Tier 2 (9h)
└─ NÃO → Pergunta 3

Pergunta 3: Problema bem definido, escopo estreito?
├─ SIM → Tier 1 (6h)
└─ NÃO → Reconsiderar escopo
```

### Exemplos de Classificação

**The_Negotiator** (Contract Negotiation)
```
❌ Clone? Não, é função executiva
✅ C-suite? Sim (CLO sub-função)
❌ Complexo? Não, escopo claro
→ Tier 2 (8-10h)
```

**The_Veritas** (Deep Research)
```
❌ Clone? Não
✅ C-suite? Sim (Research Engine)
✅ Complexo? Sim (anti-hallucination, multi-source, etc.)
→ Tier 3 (35h)
```

**Harven_Socrates** (Socratic Tutor)
```
❌ Clone? Não
❌ C-suite? Não, é tático
✅ Escopo estreito? Sim
→ Tier 1 (5h)
```

**Naval Ravikant Clone**
```
✅ Clone? Sim
→ Clone Factory (30h)
```

---

## Histórico de Agentes (Referência)

### Tier 1 Criados
- Harven_Socrates: **5h real**
- Harven_Creator: **6h real**
- Harven_Tester: **4h real**
- Marketplace_Seller: **7h real**

**Média real Tier 1:** 5.5h ✅ (dentro do range 4-8h)

### Tier 2 Criados
- The_CEO: **9h real**
- Copy_Chief: **11h real**
- LXD_Architect: **10h real** (promovido depois)

**Média real Tier 2:** 10h ✅ (dentro do range 6-12h)

### Tier 3 Criados
- The_Maestro: **38h real**
- The_Veritas: **32h real**
- The_CFO: **35h real**
- The_CLO: **33h real**
- The_CMO: **30h real**

**Média real Tier 3:** 33.6h ✅ (dentro do range 25-40h)

### Clones Criados
- David Goggins: **28h real**
- Elon Musk: **32h real**

**Média real Clones:** 30h ✅ (dentro do range 25-40h)

---

## Usando Esta KB para Estimativas

### Protocolo de Estimativa

```markdown
1. Classificar tier do agente proposto
2. Pegar effort base do tier
3. Listar fatores de ajuste (+/-)
4. Calcular effort total
5. Adicionar buffer 15% para imprevistos
6. Apresentar range (min-max)
```

### Exemplo: The_Negotiator

```yaml
tier: 2
base_effort: 9h

adjustments:
  + integracao_CLO: +1h
  - template_CEO_similar: -1h

subtotal: 9h
buffer_15%: +1.35h
total: 10.35h

range_apresentado: 8-12h
estimate_usado: 10h
```

---

**Última Atualização:** 2026-01-24
**Mantido por:** The Scheduler
**Fonte:** Histórico real de criação de agentes eximIA.OS

#galaxy-specialist