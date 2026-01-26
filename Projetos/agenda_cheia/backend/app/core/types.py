# backend/app/core/types.py
"""
Tipos e enums compartilhados entre agentes
Define contratos que todo o sistema usa
"""

from enum import Enum
from typing import TypedDict, Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel


# ============================================================================
# ENUMS - Estados e Tipos
# ============================================================================

class AutomationWorkflowType(str, Enum):
    """Tipos de automações suportadas"""
    PRAZO_CERTO = "prazo_certo"          # Retorno automático
    ENCHER_AGENDA = "encher_agenda"      # Preencher buracos
    CHAT_IA = "chat_ia"                  # Chat com IA
    CUSTOM_TRIGGER = "custom_trigger"    # Customizado


class AutomationStatus(str, Enum):
    """Status de uma automação durante execução"""
    PENDING = "pending"        # Aguardando execução
    RUNNING = "running"        # Em progresso
    SUCCESS = "success"        # Completada com sucesso
    FAILED = "failed"          # Falhou
    PAUSED = "paused"          # Pausada


class NotificationChannel(str, Enum):
    """Canais de notificação"""
    WHATSAPP = "whatsapp"
    SMS = "sms"
    EMAIL = "email"
    PUSH = "push"              # React push notification


class NotificationStatus(str, Enum):
    """Status de notificação"""
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    READ = "read"


class OfferType(str, Enum):
    """Tipo de oferta em campanhas"""
    DISCOUNT = "discount"      # Desconto percentual
    BONUS = "bonus"            # Bônus (serviço grátis)
    COMBO = "combo"            # Pacote


class IntentType(str, Enum):
    """Intenções detectadas em conversas"""
    BOOKING = "booking"        # Cliente quer agendar
    INQUIRY = "inquiry"        # Pergunta geral
    COMPLAINT = "complaint"    # Reclamação
    FEEDBACK = "feedback"      # Feedback
    HELLO = "hello"            # Saudação
    UNKNOWN = "unknown"


# ============================================================================
# DATA MODELS - DTOs para comunicação
# ============================================================================

class Agent(BaseModel):
    """Contexto de um agente durante execução"""
    tenant_id: str
    agent_id: str
    agent_type: AutomationWorkflowType
    execution_id: str           # UUID único da execução


class ClientData(BaseModel):
    """Cliente - subset do modelo full"""
    id: str
    tenant_id: str
    name: str
    phone: str
    email: Optional[str]
    last_visit: Optional[datetime]
    status: str                 # 'active', 'lost', 'negotiating', 'blocked'
    service_interest: Optional[str]
    professional_id: Optional[str]


class ProfessionalData(BaseModel):
    """Profissional - subset do modelo full"""
    id: str
    tenant_id: str
    name: str
    services: List[str]        # UUIDs de serviços
    photo_url: Optional[str]
    folgas_dias: List[str]      # ['segunda', 'terça']
    folgas_datas: List[str]     # ['2024-12-25']


class ServiceData(BaseModel):
    """Serviço - subset do modelo full"""
    id: str
    tenant_id: str
    name: str
    duration_minutes: int
    price: float
    return_cycle_days: int      # Quantos dias até retorno ideal


class AppointmentData(BaseModel):
    """Agendamento para ser criado"""
    tenant_id: str
    client_id: str
    client_name: str
    professional_id: str
    service_id: str
    date: str                   # YYYY-MM-DD
    time: str                   # HH:MM
    source: str                 # 'ai' ou 'manual'
    status: str = "pending"


class AuthRequest(BaseModel):
    """Lazy Sync Request - aguardando aprovação do owner"""
    id: str
    tenant_id: str
    appointment_data: AppointmentData
    created_by_agent: str       # Nome do agente que criou
    created_at: datetime
    approval_reason: Optional[str]


class CampaignTarget(BaseModel):
    """Cliente alvo de uma campanha"""
    id: str
    client_id: str
    client_name: str
    phone: str
    suggested_date: Optional[str]
    suggested_time: Optional[str]
    offer_text: Optional[str]
    status: str                 # 'pending', 'sent', 'accepted', 'rejected'


class NotificationPayload(BaseModel):
    """Payload de uma notificação"""
    id: str
    tenant_id: str
    recipient_id: str           # client_id
    channel: NotificationChannel
    message: str
    metadata: Dict[str, Any] = {}
    scheduled_for: Optional[datetime] = None
    priority: int = 1           # 1=normal, 2=high, 3=urgent


class WebhookEvent(BaseModel):
    """Evento recebido de webhook (N8N, WhatsApp, etc)"""
    id: str
    source: str                 # 'n8n', 'whatsapp', 'email'
    event_type: str
    tenant_id: str
    payload: Dict[str, Any]
    received_at: datetime


class Message(BaseModel):
    """Mensagem em conversa"""
    role: str                   # 'client' ou 'assistant'
    content: str
    timestamp: datetime
    metadata: Dict[str, Any] = {}


class ConversationData(BaseModel):
    """Contexto de conversa para Chat Agent"""
    id: str
    tenant_id: str
    client_id: str
    client_name: str
    phone: str
    messages: List[Message]
    ai_config: Dict[str, Any]  # Personality, tone, etc
    is_ai_active: bool


# ============================================================================
# EVENT SYSTEM - Para comunicação entre agentes e React
# ============================================================================

class Event(BaseModel):
    """Evento base do sistema"""
    id: str                     # UUID único
    event_type: str
    tenant_id: str
    timestamp: datetime
    agent_id: str               # Qual agente disparou
    data: Dict[str, Any]

    class Config:
        use_enum_values = True


class AuthRequestCreatedEvent(Event):
    """Disparado quando agente cria um auth_request"""
    event_type: str = "auth_request_created"
    data: Dict[str, Any]        # { auth_request: AuthRequest }


class NotificationSentEvent(Event):
    """Disparado quando notificação é enviada"""
    event_type: str = "notification_sent"
    data: Dict[str, Any]        # { notification_id, channel, status }


class AppointmentCreatedEvent(Event):
    """Disparado quando agendamento é criado (após aprovação)"""
    event_type: str = "appointment_created"
    data: Dict[str, Any]        # { appointment_id, client_id, etc }


class CampaignCompletedEvent(Event):
    """Disparado quando campanha finaliza"""
    event_type: str = "campaign_completed"
    data: Dict[str, Any]        # { campaign_id, stats: {sent, accepted, rejected} }


class AIResponseEvent(Event):
    """Disparado quando IA gera resposta no chat"""
    event_type: str = "ai_response"
    data: Dict[str, Any]        # { conversation_id, message, intent, booking_data? }


class ExecutionErrorEvent(Event):
    """Disparado quando agente encontra erro"""
    event_type: str = "execution_error"
    data: Dict[str, Any]        # { error_code, message, details }


# ============================================================================
# EXECUTION CONTEXT - Passado para cada agente
# ============================================================================

class ExecutionContext(BaseModel):
    """Contexto de execução de um agente"""
    agent: Agent

    # Data providers
    clients: Optional[List[ClientData]]
    professionals: Optional[List[ProfessionalData]]
    services: Optional[List[ServiceData]]
    appointments: Optional[List[AppointmentData]]

    # Para conversas
    conversation: Optional[ConversationData]

    # Para campanhas
    campaign_config: Optional[Dict[str, Any]]

    # Para webhooks
    webhook_event: Optional[WebhookEvent]

    # Config do salão
    salon_config: Optional[Dict[str, Any]]


class ExecutionResult(BaseModel):
    """Resultado de execução de um agente"""
    agent_type: AutomationWorkflowType
    execution_id: str
    status: AutomationStatus

    # Eventos disparados durante execução
    events: List[Event] = []

    # Dados criados
    auth_requests_created: List[AuthRequest] = []
    notifications_sent: List[NotificationPayload] = []
    appointments_created: List[AppointmentData] = []

    # Estatísticas
    metrics: Dict[str, Any] = {}

    # Erro se houver
    error: Optional[str] = None
    error_details: Optional[Dict[str, Any]] = None

    # Quando execução iniciou e finalizou
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
