
import os
import uuid
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Supabase credentials not found in env")
    exit(1)

supabase = create_client(supabase_url, supabase_key)

def seed():
    print("Checking disciplines...")
    res = supabase.table("disciplines").select("*").execute()
    count = len(res.data)
    print(f"Found {count} disciplines.")
    
    if count == 0:
        print("Seeding dummy discipline...")
        dummy = {
            "id": "ENG2024",
            "title": "Engenharia de Software 2024.1",
            "department": "Tecnologia"
        }
        try:
            supabase.table("disciplines").insert(dummy).execute()
            print("Discipline created: ENG2024")
        except Exception as e:
            print(f"Error creating discipline: {e}")
    else:
        print("Disciplines already exist. Skipping seed.")

if __name__ == "__main__":
    seed()
