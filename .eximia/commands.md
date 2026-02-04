---
title: "eximIA.OS Quick Commands Reference"
galaxy: "OPERATIONAL"
galaxy-color: "#FF69B4"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "commands"
  - "eximia.os quick commands refer"
  - "📅 scheduler — agent/clone roa"
  - "💡 memo — idea bank"
  - "🧬 clone factory"
  - "🏗️ z squad — agent creation"
  - "✍️ copy squad — elite copywrit"
  - "🎯 executive agents"
  - "🔧 x agents — specialists"
  - "📖 help commands"
tags:
  - "galaxy-operational"
  - "document"
---

# eximIA.OS Quick Commands Reference

**Para ver esta lista a qualquer momento, digite:** `/eximia` ou `help eximia`

---

## 📅 SCHEDULER — Agent/Clone Roadmap

```bash
/schedule agent "Name" --tier=N --domain="..."     # Add agent
/schedule clone "Person" --domain="..."            # Add clone
/schedule list                                     # List backlog
/schedule prioritize                               # Calculate RICE
/schedule next                                     # Next recommendation
/schedule update <id> --status=<status>            # Update status
/schedule roadmap                                  # View roadmap
/schedule auto-execute <id> --overnight=true       # 🆕 Auto-execute pipeline
```

**Aliases:** `/s`, `/sched`

---

## 💡 MEMO — Idea Bank

```bash
/memo "idea text"                                  # Add idea
/memo recall "query"                               # Search ideas
/memo cluster                                      # Form clusters
/memo insights                                     # Generate insights
/memo graph                                        # View connections
/memo list                                         # List all ideas
```

**Aliases:** `/m`, `/idea`

---

## 🧬 CLONE FACTORY

```bash
/clone start "Person" --domain="..."               # Start clone
/clone research <name>                             # C1 Hunter
/clone extract <name>                              # C2 Extractor
/clone create <name>                               # C3 Creator
/clone validate <name>                             # C4 Auditor
/clone status <name>                               # Check status
```

---

## 🏗️ Z SQUAD — Agent Creation

```bash
/zsquad start "Agent" --tier=N --domain="..."      # Start agent
/zsquad spec <name>                                # Z1 Architect
/zsquad profile <name>                             # Z2 Profiler
/zsquad engineer <name>                            # Z3 Engineer
/zsquad audit <name>                               # Z4 Auditor
```

**Aliases:** `/z`

---

## ✍️ COPY SQUAD — Elite Copywriting

```bash
/copy diagnose                                     # Tier 0 diagnosis
/copy recommend                                    # Get copywriter
/copy sales-page                                   # Gary Halbert
/copy vsl                                          # Jon Benson
/copy email-sequence                               # Email series
/copy headlines                                    # David Ogilvy
/copy audit                                        # Claude Hopkins
/copy sugarman-check                               # 30 triggers
```

---

## 🎯 EXECUTIVE AGENTS

```bash
/maestro "task"                # Supreme orchestrator
/veritas "query"               # Deep research
/ceo "task"                    # Chief of Staff
/cfo "query"                   # Corporate finance
/clo "query"                   # Legal & compliance
/cmo "task"                    # Marketing & growth
```

---

## 🔧 X AGENTS — Specialists

```bash
/prototyper "task"             # PRDs, RFCs, wireframes
/strategist "task"             # Hoshin Kanri planning
/lxd "task"                    # Learning design
```

---

## 📖 HELP COMMANDS

```bash
help eximia                    # This guide
/schedule --help               # Scheduler help
/copy --help                   # Copy Squad help
```

---

**Full documentation:** `.eximia/SLASH_COMMANDS_GUIDE.md`
**Registry:** `.eximia/SLASH_COMMANDS.yaml`

#galaxy-operational