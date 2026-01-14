
import json
import os

try:
    with open("extracted_text.txt", "r", encoding="utf-8") as f:
        content = f.read()
except FileNotFoundError:
    print("extracted_text.txt not found")
    exit(1)

payload = {
    "chapter_title": "Stack Financeira Enxuta para Startups SaaS B2B",
    "chapter_content": content,
    "learning_objective": "Compreender a estrutura de ferramentas e processos financeiros essenciais para uma startup SaaS B2B enxuta.",
    "max_questions": 3
}

with open("harven_input.json", "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=4)

print("harven_input.json created")
