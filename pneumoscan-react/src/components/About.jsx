import React from 'react';

export default function About({ active }) {
  const infoCards = [
    { icon: '💀', label: 'Annual Deaths', value: '2.5 Million' },
    { icon: '👶', label: 'Children Under 5', value: '800K Deaths/yr' },
    { icon: '🏥', label: 'Hospitalizations', value: '1.5M+ / year' },
    { icon: '⏱️', label: 'Diagnosis Time', value: 'Hours → Seconds' }
  ];

  const objectives = [
    'Develop a CNN model for accurate pneumonia classification from chest X-rays',
    'Achieve ≥95% classification accuracy on the test dataset',
    'Build an intuitive web interface for real-time X-ray analysis',
    'Generate downloadable diagnostic reports with confidence scores',
    'Provide a dashboard for tracking scan history and analytics'
  ];

  const cnnLayers = [
    { type: 'input', title: 'Input', dim: '224×224', label: 'X-Ray Image' },
    { type: 'conv', title: 'Conv2D', dim: '32 filters', label: 'Feature Extract' },
    { type: 'pool', title: 'MaxPool', dim: '2×2', label: 'Downsample' },
    { type: 'conv', title: 'Conv2D', dim: '64 filters', label: 'Deep Features' },
    { type: 'pool', title: 'MaxPool', dim: '2×2', label: 'Compress' },
    { type: 'conv', title: 'Conv2D', dim: '128 filters', label: 'Patterns' },
    { type: 'dense', title: 'Dense', dim: '256', label: 'Classify' },
    { type: 'output', title: 'Output', dim: '2 classes', label: 'Prediction' }
  ];

  const methodologySteps = [
    { num: 1, title: 'Data Collection', desc: '5,863 chest X-ray images from Kaggle dataset, validated by physicians.' },
    { num: 2, title: 'Preprocessing', desc: 'Image resizing, normalization, augmentation for robust training.' },
    { num: 3, title: 'Model Training', desc: 'CNN architecture with Conv2D, MaxPooling, Dropout, and Dense layers.' },
    { num: 4, title: 'Evaluation', desc: 'Testing on unseen data with accuracy, precision, recall, F1 metrics.' },
    { num: 5, title: 'Deployment', desc: 'Web-based interface for real-time X-ray analysis and reporting.' }
  ];

  return (
    <section id="about" className={`page-section ${active ? 'active' : ''}`} aria-labelledby="about-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">About the Project</span>
          <h2 className="section-title" id="about-heading">Understanding Pneumonia Detection with AI</h2>
          <p className="section-subtitle">An in-depth look at how deep learning CNNs revolutionize medical image classification for pneumonia detection.</p>
        </div>

        <div className="about-grid">
          {/* Left Column */}
          <div>
            {/* What is Pneumonia */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🫁 What is Pneumonia?
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing. It can range from mild to life-threatening and is most serious for infants, people older than 65, and those with weakened immune systems.
              </p>
            </div>

            {/* Importance of Early Detection */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Why Early Detection Matters
              </h3>
              <div className="about-card-row">
                {infoCards.map((c, i) => (
                  <div key={i} className="card about-info-card">
                    <div className="about-info-icon">{c.icon}</div>
                    <div>
                      <div className="about-info-label">{c.label}</div>
                      <div className="about-info-value">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                Early detection is crucial because timely treatment with antibiotics can prevent complications and save lives. AI-powered screening can dramatically reduce the time from X-ray to diagnosis, especially in areas with limited access to radiologists.
              </p>
            </div>

            {/* Project Objectives */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 Project Objectives
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {objectives.map((obj, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* How CNNs Work */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🧠 How CNNs Work for Medical Imaging
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
                Convolutional Neural Networks automatically learn hierarchical features from images — from simple edges and textures to complex anatomical patterns. Here's the architecture flow:
              </p>

              {/* CNN Architecture Flow */}
              <div className="cnn-flow glass-card" style={{ marginBottom: '16px', overflowX: 'auto', display: 'flex', alignItems: 'center', padding: '16px 8px' }}>
                {cnnLayers.map((l, i) => (
                  <React.Fragment key={i}>
                    <div className="cnn-layer" style={{ flexShrink: 0 }}>
                      <div className={`cnn-layer-box ${l.type}`}>{l.title}<br />{l.dim}</div>
                      <div className="cnn-layer-label">{l.label}</div>
                    </div>
                    {i < cnnLayers.length - 1 && <div className="cnn-arrow" style={{ flexShrink: 0 }}>→</div>}
                  </React.Fragment>
                ))}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <strong>Convolutional layers</strong> detect local patterns like opacities and consolidation. <strong>Pooling layers</strong> reduce spatial dimensions. <strong>Dense layers</strong> combine learned features for final classification into <em>Normal</em> or <em>Pneumonia</em>.
              </p>
            </div>

            {/* Methodology */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Methodology
              </h3>
              <div className="methodology-steps">
                {methodologySteps.map((step, i) => (
                  <div key={i} className="card methodology-step">
                    <div className="methodology-step-num">{step.num}</div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
