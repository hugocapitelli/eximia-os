# Clone Factory — Pipeline Guide

## 🎯 Propósito
Este guia explica como usar o Clone Factory para criar clones de alta fidelidade de especialistas humanos.

---

## 📋 Table of Contents

1. [Visão Geral do Pipeline](#1-visão-geral-do-pipeline)
2. [Como Solicitar um Clone](#2-como-solicitar-um-clone)
3. [Quality Gates por Fase](#3-quality-gates-por-fase)
4. [Troubleshooting](#4-troubleshooting)

---

## 1. Visão Geral do Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                  CLONE FACTORY PIPELINE                           │
│                                                                   │
│   🔍 VALIDATION → 📚 RESEARCH → ⚙️ ETL → 🧬 GENERATION → ✅ AUDIT │
│       (1-2h)        (4-6h)      (2-4h)     (4-6h)         (2-3h)  │
│                                                                   │
│   Total: 13-21 horas para clone de alta fidelidade               │
└──────────────────────────────────────────────────────────────────┘
```

| Fase | Módulo | Função | Deliverables |
| :---: | :--- | :--- | :--- |
| **0** | C0 Validator | **Gate de viabilidade** | `validation_report.md` |
| **1** | C1 Hunter | Coleta massiva via Veritas | `1_raw_data/` (50+ fontes) |
| **2** | C2 Extractor | Estruturação de dados | `2_structured_data/` (JSON) |
| **3** | C3 Creator | Geração de artefatos | `3_clone_output/` (9+ KBs) |
| **4** | C4 Auditor | Validação + Turing Test | `validation_report.md` |

### ⚠️ Phase 0 Gate (NOVO)

O **C0 Validator** avalia viabilidade ANTES do pipeline iniciar:
- Score de viabilidade (0-100)
- Mapeamento de gaps por dimensão
- Decisão: ✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

**Pipeline só inicia se C0 retornar APPROVED ou CONDITIONAL com gaps aceitos.**

---

## 2. Como Solicitar um Clone

### Passo 1: Definir o Especialista
```markdown
# Clone Request

## Target
- **Nome:** David Goggins
- **Domínio:** Performance Mental / Ultra-Endurance
- **Arquétipo:** Guerreiro / Motivador Extremo

## Objetivo
Criar um clone que atue como coach de mentalidade de elite, 
capaz de desafiar e empurrar usuários além de seus limites.

## Escopo
### Incluir
- Filosofia de mental toughness
- Metodologias (40% Rule, Accountability Mirror, Cookie Jar)
- Estilo de comunicação confrontacional

### Excluir
- Conteúdo médico específico
- Conselhos de treinamento físico detalhado
```

### Passo 2: Executar C1 Hunter
O C1 Hunter usa **The_Veritas** para pesquisa profunda:
- YouTube: Podcasts, entrevistas, palestras
- Web: Artigos, biografias, análises
- Social: Twitter/X, Instagram, Facebook
- Livros: Resumos e trechos-chave

### Passo 3: Revisar `1_raw_data/`
Antes de avançar, verificar:
- [ ] ≥50 fontes coletadas?
- [ ] Cobertura de todos os aspectos (Identity, Cognition, Voice, Behavior)?
- [ ] Quality score ≥85%?

### Passo 4: Executar C2 → C3 → C4
O pipeline continua automaticamente, com handoffs estruturados.

### Passo 5: Validar Clone
Se C4 Auditor retornar **PASS (≥9.0)**, o clone está pronto.
Se **FAIL**, revisar e reprocessar com C3.

---

## 3. Quality Gates por Fase

### FASE 1: RESEARCH

| Critério | Mínimo | Ideal | Peso |
| :--- | :---: | :---: | :---: |
| Total de fontes | 30 | 50+ | 25% |
| Podcasts/Entrevistas (1h+) | 5 | 10+ | 25% |
| Artigos/Web pages | 15 | 20+ | 20% |
| Social media | Compilado | Detalhado | 15% |
| Gaps críticos | 0 | 0 | 15% |

**Score mínimo para avançar:** 80%

---

### FASE 2: ETL

| Critério | Mínimo | Ideal | Peso |
| :--- | :---: | :---: | :---: |
| Quotes extraídas | 30 | 50+ | 25% |
| Voice signature | Completa | Profunda | 25% |
| Timeline events | 15 | 25+ | 20% |
| Entities mapeadas | 30 | 50+ | 20% |
| JSON válido | 100% | 100% | 10% |

**Score mínimo para avançar:** 80%

---

### FASE 3: GENERATION

| Critério | Mínimo | Ideal | Peso |
| :--- | :---: | :---: | :---: |
| Crenças no DNA Mental | 5 | 7+ | 20% |
| Frameworks documentados | 3 | 5+ | 20% |
| Knowledge Bases | 5 | 9+ | 20% |
| Q&A pairs | 50 | 100+ | 15% |
| System prompt chars | ≤10K | ≤8K | 15% |
| Anti-jailbreak KB | ✅ | ✅ | 10% |

**Score mínimo para avançar:** 85%

---

### FASE 4: VALIDATION

| Critério | Mínimo | Ideal | Peso |
| :--- | :---: | :---: | :---: |
| Turing Test score | 8.5 | 9.5+ | 40% |
| Style compliance | 90% | 100% | 25% |
| Ethics compliance | 100% | 100% | 20% |
| Anti-jailbreak | Pass | Pass | 15% |

**Score mínimo para APROVAÇÃO:** 9.0/10

---

## 4. Troubleshooting

### "O clone não soa autêntico"

1. Verificar se `voice_signature.json` tem dados suficientes
2. Revisar `05_style_guide.md` — vocabulário específico?
3. Aumentar exemplos em `06_qna_base.jsonl`
4. Retornar a Fase 1 para mais podcasts/entrevistas

### "Score de Turing Test baixo"

1. Analisar quais cenários falharam
2. Identificar gaps de conhecimento
3. Fortalecer KBs nas áreas fracas
4. Re-executar Fase 3 → Fase 4

### "Clone foi REJECTED pelo C4"

1. Ler motivos em `validation_report.md`
2. Se ético → revisar `04_dna_mental.md`
3. Se fidelidade → voltar a Fase 1 para mais pesquisa
4. Se técnico → ajustar `system_prompt.md`

---

## 📊 Clones Deployados

| Clone | Status | Score | Domínio |
| :--- | :---: | :---: | :--- |
| David Goggins v4.1 | ✅ Validated | 9.4 | Performance Mental |

*Atualizado automaticamente pelo C4 Auditor.*

---

## 🔗 Links Úteis

- [README Principal](./README.md)
- [Quality Gates](./shared_protocols/quality_gates.md)
- [The_Veritas Integration](./shared_protocols/veritas_integration.md)

---

**Última atualização:** 2026-01-08
**Mantido por:** Clone Factory
