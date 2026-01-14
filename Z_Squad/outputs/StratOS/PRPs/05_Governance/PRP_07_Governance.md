# PRP-07: Governance - Review & Catchball

> **Module:** Governance (Revisão e Catchball)
> **Priority:** P1 (Important)
> **Estimated Complexity:** Medium
> **Dependencies:** Design System, AI Services

---

## 1. Objetivo

Criar o módulo "Governance" para facilitar os rituais de governança estratégica, incluindo revisões periódicas, discussões (Catchball) e histórico de decisões, permitindo alinhamento contínuo entre liderança e execução.

---

## 2. User Stories

| ID | Como | Quero | Para que |
|----|------|-------|----------|
| US-40 | CEO | revisar iniciativas problemáticas de forma estruturada | tome decisões informadas |
| US-41 | CEO | discutir bloqueios com responsáveis no contexto da iniciativa | não perca contexto |
| US-42 | Head | justificar atrasos e pedir ajuda formalmente | tenha registro |
| US-43 | CEO | ver histórico de decisões e mudanças | entenda a evolução |
| US-44 | CEO | extrair action items de discussões automaticamente | não esqueça follow-ups |
| US-45 | Investidor | ver resumo das revisões trimestrais | acompanhe governança |

---

## 3. Requisitos Funcionais

| ID | Requisito | Prioridade | Detalhes |
|----|-----------|------------|----------|
| FR-GV.1 | Review Dashboard | P0 | Visão de todas iniciativas com filtros |
| FR-GV.2 | Off Track Filter | P0 | Filtro rápido para itens problemáticos |
| FR-GV.3 | Catchball Threads | P1 | Discussões vinculadas a iniciativas |
| FR-GV.4 | @Mentions | P1 | Mencionar usuários em comentários |
| FR-GV.5 | Action Items | P1 | Criar e trackear ações de reuniões |
| FR-GV.6 | AI: Action Extractor | P2 | IA identifica action items em texto |
| FR-GV.7 | AI: Review Summary | P2 | IA resume discussões longas |
| FR-GV.8 | History Log | P1 | Histórico de todas alterações |
| FR-GV.9 | Scheduled Reviews | P2 | Agendamento de revisões periódicas |
| FR-GV.10 | Export Review | P2 | Exportar ata de revisão |

---

## 4. Wireframe Principal - Review Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [StratOS]   War Room  │  The Forge  │  Execution  │  ● Governance  [@User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  GOVERNANCE - Revisão Estratégica                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Ciclo: Hoshin 2026                                    Período: Q1 2026     │
│                                                                             │
│  Filtros:                                                                   │
│  [● Off Track + At Risk]  [○ Todos]     [Owner ▼]  [Driver ▼]  [🔍 Buscar] │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 RESUMO DA REVISÃO                                                       │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  5 Total    │ │ 2 On Track  │ │ 2 At Risk   │ │ 1 Off Track │          │
│  │ Iniciativas │ │    🟢       │ │    🟡       │ │    🔴       │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 INICIATIVAS PARA REVISÃO                                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ INICIATIVA            │ META (KPI)        │ TARGET  │ ATUAL │ ST   │   │
│  ├───────────────────────┼───────────────────┼─────────┼───────┼──────┤   │
│  │ 🔴 01.01 Plano Starter│ PMEs Ativas       │ 200     │ 45    │ 🔴   │   │
│  │    @Hugo              │ Conv. Signup→Paid │ 5%      │ 2.1%  │ 🟡   │   │
│  │    Atrasado 2 semanas │ TTFV              │ <30min  │ 45min │ 🟡   │   │
│  │                       │                   │         │       │      │   │
│  │    [💬 Ver Discussão] [📝 Action Items: 2] [⬇️ Expandir]            │   │
│  ├───────────────────────┼───────────────────┼─────────┼───────┼──────┤   │
│  │ 🟡 02.01 Strangler Fig│ % Código Migrado  │ 100%    │ 45%   │ 🟡   │   │
│  │    @Hugo              │ Latência P95      │ 100ms   │ 120ms │ 🟡   │   │
│  │    Risco identificado │ Deploy Frequency  │ 5/sem   │ 6/sem │ 🟢   │   │
│  │                       │                   │         │       │      │   │
│  │    [💬 Ver Discussão] [📝 Action Items: 1] [⬇️ Expandir]            │   │
│  └───────────────────────┴───────────────────┴─────────┴───────┴──────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [📅 Agendar Revisão]  [📄 Exportar Ata]  [📧 Enviar Resumo]               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Wireframe - Catchball Thread

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CATCHBALL: 01.01 Lançamento Plano Starter                             [×] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Status: 🔴 Off Track  │  Owner: @Hugo  │  Atrasado 2 semanas              │
│                                                                             │
│  KPIs:                                                                      │
│  • PMEs Ativas: 45/200 (22%)                                               │
│  • Conv. Signup→Paid: 2.1%/5% (42%)                                        │
│  • TTFV: 45min/<30min (67%)                                                │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📝 DISCUSSÃO                                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ @Hugo • 10 Jan 2026, 14:30                                          │   │
│  │                                                                      │   │
│  │ Estamos bloqueados na integração de billing. O @CTO precisa         │   │
│  │ configurar o cluster Kubernetes antes de podermos avançar.          │   │
│  │                                                                      │   │
│  │ Impacto: 2 semanas de atraso se não resolvermos até sexta.          │   │
│  │                                                                      │   │
│  │ 👍 2                                                      [Responder]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ @CEO • 10 Jan 2026, 15:45                                           │   │
│  │                                                                      │   │
│  │ @CTO, qual a previsão para o cluster? Podemos priorizar isso        │   │
│  │ esta semana?                                                         │   │
│  │                                                                      │   │
│  │ Se não der, @Hugo, tem como simplificar o escopo do billing         │   │
│  │ para um MVP que não dependa do K8s?                                 │   │
│  │                                                                      │   │
│  │ 👍 1                                                      [Responder]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ @CTO • 11 Jan 2026, 09:15                                           │   │
│  │                                                                      │   │
│  │ Posso entregar o cluster até quinta se alocar o João 100%.          │   │
│  │ Preciso de aprovação para pausar o projeto de monitoring.           │   │
│  │                                                                      │   │
│  │ 👍 3                                                      [Responder]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ @CEO • 11 Jan 2026, 10:30                                           │   │
│  │                                                                      │   │
│  │ Aprovado. @CTO, pausa o monitoring e prioriza o cluster.            │   │
│  │ @Hugo, confirma quando receber o ambiente.                          │   │
│  │                                                                      │   │
│  │ 👍 2                                                      [Responder]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 ACTION ITEMS DETECTADOS                            [+ Adicionar] │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ ☐ @CTO: Configurar cluster K8s e entregar ambiente                  │   │
│  │   Deadline: Quinta (16 Jan)  │  Extraído: 11 Jan, 10:30             │   │
│  │   Status: 🔵 Em andamento                                           │   │
│  │                                                                      │   │
│  │ ☐ @CTO: Pausar projeto de monitoring temporariamente                │   │
│  │   Deadline: Hoje  │  Extraído: 11 Jan, 10:30                        │   │
│  │   Status: ✓ Concluído                                               │   │
│  │                                                                      │   │
│  │ ☐ @Hugo: Confirmar recebimento do ambiente K8s                      │   │
│  │   Deadline: Sexta (17 Jan)  │  Extraído: 11 Jan, 10:30              │   │
│  │   Status: ⚪ Pendente                                                │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Escreva uma mensagem... @mencione pessoas                           │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                [📎 Anexar]  [📤 Enviar]    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Wireframe - History Log

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HISTÓRICO: 01.01 Lançamento Plano Starter                             [×] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Filtros: [Todos ▼]  [Período: Último mês ▼]                 [🔍 Buscar]   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 13 Jan 2026                                                             │
│  │                                                                          │
│  ├── 14:30  @Hugo atualizou progresso de 01.01.03                          │
│  │          45% → 60%                                                       │
│  │                                                                          │
│  ├── 11:15  @CTO marcou 01.01.02 como concluído                            │
│  │          100% ✓                                                          │
│  │                                                                          │
│  └── 09:00  🤖 Briefing diário gerado                                       │
│             [Ver briefing]                                                  │
│                                                                             │
│  📅 11 Jan 2026                                                             │
│  │                                                                          │
│  ├── 10:30  @CEO adicionou comentário no Catchball                         │
│  │          "Aprovado. @CTO, pausa o monitoring..."                        │
│  │                                                                          │
│  ├── 10:30  🤖 Action item extraído automaticamente                         │
│  │          "@CTO: Configurar cluster K8s"                                 │
│  │                                                                          │
│  ├── 09:15  @CTO adicionou comentário no Catchball                         │
│  │          "Posso entregar o cluster até quinta..."                       │
│  │                                                                          │
│  └── 08:00  @Hugo escalou 01.01.03                                          │
│             Tipo: Dependência de outro time                                 │
│             Escalado para: @CEO                                             │
│                                                                             │
│  📅 10 Jan 2026                                                             │
│  │                                                                          │
│  ├── 15:45  @CEO adicionou comentário no Catchball                         │
│  │          "@CTO, qual a previsão para o cluster?"                        │
│  │                                                                          │
│  ├── 14:30  @Hugo iniciou discussão Catchball                              │
│  │          "Estamos bloqueados na integração..."                          │
│  │                                                                          │
│  └── 10:00  @Hugo atualizou progresso de 01.01.03                          │
│             30% → 45%                                                       │
│                                                                             │
│  📅 08 Jan 2026                                                             │
│  │                                                                          │
│  ├── 16:00  @Hugo atualizou status de 01.01.03                             │
│  │          🟢 On Track → 🟡 At Risk                                       │
│  │          Motivo: "Dependência de infra não resolvida"                   │
│  │                                                                          │
│  └── 09:30  Meta "Conv. Signup→Paid" atualizada                            │
│             Valor: 2.1% (target: 5%)                                       │
│             Fonte: Integração automática                                   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [Carregar mais...]                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Wireframe - AI Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 RESUMO DA DISCUSSÃO                                                [×] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Iniciativa: 01.01 Lançamento Plano Starter                                │
│  Período: 10-13 Jan 2026                                                   │
│  Participantes: @Hugo, @CEO, @CTO                                          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 RESUMO EXECUTIVO                                                        │
│                                                                             │
│  A iniciativa está atrasada devido a uma dependência de infraestrutura.    │
│  O bloqueio principal é a configuração do cluster Kubernetes necessário    │
│  para o serviço de billing.                                                │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🔑 DECISÕES TOMADAS                                                        │
│                                                                             │
│  1. Cluster K8s priorizado sobre projeto de monitoring                     │
│  2. @CTO responsável pela entrega até quinta-feira                         │
│  3. Não haverá simplificação de escopo por enquanto                        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚡ ACTION ITEMS                                                            │
│                                                                             │
│  │ Owner │ Ação                                      │ Deadline │ Status │ │
│  │ @CTO  │ Configurar cluster K8s                   │ 16 Jan   │ 🔵     │ │
│  │ @CTO  │ Pausar projeto monitoring                │ 11 Jan   │ ✓      │ │
│  │ @Hugo │ Confirmar recebimento do ambiente        │ 17 Jan   │ ⚪     │ │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📈 IMPACTO NO CRONOGRAMA                                                   │
│                                                                             │
│  Se o cluster for entregue até quinta:                                     │
│  • Iniciativa recupera 1 semana do atraso                                  │
│  • Data de conclusão estimada: 15 Abr (era 1 Abr)                          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [📄 Exportar como Ata]  [📧 Enviar por Email]  [Fechar]                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. API Endpoints

```yaml
# Governance
GET /api/governance/:cycleId
  description: Get governance dashboard data
  query:
    filter: 'all' | 'at_risk' | 'off_track'
    owner_id?: string
    driver_id?: string
  response:
    summary: GovernanceSummary
    initiatives: InitiativeReview[]

GET /api/governance/:cycleId/initiative/:initiativeId/catchball
  description: Get catchball thread for initiative
  response:
    initiative: Initiative
    messages: CatchballMessage[]
    action_items: ActionItem[]

POST /api/governance/:cycleId/initiative/:initiativeId/catchball
  description: Add message to catchball
  body:
    content: string
    mentions?: string[] (user_ids)
  response:
    message: CatchballMessage
    extracted_actions?: ActionItem[] (by AI)

POST /api/governance/:cycleId/action-items
  description: Create action item manually
  body:
    initiative_id?: string
    owner_id: string
    description: string
    deadline: Date
  response:
    action_item: ActionItem

PATCH /api/governance/:cycleId/action-items/:actionId
  description: Update action item status
  body:
    status: 'pending' | 'in_progress' | 'completed'
  response:
    action_item: ActionItem

GET /api/governance/:cycleId/history
  description: Get activity history
  query:
    initiative_id?: string
    user_id?: string
    type?: string[]
    from?: Date
    to?: Date
  response:
    activities: ActivityLog[]

POST /api/governance/:cycleId/catchball/:threadId/summarize
  description: Generate AI summary of discussion
  response:
    summary: CatchballSummary

POST /api/governance/:cycleId/review/schedule
  description: Schedule a review meeting
  body:
    date: Date
    participants: string[]
    agenda?: string
  response:
    review: ScheduledReview

POST /api/governance/:cycleId/review/export
  description: Export review as document
  body:
    initiative_ids: string[]
    include_catchball: boolean
    include_history: boolean
  response:
    url: string (signed PDF URL)
```

---

## 9. Critérios de Aceite

### 9.1 Review Dashboard
- [ ] Resumo visual de iniciativas por status
- [ ] Filtro rápido Off Track + At Risk funciona
- [ ] Tabela mostra iniciativas com KPIs e status
- [ ] Click expande detalhes da iniciativa

### 9.2 Catchball
- [ ] Thread de mensagens vinculada à iniciativa
- [ ] @mentions notificam usuários
- [ ] Reações (👍) funcionam
- [ ] AI extrai action items de mensagens automaticamente

### 9.3 Action Items
- [ ] Criação manual e automática (AI)
- [ ] Status tracking (pendente, em andamento, concluído)
- [ ] Deadline com alertas
- [ ] Visível no dashboard da iniciativa

### 9.4 Histórico
- [ ] Timeline de todas atividades
- [ ] Filtros por tipo, período, usuário
- [ ] Detalhes do que mudou (diff)
- [ ] Exportável

### 9.5 AI Summary
- [ ] Resume discussões longas
- [ ] Extrai decisões tomadas
- [ ] Lista action items consolidados
- [ ] Calcula impacto no cronograma

---

## 10. Métricas de Sucesso

| Métrica | Target | Método |
|---------|--------|--------|
| Action items criados por revisão | > 3 | DB query |
| Action items concluídos em 1 semana | > 70% | DB query |
| Uso de Catchball | > 50% das iniciativas at risk | Analytics |
| Tempo médio de resolução de bloqueio | < 5 dias | Tracking |
