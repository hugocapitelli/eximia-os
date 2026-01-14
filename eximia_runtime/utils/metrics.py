"""Metrics collection for agent executions"""

import time
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from collections import defaultdict

import structlog


logger = structlog.get_logger()


@dataclass
class ExecutionMetric:
    """Single execution metric"""
    agent_name: str
    model: str
    tokens_used: int
    execution_time_ms: float
    success: bool
    timestamp: datetime = field(default_factory=datetime.now)
    session_id: str | None = None
    error: str | None = None


class MetricsCollector:
    """
    Collects and aggregates metrics from agent executions.
    
    Provides:
    - Per-agent statistics
    - Token usage tracking
    - Latency percentiles
    - Error rates
    """

    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self._metrics: list[ExecutionMetric] = []
        self._agent_stats: dict[str, dict] = defaultdict(lambda: {
            "total_calls": 0,
            "successful_calls": 0,
            "total_tokens": 0,
            "total_time_ms": 0,
            "errors": [],
        })

    def record(
        self,
        agent_name: str,
        model: str,
        tokens_used: int,
        execution_time_ms: float,
        success: bool = True,
        session_id: str | None = None,
        error: str | None = None,
    ) -> None:
        """Record an execution metric"""
        metric = ExecutionMetric(
            agent_name=agent_name,
            model=model,
            tokens_used=tokens_used,
            execution_time_ms=execution_time_ms,
            success=success,
            session_id=session_id,
            error=error,
        )

        self._metrics.append(metric)

        # Trim history if needed
        if len(self._metrics) > self.max_history:
            self._metrics = self._metrics[-self.max_history:]

        # Update agent stats
        stats = self._agent_stats[agent_name]
        stats["total_calls"] += 1
        stats["total_tokens"] += tokens_used
        stats["total_time_ms"] += execution_time_ms

        if success:
            stats["successful_calls"] += 1
        else:
            stats["errors"].append({
                "time": datetime.now().isoformat(),
                "error": error,
            })
            # Keep only last 10 errors
            stats["errors"] = stats["errors"][-10:]

        logger.debug(
            "metric_recorded",
            agent=agent_name,
            tokens=tokens_used,
            time_ms=execution_time_ms,
            success=success,
        )

    def get_agent_stats(self, agent_name: str) -> dict[str, Any]:
        """Get statistics for a specific agent"""
        stats = self._agent_stats.get(agent_name)
        if not stats:
            return {"error": "No data for agent"}

        total = stats["total_calls"]
        if total == 0:
            return stats

        return {
            "total_calls": total,
            "successful_calls": stats["successful_calls"],
            "success_rate": stats["successful_calls"] / total,
            "total_tokens": stats["total_tokens"],
            "avg_tokens": stats["total_tokens"] / total,
            "avg_time_ms": stats["total_time_ms"] / total,
            "recent_errors": stats["errors"][-5:],
        }

    def get_global_stats(self) -> dict[str, Any]:
        """Get global statistics across all agents"""
        if not self._metrics:
            return {"message": "No metrics collected yet"}

        total_calls = len(self._metrics)
        successful = sum(1 for m in self._metrics if m.success)
        total_tokens = sum(m.tokens_used for m in self._metrics)
        total_time = sum(m.execution_time_ms for m in self._metrics)

        # Top agents by usage
        agent_calls = defaultdict(int)
        for m in self._metrics:
            agent_calls[m.agent_name] += 1

        top_agents = sorted(agent_calls.items(), key=lambda x: -x[1])[:5]

        return {
            "total_calls": total_calls,
            "successful_calls": successful,
            "success_rate": successful / total_calls if total_calls else 0,
            "total_tokens": total_tokens,
            "avg_tokens_per_call": total_tokens / total_calls if total_calls else 0,
            "avg_latency_ms": total_time / total_calls if total_calls else 0,
            "top_agents": [{"agent": a, "calls": c} for a, c in top_agents],
            "unique_agents": len(agent_calls),
        }

    def get_recent_metrics(self, limit: int = 20) -> list[dict]:
        """Get recent execution metrics"""
        return [
            {
                "agent": m.agent_name,
                "model": m.model,
                "tokens": m.tokens_used,
                "time_ms": m.execution_time_ms,
                "success": m.success,
                "timestamp": m.timestamp.isoformat(),
            }
            for m in self._metrics[-limit:]
        ]

    def export_summary(self) -> dict[str, Any]:
        """Export full metrics summary"""
        return {
            "global": self.get_global_stats(),
            "by_agent": {
                name: self.get_agent_stats(name)
                for name in self._agent_stats.keys()
            },
            "recent": self.get_recent_metrics(10),
        }


# Singleton instance
metrics = MetricsCollector()
