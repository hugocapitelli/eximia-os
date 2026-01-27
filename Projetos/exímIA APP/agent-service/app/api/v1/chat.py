"""
ExímIA Agent Service - Chat Router

Endpoints for chat conversations with AI agents.
"""
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import StreamingResponse

from app.api.deps import get_current_user_id
from app.services.chat_service import get_chat_service
from app.models.conversation import Conversation, CreateConversationInput
from app.models.message import Message, SendMessageInput, StreamChunk

router = APIRouter(prefix="/chat", tags=["chat"])


# ═══════════════════════════════════════════════════════════════════
# CONVERSATIONS
# ═══════════════════════════════════════════════════════════════════

@router.get("/conversations", response_model=list[Conversation])
async def list_conversations(
    agent_id: Optional[str] = Query(None, description="Filter by agent"),
    status: str = Query("active", description="Filter by status"),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
):
    """
    List user's conversations.
    """
    service = get_chat_service()
    conversations = await service.get_conversations(
        user_id=user_id,
        agent_id=agent_id,
        status=status,
        limit=limit,
    )
    return conversations


@router.post("/conversations", response_model=Conversation)
async def create_conversation(
    input_data: CreateConversationInput,
    user_id: str = Depends(get_current_user_id),
):
    """
    Create a new conversation with an agent.
    """
    service = get_chat_service()

    try:
        conversation = await service.create_conversation(user_id, input_data)
        return conversation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Get conversation details.
    """
    service = get_chat_service()
    conversation = await service.get_conversation(conversation_id, user_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation


@router.delete("/conversations/{conversation_id}")
async def archive_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Archive a conversation.
    """
    service = get_chat_service()
    success = await service.archive_conversation(conversation_id, user_id)

    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {"status": "archived"}


# ═══════════════════════════════════════════════════════════════════
# MESSAGES
# ═══════════════════════════════════════════════════════════════════

@router.get("/conversations/{conversation_id}/messages", response_model=list[Message])
async def list_messages(
    conversation_id: str,
    limit: int = Query(50, ge=1, le=100),
    before: Optional[str] = Query(None, description="Get messages before this timestamp"),
    user_id: str = Depends(get_current_user_id),
):
    """
    Get messages for a conversation.
    """
    service = get_chat_service()

    try:
        messages = await service.get_messages(
            conversation_id=conversation_id,
            user_id=user_id,
            limit=limit,
            before=before,
        )
        return messages
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/conversations/{conversation_id}/messages", response_model=Message)
async def send_message(
    conversation_id: str,
    input_data: SendMessageInput,
    user_id: str = Depends(get_current_user_id),
):
    """
    Send a message and get AI response (non-streaming).
    """
    service = get_chat_service()

    try:
        message = await service.send_message(
            conversation_id=conversation_id,
            user_id=user_id,
            content=input_data.content,
            stream=False,
        )
        return message
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/conversations/{conversation_id}/messages/stream")
async def send_message_stream(
    conversation_id: str,
    input_data: SendMessageInput,
    user_id: str = Depends(get_current_user_id),
):
    """
    Send a message and stream the AI response.

    Returns Server-Sent Events (SSE) with StreamChunk objects.
    """
    service = get_chat_service()

    try:
        stream = await service.send_message(
            conversation_id=conversation_id,
            user_id=user_id,
            content=input_data.content,
            stream=True,
        )

        async def event_generator():
            async for chunk in stream:
                yield f"data: {chunk.model_dump_json()}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


# ═══════════════════════════════════════════════════════════════════
# QUICK CHAT (Convenience endpoint)
# ═══════════════════════════════════════════════════════════════════

@router.post("/quick/{agent_slug}")
async def quick_chat(
    agent_slug: str,
    input_data: SendMessageInput,
    stream: bool = Query(False, description="Stream response"),
    user_id: str = Depends(get_current_user_id),
):
    """
    Quick chat with an agent.

    Creates a new conversation if needed and sends the message.
    """
    service = get_chat_service()

    # Get agent by slug
    agent = await service.get_agent_by_slug(agent_slug)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # Create conversation
    conversation = await service.create_conversation(
        user_id=user_id,
        input_data=CreateConversationInput(
            agent_id=agent.id,
            title=f"Chat com {agent.name}",
        ),
    )

    # Send message
    if stream:
        stream_gen = await service.send_message(
            conversation_id=conversation.id,
            user_id=user_id,
            content=input_data.content,
            stream=True,
        )

        async def event_generator():
            # First, send conversation info
            yield f"data: {json.dumps({'type': 'conversation', 'conversation_id': conversation.id})}\n\n"
            async for chunk in stream_gen:
                yield f"data: {chunk.model_dump_json()}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
        )
    else:
        message = await service.send_message(
            conversation_id=conversation.id,
            user_id=user_id,
            content=input_data.content,
            stream=False,
        )
        return {
            "conversation_id": conversation.id,
            "message": message,
        }
