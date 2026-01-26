# backend/app/agents/chat_agent.py
"""
Agente: CHAT COM IA
Gerencia conversas com clientes via WhatsApp/SMS/Email

Fluxo:
1. Recebe mensagem de cliente (webhook N8N)
2. IA processa com contexto de histórico
3. Detecta intenção (booking, inquiry, complaint, etc)
4. Se booking: extrai dados e cria auth_request
5. Responde ao cliente via WhatsApp
6. Log de conversa
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
import logging

from app.core.abstractions import Agent
from app.core.types import (
    ExecutionContext,
    ExecutionResult,
    AutomationStatus,
    AutomationWorkflowType,
    ConversationData,
    Message,
    IntentType,
    AppointmentData,
    Event,
    AIResponseEvent,
)


logger = logging.getLogger(__name__)


class ChatAgent(Agent):
    """
    Agente responsável por conversas com IA

    Scenario:
    - Cliente envia: "Quero agendar um corte com Carol"
    - IA responde: "Ótimo! Qual dia você prefere?"
    - Cliente responde: "Segunda à tarde"
    - IA propõe horário e cria auth_request
    - Owner aprova
    - Cliente recebe confirmação
    """

    async def execute(self, context: ExecutionContext) -> ExecutionResult:
        """
        Executa processamento de mensagem no chat

        Context esperado:
        {
            "agent": { "tenant_id", "agent_id", "execution_id" },
            "conversation": {
                "id": "uuid",
                "client_id": "uuid",
                "client_name": "João",
                "messages": [{role, content, timestamp}],
                "ai_config": {personality, tone, ...}
            },
            "clients": [...],
            "professionals": [...],
            "services": [...],
            "appointments": [...]
        }
        """

        result = ExecutionResult(
            agent_type=AutomationWorkflowType.CHAT_IA,
            execution_id=context.agent.execution_id,
            status=AutomationStatus.RUNNING,
            started_at=datetime.now(),
        )

        try:
            # Step 1: Validar contexto
            is_valid, error_msg = await self.validate_context(context)
            if not is_valid:
                result.status = AutomationStatus.FAILED
                result.error = error_msg
                result.completed_at = datetime.now()
                return result

            conversation = context.conversation
            client_message = conversation.messages[-1].content  # Última mensagem

            self.logger.info(
                f"[ChatAgent] Processando mensagem de {conversation.client_name}"
            )

            # Step 2: Gerar resposta da IA
            ai_response = await self._generate_response(context, client_message)
            self.logger.debug(f"[ChatAgent] Resposta gerada: {ai_response}")

            # Step 3: Detectar intenção
            intent = await self._detect_intent(client_message, ai_response)
            self.logger.info(f"[ChatAgent] Intenção detectada: {intent}")

            # Step 4: Se intenção é booking, extrair dados
            booking_data = None
            if intent == IntentType.BOOKING:
                booking_data = await self._extract_booking_data(
                    context, client_message, ai_response
                )

                if booking_data:
                    # Criar auth_request
                    auth_request = await self.create_auth_request(
                        context, booking_data, reason="Sugerido via chat"
                    )
                    result.auth_requests_created.append(auth_request)

                    # Adicionar note à resposta
                    ai_response += (
                        "\n\n[Seu agendamento foi enviado para aprovação]"
                    )
                    self.logger.info(
                        f"[ChatAgent] Auth request criado: {auth_request.id}"
                    )

            # Step 5: Enviar resposta ao cliente
            await self.send_notification(
                context=context,
                client_id=conversation.client_id,
                message=ai_response,
                channel="whatsapp",
            )

            # Step 6: Dispara evento
            ai_event = AIResponseEvent(
                id=f"evt_{context.agent.execution_id}",
                tenant_id=context.agent.tenant_id,
                agent_id=context.agent.agent_id,
                timestamp=datetime.now(),
                data={
                    "conversation_id": conversation.id,
                    "client_id": conversation.client_id,
                    "message": ai_response,
                    "intent": intent.value,
                    "booking_created": booking_data is not None,
                },
            )
            await self.emit_event(ai_event)

            # Step 7: Resultado
            result.status = AutomationStatus.SUCCESS
            result.metrics = {
                "intent": intent.value,
                "booking_created": booking_data is not None,
            }

            self.logger.info("[ChatAgent] Processamento concluído")

        except Exception as e:
            result = await self.error_handler(e, context)

        finally:
            result.completed_at = datetime.now()
            result.duration_seconds = (
                result.completed_at - result.started_at
            ).total_seconds()

        return result

    async def validate_context(self, context: ExecutionContext) -> tuple[bool, str]:
        """Valida contexto"""

        if not context.conversation:
            return False, "conversation é obrigatória"

        if not context.conversation.messages:
            return False, "conversation.messages está vazia"

        if not context.clients:
            return False, "clients lista é obrigatória"

        if not context.services:
            return False, "services lista é obrigatória"

        return True, ""

    async def _generate_response(
        self, context: ExecutionContext, client_message: str
    ) -> str:
        """
        Gera resposta da IA usando Gemini

        Usa contexto de:
        - Histórico de conversa
        - Configuração de personalidade do salão
        - Dados do cliente e serviços
        """

        conversation = context.conversation
        ai_config = conversation.ai_config or {}

        # Montar histórico para o LLM
        history = []
        for msg in conversation.messages:
            history.append(
                {"role": msg.role, "content": msg.content}
            )

        # System prompt personalizado
        system_prompt = await self._build_system_prompt(context, ai_config)

        try:
            response = await self.llm.chat(
                message=client_message,
                history=history,
                system_prompt=system_prompt,
            )
            return response
        except Exception as e:
            self.logger.error(f"[ChatAgent] Erro ao chamar LLM: {e}")
            return "Desculpe, estou com dificuldades para responder agora. Um gerente entrará em contato em breve."

    async def _build_system_prompt(
        self, context: ExecutionContext, ai_config: Dict[str, Any]
    ) -> str:
        """Monta prompt customizado baseado no salão"""

        personality = ai_config.get("personality", "professional")
        tone = ai_config.get("tone", "neutral")
        salon_description = ai_config.get("salon_description", "")

        prompt = f"""
        Você é uma assistente de agendamento de um salão de beleza.

        PERSONALIDADE: {personality}
        TOM: {tone}
        SOBRE O SALÃO: {salon_description}

        SERVIÇOS DISPONÍVEIS:
        """

        for service in context.services[:10]:  # Top 10 serviços
            prompt += f"\n- {service.name} (R$ {service.price:.2f}, {service.duration_minutes}min)"

        prompt += """

        INSTRUÇÕES:
        1. Seja amigável e profissional
        2. Responda perguntas sobre serviços
        3. Sugira serviços baseado na conversa
        4. Quando cliente quiser agendar:
           - Pergunte qual serviço deseja
           - Pergunte qual profissional (se houver preferência)
           - Pergunte dia/horário preferido
           - Confirme antes de enviar para aprovação
        5. Se cliente tiver dúvida, esclareça
        6. Seja conciso nas respostas

        IMPORTANTE:
        - Não invent serviços que não existem
        - Não dê acesso a dados de outros clientes
        - Mantenha conversa focada em agendamento
        """

        return prompt

    async def _detect_intent(self, client_message: str, ai_response: str) -> IntentType:
        """
        Detecta intenção da mensagem do cliente

        Usa IA para classificar entre:
        - BOOKING: "Quero agendar"
        - INQUIRY: "Qual o preço de..."
        - COMPLAINT: "Não fiquei satisfeito"
        - FEEDBACK: "Adorei!"
        - HELLO: Saudação
        - UNKNOWN: Outra coisa
        """

        intent_list = [e.value for e in IntentType]

        try:
            intent_str = await self.llm.detect_intent(
                text=client_message,
                intent_list=intent_list,
            )
            return IntentType(intent_str)
        except Exception as e:
            self.logger.warning(f"Erro ao detectar intenção: {e}")
            return IntentType.UNKNOWN

    async def _extract_booking_data(
        self, context: ExecutionContext, client_message: str, ai_response: str
    ) -> Optional[AppointmentData]:
        """
        Extrai dados de agendamento da conversa

        Usa IA para extrair:
        - Serviço desejado
        - Profissional (se mencionado)
        - Data/Horário preferido
        """

        schema = {
            "service_id": "UUID do serviço",
            "professional_id": "UUID do profissional (opcional)",
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "notes": "Notas adicionais",
        }

        try:
            extracted = await self.llm.extract_data(
                text=f"Client: {client_message}\nAI: {ai_response}",
                schema=schema,
            )

            # Validar dados extraídos
            if not extracted.get("service_id") or not extracted.get("date"):
                return None

            # Buscar IDs reais
            service = next(
                (s for s in context.services if s.id == extracted["service_id"]),
                None,
            )
            if not service:
                return None

            professional_id = extracted.get("professional_id", "")
            if professional_id:
                professional = next(
                    (p for p in context.professionals if p.id == professional_id),
                    None,
                )
                if not professional:
                    professional_id = ""

            appointment = AppointmentData(
                tenant_id=context.agent.tenant_id,
                client_id=context.conversation.client_id,
                client_name=context.conversation.client_name,
                professional_id=professional_id or "",
                service_id=service.id,
                date=extracted["date"],
                time=extracted["time"],
                source="chat_ia",
                status="pending",
            )

            return appointment

        except Exception as e:
            self.logger.warning(f"Erro ao extrair dados de booking: {e}")
            return None
