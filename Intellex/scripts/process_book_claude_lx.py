
import argparse
import sys
import os
from pathlib import Path
import PyPDF2
import anthropic
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / 'eximia_runtime' / '.env'
if env_path.exists():
    load_dotenv(env_path)
    print(f"DEBUG: Loaded .env from {env_path}")
else:
    print(f"DEBUG: .env not found at {env_path}")

def extract_text_from_pdf(pdf_path):
    print(f"📖 Extracting text from {pdf_path}...")
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(f"✅ Extracted {len(text)} characters.")
        return text
    except Exception as e:
        print(f"❌ Error extracting text: {e}")
        sys.exit(1)

import time
import random

def retry_with_backoff(func, *args, max_retries=5, initial_delay=10, **kwargs):
    retries = 0
    delay = initial_delay
    
    while retries < max_retries:
        try:
            return func(*args, **kwargs)
        except anthropic.RateLimitError as e:
            print(f"⚠️ Rate Limit Hit. Waiting {delay}s... (Retry {retries+1}/{max_retries})")
            time.sleep(delay)
            retries += 1
            delay *= 2  # Exponential backoff
            delay += random.uniform(0, 5) # Jitter
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
    
    print("❌ Max retries reached. Giving up.")
    return None

def call_claude_api(client, model, prompt, system_prompt):
    message = client.messages.create(
        model=model,
        max_tokens=8192,
        temperature=0.7,
        system=system_prompt,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return message.content[0].text

def call_claude(client, model, prompt, system_prompt="You are a brilliant analyst."):
    print(f"🧠 Calling {model}...")
    return retry_with_backoff(call_claude_api, client, model, prompt, system_prompt)

def generate_lx_package(pdf_path, model="claude-sonnet-4-5-20250929", output_base_dir=None):
    file_path = Path(pdf_path)
    if not file_path.exists():
        print(f"❌ File not found: {pdf_path}")
        return

    api_key = os.getenv("ANTHROPIC_API_KEY")
    client = anthropic.Anthropic(api_key=api_key)
    full_text = extract_text_from_pdf(pdf_path)
    
    # Define output structure
    book_slug = file_path.stem.replace(" ", "_").lower()
    if output_base_dir:
        base_path = Path(output_base_dir) / book_slug
    else:
        base_path = Path(__file__).resolve().parent.parent.parent / "00_Codex" / "eximia_data" / "02_PROCESSED" / "LX" / book_slug
    
    dirs = {
        "synthesis": base_path / "01_SYNTHESIS",
        "kb": base_path / "02_KNOWLEDGE_BASE",
        "clone": base_path / "03_AUTHOR_CLONE",
        "red_team": base_path / "04_RED_TEAM"
    }
    
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)
    
    print(f"📂 Output directory: {base_path}")

    # --- PART 1: DEEP SYNTHESIS (L4) ---
    print("\n🔹 [1/4] Generating Deep Synthesis...")
    synthesis_file = dirs["synthesis"] / "deep_synthesis.md"
    if synthesis_file.exists():
        print(f"⏩ Skipping Deep Synthesis (already exists: {synthesis_file})")
    else:
        prompt_synthesis = f"""
        Analyze the book and generate a Deep Synthesis (L4) following this structure. 
        Ensure minimum 4000 words logic (dense content).
        
        # [Book Title]
        ## Deep Synthesis (L4)
        
        ### 📖 Overview
        ### 🎯 Problem Solved
        ### 💡 Core Thesis
        ### ⚙️ Main Frameworks (Detailed)
        ### 🔍 Critical Analysis (Strengths/Limitations)
        ### 📚 Comparison (vs 4+ relevant books)
        ### 🚀 Practical Application Plan
        ### 💬 Memorable Quotes
        ### 🎯 Final Verdict
        
        TEXT: {full_text}
        """
        synthesis_content = call_claude(client, model, prompt_synthesis)
        if synthesis_content:
            synthesis_file.write_text(synthesis_content, encoding='utf-8')
        time.sleep(5)

    # --- PART 2: KNOWLEDGE BASE ---
    print("\n🔹 [2/4] Generating Knowledge Base...")
    
    kb_prompts = [
        ("KB_01_CORE_PHILOSOPHY.md", "Extract the Core Philosophy and Fundamental Beliefs."),
        ("KB_02_FRAMEWORKS.md", "Extract all Mental Frameworks and Models explicitly."),
        ("KB_05_VOCABULARY.md", "Extract Key Vocabulary and Definitions (Glossary)."),
        ("KB_06_MENTAL_MODELS.md", "Extract implicit Mental Models used by the author.")
    ]
    
    for filename, instruction in kb_prompts:
        kb_file = dirs["kb"] / filename
        if kb_file.exists():
             print(f"⏩ Skipping {filename} (already exists)")
             continue
             
        content = call_claude(client, model, f"{instruction}\n\nTEXT: {full_text}")
        if content:
            kb_file.write_text(content, encoding='utf-8')
        time.sleep(5)

    # --- PART 3: AUTHOR CLONE ---
    print("\n🔹 [3/4] Generating Author Clone Assets...")
    clone_file = dirs["clone"] / "SYSTEM_PROMPT.md"
    if clone_file.exists():
        print(f"⏩ Skipping Author Clone (already exists)")
    else:
        prompt_clone = f"""
        Create a SYSTEM PROMPT for an AI Persona acting as the author of this book.
        Include:
        - Personality/Tone/Voice
        - Core Beliefs
        - Interaction Style (Socratic, Direct, etc.)
        - Knowledge Base references
        
        TEXT: {full_text}
        """
        clone_content = call_claude(client, model, prompt_clone)
        if clone_content:
            clone_file.write_text(clone_content, encoding='utf-8')
        time.sleep(5)

    # --- PART 4: RED TEAM ---
    print("\n🔹 [4/4] Generating Red Team Assets...")
    red_file = dirs["red_team"] / "CHALLENGER_PROMPT.md"
    if red_file.exists():
        print(f"⏩ Skipping Red Team (already exists)")
    else:
        prompt_red = f"""
        Create a CHALLENGER PROMPT (Red Team) designed to critique and stress-test the book's ideas.
        Identify:
        - Potential logical fallacies
        - Edge cases where the advice fails
        - Counter-arguments
        
        TEXT: {full_text}
        """
        red_content = call_claude(client, model, prompt_red)
        if red_content:
            red_file.write_text(red_content, encoding='utf-8')

    print(f"\n✅ LX Package generated at: {base_path}")

def main():
    parser = argparse.ArgumentParser(description="Process LX Package with Claude.")
    parser.add_argument('file', help='PDF file')
    parser.add_argument('--model', default='claude-sonnet-4-5-20250929', help='Model ID')
    args = parser.parse_args()
    
    try:
        generate_lx_package(args.file, args.model)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Critical Error: {e}")

if __name__ == "__main__":
    main()
