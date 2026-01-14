"""Tracing for multi-agent interactions"""

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from contextvars import ContextVar

import structlog


logger = structlog.get_logger()

# Context variable for trace propagation
current_trace_id: ContextVar[str | None] = ContextVar("current_trace_id", default=None)
current_span_id: ContextVar[str | None] = ContextVar("current_span_id", default=None)


@dataclass
class Span:
    """A single span in a trace"""
    span_id: str
    trace_id: str
    parent_span_id: str | None
    operation: str
    agent_name: str | None
    start_time: datetime
    end_time: datetime | None = None
    status: str = "in_progress"
    attributes: dict[str, Any] = field(default_factory=dict)
    events: list[dict] = field(default_factory=list)

    @property
    def duration_ms(self) -> float | None:
        if self.end_time:
            return (self.end_time - self.start_time).total_seconds() * 1000
        return None

    def to_dict(self) -> dict:
        return {
            "span_id": self.span_id,
            "trace_id": self.trace_id,
            "parent_span_id": self.parent_span_id,
            "operation": self.operation,
            "agent": self.agent_name,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration_ms": self.duration_ms,
            "status": self.status,
            "attributes": self.attributes,
            "events": self.events,
        }


class Tracer:
    """
    Distributed tracing for multi-agent workflows.
    
    Enables tracking of:
    - Request flow through agents
    - Handoff chains
    - Orchestration paths
    - Error propagation
    """

    def __init__(self, max_traces: int = 100):
        self.max_traces = max_traces
        self._traces: dict[str, list[Span]] = {}
        self._trace_order: list[str] = []

    def start_trace(self, operation: str = "request") -> str:
        """Start a new trace and return trace_id"""
        trace_id = str(uuid.uuid4())[:8]
        span_id = str(uuid.uuid4())[:8]

        span = Span(
            span_id=span_id,
            trace_id=trace_id,
            parent_span_id=None,
            operation=operation,
            agent_name=None,
            start_time=datetime.now(),
        )

        self._traces[trace_id] = [span]
        self._trace_order.append(trace_id)

        # Trim old traces
        while len(self._trace_order) > self.max_traces:
            old_trace = self._trace_order.pop(0)
            self._traces.pop(old_trace, None)

        # Set context
        current_trace_id.set(trace_id)
        current_span_id.set(span_id)

        logger.debug("trace_started", trace_id=trace_id, operation=operation)
        return trace_id

    def start_span(
        self,
        operation: str,
        agent_name: str | None = None,
        attributes: dict | None = None,
    ) -> str:
        """Start a new span within current trace"""
        trace_id = current_trace_id.get()
        if not trace_id:
            trace_id = self.start_trace(operation)

        parent_id = current_span_id.get()
        span_id = str(uuid.uuid4())[:8]

        span = Span(
            span_id=span_id,
            trace_id=trace_id,
            parent_span_id=parent_id,
            operation=operation,
            agent_name=agent_name,
            start_time=datetime.now(),
            attributes=attributes or {},
        )

        if trace_id in self._traces:
            self._traces[trace_id].append(span)
        else:
            self._traces[trace_id] = [span]

        current_span_id.set(span_id)

        logger.debug(
            "span_started",
            trace_id=trace_id,
            span_id=span_id,
            operation=operation,
            agent=agent_name,
        )

        return span_id

    def end_span(
        self,
        span_id: str | None = None,
        status: str = "ok",
        attributes: dict | None = None,
    ) -> None:
        """End a span"""
        span_id = span_id or current_span_id.get()
        trace_id = current_trace_id.get()

        if not trace_id or trace_id not in self._traces:
            return

        for span in self._traces[trace_id]:
            if span.span_id == span_id:
                span.end_time = datetime.now()
                span.status = status
                if attributes:
                    span.attributes.update(attributes)

                logger.debug(
                    "span_ended",
                    trace_id=trace_id,
                    span_id=span_id,
                    duration_ms=span.duration_ms,
                    status=status,
                )

                # Restore parent span as current
                if span.parent_span_id:
                    current_span_id.set(span.parent_span_id)
                break

    def add_event(
        self,
        name: str,
        attributes: dict | None = None,
    ) -> None:
        """Add an event to current span"""
        span_id = current_span_id.get()
        trace_id = current_trace_id.get()

        if not trace_id or trace_id not in self._traces:
            return

        for span in self._traces[trace_id]:
            if span.span_id == span_id:
                span.events.append({
                    "name": name,
                    "time": datetime.now().isoformat(),
                    "attributes": attributes or {},
                })
                break

    def get_trace(self, trace_id: str) -> list[dict] | None:
        """Get all spans for a trace"""
        spans = self._traces.get(trace_id)
        if not spans:
            return None
        return [s.to_dict() for s in spans]

    def get_current_trace(self) -> list[dict] | None:
        """Get current trace"""
        trace_id = current_trace_id.get()
        if trace_id:
            return self.get_trace(trace_id)
        return None

    def get_recent_traces(self, limit: int = 10) -> list[dict]:
        """Get recent traces with summary"""
        result = []
        for trace_id in reversed(self._trace_order[-limit:]):
            spans = self._traces.get(trace_id, [])
            if spans:
                root = spans[0]
                result.append({
                    "trace_id": trace_id,
                    "operation": root.operation,
                    "span_count": len(spans),
                    "agents": list(set(s.agent_name for s in spans if s.agent_name)),
                    "start_time": root.start_time.isoformat(),
                    "total_duration_ms": sum(s.duration_ms or 0 for s in spans),
                    "status": "error" if any(s.status == "error" for s in spans) else "ok",
                })
        return result


# Singleton instance
tracer = Tracer()


# Context manager for spans
class SpanContext:
    """Context manager for automatic span lifecycle"""

    def __init__(self, operation: str, agent_name: str | None = None, **attributes):
        self.operation = operation
        self.agent_name = agent_name
        self.attributes = attributes
        self.span_id = None

    def __enter__(self):
        self.span_id = tracer.start_span(
            self.operation,
            self.agent_name,
            self.attributes,
        )
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        status = "error" if exc_type else "ok"
        error_attrs = {"error": str(exc_val)} if exc_val else {}
        tracer.end_span(self.span_id, status, error_attrs)
        return False
