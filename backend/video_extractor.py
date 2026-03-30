import cv2
import os
import shutil
from fastapi import UploadFile

def extract_frames_from_video(file: UploadFile, temp_dir="temp_uploads", extract_dir="extracted_frames"):
    """Saves an uploaded video and extracts 2 frames per second."""
    temp_video_path = f"{temp_dir}/{file.filename}"
    
    # Save the uploaded file to disk
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    cap = cv2.VideoCapture(temp_video_path)
    if not cap.isOpened():
        return None, 0
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    # Default to skipping 15 frames if FPS calculation fails
    frame_interval = int(fps / 2) if fps > 0 else 15 
    
    saved_frame_count = 0
    current_frame = 0
    success, image = cap.read()
    
    extracted_files = []
    
    # Loop through the video and save the frames
    while success:
        if current_frame % frame_interval == 0:
            frame_filename = f"{extract_dir}/frame_{saved_frame_count}.jpg"
            cv2.imwrite(frame_filename, image)
            extracted_files.append(frame_filename)
            saved_frame_count += 1
            
        success, image = cap.read()
        current_frame += 1
        
    cap.release()
    os.remove(temp_video_path) # Clean up the temp video
    
    return extracted_files, saved_frame_count