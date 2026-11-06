import { useEffect, useRef, useState } from 'react';

export default function Hero({ setActivePage }) {
  const canvasRef = useRef(null);
  
  // Count-up states
  const [accuracy, setAccuracy] = useState(0);
  const [scans, setScans] = useState(0);
  const [seconds, setSeconds] = useState(10); // Start high and go down/up

  useEffect(() => {
    // ── Particle Background Canvas ──
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const PARTICLE_COUNT = 40;
    let animationId;

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // ── Stats Count-Up Animation ──
    const duration = 2000;
    const startTime = performance.now();

    function updateCounters(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setAccuracy(96.2 * eased);
      setScans(Math.floor(12400 * eased));
      setSeconds(Math.ceil(10 - (10 - 2) * eased)); // count down from 10 to 2

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    }
    requestAnimationFrame(updateCounters);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
  };

  return (
    <div id="hero">
      <canvas id="particleCanvas" ref={canvasRef} aria-hidden="true"></canvas>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true"></span>
              AI-Powered Healthcare
            </div>

            <h1 className="hero-name">
              AI-Powered <span>Pneumonia Detection</span> Using Deep Learning
            </h1>

            <p className="hero-subtitle">
              Upload chest X-ray images and receive <strong>instant AI-based pneumonia detection</strong> powered by
              Convolutional Neural Networks (CNN). Fast, accurate, and designed to assist healthcare professionals.
            </p>

            <div className="hero-actions">
              <a
                href="#detect"
                className="btn btn-primary btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('detect');
                }}
              >
                🔬 Upload X-Ray
              </a>
              <a
                href="#about"
                className="btn btn-secondary btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
              >
                📖 Learn More
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-value">{accuracy.toFixed(1)}%</div>
                <div className="hero-stat-label">Accuracy %</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">{scans.toLocaleString()}+</div>
                <div className="hero-stat-label">Scans Analyzed</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">&lt;{seconds}s</div>
                <div className="hero-stat-label">Seconds to Detect</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="hero-lung-container">
                <svg className="hero-lung-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lungGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#38d3bd', stopOpacity: 0.8 }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M100 40 C100 40, 75 50, 60 70 C45 90, 35 120, 40 150 C45 170, 60 180, 75 175 C85 172, 92 160, 95 145 L100 130 L105 145 C108 160, 115 172, 125 175 C140 180, 155 170, 160 150 C165 120, 155 90, 140 70 C125 50, 100 40, 100 40Z"
                    fill="url(#lungGrad)"
                    filter="url(#glow)"
                    opacity="0.6"
                  />
                  <path
                    d="M100 40 L100 90 M100 65 L80 85 M100 65 L120 85 M80 85 L70 100 M80 85 L85 105 M120 85 L130 100 M120 85 L115 105"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.7"
                  />
                  <line x1="30" y1="100" x2="170" y2="100" stroke="#38d3bd" strokeWidth="1.5" opacity="0.5" strokeDasharray="5,5">
                    <animate attributeName="y1" values="50;160;50" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="50;160;50" dur="3s" repeatCount="indefinite" />
                  </line>
                  <circle cx="50" cy="60" r="3" fill="#3b82f6" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="150" cy="60" r="3" fill="#3b82f6" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="180" r="3" fill="#38d3bd" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <div className="hero-scan-ring" aria-hidden="true"></div>
              </div>

              {/* Floating cards */}
              <div className="hero-float-card">
                <div className="hero-float-icon blue">🧠</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Deep Learning CNN</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>96.2% Accuracy</div>
                </div>
              </div>
              <div className="hero-float-card">
                <div className="hero-float-icon green">✅</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Real-time Analysis</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Results in &lt;2s</div>
                </div>
              </div>
              <div className="hero-float-card">
                <div className="hero-float-icon teal">🔒</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Secure Processing</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Client-side only</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true" onClick={() => handleNavClick('about')} style={{ cursor: 'pointer' }}>
          <span>Scroll to explore</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </div>
  );
}
