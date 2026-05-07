

import { ROLE_INFO, DEFAULT_TEAMS, DUMMY_PLAYERS } from '../constants/data';

/**
 * Compresses an image File to a base64 JPEG data URI.
 * Resizes longest side to max 800px at 80% quality → ~50-150KB output
 * regardless of original file size. Keeps API payloads fast.
 */
export function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export const getRoleInfo = (role) => ROLE_INFO[role] || ROLE_INFO['BAT'];

export const generateId = () => 'p' + Date.now() + Math.random().toString(36).slice(2, 5);

export const getTeamRemaining = (team) => team.points - team.pointsSpent;

export const getTeamCatACount = (team, players) =>
  team.players.filter((pid) => {
    const p = players.find((pl) => pl.id === pid);
    return p && p.category === 'A';
  }).length;

export function playSoldSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
  } catch (e) {}
}

export function getInitialState() {
  try {
    const saved = localStorage.getItem('vcl_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.activeQueueTab) parsed.activeQueueTab = 'BAT';
      if (!parsed.recentResults) parsed.recentResults = [];
      return parsed;
    }
  } catch (e) {}
  return {
    teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
    players: JSON.parse(JSON.stringify(DUMMY_PLAYERS)),
    queue: DUMMY_PLAYERS.map((p) => p.id),
    currentBid: { playerId: null, amount: 0, leadingTeamId: null },
    activeQueueTab: 'BAT',
    recentResults: [],
  };
}
