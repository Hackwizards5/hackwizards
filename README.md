# 🛡️ Hackwizards Sentinel: Advanced Deepfake Analyzer

![Hackathon](https://img.shields.io/badge/Status-Hackathon_Submission-success)
![React](https://img.shields.io/badge/Frontend-React_Vite-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-orange)

## 📌 Problem Statement
The proliferation of hyper-realistic manipulated media (Deepfakes) poses a critical threat to digital trust, security, and identity verification. Current single-layer detection systems are often easily bypassed by modern AI generators or suffer from massive processing delays.

## 💡 Solution Overview
**Hackwizards Sentinel** is a high-speed, multi-layered digital forensics command center. Instead of relying on a single point of failure, our architecture utilizes a "Fast-Pass" local verification system paired with deep-cloud multimodal analysis. 

We extract frames using a highly optimized native OpenCV pipeline, run local facial tracking to detect geometric anomalies (glitches/lost tracking), and simultaneously pipe the data into Google's Gemini 2.5 Flash API to detect temporal inconsistencies, lip-sync errors, and uncanny valley artifacts. Finally, all forensic reports are secured immutably in a MongoDB audit log.

## ✨ Features of the System
* **Multi-Layered Detection:** Combines local Haar Cascade geometry tracking with Gemini's deep generative analysis.
* **Cyber-Forensic Dashboard:** A sleek, dark-mode React UI with drag-and-drop video uploads and real-time scanning logs.
* **Granular Scoring Engine:** Breaks down the "Genuine Score" into specific metrics: Visual Artifacts, Lipsync Alignment, Texture Stability, and Geometric Rigidity.
* **Fault-Tolerant Architecture:** Modular backend design ensures that if cloud AI fails, the local tracking pipeline still functions.
* **Audit Logging:** Every scan, including file metadata and AI findings, is instantly logged to a MongoDB database.

## 🛠️ Tech Stack Used
**Frontend (Client)**
* React.js (via Vite for blazing-fast HMR)
* Axios (API client)
* Recharts (Data visualization)
* Lucide-React (Iconography)

**Backend (Server)**
* Python 3.11 (Managed by `uv` for ultra-fast dependency resolution)
* FastAPI & Uvicorn (High-performance asynchronous server)
* OpenCV (`opencv-python`) (Video extraction and local AI tracking)
* Google GenAI SDK (`google-genai`) (Gemini 2.5 Flash API integration)
* PyMongo (MongoDB connection)

---

## 🏗️ Architecture Diagram

```text
[ User / Browser ] 
       │
       ▼ (Uploads Video via React UI)
[ FastAPI Server (main.py) ]
       │
       ├──► 1. [ video_extractor.py ] ──(Slices video into frames via OpenCV)
       │
       ├──► 2. [ face_analyzer.py ] ────(Local OpenCV Facial Tracking / Fast-Pass)
       │
       ├──► 3. [ ai_analyzer.py ] ──────(Uploads to Google Gemini 2.5 Flash API)
       │
       ▼ (Aggregates AI Reports & Charts)
[ db.py ] ──► (Saves final JSON Report to MongoDB)
       │
       ▼
[ React Dashboard ] (Renders classification, score, and forensic text)
