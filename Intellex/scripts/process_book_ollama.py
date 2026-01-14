
import argparse
import sys
from pathlib import Path
import PyPDF2
import ollama
from datetime import datetime
import json

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

def chunk_text(text, chunk_size=100000):
    # Simple chunking to avoid blowing up context if it's massive. 
    # Qwen2.5 supports 128k, so 100k chars is a safe-ish start for a single pass if meaningful,
    # but for a whole book, we might need a better strategy. 
    # For now, let's try to process proper chunks or the whole thing if it fits.
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def process_book(pdf_path, model="qwen2.5:14b", output_dir=None):
    file_path = Path(pdf_path)
    if not file_path.exists():
        print(f"❌ File not found: {pdf_path}")
        return

    full_text = extract_text_from_pdf(pdf_path)
    
    # Basic Prompt Strategy:
    # Since we want a good summary, we'll ask for it directly.
    # Note: If text is too long, we might need to summarize chunks.
    
    prompt_template = """
    You are an expert mental model extractor and book summarizer. 
    Analyze the following text from the book "O Almanaque de Naval Ravikant" (or provided text) and create a comprehensive summary.
    
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
    {text}
    """
    
    # Check length. If > 100k chars, we warn or truncate for this v1 script.
    # Naval's almanack is text heavy but maybe fits.
    print(f"📏 Text length: {len(full_text)} chars")
    
    truncated_text = full_text[:100000] # Limit for safety in this first version
    if len(full_text) > 100000:
        print("⚠️ Text too long, truncating to first 100k chars for this pass.")
    
    final_prompt = prompt_template.format(text=truncated_text)
    
    print(f"🧠 Processing with {model}...")
    try:
        response = ollama.chat(model=model, messages=[
            {'role': 'user', 'content': final_prompt},
        ])
        
        content = response['message']['content']
        
        # Save output
        if output_dir:
            out_dir = Path(output_dir)
        else:
            out_dir = Path("00_Codex/eximia_data/02_PROCESSED/books")
            
        out_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"{file_path.stem}_processed_{timestamp}.md"
        output_path = out_dir / output_filename
        
        output_path.write_text(content, encoding='utf-8')
        print(f"✅ Saved to {output_path}")
        return str(output_path)

    except Exception as e:
        print(f"❌ Error during Ollama inference: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Process PDF book with Ollama.")
    parser.add_argument('file', help='PDF file to process')
    parser.add_argument('--model', default='qwen2.5:14b', help='Ollama model to use')
    parser.add_argument('--output-dir', help='Directory to save output')
    
    args = parser.parse_args()
    
    process_book(args.file, args.model, args.output_dir)

if __name__ == "__main__":
    main()
