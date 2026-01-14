"""CLI Interface for Eximia Runtime"""

import asyncio
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.markdown import Markdown

from eximia_runtime import __version__
from eximia_runtime.core.registry import registry
from eximia_runtime.core.agent_executor import executor
from eximia_runtime.utils.logging import setup_logging


app = typer.Typer(
    name="eximia",
    help="Eximia Runtime - Execute ExímIA.OS agents programmatically",
    add_completion=False,
)
console = Console()


@app.callback()
def main(
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose logging"),
):
    """Eximia Runtime CLI"""
    setup_logging(level="DEBUG" if verbose else "INFO", format="console")


@app.command()
def version():
    """Show version information"""
    console.print(f"[bold blue]Eximia Runtime[/] v{__version__}")


@app.command("list")
def list_agents(
    category: Optional[str] = typer.Option(None, "--category", "-c", help="Filter by category"),
    tier: Optional[int] = typer.Option(None, "--tier", "-t", help="Filter by tier (1-3)"),
):
    """List all available agents"""
    registry.discover_agents(force=True)

    agents = registry.list_all()

    if category:
        agents = [a for a in agents if a.category == category]
    if tier:
        agents = [a for a in agents if a.tier == tier]

    if not agents:
        console.print("[yellow]No agents found with the specified filters.[/]")
        return

    table = Table(title="Available Agents", show_header=True, header_style="bold magenta")
    table.add_column("Name", style="cyan")
    table.add_column("Tier", justify="center")
    table.add_column("Category")
    table.add_column("Prompt", justify="center")
    table.add_column("KBs", justify="center")

    tier_labels = {1: "🥉 Tactical", 2: "🥈 Executive", 3: "🥇 Expert"}

    for agent in sorted(agents, key=lambda a: (-a.tier, a.name)):
        table.add_row(
            agent.name,
            tier_labels.get(agent.tier, str(agent.tier)),
            agent.category,
            "✅" if agent.has_system_prompt else "❌",
            "✅" if agent.has_knowledge_base else "❌",
        )

    console.print(table)
    console.print(f"\n[dim]Total: {len(agents)} agents[/]")


@app.command()
def run(
    agent: str = typer.Argument(..., help="Agent name to execute"),
    query: str = typer.Option(..., "--query", "-q", help="Query/task for the agent"),
    model: Optional[str] = typer.Option(None, "--model", "-m", help="Model override (LiteLLM format)"),
    output_file: Optional[str] = typer.Option(None, "--output", "-o", help="Save output to file"),
):
    """Execute an agent with a query"""

    async def _run():
        with console.status(f"[bold green]Executing {agent}...[/]"):
            result = await executor.execute(
                agent_name=agent,
                input_data=query,
                model_override=model,
            )

        # Display result
        console.print(Panel(
            Markdown(result.content),
            title=f"[bold]{agent}[/] Response",
            subtitle=f"Model: {result.model_used} | Tokens: {result.tokens_used} | Time: {result.execution_time_ms:.0f}ms",
        ))

        # Save to file if requested
        if output_file:
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(result.content)
            console.print(f"[green]✓ Output saved to {output_file}[/]")

        return result

    try:
        asyncio.run(_run())
    except ValueError as e:
        console.print(f"[red]Error: {e}[/]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"[red]Execution failed: {e}[/]")
        raise typer.Exit(1)


@app.command()
def info(
    agent: str = typer.Argument(..., help="Agent name to get info for"),
):
    """Show detailed information about an agent"""
    agent_info = registry.get(agent)

    if not agent_info:
        console.print(f"[red]Agent '{agent}' not found[/]")
        raise typer.Exit(1)

    tier_labels = {1: "Tactical", 2: "Executive", 3: "Expert"}

    table = Table(show_header=False, box=None)
    table.add_column("Key", style="bold")
    table.add_column("Value")

    table.add_row("Name", agent_info.name)
    table.add_row("Tier", f"{tier_labels.get(agent_info.tier)} (Level {agent_info.tier})")
    table.add_row("Category", agent_info.category)
    table.add_row("Path", str(agent_info.path))
    table.add_row("System Prompt", "✅ Available" if agent_info.has_system_prompt else "❌ Missing")
    table.add_row("Knowledge Base", "✅ Available" if agent_info.has_knowledge_base else "❌ Missing")
    table.add_row("Schemas", "✅ Available" if agent_info.has_schemas else "❌ Missing")

    console.print(Panel(table, title=f"[bold]{agent}[/] Details"))


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
):
    """Start the REST API server"""
    import uvicorn

    console.print(f"[bold green]Starting Eximia API server on {host}:{port}[/]")
    uvicorn.run(
        "eximia_runtime.interfaces.api:app",
        host=host,
        port=port,
        reload=reload,
    )


@app.command()
def metrics():
    """Show execution metrics summary"""
    from eximia_runtime.utils.metrics import metrics as m
    
    stats = m.get_global_stats()
    
    if "message" in stats:
        console.print(f"[yellow]{stats['message']}[/]")
        return

    table = Table(title="Execution Metrics", show_header=False, box=None)
    table.add_column("Metric", style="bold")
    table.add_column("Value")

    table.add_row("Total Calls", str(stats.get("total_calls", 0)))
    table.add_row("Success Rate", f"{stats.get('success_rate', 0) * 100:.1f}%")
    table.add_row("Total Tokens", f"{stats.get('total_tokens', 0):,}")
    table.add_row("Avg Latency", f"{stats.get('avg_latency_ms', 0):.0f}ms")
    table.add_row("Unique Agents", str(stats.get("unique_agents", 0)))

    console.print(Panel(table))

    if stats.get("top_agents"):
        console.print("\n[bold]Top Agents:[/]")
        for item in stats["top_agents"]:
            console.print(f"  • {item['agent']}: {item['calls']} calls")


@app.command("index-kb")
def index_knowledge_bases():
    """Index all agent knowledge bases into vector store"""
    from eximia_runtime.memory.vector_store import vector_store

    with console.status("[bold green]Indexing knowledge bases...[/]"):
        results = vector_store.index_all_agents()

    if not results:
        console.print("[yellow]No knowledge bases found to index.[/]")
        return

    table = Table(title="Indexed Knowledge Bases", show_header=True)
    table.add_column("Agent", style="cyan")
    table.add_column("Chunks", justify="right")

    total_chunks = 0
    for agent, chunks in sorted(results.items()):
        table.add_row(agent, str(chunks))
        total_chunks += chunks

    console.print(table)
    console.print(f"\n[green]✓ Indexed {total_chunks} chunks from {len(results)} agents[/]")


if __name__ == "__main__":
    app()
