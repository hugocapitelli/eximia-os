"""
The_CFO - Finance Agent for ExímIA
Processes financial documents with OCR, categorization, and correlation.
"""

import os
import shutil
import hashlib
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Local imports
from finance_vault import (
    load_vault, save_vault, add_category, add_document,
    find_matching_bill, mark_bill_as_paid, get_unpaid_bills
)

load_dotenv()

# Constants
FINANCE_DIR = Path(__file__).parent.parent
INBOX_DIR = FINANCE_DIR / "2026" / "00.INBOX"
PROCESSED_DIR = FINANCE_DIR / "2026"
REPORTS_DIR = FINANCE_DIR / "reports"
POPPLER_BIN = FINANCE_DIR / "bin" / "Library" / "bin"

# Add Poppler to PATH
if POPPLER_BIN.exists():
    os.environ["PATH"] += os.pathsep + str(POPPLER_BIN)
else:
    print(f"⚠️ Poppler not found at: {POPPLER_BIN}")

class FinanceAgent:
    def __init__(self):
        self.name = "The_CFO"
        self.vault = load_vault()
        self.session_processed = []
        self.session_correlations = []
        print(f"🤖 {self.name} initialized.")

    def run(self):
        """Main execution method"""
        print(f"\n📂 Scanning INBOX: {INBOX_DIR}")
        self.process_inbox()
        self.reconcile_payments()
        report_path = self.generate_report()
        print(f"\n📊 Report generated: {report_path}")
        return report_path

    def process_inbox(self):
        """Scans INBOX and processes new files"""
        if not INBOX_DIR.exists():
            print(f"❌ Inbox not found: {INBOX_DIR}")
            return

        files = list(INBOX_DIR.glob("*.*"))
        if not files:
            print("📭 Inbox empty.")
            return

        print(f"📄 Found {len(files)} files to process.")
        for file_path in files:
            if file_path.name.startswith("."): continue
            self.process_file(file_path)

    def process_file(self, file_path):
        print(f"   📄 Processing: {file_path.name}...")
        
        # 1. OCR
        text_content = self.perform_ocr(file_path)
        
        # 2. AI Extraction
        metadata = self.extract_metadata(text_content, file_path.name)
        if not metadata:
            print(f"   ⚠️ Could not extract metadata for {file_path.name}")
            return
        
        # 3. Dynamic Category Handling
        category = metadata.get("category", "Outros")
        if category not in self.vault["categories"]:
            print(f"      🆕 New category detected: {category}")
            add_category(self.vault, category)

        # 4. Organize File
        new_path = self.organize_file(file_path, metadata)
        if new_path:
            metadata["file_path"] = str(new_path)
            metadata["status"] = "unpaid" if metadata["type"] == "bill" else "processed"
            doc_id = add_document(self.vault, metadata)
            self.session_processed.append(metadata)
            
            # 5. If receipt, try to correlate with bill
            if metadata["type"] == "receipt":
                self.correlate_receipt(metadata)

    def correlate_receipt(self, receipt: dict):
        """Try to find and correlate this receipt with an unpaid bill"""
        matching_bill = find_matching_bill(self.vault, receipt)
        if matching_bill:
            print(f"      🔗 Correlating receipt with bill: {matching_bill['id']}")
            mark_bill_as_paid(self.vault, matching_bill["id"], receipt["id"])
            self.move_bill_to_paid(matching_bill)
            self.session_correlations.append({
                "receipt": receipt,
                "bill": matching_bill
            })

    def move_bill_to_paid(self, bill: dict):
        """Move a bill file from A_Pagar to Pagos"""
        old_path = Path(bill.get("file_path", ""))
        if old_path.exists():
            new_path = Path(str(old_path).replace("A_Pagar", "Pagos"))
            new_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(old_path), str(new_path))
            print(f"      ✅ Bill moved to Pagos: {new_path.name}")
            # Update vault
            for doc in self.vault["documents"]:
                if doc["id"] == bill["id"]:
                    doc["file_path"] = str(new_path)
            save_vault(self.vault)

    def reconcile_payments(self):
        """Re-scan existing documents and update correlations"""
        print("\n🔄 Reconciling payments...")
        unpaid = get_unpaid_bills(self.vault)
        if not unpaid:
            print("   ✅ No pending bills.")
            return
        
        for bill in unpaid:
            # Check if a matching receipt exists
            matching = find_matching_bill(self.vault, {"entity": bill.get("entity"), "amount": bill.get("amount"), "type": "receipt"})
            # This is a simplified check; in production, we'd search receipts

    def perform_ocr(self, file_path):
        """Extracts text from PDF or Image"""
        try:
            import pytesseract
            from PIL import Image
            from pdf2image import convert_from_path
            
            # Configure Tesseract Path (Windows)
            tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
            if os.path.exists(tesseract_path):
                pytesseract.pytesseract.tesseract_cmd = tesseract_path
            
            text = ""
            suffix = file_path.suffix.lower()

            if suffix in ['.jpg', '.jpeg', '.png']:
                img = Image.open(file_path)
                text = pytesseract.image_to_string(img, lang='eng')
            elif suffix == '.pdf':
                try:
                    images = convert_from_path(str(file_path))
                    for i, image in enumerate(images):
                        page_text = pytesseract.image_to_string(image, lang='eng')
                        text += f"\n--- Page {i+1} ---\n{page_text}"
                except Exception as e:
                    print(f"      ⚠️ PDF OCR Error: {e}")
                    return None
            return text
        except ImportError:
            print("      ⚠️ OCR dependencies missing")
            return "MOCK TEXT FOR TESTING"
        except Exception as e:
            print(f"      ❌ OCR Failed: {e}")
            return None

    def extract_metadata(self, text, filename):
        """Uses pattern matching (placeholder for LLM) to extract metadata"""
        if not text: return None
        
        print("      🧠 Analyzing document...")
        
        category = "Outros"
        doc_type = "unknown"
        entity = "Desconhecido"
        amount = 0.0
        
        lower_text = text.lower()
        lower_filename = filename.lower()
        
        # Type detection
        if "nota fiscal" in lower_text or "nf" in lower_filename:
            doc_type = "invoice"
            category = "Notas_Fiscais"
        elif any(x in lower_text for x in ["darf", "das", "simples nacional", "imposto"]):
            doc_type = "tax"
            category = "Impostos"
        elif "comprovante" in lower_text or "pagamento" in lower_filename:
            doc_type = "receipt"
            category = "Comprovantes"
        elif "boleto" in lower_text or "boleto" in lower_filename:
            doc_type = "bill"
            category = "Boletos"
        
        # Try to extract amount (simplified)
        import re
        amount_match = re.search(r'R\$\s*([\d.,]+)', text)
        if amount_match:
            amount_str = amount_match.group(1).replace('.', '').replace(',', '.')
            try:
                amount = float(amount_str)
            except:
                pass

        return {
            "type": doc_type,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "entity": entity,
            "amount": amount,
            "category": category
        }

    def organize_file(self, file_path, metadata):
        """Moves file to correct folder"""
        try:
            base_dir = PROCESSED_DIR
            folder_name = metadata.get("category", "Outros")
            
            # Ensure category folder exists
            if folder_name not in self.vault["categories"]:
                add_category(self.vault, folder_name)
            
            date_str = metadata.get("date", datetime.now().strftime("%Y-%m-%d"))
            month_str = datetime.strptime(date_str, "%Y-%m-%d").strftime("%m")
            
            sub_folder = ""
            if metadata["type"] == "invoice":
                entity = metadata.get("entity", "Unsorted")
                sub_folder = f"{entity}/{month_str}"
            elif metadata["type"] == "tax":
                tax_name = metadata.get("tax_name", "Geral")
                sub_folder = f"{tax_name}/{month_str}"
            elif metadata["type"] == "bill":
                sub_folder = f"A_Pagar/{month_str}"
            elif metadata["type"] == "receipt":
                sub_folder = f"{month_str}"
            else:
                sub_folder = month_str
            
            target_dir = base_dir / folder_name / sub_folder
            target_dir.mkdir(parents=True, exist_ok=True)
            
            entity = metadata.get("entity", "Unknown").replace(" ", "-")
            amount = f"{metadata.get('amount', 0):.2f}"
            suffix = file_path.suffix
            new_name = f"{date_str}_{entity}_{amount}_{metadata['type'].upper()}{suffix}"
            target_path = target_dir / new_name

            shutil.move(str(file_path), str(target_path))
            print(f"      ✅ Moved to: {target_path}")
            return target_path

        except Exception as e:
            print(f"      ❌ Organization Failed: {e}")
            return None

    def generate_report(self) -> Path:
        """Generate a Markdown report of this session"""
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        report_path = REPORTS_DIR / f"finance_report_{timestamp}.md"
        
        unpaid = get_unpaid_bills(self.vault)
        
        lines = [
            f"# 📊 ExímIA Finance Report",
            f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "",
            "---",
            "",
            "## 📥 Documents Processed This Session",
            ""
        ]
        
        if self.session_processed:
            for doc in self.session_processed:
                lines.append(f"- **{doc['type'].upper()}**: {doc.get('entity', 'N/A')} - R$ {doc.get('amount', 0):.2f}")
        else:
            lines.append("_No new documents processed._")
        
        lines.extend([
            "",
            "## 🔗 Correlations Made",
            ""
        ])
        
        if self.session_correlations:
            for corr in self.session_correlations:
                lines.append(f"- Comprovante `{corr['receipt'].get('id')}` ↔ Boleto `{corr['bill'].get('id')}`")
        else:
            lines.append("_No new correlations._")
        
        lines.extend([
            "",
            "## ⚠️ Unpaid Bills (Pending)",
            ""
        ])
        
        if unpaid:
            for bill in unpaid:
                lines.append(f"- **{bill.get('entity', 'N/A')}**: R$ {bill.get('amount', 0):.2f} (Due: {bill.get('date', 'N/A')})")
        else:
            lines.append("_All bills are paid! 🎉_")
        
        lines.extend([
            "",
            "---",
            f"_Report generated by The_CFO_"
        ])
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        
        return report_path


if __name__ == "__main__":
    agent = FinanceAgent()
    agent.run()
