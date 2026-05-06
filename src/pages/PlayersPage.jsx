import { getRoleInfo } from '../utils/helpers';

export default function PlayersPage({
  isAdmin, state, getTeam,
  playerSearch, setPlayerSearch,
  playerFilter, setPlayerFilter,
  playerRoleFilter, setPlayerRoleFilter,
  onEdit, onRemove,
}) {
  const filtered = state.players.filter((p) => {
    const matchCat  = playerFilter === 'ALL' || p.category === playerFilter;
    const matchRole = playerRoleFilter === 'ALL' || (p.role || 'BAT') === playerRoleFilter;
    const matchName = p.name.toLowerCase().includes(playerSearch.toLowerCase());
    return matchCat && matchRole && matchName;
  });

  return (
    <>
      <div className="table-controls">
        <input
          className="search-input"
          placeholder="🔍  Search player..."
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
        />
        <div className="filter-btns">
          {['ALL', 'A', 'B', 'C'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${cat}${playerFilter === cat ? ' active' : ''}`}
              onClick={() => setPlayerFilter(cat)}
            >
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
        <div className="filter-btns">
          {[
            { key: 'ALL', label: 'All Roles' },
            { key: 'BAT', label: '🏏 Bat' },
            { key: 'BWL', label: '⚾ Bowl' },
            { key: 'AR',  label: '⚡ AR' },
            { key: 'WK',  label: '🧤 WK' },
          ].map((r) => (
            <button
              key={r.key}
              className={`filter-btn${playerRoleFilter === r.key ? ' active' : ''}`}
              onClick={() => setPlayerRoleFilter(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Player</th><th>Role</th><th>Cat</th>
              <th>Base</th><th>Sold</th><th>Team</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <div className="empty-state-text">No players found</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map((p, i) => {
              const team = p.teamId ? getTeam(p.teamId) : null;
              const ri = getRoleInfo(p.role || 'BAT');
              const statusColor = p.status === 'sold' ? 'var(--cat-c)' : p.status === 'unsold' ? 'var(--cat-a)' : 'var(--text-muted)';
              const statusIcon  = p.status === 'sold' ? '✅' : p.status === 'unsold' ? '❌' : '⏳';
              return (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {ri.icon} {ri.label}
                    </span>
                  </td>
                  <td><span className={`category-chip ${p.category}`} style={{ padding: '2px 8px', fontSize: 11 }}>{p.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p.basePrice}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>{p.soldPrice || '—'}</td>
                  <td>
                    {team
                      ? <span className="team-tag" style={{ background: team.color + '20', color: team.color, border: `1px solid ${team.color}40`, whiteSpace: 'nowrap' }}>{team.name}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td style={{ color: statusColor, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{statusIcon} {p.status}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {isAdmin && <>
                      <button onClick={() => onEdit(p.id)} style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '5px 10px', borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>✏️ Edit</button>
                      <button onClick={() => onRemove(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--cat-a)', padding: '5px 10px', borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>🗑 Remove</button>
                      </>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
