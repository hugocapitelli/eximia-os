---
title: "KB_03 — A/B Testing Framework"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-ab-testing-framework"
  - "kb_03 — a/b testing framework"
  - "principios cientificos de test"
  - "o metodo growth hacking (sean "
  - "framework ice para priorizacao"
  - "exemplo pratico:"
  - "anatomia de um teste valido"
  - "requisitos para significancia "
  - "duracao minima do teste"
  - "variaveis testaveis em carross"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_03 — A/B Testing Framework

**Agente:** Growth Hacker
**Categoria:** OTIMIZACAO
**Versao:** 1.0

---

## Principios Cientificos de Teste

### O Metodo Growth Hacking (Sean Ellis)

```
IDEACAO → PRIORIZACAO → TESTE → ANALISE → IMPLEMENTACAO
    ↑                                          |
    └──────────────────────────────────────────┘
```

**"Growth is a process, not a tactic."** — Sean Ellis

---

## Framework ICE para Priorizacao

Antes de testar, priorize ideias com ICE Score:

| Criterio | Definicao | Score (1-10) |
|----------|-----------|--------------|
| **I**mpact | Quanto isso pode melhorar metricas? | ___ |
| **C**onfidence | Quao certo estou que vai funcionar? | ___ |
| **E**ase | Quao facil e implementar? | ___ |

**ICE Score = (I + C + E) / 3**

### Exemplo Pratico:

| Teste | Impact | Confidence | Ease | ICE |
|-------|--------|------------|------|-----|
| Mudar cor do CTA | 6 | 5 | 10 | 7.0 |
| Novo hook style | 9 | 4 | 7 | 6.7 |
| Horario diferente | 5 | 7 | 10 | 7.3 |
| Numero de slides | 7 | 6 | 8 | 7.0 |

**Regra:** Teste primeiro items com ICE > 6.5

---

## Anatomia de um Teste Valido

### Requisitos para Significancia Estatistica

```
TAMANHO DA AMOSTRA MINIMO:
├── Para detectar diferenca de 20%: ~400 conversoes/variacao
├── Para detectar diferenca de 10%: ~1,600 conversoes/variacao
├── Para detectar diferenca de 5%: ~6,400 conversoes/variacao
```

**Adaptacao para Instagram (alcance limitado):**

| Metrica | Amostra Minima | Posts Necessarios |
|---------|----------------|-------------------|
| Engagement Rate | 1,000+ reach | 2-3 posts/variacao |
| Save Rate | 2,000+ reach | 3-5 posts/variacao |
| Click Rate | 5,000+ reach | 5-10 posts/variacao |

### Duracao Minima do Teste

```
REGRA GERAL: Minimo 7 dias por teste
├── Captura variacao de dias da semana
├── Evita anomalias de um unico dia
└── Permite algoritmo normalizar

IDEAL: 2-4 semanas para conclusoes solidas
```

---

## Variaveis Testaveis em Carrosseis

### Categoria 1: Hook (Slide 1)

| Variavel | Opcoes A/B | Metrica Principal |
|----------|------------|-------------------|
| Headline style | Pergunta vs Afirmacao | STR (Slide 1→2) |
| Numero no titulo | Com vs Sem | Impressoes |
| Emocao | Curiosidade vs Urgencia | Save Rate |
| Visual | Clean vs Bold | Engagement Rate |
| Fonte | Serif vs Sans-serif | Time on post |

**Exemplo de teste:**
```
VARIACAO A: "7 Erros que Todo Iniciante Comete"
VARIACAO B: "Voce Esta Cometendo Esses Erros?"

Hipotese: Perguntas geram mais curiosidade
Metrica: Swipe-Through Rate
Duracao: 2 semanas (4 posts cada)
```

### Categoria 2: Estrutura

| Variavel | Opcoes A/B | Metrica Principal |
|----------|------------|-------------------|
| Numero de slides | 5 vs 10 | Completion Rate |
| Densidade de texto | Alto vs Baixo | Time on post |
| Progressao | Linear vs Revelacao | STR |
| CTA position | Slide final vs Penultimo | Conversao |

### Categoria 3: Visual

| Variavel | Opcoes A/B | Metrica Principal |
|----------|------------|-------------------|
| Cor dominante | Cores quentes vs frias | Stop rate |
| Consistencia | Mesmo template vs Variado | Brand recall |
| Tipo de imagem | Foto vs Ilustracao | Engagement |
| Espaco em branco | Muito vs Pouco | Readability |

### Categoria 4: Copy

| Variavel | Opcoes A/B | Metrica Principal |
|----------|------------|-------------------|
| Tom | Formal vs Casual | Comments |
| Caption length | Curta vs Longa | Saves |
| CTA type | Direto vs Soft | Click rate |
| Emoji usage | Com vs Sem | Engagement |

### Categoria 5: Distribuicao

| Variavel | Opcoes A/B | Metrica Principal |
|----------|------------|-------------------|
| Horario | Manha vs Noite | Reach |
| Dia da semana | Weekday vs Weekend | Engagement |
| Hashtag count | 5 vs 15 | Reach de nao-followers |
| First comment | Hashtags vs CTA | Conversao |

---

## Template de Documentacao de Teste

```markdown
# Teste: [NOME DO TESTE]

## Hipotese
Se [mudarmos X], entao [Y vai melhorar] porque [razao].

## Configuracao
- Variavel testada: ___
- Variacao A (Controle): ___
- Variacao B (Teste): ___
- Metrica principal: ___
- Metricas secundarias: ___

## Duracao
- Inicio: ___
- Fim: ___
- Posts por variacao: ___

## Resultados
| Metrica | Variacao A | Variacao B | Diferenca | Significante? |
|---------|------------|------------|-----------|---------------|
| [Principal] | | | | |
| [Secundaria 1] | | | | |
| [Secundaria 2] | | | | |

## Conclusao
[ ] A venceu - manter controle
[ ] B venceu - implementar mudanca
[ ] Inconclusivo - mais testes necessarios

## Proximos Passos
1. ___
2. ___

## Aprendizados
- ___
- ___
```

---

## Erros Comuns em Testes

### 1. Testar Multiplas Variaveis

**ERRADO:**
```
A: Hook pergunta + cor azul + 5 slides
B: Hook afirmacao + cor vermelha + 10 slides
```
Impossivel saber o que causou diferenca.

**CERTO:**
```
A: Hook pergunta + cor azul + 5 slides
B: Hook afirmacao + cor azul + 5 slides
```
Uma variavel por teste.

### 2. Amostra Insuficiente

**ERRADO:** "Testei 2 posts e B teve 10% mais likes"

**CERTO:** Minimo 4-6 posts por variacao para reducir variancia natural.

### 3. Ignorar Sazonalidade

**ERRADO:** Comparar post de segunda com post de sabado

**CERTO:** Mesmos dias da semana para ambas variacoes

### 4. Confirmation Bias

**ERRADO:** Parar teste quando resultado favorece sua hipotese

**CERTO:** Definir duracao ANTES e respeitar independente de resultados parciais

### 5. Nao Documentar

**ERRADO:** "Acho que aquele teste deu bom..."

**CERTO:** Registro sistematico de todos os testes e resultados

---

## Calendario de Testes Sugerido

### Mes 1: Fundamentos

| Semana | Teste | Objetivo |
|--------|-------|----------|
| 1-2 | Horarios | Encontrar melhor timing |
| 3-4 | Numero de slides | Otimizar completion |

### Mes 2: Hook Optimization

| Semana | Teste | Objetivo |
|--------|-------|----------|
| 1-2 | Headline style | Maximizar stop rate |
| 3-4 | Visual do slide 1 | Otimizar primeiras impressoes |

### Mes 3: Engagement Deep Dive

| Semana | Teste | Objetivo |
|--------|-------|----------|
| 1-2 | CTA variations | Aumentar saves/shares |
| 3-4 | Caption strategies | Boost comments |

### Mes 4: Advanced

| Semana | Teste | Objetivo |
|--------|-------|----------|
| 1-2 | Content mix | Encontrar melhor tipo |
| 3-4 | Re-test winners | Confirmar resultados |

---

## Ferramentas para Tracking

### Planilha de Testes (Google Sheets)

```
Colunas recomendadas:
- Test ID
- Test Name
- Hypothesis
- Variable
- Variation A description
- Variation B description
- Start Date
- End Date
- Primary Metric
- Result A
- Result B
- % Difference
- Statistically Significant (Y/N)
- Winner
- Implementation Status
- Notes
```

### Automacao

**Para contas com acesso a API:**
- Supermetrics (pull data automatico)
- Notion + Zapier (documentacao automatica)
- Airtable (database de testes)

---

## Mindset de Growth Hacker

### Regras de Ouro (Neil Patel)

1. **"Test everything, assume nothing"**
   - Intuicao e util, dados sao definitivos

2. **"Small wins compound"**
   - 10% de melhoria em 5 areas = 61% total

3. **"Fail fast, learn faster"**
   - Teste que nao funcionou e dado valioso

4. **"Document religiously"**
   - Conhecimento nao documentado se perde

5. **"Replicate before scaling"**
   - Confirme resultados antes de implementar amplamente

---

## Fontes

- Sean Ellis - "Hacking Growth" (Framework ICE)
- Neil Patel - Digital Marketing Experiments
- Optimizely - A/B Testing Statistical Guide
- ConversionXL - Experimentation Research
- Andrew Chen - Growth Engineering Principles

#galaxy-creation