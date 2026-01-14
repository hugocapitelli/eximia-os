# Citation Engine — Z Squad Protocol

## 🎯 Propósito
Garantir **100% rastreabilidade** de todas as afirmações nos agentes.

> *"Zero 'estudos mostram que...' genéricos."*
> — Athena Standard

---

## 1. O Problema

### ❌ Citações Ruins (Proibidas)
```markdown
- "Estudos mostram que..."
- "Segundo especialistas..."
- "A ciência comprova que..."
- "Segundo Alex Hormozi..." (sem obra/ano)
```

### ✅ Citações Corretas (Obrigatórias)
```markdown
- "Segundo Kotler (Marketing Management, 2016)..."
- "Conforme Hormozi ($100M Offers, 2021)..."
- "O framework JTBD (Christensen, Competing Against Luck, 2016)..."
```

---

## 2. Formato Obrigatório

### Template
```
[AUTOR, OBRA, ANO]
```

### Exemplos

| Tipo | Formato |
| :--- | :--- |
| **Livro** | `Kotler (Marketing Management, 2016)` |
| **Framework** | `Value Equation (Hormozi, $100M Offers, 2021)` |
| **Conceito** | `Jobs-to-be-Done (Christensen, 2016)` |
| **Estudo** | `Kahneman (Thinking Fast and Slow, 2011)` |

---

## 3. Regras por Contexto

### Knowledge Bases
- **Toda** afirmação teórica deve ter citação
- Mínimo 5 citações por KB
- Listar fontes no final do arquivo

### System Prompt
- Frameworks devem ter criador/ano
- Citações inline quando relevante

### Exemplos Few-shot
- Podem ser genéricos (não precisam de citação)
- Exceto se referenciarem teorias específicas

---

## 4. Citation Index

Todo agente Class 2+ deve ter um índice de citações:

```markdown
# CITATION_INDEX.md

## Fontes Utilizadas

| # | Autor | Obra | Ano | Uso |
|---|-------|------|-----|-----|
| 1 | Kotler | Marketing Management | 2016 | 4Ps, STP |
| 2 | Hormozi | $100M Offers | 2021 | Value Equation |
| 3 | Cialdini | Influence | 1984 | 6 Principles |
| 4 | Miller | Building a StoryBrand | 2017 | Brand Narrative |
| 5 | Christensen | Competing Against Luck | 2016 | JTBD |

## Citações por KB

- KB_01: Kotler (5x), Hormozi (3x)
- KB_02: Cialdini (4x), Kahneman (2x)
```

---

## 5. Validação Z4

Z4 Auditor deve verificar:

| Check | Critério | PASS |
| :--- | :--- | :--- |
| Nenhum "estudos mostram" | 0 ocorrências | ✅ |
| Frameworks com autor | 100% | ✅ |
| Citações com ano | 100% | ✅ |
| CITATION_INDEX presente | Class 2+ | ✅ |

---

## 6. Exemplos de Transformação

### Antes (❌)
```markdown
Estudos mostram que a maioria dos compradores decide 
em milissegundos. Especialistas recomendam usar 
prova social para aumentar conversão.
```

### Depois (✅)
```markdown
Segundo Kahneman (Thinking Fast and Slow, 2011), 
decisões de compra frequentemente ocorrem no Sistema 1 
(rápido, intuitivo). Cialdini (Influence, 1984) 
demonstra que prova social é um dos 6 princípios 
fundamentais de persuasão.
```

---

## 📚 Referências
- [Athena: GPT-CMO BIBLIOGRAPHY_RESEARCH](../../outputs/x_agente_marketplace_seller/)
