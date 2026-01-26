# backend/app/agents/prazo_certo_agent.py
"""
Agente: PRAZO CERTO
Identifica clientes em ciclo de retorno e dispara campanhas automáticas

Fluxo:
1. Busca clientes que completaram ciclo de retorno (ex: corte a cada 30 dias)
2. Sugere horários vazios na agenda
3. Envia notificação (WhatsApp)
4. Cria lazy sync request (aguarda aprovação owner)
5. Se aprovado via React, agenda o cliente
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging

from app.core.abstractions import Agent
from app.core.types import (
    ExecutionContext,
    ExecutionResult,
    AutomationStatus,
    AutomationWorkflowType,
    ClientData,
    ServiceData,
    AppointmentData,
    CampaignTarget,
    Event,
    CampaignCompletedEvent,
)


logger = logging.getLogger(__name__)


class PrazoCertoAgent(Agent):
    """
    Agente responsável por campanha "Prazo Certo"

    Scenario:
    - Cliente X fez manicure dia 01/01
    - Serviço tem ciclo de retorno de 14 dias
    - Sistema detecta que 01/15 é data ideal para retorno
    - Envia sugestão ao cliente
    - Owner aprova/rejeita
    """

    async def execute(self, context: ExecutionContext) -> ExecutionResult:
        """
        Executa campanha Prazo Certo

        Context esperado:
        {
            "agent": { "tenant_id", "agent_id", "execution_id" },
            "clients": [...],
            "professionals": [...],
            "services": [...],
            "appointments": [...],
            "campaign_config": {
                "service_id": "uuid",
                "professional_id": "uuid (optional)",
                "offer_type": "discount|bonus",
                "offer_value": 15,
            }
        }
        """

        result = ExecutionResult(
            agent_type=AutomationWorkflowType.PRAZO_CERTO,
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

            self.logger.info(
                f"[PrazoCerto] Iniciando para tenant {context.agent.tenant_id}"
            )

            # Step 2: Buscar clientes em ciclo de retorno
            return_cycle_clients = await self._find_return_cycle_clients(context)
            self.logger.info(
                f"[PrazoCerto] Encontrados {len(return_cycle_clients)} clientes em ciclo"
            )

            # Step 3: Para cada cliente, criar sugestão de agendamento
            suggestions_created = 0
            for client in return_cycle_clients:
                try:
                    suggestion = await self._create_suggestion(context, client)
                    result.auth_requests_created.append(suggestion)
                    suggestions_created += 1

                    # Step 4: Enviar notificação ao cliente
                    message = await self._generate_message(context, client, suggestion)
                    await self.send_notification(
                        context=context,
                        client_id=client.id,
                        message=message,
                        channel="whatsapp",
                    )

                except Exception as e:
                    self.logger.error(
                        f"[PrazoCerto] Erro ao processar cliente {client.id}: {e}"
                    )
                    continue

            # Step 5: Montar resultado e disparar evento
            result.status = AutomationStatus.SUCCESS
            result.metrics = {
                "total_clients_found": len(return_cycle_clients),
                "suggestions_created": suggestions_created,
                "notifications_sent": suggestions_created,
            }

            # Disparar evento de conclusão
            campaign_config = context.campaign_config or {}
            completion_event = CampaignCompletedEvent(
                id=f"evt_{context.agent.execution_id}",
                tenant_id=context.agent.tenant_id,
                agent_id=context.agent.agent_id,
                timestamp=datetime.now(),
                data={
                    "campaign_type": "prazo_certo",
                    "stats": result.metrics,
                    "campaign_id": campaign_config.get("campaign_id"),
                },
            )
            await self.emit_event(completion_event)

            self.logger.info(
                f"[PrazoCerto] Campanha concluída: {suggestions_created} sugestões"
            )

        except Exception as e:
            result = await self.error_handler(e, context)

        finally:
            result.completed_at = datetime.now()
            result.duration_seconds = (
                result.completed_at - result.started_at
            ).total_seconds()

        return result

    async def validate_context(self, context: ExecutionContext) -> tuple[bool, str]:
        """Valida se contexto tem dados necessários"""

        if not context.agent.tenant_id:
            return False, "tenant_id é obrigatório"

        if not context.clients:
            return False, "clients lista é obrigatória"

        if not context.services:
            return False, "services lista é obrigatória"

        if not context.appointments:
            return False, "appointments lista é obrigatória"

        if not context.campaign_config:
            return False, "campaign_config é obrigatório"

        service_id = context.campaign_config.get("service_id")
        if not service_id:
            return False, "campaign_config.service_id é obrigatório"

        return True, ""

    async def _find_return_cycle_clients(
        self, context: ExecutionContext
    ) -> List[ClientData]:
        """
        Identifica clientes que completaram ciclo de retorno

        Lógica:
        1. Para cada cliente
        2. Busca última visita para o serviço em questão
        3. Se (hoje - última_visita) >= return_cycle_days: incluir
        """

        service_id = context.campaign_config["service_id"]
        service = next((s for s in context.services if s.id == service_id), None)

        if not service:
            self.logger.warning(f"Service {service_id} não encontrado")
            return []

        return_cycle_days = service.return_cycle_days
        today = datetime.now().date()
        candidates = []

        for client in context.clients:
            # Buscar últimos agendamentos deste cliente para este serviço
            client_appointments = [
                a
                for a in context.appointments
                if a.client_id == client.id and a.service_id == service_id
            ]

            if not client_appointments:
                continue

            # Ordenar por data (mais recente first)
            client_appointments.sort(
                key=lambda a: datetime.strptime(a.date, "%Y-%m-%d"), reverse=True
            )

            last_appointment = client_appointments[0]
            last_date = datetime.strptime(last_appointment.date, "%Y-%m-%d").date()

            # Verificar se passou do ciclo
            days_since = (today - last_date).days
            if days_since >= return_cycle_days:
                candidates.append(client)

        return candidates

    async def _create_suggestion(
        self, context: ExecutionContext, client: ClientData
    ) -> Any:
        """
        Cria sugestão de agendamento (lazy sync request)

        Extrai dados e cria AppointmentData que vai para auth_request
        """

        service_id = context.campaign_config["service_id"]
        professional_id = context.campaign_config.get("professional_id")
        offer_type = context.campaign_config.get("offer_type", "discount")
        offer_value = context.campaign_config.get("offer_value", 10)

        # Buscar próximo slot disponível
        suggested_date, suggested_time = await self._find_next_available_slot(
            context, professional_id
        )

        appointment_data = AppointmentData(
            tenant_id=context.agent.tenant_id,
            client_id=client.id,
            client_name=client.name,
            professional_id=professional_id or "",
            service_id=service_id,
            date=suggested_date,
            time=suggested_time,
            source="prazo_certo",
            status="pending",
        )

        # Criar auth request (lazy sync)
        auth_request = await self.create_auth_request(
            context, appointment_data, reason=f"{offer_type} de {offer_value}%"
        )

        return auth_request

    async def _find_next_available_slot(
        self, context: ExecutionContext, professional_id: Optional[str]
    ) -> tuple[str, str]:
        """
        Encontra próximo horário disponível

        Simplificado: retorna próxima segunda-feira às 10:00
        Em produção: usar agendador mais sofisticado
        """

        today = datetime.now()

        # Próxima segunda (ou segunda se hoje for segunda)
        days_ahead = 0 - today.weekday()  # Monday is 0
        if days_ahead <= 0:
            days_ahead += 7

        next_monday = today + timedelta(days=days_ahead)
        suggested_date = next_monday.strftime("%Y-%m-%d")
        suggested_time = "10:00"

        return suggested_date, suggested_time

    async def _generate_message(
        self, context: ExecutionContext, client: ClientData, suggestion: Any
    ) -> str:
        """
        Gera mensagem personalizada usando IA

        Exemplo de prompt:
        "Gere uma mensagem WhatsApp curta pedindo ao cliente João para voltar..."
        """

        service_id = context.campaign_config["service_id"]
        service = next((s for s in context.services if s.id == service_id), None)

        offer_type = context.campaign_config.get("offer_type", "discount")
        offer_value = context.campaign_config.get("offer_value", 10)

        prompt = f"""
        Gere uma mensagem WhatsApp curta e persuasiva para um cliente:

        Cliente: {client.name}
        Serviço: {service.name if service else ""}
        Última visita: {client.last_visit}
        Data sugerida: {suggestion.appointment_data.date}
        Horário sugerido: {suggestion.appointment_data.time}
        Oferta: {offer_type} de {offer_value}%

        Requisitos:
        - Máximo 160 caracteres
        - Tom profissional mas amigável
        - Incluir call-to-action clara
        - Não usar emojis excessivos
        """

        try:
            message = await self.llm.generate(prompt)
            self.logger.debug(f"Message gerada: {message}")
            return message
        except Exception as e:
            self.logger.error(f"Erro ao gerar mensagem: {e}")
            # Fallback
            return f"Olá {client.name}! Chegou a hora de {service.name if service else 'cuidar de você'}. Agende seu horário em: https://agenda.seu-dominio.com"
