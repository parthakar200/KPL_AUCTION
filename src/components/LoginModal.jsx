import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/auctionApi';

export default function LoginModal({ onClose, onPlayerRegistered }) {
  const { login } = useAuth();

  // ── Tab ───────────────────────────────────────────────────
  const [tab, setTab] = useState('register'); // 'register' | 'admin'

  // ── Admin login ───────────────────────────────────────────
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // ── Player registration ───────────────────────────────────
  const [pName,    setPName]    = useState('');
  const [pPhone,   setPPhone]   = useState('');
  const [pRole,    setPRole]    = useState('BAT');
  const [regState, setRegState] = useState('idle'); // idle | loading | success
  const [regErr,   setRegErr]   = useState('');

  // ── Handlers ──────────────────────────────────────────────
  const handleLogin = () => {
    const ok = login(password);
    if (ok) { onClose(); }
    else    { setLoginErr('Wrong password. Try again.'); setPassword(''); }
  };

  const handleRegister = async () => {
    if (!pName.trim())  { setRegErr('Please enter your name.');         return; }
    if (!pPhone.trim()) { setRegErr('Please enter your phone number.'); return; }
    setRegErr('');
    setRegState('loading');
    try {
      await api.addRegistered({
        name:      pName.trim(),
        phone:     pPhone.trim(),
        role:      pRole,
        category:  'C',   // admin will change this
        basePrice: 50,    // admin will change this
      });
      setRegState('success');
      if (onPlayerRegistered) onPlayerRegistered();
    } catch (e) {
      setRegErr(e.message || 'Registration failed. Try again.');
      setRegState('idle');
    }
  };

  const handleRegisterAnother = () => {
    setPName(''); setPPhone(''); setPRole('BAT');
    setRegState('idle'); setRegErr('');
  };

  // ── Styles ────────────────────────────────────────────────
  const tabStyle = (key) => ({
    flex: 1, padding: '13px 0', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
    background: tab === key ? 'var(--bg-card)' : 'var(--bg-card2)',
    color: tab === key
      ? (key === 'admin' ? '#f97316' : '#22c55e')
      : 'var(--text-muted)',
    borderBottom: `2px solid ${tab === key
      ? (key === 'admin' ? '#f97316' : '#22c55e')
      : 'transparent'}`,
    transition: 'all 0.15s',
  });

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:18, width:'100%', maxWidth:380, boxShadow:'0 24px 64px rgba(0,0,0,0.6)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ textAlign:'center', padding:'22px 24px 0' }}>
          <div style={{ fontSize:34, marginBottom:2 }}>🏏</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:19, fontWeight:800, letterSpacing:1 }}>KPL AUCTION</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:14 }}>Kudei Premier League</div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
          <button style={tabStyle('register')} onClick={() => setTab('register')}>📝 Player Registration</button>
          <button style={tabStyle('admin')}    onClick={() => setTab('admin')}>🔐 Admin Login</button>
        </div>

        {/* ── REGISTER TAB ── */}
        {tab === 'register' && (
          <div style={{ padding:24 }}>
            {regState === 'success' ? (
              /* Success screen */
              <div style={{ textAlign:'center', padding:'8px 0' }}>
                <div style={{ fontSize:52, marginBottom:10 }}>🎉</div>
                <div style={{ fontWeight:800, fontSize:18, color:'#22c55e', marginBottom:8 }}>You're Registered!</div>
                <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:22 }}>
                  <strong style={{ color:'var(--text)' }}>{pName}</strong> has been added to the player list.
                  The admin will assign your category &amp; base price before the auction.
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={handleRegisterAnother}
                    style={{ flex:1, padding:'10px 0', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', color:'#22c55e', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                    + Register Another
                  </button>
                  <button onClick={onClose}
                    style={{ flex:1, padding:'10px 0', background:'var(--bg-card2)', border:'1px solid var(--border)', color:'var(--text-muted)', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Registration form */
              <>
                <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:16, lineHeight:1.6 }}>
                  Enter your details below. The admin will set your base price and category.
                </p>

                {/* Name */}
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:4 }}>Full Name *</label>
                  <input className="form-input" placeholder="e.g. Ravi Kumar"
                    value={pName} onChange={(e) => { setPName(e.target.value); setRegErr(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    style={{ width:'100%', boxSizing:'border-box' }} autoFocus />
                </div>

                {/* Phone */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:4 }}>Phone / WhatsApp *</label>
                  <input className="form-input" placeholder="+91 98765 43210"
                    value={pPhone} onChange={(e) => { setPPhone(e.target.value); setRegErr(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    style={{ width:'100%', boxSizing:'border-box' }} />
                </div>

                {/* Role picker */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:8 }}>Your Role *</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[
                      { key:'BAT', icon:'🏏', label:'Batsman',      color:'#f59e0b' },
                      { key:'BWL', icon:'🎯', label:'Bowler',        color:'#3b82f6' },
                      { key:'AR',  icon:'⚡', label:'All-Rounder',   color:'#a855f7' },
                      { key:'WK',  icon:'🧤', label:'Wicket Keeper', color:'#22c55e' },
                    ].map((r) => (
                      <button key={r.key} onClick={() => setPRole(r.key)}
                        style={{ padding:'10px 6px', borderRadius:10, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:700, fontSize:12, border:`2px solid ${pRole === r.key ? r.color : 'var(--border)'}`, background: pRole === r.key ? r.color + '20' : 'var(--bg-card2)', color: pRole === r.key ? r.color : 'var(--text-dim)', transition:'all 0.15s', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:22 }}>{r.icon}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {regErr && (
                  <div style={{ color:'#ef4444', fontSize:12, marginBottom:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                    {regErr}
                  </div>
                )}

                <button onClick={handleRegister} disabled={regState === 'loading'}
                  style={{ width:'100%', padding:'12px 0', background: regState === 'loading' ? 'var(--bg-card2)' : 'linear-gradient(135deg,#22c55e,#16a34a)', color:'#fff', border:'none', borderRadius:10, fontWeight:800, fontSize:14, cursor: regState === 'loading' ? 'not-allowed' : 'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 14px rgba(34,197,94,0.3)', marginBottom:8 }}>
                  {regState === 'loading' ? '⏳ Registering…' : '✅ Register as Player'}
                </button>
                <button onClick={onClose}
                  style={{ width:'100%', padding:'9px 0', background:'transparent', border:'1px solid var(--border)', color:'var(--text-muted)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {/* ── ADMIN TAB ── */}
        {tab === 'admin' && (
          <div style={{ padding:24 }}>
            <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginBottom:18 }}>
              Enter the admin password to manage the auction.
            </p>

            <input type="password" className="form-input" placeholder="Enter admin password"
              value={password} onChange={(e) => { setPassword(e.target.value); setLoginErr(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{ marginBottom:8, width:'100%', boxSizing:'border-box' }}
              autoFocus={tab === 'admin'} />

            {loginErr && (
              <div style={{ color:'#ef4444', fontSize:12, marginBottom:10, textAlign:'center' }}>{loginErr}</div>
            )}

            <div style={{ display:'flex', gap:8, marginTop:6 }}>
              <button onClick={handleLogin}
                style={{ flex:2, background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', border:'none', borderRadius:8, padding:'11px 0', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 12px rgba(249,115,22,0.3)' }}>
                Login as Admin
              </button>
              <button onClick={onClose}
                style={{ flex:1, background:'var(--bg-card2)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:8, padding:'11px 0', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
