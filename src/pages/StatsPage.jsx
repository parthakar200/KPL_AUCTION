export default function StatsPage({ state, getTeam, getTeamRemaining }) {
  const soldPlayers     = state.players.filter((p) => p.status === 'sold');
  const totalSold       = soldPlayers.length;
  const mostExpensive   = soldPlayers.reduce((max, p) => !max || p.soldPrice > max.soldPrice ? p : max, null);
  const cheapest        = soldPlayers.reduce((min, p) => !min || p.soldPrice < min.soldPrice ? p : min, null);
  const mostExpensiveTeam = state.teams.reduce((max, t) => !max || t.pointsSpent > max.pointsSpent ? t : max, null);
  const avgPrice        = totalSold > 0 ? Math.round(soldPlayers.reduce((s, p) => s + p.soldPrice, 0) / totalSold) : 0;

  const statCards = [
    { icon: '👑', label: 'Most Expensive Player',  value: mostExpensive ? mostExpensive.soldPrice + ' pts' : '—',         detail: mostExpensive ? `${mostExpensive.name} (${getTeam(mostExpensive.teamId)?.name || ''})` : 'No sales yet' },
    { icon: '🏆', label: 'Most Spending Team',      value: mostExpensiveTeam?.pointsSpent || 0,                            detail: mostExpensiveTeam?.name || '—', color: mostExpensiveTeam?.color || 'var(--gold)' },
    { icon: '💸', label: 'Cheapest Player',         value: cheapest ? cheapest.soldPrice + ' pts' : '—',                   detail: cheapest ? cheapest.name : 'No sales yet' },
    { icon: '🎯', label: 'Total Players Sold',      value: totalSold,                                                      detail: `of ${state.players.length} total players` },
    { icon: '📊', label: 'Average Sale Price',      value: avgPrice + ' pts',                                              detail: 'across all sold players' },
    { icon: '🔴', label: 'Category A Sold',         value: soldPlayers.filter((p) => p.category === 'A').length,          detail: `of ${state.players.filter((p) => p.category === 'A').length} total`, color: 'var(--cat-a)' },
  ];

  return (
    <>
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color || 'var(--gold)' }}>{s.value}</div>
            <div className="stat-card-detail">{s.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-title">Team Spending Breakdown</div>
          {state.teams.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 120, fontWeight: 700, fontSize: 14, color: t.color }}>{t.name}</div>
              <div style={{ flex: 1, background: 'var(--bg-card2)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (t.pointsSpent / 1000) * 100)}%`, background: t.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, width: 60, textAlign: 'right' }}>{t.pointsSpent} pts</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Category Distribution</div>
          {['A', 'B', 'C'].map((cat) => {
            const all  = state.players.filter((p) => p.category === cat).length;
            const sold = soldPlayers.filter((p) => p.category === cat).length;
            const pct  = all > 0 ? Math.round((sold / all) * 100) : 0;
            const color = cat === 'A' ? 'var(--cat-a)' : cat === 'B' ? 'var(--cat-b)' : 'var(--cat-c)';
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span className={`category-chip ${cat}`} style={{ padding: '3px 10px', width: 30, textAlign: 'center' }}>{cat}</span>
                <div style={{ flex: 1, background: 'var(--bg-card2)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, textAlign: 'right' }}>{sold}/{all} sold</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
