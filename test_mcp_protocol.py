"""
MCP Protocol Test Script

Simulates the complete Antigravity MCP handshake to verify server compliance.
Run this BEFORE testing in Antigravity to catch protocol issues early.
"""

import subprocess
import json
import sys
from pathlib import Path


def test_mcp_server():
    """Test the MCP server with complete protocol handshake"""

    project_root = Path(__file__).parent

    print("=" * 60)
    print("MCP Protocol Test - Simulating Antigravity Handshake")
    print("=" * 60)

    # Start the server
    print("\n[1/5] Starting MCP server...")

    proc = subprocess.Popen(
        [sys.executable, "-m", "eximia_runtime.interfaces.mcp_server_v2"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=str(project_root),
        env={
            **dict(__import__('os').environ),
            "PYTHONPATH": str(project_root),
            "PYTHONUNBUFFERED": "1"
        },
        text=True,
        bufsize=1
    )

    def send_request(request: dict) -> dict:
        """Send JSON-RPC request and get response"""
        line = json.dumps(request) + "\n"
        proc.stdin.write(line)
        proc.stdin.flush()

        response_line = proc.stdout.readline()
        if not response_line:
            raise RuntimeError("No response from server")

        return json.loads(response_line)

    def send_notification(notification: dict):
        """Send JSON-RPC notification (no response expected)"""
        line = json.dumps(notification) + "\n"
        proc.stdin.write(line)
        proc.stdin.flush()

    try:
        # Test 1: Initialize
        print("\n[2/5] Sending initialize request...")
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "test-client",
                    "version": "1.0.0"
                }
            }
        }

        response = send_request(init_request)

        if "error" in response:
            print(f"   ERROR: {response['error']}")
            return False

        result = response.get("result", {})
        server_info = result.get("serverInfo", {})
        print(f"   Server: {server_info.get('name')} v{server_info.get('version')}")
        print(f"   Protocol: {result.get('protocolVersion')}")
        print(f"   Capabilities: {result.get('capabilities')}")
        print("   OK - Initialize successful")

        # Test 2: Send initialized notification
        print("\n[3/5] Sending initialized notification...")
        send_notification({
            "jsonrpc": "2.0",
            "method": "initialized",
            "params": {}
        })
        print("   OK - Notification sent")

        # Test 3: List tools
        print("\n[4/5] Requesting tools list...")
        tools_request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {}
        }

        response = send_request(tools_request)

        if "error" in response:
            print(f"   ERROR: {response['error']}")
            return False

        tools = response.get("result", {}).get("tools", [])
        print(f"   Found {len(tools)} tools:")
        for tool in tools:
            print(f"      - {tool['name']}: {tool['description'][:50]}...")
        print("   OK - Tools listed")

        # Test 4: Call a tool
        print("\n[5/5] Testing tool call (list_agents)...")
        call_request = {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": "list_agents",
                "arguments": {}
            }
        }

        response = send_request(call_request)

        if "error" in response:
            print(f"   ERROR: {response['error']}")
            return False

        call_result = response.get("result", {})
        content = call_result.get("content", [])
        is_error = call_result.get("isError", False)

        if is_error:
            print(f"   Tool returned error: {content}")
            return False

        if content:
            data = json.loads(content[0].get("text", "{}"))
            agent_count = data.get("total", 0)
            ready_count = data.get("ready_count", 0)
            print(f"   Found {agent_count} agents ({ready_count} ready)")
        print("   OK - Tool call successful")

        print("\n" + "=" * 60)
        print("ALL TESTS PASSED - Server is MCP compliant!")
        print("=" * 60)

        # Show stderr output (logs)
        proc.stdin.close()
        stderr_output = proc.stderr.read()
        if stderr_output:
            print("\n[Server Logs (stderr)]:")
            for line in stderr_output.strip().split('\n')[:10]:
                print(f"   {line}")

        return True

    except Exception as e:
        print(f"\n   EXCEPTION: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except:
            proc.kill()


if __name__ == "__main__":
    success = test_mcp_server()
    sys.exit(0 if success else 1)
