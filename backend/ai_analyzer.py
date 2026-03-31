import os
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_full_video_with_gemini(video_path, opencv_anomalies=0):
    """Uploads the video to Gemini and demands a mathematical scoring block."""
    try:
        video_file = client.files.upload(file=video_path)
        
        while video_file.state.name == "PROCESSING":
            time.sleep(2)
            video_file = client.files.get(name=video_file.name)
            
        prompt = f"""
        You are an objective, highly advanced Deepfake Forensics AI. 
        You are analyzing a video file to determine if it is authentic camera footage or AI-generated.
        
        SYSTEM DATA: Local OpenCV tracking flagged {opencv_anomalies} spatial anomalies. (Note: 1-2 anomalies can happen in real videos due to fast movement. High anomalies imply deepfake spatial morphing).

        Evaluate the video across these 5 dimensions. Score each from 0 to 100.
        (100 = Perfectly natural/authentic human recording. 0 = Clearly AI-generated/glitchy).
        1. ARTIFACTS: Any weird AI morphing, extra fingers, text glitches.
        2. LIPSYNC: Does audio perfectly match mouth movements? (If no audio, assume 100).
        3. TEXTURE: Is skin naturally porous and noisy, or is it overly smooth "plastic" AI skin?
        4. TEMPORAL: Is the motion physics correct, or does the background/subject warp?
        5. GEOMETRY: Do shapes stay solid, or do they melt/shimmer?

        Provide a detailed forensic report explaining your observations.
        
        CRITICAL INSTRUCTION: At the very end of your response, you MUST include a strict scoring block EXACTLY in this format:
        
        ---SCORE_BLOCK---
        OVERALL_SCORE: [Calculate the average of the 5 scores]
        ARTIFACTS: [0-100]
        LIPSYNC: [0-100]
        TEXTURE: [0-100]
        TEMPORAL: [0-100]
        GEOMETRY: [0-100]
        VERDICT: [GENUINE if OVERALL_SCORE >= 50 else MANIPULATED]
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[video_file, prompt],
            config=types.GenerateContentConfig(temperature=0.1) # Slight temperature to allow nuance, but mostly logical
        )
        return response.text
    except Exception as e:
        return f"Error during AI video analysis: {str(e)}"