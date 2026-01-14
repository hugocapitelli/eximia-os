# Handover Document — Themis Sentinel CLO

**Agente:** Themis Sentinel CLO  
**Versão:** 1.0  
**Tier:** 3 (Expert)  
**Data:** 2026-01-07  
**Status:** Production Ready  

---

## 1. Visão Geral

### 1.1 O Que é Themis Sentinel

**Themis Sentinel CLO** é um agente de IA Tier 3 (Expert) que funciona como Chief Legal Officer virtual, fornecendo assessoria jurídica estratégica em:

- Governança Corporativa
- Gestão de Risco
- Compliance & Anticorrupção
- M&A e Due Diligence
- Contratos Comerciais
- Proteção de Dados (LGPD)
- Direito Trabalhista
- Litígios e Arbitragem

### 1.2 Equivalência Humana

| Atributo | Equivalente |
|----------|-------------|
| Cargo | CLO / General Counsel de multinacional |
| Experiência | 15-20+ anos em M&A, Corporate, Compliance |
| Background | Senior Partner de Big Law |
| Jurisdição | Brasil (primária) |

---

## 2. Como Usar

### 2.1 Invocação

Use o prompt operacional localizado em:
```
Z_Squad/outputs/Themis_Sentinel_CLO/03_prompt/prompt_operacional_clo.md
```

### 2.2 Tipos de Query Suportados

| Tipo | Exemplo |
|------|---------|
| Análise de risco | "Qual o risco de [situação]?" |
| Revisão contratual | "Revise este NDA e identifique red flags" |
| Due diligence | "Checklist de DD para aquisição de [tipo]" |
| Compliance | "A empresa está em conformidade com [lei]?" |
| Governança | "Como realizar transação com parte relacionada?" |
| Crise | "Houve vazamento de dados. O que fazer?" |
| Estratégia | "Qual a melhor estrutura para [operação]?" |

### 2.3 Formato de Resposta Esperado

O agente responde com:
1. **Executive Summary** — Conclusão em 1-2 frases
2. **Análise IRAC** — Issue, Rule, Analysis, Conclusion
3. **Classificação de Risco** — CRÍTICO/ALTO/MÉDIO/BAIXO/MÍNIMO
4. **Quantificação** — Exposure (quando aplicável)
5. **Recomendação** — GO/NO-GO/CONDITIONAL
6. **Disclaimer** — Sempre presente

---

## 3. Limitações

### 3.1 O Que Themis NÃO Faz

| Limitação | Razão |
|-----------|-------|
| ❌ Substituir advogado constituído | Exigência legal |
| ❌ Emitir parecer vinculante | Sem responsabilidade profissional |
| ❌ Representar em juízo | Impossível para IA |
| ❌ Garantir resultados judiciais | Justiça é incerta |
| ❌ Orientar sobre crimes | Circuit breakers |
| ❌ Atuar fora do Brasil | Jurisdição limitada |

### 3.2 Circuit Breakers (Recusas Automáticas)

O agente recusará automaticamente:

| Trigger | Resposta |
|---------|----------|
| Obstrução de justiça | HALT — Recusa imediata |
| Lavagem de dinheiro | HALT — Encerramento |
| Evasão fiscal | HALT — Distingue de elisão |
| Responsabilidade penal | HALT — Redirect criminalista |
| Violação de sanções | HALT — Recusa total |
| Conflito não declarado | PAUSE — Pede disclosure |

---

## 4. Disclaimers

### 4.1 Disclaimer Padrão

> Este conteúdo é informativo e não constitui aconselhamento jurídico formal. Consulte um advogado habilitado antes de tomar decisões jurídicas.

### 4.2 Quando Escalar para Humano

| Situação | Ação |
|----------|------|
| Risco classificado como CRÍTICO | Escalar imediatamente |
| Questão criminal | Encaminhar para criminalista |
| Parecer formal necessário | Advogado constituído |
| Decisão de alto impacto | Validar com GC/CLO humano |
| Fora da jurisdição brasileira | Consultar advogado local |

---

## 5. Arquitetura de Arquivos

```
Z_Squad/outputs/Themis_Sentinel_CLO/
├── 01_spec/
│   ├── spec_tecnica_legal.json
│   ├── META_ANALYSIS_RISK.md
│   └── handoff_z1_z2.yaml
├── 02_profile/
│   ├── dna_juridico.md
│   ├── FRAMEWORK_INDEX.md
│   ├── VOICE_PROFILES.md
│   ├── BIBLIOGRAPHY_RESEARCH.md
│   ├── handoff_z2_z3.yaml
│   └── knowledge_base/
│       ├── KB_01_CorpLaw_BR.md
│       ├── KB_02_Compliance.md
│       ├── KB_03_Privacy.md
│       ├── KB_04_Contracts.md
│       ├── KB_05_Risk.md
│       ├── KB_06_Labor.md
│       ├── KB_07_Tax.md
│       ├── KB_08_MA_DueDiligence.md
│       ├── KB_09_CorpGovernance.md
│       ├── KB_10_CrisisManagement.md
│       ├── KB_11_ESG_Law.md
│       ├── KB_12_IP_Strategy.md
│       ├── KB_13_LegalOps.md
│       ├── KB_14_Arbitration.md
│       └── KB_15_Brazilian_Regulatory.md
├── 03_prompt/
│   ├── prompt_operacional_clo.md (MAIN)
│   ├── handoff_z3_z4.yaml
│   └── schemas/
│       ├── contract_review_schema.json
│       └── risk_memo_output.json
└── 04_validation/
    ├── VALIDATION_CASES_LEGAL.yaml
    ├── COMPARATIVE_ANALYSIS.md
    └── HANDOVER_DOCUMENT.md
```

---

## 6. Manutenção

### 6.1 Atualizações Necessárias

| Frequência | Ação |
|------------|------|
| Mensal | Verificar novas resoluções ANPD, CVM |
| Trimestral | Atualizar jurisprudência nos KBs |
| Anual | Revisão completa de legislação |
| Ad-hoc | Novas leis relevantes |

### 6.2 Indicadores de Saúde

| KPI | Target |
|-----|--------|
| Citation accuracy | 100% |
| Disclaimer presence | 100% |
| IRAC compliance | >95% |
| Circuit breaker activation | 100% quando aplicável |
| User satisfaction | >4.5/5 |

---

## 7. Contato e Suporte

### 7.1 Escalonamento

| Nível | Responsável | Quando |
|-------|-------------|--------|
| L1 | Usuário + Themis | Queries normais |
| L2 | Advogado interno | Risco ALTO |
| L3 | CLO/GC humano | Risco CRÍTICO |
| L4 | Escritório externo | Parecer formal |

### 7.2 Feedback

Para reportar problemas ou sugestões:
- Documentar query e resposta
- Classificar tipo (bug, improvement, feature)
- Encaminhar para equipe de manutenção

---

## 8. Aceite

| Item | Status |
|------|--------|
| Prompt operacional testado | ✅ |
| 15 casos de validação definidos | ✅ |
| Circuit breakers verificados | ✅ |
| Disclaimers implementados | ✅ |
| Documentação completa | ✅ |

**Status Final:** ✅ **APPROVED FOR PRODUCTION**

---

*Documento gerado automaticamente pelo Z_Squad Pipeline*  
*Themis Sentinel CLO v1.0 — 2026-01-07*
