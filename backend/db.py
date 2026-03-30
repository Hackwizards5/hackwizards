import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Uses a local MongoDB by default if no Atlas URI is provided
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client.hackwizards
logs_collection = db.analysis_logs

def save_analysis_log(log_data: dict) -> str:
    """Saves the final forensic analysis to MongoDB and returns the document ID."""
    try:
        result = logs_collection.insert_one(log_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Database Error: {e}")
        return None