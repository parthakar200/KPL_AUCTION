
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
:root{
  --cat-a:#ef4444;--cat-b:#3b82f6;--cat-c:#22c55e;--gold:#f59e0b;
  --font-display:'Bebas Neue',sans-serif;--font-body:'Rajdhani',sans-serif;--font-mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-sm:6px;--transition:0.2s ease;
  --sidebar-w:220px;--sidebar-collapsed:60px;
}
.dark{--bg:#0a0e1a;--bg-card:#111827;--bg-card2:#1a2235;--border:#1e2d45;--text:#e2e8f0;--text-muted:#64748b;--text-dim:#94a3b8;--accent:#38bdf8;--accent-glow:rgba(56,189,248,0.2);--overlay:rgba(0,0,0,0.6);}
.light{--bg:#f0f4ff;--bg-card:#ffffff;--bg-card2:#e8eef8;--border:#cbd5e1;--text:#0f172a;--text-muted:#94a3b8;--text-dim:#475569;--accent:#0284c7;--accent-glow:rgba(2,132,199,0.15);--overlay:rgba(255,255,255,0.6);}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;font-size:16px;line-height:1.5;transition:background var(--transition),color var(--transition);}
button{cursor:pointer;font-family:var(--font-body);border:none;outline:none;}
input,select{font-family:var(--font-body);outline:none;}
table{border-collapse:collapse;width:100%;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}

/* ── APP SHELL ── */
.app-shell{display:flex;min-height:100vh;}

/* ── SIDEBAR ── */
.sidebar{width:var(--sidebar-w);background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:200;transition:transform 0.3s ease;}
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

/* Mobile sidebar overlay */
.sidebar-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:150;}
.sidebar-backdrop.open{display:block;}

/* ── MAIN CONTENT ── */
.main-content{margin-left:var(--sidebar-w);flex:1;min-height:100vh;overflow-x:hidden;}
.page-header{padding:28px 32px 0;border-bottom:1px solid var(--border);background:var(--bg-card);margin-bottom:28px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px;overflow:hidden;}
.page-title{font-family:var(--font-display);font-size:36px;letter-spacing:2px;color:var(--text);line-height:1;}
.page-subtitle{font-size:13px;color:var(--text-muted);margin-top:4px;margin-bottom:20px;text-transform:uppercase;letter-spacing:1px;}
.page-content{padding:0 32px 40px;}

/* ── MOBILE HAMBURGER ── */
.mob-menu-btn{display:none;position:fixed;top:14px;left:14px;z-index:300;background:var(--bg-card);border:1px solid var(--border);color:var(--text);width:38px;height:38px;border-radius:10px;font-size:18px;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);}

/* ── CARDS ── */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;}
.card-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:600;margin-bottom:12px;}

/* ── TEAMS ── */
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

/* ── AUCTION ── */
.auction-layout{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start;}
.auction-stage{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.auction-stage-header{padding:16px 20px;border-bottom:1px solid var(--border);background:var(--bg-card2);display:flex;align-items:center;justify-content:space-between;}
.auction-player-display{padding:28px;text-align:center;position:relative;overflow:hidden;}
.category-chip{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:4px 10px;border-radius:20px;}
.category-chip.A{background:rgba(239,68,68,0.15);color:var(--cat-a);border:1px solid rgba(239,68,68,0.3);}
.category-chip.B{background:rgba(59,130,246,0.15);color:var(--cat-b);border:1px solid rgba(59,130,246,0.3);}
.category-chip.C{background:rgba(34,197,94,0.15);color:var(--cat-c);border:1px solid rgba(34,197,94,0.3);}
.auction-player-name{font-family:var(--font-display);font-size:48px;letter-spacing:2px;line-height:1;margin-bottom:8px;}
@keyframes bidPulse{0%{transform:scale(1);}50%{transform:scale(1.06);}100%{transform:scale(1);}}
.bid-amount{font-family:var(--font-display);font-size:56px;color:var(--gold);letter-spacing:2px;line-height:1;}
.bid-amount.pulse{animation:bidPulse 0.4s ease;}
.auction-sidebar-panel{display:flex;flex-direction:column;gap:16px;}

/* ── FORMS ── */
.form-row{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.form-label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);font-weight:600;}
.form-input{background:var(--bg-card2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;color:var(--text);font-size:14px;font-weight:500;transition:border-color var(--transition);width:100%;}
.form-input:focus{border-color:var(--accent);}
.form-input option{background:var(--bg-card);}
.btn-primary{background:var(--accent);color:#fff;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;transition:all 0.15s;width:100%;}
.btn-primary:hover{filter:brightness(1.1);}
.btn-danger{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--cat-a);padding:9px 16px;border-radius:var(--radius-sm);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;transition:all 0.15s;width:100%;}
.btn-danger:hover{background:rgba(239,68,68,0.2);}

/* ── QUEUE ── */
.player-queue{max-height:300px;overflow-y:auto;}
.queue-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);cursor:pointer;transition:background var(--transition);border-bottom:1px solid var(--border);}
.queue-item:last-child{border-bottom:none;}
.queue-item:hover{background:var(--bg-card2);}
.queue-item.auctioning{background:var(--accent-glow);}
.queue-item-name{flex:1;font-weight:600;font-size:14px;}

/* ── TABLE / SEARCH ── */
.table-controls{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.search-input{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 14px;color:var(--text);font-size:14px;font-weight:500;width:240px;}
.search-input::placeholder{color:var(--text-muted);}
.search-input:focus{border-color:var(--accent);outline:none;}
.filter-btns{display:flex;gap:8px;}
.filter-btn{padding:8px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-dim);transition:all var(--transition);}
.filter-btn.active,.filter-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow);}
.filter-btn.A.active{border-color:var(--cat-a);color:var(--cat-a);background:rgba(239,68,68,0.1);}
.filter-btn.B.active{border-color:var(--cat-b);color:var(--cat-b);background:rgba(59,130,246,0.1);}
.filter-btn.C.active{border-color:var(--cat-c);color:var(--cat-c);background:rgba(34,197,94,0.1);}

/* ── DATA TABLE ── */
.data-table{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.data-table th{padding:12px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:700;background:var(--bg-card2);border-bottom:1px solid var(--border);}
.data-table td{padding:12px 16px;font-size:14px;font-weight:500;border-bottom:1px solid var(--border);color:var(--text);}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:var(--bg-card2);}

/* ── MISC ── */
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
.toast-container{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 48px);}
@keyframes toastIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
.toast{background:var(--bg-card);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:var(--radius-sm);padding:12px 16px;font-size:13px;font-weight:600;min-width:220px;box-shadow:0 4px 16px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;}
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

/* ════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ════════════════════════════════════════════ */

/* ── Tablet (≤900px) ── */
@media(max-width:900px){
  .auction-layout{grid-template-columns:1fr;}
  .teams-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));}
  .stats-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));}
  .page-header{padding:20px 20px 0;}
  .page-content{padding:0 20px 40px;}
}

/* ── Mobile (≤640px) ── */
@media(max-width:640px){
  :root{--sidebar-w:0px;}

  /* Sidebar slides in as drawer */
  .sidebar{width:260px;transform:translateX(-100%);}
  .sidebar.mob-open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,0.4);}

  /* Hamburger button visible */
  .mob-menu-btn{display:flex;}

  /* Main takes full width, topbar handles its own height */
  .main-content{margin-left:0;padding-top:0;}

  /* Sticky topbar: hamburger | title + subtitle | badges — ONE single row */
  .page-header{
    position:sticky;top:0;z-index:100;
    display:flex;flex-direction:row;align-items:center;
    padding:0 10px 0 0;
    margin-bottom:12px;
    min-height:54px;
    gap:0;
    overflow:hidden;
    flex-wrap:nowrap;
  }
  /* Inner div wraps title+subtitle, sits beside the fixed hamburger btn */
  .page-header > div{min-width:0;flex:1;overflow:hidden;padding-left:58px;padding-right:6px;}
  .page-title{font-size:19px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.1;margin-bottom:1px;}
  .page-subtitle{font-size:10px;margin-bottom:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:flex;align-items:center;gap:5px;}
  .page-content{padding:0 10px 32px;}

  /* Cards */
  .card{padding:14px;}

  /* Auction — single column, full width, centered */
  .auction-layout{grid-template-columns:1fr;gap:12px;width:100%;}
  .auction-stage{width:100%;overflow:hidden;}
  .auction-stage-header{padding:10px 14px;}
  .auction-player-display{padding:14px;width:100%;box-sizing:border-box;text-align:center;}
  .auction-player-name{font-size:24px !important;word-break:break-word;width:100%;}
  .bid-amount{font-size:34px !important;}
  .auction-photo-circle{width:76px !important;height:76px !important;}

  /* Team bid buttons — 2 per row on mobile */
  .auction-team-grid{grid-template-columns:repeat(2,1fr) !important;}

  /* Inc buttons wrap */
  .inc-btn{padding:8px 10px;font-size:12px;flex:1;}

  /* Queue — taller, no clipping */
  .player-queue{max-height:320px;overflow-y:auto;}

  /* Queue items — prevent name overflow */
  .queue-item{width:100%;box-sizing:border-box;overflow:hidden;}
  .queue-item-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}

  /* Recent decision rows — no overflow */
  .auction-recent-row{width:100%;box-sizing:border-box;overflow:hidden;flex-wrap:nowrap !important;}

  /* Queue tabs — horizontal scroll, no clip */
  .auction-queue-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;display:flex;}
  .auction-queue-tabs::-webkit-scrollbar{display:none;}
  .auction-queue-tabs button{flex-shrink:0;min-width:auto;}

  /* Teams */
  .teams-grid{grid-template-columns:1fr;}
  .team-stats{grid-template-columns:repeat(3,1fr);}

  /* Stats */
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .stat-card{padding:14px;}
  .stat-card-value{font-size:24px;}

  /* Search full width */
  .search-input{width:100%;}
  .table-controls{flex-direction:column;align-items:stretch;}

  /* Leaderboard */
  .leaderboard-row{gap:8px;padding:10px 12px;}
  .lb-stat{font-size:11px;}

  /* Toasts bottom center on mobile */
  .toast-container{bottom:16px;right:16px;left:16px;max-width:100%;}
  .toast{min-width:unset;width:100%;}

  /* Modals full-screen friendly */
  .modal{padding:20px;width:95%;}

  /* Increment buttons wrap nicely */
  .inc-btn{padding:8px 12px;font-size:12px;}

  /* Queue height shorter on mobile */
  .player-queue{max-height:220px;}

  /* RTM / Wildcard buttons smaller */
  .rtm-btn,.wildcard-btn{padding:7px 10px;font-size:11px;}
}

/* ── Small mobile (≤380px) ── */
@media(max-width:380px){
  .page-title{font-size:22px;}
  .auction-player-name{font-size:26px;}
  .bid-amount{font-size:34px;}
  .stats-grid{grid-template-columns:1fr;}
  .team-stats{grid-template-columns:1fr 1fr;}
}
`;
