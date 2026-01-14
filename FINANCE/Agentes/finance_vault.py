"""
Finance Vault - Local Database for ExímIA Finance
Stores metadata about all processed documents and their relationships.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict

VAULT_PATH = Path(__file__).parent.parent / "finance_vault.json"

def load_vault() -> Dict:
    """Load the vault database or create if not exists"""
    if VAULT_PATH.exists():
        with open(VAULT_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "documents": [],
        "categories": ["Notas_Fiscais", "Impostos", "Boletos", "Comprovantes"],
        "correlations": [],
        "last_updated": None
    }

def save_vault(vault: Dict):
    """Save the vault database"""
    vault["last_updated"] = datetime.now().isoformat()
    with open(VAULT_PATH, 'w', encoding='utf-8') as f:
        json.dump(vault, f, ensure_ascii=False, indent=2)

def add_category(vault: Dict, category: str) -> bool:
    """Add a new category if it doesn't exist"""
    if category not in vault["categories"]:
        vault["categories"].append(category)
        save_vault(vault)
        return True
    return False

def add_document(vault: Dict, doc: Dict) -> str:
    """Add a document record. Returns the doc_id."""
    doc_id = f"{doc['type']}_{doc['date']}_{doc.get('entity', 'unknown')}_{len(vault['documents'])}"
    doc["id"] = doc_id
    doc["added_at"] = datetime.now().isoformat()
    vault["documents"].append(doc)
    save_vault(vault)
    return doc_id

def find_matching_bill(vault: Dict, receipt: Dict) -> Optional[Dict]:
    """Find a bill that matches this receipt (same entity/amount/period)"""
    for doc in vault["documents"]:
        if doc["type"] == "bill" and doc.get("status") == "unpaid":
            # Match by entity and approximate amount
            if (doc.get("entity") == receipt.get("entity") and 
                abs(doc.get("amount", 0) - receipt.get("amount", 0)) < 0.01):
                return doc
    return None

def mark_bill_as_paid(vault: Dict, bill_id: str, receipt_id: str):
    """Mark a bill as paid and create correlation"""
    for doc in vault["documents"]:
        if doc["id"] == bill_id:
            doc["status"] = "paid"
            doc["paid_at"] = datetime.now().isoformat()
            doc["receipt_id"] = receipt_id
            break
    
    # Add correlation
    vault["correlations"].append({
        "bill_id": bill_id,
        "receipt_id": receipt_id,
        "correlated_at": datetime.now().isoformat()
    })
    save_vault(vault)

def get_unpaid_bills(vault: Dict) -> List[Dict]:
    """Get all unpaid bills"""
    return [doc for doc in vault["documents"] if doc["type"] == "bill" and doc.get("status") == "unpaid"]

def get_documents_by_type(vault: Dict, doc_type: str) -> List[Dict]:
    """Get all documents of a specific type"""
    return [doc for doc in vault["documents"] if doc["type"] == doc_type]
