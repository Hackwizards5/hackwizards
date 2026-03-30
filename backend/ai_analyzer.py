import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables (API Key) from the .env file
load_dotenv()

# Initialize the new SDK Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_frames_with_gemini(frame_paths):
    """Sends extracted frames to Gemini for deepfake analysis using the new SDK."""
    frames_to_analyze = frame_paths[:3] 
    uploaded_gemini_files = []
    
    # Upload files using the new client.files API
    for frame_path in frames_to_analyze:
        g_file = client.files.upload(file=frame_path)
        uploaded_gemini_files.append(g_file)
        
    prompt = """
    You are an expert digital forensics analyst. Examine these video frames.
    Look for specific deepfake artifacts: visual inconsistencies, unnatural eye blinking, 
    lip-syncing errors, or "uncanny valley" effects in facial geometry.
    Provide a brief forensic report and a final verdict of 'Genuine' or 'Manipulated'.
    """
    
    try:
        contents = [prompt] + uploaded_gemini_files
        
        # Generate content using the new client.models API and the upgraded 2.5-flash model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(temperature=0.2)
        )
        return response.text
    except Exception as e:
        return f"Error during AI analysis: {str(e)}" 