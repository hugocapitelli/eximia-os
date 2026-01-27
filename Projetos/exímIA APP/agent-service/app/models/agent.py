"""
ExímIA Agent Service - Agent Models
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class AgentTier(str, Enum):
    tier_0 = "tier_0"
    tier_1 = "tier_1"
    tier_2 = "tier_2"
    tier_3 = "tier_3"


class AgentStatus(str, Enum):
    active = "active"
    validating = "validating"
    inactive = "inactive"


class Agent(BaseModel):
    """Full agent model."""
    id: str
    name: str
    slug: str
    domain: str
    subdomain: Optional[str] = None
    tier: AgentTier
    version: str
    status: AgentStatus
    fidelity_score: Optional[float] = None
    avatar_url: Optional[str] = None
    description: str
    use_cases: list[str] = Field(default_factory=list)
    avoid_cases: list[str] = Field(default_factory=list)
    system_prompt: str
    knowledge_bases: Optional[dict] = None
    tags: list[str] = Field(default_factory=list)
    times_invoked: int = 0
    avg_rating: Optional[float] = None
    default_model: Optional[str] = "gpt-4"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 4096
    created_at: datetime
    updated_at: datetime


class AgentSummary(BaseModel):
    """Summary agent model for listings."""
    id: str
    name: str
    slug: str
    domain: str
    tier: AgentTier
    status: AgentStatus
    fidelity_score: Optional[float] = None
    avatar_url: Optional[str] = None
    description: str
    tags: list[str] = Field(default_factory=list)
    times_invoked: int = 0
    avg_rating: Optional[float] = None


class AgentSearchFilters(BaseModel):
    """Filters for searching agents."""
    query: Optional[str] = None
    domain: Optional[str] = None
    tier: Optional[AgentTier] = None
    status: Optional[AgentStatus] = AgentStatus.active
    tags: Optional[list[str]] = None
    limit: int = Field(default=10, ge=1, le=50)
