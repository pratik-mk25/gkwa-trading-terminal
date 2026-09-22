import os
import sys

# Ensure the root directory of the project is on the Python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Expose the FastAPI ASGI application for Vercel Serverless
from app.main import app
