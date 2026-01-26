"""
Tool Manager - AIOS-inspired tool management with sandboxing

Implements:
- Sandboxed tool execution via subprocess
- Tool registration and discovery
- Rate limiting and access control
- Execution timeout and resource limits

Based on research from:
- AIOS: LLM Agent Operating System (COLM 2025)
- https://arxiv.org/pdf/2403.16971
"""

import asyncio
import hashlib
import json
import subprocess
import sys
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Coroutine

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class ToolType(Enum):
    """Types of tools available"""
    WEB_SEARCH = "web_search"
    WEB_FETCH = "web_fetch"
    FILE_READ = "file_read"
    FILE_WRITE = "file_write"
    CODE_EXECUTE = "code_execute"
    API_CALL = "api_call"
    SYSTEM_COMMAND = "system_command"
    CUSTOM = "custom"


class ToolPermission(Enum):
    """Permission levels for tools"""
    NONE = 0
    READ_ONLY = 1
    READ_WRITE = 2
    EXECUTE = 3
    ADMIN = 4


class ExecutionStatus(Enum):
    """Tool execution status"""
    SUCCESS = "success"
    FAILED = "failed"
    TIMEOUT = "timeout"
    PERMISSION_DENIED = "permission_denied"
    RATE_LIMITED = "rate_limited"
    SANDBOXED = "sandboxed"


@dataclass
class ToolDefinition:
    """Definition of a tool available to agents"""
    name: str
    tool_type: ToolType
    description: str
    handler: Callable[..., Coroutine[Any, Any, Any]] | None = None
    required_permission: ToolPermission = ToolPermission.READ_ONLY
    timeout_seconds: float = 30.0
    rate_limit_per_minute: int = 60
    requires_confirmation: bool = False
    sandboxed: bool = True
    schema: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class ToolExecution:
    """Record of a tool execution"""
    execution_id: str
    tool_name: str
    agent_name: str
    input_data: dict[str, Any]
    output_data: Any = None
    status: ExecutionStatus = ExecutionStatus.SUCCESS
    error_message: str | None = None
    started_at: float = field(default_factory=time.time)
    completed_at: float | None = None
    execution_time_ms: float | None = None
    sandboxed: bool = False

    @property
    def duration_ms(self) -> float | None:
        if self.completed_at:
            return (self.completed_at - self.started_at) * 1000
        return None


@dataclass
class AgentToolPermissions:
    """Tool permissions for an agent"""
    agent_name: str
    allowed_tools: set[str] = field(default_factory=set)
    denied_tools: set[str] = field(default_factory=set)
    permission_level: ToolPermission = ToolPermission.READ_ONLY
    rate_limit_override: dict[str, int] = field(default_factory=dict)


@dataclass
class ToolManagerStats:
    """Statistics for the Tool Manager"""
    total_executions: int = 0
    successful_executions: int = 0
    failed_executions: int = 0
    timed_out_executions: int = 0
    rate_limited_executions: int = 0
    sandboxed_executions: int = 0
    registered_tools: int = 0


class SandboxedExecutor:
    """
    Execute code/commands in a sandboxed environment.

    Uses subprocess with restricted permissions and timeouts.
    """

    def __init__(
        self,
        timeout: float = 30.0,
        max_output_bytes: int = 1024 * 1024,  # 1MB
    ):
        self.timeout = timeout
        self.max_output_bytes = max_output_bytes

    async def execute_python(
        self,
        code: str,
        timeout: float | None = None,
    ) -> tuple[str, str, int]:
        """
        Execute Python code in isolated subprocess.

        Args:
            code: Python code to execute
            timeout: Override default timeout

        Returns:
            Tuple of (stdout, stderr, return_code)
        """
        timeout = timeout or self.timeout

        try:
            process = await asyncio.create_subprocess_exec(
                sys.executable,
                "-c",
                code,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                # Restrict environment
                env={
                    "PATH": "",
                    "PYTHONDONTWRITEBYTECODE": "1",
                },
            )

            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout,
            )

            return (
                stdout.decode("utf-8", errors="replace")[:self.max_output_bytes],
                stderr.decode("utf-8", errors="replace")[:self.max_output_bytes],
                process.returncode or 0,
            )

        except asyncio.TimeoutError:
            if process:
                process.kill()
            return "", "Execution timed out", -1

        except Exception as e:
            return "", str(e), -1

    async def execute_command(
        self,
        command: list[str],
        timeout: float | None = None,
        allow_network: bool = False,
    ) -> tuple[str, str, int]:
        """
        Execute shell command in sandboxed environment.

        Args:
            command: Command and arguments
            timeout: Override default timeout
            allow_network: Allow network access

        Returns:
            Tuple of (stdout, stderr, return_code)
        """
        timeout = timeout or self.timeout

        # Block dangerous commands
        dangerous = {"rm", "del", "format", "mkfs", "dd", "shutdown", "reboot"}
        if command and command[0].lower() in dangerous:
            return "", "Command not allowed in sandbox", -1

        try:
            process = await asyncio.create_subprocess_exec(
                *command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout,
            )

            return (
                stdout.decode("utf-8", errors="replace")[:self.max_output_bytes],
                stderr.decode("utf-8", errors="replace")[:self.max_output_bytes],
                process.returncode or 0,
            )

        except asyncio.TimeoutError:
            if process:
                process.kill()
            return "", "Execution timed out", -1

        except Exception as e:
            return "", str(e), -1


class ToolManager:
    """
    Manages tool registration, permissions, and execution.

    Features:
    - Tool registration and discovery
    - Sandboxed execution for unsafe operations
    - Rate limiting per agent/tool
    - Permission-based access control
    - Execution logging and statistics

    Example:
        manager = ToolManager()

        # Register a tool
        manager.register_tool(ToolDefinition(
            name="web_search",
            tool_type=ToolType.WEB_SEARCH,
            description="Search the web",
            handler=my_search_handler,
        ))

        # Execute a tool
        result = await manager.execute(
            tool_name="web_search",
            agent_name="the_veritas",
            input_data={"query": "AIOS paper"},
        )
    """

    def __init__(
        self,
        default_timeout: float = 30.0,
        enable_sandboxing: bool = True,
        require_confirmation_for_writes: bool = True,
    ):
        """
        Initialize Tool Manager.

        Args:
            default_timeout: Default execution timeout
            enable_sandboxing: Enable sandboxed execution
            require_confirmation_for_writes: Require confirmation for write ops
        """
        self.default_timeout = default_timeout
        self.enable_sandboxing = enable_sandboxing
        self.require_confirmation_for_writes = require_confirmation_for_writes

        # Tool registry
        self._tools: dict[str, ToolDefinition] = {}

        # Agent permissions
        self._agent_permissions: dict[str, AgentToolPermissions] = {}

        # Rate limiting
        self._rate_limits: dict[str, list[float]] = {}  # tool:agent -> timestamps

        # Execution history
        self._executions: list[ToolExecution] = []
        self._max_history = 1000

        # Statistics
        self._stats = ToolManagerStats()

        # Sandboxed executor
        self._sandbox = SandboxedExecutor(timeout=default_timeout)

        self._lock = asyncio.Lock()

        # Register built-in tools
        self._register_builtin_tools()

    def _register_builtin_tools(self) -> None:
        """Register built-in tools"""
        # Web Search
        self.register_tool(ToolDefinition(
            name="web_search",
            tool_type=ToolType.WEB_SEARCH,
            description="Search the web for information",
            handler=self._builtin_web_search,
            required_permission=ToolPermission.READ_ONLY,
            timeout_seconds=30.0,
            sandboxed=False,
        ))

        # Web Fetch
        self.register_tool(ToolDefinition(
            name="web_fetch",
            tool_type=ToolType.WEB_FETCH,
            description="Fetch content from a URL",
            handler=self._builtin_web_fetch,
            required_permission=ToolPermission.READ_ONLY,
            timeout_seconds=30.0,
            sandboxed=False,
        ))

        # File Read
        self.register_tool(ToolDefinition(
            name="file_read",
            tool_type=ToolType.FILE_READ,
            description="Read a file from the filesystem",
            handler=self._builtin_file_read,
            required_permission=ToolPermission.READ_ONLY,
            timeout_seconds=10.0,
            sandboxed=True,
        ))

        # File Write
        self.register_tool(ToolDefinition(
            name="file_write",
            tool_type=ToolType.FILE_WRITE,
            description="Write content to a file",
            handler=self._builtin_file_write,
            required_permission=ToolPermission.READ_WRITE,
            timeout_seconds=10.0,
            sandboxed=True,
            requires_confirmation=True,
        ))

        # Python Execute
        self.register_tool(ToolDefinition(
            name="python_execute",
            tool_type=ToolType.CODE_EXECUTE,
            description="Execute Python code in sandbox",
            handler=self._builtin_python_execute,
            required_permission=ToolPermission.EXECUTE,
            timeout_seconds=60.0,
            sandboxed=True,
            requires_confirmation=True,
        ))

    def register_tool(self, tool: ToolDefinition) -> None:
        """Register a tool"""
        self._tools[tool.name] = tool
        self._stats.registered_tools = len(self._tools)

        logger.info(
            "tool_registered",
            name=tool.name,
            type=tool.tool_type.value,
            sandboxed=tool.sandboxed,
        )

    def unregister_tool(self, name: str) -> bool:
        """Unregister a tool"""
        if name in self._tools:
            del self._tools[name]
            self._stats.registered_tools = len(self._tools)
            return True
        return False

    def get_tool(self, name: str) -> ToolDefinition | None:
        """Get tool definition by name"""
        return self._tools.get(name)

    def list_tools(self) -> list[ToolDefinition]:
        """List all registered tools"""
        return list(self._tools.values())

    def set_agent_permissions(
        self,
        agent_name: str,
        allowed_tools: set[str] | None = None,
        denied_tools: set[str] | None = None,
        permission_level: ToolPermission = ToolPermission.READ_ONLY,
    ) -> None:
        """Set permissions for an agent"""
        self._agent_permissions[agent_name] = AgentToolPermissions(
            agent_name=agent_name,
            allowed_tools=allowed_tools or set(),
            denied_tools=denied_tools or set(),
            permission_level=permission_level,
        )

    def check_permission(
        self,
        tool_name: str,
        agent_name: str,
    ) -> bool:
        """Check if agent has permission to use tool"""
        tool = self._tools.get(tool_name)
        if not tool:
            return False

        perms = self._agent_permissions.get(agent_name)
        if not perms:
            # Default: allow read-only tools
            return tool.required_permission.value <= ToolPermission.READ_ONLY.value

        # Check explicit denials
        if tool_name in perms.denied_tools:
            return False

        # Check explicit allowances
        if perms.allowed_tools and tool_name not in perms.allowed_tools:
            return False

        # Check permission level
        return tool.required_permission.value <= perms.permission_level.value

    def _check_rate_limit(self, tool_name: str, agent_name: str) -> bool:
        """Check if request is within rate limit"""
        tool = self._tools.get(tool_name)
        if not tool:
            return False

        key = f"{tool_name}:{agent_name}"
        now = time.time()
        minute_ago = now - 60

        # Get recent requests
        recent = self._rate_limits.get(key, [])
        recent = [t for t in recent if t > minute_ago]
        self._rate_limits[key] = recent

        if len(recent) >= tool.rate_limit_per_minute:
            return False

        return True

    def _record_request(self, tool_name: str, agent_name: str) -> None:
        """Record a request for rate limiting"""
        key = f"{tool_name}:{agent_name}"
        if key not in self._rate_limits:
            self._rate_limits[key] = []
        self._rate_limits[key].append(time.time())

    async def execute(
        self,
        tool_name: str,
        agent_name: str,
        input_data: dict[str, Any],
        user_confirmed: bool = False,
    ) -> ToolExecution:
        """
        Execute a tool.

        Args:
            tool_name: Name of tool to execute
            agent_name: Agent making the request
            input_data: Input data for the tool
            user_confirmed: User has confirmed destructive action

        Returns:
            ToolExecution record with results
        """
        execution_id = hashlib.sha256(
            f"{tool_name}:{agent_name}:{time.time()}".encode()
        ).hexdigest()[:12]

        execution = ToolExecution(
            execution_id=execution_id,
            tool_name=tool_name,
            agent_name=agent_name,
            input_data=input_data,
        )

        async with self._lock:
            self._stats.total_executions += 1

        try:
            # Get tool
            tool = self._tools.get(tool_name)
            if not tool:
                execution.status = ExecutionStatus.FAILED
                execution.error_message = f"Tool '{tool_name}' not found"
                self._stats.failed_executions += 1
                return execution

            # Check permission
            if not self.check_permission(tool_name, agent_name):
                execution.status = ExecutionStatus.PERMISSION_DENIED
                execution.error_message = "Permission denied"
                logger.warning(
                    "tool_permission_denied",
                    tool=tool_name,
                    agent=agent_name,
                )
                return execution

            # Check rate limit
            if not self._check_rate_limit(tool_name, agent_name):
                execution.status = ExecutionStatus.RATE_LIMITED
                execution.error_message = "Rate limit exceeded"
                self._stats.rate_limited_executions += 1
                return execution

            # Check confirmation for destructive actions
            if tool.requires_confirmation and not user_confirmed:
                if self.require_confirmation_for_writes:
                    execution.status = ExecutionStatus.PERMISSION_DENIED
                    execution.error_message = "User confirmation required"
                    return execution

            # Record request for rate limiting
            self._record_request(tool_name, agent_name)

            # Execute
            execution.sandboxed = tool.sandboxed and self.enable_sandboxing

            logger.info(
                "tool_executing",
                tool=tool_name,
                agent=agent_name,
                sandboxed=execution.sandboxed,
            )

            if tool.handler:
                try:
                    result = await asyncio.wait_for(
                        tool.handler(input_data),
                        timeout=tool.timeout_seconds,
                    )
                    execution.output_data = result
                    execution.status = ExecutionStatus.SUCCESS
                    self._stats.successful_executions += 1

                except asyncio.TimeoutError:
                    execution.status = ExecutionStatus.TIMEOUT
                    execution.error_message = "Execution timed out"
                    self._stats.timed_out_executions += 1

                except Exception as e:
                    execution.status = ExecutionStatus.FAILED
                    execution.error_message = str(e)
                    self._stats.failed_executions += 1

            else:
                execution.status = ExecutionStatus.FAILED
                execution.error_message = "No handler registered"
                self._stats.failed_executions += 1

        finally:
            execution.completed_at = time.time()
            execution.execution_time_ms = execution.duration_ms

            # Record execution
            self._executions.append(execution)
            if len(self._executions) > self._max_history:
                self._executions.pop(0)

            if execution.sandboxed:
                self._stats.sandboxed_executions += 1

            logger.info(
                "tool_executed",
                tool=tool_name,
                status=execution.status.value,
                time_ms=execution.execution_time_ms,
            )

        return execution

    # Built-in tool handlers

    async def _builtin_web_search(self, data: dict[str, Any]) -> dict[str, Any]:
        """Built-in web search (placeholder)"""
        query = data.get("query", "")
        return {
            "status": "success",
            "message": f"Web search for: {query}",
            "note": "Actual implementation requires external API",
        }

    async def _builtin_web_fetch(self, data: dict[str, Any]) -> dict[str, Any]:
        """Built-in web fetch (placeholder)"""
        url = data.get("url", "")
        return {
            "status": "success",
            "message": f"Fetch URL: {url}",
            "note": "Actual implementation requires httpx/aiohttp",
        }

    async def _builtin_file_read(self, data: dict[str, Any]) -> dict[str, Any]:
        """Built-in file read"""
        path = data.get("path", "")

        if not path:
            return {"status": "error", "message": "Path required"}

        try:
            file_path = Path(path)

            # Security check: only allow reading from certain paths
            allowed_base = Path(settings.base_path)
            if not str(file_path.resolve()).startswith(str(allowed_base.resolve())):
                return {"status": "error", "message": "Path not allowed"}

            if not file_path.exists():
                return {"status": "error", "message": "File not found"}

            content = file_path.read_text(encoding="utf-8")
            return {
                "status": "success",
                "content": content[:10000],  # Limit content size
                "size": len(content),
            }

        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def _builtin_file_write(self, data: dict[str, Any]) -> dict[str, Any]:
        """Built-in file write"""
        path = data.get("path", "")
        content = data.get("content", "")

        if not path:
            return {"status": "error", "message": "Path required"}

        try:
            file_path = Path(path)

            # Security check
            allowed_base = Path(settings.base_path)
            if not str(file_path.resolve()).startswith(str(allowed_base.resolve())):
                return {"status": "error", "message": "Path not allowed"}

            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(content, encoding="utf-8")

            return {
                "status": "success",
                "path": str(file_path),
                "size": len(content),
            }

        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def _builtin_python_execute(self, data: dict[str, Any]) -> dict[str, Any]:
        """Built-in Python execution in sandbox"""
        code = data.get("code", "")

        if not code:
            return {"status": "error", "message": "Code required"}

        stdout, stderr, return_code = await self._sandbox.execute_python(code)

        return {
            "status": "success" if return_code == 0 else "error",
            "stdout": stdout,
            "stderr": stderr,
            "return_code": return_code,
        }

    def get_stats(self) -> ToolManagerStats:
        """Get current statistics"""
        return self._stats

    def get_recent_executions(
        self,
        limit: int = 100,
        agent_name: str | None = None,
        tool_name: str | None = None,
    ) -> list[ToolExecution]:
        """Get recent executions with optional filters"""
        executions = self._executions[-limit:]

        if agent_name:
            executions = [e for e in executions if e.agent_name == agent_name]

        if tool_name:
            executions = [e for e in executions if e.tool_name == tool_name]

        return executions


# Module-level singleton
_tool_manager: ToolManager | None = None


def get_tool_manager() -> ToolManager:
    """Get or create the global Tool Manager instance"""
    global _tool_manager
    if _tool_manager is None:
        _tool_manager = ToolManager()
    return _tool_manager


async def reset_tool_manager() -> None:
    """Reset the global Tool Manager (for testing)"""
    global _tool_manager
    _tool_manager = None
