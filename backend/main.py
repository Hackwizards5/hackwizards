from fastapi import FastAPI, UploadFile, File
import uvicorn
import cv2
import os
import shutil

app = FastAPI(title="Hackwizards Deepfake API")

# Create folders to store the temporary uploads and the extracted frames
os.makedirs("temp_uploads", exist_ok=True)
os.makedirs("extracted_frames", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hackwizards Backend is live!"}

@app.post("/api/analyze")
async def analyze_media(file: UploadFile = File(...)):
    # 1. Save the uploaded file temporarily to disk
    temp_video_path = f"temp_uploads/{file.filename}"
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Open the video with OpenCV
    cap = cv2.VideoCapture(temp_video_path)
    
    if not cap.isOpened():
        return {"error": "Could not open video file."}
        
    # Get the Frames Per Second (FPS) of the video
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Calculate how many frames to skip to get exactly 2 frames per second
    # If a video is 30 fps, we want a frame every 15 frames.
    frame_interval = int(fps / 2) 
    
    saved_frame_count = 0
    current_frame = 0
    success, image = cap.read()
    
    # 3. Loop through the video and save the frames
    while success:
        if current_frame % frame_interval == 0:
            frame_filename = f"extracted_frames/frame_{saved_frame_count}.jpg"
            cv2.imwrite(frame_filename, image)
            saved_frame_count += 1
            
        success, image = cap.read()
        current_frame += 1
        
    cap.release()
    
    # Optional: Delete the temporary video file to save space
    os.remove(temp_video_path)

    return {
        "filename": file.filename,
        "status": "Frames extracted successfully",
        "total_frames_saved": saved_frame_count
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
