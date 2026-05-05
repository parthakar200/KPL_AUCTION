


import { useState } from 'react';
import { QUEUE_TABS } from '../constants/data';
import { getRoleInfo } from '../utils/helpers';

function BiddingDisplay({ isAdmin,
  player, amount, leadTeam, leadingTeamId, teams,
  getTeamRemaining, getTeamCatACount, players,
  onPlaceBid, onIncrementBid, onConfirmSoldFromSelect, onMarkUnsold,
  onUseRTM, onUseWildcard, soldToTeamId, setSoldToTeamId,
}) {
  const ri = getRoleInfo(player.role);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span className={`category-chip ${player.category}`} style={{ fontSize: 12 }}>
          {player.category} — {player.category === 'A' ? '⭐ Star' : player.category === 'B' ? '👍 Good' : '✅ Regular'}
        </span>
        <span style={{ background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
          {ri.icon} {ri.label}
        </span>
      </div>
      <div className="auction-player-name" style={{ fontSize: 40 }}>{player.name}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
        Base Price: <strong style={{ color: 'var(--text)' }}>{player.basePrice} pts</strong>
      </div>

      {/* Step 1 — visible to all, increment buttons only for admin */}
      <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Current Bid Amount</div>
        <div className="bid-amount" style={{ fontSize: 48, marginBottom: 4 }}>{amount} <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>pts</span></div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 12 }}>
          {leadTeam ? <>🔥 Leader: <strong style={{ color: leadTeam.color }}>{leadTeam.name}</strong></> : '⏳ No bid yet'}
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[5, 10, 25, 50].map((n) => <button key={n} className="inc-btn" onClick={() => onIncrementBid(n)}>+{n}</button>)}
          </div>
        )}
      </div>

      {/* Step 2 — admin clicks to bid, viewers just see who is leading */}
      {isAdmin && <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Step 2 — Which Team is Bidding?</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(teams.length, 2)}, minmax(0,1fr))`, gap: 8 }}>
          {teams.map((t) => {
            const rem       = getTeamRemaining(t);
            const catAFull  = getTeamCatACount(t, players) >= 3 && player.category === 'A';
            const cannotBid = rem < amount || catAFull;
            const isLeading = t.id === leadingTeamId;
            const reason    = catAFull ? 'Cat-A full' : 'Low points';
            return (
              <button key={t.id} onClick={() => !cannotBid && onPlaceBid(t.id)} title={cannotBid ? reason : 'Bid for ' + t.name}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '10px 8px', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: cannotBid ? 'not-allowed' : 'pointer', border: `2px solid ${isLeading ? t.color : 'var(--border)'}`, background: isLeading ? t.color + '25' : 'var(--bg-card2)', color: cannotBid ? 'var(--text-muted)' : isLeading ? t.color : 'var(--text)', opacity: cannotBid ? 0.4 : 1, transition: 'all 0.15s', boxShadow: isLeading ? `0 0 0 2px ${t.color}44` : 'none' }}>
                <span style={{ fontSize: 18 }}>{isLeading ? '★' : '🏏'}</span>
                <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.2 }}>{t.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: cannotBid ? 'var(--cat-a)' : 'var(--text-muted)' }}>{cannotBid ? reason : rem + ' pts'}</span>
                {isLeading && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: t.color }}>LEADING</span>}
              </button>
            );
          })}
        </div>
      </div>}

      {/* Step 3 — admin only */}
      {isAdmin && (
      <div style={{ background: '#22c55e12', border: '2px solid #22c55e44', borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--cat-c)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Step 3 — Confirm Sale</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Choose which team gets this player:</div>
        <select className="form-input" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }} value={soldToTeamId} onChange={(e) => setSoldToTeamId(e.target.value)}>
          <option value="">— Select Team to Sell To —</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}  —  {getTeamRemaining(t)} pts left</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onConfirmSoldFromSelect} style={{ flex: 2, background: '#22c55e', color: '#fff', padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--font-body)', cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(34,197,94,0.3)', transition: 'all 0.15s' }}>✓ SOLD — Assign Player</button>
          <button onClick={onMarkUnsold} style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: 12, borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>✗ Unsold</button>
        </div>
      </div>
      )}

      {/* Special actions — admin only */}
      {isAdmin && (
      <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 8 }}>Special Actions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {teams.map((t) => (
            <button key={t.id} className="rtm-btn" disabled={t.rtmUsed} onClick={() => onUseRTM(t.id)} style={{ fontSize: 11, padding: '6px 10px' }}>
              ⚡ {t.name.split(' ')[0]} RTM{t.rtmUsed ? ' ✗' : ''}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {teams.map((t) => (
            <button key={t.id} className="wildcard-btn" onClick={() => onUseWildcard(t.id)} style={{ fontSize: 11, padding: '6px 10px' }}>
              🃏 {t.name.split(' ')[0]} WC (50)
            </button>
          ))}
        </div>
      </div>
      )}
    </>
  );
}

export default function AuctionPage({ isAdmin,
  state, getTeam, getPlayer, getTeamRemaining, getTeamCatACount,
  onStartBidding, onReAuction, onPlaceBid, onIncrementBid,
  onConfirmSoldFromSelect, onMarkUnsold, onUseRTM, onUseWildcard,
  onAddPlayer, onSwitchTab, soldToTeamId, setSoldToTeamId,
}) {
  const [newName,  setNewName]  = useState('');
  const [newCat,   setNewCat]   = useState('C');
  const [newRole,  setNewRole]  = useState('BAT');
  const [newPrice, setNewPrice] = useState(50);

  const handleAddPlayer = () => {
    const ok = onAddPlayer(newName, newCat, newRole, newPrice);
    if (ok) { setNewName(''); setNewPrice(50); }
  };

  const { playerId, amount, leadingTeamId } = state.currentBid;
  const currentPlayer = playerId ? getPlayer(playerId) : null;
  const leadTeam      = leadingTeamId ? getTeam(leadingTeamId) : null;

  const getTabCount = (key) => {
    if (key === 'UNSOLD') return state.players.filter((p) => p.status === 'unsold').length;
    return state.queue.filter((id) => {
      const p = getPlayer(id);
      return p && p.status === 'pending' && (p.role || 'BAT') === key;
    }).length;
  };

  let queuePlayers = [];
  if (state.activeQueueTab === 'UNSOLD') {
    queuePlayers = state.players.filter((p) => p.status === 'unsold');
  } else {
    queuePlayers = state.queue.map(getPlayer).filter((p) => p && p.status === 'pending' && (p.role || 'BAT') === state.activeQueueTab);
  }

  const tab = QUEUE_TABS.find((t) => t.key === state.activeQueueTab) || QUEUE_TABS[0];

  return (
    <div className="auction-layout">
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
        <div className="auction-stage">
          <div className="auction-stage-header">
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)' }}>⚡ On the Block</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {playerId ? <><span className="status-dot live" /> LIVE</> : 'Select a player to start'}
            </span>
          </div>
          <div className="auction-player-display">
            {!currentPlayer ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏏</div>
                <div className="empty-state-text">Pick a role tab on the right → click a player to start bidding</div>
              </div>
            ) : (
              <BiddingDisplay
                player={currentPlayer} amount={amount} leadTeam={leadTeam} leadingTeamId={leadingTeamId}
                teams={state.teams} getTeamRemaining={getTeamRemaining} getTeamCatACount={getTeamCatACount}
                players={state.players} onPlaceBid={onPlaceBid} onIncrementBid={onIncrementBid}
                onConfirmSoldFromSelect={onConfirmSoldFromSelect} onMarkUnsold={onMarkUnsold}
                onUseRTM={onUseRTM} onUseWildcard={onUseWildcard} isAdmin={isAdmin}
                soldToTeamId={soldToTeamId} setSoldToTeamId={setSoldToTeamId}
              />
            )}
          </div>
        </div>

        {/* Recent results */}
        {state.recentResults && state.recentResults.length > 0 && (
          <div className="card">
            <div className="card-title">🕐 Recent Decisions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {state.recentResults.map((r, i) => {
                const p    = getPlayer(r.playerId);
                const team = r.teamId ? getTeam(r.teamId) : null;
                if (!p) return null;
                const ri     = getRoleInfo(p.role || 'BAT');
                const isSold = r.status === 'sold';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: isSold ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${isSold ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 16 }}>{isSold ? '✅' : '❌'}</span>
                    <span style={{ fontSize: 13 }}>{ri.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{p.name}</span>
                    <span className={`category-chip ${p.category}`} style={{ fontSize: 9, padding: '1px 5px' }}>{p.category}</span>
                    {isSold && team ? (
                      <>
                        <span style={{ fontSize: 12, fontWeight: 700, color: team.color }}>{team.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>{r.amount} pts</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--cat-a)', fontWeight: 700 }}>UNSOLD</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="auction-sidebar-panel">
        {/* Add player form - admin only */}
        {isAdmin && (
        <div className="card add-player-form">
          <div className="card-title">Add Player to Queue</div>
          <div className="form-row">
            <label className="form-label">Player Name</label>
            <input className="form-input" placeholder="e.g. Ravi Kumar" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
            <div className="form-row">
              <label className="form-label">Category</label>
              <select className="form-input" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
                <option value="A">A — Star</option>
                <option value="B">B — Good</option>
                <option value="C">C — Regular</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Role</label>
              <select className="form-input" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="BAT">🏏 Batsman</option>
                <option value="BWL">🎯 Bowler</option>
                <option value="AR">⚡ All-Rounder</option>
                <option value="WK">🧤 Keeper</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Base Price (pts)</label>
            <input type="number" className="form-input" value={newPrice} min={10} max={500} onChange={(e) => setNewPrice(parseInt(e.target.value) || 50)} />
          </div>
          <button className="btn-primary" onClick={handleAddPlayer}>+ Add to Queue</button>
        </div>
        )}

        {/* Tabbed queue */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {QUEUE_TABS.map((t) => {
              const count    = getTabCount(t.key);
              const isActive = state.activeQueueTab === t.key;
              return (
                <button key={t.key} onClick={() => onSwitchTab(t.key)}
                  style={{ flex: 'none', padding: '10px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-body)', border: 'none', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', background: isActive ? 'var(--bg-card2)' : 'transparent', color: isActive ? t.color : 'var(--text-muted)', borderBottom: `2px solid ${isActive ? t.color : 'transparent'}`, letterSpacing: 0.5 }}>
                  {t.label}{' '}
                  <span style={{ background: isActive ? t.color + '22' : 'var(--border)', color: isActive ? t.color : 'var(--text-muted)', padding: '1px 5px', borderRadius: 10, fontSize: 10, marginLeft: 2 }}>{count}</span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8, color: tab.color }}>
              {tab.label} — {queuePlayers.length} player{queuePlayers.length !== 1 ? 's' : ''}
            </div>
            <div className="player-queue">
              {queuePlayers.length === 0 ? (
                <div className="empty-state" style={{ padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{state.activeQueueTab === 'UNSOLD' ? '✅' : '🎉'}</div>
                  <div className="empty-state-text" style={{ fontSize: 12 }}>
                    {state.activeQueueTab === 'UNSOLD' ? 'No unsold players' : `All ${tab.label} auctioned!`}
                  </div>
                </div>
              ) : queuePlayers.map((p) => {
                const ri           = getRoleInfo(p.role || 'BAT');
                const isActive     = state.currentBid.playerId === p.id;
                const canReauction = state.activeQueueTab === 'UNSOLD';
                return (
                  <div key={p.id} className={`queue-item${isActive ? ' auctioning' : ''}`}
                    style={{ borderLeft: isActive ? `3px solid ${ri.color}` : '3px solid transparent', background: isActive ? ri.bg : undefined, cursor: isAdmin ? 'pointer' : 'default' }}
                    onClick={() => isAdmin && (canReauction ? onReAuction(p.id) : onStartBidding(p.id))}>
                    <span className={`cat-dot ${p.category}`} />
                    <span className="queue-item-name" style={{ fontSize: 13 }}>{p.name}</span>
                    <span className={`category-chip ${p.category}`} style={{ fontSize: 9, padding: '1px 5px' }}>{p.category}</span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 4 }}>{p.basePrice}pts</span>
                    {isActive    && <span style={{ fontSize: 9, color: ri.color, fontWeight: 800, marginLeft: 4 }}>▶ LIVE</span>}
                    {canReauction && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginLeft: 4 }}>↩ Re-Bid</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

