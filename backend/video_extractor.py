import cv2
import os

def process_video_for_opencv(temp_video_path: str, extract_dir="extracted_frames"):
    """Extracts frames from a saved video file for OpenCV analysis."""
    cap = cv2.VideoCapture(temp_video_path)
    if not cap.isOpened():
        return [], 0
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps / 2) if fps > 0 else 15 
    
    saved_frame_count = 0
    current_frame = 0
    success, image = cap.read()
    
    extracted_files = []
    
    while success:
        if current_frame % frame_interval == 0:
            frame_filename = f"{extract_dir}/frame_{saved_frame_count}.jpg"
            cv2.imwrite(frame_filename, image)
            extracted_files.append(frame_filename)
            saved_frame_count += 1
            
        success, image = cap.read()
        current_frame += 1
        
    cap.release()
    # Notice we removed the os.remove(temp_video_path) line!
    return extracted_files, saved_frame_count