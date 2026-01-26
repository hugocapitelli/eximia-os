import psycopg2
import os
import socket
from urllib.parse import urlparse, unquote
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("VECTOR_DB_URL")
result = urlparse(db_url)
hostname = result.hostname
username = result.username
password = unquote(result.password)
database = result.path[1:]

def test_port(host, port):
    print(f"Testing TCP connection to {host}:{port}...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print(f"✅ Port {port} is OPEN")
            return True
        else:
            print(f"❌ Port {port} is CLOSED/BLOCKED (Code: {result})")
            return False
    except Exception as e:
        print(f"❌ Error testing port {port}: {e}")
        return False

# Test Ports
p5432 = test_port(hostname, 5432)
p6543 = test_port(hostname, 6543)

working_port = None
if p5432: working_port = 5432
elif p6543: working_port = 6543

if working_port:
    print(f"\nAttempting DB connection on port {working_port}...")
    try:
        conn = psycopg2.connect(
            host=hostname,
            port=working_port,
            user=username,
            password=password,
            dbname=database,
            sslmode='require'
        )
        print("✅ DB Connected successfully!")
        conn.close()
    except Exception as e:
        print(f"❌ DB Connection failed: {e}")
else:
    print("\n❌ Could not establish TCP connection to any DB port. Check Firewall/Internet.")
