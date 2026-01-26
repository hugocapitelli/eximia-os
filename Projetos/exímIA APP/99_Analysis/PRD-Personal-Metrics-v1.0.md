# PRD — Personal Metrics System
**Documento:** 99_Analysis / Personal Metrics
**Versao:** 1.0.0
**Data:** 26 Janeiro 2026
**Autor:** Hugo (Conceito) + Claude (Estruturacao)
**Tipo:** Feature PRD
**Status:** Draft

---

## Sumario Executivo

Este documento especifica o **Personal Metrics System** — um sistema proprietario de medicao de produtividade, criatividade e execucao pessoal. Diferente de metricas tradicionais focadas em output, este sistema mede a **capacidade de transformar ideias em resultados concretos**.

### Diferenciais

| Aspecto | Metricas Tradicionais | Personal Metrics System |
|---------|----------------------|-------------------------|
| Foco | Quantidade de tarefas | Qualidade de conclusao |
| Perspectiva | Inicio de projetos | **Finalizacao** de projetos |
| Medicao | Output isolado | Fluxo criativo integrado |
| Insight | Estatico | Dinamico e contextual |

---

## Indice

1. [Problema](#1-problema)
2. [Indice de Acabativa](#2-indice-de-acabativa)
3. [Sistema de Insights](#3-sistema-de-insights)
4. [Integracao com Memos](#4-integracao-com-memos)
5. [Formula de Criatividade & Produtividade](#5-formula-composta)
6. [Dashboard](#6-dashboard)
7. [Arquitetura Tecnica](#7-arquitetura)
8. [Roadmap](#8-roadmap)

---

# 1. Problema

## 1.1 O Paradoxo da Iniciativa

> "Existe a iniciativa... mas e a acabativa?"

Empreendedores sofrem de um problema comum: **alta capacidade de iniciar, baixa capacidade de concluir**. As ferramentas atuais celebram o inicio de projetos, mas nao medem o que realmente importa — a **transformacao de ideias em resultados**.

## 1.2 Sintomas

| Sintoma | Impacto |
|---------|---------|
| **Projeto Cemetery** | Dezenas de projetos iniciados, poucos concluidos |
| **Insight Amnesia** | Ideias brilhantes esquecidas em horas |
| **Creative Blindness** | Incapacidade de ver padroes na propria criatividade |
| **Productivity Theater** | Sensacao de ocupacao sem progresso real |

## 1.3 Oportunidade

Um sistema que:
- Mede **acabativa**, nao apenas iniciativa
- Captura e preserva **insights** antes que desaparecam
- Revela **padroes de criatividade** ao longo do tempo
- Cria **accountability** atraves de dados

---

# 2. Indice de Acabativa

## 2.1 Definicao

> **Indice de Acabativa (IA)** — Metrica proprietaria que mede a porcentagem de progresso necessaria para concluir todos os projetos ativos.

### Conceito Central

O Indice de Acabativa responde a pergunta:
> "Quanto do meu trabalho ja foi feito vs. quanto ainda falta?"

## 2.2 Formula Base

```
                  Sum(Progresso de cada projeto)
Acabativa(%) = ───────────────────────────────────── x 100
                Sum(100% de cada projeto ativo)

Simplificado:
                  Sum(progress_i)
Acabativa(%) = ─────────────────── x 100
                  n * 100

Onde:
- progress_i = progresso atual do projeto i (0-100%)
- n = numero total de projetos ativos
```

### Exemplo Pratico

| Projeto | Progresso |
|---------|-----------|
| App MVP | 80% |
| Clone Elon Musk | 65% |
| Curso LXD | 40% |
| PRD Harven | 90% |
| Redesign Brand | 20% |

```
Acabativa = (80 + 65 + 40 + 90 + 20) / (5 * 100) = 295/500 = 59%
```

**Interpretacao:** Voce esta 59% do caminho para concluir todos os seus projetos.

## 2.3 Variacoes do Indice

### 2.3.1 Acabativa Ponderada

Considera a prioridade de cada projeto:

```
                    Sum(progress_i * weight_i)
Acabativa_W(%) = ──────────────────────────────── x 100
                    Sum(100 * weight_i)

Onde:
- weight_i = peso do projeto (1-5 baseado em prioridade)
```

### 2.3.2 Acabativa por Categoria

```
Acabativa_Cat[c] = Sum(progress para projetos na categoria c) / n_c * 100
```

Categorias sugeridas:
- **Estrategico** (iniciativas de longo prazo)
- **Tatico** (projetos de curto prazo)
- **Operacional** (tarefas recorrentes)

### 2.3.3 Acabativa Delta (Velocidade)

Mede a taxa de conclusao ao longo do tempo:

```
Acabativa_Delta = Acabativa(hoje) - Acabativa(7 dias atras)

Interpretacao:
- Positivo: Progresso real acontecendo
- Zero: Estagnacao
- Negativo: Mais projetos iniciados que concluidos
```

## 2.4 Benchmarks e Metas

| Nivel | Faixa | Status | Acao |
|-------|-------|--------|------|
| **Excelente** | > 80% | Verde | Considere novos projetos |
| **Bom** | 60-80% | Azul | Mantenha o ritmo |
| **Atencao** | 40-60% | Amarelo | Priorize conclusoes |
| **Critico** | < 40% | Vermelho | Pause novos projetos |

## 2.5 Regras de Negocio

1. **Projetos inativos > 30 dias** sao automaticamente pausados (nao contam no calculo)
2. **Projetos concluidos** sao removidos do calculo ativo apos 7 dias
3. **Novos projetos** entram com progresso 0% automaticamente
4. **Micro-projetos** (< 2h estimado) podem ser agrupados em "Quick Wins"

---

# 3. Sistema de Insights

## 3.1 Definicao

> **Insight** — Um momento de clareza cognitiva que gera nova compreensao, conexao ou ideia acionavel.

### Tipos de Insight

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **Eureka** | Descoberta repentina | "A conexao entre X e Y resolve Z!" |
| **Conexao** | Link entre conceitos distantes | "Zettelkasten + Multi-agentes = ..." |
| **Refinamento** | Melhoria de ideia existente | "Se mudar A para B, funciona melhor" |
| **Contradicao** | Identificacao de conflito | "Minha crenca sobre X estava errada" |
| **Sintese** | Unificacao de multiplas ideias | "A, B e C sao aspectos de D" |

## 3.2 Metricas de Insight

### 3.2.1 Volume

```
Insights_Dia = Total de insights capturados em 24h
Insights_Semana = Total de insights capturados em 7d
Insights_Mes = Total de insights capturados em 30d
Insights_Ano = Total de insights capturados em 365d
```

### 3.2.2 Taxa de Insight (Insight Rate)

```
                      Insights_Periodo
Insight_Rate = ───────────────────────────── x 100
                Dias_Trabalhados_Periodo

Meta sugerida: >= 3 insights/dia trabalhado
```

### 3.2.3 Insight Quality Score (IQS)

Baseado em criterios ponderados:

| Criterio | Peso | Descricao |
|----------|------|-----------|
| **Acionabilidade** | 30% | Pode gerar acao concreta? |
| **Novidade** | 25% | E genuinamente novo? |
| **Conexoes** | 25% | Conecta com quantos conceitos? |
| **Impacto Potencial** | 20% | Potencial de transformacao? |

```
IQS = (Acionabilidade * 0.3) + (Novidade * 0.25) + (Conexoes * 0.25) + (Impacto * 0.2)

Onde cada criterio e avaliado de 1-10
```

### 3.2.4 Insight Conversion Rate

```
                        Insights que geraram acao
Insight_Conversion = ─────────────────────────────── x 100
                          Total de Insights

Meta: >= 30%
```

## 3.3 Captura de Insights

### Interface Quick Capture

```
┌────────────────────────────────────────────┐
│  INSIGHT CAPTURE                     [X]  │
├────────────────────────────────────────────┤
│                                            │
│  Tipo: [Eureka v] [Conexao] [Refinamento] │
│        [Contradicao] [Sintese]            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Descreva seu insight...              │ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Contexto: [O que voce estava fazendo?]   │
│                                            │
│  Tags: [+] ____________________________   │
│                                            │
│  [Salvar Rapido]    [Expandir]  [Cancel] │
└────────────────────────────────────────────┘
```

### Hotkey Global

`Cmd/Ctrl + Shift + I` — Abre captura de insight de qualquer tela

---

# 4. Integracao com Memos

## 4.1 Arquitetura Conceitual

O sistema de **Memos** ja existe no eximIA.OS como banco de ideias baseado em Zettelkasten. A integracao cria um fluxo unificado:

```
CAPTURA RAPIDA (qualquer tela)
        |
        v
   [INBOX UNIVERSAL]
        |
        +---> Se = Insight --> Sistema de Insights (metricas)
        |
        +---> Se = Idea --> Memos (atoms)
        |
        +---> Se = Task --> Journey (goals/habits)
        |
        +---> Se = Project --> PrototypOS
        |
        v
   [AI CATEGORIZATION]
        |
        v
   [USER APPROVAL]
        |
        v
   [STORAGE + METRICS]
```

## 4.2 Memo Metrics

### 4.2.1 Volume

```
Memos_Dia = Total de memos capturados em 24h
Memos_Semana = Total de memos capturados em 7d
Memos_Mes = Total de memos capturados em 30d
```

### 4.2.2 Memo Quality Metrics

| Metrica | Formula | Meta |
|---------|---------|------|
| **Connection Density** | Links por memo | > 2.5 |
| **Cluster Formation Rate** | Memos em clusters / total | > 60% |
| **Insight Generation** | Insights gerados / clusters | > 0.3 |
| **Retrieval Rate** | Memos recuperados via busca / total | > 40% |

### 4.2.3 Memo Graph Health

```
Graph_Health = (Density * 0.4) + (Cluster_Rate * 0.3) + (Retrieval * 0.3)

Onde:
- Density = min(Connection_Density / 3, 1) * 100
- Cluster_Rate = (Memos em clusters / total) * 100
- Retrieval = (Memos buscados / total) * 100
```

## 4.3 Quick Capture Omnipresente

### 4.3.1 Componente Flutuante

```
┌───────────────────────────────────────────────┐
│  [+] Quick Capture                  [_][X]   │
├───────────────────────────────────────────────┤
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ Digite sua ideia, insight ou tarefa...  │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  AI Suggestion: [Insight - Eureka]   [82%]  │
│                                               │
│  [Voice] [Image] [Link]         [Save + AI] │
└───────────────────────────────────────────────┘
```

### 4.3.2 Posicionamento

| Tela | Posicao | Trigger |
|------|---------|---------|
| **Desktop** | Canto inferior direito (FAB) | Click ou `Cmd+Shift+C` |
| **Mobile** | Bottom sheet deslizante | Swipe up ou FAB |
| **Modal View** | Centro da tela | `Cmd+K` (command palette) |

### 4.3.3 Fluxo de Processamento AI

```
1. Usuario digita texto
2. AI analisa em tempo real:
   - Classificacao: [Insight | Memo | Task | Project | Other]
   - Confianca: 0-100%
   - Tags sugeridas
   - Conexoes potenciais (se Memo/Insight)
3. Preview de categorizacao mostrado
4. Usuario confirma ou ajusta
5. Item salvo no destino apropriado
6. Metricas atualizadas automaticamente
```

---

# 5. Formula Composta

## 5.1 Creative Productivity Index (CPI)

> Uma metrica unificada que combina execucao, criatividade e organizacao.

### Formula Principal

```
CPI = (Acabativa * W1) + (Insight_Score * W2) + (Memo_Health * W3) + (Consistency * W4)

Onde:
- Acabativa = Indice de Acabativa (0-100)
- Insight_Score = (Insight_Rate * IQS_Avg * Conversion_Rate)^(1/3) normalizado
- Memo_Health = Graph_Health score (0-100)
- Consistency = Streak de dias ativos / 30 * 100

Pesos Sugeridos:
- W1 (Acabativa) = 0.35
- W2 (Insight) = 0.25
- W3 (Memo) = 0.15
- W4 (Consistency) = 0.25
```

### 5.1.1 Componentes Detalhados

**Acabativa (35%)** — O mais importante
- Mede execucao real
- Projetos concluidos > projetos iniciados

**Insight Score (25%)** — Criatividade capturada
- Quantidade + Qualidade + Conversao
- Insights que viram acao

**Memo Health (15%)** — Organizacao do conhecimento
- Conexoes entre ideias
- Base de conhecimento ativa

**Consistency (25%)** — Disciplina
- Streak de dias ativos
- Regularidade > explosoes

## 5.2 Sub-Indices Derivados

### 5.2.1 Execution Index (EI)

```
EI = (Acabativa * 0.6) + (Consistency * 0.4)
```
Foco em **fazer acontecer**.

### 5.2.2 Creativity Index (CI)

```
CI = (Insight_Score * 0.5) + (Memo_Health * 0.3) + (Connection_Density * 0.2)
```
Foco em **gerar e conectar ideias**.

### 5.2.3 Balance Ratio

```
Balance = EI / CI

Interpretacao:
- > 1.5: Over-executing, under-thinking
- 0.7 - 1.5: Balanced
- < 0.7: Over-thinking, under-executing
```

## 5.3 Benchmarks CPI

| Nivel | CPI | Interpretacao |
|-------|-----|---------------|
| **Elite** | > 85 | Top performer, ritmo sustentavel |
| **Alto** | 70-85 | Excelente equilibrio |
| **Medio** | 50-70 | Bom, com espaco para melhoria |
| **Baixo** | 30-50 | Atencao necessaria |
| **Critico** | < 30 | Intervencao urgente |

---

# 6. Dashboard

## 6.1 Layout Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSONAL METRICS DASHBOARD                              [Dia v] [Refresh] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   CPI SCORE     │  │   ACABATIVA     │  │   CREATIVITY    │            │
│  │                 │  │                 │  │                 │            │
│  │      72         │  │      59%        │  │      68         │            │
│  │    ████████░░   │  │   ████████░░░░  │  │   ████████░░░   │            │
│  │   +5 vs semana  │  │   +8% vs semana │  │   +3 vs semana  │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INSIGHTS HOJE                           MEMO ACTIVITY                     │
│  ┌──────────────────────────────┐       ┌────────────────────────────┐    │
│  │  [3] Insights capturados     │       │  Graph Health: 74%         │    │
│  │                              │       │                            │    │
│  │  Eureka    [1] ***           │       │  Atoms: 47  (+3 hoje)      │    │
│  │  Conexao   [1] ***           │       │  Clusters: 12              │    │
│  │  Sintese   [1] ***           │       │  Insights: 3               │    │
│  │                              │       │  Orphans: 8                │    │
│  │  Quality Avg: 7.2/10         │       │                            │    │
│  │  Conversion: 42%             │       │  [Ver Grafo]               │    │
│  └──────────────────────────────┘       └────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PROJETOS ATIVOS (5)                                    [+ Novo Projeto]   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  App MVP              ████████████████████░░░░  80%   [Estrategico] │  │
│  │  Clone Elon           █████████████░░░░░░░░░░░  65%   [Estrategico] │  │
│  │  PRD Harven           ██████████████████░░░░░░  90%   [Tatico]      │  │
│  │  Curso LXD            ████████░░░░░░░░░░░░░░░░  40%   [Estrategico] │  │
│  │  Redesign Brand       ████░░░░░░░░░░░░░░░░░░░░  20%   [Tatico]      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TENDENCIAS (30 DIAS)                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │         CPI                 Acabativa              Insights          │  │
│  │    80 ┤                                                              │  │
│  │       │    ∧     ∧                                                   │  │
│  │    60 ┤   / \   / \    ────────                                      │  │
│  │       │  /   \_/   \__/                                              │  │
│  │    40 ┤_/                                                            │  │
│  │       └────────────────────────────────────────────────────────────  │  │
│  │         1    5    10   15   20   25   30                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI INSIGHTS                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  - Sua acabativa subiu 8% esta semana. O projeto "PRD Harven"       │  │
│  │    esta proximo de conclusao (90%). Considere finaliza-lo hoje.      │  │
│  │                                                                      │  │
│  │  - Padrao detectado: Seus insights de maior qualidade ocorrem       │  │
│  │    entre 9h-11h. Proteja esse horario para deep work.               │  │
│  │                                                                      │  │
│  │  - Alerta: 8 memos orfaos detectados. Execute /memo cluster         │  │
│  │    para organizar sua base de conhecimento.                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Views Alternativas

### 6.2.1 View Semanal

- Comparacao dia-a-dia
- Melhor/pior dia da semana
- Padroes de produtividade

### 6.2.2 View Mensal

- Tendencias de longo prazo
- Projetos concluidos no mes
- Total de insights

### 6.2.3 View Anual

- Retrospectiva completa
- Marcos alcancados
- Evolucao do CPI

## 6.3 Widgets para Outras Telas

### Widget Compacto (Sidebar)

```
┌─────────────────────┐
│  CPI: 72  (+5)     │
│  Acabativa: 59%    │
│  Insights hoje: 3  │
│  Memos: 47         │
└─────────────────────┘
```

### Widget Minimal (Header)

```
CPI: 72 | Acabativa: 59% | Insights: 3
```

---

# 7. Arquitetura Tecnica

## 7.1 Modelo de Dados

### 7.1.1 Tabelas Principais

```sql
-- Projetos (para Acabativa)
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('strategic', 'tactical', 'operational') DEFAULT 'tactical',
    priority INTEGER DEFAULT 3, -- 1-5
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status ENUM('active', 'paused', 'completed', 'cancelled') DEFAULT 'active',
    deadline DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT NOW()
);

-- Insights
CREATE TABLE insights (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    type ENUM('eureka', 'connection', 'refinement', 'contradiction', 'synthesis'),
    context TEXT, -- O que estava fazendo quando teve o insight
    tags TEXT[], -- Array de tags
    quality_score DECIMAL(3,1), -- 1.0-10.0
    actionability INTEGER CHECK (actionability >= 1 AND actionability <= 10),
    novelty INTEGER CHECK (novelty >= 1 AND novelty <= 10),
    connections INTEGER CHECK (connections >= 1 AND connections <= 10),
    impact INTEGER CHECK (impact >= 1 AND impact <= 10),
    converted_to_action BOOLEAN DEFAULT FALSE,
    action_entity_type VARCHAR(50), -- goal, project, memo, etc.
    action_entity_id UUID,
    memo_id UUID REFERENCES memos(id), -- Link para memo se aplicavel
    created_at TIMESTAMP DEFAULT NOW()
);

-- Metricas Diarias (snapshot)
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    -- Acabativa
    acabativa_score DECIMAL(5,2),
    acabativa_weighted DECIMAL(5,2),
    projects_active INTEGER,
    projects_completed INTEGER,
    -- Insights
    insights_count INTEGER DEFAULT 0,
    insights_avg_quality DECIMAL(3,1),
    insights_converted INTEGER DEFAULT 0,
    -- Memos
    memos_created INTEGER DEFAULT 0,
    memos_connection_density DECIMAL(3,1),
    memo_graph_health DECIMAL(5,2),
    -- Compostos
    cpi_score DECIMAL(5,2),
    execution_index DECIMAL(5,2),
    creativity_index DECIMAL(5,2),
    -- Meta
    streak_days INTEGER DEFAULT 0,
    is_active_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Historico de Progresso de Projeto
CREATE TABLE project_progress_history (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    progress_before INTEGER,
    progress_after INTEGER,
    changed_at TIMESTAMP DEFAULT NOW()
);
```

### 7.1.2 Indices

```sql
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
CREATE INDEX idx_projects_user_activity ON projects(user_id, last_activity_at);
CREATE INDEX idx_insights_user_date ON insights(user_id, created_at);
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);
```

## 7.2 API Endpoints

### 7.2.1 Projects (Acabativa)

```
GET    /api/v1/projects                    # Lista projetos ativos
POST   /api/v1/projects                    # Cria projeto
PUT    /api/v1/projects/:id                # Atualiza projeto (inclui progresso)
DELETE /api/v1/projects/:id                # Arquiva projeto

GET    /api/v1/metrics/acabativa           # Calcula acabativa atual
GET    /api/v1/metrics/acabativa/history   # Historico de acabativa
```

### 7.2.2 Insights

```
GET    /api/v1/insights                    # Lista insights
POST   /api/v1/insights                    # Registra insight
PUT    /api/v1/insights/:id                # Atualiza insight
POST   /api/v1/insights/:id/convert        # Marca como convertido em acao

GET    /api/v1/metrics/insights            # Metricas de insights
GET    /api/v1/metrics/insights/daily      # Insights por dia
```

### 7.2.3 Quick Capture

```
POST   /api/v1/capture                     # Captura rapida com AI
{
  "content": "string",
  "type": "voice|text|image|link",
  "metadata": {}
}

Response:
{
  "id": "uuid",
  "classification": "insight|memo|task|project",
  "confidence": 0.85,
  "suggested_tags": ["ai", "creativity"],
  "suggested_connections": [...]
}
```

### 7.2.4 Dashboard

```
GET    /api/v1/dashboard/metrics           # Todos os scores atuais
GET    /api/v1/dashboard/trends            # Tendencias (7d, 30d, 90d)
GET    /api/v1/dashboard/ai-insights       # Recomendacoes da AI
```

## 7.3 Calculos Backend

### 7.3.1 Job de Snapshot Diario

```python
# Executar todo dia as 00:05 UTC
def calculate_daily_snapshot(user_id: str, date: date):
    # Acabativa
    projects = get_active_projects(user_id)
    acabativa = sum(p.progress for p in projects) / (len(projects) * 100) * 100
    acabativa_w = weighted_acabativa(projects)

    # Insights
    insights_today = get_insights_by_date(user_id, date)
    avg_quality = avg([i.quality_score for i in insights_today])
    converted = len([i for i in insights_today if i.converted_to_action])

    # Memos
    memo_stats = get_memo_stats(user_id)

    # CPI
    consistency = get_streak_days(user_id) / 30 * 100
    insight_score = normalize_insight_score(insights_today)
    cpi = (
        acabativa * 0.35 +
        insight_score * 0.25 +
        memo_stats.graph_health * 0.15 +
        consistency * 0.25
    )

    # Salvar snapshot
    save_daily_metrics(user_id, date, {...})
```

### 7.3.2 Trigger de Atualizacao

```python
# Atualiza metricas em tempo real quando eventos ocorrem
@event_handler('project.progress_updated')
@event_handler('insight.created')
@event_handler('memo.created')
def update_realtime_metrics(event):
    # Recalcula metricas relevantes
    # Atualiza cache
    # Notifica frontend via WebSocket
```

## 7.4 Integracao com Connection Layer

```yaml
# Eventos que o Personal Metrics System escuta
subscriptions:
  - event: project.created
    action: add_to_acabativa_calc

  - event: project.progress_updated
    action: recalc_acabativa

  - event: project.completed
    action: update_completed_count

  - event: insight.created
    action: update_insight_metrics

  - event: memo.created
    action: update_memo_metrics

  - event: memo.clustered
    action: recalc_graph_health

# Eventos que o Personal Metrics System emite
publications:
  - event: metrics.acabativa_changed
    triggers: dashboard_update, notification_check

  - event: metrics.cpi_milestone
    triggers: celebration_notification

  - event: metrics.low_acabativa_alert
    triggers: proactive_suggestion
```

---

# 8. Roadmap

## Fase 1: Foundation (MVP)

**Escopo:**
- [x] Schema de banco de dados
- [ ] API de projetos com progresso
- [ ] Calculo basico de Acabativa
- [ ] API de insights
- [ ] Dashboard simples (3 cards principais)
- [ ] Job diario de snapshot

**Entregaveis:**
- Acabativa funcional
- Registro de insights
- Metricas basicas visiveis

## Fase 2: Intelligence

**Escopo:**
- [ ] Quick Capture omnipresente
- [ ] AI classification de capturas
- [ ] Integracao completa com Memos
- [ ] Formula CPI completa
- [ ] Tendencias e graficos
- [ ] Widget para outras telas

**Entregaveis:**
- Captura rapida em todas as telas
- AI categorizando automaticamente
- Dashboard completo com tendencias

## Fase 3: Insights & Proactivity

**Escopo:**
- [ ] AI Insights no dashboard
- [ ] Notificacoes proativas
- [ ] Deteccao de padroes
- [ ] Alertas de acabativa baixa
- [ ] Gamificacao (badges, streaks)
- [ ] Exportacao de relatorios

**Entregaveis:**
- Sistema inteligente e proativo
- Recomendacoes acionaveis
- Historico completo exportavel

---

# Apendice A: Glossario

| Termo | Definicao |
|-------|-----------|
| **Acabativa** | Capacidade de concluir o que comeca |
| **CPI** | Creative Productivity Index |
| **Insight** | Momento de clareza cognitiva |
| **Memo** | Unidade atomica de conhecimento |
| **Atom** | Tipo basico de memo (uma ideia) |
| **Cluster** | Agrupamento de memos relacionados |
| **Graph Health** | Saude da rede de conhecimento |

---

# Apendice B: Referencias

## Pesquisa de Produtividade

- [Project Completion Rate: What It Is & How To Calculate It](https://thedigitalprojectmanager.com/project-management/project-completion-rate/)
- [Top 10 Employee Productivity KPIs Knowledge-Worker Leaders Must Track in 2025](https://www.worklytics.co/resources/top-10-employee-productivity-kpis-knowledge-workers-2025)
- [Beyond the Canvas: Key Metrics for Creative Performance](https://www.paymoapp.com/blog/key-metrics-for-creative-performance/)
- [17 Productivity Metrics Examples for Working Effectively - AIHR](https://www.aihr.com/blog/productivity-metrics/)
- [11 Essential Productivity KPIs & How To Measure Them In 2025](https://empmonitor.com/blog/essential-productivity-kpis/)

## Frameworks de Criatividade

- [Key performance indicators creative teams should track](https://business.adobe.com/blog/basics/kpis-for-creative-teams)
- [10 Essential KPIs for Creative Teams and How to Track Them - Marq](https://www.marq.com/blog/creative-kpis/)
- [9 Productivity Metrics and KPIs That Matter - NetSuite](https://www.netsuite.com/portal/resource/articles/human-resources/productivity-metrics.shtml)

---

*Personal Metrics System v1.0*
*ExímIA OS — Where Ideas Become Reality*
*26 Janeiro 2026*
