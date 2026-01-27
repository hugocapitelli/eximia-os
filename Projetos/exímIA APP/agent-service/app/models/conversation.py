"""
ExímIA Agent Service - Conversation Models
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum

from .agent import AgentSummary


class ConversationStatus(str, Enum):
    active = "active"
    archived = "archived"


class Conversation(BaseModel):
    """Conversation model."""
    id: str
    user_id: str
    agent_id: str
    title: Optional[str] = None
    status: ConversationStatus = ConversationStatus.active
    metadata: Optional[dict] = None
    message_count: int = 0
    total_tokens: int = 0
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime] = None
    # Joined data
    agent: Optional[AgentSummary] = None


class CreateConversationInput(BaseModel):
    """Input for creating a conversation."""
    agent_id: str
    title: Optional[str] = None
    metadata: Optional[dict] = None


class UpdateConversationInput(BaseModel):
    """Input for updating a conversation."""
    title: Optional[str] = None
    status: Optional[ConversationStatus] = None
    metadata: Optional[dict] = None
