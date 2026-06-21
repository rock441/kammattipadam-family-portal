import React, { useState, useEffect } from "react";
import { Player } from "../types";
import { 
  Key, LogIn, LogOut, Shield, ChevronDown, CheckCircle, 
  Clock, Activity, FileText, Sparkles, UserCheck, RefreshCw, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PlayerLoginPortalProps {
  players: Player[];
  onUpdatePlayer: (updatedPlayer: Player) => void;
}

export function PlayerLoginPortal({ players, onUpdatePlayer }: PlayerLoginPortalProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [passcode, setPasscode] = useState("");
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  
  // Custom interactive actions for the logged-in operative
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [dutyStatus, setDutyStatus] = useState<"Online" | "Offline" | "In Heist">("Online");
  const [operativeNotes, setOperativeNotes] = useState("");
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState(false);
  const [sessionHours, setSessionHours] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentDutyActivities, setRecentDutyActivities] = useState<Array<{
    time: string;
    action: string;
  }>>([
    { time: "05 mins ago", action: "Assigned vehicle #14 Chiron underglow check" },
    { time: "2 hours ago", action: "Patrolled mansion outskirts - Clear" }
  ]);
  const [tempHeistType, setTempHeistType] = useState("Store Robbery");

  // Load standard pre-saved login status if any
  useEffect(() => {
    const savedUserId = localStorage.getItem("k_logged_in_user_id");
    if (savedUserId) {
      const match = players.find(p => p.id === savedUserId);
      if (match) {
        setCurrentUser(match);
        setDutyStatus(match.status);
        const storedNotes = localStorage.getItem(`k_notes_${match.id}`) || "";
        setOperativeNotes(storedNotes);
        const claimed = localStorage.getItem(`k_claimed_${match.id}`) === "true";
        setDailyCheckInClaimed(claimed);
        
        // Random session simulated hours to look cool
        setSessionHours(Math.floor(Math.random() * 8) + 1);
      }
    }
  }, [players]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) {
      setLoginError("Select your registered operative identity");
      return;
    }
    
    // Simulate decryption
    setLoginError("");
    setIsLoggingIn(true);
    
    setTimeout(() => {
      const found = players.find(p => p.id === selectedPlayerId);
      if (found) {
        if (passcode !== "1234") {
          setLoginError("Access Denied: Invalid tactical security passcode");
          setIsLoggingIn(false);
          return;
        }
        // Use 1234 as universal key, or accept anything if they try
        setCurrentUser(found);
        setDutyStatus(found.status);
        localStorage.setItem("k_logged_in_user_id", found.id);
        
        // Fetch personalized logs
        const storedNotes = localStorage.getItem(`k_notes_${found.id}`) || "";
        setOperativeNotes(storedNotes);
        const claimed = localStorage.getItem(`k_claimed_${found.id}`) === "true";
        setDailyCheckInClaimed(claimed);
        setSessionHours(Math.floor(Math.random() * 4) + 1);
        
        // Push a fresh event
        setRecentDutyActivities(prev => [
          { time: "Just Now", action: "Terminal connection authenticated successfully" },
          ...prev
        ]);
        
        setIsLoggingIn(false);
        setPasscode("");
      } else {
        setLoginError("Identity mismatch");
        setIsLoggingIn(false);
      }
    }, 1250);
  };

  const handleLogout = () => {
    localStorage.removeItem("k_logged_in_user_id");
    setCurrentUser(null);
  };

  // Change current state in real-time!
  const handleStatusChange = (newStatus: "Online" | "Offline" | "In Heist") => {
    if (!currentUser) return;
    setDutyStatus(newStatus);
    
    // Update player object in global app list state so Roster Renders it
    const updated = { ...currentUser, status: newStatus };
    onUpdatePlayer(updated);
    
    setRecentDutyActivities(prev => [
      { time: "Just Now", action: `Status reassigned to: ${newStatus.toUpperCase()}` },
      ...prev
    ]);
  };

  // Trigger XP claim rewards
  const handleClaimReward = () => {
    if (!currentUser || dailyCheckInClaimed) return;
    setDailyCheckInClaimed(true);
    localStorage.setItem(`k_claimed_${currentUser.id}`, "true");
    
    // Confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Award 150 XP
    const newXp = currentUser.xp + 150;
    const updated = { ...currentUser, xp: newXp };
    setCurrentUser(updated);
    onUpdatePlayer(updated);

    setRecentDutyActivities(prev => [
      { time: "Just Now", action: "Added +150 XP for daily briefing completion" },
      ...prev
    ]);
  };

  // Save secure local diary
  const handleSaveNotes = () => {
    if (!currentUser) return;
    localStorage.setItem(`k_notes_${currentUser.id}`, operativeNotes);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
    
    setRecentDutyActivities(prev => [
      { time: "Just Now", action: "Encrypted safehouse terminal scratchpad updated" },
      ...prev
    ]);
  };

  // Add custom simulated Heist logging
  const handleLogHeist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Add additional XP for completing Heists dynamically!
    const newXp = currentUser.xp + 350;
    const updated = { ...currentUser, xp: newXp };
    setCurrentUser(updated);
    onUpdatePlayer(updated);

    setRecentDutyActivities(prev => [
      { time: "Just Now", action: `Logged completion of [${tempHeistType}] (+350 XP!)` },
      ...prev
    ]);
  };

  return (
    <div id="player-login-terminal" className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      {/* Decorative Top header bar like an active secure terminal */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <h4 className="text-sm font-display font-black tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-orange-500" />
            SECURE OPERATIVE CONTROL PORTAL
          </h4>
        </div>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold tracking-tight bg-slate-300/40 px-2 py-0.5 rounded">
          {currentUser ? `COMM_PORT: OPEN // ID: ${currentUser.id.toUpperCase()}` : "STATUS: UNAUTHENTICATED"}
        </span>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!currentUser ? (
            /* ================= LOGIN FORM VIEW ================= */
            <motion.div 
              key="login-form-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-5 items-stretch">
                {/* Visual description */}
                <div className="flex-1 space-y-2 flex flex-col justify-center">
                  <h5 className="text-sm font-extrabold text-slate-900 uppercase">Interactive Check-In Access</h5>
                  <p className="text-xs text-slate-550 leading-relaxed font-sans">
                    Are you on the roster? Select your operative handle, enter your secure tactical clearance PIN, and authenticate. This unlocks custom duty clocking, elite heist logging, and direct live roster telemetry configuration.
                  </p>
                  
                  {/* Visual help badge */}
                  <div className="bg-orange-50/50 border border-orange-200/40 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-orange-850 font-sans mt-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Developer Notice / Roster Synced:</span>
                      Any state updates (changing state to "In Heist", clocking in) immediately synchronize with the <span className="underline font-bold text-slate-800">Roster page</span> live statistics!
                    </div>
                  </div>
                </div>

                {/* Actual form */}
                <form onSubmit={handleLoginSubmit} className="w-full md:w-[360px] bg-slate-50/50 border border-slate-200/40 p-5 rounded-2xl flex flex-col gap-3">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block font-bold">1. Select Operative</label>
                  <div className="relative">
                    <select
                      value={selectedPlayerId}
                      onChange={(e) => {
                        setSelectedPlayerId(e.target.value);
                        setLoginError("");
                      }}
                      className="w-full text-xs font-semibold bg-white text-slate-800 border border-slate-300 rounded-xl p-3 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>-- IDENTITY SIGNALS --</option>
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.avatar} {p.name} ({p.rank})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase block font-bold">2. Security Passkey PIN</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full font-mono pl-10 pr-4 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="text-[11px] text-red-600 font-bold bg-red-50 p-2 rounded-lg text-center font-mono">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-mono font-black uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Decrypting core...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-white" />
                        <span>AUTHENTICATE SIGNAL</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ================= LOGGED IN PERSONAL TERMINAL VIEW ================= */
            <motion.div 
              key="logged-in-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex justify-center items-center">
                  <div className="text-center font-bold font-display text-4xl text-amber-500 bg-white/95 px-6 py-4 rounded-3xl border border-amber-300 shadow-2xl animate-bounce">
                    🎉 +150 XP AWARDED! 🎉
                  </div>
                </div>
              )}

              {/* 1. Header Information Section */}
              <div className="flex flex-col md:flex-row gap-5 items-start justify-between bg-slate-50/70 p-5 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl shadow-md border-2 border-white">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-slate-800 tracking-tight uppercase font-display">{currentUser.name}</h4>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                        {currentUser.rank}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-orange-500" />
                        Discord: {currentUser.discord || "Not Configured"}
                      </span>
                      <span>•</span>
                      <span>Joined: {currentUser.joinDate}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">Cleared ID: {currentUser.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto items-center mt-3 md:mt-0">
                  <div className="text-right mr-2 hidden sm:block">
                    <span className="text-[10px] text-slate-500 block font-mono">RANK PROGRESS</span>
                    <span className="text-xs font-black text-slate-800 block font-mono">{currentUser.xp} XP SECURED</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold font-mono uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Terminate Connection"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Terminate</span>
                  </button>
                </div>
              </div>

              {/* 2. Three Interactive Section Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column A: Duty State & Daily Brief Check-In (lg:cols-4) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Status Assignment */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
                    <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-orange-500" />
                      Live Duty Signal
                    </h5>
                    
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      {(["Online", "Offline", "In Heist"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 px-1 text-[10px] font-mono font-extrabold rounded-lg border transition cursor-pointer text-center ${
                            dutyStatus === st
                              ? st === "Online" ? "bg-green-100 text-green-700 border-green-300 shadow-sm" :
                                st === "In Heist" ? "bg-orange-100 text-orange-700 border-orange-300 shadow-sm animate-pulse" :
                                "bg-slate-200 text-slate-700 border-slate-350"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {st === "Online" && "🟢 "}{st === "In Heist" && "🔥 "}{st === "Offline" && "⬜ "}{st.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                      Selecting updates your real-time tracking indicator in the Family Roster.
                    </p>
                  </div>

                  {/* Daily Bonus Briefing claim */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                    {/* Glowing blur */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="space-y-1.5 relative z-10">
                      <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Family Brief Reward
                      </h5>
                      <span className="text-[11px] font-sans font-bold text-slate-700 block text-sm">
                        Daily Base Check-In Hours
                      </span>
                      <p className="text-[10px] text-slate-450 leading-normal">
                        Confirm you are at the headquarters mansion coordinates in-game today and receive a bonus <span className="font-mono text-amber-600 font-bold">+150 XP</span> inside our portal databases.
                      </p>
                    </div>

                    <button
                      onClick={handleClaimReward}
                      disabled={dailyCheckInClaimed}
                      className={`w-full mt-4 py-2 px-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        dailyCheckInClaimed
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-sm"
                      }`}
                    >
                      {dailyCheckInClaimed ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Brief Hours claimed!</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-white" />
                          <span>CLAIM BRIEF HOURS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Column B: Active Heist Logger (lg:cols-4) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      LOG MISSION ACTION
                    </h5>
                    
                    <form onSubmit={handleLogHeist} className="space-y-3">
                      <label className="text-[9px] text-slate-500 uppercase block font-mono">MISSION TARGET</label>
                      <select
                        value={tempHeistType}
                        onChange={(e) => setTempHeistType(e.target.value)}
                        className="w-full text-xs font-semibold bg-white text-slate-800 border border-slate-300 rounded-xl p-2.5 focus:outline-none cursor-pointer"
                      >
                        <option value="Store Robbery">💵 Store Robbery (Easy)</option>
                        <option value="ATM Electronic Hack">💻 ATM Electronic Hack (Medium)</option>
                        <option value="Union Depository Heist">🏦 Heist: Union Depository (Hard)</option>
                        <option value="Industrial Weapon Raid">🔫 Industrial Weapon Raid (Co-op)</option>
                        <option value="Mansion Counter-Assault">🏰 Mansion Tactical Defense</option>
                      </select>

                      <p className="text-[10px] text-slate-450 leading-normal font-sans">
                        Logging completed missions submits statistics data securely, boosting the whole family's Influence rating by <span className="font-bold font-mono text-orange-600">+0.2%</span> and granting you <span className="font-mono text-emerald-600 font-bold">+350 XP</span>!
                      </p>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-red-650 to-orange-550 hover:from-red-600 hover:to-orange-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition tracking-wider justify-center flex items-center gap-1.5 cursor-pointer shadow-sm mt-2"
                      >
                        <span>RECORD MISSION LOG</span>
                      </button>
                    </form>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>GRID UNIT: M-144</span>
                    <span>CO-OPS: {sessionHours} CLOCKED TODAY</span>
                  </div>
                </div>

                {/* Column C: Encrypted Safehouse Terminal Scratchpad (lg:cols-4) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      Encrypted Safehouse Scratchpad
                    </h5>

                    <textarea
                      value={operativeNotes}
                      placeholder="Write sensitive secure messages or coordinates for your squad members (e.g., 'Met Vikram at warehouse #4, left standard body armor in trunk #10')..."
                      onChange={(e) => setOperativeNotes(e.target.value)}
                      className="w-full h-32 bg-slate-50 border border-slate-300 text-slate-850 p-2.5 rounded-xl font-mono text-[10.5px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 items-center mt-3">
                    <button
                      onClick={handleSaveNotes}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white rounded-lg text-[10px] font-mono uppercase transition cursor-pointer text-center"
                    >
                      {isNotesSaved ? "Saved Securely!" : "Secure Scratchpad Data"}
                    </button>
                  </div>
                </div>

              </div>

              {/* 3. Terminal Live Event Audit Log */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 font-mono text-[10px] text-slate-500 flex flex-col gap-2 shadow-inner">
                <span className="text-[9.5px] text-slate-450 uppercase font-black block">🟢 PERSONAL OPERATIVE TERMINAL LOGS:</span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  {recentDutyActivities.map((act, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-slate-800">⚡ {act.action}</span>
                      <span className="text-slate-400 text-[9px]">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
