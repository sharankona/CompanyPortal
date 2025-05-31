import os
import sys
sys.path.append('.')
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Use port 8080 instead of 5000 to avoid conflicts
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=True)