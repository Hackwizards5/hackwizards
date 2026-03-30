# Deepfake Evidence Verification System
## Problem Statement
- In today’s digital world, videos, images, and audio are widely used as evidence. However, the rise of deepfake technology makes it difficult to distinguish between real and manipulated media. This creates serious risks in legal, social, and security domains.
- Our goal is to build a system that can analyze and verify the authenticity of media files and detect possible deepfake manipulations.
## Solution Overview
- We developed a Deepfake Evidence Verification System that analyzes uploaded video/audio using AI and forensic techniques.
## The system:
- Extracts frames and audio from media
- Detects facial inconsistencies and unnatural patterns
- Uses AI models to identify deepfake artifacts
- Checks metadata for tampering
- Generates a final authenticity verdict (Genuine / Manipulated)
## Features
- Upload video/audio files
- Facial landmark analysis (eye blinking, lip sync, expressions)
- AI-based deepfake detection
- Metadata analysis for tampering detection
- Probability-based scoring system
- Detailed forensic report with highlighted frames
- Final verdict: Genuine or Manipulated
- Tech Stack Used
## Backend

- Python (FastAPI)
- OpenCV (frame extraction)
- FFmpeg (media processing)
- AI & Detection
- Google MediaPipe (facial landmarks)
- Gemini 1.5 Flash API (deepfake detection & analysis)
## Frontend
- ReactJS (user interface & dashboard)
- Database
- MongoDB Atlas (forensic logs & results storage)
## Architecture (Overview)
- User uploads media
- Backend processes file using FFmpeg & OpenCV
- Frames & audio sent for AI analysis
- MediaPipe detects facial inconsistencies
- Gemini API analyzes deepfake artifacts
- Metadata is checked
- Scores combined → Final verdict generated
- Results displayed on dashboard
 ` ` `mermaid
flowchart LR

A[User] --> B[Upload Video / Audio]
B --> C[FastAPI Server]
C --> D[FFmpeg & OpenCV Frame Extraction + Audio Extraction]
D --> E[Job Orchestration (Python)]

E --> F[Visual Inconsistency Detection]
F --> F1[Facial Landmarks]
F --> F2[Blink / Lip-sync / Geometry]

E --> G[Deep Content Analysis]
G --> G1[Frame-level Artifacts]
G --> G2[Audio Artifact Detection]

E --> H[Metadata Extraction]
H --> H1[Codec Info]
H --> H2[Tampering Checks]

F --> I[Frames (e.g., 2 fps)]
G --> J[Audio (sampled)]

I --> K[Weighted Scoring Engine]
J --> K
H --> K

K --> L[Final Verdict (Genuine / Manipulated + Confidence Score)]
L --> M[MongoDB Atlas (Logs & Results)]
