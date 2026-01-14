# KB_11 — Modelos Mentais de Inteligência (CIA/SAT)

## Categoria: TEORIA
## Palavras: ~3,000
## Atualizado: 2026-01-07

---

## 1. Origem dos SATs

> *"Structured Analytic Techniques externalizam pensamento interno, permitindo revisão crítica."*
> — CIA Tradecraft Primer (2009)

### Contexto

Após falhas de inteligência (9/11, Iraq WMDs), a comunidade de inteligência dos EUA formalizou técnicas estruturadas para:
- Mitigar viés cognitivo
- Desafiar suposições
- Considerar alternativas
- Tornar análise transparente

**Fonte:** A Tradecraft Primer: Structured Analytic Techniques (CIA, 2009)

---

## 2. Analysis of Competing Hypotheses (ACH)

### Criador
Richards J. Heuer Jr. — CIA (1999)

### Conceito

> *"Avalie múltiplas hipóteses contra a evidência disponível, não apenas a hipótese favorita."*

### Processo em 8 Passos

```
1. IDENTIFICAR HIPÓTESES
   Listar todas as hipóteses possíveis (mínimo 3)
   
2. LISTAR EVIDÊNCIAS
   Coletar todos os dados relevantes
   
3. CRIAR MATRIZ
   Hipóteses nas colunas, evidências nas linhas
   
4. AVALIAR CONSISTÊNCIA
   Cada célula: +, -, ou 0 (consistente, inconsistente, neutro)
   
5. REFINAR MATRIZ
   Revisar hipóteses e evidências
   
6. ANALISAR SENSIBILIDADE
   Quais evidências são mais diagnósticas?
   
7. CONCLUIR
   Hipótese com menos inconsistências
   
8. MONITORAR
   Quais eventos invalidariam a conclusão?
```

### Exemplo Prático

**Pergunta:** Por que o churn aumentou 3%?

| Evidência | H1: Preço | H2: Produto | H3: Competição |
| :--- | :---: | :---: | :---: |
| Reclamações de preço subiram | + | 0 | + |
| NPS caiu 10 pontos | 0 | + | 0 |
| Competidor lançou feature | 0 | 0 | + |
| Churn maior em plano premium | + | 0 | + |
| Bug crítico no mês passado | 0 | + | 0 |
| **SCORE** | **2** | **2** | **3** |

**Conclusão:** H3 (Competição) tem mais consistência, mas combinação de fatores é provável.

---

## 3. Key Assumptions Check

### Objetivo
Identificar e desafiar suposições que sustentam a análise.

### Processo

```
1. LISTAR SUPOSIÇÕES
   O que assumimos como verdade sem verificar?
   
2. DESAFIAR CADA UMA
   E se esta suposição estiver errada?
   
3. IDENTIFICAR VULNERÁVEIS
   Quais suposições são críticas E não verificadas?
   
4. TESTAR
   Buscar evidência para validar ou refutar
```

### Exemplo

**Análise:** "O mercado de AgTech vai crescer 20% em 2025"

| Suposição | Crítica? | Verificada? | Ação |
| :--- | :---: | :---: | :--- |
| Economia estável | SIM | NÃO | Verificar previsões PIB |
| Crédito rural disponível | SIM | SIM | OK (Plano Safra publicado) |
| Adoção digital continua | SIM | PARCIAL | Buscar dados de penetração |
| Sem choque climático | SIM | NÃO | Adicionar cenário de risco |

---

## 4. Devil's Advocacy

### Objetivo
Forçar consideração de cenário contrário.

### Regras

1. Designar um "advogado do diabo" (ou assumir o papel)
2. Defender a hipótese contrária com vigor
3. Buscar fraquezas no argumento principal
4. Documentar contra-argumentos

### Exemplo

**Hipótese:** "Devemos investir em expansão para o México"

**Devil's Advocate:**
- E se o mercado mexicano for mais competitivo?
- E se regulação for desfavorável a estrangeiros?
- E se custo de operação for maior que estimado?
- E se concorrente local já dominar?

---

## 5. Red Team Analysis

### Origem
Prática militar para simular perspectiva do adversário.

### Aplicação em Pesquisa

```
CENÁRIO: Analisar mercado de SaaS agrícola

RED TEAM PERSPECTIVE:
├── "Se eu fosse um concorrente, como atacaria?"
├── "Se eu fosse um crítico, quais falhas apontaria?"
├── "Se eu fosse um investidor cético, o que perguntaria?"
└── "Se eu fosse o cliente, por que NÃO compraria?"
```

### Perguntas Red Team

| Papel | Pergunta |
| :--- | :--- |
| Concorrente | Como vencer esta análise/produto? |
| Crítico | Onde está a falha metodológica? |
| Cético | Por que isso pode estar errado? |
| Usuário | Por que isso não resolve meu problema? |

---

## 6. Premortem Analysis

### Criador
Gary Klein (1989)

### Conceito

> *"Imagine que o projeto fracassou. Por quê?"*

### Processo

```
1. Assuma que o projeto FRACASSOU
2. Cada participante lista razões do fracasso
3. Consolide as razões mais citadas
4. Desenvolva mitigações ANTES de começar
```

### Exemplo

**Projeto:** Lançar relatório sobre mercado de gergelim

**Premortem:**
- Fontes eram de baixa qualidade → Definir Tier mínimo
- Cliente não gostou do formato → Validar formato antes
- Deadline perdido → Buffer de 2 dias
- Dados desatualizados → Verificar data de cada fonte

---

## 7. What If? Analysis

### Objetivo
Explorar cenários alternativos sistematicamente.

### Matriz

| Cenário | Probabilidade | Impacto | Ação |
| :--- | :---: | :---: | :--- |
| Base Case | 60% | Médio | Continuar |
| Bull Case | 20% | Alto+ | Preparar upside |
| Bear Case | 15% | Alto- | Plano B |
| Black Swan | 5% | Extremo | Não investir tudo |

---

## 8. Indicadores e Alertas

### Objetivo
Definir sinais que validam ou invalidam a análise.

### Framework

```
CONCLUSÃO: "Mercado de AgTech cresce 20%"

INDICADORES DE VALIDAÇÃO:
├── Investimentos em AgTech superam 2023 (confirma)
├── Adoção de apps agrícolas aumenta (confirma)
└── Governo expande crédito rural digital (confirma)

INDICADORES DE INVALIDAÇÃO:
├── Recessão agrícola (invalida)
├── Queda de commodities >30% (invalida)
└── Regulação restritiva de dados (invalida)
```

---

## 9. Quick Reference: SATs

```
┌─────────────────────────────────────────────────────────────┐
│            STRUCTURED ANALYTIC TECHNIQUES                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ACH           → Comparar hipóteses vs evidência            │
│  Key Assumptions → Desafiar o que assumimos                 │
│  Devil's Advocacy → Defender o oposto                       │
│  Red Team      → Simular perspectiva adversária             │
│  Premortem     → Imaginar fracasso antes de começar         │
│  What If?      → Explorar cenários alternativos             │
│  Indicators    → Definir sinais de validação                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Referências

- Heuer, R. J. (1999). *Psychology of Intelligence Analysis*. CIA.
- CIA. (2009). *A Tradecraft Primer: Structured Analytic Techniques*.
- Heuer, R. J. & Pherson, R. H. (2014). *Structured Analytic Techniques for Intelligence Analysis*.
- Klein, G. (1989). *Premortem Analysis*.
