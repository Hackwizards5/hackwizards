from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

# Import the logic from our new modular files
from video_extractor import extract_frames_from_video
from ai_analyzer import analyze_frames_with_gemini

app = FastAPI(title="Hackwizards Deepfake API")

# Ensure our directories exist when the server starts
os.makedirs("temp_uploads", exist_ok=True)
os.makedirs("extracted_frames", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hackwizards Backend is live, modular, and powered by AI!"}

@app.post("/api/analyze")
async def analyze_media(file: UploadFile = File(...)):
    
    # 1. Slice the video into frames using our extractor module
    extracted_files, saved_frame_count = extract_frames_from_video(file)
    
    if extracted_files is None:
         return {"error": "Could not open video file."}

    # 2. Send the frames to our AI brain module
    analysis_result = analyze_frames_with_gemini(extracted_files)

    # 3. Return the final report to the user
    return {
        "filename": file.filename,
        "frames_extracted": saved_frame_count,
        "gemini_analysis": analysis_result
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
