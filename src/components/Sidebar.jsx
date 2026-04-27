export default function Sidebar({ currentPage, navigate, onToggleTheme, theme, onReset }) {
  const navItems = [
    { key: 'dashboard',  icon: '🏏', label: 'Dashboard' },
    { key: 'auction',    icon: '⚡', label: 'Auction' },
    { key: 'registered', icon: '📝', label: 'Registered' },
    { key: 'players',    icon: '📋', label: 'Players' },
    { key: 'teams',      icon: '🛡', label: 'Teams' },
    { key: 'stats',      icon: '📊', label: 'Statistics' },
    { key: 'leaderboard',icon: '🏆', label: 'Leaderboard' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">KPL<br />AUCTION</div>
        <div className="logo-sub">Kudei Premier League</div>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item${currentPage === item.key ? ' active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={onToggleTheme}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="btn-danger" onClick={onReset}>🔄 Reset</button>
      </div>
    </nav>
  );
}
