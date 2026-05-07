
import { useState, useEffect, useCallback } from 'react';
import { CSS } from './constants/styles';
import { getTeamRemaining, getTeamCatACount, playSoldSound } from './utils/helpers';
import { useToast } from './hooks/useToast';
import * as api from './api/auctionApi';
import { AuthProvider, useAuth } from './context/AuthContext';

import Confetti        from './components/Confetti';
import ToastContainer  from './components/ToastContainer';
import Sidebar         from './components/Sidebar';
import ResetModal      from './components/modals/ResetModal';
import EditPlayerModal from './components/modals/EditPlayerModal';
import RegEditModal    from './components/modals/RegEditModal';

import DashboardPage   from './pages/DashboardPage';
import AuctionPage     from './pages/AuctionPage';
import PlayersPage     from './pages/PlayersPage';
import TeamsPage       from './pages/TeamsPage';
import StatsPage       from './pages/StatsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RegisteredPage  from './pages/RegisteredPage';

const EMPTY_STATE = {
  teams: [], players: [], queue: [],
  currentBid: { playerId: null, amount: 0, leadingTeamId: null },
  activeQueueTab: 'BAT', recentResults: [],
};

const POLL_INTERVAL = 3000;

function AppInner() {
  const { isAdmin } = useAuth();

  const [state,           setState]           = useState(EMPTY_STATE);
  const [loading,         setLoading]         = useState(true);
  const [currentPage,     setCurrentPage]     = useState('dashboard');
  const [theme,           setTheme]           = useState('dark');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const { toasts, toast } = useToast();

  const loadState = useCallback(async (silent = false) => {
    try {
      const s = await api.getFullState();
      setState(s);
    } catch (e) {
      if (!silent) toast('Could not connect to backend: ' + e.message, 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { loadState(false); }, [loadState]);

  useEffect(() => {
    const timer = setInterval(() => loadState(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [loadState]);

  const getTeam   = (id) => state.teams.find((t) => t.id === id);
  const getPlayer = (id) => state.players.find((p) => p.id === id);

  const navigate    = (page) => setCurrentPage(page);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const call = async (apiFn, successMsg, errorMsg) => {
    if (!isAdmin) { toast('Admin access required', 'error'); return false; }
    try {
      const next = await apiFn();
      if (next) setState(next);
      if (successMsg) toast(successMsg, 'success');
      return true;
    } catch (e) { toast(errorMsg || e.message, 'error'); return false; }
  };

  const [showResetModal, setShowResetModal] = useState(false);
  const doReset = async () => {
    await call(() => api.resetAuction().then(() => api.getFullState()), 'Auction has been reset!');
    setShowResetModal(false); navigate('dashboard');
  };

  const [soldToTeamId, setSoldToTeamId] = useState('');
  const startBidding    = (id)     => call(() => api.startBidding(id));
  const reAuctionPlayer = (id)     => call(() => api.reAuction(id));
  const placeBid        = async (teamId) => { const ok = await call(() => api.placeBid(teamId)); if (ok) setSoldToTeamId(teamId); };
  const incrementBid    = (amt)    => call(() => api.incrementBid(amt));

  const confirmSold = async (teamId) => {
    const { amount } = state.currentBid;
    const player = getPlayer(state.currentBid.playerId);
    const team   = getTeam(teamId);
    const ok = await call(() => api.confirmSold(teamId, amount), `🎉 ${player?.name} → ${team?.name} for ${amount} pts!`);
    if (ok) { if (amount >= 100) setConfettiTrigger((c) => c + 1); playSoldSound(); setSoldToTeamId(''); }
  };

  const confirmSoldFromSelect = () => {
    if (!state.currentBid.playerId) { toast('No player on auction block', 'error'); return; }
    if (!soldToTeamId) { toast('Please select a team from the dropdown first!', 'warning'); return; }
    confirmSold(soldToTeamId);
  };

  const markUnsold = async () => {
    const player = getPlayer(state.currentBid.playerId);
    await call(() => api.markUnsold(), `${player?.name} marked as unsold.`);
  };

  const useRTM      = (teamId) => call(() => api.useRTM(teamId),      `⚡ ${getTeam(teamId)?.name} used RTM!`);
  const useWildcard = (teamId) => call(() => api.useWildcard(teamId), `🃏 ${getTeam(teamId)?.name} used Wildcard!`);
  const switchQueueTab = (key) => call(() => api.switchQueueTab(key));

  const addPlayerToQueue = async (name, cat, role, price) => {
    if (!name) { toast('Enter a player name', 'error'); return false; }
    if (price < 10 || price > 500) { toast('Price must be 10–500', 'error'); return false; }
    return call(async () => { await api.addPlayer({ name, category: cat, role, basePrice: price }); return api.getFullState(); }, `${name} added to queue!`);
  };

  const [playerSearch,     setPlayerSearch]     = useState('');
  const [playerFilter,     setPlayerFilter]     = useState('ALL');
  const [playerRoleFilter, setPlayerRoleFilter] = useState('ALL');
  const [editModal,        setEditModal]         = useState(null);

  const openEditPlayer = (id) => {
    if (!isAdmin) return;
    const p = getPlayer(id);
    if (p) setEditModal({ id: p.id, name: p.name, category: p.category, role: p.role || 'BAT', basePrice: p.basePrice, photo: p.photo || null });
  };
  const saveEditPlayer = async () => {
    if (!editModal.name.trim()) { toast('Name cannot be empty', 'error'); return; }
    const updates = { name: editModal.name.trim(), category: editModal.category, role: editModal.role, basePrice: editModal.basePrice, photo: editModal.photo || null };
    await call(async () => { await api.editPlayer(editModal.id, updates); return api.getFullState(); }, `✏️ ${editModal.name} updated!`);
    // Sync photo + details back to registered record if one exists (same name match)
    try {
      const regList = await api.getRegistered();
      const match = regList.find((r) => r.name.trim().toLowerCase() === editModal.name.trim().toLowerCase());
      if (match) {
        await api.editRegistered(match.id, { ...match, photo: editModal.photo || null, category: editModal.category, role: editModal.role, basePrice: editModal.basePrice });
        setRegisteredPlayers((prev) => prev.map((r) => r.id === match.id ? { ...r, photo: editModal.photo || null, category: editModal.category, role: editModal.role, basePrice: editModal.basePrice } : r));
      }
    } catch (syncErr) {
      console.warn('Photo sync to registered record failed:', syncErr.message);
      toast('Player updated, but photo sync to Registered list failed: ' + syncErr.message, 'warning');
    }
    setEditModal(null);
  };
  const removePlayer = (id) => {
    const p = getPlayer(id);
    return call(async () => { await api.removePlayer(id); return api.getFullState(); }, `🗑 ${p?.name} removed.`);
  };

  const [teamsView, setTeamsView] = useState('list');
  const addNewTeam = (name, color, pts) => {
    if (!name) { toast('Enter a team name', 'error'); return false; }
    return call(async () => { await api.addTeam({ name, color, points: pts }); return api.getFullState(); }, `🏆 Team "${name}" added!`);
  };
  const editTeamFn  = (id, data) => call(async () => { await api.editTeam(id, data); return api.getFullState(); }, '✏️ Team updated!');
  const deleteTeam  = (id) => call(async () => { await api.deleteTeam(id); return api.getFullState(); }, 'Team deleted.');

  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [regEditModal,      setRegEditModal]       = useState(null);

  const loadRegistered = useCallback(async () => { try { setRegisteredPlayers(await api.getRegistered()); } catch (e) {} }, []);
  useEffect(() => { if (isAdmin) loadRegistered(); }, [loadRegistered, isAdmin]);

  const addRegisteredPlayer = async (name, role, category, basePrice, phone) => {
    if (!isAdmin) return false;
    if (!name.trim()) { toast('Enter a player name', 'error'); return false; }
    if (basePrice < 10 || basePrice > 500) { toast('Base price must be 10–500', 'error'); return false; }
    try { const r = await api.addRegistered({ name, role, category, basePrice, phone }); setRegisteredPlayers((p) => [...p, r]); toast(`✅ ${name} registered!`, 'success'); return true; }
    catch (e) { toast(e.message, 'error'); return false; }
  };
  const removeRegisteredPlayer = async (id) => {
    if (!isAdmin) return;
    const p = registeredPlayers.find((r) => r.id === id);
    try { await api.removeRegistered(id); setRegisteredPlayers((prev) => prev.filter((r) => r.id !== id)); if (p) toast(`🗑 ${p.name} removed.`, 'warning'); }
    catch (e) { toast(e.message, 'error'); }
  };
  const saveRegEditPlayer = async () => {
    if (!regEditModal.name.trim()) { toast('Name cannot be empty', 'error'); return; }
    try { const updated = await api.editRegistered(regEditModal.id, regEditModal); setRegisteredPlayers((prev) => prev.map((r) => r.id === updated.id ? updated : r)); toast(`✏️ ${updated.name} updated!`, 'success'); setRegEditModal(null); }
    catch (e) { toast(e.message, 'error'); }
  };
  const sendToAuction = async (id) => {
    if (!isAdmin) return;
    const reg = registeredPlayers.find((r) => r.id === id);
    if (reg?.addedToAuction) { toast(`${reg.name} is already in the auction queue!`, 'warning'); return; }
    try {
      await api.sendToAuction(id);
      setRegisteredPlayers((prev) => prev.map((r) => r.id === id ? { ...r, addedToAuction: true } : r));
      setState(await api.getFullState());
      toast(`⚡ ${reg?.name} sent to auction queue!`, 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  const pages = {
    dashboard:   { title: 'Dashboard',         subtitle: 'Season Overview · All Teams' },
    auction:     { title: 'Live Auction',       subtitle: 'Bidding Arena' },
    players:     { title: 'All Players',        subtitle: 'Complete player registry' },
    teams:       { title: 'Teams',              subtitle: 'Manage teams · View rosters' },
    stats:       { title: 'Statistics',         subtitle: 'Auction analytics' },
    leaderboard: { title: 'Leaderboard',        subtitle: 'Live standings' },
    registered:  { title: 'Registered Players', subtitle: 'Google Form Registrations · Categorize & Manage' },
  };

  if (loading) return (
    <><style>{CSS}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0f172a', color:'#fff', fontSize:20 }}>
        🏏 Loading Please wait…
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className={theme} style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <Confetti trigger={confettiTrigger} />
        <ToastContainer toasts={toasts} />
        {isAdmin && showResetModal && <ResetModal onConfirm={doReset} onClose={() => setShowResetModal(false)} />}
        {isAdmin && editModal    && <EditPlayerModal data={editModal}    onChange={setEditModal}    onSave={saveEditPlayer}    onClose={() => setEditModal(null)} />}
        {isAdmin && regEditModal && <RegEditModal    data={regEditModal} onChange={setRegEditModal} onSave={saveRegEditPlayer} onClose={() => setRegEditModal(null)} />}

        <div className="app-shell">
          <Sidebar
            currentPage={currentPage} navigate={navigate}
            onToggleTheme={toggleTheme} theme={theme}
            onReset={() => setShowResetModal(true)}
            onPlayerRegistered={loadRegistered}
          />
          <main className="main-content">
            <div className="page-header">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="page-title">{pages[currentPage]?.title}</div>
                <div className="page-subtitle">
                  {currentPage === 'auction' && <span className="status-dot live" />}
                  {pages[currentPage]?.subtitle}
                  {/* Live indicator for viewers */}
                  {!isAdmin && (
                    <span style={{ marginLeft: 10, fontSize: 11, color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.3)', whiteSpace: 'nowrap' }}>
                      🔴 LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="page-content">
              {currentPage === 'dashboard'   && <DashboardPage   state={state} getTeamRemaining={getTeamRemaining} getPlayer={getPlayer} onNavigate={navigate} onShowTeam={(id) => { setTeamsView(id); navigate('teams'); }} />}
              {currentPage === 'auction'     && <AuctionPage     state={state} getTeam={getTeam} getPlayer={getPlayer} getTeamRemaining={getTeamRemaining} getTeamCatACount={getTeamCatACount} onStartBidding={startBidding} onReAuction={reAuctionPlayer} onPlaceBid={placeBid} onIncrementBid={incrementBid} onConfirmSoldFromSelect={confirmSoldFromSelect} onMarkUnsold={markUnsold} onUseRTM={useRTM} onUseWildcard={useWildcard} onAddPlayer={addPlayerToQueue} onSwitchTab={switchQueueTab} soldToTeamId={soldToTeamId} setSoldToTeamId={setSoldToTeamId} isAdmin={isAdmin} />}
              {currentPage === 'players'     && <PlayersPage     state={state} getTeam={getTeam} playerSearch={playerSearch} setPlayerSearch={setPlayerSearch} playerFilter={playerFilter} setPlayerFilter={setPlayerFilter} playerRoleFilter={playerRoleFilter} setPlayerRoleFilter={setPlayerRoleFilter} onEdit={openEditPlayer} onRemove={removePlayer} isAdmin={isAdmin} />}
              {currentPage === 'teams'       && <TeamsPage       state={state} teamsView={teamsView} setTeamsView={setTeamsView} getTeam={getTeam} getPlayer={getPlayer} getTeamRemaining={getTeamRemaining} onAddTeam={addNewTeam} onEditTeam={editTeamFn} onDeleteTeam={deleteTeam} isAdmin={isAdmin} />}
              {currentPage === 'stats'       && <StatsPage       state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} />}
              {currentPage === 'leaderboard' && <LeaderboardPage state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} getPlayer={getPlayer} />}
              {isAdmin && currentPage === 'registered' && <RegisteredPage players={registeredPlayers} onRemove={removeRegisteredPlayer} onEdit={async (p) => {
                  try {
                    const updated = await api.editRegistered(p.id, p);
                    setRegisteredPlayers((prev) => prev.map((r) => r.id === updated.id ? updated : r));
                    toast(`✏️ ${updated.name} updated!`, 'success');
                    // If already in auction queue, sync photo+details to the players list too
                    if (p.addedToAuction) {
                      try {
                        const fullState = await api.getFullState();
                        const match = fullState.players.find((pl) => pl.name.trim().toLowerCase() === p.name.trim().toLowerCase());
                        if (match) {
                          await api.editPlayer(match.id, { name: p.name, category: p.category, role: p.role, basePrice: p.basePrice, photo: p.photo || null });
                          setState(await api.getFullState());
                        }
                      } catch (syncErr) {
                          console.warn('Photo sync to Players list failed:', syncErr.message);
                          toast('Registered record updated, but photo sync to Players list failed: ' + syncErr.message, 'warning');
                        }
                    }
                  } catch (e) { toast(e.message, 'error'); }
                }} onSendToAuction={sendToAuction} />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}