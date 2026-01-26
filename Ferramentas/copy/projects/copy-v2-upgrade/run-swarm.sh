#!/bin/bash
# Copy Framework v2.0 - Swarm Runner (wrapper)
# Usage: ./run-swarm.sh [workers]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NUM_WORKERS=${1:-8}

# Use canonical Ralph tmux swarm script
exec /Users/oalanicolas/Code/mmos/expansion-packs/ralph/scripts/ralph-tmux-swarm.sh "$SCRIPT_DIR" "$NUM_WORKERS"
