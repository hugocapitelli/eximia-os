
import sys
import os

try:
    import pypdf
except ImportError:
    print("PYPDF NOT FOUND")
    sys.exit(1)

def extract_text(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

pdf_file = "Projetos/Harven.ai/Stack Financeira Enxuta para Startups SaaS B2B.pdf"
full_path = os.path.join(os.getcwd(), pdf_file)

if not os.path.exists(full_path):
    print(f"File not found: {full_path}")
    sys.exit(1)

content = extract_text(full_path)
if content:
    with open("extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Extraction successful")
else:
    print("Extraction failed")
