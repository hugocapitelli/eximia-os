"""
ExímIA Agent Service - Chat Service

Business logic for chat operations.
"""
import logging
from typing import AsyncGenerator, Optional
from uuid import UUID

from app.services.supabase import get_supabase_client
from app.services.llm_service import get_llm_service
from app.models.agent import Agent, AgentSummary
from app.models.conversation import Conversation, CreateConversationInput
from app.models.message import Message, MessageRole, StreamChunk

logger = logging.getLogger(__name__)


class ChatService:
    """Service for chat operations."""

    def __init__(self):
        self.supabase = get_supabase_client()
        self.llm = get_llm_service()

    # ═══════════════════════════════════════════════════════════════════
    # AGENTS
    # ═══════════════════════════════════════════════════════════════════

    async def get_agents(
        self,
        query: Optional[str] = None,
        domain: Optional[str] = None,
        limit: int = 10,
    ) -> list[AgentSummary]:
        """Get list of agents."""
        q = self.supabase.table("agents").select(
            "id, name, slug, domain, tier, status, fidelity_score, "
            "avatar_url, description, tags, times_invoked, avg_rating"
        ).eq("status", "active")

        if domain:
            q = q.eq("domain", domain)

        if query:
            q = q.or_(f"name.ilike.%{query}%,description.ilike.%{query}%,domain.ilike.%{query}%")

        q = q.order("times_invoked", desc=True).limit(limit)

        result = q.execute()
        return [AgentSummary(**agent) for agent in result.data]

    async def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID."""
        result = self.supabase.table("agents").select("*").eq("id", agent_id).single().execute()
        return Agent(**result.data) if result.data else None

    async def get_agent_by_slug(self, slug: str) -> Optional[Agent]:
        """Get agent by slug."""
        result = self.supabase.table("agents").select("*").eq("slug", slug).single().execute()
        return Agent(**result.data) if result.data else None

    # ═══════════════════════════════════════════════════════════════════
    # CONVERSATIONS
    # ═══════════════════════════════════════════════════════════════════

    async def get_conversations(
        self,
        user_id: str,
        agent_id: Optional[str] = None,
        status: str = "active",
        limit: int = 20,
    ) -> list[Conversation]:
        """Get user's conversations."""
        q = self.supabase.table("conversations").select(
            "*, agents(id, name, slug, domain, tier, status, fidelity_score, avatar_url, description, tags)"
        ).eq("user_id", user_id).eq("status", status)

        if agent_id:
            q = q.eq("agent_id", agent_id)

        q = q.order("last_message_at", desc=True, nullsfirst=False).limit(limit)

        result = q.execute()

        conversations = []
        for item in result.data:
            agent_data = item.pop("agents", None)
            conv = Conversation(**item)
            if agent_data:
                conv.agent = AgentSummary(**agent_data)
            conversations.append(conv)

        return conversations

    async def get_conversation(self, conversation_id: str, user_id: str) -> Optional[Conversation]:
        """Get conversation by ID."""
        result = self.supabase.table("conversations").select(
            "*, agents(id, name, slug, domain, tier, status, fidelity_score, avatar_url, description, tags)"
        ).eq("id", conversation_id).eq("user_id", user_id).single().execute()

        if not result.data:
            return None

        agent_data = result.data.pop("agents", None)
        conv = Conversation(**result.data)
        if agent_data:
            conv.agent = AgentSummary(**agent_data)

        return conv

    async def create_conversation(
        self,
        user_id: str,
        input_data: CreateConversationInput,
    ) -> Conversation:
        """Create a new conversation."""
        # Verify agent exists
        agent = await self.get_agent(input_data.agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {input_data.agent_id}")

        data = {
            "user_id": user_id,
            "agent_id": input_data.agent_id,
            "title": input_data.title or f"Conversa com {agent.name}",
            "metadata": input_data.metadata or {},
        }

        result = self.supabase.table("conversations").insert(data).execute()
        conv = Conversation(**result.data[0])
        conv.agent = AgentSummary(
            id=agent.id,
            name=agent.name,
            slug=agent.slug,
            domain=agent.domain,
            tier=agent.tier,
            status=agent.status,
            fidelity_score=agent.fidelity_score,
            avatar_url=agent.avatar_url,
            description=agent.description,
            tags=agent.tags,
            times_invoked=agent.times_invoked,
            avg_rating=agent.avg_rating,
        )
        return conv

    async def archive_conversation(self, conversation_id: str, user_id: str) -> bool:
        """Archive a conversation."""
        result = self.supabase.table("conversations").update(
            {"status": "archived"}
        ).eq("id", conversation_id).eq("user_id", user_id).execute()
        return len(result.data) > 0

    # ═══════════════════════════════════════════════════════════════════
    # MESSAGES
    # ═══════════════════════════════════════════════════════════════════

    async def get_messages(
        self,
        conversation_id: str,
        user_id: str,
        limit: int = 50,
        before: Optional[str] = None,
    ) -> list[Message]:
        """Get messages for a conversation."""
        # Verify ownership
        conv = await self.get_conversation(conversation_id, user_id)
        if not conv:
            raise ValueError("Conversation not found")

        q = self.supabase.table("messages").select("*").eq(
            "conversation_id", conversation_id
        )

        if before:
            q = q.lt("created_at", before)

        q = q.order("created_at", desc=True).limit(limit)

        result = q.execute()
        # Reverse to get chronological order
        return [Message(**msg) for msg in reversed(result.data)]

    async def send_message(
        self,
        conversation_id: str,
        user_id: str,
        content: str,
        stream: bool = False,
    ) -> Message | AsyncGenerator[StreamChunk, None]:
        """
        Send a message and get AI response.

        If stream=True, returns an async generator of StreamChunks.
        If stream=False, returns the complete Message.
        """
        # Get conversation with agent
        conv = await self.get_conversation(conversation_id, user_id)
        if not conv:
            raise ValueError("Conversation not found")

        agent = await self.get_agent(conv.agent_id)
        if not agent:
            raise ValueError("Agent not found")

        # Save user message
        user_msg_data = {
            "conversation_id": conversation_id,
            "role": "user",
            "content": content,
        }
        user_msg_result = self.supabase.table("messages").insert(user_msg_data).execute()
        user_msg = Message(**user_msg_result.data[0])

        # Build message history
        history = await self.get_messages(conversation_id, user_id, limit=20)

        messages = [{"role": "system", "content": agent.system_prompt}]
        for msg in history:
            messages.append({"role": msg.role.value, "content": msg.content})

        # Get model config from agent
        model = agent.default_model or "gpt-4"
        temperature = agent.temperature or 0.7
        max_tokens = agent.max_tokens or 4096

        if stream:
            return self._stream_response(
                conversation_id, messages, model, temperature, max_tokens
            )
        else:
            return await self._complete_response(
                conversation_id, messages, model, temperature, max_tokens
            )

    async def _complete_response(
        self,
        conversation_id: str,
        messages: list[dict],
        model: str,
        temperature: float,
        max_tokens: int,
    ) -> Message:
        """Get complete (non-streaming) response."""
        response_content, tokens = await self.llm.chat(
            messages, model, temperature, max_tokens
        )

        # Save assistant message
        assistant_msg_data = {
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": response_content,
            "tokens_used": tokens,
        }
        result = self.supabase.table("messages").insert(assistant_msg_data).execute()
        return Message(**result.data[0])

    async def _stream_response(
        self,
        conversation_id: str,
        messages: list[dict],
        model: str,
        temperature: float,
        max_tokens: int,
    ) -> AsyncGenerator[StreamChunk, None]:
        """Stream response."""
        full_content = ""
        tokens_estimate = 0

        try:
            async for chunk in self.llm.chat_stream(
                messages, model, temperature, max_tokens
            ):
                full_content += chunk
                tokens_estimate += len(chunk) // 4  # Rough estimate
                yield StreamChunk(type="content", content=chunk)

            # Save completed message
            assistant_msg_data = {
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": full_content,
                "tokens_used": tokens_estimate,
            }
            result = self.supabase.table("messages").insert(assistant_msg_data).execute()
            message = Message(**result.data[0])

            yield StreamChunk(
                type="done",
                message_id=message.id,
                tokens_used=message.tokens_used,
            )

        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield StreamChunk(type="error", error=str(e))


# Singleton instance
_chat_service: Optional[ChatService] = None


def get_chat_service() -> ChatService:
    """Get or create chat service singleton."""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service
