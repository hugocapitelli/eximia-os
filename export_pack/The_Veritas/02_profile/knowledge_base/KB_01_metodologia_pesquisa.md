# KB_01 — Metodologia de Pesquisa Avançada

## Categoria: TEORIA
## Palavras: ~3,000
## Atualizado: 2026-01-07

---

## 1. Fundamentos da Pesquisa

### O Que é Pesquisa?

> *"Pesquisa é uma investigação sistemática e disciplinada que busca descobrir novos conhecimentos ou validar conhecimentos existentes."*
> — Wayne C. Booth (The Craft of Research, 2016)

### Tipos de Pesquisa

| Tipo | Objetivo | Exemplo |
| :--- | :--- | :--- |
| **Exploratória** | Descobrir padrões, gerar hipóteses | "O que está acontecendo no mercado de gergelim?" |
| **Descritiva** | Caracterizar fenômenos | "Qual o perfil dos compradores de SaaS B2B?" |
| **Explicativa** | Estabelecer causalidade | "Por que o churn aumentou 3% após o reajuste?" |
| **Aplicada** | Resolver problema específico | "Como reduzir CAC em 20%?" |

---

## 2. O Ciclo de Pesquisa

### Modelo OODA Adaptado para Pesquisa

```
┌──────────────────────────────────────────────────────────┐
│                    CICLO DE PESQUISA                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│    ┌─────────┐     ┌─────────┐     ┌─────────┐          │
│    │ OBSERVE │ ──▶ │ ORIENT  │ ──▶ │ DECIDE  │          │
│    │ (Query) │     │ (Fontes)│     │(Filtrar)│          │
│    └────┬────┘     └─────────┘     └────┬────┘          │
│         │                               │               │
│         │         ┌─────────┐           │               │
│         └───────▶ │   ACT   │ ◀─────────┘               │
│                   │(Síntese)│                           │
│                   └────┬────┘                           │
│                        │                                │
│                   [ITERATE]                             │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

**Fonte:** Adaptado de John Boyd, OODA Loop (1976)

### Fases Detalhadas

#### 1. OBSERVE (Query Design)
- **Objetivo:** Formular a pergunta de pesquisa
- **Técnica:** Query Decomposition
- **Output:** Sub-queries atômicas e buscáveis

#### 2. ORIENT (Source Mapping)
- **Objetivo:** Identificar fontes relevantes por tier
- **Técnica:** Source Tier System
- **Output:** Lista priorizada de fontes

#### 3. DECIDE (Filter & Validate)
- **Objetivo:** Aplicar SIFT/CRAAP em cada fonte
- **Técnica:** Evaluation Frameworks
- **Output:** Fontes validadas

#### 4. ACT (Synthesize)
- **Objetivo:** Integrar informação em narrativa coesa
- **Técnica:** Triangulação + MECE
- **Output:** Resposta estruturada

---

## 3. Query Decomposition

### O Problema
Perguntas complexas não podem ser respondidas diretamente.

**Exemplo ruim:**
> "Qual é o estado atual do mercado de SaaS agrícola no Brasil considerando unit economics, concorrentes e tendências de IA?"

### A Solução: Decomposição Atômica

**Passo 1:** Identificar os componentes da pergunta

| Componente | Sub-Query |
| :--- | :--- |
| Mercado | "Qual o tamanho do mercado de AgTech SaaS no Brasil em 2024?" |
| Unit Economics | "Quais benchmarks de LTV/CAC para SaaS agrícola?" |
| Concorrentes | "Quem são os principais players de SaaS agrícola no Brasil?" |
| Tendências IA | "Quais aplicações de IA estão sendo adotadas em AgTech?" |

**Passo 2:** Priorizar por dependência
1. Mercado (contexto geral)
2. Concorrentes (players)
3. Tendências IA (direção)
4. Unit Economics (métricas)

**Passo 3:** Executar sequencialmente, refinando queries

---

## 4. Recursive Deep Diving

### Conceito

> *"Não pare na primeira fonte. Rastreie citações até a origem."*

### Processo

```
ENCONTRA AFIRMAÇÃO:
"O mercado de AgTech cresceu 25% em 2023 (Fonte: Relatório X)"
       │
       ▼
VERIFICA RELATÓRIO X:
"De acordo com estudo da Embrapa/MAPA..."
       │
       ▼
BUSCA ESTUDO EMBRAPA:
Dados primários coletados via survey de 500 empresas
       │
       ▼
VALIDA METODOLOGIA:
Survey representa 15% do universo, margem de erro 4%
```

### Quando Parar

1. Chegou em dados primários (survey, experimento, registro oficial)
2. Fonte é Tier 1 (governamental, peer-reviewed)
3. 3+ fontes independentes convergem
4. Risco de informação desatualizada (>5 anos em temas dinâmicos)

---

## 5. Triangulação Obrigatória

### Princípio

> *"Uma afirmação factual só é confiável se 3 fontes independentes a confirmorem."*

### Tipos de Triangulação

| Tipo | Descrição | Exemplo |
| :--- | :--- | :--- |
| **Fonte** | Múltiplas fontes dizem o mesmo | USDA + Conab + FAO |
| **Método** | Diferentes métodos chegam à mesma conclusão | Survey + Análise documental |
| **Temporal** | Dados de diferentes períodos convergem | 2022, 2023, 2024 |
| **Geográfica** | Dados de diferentes regiões confirmam | Brasil + EUA + Europa |

### Matriz de Confiança

| Fontes Convergentes | Confidence Score |
| :---: | :---: |
| 1 fonte | 30% (baixo) |
| 2 fontes | 60% (médio) |
| 3 fontes Tier 1 | 90% (alto) |
| 3 fontes + peer-reviewed | 95% (muito alto) |

---

## 6. Documentação e Rastreabilidade

### Formato de Citação Mínimo

```
[Autor/Org, Título, Ano, URL (se online)]
```

### Exemplo
```
[USDA, World Agricultural Supply and Demand Estimates, 2024, 
 https://www.usda.gov/oce/commodity/wasde]
```

### Checklist de Rastreabilidade

- [ ] Cada afirmação factual tem fonte
- [ ] Fonte é acessível (link funcional)
- [ ] Data do dado está explícita
- [ ] Metodologia da fonte é mencionada
- [ ] Limitações são declaradas

---

## 7. Limitações e Incerteza

### Declarar Honestamente

| Situação | Declaração |
| :--- | :--- |
| Dado não encontrado | *"Não foram encontradas fontes verificáveis para [X]."* |
| Uma única fonte | *"Baseado em fonte única [X]. Requer corroboração."* |
| Fonte desatualizada | *"Dado de [ano]. Recomenda-se buscar atualização."* |
| Contradição | *"Fontes divergem: A diz X, B diz Y. Ver análise."* |

---

## 8. Referências

- Booth, W. C., Colomb, G. G., & Williams, J. M. (2016). *The Craft of Research*. University of Chicago Press.
- Boyd, J. (1976). *OODA Loop*. US Air Force.
- Academy of Management (2024). *AOM Journal Rigor and Quality Best Practices*. https://aom.org
- Caulfield, M. (2017). *Web Literacy for Student Fact-Checkers*.
