import { useState } from 'react';
import { TEAM_COLORS } from '../constants/data';

export default function TeamsPage({ state, teamsView, setTeamsView, getTeam, getPlayer, getTeamRemaining, onAddTeam, onDeleteTeam }) {
  const [newName,  setNewName]  = useState('');
  const [newColor, setNewColor] = useState('#f97316');
  const [newPts,   setNewPts]   = useState(1000);

  const handleAdd = () => {
    const ok = onAddTeam(newName, newColor, newPts);
    if (ok) setNewName('');
  };

  // ── Team detail view ──────────────────────────────────────
  if (teamsView !== 'list') {
    const team = getTeam(teamsView);
    if (!team) { setTeamsView('list'); return null; }
    const remaining = getTeamRemaining(team);
    const catA = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === 'A'; }).length;
    const catB = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === 'B'; }).length;
    const catC = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === 'C'; }).length;

    return (
      <>
        <button className="back-btn" onClick={() => setTeamsView('list')}>← Back to All Teams</button>
        <div className="team-detail-header" style={{ '--team-color': team.color }}>
          <div className="team-detail-color-bar" style={{ background: team.color }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: team.color, letterSpacing: 2, lineHeight: 1 }}>{team.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              {team.players.length} players · {team.pointsSpent} pts spent · {remaining} pts remaining
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Budget',      value: team.points,       color: 'var(--text)' },
            { label: 'Spent',       value: team.pointsSpent,  color: 'var(--cat-a)' },
            { label: 'Remaining',   value: remaining,          color: team.color },
            { label: 'Total Players', value: team.players.length, color: 'var(--cat-c)', warn: team.players.length < 10 ? 10 - team.players.length : null },
            { label: 'Cat A Players', value: `${catA} / 3`,   color: 'var(--cat-a)' },
            { label: 'Cat B Players', value: catB,             color: 'var(--cat-b)' },
            { label: 'Cat C Players', value: catC,             color: 'var(--cat-c)' },
            { label: 'RTM',         value: team.rtmUsed ? '✗ Used' : '✓ Avail', color: 'var(--text)' },
          ].map((s, i) => (
            <div className="card" key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: s.color }}>
                {s.value}
                {s.warn && <span className="warning-badge">⚠ Need {s.warn}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 12 }}>🏏 Player Roster</div>
        {team.players.length === 0 ? (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-state-icon">😶</div>
            <div className="empty-state-text">No players bought yet</div>
          </div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr><th>#</th><th>Player</th><th>Category</th><th>Base Price</th><th>Sold For</th></tr>
              </thead>
              <tbody>
                {team.players.map((pid, i) => {
                  const p = getPlayer(pid);
                  if (!p) return null;
                  return (
                    <tr key={pid}>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td><span className={`category-chip ${p.category}`} style={{ padding: '2px 8px', fontSize: 11 }}>{p.category}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{p.basePrice}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontWeight: 700 }}>{p.soldPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  // ── Teams list view ───────────────────────────────────────
  return (
    <>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">➕ Add New Team</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <div className="form-label" style={{ marginBottom: 4 }}>Team Name</div>
            <input className="form-input" placeholder="e.g. Thunder Bolts" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="form-label" style={{ marginBottom: 4 }}>Team Color</div>
            <select className="form-input" value={newColor} onChange={(e) => setNewColor(e.target.value)}>
              {TEAM_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="form-label" style={{ marginBottom: 4 }}>Starting Points</div>
            <input type="number" className="form-input" value={newPts} min={100} max={5000} onChange={(e) => setNewPts(parseInt(e.target.value) || 1000)} />
          </div>
          <button className="btn-primary" onClick={handleAdd} style={{ flex: 'none', width: 'auto', padding: '10px 20px', whiteSpace: 'nowrap' }}>+ Add Team</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {state.teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏟</div>
            <div className="empty-state-text">No teams yet. Add one above!</div>
          </div>
        ) : state.teams.map((t) => {
          const remaining = getTeamRemaining(t);
          const pct = Math.max(0, Math.round((remaining / t.points) * 100));
          return (
            <div key={t.id} className="team-card" style={{ '--team-color': t.color }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="team-name" style={{ color: t.color, marginBottom: 0 }}>{t.name}</div>
                <button onClick={() => onDeleteTeam(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}>🗑</button>
              </div>
              <div className="team-stats" style={{ marginBottom: 12 }}>
                <div><div className="stat-label">Budget</div><div className="stat-value" style={{ fontSize: 16 }}>{t.points}</div></div>
                <div><div className="stat-label">Remaining</div><div className="stat-value" style={{ fontSize: 16, color: t.color }}>{remaining}</div></div>
                <div><div className="stat-label">Spent</div><div className="stat-value" style={{ fontSize: 16 }}>{t.pointsSpent}</div></div>
                <div><div className="stat-label">Players</div><div className="stat-value" style={{ fontSize: 16, color: 'var(--cat-c)' }}>{t.players.length}</div></div>
              </div>
              <div className="points-bar-wrap" style={{ marginBottom: 12 }}>
                <div className="points-bar" style={{ width: `${pct}%`, background: t.color }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setTeamsView(t.id)} style={{ flex: 1, padding: '9px 0', background: t.color + '22', border: `1px solid ${t.color}66`, color: t.color, borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  👁 View Players ({t.players.length})
                </button>
                <div style={{ padding: '9px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                  RTM: {t.rtmUsed ? '✗' : '✓'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
