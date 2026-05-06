import { getRoleInfo } from '../utils/helpers';

// ── Player Avatar ─────────────────────────────────────────────
function PlayerAvatar({ photo, name, size = 38 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid var(--border)', background:'var(--bg-card2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: size * 0.38 }}>
      {photo
        ? <img src={photo} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        : <span style={{ userSelect:'none' }}>{name ? name.trim()[0].toUpperCase() : '?'}</span>
      }
    </div>
  );
}

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
      <style>{`
        @media (max-width: 640px) {
          .players-desktop-table { display: none !important; }
          .players-mobile-cards  { display: flex !important; }
        }
        @media (min-width: 641px) {
          .players-desktop-table { display: block !important; }
          .players-mobile-cards  { display: none !important; }
        }
      `}</style>

      <div className="table-controls">
        <input
          className="search-input"
          placeholder="🔍  Search player..."
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
        />
        <div className="filter-btns">
          {['ALL', 'A', 'B', 'C'].map((cat) => (
            <button key={cat} className={`filter-btn ${cat}${playerFilter === cat ? ' active' : ''}`} onClick={() => setPlayerFilter(cat)}>
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
            <button key={r.key} className={`filter-btn${playerRoleFilter === r.key ? ' active' : ''}`} onClick={() => setPlayerRoleFilter(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="players-desktop-table data-table">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Player</th><th>Role</th><th>Cat</th>
              <th>Base</th><th>Sold</th><th>Team</th><th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 8}>
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
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <PlayerAvatar photo={p.photo} name={p.name} size={36} />
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                    </div>
                  </td>
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
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => onEdit(p.id)} style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '5px 10px', borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>✏️ Edit</button>
                        <button onClick={() => onRemove(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--cat-a)', padding: '5px 10px', borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>🗑</button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="players-mobile-cards" style={{ flexDirection:'column', gap:10 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No players found</div>
          </div>
        ) : filtered.map((p, i) => {
          const team = p.teamId ? getTeam(p.teamId) : null;
          const ri = getRoleInfo(p.role || 'BAT');
          const statusColor = p.status === 'sold' ? 'var(--cat-c)' : p.status === 'unsold' ? 'var(--cat-a)' : 'var(--text-muted)';
          const statusIcon  = p.status === 'sold' ? '✅' : p.status === 'unsold' ? '❌' : '⏳';

          return (
            <div key={p.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`4px solid ${ri.color}`, borderRadius:12, padding:'12px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--text-muted)', minWidth:18 }}>{i+1}</div>
                <PlayerAvatar photo={p.photo} name={p.name} size={44} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ background:ri.bg, color:ri.color, border:`1px solid ${ri.border}`, padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:700 }}>{ri.icon} {ri.label}</span>
                    <span className={`category-chip ${p.category}`} style={{ fontSize:10, padding:'1px 7px' }}>{p.category}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1 }}>Base</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--gold)', fontSize:15 }}>{p.basePrice}pts</div>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                  {p.soldPrice && (
                    <div style={{ fontSize:11, color:'var(--gold)', fontFamily:'var(--font-mono)', fontWeight:700 }}>
                      Sold: {p.soldPrice}pts
                    </div>
                  )}
                  {team && (
                    <span className="team-tag" style={{ background: team.color + '20', color: team.color, border: `1px solid ${team.color}40`, fontSize:11 }}>{team.name}</span>
                  )}
                  <span style={{ fontSize:11, color:statusColor, fontWeight:700 }}>{statusIcon} {p.status}</span>
                </div>
                {isAdmin && (
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => onEdit(p.id)} style={{ background:'var(--accent-glow)', border:'1px solid var(--accent)', color:'var(--accent)', padding:'6px 12px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }}>✏️ Edit</button>
                    <button onClick={() => onRemove(p.id)} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'var(--cat-a)', padding:'6px 10px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
