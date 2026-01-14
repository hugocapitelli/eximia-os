# PRP-02: Dashboard e Métricas
## Agenda Cheia - Tela Principal (Home)

> **Módulo:** Dashboard
> **Complexidade:** Alta
> **Prioridade:** P0 (MVP Critical)
> **Estimativa:** 4 dias

---

## Objetivo

Criar um dashboard mobile-first que mostre métricas de "dopamina" (R$ recuperados, clientes agendados) e permita acesso rápido às funcionalidades principais, maximizando engajamento e percepção de valor.

---

## Princípios de Design

1. **Dopamina Visual:** Números grandes, cores vibrantes, animações de sucesso
2. **Hierarchy:** Métricas mais importantes no topo (R$ Recuperados)
3. **Actionable:** Cada card permite ação direta
4. **Real-time:** Dados atualizados em tempo real (WebSocket ou polling 30s)
5. **Progressão Gamificada:** "Desafio 5 Clientes" como progress bar

---

## Wireframe Principal

```
┌─────────────────────────────────────────┐
│  ☰  Agenda Cheia    [👤] [🔔 3]         │  ← Header: Menu, Avatar, Notificações
├─────────────────────────────────────────┤
│                                         │
│   Olá, Maria! 👋                        │  ← Personalização
│   Salão da Maria                        │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 💰 R$ RECUPERADOS HOJE              │ │ ← Card Principal (Destaque)
│  │                                     │ │
│  │        R$ 640,00                    │ │ ← Número Grande
│  │                                     │ │
│  │    ↗ +23% vs ontem                  │ │ ← Comparação
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🎯 DESAFIO 5 CLIENTES               │ │ ← Gamificação
│  │                                     │ │
│  │  [████████░░]  3/5                  │ │ ← Progress Bar
│  │                                     │ │
│  │  Faltam 2 para modo pago! 🚀        │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 📊 RECALLS (ÚLTIMOS 7 DIAS)         │ │ ← Métricas de Atividade
│  │                                     │ │
│  │  Enviados:        42                │ │
│  │  Responderam:     18 (42,9%)        │ │
│  │  Agendaram:       11 (26,2%)        │ │
│  │                                     │ │
│  │  [Ver Detalhes →]                   │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ──────── Receita (30 dias) ────────    │ ← Título do Gráfico
│  ┌─────────────────────────────────────┐ │
│  │        ╱╲                           │ │
│  │       ╱  ╲      ╱╲                  │ │ ← Gráfico de Linha
│  │      ╱    ╲    ╱  ╲                 │ │
│  │     ╱      ╲  ╱    ╲                │ │
│  │    ╱        ╲╱      ╲               │ │
│  │ ──────────────────────              │ │
│  │ Sem Qua Qui Sex Sáb Dom             │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 📋 CONFIRMAÇÕES PENDENTES  [2]      │ │ ← Action Card
│  │                                     │ │
│  │  Maria Silva quer Sexta 15h         │ │
│  │  [👍 Confirmar]  [👎 Negar]         │ │
│  │                                     │ │
│  │  João Santos quer Sábado 10h        │ │
│  │  [👍 Confirmar]  [👎 Negar]         │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌──────────────────┐ ┌────────────────┐│
│  │ 💬 Conversas     │ │ 👥 Clientes    ││ ← Ações Rápidas
│  │ 3 não lidas      │ │ 150 ativos     ││
│  └──────────────────┘ └────────────────┘│
│                                         │
│                                         │
└─────────────────────────────────────────┘
│  [🏠] [💬] [👥] [⚙️]                    │  ← Bottom Nav
└─────────────────────────────────────────┘
```

---

## Componentes Detalhados

### 1. Header

```tsx
interface HeaderProps {
  businessName: string;
  ownerName: string;
  unreadNotifications: number;
  onMenuClick: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
}

export function DashboardHeader({
  businessName,
  ownerName,
  unreadNotifications,
  onMenuClick,
  onProfileClick,
  onNotificationsClick
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        {/* Menu Hamburger */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logo/Nome */}
        <div className="flex-1 text-center">
          <h1 className="font-bold text-lg text-gray-900">Agenda Cheia</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <button
            onClick={onNotificationsClick}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Avatar */}
          <button
            onClick={onProfileClick}
            className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
          >
            {ownerName.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Saudação */}
      <div>
        <p className="text-gray-900 font-semibold">
          Olá, {ownerName.split(' ')[0]}! 👋
        </p>
        <p className="text-sm text-gray-600">{businessName}</p>
      </div>
    </div>
  );
}
```

---

### 2. Card: R$ Recuperados Hoje

```tsx
interface RevenueCardProps {
  amount: number;
  previousAmount: number;
  period: 'today' | 'week' | 'month';
  onPeriodChange: (period: 'today' | 'week' | 'month') => void;
}

export function RevenueCard({
  amount,
  previousAmount,
  period,
  onPeriodChange
}: RevenueCardProps) {
  const percentageChange = previousAmount > 0
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;

  const isPositive = percentageChange >= 0;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
      {/* Período Selector */}
      <div className="flex gap-2 mb-4">
        {(['today', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              period === p
                ? 'bg-white text-purple-700'
                : 'bg-purple-600 text-purple-100'
            }`}
          >
            {p === 'today' ? 'Hoje' : p === 'week' ? '7 dias' : '30 dias'}
          </button>
        ))}
      </div>

      {/* Label */}
      <p className="text-purple-200 text-sm font-semibold mb-1">
        💰 R$ RECUPERADOS {period === 'today' ? 'HOJE' : period === 'week' ? 'NOS ÚLTIMOS 7 DIAS' : 'NOS ÚLTIMOS 30 DIAS'}
      </p>

      {/* Valor */}
      <p className="text-5xl font-bold mb-2">
        {formatCurrency(amount)}
      </p>

      {/* Comparação */}
      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-300" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-300" />
        )}
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {isPositive ? '+' : ''}{percentageChange.toFixed(1)}% vs {period === 'today' ? 'ontem' : 'período anterior'}
        </span>
      </div>

      {/* Breakdown (se houver) */}
      <button className="mt-4 text-sm text-purple-200 underline">
        Ver detalhamento →
      </button>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
}
```

**Comportamentos:**
- Animação ao mudar valor (CountUp.js ou similar)
- Brilho/pulsação quando novo agendamento acontece
- Selector de período: Hoje / 7 dias / 30 dias
- Tap para ver breakdown detalhado

---

### 3. Card: Desafio 5 Clientes

```tsx
interface Challenge5Props {
  current: number;
  target: number;
  onUpgrade: () => void;
}

export function Challenge5Card({ current, target, onUpgrade }: Challenge5Props) {
  const percentage = (current / target) * 100;
  const isComplete = current >= target;

  return (
    <div className={`rounded-2xl p-6 shadow-lg ${
      isComplete
        ? 'bg-gradient-to-br from-green-500 to-green-700 text-white'
        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`font-semibold ${isComplete ? 'text-white' : 'text-gray-900'}`}>
          🎯 DESAFIO 5 CLIENTES
        </p>
        {isComplete && <CheckCircle className="w-6 h-6" />}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isComplete ? 'bg-white' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className={`text-right mt-2 font-bold ${isComplete ? 'text-white' : 'text-gray-700'}`}>
          {current}/{target}
        </p>
      </div>

      {/* Mensagem */}
      {!isComplete ? (
        <p className="text-gray-700 font-semibold">
          Faltam {target - current} para desbloquear modo pago! 🚀
        </p>
      ) : (
        <div>
          <p className="text-white font-bold mb-3">
            🎉 Parabéns! Você desbloqueou o modo pago!
          </p>
          <button
            onClick={onUpgrade}
            className="w-full bg-white text-green-700 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Ativar Plano Pago (R$ 49/mês) →
          </button>
        </div>
      )}
    </div>
  );
}
```

**Comportamentos:**
- Progress bar animada (smooth transition)
- Confete/animação ao completar 5º cliente
- Botão "Ativar Plano" aparece só após completar
- Cor muda de amarelo/laranja → verde ao completar

---

### 4. Card: Recalls (Últimos 7 Dias)

```tsx
interface RecallStatsProps {
  sent: number;
  responded: number;
  scheduled: number;
  onViewDetails: () => void;
}

export function RecallStatsCard({
  sent,
  responded,
  scheduled,
  onViewDetails
}: RecallStatsProps) {
  const responseRate = sent > 0 ? (responded / sent) * 100 : 0;
  const conversionRate = responded > 0 ? (scheduled / responded) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
      <p className="font-semibold text-gray-900 mb-4">
        📊 RECALLS (ÚLTIMOS 7 DIAS)
      </p>

      <div className="space-y-3">
        {/* Enviados */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Enviados:</span>
          <span className="font-bold text-gray-900 text-lg">{sent}</span>
        </div>

        {/* Responderam */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Responderam:</span>
          <div className="text-right">
            <span className="font-bold text-gray-900 text-lg">{responded}</span>
            <span className="text-sm text-gray-500 ml-2">({responseRate.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Agendaram */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Agendaram:</span>
          <div className="text-right">
            <span className="font-bold text-green-600 text-lg">{scheduled}</span>
            <span className="text-sm text-gray-500 ml-2">({conversionRate.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* CTA */}
      <button
        onClick={onViewDetails}
        className="w-full text-purple-600 font-semibold text-sm hover:text-purple-700"
      >
        Ver Detalhes →
      </button>
    </div>
  );
}
```

---

### 5. Gráfico: Receita (30 dias)

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Processar dados para últimos 7 dias
  const last7Days = data.slice(-7);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
      <p className="font-semibold text-gray-900 mb-4 text-center">
        ──────── Receita (30 dias) ────────
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={last7Days}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#9333ea"
            strokeWidth={3}
            dot={{ fill: '#9333ea', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Alternativa (ASCII Chart para MVP mais simples):**

```tsx
export function SimpleRevenueChart({ data }: { data: number[] }) {
  const max = Math.max(...data);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <p className="font-semibold text-gray-900 mb-4 text-center">
        Receita (últimos 7 dias)
      </p>

      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((value, i) => {
          const height = (value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-600 mt-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 6. Card: Confirmações Pendentes (Lazy Sync)

```tsx
interface PendingConfirmation {
  id: string;
  customerName: string;
  requestedTime: string;
  service: string;
}

interface PendingConfirmationsCardProps {
  confirmations: PendingConfirmation[];
  onConfirm: (id: string) => void;
  onDeny: (id: string) => void;
}

export function PendingConfirmationsCard({
  confirmations,
  onConfirm,
  onDeny
}: PendingConfirmationsCardProps) {
  if (confirmations.length === 0) {
    return null; // Não mostrar card se não houver confirmações
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-gray-900">
          📋 CONFIRMAÇÕES PENDENTES
        </p>
        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {confirmations.length}
        </span>
      </div>

      <div className="space-y-4">
        {confirmations.slice(0, 3).map(conf => (
          <div key={conf.id} className="bg-white rounded-xl p-4 border border-blue-200">
            <p className="font-semibold text-gray-900 mb-1">
              {conf.customerName}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Quer {conf.requestedTime} • {conf.service}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onConfirm(conf.id)}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-1"
              >
                👍 Confirmar
              </button>
              <button
                onClick={() => onDeny(conf.id)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-1"
              >
                👎 Negar
              </button>
            </div>
          </div>
        ))}

        {confirmations.length > 3 && (
          <button className="w-full text-blue-600 font-semibold text-sm">
            Ver todas ({confirmations.length}) →
          </button>
        )}
      </div>
    </div>
  );
}
```

**Comportamentos:**
- Badge de notificação no header quando há pendências
- Animação de entrada ao aparecer nova confirmação
- Toast de sucesso ao confirmar/negar
- Remove card se lista ficar vazia

---

### 7. Ações Rápidas (Quick Actions)

```tsx
interface QuickActionsProps {
  unreadConversations: number;
  activeClients: number;
  onConversationsClick: () => void;
  onClientsClick: () => void;
}

export function QuickActions({
  unreadConversations,
  activeClients,
  onConversationsClick,
  onClientsClick
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Conversas */}
      <button
        onClick={onConversationsClick}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <MessageSquare className="w-8 h-8 text-purple-600" />
          {unreadConversations > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadConversations}
            </span>
          )}
        </div>
        <p className="font-semibold text-gray-900">Conversas</p>
        <p className="text-sm text-gray-600">
          {unreadConversations > 0 ? `${unreadConversations} não lidas` : 'Tudo lido'}
        </p>
      </button>

      {/* Clientes */}
      <button
        onClick={onClientsClick}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition text-left"
      >
        <Users className="w-8 h-8 text-green-600 mb-2" />
        <p className="font-semibold text-gray-900">Clientes</p>
        <p className="text-sm text-gray-600">
          {activeClients} ativos
        </p>
      </button>
    </div>
  );
}
```

---

### 8. Bottom Navigation

```tsx
interface BottomNavProps {
  active: 'home' | 'conversations' | 'clients' | 'settings';
  onNavigate: (page: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'conversations', icon: MessageSquare, label: 'Conversas' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-screen-sm mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition ${
                isActive ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## Dashboard Completo (Integração)

```tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function DashboardScreen() {
  // Estados
  const [revenueData, setRevenueData] = useState({
    today: 0,
    week: 0,
    month: 0,
    previousToday: 0
  });
  const [challenge, setChallenge] = useState({ current: 0, target: 5 });
  const [recallStats, setRecallStats] = useState({ sent: 0, responded: 0, scheduled: 0 });
  const [pendingConfirmations, setPendingConfirmations] = useState([]);
  const [chartData, setChartData] = useState([]);

  // WebSocket para updates em tempo real
  const { lastMessage } = useWebSocket('wss://api.agendacheia.com/ws');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      handleRealtimeUpdate(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  async function fetchDashboardData() {
    const [revenue, challenge, recalls, confirmations, chart] = await Promise.all([
      fetch('/api/v1/dashboard/revenue').then(r => r.json()),
      fetch('/api/v1/dashboard/challenge').then(r => r.json()),
      fetch('/api/v1/dashboard/recalls').then(r => r.json()),
      fetch('/api/v1/dashboard/pending-confirmations').then(r => r.json()),
      fetch('/api/v1/dashboard/chart?days=30').then(r => r.json())
    ]);

    setRevenueData(revenue);
    setChallenge(challenge);
    setRecallStats(recalls);
    setPendingConfirmations(confirmations);
    setChartData(chart);
  }

  function handleRealtimeUpdate(event: any) {
    switch (event.type) {
      case 'new_appointment':
        // Atualizar receita
        setRevenueData(prev => ({
          ...prev,
          today: prev.today + event.amount
        }));

        // Atualizar challenge
        setChallenge(prev => ({
          ...prev,
          current: prev.current + 1
        }));

        // Mostrar toast
        showSuccessToast(`🎉 +R$ ${event.amount} recuperados!`);

        // Animação de confete se completar desafio
        if (challenge.current + 1 === challenge.target) {
          triggerConfetti();
        }
        break;

      case 'new_pending_confirmation':
        setPendingConfirmations(prev => [event.confirmation, ...prev]);
        break;

      case 'recall_sent':
        setRecallStats(prev => ({
          ...prev,
          sent: prev.sent + 1
        }));
        break;
    }
  }

  async function handleConfirmAppointment(id: string) {
    await fetch(`/api/v1/confirmations/${id}/confirm`, { method: 'POST' });
    setPendingConfirmations(prev => prev.filter(c => c.id !== id));
    showSuccessToast('✅ Agendamento confirmado!');
  }

  async function handleDenyAppointment(id: string) {
    await fetch(`/api/v1/confirmations/${id}/deny`, { method: 'POST' });
    setPendingConfirmations(prev => prev.filter(c => c.id !== id));
    showSuccessToast('Negado. Cliente será informado.');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <DashboardHeader
        businessName="Salão da Maria"
        ownerName="Maria Silva"
        unreadNotifications={3}
        onMenuClick={() => {}}
        onProfileClick={() => {}}
        onNotificationsClick={() => {}}
      />

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* R$ Recuperados */}
        <RevenueCard
          amount={revenueData.today}
          previousAmount={revenueData.previousToday}
          period="today"
          onPeriodChange={() => {}}
        />

        {/* Desafio 5 Clientes */}
        <Challenge5Card
          current={challenge.current}
          target={challenge.target}
          onUpgrade={() => window.location.href = '/upgrade'}
        />

        {/* Recalls Stats */}
        <RecallStatsCard
          sent={recallStats.sent}
          responded={recallStats.responded}
          scheduled={recallStats.scheduled}
          onViewDetails={() => {}}
        />

        {/* Gráfico */}
        <RevenueChart data={chartData} />

        {/* Confirmações Pendentes */}
        <PendingConfirmationsCard
          confirmations={pendingConfirmations}
          onConfirm={handleConfirmAppointment}
          onDeny={handleDenyAppointment}
        />

        {/* Quick Actions */}
        <QuickActions
          unreadConversations={3}
          activeClients={150}
          onConversationsClick={() => window.location.href = '/conversations'}
          onClientsClick={() => window.location.href = '/clients'}
        />
      </div>

      {/* Bottom Nav */}
      <BottomNav
        active="home"
        onNavigate={(page) => window.location.href = `/${page}`}
      />
    </div>
  );
}
```

---

## Estados Especiais

### Empty State (Primeiro Acesso)

```tsx
export function DashboardEmptyState({ onStartRecalls }: { onStartRecalls: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <img
          src="/illustrations/empty-dashboard.svg"
          alt="Comece agora"
          className="w-48 h-48 mx-auto mb-6"
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tudo pronto para começar!
        </h2>

        <p className="text-gray-600 mb-8">
          Você importou {150} clientes.
          Vamos enviar os primeiros recalls?
        </p>

        <button
          onClick={onStartRecalls}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg"
        >
          Enviar Primeiros Recalls 🚀
        </button>
      </div>
    </div>
  );
}
```

---

### Pull to Refresh

```tsx
import { useRef, useState } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;

      if (diff > 80) {
        setIsPulling(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling) {
      await onRefresh();
      setIsPulling(false);
    }
  };

  return {
    isPulling,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}

// Uso:
function Dashboard() {
  const { isPulling, handlers } = usePullToRefresh(async () => {
    await fetchDashboardData();
  });

  return (
    <div {...handlers}>
      {isPulling && (
        <div className="text-center py-4">
          <Loader className="w-6 h-6 animate-spin mx-auto text-purple-600" />
          <p className="text-sm text-gray-600 mt-2">Atualizando...</p>
        </div>
      )}
      {/* Rest of dashboard */}
    </div>
  );
}
```

---

## Notificações (Toasts)

```tsx
import toast, { Toaster } from 'react-hot-toast';

// Componente global
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px'
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff'
          }
        }
      }}
    />
  );
}

// Funções helper
export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showCustomToast(message: string, icon: string) {
  toast(message, { icon });
}
```

---

## Analytics

```typescript
// Eventos a trackear
export const DASHBOARD_EVENTS = {
  VIEWED: 'dashboard_viewed',
  REVENUE_PERIOD_CHANGED: 'dashboard_revenue_period_changed',
  CONFIRMATION_APPROVED: 'dashboard_confirmation_approved',
  CONFIRMATION_DENIED: 'dashboard_confirmation_denied',
  QUICK_ACTION_CLICKED: 'dashboard_quick_action_clicked',
  CHART_TAPPED: 'dashboard_chart_tapped'
};

// Uso
useEffect(() => {
  trackEvent(DASHBOARD_EVENTS.VIEWED, {
    revenue_today: revenueData.today,
    challenge_progress: `${challenge.current}/${challenge.target}`,
    pending_confirmations: pendingConfirmations.length
  });
}, []);
```

---

## Performance Optimization

**1. Lazy Loading de Gráficos:**
```tsx
import { lazy, Suspense } from 'react';

const RevenueChart = lazy(() => import('./RevenueChart'));

// Uso:
<Suspense fallback={<ChartSkeleton />}>
  <RevenueChart data={chartData} />
</Suspense>
```

**2. Memoização de Componentes Pesados:**
```tsx
import { memo } from 'react';

export const RevenueCard = memo(function RevenueCard({ amount, previousAmount }: Props) {
  // ...
}, (prev, next) => {
  return prev.amount === next.amount && prev.previousAmount === next.previousAmount;
});
```

**3. Virtual Scrolling para Listas Longas:**
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// Usar se lista de confirmações > 20 itens
```

---

## Success Criteria

**Dashboard é considerado bem-sucedido se:**
1. ✅ Carrega em <2 segundos (initial load)
2. ✅ Updates em tempo real funcionam (WebSocket)
3. ✅ Animações são smooth (60fps)
4. ✅ Pull-to-refresh funciona em mobile
5. ✅ Métricas atualizadas corretamente
6. ✅ Confete dispara ao completar desafio
7. ✅ Toasts aparecem para ações importantes

**Métricas de Engajamento:**
- Tempo médio na tela: >2 minutos/dia
- Taxa de retorno diário: >60%
- Cliques em confirmações pendentes: >80%
- Share de screenshots (R$ recuperados): >10%

---

**FIM DO PRP-02: DASHBOARD E MÉTRICAS**
