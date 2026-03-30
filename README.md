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
