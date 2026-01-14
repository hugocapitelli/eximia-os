# PRP-03: Gestão de Clientes
## Agenda Cheia - CRUD e Segmentação de Clientes

> **Módulo:** Clientes
> **Complexidade:** Média
> **Prioridade:** P0 (MVP Critical)
> **Estimativa:** 3 dias

---

## Objetivo

Criar interface intuitiva para visualizar, buscar, filtrar, adicionar e editar clientes, permitindo que o dono do salão gerencie sua base e entenda o status de cada cliente (ativo, inativo, churned).

---

## Princípios de Design

1. **Search-First:** Busca rápida como ação primária
2. **Visual Status:** Cores e badges para identificar status rapidamente
3. **Actions on Tap:** Ações contextuais ao tocar no cliente
4. **Bulk Operations:** Seleção múltipla para ações em massa
5. **Smart Defaults:** Formulários pre-populados com dados inteligentes

---

## Tela 1: Lista de Clientes

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Clientes (150)          [⋮] [+]     │  ← Header: Voltar, Total, Menu, Adicionar
├─────────────────────────────────────────┤
│                                         │
│  🔍 Buscar cliente...                   │  ← Search Bar (sempre visível)
│                                         │
│  ┌─────────────────────────────────┐   │  ← Filtros rápidos
│  │ [Todos] [Ativos] [Inativos]    │   │
│  │ [Devem Retornar] [Churned]      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  Maria Silva                  │   │  ← Card de Cliente
│  │    (11) 99999-9999              │   │
│  │    Última visita: 10/12/2025    │   │
│  │    🟢 Retorno em 3 dias         │   │  ← Status Visual
│  │    Manicure • Carol             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  João Santos                  │   │
│  │    (11) 98888-8888              │   │
│  │    Última visita: 15/11/2025    │   │
│  │    🟡 Atrasado 5 dias           │   │
│  │    Barba • Rafael               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  Ana Costa                    │   │
│  │    (11) 97777-7777              │   │
│  │    Última visita: 20/08/2025    │   │
│  │    🔴 Inativa há 138 dias       │   │
│  │    Cabelo • Fernanda            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Carregar mais...]                     │
│                                         │
└─────────────────────────────────────────┘
│  [🏠] [💬] [👥] [⚙️]                    │  ← Bottom Nav
└─────────────────────────────────────────┘
```

### Especificações Técnicas

**Componente:** `ClientsListScreen.tsx`

```tsx
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

type ClientStatus = 'active' | 'should_return' | 'inactive' | 'churned' | 'opted_out';

interface Client {
  id: string;
  name: string;
  phone: string;
  lastVisitAt: Date | null;
  lastService: string | null;
  preferredProfessional: string | null;
  status: ClientStatus;
  daysUntilReturn: number | null;
  serviceCycleDays: number;
}

type FilterType = 'all' | 'active' | 'should_return' | 'inactive' | 'churned';

export function ClientsListScreen() {
  // Estados
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Debounce search para não fazer request a cada tecla
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch inicial
  useEffect(() => {
    fetchClients();
  }, []);

  // Refetch quando busca ou filtro mudar
  useEffect(() => {
    setPage(1);
    fetchClients(1, true);
  }, [debouncedSearch, activeFilter]);

  async function fetchClients(pageNum = page, reset = false) {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: '20',
      search: debouncedSearch,
      filter: activeFilter
    });

    const response = await fetch(`/api/v1/clients?${params}`);
    const data = await response.json();

    if (reset) {
      setClients(data.clients);
    } else {
      setClients(prev => [...prev, ...data.clients]);
    }

    setHasMore(data.hasMore);
    setIsLoading(false);
  }

  // Filtros computados
  const filteredClients = useMemo(() => {
    let result = clients;

    // Busca local (além do server-side)
    if (searchQuery) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
      );
    }

    return result;
  }, [clients, searchQuery]);

  // Scroll infinito
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchClients(nextPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            Clientes ({clients.length})
          </h1>
          <div className="flex gap-2">
            <button onClick={() => {/* Menu ações em massa */}}>
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => window.location.href = '/clients/new'}
              className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          {[
            { id: 'all', label: 'Todos', count: clients.length },
            { id: 'active', label: 'Ativos', count: clients.filter(c => c.status === 'active').length },
            { id: 'should_return', label: 'Devem Retornar', count: clients.filter(c => c.status === 'should_return').length },
            { id: 'inactive', label: 'Inativos', count: clients.filter(c => c.status === 'inactive').length },
            { id: 'churned', label: 'Churned', count: clients.filter(c => c.status === 'churned').length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeFilter === filter.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} {filter.count > 0 && `(${filter.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="px-4 py-4 space-y-3">
        {isLoading && page === 1 ? (
          <ClientListSkeleton />
        ) : filteredClients.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        ) : (
          <>
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => window.location.href = `/clients/${client.id}`}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full py-3 text-purple-600 font-semibold disabled:text-gray-400"
              >
                {isLoading ? 'Carregando...' : 'Carregar mais'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="clients" onNavigate={(page) => window.location.href = `/${page}`} />
    </div>
  );
}
```

---

### Card de Cliente

```tsx
interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  // Calcular status visual
  const statusConfig = getStatusConfig(client);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-400 hover:shadow-md transition text-left"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {/* Nome */}
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
          </div>

          {/* Telefone */}
          <p className="text-sm text-gray-600">{formatPhone(client.phone)}</p>

          {/* Última Visita */}
          {client.lastVisitAt && (
            <p className="text-sm text-gray-600">
              Última visita: {formatDate(client.lastVisitAt)}
            </p>
          )}
        </div>

        {/* Ícone de seta */}
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
        <span>{statusConfig.icon}</span>
        <span>{statusConfig.label}</span>
      </div>

      {/* Serviço e Profissional */}
      {(client.lastService || client.preferredProfessional) && (
        <p className="text-sm text-gray-500 mt-2">
          {client.lastService}
          {client.preferredProfessional && ` • ${client.preferredProfessional}`}
        </p>
      )}
    </button>
  );
}

function getStatusConfig(client: Client) {
  const now = new Date();
  const daysSinceVisit = client.lastVisitAt
    ? Math.floor((now.getTime() - client.lastVisitAt.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (client.status === 'opted_out') {
    return {
      icon: '🚫',
      label: 'Optou por sair',
      dotColor: 'bg-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    };
  }

  if (client.status === 'churned' || (daysSinceVisit && daysSinceVisit > 90)) {
    return {
      icon: '🔴',
      label: `Inativa há ${daysSinceVisit} dias`,
      dotColor: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    };
  }

  if (client.daysUntilReturn !== null) {
    if (client.daysUntilReturn < 0) {
      return {
        icon: '🟡',
        label: `Atrasado ${Math.abs(client.daysUntilReturn)} dias`,
        dotColor: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700'
      };
    } else if (client.daysUntilReturn <= 3) {
      return {
        icon: '🟢',
        label: `Retorno em ${client.daysUntilReturn} dias`,
        dotColor: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      };
    }
  }

  return {
    icon: '🔵',
    label: 'Ativo',
    dotColor: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  };
}

function formatPhone(phone: string): string {
  // 11999999999 -> (11) 99999-9999
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
```

---

### Empty State

```tsx
interface EmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

export function EmptyState({ searchQuery, onClear }: EmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum cliente encontrado
        </h3>
        <p className="text-gray-600 mb-4">
          Não encontramos ninguém com "{searchQuery}"
        </p>
        <button
          onClick={onClear}
          className="text-purple-600 font-semibold"
        >
          Limpar busca
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhum cliente ainda
      </h3>
      <p className="text-gray-600 mb-6">
        Adicione clientes para começar a enviar recalls
      </p>
      <button
        onClick={() => window.location.href = '/clients/new'}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Adicionar Primeiro Cliente
      </button>
    </div>
  );
}
```

---

### Skeleton Loading

```tsx
export function ClientListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-1/3" />
        </div>
      ))}
    </div>
  );
}
```

---

## Tela 2: Detalhes do Cliente

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Maria Silva             [✏️] [⋮]    │  ← Header: Voltar, Nome, Editar, Menu
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         MS                      │   │  ← Avatar (iniciais)
│  │   Maria Silva                   │   │
│  │   (11) 99999-9999               │   │
│  │   🟢 Retorno em 3 dias          │   │  ← Status
│  └─────────────────────────────────┘   │
│                                         │
│  📊 Informações                         │
│  ┌─────────────────────────────────┐   │
│  │ Última Visita                   │   │
│  │ 10/12/2025 (15 dias atrás)      │   │
│  │                                 │   │
│  │ Último Serviço                  │   │
│  │ Manicure                        │   │
│  │                                 │   │
│  │ Profissional Preferida          │   │
│  │ Carol                           │   │
│  │                                 │   │
│  │ Ciclo de Retorno                │   │
│  │ 21 dias                         │   │
│  │                                 │   │
│  │ Total de Visitas                │   │
│  │ 8 visitas                       │   │
│  │                                 │   │
│  │ Valor Total Gasto               │   │
│  │ R$ 640,00                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💬 Histórico de Conversas              │
│  ┌─────────────────────────────────┐   │
│  │ Hoje 14:30                      │   │
│  │ Agendou Sexta 15h ✅            │   │
│  │ [Ver conversa →]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 05/12/2025 09:15                │   │
│  │ Recall enviado                  │   │
│  │ [Ver conversa →]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📅 Histórico de Visitas                │
│  ┌─────────────────────────────────┐   │
│  │ 10/12/2025                      │   │
│  │ Manicure • Carol • R$ 80        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 20/11/2025                      │   │
│  │ Pé e Mão • Carol • R$ 120       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚙️ Ações                                │
│  ┌───────────────────────────────┐     │
│  │   📞 Enviar Mensagem          │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   🔄 Registrar Nova Visita    │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   🚫 Marcar como Não Contactar│     │ ← Opt-out manual
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   🗑️ Excluir Cliente          │     │ ← Danger zone
│  └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Especificações Técnicas

**Componente:** `ClientDetailScreen.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ClientDetail extends Client {
  totalVisits: number;
  totalSpent: number;
  conversationHistory: Conversation[];
  visitHistory: Visit[];
}

interface Conversation {
  id: string;
  date: Date;
  summary: string;
  status: 'scheduled' | 'responded' | 'no_response';
}

interface Visit {
  id: string;
  date: Date;
  service: string;
  professional: string;
  amount: number;
}

export function ClientDetailScreen() {
  const { clientId } = useParams();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  async function fetchClientDetails() {
    const response = await fetch(`/api/v1/clients/${clientId}`);
    const data = await response.json();
    setClient(data);
    setIsLoading(false);
  }

  async function handleSendMessage() {
    // Navegar para tela de enviar mensagem manual
    window.location.href = `/conversations/new?clientId=${clientId}`;
  }

  async function handleRegisterVisit() {
    // Abrir modal de registro de visita
    const service = prompt('Nome do serviço:');
    const amount = prompt('Valor (R$):');

    if (service && amount) {
      await fetch(`/api/v1/clients/${clientId}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          amount: parseFloat(amount),
          visitedAt: new Date()
        })
      });

      // Refetch
      fetchClientDetails();
    }
  }

  async function handleOptOut() {
    const confirmed = confirm(
      `Tem certeza que quer marcar ${client?.name} como "Não Contactar"?\n\n` +
      'O cliente não receberá mais recalls automáticos.'
    );

    if (confirmed) {
      await fetch(`/api/v1/clients/${clientId}/opt-out`, {
        method: 'POST'
      });

      window.location.href = '/clients';
    }
  }

  async function handleDelete() {
    const confirmed = confirm(
      `ATENÇÃO: Tem certeza que quer EXCLUIR ${client?.name}?\n\n` +
      'Esta ação NÃO pode ser desfeita.'
    );

    if (confirmed) {
      await fetch(`/api/v1/clients/${clientId}`, {
        method: 'DELETE'
      });

      window.location.href = '/clients';
    }
  }

  if (isLoading) {
    return <ClientDetailSkeleton />;
  }

  if (!client) {
    return <NotFoundState />;
  }

  const statusConfig = getStatusConfig(client);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
            {client.name}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `/clients/${clientId}/edit`}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Edit2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar e Info Básica */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 text-center">
        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {client.name}
        </h2>
        <p className="text-gray-600 mb-2">
          {formatPhone(client.phone)}
        </p>
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Informações */}
      <div className="px-4 py-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          📊 Informações
        </h3>

        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          <InfoRow label="Última Visita" value={
            client.lastVisitAt
              ? `${formatDate(client.lastVisitAt)} (${getDaysAgo(client.lastVisitAt)} dias atrás)`
              : 'Nunca'
          } />
          <InfoRow label="Último Serviço" value={client.lastService || '-'} />
          <InfoRow label="Profissional Preferida" value={client.preferredProfessional || '-'} />
          <InfoRow label="Ciclo de Retorno" value={`${client.serviceCycleDays} dias`} />
          <InfoRow label="Total de Visitas" value={`${client.totalVisits} visitas`} />
          <InfoRow
            label="Valor Total Gasto"
            value={formatCurrency(client.totalSpent)}
            highlight
          />
        </div>
      </div>

      {/* Histórico de Conversas */}
      {client.conversationHistory.length > 0 && (
        <div className="px-4 py-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            💬 Histórico de Conversas
          </h3>

          <div className="space-y-3">
            {client.conversationHistory.map(conv => (
              <button
                key={conv.id}
                onClick={() => window.location.href = `/conversations/${conv.id}`}
                className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-400 transition text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {formatDateTime(conv.date)}
                  </span>
                  {conv.status === 'scheduled' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-gray-900 font-medium">{conv.summary}</p>
                <span className="text-sm text-purple-600 font-semibold">
                  Ver conversa →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Visitas */}
      {client.visitHistory.length > 0 && (
        <div className="px-4 py-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📅 Histórico de Visitas
          </h3>

          <div className="space-y-3">
            {client.visitHistory.map(visit => (
              <div
                key={visit.id}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {formatDate(visit.date)}
                  </span>
                  <span className="font-bold text-purple-600">
                    {formatCurrency(visit.amount)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {visit.service} • {visit.professional}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="px-4 py-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          ⚙️ Ações
        </h3>

        <div className="space-y-3">
          <button
            onClick={handleSendMessage}
            className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 font-semibold text-gray-700 hover:border-purple-400 flex items-center gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            Enviar Mensagem
          </button>

          <button
            onClick={handleRegisterVisit}
            className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 font-semibold text-gray-700 hover:border-purple-400 flex items-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            Registrar Nova Visita
          </button>

          <button
            onClick={handleOptOut}
            className="w-full bg-white border-2 border-orange-300 rounded-xl p-4 font-semibold text-orange-700 hover:bg-orange-50 flex items-center gap-3"
          >
            <Ban className="w-5 h-5" />
            Marcar como Não Contactar
          </button>

          <button
            onClick={handleDelete}
            className="w-full bg-white border-2 border-red-300 rounded-xl p-4 font-semibold text-red-700 hover:bg-red-50 flex items-center gap-3"
          >
            <Trash2 className="w-5 h-5" />
            Excluir Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar
function InfoRow({ label, value, highlight = false }: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-purple-600 text-lg' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function getDaysAgo(date: Date): number {
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
```

---

## Tela 3: Adicionar/Editar Cliente

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Novo Cliente                   [✓]  │  ← Header: Voltar, Título, Salvar
├─────────────────────────────────────────┤
│                                         │
│  Informações Básicas                    │
│                                         │
│  Nome Completo *                        │
│  ┌───────────────────────────────┐     │
│  │ Maria Silva                   │     │
│  └───────────────────────────────┘     │
│                                         │
│  Telefone *                             │
│  ┌───────────────────────────────┐     │
│  │ (11) 99999-9999               │     │
│  └───────────────────────────────┘     │
│                                         │
│  ─────────────────────────────         │
│                                         │
│  Última Visita                          │
│                                         │
│  Data                                   │
│  ┌───────────────────────────────┐     │
│  │ 10/12/2025          [📅]      │     │ ← Date Picker
│  └───────────────────────────────┘     │
│                                         │
│  Serviço Realizado                      │
│  ┌───────────────────────────────┐     │
│  │ Manicure              [▼]     │     │ ← Dropdown
│  └───────────────────────────────┘     │
│                                         │
│  Profissional                           │
│  ┌───────────────────────────────┐     │
│  │ Carol                 [▼]     │     │
│  └───────────────────────────────┘     │
│                                         │
│  Valor Pago                             │
│  ┌───────────────────────────────┐     │
│  │ R$ 80,00                      │     │
│  └───────────────────────────────┘     │
│                                         │
│  ─────────────────────────────         │
│                                         │
│  Configurações de Recall                │
│                                         │
│  Ciclo de Retorno                       │
│  ┌───────────────────────────────┐     │
│  │ 21 dias               [- +]   │     │
│  └───────────────────────────────┘     │
│  💡 Baseado no serviço selecionado      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [ ] Não enviar recalls          │   │ ← Opt-out
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│  ┌───────────────────────────────┐     │
│  │      Salvar Cliente    ✓      │     │
│  └───────────────────────────────┘     │
│                                         │
│  [Cancelar]                             │
│                                         │
└─────────────────────────────────────────┘
```

### Especificações Técnicas

**Componente:** `ClientFormScreen.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';

const clientSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  lastVisitAt: z.date().optional(),
  lastService: z.string().optional(),
  preferredProfessionalId: z.string().optional(),
  lastServiceAmount: z.number().optional(),
  serviceCycleDays: z.number().min(1).max(365),
  optedOut: z.boolean()
});

type ClientFormData = z.infer<typeof clientSchema>;

export function ClientFormScreen() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(clientId);

  const [services, setServices] = useState<string[]>([]);
  const [professionals, setProfessionals] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: 'onChange',
    defaultValues: {
      serviceCycleDays: 21,
      optedOut: false
    }
  });

  const selectedService = watch('lastService');

  // Fetch services e professionals
  useEffect(() => {
    fetchFormData();
  }, []);

  // Se editando, carregar dados do cliente
  useEffect(() => {
    if (isEditing) {
      fetchClientData();
    }
  }, [clientId]);

  // Auto-ajustar ciclo baseado no serviço
  useEffect(() => {
    if (selectedService) {
      const cycleMap: Record<string, number> = {
        'Manicure': 21,
        'Pedicure': 21,
        'Cabelo': 35,
        'Barba': 15,
        'Progressiva': 90
      };

      const suggestedCycle = cycleMap[selectedService];
      if (suggestedCycle) {
        setValue('serviceCycleDays', suggestedCycle);
      }
    }
  }, [selectedService]);

  async function fetchFormData() {
    const [servicesData, professionalsData] = await Promise.all([
      fetch('/api/v1/services').then(r => r.json()),
      fetch('/api/v1/professionals').then(r => r.json())
    ]);

    setServices(servicesData);
    setProfessionals(professionalsData);
  }

  async function fetchClientData() {
    const response = await fetch(`/api/v1/clients/${clientId}`);
    const client = await response.json();

    // Popular form com dados existentes
    Object.keys(client).forEach(key => {
      setValue(key as any, client[key]);
    });
  }

  async function onSubmit(data: ClientFormData) {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/v1/clients/${clientId}`
        : '/api/v1/clients';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: data.phone.replace(/\D/g, '') // Remove máscara
        })
      });

      if (response.ok) {
        const result = await response.json();
        showSuccessToast(isEditing ? 'Cliente atualizado!' : 'Cliente adicionado!');
        navigate(`/clients/${result.id}`);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      showErrorToast('Erro ao salvar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className={`p-2 rounded-lg ${
              isValid && !isSubmitting
                ? 'text-purple-600 hover:bg-purple-50'
                : 'text-gray-400'
            }`}
          >
            <Check className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-6 space-y-6">
        {/* Informações Básicas */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Informações Básicas
          </h2>

          {/* Nome */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              placeholder="Ex: Maria Silva"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone <span className="text-red-500">*</span>
            </label>
            <InputMask
              mask="(99) 99999-9999"
              {...register('phone')}
              placeholder="(11) 99999-9999"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t border-gray-300" />

        {/* Última Visita */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Última Visita
          </h2>

          {/* Data */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              {...register('lastVisitAt', {
                setValueAs: v => v ? new Date(v) : undefined
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Serviço */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço Realizado
            </label>
            <select
              {...register('lastService')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione...</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* Profissional */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissional
            </label>
            <select
              {...register('preferredProfessionalId')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione...</option>
              {professionals.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.name}</option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Pago
            </label>
            <input
              type="number"
              step="0.01"
              {...register('lastServiceAmount', {
                setValueAs: v => v ? parseFloat(v) : undefined
              })}
              placeholder="80.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t border-gray-300" />

        {/* Configurações de Recall */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Configurações de Recall
          </h2>

          {/* Ciclo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciclo de Retorno
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const current = watch('serviceCycleDays');
                  setValue('serviceCycleDays', Math.max(1, current - 1));
                }}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                {...register('serviceCycleDays', {
                  valueAsNumber: true
                })}
                className="flex-1 text-center text-xl font-bold border border-gray-300 rounded-lg py-2"
              />

              <span className="text-gray-600">dias</span>

              <button
                type="button"
                onClick={() => {
                  const current = watch('serviceCycleDays');
                  setValue('serviceCycleDays', Math.min(365, current + 1));
                }}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Baseado no serviço selecionado
            </p>
          </div>

          {/* Opt-out */}
          <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              {...register('optedOut')}
              className="w-5 h-5 text-purple-600"
            />
            <span className="text-gray-700">
              Não enviar recalls automáticos para este cliente
            </span>
          </label>
        </section>

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
            isValid && !isSubmitting
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <Loader className="w-6 h-6 animate-spin mx-auto" />
          ) : (
            <>Salvar Cliente ✓</>
          )}
        </button>

        {/* Cancelar */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full text-gray-600 font-semibold"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
```

---

## Recursos Adicionais

### Bulk Actions (Ações em Massa)

```tsx
export function BulkActionsBar({
  selectedCount,
  onSendRecall,
  onExport,
  onDelete,
  onCancel
}: {
  selectedCount: number;
  onSendRecall: () => void;
  onExport: () => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed bottom-20 left-0 right-0 bg-purple-600 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto">
        <div className="flex items-center gap-2">
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
          <span className="font-semibold">
            {selectedCount} selecionados
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSendRecall}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Enviar Recall
          </button>
          <button onClick={onExport} className="p-2">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="p-2">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Analytics

```typescript
export const CLIENT_EVENTS = {
  LIST_VIEWED: 'clients_list_viewed',
  SEARCHED: 'clients_searched',
  FILTERED: 'clients_filtered',
  DETAIL_VIEWED: 'client_detail_viewed',
  CREATED: 'client_created',
  UPDATED: 'client_updated',
  DELETED: 'client_deleted',
  OPTED_OUT: 'client_opted_out',
  MESSAGE_SENT: 'client_message_sent',
  VISIT_REGISTERED: 'client_visit_registered'
};
```

---

## Success Criteria

**Gestão de Clientes é bem-sucedida se:**
1. ✅ Busca retorna resultados em <500ms
2. ✅ Lista carrega 20 clientes em <1s
3. ✅ Filtros atualizam instantaneamente
4. ✅ Formulário valida em tempo real
5. ✅ Status visual claro (cores e badges)
6. ✅ Scroll infinito funciona suavemente
7. ✅ Ações (opt-out, delete) com confirmação

**Métricas de Uso:**
- Busca usada em >50% das sessões
- Taxa de completude de formulários: >90%
- Tempo médio na tela de detalhes: >1 minuto
- Ações manuais (enviar mensagem): >5% dos clientes

---

**FIM DO PRP-03: GESTÃO DE CLIENTES**
