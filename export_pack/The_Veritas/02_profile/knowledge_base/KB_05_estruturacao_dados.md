# KB_05 — Estruturação de Dados (MECE/Pyramid)

## Categoria: ESTRATÉGIA
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. Por Que Estruturar?

> *"Informação sem estrutura é ruído. Estrutura transforma dados em insight."*
> — Barbara Minto, The Pyramid Principle (1978)

---

## 2. Princípio MECE

### Origem
McKinsey & Company, 1960s — Barbara Minto

### Definição

**MECE = Mutually Exclusive, Collectively Exhaustive**

- **Mutually Exclusive (ME):** Categorias não se sobrepõem
- **Collectively Exhaustive (CE):** Categorias cobrem tudo

### Exemplo

**Ruim (não MECE):**
- Startups de tecnologia
- Startups de AI
- Startups brasileiras

**Problema:** AI é subconjunto de tecnologia, brasileiras pode ser qualquer uma.

**MECE:**
- Startups B2B
- Startups B2C
- Startups B2B2C

**OU:**
- Pré-seed
- Seed
- Series A+

---

## 3. Pyramid Principle

### Conceito

```
                    ┌─────────────────┐
                    │  CONCLUSÃO      │ ← Resposta principal
                    │  (Top-line)     │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
     ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
     │ Argumento │     │ Argumento │     │ Argumento │
     │     1     │     │     2     │     │     3     │
     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
           │                 │                 │
      ┌────┼────┐       ┌────┼────┐       ┌────┼────┐
      │    │    │       │    │    │       │    │    │
     Dado Dado Dado    Dado Dado Dado    Dado Dado Dado
```

### Regras

1. **Top-line first:** Comece pela conclusão
2. **Agrupamento lógico:** Cada nível suporta o de cima
3. **MECE em cada nível:** Sem sobreposição, sem gaps
4. **Ordem lógica:** Cronológica, por importância, ou estrutural

---

## 4. Issue Tree

### Conceito
Decomposição de um problema em sub-problemas MECE.

### Exemplo

**Problema:** Por que o churn aumentou?

```
Por que o churn aumentou?
│
├── Problema de Produto
│   ├── Bugs críticos
│   ├── Features faltando
│   └── UX ruim
│
├── Problema de Preço
│   ├── Competidor mais barato
│   ├── Valor percebido baixo
│   └── Modelo de pricing errado
│
├── Problema de Atendimento
│   ├── Tempo de resposta lento
│   ├── Resolução ineficaz
│   └── Falta de proatividade
│
└── Fatores Externos
    ├── Recessão econômica
    ├── Novo competidor
    └── Mudança regulatória
```

---

## 5. 5W1H Framework

### Origem
Jornalismo tradicional — Rudyard Kipling

### Perguntas

| Pergunta | Foco |
| :--- | :--- |
| **What** | O que aconteceu? O que é? |
| **Who** | Quem está envolvido? |
| **When** | Quando aconteceu/acontece? |
| **Where** | Onde? Em que contexto? |
| **Why** | Por que é importante? Causa? |
| **How** | Como funciona? Como resolver? |

### Aplicação em Pesquisa

**Query:** "Mercado de gergelim na África"

| Pergunta | Sub-query |
| :--- | :--- |
| What | Tamanho do mercado, características |
| Who | Players principais, compradores |
| When | Sazonalidade, tendências temporais |
| Where | Países produtores, rotas comerciais |
| Why | Drivers de crescimento, riscos |
| How | Cadeia de valor, logística |

---

## 6. Taxonomy Design

### Objetivo
Criar categorias consistentes para organizar informação.

### Princípios

1. **Hierarquia clara:** Níveis bem definidos
2. **Nomenclatura consistente:** Nomes sem ambiguidade
3. **Balanceamento:** Níveis similares em profundidade
4. **Escalabilidade:** Permite adição futura

### Exemplo: Fontes de Pesquisa

```
FONTES
├── TIER 1 (Governamental)
│   ├── Nacional
│   │   └── IBGE, CVM, BACEN...
│   └── Internacional
│       └── FAO, World Bank, IMF...
│
├── TIER 2 (Acadêmico/Consultoria)
│   ├── Acadêmico
│   │   └── PubMed, IEEE, Nature...
│   └── Consultoria
│       └── McKinsey, BCG, Deloitte...
│
├── TIER 3 (Mídia/Indústria)
│   ├── Mídia Premium
│   │   └── Bloomberg, Reuters, WSJ...
│   └── Associações
│       └── CNA, Abiove, Abranet...
│
└── TIER 4 (Não verificado)
    ├── Blogs
    └── Social Media
```

---

## 7. Output Formatting

### Formato Executivo

```markdown
## Key Finding

[Uma frase com a conclusão principal]

### Evidências
1. [Ponto 1] — [Fonte]
2. [Ponto 2] — [Fonte]
3. [Ponto 3] — [Fonte]

### Implicações
- [O que isso significa para a decisão]

### Próximos Passos
1. [Ação recomendada]
```

### Formato Acadêmico

```markdown
## 1. Introdução
[Contexto e objetivo]

## 2. Metodologia
[Como os dados foram coletados]

## 3. Resultados
[Apresentação dos dados]

## 4. Discussão
[Interpretação e limitações]

## 5. Conclusão
[Síntese e recomendações]

## Referências
[Lista de fontes]
```

---

## 8. Referências

- Minto, B. (1978). *The Pyramid Principle*. Minto International.
- McKinsey & Company. *MECE Framework*.
- Kipling, R. (1902). *Just So Stories* (origem do 5W1H).


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->