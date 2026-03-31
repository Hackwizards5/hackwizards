from fastapi import FastAPI, UploadFile, File
import uvicorn
import os
import shutil

# Import our updated modules
from video_extractor import process_video_for_opencv
from face_analyzer import detect_facial_anomalies
from ai_analyzer import analyze_full_video_with_gemini
from db import save_analysis_log

app = FastAPI(title="Hackwizards Deepfake API")

os.makedirs("temp_uploads", exist_ok=True)
os.makedirs("extracted_frames", exist_ok=True)

@app.post("/api/analyze")
async def analyze_media(file: UploadFile = File(...)):
    
    # 1. Save the uploaded video ONCE to disk
    temp_video_path = f"temp_uploads/{file.filename}"
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Extract frames for the OpenCV Fast-Pass
    extracted_files, frame_count = process_video_for_opencv(temp_video_path)
    
    # 3. Local Fast-Pass: OpenCV Tracking
    mesh_results = detect_facial_anomalies(extracted_files)
    anomalies = mesh_results.get("anomalies_flagged", 0)

    # 4. Deep Analysis: Send the ENTIRE VIDEO to Gemini's Multimodal Engine
    gemini_report = analyze_full_video_with_gemini(temp_video_path, anomalies)

    # Clean up the video file so your hard drive doesn't fill up
    try:
        os.remove(temp_video_path)
    except:
        pass

    # 5. Construct the Final Report
    final_report = {
        "filename": file.filename,
        "frames_extracted": frame_count,
        "local_mesh_analysis": mesh_results,
        "gemini_forensic_report": gemini_report,
        "status": "Analysis Complete"
    }

    # 6. Save to MongoDB
    db_id = save_analysis_log(final_report.copy())
    if db_id:
        final_report["database_id"] = db_id

    return final_report

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
