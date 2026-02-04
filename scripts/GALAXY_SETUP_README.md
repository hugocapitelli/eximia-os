---
title: "Galaxy Structure Setup Guide"
galaxy: "CORE"
document-type: "documentation"
status: "production"
keywords:
  - "setup"
  - "galaxy"
  - "frontmatter"
  - "obsidian"
tags:
  - "galaxy-core"
  - "documentation"
---

# 🌌 Galaxy Structure Setup Guide

Complete instructions for implementing the Galaxy Structure across eximia-os with YAML frontmatter and Obsidian visualization.

---

## What This Does

This setup process:

1. **Adds YAML frontmatter** to 2533+ markdown files with:
   - Galaxy assignment (CORE, SPECIALIST, CREATION, CODEX, RUNTIME, OPERATIONAL, TOOLS)
   - Document type classification
   - Status tracking
   - Keywords and tags for search
   - Color codes for visualization

2. **Creates _HUB.md** — Central navigation hub connecting all 7 galaxies

3. **Configures Obsidian graph** with 7 color groups for beautiful visualization:
   - Purple for CORE
   - Green for SPECIALIST
   - Orange for CREATION
   - Gray for CODEX
   - Blue for RUNTIME
   - Pink for OPERATIONAL
   - Yellow for TOOLS

---

## Prerequisites

✅ Node.js 16+ (check with `node --version`)
✅ eximia-os repository cloned
✅ Obsidian vault configured to point to eximia-os directory

---

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
cd eximia-os

# Run full setup (Unix/Linux/Mac)
bash scripts/run-galaxy-setup.sh

# Or on Windows (using Git Bash or WSL)
bash scripts/run-galaxy-setup.sh
```

### Option 2: Step-by-Step Manual

#### Step 1: Generate Frontmatter for All Files

```bash
node scripts/galaxies-frontmatter-generator.js
```

**Options:**
- `--galaxy=CORE` — Process only CORE galaxy
- `--dry-run` — Preview changes without modifying files
- `--force` — Overwrite existing frontmatter

**Example:**
```bash
# Test with dry run first
node scripts/galaxies-frontmatter-generator.js --dry-run --galaxy=CORE

# Then process for real
node scripts/galaxies-frontmatter-generator.js --galaxy=CORE
```

#### Step 2: Configure Obsidian Graph

```bash
node scripts/generate-obsidian-graph-config.js
```

This updates `.obsidian/graph.json` with 7 color groups.

#### Step 3: Reload Obsidian

1. Close Obsidian completely
2. Reopen the vault
3. Open Graph View (button on left sidebar)
4. You should see 7 colored clusters!

---

## Understanding Galaxy Structure

### What is a Galaxy?

A **Galaxy** is a thematic cluster of documents organized by:
- **Domain** (Finance, Legal, Research, etc.)
- **Purpose** (Agent definitions, Knowledge bases, Configurations)
- **Team** (Finance team, Legal team, etc.)

Each galaxy has:
- **Color** — For visual identification in graph
- **Icon** — For quick recognition
- **Documents** — All related files

### The 7 Galaxies

| Galaxy | Color | Count | Purpose |
|--------|-------|-------|---------|
| **CORE** | 👑 Purple #8B3A8B | 70 | Supreme orchestrator & research engine |
| **SPECIALIST** | 💼 Green #228B22 | 151 | Domain experts & C-suite agents |
| **CREATION** | 🧬 Orange #FF8C00 | 596 | Agent & personality factory |
| **CODEX** | 📚 Gray #A9A9A9 | 52 | Knowledge vault (isolated) |
| **RUNTIME** | ⚙️ Blue #1E90FF | 321 | Execution engine & infrastructure |
| **OPERATIONAL** | 🛠️ Pink #FF69B4 | 3 | System configuration & commands |
| **TOOLS** | 🔧 Yellow #FFD700 | 172 | Utilities & integration tools |

---

## YAML Frontmatter Schema

Every markdown file now has this structure:

```yaml
---
title: "Document Title"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "agent-profile"
status: "production"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "maestro"
  - "orchestration"
tags:
  - "galaxy-core"
  - "agent-profile"
---

# Your actual content starts here...
```

### Field Explanations

- **title** — Document title (extracted from first # heading)
- **galaxy** — One of: CORE, SPECIALIST, CREATION, CODEX, RUNTIME, OPERATIONAL, TOOLS
- **galaxy-color** — Hex color for visualization
- **document-type** — One of: agent-profile, knowledge-base, prompt, protocol, workflow, template, documentation, document
- **status** — One of: production, draft, validated, deprecated, documented
- **created-date** — ISO 8601 format (YYYY-MM-DD)
- **last-updated** — When document was last modified
- **keywords** — List of search keywords extracted from content
- **tags** — Obsidian tags for filtering and organization

---

## Using the Galaxy Structure

### In Obsidian Graph View

1. Open the **Graph View** (left sidebar button)
2. You'll see 7 colored clusters (galaxies)
3. **Click nodes** to navigate to documents
4. **Drag to explore** the network
5. **Filter by color** using the "Color" section in the right panel

### Search by Galaxy

Use Obsidian search syntax:

```
tag:galaxy-core          # Find all CORE galaxy docs
tag:galaxy-specialist    # Find all SPECIALIST galaxy docs
tag:knowledge-base       # Find all knowledge bases
document-type:agent-profile  # Find all agent profiles
status:production        # Find all production documents
```

### Navigation via _HUB.md

Open **_HUB.md** in the project root to find:
- Links to all 7 galaxies
- Quick navigation by role
- Common tasks and shortcuts
- System statistics

---

## Troubleshooting

### Issue: Scripts won't run

**Solution:**
```bash
# Make scripts executable
chmod +x scripts/run-galaxy-setup.sh
chmod +x scripts/galaxies-frontmatter-generator.js
chmod +x scripts/generate-obsidian-graph-config.js

# Try again
bash scripts/run-galaxy-setup.sh
```

### Issue: Obsidian colors don't appear

**Solution:**
1. Close Obsidian completely
2. Delete `.obsidian/plugins/workspaces.json` (if exists)
3. Reopen Obsidian
4. Go to Settings → Core Plugins → Graph (disable, then enable)
5. Close and reopen graph view

### Issue: Frontmatter looks wrong

**Solution:**
Check that all files start with `---` at the beginning.

If a file has broken frontmatter, manually fix and use `--force` flag:

```bash
# Re-process with overwrite
node scripts/galaxies-frontmatter-generator.js --galaxy=CORE --force
```

### Issue: Some files got skipped

**Solution:**
If files had existing frontmatter, they were skipped. To overwrite:

```bash
node scripts/galaxies-frontmatter-generator.js --galaxy=CREATION --force
```

---

## Verification Checklist

After running the setup:

- [ ] All scripts executed without major errors
- [ ] _HUB.md was created at project root
- [ ] `.obsidian/graph.json` was updated
- [ ] Obsidian reloaded successfully
- [ ] Graph view shows 7 colored clusters
- [ ] Can search by tag (e.g., `tag:galaxy-core`)
- [ ] _HUB.md opens and displays correctly
- [ ] Can navigate from _HUB.md to galaxy guides

---

## Viewing Results

### Check Generated Files

```bash
# View _HUB.md
cat _HUB.md

# Check one frontmatter example
head -20 The_Maestro/README.md

# See graph configuration
cat .obsidian/graph.json
```

### Check Logs

After running setup, logs are in:
```
.metrics/galaxy-setup/
├── CORE_generation.log
├── SPECIALIST_generation.log
├── CREATION_generation.log
├── CODEX_generation.log
├── RUNTIME_generation.log
├── OPERATIONAL_generation.log
├── TOOLS_generation.log
└── obsidian_config.log
```

View any log:
```bash
tail .metrics/galaxy-setup/CORE_generation.log
```

---

## Advanced Usage

### Process Single Galaxy

Perfect for testing or incremental updates:

```bash
# Just process CORE galaxy
node scripts/galaxies-frontmatter-generator.js --galaxy=CORE

# Then SPECIALIST
node scripts/galaxies-frontmatter-generator.js --galaxy=SPECIALIST
```

### Dry Run (Safe Testing)

Preview all changes without modifying files:

```bash
node scripts/galaxies-frontmatter-generator.js --dry-run
```

### Force Overwrite Existing Frontmatter

If you need to update existing frontmatter:

```bash
node scripts/galaxies-frontmatter-generator.js --force
```

---

## What Happens Next

### Your Obsidian Now Has

✨ **Visual Galaxy Map** — See all documents as 7 colored constellations
🔍 **Better Search** — Filter by galaxy, type, status, keywords
📍 **Navigation Hub** — Central _HUB.md connects everything
🏷️ **Consistent Metadata** — Every file has standardized frontmatter

### You Can Now

- Explore the project as a knowledge graph
- Quickly find documents by galaxy or type
- Understand relationships between agents
- Navigate by role (Agent Developer, Finance, Legal, etc.)
- Search with powerful tag-based queries

---

## Git Integration

When ready to commit your changes:

```bash
git add _HUB.md
git add .obsidian/graph.json
git add "The_*/**/*.md"  # All agent files with frontmatter
git add "00_Codex/**/*.md"  # Codex files
git add "eximia_runtime/**/*.md"  # Runtime files
# ... etc for each galaxy

git commit -m "feat: implement galaxy structure with YAML frontmatter

- Add YAML frontmatter to 2533+ markdown files
- Create _HUB.md central maestro navigation
- Configure Obsidian graph with 7-galaxy colors
- Improve documentation discoverability"

git push origin main
```

---

## Support & Resources

**Questions about setup?**
- Check `.metrics/galaxy-setup/` logs for detailed output
- Review `.obsidian/graph.json` to see color configuration
- Open _HUB.md to navigate to specific galaxy guides

**Need to modify galaxy structure?**
- Edit script galaxy definitions at top of `galaxies-frontmatter-generator.js`
- Re-run setup with `--force` flag
- Colors are configured in `generate-obsidian-graph-config.js`

---

## Summary

You now have:
- ✅ 2533+ files with YAML frontmatter
- ✅ 7 galaxies color-coded for visualization
- ✅ Central _HUB.md for navigation
- ✅ Beautiful Obsidian graph with constellation clusters
- ✅ Powerful search and discovery capabilities

**Next step:** Open Obsidian, reload, and explore the galaxies! 🌌

---

*Version 1.0 | Last Updated: 2026-02-02*
