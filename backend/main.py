from fastapi import FastAPI, UploadFile, File, BackgroundTasks
import uvicorn
import os

from video_extractor import extract_frames_from_video
from ai_analyzer import analyze_frames_with_gemini
from face_analyzer import detect_facial_anomalies
from db import save_analysis_log

app = FastAPI(title="Hackwizards Deepfake API")

os.makedirs("temp_uploads", exist_ok=True)
os.makedirs("extracted_frames", exist_ok=True)

@app.get("/")
async def root():
    return {"status": "Backend Systems All Green"}

@app.post("/api/analyze")
async def analyze_media(file: UploadFile = File(...)):
    
    # 1. Extraction Pipeline
    extracted_files, frame_count = extract_frames_from_video(file)
    if not extracted_files:
         return {"error": "Video processing failed."}

    # 2. Local Fast-Pass: MediaPipe Facial Mesh Analysis
    mesh_results = detect_facial_anomalies(extracted_files)

    # 3. Deep Analysis: Gemini API
    gemini_report = analyze_frames_with_gemini(extracted_files)

    # 4. Construct the Final Report
    final_report = {
        "filename": file.filename,
        "frames_extracted": frame_count,
        "local_mesh_analysis": mesh_results,
        "gemini_forensic_report": gemini_report,
        "status": "Analysis Complete"
    }

    # 5. Save to MongoDB
    
    
    db_id = save_analysis_log(final_report.copy())
    if db_id:
        final_report["database_id"] = db_id

    return final_report

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
