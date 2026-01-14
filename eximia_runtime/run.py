"""
CLI Runner for Eximia Agents
Allows executing agents with specific models via terminal.
"""

import asyncio
import argparse
import sys
import traceback
from eximia_runtime.core.agent_executor import executor
from eximia_runtime.core.config import settings

async def main():
    parser = argparse.ArgumentParser(description="Run Eximia Agent")
    parser.add_argument("--agent", required=True, help="Agent name (e.g. the_maestro)")
    parser.add_argument("--model", required=False, help="Model override (e.g. claude-3-opus)")
    parser.add_argument("--query", required=True, help="Input query")
    parser.add_argument("--file", required=False, help="Input file to prepend to query")
    
    args = parser.parse_args()
    
    # Prepend file content if provided
    query = args.query
    if args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                content = f.read()
            query = f"CONTEXT FROM FILE ({args.file}):\n{content}\n\nQUERY:\n{query}"
        except Exception as e:
            print(f"Error reading input file: {e}")
            sys.exit(1)

    print(f"🚀 Starting {args.agent}...")
    if args.model:
        print(f"🤖 Model Override: {args.model}")
    else:
        print(f"🤖 Model: Default ({settings.default_model})")
        
    try:
        result = await executor.execute(
            agent_name=args.agent,
            input_data=query,
            model_override=args.model
        )
        
        print("\n" + "="*80 + "\n")
        print(result.content)
        print("\n" + "="*80 + "\n")
        
        # Print metadata
        print(f"✅ Finished in {result.execution_time_ms/1000:.2f}s")
        print(f"📊 Tokens: {result.tokens_used}")
        if result.metadata.get("saved_to"):
            print(f"💾 Saved to: {result.metadata['saved_to']}")
            
    except Exception as e:
        with open("error.log", "w", encoding="utf-8") as f:
            f.write(f"Error: {str(e)}\n")
            traceback.print_exc(file=f)
        print(f"\n❌ Execution Failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
