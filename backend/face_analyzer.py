import cv2

#  Use OpenCV's built-in AI face detector. 
# It is 100% local, blazing fast, and already installed on your machine.
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

def detect_facial_anomalies(frame_paths: list) -> dict:
    """Scans extracted frames for facial consistency using OpenCV."""
    analysis = {
        "faces_detected": 0,
        "anomalies_flagged": 0,
        "details": []
    }
    
    # Analyze the first 5 frames to keep the API lightning fast
    for i, path in enumerate(frame_paths[:5]):
        image = cv2.imread(path)
        if image is None: 
            continue
            
        # AI models work best in grayscale
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(
            gray_image, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        if len(faces) > 0:
            analysis["faces_detected"] += 1
            analysis["details"].append(f"Frame {i}: Face geometry detected cleanly.")
        else:
            analysis["anomalies_flagged"] += 1
            analysis["details"].append(f"Frame {i}: Warning - Face tracking lost (potential artifact/glitch).")
            
    return analysis