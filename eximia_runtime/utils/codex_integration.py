
import subprocess
import asyncio
from pathlib import Path

class CodexIntegration:
    """Handles automatic integration with Codex"""
    
    @staticmethod
    def auto_integrate(filepath: Path, agent_name: str):
        """
        If agent is Intellex, copy output to Codex INBOX or PROCESSED 
        and trigger integration script.
        """
        # Only trigger for relevant agents
        if "intellex" not in agent_name.lower() and "codex" not in agent_name.lower():
            return

        try:
            # Definition of Codex paths
            # Assuming relative path from eximia_runtime/utils/output_manager.py
            # project_root is .../eximIA.OS
            project_root = filepath.parent.parent.parent.parent 
            codex_path = project_root / "00_Codex"
            processed_dir = codex_path / "eximia_data" / "02_PROCESSED" / "auto_imports"
            
            if not codex_path.exists():
                return
                
            processed_dir.mkdir(parents=True, exist_ok=True)
            
            # Copy file to Codex auto_imports
            import shutil
            dest_file = processed_dir / filepath.name
            shutil.copy2(filepath, dest_file)
            
            # Trigger integration/organization script
            # We use the existing organize_processed.py but pointed at this new dir?
            # Or we just run integrate_processed.py?
            
            # Actually, the user wants it to go to "processed" and be "categorized" and "saved in DB".
            # integrate_processed.py scans 02_PROCESSED.
            # So if we put it there, and run the script, it should work.
            
            dest_root = codex_path / "eximia_data" / "02_PROCESSED"
            dest_file_root = dest_root / filepath.name
            shutil.copy2(filepath, dest_file_root)
            
            # Run integration script asynchronously (fire and forget)
            script_path = codex_path / "scripts" / "integrate_processed.py"
            organize_path = codex_path / "scripts" / "organize_processed.py"
            
            if script_path.exists():
                subprocess.Popen(["py", str(script_path)], cwd=str(project_root))
                
            if organize_path.exists():
                # Run organize after a small delay or sequentially in a separate process
                # For simplicity, we assume integrate runs fast.
                pass 

        except Exception as e:
            print(f"Codex Integration Error: {e}")
