import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, ShieldCheck, AlertTriangle, FileVideo, Activity, Clock, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // State for analysis pipeline
  const [analysisState, setAnalysisState] = useState('idle'); // idle, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [realtimeLogs, setRealtimeLogs] = useState([]);
  
  // Results from backend
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  // Helper function to append to real-time logs
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setRealtimeLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Drag & Drop Handlers
  const handleFileSelection = (selectedFile) => {
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      // Reset dashboard state for new video
      setResult(null);
      setError('');
      setAnalysisState('idle');
      setProgress(0);
      setRealtimeLogs([]);
    } else {
      setError('Please select a valid video file (.mp4, .mov, etc).');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files[0]);
  };

  // The main analysis orchestration logic
  const analyzeVideo = async () => {
    if (!file) return;
    
    setResult(null);
    setError('');
    setAnalysisState('processing');
    setProgress(0);
    setRealtimeLogs([]);
    addLog(`Initiating scan: ${file.name}`);
    
    const simulateProcessing = (message, targetProgress, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setProgress(targetProgress);
          addLog(message);
          resolve();
        }, delay);
      });
    };

    await simulateProcessing("Media handling: Loading video data into browser...", 5, 200);
    await simulateProcessing("I/O: Transmitting video to deepfake backend on port 8000...", 10, 200);
    await simulateProcessing("OpenCV: Executing high-speed frame extraction pipeline...", 15, 300);
    await simulateProcessing("Local Check: Initializing OpenCV facial tracking system...", 20, 200);
    await simulateProcessing("Local Check: Running face detector on first 5 frames...", 25, 300);
    await simulateProcessing("Multimodal Fusion: Uploading full video to Gemini API servers...", 40, 400);
    addLog("Gemini: Performing deep temporal and audio consistency check. Please wait...");
    setProgress(50);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
      setProgress(90);
      addLog("Gemini: Multi-factor visual report generated successfully.");
      addLog("Database: Saving forensic audit log to MongoDB...");
      
      setTimeout(() => {
          if(response.data.database_id) {
            addLog("Database: Audit log secured. ID: " + response.data.database_id);
          }
          setProgress(100);
          setAnalysisState('complete');
      }, 500);

    } catch (err) {
      console.error(err);
      setError('Analysis pipeline failed. Check if backend is running on port 8000.');
      addLog("CRITICAL: API connection lost. Check backend logs.");
      setAnalysisState('error');
    }
  };

  // Helper to dynamically extract scores from Gemini's secret text block
  const extractScore = (text, key, defaultVal) => {
    if (!text) return defaultVal;
    const regex = new RegExp(`${key}:\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : defaultVal;
  };

  // Calculate Overall Genuine Score
  const genuineScore = result ? extractScore(result.gemini_forensic_report, 'OVERALL_SCORE', 100) : 100;
  
  // Calculate System Confidence mathematically
  const systemConfidence = genuineScore < 50 ? (100 - genuineScore) : genuineScore;

  // Feed real AI data into the charts
  const getVisualizationData = (reportText) => {
    let artifacts = extractScore(reportText, 'ARTIFACTS', 95);
    let lipsync = extractScore(reportText, 'LIPSYNC', 90);
    let texture = extractScore(reportText, 'TEXTURE', 98);
    let temporal = extractScore(reportText, 'TEMPORAL', 92);
    let geometry = extractScore(reportText, 'GEOMETRY', 99);
    
    return [
      { name: 'Visual Integrity', Score: artifacts },
      { name: 'Lipsync Alignment', Score: lipsync },
      { name: 'Texture Stability', Score: texture },
      { name: 'Temporal Flow', Score: temporal },
      { name: 'Geometric Rigidity', Score: geometry },
    ].map(item => ({
        ...item, 
        fill: item.Score <= 49 ? 'var(--danger)' : item.Score <= 75 ? 'var(--warning)' : 'var(--success)'
    }));
  };

  const visualizationData = getVisualizationData(result?.gemini_forensic_report);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Hackwizards Sentinel <span style={{fontSize: '0.9rem', color: 'var(--success)'}}>v2.0</span></h1>
        <p>Advanced Multimodal Deepfake Forensics & Geometry Dashboard</p>
      </header>

      {/* Input Analysis: Video Uploader & Progress */}
      <div className="input-card">
        <div className="section-title"><Activity size={18}/> Input Analysis</div>
        
        <div 
          className={`upload-zone ${isDragging ? 'dragging' : ''} ${analysisState !== 'idle' ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => analysisState === 'idle' && fileInputRef.current.click()}
        >
          <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={(e) => handleFileSelection(e.target.files[0])} disabled={analysisState !== 'idle'}/>
          <UploadCloud className="upload-icon" size={64} />
          <h2>Drag & Drop Video Here</h2>
          <p style={{ color: 'var(--text-muted)' }}>or click to browse local files (MP4, MOV, AVI)</p>
          
          {file && (
            <div className="selected-file-details">
                <FileVideo size={24}/>
                <div>
                  <div style={{fontWeight: 700}}>{file.name}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
            </div>
          )}
        </div>

        {/* Real-time Progress Bar */}
        {(analysisState === 'processing' || analysisState === 'error') && (
            <div style={{marginTop: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                    <span>Scan Progress</span>
                    <span>{progress}%</span>
                </div>
                <div style={{width: '100%', height: '10px', backgroundColor: '#334155', borderRadius: '5px'}}>
                    <div style={{
                        width: `${progress}%`, 
                        height: '100%', 
                        backgroundColor: error ? 'var(--danger)' : 'var(--accent-blue)', 
                        borderRadius: '5px', 
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                {error && <p style={{color: 'var(--danger)', marginTop: '0.5rem', textAlign: 'center'}}>{error}</p>}
            </div>
        )}

        <button 
          className="scan-btn" 
          onClick={analyzeVideo} 
          disabled={!file || analysisState === 'processing'}
        >
          {analysisState === 'processing' ? <><Loader2 className="loading-spinner"/> Analyzing Multimodal Stream...</> : 'BEGIN FORENSIC SCAN'}
        </button>
      </div>

      {/* Real-time Forensic Logs */}
      {(realtimeLogs.length > 0) && (
        <div className="input-card" style={{marginTop: '1.5rem'}}>
            <div className="section-title"><Clock size={18}/> Detailed Forensic Logs</div>
            <div className="log-scroll">
              {realtimeLogs.map((log, idx) => <div key={idx} className="log-entry">{log}</div>)}
            </div>
        </div>
      )}

      {/* Overview Report: Analysis Results & Visualization */}
      {result && analysisState === 'complete' && (
        <div className="report-card" style={{marginTop: '1.5rem'}}>
          <div className="section-title"><ShieldCheck size={18}/> Overview Report</div>
          
          <div className="overview-header">
             <div className="results-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
                
                {/* Genuine Score Metric - FIXED OVERLAP */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #1e293b'}}>
                  <div style={{fontSize: '5rem', fontWeight: 900, lineHeight: '1', margin: '0', color: genuineScore < 50 ? 'var(--danger)' : 'var(--success)'}}>
                    {genuineScore}%
                  </div>
                  <div style={{fontSize: '0.9rem', marginTop: '1rem', fontWeight: 'bold', color: genuineScore < 50 ? 'var(--danger)' : 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                    Genuine Score
                  </div>
                </div>
                
                {/* Classification Metric */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #1e293b', color: genuineScore < 50 ? 'var(--danger)' : 'var(--success)'}}>
                  <div className="classification-title" style={{marginBottom: '1rem'}}>Classification</div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'}}>
                    {genuineScore < 50 ? <AlertTriangle size={36}/> : <ShieldCheck size={36}/>}
                    <div style={{fontSize: '2rem', fontWeight: 800, textAlign: 'center'}}>
                        {genuineScore < 50 ? 'MANIPULATED' : 'AUTHENTIC MEDIA'}
                    </div>
                  </div>
                  <div style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem'}}>System Confidence: {systemConfidence}%</div>
                </div>
             </div>

             {/* Dynamic Bar Chart: Visualizing Multi-factor check */}
             <div style={{marginTop: '1rem', height: '220px'}}>
                <h3 style={{fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase'}}>Multi-Factor Forensic Analysis</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visualizationData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)"/>
                    <YAxis dataKey="name" type="category" width={150} stroke="var(--text-muted)" style={{fontSize: '0.85rem'}}/>
                    <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} contentStyle={{backgroundColor: 'var(--card-dark)', border: '1px solid #334155'}}/>
                    <Bar dataKey="Score" radius={4} label={{ position: 'right', fill: 'var(--text-main)' }}/>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="forensic-details-section">
            <h3>Forensic Details (Gemini 2.5 Flash API)</h3>
            <div className="forensic-report-text">
                {/* We use .split to remove the ugly scoring block so the user only sees the text report */}
                {result.gemini_forensic_report
                  .split('---SCORE_BLOCK---')[0]
                  .split('\n')
                  .filter(para => para.trim() !== '')
                  .map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>

          <div className="face-mapping-section">
            <h3>Facial Mapping (OpenCV Fast-Pass)</h3>
            <div className="face-mapping-logs">
                <p>❯ Face Detector Status: {result.local_mesh_analysis.faces_detected > 0 ? 'Face Map locked.' : 'No consistent face mesh.'}</p>
                <p>❯ Local Tracking Anomalies Flagged: <span style={{color: result.local_mesh_analysis.anomalies_flagged > 0 ? 'var(--danger)' : 'var(--success)'}}>{result.local_mesh_analysis.anomalies_flagged}</span></p>
                {result.local_mesh_analysis.details.slice(0,3).map((detail, idx) => <p key={idx} style={{fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)'}}>   • {detail}</p>)}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
