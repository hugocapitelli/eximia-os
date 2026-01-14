# KB_16 — Structured Analytic Techniques (SAT)

## Categoria: TEORIA
## Palavras: ~3,000
## Atualizado: 2026-01-07

---

## 1. Visão Geral dos SATs

> *"SATs são métodos sistemáticos para externalizar pensamento de forma transparente."*
> — CIA Tradecraft Primer (2009)

### Categorias de SATs

```
STRUCTURED ANALYTIC TECHNIQUES
│
├── DIAGNOSTIC
│   ├── Key Assumptions Check
│   ├── Quality of Information Check
│   └── Indicators Examination
│
├── CONTRARIAN
│   ├── Devil's Advocacy
│   ├── Red Team Analysis
│   └── What If? Analysis
│
├── IMAGINATIVE
│   ├── Brainstorming
│   ├── Scenarios Analysis
│   └── Alternative Futures
│
└── HYPOTHESIS TESTING
    ├── ACH (Competing Hypotheses)
    ├── Diagnostic Reasoning
    └── Deception Detection
```

---

## 2. Key Assumptions Check (KAC)

### Objetivo
Identificar e testar suposições críticas que sustentam a análise.

### Processo

```
1. IDENTIFICAR SUPOSIÇÕES
   Listar todas as suposições implícitas
   
2. CLASSIFICAR
   ├── Críticas: Se errada, invalida conclusão
   ├── Importantes: Afeta significativamente
   └── Menores: Impacto limitado
   
3. AVALIAR CONFIANÇA
   ├── Alta: Evidência sólida
   ├── Média: Evidência parcial
   └── Baixa: Inferência ou opinião
   
4. IDENTIFICAR VULNERÁVEIS
   Críticas + Baixa confiança = RISCO
   
5. TESTAR
   Buscar evidência que valide ou refute
```

### Matriz

| Suposição | Crítica? | Confiança | Ação |
| :--- | :---: | :---: | :--- |
| Mercado cresce 15% | SIM | MÉDIA | Buscar projeções oficiais |
| Competidor não reage | SIM | BAIXA | RISCO - testar cenário |
| Preços estáveis | NÃO | ALTA | Monitorar |

---

## 3. Quality of Information Check

### Objetivo
Avaliar a confiabilidade das fontes utilizadas.

### Critérios

| Critério | Pergunta |
| :--- | :--- |
| **Fonte** | Quem produziu? Qual expertise? |
| **Proximidade** | Quão perto dos eventos/dados? |
| **Viés** | Interesse comercial/político? |
| **Corroboração** | Outras fontes confirmam? |
| **Atualidade** | Dado é recente o suficiente? |

### Escala de Confiabilidade

| Nível | Descrição |
| :---: | :--- |
| **A** | Totalmente confiável (Tier 1, verificado) |
| **B** | Geralmente confiável (Tier 2) |
| **C** | Razoavelmente confiável (Tier 3) |
| **D** | Pouco confiável (não verificado) |
| **E** | Não confiável (conflito interesse claro) |
| **F** | Não avaliável |

---

## 4. Red Team Analysis

### Objetivo
Analisar problema da perspectiva do adversário.

### Aplicações

| Contexto | Pergunta Red Team |
| :--- | :--- |
| **Competitivo** | "Se eu fosse o concorrente, como atacaria?" |
| **Crítico** | "Se eu fosse um cético, quais falhas veria?" |
| **Usuário** | "Se eu fosse cliente, por que NÃO compraria?" |

### Processo

```
1. Definir o "adversário" ou perspectiva alternativa
2. Assumir completamente essa perspectiva
3. Identificar fraquezas, falhas, oportunidades
4. Documentar descobertas
5. Integrar insights à análise principal
```

---

## 5. What If? Analysis

### Objetivo
Explorar impactos de eventos de baixa probabilidade mas alto impacto.

### Template

```
WHAT IF: [Evento improvável mas possível]

PROBABILIDADE: XX%

IMPACTO:
├── Na conclusão principal: [Alto/Médio/Baixo]
├── Em decisões imediatas: [...]
└── Em recomendações: [...]

INDICADORES DE ALERTA:
├── [Sinal 1 que mostraria que evento está acontecendo]
├── [Sinal 2]
└── [Sinal 3]

MITIGAÇÃO:
└── [O que fazer se acontecer]
```

---

## 6. Alternative Futures / Scenario Analysis

### Objetivo
Mapear múltiplos cenários possíveis.

### Matriz 2x2

```
                    VARIÁVEL 1
                BAIXO       ALTO
           ┌─────────────┬─────────────┐
    BAIXO  │  Cenário 1  │  Cenário 2  │
VARIÁVEL   │   (Bear)    │  (Mixed A)  │
    2      ├─────────────┼─────────────┤
    ALTO   │  Cenário 3  │  Cenário 4  │
           │  (Mixed B)  │   (Bull)    │
           └─────────────┴─────────────┘
```

### Exemplo

**Variável 1:** Crescimento do mercado (Baixo <10%, Alto >20%)
**Variável 2:** Sucesso do competidor (Baixo=Fracassa, Alto=Domina)

| Cenário | V1 | V2 | Descrição |
| :--- | :---: | :---: | :--- |
| 1 (Bear) | Baixo | Baixo | Mercado estagna, todos sofrem |
| 2 | Alto | Baixo | Mercado cresce, nós capturamos |
| 3 | Baixo | Alto | Competidor vence em mercado pequeno |
| 4 (Bull) | Alto | Alto | Corrida intensa, mercado grande |

---

## 7. Brainstorming Estruturado

### Regras

1. **Quantidade antes de qualidade**
2. **Sem crítica durante geração**
3. **Construir sobre ideias dos outros**
4. **Ideias "loucas" são bem-vindas**
5. **Registrar TUDO**

### Variações

| Técnica | Descrição |
| :--- | :--- |
| **Starbursting** | Gerar perguntas, não respostas |
| **Reverse Brainstorm** | "Como garantir fracasso?" |
| **SCAMPER** | Substituir, Combinar, Adaptar, Modificar... |

---

## 8. Quando Usar Cada SAT

| Situação | SAT Recomendado |
| :--- | :--- |
| Análise inicial | Key Assumptions Check |
| Múltiplas explicações | ACH |
| Desafiar conclusão | Devil's Advocacy |
| Entender adversário | Red Team |
| Eventos inesperados | What If? |
| Futuro incerto | Scenario Analysis |
| Gerar opções | Brainstorming |

---

## 9. Referências

- CIA. (2009). *A Tradecraft Primer: Structured Analytic Techniques*.
- Heuer, R. J. & Pherson, R. H. (2014). *Structured Analytic Techniques for Intelligence Analysis*.
- Heuer, R. J. (1999). *Psychology of Intelligence Analysis*.
