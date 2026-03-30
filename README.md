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
```mermaid
flowchart LR

%% USER FLOW
A[User] --> B[Upload Video/Audio]

%% BACKEND
B --> C[FastAPI Server]
C --> D[FFmpeg & OpenCV\nFrame + Audio Extraction]
D --> E[Job Orchestration (Python)]

%% ANALYSIS PIPELINE
E --> F[Visual Inconsistency Detection\n- Facial Landmarks\n- Blink / Lip-sync\n- Geometry]
E --> G[Deep Content Analysis\n- Frames + Audio\n- Artifact Detection]
E --> H[Metadata Extraction\n- Codec Info\n- Tampering Checks]

%% INTERMEDIATE OUTPUTS
F --> I[Frames (e.g., 2 fps)]
F --> J[Audio (sampled)]
G --> J

%% SCORING
F --> K[Weighted Scoring Engine]
G --> K
H --> K

%% FINAL RESULT
K --> L[Final Verdict\n(Genuine / Manipulated)\n+ Confidence Score]

%% STORAGE
L --> M[MongoDB Atlas\nForensic Logs & Results]

%% REPORTS
M --> N[Forensic Report\nScores & Evidence]
M --> O[Highlighted Frames\nwith Issues]
M --> P[Dashboard / Demo View]

%% DASHBOARD
N --> Q[Results Dashboard]
O --> Q
P --> Q

