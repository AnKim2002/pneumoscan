

export default function Features() {
  const features = [
    {
      icon: '🧠',
      title: 'Deep Learning CNN',
      desc: 'State-of-the-art Convolutional Neural Network trained on 5,863 validated chest X-ray images for precise classification.'
    },
    {
      icon: '⚡',
      title: 'Real-time Analysis',
      desc: 'Get prediction results in under 2 seconds. No waiting, no queues — instant AI-powered insights.'
    },
    {
      icon: '🎯',
      title: '96.2% Accuracy',
      desc: 'High precision and recall ensure reliable pneumonia detection with minimal false positives.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      desc: 'All image processing happens in your browser. No data is uploaded to any server — your medical data stays private.'
    },
    {
      icon: '📄',
      title: 'PDF Reports',
      desc: 'Download detailed diagnostic reports with prediction results, confidence scores, and recommendations.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      desc: 'Access PneumoScan AI from any device — desktop, tablet, or mobile with a seamless experience.'
    }
  ];

  const benefits = [
    {
      icon: '🏥',
      title: 'Assist Healthcare Workers',
      desc: 'Provide rapid screening support in resource-limited settings where radiologists may not be available.'
    },
    {
      icon: '⏰',
      title: 'Early Detection Saves Lives',
      desc: 'Pneumonia kills 2.5 million people annually. Early AI-assisted detection can significantly reduce mortality.'
    },
    {
      icon: '💰',
      title: 'Cost Effective Screening',
      desc: 'Reduce diagnostic costs with automated preliminary screening that flags cases for expert review.'
    },
    {
      icon: '🌍',
      title: 'Accessible Anywhere',
      desc: 'Web-based platform accessible from any device — bringing AI diagnostics to remote and underserved areas.'
    }
  ];

  return (
    <div style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Features */}
        <div className="section-header">
          <span className="section-label">Features</span>
          <h2 className="section-title">Powered by Advanced AI</h2>
          <p className="section-subtitle">Our platform combines cutting-edge deep learning with intuitive design to deliver fast, accurate pneumonia screening.</p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="glass-card feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="divider"></div>
        <div className="section-header">
          <span className="section-label">Benefits</span>
          <h2 className="section-title">Why Choose PneumoScan AI?</h2>
        </div>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div key={i} className="glass-card benefit-item">
              <div className="benefit-icon">{b.icon}</div>
              <div className="benefit-text">
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
