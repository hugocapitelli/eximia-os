"""Temporary script to save agent integration guide to Codex"""
import sys
sys.path.insert(0, 'Eximia_Runtime')

from eximia_runtime.utils.codex_integration import save_to_codex

# Read the guide content
with open(r"C:\Users\hugoc\.gemini\antigravity\brain\fdb17e9b-6b80-40b1-adda-8cac2340fe60\agent_frontend_integration_guide.md", 'r', encoding='utf-8') as f:
    content = f.read()

# Extract title from the first markdown header
title = "Linking Antigravity Agents to Frontends - Integration Patterns"

# Save to Codex
result = save_to_codex(
    title=title,
    content_text=content,
    category="ideas",
    tags="antigravity,frontend,agents,integration,architecture,mcp,websockets,react,fastapi,bibliotheca,stratos,harven",
    source_url="local://ideas/agent_frontend_integration.md",
    idea_type="cluster"
)

print(f"✅ Saved to Codex!")
print(f"📊 Content ID: {result.get('id', 'N/A')}")
print(f"📝 Title: {title}")
print(f"🏷️ Category: ideas")
print(f"🔖 Type: cluster")
print(f"📁 File: 00_Codex/eximia_data/04_IDEAS/agent_frontend_integration.md")
