# META_ANALYSIS.md — LXD Architect Domain Knowledge Map

## 🎯 Purpose

Este documento mapeia o domínio de conhecimento do LXD Architect, identificando as conexões entre teorias, frameworks e aplicações práticas no campo de Learning Experience Design.

---

## 🧬 DNA do Domínio

```
                     ┌─────────────────────────────────────────┐
                     │       LEARNING EXPERIENCE DESIGN        │
                     │         (Domínio Central)               │
                     └────────────────┬────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  TEORIAS BASE   │       │  FRAMEWORKS DE  │       │   TECNOLOGIAS   │
│  (Fundamentos)  │       │     DESIGN      │       │   & TENDÊNCIAS  │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
    ┌────┴────┐               ┌────┴────┐               ┌────┴────┐
    ▼         ▼               ▼         ▼               ▼         ▼
Andragogia  Kolb           ADDIE      Action        LMS        AI/ML
Heutagogia  Neurociência   SAM        Mapping       xAPI       VR/AR
```

---

## 📚 Mapa de Dependências Teóricas

### Layer 1: Fundações Filosóficas

| Teoria | Autor(es) | Ano | Contribuição para LXD |
|--------|-----------|-----|----------------------|
| Construtivismo | Piaget | 1936 | Conhecimento construído pelo aprendiz |
| Sócio-construtivismo | Vygotsky | 1978 | Zona de Desenvolvimento Proximal |
| Pragmatismo Experiencial | Dewey | 1938 | Aprender fazendo |
| Cognitivismo | Ausubel | 1963 | Aprendizagem significativa |

### Layer 2: Teorias de Aprendizagem Adulta

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTINUUM DE AUTONOMIA                                    │
│                                                                              │
│   PEDAGOGIA ────────────► ANDRAGOGIA ────────────► HEUTAGOGIA               │
│   (Dependente)            (Autodirigido)            (Autodeterminado)        │
│                                                                              │
│   • Knowles (1968)        • Knowles (1975)          • Hase/Kenyon (2000)    │
│   • 6 Princípios          • Self-Directed           • PAH Continuum         │
│                           • Learning                 • Capability Focus      │
│                                                                              │
│   Foco: Competência ─────► Aplicação ─────────────► Aprender a Aprender    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer 3: Aprendizagem Experiencial

```
┌─────────────────────────────────────────────────────────────────┐
│                     CICLO DE KOLB (1984)                         │
│                                                                  │
│              EC (Experiência Concreta)                           │
│                        │                                         │
│         ┌──────────────┼──────────────┐                         │
│         │              │              │                         │
│         ▼              │              ▼                         │
│   EA (Experimentação)──┼──── OR (Observação Reflexiva)          │
│                        │                                         │
│                        ▼                                         │
│              CA (Conceituação Abstrata)                          │
│                                                                  │
│   Perfis: Divergente | Assimilador | Convergente | Acomodador   │
└─────────────────────────────────────────────────────────────────┘
```

### Layer 4: Neurociência da Aprendizagem

| Princípio (Caine & Caine) | Implicação para Design |
|---------------------------|------------------------|
| Cérebro é social | Inclua atividades colaborativas |
| Busca padrões | Use frameworks e estruturas visuais |
| Emoções são críticas | Crie ambiente seguro, use storytelling |
| Processa partes e todo | Balance detalhe e visão geral |
| Atenção consciente/periférica | Design ambiental importa |
| Memória espacial/mecânica | Evite memorização forçada |

---

## 🔧 Framework de Frameworks

### Categoria: Design Instrucional

```
                          ┌─────────────┐
                          │   ADDIE     │ ◄─── Framework Clássico
                          │ (Waterfall) │
                          └──────┬──────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌──────────┐       ┌──────────┐       ┌──────────────┐
       │   SAM    │       │  Action  │       │   Backward   │
       │  (Agile) │       │ Mapping  │       │    Design    │
       └──────────┘       └──────────┘       └──────────────┘
       Michael Allen      Cathy Moore       Wiggins/McTighe
           2012               2008               1998
```

### Categoria: Avaliação

```
┌─────────────────────────────────────────────────────────────────┐
│                  MODELO DE AVALIAÇÃO INTEGRADO                   │
│                                                                  │
│   KIRKPATRICK (4 Níveis)           PHILLIPS (5 Níveis)          │
│   ────────────────────             ────────────────────          │
│   1. Reação                        1. Reação + Ação Planejada   │
│   2. Aprendizagem                  2. Aprendizagem              │
│   3. Comportamento                 3. Aplicação + Implementação │
│   4. Resultados                    4. Impacto no Negócio        │
│                                    5. ROI (Return on Investment)│
│                                                                  │
│   Foco: O que aconteceu? ──────► Quanto vale em R$?             │
└─────────────────────────────────────────────────────────────────┘
```

### Categoria: Taxonomias de Objetivos

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLEXIDADE COGNITIVA                        │
│                                                                  │
│   BLOOM (Revisado)              MARZANO                 WEBB    │
│   ────────────────              ───────                 ────    │
│   6. Criar                      4. Self-System          4. DOK  │
│   5. Avaliar                    3. Metacognition        Extended│
│   4. Analisar                   2. Processing           Thinking│
│   3. Aplicar                    1. Retrieval                    │
│   2. Entender                                                   │
│   1. Lembrar                                                    │
│                                                                  │
│   Uso: Objetivos ───────────── Profundidade ─────── Rigor       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Matriz de Integração: Teoria → Prática

| Teoria/Framework | Atividade EC | Atividade OR | Atividade CA | Atividade EA |
|------------------|--------------|--------------|--------------|--------------|
| Kolb | Simulação | Debriefing | Aula | Roleplay |
| Andragogia | Caso real | Discussão | Framework | Plano de ação |
| Heutagogia | Escolha livre | Auto-reflexão | Auto-estudo | Projeto autônomo |
| Action Mapping | Cenário | "O que faria?" | Conceito mínimo | Prática |
| Neurociência | Multisensorial | Journaling | Chunking | Espaçamento |
| Gagne | Atenção | Recall | Apresentação | Performance |

---

## 🎯 Competência vs Capability (Heutagogia)

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPETÊNCIA vs CAPABILITY                     │
│                                                                  │
│   COMPETÊNCIA (Saber Fazer)                                     │
│   ─────────────────────────                                      │
│   • Aplicar em contexto conhecido                               │
│   • Seguir procedimentos                                        │
│   • Reproduzir comportamento                                    │
│   • Desempenho previsível                                       │
│                                                                  │
│                         ↓ EVOLUI PARA ↓                         │
│                                                                  │
│   CAPABILITY (Saber Aprender a Fazer)                           │
│   ───────────────────────────────────                            │
│   • Aplicar em contexto NOVO                                    │
│   • Adaptar e inovar                                            │
│   • Resolver problemas inéditos                                 │
│   • Auto-eficácia e confiança                                   │
│                                                                  │
│   Design: Mover de competência → capability progressivamente   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Modelo de Maturidade em LXD

```
Level 1: REATIVO
├── Treinamento sob demanda
├── Foco em conteúdo
└── Sem avaliação sistemática

Level 2: ESTRUTURADO
├── Frameworks básicos (ADDIE)
├── Kirkpatrick níveis 1-2
└── Catálogo de cursos

Level 3: ESTRATÉGICO
├── Alignment com OKRs
├── Phillips ROI
└── Blended learning

Level 4: AUTONOMIA
├── Heutagogia integrada
├── Trilhas personalizadas
└── Aprendizado contínuo

Level 5: ADAPTATIVO
├── IA/ML personalização
├── Learning analytics
└── Self-evolving pathways
```

---

## 🔗 Conexões Inter-Frameworks

### Kolb ↔ Gagne
- EC = Attention + Recall
- OR = Guidance
- CA = Content + Examples
- EA = Practice + Assess + Transfer

### Andragogia ↔ Bloom
- Need to Know → Alta taxa de Análise/Avaliação
- Experience → Cases em níveis superiores
- Readiness → Just-in-time design
- Problem-Centered → Aplicar/Criar

### Kirkpatrick ↔ Action Mapping
- Level 1 → Não é foco (validação mínima)
- Level 3 → FOCO PRINCIPAL (comportamento)
- Level 4 → Business Goal (ponto de partida)

---

## 📖 Referências Fundamentais

1. Kolb, D.A. (1984). *Experiential Learning*
2. Knowles, M.S. (1984). *The Adult Learner*
3. Hase, S. & Kenyon, C. (2000). *From Andragogy to Heutagogy*
4. Moore, C. (2017). *Map It: Action Mapping*
5. Caine, R. & Caine, G. (1991). *Making Connections*
6. Kirkpatrick, D.L. (1959). *Four Levels*
7. Phillips, J.J. (1996). *ROI Process*

---

**Documento criado por:** Z1_Architect | Z Squad
**Data:** 2026-01-07
**Versão:** 1.0


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->