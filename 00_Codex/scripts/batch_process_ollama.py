
import asyncio
import os
import sys
from pathlib import Path

# Setup path to import eximia_runtime
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from eximia_runtime.core.agent_executor import AgentExecutor

async def main():
    executor = AgentExecutor()
    model = "ollama/qwen2.5:14b"
    agent_name = "book_processor"

    files_to_process = [
        "holistique_training.md",
        "hoshin_kanri_how_to_connect_strategy_to_execution.md",
        "hoshin_kanri_policy_deployment_method_lean_production.md",
        "hoshin_kanri_resource_guide_lean_enterprise_institute.md",
        "hoshin_kanri_wikipedia.md",
        "resources_i_nexus.md"
    ]
    
    base_path = project_root / "00_Codex" / "eximia_data" / "01_LIBRARY" / "articles"
    
    print(f"🚀 Starting batch processing of {len(files_to_process)} articles...")
    print(f"🤖 Model: {model}")
    print("-" * 50)

    for i, filename in enumerate(files_to_process, 1):
        file_path = base_path / filename
        
        if not file_path.exists():
            print(f"❌ File not found: {filename}")
            continue
            
        print(f"\n[{i}/{len(files_to_process)}] Processing: {filename}")
        
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Construct query
            # We explicitly mention the filename so the output filename logic might pick it up 
            # (though output_manager uses query slug. We rely on the content matching logic in organize script)
            query = f"Analyze and summarize this article ({filename}):\n\n{content[:20000]}" # Truncate if too huge? 14b has decent context.
            
            # Execute
            result = await executor.execute(
                agent_name=agent_name,
                input_data=query,
                model_override=model
            )
            
            print("   ✅ Success")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
