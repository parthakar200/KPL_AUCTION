import { useState } from 'react';
import { ROLE_INFO } from '../constants/data';

// ── Inline edit panel shown per-player ──────────────────────
function AssignPanel({ player, onSave, onClose }) {
  const [category,  setCategory]  = useState(player.category  || 'C');
  const [basePrice, setBasePrice] = useState(player.basePrice || 50);
  const [role,      setRole]      = useState(player.role      || 'BAT');

  return (
    <div style={{ marginTop: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 12 }}>
        👑 Admin — Assign Details for <span style={{ color: 'var(--accent)' }}>{player.name}</span>
      </div>

      {/* Role */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 6 }}>Role</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {[
            { key: 'BAT', icon: '🏏', label: 'Bat',   color: '#f59e0b' },
            { key: 'BWL', icon: '⚾', label: 'Bowl',  color: '#3b82f6' },
            { key: 'AR',  icon: '⚡', label: 'AR',    color: '#a855f7' },
            { key: 'WK',  icon: '🧤', label: 'WK',    color: '#22c55e' },
          ].map((r) => (
            <button key={r.key} onClick={() => setRole(r.key)}
              style={{ padding: '8px 4px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, border: `2px solid ${role === r.key ? r.color : 'var(--border)'}`, background: role === r.key ? r.color + '20' : 'transparent', color: role === r.key ? r.color : 'var(--text-dim)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 6 }}>Category</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {[
            { key: 'A', label: '⭐ A — Premium',    color: 'var(--cat-a)', hint: '≥ 100 pts' },
            { key: 'B', label: '👌 B — Pro',    color: 'var(--cat-b)', hint: '50–99 pts' },
            { key: 'C', label: '👍 C — Good', color: 'var(--cat-c)', hint: '10–49 pts' },
          ].map((c) => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              style={{ padding: '8px 6px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, border: `2px solid ${category === c.key ? c.color : 'var(--border)'}`, background: category === c.key ? c.color + '18' : 'transparent', color: category === c.key ? c.color : 'var(--text-dim)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span>{c.label}</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>{c.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Base Price */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 6 }}>Base Price (pts)</label>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="number" className="form-input" value={basePrice} min={10} max={500}
            onChange={(e) => setBasePrice(parseInt(e.target.value) || 10)}
            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[50, 75, 100, 150].map((v) => (
              <button key={v} onClick={() => setBasePrice(v)}
                style={{ padding: '6px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: '1px solid var(--border)', background: basePrice === v ? 'var(--accent-glow)' : 'var(--bg-card)', color: basePrice === v ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSave({ category, basePrice, role })}
          style={{ flex: 2, padding: '10px 0', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          ✓ Save Details
        </button>
        <button onClick={onClose}
          style={{ flex: 1, padding: '10px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function RegisteredPage({ players, onRemove, onEdit, onSendToAuction }) {
  const [searchQ,    setSearchQ]    = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterCat,  setFilterCat]  = useState('ALL');
  const [sortBy,     setSortBy]     = useState('date');
  const [editingId,  setEditingId]  = useState(null); // player id whose panel is open

  const roleColors = { BAT: '#f59e0b', BWL: '#3b82f6', AR: '#a855f7', WK: '#22c55e' };
  const roleLabels = { BAT: '🏏 Batsmen', BWL: '⚾ Bowlers', AR: '⚡ All-Rounders', WK: '🧤 Keepers' };

  const filtered = players
    .filter((p) => {
      const mName = p.name.toLowerCase().includes(searchQ.toLowerCase());
      const mRole = filterRole === 'ALL' || p.role === filterRole;
      const mCat  = filterCat  === 'ALL' || p.category === filterCat;
      return mName && mRole && mCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc')  return a.basePrice - b.basePrice;
      if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return b.id.localeCompare(a.id); // date (latest first)
    });

  const total   = players.length;
  const sentCnt = players.filter((p) => p.addedToAuction).length;
  const pendingAssign = players.filter((p) => !p.addedToAuction && p.basePrice === 50 && p.category === 'C').length;

  const handleSaveEdit = (player, updates) => {
    onEdit({ ...player, ...updates });
    setEditingId(null);
  };

  return (
    <>
      {/* ── Summary strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Total Registered</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 600, color: 'var(--accent)' }}>{total}</div>
        </div>
        {['BAT','BWL','AR','WK'].map((r) => (
          <div className="card" key={r} style={{ textAlign: 'center' }}>
            <div className="stat-label">{roleLabels[r]}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: roleColors[r] }}>
              {players.filter((p) => p.role === r).length}
            </div>
          </div>
        ))}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Sent to Auction</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: 'var(--cat-c)' }}>{sentCnt}</div>
        </div>
      </div>

      {/* ── Pending assignment notice ── */}
      {pendingAssign > 0 && (
        <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f97316' }}>{pendingAssign} player{pendingAssign > 1 ? 's' : ''} need category &amp; price assigned</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Click the ✏️ edit button on each player card to assign before sending to auction.</div>
          </div>
        </div>
      )}

      {/* ── Info box — how players register ── */}
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.7 }}>
          Players self-register by clicking <strong style={{ color: 'var(--accent)' }}>the button in the sidebar</strong> and entering their name, phone &amp; role.
          As admin, assign their <strong>Category</strong> and <strong>Base Price</strong> here, then click <strong>⚡ Send to Auction</strong>.
        </div>
      </div>

      {/* ── Search / Sort / Filters ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        <input className="search-input" placeholder="🔍  Search name…" value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
        <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto', padding: '9px 12px' }}>
          <option value="date">Sort: Latest First</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="price_desc">Sort: Price ↓</option>
          <option value="price_asc">Sort: Price ↑</option>
        </select>
      </div>

      {/* Role filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {[['ALL','All Roles','var(--accent)'],['BAT','🏏 Bat','#f59e0b'],['BWL','⚾ Bowl','#3b82f6'],['AR','⚡ AR','#a855f7'],['WK','🧤 WK','#22c55e']].map(([key, label, col]) => (
          <button key={key} onClick={() => setFilterRole(key)}
            style={{ padding: '6px 12px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, border: `1px solid ${filterRole === key ? col : 'var(--border)'}`, background: filterRole === key ? col + '22' : 'var(--bg-card)', color: filterRole === key ? col : 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.15s' }}>
            {label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>({key === 'ALL' ? players.length : players.filter((p) => p.role === key).length})</span>
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {[['ALL','All Categories','var(--accent)'],['A','⭐ Premium','var(--cat-a)'],['B','👌 Pro','var(--cat-b)'],['C','👍 Good','var(--cat-c)']].map(([key, label, col]) => (
          <button key={key} onClick={() => setFilterCat(key)}
            style={{ padding: '5px 11px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, border: `1px solid ${filterCat === key ? col : 'var(--border)'}`, background: filterCat === key ? col + '22' : 'var(--bg-card)', color: filterCat === key ? col : 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
        Showing <span style={{ color: 'var(--accent)' }}>{filtered.length}</span> of {players.length} players
      </div>

      {/* ── Player list ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            {players.length === 0
              ? 'No players registered yet. Ask players to register using the sidebar button.'
              : 'No players match your filters.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((p, i) => {
            const ri         = ROLE_INFO[p.role] || ROLE_INFO.BAT;
            const isEditing  = editingId === p.id;
            const needsSetup = !p.addedToAuction && p.basePrice === 50 && p.category === 'C';

            return (
              <div key={p.id} style={{ background: 'var(--bg-card)', border: `1px solid ${needsSetup ? 'rgba(249,115,22,0.35)' : 'var(--border)'}`, borderLeft: `4px solid ${ri.color}`, borderRadius: 12, padding: '12px 16px', transition: 'all 0.2s' }}>

                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Index */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', minWidth: 22, textAlign: 'right' }}>{i + 1}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {p.name}
                      {p.addedToAuction && (
                        <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.15)', color: 'var(--cat-c)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>⚡ In Auction</span>
                      )}
                      {needsSetup && (
                        <span style={{ fontSize: 10, background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>⚠️ Needs Setup</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{ri.icon} {ri.label}</span>
                      <span className={`category-chip ${p.category}`} style={{ fontSize: 10, padding: '1px 7px' }}>{p.category}</span>
                      {p.phone && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>📱 {p.phone}</span>}
                      {p.registeredAt && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🗓 {p.registeredAt}</span>}
                    </div>
                  </div>

                  {/* Base price badge */}
                  <div style={{ textAlign: 'center', minWidth: 58 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Base</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>
                      {p.basePrice}<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>pts</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {/* Send to auction */}
                    <button
                      onClick={() => !p.addedToAuction && onSendToAuction(p.id)}
                      disabled={p.addedToAuction}
                      title={p.addedToAuction ? 'Already in auction queue' : 'Send to Auction queue'}
                      style={{ background: p.addedToAuction ? 'var(--bg-card2)' : 'rgba(34,197,94,0.12)', border: `1px solid ${p.addedToAuction ? 'var(--border)' : 'rgba(34,197,94,0.4)'}`, color: p.addedToAuction ? 'var(--text-muted)' : '#22c55e', padding: '7px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: p.addedToAuction ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                      {p.addedToAuction ? '✓ Sent' : '⚡ Send'}
                    </button>

                    {/* Edit / assign */}
                    <button
                      onClick={() => setEditingId(isEditing ? null : p.id)}
                      title="Assign category & base price"
                      style={{ background: isEditing ? 'var(--accent-glow)' : 'var(--bg-card2)', border: `1px solid ${isEditing ? 'var(--accent)' : 'var(--border)'}`, color: isEditing ? 'var(--accent)' : 'var(--text-muted)', padding: '7px 10px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      ✏️
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onRemove(p.id)}
                      title="Remove player"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--cat-a)', padding: '7px 10px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      🗑
                    </button>
                  </div>
                </div>

                {/* Inline assign panel */}
                {isEditing && (
                  <AssignPanel
                    player={p}
                    onSave={(updates) => handleSaveEdit(p, updates)}
                    onClose={() => setEditingId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
