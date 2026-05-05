

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Sidebar({ currentPage, navigate, onToggleTheme, theme, onReset, onPlayerRegistered }) {
  const { isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [mobOpen,   setMobOpen]   = useState(false);

  const handleNav = (key) => { navigate(key); setMobOpen(false); };

  const allNavItems = [
    { key: 'dashboard',   icon: '🏏', label: 'Dashboard',   adminOnly: false },
    { key: 'auction',     icon: '⚡', label: 'Auction',     adminOnly: false },
    { key: 'registered',  icon: '📝', label: 'Registered',  adminOnly: true  },
    { key: 'players',     icon: '📋', label: 'Players',     adminOnly: false },
    { key: 'teams',       icon: '🛡', label: 'Teams',       adminOnly: false },
    { key: 'stats',       icon: '📊', label: 'Statistics',  adminOnly: false },
    { key: 'leaderboard', icon: '🏆', label: 'Leaderboard', adminOnly: false },
  ];

  // Viewers can't see the Registered page
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onPlayerRegistered={onPlayerRegistered} />}

      {/* Hamburger — mobile only */}
      <button className="mob-menu-btn" onClick={() => setMobOpen(true)}>☰</button>

      {/* Backdrop — closes drawer on tap outside */}
      {mobOpen && <div className="sidebar-backdrop open" onClick={() => setMobOpen(false)} />}

      <nav className={`sidebar${mobOpen ? ' mob-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-text">KPL<br />AUCTION</div>
          <div className="logo-sub">Kudei Premier League</div>
        </div>

        {/* Role badge */}
        <div style={{
          margin: '0 12px 12px',
          padding: '6px 12px',
          borderRadius: 8,
          background: isAdmin ? 'rgba(249,115,22,0.15)' : 'rgba(99,102,241,0.12)',
          border: `1px solid ${isAdmin ? 'rgba(249,115,22,0.3)' : 'rgba(99,102,241,0.3)'}`,
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700,
          color: isAdmin ? '#f97316' : '#818cf8',
        }}>
          <span>{isAdmin ? '👑' : '👁️'}</span>
          <span>{isAdmin ? 'Admin Mode' : 'Viewer Mode'}</span>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item${currentPage === item.key ? ' active' : ''}`}
              onClick={() => handleNav(item.key)}
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

          {isAdmin ? (
            <>
              <button className="btn-danger" onClick={onReset}>🔄 Reset</button>
              <button
                onClick={logout}
                style={{
                  width: '100%', marginTop: 6, padding: '8px 0',
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', borderRadius: 8, fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                🔓 Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                width: '100%', padding: '9px 0',
                background: 'rgba(249,115,22,0.15)',
                border: '1px solid rgba(249,115,22,0.4)',
                color: '#f97316', borderRadius: 8, fontSize: 13,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              📝 Register / Admin Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

