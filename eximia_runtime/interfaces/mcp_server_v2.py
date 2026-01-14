"""
MCP Server v2 - Antigravity-Native Agent Execution

Fully compliant with MCP Protocol (JSON-RPC 2.0 over stdio).
Critical: All logging goes to stderr, only JSON-RPC to stdout.
"""

import json
import sys
from typing import Any
from datetime import datetime
from pathlib import Path


# CRITICAL: Configure logging to stderr ONLY before any imports that might log
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr  # MUST be stderr, never stdout
)
logger = logging.getLogger("eximia_mcp")


def log_debug(msg: str, **kwargs):
    """Log to stderr only"""
    extra = " ".join(f"{k}={v}" for k, v in kwargs.items())
    logger.debug(f"{msg} {extra}".strip())


def log_error(msg: str, **kwargs):
    """Log errors to stderr only"""
    extra = " ".join(f"{k}={v}" for k, v in kwargs.items())
    logger.error(f"{msg} {extra}".strip())


class EximiaMCPServer:
    """
    MCP Server that returns structured prompts for Antigravity to execute.

    Protocol: JSON-RPC 2.0 over stdio
    - stdin: receives JSON-RPC requests (one per line)
    - stdout: sends JSON-RPC responses (one per line)
    - stderr: logging only
    """

    PROTOCOL_VERSION = "2024-11-05"
    SERVER_NAME = "eximia_runtime"
    SERVER_VERSION = "2.0.0"

    def __init__(self):
        self._tools: dict[str, dict[str, Any]] = {}
        self._initialized = False
        self._register_tools()
        log_debug("MCP server instance created")

    def _register_tools(self):
        """Register all MCP tools"""

        self._tools = {
            "run_agent": {
                "name": "run_agent",
                "description": "Load an Eximia agent and get its structured prompt for execution. Use this to run any agent from the Eximia ecosystem (Veritas, CFO, CLO, etc). The tool returns the agent's system prompt and context - YOU should then execute it with your LLM capabilities.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "agent_name": {
                            "type": "string",
                            "description": "Name of the agent (e.g., 'the_veritas', 'the_cfo', 'the_clo')"
                        },
                        "query": {
                            "type": "string",
                            "description": "The task or question for the agent"
                        },
                        "include_kb": {
                            "type": "boolean",
                            "description": "Include knowledge bases in context (default: true)"
                        },
                        "web_search_hint": {
                            "type": "boolean",
                            "description": "Hint that this query may need web search (default: false)"
                        }
                    },
                    "required": ["agent_name", "query"]
                }
            },
            "orchestrate": {
                "name": "orchestrate",
                "description": "Analyze a task and determine which agent(s) should handle it. Returns routing recommendation.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "task": {
                            "type": "string",
                            "description": "The task to analyze and route"
                        },
                        "veritas_first": {
                            "type": "boolean",
                            "description": "Whether to validate facts with Veritas first (default: true)"
                        }
                    },
                    "required": ["task"]
                }
            },
            "list_agents": {
                "name": "list_agents",
                "description": "List all available Eximia agents with their capabilities.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "category": {
                            "type": "string",
                            "description": "Filter by category (executive, factory, clone, general)"
                        },
                        "tier": {
                            "type": "integer",
                            "description": "Filter by tier (1=Tactical, 2=Executive, 3=Expert)"
                        }
                    }
                }
            },
            "get_agent_info": {
                "name": "get_agent_info",
                "description": "Get detailed information about a specific agent.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "agent_name": {
                            "type": "string",
                            "description": "Name of the agent"
                        }
                    },
                    "required": ["agent_name"]
                }
            },
            "save_output": {
                "name": "save_output",
                "description": "Save an agent's output to the outputs directory.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "agent_name": {
                            "type": "string",
                            "description": "Name of the agent"
                        },
                        "query": {
                            "type": "string",
                            "description": "Original query"
                        },
                        "response": {
                            "type": "string",
                            "description": "Agent response to save"
                        }
                    },
                    "required": ["agent_name", "query", "response"]
                }
            },
            "select_model": {
                "name": "select_model",
                "description": "Analyze task complexity and recommend the best LLM model to use.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "agent_name": {
                            "type": "string",
                            "description": "Name of the agent"
                        },
                        "query": {
                            "type": "string",
                            "description": "Task description or query"
                        },
                        "agent_tier": {
                            "type": "integer",
                            "description": "Agent tier (1-3)",
                            "default": 1
                        }
                    },
                    "required": ["agent_name", "query"]
                }
            }
        }
        log_debug(f"Registered {len(self._tools)} tools")

    def get_tools_list(self) -> list[dict[str, Any]]:
        """Return tools in MCP format"""
        return [
            {
                "name": tool["name"],
                "description": tool["description"],
                "inputSchema": tool["inputSchema"]
            }
            for tool in self._tools.values()
        ]

    def handle_initialize(self, params: dict) -> dict:
        """Handle initialize request"""
        client_version = params.get("protocolVersion", "unknown")
        client_info = params.get("clientInfo", {})
        log_debug(f"Initialize request", client_version=client_version, client=client_info.get("name", "unknown"))

        self._initialized = True

        return {
            "protocolVersion": self.PROTOCOL_VERSION,
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": self.SERVER_NAME,
                "version": self.SERVER_VERSION
            }
        }

    def handle_tools_list(self) -> dict:
        """Handle tools/list request"""
        tools = self.get_tools_list()
        log_debug(f"Returning {len(tools)} tools")
        return {"tools": tools}

    def handle_tools_call(self, params: dict) -> dict:
        """Handle tools/call request"""
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})

        log_debug(f"Tool call", tool=tool_name)

        if tool_name not in self._tools:
            return {
                "content": [{"type": "text", "text": json.dumps({"error": f"Unknown tool: {tool_name}"})}],
                "isError": True
            }

        try:
            result = self._execute_tool(tool_name, arguments)
            return {
                "content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}],
                "isError": False
            }
        except Exception as e:
            log_error(f"Tool error", tool=tool_name, error=str(e))
            return {
                "content": [{"type": "text", "text": json.dumps({"error": str(e)})}],
                "isError": True
            }

    def _execute_tool(self, name: str, args: dict) -> dict:
        """Execute a tool and return result"""
        if name == "run_agent":
            return self._run_agent(args)
        elif name == "orchestrate":
            return self._orchestrate(args)
        elif name == "list_agents":
            return self._list_agents(args)
        elif name == "get_agent_info":
            return self._get_agent_info(args)
        elif name == "save_output":
            return self._save_output(args)
        elif name == "select_model":
            return self._select_model(args)
        else:
            return {"error": f"Tool not implemented: {name}"}

    def _run_agent(self, args: dict) -> dict:
        """Load agent and return structured prompt for Antigravity to execute."""
        agent_name = args.get("agent_name", "")
        query = args.get("query", "")
        include_kb = args.get("include_kb", True)
        web_search_hint = args.get("web_search_hint", False)

        # Lazy import to avoid startup issues
        try:
            from eximia_runtime.core.registry import registry
            from eximia_runtime.core.agent_loader import AgentLoader
        except ImportError as e:
            return {"error": f"Failed to import runtime: {e}"}

        # Get agent from registry
        registry.discover_agents()
        agent_info = registry.get(agent_name)

        if not agent_info:
            available = [a.name for a in registry.list_all()[:10]]
            return {
                "error": f"Agent '{agent_name}' not found",
                "available_agents": available,
                "hint": "Use list_agents to see all available agents"
            }

        if not agent_info.has_system_prompt:
            return {"error": f"Agent '{agent_name}' has no system prompt configured."}

        # Load agent configuration
        try:
            loader = AgentLoader(agent_info.path)
            config = loader.load()
        except Exception as e:
            return {"error": f"Failed to load agent: {str(e)}"}

        # Build the structured prompt
        system_prompt = config.system_prompt

        # Add knowledge base context if requested
        kb_context = ""
        if include_kb and config.knowledge_base:
            kb_context = "\n\n---\n\n## KNOWLEDGE BASE CONTEXT\n\n"
            kb_context += "\n\n".join(config.knowledge_base[:5])

        # Build execution instructions for Antigravity
        instructions = f"""## EXECUTION INSTRUCTIONS

You are now executing the **{agent_name.upper()}** agent from the Eximia ecosystem.

### Your Task
{query}

### How to Execute
1. Follow the system prompt below EXACTLY as written
2. Respond in the format specified by the agent
3. {"Use your browser to search for current data if needed" if web_search_hint else "Use your knowledge to answer"}
4. After completing, call `save_output` to save the result

### Agent System Prompt
---
{system_prompt}
{kb_context}
---

Now execute this agent's task: **{query}**"""

        return {
            "status": "ready",
            "agent": agent_name,
            "tier": config.tier,
            "query": query,
            "instructions": instructions,
            "prompt_length": len(system_prompt),
            "kb_count": len(config.knowledge_base),
            "web_search_recommended": web_search_hint or any(
                kw in query.lower() for kw in ["pesquise", "market size", "dados", "atual", "2024", "2025"]
            ),
            "message": f"Agent '{agent_name}' loaded. Execute the instructions above with your LLM."
        }

    def _orchestrate(self, args: dict) -> dict:
        """Analyze task and recommend agent routing"""
        task = args.get("task", "")
        veritas_first = args.get("veritas_first", True)
        task_lower = task.lower()

        recommendations = []

        # Check for research/validation needs
        if veritas_first and any(kw in task_lower for kw in ["pesquise", "valide", "dados", "market", "research"]):
            recommendations.append({
                "agent": "the_veritas",
                "reason": "Task requires research/validation",
                "priority": 1
            })

        # Financial analysis
        if any(kw in task_lower for kw in ["financeiro", "valuation", "dcf", "receita", "custo", "roi"]):
            recommendations.append({
                "agent": "the_cfo",
                "reason": "Financial analysis needed",
                "priority": 2
            })

        # Legal analysis
        if any(kw in task_lower for kw in ["legal", "compliance", "regulação", "contrato", "lgpd"]):
            recommendations.append({
                "agent": "the_clo",
                "reason": "Legal analysis needed",
                "priority": 2
            })

        # Marketing
        if any(kw in task_lower for kw in ["marketing", "marca", "posicionamento", "campanha"]):
            recommendations.append({
                "agent": "the_cmo",
                "reason": "Marketing strategy needed",
                "priority": 2
            })

        # Default to Veritas for general queries
        if not recommendations:
            recommendations.append({
                "agent": "the_veritas",
                "reason": "General research query",
                "priority": 1
            })

        return {
            "task": task,
            "recommendations": recommendations,
            "suggested_flow": [r["agent"] for r in sorted(recommendations, key=lambda x: x["priority"])],
            "message": f"Recommended agents: {', '.join(r['agent'] for r in recommendations)}"
        }

    def _list_agents(self, args: dict) -> dict:
        """List available agents"""
        try:
            from eximia_runtime.core.registry import registry
        except ImportError as e:
            return {"error": f"Failed to import registry: {e}"}

        registry.discover_agents()
        agents = registry.list_all()

        category_filter = args.get("category")
        tier_filter = args.get("tier")

        if category_filter:
            agents = [a for a in agents if a.category == category_filter]
        if tier_filter:
            agents = [a for a in agents if a.tier == tier_filter]

        tier_names = {1: "Tactical", 2: "Executive", 3: "Expert"}

        return {
            "agents": [
                {
                    "name": a.name,
                    "tier": f"{a.tier} ({tier_names.get(a.tier, 'Unknown')})",
                    "category": a.category,
                    "ready": a.has_system_prompt,
                    "has_kb": a.has_knowledge_base,
                }
                for a in sorted(agents, key=lambda x: (-x.tier, x.name))
            ],
            "total": len(agents),
            "ready_count": sum(1 for a in agents if a.has_system_prompt)
        }

    def _get_agent_info(self, args: dict) -> dict:
        """Get detailed agent info"""
        agent_name = args.get("agent_name", "")

        try:
            from eximia_runtime.core.registry import registry
        except ImportError as e:
            return {"error": f"Failed to import registry: {e}"}

        registry.discover_agents()
        agent = registry.get(agent_name)

        if not agent:
            return {"error": f"Agent '{agent_name}' not found"}

        tier_names = {1: "Tactical", 2: "Executive", 3: "Expert"}

        return {
            "name": agent.name,
            "tier": tier_names.get(agent.tier, "Unknown"),
            "category": agent.category,
            "path": str(agent.path),
            "has_system_prompt": agent.has_system_prompt,
            "has_knowledge_base": agent.has_knowledge_base,
            "has_schemas": agent.has_schemas,
            "ready": agent.has_system_prompt,
        }

    def _save_output(self, args: dict) -> dict:
        """Save agent output to file"""
        agent_name = args.get("agent_name", "")
        query = args.get("query", "")
        response = args.get("response", "")

        try:
            from eximia_runtime.utils.output_manager import output_manager
            saved_path = output_manager.save(
                agent_name=agent_name,
                query=query,
                response=response,
                metadata={"source": "antigravity"}
            )
            return {
                "status": "saved",
                "path": str(saved_path),
                "message": f"Output saved to {saved_path.name}"
            }
        except Exception as e:
            return {"error": f"Failed to save: {str(e)}"}

    def _select_model(self, args: dict) -> dict:
        """Select best model using ModelSelector engine"""
        agent_name = args.get("agent_name", "")
        query = args.get("query", "")
        agent_tier = args.get("agent_tier", 1)

        try:
            from eximia_runtime.core.model_selector import model_selector
            recommendation = model_selector.select_model(agent_name, query, agent_tier)
            return recommendation
        except Exception as e:
             return {"error": f"Model selection failed: {str(e)}"}

    def process_message(self, message: dict) -> dict | None:
        """
        Process a single JSON-RPC message and return response.
        Returns None for notifications (no response needed).
        """
        req_id = message.get("id")
        method = message.get("method", "")
        params = message.get("params", {})

        log_debug(f"Processing", method=method, has_id=req_id is not None)

        # Notifications (no id) don't get responses
        if req_id is None:
            if method == "initialized":
                log_debug("Client initialized notification received")
            elif method == "notifications/initialized":
                # Legacy format, also accept
                log_debug("Client initialized notification received (legacy)")
            return None

        # Build response base
        response = {
            "jsonrpc": "2.0",
            "id": req_id
        }

        try:
            if method == "initialize":
                response["result"] = self.handle_initialize(params)

            elif method == "tools/list":
                response["result"] = self.handle_tools_list()

            elif method == "tools/call":
                response["result"] = self.handle_tools_call(params)

            elif method == "ping":
                response["result"] = {}

            elif method == "resources/list":
                # We don't have resources, return empty list
                response["result"] = {"resources": []}

            elif method == "prompts/list":
                # We don't have prompts, return empty list
                response["result"] = {"prompts": []}

            else:
                response["error"] = {
                    "code": -32601,
                    "message": f"Method not found: {method}"
                }

        except Exception as e:
            log_error(f"Error processing", method=method, error=str(e))
            response["error"] = {
                "code": -32000,
                "message": str(e)
            }

        return response


def run_mcp_server_v2():
    """
    Run the MCP server (stdio mode).

    CRITICAL PROTOCOL RULES:
    - Read JSON-RPC from stdin (one message per line)
    - Write JSON-RPC to stdout (one message per line)
    - All logging to stderr ONLY
    - No extra output to stdout
    """
    # Ensure stdout is line-buffered and uses UTF-8
    sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

    server = EximiaMCPServer()
    log_debug("MCP Server started, waiting for input...")

    try:
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue

            try:
                message = json.loads(line)
            except json.JSONDecodeError as e:
                log_error(f"JSON decode error: {e}")
                # Don't send response for invalid JSON (can't get id)
                continue

            response = server.process_message(message)

            if response is not None:
                # CRITICAL: Only valid JSON-RPC goes to stdout
                output = json.dumps(response, ensure_ascii=False)
                print(output, flush=True)

    except KeyboardInterrupt:
        log_debug("Server interrupted")
    except Exception as e:
        log_error(f"Server error: {e}")
        raise


# For running with: python -m eximia_runtime.interfaces.mcp_server_v2
if __name__ == "__main__":
    run_mcp_server_v2()
