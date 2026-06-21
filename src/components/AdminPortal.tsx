import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Users, 
  Car, 
  Trash2, 
  Edit3, 
  Plus, 
  Save, 
  X, 
  RefreshCw, 
  DollarSign, 
  Sparkles, 
  Image,
  Award,
  BookOpen,
  FileText,
  UserCheck,
  XCircle,
  Check
} from "lucide-react";
import { Player, Vehicle, Leader, FamilyApplication } from "../types";

interface AdminPortalProps {
  stats: {
    totalMembers: number;
    activeNow: number;
    totalVehicles: number;
    familyRank: string;
    familyWealth: string;
    influencePercent: number;
    dailyBountiesCompleted: number;
    mansionLocation: string;
  };
  setStats: React.Dispatch<React.SetStateAction<any>>;
  roster: Player[];
  setRoster: React.Dispatch<React.SetStateAction<Player[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  leaders: Leader[];
  setLeaders: React.Dispatch<React.SetStateAction<Leader[]>>;
  isNightMode: boolean;
  applications: FamilyApplication[];
  setApplications: React.Dispatch<React.SetStateAction<FamilyApplication[]>>;
}

export default function AdminPortal({
  stats,
  setStats,
  roster,
  setRoster,
  vehicles,
  setVehicles,
  leaders,
  setLeaders,
  isNightMode,
  applications,
  setApplications
}: AdminPortalProps) {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("kammatti_admin_session") === "active";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // UI Navigation inside Admin Panel
  const [adminTab, setAdminTab] = useState<"wealth" | "players" | "vehicles" | "images" | "applications">("wealth");

  // Confirmation Modal state for non-blocking iframe-friendly operations
  const [deleteConf, setDeleteConf] = useState<{
    type: "player" | "vehicle" | "leader";
    id: string;
    name: string;
  } | null>(null);

  // Managing Player State Forms
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: "",
    rank: "TRAINEE",
    role: "",
    status: "Online" as "Online" | "Offline" | "In Heist",
    xp: 2500,
    avatar: "👑",
    discord: "",
    achievementsStr: ""
  });

  // Managing Vehicle State Forms
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    category: "Supercar" as "Supercar" | "Hypercar" | "SUV" | "Sports Bike" | "Helicopter",
    topSpeed: 320,
    acceleration: 2.8,
    handling: 8.5,
    owner: "",
    priceInGc: "1,500 GC",
    description: "",
    colorHex: "#FF5722",
    colorName: "Flame Orange",
    underglowColor: "rgba(255,87,34,0.8)"
  });

  // Handling Admin Login validation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "heybro" && password === "1234") {
      setIsLoggedIn(true);
      localStorage.setItem("kammatti_admin_session", "active");
      setLoginError("");
    } else {
      setLoginError("ACCESS DENIED: Credentials mismatch. Check biometric signature.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("kammatti_admin_session");
  };

  // 📈 Stats Update Handler
  const handleStatChange = (key: string, value: any) => {
    setStats((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // 👥 Players action handlers
  const openAddPlayer = () => {
    setEditingPlayerId(null);
    setPlayerForm({
      name: "",
      rank: "TRAINEE",
      role: "Precision Trooper & Driver",
      status: "Online",
      xp: 2500,
      avatar: "🛡️",
      discord: "",
      achievementsStr: "Loyalty Guard, Team Player"
    });
    setIsPlayerFormOpen(true);
  };

  const openEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setPlayerForm({
      name: player.name,
      rank: player.rank,
      role: player.role,
      status: player.status,
      xp: player.xp,
      avatar: player.avatar,
      discord: player.discord || "",
      achievementsStr: player.achievements.join(", ")
    });
    setIsPlayerFormOpen(true);
  };

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const achievements = playerForm.achievementsStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPlayerId) {
      // Edit
      setRoster(prev => prev.map(p => p.id === editingPlayerId ? {
        ...p,
        name: playerForm.name,
        rank: playerForm.rank,
        role: playerForm.role,
        status: playerForm.status,
        xp: Number(playerForm.xp),
        avatar: playerForm.avatar,
        discord: playerForm.discord,
        achievements
      } : p));
    } else {
      // Add
      const newPlayer: Player = {
        id: "p_" + Date.now(),
        name: playerForm.name,
        rank: playerForm.rank,
        role: playerForm.role,
        status: playerForm.status,
        xp: Number(playerForm.xp),
        avatar: playerForm.avatar,
        joinDate: new Date().toISOString().split("T")[0],
        achievements,
        discord: playerForm.discord
      };
      setRoster(prev => [...prev, newPlayer]);
      // Increment totalMembers stats automatically
      setStats((prev: any) => ({ ...prev, totalMembers: prev.totalMembers + 1 }));
    }
    setIsPlayerFormOpen(false);
  };

  const deletePlayer = (id: string) => {
    const targetPlayer = roster.find(p => p.id === id);
    if (targetPlayer) {
      setDeleteConf({
        type: "player",
        id: targetPlayer.id,
        name: targetPlayer.name
      });
    }
  };

  const deleteVehicle = (id: string) => {
    const targetVehicle = vehicles.find(v => v.id === id);
    if (targetVehicle) {
      setDeleteConf({
        type: "vehicle",
        id: targetVehicle.id,
        name: targetVehicle.name
      });
    }
  };

  const executeDelete = () => {
    if (!deleteConf) return;
    const { type, id } = deleteConf;
    
    if (type === "player") {
      const targetPlayer = roster.find(p => p.id === id);
      setRoster(prev => prev.filter(p => p.id !== id));
      setStats((prev: any) => {
        const wasActive = targetPlayer && (targetPlayer.status === "Online" || targetPlayer.status === "In Heist");
        return {
          ...prev,
          totalMembers: Math.max(0, prev.totalMembers - 1),
          activeNow: wasActive ? Math.max(0, prev.activeNow - 1) : prev.activeNow
        };
      });
    } else if (type === "vehicle") {
      setVehicles(prev => prev.filter(v => v.id !== id));
      setStats((prev: any) => ({
        ...prev,
        totalVehicles: Math.max(0, prev.totalVehicles - 1)
      }));
    } else if (type === "leader") {
      setLeaders(prev => prev.filter(l => l.id !== id));
    }
    
    setDeleteConf(null);
  };

  // 📋 Applications action handlers
  const handleApproveApp = (app: FamilyApplication) => {
    // 1. Update applications list status
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: "Approved" } : a));
    
    // 2. Automatically sync to roster
    const alreadyInRoster = roster.some(m => m.name.toLowerCase() === app.username.toLowerCase());
    if (!alreadyInRoster) {
      const newPlayer: Player = {
        id: "p_" + Date.now(),
        name: app.username,
        rank: "TRAINEE",
        status: "Offline",
        role: "Recruited from Intake Portal",
        joinDate: new Date().toLocaleDateString('en-GB'),
        xp: 1500,
        avatar: "🔰",
        achievements: ["Intake Passed"],
        discord: app.discordTag
      };
      setRoster(prev => [newPlayer, ...prev]);
      // Increment totalMembers stats automatically
      setStats((prev: any) => ({ ...prev, totalMembers: prev.totalMembers + 1 }));
    }
  };

  const handleRejectApp = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "Rejected" } : a));
  };

  const handleDeleteApp = (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
  };

  // 🏎️ Vehicles action handlers
  const openAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      name: "",
      category: "Supercar",
      topSpeed: 330,
      acceleration: 2.6,
      handling: 9.0,
      owner: "",
      priceInGc: "1,200 GC",
      description: "Custom Kammattipadam family fleet specification.",
      colorHex: "#D4AF37",
      colorName: "Sovereign Gold",
      underglowColor: "rgba(212,175,55,0.8)"
    });
    setIsVehicleFormOpen(true);
  };

  const openEditVehicle = (car: Vehicle) => {
    setEditingVehicleId(car.id);
    setVehicleForm({
      name: car.name,
      category: car.category,
      topSpeed: car.topSpeed,
      acceleration: car.acceleration,
      handling: car.handling,
      owner: car.owner,
      priceInGc: car.priceInGc,
      description: car.description,
      colorHex: car.colorHex,
      colorName: car.colorName,
      underglowColor: car.underglowColor
    });
    setIsVehicleFormOpen(true);
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicleId) {
      setVehicles(prev => prev.map(v => v.id === editingVehicleId ? {
        ...v,
        name: vehicleForm.name,
        category: vehicleForm.category,
        topSpeed: Number(vehicleForm.topSpeed),
        acceleration: Number(vehicleForm.acceleration),
        handling: Number(vehicleForm.handling),
        owner: vehicleForm.owner,
        priceInGc: vehicleForm.priceInGc,
        description: vehicleForm.description,
        colorHex: vehicleForm.colorHex,
        colorName: vehicleForm.colorName,
        underglowColor: vehicleForm.underglowColor
      } : v));
    } else {
      const newVehicle: Vehicle = {
        id: "v_" + Date.now(),
        name: vehicleForm.name,
        category: vehicleForm.category,
        topSpeed: Number(vehicleForm.topSpeed),
        acceleration: Number(vehicleForm.acceleration),
        handling: Number(vehicleForm.handling),
        owner: vehicleForm.owner,
        priceInGc: vehicleForm.priceInGc,
        description: vehicleForm.description,
        colorHex: vehicleForm.colorHex,
        colorName: vehicleForm.colorName,
        underglowColor: vehicleForm.underglowColor
      };
      setVehicles(prev => [...prev, newVehicle]);
      setStats((prev: any) => ({ ...prev, totalVehicles: prev.totalVehicles + 1 }));
    }
    setIsVehicleFormOpen(false);
  };

  // 🖼️ Leader image url update handler
  const handleLeaderImageChange = (id: string, newAvatarUrl: string) => {
    setLeaders(prev => prev.map(lead => lead.id === id ? {
      ...lead,
      avatar: newAvatarUrl
    } : lead));
  };

  return (
    <div className="w-full glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
      
      {/* Decorative cyber grid in bg */}
      <div className="absolute inset-x-0 -top-40 h-80 bg-orange-500/10 blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5 mb-8">
        <div>
          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-[9px] font-mono tracking-widest uppercase">
             🔒 ENCRYPTED SOVEREIGN CORE
          </span>
          <h2 className="text-2xl font-black font-display text-white mt-1 uppercase tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500 animate-pulse" />
            Family Administration Control
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
             Manage live parameters, adjust wealth sheets, recruit files, and live client logs.
          </p>
        </div>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-650/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white rounded-xl text-xs font-mono font-bold transition cursor-pointer"
          >
            ❌ RE-LOCK VAULT
          </button>
        )}
      </div>

      {!isLoggedIn ? (
        /* ================= AUTHENTICATION LOGIN VIEW ================= */
        <div className="max-w-md mx-auto py-8">
          <div className="bg-[#080812]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] text-orange-500 font-mono animate-pulse uppercase">
               ● IDLE
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center text-xl mb-3">
                 🔑
              </div>
              <h3 className="text-lg font-bold text-white uppercase font-display">Biometric Firewall Login</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">
                 Enter authorized dispatcher credential sets to manipulate active database parameters.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-550/10 border border-red-500/30 text-red-400 rounded-xl text-[10.5px] font-mono text-center mb-4 leading-relaxed animate-shake">
                 ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[9.5px] text-slate-500 uppercase block mb-1">Administrative Username</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[9.5px] text-slate-500 uppercase block mb-1">Access Pass-phrase Key</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-650 via-orange-550 to-amber-500 hover:from-red-650 hover:to-amber-500 text-white rounded-xl font-display font-extrabold tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer mt-2"
              >
                 ACTIVATE ADMINISTRATOR VAULT
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ================= AUTHENTICATED ADMINISTRATOR ZONE ================= */
        <div className="space-y-6">
          
          {/* Inner Tab Control Panel */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/5 max-w-4xl">
            {[
              { id: "wealth", label: "Family Stats & Wealth", icon: <DollarSign className="w-3.5 h-3.5" /> },
              { id: "players", label: "Players Directory", icon: <Users className="w-3.5 h-3.5" /> },
              { id: "vehicles", label: "Vehicles Showroom", icon: <Car className="w-3.5 h-3.5" /> },
              { id: "images", label: "Website Images (Leaders)", icon: <Image className="w-3.5 h-3.5" /> },
              { 
                id: "applications", 
                label: `Applications (${applications.length})`, 
                icon: <FileText className="w-3.5 h-3.5" />,
                badge: applications.filter(a => a.status === "Pending").length > 0 
                  ? applications.filter(a => a.status === "Pending").length 
                  : undefined
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-mono font-bold uppercase transition tracking-wider cursor-pointer relative ${
                  adminTab === tab.id
                    ? "bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md border-transparent"
                    : "bg-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 bg-red-650 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[15px] text-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 1. WEALTH AND STATES SHEET PANEL */}
          {adminTab === "wealth" && (
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
               <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                     💰 ADJUST REGISTERED BALANCES & METRICS
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                     Alter immediate statistics displayed on the home counters.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Family Wealth Value String</label>
                     <input 
                       type="text" 
                       value={stats.familyWealth}
                       onChange={(e) => handleStatChange("familyWealth", e.target.value)}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                     />
                     <span className="text-[9.5px] text-slate-500 mt-1 block">e.g. $184,500,000</span>
                  </div>

                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Faction System Rank / Banner Label</label>
                     <input 
                       type="text" 
                       value={stats.familyRank}
                       onChange={(e) => handleStatChange("familyRank", e.target.value)}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                     />
                     <span className="text-[9.5px] text-slate-500 mt-1 block">e.g. #4 Faction Chart</span>
                  </div>

                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Territory Influence % Control</label>
                     <input 
                       type="number" 
                       min={0}
                       max={100}
                       value={stats.influencePercent}
                       onChange={(e) => handleStatChange("influencePercent", Number(e.target.value))}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                     />
                     <span className="text-[9.5px] text-slate-500 mt-1 block">0 to 100 percentage values</span>
                  </div>

                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Verified Family Members Count</label>
                     <input 
                       type="number" 
                       value={stats.totalMembers}
                       onChange={(e) => handleStatChange("totalMembers", Number(e.target.value))}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Active Now Member Count</label>
                     <input 
                       type="number" 
                       value={stats.activeNow}
                       onChange={(e) => handleStatChange("activeNow", Number(e.target.value))}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-bold"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] text-slate-500 block uppercase mb-1">Total Garaged Vehicles registered</label>
                     <input 
                       type="number" 
                       value={stats.totalVehicles}
                       onChange={(e) => handleStatChange("totalVehicles", Number(e.target.value))}
                       className="w-full bg-[#030307] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                     />
                  </div>
               </div>

               <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono leading-relaxed flex items-center gap-3">
                  <span className="text-xl animate-pulse">✓</span>
                  <span>Changes are instantly saved into direct cache state and will reflect down onto the main dashboard pages in real-time!</span>
               </div>
            </div>
          )}

          {/* 2. PLAYERS REGISTER SECTION */}
          {adminTab === "players" && (
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                     <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">
                        👥 PLAYERS AND ROSTER DIRECTORY
                     </h3>
                     <p className="text-[11px] text-slate-400 font-mono">
                        Dismiss family members, edit operational stats, or recruit fresh blood.
                     </p>
                  </div>

                  {!isPlayerFormOpen && (
                    <button
                      onClick={openAddPlayer}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-650 to-orange-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                       <Plus className="w-4 h-4" />
                       RECRUIT NEW PLAYER
                    </button>
                  )}
               </div>

               {/* Add / Edit Form Block */}
               {isPlayerFormOpen && (
                  <form onSubmit={handlePlayerSubmit} className="bg-[#030307]/50 border border-white/10 p-5 rounded-2xl relative space-y-4 font-mono text-xs">
                     <button
                       type="button"
                       onClick={() => setIsPlayerFormOpen(false)}
                       className="absolute top-4 right-4 text-slate-500 hover:text-white"
                     >
                        <X className="w-5 h-5" />
                     </button>

                     <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                        {editingPlayerId ? "✏️ EDIT REGISTERED PLAYER DATA" : "⚔️ REGISTER FAMILY SOLDIER IN ARCHIVE"}
                     </h4>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Player Character Name</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. Anand_Bose"
                             value={playerForm.name}
                             onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Rank Title Designation</label>
                           <select 
                             value={playerForm.rank}
                             onChange={(e) => setPlayerForm({...playerForm, rank: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                        >
                              <option value="FOUNDER">FOUNDER</option>
                              <option value="GOD FATHER">GOD FATHER</option>
                              <option value="FAMILY DON">FAMILY DON</option>
                              <option value="KPM DEPUTY">KPM DEPUTY</option>
                              <option value="UNDERBOSS">UNDERBOSS</option>
                              <option value="TRAINING LD">TRAINING LD</option>
                              <option value="SUPERIORS">SUPERIORS</option>
                              <option value="FW MEMBERS">FW MEMBERS</option>
                              <option value="KPM MEMBERS">KPM MEMBERS</option>
                              <option value="QUEENS">QUEENS</option>
                              <option value="TRAINEE">TRAINEE</option>
                           </select>
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Special Tactical Role</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. Precision Getaway Driver & Armament Logistics"
                             value={playerForm.role}
                             onChange={(e) => setPlayerForm({...playerForm, role: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">In-game Server Status</label>
                           <select 
                             value={playerForm.status}
                             onChange={(e) => setPlayerForm({...playerForm, status: e.target.value as any})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                        >
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="In Heist">In Heist</option>
                           </select>
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Accumulated Experience Points (XP)</label>
                           <input 
                             type="number" 
                             required 
                             value={playerForm.xp}
                             onChange={(e) => setPlayerForm({...playerForm, xp: Number(e.target.value)})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Avatar Symbol (Emoji or Character)</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. 👑, 🗡️, 🏎️"
                             value={playerForm.avatar}
                             onChange={(e) => setPlayerForm({...playerForm, avatar: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Discord Tag Identifier</label>
                           <input 
                             type="text" 
                             placeholder="e.g. bose#4482"
                             value={playerForm.discord}
                             onChange={(e) => setPlayerForm({...playerForm, discord: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Tactical Achievements (Comma separate)</label>
                           <input 
                             type="text" 
                             placeholder="e.g. Heist Expert, Zero-Casualty MVP, Fast Evader"
                             value={playerForm.achievementsStr}
                             onChange={(e) => setPlayerForm({...playerForm, achievementsStr: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>
                     </div>

                     <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayerFormOpen(false)}
                          className="px-4 py-2 bg-white/5 border border-white/5 text-slate-300 rounded-xl"
                        >
                           Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold uppercase flex items-center gap-1.5"
                        >
                           <Save className="w-3.5 h-3.5" />
                           Commit parameters
                        </button>
                     </div>
                  </form>
               )}

               {/* Table List of Players */}
               <div className="bg-[#05050b] rounded-2xl overflow-hidden border border-white/5">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left font-mono text-xs text-slate-300">
                        <thead className="bg-white/5 border-b border-white/5 uppercase text-[9.5px] text-slate-400">
                           <tr>
                              <th className="p-4">Av</th>
                              <th className="p-4">Alias Code name</th>
                              <th className="p-4">Rank Designation</th>
                              <th className="p-4">Tactical Specialty Role</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">XP</th>
                              <th className="p-4 text-right">Shield operations</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {roster.map((player) => (
                              <tr key={player.id} className="hover:bg-white/2 transition">
                                 <td className="p-4 text-lg">{player.avatar}</td>
                                 <td className="p-4 font-bold text-white whitespace-nowrap">{player.name}</td>
                                 <td className="p-4 whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-200 border border-white/10">
                                       {player.rank}
                                    </span>
                                 </td>
                                 <td className="p-4 text-slate-400 min-w-[200px]">{player.role}</td>
                                 <td className="p-4 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                       player.status === "Online" ? "bg-green-550/10 text-green-400" :
                                       player.status === "In Heist" ? "bg-orange-550/10 text-orange-400 animate-pulse" : "bg-slate-500/10 text-slate-400"
                                    }`}>
                                       {player.status}
                                    </span>
                                 </td>
                                 <td className="p-4 font-bold text-orange-400">{player.xp}</td>
                                 <td className="p-4 text-right whitespace-nowrap">
                                    <div className="flex gap-2 justify-end">
                                       <button
                                         onClick={() => openEditPlayer(player)}
                                         className="p-2 bg-white/5 border border-white/5 hover:border-orange-500/30 text-slate-300 hover:text-orange-400 rounded-lg"
                                         title="Edit Player parameters"
                                       >
                                          <Edit3 className="w-3.5 h-3.5" />
                                       </button>
                                       <button
                                         onClick={() => deletePlayer(player.id)}
                                         className="p-2 bg-white/5 border border-white/5 hover:border-red-500/40 hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-lg cursor-pointer transition-all"
                                         title="Dismiss Player"
                                       >
                                          <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {/* 3. VEHICLE SHOWROOM MANAGER */}
          {adminTab === "vehicles" && (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                     <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">
                        🏎️ VEHICLE SHELVES SHOWROOM
                     </h3>
                     <p className="text-[11px] text-slate-400 font-mono">
                        Deploy hypercars to fleet databases, edit stats, or scrape chassis objects.
                     </p>
                  </div>

                  {!isVehicleFormOpen && (
                    <button
                      onClick={openAddVehicle}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-650 to-orange-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                       <Plus className="w-4 h-4" />
                       INSTALL NEW ARMADA CHASSIS
                    </button>
                  )}
               </div>

               {/* Add / Edit Form Block */}
               {isVehicleFormOpen && (
                  <form onSubmit={handleVehicleSubmit} className="bg-[#030307]/50 border border-white/10 p-5 rounded-2xl relative space-y-4 font-mono text-xs">
                     <button
                       type="button"
                       onClick={() => setIsVehicleFormOpen(false)}
                       className="absolute top-4 right-4 text-slate-500 hover:text-white"
                     >
                        <X className="w-5 h-5" />
                     </button>

                     <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                        {editingVehicleId ? "✏️ EDIT ACTIVE MOTOR CHASSIS STATS" : "🔌 COMMISSION SUPERCAR TO ROTARY INDEX"}
                     </h4>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Chassis Nameplate</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. Bugatti La Voiture Noire"
                             value={vehicleForm.name}
                             onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Category Bracket</label>
                           <select 
                             value={vehicleForm.category}
                             onChange={(e) => setVehicleForm({...vehicleForm, category: e.target.value as any})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                        >
                              <option value="Hypercar">Hypercar</option>
                              <option value="Supercar">Supercar</option>
                              <option value="SUV">SUV</option>
                              <option value="Sports Bike">Sports Bike</option>
                              <option value="Helicopter">Helicopter</option>
                           </select>
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Top Speed (KM/H)</label>
                           <input 
                             type="number" 
                             required 
                             value={vehicleForm.topSpeed}
                             onChange={(e) => setVehicleForm({...vehicleForm, topSpeed: Number(e.target.value)})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">0-100 Accel (Seconds)</label>
                           <input 
                             type="number" 
                             step="0.1"
                             required 
                             value={vehicleForm.acceleration}
                             onChange={(e) => setVehicleForm({...vehicleForm, acceleration: Number(e.target.value)})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Handling Score (1.0 to 10.0)</label>
                           <input 
                             type="number" 
                             step="0.1"
                             required 
                             value={vehicleForm.handling}
                             onChange={(e) => setVehicleForm({...vehicleForm, handling: Number(e.target.value)})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Registered Keys Owner</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. Vikram Kovalan"
                             value={vehicleForm.owner}
                             onChange={(e) => setVehicleForm({...vehicleForm, owner: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Grand Coins Valuation / Price Tag</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. 2,800 GC"
                             value={vehicleForm.priceInGc}
                             onChange={(e) => setVehicleForm({...vehicleForm, priceInGc: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Vinyl Paint Color Hex</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. #FF5722"
                             value={vehicleForm.colorHex}
                             onChange={(e) => setVehicleForm({...vehicleForm, colorHex: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-500 block mb-1">Color Display Name</label>
                           <input 
                             type="text" 
                             required 
                             placeholder="e.g. Flame Orange"
                             value={vehicleForm.colorName}
                             onChange={(e) => setVehicleForm({...vehicleForm, colorName: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                           <label className="text-[10px] text-slate-500 block mb-1">Vehicle Description Brochure text</label>
                           <textarea 
                             rows={2} 
                             required 
                             placeholder="Provide high-stake backstory, custom twin turbo installations etc."
                             value={vehicleForm.description}
                             onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}
                             className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                           />
                        </div>
                     </div>

                     <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsVehicleFormOpen(false)}
                          className="px-4 py-2 bg-white/5 border border-white/5 text-slate-300 rounded-xl"
                        >
                           Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold uppercase flex items-center gap-1.5"
                        >
                           <Save className="w-3.5 h-3.5" />
                           Commit chassis
                        </button>
                     </div>
                  </form>
               )}

               {/* Vehicles Grid list with quick edit/delete buttons */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((car) => (
                     <div key={car.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-start">
                              <span className="text-[8px] font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded uppercase font-bold">
                                 {car.category}
                              </span>
                              <div className="flex gap-1">
                                 <button
                                   onClick={() => openEditVehicle(car)}
                                   className="p-1.5 bg-white/5 border border-white/5 hover:border-orange-500/30 text-slate-400 hover:text-orange-400 rounded-lg transition"
                                 >
                                    <Edit3 className="w-3 h-3" />
                                 </button>
                                 <button
                                   onClick={() => deleteVehicle(car.id)}
                                   className="p-1.5 bg-white/5 border border-white/5 hover:border-red-500/30 text-slate-400 hover:text-red-500 rounded-lg transition"
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                              </div>
                           </div>
                           
                           <h4 className="text-sm font-bold text-slate-100 mt-2 font-mono">{car.name}</h4>
                           <p className="text-[11px] text-slate-400 italic line-clamp-2 mt-1 leading-snug">
                              "{car.description}"
                           </p>
                        </div>

                        <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
                           <div>
                              <span>Price: <span className="text-amber-400 font-bold">{car.priceInGc}</span></span>
                           </div>
                           <div>
                              <span>Speed: <strong className="text-white">{car.topSpeed} KM/H</strong></span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {/* 4. WEBSITE IMAGES AND ASSETS MANAGER */}
          {adminTab === "images" && (
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
               <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                     🖼️ EDIT THE WEBSITE'S IMAGE ENTRIES
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                     Manipulate direct avatar photo credentials rendered on the 'Leaders' family page.
                  </p>
               </div>

               <div className="space-y-6">
                  {leaders.map((lead) => (
                     <div key={lead.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-5">
                        <img 
                          src={lead.avatar} 
                          alt={lead.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                          onError={(e) => {
                            // Fallback if image fails or is empty
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150";
                          }}
                        />

                        <div className="flex-1 w-full space-y-3">
                           <div className="flex justify-between items-center">
                              <div>
                                 <h4 className="text-sm font-bold text-white font-mono">{lead.name}</h4>
                                 <span className="text-[9px] text-orange-500 font-mono uppercase">Leader: {lead.rank}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="text-[8.5px] text-slate-500 font-mono">ID: {lead.id}</span>
                                 <button
                                   onClick={() => {
                                     if (setDeleteConf({ type: "leader", id: lead.id, name: lead.name }) && false) {
                                       setLeaders(prev => prev.filter(l => l.id !== lead.id));
                                     }
                                   }}
                                   className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                   title={`Dismiss leader ${lead.name}`}
                                 >
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>

                           <div className="font-mono text-xs">
                              <label className="text-[10px] text-slate-400 block mb-1 uppercase">Avatar Image Direct URL Reference</label>
                              <div className="flex gap-2">
                                 <input 
                                   type="text" 
                                   value={lead.avatar}
                                   onChange={(e) => handleLeaderImageChange(lead.id, e.target.value)}
                                   className="flex-1 bg-[#030307] border border-white/10 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 text-[10.5px]"
                                   placeholder="HTTPS direct image link (Unsplash or CDN)"
                                 />
                                 <button
                                   onClick={() => {
                                      // Reset to a random premium avatar
                                      const defaultUrls: Record<string, string> = {
                                        "lead-1": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
                                        "lead-2": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250",
                                        "lead-3": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250"
                                      };
                                      handleLeaderImageChange(lead.id, defaultUrls[lead.id] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250");
                                   }}
                                   className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-bold text-slate-300"
                                   title="Reset to default image"
                                 >
                                    Reset
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-[11px] font-mono text-slate-400 leading-relaxed">
                  <span className="text-orange-400 font-bold block uppercase mb-1">💡 IMAGE COMPATIBILITY WARNING</span>
                  For maximum rendering fidelity inside the ThreeJS environment or the headers, ensure URLs are secure direct paths (`https://...`) to formatted JPG, PNG, or webp assets. You can copy-paste any valid image address from the web!
               </div>

            </div>
          )}

          {/* 5. PORTAL INTAKE APPLICATIONS WORKFLOW PANEL */}
          {adminTab === "applications" && (
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
               <div className="border-b border-white/5 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                     <h3 className="text-sm font-bold text-orange-405 uppercase font-mono tracking-widest flex items-center gap-1.5">
                        📋 INTAKE EXAMINATIONS & RECRUITMENT PIPELINE
                     </h3>
                     <p className="text-[11px] text-slate-400 font-mono">
                        Evaluate applicant credentials submitted through the "Join Family" portal. APPROVED candidates instantly sync into the Live Roster!
                     </p>
                  </div>
                  {/* Stats Counter badges */}
                  <div className="flex gap-2 font-mono text-[10px]">
                     <span className="bg-white/5 text-slate-300 px-2.5 py-1 rounded-lg border border-white/5">
                        TOTAL: <strong>{applications.length}</strong>
                     </span>
                     <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        PENDING: <strong>{applications.filter(a => a.status === "Pending").length}</strong>
                     </span>
                     <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        APPROVED: <strong>{applications.filter(a => a.status === "Approved").length}</strong>
                     </span>
                     <span className="bg-red-500/10 text-red-500 px-2.5 py-1 rounded-lg border border-red-500/20">
                        REJECTED: <strong>{applications.filter(a => a.status === "Rejected").length}</strong>
                     </span>
                  </div>
               </div>

               {/* Grid or Empty Area */}
               {applications.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#080812]">
                     <FileText className="w-12 h-12 text-slate-405 mx-auto mb-3 opacity-60 animate-bounce" />
                     <p className="text-xs font-mono text-slate-455 uppercase tracking-widest">No applications logged in system memory!</p>
                     <p className="text-[10px] text-slate-500 mt-1">When players fill out the 'Join Family' application, their records will immediately materialize here.</p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     {applications.map((app) => (
                        <div 
                          key={app.id} 
                          className={`p-5 bg-gradient-to-b from-[#0a0d1a]/95 to-[#04050a] border rounded-2xl transition-all relative overflow-hidden ${
                            app.status === "Approved" 
                              ? "border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.06)]" 
                              : app.status === "Rejected"
                                ? "border-red-500/15 opacity-75"
                                : "border-amber-500/25 shadow-[0_4px_24px_rgba(245,158,11,0.06)]"
                          }`}
                        >
                           {/* Status Watermark */}
                           <div className="absolute top-4 right-4 flex items-center gap-2">
                              {app.status === "Pending" && (
                                 <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                                    ● PENDING DECISION
                                 </span>
                              )}
                              {app.status === "Approved" && (
                                 <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <Check className="w-3 h-3" /> APPROVED & ENLISTED
                                 </span>
                              )}
                              {app.status === "Rejected" && (
                                 <span className="bg-red-500/15 text-red-500 border border-red-500/30 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    ✕ REJECTED
                                 </span>
                              )}
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
                              {/* Left column - ID and timestamps */}
                              <div className="lg:col-span-4 space-y-3 lg:border-r border-white/5 lg:pr-4">
                                 <div>
                                    <span className="text-[8.5px] text-slate-500 uppercase block">Application ID</span>
                                    <strong className="text-white text-[11px] font-bold block overflow-hidden text-ellipsis selection:bg-amber-550">{app.id}</strong>
                                 </div>
                                 <div>
                                    <span className="text-[8.5px] text-slate-500 uppercase block">Submission Date</span>
                                    <span className="text-slate-300 text-[10.5px] font-semibold">
                                       {new Date(app.submittedAt).toLocaleString('en-GB', {
                                          day: '2-digit', month: '2-digit', year: 'numeric',
                                          hour: '2-digit', minute: '2-digit'
                                       })}
                                    </span>
                                 </div>
                                 <div className="pt-2">
                                    <span className="text-[8.5px] text-slate-500 uppercase block mb-1">Applicant Contact Credentials</span>
                                    <div className="space-y-1.5 text-[11px]">
                                       <div className="flex justify-between border-b border-white/5 pb-1">
                                          <span className="text-slate-400">Discord:</span>
                                          <span className="text-amber-400 font-bold">{app.discordTag}</span>
                                       </div>
                                       <div className="flex justify-between border-b border-white/5 pb-1">
                                          <span className="text-slate-400">Instagram:</span>
                                          <span className="text-slate-300 font-semibold">{app.instagramId || "None"}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span className="text-slate-400">In-Game Phone:</span>
                                          <span className="text-white font-semibold">{app.inGamePhone}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Center column - Personal details */}
                              <div className="lg:col-span-5 space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <span className="text-[9px] text-slate-500 block uppercase font-bold">🎮 Game Username</span>
                                       <strong className="text-white text-sm font-black">{app.username}</strong>
                                    </div>
                                    <div>
                                       <span className="text-[9px] text-slate-500 block uppercase font-bold">👤 Real Name</span>
                                       <strong className="text-slate-350 text-sm font-bold">{app.realName}</strong>
                                    </div>
                                    <div>
                                       <span className="text-[9px] text-slate-500 block uppercase font-bold">⚡ In-game Level</span>
                                       <strong className="text-amber-400 text-sm font-bold">{app.characterLevel}</strong>
                                    </div>
                                    <div>
                                       <span className="text-[9px] text-slate-500 block uppercase font-bold">🎂 Real Age</span>
                                       <strong className="text-white text-sm font-semibold">{app.age} yrs</strong>
                                    </div>
                                 </div>

                                 <div className="border-t border-white/5 pt-3">
                                    <span className="text-[9px] text-slate-555 block uppercase font-bold">🏠 Real House (Living Town)</span>
                                    <p className="text-slate-200 text-[11px] leading-relaxed mt-0.5">{app.realHouse}</p>
                                 </div>

                                 {/* OTHER SERVERS IF YES */}
                                 <div className="border-t border-white/5 pt-3 space-y-2">
                                    <div>
                                       <span className="text-[9px] text-slate-555 block uppercase font-bold">🌐 Playing in other servers?</span>
                                       <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 ${
                                          app.playingOtherServer === "Yes" 
                                             ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                             : "bg-white/5 text-slate-400"
                                       }`}>
                                          {app.playingOtherServer}
                                       </span>
                                    </div>
                                    {app.playingOtherServer === "Yes" && app.otherServerName && (
                                       <div className="bg-amber-500/[0.03] border border-amber-500/15 p-2.5 rounded-lg">
                                          <span className="text-[8px] text-amber-400 block uppercase tracking-wider font-bold">Server details:</span>
                                          <p className="text-white text-[11px] font-semibold mt-0.5">{app.otherServerName}</p>
                                       </div>
                                    )}
                                 </div>

                                 {/* SERVER 4 FAMILIES */}
                                 <div className="border-t border-white/5 pt-3 space-y-2">
                                    <div>
                                       <span className="text-[9px] text-slate-555 block uppercase font-bold">🛡️ Previous Family in Server 4?</span>
                                       <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 ${
                                          app.playedOtherFamilyServer4 === "Yes" 
                                             ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                             : "bg-white/5 text-slate-400"
                                       }`}>
                                          {app.playedOtherFamilyServer4}
                                       </span>
                                    </div>
                                    {app.playedOtherFamilyServer4 === "Yes" && (
                                       <div className="bg-amber-500/[0.03] border border-amber-500/15 p-3 rounded-xl space-y-2">
                                          <div>
                                             <span className="text-[8px] text-amber-400 block uppercase font-bold">Family Name</span>
                                             <p className="text-white text-[11px] font-semibold">{app.otherFamilyName || "N/A"}</p>
                                          </div>
                                          <div>
                                             <span className="text-[8px] text-amber-400 block uppercase font-bold">Reason for Leaving</span>
                                             <p className="text-slate-300 text-[10.5px] leading-relaxed italic">"{app.leaveReason || "N/A"}"</p>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* Right column - Decision Controls */}
                              <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-4 lg:text-right font-mono">
                                 <div className="text-[8.5px] text-slate-400 uppercase tracking-widest font-bold">
                                    INTAKE ACTIONS
                                 </div>

                                 <div className="space-y-2 lg:pt-8 w-full font-mono">
                                    {app.status === "Pending" ? (
                                       <>
                                          <button
                                            onClick={() => handleApproveApp(app)}
                                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer border border-emerald-500/30 transition-all font-mono"
                                          >
                                             <UserCheck className="w-3.5 h-3.5" /> APPROVE & ENLIST
                                          </button>
                                          <button
                                            onClick={() => handleRejectApp(app.id)}
                                            className="w-full py-2.5 bg-red-650/10 hover:bg-red-650/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold rounded-xl text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer transition-all font-mono"
                                          >
                                             <XCircle className="w-3.5 h-3.5" /> REJECT INTAKE
                                          </button>
                                       </>
                                    ) : (
                                       <div className="space-y-2 text-left bg-white/[0.02] border border-white/5 p-3 rounded-xl font-mono">
                                          <p className="text-[10px] text-slate-300 uppercase font-black">Archive Synced</p>
                                          <p className="text-[10px] text-slate-500 leading-relaxed">
                                             {app.status === "Approved" 
                                                ? "Applicant granted Entry status. They are now officially added to our dynamic active players directory roster."
                                                : "Applicant did not meet thresholds. Record saved in history."
                                             }
                                          </p>
                                          <button
                                            onClick={() => handleDeleteApp(app.id)}
                                            className="w-full mt-2 py-1.5 bg-white/5 hover:bg-red-500/15 hover:text-red-400 text-slate-450 rounded-lg text-[9px] uppercase tracking-wider text-center transition-all cursor-pointer font-bold border border-transparent hover:border-red-500/15 font-mono"
                                          >
                                             Erase Record
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          )}

        </div>
      )}

      {/* ⚠️ HIGH-TECH IMPERATIVE DISMISSAL CONFIRMATION DIALOG (Non-Blocking Iframe Companion) */}
      {deleteConf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-md bg-[#0a0d16] border border-red-500/35 rounded-3xl p-6 shadow-[0_20px_50px_rgba(239,68,68,0.2)] relative overflow-hidden">
            {/* Ambient accent lights */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            
            <div className="flex flex-col items-center text-center space-y-4 font-mono">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                <Trash2 className="w-5 h-5" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-red-500 tracking-wider uppercase">IMPERATIVE COMMAND</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {deleteConf.type === "player" && "Dismiss Family Member?"}
                  {deleteConf.type === "vehicle" && "Scrape Registered Vehicle?"}
                  {deleteConf.type === "leader" && "Dismiss Core Leader?"}
                </h3>
              </div>

              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 w-full text-left space-y-2">
                <p className="text-[11px] text-slate-300 leading-relaxed text-center">
                  Are you absolutely certain you want to erase <strong className="text-white font-bold text-xs">"{deleteConf.name}"</strong> permanently from the active Kammattipadam family ledger archives?
                </p>
                <div className="text-[9px] text-slate-500 text-center uppercase border-t border-white/5 pt-2 flex justify-center gap-4 mt-2">
                  <span>ID: {deleteConf.id}</span>
                  <span>SECTOR: {deleteConf.type.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full pt-1">
                <button
                  type="button"
                  onClick={() => setDeleteConf(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-slate-300 rounded-2xl text-[10.5px] font-bold uppercase transition-all max-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  ABORT TRANSACTION
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-650 active:scale-95 text-white rounded-2xl text-[10.5px] font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(220,38,38,0.25)] border border-red-500/30 transition-all max-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  EXECUTE COMMAND
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
