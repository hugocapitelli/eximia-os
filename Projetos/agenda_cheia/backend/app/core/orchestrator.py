# backend/app/core/orchestrator.py
"""
Orchestrator - Coordena execução de agentes

Responsabilidades:
1. Registrar agentes
2. Rotear requests para agente apropriado
3. Validar dados de entrada
4. Executar em background se necessário
5. Sincronizar resultados com frontend
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import uuid

from app.core.abstractions import Agent, Orchestrator as OrchestratorInterface
from app.core.types import (
    ExecutionContext,
    ExecutionResult,
    AutomationWorkflowType,
    Agent as AgentType,
)


logger = logging.getLogger(__name__)


class DefaultOrchestrator(OrchestratorInterface):
    """Implementação padrão do orchestrator"""

    def __init__(
        self,
        data_provider,
        llm_provider,
        notification_provider,
        event_bus,
    ):
        self.data = data_provider
        self.llm = llm_provider
        self.notify = notification_provider
        self.events = event_bus

        # Registry de agentes
        self.agents: Dict[str, Agent] = {}

        self.logger = logger

    def register_agent(self, workflow_type: str, agent: Agent):
        """Registra um agente no registry"""
        self.agents[workflow_type] = agent
        self.logger.info(f"Agent registered: {workflow_type}")

    def get_agent(self, workflow_type: str) -> Optional[Agent]:
        """Busca agente registrado"""
        return self.agents.get(workflow_type)

    def list_agents(self) -> List[str]:
        """Lista todos os agentes registrados"""
        return list(self.agents.keys())

    async def execute_workflow(
        self,
        workflow_type: str,
        tenant_id: str,
        campaign_config: Optional[Dict[str, Any]] = None,
        conversation: Optional[Dict[str, Any]] = None,
        webhook_event: Optional[Dict[str, Any]] = None,
        **kwargs,
    ) -> ExecutionResult:
        """
        Executa um workflow específico

        Args:
            workflow_type: Tipo de automação ('prazo_certo', 'encher_agenda', 'chat_ia')
            tenant_id: ID do tenant (salão)
            campaign_config: Config para campanha (prazo_certo, encher_agenda)
            conversation: Contexto para chat
            webhook_event: Evento de webhook (para integração N8N)
            **kwargs: Dados adicionais

        Returns:
            ExecutionResult com status, eventos, dados criados
        """

        # Step 1: Buscar agente
        agent = self.get_agent(workflow_type)
        if not agent:
            return ExecutionResult(
                agent_type=AutomationWorkflowType(workflow_type),
                execution_id=str(uuid.uuid4()),
                status="failed",
                error=f"Agent not found: {workflow_type}",
                started_at=datetime.now(),
                completed_at=datetime.now(),
            )

        self.logger.info(f"Executing workflow: {workflow_type} for tenant {tenant_id}")

        try:
            # Step 2: Montar contexto de execução
            execution_id = str(uuid.uuid4())
            agent_obj = AgentType(
                tenant_id=tenant_id,
                agent_id=str(uuid.uuid4()),
                agent_type=AutomationWorkflowType(workflow_type),
                execution_id=execution_id,
            )

            # Buscar dados necessários
            clients = await self.data.get_clients(tenant_id=tenant_id)
            professionals = await self.data.get_professionals(tenant_id=tenant_id)
            services = await self.data.get_services(tenant_id=tenant_id)
            appointments = await self.data.get_appointments(tenant_id=tenant_id)
            salon_config = await self.data.get_salon_config(tenant_id=tenant_id)

            # Montar ExecutionContext
            context = ExecutionContext(
                agent=agent_obj,
                clients=clients,
                professionals=professionals,
                services=services,
                appointments=appointments,
                campaign_config=campaign_config,
                conversation=conversation,
                webhook_event=webhook_event,
                salon_config=salon_config,
            )

            # Step 3: Executar agente
            result = await agent.execute(context)

            # Step 4: Processar eventos e sincronizar com frontend
            await self._process_execution_result(result, tenant_id)

            return result

        except Exception as e:
            self.logger.error(f"Erro ao executar workflow {workflow_type}: {e}", exc_info=True)
            return ExecutionResult(
                agent_type=AutomationWorkflowType(workflow_type),
                execution_id=str(uuid.uuid4()),
                status="failed",
                error=str(e),
                started_at=datetime.now(),
                completed_at=datetime.now(),
            )

    async def _process_execution_result(
        self, result: ExecutionResult, tenant_id: str
    ):
        """
        Processa resultado após agente terminar

        1. Salva execução em DB
        2. Publica eventos para React
        3. Agenda follow-ups se necessário
        """

        # Salvar execução em DB
        await self.data.save_execution(
            tenant_id=tenant_id,
            execution_id=result.execution_id,
            workflow_type=result.agent_type.value,
            status=result.status.value,
            metrics=result.metrics,
            error=result.error,
        )

        # Publicar eventos para React
        for event in result.events:
            await self.events.emit_to_frontend(tenant_id, event)

        # Se auth requests foram criados, notificar owner
        if result.auth_requests_created:
            await self._notify_owner_pending_approval(
                tenant_id, result.auth_requests_created
            )

        self.logger.info(
            f"Execution {result.execution_id} processed: {result.status.value}"
        )

    async def _notify_owner_pending_approval(self, tenant_id: str, auth_requests: List):
        """Notifica proprietário que há autorizações pendentes"""

        # Em produção: enviar push ou email para owner
        self.logger.info(
            f"Owner notification: {len(auth_requests)} auth requests pending approval"
        )

    async def schedule_workflow(
        self,
        workflow_type: str,
        tenant_id: str,
        schedule: str,  # Cron: "0 9 * * *" ou intervalo: "daily"
        campaign_config: Optional[Dict[str, Any]] = None,
        **kwargs,
    ):
        """
        Agenda um workflow para executar periodicamente

        Args:
            workflow_type: Tipo de automação
            tenant_id: ID do tenant
            schedule: Cron schedule ou intervalo ('daily', 'weekly', 'hourly')
            campaign_config: Config da campanha

        Usa Celery Beat para agendamento persistente
        """

        from app.tasks.automation_tasks import execute_automation_task

        # Normalizar schedule
        if schedule == "daily":
            cron_schedule = "0 9 * * *"  # 9h da manhã todo dia
        elif schedule == "weekly":
            cron_schedule = "0 9 * * 1"  # Seg 9h
        elif schedule == "hourly":
            cron_schedule = "0 * * * *"
        else:
            cron_schedule = schedule

        # Agendar via Celery Beat
        await self._create_celery_beat_schedule(
            workflow_type=workflow_type,
            tenant_id=tenant_id,
            schedule=cron_schedule,
            campaign_config=campaign_config,
        )

        self.logger.info(f"Workflow {workflow_type} scheduled for {schedule}")

    async def _create_celery_beat_schedule(
        self, workflow_type: str, tenant_id: str, schedule: str, campaign_config: Dict
    ):
        """
        Cria schedule no Celery Beat

        Em produção: usar Django ORM ou banco de dados
        Para MVP: usar dict em memoria (não recomendado para prod)
        """
        # TODO: Implementar persistência em banco de dados
        pass

    async def list_executions(
        self,
        tenant_id: str,
        workflow_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Lista execuções recentes

        Returns:
            Lista de execuções com status, timestamp, resultado
        """

        executions = await self.data.get_executions(
            tenant_id=tenant_id,
            workflow_type=workflow_type,
            limit=limit,
        )

        return executions

    async def get_execution_details(
        self, execution_id: str, tenant_id: str
    ) -> Dict[str, Any]:
        """Busca detalhes de uma execução"""

        details = await self.data.get_execution(execution_id, tenant_id)
        return details
