# backend/app/providers/event_bus.py
"""
EventBus - Sistema de pub/sub para eventos

Responsável por:
- Publicar eventos dos agentes
- Rotear para subscritores
- Enviar para React via WebSocket
"""

from typing import Callable, Dict, List, Optional
from datetime import datetime
import logging
import json
import asyncio

from app.core.abstractions import EventBus
from app.core.types import Event


logger = logging.getLogger(__name__)


class RedisEventBus(EventBus):
    """
    EventBus implementado com Redis Pub/Sub

    Suporta:
    - Pub/Sub entre processos (Celery, múltiplas instâncias FastAPI)
    - Persistência de eventos (opcional)
    - Broadcast para React via WebSocket
    """

    def __init__(self, redis_url: str):
        """
        Args:
            redis_url: Redis connection URL (redis://localhost:6379)
        """
        self.redis_url = redis_url
        self.redis = None
        self.subscriptions: Dict[str, List[Callable]] = {}
        self.websocket_connections: Dict[str, List] = {}  # tenant_id -> [ws connections]

        logger.info("RedisEventBus initialized")

    async def initialize(self):
        """Inicializar conexão com Redis (chamar no startup)"""
        try:
            import redis.asyncio as redis_module

            self.redis = await redis_module.from_url(
                self.redis_url,
                encoding="utf8",
                decode_responses=True,
            )

            # Test connection
            await self.redis.ping()
            logger.info("Redis connection established")

        except Exception as e:
            logger.error(f"Failed to initialize Redis: {e}")
            raise

    async def close(self):
        """Fechar conexão com Redis"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis connection closed")

    async def publish(self, event: Event):
        """
        Publica evento no Redis

        Args:
            event: Event a publicar
        """

        if not self.redis:
            logger.warning("Redis not initialized - skipping publish")
            return

        try:
            # Serializar evento
            event_json = event.json()

            # Publicar no Redis
            channel = f"events:{event.event_type}"
            subscribers = await self.redis.publish(channel, event_json)

            logger.info(
                f"Event published: {event.event_type} (subscribers: {subscribers})"
            )

            # Salvar em histórico (opcional)
            await self._save_event_history(event)

            # Notificar subscritores locais (sem Redis)
            await self._notify_local_subscribers(event)

        except Exception as e:
            logger.error(f"Error publishing event: {e}")

    async def subscribe(self, event_type: str, callback: Callable):
        """
        Subscreve a um tipo de evento

        Args:
            event_type: Tipo de evento (ex: "auth_request_created")
            callback: Função async a chamar quando evento chegar
        """

        if event_type not in self.subscriptions:
            self.subscriptions[event_type] = []

        self.subscriptions[event_type].append(callback)

        logger.info(f"Subscription created: {event_type} -> {callback.__name__}")

    async def emit_to_frontend(self, tenant_id: str, event: Event):
        """
        Emite evento direto para React (via WebSocket)

        Args:
            tenant_id: Tenant ID (para rotear para cliente certo)
            event: Event a enviar
        """

        if tenant_id not in self.websocket_connections:
            logger.debug(f"No WebSocket connections for tenant {tenant_id}")
            return

        # Preparar payload
        payload = {
            "event_type": event.event_type,
            "timestamp": event.timestamp.isoformat(),
            "data": event.data,
        }

        # Enviar para todos os clientes WebSocket conectados
        disconnected = []
        for ws in self.websocket_connections[tenant_id]:
            try:
                await ws.send_json(payload)
                logger.debug(f"Event sent to WebSocket: {event.event_type}")
            except Exception as e:
                logger.warning(f"Failed to send to WebSocket: {e}")
                disconnected.append(ws)

        # Limpar WebSockets desconectados
        for ws in disconnected:
            try:
                self.websocket_connections[tenant_id].remove(ws)
            except ValueError:
                pass

    async def subscribe_to_redis(self, event_type: str):
        """
        Subscreve a canal Redis para distribuir eventos

        Usado para multi-processo
        """

        if not self.redis:
            logger.warning("Redis not initialized")
            return

        try:
            pubsub = self.redis.pubsub()
            channel = f"events:{event_type}"

            await pubsub.subscribe(channel)
            logger.info(f"Redis subscription created: {channel}")

            # Loop para ouvir eventos
            async for message in pubsub.listen():
                if message["type"] == "message":
                    try:
                        event_data = json.loads(message["data"])
                        event = Event(**event_data)

                        # Notificar subscritores locais
                        await self._notify_local_subscribers(event)

                    except Exception as e:
                        logger.error(f"Error processing Redis message: {e}")

        except Exception as e:
            logger.error(f"Error in Redis subscription: {e}")

    # ========================================================================
    # INTERNAL METHODS
    # ========================================================================

    async def _notify_local_subscribers(self, event: Event):
        """Notifica subscritores locais (mesmo processo)"""

        event_type = event.event_type

        if event_type not in self.subscriptions:
            return

        for callback in self.subscriptions[event_type]:
            try:
                # Se callback é async
                if asyncio.iscoroutinefunction(callback):
                    await callback(event)
                else:
                    callback(event)

                logger.debug(f"Local subscriber notified: {callback.__name__}")

            except Exception as e:
                logger.error(f"Error in subscriber callback: {e}")

    async def _save_event_history(self, event: Event):
        """Salva evento em histórico (Redis sorted set)"""

        if not self.redis:
            return

        try:
            key = f"event_history:{event.tenant_id}:{event.event_type}"
            score = datetime.now().timestamp()

            await self.redis.zadd(
                key,
                {event.json(): score},
            )

            # Limpar eventos antigos (guardar últimos 1000)
            await self.redis.zremrangebyrank(key, 0, -1001)

        except Exception as e:
            logger.warning(f"Failed to save event history: {e}")

    async def register_websocket(self, tenant_id: str, websocket):
        """Registra nova conexão WebSocket"""

        if tenant_id not in self.websocket_connections:
            self.websocket_connections[tenant_id] = []

        self.websocket_connections[tenant_id].append(websocket)
        logger.info(f"WebSocket registered: {tenant_id} ({len(self.websocket_connections[tenant_id])} connections)")

    async def unregister_websocket(self, tenant_id: str, websocket):
        """Remove conexão WebSocket"""

        if tenant_id in self.websocket_connections:
            try:
                self.websocket_connections[tenant_id].remove(websocket)
                logger.info(f"WebSocket unregistered: {tenant_id}")
            except ValueError:
                pass

    async def get_event_history(
        self, tenant_id: str, event_type: str, limit: int = 100
    ) -> List[Event]:
        """Busca histórico de eventos"""

        if not self.redis:
            return []

        try:
            key = f"event_history:{tenant_id}:{event_type}"

            # Buscar últimos `limit` eventos (ordenado por score DESC)
            results = await self.redis.zrevrange(key, 0, limit - 1)

            events = []
            for data in results:
                try:
                    event = Event(**json.loads(data))
                    events.append(event)
                except Exception as e:
                    logger.warning(f"Failed to parse event: {e}")

            return events

        except Exception as e:
            logger.error(f"Error fetching event history: {e}")
            return []

    async def clear_history(self, tenant_id: str, event_type: Optional[str] = None):
        """Limpa histórico de eventos"""

        if not self.redis:
            return

        try:
            if event_type:
                key = f"event_history:{tenant_id}:{event_type}"
                await self.redis.delete(key)
            else:
                # Limpar todos os eventos do tenant
                pattern = f"event_history:{tenant_id}:*"
                keys = await self.redis.keys(pattern)
                if keys:
                    await self.redis.delete(*keys)

            logger.info(f"Event history cleared: {tenant_id}")

        except Exception as e:
            logger.error(f"Error clearing event history: {e}")


class InMemoryEventBus(EventBus):
    """
    EventBus em memória (apenas para testes/desenvolvimento)

    NÃO usar em produção com múltiplos processos
    """

    def __init__(self):
        self.subscriptions: Dict[str, List[Callable]] = {}
        self.event_history: List[Event] = []
        self.websocket_connections: Dict[str, List] = {}

        logger.info("InMemoryEventBus initialized (dev only)")

    async def initialize(self):
        """Noop para interface compatível"""
        pass

    async def close(self):
        """Noop para interface compatível"""
        pass

    async def publish(self, event: Event):
        """Publica evento em memória"""

        self.event_history.append(event)
        logger.debug(f"Event published (in-memory): {event.event_type}")

        # Notificar subscritores
        await self._notify_subscribers(event)

        # Enviar para WebSockets
        await self.emit_to_frontend(event.tenant_id, event)

    async def subscribe(self, event_type: str, callback: Callable):
        """Subscreve a tipo de evento"""

        if event_type not in self.subscriptions:
            self.subscriptions[event_type] = []

        self.subscriptions[event_type].append(callback)

    async def emit_to_frontend(self, tenant_id: str, event: Event):
        """Emite para WebSockets conectados"""

        if tenant_id not in self.websocket_connections:
            return

        payload = {
            "event_type": event.event_type,
            "timestamp": event.timestamp.isoformat(),
            "data": event.data,
        }

        for ws in self.websocket_connections[tenant_id]:
            try:
                await ws.send_json(payload)
            except Exception as e:
                logger.warning(f"Failed to send to WebSocket: {e}")

    async def _notify_subscribers(self, event: Event):
        """Notifica subscritores"""

        event_type = event.event_type

        if event_type not in self.subscriptions:
            return

        for callback in self.subscriptions[event_type]:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(event)
                else:
                    callback(event)
            except Exception as e:
                logger.error(f"Error in subscriber: {e}")

    async def register_websocket(self, tenant_id: str, websocket):
        """Registra WebSocket"""
        if tenant_id not in self.websocket_connections:
            self.websocket_connections[tenant_id] = []
        self.websocket_connections[tenant_id].append(websocket)

    async def unregister_websocket(self, tenant_id: str, websocket):
        """Remove WebSocket"""
        if tenant_id in self.websocket_connections:
            try:
                self.websocket_connections[tenant_id].remove(websocket)
            except ValueError:
                pass
