#!/usr/bin/env python3
"""
Inicialização do database SQLite do Projeto Codex
Versão: 1.0.0
"""

import sqlite3
import os
from pathlib import Path

# Paths relativos ao script
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = PROJECT_ROOT / "eximia_data"
DB_PATH = DATA_DIR / "vault.db"
SCHEMA_PATH = SCRIPT_DIR / "db_schema.sql"


def init_database():
    """Inicializa o database SQLite com o schema"""
    
    print("🗄️ Projeto Codex - Inicialização do Database")
    print("=" * 50)
    
    # Verificar se schema existe
    if not SCHEMA_PATH.exists():
        print(f"❌ Erro: Schema não encontrado em {SCHEMA_PATH}")
        return False
    
    # Criar diretório de dados se não existir
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Verificar se database já existe
    if DB_PATH.exists():
        response = input(f"⚠️  Database já existe em {DB_PATH}. Recriar? (s/N): ")
        if response.lower() != 's':
            print("✅ Operação cancelada.")
            return True
        DB_PATH.unlink()
    
    try:
        # Ler schema SQL
        with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Criar conexão e executar schema
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print(f"📝 Criando database em: {DB_PATH}")
        cursor.executescript(schema_sql)
        conn.commit()
        
        # Verificar tabelas criadas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"\n✅ Database criado com sucesso!")
        print(f"📊 Tabelas criadas: {len(tables)}")
        for table in sorted(tables):
            if not table.startswith('sqlite_'):
                print(f"   - {table}")
        
        # Estatísticas iniciais
        cursor.execute("SELECT COUNT(*) FROM contents")
        count = cursor.fetchone()[0]
        print(f"\n📈 Conteúdos: {count}")
        
        conn.close()
        
        print(f"\n🎉 Projeto Codex pronto para uso!")
        print(f"💡 Próximo passo: Use /codex-add para adicionar conteúdo")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Erro ao criar database: {e}")
        return False


if __name__ == "__main__":
    success = init_database()
    exit(0 if success else 1)
