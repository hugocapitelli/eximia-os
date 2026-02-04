---
title: "KB_16: Templates e Exemplos de A3"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-16-templates-exemplos"
  - "kb_16: templates e exemplos de"
  - "template a3 padrão"
  - "exemplo 1: a3 operacional — re"
  - "exemplo 2: a3 tático — redução"
  - "checklist de revisão do a3"
  - "antes de apresentar"
  - "durante nemawashi"
  - "após implementação"
  - "fontes"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_16: Templates e Exemplos de A3

## Template A3 Padrão

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A3: [TÍTULO DO A3]                                                      │
│  Tipo: ☐ Estratégico  ☐ Tático  ☐ Operacional   Código: [XXX-YYYY-NNN] │
│  Owner: [Nome]    Sponsor: [Nome]    Data: [DD/MM/AAAA]    Versão: [X] │
├────────────────────────────────┬────────────────────────────────────────┤
│          LADO ESQUERDO         │           LADO DIREITO                 │
│             (PLAN)             │           (DO + CHECK)                 │
├────────────────────────────────┼────────────────────────────────────────┤
│ 1. CONTEXTO                    │ 5. CONTRAMEDIDAS                       │
│ [Máx 5 linhas]                 │                                        │
│ - Vinculação ao Hoshin         │ | CM | Causa Raiz | Contramedida | DoD │
│ - Por que este A3 existe       │ |----| -----------|--------------|---- │
│ - Impacto esperado             │ | 1  |            |              |     │
│                                │ | 2  |            |              |     │
│                                │ | 3  |            |              |     │
├────────────────────────────────┼────────────────────────────────────────┤
│ 2. CONDIÇÕES ATUAIS            │ 6. CRONOGRAMA                          │
│                                │                                        │
│ [Dados objetivos]              │ | Ação | Resp | Jan|Fev|Mar|...|Status│
│                                │ |------|------|----|----|---|---|-----│
│ | Indicador | Atual | Meta |   │ | 1.1  |      | ██ |    |   |   |     │
│ |-----------|-------|------|   │ | 1.2  |      |    | ██ |   |   |     │
│ | KPI 1     |       |      |   │ | 2.1  |      |    | ██ | ██|   |     │
│ | KPI 2     |       |      |   │                                        │
│ | KPI 3     |       |      |   │ Gates: ▼ G1 (Mar)  ▼ G2 (Jun)         │
│                                │                                        │
│ [Gráfico de tendência]         │                                        │
├────────────────────────────────┼────────────────────────────────────────┤
│ 3. OBJETIVOS E METAS           │ 7. MONITORAMENTO                       │
│                                │                                        │
│ 1. [Objetivo SMART]            │ Indicadores de RESULTADO:              │
│ 2. [Objetivo SMART]            │ | Indicador | Meta | 🟢 | 🟡 | 🔴 |    │
│ 3. [Objetivo SMART]            │ |-----------|------|----|----|----│    │
│                                │ |           |      |    |    |    │    │
│                                │                                        │
│                                │ Indicadores de EFICÁCIA:               │
│                                │ | Indicador | Meta | 🟢 | 🟡 | 🔴 |    │
│                                │ |-----------|------|----|----|----│    │
│                                │                                        │
│                                │ Ritual:                                │
│                                │ - Frequência: [Mensal]                 │
│                                │ - Participantes: [Lista]               │
│                                │ - Foco: [Decisão, não explicação]      │
├────────────────────────────────┼────────────────────────────────────────┤
│ 4. ANÁLISE DE CAUSA            │                                        │
│                                │                                        │
│ EFEITO: [Frase única]          │                                        │
│                                │                                        │
│        ┌─────────────┐         │                                        │
│   M1───┤             ├───M4    │                                        │
│   M2───┤   EFEITO    ├───M5    │                                        │
│   M3───┤             ├───M6    │                                        │
│        └─────────────┘         │                                        │
│                                │                                        │
│ 5 PORQUÊS (causas prioritárias)│                                        │
│ Causa: [X]                     │                                        │
│ P1: ___ P2: ___ P3: ___        │                                        │
│ P4: ___ P5: [CAUSA RAIZ]       │                                        │
│                                │                                        │
│ Validação reversa: ✓           │                                        │
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## Exemplo 1: A3 Operacional — Redução de Defeitos

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A3: REDUÇÃO DE DEFEITOS DE MONTAGEM — LINHA 3                          │
│  Tipo: ☒ Operacional   Código: OPE-2026-012                             │
│  Owner: Maria Silva    Sponsor: João Santos    Data: 15/01/2026  V: 1   │
├────────────────────────────────┬────────────────────────────────────────┤
│ 1. CONTEXTO                    │ 5. CONTRAMEDIDAS                       │
│                                │                                        │
│ O objetivo tático "Aumentar    │ | # | Causa Raiz        | Contramedida │
│ OEE de 72% para 85%" requer    │ |---|-------------------|--------------|
│ redução de perdas por qualid.  │ | 1 | Falta trabalho    | Implementar  │
│ A Linha 3 representa 45% dos   │ |   | padronizado       | trabalho pad.│
│ defeitos da fábrica.           │ |   |                   | visual       │
│                                │ |---|-------------------|--------------|
│ Hoshin: OEE 85%                │ | 2 | Ausência de       | Instalar     │
│                                │ |   | detecção auto.    | poka-yoke    │
│                                │ |   |                   | sensor       │
├────────────────────────────────┼────────────────────────────────────────┤
│ 2. CONDIÇÕES ATUAIS            │ 6. CRONOGRAMA                          │
│                                │                                        │
│ | Indicador      | Atual| Meta │ | Ação           | Resp  | Jan|Fev|Mar│
│ |----------------|------|------│ |----------------|-------|----|----|---│
│ | % Defeito L3   | 3,2% | 0,5% │ | Mapear processo| Maria | ██ |    |   │
│ | PPM L3         | 32000| 5000 │ | Criar padrão   | Carlos|    | ██ |   │
│ | Custo refugo   | R$45k| R$7k │ | Treinar equipe | Maria |    | ██ |   │
│                                │ | Instalar sensor| TI    |    |    | ██│
│ Tendência: ↗️ Piorando         │ | Validar result.| Maria |    |    | ██│
│ (+0,3% vs mês anterior)        │                                        │
│                                │ Gate: ▼ Go-Live (01/Mar)               │
├────────────────────────────────┼────────────────────────────────────────┤
│ 3. OBJETIVOS E METAS           │ 7. MONITORAMENTO                       │
│                                │                                        │
│ 1. Reduzir % defeito de 3,2%   │ RESULTADO:                             │
│    para 0,5% até Mar/2026      │ | Indicador  | Meta  | 🟢  | 🟡  | 🔴 │
│                                │ | % Defeito  | 0,5%  |≤0,5%|0,5-1%|>1%│
│ 2. Eliminar 100% dos defeitos  │                                        │
│    do tipo "inversão de peça"  │ EFICÁCIA:                              │
│                                │ | Indicador  | Meta  | 🟢  | 🟡  | 🔴 │
│ 3. Treinar 100% dos operadores │ | Aderência  | 95%   | ≥95%|90-94|<90%│
│    no novo padrão até Fev/2026 │ | padrão     |       |     |     |    │
│                                │                                        │
│                                │ Ritual: Semanal, Seg 8h, L3            │
├────────────────────────────────┼────────────────────────────────────────┤
│ 4. ANÁLISE DE CAUSA            │                                        │
│                                │                                        │
│ EFEITO: "Defeito de montagem   │                                        │
│ 3,2% na Linha 3"               │                                        │
│                                │                                        │
│ MÉTODO: Sem trabalho padroniz. │                                        │
│ MEDIDA: Inspeção só no final   │                                        │
│ M.OBRA: Turnover alto, trein.↓ │                                        │
│ MÁQUINA: Sem poka-yoke         │                                        │
│ MATERIAL: OK                   │                                        │
│ M.AMB.: Pressão por volume     │                                        │
│                                │                                        │
│ 5 PORQUÊS — "Sem trab. padron."│                                        │
│ P1: Por que não há padrão?     │                                        │
│ → Nunca foi documentado        │                                        │
│ P2: Por que não foi documentado│                                        │
│ → Não havia processo de criação│                                        │
│ P3: Por que não havia processo?│                                        │
│ → Área de engenharia não tinha │                                        │
│   rotina de padronização       │                                        │
│ P4: Por que não tinha rotina?  │                                        │
│ → CAUSA RAIZ: Sistema de gestão│                                        │
│   não exige padrão antes de    │                                        │
│   iniciar produção             │                                        │
│ Validação: ✓ (PORTANTO válido) │                                        │
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## Exemplo 2: A3 Tático — Redução de Lead Time

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A3: REDUÇÃO DE LEAD TIME DE DESENVOLVIMENTO                            │
│  Tipo: ☒ Tático   Código: TAT-2026-003                                  │
│  Owner: Pedro Costa   Sponsor: Ana Diretor   Data: 10/01/2026    V: 2   │
├────────────────────────────────┬────────────────────────────────────────┤
│ 1. CONTEXTO                    │ 5. CONTRAMEDIDAS                       │
│                                │                                        │
│ O objetivo estratégico         │ | # | Causa Raiz        | Contramedida │
│ "Lançar 4 produtos/ano"        │ |---|-------------------|--------------|
│ (Hoshin 2026) está ameaçado    │ | 1 | Gates sequenciais | Implementar  │
│ pelo lead time atual de 18     │ |   | sem paralelismo   | Stage-Gate   │
│ meses. Meta: 9 meses.          │ |   |                   | concorrente  │
│                                │ |---|-------------------|--------------|
│ Este A3 desdobra a estratégia  │ | 2 | Retrabalho por    | Criar Design │
│ "Time-to-Market" do Hoshin.    │ |   | requisitos tardios| Review ritual│
│                                │ |---|-------------------|--------------|
│                                │ | 3 | Testes manuais    | Automatizar  │
│                                │ |   | demorados         | 80% dos tests│
├────────────────────────────────┼────────────────────────────────────────┤
│ 2. CONDIÇÕES ATUAIS            │ 6. CRONOGRAMA                          │
│                                │                                        │
│ | Indicador      | Atual| Meta │ | Iniciativa     | Owner | Q1|Q2|Q3|Q4│
│ |----------------|------|------│ |----------------|-------|---|--|--|--│
│ | Lead Time      | 18m  | 9m   │ | Stage-Gate novo| Pedro | ██|  |  |  │
│ | Produtos/ano   | 2    | 4    │ | Design Review  | Ana   | ██|██|  |  │
│ | % Retrabalho   | 35%  | 10%  │ | Automação test | TI    |   |██|██|  │
│ | First Pass Yld | 45%  | 80%  │ | Piloto produto | Time  |   |  |██|  │
│                                │ | Rollout geral  | Pedro |   |  |  |██│
│ Benchmark: Concorrente X = 8m  │                                        │
│                                │ Gates: ▼Q1  ▼Q2  ▼Q3  ▼Q4             │
├────────────────────────────────┼────────────────────────────────────────┤
│ 3. OBJETIVOS E METAS           │ 7. MONITORAMENTO                       │
│                                │                                        │
│ 1. Reduzir lead time de 18     │ RESULTADO:                             │
│    para 9 meses até Dez/2026   │ | Indicador  | Meta  | 🟢  | 🟡  | 🔴 │
│                                │ | Lead Time  | 9m    | ≤9m |9-12m|>12m│
│ 2. Aumentar First Pass Yield   │ | FPY        | 80%   | ≥80%|70-79|<70%│
│    de 45% para 80%             │                                        │
│                                │ EFICÁCIA:                              │
│ 3. Reduzir % retrabalho de     │ | Indicador  | Meta  | 🟢  | 🟡  | 🔴 │
│    35% para 10%                │ | Aderência  | 100%  | 100%|90-99|<90%│
│                                │ | Stage-Gate |       |     |     |    │
│ 4. Lançar 4 produtos em 2026   │                                        │
│                                │ Ritual: Mensal, 1ª Seg, Diretoria      │
├────────────────────────────────┼────────────────────────────────────────┤
│ 4. ANÁLISE DE CAUSA            │                                        │
│                                │ A3 OPERACIONAIS DERIVADOS:             │
│ EFEITO: "Lead Time de 18 meses │                                        │
│ no desenvolvimento de produto" │ 1. OPE-2026-015: Automação de testes   │
│                                │ 2. OPE-2026-016: Design Review process │
│ MÉTODO: Gates sequenciais,     │ 3. OPE-2026-017: Stage-Gate piloto     │
│   sem critérios claros         │                                        │
│ MEDIDA: Métricas só no final   │                                        │
│ M.OBRA: Silos funcionais       │                                        │
│ MÁQUINA: Testes manuais        │                                        │
│ MATERIAL: Requisitos incompletos                                        │
│ M.AMB.: Cultura "hero mode"    │                                        │
│                                │                                        │
│ 5 PORQUÊS — "Gates sequenciais"│                                        │
│ P1: Por que sequenciais?       │                                        │
│ → Processo tradicional "waterfall"                                      │
│ P2: Por que waterfall?         │                                        │
│ → CAUSA RAIZ: Não há sistema   │                                        │
│   de desenvolvimento integrado │                                        │
│   que permita paralelismo      │                                        │
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## Checklist de Revisão do A3

### Antes de Apresentar

- [ ] Contexto explica POR QUE o A3 existe?
- [ ] Vinculação clara ao Hoshin?
- [ ] Mínimo 3 evidências quantitativas?
- [ ] Objetivos são SMART?
- [ ] Ishikawa tem causas sistêmicas (não pessoas)?
- [ ] 5 Porquês validam de baixo para cima?
- [ ] Contramedidas são 1:1 com causas raiz?
- [ ] Cronograma cobre 100% das contramedidas?
- [ ] Indicadores medem resultado E eficácia?
- [ ] Cabe em uma página (conceitual)?

### Durante Nemawashi

- [ ] Sponsor validou contexto?
- [ ] Áreas impactadas foram consultadas?
- [ ] Responsáveis concordam com prazos?
- [ ] Objeções foram endereçadas?

### Após Implementação

- [ ] Resultado foi atingido?
- [ ] Contramedida funcionou como esperado?
- [ ] O que aprendemos (Hansei)?
- [ ] Potencial de Yokoten identificado?
- [ ] Padronização documentada?

---

## Fontes

- Shook, John. "Managing to Learn" - LEI (2008)
- Sobek II & Smalley. "Understanding A3 Thinking" (2008)
- Toyota Motor Corporation - A3 Templates internos
- Dennis, Pascal. "Getting the Right Things Done" (2006)

#galaxy-creation