# backend/app/agents/encher_agenda_agent.py
"""
Agente: ENCHER AGENDA
Detecta buracos na agenda e preenche com clientes ideais

Fluxo:
1. Busca profissional
2. Identifica horários vagos (próximos 7 dias)
3. Busca clientes ideais para cada horário
4. Envia oferta especial ("promoção", "combo")
5. Cria lazy sync requests
6. Se aprovado, agenda cliente
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
    ProfessionalData,
    AppointmentData,
    Event,
    CampaignCompletedEvent,
)


logger = logging.getLogger(__name__)


class EncherAgendaAgent(Agent):
    """
    Agente responsável por campanha "Encher Agenda"

    Scenario:
    - Carol tem horários vagos segunda-feira 14:00-15:00
    - Sistema busca clientes que:
      * Fizeram manicure (serviço de Carol)
      * Não têm agendamento esta semana
      * Completaram ciclo ideal de retorno
    - Oferece desconto especial: "Aproveite 15% OFF para hoje"
    - Envia via WhatsApp
    - Owner aprova e agenda
    """

    async def execute(self, context: ExecutionContext) -> ExecutionResult:
        """
        Executa campanha Encher Agenda

        Context esperado:
        {
            "agent": { "tenant_id", "agent_id", "execution_id" },
            "clients": [...],
            "professionals": [...],
            "services": [...],
            "appointments": [...],
            "campaign_config": {
                "professional_id": "uuid",
                "days_ahead": 7,
                "offer_type": "discount|bonus",
                "offer_value": 15,
                "target_service_ids": ["uuid1", "uuid2"]  # Opcional
            }
        }
        """

        result = ExecutionResult(
            agent_type=AutomationWorkflowType.ENCHER_AGENDA,
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

            professional_id = context.campaign_config["professional_id"]
            self.logger.info(
                f"[EncherAgenda] Iniciando para profissional {professional_id}"
            )

            # Step 2: Encontrar buracos na agenda
            schedule_gaps = await self._find_schedule_gaps(context, professional_id)
            self.logger.info(
                f"[EncherAgenda] Encontrados {len(schedule_gaps)} horários vazios"
            )

            # Step 3: Para cada buraco, encontrar clientes ideais
            total_suggestions = 0
            for gap in schedule_gaps:
                try:
                    ideal_clients = await self._find_ideal_clients_for_gap(
                        context, gap, professional_id
                    )

                    for client in ideal_clients:
                        suggestion = await self._create_suggestion(
                            context, client, gap
                        )
                        result.auth_requests_created.append(suggestion)
                        total_suggestions += 1

                        # Enviar notificação
                        message = await self._generate_offer_message(
                            context, client, gap
                        )
                        await self.send_notification(
                            context=context,
                            client_id=client.id,
                            message=message,
                            channel="whatsapp",
                        )

                except Exception as e:
                    self.logger.error(f"[EncherAgenda] Erro ao processar gap: {e}")
                    continue

            # Step 4: Resultado final
            result.status = AutomationStatus.SUCCESS
            result.metrics = {
                "gaps_found": len(schedule_gaps),
                "suggestions_created": total_suggestions,
                "notifications_sent": total_suggestions,
            }

            # Disparar evento
            completion_event = CampaignCompletedEvent(
                id=f"evt_{context.agent.execution_id}",
                tenant_id=context.agent.tenant_id,
                agent_id=context.agent.agent_id,
                timestamp=datetime.now(),
                data={
                    "campaign_type": "encher_agenda",
                    "stats": result.metrics,
                    "professional_id": professional_id,
                },
            )
            await self.emit_event(completion_event)

            self.logger.info(
                f"[EncherAgenda] Campanha concluída: {total_suggestions} sugestões"
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
        """Valida contexto"""

        if not context.agent.tenant_id:
            return False, "tenant_id é obrigatório"

        if not context.clients:
            return False, "clients lista é obrigatória"

        if not context.professionals:
            return False, "professionals lista é obrigatória"

        if not context.appointments:
            return False, "appointments lista é obrigatória"

        if not context.campaign_config:
            return False, "campaign_config é obrigatório"

        professional_id = context.campaign_config.get("professional_id")
        if not professional_id:
            return False, "campaign_config.professional_id é obrigatório"

        return True, ""

    async def _find_schedule_gaps(
        self, context: ExecutionContext, professional_id: str
    ) -> List[Dict[str, Any]]:
        """
        Identifica horários vazios na agenda de um profissional

        Simplificado: retorna slots de 1h nos próximos 7 dias
        Em produção: integrar com agendador real e horários específicos
        """

        days_ahead = context.campaign_config.get("days_ahead", 7)
        gaps = []

        today = datetime.now()
        for day_offset in range(1, days_ahead + 1):
            current_date = today + timedelta(days=day_offset)

            # Skip weekends
            if current_date.weekday() >= 5:
                continue

            # Horários de funcionamento (8h-18h, 1h slot)
            for hour in range(8, 18):
                date_str = current_date.strftime("%Y-%m-%d")
                time_str = f"{hour:02d}:00"

                # Verificar se tem agendamento neste horário
                is_booked = any(
                    a.date == date_str
                    and a.time == time_str
                    and a.professional_id == professional_id
                    for a in context.appointments
                )

                if not is_booked:
                    gaps.append({
                        "date": date_str,
                        "time": time_str,
                        "duration_minutes": 60,
                        "professional_id": professional_id,
                    })

        return gaps

    async def _find_ideal_clients_for_gap(
        self,
        context: ExecutionContext,
        gap: Dict[str, Any],
        professional_id: str,
    ) -> List[ClientData]:
        """
        Encontra clientes ideais para preencher um horário vago

        Critérios (em ordem de relevância):
        1. Já fizeram serviço com este profissional antes
        2. Completaram ciclo ideal (não viram há tempos)
        3. Status 'active' (não 'lost' ou 'blocked')
        4. Não têm agendamento marcado
        """

        # Buscar clientes que já fizeram algo com este profissional
        professional = next(
            (p for p in context.professionals if p.id == professional_id), None
        )
        if not professional:
            return []

        candidate_clients = []

        for client in context.clients:
            # Skip se cliente está bloqueado ou perdido
            if client.status in ["blocked", "lost"]:
                continue

            # Verificar se já fez serviço com este profissional
            has_history = any(
                a.professional_id == professional_id and a.client_id == client.id
                for a in context.appointments
            )

            if not has_history:
                continue

            # Verificar se não tem agendamento no período
            has_appointment_soon = any(
                a.client_id == client.id
                and (
                    datetime.strptime(a.date, "%Y-%m-%d").date()
                    - datetime.strptime(gap["date"], "%Y-%m-%d").date()
                ).days
                < 7
                for a in context.appointments
            )

            if has_appointment_soon:
                continue

            candidate_clients.append(client)

        # Ranking via LLM (opcional - em MVP usar simples)
        return candidate_clients[:5]  # Limitar a 5 clientes por gap

    async def _create_suggestion(
        self,
        context: ExecutionContext,
        client: ClientData,
        gap: Dict[str, Any],
    ) -> Any:
        """Cria lazy sync request com sugestão"""

        professional_id = gap["professional_id"]

        # Buscar um serviço comum entre cliente e profissional
        professional = next(
            (p for p in context.professionals if p.id == professional_id), None
        )

        # Usar primeiro serviço que o profissional oferece
        service_id = professional.services[0] if professional.services else ""

        appointment_data = AppointmentData(
            tenant_id=context.agent.tenant_id,
            client_id=client.id,
            client_name=client.name,
            professional_id=professional_id,
            service_id=service_id,
            date=gap["date"],
            time=gap["time"],
            source="encher_agenda",
            status="pending",
        )

        offer_type = context.campaign_config.get("offer_type", "discount")
        offer_value = context.campaign_config.get("offer_value", 15)
        reason = f"Promoção: {offer_type} de {offer_value}%"

        auth_request = await self.create_auth_request(
            context, appointment_data, reason=reason
        )

        return auth_request

    async def _generate_offer_message(
        self, context: ExecutionContext, client: ClientData, gap: Dict[str, Any]
    ) -> str:
        """Gera mensagem de oferta especial"""

        offer_type = context.campaign_config.get("offer_type", "discount")
        offer_value = context.campaign_config.get("offer_value", 15)

        professional = next(
            (p for p in context.professionals if p.id == gap["professional_id"]),
            None,
        )

        prompt = f"""
        Crie uma mensagem WhatsApp urgente para um cliente:

        Cliente: {client.name}
        Profissional: {professional.name if professional else ""}
        Horário disponível: {gap["date"]} às {gap["time"]}
        Oferta especial: {offer_type} de {offer_value}%

        Requisitos:
        - Máximo 160 caracteres
        - Tom urgente/escassez: "Apenas 1 horário disponível hoje!"
        - Include call-to-action: "Confirme seu horário"
        - Ser persuasivo: mencionar que é promoção limitada
        """

        try:
            message = await self.llm.generate(prompt)
            return message
        except Exception as e:
            self.logger.error(f"Erro ao gerar oferta: {e}")
            # Fallback
            return f"Olá {client.name}! 🎉 Temos 1 horário disponível com {professional.name if professional else 'nosso time'} em {gap['date']} às {gap['time']}. {offer_type.upper()} de {offer_value}%! Confirme? https://agenda.seu-dominio.com"
