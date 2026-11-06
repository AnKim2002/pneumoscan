import { useState } from 'react';

export default function Header({
  activePage,
  setActivePage,
  theme,
  setTheme,
  user,
  logout,
  setLoginModalOpen,
  setRegisterModalOpen,
  setAdminOpen
}) {
  const [hamburgerActive, setHamburgerActive] = useState(false);

  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'about', label: '📖 About Project' },
    { id: 'detect', label: '🔬 AI Detection' },
    { id: 'model', label: '🧠 Model Info' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'contact', label: '📧 Contact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    setHamburgerActive(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <>
      <nav id="navbar" className="scrolled">
        <div className="container nav-container">
          <div className="nav-logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon" aria-hidden="true">🫁</span>
            <span className="logo-text">PneumoScan <span className="logo-accent">AI</span></span>
          </div>

          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
            <button
              className="nav-link admin-btn"
              onClick={() => setAdminOpen(true)}
              style={{
                background: 'rgba(56, 211, 189, 0.15)',
                color: 'var(--accent)',
                borderRadius: '4px',
                padding: '4px 8px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚙️ Admin
            </button>
          </div>

          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className="nav-auth">
              {user ? (
                <>
                  <span className="user-info-text" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    👤 {user.name}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => setLoginModalOpen(true)}>Login</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setRegisterModalOpen(true)}>Sign Up</button>
                </>
              )}
            </div>

            <button
              className={`nav-hamburger ${hamburgerActive ? 'active' : ''}`}
              onClick={() => setHamburgerActive(!hamburgerActive)}
              aria-label="Open menu"
              aria-expanded={hamburgerActive}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer ${hamburgerActive ? 'open' : ''}`} role="dialog" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-drawer-link ${activePage === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#admin"
          className="nav-drawer-link"
          onClick={(e) => {
            e.preventDefault();
            setAdminOpen(true);
            setHamburgerActive(false);
          }}
          style={{ color: 'var(--accent)' }}
        >
          ⚙️ Admin Panel
        </a>
      </div>
    </>
  );
}
