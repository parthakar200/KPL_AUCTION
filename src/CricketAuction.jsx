import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   CONSTANTS & DATA
═══════════════════════════════════════════ */
const DEFAULT_TEAMS = [
  { id: "t1", name: "Kings XI", color: "#f97316", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t2", name: "Royal Tigers", color: "#a855f7", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t3", name: "Blue Warriors", color: "#06b6d4", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t4", name: "Red Eagles", color: "#ec4899", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
];

const DUMMY_PLAYERS = [
  { id: "p1",  name: "Arjun Sharma",  category: "A", role: "BAT", basePrice: 150, soldPrice: null, teamId: null, status: "pending" },
  { id: "p2",  name: "Rohit Patel",   category: "A", role: "BAT", basePrice: 130, soldPrice: null, teamId: null, status: "pending" },
  { id: "p3",  name: "Vikas Singh",   category: "A", role: "BWL", basePrice: 120, soldPrice: null, teamId: null, status: "pending" },
  { id: "p4",  name: "Suresh Yadav",  category: "A", role: "AR",  basePrice: 110, soldPrice: null, teamId: null, status: "pending" },
  { id: "p5",  name: "Manish Gupta",  category: "B", role: "BAT", basePrice: 80,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p6",  name: "Deepak Verma",  category: "B", role: "BWL", basePrice: 75,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p7",  name: "Ankur Tiwari",  category: "B", role: "AR",  basePrice: 70,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p8",  name: "Pradeep Kumar", category: "B", role: "WK",  basePrice: 65,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p9",  name: "Raju Chauhan",  category: "B", role: "BAT", basePrice: 60,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p10", name: "Sanjay Mishra", category: "C", role: "BWL", basePrice: 40,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p11", name: "Ajay Rawat",    category: "C", role: "BAT", basePrice: 35,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p12", name: "Ramesh Joshi",  category: "C", role: "BWL", basePrice: 30,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p13", name: "Kishore Nair",  category: "C", role: "WK",  basePrice: 30,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p14", name: "Dinesh Pandey", category: "C", role: "AR",  basePrice: 25,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p15", name: "Sunil Bhatt",   category: "C", role: "BAT", basePrice: 25,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p16", name: "Hari Shukla",   category: "C", role: "BWL", basePrice: 20,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p17", name: "Gopal Singh",   category: "C", role: "BAT", basePrice: 20,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p18", name: "Lallan Prasad", category: "C", role: "AR",  basePrice: 15,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p19", name: "Munna Ali",     category: "C", role: "BWL", basePrice: 15,  soldPrice: null, teamId: null, status: "pending" },
  { id: "p20", name: "Chotu Sharma",  category: "C", role: "BAT", basePrice: 10,  soldPrice: null, teamId: null, status: "pending" },
];

const QUEUE_TABS = [
  { key: "BAT",    label: "🏏 Batsmen",      color: "#f59e0b" },
  { key: "BWL",    label: "🎯 Bowlers",      color: "#3b82f6" },
  { key: "AR",     label: "⚡ All-Rounders", color: "#a855f7" },
  { key: "WK",     label: "🧤 Keepers",      color: "#22c55e" },
  { key: "UNSOLD", label: "↩ Unsold",        color: "#ef4444" },
];

const ROLE_INFO = {
  BAT: { label: "Batsman",     icon: "🏏", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  BWL: { label: "Bowler",      icon: "🎯", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
  AR:  { label: "All-Rounder", icon: "⚡", color: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" },
  WK:  { label: "Keeper",      icon: "🧤", color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)"  },
};

const TEAM_COLORS = [
  { value: "#f97316", label: "🟠 Orange" },
  { value: "#a855f7", label: "🟣 Purple" },
  { value: "#06b6d4", label: "🔵 Cyan" },
  { value: "#ec4899", label: "🩷 Pink" },
  { value: "#10b981", label: "🟢 Emerald" },
  { value: "#f43f5e", label: "🔴 Rose" },
  { value: "#8b5cf6", label: "💜 Violet" },
  { value: "#14b8a6", label: "🩵 Teal" },
  { value: "#eab308", label: "🟡 Yellow" },
  { value: "#64748b", label: "⚫ Slate" },
];

function getInitialState() {
  try {
    const saved = localStorage.getItem("vcl_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.activeQueueTab) parsed.activeQueueTab = "BAT";
      if (!parsed.recentResults) parsed.recentResults = [];
      return parsed;
    }
  } catch (e) {}
  return {
    teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
    players: JSON.parse(JSON.stringify(DUMMY_PLAYERS)),
    queue: DUMMY_PLAYERS.map((p) => p.id),
    currentBid: { playerId: null, amount: 0, leadingTeamId: null },
    activeQueueTab: "BAT",
    recentResults: [],
  };
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const getRoleInfo = (role) => ROLE_INFO[role] || ROLE_INFO["BAT"];
const generateId = () => "p" + Date.now() + Math.random().toString(36).slice(2, 5);
const getTeamRemaining = (team) => team.points - team.pointsSpent;
const getTeamCatACount = (team, players) =>
  team.players.filter((pid) => {
    const p = players.find((pl) => pl.id === pid);
    return p && p.category === "A";
  }).length;

function playSoldSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
  } catch (e) {}
}

/* ═══════════════════════════════════════════
   CSS INJECTION
═══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
:root{
  --cat-a:#ef4444;--cat-b:#3b82f6;--cat-c:#22c55e;--gold:#f59e0b;
  --font-display:'Bebas Neue',sans-serif;--font-body:'Rajdhani',sans-serif;--font-mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-sm:6px;--transition:0.2s ease;
}
.dark{--bg:#0a0e1a;--bg-card:#111827;--bg-card2:#1a2235;--border:#1e2d45;--text:#e2e8f0;--text-muted:#64748b;--text-dim:#94a3b8;--accent:#38bdf8;--accent-glow:rgba(56,189,248,0.2);--overlay:rgba(0,0,0,0.6);}
.light{--bg:#f0f4ff;--bg-card:#ffffff;--bg-card2:#e8eef8;--border:#cbd5e1;--text:#0f172a;--text-muted:#94a3b8;--text-dim:#475569;--accent:#0284c7;--accent-glow:rgba(2,132,199,0.15);--overlay:rgba(255,255,255,0.6);}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;font-size:16px;line-height:1.5;transition:background var(--transition),color var(--transition);}
button{cursor:pointer;font-family:var(--font-body);border:none;outline:none;}
input,select{font-family:var(--font-body);outline:none;}
table{border-collapse:collapse;width:100%;}
::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
.app-shell{display:flex;min-height:100vh;}
.sidebar{width:220px;background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform 0.3s ease;}
.sidebar-logo{padding:24px 20px 16px;border-bottom:1px solid var(--border);}
.logo-text{font-family:var(--font-display);font-size:22px;letter-spacing:1px;color:var(--accent);line-height:1.1;}
.logo-sub{font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:2px;font-weight:600;}
.sidebar-nav{flex:1;padding:12px 0;overflow-y:auto;}
.nav-item{display:flex;align-items:center;gap:10px;padding:11px 20px;color:var(--text-dim);cursor:pointer;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;transition:all var(--transition);position:relative;}
.nav-item:hover{color:var(--text);background:var(--bg-card2);}
.nav-item.active{color:var(--accent);background:var(--accent-glow);}
.nav-item.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);border-radius:0 3px 3px 0;}
.nav-icon{font-size:18px;width:20px;text-align:center;}
.sidebar-footer{padding:16px 20px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px;}
.theme-toggle{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--radius-sm);background:var(--bg-card2);border:1px solid var(--border);color:var(--text-dim);font-size:13px;font-weight:600;transition:all var(--transition);width:100%;}
.theme-toggle:hover{color:var(--text);border-color:var(--accent);}
.main-content{margin-left:220px;flex:1;min-height:100vh;overflow-x:hidden;}
.page-header{padding:28px 32px 0;border-bottom:1px solid var(--border);background:var(--bg-card);margin-bottom:28px;}
.page-title{font-family:var(--font-display);font-size:36px;letter-spacing:2px;color:var(--text);line-height:1;}
.page-subtitle{font-size:13px;color:var(--text-muted);margin-top:4px;margin-bottom:20px;text-transform:uppercase;letter-spacing:1px;}
.page-content{padding:0 32px 40px;}
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;}
.card-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:600;margin-bottom:12px;}
.teams-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:28px;}
.team-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden;}
.team-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--team-color,var(--accent));}
.team-card:hover{transform:translateY(-2px);border-color:var(--team-color,var(--accent));box-shadow:0 8px 24px rgba(0,0,0,0.2);}
.team-card.top-points{box-shadow:0 0 0 1px var(--gold),0 4px 16px rgba(245,158,11,0.2);}
.team-card.top-points::after{content:'★ TOP';position:absolute;top:12px;right:12px;font-size:10px;font-weight:700;color:var(--gold);background:rgba(245,158,11,0.15);padding:2px 6px;border-radius:4px;letter-spacing:1px;}
.team-name{font-family:var(--font-display);font-size:22px;letter-spacing:1px;margin-bottom:14px;}
.team-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);font-weight:600;}
.stat-value{font-family:var(--font-mono);font-size:20px;font-weight:600;color:var(--text);line-height:1.2;}
.points-bar-wrap{margin-top:14px;background:var(--bg-card2);border-radius:4px;height:6px;overflow:hidden;}
.points-bar{height:100%;border-radius:4px;transition:width 0.5s ease;}
.warning-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:4px;font-size:11px;font-weight:700;color:var(--gold);margin-left:6px;}
.auction-layout{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start;}
.auction-stage{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.auction-stage-header{padding:16px 20px;border-bottom:1px solid var(--border);background:var(--bg-card2);display:flex;align-items:center;justify-content:space-between;}
.auction-player-display{padding:28px;text-align:center;}
.category-chip{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:4px 10px;border-radius:20px;}
.category-chip.A{background:rgba(239,68,68,0.15);color:var(--cat-a);border:1px solid rgba(239,68,68,0.3);}
.category-chip.B{background:rgba(59,130,246,0.15);color:var(--cat-b);border:1px solid rgba(59,130,246,0.3);}
.category-chip.C{background:rgba(34,197,94,0.15);color:var(--cat-c);border:1px solid rgba(34,197,94,0.3);}
.auction-player-name{font-family:var(--font-display);font-size:48px;letter-spacing:2px;line-height:1;margin-bottom:8px;}
@keyframes bidPulse{0%{transform:scale(1);}50%{transform:scale(1.06);}100%{transform:scale(1);}}
.bid-amount{font-family:var(--font-display);font-size:56px;color:var(--gold);letter-spacing:2px;line-height:1;}
.bid-amount.pulse{animation:bidPulse 0.4s ease;}
.auction-sidebar-panel{display:flex;flex-direction:column;gap:16px;}
.form-row{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.form-label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);font-weight:600;}
.form-input{background:var(--bg-card2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;color:var(--text);font-size:14px;font-weight:500;transition:border-color var(--transition);width:100%;}
.form-input:focus{border-color:var(--accent);}
.form-input option{background:var(--bg-card);}
.btn-primary{background:var(--accent);color:#fff;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;transition:all 0.15s;width:100%;}
.btn-primary:hover{filter:brightness(1.1);}
.btn-danger{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--cat-a);padding:9px 16px;border-radius:var(--radius-sm);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;transition:all 0.15s;width:100%;}
.btn-danger:hover{background:rgba(239,68,68,0.2);}
.player-queue{max-height:300px;overflow-y:auto;}
.queue-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);cursor:pointer;transition:background var(--transition);border-bottom:1px solid var(--border);}
.queue-item:last-child{border-bottom:none;}
.queue-item:hover{background:var(--bg-card2);}
.queue-item-name{flex:1;font-weight:600;font-size:14px;}
.table-controls{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.search-input{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 14px;color:var(--text);font-size:14px;font-weight:500;width:240px;}
.search-input::placeholder{color:var(--text-muted);}
.search-input:focus{border-color:var(--accent);}
.filter-btns{display:flex;gap:8px;}
.filter-btn{padding:8px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-dim);transition:all var(--transition);}
.filter-btn.active,.filter-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow);}
.filter-btn.A.active{border-color:var(--cat-a);color:var(--cat-a);background:rgba(239,68,68,0.1);}
.filter-btn.B.active{border-color:var(--cat-b);color:var(--cat-b);background:rgba(59,130,246,0.1);}
.filter-btn.C.active{border-color:var(--cat-c);color:var(--cat-c);background:rgba(34,197,94,0.1);}
.data-table{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.data-table th{padding:12px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:700;background:var(--bg-card2);border-bottom:1px solid var(--border);}
.data-table td{padding:12px 16px;font-size:14px;font-weight:500;border-bottom:1px solid var(--border);color:var(--text);}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:var(--bg-card2);}
.cat-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;}
.cat-dot.A{background:var(--cat-a);}
.cat-dot.B{background:var(--cat-b);}
.cat-dot.C{background:var(--cat-c);}
.team-tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.5px;}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-bottom:28px;}
.stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;overflow:hidden;}
.stat-card-icon{position:absolute;right:14px;top:10px;font-size:32px;opacity:0.15;}
.stat-card-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:700;margin-bottom:8px;}
.stat-card-value{font-family:var(--font-display);font-size:32px;letter-spacing:1px;color:var(--gold);}
.stat-card-detail{font-size:12px;color:var(--text-muted);margin-top:4px;}
.rtm-btn{background:rgba(245,158,11,0.1);border:1px solid var(--gold);color:var(--gold);padding:9px 16px;border-radius:var(--radius-sm);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:1px;transition:all 0.15s;}
.rtm-btn:hover{background:rgba(245,158,11,0.2);}
.rtm-btn:disabled{opacity:0.4;cursor:not-allowed;}
.wildcard-btn{background:rgba(168,85,247,0.1);border:1px solid #a855f7;color:#a855f7;padding:9px 16px;border-radius:var(--radius-sm);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:1px;transition:all 0.15s;}
.wildcard-btn:hover{background:rgba(168,85,247,0.2);}
.modal-overlay{position:fixed;inset:0;background:var(--overlay);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.2s;}
.modal-overlay.open{opacity:1;pointer-events:all;}
.modal{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;width:90%;max-width:480px;transform:scale(0.95);transition:transform 0.2s;}
.modal-overlay.open .modal{transform:scale(1);}
.modal-title{font-family:var(--font-display);font-size:28px;letter-spacing:1px;margin-bottom:16px;}
.modal-btns{display:flex;gap:10px;margin-top:20px;}
.toast-container{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;flex-direction:column;gap:8px;}
@keyframes toastIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
.toast{background:var(--bg-card);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:var(--radius-sm);padding:12px 16px;font-size:13px;font-weight:600;min-width:260px;box-shadow:0 4px 16px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;}
.toast.success{border-left-color:var(--cat-c);}
.toast.error{border-left-color:var(--cat-a);}
.toast.warning{border-left-color:var(--gold);}
#confetti-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;}
.leaderboard-row{display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;transition:all var(--transition);}
.rank-num{font-family:var(--font-display);font-size:24px;width:30px;color:var(--text-muted);}
.rank-num.gold{color:var(--gold);}
.lb-team-name{flex:1;font-weight:700;font-size:15px;}
.lb-stat{font-family:var(--font-mono);font-size:13px;color:var(--text-muted);text-align:right;}
.empty-state{text-align:center;padding:48px 20px;color:var(--text-muted);}
.empty-state-icon{font-size:48px;margin-bottom:12px;opacity:0.5;}
.empty-state-text{font-size:15px;font-weight:600;}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,0.2);}50%{box-shadow:0 0 0 6px rgba(34,197,94,0.05);}}
.status-dot.live{background:var(--cat-c);box-shadow:0 0 0 3px rgba(34,197,94,0.2);animation:pulse 1.5s infinite;}
.back-btn{background:var(--bg-card);border:1px solid var(--border);color:var(--text-dim);padding:8px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all var(--transition);margin-bottom:16px;}
.back-btn:hover{color:var(--accent);border-color:var(--accent);}
.team-detail-header{display:flex;align-items:center;gap:16px;margin-bottom:24px;}
.team-detail-color-bar{width:6px;height:60px;border-radius:3px;}
.inc-btn{background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);padding:8px 16px;border-radius:var(--radius-sm);font-weight:700;font-family:var(--font-mono);font-size:13px;transition:all 0.15s;}
.inc-btn:hover{background:var(--accent);color:#fff;}
@media(max-width:900px){.auction-layout{grid-template-columns:1fr;}}
@media(max-width:700px){.sidebar{width:60px;}.sidebar .logo-text,.sidebar .logo-sub,.nav-item span{display:none;}.main-content{margin-left:60px;}.page-content{padding:0 16px 40px;}.page-header{padding:20px 16px 0;}.teams-grid{grid-template-columns:1fr;}}
`;

/* ═══════════════════════════════════════════
   TOAST HOOK
═══════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, toast };
}

/* ═══════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════ */
function Confetti({ trigger }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      r: Math.random() * 8 + 4,
      c: `hsl(${Math.random() * 360},80%,60%)`,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rsp: (Math.random() - 0.5) * 6,
    }));
    let frame = 0;
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.rsp; p.vy += 0.08;
      });
      frame++;
      if (frame < 120) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return <canvas id="confetti-canvas" ref={canvasRef} />;
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [state, setState] = useState(getInitialState);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const { toasts, toast } = useToast();

  // Persist state
  useEffect(() => {
    try { localStorage.setItem("vcl_state", JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // Helpers on state
  const getTeam = (id) => state.teams.find((t) => t.id === id);
  const getPlayer = (id) => state.players.find((p) => p.id === id);

  const updateState = (updater) => setState((prev) => {
    const next = JSON.parse(JSON.stringify(prev));
    updater(next);
    return next;
  });

  /* ── Navigation ── */
  const navigate = (page) => setCurrentPage(page);

  /* ── Theme ── */
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ── Reset ── */
  const [showResetModal, setShowResetModal] = useState(false);
  const doReset = () => {
    const fresh = {
      teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
      players: JSON.parse(JSON.stringify(DUMMY_PLAYERS)),
      queue: DUMMY_PLAYERS.map((p) => p.id),
      currentBid: { playerId: null, amount: 0, leadingTeamId: null },
      activeQueueTab: "BAT",
      recentResults: [],
    };
    setState(fresh);
    setShowResetModal(false);
    navigate("dashboard");
    toast("Auction has been reset!", "success");
  };

  /* ── Auction actions ── */
  const startBidding = (playerId) => {
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      if (!p || p.status !== "pending") return;
      s.currentBid = { playerId, amount: p.basePrice, leadingTeamId: null };
    });
    setSoldToTeamId("");
  };

  const reAuctionPlayer = (playerId) => {
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      if (!p) return;
      p.status = "pending";
      if (!s.queue.includes(playerId)) s.queue.push(playerId);
      s.activeQueueTab = p.role || "BAT";
      s.currentBid = { playerId, amount: p.basePrice, leadingTeamId: null };
    });
    setSoldToTeamId("");
  };

  const placeBid = (teamId) => {
    const { playerId, amount } = state.currentBid;
    const team = getTeam(teamId);
    const player = getPlayer(playerId);
    if (!team || !player) return;
    if (getTeamRemaining(team) < amount) { toast("Not enough points!", "error"); return; }
    if (player.category === "A" && getTeamCatACount(team, state.players) >= 3) { toast("Category A limit (3) reached for " + team.name, "error"); return; }
    updateState((s) => { s.currentBid.leadingTeamId = teamId; });
    setSoldToTeamId(teamId);
  };

  const incrementBid = (amount) => {
    updateState((s) => { s.currentBid.amount += amount; });
  };

  const getNextPlayerInTab = (tab) => {
    if (tab === "UNSOLD") return null;
    const pending = state.queue.map(getPlayer).filter((p) => p && p.status === "pending" && (p.role || "BAT") === tab);
    return pending.length > 0 ? pending[0] : null;
  };

  const addRecentResult = (s, playerId, teamId, amount, status) => {
    if (!s.recentResults) s.recentResults = [];
    s.recentResults.unshift({ playerId, teamId, amount, status, ts: Date.now() });
    if (s.recentResults.length > 6) s.recentResults = s.recentResults.slice(0, 6);
  };

  const [soldToTeamId, setSoldToTeamId] = useState("");

  const confirmSold = (teamId) => {
    const { playerId, amount } = state.currentBid;
    const team = getTeam(teamId);
    const player = getPlayer(playerId);
    if (!team || !player) return;
    if (getTeamRemaining(team) < amount) { toast("Not enough points for " + team.name, "error"); return; }
    if (player.category === "A" && getTeamCatACount(team, state.players) >= 3) { toast("Category A limit reached for " + team.name, "error"); return; }

    const soldTab = state.activeQueueTab;
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === playerId);
      const t = s.teams.find((tm) => tm.id === teamId);
      p.soldPrice = amount;
      p.teamId = teamId;
      p.status = "sold";
      t.pointsSpent += amount;
      t.players.push(playerId);
      s.queue = s.queue.filter((id) => id !== playerId);
      addRecentResult(s, playerId, teamId, amount, "sold");

      const pendingInTab = s.queue.map((id) => s.players.find((pl) => pl.id === id)).filter((pl) => pl && pl.status === "pending" && (pl.role || "BAT") === soldTab);
      if (pendingInTab.length > 0) {
        s.currentBid = { playerId: pendingInTab[0].id, amount: pendingInTab[0].basePrice, leadingTeamId: null };
      } else {
        s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      }
    });

    if (amount >= 100) setConfettiTrigger((c) => c + 1);
    playSoldSound();
    toast(`🎉 ${player.name} → ${team.name} for ${amount} pts!`, "success");
    setSoldToTeamId("");
  };

  const confirmSoldFromSelect = () => {
    if (!state.currentBid.playerId) { toast("No player on auction block", "error"); return; }
    if (!soldToTeamId) { toast("Please select a team from the dropdown first!", "warning"); return; }
    confirmSold(soldToTeamId);
  };

  const markUnsold = () => {
    const { playerId } = state.currentBid;
    if (!playerId) return;
    const p = getPlayer(playerId);
    const unsoldTab = state.activeQueueTab;
    updateState((s) => {
      const pl = s.players.find((pl) => pl.id === playerId);
      pl.status = "unsold";
      s.queue = s.queue.filter((id) => id !== playerId);
      addRecentResult(s, playerId, null, 0, "unsold");

      const pendingInTab = s.queue.map((id) => s.players.find((pl2) => pl2.id === id)).filter((pl2) => pl2 && pl2.status === "pending" && (pl2.role || "BAT") === unsoldTab);
      if (pendingInTab.length > 0) {
        s.currentBid = { playerId: pendingInTab[0].id, amount: pendingInTab[0].basePrice, leadingTeamId: null };
      } else {
        s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      }
    });
    toast(`${p.name} marked as unsold.`, "warning");
  };

  const useRTM = (teamId) => {
    const team = getTeam(teamId);
    if (team.rtmUsed) { toast(team.name + " has already used RTM!", "error"); return; }
    const { playerId, amount } = state.currentBid;
    if (!playerId) { toast("No player on auction", "error"); return; }
    updateState((s) => {
      const t = s.teams.find((tm) => tm.id === teamId);
      t.rtmUsed = true;
      s.currentBid.leadingTeamId = teamId;
    });
    toast(`⚡ ${team.name} used RTM! Matching ${amount} pts.`, "warning");
  };

  const useWildcard = (teamId) => {
    const team = getTeam(teamId);
    const { playerId } = state.currentBid;
    if (!playerId) { toast("No player on auction", "error"); return; }
    if (getTeamRemaining(team) < 50) { toast("Not enough points for wildcard!", "error"); return; }
    updateState((s) => {
      s.currentBid.amount = 50;
      s.currentBid.leadingTeamId = teamId;
    });
    toast(`🃏 ${team.name} used Wildcard! Bid set to 50 pts.`, "warning");
  };

  const addPlayerToQueue = (name, cat, role, price) => {
    if (!name) { toast("Enter a player name", "error"); return false; }
    if (price < 10 || price > 500) { toast("Price must be 10–500", "error"); return false; }
    const player = { id: generateId(), name, category: cat, role: role || "BAT", basePrice: price, soldPrice: null, teamId: null, status: "pending" };
    updateState((s) => { s.players.push(player); s.queue.push(player.id); });
    toast(`${name} added to queue!`, "success");
    return true;
  };

  // Player table
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerFilter, setPlayerFilter] = useState("ALL");
  const [playerRoleFilter, setPlayerRoleFilter] = useState("ALL");

  // Edit player modal
  const [editModal, setEditModal] = useState(null); // {id,name,category,role,basePrice}

  const openEditPlayer = (playerId) => {
    const p = getPlayer(playerId);
    if (!p) return;
    setEditModal({ id: p.id, name: p.name, category: p.category, role: p.role || "BAT", basePrice: p.basePrice });
  };

  const saveEditPlayer = () => {
    if (!editModal.name.trim()) { toast("Name cannot be empty", "error"); return; }
    updateState((s) => {
      const p = s.players.find((pl) => pl.id === editModal.id);
      p.name = editModal.name.trim();
      p.category = editModal.category;
      p.role = editModal.role;
      p.basePrice = editModal.basePrice;
    });
    toast(`✏️ ${editModal.name} updated!`, "success");
    setEditModal(null);
  };

  const removePlayer = (playerId) => {
    const p = getPlayer(playerId);
    if (!p) return;
    updateState((s) => {
      const pl = s.players.find((pl) => pl.id === playerId);
      if (pl.status === "sold") {
        const t = s.teams.find((tm) => tm.id === pl.teamId);
        if (t) {
          t.players = t.players.filter((pid) => pid !== playerId);
          t.pointsSpent = Math.max(0, t.pointsSpent - (pl.soldPrice || 0));
        }
      }
      s.queue = s.queue.filter((id) => id !== playerId);
      if (s.currentBid.playerId === playerId) s.currentBid = { playerId: null, amount: 0, leadingTeamId: null };
      s.players = s.players.filter((pl) => pl.id !== playerId);
    });
    toast(`🗑 ${p.name} removed.`, "warning");
  };

  // Teams page
  const [teamsView, setTeamsView] = useState("list"); // 'list' | teamId
  const addNewTeam = (name, color, pts) => {
    if (!name) { toast("Enter a team name", "error"); return false; }
    if (state.teams.find((t) => t.name.toLowerCase() === name.toLowerCase())) { toast("Team name already exists!", "error"); return false; }
    const newTeam = { id: "team_" + Date.now(), name, color, points: pts, pointsSpent: 0, players: [], rtmUsed: false };
    updateState((s) => { s.teams.push(newTeam); });
    toast(`🏆 Team "${name}" added!`, "success");
    return true;
  };
  const deleteTeam = (teamId) => {
    const team = getTeam(teamId);
    if (!team) return;
    if (team.players.length > 0) { toast(`Cannot delete "${team.name}" — they have ${team.players.length} players. Release players first.`, "error"); return; }
    updateState((s) => { s.teams = s.teams.filter((t) => t.id !== teamId); });
    toast("Team deleted.", "warning");
  };

  const switchQueueTab = (key) => updateState((s) => { s.activeQueueTab = key; });

  /* ═══════════════════════════════════════════
     REGISTERED PLAYERS
  ═══════════════════════════════════════════ */
  const [registeredPlayers, setRegisteredPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem("vcl_registered");
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("vcl_registered", JSON.stringify(registeredPlayers)); } catch(e) {}
  }, [registeredPlayers]);

  const [regEditModal, setRegEditModal] = useState(null);

  const addRegisteredPlayer = (name, role, category, basePrice, phone) => {
    if (!name.trim()) { toast("Enter a player name", "error"); return false; }
    if (basePrice < 10 || basePrice > 500) { toast("Base price must be 10–500", "error"); return false; }
    const player = {
      id: "reg_" + Date.now() + Math.random().toString(36).slice(2,5),
      name: name.trim(), role, category, basePrice, phone: phone.trim(),
      registeredAt: new Date().toLocaleDateString("en-IN"),
      addedToAuction: false,
    };
    setRegisteredPlayers((prev) => [...prev, player]);
    toast(`✅ ${name} registered!`, "success");
    return true;
  };

  const removeRegisteredPlayer = (id) => {
    const p = registeredPlayers.find((r) => r.id === id);
    setRegisteredPlayers((prev) => prev.filter((r) => r.id !== id));
    if (p) toast(`🗑 ${p.name} removed from registry.`, "warning");
  };

  const saveRegEditPlayer = () => {
    if (!regEditModal.name.trim()) { toast("Name cannot be empty", "error"); return; }
    setRegisteredPlayers((prev) => prev.map((r) => r.id === regEditModal.id ? { ...regEditModal, name: regEditModal.name.trim() } : r));
    toast(`✏️ ${regEditModal.name} updated!`, "success");
    setRegEditModal(null);
  };

  const sendToAuction = (id) => {
    const reg = registeredPlayers.find((r) => r.id === id);
    if (!reg) return;
    if (reg.addedToAuction) { toast(`${reg.name} is already in the auction queue!`, "warning"); return; }
    const ok = addPlayerToQueue(reg.name, reg.category, reg.role, reg.basePrice);
    if (ok) {
      setRegisteredPlayers((prev) => prev.map((r) => r.id === id ? { ...r, addedToAuction: true } : r));
      toast(`⚡ ${reg.name} sent to auction queue!`, "success");
    }
  };

  const pages = {
    dashboard: { title: "Dashboard", subtitle: "Season Overview · All Teams" },
    auction: { title: "Live Auction", subtitle: "Bidding Arena" },
    players: { title: "All Players", subtitle: "Complete player registry" },
    teams: { title: "Teams", subtitle: "Manage teams · View rosters" },
    stats: { title: "Statistics", subtitle: "Auction analytics" },
    leaderboard: { title: "Leaderboard", subtitle: "Live standings" },
    registered: { title: "Registered Players", subtitle: "Google Form Registrations · Categorize & Manage" },
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={theme} style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
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
          <Sidebar currentPage={currentPage} navigate={navigate} onToggleTheme={toggleTheme} theme={theme} onReset={() => setShowResetModal(true)} />
          <main className="main-content">
            <div className="page-header">
              <div className="page-title">{pages[currentPage]?.title}</div>
              <div className="page-subtitle">
                {currentPage === "auction" && <span className="status-dot live" />}
                {pages[currentPage]?.subtitle}
              </div>
            </div>
            <div className="page-content">
              {currentPage === "dashboard" && <DashboardPage state={state} getTeamRemaining={getTeamRemaining} getPlayer={getPlayer} onNavigate={navigate} onShowTeam={(id) => { setTeamsView(id); navigate("teams"); }} />}
              {currentPage === "auction" && (
                <AuctionPage
                  state={state} getTeam={getTeam} getPlayer={getPlayer} getTeamRemaining={getTeamRemaining} getTeamCatACount={getTeamCatACount}
                  onStartBidding={startBidding} onReAuction={reAuctionPlayer} onPlaceBid={placeBid} onIncrementBid={incrementBid}
                  onConfirmSoldFromSelect={confirmSoldFromSelect} onMarkUnsold={markUnsold} onUseRTM={useRTM} onUseWildcard={useWildcard}
                  onAddPlayer={addPlayerToQueue} onSwitchTab={switchQueueTab} soldToTeamId={soldToTeamId} setSoldToTeamId={setSoldToTeamId}
                />
              )}
              {currentPage === "players" && (
                <PlayersPage
                  state={state} getTeam={getTeam} playerSearch={playerSearch} setPlayerSearch={setPlayerSearch}
                  playerFilter={playerFilter} setPlayerFilter={setPlayerFilter} playerRoleFilter={playerRoleFilter} setPlayerRoleFilter={setPlayerRoleFilter}
                  onEdit={openEditPlayer} onRemove={removePlayer}
                />
              )}
              {currentPage === "teams" && (
                <TeamsPage
                  state={state} teamsView={teamsView} setTeamsView={setTeamsView} getTeam={getTeam} getPlayer={getPlayer}
                  getTeamRemaining={getTeamRemaining} onAddTeam={addNewTeam} onDeleteTeam={deleteTeam}
                />
              )}
              {currentPage === "stats" && <StatsPage state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} />}
              {currentPage === "leaderboard" && <LeaderboardPage state={state} getTeam={getTeam} getTeamRemaining={getTeamRemaining} getPlayer={getPlayer} />}
              {currentPage === "registered" && (
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

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
function Sidebar({ currentPage, navigate, onToggleTheme, theme, onReset }) {
  const navItems = [
    { key: "dashboard", icon: "🏏", label: "Dashboard" },
    { key: "auction", icon: "⚡", label: "Auction" },
    { key: "registered", icon: "📝", label: "Registered" },
    { key: "players", icon: "📋", label: "Players" },
    { key: "teams", icon: "🛡", label: "Teams" },
    { key: "stats", icon: "📊", label: "Statistics" },
    { key: "leaderboard", icon: "🏆", label: "Leaderboard" },
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">KPL<br />AUCTION</div>
        <div className="logo-sub">Kudei Premier League</div>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.key} className={`nav-item${currentPage === item.key ? " active" : ""}`} onClick={() => navigate(item.key)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={onToggleTheme}>
          <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button className="btn-danger" onClick={onReset}>🔄 Reset</button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function DashboardPage({ state, getTeamRemaining, getPlayer, onNavigate, onShowTeam }) {
  const maxRemaining = Math.max(...state.teams.map((t) => getTeamRemaining(t)));
  return (
    <>
      <div className="teams-grid">
        {state.teams.map((t) => {
          const remaining = getTeamRemaining(t);
          const pct = Math.round((remaining / 1000) * 100);
          const isTop = remaining === maxRemaining;
          const playerCount = t.players.length;
          const warnNeeded = playerCount < 10;
          return (
            <div key={t.id} className={`team-card${isTop ? " top-points" : ""}`} style={{ "--team-color": t.color }} onClick={() => onShowTeam(t.id)}>
              <div className="team-name" style={{ color: t.color }}>{t.name}</div>
              <div className="team-stats">
                <div><div className="stat-label">Total Points</div><div className="stat-value">1000</div></div>
                <div><div className="stat-label">Remaining</div><div className="stat-value" style={{ color: t.color }}>{remaining}</div></div>
                <div><div className="stat-label">Spent</div><div className="stat-value">{t.pointsSpent}</div></div>
                <div>
                  <div className="stat-label">Players Bought</div>
                  <div className="stat-value" style={{ color: warnNeeded ? "var(--gold)" : "var(--cat-c)" }}>
                    {playerCount}
                    {warnNeeded && <span className="warning-badge">⚠ Need {10 - playerCount}</span>}
                  </div>
                </div>
              </div>
              <div className="points-bar-wrap" title={`${pct}% remaining`}>
                <div className="points-bar" style={{ width: `${pct}%`, background: t.color }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textAlign: "right" }}>
                {pct}% remaining · RTM: {t.rtmUsed ? "✗ Used" : "✓ Available"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-title">Rules & Limits</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text-dim)" }}>
            <div>🎯 Each team starts with <strong style={{ color: "var(--text)" }}>1000 points</strong></div>
            <div>🅰️ Max <strong style={{ color: "var(--text)" }}>3 Category A</strong> players per team</div>
            <div>👥 Minimum <strong style={{ color: "var(--text)" }}>10 players</strong> per team required</div>
            <div>⚡ Each team has <strong style={{ color: "var(--text)" }}>1 RTM</strong> (Right to Match)</div>
            <div>🃏 Wildcard pick costs a fixed <strong style={{ color: "var(--text)" }}>50 points</strong></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-primary" onClick={() => onNavigate("auction")}>⚡ Start Auction</button>
            <button className="btn-primary" onClick={() => onNavigate("players")} style={{ background: "var(--bg-card2)", color: "var(--text)", border: "1px solid var(--border)" }}>📋 View All Players</button>
            <button className="btn-primary" onClick={() => onNavigate("stats")} style={{ background: "var(--bg-card2)", color: "var(--text)", border: "1px solid var(--border)" }}>📊 Statistics</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   AUCTION PAGE
═══════════════════════════════════════════ */
function AuctionPage({ state, getTeam, getPlayer, getTeamRemaining, getTeamCatACount, onStartBidding, onReAuction, onPlaceBid, onIncrementBid, onConfirmSoldFromSelect, onMarkUnsold, onUseRTM, onUseWildcard, onAddPlayer, onSwitchTab, soldToTeamId, setSoldToTeamId }) {
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("C");
  const [newRole, setNewRole] = useState("BAT");
  const [newPrice, setNewPrice] = useState(50);

  const handleAddPlayer = () => {
    const ok = onAddPlayer(newName, newCat, newRole, newPrice);
    if (ok) { setNewName(""); setNewPrice(50); }
  };

  const { playerId, amount, leadingTeamId } = state.currentBid;
  const currentPlayer = playerId ? getPlayer(playerId) : null;
  const leadTeam = leadingTeamId ? getTeam(leadingTeamId) : null;

  // Tab counts
  const getTabCount = (key) => {
    if (key === "UNSOLD") return state.players.filter((p) => p.status === "unsold").length;
    return state.queue.filter((id) => {
      const p = getPlayer(id);
      return p && p.status === "pending" && (p.role || "BAT") === key;
    }).length;
  };

  // Queue players for current tab
  let queuePlayers = [];
  if (state.activeQueueTab === "UNSOLD") {
    queuePlayers = state.players.filter((p) => p.status === "unsold");
  } else {
    queuePlayers = state.queue.map(getPlayer).filter((p) => p && p.status === "pending" && (p.role || "BAT") === state.activeQueueTab);
  }

  const tab = QUEUE_TABS.find((t) => t.key === state.activeQueueTab) || QUEUE_TABS[0];

  return (
    <div className="auction-layout">
      {/* LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        <div className="auction-stage">
          <div className="auction-stage-header">
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)" }}>⚡ On the Block</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {playerId ? <><span className="status-dot live" /> LIVE</> : "Select a player to start"}
            </span>
          </div>
          <div className="auction-player-display">
            {!currentPlayer ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏏</div>
                <div className="empty-state-text">Pick a role tab on the right → click a player to start bidding</div>
              </div>
            ) : (
              <BiddingDisplay player={currentPlayer} amount={amount} leadTeam={leadTeam} leadingTeamId={leadingTeamId} teams={state.teams} getTeamRemaining={getTeamRemaining} getTeamCatACount={getTeamCatACount} players={state.players} onPlaceBid={onPlaceBid} onIncrementBid={onIncrementBid} onConfirmSoldFromSelect={onConfirmSoldFromSelect} onMarkUnsold={onMarkUnsold} onUseRTM={onUseRTM} onUseWildcard={onUseWildcard} soldToTeamId={soldToTeamId} setSoldToTeamId={setSoldToTeamId} />
            )}
          </div>
        </div>

        {/* Recent results */}
        {state.recentResults && state.recentResults.length > 0 && (
          <div className="card">
            <div className="card-title">🕐 Recent Decisions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {state.recentResults.map((r, i) => {
                const p = getPlayer(r.playerId);
                const team = r.teamId ? getTeam(r.teamId) : null;
                if (!p) return null;
                const ri = getRoleInfo(p.role || "BAT");
                const isSold = r.status === "sold";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: isSold ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${isSold ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 16 }}>{isSold ? "✅" : "❌"}</span>
                    <span style={{ fontSize: 13 }}>{ri.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{p.name}</span>
                    <span className={`category-chip ${p.category}`} style={{ fontSize: 9, padding: "1px 5px" }}>{p.category}</span>
                    {isSold && team ? (
                      <>
                        <span style={{ fontSize: 12, fontWeight: 700, color: team.color }}>{team.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--gold)", fontWeight: 700 }}>{r.amount} pts</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--cat-a)", fontWeight: 700 }}>UNSOLD</span>
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
        {/* Add player form */}
        <div className="card add-player-form">
          <div className="card-title">Add Player to Queue</div>
          <div className="form-row">
            <label className="form-label">Player Name</label>
            <input className="form-input" placeholder="e.g. Ravi Kumar" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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

        {/* Tabbed queue */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
            {QUEUE_TABS.map((t) => {
              const count = getTabCount(t.key);
              const isActive = state.activeQueueTab === t.key;
              return (
                <button key={t.key} onClick={() => onSwitchTab(t.key)} style={{ flex: "none", padding: "10px 12px", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-body)", border: "none", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", background: isActive ? "var(--bg-card2)" : "transparent", color: isActive ? t.color : "var(--text-muted)", borderBottom: `2px solid ${isActive ? t.color : "transparent"}`, letterSpacing: 0.5 }}>
                  {t.label} <span style={{ background: isActive ? t.color + "22" : "var(--border)", color: isActive ? t.color : "var(--text-muted)", padding: "1px 5px", borderRadius: 10, fontSize: 10, marginLeft: 2 }}>{count}</span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8, color: tab.color }}>
              {tab.label} — {queuePlayers.length} player{queuePlayers.length !== 1 ? "s" : ""}
            </div>
            <div className="player-queue">
              {queuePlayers.length === 0 ? (
                <div className="empty-state" style={{ padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{state.activeQueueTab === "UNSOLD" ? "✅" : "🎉"}</div>
                  <div className="empty-state-text" style={{ fontSize: 12 }}>{state.activeQueueTab === "UNSOLD" ? "No unsold players" : `All ${tab.label} auctioned!`}</div>
                </div>
              ) : queuePlayers.map((p) => {
                const ri = getRoleInfo(p.role || "BAT");
                const isActive = state.currentBid.playerId === p.id;
                const canReauction = state.activeQueueTab === "UNSOLD";
                return (
                  <div key={p.id} className={`queue-item${isActive ? " auctioning" : ""}`}
                    style={{ borderLeft: isActive ? `3px solid ${ri.color}` : "3px solid transparent", background: isActive ? ri.bg : undefined }}
                    onClick={() => canReauction ? onReAuction(p.id) : onStartBidding(p.id)}>
                    <span className={`cat-dot ${p.category}`} />
                    <span className="queue-item-name" style={{ fontSize: 13 }}>{p.name}</span>
                    <span className={`category-chip ${p.category}`} style={{ fontSize: 9, padding: "1px 5px" }}>{p.category}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginLeft: 4 }}>{p.basePrice}pts</span>
                    {isActive && <span style={{ fontSize: 9, color: ri.color, fontWeight: 800, marginLeft: 4 }}>▶ LIVE</span>}
                    {canReauction && <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, marginLeft: 4 }}>↩ Re-Bid</span>}
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

/* ═══════════════════════════════════════════
   BIDDING DISPLAY
═══════════════════════════════════════════ */
function BiddingDisplay({ player, amount, leadTeam, leadingTeamId, teams, getTeamRemaining, getTeamCatACount, players, onPlaceBid, onIncrementBid, onConfirmSoldFromSelect, onMarkUnsold, onUseRTM, onUseWildcard, soldToTeamId, setSoldToTeamId }) {
  const ri = getRoleInfo(player.role);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span className={`category-chip ${player.category}`} style={{ fontSize: 12 }}>{player.category} — {player.category === "A" ? "⭐ Star" : player.category === "B" ? "👍 Good" : "✅ Regular"}</span>
        <span style={{ background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{ri.icon} {ri.label}</span>
      </div>
      <div className="auction-player-name" style={{ fontSize: 40 }}>{player.name}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Base Price: <strong style={{ color: "var(--text)" }}>{player.basePrice} pts</strong></div>

      {/* Step 1 */}
      <div style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Step 1 — Current Bid Amount</div>
        <div className="bid-amount" style={{ fontSize: 48, marginBottom: 4 }}>{amount} <span style={{ fontSize: 18, color: "var(--text-muted)" }}>pts</span></div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
          {leadTeam ? <>🔥 Leader: <strong style={{ color: leadTeam.color }}>{leadTeam.name}</strong></> : "⏳ No bid yet — select a team below"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {[5, 10, 25, 50].map((n) => <button key={n} className="inc-btn" onClick={() => onIncrementBid(n)}>+{n}</button>)}
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Step 2 — Which Team is Bidding?</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(teams.length, 4)}, 1fr)`, gap: 8 }}>
          {teams.map((t) => {
            const rem = getTeamRemaining(t);
            const catAFull = getTeamCatACount(t, players) >= 3 && player.category === "A";
            const cannotBid = rem < amount || catAFull;
            const isLeading = t.id === leadingTeamId;
            const reason = catAFull ? "Cat-A full" : "Low points";
            return (
              <button key={t.id} onClick={() => !cannotBid && onPlaceBid(t.id)} title={cannotBid ? reason : "Bid for " + t.name}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 8px", borderRadius: 10, fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: cannotBid ? "not-allowed" : "pointer", border: `2px solid ${isLeading ? t.color : "var(--border)"}`, background: isLeading ? t.color + "25" : "var(--bg-card2)", color: cannotBid ? "var(--text-muted)" : isLeading ? t.color : "var(--text)", opacity: cannotBid ? 0.4 : 1, transition: "all 0.15s", boxShadow: isLeading ? `0 0 0 2px ${t.color}44` : "none" }}>
                <span style={{ fontSize: 18 }}>{isLeading ? "★" : "🏏"}</span>
                <span style={{ fontSize: 12, textAlign: "center", lineHeight: 1.2 }}>{t.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: cannotBid ? "var(--cat-a)" : "var(--text-muted)" }}>{cannotBid ? reason : rem + " pts"}</span>
                {isLeading && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: t.color }}>LEADING</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 */}
      <div style={{ background: "#22c55e12", border: "2px solid #22c55e44", borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "var(--cat-c)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, marginBottom: 10 }}>Step 3 — Confirm Sale</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Choose which team gets this player:</div>
        <select className="form-input" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }} value={soldToTeamId} onChange={(e) => setSoldToTeamId(e.target.value)}>
          <option value="">— Select Team to Sell To —</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}  —  {getTeamRemaining(t)} pts left</option>)}
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onConfirmSoldFromSelect} style={{ flex: 2, background: "#22c55e", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-body)", cursor: "pointer", border: "none", boxShadow: "0 4px 12px rgba(34,197,94,0.3)", transition: "all 0.15s" }}>✓ SOLD — Assign Player</button>
          <button onClick={onMarkUnsold} style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: 12, borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: "uppercase", fontFamily: "var(--font-body)", cursor: "pointer" }}>✗ Unsold</button>
        </div>
      </div>

      {/* Special actions */}
      <div style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, marginBottom: 8 }}>Special Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          {teams.map((t) => (
            <button key={t.id} className="rtm-btn" disabled={t.rtmUsed} onClick={() => onUseRTM(t.id)} style={{ fontSize: 11, padding: "6px 10px" }}>
              ⚡ {t.name.split(" ")[0]} RTM{t.rtmUsed ? " ✗" : ""}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {teams.map((t) => (
            <button key={t.id} className="wildcard-btn" onClick={() => onUseWildcard(t.id)} style={{ fontSize: 11, padding: "6px 10px" }}>
              🃏 {t.name.split(" ")[0]} WC (50)
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   PLAYERS PAGE
═══════════════════════════════════════════ */
function PlayersPage({ state, getTeam, playerSearch, setPlayerSearch, playerFilter, setPlayerFilter, playerRoleFilter, setPlayerRoleFilter, onEdit, onRemove }) {
  const filtered = state.players.filter((p) => {
    const matchCat = playerFilter === "ALL" || p.category === playerFilter;
    const matchRole = playerRoleFilter === "ALL" || (p.role || "BAT") === playerRoleFilter;
    const matchName = p.name.toLowerCase().includes(playerSearch.toLowerCase());
    return matchCat && matchRole && matchName;
  });

  return (
    <>
      <div className="table-controls">
        <input className="search-input" placeholder="🔍  Search player..." value={playerSearch} onChange={(e) => setPlayerSearch(e.target.value)} />
        <div className="filter-btns">
          {["ALL", "A", "B", "C"].map((cat) => (
            <button key={cat} className={`filter-btn ${cat}${playerFilter === cat ? " active" : ""}`} onClick={() => setPlayerFilter(cat)}>{cat === "ALL" ? "All" : cat}</button>
          ))}
        </div>
        <div className="filter-btns">
          {[{ key: "ALL", label: "All Roles" }, { key: "BAT", label: "🏏 Bat" }, { key: "BWL", label: "🎯 Bowl" }, { key: "AR", label: "⚡ AR" }, { key: "WK", label: "🧤 WK" }].map((r) => (
            <button key={r.key} className={`filter-btn${playerRoleFilter === r.key ? " active" : ""}`} onClick={() => setPlayerRoleFilter(r.key)}>{r.label}</button>
          ))}
        </div>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Player</th><th>Role</th><th>Cat</th><th>Base</th><th>Sold</th><th>Team</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}><div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">No players found</div></div></td></tr>
            ) : filtered.map((p, i) => {
              const team = p.teamId ? getTeam(p.teamId) : null;
              const ri = getRoleInfo(p.role || "BAT");
              const statusColor = p.status === "sold" ? "var(--cat-c)" : p.status === "unsold" ? "var(--cat-a)" : "var(--text-muted)";
              const statusIcon = p.status === "sold" ? "✅" : p.status === "unsold" ? "❌" : "⏳";
              return (
                <tr key={p.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</td>
                  <td><span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: ri.bg, color: ri.color, border: `1px solid ${ri.border}`, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{ri.icon} {ri.label}</span></td>
                  <td><span className={`category-chip ${p.category}`} style={{ padding: "2px 8px", fontSize: 11 }}>{p.category}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{p.basePrice}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>{p.soldPrice || "—"}</td>
                  <td>{team ? <span className="team-tag" style={{ background: team.color + "20", color: team.color, border: `1px solid ${team.color}40`, whiteSpace: "nowrap" }}>{team.name}</span> : <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                  <td style={{ color: statusColor, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{statusIcon} {p.status}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onEdit(p.id)} style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "5px 10px", borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", whiteSpace: "nowrap" }}>✏️ Edit</button>
                      <button onClick={() => onRemove(p.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--cat-a)", padding: "5px 10px", borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", whiteSpace: "nowrap" }}>🗑 Remove</button>
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

/* ═══════════════════════════════════════════
   TEAMS PAGE
═══════════════════════════════════════════ */
function TeamsPage({ state, teamsView, setTeamsView, getTeam, getPlayer, getTeamRemaining, onAddTeam, onDeleteTeam }) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#f97316");
  const [newPts, setNewPts] = useState(1000);

  const handleAdd = () => {
    const ok = onAddTeam(newName, newColor, newPts);
    if (ok) setNewName("");
  };

  if (teamsView !== "list") {
    const team = getTeam(teamsView);
    if (!team) { setTeamsView("list"); return null; }
    const remaining = getTeamRemaining(team);
    const catA = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === "A"; }).length;
    const catB = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === "B"; }).length;
    const catC = team.players.filter((pid) => { const p = getPlayer(pid); return p && p.category === "C"; }).length;
    return (
      <>
        <button className="back-btn" onClick={() => setTeamsView("list")}>← Back to All Teams</button>
        <div className="team-detail-header" style={{ "--team-color": team.color }}>
          <div className="team-detail-color-bar" style={{ background: team.color }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: team.color, letterSpacing: 2, lineHeight: 1 }}>{team.name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{team.players.length} players · {team.pointsSpent} pts spent · {remaining} pts remaining</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Budget", value: team.points, color: "var(--text)" },
            { label: "Spent", value: team.pointsSpent, color: "var(--cat-a)" },
            { label: "Remaining", value: remaining, color: team.color },
            { label: "Total Players", value: team.players.length, color: "var(--cat-c)", warn: team.players.length < 10 ? 10 - team.players.length : null },
            { label: "Cat A Players", value: `${catA} / 3`, color: "var(--cat-a)" },
            { label: "Cat B Players", value: catB, color: "var(--cat-b)" },
            { label: "Cat C Players", value: catC, color: "var(--cat-c)" },
            { label: "RTM", value: team.rtmUsed ? "✗ Used" : "✓ Avail", color: "var(--text)" },
          ].map((s, i) => (
            <div className="card" key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: s.color }}>
                {s.value}
                {s.warn && <span className="warning-badge">⚠ Need {s.warn}</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>🏏 Player Roster</div>
        {team.players.length === 0 ? (
          <div className="empty-state" style={{ padding: 32 }}><div className="empty-state-icon">😶</div><div className="empty-state-text">No players bought yet</div></div>
        ) : (
          <div className="data-table">
            <table>
              <thead><tr><th>#</th><th>Player</th><th>Category</th><th>Base Price</th><th>Sold For</th></tr></thead>
              <tbody>
                {team.players.map((pid, i) => {
                  const p = getPlayer(pid);
                  if (!p) return null;
                  return (
                    <tr key={pid}>
                      <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td><span className={`category-chip ${p.category}`} style={{ padding: "2px 8px", fontSize: 11 }}>{p.category}</span></td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{p.basePrice}</td>
                      <td style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", fontWeight: 700 }}>{p.soldPrice}</td>
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

  return (
    <>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">➕ Add New Team</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
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
          <button className="btn-primary" onClick={handleAdd} style={{ flex: "none", width: "auto", padding: "10px 20px", whiteSpace: "nowrap" }}>+ Add Team</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {state.teams.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏟</div><div className="empty-state-text">No teams yet. Add one above!</div></div>
        ) : state.teams.map((t) => {
          const remaining = getTeamRemaining(t);
          const pct = Math.max(0, Math.round((remaining / t.points) * 100));
          return (
            <div key={t.id} className="team-card" style={{ "--team-color": t.color }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="team-name" style={{ color: t.color, marginBottom: 0 }}>{t.name}</div>
                <button onClick={() => onDeleteTeam(t.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "2px 6px", borderRadius: 4 }}>🗑</button>
              </div>
              <div className="team-stats" style={{ marginBottom: 12 }}>
                <div><div className="stat-label">Budget</div><div className="stat-value" style={{ fontSize: 16 }}>{t.points}</div></div>
                <div><div className="stat-label">Remaining</div><div className="stat-value" style={{ fontSize: 16, color: t.color }}>{remaining}</div></div>
                <div><div className="stat-label">Spent</div><div className="stat-value" style={{ fontSize: 16 }}>{t.pointsSpent}</div></div>
                <div><div className="stat-label">Players</div><div className="stat-value" style={{ fontSize: 16, color: "var(--cat-c)" }}>{t.players.length}</div></div>
              </div>
              <div className="points-bar-wrap" style={{ marginBottom: 12 }}>
                <div className="points-bar" style={{ width: `${pct}%`, background: t.color }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setTeamsView(t.id)} style={{ flex: 1, padding: "9px 0", background: t.color + "22", border: `1px solid ${t.color}66`, color: t.color, borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.15s" }}>👁 View Players ({t.players.length})</button>
                <div style={{ padding: "9px 10px", background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>RTM: {t.rtmUsed ? "✗" : "✓"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   STATS PAGE
═══════════════════════════════════════════ */
function StatsPage({ state, getTeam, getTeamRemaining }) {
  const soldPlayers = state.players.filter((p) => p.status === "sold");
  const totalSold = soldPlayers.length;
  const mostExpensive = soldPlayers.reduce((max, p) => !max || p.soldPrice > max.soldPrice ? p : max, null);
  const cheapest = soldPlayers.reduce((min, p) => !min || p.soldPrice < min.soldPrice ? p : min, null);
  const mostExpensiveTeam = state.teams.reduce((max, t) => !max || t.pointsSpent > max.pointsSpent ? t : max, null);
  const avgPrice = totalSold > 0 ? Math.round(soldPlayers.reduce((s, p) => s + p.soldPrice, 0) / totalSold) : 0;

  const statCards = [
    { icon: "👑", label: "Most Expensive Player", value: mostExpensive ? mostExpensive.soldPrice + " pts" : "—", detail: mostExpensive ? `${mostExpensive.name} (${getTeam(mostExpensive.teamId)?.name || ""})` : "No sales yet" },
    { icon: "🏆", label: "Most Spending Team", value: mostExpensiveTeam?.pointsSpent || 0, detail: mostExpensiveTeam?.name || "—", color: mostExpensiveTeam?.color || "var(--gold)" },
    { icon: "💸", label: "Cheapest Player", value: cheapest ? cheapest.soldPrice + " pts" : "—", detail: cheapest ? cheapest.name : "No sales yet" },
    { icon: "🎯", label: "Total Players Sold", value: totalSold, detail: `of ${state.players.length} total players` },
    { icon: "📊", label: "Average Sale Price", value: avgPrice + " pts", detail: "across all sold players" },
    { icon: "🔴", label: "Category A Sold", value: soldPlayers.filter((p) => p.category === "A").length, detail: `of ${state.players.filter((p) => p.category === "A").length} total`, color: "var(--cat-a)" },
  ];

  return (
    <>
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color || "var(--gold)" }}>{s.value}</div>
            <div className="stat-card-detail">{s.detail}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-title">Team Spending Breakdown</div>
          {state.teams.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 120, fontWeight: 700, fontSize: 14, color: t.color }}>{t.name}</div>
              <div style={{ flex: 1, background: "var(--bg-card2)", borderRadius: 4, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (t.pointsSpent / 1000) * 100)}%`, background: t.color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, width: 60, textAlign: "right" }}>{t.pointsSpent} pts</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Category Distribution</div>
          {["A", "B", "C"].map((cat) => {
            const all = state.players.filter((p) => p.category === cat).length;
            const sold = soldPlayers.filter((p) => p.category === cat).length;
            const pct = all > 0 ? Math.round((sold / all) * 100) : 0;
            const color = cat === "A" ? "var(--cat-a)" : cat === "B" ? "var(--cat-b)" : "var(--cat-c)";
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span className={`category-chip ${cat}`} style={{ padding: "3px 10px", width: 30, textAlign: "center" }}>{cat}</span>
                <div style={{ flex: 1, background: "var(--bg-card2)", borderRadius: 4, height: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", width: 80, textAlign: "right" }}>{sold}/{all} sold</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   LEADERBOARD PAGE
═══════════════════════════════════════════ */
function LeaderboardPage({ state, getTeam, getTeamRemaining, getPlayer }) {
  const sorted = [...state.teams].sort((a, b) => b.players.length - a.players.length || a.pointsSpent - b.pointsSpent);
  const soldPlayers = state.players.filter((p) => p.status === "sold");
  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>Rankings by Players Bought</div>
        {sorted.map((t, i) => {
          const pct = Math.round((getTeamRemaining(t) / t.points) * 100);
          return (
            <div key={t.id} className="leaderboard-row" style={{ "--team-color": t.color }}>
              <div className={`rank-num${i === 0 ? " gold" : ""}`} style={i === 1 ? { color: "#94a3b8" } : {}}>{i + 1}</div>
              <div style={{ width: 4, height: 40, borderRadius: 2, background: t.color, marginRight: 4 }} />
              <div className="lb-team-name" style={{ color: t.color }}>{t.name}</div>
              <div className="lb-stat">{t.players.length} players</div>
              <div className="lb-stat" style={{ marginLeft: 12 }}>{t.pointsSpent} spent</div>
              <div className="lb-stat" style={{ marginLeft: 12, color: "var(--cat-c)" }}>{getTeamRemaining(t)} left</div>
              <div style={{ marginLeft: 12, fontSize: 11, color: "var(--text-muted)" }}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>Top 5 Most Expensive Players</div>
        {soldPlayers.length === 0 ? (
          <div className="empty-state"><div className="empty-state-text">No players sold yet</div></div>
        ) : [...soldPlayers].sort((a, b) => b.soldPrice - a.soldPrice).slice(0, 5).map((p, i) => {
          const team = getTeam(p.teamId);
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 8 }}>
              <div className={`rank-num${i === 0 ? " gold" : ""}`} style={{ fontSize: 20 }}>{i + 1}</div>
              <span className={`cat-dot ${p.category}`} />
              <div style={{ flex: 1, fontWeight: 700 }}>{p.name}</div>
              <span className={`category-chip ${p.category}`} style={{ padding: "2px 8px", fontSize: 10 }}>{p.category}</span>
              {team && <span className="team-tag" style={{ background: team.color + "20", color: team.color, border: `1px solid ${team.color}40` }}>{team.name}</span>}
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", fontWeight: 700, fontSize: 16 }}>{p.soldPrice} pts</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   REGISTERED PAGE
═══════════════════════════════════════════ */
function RegisteredPage({ players, onAdd, onRemove, onEdit, onSendToAuction }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("BAT");
  const [category, setCategory] = useState("C");
  const [basePrice, setBasePrice] = useState(50);
  const [phone, setPhone] = useState("");

  // Filters
  const [searchQ, setSearchQ] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterCat, setFilterCat] = useState("ALL");
  const [sortBy, setSortBy] = useState("name"); // name | price_asc | price_desc | date

  const handleAdd = () => {
    const ok = onAdd(name, role, category, basePrice, phone);
    if (ok) { setName(""); setPhone(""); setBasePrice(50); }
  };

  const filtered = players
    .filter((p) => {
      const mName = p.name.toLowerCase().includes(searchQ.toLowerCase());
      const mRole = filterRole === "ALL" || p.role === filterRole;
      const mCat  = filterCat  === "ALL" || p.category === filterCat;
      return mName && mRole && mCat;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.basePrice - b.basePrice;
      if (sortBy === "price_desc") return b.basePrice - a.basePrice;
      if (sortBy === "date")       return b.id.localeCompare(a.id);
      return a.name.localeCompare(b.name);
    });

  const roleColors = { BAT: "#f59e0b", BWL: "#3b82f6", AR: "#a855f7", WK: "#22c55e" };
  const roleLabels = { BAT: "🏏 Batsman", BWL: "🎯 Bowler", AR: "⚡ All-Rounder", WK: "🧤 Keeper" };
  const catColors  = { A: "var(--cat-a)", B: "var(--cat-b)", C: "var(--cat-c)" };

  // Stats summary
  const total   = players.length;
  const byRole  = ["BAT","BWL","AR","WK"].map(r => ({ r, count: players.filter(p=>p.role===r).length }));
  const byCat   = ["A","B","C"].map(c => ({ c, count: players.filter(p=>p.category===c).length }));
  const sentCnt = players.filter(p=>p.addedToAuction).length;

  return (
    <>
      {/* ── Summary strip ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:12, marginBottom:24 }}>
        <div className="card" style={{ textAlign:"center" }}>
          <div className="stat-label">Total Registered</div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:28, fontWeight:600, color:"var(--accent)" }}>{total}</div>
        </div>
        {byRole.map(({ r, count }) => (
          <div className="card" key={r} style={{ textAlign:"center" }}>
            <div className="stat-label">{roleLabels[r]}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:24, fontWeight:600, color:roleColors[r] }}>{count}</div>
          </div>
        ))}
        <div className="card" style={{ textAlign:"center" }}>
          <div className="stat-label">Sent to Auction</div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:24, fontWeight:600, color:"var(--cat-c)" }}>{sentCnt}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:20, alignItems:"start" }}>

        {/* ── LEFT: Add Player Form ── */}
        <div className="card" style={{ position:"sticky", top:0 }}>
          <div className="card-title">📝 Register New Player</div>
          <div className="form-row">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Ravi Kumar" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} />
          </div>
          <div className="form-row">
            <label className="form-label">Phone / WhatsApp</label>
            <input className="form-input" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="form-row">
              <label className="form-label">Role *</label>
              <select className="form-input" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="BAT">🏏 Batsman</option>
                <option value="BWL">🎯 Bowler</option>
                <option value="AR">⚡ All-Rounder</option>
                <option value="WK">🧤 Keeper</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Category *</label>
              <select className="form-input" value={category} onChange={e=>setCategory(e.target.value)}>
                <option value="A">A — Star</option>
                <option value="B">B — Good</option>
                <option value="C">C — Regular</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Base Price (pts) *</label>
            <input type="number" className="form-input" value={basePrice} min={10} max={500} onChange={e=>setBasePrice(parseInt(e.target.value)||50)} />
          </div>

          {/* Category guide */}
          <div style={{ background:"var(--bg-card2)", border:"1px solid var(--border)", borderRadius:8, padding:"10px 12px", marginBottom:12, fontSize:12, color:"var(--text-dim)", lineHeight:1.8 }}>
            <div style={{ fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:1, color:"var(--text-muted)", marginBottom:4 }}>Category Guide</div>
            <div><span style={{ color:"var(--cat-a)", fontWeight:700 }}>A — Star</span> · Base ≥ 100 pts</div>
            <div><span style={{ color:"var(--cat-b)", fontWeight:700 }}>B — Good</span> · Base 50–99 pts</div>
            <div><span style={{ color:"var(--cat-c)", fontWeight:700 }}>C — Regular</span> · Base 10–49 pts</div>
          </div>

          <button className="btn-primary" onClick={handleAdd} style={{ marginBottom:8 }}>
            ✚ Register Player
          </button>
        </div>

        {/* ── RIGHT: Player List ── */}
        <div>
          {/* Controls */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
            <input className="search-input" placeholder="🔍  Search name..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{ flex:1, minWidth:160 }} />
            <select className="form-input" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width:"auto", padding:"9px 12px" }}>
              <option value="name">Sort: Name A–Z</option>
              <option value="price_desc">Sort: Price ↓ High</option>
              <option value="price_asc">Sort: Price ↑ Low</option>
              <option value="date">Sort: Latest First</option>
            </select>
          </div>

          {/* Role filter tabs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
            {[["ALL","All Roles","var(--accent)"],["BAT","🏏 Batsmen","#f59e0b"],["BWL","🎯 Bowlers","#3b82f6"],["AR","⚡ All-Rounders","#a855f7"],["WK","🧤 Keepers","#22c55e"]].map(([key,label,col])=>(
              <button key={key} onClick={()=>setFilterRole(key)} style={{ padding:"7px 14px", borderRadius:6, fontFamily:"var(--font-body)", fontSize:12, fontWeight:700, border:`1px solid ${filterRole===key?col:"var(--border)"}`, background:filterRole===key?col+"22":"var(--bg-card)", color:filterRole===key?col:"var(--text-dim)", cursor:"pointer", transition:"all 0.15s" }}>{label} <span style={{ fontFamily:"var(--font-mono)", fontSize:10 }}>({key==="ALL"?players.length:players.filter(p=>p.role===key).length})</span></button>
            ))}
          </div>

          {/* Category filter tabs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            {[["ALL","All Categories","var(--accent)"],["A","⭐ Cat A","var(--cat-a)"],["B","👍 Cat B","var(--cat-b)"],["C","✅ Cat C","var(--cat-c)"]].map(([key,label,col])=>(
              <button key={key} onClick={()=>setFilterCat(key)} style={{ padding:"6px 12px", borderRadius:6, fontFamily:"var(--font-body)", fontSize:11, fontWeight:700, border:`1px solid ${filterCat===key?col:"var(--border)"}`, background:filterCat===key?col+"22":"var(--bg-card)", color:filterCat===key?col:"var(--text-dim)", cursor:"pointer", transition:"all 0.15s" }}>{label}</button>
            ))}
          </div>

          {/* Count bar */}
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:12, fontWeight:600 }}>
            Showing <span style={{ color:"var(--accent)" }}>{filtered.length}</span> of {players.length} players
          </div>

          {/* Player cards */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">{players.length === 0 ? "No players registered yet. Add one on the left!" : "No players match your filters."}</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filtered.map((p, i) => {
                const ri = ROLE_INFO[p.role] || ROLE_INFO.BAT;
                return (
                  <div key={p.id} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderLeft:`4px solid ${ri.color}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}>
                    {/* Index */}
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text-muted)", minWidth:22, textAlign:"right" }}>{i+1}</div>

                    {/* Name + meta */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:3, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        {p.name}
                        {p.addedToAuction && <span style={{ fontSize:10, background:"rgba(34,197,94,0.15)", color:"var(--cat-c)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:4, padding:"1px 6px", fontWeight:700 }}>⚡ In Auction</span>}
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ background:ri.bg, color:ri.color, border:`1px solid ${ri.border}`, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700 }}>{ri.icon} {ri.label}</span>
                        <span className={`category-chip ${p.category}`} style={{ fontSize:10, padding:"1px 7px" }}>{p.category}</span>
                        {p.phone && <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-mono)" }}>📱 {p.phone}</span>}
                        {p.registeredAt && <span style={{ fontSize:11, color:"var(--text-muted)" }}>🗓 {p.registeredAt}</span>}
                      </div>
                    </div>

                    {/* Base price */}
                    <div style={{ textAlign:"center", minWidth:60 }}>
                      <div style={{ fontSize:10, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:600 }}>Base</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:16, fontWeight:700, color:"var(--gold)" }}>{p.basePrice}<span style={{ fontSize:10, color:"var(--text-muted)" }}>pts</span></div>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button onClick={()=>onSendToAuction(p.id)} title={p.addedToAuction?"Already in queue":"Send to Auction"} style={{ background:p.addedToAuction?"var(--bg-card2)":"rgba(34,197,94,0.1)", border:`1px solid ${p.addedToAuction?"var(--border)":"rgba(34,197,94,0.4)"}`, color:p.addedToAuction?"var(--text-muted)":"var(--cat-c)", padding:"6px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:p.addedToAuction?"not-allowed":"pointer", fontFamily:"var(--font-body)", whiteSpace:"nowrap" }}>
                        {p.addedToAuction ? "✓ Sent" : "⚡ Send"}
                      </button>
                      <button onClick={()=>onEdit(p)} style={{ background:"var(--accent-glow)", border:"1px solid var(--accent)", color:"var(--accent)", padding:"6px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>✏️</button>
                      <button onClick={()=>onRemove(p.id)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"var(--cat-a)", padding:"6px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>🗑</button>
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

/* ═══════════════════════════════════════════
   REG EDIT MODAL
═══════════════════════════════════════════ */
function RegEditModal({ data, onChange, onSave, onClose }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">✏️ Edit Registered Player</div>
        <div className="form-row">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={data.name} onChange={e=>onChange({...data,name:e.target.value})} />
        </div>
        <div className="form-row">
          <label className="form-label">Phone / WhatsApp</label>
          <input className="form-input" value={data.phone||""} onChange={e=>onChange({...data,phone:e.target.value})} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div className="form-row">
            <label className="form-label">Role</label>
            <select className="form-input" value={data.role} onChange={e=>onChange({...data,role:e.target.value})}>
              <option value="BAT">🏏 Batsman</option>
              <option value="BWL">🎯 Bowler</option>
              <option value="AR">⚡ All-Rounder</option>
              <option value="WK">🧤 Keeper</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <select className="form-input" value={data.category} onChange={e=>onChange({...data,category:e.target.value})}>
              <option value="A">A — Star</option>
              <option value="B">B — Good</option>
              <option value="C">C — Regular</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Base Price (pts)</label>
          <input type="number" className="form-input" value={data.basePrice} min={10} max={500} onChange={e=>onChange({...data,basePrice:parseInt(e.target.value)||data.basePrice})} />
        </div>
        <div className="modal-btns">
          <button className="btn-primary" onClick={onSave}>💾 Save Changes</button>
          <button className="btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


function ResetModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title" style={{ color: "var(--cat-a)" }}>⚠ Reset Auction?</div>
        <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 4 }}>This will erase ALL auction data — players sold, team rosters, bids.</p>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Only dummy data will remain. This cannot be undone.</p>
        <div className="modal-btns">
          <button className="btn-danger" onClick={onConfirm}>Yes, Reset Everything</button>
          <button className="btn-primary" onClick={onClose} style={{ background: "var(--bg-card2)", color: "var(--text)", border: "1px solid var(--border)" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditPlayerModal({ data, onChange, onSave, onClose }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">✏️ Edit Player</div>
        <div className="form-row">
          <label className="form-label">Player Name</label>
          <input className="form-input" value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="form-row">
            <label className="form-label">Category</label>
            <select className="form-input" value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value })}>
              <option value="A">A — Star</option>
              <option value="B">B — Good</option>
              <option value="C">C — Regular</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Role</label>
            <select className="form-input" value={data.role} onChange={(e) => onChange({ ...data, role: e.target.value })}>
              <option value="BAT">🏏 Batsman</option>
              <option value="BWL">🎯 Bowler</option>
              <option value="AR">⚡ All-Rounder</option>
              <option value="WK">🧤 Keeper</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Base Price (pts)</label>
          <input type="number" className="form-input" value={data.basePrice} min={10} max={500} onChange={(e) => onChange({ ...data, basePrice: parseInt(e.target.value) || data.basePrice })} />
        </div>
        <div className="modal-btns">
          <button className="btn-primary" onClick={onSave}>💾 Save Changes</button>
          <button className="btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOAST CONTAINER
═══════════════════════════════════════════ */
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}
