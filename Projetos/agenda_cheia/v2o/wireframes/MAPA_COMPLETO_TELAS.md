# Agenda Cheia - Mapa Completo de Telas
## Wireframes & Fluxos Visuais

**Data:** 08/01/2026
**Total de Telas:** 17 telas principais + 5 modals

---

## 🗺️ Arquitetura de Navegação

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENDA CHEIA                            │
│                   Mapa de Navegação                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   LANDING    │
│     PAGE     │
└──────┬───────┘
       │
       ├─────► [Começar Grátis] ─────┐
       │                              │
       └─────► [Entrar] ──────────────┤
                                      ▼
                              ┌──────────────┐
                              │    LOGIN     │
                              │ (WhatsApp OTP)│
                              └──────┬───────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
          Novo Usuário                      Usuário Existente
                    │                                 │
                    ▼                                 ▼
          ┌─────────────────┐                 ┌──────────────┐
          │   ONBOARDING    │                 │  DASHBOARD   │
          │    (7 telas)    │                 │   PRINCIPAL  │
          └────────┬────────┘                 └──────┬───────┘
                   │                                 │
                   └────────────────┬────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   DASHBOARD PRINCIPAL  │
                        │   (Área Logada)        │
                        └───────────┬───────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
           ▼                        ▼                        ▼
    ┌──────────┐            ┌─────────────┐         ┌──────────────┐
    │ CLIENTES │            │ CONVERSAS   │         │ CONFIRMAÇÕES │
    └──────────┘            └─────────────┘         └──────────────┘
           │                        │                        │
           │                        │                        │
           ▼                        ▼                        ▼
    [Gestão Clientes]      [Inbox WhatsApp]         [Lazy Sync]
           │                        │                        │
           │                        │                        │
           └────────────────────────┴────────────────────────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │ CONFIGURAÇÕES│
                            └──────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              [WhatsApp]      [Usuários]      [Billing]
```

---

## 📱 Fluxo 1: Onboarding (7 Telas)

### Visão Geral
```
Tela 1 → Tela 2 → Tela 3 → Tela 4 → Tela 5 → Tela 6 → Tela 7
[Welcome] [Dados] [LGPD ⚠️] [WhatsApp] [Clientes] [Ciclos] [Ativar]
```

### Detalhamento

#### 🎨 Tela 1: Bem-vindo
**Objetivo:** Apresentar proposta de valor
**Tempo médio:** 10s
**CTA:** "Começar Grátis"

**Elementos:**
- Logo + Tagline
- Ilustração hero
- 4 bullets de valor (5 clientes grátis, 5min setup, LGPD, funciona com qualquer sistema)
- CTA principal
- Link "Já tem conta?"
- Badge "Compliance LGPD"

---

#### 🎨 Tela 2: Dados Básicos
**Objetivo:** Coletar informações essenciais
**Tempo médio:** 1-2 min
**Progress:** [1/7] ●○○○

**Campos:**
- Nome do salão *
- Seu nome *
- WhatsApp *
- Email (opcional)

**Validações:**
- Nome salão: min 3 chars
- Nome completo: min 6 chars
- WhatsApp: formato brasileiro (11 dígitos)
- Email: RFC 5322

---

#### 🎨 Tela 3: Consentimento LGPD ⚠️ CRÍTICO
**Objetivo:** Obter consentimento explícito e informado
**Tempo médio:** 2-3 min
**Progress:** [2/7] ●●○○

**⚠️ CRÍTICO PARA COMPLIANCE:**

**4 Checkboxes Obrigatórios (NUNCA pré-marcados):**

1. ☐ **Termos de Uso e Política de Privacidade**
   - Link: [Ler Termos de Uso]
   - Link: [Ler Política de Privacidade]

2. ☐ **Aceite de Risco (WhatsApp)**
   - Texto: "Estou ciente que..."
   - Link: [Ler Termo Completo de Aceite de Risco]

3. ☐ **Consentimento LGPD (Dados de Clientes)**
   - Texto: "Declaro que..."
   - Link: [Ler DPA - Data Processing Agreement]

4. ☐ **Aviso de Número Secundário**
   - Card destacado com recomendação
   - Link: [Saiba Como Obter Número Secundário]

**Botão:** "Aceitar Todos e Continuar" (desabilitado até marcar todos)

**Timestamp:** Salva data/hora + IP + user-agent do aceite

---

#### 🎨 Tela 4: Conectar WhatsApp
**Objetivo:** Conectar WhatsApp via QR Code (Z-API)
**Tempo médio:** 1 min
**Progress:** [3/7] ●●●○

**Elementos:**
- Instruções passo-a-passo (5 passos)
- QR Code gerado (Z-API)
- Spinner "Aguardando conexão..."
- Timer de expiração (60s)
- [Gerar Novo Código]
- [Ver Tutorial em Vídeo]
- [Pular por Enquanto]

**Estados:**
- Aguardando (default)
- Conectado ✅
- Erro ❌
- Timeout (60s)

---

#### 🎨 Tela 5: Importar Clientes
**Objetivo:** Importar base de clientes
**Tempo médio:** 2-5 min
**Progress:** [4/7] ●●●●○

**3 Opções:**

1. **Importar CSV**
   - Drag & drop ou file picker
   - [Baixar Modelo]
   - Preview de erros/duplicatas

2. **Adicionar Manual**
   - Modal com form completo
   - Checkbox consentimento LGPD

3. **Pular**
   - [Continuar Sem Clientes]

---

#### 🎨 Tela 6: Configurar Ciclos
**Objetivo:** Definir ciclo ideal de cada serviço
**Tempo médio:** 1-2 min
**Progress:** [5/7] ●●●●●○

**5 Serviços Padrão:**
- 💅 Unha: 21 dias
- 💇‍♀️ Cabelo Feminino: 35 dias
- 💇‍♂️ Cabelo Masculino: 25 dias
- 🧔 Barba: 15 dias
- 👁️ Design Sobrancelha: 21 dias

**Funcionalidades:**
- Input numérico (min 7, max 90 dias)
- Sugestões por serviço
- [+ Adicionar Serviço Personalizado]

---

#### 🎨 Tela 7: Tudo Pronto!
**Objetivo:** Resumo e ativação
**Tempo médio:** 30s
**Progress:** [7/7] ●●●●●●●

**Elementos:**
- Animação confetes 🎉
- Resumo da configuração
- Card "Desafio 5 Clientes" (progress 0/5)
- [✅ Sim, Ativar Recalls!]
- [👀 Deixa Eu Revisar Antes]
- Próximos passos

---

## 📊 Fluxo 2: Dashboard Principal

### Hierarquia de Telas

```
DASHBOARD (Home)
├── Cards
│   ├── R$ Recuperados Hoje
│   ├── Desafio 5 Clientes
│   ├── Confirmações Pendentes
│   └── Recalls (7 dias)
├── Gráficos
│   ├── Receita Recuperada (30 dias)
│   └── Clientes por Status
└── Ações Rápidas
    ├── Adicionar Cliente
    ├── Importar CSV
    ├── Recall Manual
    └── Ver Conversas
```

#### 🎨 Dashboard Home
**Atualização:** Tempo real (WebSocket)
**Mobile-first:** Design otimizado para celular

**Cards Principais:**
1. **R$ Recuperados** (Hero)
   - Valor gigante (48px mobile, 72px desktop)
   - Animação count-up
   - Tendência vs ontem

2. **Desafio 5 Clientes** (Trial)
   - Progress bar animada
   - Confetes ao completar 5/5
   - CTA conversão

3. **Confirmações Pendentes**
   - Urgência visual (cores)
   - Botões 👍👎 inline
   - Timer desde criação

4. **Recalls (7 dias)**
   - Métricas empilhadas
   - Taxa de resposta/agendamento
   - Setas de tendência

---

## 💬 Fluxo 3: Conversas/Inbox

```
CONVERSAS
├── Lista de Conversas
│   ├── Filtros (Todas, Ativas, Concluídas)
│   ├── Status visual (🟢🟡⚪)
│   └── Preview última mensagem
└── Detalhes da Conversa
    ├── Histórico completo
    ├── Info do cliente (sidebar)
    ├── Toggle bot ON/OFF
    └── Input manual (se bot OFF)
```

#### 🎨 Inbox de Conversas
**Tempo real:** Sim (WebSocket)
**Notificações:** Push se escalado

**Estados das Conversas:**
- 🟢 Verde: Ativa (bot respondendo)
- 🟡 Amarelo: Escalada (humano assumiu)
- ⚪ Branco: Aguardando resposta cliente

**Detalhes:**
- Histórico estilo WhatsApp
- Timestamp de cada mensagem
- Indicador "🤖 Bot ativo" ou "👤 Humano"
- [Assumir Controle] button

---

## ⏰ Fluxo 4: Confirmações (Lazy Sync)

```
CONFIRMAÇÕES PENDENTES
├── Fila Priorizada
│   ├── 🔴 Urgente (>25 min)
│   ├── 🟡 Atenção (10-25 min)
│   └── 🟢 Recente (<10 min)
└── Ações
    ├── [👍 SIM]
    ├── [👎 NÃO]
    └── [⏰ Outro Horário]
```

#### 🎨 Confirmações Pendentes
**Timeout:** 30 minutos
**Notificação:** Push se timeout

**Card de Confirmação:**
- Info do cliente
- Serviço + profissional
- Data/hora proposto
- Há quanto tempo aguardando
- 3 botões de ação

**Histórico:**
- Confirmadas hoje
- Negadas hoje

---

## 👥 Fluxo 5: Gestão de Clientes

```
CLIENTES
├── Lista
│   ├── Busca (nome/telefone)
│   ├── Filtros (status, serviço)
│   └── Cards de cliente
└── Detalhes
    ├── Informações básicas
    ├── Histórico de visitas
    ├── Preferências
    ├── Compliance LGPD
    ├── Notas
    └── Últimas conversas
```

#### 🎨 Lista de Clientes
**Status Visual:**
- 🟢 Ativo (visitou <60 dias)
- 🟡 Em Risco (ciclo vencido)
- 🔴 Churned (90+ dias)
- ⛔ Opt-out (não contactar)

**Ações por Cliente:**
- [Ver]
- [Editar]
- [Recall Manual]
- [Reativar] (se churned)

---

## ⚙️ Fluxo 6: Configurações

```
CONFIGURAÇÕES
├── WhatsApp
│   ├── Status conexão
│   ├── Quality Rating
│   └── Rate limiting
├── Usuários (Owner only)
│   ├── Lista de usuários
│   └── Convidar usuário
├── Mensagens
│   ├── Templates personalizados
│   └── A/B testing
├── Ciclos de Serviço
│   └── Ajustar dias
└── Plano & Pagamento
    ├── Trial progress
    ├── Upgrade
    └── Billing history
```

---

## 📊 Resumo Quantitativo

### Telas por Categoria

| Categoria | Telas | Modals | Total |
|-----------|-------|--------|-------|
| Onboarding | 7 | 0 | 7 |
| Autenticação | 3 | 0 | 3 |
| Dashboard | 1 | 0 | 1 |
| Conversas | 1 | 0 | 1 |
| Confirmações | 1 | 0 | 1 |
| Clientes | 2 | 2 | 4 |
| Configurações | 1 | 1 | 2 |
| Usuários | 1 | 1 | 2 |
| **TOTAL** | **17** | **4** | **21** |

### Elementos Interativos

| Tipo | Quantidade |
|------|------------|
| Formulários | 12 |
| Botões CTA | 45+ |
| Filtros/Busca | 8 |
| Gráficos | 2 |
| Cards animados | 6 |
| Modals | 4 |
| Progress bars | 2 |

---

## 🎨 Design System

### Cores Principais
```
Primary: #00C853 (Verde sucesso)
Secondary: #1976D2 (Azul confiança)
Accent: #FF6F00 (Laranja urgência)

Status:
- Ativo: #00C853 (Verde)
- Atenção: #FFA000 (Amarelo)
- Erro: #D32F2F (Vermelho)
- Neutro: #757575 (Cinza)

Backgrounds:
- Primary: #FFFFFF
- Secondary: #F5F5F5
- Dark: #212121
```

### Tipografia
```
Headings: Inter Bold
Body: Inter Regular
Monospace: Fira Code (logs, código)

Tamanhos:
- H1: 32px (mobile) / 48px (desktop)
- H2: 24px / 32px
- H3: 20px / 24px
- Body: 16px / 18px
- Small: 14px / 16px
```

### Componentes Reutilizáveis
- Button (Primary, Secondary, Ghost)
- Card (Elevated, Outlined)
- Input (Text, Number, Phone, Email, Date)
- Select/Dropdown
- Checkbox/Radio
- Modal/Dialog
- Toast/Notification
- Progress Bar
- Badge/Chip
- Avatar
- Skeleton Loader

---

## ✅ Checklist de Implementação

### Por Tela

#### Onboarding
- [ ] Tela 1: Bem-vindo
- [ ] Tela 2: Dados Básicos
- [ ] Tela 3: Consentimento LGPD ⚠️
- [ ] Tela 4: Conectar WhatsApp
- [ ] Tela 5: Importar Clientes
- [ ] Tela 6: Configurar Ciclos
- [ ] Tela 7: Tudo Pronto

#### Dashboard
- [ ] Home/Dashboard
- [ ] Conversas/Inbox
- [ ] Confirmações Pendentes

#### Clientes
- [ ] Lista de Clientes
- [ ] Detalhes do Cliente
- [ ] Modal: Adicionar/Editar
- [ ] Modal: Upload CSV

#### Configurações
- [ ] WhatsApp Settings
- [ ] Usuários (Owner)
- [ ] Modal: Convidar Usuário

### Por Funcionalidade

- [ ] Animações (count-up, confetes, transitions)
- [ ] Loading states elegantes
- [ ] Empty states claros
- [ ] Error handling visual
- [ ] Mobile-responsive (3 breakpoints)
- [ ] Dark mode (opcional)
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] SEO otimizado

---

## 🚀 Ordem de Implementação Sugerida

### Sprint 1-2: Foundation
1. Design System + Componentes
2. Autenticação (Login, OTP)
3. Layout base (Header, Sidebar)

### Sprint 3-4: Onboarding
4. Telas 1-2 (Welcome, Dados)
5. Tela 3 (LGPD) ⚠️ CRÍTICO
6. Telas 4-7 (WhatsApp, Clientes, Ciclos, Ativar)

### Sprint 5-6: Core Features
7. Dashboard Home
8. Gestão de Clientes
9. Configurações básicas

### Sprint 7-8: Advanced Features
10. Conversas/Inbox
11. Confirmações (Lazy Sync)
12. WhatsApp Settings

---

**Made with ❤️ by Claude Code**
**Data:** 08/01/2026
**Versão:** 1.0
