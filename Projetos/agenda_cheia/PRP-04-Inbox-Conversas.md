# PRP-04: Inbox e Conversas
## Agenda Cheia - Visualização e Gestão de Conversas WhatsApp

> **Módulo:** Conversas
> **Complexidade:** Alta
> **Prioridade:** P0 (MVP Critical)
> **Estimativa:** 4 dias

---

## Objetivo

Criar interface de inbox estilo WhatsApp que permite ao dono do salão visualizar todas as conversas entre a IA (Júlia) e os clientes, com possibilidade de intervir manualmente quando necessário ("takeover mode").

---

## Princípios de Design

1. **WhatsApp-Like:** UI familiar (bolhas de mensagem, timestamps)
2. **Real-time:** Updates instantâneos via WebSocket
3. **Read/Unread:** Indicadores visuais claros
4. **Intervention-Ready:** Fácil assumir controle do bot
5. **Context-Rich:** Histórico completo sempre visível

---

## Tela 1: Lista de Conversas (Inbox)

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Conversas               [🔍] [⋮]    │  ← Header: Voltar, Buscar, Menu
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┐ ┌──────────────┐ │  ← Filtros
│  │ [Todas (45)]     │ │ [Não Lidas]  │ │
│  └──────────────────┘ └──────────────┘ │
│  ┌──────────────────┐ ┌──────────────┐ │
│  │ [Agendadas]      │ │ [Aguardando] │ │
│  └──────────────────┘ └──────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 Maria Silva      Hoje 14:32  │   │  ← Card: Não lida
│  │ Quer agendar sexta 15h          │   │  ← Última mensagem
│  │ 🤖 Aguardando confirmação       │   │  ← Status
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  João Santos      Hoje 10:21  │   │  ← Card: Lida
│  │ ✅ Agendado: Sábado 10h         │   │
│  │ 🤖 Conversa concluída           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  Ana Costa        Ontem 16:40 │   │
│  │ Não quero mais                  │   │
│  │ 🚫 Optou por sair               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ●  Paula Souza      03/01 11:15 │   │
│  │ 👤 Você: Ok, confirmado!        │   │  ← Mensagem manual
│  │ ✅ Agendado: Quinta 14h         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Carregar mais...]                     │
│                                         │
└─────────────────────────────────────────┘
│  [🏠] [💬] [👥] [⚙️]                    │  ← Bottom Nav
└─────────────────────────────────────────┘
```

### Especificações Técnicas

**Componente:** `ConversationsListScreen.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

type ConversationStatus =
  | 'active'           // Bot conversando
  | 'waiting_response' // Aguardando resposta do cliente
  | 'waiting_human'    // Aguardando confirmação humana (Lazy Sync)
  | 'scheduled'        // Agendamento confirmado
  | 'opted_out'        // Cliente saiu
  | 'manual'           // Dono assumiu controle
  | 'completed';       // Conversa finalizada

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  lastMessage: {
    content: string;
    fromBot: boolean;
    sentAt: Date;
  };
  status: ConversationStatus;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

type FilterType = 'all' | 'unread' | 'scheduled' | 'waiting';

export function ConversationsListScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket para updates em tempo real
  const { lastMessage } = useWebSocket('wss://api.agendacheia.com/ws');

  useEffect(() => {
    fetchConversations();
  }, [activeFilter]);

  useEffect(() => {
    if (lastMessage) {
      handleRealtimeUpdate(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  async function fetchConversations() {
    setIsLoading(true);

    const params = new URLSearchParams({
      filter: activeFilter,
      search: searchQuery
    });

    const response = await fetch(`/api/v1/conversations?${params}`);
    const data = await response.json();

    setConversations(data.conversations);
    setIsLoading(false);
  }

  function handleRealtimeUpdate(event: any) {
    switch (event.type) {
      case 'new_message':
        // Atualizar conversa existente ou adicionar nova
        setConversations(prev => {
          const existing = prev.find(c => c.id === event.conversationId);

          if (existing) {
            return prev.map(c =>
              c.id === event.conversationId
                ? {
                    ...c,
                    lastMessage: event.message,
                    unreadCount: c.unreadCount + 1,
                    updatedAt: new Date()
                  }
                : c
            ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          } else {
            return [event.conversation, ...prev];
          }
        });
        break;

      case 'conversation_status_changed':
        setConversations(prev => prev.map(c =>
          c.id === event.conversationId
            ? { ...c, status: event.status }
            : c
        ));
        break;
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery) {
      return conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conv.customerPhone.includes(searchQuery);
    }
    return true;
  });

  const unreadCount = conversations.filter(c => c.unreadCount > 0).length;
  const scheduledCount = conversations.filter(c => c.status === 'scheduled').length;
  const waitingCount = conversations.filter(c => c.status === 'waiting_human').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
            Conversas
          </h1>
          <div className="flex gap-2">
            <button onClick={() => {/* Abrir busca */}}>
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            <button onClick={() => {/* Menu */}}>
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search (se ativa) */}
        {searchQuery !== null && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversa..."
              autoFocus
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          <FilterButton
            active={activeFilter === 'all'}
            label={`Todas (${conversations.length})`}
            onClick={() => setActiveFilter('all')}
          />
          <FilterButton
            active={activeFilter === 'unread'}
            label={`Não Lidas`}
            badge={unreadCount}
            onClick={() => setActiveFilter('unread')}
          />
          <FilterButton
            active={activeFilter === 'scheduled'}
            label={`Agendadas`}
            badge={scheduledCount}
            onClick={() => setActiveFilter('scheduled')}
          />
          <FilterButton
            active={activeFilter === 'waiting'}
            label={`Aguardando`}
            badge={waitingCount}
            onClick={() => setActiveFilter('waiting')}
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <EmptyInboxState searchQuery={searchQuery} />
        ) : (
          filteredConversations.map(conversation => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onClick={() => window.location.href = `/conversations/${conversation.id}`}
            />
          ))
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="conversations" onNavigate={(page) => window.location.href = `/${page}`} />
    </div>
  );
}

// Componente auxiliar
function FilterButton({
  active,
  label,
  badge,
  onClick
}: {
  active: boolean;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-purple-700' : 'bg-purple-600 text-white'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
```

---

### Card de Conversa

```tsx
interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

export function ConversationCard({ conversation, onClick }: ConversationCardProps) {
  const statusConfig = getConversationStatusConfig(conversation.status);
  const isUnread = conversation.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-4 hover:bg-gray-50 transition text-left ${
        isUnread ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar/Indicador */}
        <div className="flex-shrink-0 pt-1">
          {isUnread ? (
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          ) : (
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Nome e Timestamp */}
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold truncate ${
              isUnread ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {conversation.customerName}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTimestamp(conversation.lastMessage.sentAt)}
            </span>
          </div>

          {/* Última mensagem */}
          <p className={`text-sm truncate mb-1 ${
            isUnread ? 'text-gray-700 font-medium' : 'text-gray-600'
          }`}>
            {conversation.lastMessage.fromBot ? (
              <>🤖 {conversation.lastMessage.content}</>
            ) : (
              <>👤 {conversation.lastMessage.content}</>
            )}
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${statusConfig.color}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </span>

            {isUnread && conversation.unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function getConversationStatusConfig(status: ConversationStatus) {
  const configs = {
    active: {
      icon: '🤖',
      label: 'Conversando',
      color: 'text-blue-600'
    },
    waiting_response: {
      icon: '⏳',
      label: 'Aguardando resposta',
      color: 'text-yellow-600'
    },
    waiting_human: {
      icon: '🔔',
      label: 'Aguardando confirmação',
      color: 'text-orange-600'
    },
    scheduled: {
      icon: '✅',
      label: 'Agendado',
      color: 'text-green-600'
    },
    opted_out: {
      icon: '🚫',
      label: 'Optou por sair',
      color: 'text-gray-600'
    },
    manual: {
      icon: '👤',
      label: 'Modo manual',
      color: 'text-purple-600'
    },
    completed: {
      icon: '✅',
      label: 'Concluída',
      color: 'text-gray-600'
    }
  };

  return configs[status] || configs.active;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()];

  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
}
```

---

## Tela 2: Thread de Conversa

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Maria Silva             [👤] [⋮]    │  ← Header: Voltar, Nome, Perfil, Menu
│  🟢 Online                              │  ← Status (se disponível)
├─────────────────────────────────────────┤
│                                         │
│  ──── Hoje às 14:30 ────               │  ← Timestamp separador
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Oi Maria! A Carol comentou que  │   │  ← Mensagem do Bot (esquerda)
│  │ sua unha vence essa semana.     │   │
│  │ Quer agendar? 💅                │   │
│  │                         14:30 ✓ │   │  ← Timestamp + Status
│  └─────────────────────────────────┘   │
│     🤖                                  │  ← Indicador de bot
│                                         │
│                  ┌──────────────────┐   │
│                  │ Oi! Quero sim    │   │  ← Mensagem do Cliente (direita)
│                  │                  │   │
│              ✓ 14:32                 │   │
│                  └──────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Perfeito! Vou confirmar com a   │   │
│  │ Carol e te aviso já já          │   │
│  │                         14:32 ✓ │   │
│  └─────────────────────────────────┘   │
│     🤖                                  │
│                                         │
│  ⏸ Bot Pausado - Aguardando            │  ← Status Bar (se esperando confirmação)
│     confirmação da recepcionista        │
│                                         │
│  ┌───────────────────────────────┐     │
│  │ [ ▶ Assumir Controle ]        │     │  ← Botão de Takeover
│  └───────────────────────────────┘     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Confirmado! Sexta 15h com a     │   │  ← Mensagem automática pós-confirmação
│  │ Carol. Te espero! 😊            │   │
│  │                         14:35 ✓ │   │
│  └─────────────────────────────────┘   │
│     🤖                                  │
│                                         │
│                  ┌──────────────────┐   │
│                  │ Obrigada! ❤️     │   │
│                  │                  │   │
│              ✓✓ 14:36 (Lida)        │   │  ← Double check (lida)
│                  └──────────────────┘   │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
│  💬 [Digite uma mensagem...]      [📎] │  ← Input (só se modo manual)
└─────────────────────────────────────────┘
```

### Especificações Técnicas

**Componente:** `ConversationThreadScreen.tsx`

```tsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Message {
  id: string;
  conversationId: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  metadata?: {
    intent?: string;
    entities?: any;
    tokensUsed?: number;
  };
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

export function ConversationThreadScreen() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isManualMode, setIsManualMode] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lastMessage } = useWebSocket('wss://api.agendacheia.com/ws');

  useEffect(() => {
    fetchConversation();
    markAsRead();
  }, [conversationId]);

  useEffect(() => {
    if (lastMessage) {
      const event = JSON.parse(lastMessage.data);

      if (event.type === 'new_message' && event.conversationId === conversationId) {
        setMessages(prev => [...prev, event.message]);
        scrollToBottom();
        markAsRead();
      }
    }
  }, [lastMessage]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchConversation() {
    const response = await fetch(`/api/v1/conversations/${conversationId}`);
    const data = await response.json();

    setConversation(data.conversation);
    setMessages(data.messages);
    setIsManualMode(data.conversation.status === 'manual');
  }

  async function markAsRead() {
    await fetch(`/api/v1/conversations/${conversationId}/read`, {
      method: 'POST'
    });
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleTakeover() {
    const confirmed = confirm(
      'Assumir controle da conversa?\n\n' +
      'O bot será pausado e você poderá responder manualmente.'
    );

    if (confirmed) {
      await fetch(`/api/v1/conversations/${conversationId}/takeover`, {
        method: 'POST'
      });

      setIsManualMode(true);
      setConversation(prev => prev ? { ...prev, status: 'manual' } : null);
    }
  }

  async function handleResumeBot() {
    const confirmed = confirm(
      'Retomar bot automático?\n\n' +
      'A IA voltará a responder automaticamente.'
    );

    if (confirmed) {
      await fetch(`/api/v1/conversations/${conversationId}/resume-bot`, {
        method: 'POST'
      });

      setIsManualMode(false);
      setConversation(prev => prev ? { ...prev, status: 'active' } : null);
    }
  }

  async function handleSendMessage() {
    if (!messageInput.trim() || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageInput,
          role: 'user' // Mensagem do dono, não do bot
        })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
      }
    } finally {
      setIsSending(false);
    }
  }

  if (!conversation) {
    return <ConversationSkeleton />;
  }

  const statusConfig = getConversationStatusConfig(conversation.status);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-900">
              {conversation.customerName}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `/clients/${conversation.customerId}`}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Status */}
        <p className={`text-center text-sm font-semibold ${statusConfig.color}`}>
          {statusConfig.icon} {statusConfig.label}
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Agrupar mensagens por data */}
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {formatDateSeparator(new Date(date))}
              </div>
            </div>

            {/* Messages */}
            {msgs.map((message, idx) => (
              <MessageBubble
                key={message.id}
                message={message}
                showTimestamp={
                  idx === 0 ||
                  Math.abs(message.sentAt.getTime() - msgs[idx - 1].sentAt.getTime()) > 300000 // 5 min
                }
              />
            ))}
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Status Bar (se aguardando confirmação) */}
      {conversation.status === 'waiting_human' && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800 flex-1">
              ⏸ Bot pausado - Aguardando sua confirmação
            </p>
            <button
              onClick={() => window.location.href = '/confirmations'}
              className="text-yellow-800 font-semibold text-sm underline"
            >
              Ver →
            </button>
          </div>
        </div>
      )}

      {/* Takeover Button (se bot ativo) */}
      {!isManualMode && conversation.status !== 'completed' && conversation.status !== 'opted_out' && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
          <button
            onClick={handleTakeover}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Assumir Controle
          </button>
        </div>
      )}

      {/* Input (se modo manual) */}
      {isManualMode && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
          {/* Resume Bot Button */}
          <button
            onClick={handleResumeBot}
            className="w-full mb-3 text-purple-600 font-semibold text-sm"
          >
            ← Retomar Bot Automático
          </button>

          {/* Message Input */}
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSending}
              className={`p-3 rounded-full flex-shrink-0 ${
                messageInput.trim() && !isSending
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {isSending ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de bolha de mensagem
function MessageBubble({
  message,
  showTimestamp
}: {
  message: Message;
  showTimestamp: boolean;
}) {
  const isFromBot = message.role === 'assistant';
  const isSystem = message.role === 'system';

  // Mensagens de sistema (ex: "Bot pausado", "Agendamento confirmado")
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg max-w-xs text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isFromBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`max-w-[75%] ${isFromBot ? 'mr-auto' : 'ml-auto'}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isFromBot
              ? 'bg-white border border-gray-200 rounded-tl-none'
              : 'bg-purple-600 text-white rounded-tr-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Timestamp */}
          <div className={`flex items-center justify-end gap-1 mt-1 ${
            isFromBot ? 'text-gray-500' : 'text-purple-100'
          }`}>
            <span className="text-xs">
              {new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(message.sentAt)}
            </span>

            {/* Read status (só para mensagens do bot) */}
            {!isFromBot && (
              <>
                {message.readAt ? (
                  <CheckCheck className="w-4 h-4 text-blue-300" />
                ) : message.deliveredAt ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Bot Indicator */}
        {isFromBot && (
          <div className="flex items-center gap-1 mt-1 ml-2">
            <span className="text-xs text-gray-500">🤖 Júlia</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  return messages.reduce((groups, message) => {
    const date = message.sentAt.toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);
}

function formatDateSeparator(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  } else {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
```

---

## Tela 3: Nova Mensagem Manual

### Wireframe

```
┌─────────────────────────────────────────┐
│  ←  Nova Mensagem               [Enviar]│  ← Header
├─────────────────────────────────────────┤
│                                         │
│  Para:                                  │
│  ┌───────────────────────────────┐     │
│  │ 🔍 Buscar cliente...          │     │  ← Autocomplete
│  └───────────────────────────────┘     │
│                                         │
│  Selecionados:                          │
│  ┌───────────────────────────────┐     │
│  │ Maria Silva     [×]           │     │  ← Chip removível
│  │ João Santos     [×]           │     │
│  └───────────────────────────────┘     │
│                                         │
│  Mensagem:                              │
│  ┌───────────────────────────────┐     │
│  │ Oi! Temos uma promoção        │     │  ← Textarea
│  │ especial essa semana...       │     │
│  │                               │     │
│  │                               │     │
│  │                               │     │
│  └───────────────────────────────┘     │
│  0/1000 caracteres                      │
│                                         │
│  📋 Templates Rápidos:                  │
│  ┌───────────────────────────────┐     │
│  │ Promoção da Semana            │     │
│  └───────────────────────────────┘     │
│  ┌───────────────────────────────┐     │
│  │ Lembrete de Manutenção        │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   Enviar Mensagem   →         │     │
│  └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Especificações Técnicas

```tsx
import { useState } from 'react';
import { Autocomplete } from '@/components/Autocomplete';

interface Template {
  id: string;
  name: string;
  content: string;
}

const MESSAGE_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Promoção da Semana',
    content: 'Oi! Essa semana temos uma promoção especial: [DESCREVA AQUI]. Quer aproveitar?'
  },
  {
    id: '2',
    name: 'Lembrete de Manutenção',
    content: 'Oi! Faz um tempinho que você não aparece aqui. Tá na hora de fazer sua manutenção! Quer agendar?'
  }
];

export function NewMessageScreen() {
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (selectedClients.length === 0 || !message.trim()) return;

    setIsSending(true);

    try {
      await fetch('/api/v1/messages/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientIds: selectedClients.map(c => c.id),
          message
        })
      });

      showSuccessToast(`Mensagem enviada para ${selectedClients.length} cliente(s)!`);
      window.history.back();
    } catch (error) {
      showErrorToast('Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
            Nova Mensagem
          </h1>
          <button
            onClick={handleSend}
            disabled={selectedClients.length === 0 || !message.trim() || isSending}
            className={`font-semibold ${
              selectedClients.length > 0 && message.trim() && !isSending
                ? 'text-purple-600'
                : 'text-gray-400'
            }`}
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 space-y-6">
        {/* Para */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para:
          </label>
          <Autocomplete
            placeholder="Buscar cliente..."
            onSelect={(client) => {
              if (!selectedClients.find(c => c.id === client.id)) {
                setSelectedClients(prev => [...prev, client]);
              }
            }}
            fetchSuggestions={async (query) => {
              const response = await fetch(`/api/v1/clients/search?q=${query}`);
              return response.json();
            }}
          />

          {/* Chips de selecionados */}
          {selectedClients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedClients.map(client => (
                <div
                  key={client.id}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  <span>{client.name}</span>
                  <button
                    onClick={() => setSelectedClients(prev => prev.filter(c => c.id !== client.id))}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mensagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            maxLength={1000}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {message.length}/1000 caracteres
          </p>
        </div>

        {/* Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📋 Templates Rápidos:
          </label>
          <div className="space-y-2">
            {MESSAGE_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => setMessage(template.content)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-left hover:border-purple-400 transition"
              >
                <p className="font-semibold text-gray-900">{template.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Botão Enviar */}
        <button
          onClick={handleSend}
          disabled={selectedClients.length === 0 || !message.trim() || isSending}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
            selectedClients.length > 0 && message.trim() && !isSending
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSending ? 'Enviando...' : `Enviar Mensagem →`}
        </button>
      </div>
    </div>
  );
}
```

---

## Estados Especiais

### Empty Inbox

```tsx
export function EmptyInboxState({ searchQuery }: { searchQuery: string }) {
  if (searchQuery) {
    return (
      <div className="text-center py-16 px-4">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma conversa encontrada
        </h3>
        <p className="text-gray-600">
          Não encontramos conversas com "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhuma conversa ainda
      </h3>
      <p className="text-gray-600 mb-6">
        As conversas com seus clientes aparecerão aqui
      </p>
      <button
        onClick={() => window.location.href = '/messages/new'}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Enviar Primeira Mensagem
      </button>
    </div>
  );
}
```

---

## WebSocket Integration

```typescript
// hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url, {
      auth: {
        token: localStorage.getItem('auth_token')
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    newSocket.on('message', (data) => {
      setLastMessage({ data: JSON.stringify(data) });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket, lastMessage, isConnected };
}
```

---

## Notificações Push

```typescript
// Push notification quando nova mensagem chega (app em background)
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

export function showNewMessageNotification(customerName: string, message: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Nova mensagem de ${customerName}`, {
      body: message,
      icon: '/logo-192.png',
      badge: '/logo-72.png',
      tag: 'new-message',
      requireInteraction: false
    });
  }
}
```

---

## Analytics

```typescript
export const CONVERSATION_EVENTS = {
  INBOX_VIEWED: 'conversations_inbox_viewed',
  THREAD_OPENED: 'conversation_thread_opened',
  TAKEOVER_ACTIVATED: 'conversation_takeover_activated',
  BOT_RESUMED: 'conversation_bot_resumed',
  MANUAL_MESSAGE_SENT: 'conversation_manual_message_sent',
  BROADCAST_SENT: 'message_broadcast_sent'
};
```

---

## Success Criteria

**Inbox e Conversas é bem-sucedido se:**
1. ✅ Updates em tempo real (WebSocket) funcionam
2. ✅ Mensagens carregam em <1 segundo
3. ✅ Scroll suave e automático para última mensagem
4. ✅ Takeover mode funciona sem bugs
5. ✅ Indicadores de lida/entregue corretos
6. ✅ Notificações push aparecem
7. ✅ Busca retorna resultados em <500ms

**Métricas de Engajamento:**
- Taxa de takeover: <10% (bot resolve maioria)
- Tempo médio de resposta manual: <5 min
- Taxa de leitura de mensagens: >90%
- Satisfação com interface: >4.5/5

---

**FIM DO PRP-04: INBOX E CONVERSAS**
