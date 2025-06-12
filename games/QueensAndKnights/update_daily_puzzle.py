#!/usr/bin/env python3
import os
import json
import subprocess
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Get the directory of the current script
SCRIPT_DIR = Path(__file__).parent.absolute()

def generate_puzzle():
    """Run the puzzle generation script"""
    try:
        subprocess.run([sys.executable, str(SCRIPT_DIR / "generate_puzzle_json.py")], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error generating puzzle: {e}")
        return False

def commit_and_push():
    """Commit and push the changes to git"""
    try:
        # Get today's date for the commit message
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Add all changes
        subprocess.run(["git", "add", "."], check=True)
        
        # Commit with a descriptive message
        commit_message = f"Update daily puzzle for {today}"
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        
        # Push to the remote repository
        subprocess.run(["git", "push"], check=True)
        
        print(f"Successfully updated and pushed daily puzzle for {today}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error in git operations: {e}")
        return False

def main():
    # Change to the repository root directory
    repo_root = SCRIPT_DIR.parent.parent.parent
    os.chdir(repo_root)
    
    # Generate the puzzle
    if not generate_puzzle():
        print("Failed to generate puzzle")
        sys.exit(1)
    
    # Commit and push the changes
    if not commit_and_push():
        print("Failed to commit and push changes")
        sys.exit(1)

if __name__ == "__main__":
    main() 