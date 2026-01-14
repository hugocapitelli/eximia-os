import sys
from pathlib import Path
import psycopg2

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from eximia_runtime.core.config import settings

def init_db():
    print("🚀 Initializing Supabase Database Schema...")
    
    if not settings.vector_db_url:
        print("❌ VECTOR_DB_URL not found in settings!")
        sys.exit(1)
        
    try:
        conn = psycopg2.connect(settings.vector_db_url)
        cursor = conn.cursor()
        
        # Read SQL file
        sql_path = Path(__file__).parent / "init_supabase.sql"
        print(f"📖 Reading schema from {sql_path.name}...")
        sql = sql_path.read_text(encoding='utf-8')
        
        # Split commands (simple split by ;)
        # Better to execute full script if driver supports it
        cursor.execute(sql)
        
        conn.commit()
        print("✅ Tables created successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Database Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()
