# KB_02 — Lógica Booleana e Operadores de Busca

## Categoria: ESTRATÉGIA
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. Fundamentos da Lógica Booleana

### Origem

> *"A álgebra booleana é a base matemática de toda busca digital."*
> — George Boole, The Laws of Thought (1854)

### Operadores Básicos

| Operador | Símbolo | Função | Exemplo |
| :--- | :---: | :--- | :--- |
| **AND** | & | Ambos os termos | `SaaS AND agronegócio` |
| **OR** | \| | Qualquer termo | `gergelim OR sesame` |
| **NOT** | - | Excluir termo | `startup -unicórnio` |

### Diagramas de Venn

```
AND: Interseção          OR: União              NOT: Exclusão
   ┌────┬────┐           ┌────────────┐         ┌────┐
   │ A  │ B  │           │ A    B     │         │ A  │ - B
   │  ██│██  │           │████████████│         │████│
   └────┴────┘           └────────────┘         └────┘
   Resultado: A ∩ B      Resultado: A ∪ B       Resultado: A - B
```

---

## 2. Operadores Avançados

### Site-Specific Search

```
site:gov.br safra soja 2024
```
→ Busca "safra soja 2024" apenas em domínios .gov.br

### Filetype Filter

```
filetype:pdf relatório safra 2024
```
→ Retorna apenas PDFs

### Exact Match

```
"unit economics" SaaS
```
→ Exige a frase exata entre aspas

### Wildcard

```
"* is the new oil"
```
→ Substitui * por qualquer palavra

### Range

```
"market size" 2020..2024
```
→ Busca anos de 2020 a 2024

### URL Contains

```
inurl:research intitle:agtech
```
→ URL contém "research", título contém "agtech"

---

## 3. Tabela de Operadores por Plataforma

| Operador | Google | PubMed | IEEE | Scholar |
| :--- | :---: | :---: | :---: | :---: |
| AND | ✅ (implícito) | ✅ | ✅ | ✅ |
| OR | ✅ | ✅ | ✅ | ✅ |
| NOT / - | ✅ | ✅ | ✅ | ✅ |
| "frase exata" | ✅ | ✅ | ✅ | ✅ |
| site: | ✅ | ❌ | ❌ | ✅ |
| filetype: | ✅ | ❌ | ❌ | ✅ |
| intitle: | ✅ | [ti] | ❌ | ✅ |
| author: | ✅ | [au] | ✅ | author: |
| date range | ✅ | ✅ | ✅ | ✅ |

---

## 4. Estratégias de Busca por Cenário

### Cenário 1: Pesquisa Acadêmica

```
Objetivo: Encontrar papers sobre LTV/CAC em SaaS

Query Google Scholar:
"customer lifetime value" AND "customer acquisition cost" 
AND SaaS filetype:pdf 2020..2024

Query PubMed (se aplicável):
("lifetime value"[Title/Abstract]) AND software

Query IEEE:
(("lifetime value") AND (SaaS OR "software as a service"))
```

### Cenário 2: Dados Oficiais

```
Objetivo: Safra de soja no Brasil 2024

Query 1 (Conab):
site:conab.gov.br safra soja 2024 filetype:pdf

Query 2 (USDA):
site:usda.gov Brazil soybean production 2024

Query 3 (IBGE):
site:ibge.gov.br produção agrícola soja
```

### Cenário 3: Inteligência de Mercado

```
Objetivo: Concorrentes de AgTech SaaS Brasil

Query 1 (Geral):
"agtech" OR "agricultura digital" Brasil SaaS 
-site:linkedin.com -site:youtube.com

Query 2 (Investimento):
"agtech" Brasil "series A" OR "series B" 2023..2024

Query 3 (Específico):
"software agrícola" Brasil (financiamento OR investimento)
```

### Cenário 4: Filtrar SEO Spam

```
Objetivo: Evitar resultados de baixa qualidade

Adicionar:
-site:medium.com -site:quora.com -site:reddit.com

Preferir:
site:*.gov OR site:*.edu OR site:*.org
filetype:pdf OR filetype:xlsx
```

---

## 5. Query Building Framework

### Método PICO (Acadêmico)

| Componente | Significado | Exemplo |
| :--- | :--- | :--- |
| **P**opulation | Quem/O quê | "SaaS B2B fintechs" |
| **I**ntervention | O que está sendo estudado | "pricing strategy" |
| **C**omparison | Com o que comparar | "vs freemium" |
| **O**utcome | Resultado esperado | "conversion rate" |

**Query resultante:**
```
("SaaS B2B" OR fintech) AND "pricing" AND 
(freemium OR "free trial") AND (conversion OR churn)
```

### Método 5W1H (Jornalístico)

| Pergunta | Query Component |
| :--- | :--- |
| **What** | Termo principal |
| **Who** | Autor, organização |
| **When** | Date range |
| **Where** | site:, country |
| **Why** | Contexto (paper, report) |
| **How** | Metodologia (survey, analysis) |

---

## 6. Refinamento Iterativo

### Processo

```
QUERY V1: "agtech market Brazil"
↓ (Muitos resultados irrelevantes)

QUERY V2: "agtech market Brazil" 2024 -jobs -courses
↓ (Ainda muito SEO)

QUERY V3: site:gov.br OR site:embrapa.br "agtech" mercado
↓ (Resultados oficiais, mas poucos)

QUERY V4: site:mckinsey.com OR site:deloitte.com 
          "agriculture technology" Brazil
↓ (Relatórios de consultoria)

COMBINAÇÃO: Merge V3 + V4 para triangulação
```

### Sinais de Query Ruim

| Sinal | Problema | Solução |
| :--- | :--- | :--- |
| >10M resultados | Query muito ampla | Adicionar AND, filtros |
| <10 resultados | Query muito restrita | Usar OR, sinônimos |
| Irrelevância | Falta especificidade | Usar "frase exata", site: |
| SEO spam | Sem filtros de qualidade | Adicionar site:.gov/.edu |

---

## 7. Thesaurus de Sinônimos

### Agricultura

| Termo BR | Termo EN | Variações |
| :--- | :--- | :--- |
| Agricultura | Agriculture | agro, farming |
| Safra | Crop, Harvest | production, yield |
| Soja | Soybean | soya |
| Gergelim | Sesame | sesamum |
| Pecuária | Livestock | cattle, beef |

### SaaS/Tech

| Termo | Sinônimos |
| :--- | :--- |
| SaaS | Software as a Service, cloud software |
| LTV | Lifetime Value, CLV, Customer Lifetime Value |
| CAC | Customer Acquisition Cost, acquisition cost |
| Churn | attrition, cancellation rate |
| MRR | Monthly Recurring Revenue |

---

## 8. Referências

- Boole, G. (1854). *The Laws of Thought*.
- Google. (2024). *Advanced Search Operators*.
- PubMed. (2024). *Search Field Descriptions and Tags*.
- IEEE Xplore. (2024). *Command Search Guide*.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->