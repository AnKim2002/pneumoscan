

export default function Footer({ setActivePage }) {
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🫁 PneumoScan AI</div>
            <p className="footer-desc">AI-Powered Pneumonia Detection Using Deep Learning (CNNs) for Automated Medical Image Classification.</p>
          </div>
          <div>
            <div className="footer-heading">Navigation</div>
            <div className="footer-links">
              <a href="#home" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
              <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
              <a href="#detect" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('detect'); }}>AI Detection</a>
              <a href="#model" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('model'); }}>Model Info</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Resources</div>
            <div className="footer-links">
              <a href="#dashboard" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }}>Dashboard</a>
              <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
              <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Documentation</a>
              <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Connect</div>
            <div className="footer-links">
              <a href="https://github.com/anushkavishwakarma" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="mailto:anushka@pneumoscan.ai" className="footer-link">Email</a>
              <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PneumoScan AI by Anushka Vishwakarma. All rights reserved.</span>
          <span>Built with ❤️ using React & Vite</span>
        </div>
      </div>
    </footer>
  );
}
