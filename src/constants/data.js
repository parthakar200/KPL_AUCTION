export const DEFAULT_TEAMS = [
  { id: "t1", name: "Kings XI",     color: "#f97316", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t2", name: "Royal Tigers", color: "#a855f7", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t3", name: "Blue Warriors",color: "#06b6d4", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
  { id: "t4", name: "Red Eagles",   color: "#ec4899", points: 1000, pointsSpent: 0, players: [], rtmUsed: false },
];

export const DUMMY_PLAYERS = [
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

export const QUEUE_TABS = [
  { key: "BAT",    label: "🏏 Batsmen",      color: "#f59e0b" },
  { key: "BWL",    label: "🎯 Bowlers",      color: "#3b82f6" },
  { key: "AR",     label: "⚡ All-Rounders", color: "#a855f7" },
  { key: "WK",     label: "🧤 Keepers",      color: "#22c55e" },
  { key: "UNSOLD", label: "↩ Unsold",        color: "#ef4444" },
];

export const ROLE_INFO = {
  BAT: { label: "Batsman",     icon: "🏏", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  BWL: { label: "Bowler",      icon: "🎯", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
  AR:  { label: "All-Rounder", icon: "⚡", color: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" },
  WK:  { label: "Keeper",      icon: "🧤", color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)"  },
};

export const TEAM_COLORS = [
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
