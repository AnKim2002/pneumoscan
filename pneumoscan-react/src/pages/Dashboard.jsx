import { useEffect, useRef, useState } from 'react';

export default function Dashboard({ active, history, theme, setViewReportResult }) {
  const distributionCanvasRef = useRef(null);
  const timelineCanvasRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate statistics
  const totalScans = history.length;
  const positiveCases = history.filter((h) => h.prediction === 'Pneumonia').length;
  const negativeCases = totalScans - positiveCases;
  const avgConfidence = totalScans > 0
    ? (history.reduce((sum, h) => sum + h.confidence, 0) / totalScans).toFixed(1)
    : '0.0';

  useEffect(() => {
    if (!active) return;

    const getThemeColor = (varName, defaultVal) => {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || defaultVal;
    };

    const textColor = getThemeColor('--text-primary', '#1a1a2e');
    const textMuted = getThemeColor('--text-muted', '#888');
    const textSecondary = getThemeColor('--text-secondary', '#555');
    const borderLight = getThemeColor('--border-light', '#e5e5e5');

    // 1. Draw Distribution Chart (Donut)
    const drawDistribution = () => {
      const canvas = distributionCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = (rect.height || 220) * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = (rect.height || 220) + 'px';
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height || 220;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 25;
      const innerRadius = radius * 0.6;
      const total = positiveCases + negativeCases || 1;

      ctx.clearRect(0, 0, w, h);

      const segments = [
        { value: negativeCases, color: '#22c55e', label: 'Normal' },
        { value: positiveCases, color: '#ef4444', label: 'Pneumonia' }
      ];

      // Draw slices
      let startAngle = -Math.PI / 2;
      segments.forEach((seg) => {
        const sliceAngle = (seg.value / total) * Math.PI * 2;
        if (sliceAngle > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
          ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = seg.color;
          ctx.fill();
        }
        startAngle += sliceAngle;
      });

      // Draw Center text
      ctx.fillStyle = textColor;
      ctx.font = `800 ${Math.min(22, w / 10)}px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(totalScans, cx, cy - 8);

      ctx.font = `400 ${Math.min(10, w / 22)}px Inter, sans-serif`;
      ctx.fillStyle = textMuted;
      ctx.fillText('Total Scans', cx, cy + 14);

      // Draw Legend at the bottom
      const legendY = h - 15;
      segments.forEach((seg, i) => {
        const lx = cx + (i === 0 ? -60 : 20);
        ctx.fillStyle = seg.color;
        ctx.fillRect(lx, legendY - 5, 10, 10);
        ctx.fillStyle = textSecondary;
        ctx.font = '500 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${seg.label} (${seg.value})`, lx + 14, legendY + 4);
      });
    };

    // 2. Draw Timeline Chart (Bar)
    const drawTimeline = () => {
      const canvas = timelineCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = (rect.height || 220) * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = (rect.height || 220) + 'px';
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height || 220;
      const padding = { top: 20, right: 20, bottom: 40, left: 35 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      ctx.clearRect(0, 0, w, h);

      // Generate last 7 days keys
      const days = [];
      const dayLabels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days.push(key);
        dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      }

      // Calculate daily scans
      const dailyCounts = days.map((day) =>
        history.filter((h) => h.date.split('T')[0] === day).length
      );
      const maxCount = Math.max(...dailyCounts, 1);

      // Draw Grid & Y labels
      ctx.strokeStyle = borderLight;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = textMuted;
        ctx.font = '400 10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(maxCount - (maxCount / 4) * i), padding.left - 8, y);
      }

      // Draw Bars
      const barWidth = (chartW / days.length) * 0.5;
      const gap = (chartW / days.length) * 0.5;

      dailyCounts.forEach((count, i) => {
        const x = padding.left + i * (barWidth + gap) + gap / 2;
        const barH = (count / maxCount) * chartH;
        const y = padding.top + chartH - barH;

        if (count > 0) {
          const gradient = ctx.createLinearGradient(x, y, x, y + barH);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#38d3bd');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
          ctx.fill();

          // Count text
          ctx.fillStyle = textColor;
          ctx.font = '600 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(count, x + barWidth / 2, y - 6);
        }

        // X labels
        ctx.fillStyle = textMuted;
        ctx.font = '400 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dayLabels[i], x + barWidth / 2, h - padding.bottom + 16);
      });
    };

    drawDistribution();
    drawTimeline();
  }, [active, history, theme]); // Redraw on active page, history changes or theme toggles

  // Filter history based on search query
  const filteredHistory = history.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.filename.toLowerCase().includes(q) ||
      h.prediction.toLowerCase().includes(q) ||
      h.riskLevel.toLowerCase().includes(q) ||
      h.id.toLowerCase().includes(q)
    );
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'var(--success)';
      case 'Medium':
        return 'var(--warning)';
      case 'High':
        return '#ff9800';
      case 'Critical':
        return 'var(--danger)';
      default:
        return 'var(--text-muted)';
    }
  };

  const statCards = [
    { id: 'totalScans', title: 'Total Scans', value: totalScans, class: '' },
    { id: 'positiveCases', title: 'Positive Cases', value: positiveCases, class: 'danger' },
    { id: 'negativeCases', title: 'Negative Cases', value: negativeCases, class: 'success' },
    { id: 'avgConfidence', title: 'Avg Confidence', value: avgConfidence + '%', class: 'info' }
  ];

  return (
    <section id="dashboard" className={`page-section ${active ? 'active' : ''}`} aria-labelledby="dashboard-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Dashboard</span>
          <h2 className="section-title" id="dashboard-heading">Analytics & History</h2>
          <p className="section-subtitle">Monitor scan statistics, scan distributions, daily logs, and browse patient scan histories.</p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {statCards.map((c) => (
            <div key={c.id} className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div className="stat-card-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                {c.title}
              </div>
              <div
                className="stat-card-value"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: c.class === 'danger' ? 'var(--danger)' : c.class === 'success' ? 'var(--success)' : c.class === 'info' ? 'var(--primary-500)' : 'var(--text-primary)'
                }}
              >
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="glass-card chart-card">
            <h3 className="chart-title">📊 Case Distribution</h3>
            <div className="chart-canvas-container" style={{ position: 'relative', height: '220px' }}>
              <canvas ref={distributionCanvasRef}></canvas>
            </div>
          </div>
          <div className="glass-card chart-card">
            <h3 className="chart-title">📈 Daily Scans (Last 7 Days)</h3>
            <div className="chart-canvas-container" style={{ position: 'relative', height: '220px' }}>
              <canvas ref={timelineCanvasRef}></canvas>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card" style={{ marginTop: '32px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <h3 className="chart-title" style={{ marginBottom: 0 }}>📋 Scan History Logs</h3>
            <input
              type="text"
              id="historySearch"
              className="form-input"
              placeholder="Search filename, result, ID..."
              style={{ maxWidth: '280px', margin: 0 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th>Scan ID</th>
                  <th>Date & Time</th>
                  <th>File Name</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No scan history matches your search or history is empty.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((h) => {
                    const date = new Date(h.date);
                    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const isNormal = h.prediction === 'Normal';

                    return (
                      <tr key={h.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.id}</td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{dateStr}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeStr}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {h.filename}
                        </td>
                        <td>
                          <span className={`status-badge ${isNormal ? 'normal' : 'pneumonia'}`}>
                            {isNormal ? '🟢' : '🔴'} {h.prediction}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px', maxWidth: '80px' }}>
                              <div style={{ height: '100%', width: `${h.confidence}%`, background: isNormal ? 'var(--success)' : 'var(--danger)', borderRadius: '3px' }}></div>
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{h.confidence}%</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: getRiskColor(h.riskLevel) }}>
                            {h.riskLevel}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewReportResult(h)}
                            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                          >
                            📄 Report
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: '4px 10px' }}
              >
                ◀ Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(i + 1)}
                  style={{ padding: '4px 10px' }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ padding: '4px 10px' }}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
