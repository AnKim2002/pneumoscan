import { useState } from 'react';

export default function Contact({ active }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setShowSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <section id="contact" className={`page-section ${active ? 'active' : ''}`} aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title" id="contact-heading">Contact Us</h2>
          <p className="section-subtitle">Have questions about PneumoScan AI? Want to collaborate? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Info */}
          <div>
            <div className="contact-info-cards">
              {/* Team Card */}
              <div className="glass-card" style={{ padding: '28px', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                  👩‍💻 Project Team
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ width: '56px', height: '56px', background: 'var(--gradient-hero)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>A</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Anushka Vishwakarma</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Developer & ML Engineer</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  CS Graduate specializing in data science, machine learning, and AI applications for healthcare.
                </p>
              </div>

              <div className="glass-card contact-info-card">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value"><a href="mailto:anushka@pneumoscan.ai">anushka@pneumoscan.ai</a></div>
                </div>
              </div>
              <div className="glass-card contact-info-card">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">+91 98765 43210</div>
                </div>
              </div>
              <div className="glass-card contact-info-card">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-value">India</div>
                </div>
              </div>
              <div className="glass-card contact-info-card">
                <div className="contact-icon">🐙</div>
                <div>
                  <div className="contact-label">GitHub</div>
                  <div className="contact-value"><a href="https://github.com/anushkavishwakarma" target="_blank" rel="noopener noreferrer">github.com/anushkavishwakarma</a></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="glass-card contact-form-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '24px' }}>
                ✉️ Send a Message
              </h3>

              <div className={`form-success ${showSuccess ? 'visible' : ''}`} style={{ display: showSuccess ? 'block' : 'none' }}>
                ✅ Message sent successfully! We'll get back to you soon.
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactName">Full Name <span>*</span></label>
                  <input
                    type="text"
                    id="contactName"
                    className="form-input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactEmail">Email Address <span>*</span></label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactSubject">Subject</label>
                  <input
                    type="text"
                    id="contactSubject"
                    className="form-input"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactMessage">Message <span>*</span></label>
                  <textarea
                    id="contactMessage"
                    className="form-textarea"
                    placeholder="Tell us about your question or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary form-submit">
                  Send Message 🚀
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
