import React, { useState } from 'react';

export default function AuthModal({
  isOpen,
  onClose,
  initialType = 'login', // 'login' or 'register'
  setUser
}) {
  const [type, setType] = useState(initialType);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Sync state if initialType changes from parent
  React.useEffect(() => {
    setType(initialType);
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      const mockUser = { email: loginEmail, name: loginEmail.split('@')[0] };
      localStorage.setItem('pneumoscan-user', JSON.stringify(mockUser));
      setUser(mockUser);
      onClose();
      alert('✅ Logged in successfully!');
    } else {
      alert('⚠️ Please fill out all fields.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regName && regEmail && regPassword && regConfirm) {
      if (regPassword !== regConfirm) {
        alert('⚠️ Passwords do not match.');
        return;
      }
      const mockUser = { email: regEmail, name: regName };
      localStorage.setItem('pneumoscan-user', JSON.stringify(mockUser));
      setUser(mockUser);
      onClose();
      alert('✅ Account created successfully!');
    } else {
      alert('⚠️ Please fill out all fields.');
    }
  };

  return (
    <div className="modal-overlay visible" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      {type === 'login' ? (
        <div className="modal-box">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <h2 className="modal-title">Welcome Back 👋</h2>
          <p className="modal-subtitle">Sign in to access your scan history and dashboard.</p>
          <form onSubmit={handleLoginSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                className="form-input"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                className="form-input"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary form-submit">Sign In</button>
          </form>
          <div className="modal-switch">
            Don't have an account? <a style={{ cursor: 'pointer' }} onClick={() => setType('register')}>Sign Up</a>
          </div>
        </div>
      ) : (
        <div className="modal-box">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <h2 className="modal-title">Create Account 🚀</h2>
          <p className="modal-subtitle">Join PneumoScan AI to save your scan history and get personalized insights.</p>
          <form onSubmit={handleRegisterSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="regName">Full Name</label>
              <input
                type="text"
                id="regName"
                className="form-input"
                placeholder="Your full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">Email Address</label>
              <input
                type="email"
                id="regEmail"
                className="form-input"
                placeholder="your.email@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                className="form-input"
                placeholder="Create a password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="regConfirm">Confirm Password</label>
              <input
                type="password"
                id="regConfirm"
                className="form-input"
                placeholder="Confirm your password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary form-submit">Create Account</button>
          </form>
          <div className="modal-switch">
            Already have an account? <a style={{ cursor: 'pointer' }} onClick={() => setType('login')}>Sign In</a>
          </div>
        </div>
      )}
    </div>
  );
}
