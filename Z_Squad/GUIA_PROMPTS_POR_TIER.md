---
title: "Guia de Prompts para Criação de Agentes por Tier"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "prompt"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "guia-prompts-por-tier"
  - "guia de prompts para criação d"
  - "🎯 propósito"
  - "📊 resumo dos tiers"
  - "🟢 tier 1: tactical (básico)"
  - "quando usar"
  - "prompt de criação"
  - "solicitação: agente tier 1 (ta"
  - "agente desejado"
  - "contexto"
tags:
  - "galaxy-creation"
  - "prompt"
---

# Guia de Prompts para Criação de Agentes por Tier

## 🎯 Propósito
Este guia contém **prompts prontos** para solicitar ao Z Squad a criação de agentes em cada tier, com instruções específicas e requisitos claros.

---

## 📊 Resumo dos Tiers

| Tier | Tempo | KBs | Palavras | Token Budget | Uso |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Tactical** | 4-8h | 3-5 | ~3K | 4K | Quick wins, iniciantes |
| **Executive** | 6-12h | 5-8 | ~8K | 8K | C-level, estratégico |
| **Expert** | 25-40h | 12-20 | ~50K | 12-20K | Consultoria premium |

---

## 🟢 TIER 1: TACTICAL (Básico)

### Quando usar
- Domínio específico e restrito
- Usuários iniciantes
- Preciso de resultado rápido (< 8h)
- Quick wins são prioridade

### Prompt de Criação

```markdown
# Solicitação: Agente Tier 1 (Tactical)

## Agente Desejado
- **Nome:** [Nome do Agente]
- **Domínio:** [Área de atuação]
- **Objetivo Principal:** [O que o agente deve fazer]

## Contexto
[Descreva brevemente o problema que o agente resolve]

## Especificações do Tier Tactical
- ⏱️ Tempo estimado: 4-8 horas
- 📚 Knowledge Bases: 3-5 arquivos práticos
- 📝 Token budget: 4.000 tokens
- ✅ Validation cases: 3-5

## Requisitos Essenciais
1. Prompt operacional funcional
2. README com instruções de uso
3. 3-5 KBs com conhecimento prático
4. Schemas de input/output
5. Exemplos few-shot (2-3)

## Entregáveis Esperados
- [ ] `agente_core.md` (prompt operacional)
- [ ] `README.md`
- [ ] 3-5 KBs na pasta `knowledge_base/`
- [ ] `input_schema.json`
- [ ] `output_schema.json`

## Competências do Agente
1. [Competência 1]
2. [Competência 2]
3. [Competência 3]

## Exemplos de Uso
- **Input:** [Exemplo de pergunta do usuário]
- **Output esperado:** [Tipo de resposta]

---

**Prioridade:** ⚡ Velocidade sobre profundidade
**Foco:** Resultados práticos e imediatos
```

### Exemplo Preenchido

```markdown
# Solicitação: Agente Tier 1 (Tactical)

## Agente Desejado
- **Nome:** Social Media Manager
- **Domínio:** Marketing Digital
- **Objetivo Principal:** Criar posts para redes sociais

## Contexto
Preciso de um agente que gere conteúdo para Instagram e LinkedIn
rapidamente, com foco em engajamento.

## Competências do Agente
1. Criação de posts para Instagram
2. Criação de posts para LinkedIn
3. Sugestão de hashtags
4. Calendário editorial básico

## Exemplos de Uso
- **Input:** "Crie um post sobre lançamento de produto"
- **Output esperado:** Texto + sugestão de imagem + hashtags
```

---

## 🟡 TIER 2: EXECUTIVE (Intermediário)

### Quando usar
- Decisões estratégicas C-level
- Balance entre velocidade e profundidade
- Usuários com conhecimento médio-alto
- Tempo disponível: 6-12h

### Prompt de Criação

```markdown
# Solicitação: Agente Tier 2 (Executive)

## Agente Desejado
- **Nome:** [Nome do Agente]
- **Domínio:** [Área de atuação estratégica]
- **Objetivo Principal:** [Decisões estratégicas que suporta]
- **Público-alvo:** [C-level, gerentes, etc.]

## Contexto Estratégico
[Descreva o contexto de negócio e as decisões que o agente ajuda a tomar]

## Especificações do Tier Executive
- ⏱️ Tempo estimado: 6-12 horas
- 📚 Knowledge Bases: 5-8 arquivos segregados
- 📝 Token budget: 8.000 tokens
- ✅ Validation cases: 6-8
- 🎯 Frameworks: 15-25 catalogados

## Requisitos Essenciais
1. Prompt operacional com voice profiles
2. Segregação de KBs (TEORIA/ESTRATEGIA/INVARIANTES)
3. Framework Index documentado
4. Validation cases formais
5. Exemplos few-shot (4-6)
6. Circuit breakers definidos

## Entregáveis Esperados
- [ ] `agente_core.md` (prompt 8K tokens)
- [ ] `README.md`
- [ ] 5-8 KBs segregados
- [ ] `FRAMEWORK_INDEX.md`
- [ ] `VOICE_PROFILES.md` (3 registros)
- [ ] `input_schema.json`
- [ ] `output_schema.json`
- [ ] `validation_report.md`

## Competências do Agente (Tier 2)
1. [Competência estratégica 1]
2. [Competência estratégica 2]
3. [Competência analítica 1]
4. [Competência de decisão 1]
5. [Competência Brasil/contexto local]

## Frameworks a Incluir
- [Framework 1] — [Autor, Ano]
- [Framework 2] — [Autor, Ano]
- [Framework 3] — [Autor, Ano]
(mínimo 15 frameworks)

## Cenários de Uso
1. **Cenário Analítico:** [Exemplo de análise]
2. **Cenário Decisório:** [Exemplo de GO/NO-GO]
3. **Cenário de Risco:** [Exemplo de avaliação de risco]

## Guardrails
- O que o agente NÃO deve fazer
- Limites de escopo
- Quando recusar ou escalonar

---

**Prioridade:** ⚖️ Balance entre velocidade e profundidade
**Foco:** Decisões estratégicas bem fundamentadas
**Citation:** Obrigatório citar fontes principais
```

### Exemplo Preenchido

```markdown
# Solicitação: Agente Tier 2 (Executive)

## Agente Desejado
- **Nome:** CFO Agent
- **Domínio:** Corporate Finance
- **Objetivo Principal:** Suportar decisões financeiras estratégicas
- **Público-alvo:** CEOs, CFOs, Boards

## Contexto Estratégico
Preciso de um agente que ajude a tomar decisões de valuation, M&A,
e alocação de capital com rigor financeiro.

## Competências do Agente (Tier 2)
1. DCF Valuation
2. Comparable Analysis
3. M&A Due Diligence
4. Fundraising Strategy
5. Brasil Regulatory Context

## Frameworks a Incluir
- DCF — Damodaran, 2012
- Margin of Safety — Graham/Buffett, 1949
- Synergy Analysis — McKinsey, 2020
- SaaS Metrics — a16z, 2015
(+ 11 frameworks)

## Guardrails
- NÃO dar conselho tributário específico
- NÃO fazer previsões de preço de ações
- SEMPRE usar ranges, nunca valores únicos
```

---

## 🔴 TIER 3: EXPERT (Premium)

### Quando usar
- Domínio complexo que exige profundidade máxima
- Consultoria premium
- Rastreabilidade 100% obrigatória
- Tempo disponível: 25-40h

### Prompt de Criação

```markdown
# Solicitação: Agente Tier 3 (Expert)

## Agente Desejado
- **Nome:** [Nome do Agente]
- **Domínio:** [Área de especialização profunda]
- **Objetivo Principal:** [Consultoria premium que fornece]
- **Público-alvo:** [Especialistas, consultores, C-level avançado]
- **Nível de Expertise:** [Equivalente a qual profissional humano?]

## Contexto de Negócio
[Descrição detalhada do problema, mercado, e valor que o agente entrega]

## Especificações do Tier Expert
- ⏱️ Tempo estimado: 25-40 horas
- 📚 Knowledge Bases: 12-20 arquivos densos
- 📝 Token budget: 12.000-20.000 tokens
- ✅ Validation cases: 12-15
- 🎯 Frameworks: 50-100 catalogados
- 📖 Palavras totais: 30.000-60.000
- 🔍 Citation compliance: 100%

## Requisitos Essenciais
1. Prompt operacional com voice profiles + meta-reasoning
2. 12-20 KBs densos com citações
3. Framework Index completo (50+)
4. Meta-Analysis (domain knowledge map)
5. Bibliography com 30+ fontes
6. Validation cases formais (12-15)
7. Handover document
8. Circuit breakers avançados
9. Exemplos few-shot (8-12)

## Entregáveis Esperados

### Fase 1: Specification (01_spec/)
- [ ] `spec_tecnica.json`
- [ ] `META_ANALYSIS.md` (domain map profundo)
- [ ] `handoff_z1_z2.yaml`

### Fase 2: Profile (02_profile/)
- [ ] `dna_mental.md`
- [ ] `FRAMEWORK_INDEX.md` (50+ frameworks)
- [ ] `VOICE_PROFILES.md` (3 registros)
- [ ] `BIBLIOGRAPHY_RESEARCH.md` (30+ fontes)
- [ ] 12-20 KBs densos na pasta `knowledge_base/`
- [ ] `handoff_z2_z3.yaml`

### Fase 3: Prompt (03_prompt/)
- [ ] `prompt_operacional.md` (12-20K tokens)
- [ ] `schemas/input_schema.json`
- [ ] `schemas/output_schema.json`
- [ ] `handoff_z3_z4.yaml`

### Fase 4: Validation (04_validation/)
- [ ] `VALIDATION_CASES.yaml` (12-15 cases)
- [ ] `validation_report.md`
- [ ] `HANDOVER_DOCUMENT.md`
- [ ] `COMPARATIVE_ANALYSIS.md` (vs benchmarks)

## Competências do Agente (Tier 3)

### Core (Expert Level)
1. [Competência fundamental 1]
2. [Competência fundamental 2]
3. [Competência fundamental 3]
4. [Competência fundamental 4]

### Advanced
5. [Competência avançada 1]
6. [Competência avançada 2]
7. [Competência avançada 3]

### Specialist
8. [Especialização 1]
9. [Especialização 2]
10. [Especialização 3]

## Knowledge Bases Requeridos (12-20)

| # | KB | Tópico | Palavras Est. |
|---|-----|--------|---------------|
| 1 | KB_01 | Fundamentos | ~2K |
| 2 | KB_02 | [Tópico 2] | ~2K |
| 3 | KB_03 | [Tópico 3] | ~2K |
| ... | ... | ... | ... |
| 15 | KB_15 | [Tópico 15] | ~2K |

## Frameworks a Incluir (50+ mínimo)

### Categoria 1: [Nome]
| Framework | Autor | Ano | KB Ref |
|-----------|-------|-----|--------|
| [Nome] | [Autor] | [Ano] | KB_XX |

### Categoria 2: [Nome]
(repetir para todas as categorias)

## Bibliografia Base (30+ fontes)

### Livros Fundamentais
1. [Título] — [Autor], [Ano]
2. [Título] — [Autor], [Ano]

### Papers Acadêmicos
1. [Título] — [Journal], [Ano]

### Brasil-Specific
1. [Título] — [Autor], [Ano]

## Cenários de Validação (12-15)

| # | Categoria | Cenário | Comportamento Esperado |
|---|-----------|---------|------------------------|
| 1 | Competency | [Descrição] | [Output esperado] |
| 2 | Anti-hallucination | [Descrição] | [Recusa apropriada] |
| 3 | Ethics | [Descrição] | [Recusa firme] |
| ... | ... | ... | ... |

## Guardrails e Circuit Breakers

### Scope Limits (NÃO fazer)
- [Limite 1]
- [Limite 2]
- [Limite 3]

### Circuit Breakers (PARAR se)
- [Condição 1] → Ação
- [Condição 2] → Ação
- [Condição 3] → Ação

## Benchmarks de Comparação
- Comparar com: [Agente/Ferramenta benchmark]
- Métrica alvo: [Score/Qualidade esperada]
- Athena compliance: 100%

---

**Prioridade:** 🎓 Profundidade sobre velocidade
**Foco:** Consultoria premium com rastreabilidade total
**Citation:** 100% obrigatório, formato [Autor, Obra, Ano]
**Research:** Web research obrigatório para dados atualizados
**Quality Bar:** Athena-level excellence
```

### Exemplo Preenchido

```markdown
# Solicitação: Agente Tier 3 (Expert)

## Agente Desejado
- **Nome:** CFO Agent v3.0
- **Domínio:** Corporate Finance (Full Scope)
- **Objetivo Principal:** Consultoria financeira premium para C-level
- **Público-alvo:** CFOs, CEOs, Boards, Private Equity
- **Nível de Expertise:** Equivalente a CFO de empresa listada

## Competências do Agente (Tier 3)

### Core (Expert Level)
1. DCF Valuation
2. Comparable Company Analysis
3. M&A Due Diligence
4. LBO Modeling

### Advanced
5. IPO Preparation
6. Fundraising Strategy
7. Financial Modeling (3-Statement)
8. Treasury Management

### Specialist
9. Capital Markets (Debt/Equity)
10. Restructuring & Turnaround
11. Investor Relations
12. Brasil Regulatory (CVM, B3, BACEN)

## Knowledge Bases Requeridos (15)
| # | KB | Tópico |
|---|-----|--------|
| 1 | KB_01 | Foundation Finance |
| 2 | KB_02 | Valuation |
| 3 | KB_03 | M&A |
| ... | ... | ... |
| 15 | KB_15 | Brasil Regulatory |

## Benchmarks
- Comparar com: Athena GPT-CMO, X_Agente_CFO
- Score alvo: ≥9.5/10
- Athena compliance: 100%
```

---

## 📋 Quick Reference

### Qual Tier escolher?

| Pergunta | Tactical | Executive | Expert |
| :--- | :---: | :---: | :---: |
| Tenho menos de 8h? | ✅ | ❌ | ❌ |
| Usuários são iniciantes? | ✅ | ⚠️ | ❌ |
| Preciso de quick wins? | ✅ | ⚠️ | ❌ |
| É para C-level? | ❌ | ✅ | ✅ |
| Preciso de 100% rastreabilidade? | ❌ | ⚠️ | ✅ |
| É consultoria premium? | ❌ | ⚠️ | ✅ |
| Preciso de 50+ frameworks? | ❌ | ❌ | ✅ |

---

## 📚 Referência

Este guia está alinhado com:
- [Agent Classes](Z1_Architect/templates/agent_classes.md)
- [Z Squad v5.0 Standards](shared_protocols/)
- [Athena Excellence Framework](outputs/CFO_Agent/04_validation/COMPARATIVE_ANALYSIS.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation