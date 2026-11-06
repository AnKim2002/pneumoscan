import { useState, useEffect, useRef } from 'react';
import sampleNormalImg from '../assets/sample-normal.png';
import samplePneumoniaImg from '../assets/sample-pneumonia.png';

export default function Detector({ active, onSaveResult, setViewReportResult }) {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [usingSample, setUsingSample] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  // Animation states for result details
  const [dashOffset, setDashOffset] = useState(326.73);
  const [displayConfidence, setDisplayConfidence] = useState(0);

  const fileInputRef = useRef(null);
  const previewImageRef = useRef(null);

  // Update animated values when result is populated
  useEffect(() => {
    if (result) {
      // 1. Reset and animate SVG circle ring
      setDashOffset(326.73);
      const ringTimer = setTimeout(() => {
        const targetOffset = 326.73 - (result.confidence / 100) * 326.73;
        setDashOffset(targetOffset);
      }, 100);

      // 2. Animate confidence number (0 to confidence)
      const duration = 1500;
      const startTime = performance.now();
      let animId;

      const updateNumber = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        const current = result.confidence * eased;
        setDisplayConfidence(current);
        if (progress < 1) {
          animId = requestAnimationFrame(updateNumber);
        }
      };
      animId = requestAnimationFrame(updateNumber);

      return () => {
        clearTimeout(ringTimer);
        cancelAnimationFrame(animId);
      };
    }
  }, [result]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorModal({
        title: "Invalid File Format",
        message: "Please upload a valid JPG or PNG image."
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorModal({
        title: "File Size Limit Exceeded",
        message: "File size must be under 10MB."
      });
      return;
    }

    setFile(file);
    setUsingSample(null);
    setResult(null);
    setErrorModal(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (type) => {
    setUsingSample(type);
    setFile(null);
    setResult(null);
    setErrorModal(null);

    const src = type === 'normal' ? sampleNormalImg : samplePneumoniaImg;
    setPreviewSrc(src);
  };

  const removeImage = (e) => {
    if (e) e.stopPropagation();
    setFile(null);
    setPreviewSrc('');
    setUsingSample(null);
    setResult(null);
    setErrorModal(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runAnalysis = async () => {
    if (!previewSrc || analyzing) return;

    setAnalyzing(true);
    setResult(null);
    setErrorModal(null);

    try {
      let fileToUpload = file;
      if (usingSample) {
        // Fetch the local sample asset image and convert to file blob for backend uniformity
        const response = await fetch(previewSrc);
        const blob = await response.blob();
        fileToUpload = new File([blob], `sample-${usingSample}.png`, { type: 'image/png' });
      }

      if (!fileToUpload) {
        setErrorModal({
          title: "No Image Selected",
          message: "Please select or upload a chest X-ray image to perform analysis."
        });
        setAnalyzing(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server responded with an error');
      }

      const predictionResult = await response.json();
      // Inject local preview image asset so the frontend renders it correctly
      predictionResult.imageData = previewSrc;

      setResult(predictionResult);
      onSaveResult(predictionResult);
    } catch (e) {
      console.error("Analysis Error:", e);
      setErrorModal({
        title: "Invalid Image Warning",
        message: e.message || "Failed to analyze image. Please ensure you are uploading a valid frontal Chest X-Ray."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const isNormal = result?.prediction === 'Normal';

  return (
    <section id="detect" className={`page-section ${active ? 'active' : ''}`} aria-labelledby="detect-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">AI Detection</span>
          <h2 className="section-title" id="detect-heading">Analyze Your Chest X-Ray</h2>
          <p className="section-subtitle">Upload a chest X-ray image and our CNN model will analyze it for signs of pneumonia in seconds.</p>
        </div>

        <div className="detection-layout">
          {/* Upload Panel */}
          <div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
                📤 Upload X-Ray Image
              </h3>

              <div
                className={`upload-zone ${previewSrc ? 'has-image' : ''}`}
                onClick={() => !previewSrc && fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ cursor: previewSrc ? 'default' : 'pointer' }}
              >
                {!previewSrc && (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📁</div>
                    <div className="upload-title">Drop your X-ray here</div>
                    <div className="upload-subtitle">or click to browse files</div>
                    <div className="upload-formats">
                      <span className="upload-format-tag">JPG</span>
                      <span className="upload-format-tag">PNG</span>
                      <span className="upload-format-tag">Max 10MB</span>
                    </div>
                  </div>
                )}

                {previewSrc && (
                  <div className="preview-container visible">
                    <img
                      ref={previewImageRef}
                      src={previewSrc}
                      className="preview-image"
                      alt="X-ray preview"
                    />
                    <div className="preview-overlay">
                      <button className="btn btn-sm btn-secondary" onClick={removeImage} title="Remove image">
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                />
              </div>

              {/* Sample Images */}
              <div className="sample-images">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try samples:</span>
                <button
                  className={`sample-btn ${usingSample === 'normal' ? 'active' : ''}`}
                  onClick={() => loadSample('normal')}
                >
                  <span className="sample-btn-dot normal"></span> Normal X-Ray
                </button>
                <button
                  className={`sample-btn ${usingSample === 'pneumonia' ? 'active' : ''}`}
                  onClick={() => loadSample('pneumonia')}
                >
                  <span className="sample-btn-dot pneumonia"></span> Pneumonia X-Ray
                </button>
              </div>

              {/* Analyze Button */}
              <button
                className="btn btn-primary btn-lg analyze-btn"
                onClick={runAnalysis}
                disabled={!previewSrc || analyzing}
                style={{ width: '100%', marginTop: '20px' }}
              >
                {analyzing ? '⏳ Analyzing...' : '🔬 Analyze X-Ray'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ position: 'relative' }}>
            {/* Loading Overlay */}
            {analyzing && (
              <div className="loading-overlay glass-card visible">
                <div className="loading-spinner"></div>
                <div className="loading-text">
                  Analyzing X-ray with CNN model<span className="loading-dots"></span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Processing image through neural network layers...</p>
              </div>
            )}

            {/* Results Panel */}
            {result ? (
              <div className="results-panel glass-card visible">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
                  📋 Analysis Results
                </h3>

                <div className={`result-badge ${isNormal ? 'normal' : 'pneumonia'}`}>
                  {isNormal ? '✅ NORMAL — No Pneumonia Detected' : '⚠️ PNEUMONIA DETECTED'}
                </div>

                <div className="confidence-ring-container">
                  <div className="confidence-ring">
                    <svg viewBox="0 0 120 120">
                      <circle className="confidence-ring-bg" cx="60" cy="60" r="52" />
                      <circle
                        className={`confidence-ring-fill ${isNormal ? 'normal' : 'pneumonia'}`}
                        cx="60"
                        cy="60"
                        r="52"
                        strokeDasharray="326.73"
                        style={{ strokeDashoffset: dashOffset }}
                      />
                    </svg>
                    <div className="confidence-value">
                      <div className="confidence-percent">{displayConfidence.toFixed(1)}%</div>
                      <div className="confidence-label">Confidence</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Confidence</div>
                    <div
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: isNormal ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {result.confidence}%
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {isNormal ? 'Model is confident the X-ray appears normal.' : 'Model detected patterns consistent with pneumonia.'}
                    </div>
                  </div>
                </div>

                <div className={`risk-indicator ${result.riskLevel.toLowerCase()}`}>
                  <div className={`risk-dot ${result.riskLevel.toLowerCase()}`}></div>
                  <div>
                    <div className="risk-level-label">Risk Level</div>
                    <div className="risk-text">{result.riskLevel}</div>
                  </div>
                </div>

                <div
                  className="recommendation-box"
                  style={{ borderLeftColor: isNormal ? 'var(--success)' : 'var(--danger)' }}
                >
                  {result.recommendation}
                </div>

                <div className="result-actions">
                  <button className="btn btn-primary" onClick={() => setViewReportResult(result)}>
                    📄 View Report
                  </button>
                  <button className="btn btn-secondary" onClick={removeImage}>
                    🔄 Scan Another
                  </button>
                </div>
              </div>
            ) : (
              !analyzing && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔬</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                    Ready to Analyze
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '320px' }}>
                    Upload a chest X-ray image on the left panel, then click "Analyze X-Ray" to receive AI-powered pneumonia detection results.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Invalid Image Error Pop-up Modal */}
      {errorModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
            position: 'relative',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 18px auto',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}>
              ⚠️
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              {errorModal.title}
            </h3>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '28px'
            }}>
              {errorModal.message}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setErrorModal(null);
                  removeImage();
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                style={{ minWidth: '170px' }}
              >
                📁 Select Chest X-Ray
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setErrorModal(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
