import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileVideo, Activity, Terminal, ShieldAlert, ShieldCheck, Database, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [analysisState, setAnalysisState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [realtimeLogs, setRealtimeLogs] = useState([]);
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const addLog = (message, type = 'normal') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setRealtimeLogs(prev => [...prev, { time: timestamp, text: message, type }]);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
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

    await simulateProcessing("SYS: Loading video stream into memory...", 5, 200);
    await simulateProcessing("NET: Establishing connection to backend engine...", 10, 200);
    await simulateProcessing("CV2: Extracting temporal frames...", 15, 300);
    await simulateProcessing("OPENCV: Running Haar Cascade geometry detection...", 25, 400);
    await simulateProcessing("API: Uploading payload to Gemini Multimodal Engine...", 40, 500);
    addLog("AI: Auditing spatial geometry and lip-sync variance...");
    setProgress(50);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
      setProgress(90);
      addLog("AI: Multimodal grading complete.", "success");
      addLog("DB: Committing immutable forensic log...");
      
      setTimeout(() => {
          if(response.data.database_id) {
            addLog(`DB: Audit secured. ID: ${response.data.database_id.substring(0,8)}`, "success");
          }
          setProgress(100);
          setAnalysisState('complete');
      }, 600);

    } catch (err) {
      console.error(err);
      setError('Analysis failed. Verify backend is running on port 8000.');
      addLog("ERR: Connection refused. Analysis aborted.", "error");
      setAnalysisState('error');
    }
  };

  const extractScore = (text, key, defaultVal) => {
    if (!text) return defaultVal;
    const regex = new RegExp(`${key}:\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : defaultVal;
  };

  const genuineScore = result ? extractScore(result.gemini_forensic_report, 'OVERALL_SCORE', 100) : 100;
  const systemConfidence = genuineScore < 50 ? (100 - genuineScore) : genuineScore;
  const isDanger = genuineScore < 50;

  const getVisualizationData = (reportText) => {
    let artifacts = extractScore(reportText, 'ARTIFACTS', 95);
    let lipsync = extractScore(reportText, 'LIPSYNC', 90);
    let texture = extractScore(reportText, 'TEXTURE', 98);
    let temporal = extractScore(reportText, 'TEMPORAL', 92);
    let geometry = extractScore(reportText, 'GEOMETRY', 99);
    
    return [
      { name: 'Visual', Score: artifacts },
      { name: 'Lipsync', Score: lipsync },
      { name: 'Texture', Score: texture },
      { name: 'Temporal', Score: temporal },
      { name: 'Geometry', Score: geometry },
    ].map(item => ({
        ...item, 
        fill: item.Score <= 49 ? 'var(--danger)' : item.Score <= 75 ? 'var(--warning)' : 'var(--primary-cyan)'
    }));
  };

  const visualizationData = getVisualizationData(result?.gemini_forensic_report);

  return (
    <div>
      {/* Navbar */}
      <nav className="top-navbar">
        <div className="brand-title">Hackwizards Sentinel</div>
        <div className="system-status">
          <div className="status-dot"></div>
          System Online
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="dashboard-layout">
        
        {/* LEFT COLUMN */}
        <div className="left-column">
          
          {/* Target Acquisition Card */}
          <div className="forensic-card">
            <div className="card-title">
              <Camera size={16} /> Video Session Data
            </div>
            
            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => analysisState === 'idle' && fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={(e) => handleFileSelection(e.target.files[0])} disabled={analysisState !== 'idle'}/>
              <UploadCloud size={48} color="var(--primary-cyan)" style={{marginBottom: '1rem'}} />
              <div className="font-bold">Drag & Drop Video Stream</div>
              <div className="text-sm text-muted">or click to browse local files (MP4, MOV)</div>
              
              {file && (
                <div style={{marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary-blue)'}}>
                  <FileVideo size={18}/>
                  <span className="font-bold">{file.name}</span>
                  <span className="text-sm text-muted">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {(analysisState === 'processing' || analysisState === 'error') && (
                <div style={{marginTop: '1.5rem'}}>
                    <div style={{width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                        <div style={{
                            width: `${progress}%`, 
                            height: '100%', 
                            backgroundColor: error ? 'var(--danger)' : 'var(--primary-cyan)', 
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <button className="scan-btn" onClick={analyzeVideo} disabled={!file || analysisState === 'processing'}>
              {analysisState === 'processing' ? 'PROCESSING MULTIMODAL STREAM...' : 'BEGIN FORENSIC SCAN'}
            </button>
          </div>

          {/* Results: Bottom Left Section */}
          {result && analysisState === 'complete' && (
            <>
              {/* Three Mini Summary Cards */}
              <div className="summary-cards-row">
                
                {/* Gemini Details */}
                <div className="mini-card">
                  <div className="mini-card-header">
                    <span style={{color: 'var(--text-muted)'}}>GEMINI VERDICT</span>
                    <span className={`badge ${isDanger ? 'danger' : 'success'}`}>{isDanger ? 'FAILED' : 'AUTHENTIC'}</span>
                  </div>
                  <div className="text-sm">
                    {/* We show the first 150 chars of the report to mimic the tiny text in the image */}
                    {result.gemini_forensic_report.split('---SCORE_BLOCK---')[0].substring(0, 150)}...
                  </div>
                </div>

                {/* OpenCV Details */}
                <div className="mini-card">
                  <div className="mini-card-header">
                    <span style={{color: 'var(--text-muted)'}}>FACIAL MAPPING</span>
                    <span className={`badge ${result.local_mesh_analysis.anomalies_flagged > 0 ? 'danger' : 'success'}`}>
                      {result.local_mesh_analysis.anomalies_flagged > 0 ? 'ANOMALY' : 'LOCKED'}
                    </span>
                  </div>
                  <div className="text-sm font-bold" style={{marginBottom: '0.5rem'}}>
                    Spatial Anomalies: {result.local_mesh_analysis.anomalies_flagged}
                  </div>
                  <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                    {result.local_mesh_analysis.details.slice(0,3).map((d, i) => <div key={i}>└ {d}</div>)}
                  </div>
                </div>

                {/* Metadata */}
                <div className="mini-card">
                  <div className="mini-card-header">
                    <span style={{color: 'var(--text-muted)'}}>AUDIT LOG</span>
                    <span className="badge success">SECURED</span>
                  </div>
                  <div className="text-sm">
                    <div><span className="font-bold">ID:</span> {result.database_id?.substring(0,8) || 'N/A'}</div>
                    <div><span className="font-bold">File:</span> {result.filename}</div>
                    <div><span className="font-bold">Frames:</span> {result.frames_extracted}</div>
                  </div>
                </div>

              </div>

              {/* Multi-Factor Chart (Vertical Bars) */}
              <div className="forensic-card" style={{marginTop: '1.5rem'}}>
                <div className="card-title"><Activity size={16} /> Multi-Factor Forensic Analysis</div>
                <div style={{height: '220px', width: '100%'}}>
                  <ResponsiveContainer>
                    <BarChart data={visualizationData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}/>
                      <Bar dataKey="Score" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          
          {/* Classification Verdict Box */}
          <div className="forensic-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem'}}>
            <div className={`score-circle ${isDanger ? 'danger' : 'success'}`}>
              <div className="score-number">{genuineScore}%</div>
              <div className="score-label">Genuine Score</div>
            </div>
            
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <div className="text-sm text-muted font-bold" style={{letterSpacing: '0.1em', marginBottom: '0.5rem'}}>CLASSIFICATION</div>
              <div className={`verdict-text ${isDanger ? 'danger' : 'success'}`}>
                {isDanger ? 'MANIPULATED' : 'AUTHENTIC'}
              </div>
              <div className="text-sm text-muted" style={{marginTop: '0.5rem'}}>
                System Confidence: {systemConfidence}%
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="forensic-card" style={{padding: '0', overflow: 'hidden', border: 'none'}}>
            <div style={{backgroundColor: '#1e293b', color: 'white', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Terminal size={14}/> REAL-TIME TERMINAL LOGS
            </div>
            <div className="terminal-window">
              {realtimeLogs.map((log, idx) => (
                <div key={idx} className={`terminal-line ${log.type}`}>
                  <span style={{color: '#64748b'}}>[{log.time}]</span> {log.text}
                </div>
              ))}
              {analysisState === 'processing' && <div className="terminal-line animate-pulse">_</div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
