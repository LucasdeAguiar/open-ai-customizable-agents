import json
from pathlib import Path

AGENTS_FILE = Path("agents_data.json")

def load_agents():
    if AGENTS_FILE.exists():
        try:
            with open(AGENTS_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return []
                return json.loads(content)
        except Exception:
            return []
    return []

def save_agents(agents):
    with open(AGENTS_FILE, "w", encoding="utf-8") as f:
        import json
        json.dump(agents, f, ensure_ascii=False, indent=2)