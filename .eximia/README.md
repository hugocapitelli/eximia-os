# .eximia Directory

This directory contains the eximIA.OS command system configuration and documentation.

## Files

- **SLASH_COMMANDS.yaml** — Central registry of all slash commands
- **SLASH_COMMANDS_GUIDE.md** — Complete user guide for all commands
- **commands.md** — Quick reference (print with `help eximia`)

## Usage

### View All Commands
```bash
# In Claude Code, type:
help eximia
```

### Command Categories
1. **Scheduler** (`/schedule`, `/s`) — Agent/clone roadmap management
2. **Memo** (`/memo`, `/m`) — Idea bank with Zettelkasten
3. **Clone Factory** (`/clone`) — Personality cloning pipeline
4. **Z Squad** (`/zsquad`, `/z`) — Agent creation pipeline
5. **Copy Squad** (`/copy`) — Elite copywriting
6. **Executive Agents** — Maestro, Veritas, CEO, CFO, CLO, CMO
7. **X Agents** — Prototyper, Strategist, LXD

### Examples
```bash
# Scheduler
/schedule next                           # Get next recommendation
/s agent "The_Analyst" --tier=3          # Add agent to backlog

# Memo
/memo "Use RICE for prioritization"      # Capture idea
/m recall "architecture"                 # Search ideas

# Copy Squad
/copy vsl                                # Create VSL script
/copy diagnose                           # Market diagnosis

# Executive
/veritas "AI agent market size 2026"     # Deep research
/cfo "Value SaaS at $2M ARR"            # Financial analysis
```

## Integration

The command system is integrated with:
- **CLAUDE.md** — Main instruction file
- **agent_registry.yaml** — Agent configuration
- **.agent/workflows/** — Execution workflows

## Documentation

Full documentation: `SLASH_COMMANDS_GUIDE.md`
