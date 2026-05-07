export default function DashboardPage({ state, getTeamRemaining, getPlayer, onNavigate, onShowTeam }) {
  const maxRemaining = Math.max(...state.teams.map((t) => getTeamRemaining(t)));

  return (
    <>
      <div className="teams-grid">
        {state.teams.map((t) => {
          const remaining = getTeamRemaining(t);
          const pct = Math.round((remaining / 1000) * 100);
          const isTop = remaining === maxRemaining;
          const playerCount = t.players.length;
          const warnNeeded = playerCount < 10;
          return (
            <div
              key={t.id}
              className={`team-card${isTop ? ' top-points' : ''}`}
              style={{ '--team-color': t.color }}
              onClick={() => onShowTeam(t.id)}
            >
              <div className="team-name" style={{ color: t.color }}>{t.name}</div>
              <div className="team-stats">
                <div><div className="stat-label">Total Points</div><div className="stat-value">1000</div></div>
                <div><div className="stat-label">Remaining</div><div className="stat-value" style={{ color: t.color }}>{remaining}</div></div>
                <div><div className="stat-label">Spent</div><div className="stat-value">{t.pointsSpent}</div></div>
                <div>
                  <div className="stat-label">Players Bought</div>
                  <div className="stat-value" style={{ color: warnNeeded ? 'var(--gold)' : 'var(--cat-c)' }}>
                    {playerCount}
                    {warnNeeded && <span className="warning-badge">⚠ Need {15 - playerCount}</span>}
                  </div>
                </div>
              </div>
              <div className="points-bar-wrap" title={`${pct}% remaining`}>
                <div className="points-bar" style={{ width: `${pct}%`, background: t.color }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
                {pct}% remaining · RTM: {t.rtmUsed ? '✗ Used' : '✓ Available'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        <div className="card">
          <div className="card-title">Rules &amp; Limits</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-dim)' }}>
            <div>🎯 Each team starts with <strong style={{ color: 'var(--text)' }}>1000 points</strong></div>
            <div>🅰️ Max <strong style={{ color: 'var(--text)' }}>3 Category A</strong> players per team</div>
            <div>👥 Minimum <strong style={{ color: 'var(--text)' }}>10 players</strong> per team required</div>
            <div>⚡ Each team has <strong style={{ color: 'var(--text)' }}>1 RTM</strong> (Right to Match)</div>
            <div>🃏 Wildcard pick costs a fixed <strong style={{ color: 'var(--text)' }}>50 points</strong></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-primary" onClick={() => onNavigate('auction')}>⚡ Start Auction</button>
            <button className="btn-primary" onClick={() => onNavigate('players')} style={{ background: 'var(--bg-card2)', color: 'var(--text)', border: '1px solid var(--border)' }}>📋 View All Players</button>
            <button className="btn-primary" onClick={() => onNavigate('stats')} style={{ background: 'var(--bg-card2)', color: 'var(--text)', border: '1px solid var(--border)' }}>📊 Statistics</button>
          </div>
        </div>
      </div>
    </>
  );
}
