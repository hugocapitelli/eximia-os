#!/usr/bin/env python3
import argparse
import json
import requests
import sys
from pathlib import Path
from datetime import datetime

def process_file(file_path, model, output_dir):
    path = Path(file_path)
    if not path.exists():
        print(f"❌ File not found: {file_path}")
        return

    print(f"📖 Reading {path.name}...")
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return

    prompt = f"""
    You are an expert analyst. Process the following text and provide a structured summary.
    
    Format:
    # [Title]
    
    ## Executive Summary
    (Concise summary of the main points)
    
    ## Key Takeaways
    - (Bullet points of key information)
    
    ## Detailed Analysis
    (In-depth analysis of the content)
    
    Text to process:
    {content}
    """

    print(f"🧠 Processing with {model}...")
    
    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                'model': model,
                'prompt': prompt,
                'stream': False
            },
            timeout=300
        )
        response.raise_for_status()
        result = response.json()
        generated_text = result.get('response', '')
        
        if not generated_text:
            print("❌ No response generated from Ollama.")
            return

        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"{path.stem}_processed.md"
        output_path = output_dir / output_filename
        
        output_path.write_text(generated_text, encoding='utf-8')
        print(f"✅ Saved to {output_path}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error to Ollama (should be running at localhost:11434): {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Process files with local Ollama model.")
    parser.add_argument('files', metavar='FILE', nargs='+', help='Files to process')
    parser.add_argument('--model', default='qwen2.5:14b', help='Ollama model to use')
    
    args = parser.parse_args()
    
    # Setup output directory
    base_dir = Path(__file__).parent.parent 
    output_dir = base_dir / "eximia_data" / "02_PROCESSED"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📂 Output directory: {output_dir}")
    print(f"🤖 Model: {args.model}")
    
    for file in args.files:
        print("-" * 50)
        process_file(file, args.model, output_dir)

if __name__ == "__main__":
    main()
