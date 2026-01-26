# PRP-03: Dashboard Principal
## Automator Sales Engine | v1.0 | 24/01/2026

---

## OBJETIVO

Home centralizada com overview de métricas, acesso rápido a diagnósticos e CTAs principais.

---

## WIREFRAME COMPLETO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                        🔍  🔔  [User Menu ▼]      │
│ │ LOGO │   Dashboard                                                       │
│ └──────┘                                                                    │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│  [📊]    │  Olá, Ricardo! 👋                                               │
│  Dashb.  │                                                                  │
│          │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  [➕]    │  │ 📊          │  │ 💰          │  │ ⏱️          │            │
│  Novo    │  │ 12          │  │ R$ 1.2M     │  │ 3.2h        │            │
│  Diag.   │  │             │  │             │  │             │            │
│          │  │ Total       │  │ ROI Total   │  │ Tempo médio │            │
│  [📁]    │  │ Diagnóst.   │  │ Identificado│  │ por diag.   │            │
│  Histór. │  └─────────────┘  └─────────────┘  └─────────────┘            │
│          │                                                                  │
│  [⚙️]    │  ┌──────────────────────────────────────────────────────────┐  │
│  Config. │  │                                                          │  │
│          │  │  Últimos Diagnósticos                 [+ Novo Diagnóstico]│  │
│  ─────   │  │                                                          │  │
│          │  │  ┌──────────────────────────────────────────────────┐   │  │
│  [❓]    │  │  │ Empresa XYZ Ltda          Status: ✅ Completo     │   │  │
│  Ajuda   │  │  │ 18/01/2026                ROI: R$ 240k/ano        │   │  │
│          │  │  │ Varejo • 3 processos      [Ver] [Editar] [⋮]     │   │  │
│  [🚪]    │  │  └──────────────────────────────────────────────────┘   │  │
│  Sair    │  │                                                          │  │
│          │  │  ┌──────────────────────────────────────────────────┐   │  │
│          │  │  │ Indústria ABC S.A.        Status: 📝 Rascunho     │   │  │
│          │  │  │ 15/01/2026                ROI: R$ 180k/ano        │   │  │
│          │  │  │ Manufatura • 5 processos  [Continuar] [⋮]        │   │  │
│          │  │  └──────────────────────────────────────────────────┘   │  │
│          │  │                                                          │  │
│          │  │  ┌──────────────────────────────────────────────────┐   │  │
│          │  │  │ Empresa DEF               Status: 📄 Proposta    │   │  │
│          │  │  │ 10/01/2026                ROI: R$ 320k/ano        │   │  │
│          │  │  │ Logística • 4 processos   [Ver Proposta] [⋮]     │   │  │
│          │  │  └──────────────────────────────────────────────────┘   │  │
│          │  │                                                          │  │
│          │  │  [Ver todos os diagnósticos →]                          │  │
│          │  │                                                          │  │
│          │  └──────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌──────────────────────────────────────────────────────────┐  │
│          │  │  📈 Insights da Semana                                   │  │
│          │  │                                                          │  │
│          │  │  • Você fez 3 diagnósticos esta semana (+50% vs. ant.)  │  │
│          │  │  • ROI médio identificado: R$ 246k/ano                  │  │
│          │  │  • Taxa de conversão: 67% (acima da meta!)              │  │
│          │  │                                                          │  │
│          │  └──────────────────────────────────────────────────────────┘  │
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## SIDEBAR - NAVEGAÇÃO

```
┌──────────┐
│ [LOGO]   │
├──────────┤
│          │
│ 📊 Dashboard    ← Ativo
│                │
│ ➕ Novo Diag. │
│                │
│ 📁 Histórico   │
│                │
│ ⚙️ Config.     │
│                │
│ ─────────     │
│                │
│ ❓ Ajuda      │
│                │
│ 🚪 Sair        │
│                │
└──────────┘
```

### Estados Sidebar
- **Desktop:** Expandida (240px)
- **Tablet:** Colapsada + icons only (64px)
- **Mobile:** Drawer (overlay)

---

## TOPBAR - HEADER

```
┌────────────────────────────────────────────────────────┐
│  Automator Sales Engine    🔍  🔔(3)  [Avatar ▼]     │
└────────────────────────────────────────────────────────┘
```

**Elementos:**
- **Search:** Busca global (diagnósticos, clientes)
- **Notifications:** Badge com contador
- **User Menu Dropdown:**
  - Meu perfil
  - Configurações
  - Ajuda & Docs
  - ─────
  - Sair

---

## CARDS DE MÉTRICAS

### Card 1: Total Diagnósticos
```
┌───────────────┐
│ 📊           │
│ 12           │ ← Número grande
│              │
│ Total        │ ← Label
│ Diagnósticos │
└───────────────┘
```

### Card 2: ROI Total Identificado
```
┌───────────────┐
│ 💰           │
│ R$ 1.2M      │ ← Formatado
│              │
│ ROI Total    │
│ Identificado │
└───────────────┘
```

### Card 3: Tempo Médio
```
┌───────────────┐
│ ⏱️            │
│ 3.2h         │
│              │
│ Tempo médio  │
│ por diag.    │
└───────────────┘
```

**Comportamento:**
- Animação counter on-load
- Hover → shadow/elevation
- Click → filtro correspondente no histórico

---

## LISTA ÚLTIMOS DIAGNÓSTICOS

### Card de Diagnóstico (Completo)
```
┌──────────────────────────────────────────────────┐
│ Empresa XYZ Ltda              Status: ✅ Completo │
│ 18/01/2026                    ROI: R$ 240k/ano   │
│ Varejo • 3 processos          [Ver] [Editar] [⋮] │
└──────────────────────────────────────────────────┘
```

### Card de Diagnóstico (Rascunho)
```
┌──────────────────────────────────────────────────┐
│ Indústria ABC S.A.            Status: 📝 Rascunho│
│ 15/01/2026                    ROI: R$ 180k/ano   │
│ Manufatura • 5 processos      [Continuar] [⋮]    │
└──────────────────────────────────────────────────┘
```

### Card de Diagnóstico (Proposta Enviada)
```
┌──────────────────────────────────────────────────┐
│ Empresa DEF                   Status: 📄 Proposta│
│ 10/01/2026                    ROI: R$ 320k/ano   │
│ Logística • 4 processos       [Ver Proposta] [⋮] │
└──────────────────────────────────────────────────┘
```

**Status Possíveis:**
- 📝 **Rascunho** → Wizard incompleto
- ✅ **Completo** → Resultados calculados
- 📄 **Proposta** → PDF gerado
- 🚀 **Enviado** → Proposta enviada ao cliente
- 💰 **Fechado** → Cliente fechou (futuro)

**Ações Dropdown (⋮):**
- Duplicar diagnóstico
- Exportar PDF
- Deletar
- ─────
- Ver detalhes

---

## INSIGHTS DA SEMANA

```
┌──────────────────────────────────────────────────┐
│ 📈 Insights da Semana                            │
│                                                  │
│ • Você fez 3 diagnósticos esta semana (+50%)     │
│ • ROI médio identificado: R$ 246k/ano            │
│ • Taxa de conversão: 67% (acima da meta!)        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Lógica:**
- Compara semana atual vs. semana anterior
- Mostra top insights (máx 3)
- Usa IA para gerar insights personalizados (futuro)

---

## EMPTY STATE (Primeiro Acesso)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│             [Ilustração: Empty State]            │
│                                                  │
│         Nenhum diagnóstico ainda                 │
│                                                  │
│    Crie seu primeiro diagnóstico e veja          │
│    como a ferramenta acelera suas vendas!        │
│                                                  │
│         ┌──────────────────────────┐             │
│         │  ➕ Criar Diagnóstico    │             │
│         └──────────────────────────┘             │
│                                                  │
│         (Ou ver tutorial novamente)              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## COMPORTAMENTO & INTERAÇÕES

### CTAs Principais
1. **"+ Novo Diagnóstico"** (Sidebar)
   - Sempre visível
   - Cor primary (destaque)
   - Abre Wizard (T06a)

2. **"+ Novo Diagnóstico"** (Header lista)
   - Botão secundário
   - Mesmo destino que sidebar

### Filtros Rápidos (Futuro)
- Todos
- Rascunhos
- Completos
- Propostas enviadas

### Busca Global
- Busca por nome cliente, setor, data
- Debounced (300ms)
- Mostra resultados em dropdown

---

## RESPONSIVIDADE

### Desktop (>1024px)
- Sidebar expandida (240px)
- Cards em grid 3 colunas
- Lista com cards full-width

### Tablet (768-1024px)
- Sidebar colapsada (64px icons)
- Cards em grid 3 colunas (mais compactos)
- Lista com cards

### Mobile (<768px)
- Sidebar vira drawer (hamburger menu)
- Cards em coluna única (stacked)
- Lista compacta (menos info por card)

---

## SCHEMA DATABASE

```sql
-- View para métricas dashboard
CREATE VIEW dashboard_metrics AS
SELECT
  COUNT(*) as total_diagnosticos,
  SUM(roi_anual) as roi_total_identificado,
  AVG(tempo_gasto_minutos) as tempo_medio_minutos,
  COUNT(CASE WHEN status = 'completo' THEN 1 END) as total_completos,
  COUNT(CASE WHEN status = 'rascunho' THEN 1 END) as total_rascunhos,
  COUNT(CASE WHEN status = 'proposta' THEN 1 END) as total_propostas
FROM diagnosticos
WHERE usuario_id = auth.uid()
  AND deleted_at IS NULL;

-- Query últimos diagnósticos
SELECT *
FROM diagnosticos
WHERE usuario_id = auth.uid()
  AND deleted_at IS NULL
ORDER BY updated_at DESC
LIMIT 5;
```

---

## CRITÉRIOS DE ACEITE

- [ ] Cards de métricas carregam com animação
- [ ] Mostra últimos 5 diagnósticos
- [ ] CTAs navegam para telas corretas
- [ ] Empty state aparece se sem diagnósticos
- [ ] Sidebar colapsa em tablet/mobile
- [ ] Busca global funciona (debounced)
- [ ] User menu dropdown funciona
- [ ] Notificações mostram badge
- [ ] Insights da semana calcula corretamente
- [ ] Ações dropdown (⋮) funcionam
- [ ] Responsivo em todos breakpoints

---

**Status:** ✅ Completo
