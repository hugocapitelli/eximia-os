# backend/app/providers/data_provider.py
"""
DataProvider - Implementação PostgreSQL + Prisma

Responsável por todas as operações de banco de dados
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.core.abstractions import DataProvider
from app.core.types import (
    ClientData,
    ProfessionalData,
    ServiceData,
    AppointmentData,
    AuthRequest,
)


logger = logging.getLogger(__name__)


class PostgreSQLDataProvider(DataProvider):
    """
    Implementação de DataProvider usando PostgreSQL + Prisma

    Em produção: usar Prisma Client async (prisma-client-py)
    Para MVP: usar psycopg3 (postgres adapter direto)
    """

    def __init__(self, database_url: str):
        """
        Args:
            database_url: PostgreSQL connection string
                         postgresql://user:pass@host:port/database
        """
        self.database_url = database_url
        self.db = None  # Será inicializado via async context manager

    async def initialize(self):
        """Inicializar conexão com DB (chamar no startup)"""
        try:
            # Em produção: usar Prisma Client
            # from prisma import Prisma
            # self.db = Prisma()
            # await self.db.connect()

            # Para MVP: usar psycopg pool
            import psycopg
            from psycopg_pool import AsyncConnectionPool

            self.db = AsyncConnectionPool(self.database_url, open=False)
            await self.db.open()
            logger.info("Database connection pool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise

    async def close(self):
        """Fechar conexão (chamar no shutdown)"""
        if self.db:
            await self.db.close()
            logger.info("Database connection pool closed")

    # ========================================================================
    # CLIENT OPERATIONS
    # ========================================================================

    async def get_client(self, tenant_id: str, client_id: str) -> Optional[ClientData]:
        """Busca um cliente específico"""
        query = """
            SELECT
                id, tenant_id, name, phone, email,
                last_visit, status, service_interest, professional_id
            FROM client
            WHERE id = $1 AND tenant_id = $2
        """
        async with self.db.connection() as conn:
            row = await conn.fetchrow(query, client_id, tenant_id)

        if not row:
            return None

        return ClientData(
            id=row["id"],
            tenant_id=row["tenant_id"],
            name=row["name"],
            phone=row["phone"],
            email=row["email"],
            last_visit=row["last_visit"],
            status=row["status"],
            service_interest=row["service_interest"],
            professional_id=row["professional_id"],
        )

    async def get_clients(
        self,
        tenant_id: str,
        status: Optional[str] = None,
        limit: int = 1000,
    ) -> List[ClientData]:
        """Busca clientes de um tenant"""
        query = """
            SELECT
                id, tenant_id, name, phone, email,
                last_visit, status, service_interest, professional_id
            FROM client
            WHERE tenant_id = $1
        """
        params = [tenant_id]

        if status:
            query += " AND status = $2"
            params.append(status)

        query += f" LIMIT {limit}"

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, *params)

        return [
            ClientData(
                id=row["id"],
                tenant_id=row["tenant_id"],
                name=row["name"],
                phone=row["phone"],
                email=row["email"],
                last_visit=row["last_visit"],
                status=row["status"],
                service_interest=row["service_interest"],
                professional_id=row["professional_id"],
            )
            for row in rows
        ]

    async def get_clients_for_campaign(
        self,
        tenant_id: str,
        service_id: str,
        criteria: Dict[str, Any],
    ) -> List[ClientData]:
        """
        Busca clientes que combinam com critério de campanha

        Critérios possíveis:
        - status: 'active', 'negotiating', etc
        - min_days_since_visit: dias mínimos desde última visita
        - has_completed_service: se já fez o serviço
        - exclude_blocked: não incluir bloqueados
        """

        query = """
            SELECT DISTINCT
                c.id, c.tenant_id, c.name, c.phone, c.email,
                c.last_visit, c.status, c.service_interest, c.professional_id
            FROM client c
            LEFT JOIN appointment a ON c.id = a.client_id
            WHERE c.tenant_id = $1
        """
        params = [tenant_id]

        # Filtro: clientes que já fizeram este serviço
        if criteria.get("has_completed_service"):
            query += """
                AND EXISTS (
                    SELECT 1 FROM appointment
                    WHERE client_id = c.id
                    AND service_id = $2
                    AND status = 'completed'
                )
            """
            params.append(service_id)

        # Filtro: status ativo
        if criteria.get("exclude_blocked"):
            query += " AND c.status NOT IN ('blocked', 'lost')"

        # Filtro: dias desde última visita
        if criteria.get("min_days_since_visit"):
            days = criteria["min_days_since_visit"]
            query += f"""
                AND (c.last_visit IS NULL
                     OR DATE(c.last_visit) <= CURRENT_DATE - INTERVAL '{days} days')
            """

        query += " LIMIT 1000"

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, *params)

        return [
            ClientData(
                id=row["id"],
                tenant_id=row["tenant_id"],
                name=row["name"],
                phone=row["phone"],
                email=row["email"],
                last_visit=row["last_visit"],
                status=row["status"],
                service_interest=row["service_interest"],
                professional_id=row["professional_id"],
            )
            for row in rows
        ]

    # ========================================================================
    # PROFESSIONAL OPERATIONS
    # ========================================================================

    async def get_professional(
        self, tenant_id: str, professional_id: str
    ) -> Optional[ProfessionalData]:
        """Busca um profissional específico"""
        query = """
            SELECT id, tenant_id, name, services, photo_url, folgas_dias, folgas_datas
            FROM professional
            WHERE id = $1 AND tenant_id = $2
        """
        async with self.db.connection() as conn:
            row = await conn.fetchrow(query, professional_id, tenant_id)

        if not row:
            return None

        return ProfessionalData(
            id=row["id"],
            tenant_id=row["tenant_id"],
            name=row["name"],
            services=row["services"] or [],
            photo_url=row["photo_url"],
            folgas_dias=row["folgas_dias"] or [],
            folgas_datas=row["folgas_datas"] or [],
        )

    async def get_professionals(self, tenant_id: str) -> List[ProfessionalData]:
        """Busca todos os profissionais de um tenant"""
        query = """
            SELECT id, tenant_id, name, services, photo_url, folgas_dias, folgas_datas
            FROM professional
            WHERE tenant_id = $1
            ORDER BY name
        """
        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, tenant_id)

        return [
            ProfessionalData(
                id=row["id"],
                tenant_id=row["tenant_id"],
                name=row["name"],
                services=row["services"] or [],
                photo_url=row["photo_url"],
                folgas_dias=row["folgas_dias"] or [],
                folgas_datas=row["folgas_datas"] or [],
            )
            for row in rows
        ]

    # ========================================================================
    # SERVICE OPERATIONS
    # ========================================================================

    async def get_service(self, tenant_id: str, service_id: str) -> Optional[ServiceData]:
        """Busca um serviço específico"""
        query = """
            SELECT id, tenant_id, name, duration_minutes, price, return_cycle_days
            FROM service
            WHERE id = $1 AND tenant_id = $2
        """
        async with self.db.connection() as conn:
            row = await conn.fetchrow(query, service_id, tenant_id)

        if not row:
            return None

        return ServiceData(
            id=row["id"],
            tenant_id=row["tenant_id"],
            name=row["name"],
            duration_minutes=row["duration_minutes"],
            price=row["price"],
            return_cycle_days=row["return_cycle_days"] or 30,
        )

    async def get_services(self, tenant_id: str) -> List[ServiceData]:
        """Busca todos os serviços de um tenant"""
        query = """
            SELECT id, tenant_id, name, duration_minutes, price, return_cycle_days
            FROM service
            WHERE tenant_id = $1
            ORDER BY name
        """
        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, tenant_id)

        return [
            ServiceData(
                id=row["id"],
                tenant_id=row["tenant_id"],
                name=row["name"],
                duration_minutes=row["duration_minutes"],
                price=row["price"],
                return_cycle_days=row["return_cycle_days"] or 30,
            )
            for row in rows
        ]

    # ========================================================================
    # APPOINTMENT OPERATIONS
    # ========================================================================

    async def get_appointments(
        self,
        tenant_id: str,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        professional_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[AppointmentData]:
        """Busca agendamentos"""
        query = """
            SELECT
                id, tenant_id, client_id, client_name, professional_id,
                service_id, date, time, source, status
            FROM appointment
            WHERE tenant_id = $1
        """
        params = [tenant_id]

        if date_from:
            query += " AND date >= $" + str(len(params) + 1)
            params.append(date_from)

        if date_to:
            query += " AND date <= $" + str(len(params) + 1)
            params.append(date_to)

        if professional_id:
            query += " AND professional_id = $" + str(len(params) + 1)
            params.append(professional_id)

        if status:
            query += " AND status = $" + str(len(params) + 1)
            params.append(status)

        query += " ORDER BY date, time LIMIT 5000"

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, *params)

        return [
            AppointmentData(
                tenant_id=row["tenant_id"],
                client_id=row["client_id"],
                client_name=row["client_name"],
                professional_id=row["professional_id"],
                service_id=row["service_id"],
                date=row["date"],
                time=row["time"],
                source=row["source"],
                status=row["status"],
            )
            for row in rows
        ]

    async def create_appointment(self, appointment_data: AppointmentData) -> Dict[str, Any]:
        """Cria novo agendamento"""
        import uuid

        appointment_id = str(uuid.uuid4())

        query = """
            INSERT INTO appointment
            (id, tenant_id, client_id, client_name, professional_id, service_id, date, time, source, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING id, created_at
        """

        async with self.db.connection() as conn:
            result = await conn.fetchrow(
                query,
                appointment_id,
                appointment_data.tenant_id,
                appointment_data.client_id,
                appointment_data.client_name,
                appointment_data.professional_id,
                appointment_data.service_id,
                appointment_data.date,
                appointment_data.time,
                appointment_data.source,
                appointment_data.status,
            )

        logger.info(f"Appointment created: {appointment_id}")

        return {
            "id": result["id"],
            "created_at": result["created_at"],
        }

    # ========================================================================
    # AUTH REQUEST OPERATIONS
    # ========================================================================

    async def create_auth_request(
        self,
        tenant_id: str,
        appointment_data: AppointmentData,
        created_by_agent: str,
    ) -> AuthRequest:
        """Cria lazy sync request"""
        import uuid

        request_id = str(uuid.uuid4())

        query = """
            INSERT INTO auth_request
            (id, tenant_id, appointment_data, created_by_agent, created_at, status)
            VALUES ($1, $2, $3, $4, NOW(), 'pending')
            RETURNING id, created_at
        """

        import json

        async with self.db.connection() as conn:
            result = await conn.fetchrow(
                query,
                request_id,
                tenant_id,
                json.dumps(appointment_data.dict()),
                created_by_agent,
            )

        logger.info(f"Auth request created: {request_id}")

        return AuthRequest(
            id=result["id"],
            tenant_id=tenant_id,
            appointment_data=appointment_data,
            created_by_agent=created_by_agent,
            created_at=result["created_at"],
        )

    async def get_pending_auth_requests(self, tenant_id: str) -> List[AuthRequest]:
        """Busca auth requests pendentes"""
        query = """
            SELECT id, tenant_id, appointment_data, created_by_agent, created_at
            FROM auth_request
            WHERE tenant_id = $1 AND status = 'pending'
            ORDER BY created_at DESC
            LIMIT 100
        """

        import json

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, tenant_id)

        requests = []
        for row in rows:
            appt_data = AppointmentData(**json.loads(row["appointment_data"]))
            requests.append(
                AuthRequest(
                    id=row["id"],
                    tenant_id=row["tenant_id"],
                    appointment_data=appt_data,
                    created_by_agent=row["created_by_agent"],
                    created_at=row["created_at"],
                )
            )

        return requests

    async def update_auth_request(
        self, request_id: str, status: str, tenant_id: str
    ) -> Dict[str, Any]:
        """Atualiza status de auth request"""
        query = """
            UPDATE auth_request
            SET status = $1, updated_at = NOW()
            WHERE id = $2 AND tenant_id = $3
            RETURNING id, status, updated_at
        """

        async with self.db.connection() as conn:
            result = await conn.fetchrow(query, status, request_id, tenant_id)

        logger.info(f"Auth request updated: {request_id} -> {status}")

        return {
            "id": result["id"],
            "status": result["status"],
            "updated_at": result["updated_at"],
        }

    # ========================================================================
    # CONFIG OPERATIONS
    # ========================================================================

    async def get_salon_config(self, tenant_id: str) -> Dict[str, Any]:
        """Busca configurações do salão"""
        query = """
            SELECT id, name, phone, email, cnpj, address, config_data
            FROM tenant
            WHERE id = $1
        """

        async with self.db.connection() as conn:
            row = await conn.fetchrow(query, tenant_id)

        if not row:
            return {}

        import json

        config = json.loads(row["config_data"]) if row["config_data"] else {}
        config.update({
            "name": row["name"],
            "phone": row["phone"],
            "email": row["email"],
            "cnpj": row["cnpj"],
            "address": row["address"],
        })

        return config

    async def get_ai_config(self, tenant_id: str) -> Dict[str, Any]:
        """Busca configuração de IA do salão"""
        query = """
            SELECT personality, tone, emoji_count, salon_description, custom_instructions
            FROM ai_config
            WHERE tenant_id = $1
        """

        async with self.db.connection() as conn:
            row = await conn.fetchrow(query, tenant_id)

        if not row:
            return {
                "personality": "professional",
                "tone": "friendly",
                "emoji_count": 1,
                "salon_description": "",
                "custom_instructions": "",
            }

        return {
            "personality": row["personality"],
            "tone": row["tone"],
            "emoji_count": row["emoji_count"],
            "salon_description": row["salon_description"],
            "custom_instructions": row["custom_instructions"],
        }

    async def get_available_slots(
        self,
        tenant_id: str,
        professional_id: str,
        date_from: str,
        date_to: str,
        duration_minutes: int = 60,
    ) -> List[Dict[str, str]]:
        """
        Busca horários disponíveis de um profissional

        Args:
            professional_id: UUID do profissional
            date_from: YYYY-MM-DD
            date_to: YYYY-MM-DD
            duration_minutes: Duração em minutos

        Returns:
            Lista de { date: "YYYY-MM-DD", time: "HH:MM" }
        """

        query = """
            SELECT DISTINCT
                DATE(time_slot::date) as date,
                EXTRACT(HOUR FROM time_slot::time)::int as hour
            FROM GENERATE_SERIES(
                $1::timestamp,
                $2::timestamp,
                '1 hour'::interval
            ) as time_slot
            WHERE EXTRACT(HOUR FROM time_slot::time) BETWEEN 8 AND 18
            AND EXTRACT(DOW FROM time_slot::date) NOT IN (0, 6)  -- Skip weekends
            AND NOT EXISTS (
                SELECT 1 FROM appointment
                WHERE professional_id = $3
                AND date = DATE(time_slot::date)
                AND time = LPAD(EXTRACT(HOUR FROM time_slot::time)::text, 2, '0') || ':00'
            )
        """

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, date_from, date_to, professional_id)

        return [
            {
                "date": row["date"].isoformat(),
                "time": f"{row['hour']:02d}:00",
            }
            for row in rows
        ]

    # ========================================================================
    # EXECUTION LOGGING
    # ========================================================================

    async def save_execution(
        self,
        tenant_id: str,
        execution_id: str,
        workflow_type: str,
        status: str,
        metrics: Dict[str, Any],
        error: Optional[str] = None,
    ):
        """Salva log de execução"""
        import json

        query = """
            INSERT INTO automation_execution
            (id, tenant_id, workflow_type, status, metrics, error, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (id) DO UPDATE SET
                status = $4,
                metrics = $5,
                error = $6,
                updated_at = NOW()
        """

        async with self.db.connection() as conn:
            await conn.execute(
                query,
                execution_id,
                tenant_id,
                workflow_type,
                status,
                json.dumps(metrics),
                error,
            )

        logger.info(f"Execution logged: {execution_id} -> {status}")

    async def get_executions(
        self,
        tenant_id: str,
        workflow_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Busca execuções recentes"""
        query = """
            SELECT id, tenant_id, workflow_type, status, metrics, error, created_at
            FROM automation_execution
            WHERE tenant_id = $1
        """
        params = [tenant_id]

        if workflow_type:
            query += " AND workflow_type = $2"
            params.append(workflow_type)

        query += f" ORDER BY created_at DESC LIMIT {limit}"

        import json

        async with self.db.connection() as conn:
            rows = await conn.fetchall(query, *params)

        return [
            {
                "id": row["id"],
                "workflow_type": row["workflow_type"],
                "status": row["status"],
                "metrics": json.loads(row["metrics"]) if row["metrics"] else {},
                "error": row["error"],
                "created_at": row["created_at"].isoformat(),
            }
            for row in rows
        ]
