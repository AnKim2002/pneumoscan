export default function AdminPanel({
  isOpen,
  onClose,
  history,
  clearHistory,
  loadSampleData,
  exportCSV
}) {
  if (!isOpen) return null;

  const totalScans = history.length;
  const positiveCases = history.filter((h) => h.prediction === 'Pneumonia').length;

  return (
    <div className={`admin-drawer ${isOpen ? 'open' : ''}`} style={{ display: 'block' }}>
      <div className="admin-header">
        <div className="admin-title">🔐 Admin Panel</div>
        <button className="btn btn-secondary btn-sm" onClick={onClose}>✕ Close</button>
      </div>

      {/* Admin Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-500)' }}>
            {totalScans}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Scans</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>
            {positiveCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pneumonia Cases</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div style={{ display: 'flex', flexTarget: 'column', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        <button className="btn btn-secondary btn-sm" onClick={clearHistory}>🗑️ Clear All History</button>
        <button className="btn btn-secondary btn-sm" onClick={loadSampleData}>📥 Load Sample Data</button>
        <button className="btn btn-secondary btn-sm" onClick={exportCSV}>📤 Export All Data</button>
      </div>

      {/* Admin Predictions List */}
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-secondary)' }}>
          Recent Predictions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>No predictions yet.</p>
          ) : (
            history.slice(0, 20).map((h) => {
              const isNormal = h.prediction === 'Normal';
              const date = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={h.id} className="card" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {h.id} · {date}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, wordBreak: 'break-all' }}>{h.filename}</div>
                  </div>
                  <span className={`status-badge ${isNormal ? 'normal' : 'pneumonia'}`} style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                    {isNormal ? '🟢' : '🔴'} {h.confidence}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
