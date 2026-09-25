from pathlib import Path


# Folder kuu la backend
BASE_DIR = Path(__file__).resolve().parents[2]

# Folder ambalo litahifadhi picha zilizopakiwa
UPLOAD_DIR = BASE_DIR / "uploads"

# Tunahakikisha folder lipo
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)