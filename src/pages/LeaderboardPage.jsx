export default function LeaderboardPage({ state, getTeam, getTeamRemaining, getPlayer }) {
  const sorted      = [...state.teams].sort((a, b) => b.players.length - a.players.length || a.pointsSpent - b.pointsSpent);
  const soldPlayers = state.players.filter((p) => p.status === 'sold');

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 12 }}>Rankings by Players Bought</div>
        {sorted.map((t, i) => {
          const pct = Math.round((getTeamRemaining(t) / t.points) * 100);
          return (
            <div key={t.id} className="leaderboard-row" style={{ '--team-color': t.color }}>
              <div className={`rank-num${i === 0 ? ' gold' : ''}`} style={i === 1 ? { color: '#94a3b8' } : {}}>{i + 1}</div>
              <div style={{ width: 4, height: 40, borderRadius: 2, background: t.color, marginRight: 4 }} />
              <div className="lb-team-name" style={{ color: t.color }}>{t.name}</div>
              <div className="lb-stat">{t.players.length} players</div>
              <div className="lb-stat" style={{ marginLeft: 12 }}>{t.pointsSpent} spent</div>
              <div className="lb-stat" style={{ marginLeft: 12, color: 'var(--cat-c)' }}>{getTeamRemaining(t)} left</div>
              <div style={{ marginLeft: 12, fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 12 }}>Top 5 Most Expensive Players</div>
        {soldPlayers.length === 0 ? (
          <div className="empty-state"><div className="empty-state-text">No players sold yet</div></div>
        ) : (
          [...soldPlayers].sort((a, b) => b.soldPrice - a.soldPrice).slice(0, 5).map((p, i) => {
            const team = getTeam(p.teamId);
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8 }}>
                <div className={`rank-num${i === 0 ? ' gold' : ''}`} style={{ fontSize: 20 }}>{i + 1}</div>
                <span className={`cat-dot ${p.category}`} />
                <div style={{ flex: 1, fontWeight: 700 }}>{p.name}</div>
                <span className={`category-chip ${p.category}`} style={{ padding: '2px 8px', fontSize: 10 }}>{p.category}</span>
                {team && <span className="team-tag" style={{ background: team.color + '20', color: team.color, border: `1px solid ${team.color}40` }}>{team.name}</span>}
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontWeight: 700, fontSize: 16 }}>{p.soldPrice} pts</div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
