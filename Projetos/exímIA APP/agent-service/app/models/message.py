"""
ExímIA Agent Service - Message Models
"""
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class Message(BaseModel):
    """Message model."""
    id: str
    conversation_id: str
    role: MessageRole
    content: str
    tokens_used: Optional[int] = None
    metadata: Optional[dict] = None
    created_at: datetime


class SendMessageInput(BaseModel):
    """Input for sending a message."""
    content: str
    metadata: Optional[dict] = None


class StreamChunk(BaseModel):
    """Streaming chunk model."""
    type: Literal["content", "done", "error"]
    content: Optional[str] = None
    message_id: Optional[str] = None
    tokens_used: Optional[int] = None
    error: Optional[str] = None
