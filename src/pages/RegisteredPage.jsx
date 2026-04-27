import { useState } from 'react';
import { ROLE_INFO } from '../constants/data';

export default function RegisteredPage({ players, onAdd, onRemove, onEdit, onSendToAuction }) {
  const [name,      setName]      = useState('');
  const [role,      setRole]      = useState('BAT');
  const [category,  setCategory]  = useState('C');
  const [basePrice, setBasePrice] = useState(50);
  const [phone,     setPhone]     = useState('');
  const [searchQ,   setSearchQ]   = useState('');
  const [filterRole,setFilterRole]= useState('ALL');
  const [filterCat, setFilterCat] = useState('ALL');
  const [sortBy,    setSortBy]    = useState('name');

  const handleAdd = () => {
    const ok = onAdd(name, role, category, basePrice, phone);
    if (ok) { setName(''); setPhone(''); setBasePrice(50); }
  };

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
      if (sortBy === 'date')       return b.id.localeCompare(a.id);
      return a.name.localeCompare(b.name);
    });

  const roleColors = { BAT: '#f59e0b', BWL: '#3b82f6', AR: '#a855f7', WK: '#22c55e' };
  const roleLabels = { BAT: '🏏 Batsman', BWL: '🎯 Bowler', AR: '⚡ All-Rounder', WK: '🧤 Keeper' };

  const total   = players.length;
  const byRole  = ['BAT','BWL','AR','WK'].map(r => ({ r, count: players.filter(p => p.role === r).length }));
  const sentCnt = players.filter(p => p.addedToAuction).length;

  return (
    <>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Total Registered</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 600, color: 'var(--accent)' }}>{total}</div>
        </div>
        {byRole.map(({ r, count }) => (
          <div className="card" key={r} style={{ textAlign: 'center' }}>
            <div className="stat-label">{roleLabels[r]}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: roleColors[r] }}>{count}</div>
          </div>
        ))}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Sent to Auction</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: 'var(--cat-c)' }}>{sentCnt}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: Add form */}
        <div className="card" style={{ position: 'sticky', top: 0 }}>
          <div className="card-title">📝 Register New Player</div>
          <div className="form-row">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Ravi Kumar" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          </div>
          <div className="form-row">
            <label className="form-label">Phone / WhatsApp</label>
            <input className="form-input" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-row">
              <label className="form-label">Role *</label>
              <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="BAT">🏏 Batsman</option>
                <option value="BWL">🎯 Bowler</option>
                <option value="AR">⚡ All-Rounder</option>
                <option value="WK">🧤 Keeper</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Category *</label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="A">A — Star</option>
                <option value="B">B — Good</option>
                <option value="C">C — Regular</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Base Price (pts) *</label>
            <input type="number" className="form-input" value={basePrice} min={10} max={500} onChange={e => setBasePrice(parseInt(e.target.value) || 50)} />
          </div>
          <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8 }}>
            <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>Category Guide</div>
            <div><span style={{ color: 'var(--cat-a)', fontWeight: 700 }}>A — Star</span> · Base ≥ 100 pts</div>
            <div><span style={{ color: 'var(--cat-b)', fontWeight: 700 }}>B — Good</span> · Base 50–99 pts</div>
            <div><span style={{ color: 'var(--cat-c)', fontWeight: 700 }}>C — Regular</span> · Base 10–49 pts</div>
          </div>
          <button className="btn-primary" onClick={handleAdd} style={{ marginBottom: 8 }}>✚ Register Player</button>
        </div>

        {/* Right: Player list */}
        <div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
            <input className="search-input" placeholder="🔍  Search name..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
            <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', padding: '9px 12px' }}>
              <option value="name">Sort: Name A–Z</option>
              <option value="price_desc">Sort: Price ↓ High</option>
              <option value="price_asc">Sort: Price ↑ Low</option>
              <option value="date">Sort: Latest First</option>
            </select>
          </div>

          {/* Role filter tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {[['ALL','All Roles','var(--accent)'],['BAT','🏏 Batsmen','#f59e0b'],['BWL','🎯 Bowlers','#3b82f6'],['AR','⚡ All-Rounders','#a855f7'],['WK','🧤 Keepers','#22c55e']].map(([key, label, col]) => (
              <button key={key} onClick={() => setFilterRole(key)}
                style={{ padding: '7px 14px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, border: `1px solid ${filterRole === key ? col : 'var(--border)'}`, background: filterRole === key ? col + '22' : 'var(--bg-card)', color: filterRole === key ? col : 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>({key === 'ALL' ? players.length : players.filter(p => p.role === key).length})</span>
              </button>
            ))}
          </div>

          {/* Category filter tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[['ALL','All Categories','var(--accent)'],['A','⭐ Cat A','var(--cat-a)'],['B','👍 Cat B','var(--cat-b)'],['C','✅ Cat C','var(--cat-c)']].map(([key, label, col]) => (
              <button key={key} onClick={() => setFilterCat(key)}
                style={{ padding: '6px 12px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, border: `1px solid ${filterCat === key ? col : 'var(--border)'}`, background: filterCat === key ? col + '22' : 'var(--bg-card)', color: filterCat === key ? col : 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
            Showing <span style={{ color: 'var(--accent)' }}>{filtered.length}</span> of {players.length} players
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">
                {players.length === 0 ? 'No players registered yet. Add one on the left!' : 'No players match your filters.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((p, i) => {
                const ri = ROLE_INFO[p.role] || ROLE_INFO.BAT;
                return (
                  <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: `4px solid ${ri.color}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', minWidth: 22, textAlign: 'right' }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {p.name}
                        {p.addedToAuction && <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.15)', color: 'var(--cat-c)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>⚡ In Auction</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{ri.icon} {ri.label}</span>
                        <span className={`category-chip ${p.category}`} style={{ fontSize: 10, padding: '1px 7px' }}>{p.category}</span>
                        {p.phone && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>📱 {p.phone}</span>}
                        {p.registeredAt && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🗓 {p.registeredAt}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 60 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Base</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{p.basePrice}<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>pts</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => onSendToAuction(p.id)} title={p.addedToAuction ? 'Already in queue' : 'Send to Auction'}
                        style={{ background: p.addedToAuction ? 'var(--bg-card2)' : 'rgba(34,197,94,0.1)', border: `1px solid ${p.addedToAuction ? 'var(--border)' : 'rgba(34,197,94,0.4)'}`, color: p.addedToAuction ? 'var(--text-muted)' : 'var(--cat-c)', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: p.addedToAuction ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                        {p.addedToAuction ? '✓ Sent' : '⚡ Send'}
                      </button>
                      <button onClick={() => onEdit(p)} style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✏️</button>
                      <button onClick={() => onRemove(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--cat-a)', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
