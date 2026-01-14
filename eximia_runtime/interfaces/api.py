"""REST API Interface for Eximia Runtime"""

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from eximia_runtime import __version__
from eximia_runtime.core.registry import registry
from eximia_runtime.core.agent_executor import executor
from eximia_runtime.utils.logging import setup_logging


# Request/Response models
class AgentRequest(BaseModel):
    """Request body for agent execution"""
    query: str | None = None
    input_data: dict[str, Any] | None = None
    session_id: str | None = None
    model: str | None = None

    @property
    def effective_input(self) -> str | dict[str, Any]:
        if self.query:
            return self.query
        if self.input_data:
            return self.input_data
        raise ValueError("Either 'query' or 'input_data' must be provided")


class AgentResponse(BaseModel):
    """Response from agent execution"""
    agent_name: str
    content: str
    model_used: str
    tokens_used: int
    execution_time_ms: float
    session_id: str | None = None
    metadata: dict[str, Any] | None = None


class AgentListItem(BaseModel):
    """Agent info for listing"""
    name: str
    tier: int
    category: str
    has_prompt: bool
    has_knowledge_base: bool


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    agents_count: int


# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize on startup"""
    setup_logging()
    registry.discover_agents()
    yield


# Create app
app = FastAPI(
    title="Eximia Runtime API",
    description="REST API for executing ExímIA.OS agents",
    version=__version__,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """API health check"""
    return HealthResponse(
        status="healthy",
        version=__version__,
        agents_count=len(registry.list_all()),
    )


# Agent endpoints
@app.get("/v1/agents", response_model=list[AgentListItem])
async def list_agents(
    category: str | None = None,
    tier: int | None = None,
):
    """List all available agents"""
    agents = registry.list_all()

    if category:
        agents = [a for a in agents if a.category == category]
    if tier:
        agents = [a for a in agents if a.tier == tier]

    return [
        AgentListItem(
            name=a.name,
            tier=a.tier,
            category=a.category,
            has_prompt=a.has_system_prompt,
            has_knowledge_base=a.has_knowledge_base,
        )
        for a in agents
    ]


@app.get("/v1/agents/{agent_name}")
async def get_agent(agent_name: str):
    """Get agent details"""
    agent = registry.get(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")

    return {
        "name": agent.name,
        "tier": agent.tier,
        "category": agent.category,
        "path": str(agent.path),
        "has_system_prompt": agent.has_system_prompt,
        "has_knowledge_base": agent.has_knowledge_base,
        "has_schemas": agent.has_schemas,
        "capabilities": agent.capabilities,
    }


@app.get("/v1/agents/{agent_name}/health")
async def agent_health(agent_name: str):
    """Health check for specific agent"""
    agent = registry.get(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")

    return {
        "name": agent.name,
        "status": "ready" if agent.has_system_prompt else "incomplete",
        "has_prompt": agent.has_system_prompt,
        "has_kb": agent.has_knowledge_base,
    }


@app.post("/v1/agents/{agent_name}/execute", response_model=AgentResponse)
async def execute_agent(agent_name: str, request: AgentRequest):
    """Execute an agent with the given input"""
    try:
        result = await executor.execute(
            agent_name=agent_name,
            input_data=request.effective_input,
            session_id=request.session_id,
            model_override=request.model,
        )

        return AgentResponse(
            agent_name=result.agent_name,
            content=result.content,
            model_used=result.model_used,
            tokens_used=result.tokens_used,
            execution_time_ms=result.execution_time_ms,
            session_id=result.session_id,
            metadata=result.metadata,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")


# Root redirect
@app.get("/")
async def root():
    """Redirect to docs"""
    return {"message": "Eximia Runtime API", "docs": "/docs", "version": __version__}


# Metrics endpoints
@app.get("/v1/metrics")
async def get_metrics():
    """Get global metrics summary"""
    from eximia_runtime.utils.metrics import metrics
    return metrics.get_global_stats()


@app.get("/v1/metrics/agents/{agent_name}")
async def get_agent_metrics(agent_name: str):
    """Get metrics for specific agent"""
    from eximia_runtime.utils.metrics import metrics
    return metrics.get_agent_stats(agent_name)


@app.get("/v1/metrics/recent")
async def get_recent_metrics(limit: int = 20):
    """Get recent execution metrics"""
    from eximia_runtime.utils.metrics import metrics
    return metrics.get_recent_metrics(limit)


# Tracing endpoints
@app.get("/v1/traces")
async def get_traces(limit: int = 10):
    """Get recent traces"""
    from eximia_runtime.utils.tracing import tracer
    return tracer.get_recent_traces(limit)


@app.get("/v1/traces/{trace_id}")
async def get_trace(trace_id: str):
    """Get specific trace"""
    from eximia_runtime.utils.tracing import tracer
    trace = tracer.get_trace(trace_id)
    if not trace:
        raise HTTPException(status_code=404, detail=f"Trace '{trace_id}' not found")
    return trace


# Orchestration endpoint
@app.post("/v1/orchestrate")
async def orchestrate(request: AgentRequest):
    """Orchestrate a request through Maestro routing"""
    from eximia_runtime.core.orchestrator import orchestrator
    
    try:
        result = await orchestrator.route(
            request=request.effective_input if isinstance(request.effective_input, str) else str(request.effective_input),
            apply_veritas_first=True,
            session_id=request.session_id,
        )
        
        return {
            "response": result.final_response,
            "agents_used": result.agents_used,
            "total_tokens": result.total_tokens,
            "time_ms": result.total_time_ms,
            "veritas_validated": result.veritas_validation is not None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

