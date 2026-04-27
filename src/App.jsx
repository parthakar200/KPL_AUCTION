import { useState, useEffect } from 'react';

// Constants
import { DEFAULT_TEAMS, DUMMY_PLAYERS } from './constants/data';
import { CSS } from './constants/styles';

// Utils & hooks
import {
  getInitialState, generateId,
  getTeamRemaining, getTeamCatACount,
  playSoldSound,
} from './utils/helpers';
import { useToast } from './hooks/useToast';

// Components
import Confetti        from './components/Confetti';
import ToastContainer  from './components/ToastContainer';
import Sidebar         from './components/Sidebar';
import ResetModal      from './components/modals/ResetModal';
import EditPlayerModal from './components/modals/EditPlayerModal';
import RegEditModal    from './components/modals/RegEditModal';

// Pages
import DashboardPage   from './pages/DashboardPage';
import AuctionPage     from './pages/AuctionPage';
import PlayersPage     from './pages/PlayersPage';
import TeamsPage       from './pages/TeamsPage';
import StatsPage       from './pages/StatsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RegisteredPage  from './pages/RegisteredPage';

export default function App() {
  const [state,           setState]           = useState(getInitialState);
  const [currentPage,     setCurrentPage]     = useState('dashboard');
  const [theme,           setTheme]           = useState('dark');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const { toasts, toast } = useToast();

  // Persist state
  useEffect(() => {
    try { localStorage.setItem('vcl_state', JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // ── Core helpers ──────────────────────────────────────────
  const getTeam   = (id) => state.teams.find((t) => t.id === id);
  const getPlayer = (id) => state.players.find((p) => p.id === id);

  const updateState = (updater) => setState((prev) => {
    const next = JSON.parse(JSON.stringify(prev));
    updater(next);
    return next;
  });

  // ── Navigation & theme ────────────────────────────────────
  const navigate     = (page) => setCurrentPage(page);
  const toggleTheme  = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // ── Reset ─────────────────────────────────────────────────
  const [showResetModal, setShowResetModal] = useState(false);
  const doReset = () => {
    const fresh = {
      teams:        JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
      players:      JSON.parse(JSON.stringify(DUMMY_PLAYERS)),
      queue:        DUMMY_PLAYERS.map((p) => p.id),
      currentBid:   { playerId: null, amount: 0, leadingTeamId: null },
      activeQueueTab: 'BAT',
      recentResults: [],
    };
    setState(fresh);
    setShowResetModal(false);
    navigate('dashboard');
    toast('Auction has been reset!', 'success');
  };

  // ── Auction actions ───────────────────────────────────────
  const startBidding = (playerId) => {
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      if (!p || p.status !== 'pending') return;
      s.currentBid = { playerId, amount: p.basePrice, leadingTeamId: null };
    });
    setSoldToTeamId('');
  };

  const reAuctionPlayer = (playerId) => {
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      if (!p) return;
      p.status = 'pending';
      if (!s.queue.includes(playerId)) s.queue.push(playerId);
      s.activeQueueTab = p.role || 'BAT';
      s.currentBid = { playerId, amount: p.basePrice, leadingTeamId: null };
    });
    setSoldToTeamId('');
  };

  const placeBid = (teamId) => {
    const { playerId, amount } = state.currentBid;
    const team   = getTeam(teamId);
    const player = getPlayer(playerId);
    if (!team || !player) return;
    if (getTeamRemaining(team) < amount) { toast('Not enough points!', 'error'); return; }
    if (player.category === 'A' && getTeamCatACount(team, state.players) >= 3) { toast('Category A limit (3) reached for ' + team.name, 'error'); return; }
    updateState((s) => { s.currentBid.leadingTeamId = teamId; });
    setSoldToTeamId(teamId);
  };

  const incrementBid = (amount) => {
    updateState((s) => { s.currentBid.amount += amount; });
  };

  const addRecentResult = (s, playerId, teamId, amount, status) => {
    if (!s.recentResults) s.recentResults = [];
    s.recentResults.unshift({ playerId, teamId, amount, status, ts: Date.now() });
    if (s.recentResults.length > 6) s.recentResults = s.recentResults.slice(0, 6);
  };

  const [soldToTeamId, setSoldToTeamId] = useState('');

  const confirmSold = (teamId) => {
    const { playerId, amount } = state.currentBid;
    const team   = getTeam(teamId);
    const player = getPlayer(playerId);
    if (!team || !player) return;
    if (getTeamRemaining(team) < amount) { toast('Not enough points for ' + team.name, 'error'); return; }
    if (player.category === 'A' && getTeamCatACount(team, state.players) >= 3) { toast('Category A limit reached for ' + team.name, 'error'); return; }

    const soldTab = state.activeQueueTab;
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      const t = s.teams.find((tm) => tm.id === teamId);
      p.soldPrice = amount;
      p.teamId    = teamId;
      p.status    = 'sold';
      t.pointsSpent += amount;
      t.players.push(playerId);
      s.queue = s.queue.filter((id) => id !== playerId);
      addRecentResult(s, playerId, teamId, amount, 'sold');

      const pendingInTab = s.queue.map((id) => s.players.find((pl) => pl.id === id)).filter((pl) => pl && pl.status === 'pending' && (pl.role || 'BAT') === soldTab);
      if (pendingInTab.length > 0) {
        s.currentBid = { playerId: pendingInTab[0].id, amount: pendingInTab[0].basePrice, leadingTeamId: null };
      } else {
        s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      }
    });

    if (amount >= 100) setConfettiTrigger((c) => c + 1);
    playSoldSound();
    toast(`🎉 ${player.name} → ${team.name} for ${amount} pts!`, 'success');
    setSoldToTeamId('');
  };

  const confirmSoldFromSelect = () => {
    if (!state.currentBid.playerId) { toast('No player on auction block', 'error'); return; }
    if (!soldToTeamId) { toast('Please select a team from the dropdown first!', 'warning'); return; }
    confirmSold(soldToTeamId);
  };

  const markUnsold = () => {
    const { playerId } = state.currentBid;
    if (!playerId) return;
    const p        = getPlayer(playerId);
    const unsoldTab = state.activeQueueTab;
    updateState((s) => {
      const pl = s.players.find((pl) => pl.id === playerId);
      pl.status = 'unsold';
      s.queue   = s.queue.filter((id) => id !== playerId);
      addRecentResult(s, playerId, null, 0, 'unsold');

      const pendingInTab = s.queue.map((id) => s.players.find((pl2) => pl2.id === id)).filter((pl2) => pl2 && pl2.status === 'pending' && (pl2.role || 'BAT') === unsoldTab);
      if (pendingInTab.length > 0) {
        s.currentBid = { playerId: pendingInTab[0].id, amount: pendingInTab[0].basePrice, leadingTeamId: null };
      } else {
        s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      }
    });
    toast(`${p.name} marked as unsold.`, 'warning');
  };

  const useRTM = (teamId) => {
    const team = getTeam(teamId);
    if (team.rtmUsed) { toast(team.name + ' has already used RTM!', 'error'); return; }
    const { playerId, amount } = state.currentBid;
    if (!playerId) { toast('No player on auction', 'error'); return; }
    updateState((s) => {
      const t = s.teams.find((tm) => tm.id === teamId);
      t.rtmUsed = true;
      s.currentBid.leadingTeamId = teamId;
    });
    toast(`⚡ ${team.name} used RTM! Matching ${amount} pts.`, 'warning');
  };

  const useWildcard = (teamId) => {
    const team = getTeam(teamId);
    const { playerId } = state.currentBid;
    if (!playerId) { toast('No player on auction', 'error'); return; }
    if (getTeamRemaining(team) < 50) { toast('Not enough points for wildcard!', 'error'); return; }
    updateState((s) => {
      s.currentBid.amount        = 50;
      s.currentBid.leadingTeamId = teamId;
    });
    toast(`🃏 ${team.name} used Wildcard! Bid set to 50 pts.`, 'warning');
  };

  const addPlayerToQueue = (name, cat, role, price) => {
    if (!name) { toast('Enter a player name', 'error'); return false; }
    if (price < 10 || price > 500) { toast('Price must be 10–500', 'error'); return false; }
    const player = { id: generateId(), name, category: cat, role: role || 'BAT', basePrice: price, soldPrice: null, teamId: null, status: 'pending' };
    updateState((s) => { s.players.push(player); s.queue.push(player.id); });
    toast(`${name} added to queue!`, 'success');
    return true;
  };

  // ── Player table state ────────────────────────────────────
  const [playerSearch,     setPlayerSearch]     = useState('');
  const [playerFilter,     setPlayerFilter]     = useState('ALL');
  const [playerRoleFilter, setPlayerRoleFilter] = useState('ALL');

  // ── Edit player modal ─────────────────────────────────────
  const [editModal, setEditModal] = useState(null);

  const openEditPlayer = (playerId) => {
    const p = getPlayer(playerId);
    if (!p) return;
    setEditModal({ id: p.id, name: p.name, category: p.category, role: p.role || 'BAT', basePrice: p.basePrice });
  };

  const saveEditPlayer = () => {
    if (!editModal.name.trim()) { toast('Name cannot be empty', 'error'); return; }
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === editModal.id);
      p.name      = editModal.name.trim();
      p.category  = editModal.category;
      p.role      = editModal.role;
      p.basePrice = editModal.basePrice;
    });
    toast(`✏️ ${editModal.name} updated!`, 'success');
    setEditModal(null);
  };

  const removePlayer = (playerId) => {
    const p = getPlayer(playerId);
    if (!p) return;
    updateState((s) => {
      const pl = s.players.find((pl) => pl.id === playerId);
      if (pl.status === 'sold') {
        const t = s.teams.find((tm) => tm.id === pl.teamId);
        if (t) {
          t.players     = t.players.filter((pid) => pid !== playerId);
          t.pointsSpent = Math.max(0, t.pointsSpent - (pl.soldPrice || 0));
        }
      }
      s.queue = s.queue.filter((id) => id !== playerId);
      if (s.currentBid.playerId === playerId) s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      s.players = s.players.filter((pl) => pl.id !== playerId);
    });
    toast(`🗑 ${p.name} removed.`, 'warning');
  };

  // ── Teams page state ──────────────────────────────────────
  const [teamsView, setTeamsView] = useState('list');

  const addNewTeam = (name, color, pts) => {
    if (!name) { toast('Enter a team name', 'error'); return false; }
    if (state.teams.find((t) => t.name.toLowerCase() === name.toLowerCase())) { toast('Team name already exists!', 'error'); return false; }
    const newTeam = { id: 'team_' + Date.now(), name, color, points: pts, pointsSpent: 0, players: [], rtmUsed: false };
    updateState((s) => { s.teams.push(newTeam); });
    toast(`🏆 Team "${name}" added!`, 'success');
    return true;
  };

  const deleteTeam = (teamId) => {
    const team = getTeam(teamId);
    if (!team) return;
    if (team.players.length > 0) { toast(`Cannot delete "${team.name}" — they have ${team.players.length} players. Release players first.`, 'error'); return; }
    updateState((s) => { s.teams = s.teams.filter((t) => t.id !== teamId); });
    toast('Team deleted.', 'warning');
  };

  const switchQueueTab = (key) => updateState((s) => { s.activeQueueTab = key; });

  // ── Registered players ────────────────────────────────────
  const [registeredPlayers, setRegisteredPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('vcl_registered');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('vcl_registered', JSON.stringify(registeredPlayers)); } catch (e) {}
  }, [registeredPlayers]);

  const [regEditModal, setRegEditModal] = useState(null);

  const addRegisteredPlayer = (name, role, category, basePrice, phone) => {
    if (!name.trim()) { toast('Enter a player name', 'error'); return false; }
    if (basePrice < 10 || basePrice > 500) { toast('Base price must be 10–500', 'error'); return false; }
    const player = {
      id: 'reg_' + Date.now() + Math.random().toString(36).slice(2, 5),
      name: name.trim(), role, category, basePrice, phone: phone.trim(),
      registeredAt: new Date().toLocaleDateString('en-IN'),
      addedToAuction: false,
    };
    setRegisteredPlayers((prev) => [...prev, player]);
    toast(`✅ ${name} registered!`, 'success');
    return true;
  };

  const removeRegisteredPlayer = (id) => {
    const p = registeredPlayers.find((r) => r.id === id);
    setRegisteredPlayers((prev) => prev.filter((r) => r.id !== id));
    if (p) toast(`🗑 ${p.name} removed from registry.`, 'warning');
  };

  const saveRegEditPlayer = () => {
    if (!regEditModal.name.trim()) { toast('Name cannot be empty', 'error'); return; }
    setRegisteredPlayers((prev) => prev.map((r) => r.id === regEditModal.id ? { ...regEditModal, name: regEditModal.name.trim() } : r));
    toast(`✏️ ${regEditModal.name} updated!`, 'success');
    setRegEditModal(null);
  };

  const sendToAuction = (id) => {
    const reg = registeredPlayers.find((r) => r.id === id);
    if (!reg) return;
    if (reg.addedToAuction) { toast(`${reg.name} is already in the auction queue!`, 'warning'); return; }
    const ok = addPlayerToQueue(reg.name, reg.category, reg.role, reg.basePrice);
    if (ok) {
      setRegisteredPlayers((prev) => prev.map((r) => r.id === id ? { ...r, addedToAuction: true } : r));
      toast(`⚡ ${reg.name} sent to auction queue!`, 'success');
    }
  };

  // ── Page meta ─────────────────────────────────────────────
  const pages = {
    dashboard:   { title: 'Dashboard',           subtitle: 'Season Overview · All Teams' },
    auction:     { title: 'Live Auction',         subtitle: 'Bidding Arena' },
    players:     { title: 'All Players',          subtitle: 'Complete player registry' },
    teams:       { title: 'Teams',                subtitle: 'Manage teams · View rosters' },
    stats:       { title: 'Statistics',           subtitle: 'Auction analytics' },
    leaderboard: { title: 'Leaderboard',          subtitle: 'Live standings' },
    registered:  { title: 'Registered Players',   subtitle: 'Google Form Registrations · Categorize & Manage' },
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={theme} style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <Confetti trigger={confettiTrigger} />
        <ToastContainer toasts={toasts} />

        {showResetModal && <ResetModal onConfirm={doReset} onClose={() => setShowResetModal(false)} />}
        {editModal && (
          <EditPlayerModal
            data={editModal}
            onChange={setEditModal}
            onSave={saveEditPlayer}
            onClose={() => setEditModal(null)}
          />
        )}
        {regEditModal && (
          <RegEditModal
            data={regEditModal}
            onChange={setRegEditModal}
            onSave={saveRegEditPlayer}
            onClose={() => setRegEditModal(null)}
          />
        )}

        <div className="app-shell">
          <Sidebar
            currentPage={currentPage}
            navigate={navigate}
            onToggleTheme={toggleTheme}
            theme={theme}
            onReset={() => setShowResetModal(true)}
          />

          <main className="main-content">
            <div className="page-header">
              <div className="page-title">{pages[currentPage]?.title}</div>
              <div className="page-subtitle">
                {currentPage === 'auction' && <span className="status-dot live" />}
                {pages[currentPage]?.subtitle}
              </div>
            </div>

            <div className="page-content">
              {currentPage === 'dashboard' && (
                <DashboardPage
                  state={state}
                  getTeamRemaining={getTeamRemaining}
                  getPlayer={getPlayer}
                  onNavigate={navigate}
                  onShowTeam={(id) => { setTeamsView(id); navigate('teams'); }}
                />
              )}
              {currentPage === 'auction' && (
                <AuctionPage
                  state={state} getTeam={getTeam} getPlayer={getPlayer}
                  getTeamRemaining={getTeamRemaining} getTeamCatACount={getTeamCatACount}
                  onStartBidding={startBidding} onReAuction={reAuctionPlayer}
                  onPlaceBid={placeBid} onIncrementBid={incrementBid}
                  onConfirmSoldFromSelect={confirmSoldFromSelect} onMarkUnsold={markUnsold}
                  onUseRTM={useRTM} onUseWildcard={useWildcard}
                  onAddPlayer={addPlayerToQueue} onSwitchTab={switchQueueTab}
                  soldToTeamId={soldToTeamId} setSoldToTeamId={setSoldToTeamId}
                />
              )}
              {currentPage === 'players' && (
                <PlayersPage
                  state={state} getTeam={getTeam}
                  playerSearch={playerSearch} setPlayerSearch={setPlayerSearch}
                  playerFilter={playerFilter} setPlayerFilter={setPlayerFilter}
                  playerRoleFilter={playerRoleFilter} setPlayerRoleFilter={setPlayerRoleFilter}
                  onEdit={openEditPlayer} onRemove={removePlayer}
                />
              )}
              {currentPage === 'teams' && (
                <TeamsPage
                  state={state} teamsView={teamsView} setTeamsView={setTeamsView}
                  getTeam={getTeam} getPlayer={getPlayer}
                  getTeamRemaining={getTeamRemaining}
                  onAddTeam={addNewTeam} onDeleteTeam={deleteTeam}
                />
              )}
              {currentPage === 'stats' && (
                <StatsPage state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} />
              )}
              {currentPage === 'leaderboard' && (
                <LeaderboardPage state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} getPlayer={getPlayer} />
              )}
              {currentPage === 'registered' && (
                <RegisteredPage
                  players={registeredPlayers}
                  onAdd={addRegisteredPlayer}
                  onRemove={removeRegisteredPlayer}
                  onEdit={(p) => setRegEditModal({ ...p })}
                  onSendToAuction={sendToAuction}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}