#!/bin/bash
# Galaxy Structure Setup for eximIA.OS
# Generates YAML frontmatter for all 2533+ files and configures Obsidian graph

set -e

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$BASE_DIR/scripts"
LOG_DIR="$BASE_DIR/.metrics/galaxy-setup"

mkdir -p "$LOG_DIR"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  eximIA.OS Galaxy Structure Setup                              ║"
echo "║  • Generate YAML frontmatter across 7 galaxies                 ║"
echo "║  • Configure Obsidian graph with colors                        ║"
echo "║  • Create _HUB.md central navigation                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "📋 Configuration:"
echo "   Base directory: $BASE_DIR"
echo "   Scripts: $SCRIPTS_DIR"
echo "   Logs: $LOG_DIR"
echo ""

# Step 1: Dry run (optional)
if [ "$1" == "--dry-run" ]; then
    echo "🧪 Running DRY RUN (no files modified)..."
    echo ""

    for galaxy in CORE SPECIALIST CREATION CODEX RUNTIME OPERATIONAL TOOLS; do
        echo "   Testing galaxy: $galaxy..."
        node "$SCRIPTS_DIR/galaxies-frontmatter-generator.js" \
            --galaxy="$galaxy" \
            --dry-run \
            > "$LOG_DIR/${galaxy}_dry_run.log" 2>&1 || true
    done

    echo ""
    echo "✅ Dry run complete. Check logs in $LOG_DIR/"
    echo ""
    exit 0
fi

# Step 2: Generate frontmatter
echo "🌌 Generating YAML frontmatter for all 7 galaxies..."
echo ""

for galaxy in CORE SPECIALIST CREATION CODEX RUNTIME OPERATIONAL TOOLS; do
    echo "   [$galaxy] Processing..."
    node "$SCRIPTS_DIR/galaxies-frontmatter-generator.js" \
        --galaxy="$galaxy" \
        > "$LOG_DIR/${galaxy}_generation.log" 2>&1 || {
        echo "❌ Error processing $galaxy. Check $LOG_DIR/${galaxy}_generation.log"
        continue
    }
    echo "   ✅ $galaxy complete"
done

echo ""
echo "✅ Frontmatter generation complete!"
echo ""

# Step 3: Configure Obsidian graph
echo "🎨 Configuring Obsidian graph visualization..."
node "$SCRIPTS_DIR/generate-obsidian-graph-config.js" \
    > "$LOG_DIR/obsidian_config.log" 2>&1

echo ""
echo "✅ Obsidian configuration complete!"
echo ""

# Step 4: Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ GALAXY STRUCTURE SETUP COMPLETE                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 What was done:"
echo "   ✓ YAML frontmatter added to ~2500+ markdown files"
echo "   ✓ 7 galaxies classified with color codes"
echo "   ✓ Obsidian graph configured with color groups"
echo "   ✓ _HUB.md central navigation created"
echo ""
echo "🔍 Next steps:"
echo "   1. Reload Obsidian (Ctrl+R or Cmd+Shift+R)"
echo "   2. Open graph view to see galaxies in color"
echo "   3. Click on _HUB.md to start navigating"
echo "   4. Review logs in: $LOG_DIR/"
echo ""
echo "📝 Important files:"
echo "   • _HUB.md — Central navigation hub"
echo "   • .obsidian/graph.json — Updated with galaxy colors"
echo ""
echo "For detailed logs, check:"
for galaxy in CORE SPECIALIST CREATION CODEX RUNTIME OPERATIONAL TOOLS; do
    echo "   • $LOG_DIR/${galaxy}_generation.log"
done
echo ""
