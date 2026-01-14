# PRP-05: Confirmações (Lazy Sync)

**Produto**: Agenda Cheia - Growth Layer para Salões de Beleza
**Módulo**: Sistema de Confirmação Humana (Lazy Sync)
**Data**: Janeiro 2025
**Versão**: 1.0

---

## 1. Objetivo

Criar uma interface intuitiva e rápida para que profissionais de salão aprovem ou rejeitem agendamentos negociados pelo bot de WhatsApp, usando o conceito de **Lazy Sync** - confirmação assíncrona com respostas via emoji que não bloqueia a operação do negócio.

### Princípios de Design

1. **Simplicidade Absoluta**: Apenas 👍 ou 👎 - nada mais
2. **Mobile-First**: Decisões tomadas em segundos no celular
3. **Não-bloqueante**: Timeouts inteligentes evitam perda de clientes
4. **Contextual**: Todas as informações necessárias em um card
5. **Gamificado**: Feedback positivo ao confirmar agendamentos

---

## 2. Wireframes

### 2.1 Tela Principal - Centro de Confirmações

```
┌─────────────────────────────────────┐
│  ← Confirmações            [🔔 3]  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🔔  3 Pendentes              │ │
│  │  Responda em até 30min        │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🙋‍♀️ Maria Silva               │ │
│  │ Manicure • Qua 10/Jan às 14h  │ │
│  │                               │ │
│  │ "Quarta à tarde tá ótimo!"    │ │
│  │                               │ │
│  │ ⏰ Expira em 24min            │ │
│  │                               │ │
│  │   👍 Confirmar    👎 Recusar  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 👨 João Santos                │ │
│  │ Cabelo + Barba • Qui às 16h   │ │
│  │                               │ │
│  │ "Só consigo quinta mesmo"     │ │
│  │                               │ │
│  │ ⏰ Expira em 18min            │ │
│  │                               │ │
│  │   👍 Confirmar    👎 Recusar  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 💇‍♀️ Ana Costa                 │ │
│  │ Progressiva • Sex às 10h      │ │
│  │                               │ │
│  │ "Prefiro de manhã cedo"       │ │
│  │                               │ │
│  │ ⏰ Expira em 12min            │ │
│  │                               │ │
│  │   👍 Confirmar    👎 Recusar  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📜 Histórico (Ver todas)           │
│                                     │
├─────────────────────────────────────┤
│  [📊] [👥] [💬] [⚙️]               │
└─────────────────────────────────────┘
```

### 2.2 Modal de Confirmação

```
┌─────────────────────────────────────┐
│                                     │
│        ✅ Confirmar Agendamento?    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  👤 Maria Silva               │ │
│  │  📞 (11) 98765-4321           │ │
│  │                               │ │
│  │  💅 Manicure                  │ │
│  │  📅 Qua, 10 Jan às 14:00      │ │
│  │  ⏱️  Duração: ~45min          │ │
│  │                               │ │
│  │  💬 Última mensagem:          │ │
│  │  "Quarta à tarde tá ótimo!"   │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ⚠️ O cliente receberá confirmação  │
│     automática no WhatsApp          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ✅ Sim, Confirmar          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ❌ Cancelar                │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 2.3 Modal de Recusa com Motivo

```
┌─────────────────────────────────────┐
│                                     │
│        ❌ Recusar Agendamento       │
│                                     │
│  Por que não pode atender?          │
│                                     │
│  ○ Horário já preenchido            │
│  ○ Profissional de folga            │
│  ○ Serviço não disponível           │
│  ○ Outro motivo                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ O bot vai sugerir novos       │ │
│  │ horários automaticamente      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Recusar e Contra-propor    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Cancelar                   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 2.4 Histórico de Confirmações

```
┌─────────────────────────────────────┐
│  ← Histórico de Confirmações        │
├─────────────────────────────────────┤
│                                     │
│  📅 Hoje                            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ✅ 14:32                      │ │
│  │ Maria Silva • Manicure        │ │
│  │ Confirmado para Qua 14h       │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ❌ 11:15                      │ │
│  │ Pedro Costa • Corte           │ │
│  │ Recusado - Horário ocupado    │ │
│  │ Bot sugeriu Sex 16h           │ │
│  └───────────────────────────────┘ │
│                                     │
│  📅 Ontem                           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⏰ Expirou                    │ │
│  │ Ana Souza • Escova            │ │
│  │ Auto-confirmado (timeout)     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ✅ 16:45                      │ │
│  │ Carlos Lima • Barba           │ │
│  │ Confirmado para Qui 10h       │ │
│  └───────────────────────────────┘ │
│                                     │
│         [Carregar mais...]          │
│                                     │
├─────────────────────────────────────┤
│  [📊] [👥] [💬] [⚙️]               │
└─────────────────────────────────────┘
```

### 2.5 Push Notification

```
┌─────────────────────────────────────┐
│  🔔 Agenda Cheia                    │
├─────────────────────────────────────┤
│                                     │
│  Nova confirmação pendente          │
│                                     │
│  Maria Silva quer agendar Manicure  │
│  para Qua 10/Jan às 14h             │
│                                     │
│  👍 Confirmar     👎 Recusar        │
│                                     │
└─────────────────────────────────────┘
```

### 2.6 Estado Vazio

```
┌─────────────────────────────────────┐
│  ← Confirmações                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          🎉                         │
│                                     │
│     Tudo Confirmado!                │
│                                     │
│  Nenhuma confirmação pendente       │
│  no momento.                        │
│                                     │
│  Você está em dia! 💜               │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Ver Histórico              │   │
│  └─────────────────────────────┘   │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [📊] [👥] [💬] [⚙️]               │
└─────────────────────────────────────┘
```

---

## 3. Especificações Técnicas

### 3.1 Tipos TypeScript

```typescript
// types/confirmations.ts

export type ConfirmationStatus =
  | 'pending'           // Aguardando decisão
  | 'confirmed'         // Aprovado pelo profissional
  | 'rejected'          // Recusado pelo profissional
  | 'expired_auto_confirmed'  // Timeout → auto-confirmado
  | 'expired_rejected'  // Timeout → auto-recusado (configurável)

export type RejectionReason =
  | 'slot_filled'       // Horário já preenchido
  | 'professional_off'  // Profissional de folga
  | 'service_unavailable' // Serviço não disponível
  | 'other'             // Outro motivo

export interface ConfirmationRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  proposedDateTime: Date;
  estimatedDuration: number; // minutos
  lastClientMessage: string;
  conversationId: string;

  status: ConfirmationStatus;
  createdAt: Date;
  expiresAt: Date; // createdAt + 30min
  respondedAt?: Date;
  respondedBy?: string; // userId

  rejectionReason?: RejectionReason;
  rejectionNote?: string;
}

export interface ConfirmationStats {
  pending: number;
  confirmedToday: number;
  rejectedToday: number;
  expiredToday: number;
  avgResponseTime: number; // segundos
}
```

### 3.2 Componente Principal - Lista de Confirmações

```tsx
// src/screens/ConfirmationsScreen.tsx

import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import useWebSocket from 'react-use-websocket';
import { ConfirmationRequest, ConfirmationStats } from '../types/confirmations';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { RejectionModal } from '../components/RejectionModal';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ConfirmationsScreen() {
  const [confirmations, setConfirmations] = useState<ConfirmationRequest[]>([]);
  const [stats, setStats] = useState<ConfirmationStats | null>(null);
  const [selectedConfirmation, setSelectedConfirmation] = useState<ConfirmationRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // WebSocket para atualizações em tempo real
  const { lastMessage } = useWebSocket('wss://api.agendacheia.com/ws', {
    shouldReconnect: () => true,
  });

  // Buscar confirmações pendentes
  useEffect(() => {
    fetchConfirmations();
    fetchStats();
  }, []);

  // Processar mensagens WebSocket
  useEffect(() => {
    if (lastMessage) {
      handleRealtimeUpdate(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  async function fetchConfirmations() {
    try {
      const response = await fetch('/api/v1/confirmations?status=pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setConfirmations(data.confirmations);
    } catch (error) {
      console.error('Error fetching confirmations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/v1/confirmations/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  function handleRealtimeUpdate(event: any) {
    switch (event.type) {
      case 'new_confirmation_request':
        setConfirmations(prev => [event.confirmation, ...prev]);
        setStats(prev => prev ? { ...prev, pending: prev.pending + 1 } : null);

        // Mostrar notificação
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nova confirmação pendente', {
            body: `${event.confirmation.clientName} quer agendar ${event.confirmation.serviceType}`,
            icon: '/logo.png',
            tag: event.confirmation.id,
          });
        }
        break;

      case 'confirmation_expired':
        setConfirmations(prev => prev.filter(c => c.id !== event.confirmationId));
        setStats(prev => prev ? {
          ...prev,
          pending: prev.pending - 1,
          expiredToday: prev.expiredToday + 1
        } : null);
        break;
    }
  }

  function handleConfirmClick(confirmation: ConfirmationRequest) {
    setSelectedConfirmation(confirmation);
    setShowConfirmModal(true);
  }

  function handleRejectClick(confirmation: ConfirmationRequest) {
    setSelectedConfirmation(confirmation);
    setShowRejectModal(true);
  }

  async function confirmAppointment(confirmationId: string) {
    try {
      const response = await fetch(`/api/v1/confirmations/${confirmationId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remover da lista
        setConfirmations(prev => prev.filter(c => c.id !== confirmationId));
        setStats(prev => prev ? {
          ...prev,
          pending: prev.pending - 1,
          confirmedToday: prev.confirmedToday + 1
        } : null);

        // Feedback visual
        showSuccessToast('✅ Agendamento confirmado! Cliente será notificado.');

        // Confete se for o primeiro do dia
        if (stats?.confirmedToday === 0) {
          triggerConfetti();
        }
      }
    } catch (error) {
      console.error('Error confirming:', error);
      showErrorToast('Erro ao confirmar. Tente novamente.');
    } finally {
      setShowConfirmModal(false);
      setSelectedConfirmation(null);
    }
  }

  async function rejectAppointment(
    confirmationId: string,
    reason: RejectionReason,
    note?: string
  ) {
    try {
      const response = await fetch(`/api/v1/confirmations/${confirmationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason, note })
      });

      if (response.ok) {
        setConfirmations(prev => prev.filter(c => c.id !== confirmationId));
        setStats(prev => prev ? {
          ...prev,
          pending: prev.pending - 1,
          rejectedToday: prev.rejectedToday + 1
        } : null);

        showSuccessToast('Recusado. Bot vai sugerir novos horários.');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      showErrorToast('Erro ao recusar. Tente novamente.');
    } finally {
      setShowRejectModal(false);
      setSelectedConfirmation(null);
    }
  }

  if (loading) {
    return <ConfirmationsLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Confirmações</h1>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {stats?.pending || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      {stats && stats.pending > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 m-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {stats.pending} {stats.pending === 1 ? 'Pendente' : 'Pendentes'}
              </p>
              <p className="text-sm text-gray-600">Responda em até 30min para não perder</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Confirmações */}
      <div className="px-4 space-y-3">
        {confirmations.length === 0 ? (
          <EmptyState onViewHistory={() => {/* Navigate to history */}} />
        ) : (
          confirmations.map(confirmation => (
            <ConfirmationCard
              key={confirmation.id}
              confirmation={confirmation}
              onConfirm={() => handleConfirmClick(confirmation)}
              onReject={() => handleRejectClick(confirmation)}
            />
          ))
        )}
      </div>

      {/* Link para Histórico */}
      {confirmations.length > 0 && (
        <div className="mt-8 px-4">
          <button
            className="w-full text-center text-purple-600 font-semibold py-3"
            onClick={() => {/* Navigate to history */}}
          >
            📜 Ver Histórico
          </button>
        </div>
      )}

      {/* Modais */}
      {showConfirmModal && selectedConfirmation && (
        <ConfirmationModal
          confirmation={selectedConfirmation}
          onConfirm={() => confirmAppointment(selectedConfirmation.id)}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedConfirmation(null);
          }}
        />
      )}

      {showRejectModal && selectedConfirmation && (
        <RejectionModal
          confirmation={selectedConfirmation}
          onReject={(reason, note) => rejectAppointment(selectedConfirmation.id, reason, note)}
          onCancel={() => {
            setShowRejectModal(false);
            setSelectedConfirmation(null);
          }}
        />
      )}
    </div>
  );
}
```

### 3.3 Componente - Card de Confirmação

```tsx
// src/components/ConfirmationCard.tsx

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MessageCircle } from 'lucide-react';
import { ConfirmationRequest } from '../types/confirmations';
import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfirmationCardProps {
  confirmation: ConfirmationRequest;
  onConfirm: () => void;
  onReject: () => void;
}

export function ConfirmationCard({ confirmation, onConfirm, onReject }: ConfirmationCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTimeLeft = () => {
      const minutes = differenceInMinutes(confirmation.expiresAt, new Date());
      setTimeLeft(Math.max(0, minutes));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [confirmation.expiresAt]);

  const isUrgent = timeLeft <= 10;

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${
      isUrgent ? 'border-red-300 animate-pulse' : 'border-gray-100'
    }`}>
      {/* Header com nome e serviço */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
          {getServiceEmoji(confirmation.serviceType)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{confirmation.clientName}</h3>
          <p className="text-sm text-gray-600">
            {confirmation.serviceType} • {format(confirmation.proposedDateTime, "EEE dd/MMM 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Última mensagem do cliente */}
      {confirmation.lastClientMessage && (
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 italic">
              "{confirmation.lastClientMessage}"
            </p>
          </div>
        </div>
      )}

      {/* Timer de expiração */}
      <div className={`flex items-center gap-2 mb-4 ${
        isUrgent ? 'text-red-600' : 'text-orange-600'
      }`}>
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isUrgent ? '🔥 ' : ''}Expira em {timeLeft}min
        </span>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">👍</span>
          Confirmar
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">👎</span>
          Recusar
        </button>
      </div>
    </div>
  );
}

function getServiceEmoji(serviceType: string): string {
  const emojiMap: Record<string, string> = {
    'Manicure': '💅',
    'Pedicure': '🦶',
    'Cabelo': '💇‍♀️',
    'Barba': '💈',
    'Escova': '🌊',
    'Progressiva': '✨',
    'Maquiagem': '💄',
    'Sobrancelha': '👁️',
  };
  return emojiMap[serviceType] || '💜';
}
```

### 3.4 Componente - Modal de Confirmação

```tsx
// src/components/ConfirmationModal.tsx

import React from 'react';
import { X, CheckCircle, Calendar, Clock, Phone, MessageCircle } from 'lucide-react';
import { ConfirmationRequest } from '../types/confirmations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfirmationModalProps {
  confirmation: ConfirmationRequest;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ confirmation, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Confirmar Agendamento?</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Informações do Cliente */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">{confirmation.clientName}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                {confirmation.clientPhone}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getServiceEmoji(confirmation.serviceType)}</span>
              <span className="font-medium text-gray-900">{confirmation.serviceType}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium">
                {format(confirmation.proposedDateTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-medium">
                {format(confirmation.proposedDateTime, "HH:mm", { locale: ptBR })}
                {' '}• Duração: ~{confirmation.estimatedDuration}min
              </span>
            </div>
          </div>

          {confirmation.lastClientMessage && (
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Última mensagem:</p>
                  <p className="text-sm text-gray-700 italic">"{confirmation.lastClientMessage}"</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aviso */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
          <p className="text-sm text-blue-900">
            ⚠️ O cliente receberá confirmação automática no WhatsApp
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Sim, Confirmar
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function getServiceEmoji(serviceType: string): string {
  const emojiMap: Record<string, string> = {
    'Manicure': '💅',
    'Pedicure': '🦶',
    'Cabelo': '💇‍♀️',
    'Barba': '💈',
    'Escova': '🌊',
    'Progressiva': '✨',
    'Maquiagem': '💄',
    'Sobrancelha': '👁️',
  };
  return emojiMap[serviceType] || '💜';
}
```

### 3.5 Componente - Modal de Recusa

```tsx
// src/components/RejectionModal.tsx

import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import { ConfirmationRequest, RejectionReason } from '../types/confirmations';

interface RejectionModalProps {
  confirmation: ConfirmationRequest;
  onReject: (reason: RejectionReason, note?: string) => void;
  onCancel: () => void;
}

export function RejectionModal({ confirmation, onReject, onCancel }: RejectionModalProps) {
  const [selectedReason, setSelectedReason] = useState<RejectionReason | null>(null);
  const [customNote, setCustomNote] = useState('');

  const reasons: { value: RejectionReason; label: string; description: string }[] = [
    {
      value: 'slot_filled',
      label: 'Horário já preenchido',
      description: 'Esse horário já foi reservado para outro cliente'
    },
    {
      value: 'professional_off',
      label: 'Profissional de folga',
      description: 'O profissional não estará disponível nesse dia'
    },
    {
      value: 'service_unavailable',
      label: 'Serviço não disponível',
      description: 'Não oferecemos esse serviço ou está temporariamente indisponível'
    },
    {
      value: 'other',
      label: 'Outro motivo',
      description: 'Outro motivo não listado acima'
    }
  ];

  function handleSubmit() {
    if (!selectedReason) return;
    onReject(selectedReason, customNote || undefined);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Recusar Agendamento</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Subtítulo */}
        <p className="text-gray-600 mb-4">Por que não pode atender?</p>

        {/* Opções de motivo */}
        <div className="space-y-3 mb-6">
          {reasons.map(reason => (
            <label
              key={reason.value}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedReason === reason.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="rejection-reason"
                value={reason.value}
                checked={selectedReason === reason.value}
                onChange={() => setSelectedReason(reason.value)}
                className="mt-1 w-4 h-4 text-purple-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{reason.label}</p>
                <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Nota adicional (opcional) */}
        {selectedReason === 'other' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observação (opcional)
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Descreva o motivo..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Informação sobre próximos passos */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
          <p className="text-sm text-blue-900">
            💬 O bot vai sugerir novos horários automaticamente para o cliente
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Recusar e Contra-propor
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3.6 Estado Vazio

```tsx
// src/components/EmptyState.tsx

import React from 'react';
import { PartyPopper } from 'lucide-react';

interface EmptyStateProps {
  onViewHistory: () => void;
}

export function EmptyState({ onViewHistory }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl">🎉</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Tudo Confirmado!
      </h2>

      <p className="text-gray-600 text-center mb-2">
        Nenhuma confirmação pendente no momento.
      </p>

      <p className="text-purple-600 font-semibold mb-8">
        Você está em dia! 💜
      </p>

      <button
        onClick={onViewHistory}
        className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Ver Histórico
      </button>
    </div>
  );
}
```

### 3.7 Skeleton Loading

```tsx
// src/components/ConfirmationsLoadingSkeleton.tsx

import React from 'react';

export function ConfirmationsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="bg-gray-100 p-4 m-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-24 bg-gray-300 rounded mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="px-4 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-16 bg-gray-100 rounded-xl mb-3 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. API Backend

### 4.1 Endpoints

```typescript
// Backend API Endpoints

// Listar confirmações
GET /api/v1/confirmations
Query params:
  - status?: 'pending' | 'confirmed' | 'rejected' | 'expired_auto_confirmed'
  - page?: number
  - limit?: number
Response: {
  confirmations: ConfirmationRequest[]
  total: number
  page: number
}

// Estatísticas
GET /api/v1/confirmations/stats
Response: {
  pending: number
  confirmedToday: number
  rejectedToday: number
  expiredToday: number
  avgResponseTime: number
}

// Confirmar agendamento
POST /api/v1/confirmations/:id/confirm
Response: {
  success: boolean
  appointmentId: string
  conversationUpdated: boolean
}

// Recusar agendamento
POST /api/v1/confirmations/:id/reject
Body: {
  reason: RejectionReason
  note?: string
}
Response: {
  success: boolean
  conversationUpdated: boolean
  suggestedAlternatives: Date[]
}

// Histórico
GET /api/v1/confirmations/history
Query params:
  - startDate?: ISO string
  - endDate?: ISO string
  - page?: number
Response: {
  history: ConfirmationRequest[]
  total: number
}
```

### 4.2 Lógica de Timeout

```typescript
// src/services/confirmation-timeout.service.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';
import { WhatsAppService } from './whatsapp.service';

@Injectable()
export class ConfirmationTimeoutService {
  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsAppService,
  ) {}

  // Rodar a cada 5 minutos
  @Cron(CronExpression.EVERY_5_MINUTES)
  async processExpiredConfirmations() {
    const now = new Date();

    // Buscar confirmações expiradas
    const expiredConfirmations = await this.prisma.confirmationRequest.findMany({
      where: {
        status: 'pending',
        expiresAt: {
          lte: now,
        },
      },
      include: {
        client: true,
        salon: true,
      },
    });

    for (const confirmation of expiredConfirmations) {
      // Estratégia: auto-confirmar se for cliente recorrente, caso contrário recusar
      const isRecurringClient = await this.isRecurringClient(
        confirmation.clientId,
        confirmation.salonId,
      );

      if (isRecurringClient) {
        // Auto-confirmar
        await this.autoConfirm(confirmation);
      } else {
        // Auto-recusar e pedir novo horário
        await this.autoReject(confirmation);
      }
    }
  }

  private async isRecurringClient(clientId: string, salonId: string): Promise<boolean> {
    const appointmentCount = await this.prisma.appointment.count({
      where: {
        clientId,
        salonId,
        status: 'completed',
      },
    });

    // Considera recorrente se teve 2+ atendimentos
    return appointmentCount >= 2;
  }

  private async autoConfirm(confirmation: any) {
    // Atualizar status
    await this.prisma.confirmationRequest.update({
      where: { id: confirmation.id },
      data: {
        status: 'expired_auto_confirmed',
        respondedAt: new Date(),
      },
    });

    // Criar agendamento
    const appointment = await this.prisma.appointment.create({
      data: {
        clientId: confirmation.clientId,
        salonId: confirmation.salonId,
        serviceType: confirmation.serviceType,
        scheduledAt: confirmation.proposedDateTime,
        status: 'scheduled',
        source: 'bot_auto_confirmed',
      },
    });

    // Notificar cliente via WhatsApp
    await this.whatsapp.sendMessage(
      confirmation.client.phone,
      `✅ Seu agendamento está confirmado!\n\n` +
      `📅 ${this.formatDateTime(confirmation.proposedDateTime)}\n` +
      `💜 ${confirmation.serviceType}\n\n` +
      `Nos vemos lá!`,
    );

    // Notificar salão
    await this.notifySalon(confirmation.salonId, {
      type: 'auto_confirmed',
      confirmationId: confirmation.id,
      client: confirmation.client.name,
    });
  }

  private async autoReject(confirmation: any) {
    await this.prisma.confirmationRequest.update({
      where: { id: confirmation.id },
      data: {
        status: 'expired_rejected',
        respondedAt: new Date(),
        rejectionReason: 'other',
        rejectionNote: 'Timeout - sem resposta em 30min',
      },
    });

    // Bot vai sugerir novos horários
    await this.whatsapp.sendMessage(
      confirmation.client.phone,
      `Ops! O horário ${this.formatDateTime(confirmation.proposedDateTime)} não está mais disponível.\n\n` +
      `Que tal um desses?\n` +
      `1️⃣ ${this.formatDateTime(this.addDays(confirmation.proposedDateTime, 1))}\n` +
      `2️⃣ ${this.formatDateTime(this.addDays(confirmation.proposedDateTime, 2))}\n\n` +
      `Qual funciona melhor pra você?`,
    );
  }

  private async notifySalon(salonId: string, event: any) {
    // WebSocket para notificação real-time
    // Implementação depende do WebSocket gateway
  }

  private formatDateTime(date: Date): string {
    return format(date, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR });
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
```

---

## 5. Push Notifications

### 5.1 Permissão e Registro

```typescript
// src/services/push-notification.service.ts

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Subscrever para push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY!),
      });

      // Enviar subscription para backend
      await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### 5.2 Service Worker

```javascript
// public/sw.js

self.addEventListener('push', function(event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: data.confirmationId,
    data: {
      url: `/confirmations`,
      confirmationId: data.confirmationId,
    },
    actions: [
      {
        action: 'confirm',
        title: '👍 Confirmar',
        icon: '/icons/confirm.png',
      },
      {
        action: 'reject',
        title: '👎 Recusar',
        icon: '/icons/reject.png',
      },
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true, // Não desaparecer automaticamente
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'confirm') {
    // Confirmar via background fetch
    event.waitUntil(
      fetch(`/api/v1/confirmations/${event.notification.data.confirmationId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getStoredToken()}`,
        },
      })
    );
  } else if (event.action === 'reject') {
    // Abrir app para escolher motivo
    event.waitUntil(
      clients.openWindow(`/confirmations?reject=${event.notification.data.confirmationId}`)
    );
  } else {
    // Abrir lista de confirmações
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

function getStoredToken() {
  // Implementar recuperação de token do IndexedDB
  // (localStorage não está disponível em service worker)
  return '';
}
```

---

## 6. Analytics e Métricas

### 6.1 Eventos de Tracking

```typescript
// src/analytics/confirmation-events.ts

export const ConfirmationEvents = {
  // Visualizações
  VIEW_CONFIRMATIONS_LIST: 'view_confirmations_list',
  VIEW_CONFIRMATION_DETAIL: 'view_confirmation_detail',
  VIEW_EMPTY_STATE: 'view_confirmations_empty',

  // Ações
  CONFIRM_APPOINTMENT: 'confirm_appointment',
  REJECT_APPOINTMENT: 'reject_appointment',

  // Resultados
  CONFIRMATION_EXPIRED: 'confirmation_expired',
  AUTO_CONFIRMED: 'confirmation_auto_confirmed',
  AUTO_REJECTED: 'confirmation_auto_rejected',

  // Performance
  RESPONSE_TIME: 'confirmation_response_time',
} as const;

// Tracking de resposta
export function trackConfirmationResponse(
  confirmationId: string,
  action: 'confirmed' | 'rejected',
  responseTimeSeconds: number
) {
  // Google Analytics 4
  gtag('event', ConfirmationEvents.CONFIRM_APPOINTMENT, {
    confirmation_id: confirmationId,
    action,
    response_time: responseTimeSeconds,
  });

  // Mixpanel
  mixpanel.track(ConfirmationEvents.CONFIRM_APPOINTMENT, {
    confirmationId,
    action,
    responseTime: responseTimeSeconds,
    fast_response: responseTimeSeconds < 300, // < 5min
  });

  // Backend analytics
  fetch('/api/v1/analytics/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: ConfirmationEvents.RESPONSE_TIME,
      properties: {
        confirmationId,
        action,
        responseTimeSeconds,
      },
    }),
  });
}
```

---

## 7. Critérios de Sucesso

### 7.1 Métricas de Performance

- **Taxa de Resposta**: >90% das confirmações respondidas antes do timeout
- **Tempo Médio de Resposta**: <10 minutos
- **Taxa de Confirmação**: >70% dos pedidos confirmados (vs recusados)
- **Taxa de Auto-Confirmação**: <15% (idealmente profissionais respondem manualmente)
- **Engagement**: >95% dos profissionais abrem notificações push

### 7.2 Métricas de UX

- **Time to Interactive**: Tela carrega em <2s
- **WebSocket Latency**: Atualização em tempo real <500ms
- **Push Notification Delivery**: 100% de entrega (com fallback)
- **Error Rate**: <1% de falhas em ações de confirmar/recusar

### 7.3 Métricas de Negócio

- **Recuperação de Clientes**: Aumento de 25% em agendamentos confirmados
- **Redução de No-Shows**: <5% de faltas após confirmação via Lazy Sync
- **Satisfação do Profissional**: NPS >50 para funcionalidade de confirmações
- **Tempo Economizado**: Redução de 80% no tempo gasto gerenciando agendamentos manualmente

---

## 8. Casos Extremos (Edge Cases)

### 8.1 Confirmações Simultâneas

**Problema**: Dois clientes querem o mesmo horário ao mesmo tempo

**Solução**:
```typescript
// Implementar lock otimista no backend
async function confirmWithLock(confirmationId: string) {
  const confirmation = await prisma.confirmationRequest.findUnique({
    where: { id: confirmationId },
  });

  // Verificar se horário ainda está disponível
  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      salonId: confirmation.salonId,
      scheduledAt: confirmation.proposedDateTime,
      status: { in: ['scheduled', 'confirmed'] },
    },
  });

  if (conflictingAppointment) {
    throw new Error('Horário já foi preenchido por outro cliente');
  }

  // Criar agendamento dentro de transação
  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        clientId: confirmation.clientId,
        salonId: confirmation.salonId,
        scheduledAt: confirmation.proposedDateTime,
        serviceType: confirmation.serviceType,
        status: 'scheduled',
      },
    });

    await tx.confirmationRequest.update({
      where: { id: confirmationId },
      data: { status: 'confirmed', respondedAt: new Date() },
    });

    return appointment;
  });
}
```

### 8.2 Offline Mode

**Problema**: Profissional sem internet ao tentar confirmar

**Solução**:
- Service Worker com background sync
- Queue local de ações pendentes
- Retry automático quando voltar online

```typescript
// Queue de ações offline
const offlineQueue: Array<{
  action: 'confirm' | 'reject';
  confirmationId: string;
  timestamp: Date;
}> = [];

async function confirmOffline(confirmationId: string) {
  // Adicionar à fila
  offlineQueue.push({
    action: 'confirm',
    confirmationId,
    timestamp: new Date(),
  });

  // Salvar no IndexedDB
  await saveToIndexedDB('offline-queue', offlineQueue);

  // UI feedback
  showToast('Salvo! Será confirmado quando voltar online.');
}

// Processar fila quando voltar online
window.addEventListener('online', async () => {
  const queue = await getFromIndexedDB('offline-queue');

  for (const item of queue) {
    try {
      if (item.action === 'confirm') {
        await fetch(`/api/v1/confirmations/${item.confirmationId}/confirm`, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Failed to sync:', error);
    }
  }

  // Limpar fila
  await clearIndexedDB('offline-queue');
});
```

### 8.3 Cliente Muda de Ideia Após Confirmação

**Problema**: Profissional confirmou mas cliente cancelou logo depois

**Solução**:
- Permitir cancelamento de confirmações até 2h antes do horário
- Notificar profissional via push notification
- Re-abrir slot na agenda automaticamente

---

## 9. Testes

### 9.1 Testes Unitários

```typescript
// __tests__/ConfirmationCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationCard } from '../components/ConfirmationCard';

describe('ConfirmationCard', () => {
  const mockConfirmation: ConfirmationRequest = {
    id: '123',
    clientName: 'Maria Silva',
    clientPhone: '11987654321',
    serviceType: 'Manicure',
    proposedDateTime: new Date('2025-01-10T14:00:00'),
    estimatedDuration: 45,
    lastClientMessage: 'Quarta à tarde tá ótimo!',
    conversationId: 'conv-123',
    status: 'pending',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // +30min
  };

  it('deve renderizar informações do cliente', () => {
    render(
      <ConfirmationCard
        confirmation={mockConfirmation}
        onConfirm={jest.fn()}
        onReject={jest.fn()}
      />
    );

    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText(/Manicure/)).toBeInTheDocument();
    expect(screen.getByText(/Quarta à tarde/)).toBeInTheDocument();
  });

  it('deve chamar onConfirm ao clicar em confirmar', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmationCard
        confirmation={mockConfirmation}
        onConfirm={onConfirm}
        onReject={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Confirmar/));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar estado urgente quando faltam <10min', () => {
    const urgentConfirmation = {
      ...mockConfirmation,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // +5min
    };

    const { container } = render(
      <ConfirmationCard
        confirmation={urgentConfirmation}
        onConfirm={jest.fn()}
        onReject={jest.fn()}
      />
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.getByText(/🔥/)).toBeInTheDocument();
  });
});
```

### 9.2 Testes de Integração

```typescript
// __tests__/confirmation-flow.integration.test.ts

describe('Confirmation Flow Integration', () => {
  it('deve confirmar agendamento e notificar cliente', async () => {
    const { salonToken, clientPhone } = await setupTestScenario();

    // 1. Bot cria confirmação pendente
    const confirmation = await createConfirmation({
      clientPhone,
      serviceType: 'Manicure',
      proposedDateTime: '2025-01-10T14:00:00',
    });

    expect(confirmation.status).toBe('pending');

    // 2. Profissional confirma
    const response = await fetch(`/api/v1/confirmations/${confirmation.id}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${salonToken}`,
      },
    });

    expect(response.ok).toBe(true);

    // 3. Verificar que agendamento foi criado
    const appointment = await prisma.appointment.findFirst({
      where: { clientId: confirmation.clientId },
    });

    expect(appointment).toBeDefined();
    expect(appointment.status).toBe('scheduled');

    // 4. Verificar que cliente foi notificado no WhatsApp
    const messages = await getWhatsAppMessages(clientPhone);
    expect(messages).toContainEqual(
      expect.objectContaining({
        body: expect.stringContaining('confirmado'),
      })
    );
  });

  it('deve auto-confirmar após timeout para cliente recorrente', async () => {
    // Setup
    const { confirmation, client } = await setupRecurringClientScenario();

    // Marcar como cliente recorrente (2+ agendamentos)
    await createPastAppointments(client.id, 3);

    // Avançar tempo para expiração
    jest.advanceTimersByTime(31 * 60 * 1000); // +31min

    // Rodar job de timeout
    await confirmationTimeoutService.processExpiredConfirmations();

    // Verificar auto-confirmação
    const updated = await prisma.confirmationRequest.findUnique({
      where: { id: confirmation.id },
    });

    expect(updated.status).toBe('expired_auto_confirmed');

    // Verificar que agendamento foi criado
    const appointment = await prisma.appointment.findFirst({
      where: { clientId: client.id },
    });

    expect(appointment).toBeDefined();
  });
});
```

---

## 10. Dependências

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-use-websocket": "^4.5.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0"
  }
}
```

---

## 11. Próximos Passos (Roadmap)

### Fase 1: MVP (Sprint Atual)
- ✅ Lista de confirmações pendentes
- ✅ Ação de confirmar/recusar
- ✅ Push notifications básicas
- ✅ Auto-confirmação por timeout

### Fase 2: Melhorias
- Ações em lote (confirmar múltiplas de uma vez)
- Filtros avançados (por profissional, por serviço)
- Histórico com busca e filtros
- Estatísticas de performance (dashboard)

### Fase 3: Inteligência
- Sugestão de horários alternativos ao recusar
- ML para prever probabilidade de confirmação
- Auto-ajuste de timeout baseado em padrões
- Smart notifications (enviar no melhor momento)

---

**Desenvolvido para Agenda Cheia - Growth Layer para Salões de Beleza**
Versão 1.0 • Janeiro 2025
