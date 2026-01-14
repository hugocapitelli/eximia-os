#!/usr/bin/env python3
import argparse
import os
import sys
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import anthropic

# Models
# Using 'latest' aliases to ensure we get the best available version (e.g. 4.5 if available via these aliases, or 3.5/3.0 as fallback)
MODELS = {
    'sonnet': 'claude-sonnet-4-5-20250929',
    'opus': 'claude-3-opus-20240229'
}

def process_file(file_path, model_key):
    path = Path(file_path)
    if not path.exists():
        print(f"❌ File not found: {file_path}")
        return

    # Load environment variables
    env_path = Path(__file__).parent.parent / '.env'
    load_dotenv(dotenv_path=env_path)
    
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ Error: ANTHROPIC_API_KEY not found in .env file")
        return

    # Initialize client
    client = anthropic.Anthropic(api_key=api_key)
    model = MODELS.get(model_key, MODELS['sonnet'])

    print(f"📖 Reading {path.name}...")
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return

    system_prompt = "You are an expert analyst. Process the provided text and provide a structured summary."
    
    user_prompt = f"""
    Please analyze the following article:
    
    {content}
    
    Provide the output in the following Markdown format:
    
    # [Title]
    
    ## Executive Summary
    (Concise summary of the main points)
    
    ## Key Takeaways
    - (Bullet points of key information)
    
    ## Detailed Analysis
    (In-depth analysis of the content, focusing on implications and strategic value)
    """

    print(f"🧠 Processing with {model}...")
    
    try:
        if model_key == 'sonnet':
            # Sonnet 3.5 supports max 8192 output tokens
            max_tokens = 8192
        else:
             # Opus 3 supports max 4096 output tokens usually
            max_tokens = 4096

        message = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=0.7,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        )
        
        generated_text = message.content[0].text
        
        if not generated_text:
            print("❌ No response generated.")
            return

        # Setup output directory
        base_dir = Path(__file__).parent.parent 
        output_dir = base_dir / "eximia_data" / "02_PROCESSED"
        output_dir.mkdir(parents=True, exist_ok=True)

        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"{path.stem}_processed_{model_key}.md"
        output_path = output_dir / output_filename
        
        output_path.write_text(generated_text, encoding='utf-8')
        print(f"✅ Saved to {output_path}")

    except anthropic.APIError as e:
        print(f"❌ Anthropic API Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Process files with Anthropic Claude models.")
    parser.add_argument('files', metavar='FILE', nargs='+', help='Files to process')
    parser.add_argument('--model', choices=['sonnet', 'opus'], default='sonnet', help='Model to use: sonnet or opus')
    
    args = parser.parse_args()
    
    print(f"🚀 Starting processing with model: {args.model}")
    
    for file in args.files:
        print("-" * 50)
        process_file(file, args.model)

if __name__ == "__main__":
    main()
