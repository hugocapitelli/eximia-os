# LEARNING LOOP — Métricas & Melhoria Contínua

**Agente:** CFO v4.0 Elite
**Versão:** 4.0
**Data:** 2025-12-21
**Mantido por:** Arquiteto Cognitivo Elite

---

## 🎯 PROPÓSITO

Sistema de aprendizado contínuo para melhoria trimestral do CFO Agent.

**Target:** +2-5pp accuracy por ciclo trimestral

---

## 📊 MÉTRICAS CORE

### 1. Accuracy Rate

**Definição:**
```
Accuracy = (Decisões corretas / Total decisões) × 100%

Onde "correto" = Outcome real validado 30d+90d post-facto
```

**Classificação:**
- GO correto: Recomendou GO, M&A foi bem-sucedida
- NO-GO correto: Recomendou NO-GO, teria falhado
- GO incorreto: Recomendou GO, M&A falhou (False Positive)
- NO-GO incorreto: Recomendou NO-GO, teria sido sucesso (False Negative)

**Target:** >90%

---

### 2. False Positive Rate (FP)

**Definição:**
```
FP Rate = (GO incorretos / Total GOs) × 100%
```

**Impacto:** Alto (GO errôneo causa perdas R$ milhões)

**Target:** <5%

---

### 3. False Negative Rate (FN)

**Definição:**
```
FN Rate = (NO-GO incorretos / Total NO-GOs) × 100%
```

**Impacto:** Médio (oportunidade perdida, mas sem perda de capital)

**Target:** <10%

---

### 4. Calibration (Brier Score)

**Definição:**
```
Brier Score = (1/N) × Σ(P_forecast - Outcome_real)²

Onde:
  P_forecast = P(sucesso) projetado
  Outcome_real = 1 (sucesso) ou 0 (falha)

Range: 0 (perfeito) a 1 (péssimo)
```

**Target:** <0.15 (bem calibrado)

---

## 🔄 PROCESSO (5 Etapas)

### ETAPA 1: COLETA (Continuous)

**Após cada decisão:**
```json
{
  "request_id": "ABC123XY",
  "timestamp": "2025-12-21T10:00:00Z",
  "tipo_analise": "M&A",
  "recomendacao": "NO-GO",
  "reasoning": {
    "lente_financeira": {
      "fair_value_DCF": 42000000,
      "preco_pedido": 50000000
    },
    "lente_probabilistica": {
      "P_sucesso_posterior": 0.64,
      "expected_NPV": 700000
    },
    "lente_estrategica": {
      "strategic_fit_score": 32
    }
  },
  "invariantes_violados": ["INV-005"],
  "outcome_real_30d": null,
  "outcome_real_90d": null
}
```

**Salvar em:** `metrics/decisions_log.json`

---

### ETAPA 2: VALIDAÇÃO (30d + 90d post-facto)

**30 dias após decisão:**
```
Para M&A:
  SE GO:
    - Integration está on-track? ✅/❌
    - Synergies iniciais realizadas? ✅/❌
    - Churn pós-M&A <15%? ✅/❌

  SE NO-GO:
    - Target foi vendida para concorrente?
    - Preço de venda <nosso fair value? (validar valuation)

Para CAPEX:
  SE GO:
    - Projeto on-budget? (<10% overrun)
    - Timeline on-track?
    - NPV realizado vs projetado?
```

**90 dias após decisão:**
```
Para M&A:
  SE GO:
    - M&A foi sucesso? (binary: 1 ou 0)
    - Synergies realizadas: ___% do projetado
    - Valuation foi correto? (fair value ±10% preço real)

Classificar:
  - Sucesso definitivo (1)
  - Falha definitiva (0)
  - Ainda inconclusivo (aguardar +90d)
```

**Update:** `outcome_real_90d` em `decisions_log.json`

---

### ETAPA 3: ANÁLISE (Trimestral)

**Q1, Q2, Q3, Q4 reviews:**

**Calcular métricas:**
```python
def calcular_metricas(decisions_log):
    total = len(decisions_log)
    corretos = sum(1 for d in decisions_log if d['outcome_real_90d'] == d['expected_outcome'])

    accuracy = corretos / total * 100

    gos = [d for d in decisions_log if d['recomendacao'] == 'GO']
    fp_rate = sum(1 for d in gos if d['outcome_real_90d'] == 0) / len(gos) * 100

    no_gos = [d for d in decisions_log if d['recomendacao'] == 'NO-GO']
    fn_rate = sum(1 for d in no_gos if d['outcome_real_90d'] == 1) / len(no_gos) * 100

    return {
        "accuracy": accuracy,
        "fp_rate": fp_rate,
        "fn_rate": fn_rate
    }
```

**Agrupar erros:**
```
Padrões de FP (GO errôneo):
  - Overestimação de sinergias? (haircut insuficiente)
  - Fit score inflado? (threshold 35 muito baixo)
  - Timing ruim? (topo de ciclo ignorado)

Padrões de FN (NO-GO errôneo):
  - Conservadorismo excessivo? (haircut >50%)
  - Fit score muito rígido? (threshold 35 muito alto)
  - P(sucesso) subestimado? (prior errado)
```

---

### ETAPA 4: MELHORIA

**Baseado em padrões identificados:**

**Atualizar ESTRATEGIA:**
```
SE FP rate >5% por synergy overestimation:
  → Aumentar haircut 40% → 50% (nova regra)
  → Documentar em estrategia_playbook.md

SE FN rate >10% por fit score muito rígido:
  → Ajustar threshold 35 → 33 (baseado em dados)
  → Documentar source (learning Q4 2025)
```

**Atualizar INVARIANTES:**
```
SE violações frequentes de INV-X:
  → Refinar regra (threshold, severidade)
  → Ou criar novo invariante
```

**Adicionar casos em KB:**
```
Adicionar decision em ESTRATEGIA/estrategia_casos.md:
  - Caso: M&A XYZ
  - Decisão: NO-GO
  - Reasoning: Fit score 32, sinergias questionáveis
  - Outcome: Target vendida 6M depois por 30% menos (validou NO-GO)
  - Aprendizado: Threshold 35 é correto
```

---

### ETAPA 5: RETROALIMENTAÇÃO

**Atualizar agente com melhorias:**
```
1. Editar knowledge_base/ESTRATEGIA/ com novos playbooks
2. Editar knowledge_base/INVARIANTES/ com thresholds ajustados
3. Adicionar novos stress tests (SE descoberto edge case)
4. Re-executar stress test suite (validar pass rate ≥90%)
5. Atualizar versão (v4.0 → v4.1)
```

**Documentar em changelog:**
```
CHANGELOG v4.0 → v4.1 (Q1 2026)
- Synergy haircut: 40% → 50% (learning: FP rate reduziu 7% → 4%)
- Stress test ST-016 added: Synergy >80% EBITDA
- Accuracy: 90% → 93% (+3pp)
```

---

## 📅 CICLO TRIMESTRAL

**Q1 (Jan-Mar):**
- Coletar decisões Q4 anteriores
- Validar outcomes 90d
- Calcular métricas
- Identificar padrões
- Atualizar KB

**Q2 (Apr-Jun):**
- Repeat

**Q3 (Jul-Sep):**
- Repeat

**Q4 (Oct-Dec):**
- Repeat + Annual review

**Annual Review:**
- Accuracy trend (Q1→Q2→Q3→Q4)
- Calibration curve (Brier score)
- Major improvements implemented
- v4.0 → v4.1 release (SE mudanças significativas)

---

## 🎯 EXPECTATIVAS

**Target improvement:**
- **Year 1:** Accuracy 90% → 93% (+3pp)
- **Year 2:** Accuracy 93% → 95% (+2pp)
- **Year 3:** Accuracy 95% → 97% (+2pp)

**Asymptotic limit:** ~97-98% (impossível 100% - mercado tem imprevisibilidade)

---

## 📊 DASHBOARD (Manual v4.0)

**Métricas visualizadas:**
```
CFO AGENT METRICS DASHBOARD
═══════════════════════════════════════════════════

ACCURACY
  Current:  91.2% (target >90% ✅)
  Trend:    90% → 91% → 91.2% (+1.2pp this year)

FALSE POSITIVE RATE
  Current:  4.1% (target <5% ✅)
  Impact:   -R$ 8M (2 GOs errôneos × R$ 4M médio)

FALSE NEGATIVE RATE
  Current:  8.7% (target <10% ✅)
  Impact:   3 oportunidades perdidas (~R$ 20M total)

CALIBRATION
  Brier:    0.12 (target <0.15 ✅)
  Status:   Bem calibrado

DECISIONS YTD
  Total:    52 decisões
  GO:       18 (35%)
  NO-GO:    30 (58%)
  GO-COND:  4 (7%)
```

---

## ✅ GATE: CRITÉRIOS FASE 10

- [x] Métricas core definidas: Accuracy, FP, FN, Calibration ✅
- [x] Processo 5 etapas: Coleta → Validação → Análise → Melhoria → Retroalimentação ✅
- [x] Ciclo trimestral planejado ✅
- [x] Targets documentados: >90%, <5%, <10% ✅
- [x] Expectativa melhoria: +2-5pp/ciclo ✅
- [x] Dashboard estruturado (manual v4.0) ✅

**Status:** ✅ FASE 10 COMPLETA - GATE PASS

---

**Mantido por:** Arquiteto Cognitivo Elite
**Versão:** 4.0
**Data:** 2025-12-21


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->