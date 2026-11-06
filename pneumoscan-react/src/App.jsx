import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Detector from './pages/Detector';
import ModelInfo from './components/ModelInfo';
import Dashboard from './pages/Dashboard';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import PDFReport from './components/PDFReport';

export default function App() {
  // SPA Routing Page state
  const [activePage, setActivePage] = useState('home');

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pneumoscan-theme') || 'light';
  });

  // Auth User state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pneumoscan-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Scan History state
  const [history, setHistory] = useState([]);

  // Fetch scan history from SQLite backend
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error('Failed to fetch scan history', e);
    }
  };

  // Modal Open states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [authModalInitialType, setAuthModalInitialType] = useState('login');
  const [adminOpen, setAdminOpen] = useState(false);
  const [viewReportResult, setViewReportResult] = useState(null);

  // Floating back-to-top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch history on initial mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Sync Theme attribute on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pneumoscan-theme', theme);
  }, [theme]);

  // Sync URL hash routing on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActivePage(hash);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Back-to-top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pneumoscan-user');
    setUser(null);
    alert('Logged out successfully.');
  };

  const handleSaveResult = () => {
    // Re-fetch from DB to sync newest predictions
    fetchHistory();
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      try {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (res.ok) {
          setHistory([]);
          alert('✅ History cleared.');
        } else {
          alert('⚠️ Failed to clear history.');
        }
      } catch (e) {
        console.error(e);
        alert('⚠️ Error connecting to server.');
      }
    }
  };

  const handleLoadSampleData = async () => {
    try {
      const res = await fetch('/api/history/load-samples', { method: 'POST' });
      if (res.ok) {
        fetchHistory();
        alert('✅ Sample data loaded.');
      } else {
        alert('⚠️ Failed to load sample data.');
      }
    } catch (e) {
      console.error(e);
      alert('⚠️ Error connecting to server.');
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Filename', 'Prediction', 'Confidence', 'Risk Level', 'Recommendation'];
    const rows = history.map((h) => [
      h.id,
      new Date(h.date).toLocaleString(),
      h.filename,
      h.prediction,
      h.confidence + '%',
      h.riskLevel,
      `"${h.recommendation}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pneumoscan-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Navbar Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        setTheme={setTheme}
        user={user}
        logout={handleLogout}
        setLoginModalOpen={(val) => {
          setAuthModalInitialType('login');
          setLoginModalOpen(val);
        }}
        setRegisterModalOpen={(val) => {
          setAuthModalInitialType('register');
          setRegisterModalOpen(val);
        }}
        setAdminOpen={setAdminOpen}
      />

      {/* Pages Layout - Controlled by dynamic visibility classes to preserve DOM rendering elements */}
      <section id="home" className={`page-section ${activePage === 'home' ? 'active' : ''}`}>
        <Hero setActivePage={setActivePage} />
        <Features />
      </section>

      <About active={activePage === 'about'} />

      <Detector
        active={activePage === 'detect'}
        onSaveResult={handleSaveResult}
        setViewReportResult={setViewReportResult}
      />

      <ModelInfo active={activePage === 'model'} theme={theme} />

      <Dashboard
        active={activePage === 'dashboard'}
        history={history}
        theme={theme}
        setViewReportResult={setViewReportResult}
      />

      <Contact active={activePage === 'contact'} />

      {/* Footer Branding */}
      <Footer setActivePage={setActivePage} />

      {/* Modals & Slide-ins */}
      <AuthModal
        isOpen={loginModalOpen || registerModalOpen}
        initialType={authModalInitialType}
        onClose={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(false);
        }}
        setUser={setUser}
      />

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        history={history}
        clearHistory={handleClearHistory}
        loadSampleData={handleLoadSampleData}
        exportCSV={handleExportCSV}
      />

      <PDFReport
        isOpen={!!viewReportResult}
        onClose={() => setViewReportResult(null)}
        result={viewReportResult}
      />

      {/* Interactive AI FAQ Healthcare Assistant Widget */}
      <Chatbot history={history} setViewReportResult={setViewReportResult} />

      {/* Scroll-to-Top Floating Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}
