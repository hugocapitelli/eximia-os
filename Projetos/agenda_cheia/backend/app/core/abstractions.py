# backend/app/core/abstractions.py
"""
Abstrações (interfaces) que definem contratos
Cada agente deve implementar essas interfaces
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from app.core.types import (
    ExecutionContext,
    ExecutionResult,
    AutomationStatus,
    Event,
    NotificationPayload,
    AuthRequest,
    AppointmentData,
)


# ============================================================================
# PROVIDERS - Interfaces para serviços externos
# ============================================================================

class DataProvider(ABC):
    """Interface para acesso a dados (DB)"""

    @abstractmethod
    async def get_client(self, tenant_id: str, client_id: str):
        """Busca um cliente específico"""
        pass

    @abstractmethod
    async def get_clients_for_campaign(
        self, tenant_id: str, service_id: str, criteria: Dict[str, Any]
    ):
        """Busca clientes que combinam critérios"""
        pass

    @abstractmethod
    async def get_professional(self, tenant_id: str, professional_id: str):
        """Busca um profissional"""
        pass

    @abstractmethod
    async def get_available_slots(
        self,
        tenant_id: str,
        professional_id: str,
        date_from: str,
        date_to: str,
    ):
        """Busca horários disponíveis de um profissional"""
        pass

    @abstractmethod
    async def get_salon_config(self, tenant_id: str):
        """Busca configurações do salão"""
        pass

    @abstractmethod
    async def get_ai_config(self, tenant_id: str):
        """Busca configuração de IA (personalidade, tom, etc)"""
        pass

    @abstractmethod
    async def create_auth_request(
        self, tenant_id: str, appointment_data: AppointmentData, created_by_agent: str
    ):
        """Cria um lazy sync request"""
        pass

    @abstractmethod
    async def create_appointment(self, appointment_data: AppointmentData):
        """Cria um agendamento"""
        pass


class LLMProvider(ABC):
    """Interface para integração com LLM (Gemini, ChatGPT, etc)"""

    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> str:
        """Gera texto baseado em prompt"""
        pass

    @abstractmethod
    async def chat(self, message: str, history: List[Dict], system_prompt: str) -> str:
        """Chat mode - mantém contexto"""
        pass

    @abstractmethod
    async def detect_intent(self, text: str, intent_list: List[str]) -> str:
        """Detecta intenção (booking, complaint, etc)"""
        pass

    @abstractmethod
    async def extract_data(self, text: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Extrai dados estruturados de texto"""
        pass

    @abstractmethod
    async def rank_clients(
        self, clients: List[Dict], criteria: Dict[str, Any]
    ) -> List[tuple]:
        """Ranking de clientes por relevância"""
        pass


class NotificationProvider(ABC):
    """Interface para envio de notificações"""

    @abstractmethod
    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        """Envia mensagem WhatsApp. Retorna message_id"""
        pass

    @abstractmethod
    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        """Envia SMS"""
        pass

    @abstractmethod
    async def send_email(
        self, email: str, subject: str, body: str, tenant_id: str, **kwargs
    ) -> str:
        """Envia email"""
        pass

    @abstractmethod
    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        """Envia push notification para React"""
        pass


class EventBus(ABC):
    """Interface para pub/sub de eventos"""

    @abstractmethod
    async def publish(self, event: Event):
        """Publica um evento para o sistema"""
        pass

    @abstractmethod
    async def subscribe(self, event_type: str, callback):
        """Subscreve a um tipo de evento"""
        pass

    @abstractmethod
    async def emit_to_frontend(self, tenant_id: str, event: Event):
        """Emite evento direto para React (via WebSocket/Polling)"""
        pass


# ============================================================================
# AGENT - Interface Base
# ============================================================================

class Agent(ABC):
    """
    Interface base para todos os agentes de automação

    Cada agente implementa:
    - execute(): lógica principal
    - validate_context(): valida dados de entrada
    - error_handler(): trata erros
    """

    def __init__(
        self,
        data_provider: DataProvider,
        llm_provider: LLMProvider,
        notification_provider: NotificationProvider,
        event_bus: EventBus,
        logger: Optional[logging.Logger] = None,
    ):
        self.data = data_provider
        self.llm = llm_provider
        self.notify = notification_provider
        self.events = event_bus
        self.logger = logger or logging.getLogger(self.__class__.__name__)

    @abstractmethod
    async def execute(self, context: ExecutionContext) -> ExecutionResult:
        """
        Executa o agente

        Returns:
            ExecutionResult com eventos, dados criados, status
        """
        pass

    @abstractmethod
    async def validate_context(self, context: ExecutionContext) -> tuple[bool, str]:
        """
        Valida se context contém dados necessários

        Returns:
            (is_valid, error_message)
        """
        pass

    async def error_handler(
        self, error: Exception, context: ExecutionContext
    ) -> ExecutionResult:
        """
        Tratamento padrão de erros

        Pode ser overridado por subclasses
        """
        self.logger.error(
            f"Erro em {self.__class__.__name__}: {str(error)}", exc_info=True
        )

        return ExecutionResult(
            agent_type=context.agent.agent_type,
            execution_id=context.agent.execution_id,
            status=AutomationStatus.FAILED,
            error=str(error),
            error_details={"exception": type(error).__name__},
            started_at=datetime.now(),
            completed_at=datetime.now(),
        )

    async def emit_event(self, event: Event):
        """Helper para disparar eventos"""
        await self.events.publish(event)
        self.logger.info(f"Event published: {event.event_type}")

    async def create_auth_request(
        self,
        context: ExecutionContext,
        appointment_data: AppointmentData,
        reason: Optional[str] = None,
    ) -> AuthRequest:
        """Helper para criar lazy sync request"""
        auth_req = await self.data.create_auth_request(
            tenant_id=context.agent.tenant_id,
            appointment_data=appointment_data,
            created_by_agent=context.agent.agent_type.value,
        )

        # Emitir evento
        from app.core.types import AuthRequestCreatedEvent

        event = AuthRequestCreatedEvent(
            id=f"evt_{auth_req.id}",
            tenant_id=context.agent.tenant_id,
            agent_id=context.agent.agent_id,
            timestamp=datetime.now(),
            data={"auth_request": auth_req.dict()},
        )
        await self.emit_event(event)

        return auth_req

    async def send_notification(
        self,
        context: ExecutionContext,
        client_id: str,
        message: str,
        channel: str,
        **kwargs,
    ):
        """Helper para enviar notificação com tracking"""
        client = await self.data.get_client(context.agent.tenant_id, client_id)

        if channel == "whatsapp":
            msg_id = await self.notify.send_whatsapp(
                phone=client.phone, message=message, tenant_id=context.agent.tenant_id
            )
        elif channel == "sms":
            msg_id = await self.notify.send_sms(
                phone=client.phone, message=message, tenant_id=context.agent.tenant_id
            )
        elif channel == "email":
            msg_id = await self.notify.send_email(
                email=client.email, subject=kwargs.get("subject"),
                body=message, tenant_id=context.agent.tenant_id
            )
        else:
            raise ValueError(f"Unknown channel: {channel}")

        # Emitir evento
        from app.core.types import NotificationSentEvent

        event = NotificationSentEvent(
            id=f"evt_{msg_id}",
            tenant_id=context.agent.tenant_id,
            agent_id=context.agent.agent_id,
            timestamp=datetime.now(),
            data={"message_id": msg_id, "channel": channel, "client_id": client_id},
        )
        await self.emit_event(event)

        return msg_id


# ============================================================================
# AGENT REGISTRY - Para descoberta de agentes
# ============================================================================

class AgentRegistry(ABC):
    """Registry para descobrir e instanciar agentes"""

    @abstractmethod
    def register(self, agent_type: str, agent_class):
        """Registra um agente"""
        pass

    @abstractmethod
    def get(self, agent_type: str) -> Agent:
        """Busca um agente registrado"""
        pass

    @abstractmethod
    def list_all(self) -> List[str]:
        """Lista todos os agentes registrados"""
        pass


# ============================================================================
# ORCHESTRATOR - Orquestra múltiplos agentes
# ============================================================================

class Orchestrator(ABC):
    """
    Orquestra a execução de agentes

    Responsabilidades:
    - Validar dados de entrada
    - Rotear para agente apropriado
    - Executar em paralelo se possível
    - Sincronizar com React
    """

    @abstractmethod
    async def execute_workflow(
        self, workflow_type: str, context: ExecutionContext
    ) -> ExecutionResult:
        """Executa um workflow completo"""
        pass

    @abstractmethod
    async def schedule_workflow(
        self, workflow_type: str, schedule: str, context: ExecutionContext
    ):
        """Agenda um workflow para rodar periodicamente"""
        pass

    @abstractmethod
    async def list_executions(self, tenant_id: str, limit: int = 50):
        """Lista execuções recentes"""
        pass
