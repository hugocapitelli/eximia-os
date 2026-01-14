
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

def process_book(pdf_path, model="claude-3-5-sonnet-latest", output_dir=None):
    file_path = Path(pdf_path)
    if not file_path.exists():
        print(f"❌ File not found: {pdf_path}")
        return

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Error: ANTHROPIC_API_KEY not found in environment variables.")
        return

    client = anthropic.Anthropic(api_key=api_key)

    full_text = extract_text_from_pdf(pdf_path)
    
    # Truncation removed for final run (or keep if debugging)
    # print("DEBUG: Truncating text to 2000 chars for testing pipeline.")
    # full_text = full_text[:2000]
    
    print(f"📏 Text length: {len(full_text)} chars")
    
    # Prompt
    prompt = f"""
    You are an expert mental model extractor and book summarizer. 
    Analyze the following text from the book "O Almanaque de Naval Ravikant" (or provided text) and create a comprehensive summary in PORTUGUESE (PT-BR).
    
    Structure your response as follows:
    # Title & Author
    
    ## Core Philosophy / Central Thesis
    (What is the main message?)
    
    ## Key Mental Models & Concepts
    (List and explain the top 5-10 concepts, e.g., Specific Knowledge, Leverage, Wealth vs Money)
    
    ## Actionable Advice
    (Practical steps the reader can take)
    
    ## Notable Quotes
    (Extract 3-5 powerful quotes)
    
    ---
    TEXT CONTENT:
    {full_text}
    """
    
    print(f"🧠 Processing with {model}...")
    try:
        message = client.messages.create(
            model=model,
            max_tokens=8192,
            temperature=0.7,
            system="You are a brilliant analyst who extracts deep insights from books.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        print(f"DEBUG: Message received. ID: {message.id}")
        
        if not message.content:
            print("❌ Error: Message content is empty.")
            return

        content = message.content[0].text
        print(f"DEBUG: Content length: {len(content)}")
        
        # Save output
        if output_dir:
            out_dir = Path(output_dir)
        else:
            base_dir = Path(__file__).resolve().parent.parent.parent 
            out_dir = base_dir / "00_Codex" / "eximia_data" / "02_PROCESSED" / "books"
            
        print(f"DEBUG: Saving to {out_dir}")
        out_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_slug = model.replace(":", "-").replace(".", "-")
        output_filename = f"{file_path.stem}_processed_{model_slug}_{timestamp}.md"
        output_path = out_dir / output_filename
        
        output_path.write_text(content, encoding='utf-8')
        print(f"✅ Saved to {output_path}")

    except anthropic.BadRequestError as e:
        print(f"❌ Bad Request Error (check model name or context length): {e}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Error during Claude inference: {e}")

def main():
    print("DEBUG: Script started.")
    parser = argparse.ArgumentParser(description="Process PDF book with Claude.")
    parser.add_argument('file', help='PDF file to process')
    parser.add_argument('--model', default='claude-3-5-sonnet-latest', help='Claude model to use (e.g., claude-3-5-sonnet-latest)')
    parser.add_argument('--output-dir', help='Directory to save output')
    
    args = parser.parse_args()
    
    try:
        process_book(args.file, args.model, args.output_dir)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Critical Error: {e}")

if __name__ == "__main__":
    main()
