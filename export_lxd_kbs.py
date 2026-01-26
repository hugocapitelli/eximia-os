import os
import shutil
import zipfile
from datetime import date
from pathlib import Path

# Configuração
SOURCE_DIR = Path(r"c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\X_Agents\LXD_Architect\02_profile\knowledge_base")
EXPORT_BASE = Path(r"c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\00_Codex\eximia_data\03_EXPORTS")
THEME = "LXD_Architect_KBs"

def export_kbs():
    today = date.today()
    export_dir = EXPORT_BASE / f"{THEME}_{today}"
    
    # Criar diretório de exportação
    if export_dir.exists():
        shutil.rmtree(export_dir)
    export_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📦 Criando pacote em: {export_dir}")
    
    # Copiar arquivos
    files = list(SOURCE_DIR.glob("*.md"))
    if not files:
        print("❌ Nenhum arquivo encontrado em:", SOURCE_DIR)
        return

    print(f"🔍 Encontrados {len(files)} arquivos.")
    
    file_list_md = ""
    
    for file in files:
        dest = export_dir / file.name
        shutil.copy2(file, dest)
        file_list_md += f"- [{file.stem}]({file.name})\n"
        print(f"   - Copiado: {file.name}")

    # Gerar README.md
    readme_content = f"""# Pacote Codex: {THEME}

**Criado em:** {today}
**Total de itens:** {len(files)}
**Origem:** {SOURCE_DIR}

## Conteúdo

{file_list_md}
"""
    (export_dir / "README.md").write_text(readme_content, encoding="utf-8")
    print("📝 README.md gerado.")

    # Criar ZIP
    zip_path = EXPORT_BASE / f"{THEME}_{today}.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(export_dir):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(export_dir)
                zipf.write(file_path, arcname)
    
    print(f"✅ ZIP criado com sucesso: {zip_path}")

if __name__ == "__main__":
    export_kbs()
