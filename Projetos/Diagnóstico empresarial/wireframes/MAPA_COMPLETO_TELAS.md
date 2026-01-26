# Mapa Completo de Telas - Automator Sales Engine
## Versão: 1.0 | Data: 24/01/2026

---

## 📐 ARQUITETURA DE TELAS

### Total de Telas: 20 telas principais + 8 modais/componentes

---

## 🎯 FLUXO COMPLETO DO USUÁRIO

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMEIRA VISITA (Não Autenticado)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   T01: LOGIN     │
                    │   T02: SIGNUP    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ T03: ONBOARDING  │ (primeira vez)
                    │  (Tutorial 4x)   │
                    └──────────────────┘
                              │
┌─────────────────────────────┴──────────────────────────────────┐
│                    USUÁRIO AUTENTICADO                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ T04: DASHBOARD   │◄─────────┐
                    │   (Home)         │          │
                    └──────────────────┘          │
                              │                   │
                 ┌────────────┼────────────┐      │
                 ▼            ▼            ▼      │
         ┌──────────┐  ┌──────────┐  ┌─────────┐ │
         │T05: Novo │  │T09: Ver  │  │T10: Ver │ │
         │Diagnóst. │  │Histórico │  │Config.  │ │
         └──────────┘  └──────────┘  └─────────┘ │
              │                                   │
              ▼                                   │
    ┌─────────────────────────┐                  │
    │  WIZARD (Multi-Step)    │                  │
    │  T05a: Cliente          │                  │
    │  T05b: Setor            │                  │
    │  T05c: Processos        │                  │
    │  T05d: Review           │                  │
    └─────────────────────────┘                  │
              │                                   │
              ▼                                   │
    ┌─────────────────────────┐                  │
    │ T06: RESULTADOS         │                  │
    │  - ROI Calculado        │                  │
    │  - Pricing Sugerido     │                  │
    │  - Gráficos             │                  │
    └─────────────────────────┘                  │
              │                                   │
              ▼                                   │
    ┌─────────────────────────┐                  │
    │ T07: PROPOSTA           │                  │
    │  - Preview PDF          │                  │
    │  - Editar Seções        │                  │
    │  - Download/Enviar      │                  │
    └─────────────────────────┘                  │
              │                                   │
              └───────────────────────────────────┘
                     (Volta ao Dashboard)
```

---

## 📋 LISTA COMPLETA DE TELAS

### 🔐 GRUPO 1: AUTENTICAÇÃO (3 telas)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T01** | Login | Email/senha, social login, link "esqueci senha" | PRP-01A |
| **T02** | Signup | Criar conta, campos validados, termos | PRP-01B |
| **T03** | Forgot Password | Reset de senha por email | PRP-01C |

**Componentes Compartilhados:**
- Header público (logo + CTA)
- Footer público (links legais)

---

### 🎓 GRUPO 2: ONBOARDING (1 tela, 4 steps)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T04** | Onboarding Tutorial | Wizard 4 etapas explicando produto | PRP-02 |

**Steps do Tutorial:**
1. Boas-vindas + value proposition
2. Como funciona o diagnóstico
3. Como usar os resultados
4. CTA: "Criar primeiro diagnóstico"

---

### 🏠 GRUPO 3: DASHBOARD & HOME (1 tela)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T05** | Dashboard | Home com overview, CTAs, métricas | PRP-03 |

**Elementos:**
- Sidebar navegação
- Header com user menu
- Cards de métricas
- Lista últimos diagnósticos
- CTA "Novo Diagnóstico"

---

### 🔬 GRUPO 4: WIZARD DIAGNÓSTICO (4 steps)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T06a** | Wizard: Dados Cliente | Nome, setor, faturamento, funcionários | PRP-04A |
| **T06b** | Wizard: Seleção Setor | Escolher setor para templates | PRP-04B |
| **T06c** | Wizard: Adicionar Processos | Lista processos + detalhes (tempo, FTEs, etc) | PRP-04C |
| **T06d** | Wizard: Review & Submit | Revisar dados, editar, confirmar | PRP-04D |

**Fluxo:**
```
T06a → T06b → T06c (repetível) → T06d → [Calcular] → T07 (Resultados)
```

---

### 📊 GRUPO 5: RESULTADOS & PRECIFICAÇÃO (1 tela)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T07** | Resultados & Pricing | ROI calculado + precificação + gráficos | PRP-05 |

**Seções:**
1. **Sumário Executivo**
   - ROI total anual
   - Economia mensal
   - Payback period

2. **Precificação Sugerida**
   - Preço base (algoritmo)
   - Ajustes manuais (overrides)
   - Breakdown (ROI + Porte + Complexidade)

3. **Visualizações**
   - Gráfico ROI por processo
   - Gráfico payback
   - Tabela comparativa

4. **CTAs**
   - Editar diagnóstico
   - Gerar proposta
   - Salvar rascunho

---

### 📄 GRUPO 6: PROPOSTA (1 tela)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T08** | Geração Proposta | Preview PDF + edição + download | PRP-06 |

**Seções Editáveis:**
1. Capa (logo, nome cliente)
2. Sumário Executivo
3. Situação Atual (processos mapeados)
4. Proposta de Valor (ROI + savings)
5. Investimento (pricing)
6. Próximos Passos
7. Termos & Condições

**Ações:**
- Preview em tempo real
- Editar seção específica (modal)
- Download PDF
- Enviar por email (futuro)
- Salvar template customizado

---

### 📚 GRUPO 7: HISTÓRICO (1 tela)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T09** | Histórico Diagnósticos | Lista todos diagnósticos + filtros | PRP-07 |

**Elementos:**
- Tabela/cards de diagnósticos
- Filtros: status, data, cliente, setor
- Busca
- Ações: ver, editar, duplicar, deletar
- Exportar lista (CSV)

**Colunas:**
- Cliente
- Data
- ROI Total
- Status (rascunho, completo, proposta enviada)
- Ações rápidas

---

### ⚙️ GRUPO 8: CONFIGURAÇÕES (3 telas)

| ID | Tela | Descrição | PRP |
|:---|:-----|:----------|:----|
| **T10a** | Perfil | Dados pessoais, foto, email | PRP-08A |
| **T10b** | Marca/Logo | Upload logo, cores, assinatura | PRP-08B |
| **T10c** | Preferências | Notificações, idioma, timezone | PRP-08C |

---

### 🔔 GRUPO 9: MODAIS & COMPONENTES (8 componentes)

| ID | Componente | Descrição | PRP |
|:---|:-----------|:----------|:----|
| **M01** | Modal Adicionar Processo | Form completo de processo | PRP-09A |
| **M02** | Modal Editar Processo | Edição inline | PRP-09B |
| **M03** | Modal Confirmar Delete | Confirmação destrutiva | PRP-09C |
| **M04** | Modal Override Pricing | Ajustar preço manualmente | PRP-09D |
| **M05** | Modal Exportar PDF | Opções de export | PRP-09E |
| **M06** | Modal Enviar Email | Formulário envio (futuro) | PRP-09F |
| **M07** | Toast Notifications | Feedback ações (success/error) | PRP-09G |
| **M08** | Sidebar Navegação | Menu colapsável | PRP-09H |

---

## 🎨 DESIGN SYSTEM APLICADO

### Componentes Reutilizáveis (Todos PRPs)

1. **Navegação**
   - Sidebar (colapsável)
   - TopBar (user menu, notificações)
   - Breadcrumbs

2. **Forms**
   - Input text
   - Select/dropdown
   - Number input (com formatação R$)
   - Textarea
   - Checkbox/radio
   - File upload

3. **Feedback**
   - Toast (success, error, warning, info)
   - Loading spinner
   - Skeleton loaders
   - Empty states
   - Error states

4. **Data Display**
   - Cards
   - Tables (com sort, pagination)
   - Charts (Recharts: bar, line, pie)
   - Stats cards
   - Progress bar

5. **Ações**
   - Buttons (primary, secondary, ghost, destructive)
   - Icon buttons
   - Dropdown menus
   - Tooltips

---

## 📱 RESPONSIVIDADE

Todas as telas devem ter:
- **Desktop:** Layout completo (sidebar + conteúdo)
- **Tablet:** Sidebar colapsável
- **Mobile:** Sidebar transformada em drawer + layout vertical

**Breakpoints:**
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🚀 PRIORIZAÇÃO DE CRIAÇÃO (MVP)

### Phase 1: Core Flow (Essencial para MVP)
1. ✅ T01: Login
2. ✅ T02: Signup
3. ✅ T05: Dashboard
4. ✅ T06a-d: Wizard Diagnóstico (4 steps)
5. ✅ T07: Resultados
6. ✅ T08: Proposta
7. ✅ M01: Modal Adicionar Processo

### Phase 2: Management (Importante)
8. ⚠️ T09: Histórico
9. ⚠️ T10a: Perfil básico
10. ⚠️ M02-M03: Editar/Deletar

### Phase 3: Polish (Nice-to-have)
11. 🔵 T04: Onboarding Tutorial
12. 🔵 T10b-c: Marca/Preferências
13. 🔵 M04-M08: Outros modais

---

## 🎯 MÉTRICAS DE SUCESSO (Por Tela)

| Tela | Métrica Chave | Target |
|:-----|:--------------|:-------|
| T01/T02 | Signup conversion | >40% |
| T04 | Tutorial completion | >80% |
| T05 | Time to first diagnosis | <5min |
| T06a-d | Wizard completion rate | >90% |
| T07 | Time on results page | >2min |
| T08 | PDF downloads | 100% |
| T09 | Return to edit | >30% |
| T10 | Profile completion | >60% |

---

## 📐 WIREFRAME CONVENTIONS

Todos os wireframes usarão:

```
┌──────────────────────────┐
│ [HEADER]                 │ ← TopBar (sempre visível)
├────────┬─────────────────┤
│        │                 │
│ [SIDE] │   [CONTENT]     │ ← Main content area
│ [BAR]  │                 │
│        │                 │
└────────┴─────────────────┘

[Button] → Ação primária
(Button) → Ação secundária
{Badge} → Status/tag
⋮ → Menu dropdown
🔍 → Busca
✏️ → Editar
🗑️ → Deletar
```

---

## 🔗 REFERÊNCIAS

- **Design System:** ShadCN/UI + TailwindCSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table

---

**Próximo Passo:** Criar PRPs individuais para cada tela/componente com wireframes detalhados.

**Organização dos Arquivos:**
```
wireframes/
├── MAPA_COMPLETO_TELAS.md (este arquivo)
├── PRP-01_Autenticacao.md
├── PRP-02_Onboarding.md
├── PRP-03_Dashboard.md
├── PRP-04_Wizard_Diagnostico.md
├── PRP-05_Resultados.md
├── PRP-06_Proposta.md
├── PRP-07_Historico.md
├── PRP-08_Configuracoes.md
└── PRP-09_Componentes_Modais.md
```

---

**Status:** ✅ Mapa completo criado
**Próximo:** Criar PRP-01 (Autenticação)
