import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Map, 
  Car, 
  Shield, 
  MessageSquare, 
  Sparkles, 
  Sun, 
  Moon, 
  Search, 
  Filter, 
  Award, 
  FileText, 
  CheckCircle2, 
  Compass, 
  HelpCircle, 
  Send, 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  Volume2, 
  UserCheck, 
  ArrowRight,
  MapPin,
  ExternalLink,
  MessageCircle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Key,
  Lock,
  ChevronLeft,
  Activity,
  Home,
  Wrench,
  Skull,
  Heart,
  Landmark,
  Tv,
  Settings,
  ChevronsUpDown,
  ArrowLeft,
  Navigation
} from "lucide-react";

import { 
  familyStats, 
  familyRoster, 
  familyLeaders, 
  familyVehicles, 
  mansionSpots, 
  familyAchievements, 
  recruitmentRules, 
  recruitmentBenefits 
} from "./data";
import { Player, Vehicle, Leader, MansionSpot, Achievement, FamilyApplication } from "./types";
import ThreeCanvas from "./components/ThreeCanvas";
import { RotatingLogo } from "./components/RotatingLogo";
import { PlayerLoginPortal } from "./components/PlayerLoginPortal";
import AudioEngine from "./components/AudioEngine";
import LobbyLoader from "./components/LobbyLoader";
import AdminPortal from "./components/AdminPortal";

export default function App() {
  const [showLoader, setShowLoader] = useState<boolean>(true);

  // Persistent administration data state layers
  const [stats, setStats] = useState(() => {
    const local = localStorage.getItem("kammatti_stats");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return familyStats;
  });

  const [roster, setRoster] = useState<Player[]>(() => {
    const local = localStorage.getItem("kammatti_roster");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return familyRoster;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const local = localStorage.getItem("kammatti_vehicles");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return familyVehicles;
  });

  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const local = localStorage.getItem("kammatti_leaders");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return familyLeaders;
  });

  const [applications, setApplications] = useState<FamilyApplication[]>(() => {
    const local = localStorage.getItem("kammatti_applications");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return [
      {
        id: "app_1",
        username: "Aditya_Menon",
        realName: "Aditya",
        characterLevel: "18",
        age: "23",
        realHouse: "Kochi, Kerala",
        playingOtherServer: "No",
        otherServerName: "",
        playedOtherFamilyServer4: "Yes",
        otherFamilyName: "Malabar Kings",
        leaveReason: "Family disbanded due to leader inactivity.",
        inGamePhone: "4325432",
        instagramId: "@aditya_m",
        discordTag: "aditya_m#4211",
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "Pending" as const
      },
      {
        id: "app_2",
        username: "Sagar_S",
        realName: "Sagar",
        characterLevel: "9",
        age: "19",
        realHouse: "Trivandrum, Kerala",
        playingOtherServer: "Yes",
        otherServerName: "Kerala RP Server 2",
        playedOtherFamilyServer4: "No",
        otherFamilyName: "",
        leaveReason: "",
        inGamePhone: "7654321",
        instagramId: "@sagar_s",
        discordTag: "sagar_s#1122",
        submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: "Pending" as const
      }
    ];
  });

  // Automatically flush memory caches down onto LocalStorage
  useEffect(() => {
    localStorage.setItem("kammatti_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("kammatti_roster", JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    localStorage.setItem("kammatti_vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem("kammatti_leaders", JSON.stringify(leaders));
  }, [leaders]);

  useEffect(() => {
    localStorage.setItem("kammatti_applications", JSON.stringify(applications));
  }, [applications]);

  const [activeTab, setActiveTab] = useState<"home" | "players" | "house" | "vehicles" | "leaders" | "contact" | "join" | "admin" | "login">("home");
  
  // Guarantee view viewport resets to the top when switching areas or loading completes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab, showLoader]);
  
  // States for tracking player login status and collapsible sidebar view
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  // Sync logged in status periodically from roster database
  useEffect(() => {
    const checkLogin = () => {
      const uId = localStorage.getItem("k_logged_in_user_id");
      setLoggedInUserId(uId);
    };
    checkLogin();
    const interval = setInterval(checkLogin, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // Custom night mode state, which we proxy directly down to Three.js canvas view!
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // Vehicles tab specific states
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(() => vehicles[0] || familyVehicles[0]);

  // Handle selected vehicle deletion or updates automatically
  useEffect(() => {
    if (vehicles.length > 0) {
      const stillExists = vehicles.find((v) => v.id === selectedVehicle.id);
      if (!stillExists) {
        setSelectedVehicle(vehicles[0]);
      } else if (JSON.stringify(stillExists) !== JSON.stringify(selectedVehicle)) {
        setSelectedVehicle(stillExists);
      }
    }
  }, [vehicles, selectedVehicle]);

  // House tab specific states
  const [selectedSpot, setSelectedSpot] = useState<MansionSpot>(mansionSpots[0]);
  const [expandedLegend, setExpandedLegend] = useState<boolean>(true);
  const [legendFilters, setLegendFilters] = useState<string[]>([
    "VACANT", "ACQUIRED", "BLACK_MARKET", "TSS", "SIS", "POLICE", "HOSPITAL", "GOVERNMENT", "NEWS", "MILITARY", "FACTORY"
  ]);
  const [selectedMapMarkerId, setSelectedMapMarkerId] = useState<string>("hq-mansion");

  // Players tab specific states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rankFilter, setRankFilter] = useState<string>("All");

  // Chat AI states
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "Welcome to Kammattipadam Headquaters! I am your AI family counselor and lead software architect. Ask me anything about Grand RP rules, optimal car handling, getting safe-house assets, or setting up recruitment spreadsheets."
    }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Recruitment/Join states
  const [applicationData, setApplicationData] = useState({
    username: "",
    realName: "",
    characterLevel: "",
    age: "",
    realHouse: "",
    playingOtherServer: "No",
    otherServerName: "",
    playedOtherFamilyServer4: "No",
    otherFamilyName: "",
    leaveReason: "",
    inGamePhone: "",
    instagramId: "",
    discordTag: "",
    ruleAgreed: false,
  });
  const [showRecruitSuccess, setShowRecruitSuccess] = useState<boolean>(false);

  // Contact form state
  const [contactData, setContactData] = useState({ name: "", email: "", msg: "" });
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  // Scroll to bottom of chat automatically
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatMessages
        })
      });
      const data = await response.json();
      if (data.response) {
        setChatMessages((prev) => [...prev, { role: "model", text: data.response }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "model", text: "Counselor Offline. Please make sure the AI credentials are set in the secrets tab." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "model", text: "Something went wrong communicating with the family backend. Please try again!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const selectQuickHint = (hint: string) => {
    setChatInput(hint);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationData.ruleAgreed) return;
    
    // Create a new application trace and add it to our state catalog
    const newApp: FamilyApplication = {
      id: "app_" + Date.now(),
      username: applicationData.username,
      realName: applicationData.realName,
      characterLevel: applicationData.characterLevel,
      age: applicationData.age,
      realHouse: applicationData.realHouse,
      playingOtherServer: applicationData.playingOtherServer,
      otherServerName: applicationData.otherServerName,
      playedOtherFamilyServer4: applicationData.playedOtherFamilyServer4,
      otherFamilyName: applicationData.otherFamilyName,
      leaveReason: applicationData.leaveReason,
      inGamePhone: applicationData.inGamePhone,
      instagramId: applicationData.instagramId,
      discordTag: applicationData.discordTag,
      submittedAt: new Date().toISOString(),
      status: "Pending"
    };

    setApplications((prev) => [newApp, ...prev]);

    // Simulate high-fidelity recruitment evaluation
    setShowRecruitSuccess(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactData({ name: "", email: "", msg: "" });
    }, 4000);
  };

  // New States for inline Add/Edit Modals!
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerForm, setPlayerForm] = useState<{
    id?: string;
    name: string;
    rank: string;
    role: string;
    xp: number;
    avatar: string;
    discord: string;
    status: "Online" | "Offline" | "In Heist";
    joinDate: string;
    achievements: string;
  }>({
    name: "",
    rank: "Soldier",
    role: "",
    xp: 2500,
    avatar: "🤠",
    discord: "",
    status: "Offline",
    joinDate: new Date().toISOString().split("T")[0],
    achievements: "Weed Runner, Active Officer",
  });

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleFormState] = useState<{
    id?: string;
    name: string;
    category: "Hypercar" | "Supercar" | "SUV" | "Sports Bike" | "Helicopter";
    topSpeed: number;
    acceleration: number;
    handling: number;
    owner: string;
    priceInGc: string;
    colorHex: string;
    colorName: string;
    description: string;
    underglowColor: string;
  }>({
    name: "",
    category: "Supercar",
    topSpeed: 320,
    acceleration: 2.8,
    handling: 8.5,
    owner: "Vikram Kovalan",
    priceInGc: "1,500 GC",
    colorHex: "#EF4444",
    colorName: "Red Flame",
    description: "Fully customized premium chassis with carbon-fiber aerodynamics.",
    underglowColor: "rgba(255,0,0,0.8)",
  });

  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [leaderForm, setLeaderForm] = useState<{
    id?: string;
    name: string;
    nickname: string;
    rank: string;
    specialty: string;
    bio: string;
    discord: string;
    avatar: string;
    achievements: string;
  }>({
    name: "",
    nickname: "",
    rank: "Enforcer",
    specialty: "",
    bio: "",
    discord: "",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
    achievements: "Founder, Lead Generalist",
  });

  const handleOpenPlayerAdd = () => {
    setEditingPlayer(null);
    setPlayerForm({
      name: "",
      rank: "Soldier",
      role: "",
      xp: 1500,
      avatar: "🔥",
      discord: "",
      status: "Online",
      joinDate: new Date().toISOString().split("T")[0],
      achievements: "Active Duty, Junior Shooter",
    });
    setIsPlayerModalOpen(true);
  };

  const handleOpenPlayerEdit = (player: Player) => {
    setEditingPlayer(player);
    setPlayerForm({
      id: player.id,
      name: player.name,
      rank: player.rank,
      role: player.role,
      xp: player.xp,
      avatar: player.avatar,
      discord: player.discord,
      status: player.status,
      joinDate: player.joinDate,
      achievements: player.achievements.join(", "),
    });
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementsArray = playerForm.achievements
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPlayer) {
      setRoster((prev) =>
        prev.map((p) =>
          p.id === editingPlayer.id
            ? {
                ...p,
                name: playerForm.name,
                rank: playerForm.rank,
                role: playerForm.role,
                xp: playerForm.xp,
                avatar: playerForm.avatar,
                discord: playerForm.discord,
                status: playerForm.status,
                achievements: achievementsArray,
              }
            : p
        )
      );
    } else {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: playerForm.name,
        rank: playerForm.rank,
        role: playerForm.role,
        xp: playerForm.xp,
        avatar: playerForm.avatar,
        discord: playerForm.discord,
        status: playerForm.status,
        joinDate: playerForm.joinDate,
        achievements: achievementsArray,
      };
      setRoster((prev) => [newPlayer, ...prev]);
      setStats((prev: any) => ({
        ...prev,
        totalMembers: prev.totalMembers + 1,
        activeNow: playerForm.status === "Online" || playerForm.status === "In Heist" ? prev.activeNow + 1 : prev.activeNow
      }));
    }
    setIsPlayerModalOpen(false);
  };

  const handleDeletePlayer = (id: string, name?: string) => {
    if (confirm(`Are you sure you want to dismiss ${name || "this player"} from the family register?`)) {
      setRoster((prev) => {
        const deleted = prev.find((p) => p.id === id);
        if (deleted) {
          setStats((st: any) => ({
            ...st,
            totalMembers: Math.max(0, st.totalMembers - 1),
            activeNow: deleted.status === "Online" || deleted.status === "In Heist" ? Math.max(0, st.activeNow - 1) : st.activeNow
          }));
        }
        return prev.filter((p) => p.id !== id);
      });
    }
  };

  const handleOpenVehicleAdd = () => {
    setEditingVehicle(null);
    setVehicleFormState({
      name: "",
      category: "Supercar",
      topSpeed: 300,
      acceleration: 3.1,
      handling: 8.0,
      owner: "Ashkar Ali",
      priceInGc: "3,200 GC",
      colorHex: "#F59E0B",
      colorName: "Solid Amber",
      description: "Custom fitted manifold, upgraded brakes and carbon body styling elements.",
      underglowColor: "rgba(245, 158, 11, 0.8)",
    });
    setIsVehicleModalOpen(true);
  };

  const handleOpenVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleFormState({
      id: vehicle.id,
      name: vehicle.name,
      category: vehicle.category,
      topSpeed: vehicle.topSpeed,
      acceleration: vehicle.acceleration,
      handling: vehicle.handling,
      owner: vehicle.owner,
      priceInGc: vehicle.priceInGc,
      colorHex: vehicle.colorHex,
      colorName: vehicle.colorName,
      description: vehicle.description,
      underglowColor: vehicle.underglowColor,
    });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingVehicle.id
            ? {
                ...v,
                name: vehicleForm.name,
                category: vehicleForm.category,
                topSpeed: vehicleForm.topSpeed,
                acceleration: vehicleForm.acceleration,
                handling: vehicleForm.handling,
                owner: vehicleForm.owner,
                priceInGc: vehicleForm.priceInGc,
                colorHex: vehicleForm.colorHex,
                colorName: vehicleForm.colorName,
                description: vehicleForm.description,
                underglowColor: vehicleForm.underglowColor,
              }
            : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        id: `car-${Date.now()}`,
        name: vehicleForm.name,
        category: vehicleForm.category,
        topSpeed: vehicleForm.topSpeed,
        acceleration: vehicleForm.acceleration,
        handling: vehicleForm.handling,
        owner: vehicleForm.owner,
        priceInGc: vehicleForm.priceInGc,
        colorHex: vehicleForm.colorHex,
        colorName: vehicleForm.colorName,
        description: vehicleForm.description,
        underglowColor: vehicleForm.underglowColor,
      };
      setVehicles((prev) => [...prev, newVehicle]);
      setStats((prev: any) => ({
        ...prev,
        totalVehicles: prev.totalVehicles + 1,
      }));
    }
    setIsVehicleModalOpen(false);
  };

  const handleDeleteVehicle = (id: string, name?: string) => {
    if (confirm(`Are you sure you want to decommission ${name || "this vehicle"} from the registered garage?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setStats((prev: any) => ({
        ...prev,
        totalVehicles: Math.max(0, prev.totalVehicles - 1),
      }));
    }
  };

  const handleOpenLeaderAdd = () => {
    setEditingLeader(null);
    setLeaderForm({
      name: "",
      nickname: "",
      rank: "Co-Lead",
      specialty: "Weed Logistics & Turf Warfare",
      bio: "An outstanding syndicate master taking charge of downtown streets with tactical superiority.",
      discord: "syndicate#1111",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
      achievements: "Heist Veteran, Street Baron",
    });
    setIsLeaderModalOpen(true);
  };

  const handleOpenLeaderEdit = (lead: Leader) => {
    setEditingLeader(lead);
    setLeaderForm({
      id: lead.id,
      name: lead.name,
      nickname: lead.nickname,
      rank: lead.rank,
      specialty: lead.specialty,
      bio: lead.bio,
      discord: lead.discord,
      avatar: lead.avatar,
      achievements: lead.achievements.join(", "),
    });
    setIsLeaderModalOpen(true);
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementsArray = leaderForm.achievements
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingLeader) {
      setLeaders((prev) =>
        prev.map((l) =>
          l.id === editingLeader.id
            ? {
                ...l,
                name: leaderForm.name,
                nickname: leaderForm.nickname,
                rank: leaderForm.rank,
                specialty: leaderForm.specialty,
                bio: leaderForm.bio,
                discord: leaderForm.discord,
                avatar: leaderForm.avatar,
                achievements: achievementsArray,
              }
            : l
        )
      );
    } else {
      const newLeader: Leader = {
        id: `lead-${Date.now()}`,
        name: leaderForm.name,
        nickname: leaderForm.nickname,
        rank: leaderForm.rank,
        specialty: leaderForm.specialty,
        bio: leaderForm.bio,
        discord: leaderForm.discord,
        avatar: leaderForm.avatar,
        achievements: achievementsArray,
      };
      setLeaders((prev) => [...prev, newLeader]);
    }
    setIsLeaderModalOpen(false);
  };

  const handleDeleteLeader = (id: string, name?: string) => {
    if (confirm(`Are you sure you want to dismiss ${name || "this hierarchy leader"}?`)) {
      setLeaders((prev) => prev.filter((l) => l.id !== id));
    }
  };

  // Filter players list in database
  const filteredPlayers = roster.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          player.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRank = rankFilter === "All" || player.rank.toLowerCase().includes(rankFilter.toLowerCase());
    return matchesSearch && matchesRank;
  });

  // Find current logged in user object securely
  const currentLoggedInUser = roster.find(p => p.id === loggedInUserId) || null;

  return (
    <div className={`min-h-screen text-slate-200 font-sans transition-colors duration-500 overflow-x-hidden relative ${
      isNightMode ? 'bg-[#040407]' : 'bg-[#0f111a]'
    }`}>
      
      {/* GTA-style introductory loading screen overlay */}
      {showLoader && (
        <LobbyLoader onComplete={() => {
          setShowLoader(false);
          window.scrollTo({ top: 0, behavior: "instant" });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }} />
      )}

      {/* Cyber ambient grid backlighting */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-red-650/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 py-1.5 px-4 text-[10px] font-mono font-bold text-black uppercase tracking-widest text-center relative z-40 shadow-sm flex items-center justify-center gap-2">
         <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
         <span>KAMMATTIPADAM FAMILY SPECIAL EVENT SESSIONS COMMENCING TODAY AT 19:30 UTC</span>
      </div>

      {/* Sleek Floating High-Tech Side Control Bar (Permanent Compact Action Dock) */}
      <div className="fixed right-2.5 sm:right-5 top-[150px] sm:top-[160px] z-50 flex flex-col items-end pointer-events-auto">
         <div className="flex flex-col items-center gap-3 bg-[#0a0d16]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative group">
            {/* Ambient indicator bar running down the left flank */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-red-500 via-orange-500 to-amber-500 rounded-full" />

            {/* Glowing System Pulse Indicator */}
            <div className="flex flex-col items-center gap-0.5 pt-0.5" title="Kammattipadam Secure Core Connection: 100% Online">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-[7.5px] font-mono tracking-wider font-extrabold text-slate-400">SYS</span>
            </div>

            <div className="w-full h-[1px] bg-white/5 my-1" />

            {/* Player Secure Terminal Icon */}
            <div className="relative group/btn flex flex-col items-center">
               <button 
                 onClick={() => { setActiveTab("login"); }}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                   activeTab === "login" 
                     ? "bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.45)] border border-orange-400/50" 
                     : "bg-white/5 text-slate-400 hover:text-orange-400 hover:bg-white/10 hover:border-orange-500/20 border border-transparent"
                 }`}
                 title="Open Secure Player Terminal"
               >
                  <Key className="w-4 h-4" />
                  
                  {/* Status ping indicator overlay on key button */}
                  {currentLoggedInUser ? (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                       <span className="animate-bounce absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : null}
               </button>

               {/* Gorgeous dynamic floating tooltip / popover */}
               <div className="absolute right-12 top-1.5 opacity-0 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:pointer-events-auto transition-all duration-300 transform translate-x-2 group-hover/btn:translate-x-0 z-50">
                  <div className="bg-[#0c101d] border border-white/10 rounded-xl p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.8)] w-40 font-mono text-[9px] text-slate-300 whitespace-nowrap">
                     <span className="text-orange-500 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">PLAYER LOGIN</span>
                     {currentLoggedInUser ? (
                        <div className="space-y-0.5 mt-1 border-t border-white/5 pt-1.5 text-slate-400">
                           <div className="truncate"><span className="text-slate-500">OPERATIVE:</span> <span className="text-white font-bold">{currentLoggedInUser.name}</span></div>
                           <div className="truncate"><span className="text-slate-500">RANK:</span> <span className="text-amber-400 uppercase">{currentLoggedInUser.rank}</span></div>
                        </div>
                     ) : (
                        <span className="text-slate-500 block mt-0.5 uppercase">SEPERATE SECURE ACCESS PORT</span>
                     )}
                  </div>
               </div>
            </div>

            {/* Admin Portal Icon */}
            <div className="relative group/btn flex flex-col items-center">
               <button 
                 onClick={() => { setActiveTab("admin"); }}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                   activeTab === "admin" 
                     ? "bg-gradient-to-br from-red-650 to-orange-550 text-white shadow-[0_0_15px_rgba(239,68,68,0.45)] border border-red-500/50" 
                     : "bg-white/5 text-slate-400 hover:text-red-400 hover:bg-white/10 hover:border-red-500/20 border border-transparent"
                 }`}
                 title="Open Administrative Console"
               >
                  <Lock className="w-4 h-4" />
               </button>

               {/* Tooltip for Admin Portal */}
               <div className="absolute right-12 top-1.5 opacity-0 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:pointer-events-auto transition-all duration-300 transform translate-x-2 group-hover/btn:translate-x-0 z-50">
                  <div className="bg-[#0c101d] border border-white/10 rounded-xl p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.8)] w-40 font-mono text-[9px] text-slate-300 whitespace-nowrap">
                     <span className="text-red-500 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">ADMIN CONSOLE</span>
                     <span className="text-slate-500 block mt-0.5 uppercase">MANAGEMENT SYSTEM</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Primary Desktop Sidebar & Layout Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-30 flex flex-col min-h-[calc(100vh-2.5rem)]">
        
        {/* Navigation bar with frosted glass elements */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl mb-6 relative">
          
          <div className="flex items-center gap-3">
             <div className="font-display font-black text-xl text-white tracking-widest uppercase flex items-center gap-2">
                <span className="relative inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-400 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                   K
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                </span>
                <span>KAMMATTIPADAM <span className="text-orange-500 italic text-sm">FAMILY</span></span>
             </div>
          </div>

          {/* Nav pills */}
          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {[
              { id: "home", label: "Home", icon: <Compass className="w-3.5 h-3.5" /> },
              { id: "players", label: "Players", icon: <Users className="w-3.5 h-3.5" /> },
              { id: "house", label: "House", icon: <Map className="w-3.5 h-3.5" /> },
              { id: "vehicles", label: "Vehicles", icon: <Car className="w-3.5 h-3.5" /> },
              { id: "leaders", label: "Leaders", icon: <Shield className="w-3.5 h-3.5" /> },
              { id: "contact", label: "Contact", icon: <ArrowRight className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-mono font-bold uppercase transition tracking-wider border cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-br from-red-650 to-orange-550 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)] border-transparent"
                    : "bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10 border-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <button
              onClick={() => setActiveTab("join")}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-extrabold uppercase transition tracking-widest border cursor-pointer flex items-center gap-1.5 ${
                activeTab === "join"
                  ? "bg-white text-black border-transparent shadow-lg"
                  : "bg-transparent text-amber-400 border-amber-400/40 hover:bg-amber-400 hover:text-black hover:border-transparent animate-pulse"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Join Family</span>
            </button>
          </nav>

          {/* Interactive audio panel & night mode toggle bar */}
          <div className="flex items-center gap-3">
            <AudioEngine />

            <button
              id="theme-toggle-btn"
              onClick={() => setIsNightMode(!isNightMode)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-slate-100 transition cursor-pointer"
              title={isNightMode ? "Switch to Day Atmosphere" : "Switch to Midnight Atmosphere"}
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA PANEL */}
        <main className="flex-1 flex flex-col gap-6">

          {/* TAB 1: HOME PAGE */}
          {activeTab === "home" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Massive Animated 3D Hero section */}
              <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden relative min-h-[400px] sm:min-h-[480px] flex flex-col justify-between">
                
                {/* Beautiful dynamic 3D-style rotating vector logo matching uploaded PNG */}
                <div className="absolute inset-0 z-0">
                  <RotatingLogo />
                </div>

                {/* Title badge overlay (cinematic look) */}
                <div className="relative z-10 p-6 sm:p-8 flex justify-between items-start pointer-events-none">
                  <div>
                    <span className="px-2.5 py-0.5 bg-red-650/30 border border-red-500/40 text-red-400 rounded text-[9px] font-mono font-bold tracking-widest uppercase">
                       LOS SANTOS CLAN CHART #1
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-1.5 tracking-tighter uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                       KPM REIGN
                    </h2>
                    <p className="text-xs font-mono text-slate-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                       STRENGTH • LOYALTY • BROTHERHOOD
                    </p>
                  </div>

                  <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-xl text-center flex flex-col leading-tight">
                    <span className="text-[12px] font-bold text-amber-400 font-mono">ESTD</span>
                    <span className="text-[14px] font-black text-white font-mono">2024</span>
                  </div>
                </div>

                {/* Main bottom call-to-action buttons */}
                <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-t from-black via-black/40 to-transparent pt-20">
                  <h3 className="text-lg sm:text-2xl font-bold font-display text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-xl">
                     WE ARE NOT JUST A FAMILY, WE ARE A REPUTATION.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed font-sans">
                     Kammattipadam is one of the premier organizations of the Grand RP project. Join us on our quest to dominate the turf wars, legal warehouses, weed industries, and private helipads.
                  </p>
                  
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("join")}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-display font-extrabold text-xs rounded-xl tracking-wider hover:from-red-500 hover:to-amber-400 transition transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-orange-500/20 uppercase"
                    >
                      Join Kammattipadam Portal
                    </button>
                    <button
                      onClick={() => setActiveTab("vehicles")}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs rounded-xl tracking-wider transition cursor-pointer flex items-center gap-2 uppercase"
                    >
                      <Car className="w-3.5 h-3.5 text-orange-400" />
                      Showroom Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Family Statistics & Achievements sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
                       {/* Stats grid */}
                <div className="border border-amber-500/30 bg-[#07090e]/95 p-6 rounded-3xl flex flex-col gap-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden">
                  {/* Subtle pulsing amber background spot */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
                  
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10 relative z-10">
                    <h3 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                      📊 FAMILY WEALTH METRICS
                    </h3>
                    <span className="text-[9px] bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-sm border border-amber-500/30 font-mono font-bold tracking-wider">
                      LIVE DIRECTORY
                    </span>
                  </div>

                  <div className="bg-gradient-to-b from-[#14120f] to-[#0a0907] p-6 rounded-2xl border border-amber-500/40 flex flex-col gap-2.5 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] z-10 group">
                    {/* Big faint dollar symbol glow */}
                    <div className="absolute top-1 right-2 text-amber-500/10 font-mono text-6xl font-black select-none pointer-events-none transition-transform group-hover:scale-110 duration-500">
                      $
                    </div>
                    
                    <span className="text-[11px] text-amber-300 font-mono uppercase block tracking-widest font-extrabold">
                      💰 TOTAL FAMILY WEALTH
                    </span>
                    
                    <span className="text-4xl sm:text-5xl font-extrabold font-display bg-gradient-to-r from-amber-300 via-yellow-250 to-amber-400 bg-clip-text text-transparent block tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] py-1 select-all">
                       {stats.familyWealth}
                    </span>
                    
                    <div className="h-[1px] bg-gradient-to-r from-amber-500/30 via-transparent to-transparent my-1" />
                    
                    <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold leading-normal">
                      🏦 COMBINED OFFSHORE LIQUID RESERVES & HEIST RESERVE BANKS
                    </span>
                  </div>
                </div>

                {/* Achievements Showcase Block */}
                <div className="glass-card p-6 rounded-3xl flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500 animate-pulse" />
                      GOLDEN REPUTATION MARKS
                    </h3>

                    <div className="space-y-3">
                      {familyAchievements.map((ach) => (
                        <div key={ach.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3 items-start">
                          <div className="text-2xl">{ach.icon}</div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-extrabold text-white uppercase">{ach.title}</h4>
                              <span className={`text-[8.5px] font-mono px-1 rounded font-bold uppercase ${
                                ach.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-550/20' :
                                ach.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {ach.tier}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-snug mt-1">
                              {ach.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                     <span>UNLOCKED: ALL THREE DIAMONDS</span>
                     <span>SECURE CLAN CERTIFIED</span>
                  </div>
                </div>

              </div>

              {/* STATUS DEPLOY PANEL: Real-time Member Status Radar */}
              <div id="live-members-status-feed" className="lg:col-span-12 glass-card p-6 sm:p-8 rounded-3xl flex flex-col gap-6 mt-2 relative overflow-hidden">
                {/* Visual decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 relative z-10">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      📡 LAS SANTOS LIVE CLAN STATUS REGISTRATION
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                      Real-time roster activity radar, synced from the player terminal & admin ledger
                    </p>
                  </div>

                  {/* Summary Counters */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span>ONLINE: {roster.filter(p => p.status === "Online").length}</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 leading-none">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                      <span>HEISTS: {roster.filter(p => p.status === "In Heist").length}</span>
                    </div>
                    <div className="bg-slate-500/10 border border-white/5 text-slate-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      <span>STANDBY: {roster.filter(p => p.status === "Offline" || !p.status).length}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  {roster.map((player) => {
                    const isOnline = player.status === "Online";
                    const isInHeist = player.status === "In Heist";
                    const isOffline = !player.status || player.status === "Offline";
                    
                    return (
                      <div 
                        key={player.id} 
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isInHeist ? "bg-amber-500/[0.03] border-amber-500/20 shadow-[inset_0_1px_15px_rgba(245,158,11,0.05)]" :
                          isOnline ? "bg-emerald-500/[0.02] border-emerald-500/15" :
                          "bg-black/20 border-white/5"
                        } hover:border-orange-500/30 group`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-lg relative font-sans group-hover:scale-105 transition-transform">
                              {player.avatar || "👤"}
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#0d0f19] rounded-full" />
                              )}
                              {isInHeist && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 border border-[#0d0f19] rounded-full animate-ping" />
                              )}
                            </div>
                            <div className="leading-tight">
                              <h4 className="text-xs font-bold text-white tracking-wide truncate max-w-[120px]">
                                {player.name}
                              </h4>
                              <p className={`text-[9.5px] font-bold font-mono tracking-wider uppercase mt-0.5 ${
                                player.rank?.toLowerCase() === "boss" ? "text-red-500" :
                                player.rank?.toLowerCase() === "co-lead" ? "text-purple-400" :
                                player.rank?.toLowerCase() === "captain" ? "text-amber-400" :
                                "text-slate-400"
                              }`}>
                                {player.rank || "SOLDIER"}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-mono tracking-wider uppercase border font-extrabold ${
                            isOnline ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            isInHeist ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
                            "bg-slate-500/10 text-slate-500 border-slate-500/10"
                          }`}>
                            {player.status || "Offline"}
                          </span>
                        </div>

                        {/* Current Status Log */}
                        <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex flex-col justify-between min-h-[44px]">
                          <span className="text-[8px] uppercase font-mono tracking-wider text-slate-500 font-bold">ASSIGNED POSTED DUTY</span>
                          <span className="text-[10px] text-slate-200 mt-0.5 font-medium leading-relaxed truncate block">
                            {isInHeist ? "🚨 Participating in active safe zone heist" :
                             isOnline ? `⚡ Active Duty: ${player.role || "Patrolling Turf"}` :
                             "💤 Off Duty: Resting in secure sector"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 border-t border-white/5 pt-4 gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                    <span>SECURE INTEGRITY DIRECTORY STABLE</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab("login")}
                    className="text-amber-400 hover:text-amber-300 font-bold uppercase transition flex items-center gap-1 border-b border-amber-400/20 pb-0.5 cursor-pointer hover:border-amber-300/40 animate-pulse text-[11px]"
                  >
                    🚀 Member Check-In Terminal to Switch Status →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: PLAYER TERMINAL LOGIN PAGE */}
          {activeTab === "login" && (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
                     <Key className="w-5 h-5 text-orange-550" />
                     Secure Player Terminal
                  </h3>
                  <p className="text-xs text-slate-450 font-mono tracking-wide mt-1">
                     DEDICATED IDENTITY ACCESS & SECURE DUTY CHECK-IN
                  </p>
                </div>
                <div className="bg-white/5 p-2 px-3 rounded-xl text-[11px] font-mono text-slate-300">
                  <span className="text-orange-500 font-bold">STATUS:</span> OPERATIVE TERMINAL PORT
                </div>
              </div>

              <PlayerLoginPortal 
                players={roster}
                onUpdatePlayer={(updatedPlayer) => {
                  setRoster(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
                }}
              />
            </div>
          )}

          {/* TAB 2: PLAYERS ROSTER PAGE */}
          {activeTab === "players" && (
            <div className="flex flex-col gap-6">
              
              {/* Header Title Section with inputs */}
              <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
                     <Users className="w-5 h-5 text-orange-500" />
                     Kammattipadam Active Roster
                  </h3>
                  <p className="text-xs text-slate-400 font-mono tracking-wide">
                     REAL-TIME IN-GAME CHARACTER REGISTER & HEIST LOGS
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button
                    onClick={handleOpenPlayerAdd}
                    className="py-2.5 px-4 bg-gradient-to-r from-red-650 to-orange-550 hover:from-red-600 hover:to-orange-500 text-white rounded-xl text-xs font-mono font-extrabold uppercase transition tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Recruit Base</span>
                  </button>

                  {/* Search query box */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search member tag..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-[#080812] border border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 tracking-wide text-white font-mono"
                    />
                  </div>

                  {/* Filter rank box */}
                  <div className="flex items-center gap-2 bg-[#080812] border border-white/10 rounded-xl p-1 px-3">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={rankFilter}
                      onChange={(e) => setRankFilter(e.target.value)}
                      className="bg-transparent text-xs font-mono text-slate-300 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="All" className="bg-[#0f111a]">Filter: Rank (All)</option>
                      <option value="FOUNDER" className="bg-[#0f111a]">FOUNDER</option>
                      <option value="GOD FATHER" className="bg-[#0f111a]">GOD FATHER</option>
                      <option value="FAMILY DON" className="bg-[#0f111a]">FAMILY DON</option>
                      <option value="KPM DEPUTY" className="bg-[#0f111a]">KPM DEPUTY</option>
                      <option value="UNDERBOSS" className="bg-[#0f111a]">UNDERBOSS</option>
                      <option value="TRAINING LD" className="bg-[#0f111a]">TRAINING LD</option>
                      <option value="SUPERIORS" className="bg-[#0f111a]">SUPERIORS</option>
                      <option value="FW MEMBERS" className="bg-[#0f111a]">FW MEMBERS</option>
                      <option value="KPM MEMBERS" className="bg-[#0f111a]">KPM MEMBERS</option>
                      <option value="QUEENS" className="bg-[#0f111a]">QUEENS</option>
                      <option value="TRAINEE" className="bg-[#0f111a]">TRAINEE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Roster Grid */}
              {filteredPlayers.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-3xl">
                   <p className="text-slate-450 font-mono text-sm">No clan members match your filter criteria.</p>
                   <button 
                     onClick={() => { setSearchQuery(""); setRankFilter("All"); }}
                     className="mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono border border-white/5 cursor-pointer"
                   >
                     Clear Filters
                   </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlayers.map((player) => (
                    <div key={player.id} className="glass-card p-5 rounded-3xl relative overflow-hidden glass-card-hover border border-white/5 pt-12">
                      
                      {/* Top banner tag status */}
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-black/60 rounded-xl border border-white/10 flex items-center justify-center text-xl shadow-inner">
                              {player.avatar}
                           </div>
                           <div>
                             <h4 className="text-sm font-bold text-white tracking-wider font-mono">{player.name}</h4>
                             <p className="text-[10px] text-orange-400 font-mono block tracking-tight uppercase">{player.rank}</p>
                           </div>
                         </div>

                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border ${
                            player.status === "Online" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            player.status === "In Heist" ? "bg-amber-500/10 text-amber-400 border-amber-505/20 animate-pulse" :
                            "bg-slate-500/10 text-slate-500 border-white/5"
                         }`}>
                           {player.status}
                         </span>
                      </div>

                      {/* Role & detailed logs */}
                      <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Assigned Duty Role</span>
                          <span className="text-slate-200 mt-0.5 block font-medium font-sans leading-relaxed">
                             {player.role}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Clan Contribution XP</span>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-orange-500" style={{ width: `${(player.xp / 10000) * 100}%` }} />
                             </div>
                             <span className="text-[10px] font-bold text-amber-400 font-mono">{player.xp} XP</span>
                          </div>
                        </div>

                        {/* Achievements list inside player cards */}
                        <div>
                          <span className="text-[9px] text-slate-500 font-mono uppercase block mb-1">UNLOCKED CERTIFICATES</span>
                          <div className="flex flex-wrap gap-1">
                             {player.achievements.map((item, idx) => (
                               <span key={idx} className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-[8.5px] text-slate-350 font-mono truncate max-w-[190px]">
                                  🏆 {item}
                               </span>
                             ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer showing joining dates & Discord Handle */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                         <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-650" /> Joined {player.joinDate}
                         </span>
                         {player.discord && (
                            <span className="text-slate-450 hover:text-white cursor-help" title="Copy handle">
                               💬 {player.discord}
                            </span>
                         )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}


          {/* TAB 3: MANSION INSPECTOR HOUSE PAGE */}
          {activeTab === "house" && (() => {
            // Define the map markers representing the GTA V Radmir/Grand RP state
            const mapMarkers = [
              {
                id: "hq-mansion",
                category: "ACQUIRED",
                title: "Richman Glen Mansion Close #144",
                subtitle: "Kammattipadam Organisation HQ",
                description: "Our heavily armored operational hub. Includes underground brief rooms, vehicle bay armada, and secure defense perimeters.",
                x: 48,
                y: 15,
                color: "#ef4444",
                icon: <Home className="w-3.5 h-3.5" />,
                details: ["25 Luxury garage slots", "Underground escape tunnel", "Encrypted satellite feed"]
              },
              {
                id: "vacant-1",
                category: "VACANT",
                title: "Vacant House #12",
                subtitle: "Edovo Slopes",
                description: "A standard family real-estate node currently available on the market. Ideal for starter storage or quick escape checkpoints.",
                x: 18,
                y: 8,
                color: "#22c55e",
                icon: <Home className="w-3.5 h-3.5" />,
                details: ["10 Safe boxes capacity", "Low tax bracket", "Decent backyard road access"]
              },
              {
                id: "vacant-2",
                category: "VACANT",
                title: "Vacant Farmhouse #89",
                subtitle: "Batyrevo Valley",
                description: "A remote, spacious countryside property suitable for agriculture or contraband assembly lines.",
                x: 68,
                y: 22,
                color: "#22c55e",
                icon: <Home className="w-3.5 h-3.5" />,
                details: ["Contraband storage vault", "Remote field runways", "Helipad compatible layout"]
              },
              {
                id: "vacant-3",
                category: "VACANT",
                title: "Vacant Apartment #205",
                subtitle: "Lytkarino Blocks",
                description: "High-density residential housing. Perfect for foot soldiers to lay low from federal authorities.",
                x: 14,
                y: 65,
                color: "#22c55e",
                icon: <Home className="w-3.5 h-3.5" />,
                details: ["Covert backup entrances", "Fibre optic surveillance tap", "Cheap maintenance cost"]
              },
              {
                id: "bm-1",
                category: "BLACK_MARKET",
                title: "Central Black Market",
                subtitle: "Koryakino Outskirts",
                description: "The primary neutral trading hub. Acquired automatic carbines, heavy armor, and illegal narcotics are traded here without government taxes.",
                x: 42,
                y: 82,
                color: "#06b6d4",
                icon: <Skull className="w-3.5 h-3.5" />,
                details: ["Tax-free transactions", "Contraband export dock", "Armed neutral defense bots"]
              },
              {
                id: "tss-1",
                category: "TSS",
                title: "Batyrevo Tuning & Styling",
                subtitle: "TSS Workshop",
                description: "High-performance vehicle workshop. Tune engine horsepower coefficients, change tire drift compounds, and apply custom gold paints.",
                x: 58,
                y: 16,
                color: "#f97316",
                icon: <Wrench className="w-3.5 h-3.5 text-white" />,
                details: ["Nitro booster retrofits", "Armor plating reinforcement", "Underglow bulb installations"]
              },
              {
                id: "tss-2",
                category: "TSS",
                title: "Lytkarino Custom Wheels",
                subtitle: "TSS South Station",
                description: "Specialized tire and stance tuning station for high-stakes urban getaway planning.",
                x: 20,
                y: 56,
                color: "#f97316",
                icon: <Wrench className="w-3.5 h-3.5 text-white" />,
                details: ["Drift tire compound shop", "Custom neon calibrations", "Weight center modifications"]
              },
              {
                id: "sis-1",
                category: "SIS",
                title: "SIS Command Node",
                subtitle: "Central Intelligence Spot",
                description: "State-of-the-art secure transmission facility mapping intelligence on rival factions and treasury patrol trucks.",
                x: 32,
                y: 45,
                color: "#8b5cf6",
                icon: <Shield className="w-3.5 h-3.5 text-white" />,
                details: ["Live convoy telemetry lists", "Police radio frequency tap", "Contraband tracker sweepers"]
              },
              {
                id: "police-1",
                category: "POLICE",
                title: "Arzamas Central Police HQ",
                subtitle: "State Authorities Station",
                description: "Heavy federal presence. Officers patrol out of this block in high-speed interceptors. Keep standard weaponry holstered nearby.",
                x: 45,
                y: 54,
                color: "#3b82f6",
                icon: <Shield className="w-3.5 h-3.5 text-white" />,
                details: ["Mugshot clearing interface", "Heavy detention vaults", "FIB tactical cruisers fleet"]
              },
              {
                id: "hospital-1",
                category: "HOSPITAL",
                title: "Arzamas Municipal Hospital",
                subtitle: "Emergency Medical Bay",
                description: "Primary revival station. When health is depleted during turf skirmishes, members respawn here to obtain adrenaline boosters.",
                x: 38,
                y: 48,
                color: "#ec4899",
                icon: <Heart className="w-3.5 h-3.5 text-white" />,
                details: ["Adrenaline booster storage", "Trauma kits dispensers", "Health stabilization chambers"]
              },
              {
                id: "state-1",
                category: "GOVERNMENT",
                title: "Arzamas State Government House",
                subtitle: "Administrative Command Center",
                description: "Where business certifications, private vehicle registration deeds, and organisation licenses are legally processed.",
                x: 36,
                y: 38,
                color: "#64748b",
                icon: <Landmark className="w-3.5 h-3.5 text-white" />,
                details: ["Business permits vault", "Gold standard bullion treasury", "Governor executive lounge"]
              },
              {
                id: "news-1",
                category: "NEWS",
                title: "TV & Radio Broadcast News Tower",
                subtitle: "Garel Media Hub",
                description: "Broadcasting state news alerts. Submit advertisement runs for family recruitments or market product listings.",
                x: 62,
                y: 72,
                color: "#eab308",
                icon: <Tv className="w-3.5 h-3.5" />,
                details: ["Global broadcast terminals", "High-power radio relays", "Aerial reporting helicopter pad"]
              },
              {
                id: "military-1",
                category: "MILITARY",
                title: "Batyrevo Military Base Airfield",
                subtitle: "National Guard Garrison",
                description: "High-security militarized zone. Guards shoot trespassers instantly. Stores fighter jets, tanks, and top-tier heavy combat rifles.",
                x: 82,
                y: 10,
                color: "#15803d",
                icon: <Shield className="w-3.5 h-3.5 text-white" />,
                details: ["Rhino tanks armory park", "Pistone laser defense systems", "Secure fighter hangar gates"]
              },
              {
                id: "factory-1",
                category: "FACTORY",
                title: "Koryakino Tools Factory",
                subtitle: "Production & Heavy Machinery",
                description: "Industrial assembly plant where members manufacture drills, electronic hacking kits, and lockpicks for vaults.",
                x: 44,
                y: 80,
                color: "#f59e0b",
                icon: <Settings className="w-3.5 h-3.5" />,
                details: ["Laser drill assembly lines", "Heavy lockpick molding machines", "Contraband packing containers"]
              }
            ];

            const activeMarker = mapMarkers.find(m => m.id === selectedMapMarkerId) || mapMarkers[0];

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-fade-in">
                
                {/* Visual Intersect Tactical Map Box */}
                <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden relative min-h-[480px] flex flex-col justify-between border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  
                  {/* Map Canvas Background Container updated to render the high-fidelity tactical map image */}
                  <div className="absolute inset-0 z-0 bg-[#162512] relative overflow-hidden select-none">
                    
                    {/* Official high-resolution top-down GTA Radmir/CRMP style landscape map image */}
                    <img 
                      src="https://i.imgur.com/W1fAtp0.png"
                      onError={(e) => {
                        // High-contrast dark top-down satellite terrain fallback from Unsplash to guarantee 100% load success
                        e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600";
                      }}
                      alt="Radmir CRMP Map Image"
                      className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none select-none transition-opacity duration-500"
                    />

                    {/* Topographical Satellite Grid Overlay for rich HUD style */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />
                    
                    {/* Atmospheric map noise / elevation textures */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(0,0,0,0.8))] z-10" />

                    {/* Labeled District Landmark Text Overlays */}
                    <div className="absolute inset-0 pointer-events-none font-black tracking-widest text-[10px] sm:text-[11px] uppercase font-sans">
                      {/* Lytkaring */}
                      <div className="absolute bottom-[30%] left-[8%] text-white/50 bg-black/15 px-2 py-0.5 rounded border border-white/5">
                        LYTKARING
                      </div>
                      
                      {/* Edovo */}
                      <div className="absolute top-[5%] left-[10%] text-white/50 bg-black/15 px-2 py-0.5 rounded border border-white/5">
                        EDOVO
                      </div>

                      {/* Batyrevo */}
                      <div className="absolute top-[16%] left-[45%] text-white/50 bg-black/15 px-2 py-0.5 rounded border border-white/5">
                        BATYREVO
                      </div>

                      {/* Arzamas */}
                      <div className="absolute top-[48%] left-[34%] text-slate-100/70 bg-black/30 px-3 py-1 rounded-md border border-white/10 font-bold tracking-widest text-[11px] sm:text-[13px]">
                        ARZAMAS
                      </div>

                      {/* Koryakino */}
                      <div className="absolute bottom-[24%] left-[36%] text-white/50 bg-black/15 px-2 py-0.5 rounded border border-white/5">
                        KORYAKINO
                      </div>

                      {/* Garel */}
                      <div className="absolute bottom-[32%] left-[64%] text-white/50 bg-black/15 px-2 py-0.5 rounded border border-white/5">
                        GAREL
                      </div>
                    </div>

                    {/* Back Arrow Button exactly like screenshot in top-left */}
                    <button 
                      onClick={() => setActiveTab("home")}
                      className="absolute top-4 left-4 z-20 w-11 h-11 bg-black/85 hover:bg-black border border-white/10 text-white rounded-lg flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Map Active Markers Overlay */}
                    <div className="absolute inset-0 z-10">
                      {mapMarkers.map((marker) => {
                        const isSelected = marker.id === selectedMapMarkerId;
                        const isVisible = legendFilters.includes(marker.category);
                        
                        if (!isVisible) return null;

                        return (
                          <div 
                            key={marker.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                          >
                            {/* Special targeting crosshair and pulse specifically for our ACQUIRED organisation HQ */}
                            {marker.category === "ACQUIRED" && (
                              <div className="absolute -inset-8 pointer-events-none flex items-center justify-center">
                                {/* Tech crosshair circles */}
                                <div className="absolute w-14 h-14 border border-dashed border-white/40 rounded-full animate-spin [animation-duration:15s]" />
                                <div className="absolute w-10 h-10 border border-white/30 rounded-full" />
                                {/* Crosshair reticle ticks */}
                                <div className="absolute h-10 w-0.5 bg-white/20" />
                                <div className="absolute w-10 h-0.5 bg-white/20" />
                              </div>
                            )}

                            {/* Standard clickable marker button */}
                            <button
                              id={`marker-${marker.id}`}
                              onClick={() => {
                                setSelectedMapMarkerId(marker.id);
                                if (marker.id === "hq-mansion") {
                                  // Default sub-hotspot selection
                                  setSelectedSpot(mansionSpots[0]);
                                }
                              }}
                              className={`group relative p-2.5 rounded-full border-2 transition-all duration-300 transform scale-100 hover:scale-125 cursor-pointer flex items-center justify-center ${
                                isSelected 
                                  ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.9)] z-30" 
                                  : "border-black/50 hover:bg-white hover:text-black z-20"
                              }`}
                              style={{ 
                                backgroundColor: isSelected ? "#ffffff" : marker.color,
                                color: isSelected ? "#000000" : "#ffffff"
                              }}
                            >
                              {/* Inner icon */}
                              {marker.icon}

                              {/* Glowing pulse ring for active high-stakes spots */}
                              {isSelected && (
                                <span className="absolute -inset-1 rounded-full border border-white animate-ping opacity-75" />
                              )}

                              {/* Hover tooltip */}
                              <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-black/90 text-[10px] font-mono text-white rounded border border-white/15 shadow-xl font-bold uppercase tracking-widest whitespace-nowrap pointer-events-none transition-opacity duration-200">
                                {marker.title}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* BOTTOM OVERLAY FOOTER WITHIN THE MAP BOX */}
                  <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/50 to-transparent border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                     <div>
                       <span className="px-2.5 py-0.5 bg-red-650 font-mono text-[9px] font-bold text-white uppercase tracking-widest rounded bg-red-600">
                         LIVE TACTICAL LINK
                       </span>
                       <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans mt-1">
                         {selectedMapMarkerId === "hq-mansion" ? "🏠 KAMMATTIPADAM SAFE-HQ MODEL" : `📍 SELECTED SPOT: ${activeMarker.title}`}
                       </h4>
                     </div>
                     <div className="text-[10px] font-mono text-slate-400">
                        LATITUDE: {selectedMapMarkerId === "hq-mansion" ? "N 55°64'" : `N ${activeMarker.y}°` } • LONGITUDE: {selectedMapMarkerId === "hq-mansion" ? "E 37.18'" : `E ${activeMarker.x}°` }
                     </div>
                  </div>

                </div>

                {/* Legend Sidebar right-hand column (matches layout precisely) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* LEGEND FILTERS PANEL */}
                  <div className="glass-card rounded-3xl border border-white/10 overflow-hidden bg-[#0a0a14]/90 shadow-2xl">
                    <div 
                      onClick={() => setExpandedLegend(!expandedLegend)}
                      className="p-5 border-b border-white/5 flex justify-between items-center bg-[#07070e] cursor-pointer hover:bg-white/[0.02] transition"
                    >
                      <h3 className="text-xs font-bold text-slate-200 tracking-widest font-mono flex items-center gap-2">
                         <Compass className="w-4 h-4 text-orange-500" />
                         🗺️ TERRITORY LEGEND
                      </h3>
                      <button className="text-slate-400 hover:text-white p-1">
                        <ChevronsUpDown className={`w-4 h-4 transform transition-transform duration-300 ${expandedLegend ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {expandedLegend && (
                      <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto custom-scroll">
                        
                        {/* Vacant House */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("VACANT") ? prev.filter(f => f !== "VACANT") : [...prev, "VACANT"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("VACANT") 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <Home className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Vacant House</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">FILTER</span>
                        </div>

                        {/* Acquired House */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("ACQUIRED") ? prev.filter(f => f !== "ACQUIRED") : [...prev, "ACQUIRED"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("ACQUIRED") 
                              ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <Home className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Acquired House</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">ACTIVE</span>
                        </div>

                        {/* Black Market */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("BLACK_MARKET") ? prev.filter(f => f !== "BLACK_MARKET") : [...prev, "BLACK_MARKET"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("BLACK_MARKET") 
                              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            <Skull className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Black Market</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">ILLEGAL</span>
                        </div>

                        {/* TSS Tuning Shops */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("TSS") ? prev.filter(f => f !== "TSS") : [...prev, "TSS"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("TSS") 
                              ? "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <Wrench className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">TSS Tuning</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">WORKSHOP</span>
                        </div>

                        {/* SIS Intelligence */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("SIS") ? prev.filter(f => f !== "SIS") : [...prev, "SIS"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("SIS") 
                              ? "bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">SIS Intel</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">SECURE</span>
                        </div>

                        {/* Police */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("POLICE") ? prev.filter(f => f !== "POLICE") : [...prev, "POLICE"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("POLICE") 
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Police Stations</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">AUTHORITY</span>
                        </div>

                        {/* Hospital */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("HOSPITAL") ? prev.filter(f => f !== "HOSPITAL") : [...prev, "HOSPITAL"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("HOSPITAL") 
                              ? "bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-pink-500" />
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Hospitals</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">MEDICAL</span>
                        </div>

                        {/* State Government */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("GOVERNMENT") ? prev.filter(f => f !== "GOVERNMENT") : [...prev, "GOVERNMENT"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("GOVERNMENT") 
                              ? "bg-slate-400/10 border-slate-400/20 text-slate-300 hover:bg-slate-400/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            <Landmark className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Government</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">LAWS</span>
                        </div>

                        {/* TV and Radio broadcast News */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("NEWS") ? prev.filter(f => f !== "NEWS") : [...prev, "NEWS"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("NEWS") 
                              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <Tv className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">TV & Radio Media</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">ADS</span>
                        </div>

                        {/* Military Unit */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("MILITARY") ? prev.filter(f => f !== "MILITARY") : [...prev, "MILITARY"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("MILITARY") 
                              ? "bg-green-700/10 border-green-700/20 text-green-500 hover:bg-green-700/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-green-700" />
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Military Units</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">CONVOY</span>
                        </div>

                        {/* Tools Factory */}
                        <div 
                          onClick={() => {
                            setLegendFilters(prev => prev.includes("FACTORY") ? prev.filter(f => f !== "FACTORY") : [...prev, "FACTORY"])
                          }}
                          className={`flex justify-between items-center p-2 rounded-xl border border-transparent cursor-pointer transition select-none ${
                            legendFilters.includes("FACTORY") 
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15" 
                              : "bg-white/5 text-slate-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <Settings className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Tools Factory</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/5">HEISTS</span>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* ACTIVE MARKER DETAILS CARD */}
                  <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between bg-[#0a0a14]/90 shadow-2xl relative min-h-[300px]">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" 
                          style={{ backgroundColor: activeMarker.color }} 
                        />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                          {activeMarker.subtitle}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-extrabold text-white uppercase font-sans tracking-tight">
                        {activeMarker.title}
                      </h4>
                      
                      <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                        {activeMarker.description}
                      </p>

                      {/* INTEGRATED SUB-HOTSPOTS SWITCHER SPECIFICALLY FOR OUR HQ MANSION */}
                      {activeMarker.id === "hq-mansion" ? (
                        <div className="mt-4 border-t border-white/5 pt-4">
                          <h5 className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest mb-3">
                             🏠 HQ INTERIOR HOTSPOTS (3D)
                          </h5>
                          
                          {/* Spot selector buttons list */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {mansionSpots.map((spot) => (
                              <button
                                key={spot.id}
                                onClick={() => setSelectedSpot(spot)}
                                className={`py-2 rounded-xl text-[9px] sm:text-[10px] font-bold font-mono transition text-center border cursor-pointer ${
                                  selectedSpot.id === spot.id
                                    ? "bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md border-transparent"
                                    : "bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10 border-white/5"
                                }`}
                              >
                                {spot.id === "spot-garage" ? "GARAGE" : spot.id === "spot-conf" ? "WAR ROOM" : "ARMORY"}
                              </button>
                            ))}
                          </div>

                          {/* Render sub-spot specific description instead of static marker bullets */}
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2 mt-2">
                            <span className="text-[9px] text-orange-400 font-mono font-bold uppercase tracking-wider block">
                               Active Room: {selectedSpot.title}
                            </span>
                            <p className="text-[11px] text-slate-300 italic leading-snug">
                               "{selectedSpot.description}"
                            </p>
                            <ul className="space-y-1.5 pt-2 border-t border-white/5">
                              {selectedSpot.detailPoints.map((point, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="text-[9px] font-mono text-slate-500 pt-1 flex justify-between">
                              <span>COORDS:</span>
                              <span className="text-slate-300">{selectedSpot.cameraCoords.x}, {selectedSpot.cameraCoords.y}, {selectedSpot.cameraCoords.z}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard points for regular locations */
                        <div className="border-t border-white/5 pt-4 mt-4">
                          <span className="text-[9px] text-slate-500 font-mono uppercase block mb-2">
                            CRITICAL DATA POINTS
                          </span>
                          <ul className="space-y-1.5">
                             {activeMarker.details.map((point, index) => (
                               <li key={index} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                  <span>{point}</span>
                               </li>
                             ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer dynamic button linking map tracking coordinates */}
                    <div className="mt-6 flex gap-3">
                      <button 
                        onClick={() => {
                          const marker = document.getElementById(`marker-${activeMarker.id}`);
                          if (marker) {
                            marker.classList.add("scale-150");
                            // Quick CSS toggle
                            const originalColor = marker.style.backgroundColor;
                            marker.style.backgroundColor = "#fbbf24";
                            setTimeout(() => {
                              marker.classList.remove("scale-150");
                              marker.style.backgroundColor = originalColor;
                            }, 1000);
                          }
                        }}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white transition font-semibold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                        <span>LOCATE COORDINATES</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}


          {/* TAB 4: VEHICLE SHOWROOM PAGE */}
          {activeTab === "vehicles" && (
            <div className="flex flex-col gap-6">
              
              {/* Showroom Interactive Platform Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 2D Premium Supercar Showcase Platform */}
                <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden relative min-h-[380px] sm:min-h-[460px] flex flex-col justify-between border border-white/10 bg-gradient-to-b from-slate-950/80 to-[#020205]">
                  
                  {/* Grid overlay & ambient glow matching vehicle specifications */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
                  
                  {/* Dynamic background lighting for selected body color and underglow */}
                  <div 
                    className="absolute inset-0 opacity-25 blur-[120px] transition-all duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${selectedVehicle.colorHex}ff 0%, ${selectedVehicle.underglowColor || 'rgba(255,165,0,0.5)'} 50%, transparent 100%)`
                    }}
                  />

                  {/* Clean design watermarks */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="text-[120px] sm:text-[160px] font-black tracking-tighter text-white/[0.02] font-sans uppercase">
                      {selectedVehicle.category}
                    </span>
                  </div>

                  {/* Top Header details inside the 2D showcase */}
                  <div className="relative z-10 p-6 flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-orange-400 rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 w-fit">
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                         SHOWROOM DIRECTORY CARDS
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black font-sans text-white uppercase tracking-tight mt-3">
                         {selectedVehicle.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-1">
                         Category: <span className="text-white font-bold">{selectedVehicle.category}</span> • Paint Customization: <span className="font-bold text-slate-200" style={{ color: selectedVehicle.colorHex }}>{selectedVehicle.colorName}</span>
                      </p>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl text-center">
                       <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider">VALUATION</span>
                       <span className="text-sm font-mono font-bold text-amber-400 uppercase">{selectedVehicle.priceInGc}</span>
                    </div>
                  </div>

                  {/* Interactive Visual Blueprint Icon Centerpiece */}
                  <div className="relative z-10 flex flex-col justify-center items-center py-6 text-center">
                    <div className="relative p-10 rounded-full border border-white/5 bg-gradient-to-b from-white/5 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                      {/* Stylized vector vehicle icon wrapper glowing with vehicle style */}
                      <Car 
                        className="w-28 h-28 stroke-[1] text-white transition-all duration-700 filter drop-shadow-[0_0_15px_var(--glow)]" 
                        style={{ 
                          color: selectedVehicle.colorHex,
                          "--glow": selectedVehicle.colorHex
                        } as React.CSSProperties}
                      />
                      <div 
                        className="absolute bottom-6 w-24 h-1.5 rounded-full filter blur-md transition-all duration-700" 
                        style={{ backgroundColor: selectedVehicle.underglowColor || 'transparent' }}
                      />
                    </div>
                    <div className="mt-4 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9.5px] font-mono text-slate-400 uppercase tracking-widest">
                      CHASSIS CONFIGURATION: ACTIVE
                    </div>
                  </div>

                  {/* Bottom details description */}
                  <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/40 to-transparent border-t border-white/5">
                     <p className="text-xs text-slate-300 max-w-xl leading-relaxed italic">
                        "{selectedVehicle.description}"
                     </p>
                  </div>
                </div>

                {/* Specific stats card on the right */}
                <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/5">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">
                       🏎️ HIGH-SPEC PERFORMANCE EXPORTS
                    </h3>

                    <div className="space-y-4">
                      {/* Speed stat */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
                          <span>TOP ENGINE SPEED</span>
                          <span className="text-orange-400 font-bold">{selectedVehicle.topSpeed} KM/H</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-orange-500" style={{ width: `${(selectedVehicle.topSpeed / 460) * 100}%` }} />
                        </div>
                      </div>

                      {/* Acceleration */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
                          <span>0 - 100 ACCELERATION</span>
                          <span className="text-amber-400 font-bold">{selectedVehicle.acceleration} SECS</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                           {/* Speed is inverse (the lower the better, so we do 10 - acc) */}
                           <div className="h-full bg-amber-400" style={{ width: `${((10 - selectedVehicle.acceleration) / 9) * 100}%` }} />
                        </div>
                      </div>

                      {/* Handling */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
                          <span>STEERING & TRACTION GRIP</span>
                          <span className="text-emerald-400 font-bold">{selectedVehicle.handling} / 10</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-emerald-400" style={{ width: `${(selectedVehicle.handling / 10) * 100}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="p-3 bg-white/5 rounded-xl text-center">
                          <span className="text-[8.5px] text-slate-500 font-mono block">UNDERGLOW</span>
                          <span className="text-xs font-bold font-mono mt-0.5 inline-block text-white uppercase">
                             {selectedVehicle.underglowColor.includes("255,0,0") ? "COSMIC RED" :
                              selectedVehicle.underglowColor.includes("235,178") ? "GOLD PLATINUM" :
                              selectedVehicle.underglowColor.includes("255,87") ? "ORANGE FLAME" : "VIOLET HAZE"}
                          </span>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl text-center">
                          <span className="text-[8.5px] text-slate-500 font-mono block">OWNER</span>
                          <span className="text-xs font-bold font-mono mt-0.5 inline-block text-slate-300 truncate w-full">
                             {selectedVehicle.owner.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-500/10 rounded-2xl text-[10.5px] text-orange-400 border border-orange-500/20 text-center uppercase tracking-wide font-mono mt-6">
                     Family members have safe-zone keys to operate this chassis!
                  </div>

                </div>

              </div>

              {/* Showroom Catalog listing below */}
              <div>
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                       📦 SELECT VEHICLE FROM OUR ARMADA
                    </h4>
                    <button
                      onClick={handleOpenVehicleAdd}
                      className="py-1.5 px-3 bg-gradient-to-r from-red-600 to-orange-550 hover:brightness-110 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Register Vehicle</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {vehicles.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => setSelectedVehicle(car)}
                        className={`p-4 rounded-2xl transition border text-left cursor-pointer ${
                          selectedVehicle.id === car.id
                            ? "bg-[#0b0b14] border-orange-500 text-white shadow-xl"
                            : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10"
                        }`}
                      >
                         <span className="text-[9px] font-mono text-slate-500 flex justify-between items-center uppercase mb-1 w-full">
                            <span>{car.category} • {car.priceInGc}</span>
                            <span className="flex items-center gap-1">
                              <span onClick={(e) => { e.stopPropagation(); handleOpenVehicleEdit(car); }} className="p-1 hover:bg-orange-550/20 border border-transparent hover:border-orange-500/20 text-slate-400 hover:text-orange-400 rounded transition cursor-pointer" title="Edit Vehicle"><Edit3 className="w-2.5 h-2.5" /></span>

                            </span>
                         </span>
                         <h5 className="text-sm font-bold block truncate text-slate-100">
                            {car.name}
                         </h5>
                         <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-3">
                            <span>SPEED: {car.topSpeed} KM/H</span>
                            <span className="text-orange-400">SELECT ➜</span>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>

            </div>
          )}


          {/* TAB 5: LEADERS FAMILY HIERARCHY PAGE */}
          {activeTab === "leaders" && (
            <div className="flex flex-col gap-6">
              
              <div className="glass-card p-6 rounded-3xl text-center max-w-2xl mx-auto">
                 <span className="px-2 py-0.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-2 inline-block">
                    Kammattipadam Hierarchy
                 </span>
                 <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase mt-1">
                    Meet the Family Administration
                 </h3>
                 <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                    A collection of founders, operation leads, and business architects mapping syndicate turf empires from safe chambers.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleOpenLeaderAdd}
                      className="py-1.5 px-4 bg-gradient-to-r from-amber-500 to-orange-550 hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Appoint Hierarchy Leader</span>
                    </button>
                  </div>
                  {/* Spacer info */}
              </div>

              {/* Leaders list cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {leaders.map((lead) => (
                   <div key={lead.id} className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-white/5 relative group pt-8">
                      <div className="absolute top-4 left-4 flex gap-1 z-20">
                         <button onClick={() => handleOpenLeaderEdit(lead)} className="p-1.5 bg-black/60 border border-white/10 hover:border-orange-500 text-slate-300 hover:text-orange-400 rounded-lg transition cursor-pointer" title="Edit Leader"><Edit3 className="w-3 h-3" /></button>

                      </div>
                      
                      {/* Top Glowing badge depending on absolute Rank */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase z-10">
                         {lead.rank}
                      </div>

                      <div className="p-6">
                         <div className="flex items-center gap-4 mb-4">
                            <img 
                              src={lead.avatar} 
                              alt={lead.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-lg"
                            />
                            <div>
                               <h4 className="text-base font-bold text-white font-mono">{lead.name}</h4>
                               <p className="text-xs text-orange-500 font-mono font-semibold">"{lead.nickname}"</p>
                            </div>
                         </div>

                         <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Specialization</span>
                              <span className="text-slate-200 block font-medium mt-0.5 leading-snug">{lead.specialty}</span>
                            </div>

                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Biography Overview</span>
                              <p className="text-slate-450 block italic text-[11px] leading-relaxed mt-1">
                                "{lead.bio}"
                              </p>
                            </div>

                            <div>
                               <span className="text-[9px] text-slate-500 font-mono block uppercase">Tactical Merits</span>
                               <div className="flex flex-wrap gap-1 mt-1.5">
                                 {lead.achievements.map((item, id) => (
                                   <span key={id} className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[9px] font-mono whitespace-nowrap">
                                      🎖️ {item}
                                   </span>
                                 ))}
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Leader details footer */}
                      <div className="p-4 bg-[#080812] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                         <span>DISCORD: {lead.discord}</span>
                         <span className="text-[10px] text-slate-400">★ CO-LEAD</span>
                      </div>

                   </div>
                 ))}
              </div>

            </div>
          )}


          {/* TAB 6: CONTACT INFORMATION PAGE */}
          {activeTab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Informational Address Block on left */}
              <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/5">
                <div>
                   <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">
                      📞 KAMMATTIPADAM DIGITAL HUBS
                   </h3>

                   <div className="space-y-4">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex gap-3.5 items-center">
                         <div className="w-10 h-10 bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center text-lg rounded-xl">
                            💬
                         </div>
                         <div>
                            <span className="text-[9px] text-slate-500 font-mono uppercase block">DISCORD GATEWAY</span>
                            <a href="#discord-join" className="text-xs text-white font-semibold font-mono hover:underline">
                               discord.gg/kammattipadam
                            </a>
                         </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex gap-3.5 items-center">
                         <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-lg rounded-xl">
                            📱
                         </div>
                         <div>
                            <span className="text-[9px] text-slate-500 font-mono uppercase block">TELEGRAM DISPATCHES</span>
                            <span className="text-xs text-white font-semibold font-mono">
                               t.me/kammatti_rp
                            </span>
                         </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex gap-3.5 items-center">
                         <div className="w-10 h-10 bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-lg rounded-xl">
                            📸
                         </div>
                         <div>
                            <span className="text-[9px] text-slate-500 font-mono uppercase block font-medium">Instagram Chronicles</span>
                            <span className="text-xs text-white font-semibold font-mono">
                               @kammattipadam_family
                            </span>
                         </div>
                      </div>
                   </div>

                   <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
                      We operate heavily via our secure Discord server for in-game communications, planning daily weed logistics, and evaluating new applicants.
                   </p>
                </div>

                {/* Simulated map pin section */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden mt-6 flex gap-3 items-center">
                   <MapPin className="w-5 h-5 text-orange-400" />
                   <div className="text-xs font-mono">
                      <p className="text-white font-medium">Richman Glen Mansion, LS</p>
                      <p className="text-[11px] text-slate-500">Official HQ Marker</p>
                   </div>
                </div>

              </div>

              {/* Quick dispatch contact form */}
              <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display text-white uppercase mb-2">
                     Transmit encrypted message
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mb-6 uppercase">
                     For business alliances, turf compacts, or technical server inquiries
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Your Alias Name</label>
                           <input 
                             type="text" 
                             required
                             placeholder="e.g. Anton_V"
                             value={contactData.name}
                             onChange={(e) => setContactData({...contactData, name: e.target.value})}
                             className="w-full bg-[#080812] text-xs font-mono border border-white/10 text-white rounded-xl focus:outline-none p-3 focus:border-orange-500"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Contact Email/Discord Handle</label>
                           <input 
                             type="text" 
                             required
                             placeholder="e.g. anton#2231"
                             value={contactData.email}
                             onChange={(e) => setContactData({...contactData, email: e.target.value})}
                             className="w-full bg-[#080812] text-xs font-mono border border-white/10 text-white rounded-xl focus:outline-none p-3 focus:border-red-500"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Dispatches Context message</label>
                        <textarea 
                          rows={4}
                          required
                          placeholder="State the context of your proposed pact..."
                          value={contactData.msg}
                          onChange={(e) => setContactData({...contactData, msg: e.target.value})}
                          className="w-full bg-[#080812] text-xs font-mono border border-white/10 text-white rounded-xl focus:outline-none p-3 focus:border-orange-500"
                        />
                     </div>

                     <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white rounded-xl text-xs font-display font-extrabold tracking-widest cursor-pointer uppercase shadow-lg shadow-orange-500/20"
                        >
                           Transmit Pact
                        </button>
                     </div>
                  </form>
                </div>

                {/* Form success visual feedback overlay */}
                {contactSuccess && (
                  <div className="mt-4 p-3 bg-green-500/15 border border-green-500/20 text-green-400 rounded-xl text-xs font-mono text-center animate-pulse">
                     ✓ Encypted transmission complete! A family diplomat will send you a secure Discord invite shortly.
                  </div>
                )}

              </div>

            </div>
          )}


          {/* TAB 7: RECRUITMENT JOIN FAMILY APPLICATION PORTAL */}
          {activeTab === "join" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               
               {/* Left column: rules & benefit guidelines list */}
               <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Clan Benefits */}
                  <div className="glass-card p-6 rounded-3xl border border-white/5">
                     <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5 animate-pulse">
                        👑 IN-FAMILY SALARY & BENEFIT CODES
                     </h3>

                     <ul className="space-y-3 font-sans">
                       {recruitmentBenefits.map((item, idx) => (
                         <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                            <span className="text-base text-yellow-400 flex-shrink-0">✔</span>
                            <span className="leading-relaxed font-semibold">{item}</span>
                         </li>
                       ))}
                     </ul>
                  </div>

                  {/* Absolute Rules limits */}
                  <div className="glass-card p-6 rounded-3xl border border-white/5">
                     <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono mb-4">
                        ⚠️ SOVEREIGN REGULATIONS
                     </h3>

                     <ul className="space-y-3 font-sans">
                       {recruitmentRules.map((item, idx) => (
                         <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                            <span className="text-sm font-semibold text-red-500 font-mono">[{idx+1}]</span>
                            <span className="leading-relaxed font-medium">{item}</span>
                         </li>
                       ))}
                     </ul>
                  </div>

               </div>

               {/* Application submission form widget */}
               <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
                  <div className="mb-6">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[9px] font-mono tracking-widest uppercase">
                       Candidate Examination Shield
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 uppercase">
                       Recruit intake panel
                    </h3>
                    <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                       Complete the form below sincerely. Our recruitment officer Ashkar Ali evaluates submissions daily. Please note: we check character references in active Grand RP logs.
                    </p>
                  </div>

                  {showRecruitSuccess ? (
                    <div className="p-8 bg-green-550/10 border border-green-500/30 text-center rounded-2xl space-y-4">
                       <span className="text-5xl block animate-bounce">🎇</span>
                       <h4 className="text-lg font-bold text-white uppercase font-display">Evaluation Pending Approval!</h4>
                       <p className="text-xs text-slate-200 max-w-sm mx-auto leading-relaxed">
                          Your application for the **Kammattipadam family** has been secured in our safe storage systems. Please keep your discord tag **({applicationData.discordTag || "Provided Tag"})** open for invitations.
                       </p>
                       <button
                         onClick={() => {
                           setShowRecruitSuccess(false);
                           setApplicationData({
                             username: "",
                             realName: "",
                             characterLevel: "",
                             age: "",
                             realHouse: "",
                             playingOtherServer: "No",
                             otherServerName: "",
                             playedOtherFamilyServer4: "No",
                             otherFamilyName: "",
                             leaveReason: "",
                             inGamePhone: "",
                             instagramId: "",
                             discordTag: "",
                             ruleAgreed: false,
                           });
                         }}
                         className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer"
                       >
                          Submit New Entry
                       </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplySubmit} className="space-y-5 font-mono text-xs">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* IN GAME NAME */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">🎮 In-Game Name</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. Vikram_Kammatti"
                               value={applicationData.username}
                               onChange={(e) => setApplicationData({...applicationData, username: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* REAL NAME */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">👤 Your Real Name</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. Vikram"
                               value={applicationData.realName}
                               onChange={(e) => setApplicationData({...applicationData, realName: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* IN GAME LEVEL */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">⚡ In-Game Level</label>
                             <input 
                               type="number" 
                               required
                               placeholder="e.g. 15"
                               value={applicationData.characterLevel}
                               onChange={(e) => setApplicationData({...applicationData, characterLevel: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* REAL AGE */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">🎂 Real Age</label>
                             <input 
                               type="number" 
                               required
                               placeholder="e.g. 21"
                               value={applicationData.age}
                               onChange={(e) => setApplicationData({...applicationData, age: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* REAL HOUSE */}
                          <div className="sm:col-span-2">
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">🏠 Real House (City/Region Details)</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. Ernakulam, Kerala"
                               value={applicationData.realHouse}
                               onChange={(e) => setApplicationData({...applicationData, realHouse: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* IN GAME PHONE NUMBER */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">📞 In-Game Phone Number</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. 9845112"
                               value={applicationData.inGamePhone}
                               onChange={(e) => setApplicationData({...applicationData, inGamePhone: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* INSTAGRAM ID */}
                          <div>
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">📸 Instagram ID</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. @vikram_official"
                               value={applicationData.instagramId}
                               onChange={(e) => setApplicationData({...applicationData, instagramId: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* DISCORD LINK */}
                          <div className="sm:col-span-2">
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">💬 Discord Link / Tag ID</label>
                             <input 
                               type="text" 
                               required
                               placeholder="e.g. https://discord.gg/invite-link"
                               value={applicationData.discordTag}
                               onChange={(e) => setApplicationData({...applicationData, discordTag: e.target.value})}
                               className="w-full bg-[#080812] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-semibold"
                             />
                          </div>

                          {/* PLAYING IN OTHER SERVER TOGGLE */}
                          <div className="sm:col-span-2 border-t border-white/5 pt-4">
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-2">🌐 Are you playing on any other servers?</label>
                             <div className="flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => setApplicationData({...applicationData, playingOtherServer: "Yes"})}
                                  className={`flex-1 p-3 rounded-xl border text-center font-bold tracking-wider transition cursor-pointer ${
                                    applicationData.playingOtherServer === "Yes"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500"
                                      : "bg-[#080812] text-slate-400 border-white/10 hover:border-white/20"
                                  }`}
                                >
                                   YES
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApplicationData({...applicationData, playingOtherServer: "No", otherServerName: ""})}
                                  className={`flex-1 p-3 rounded-xl border text-center font-bold tracking-wider transition cursor-pointer ${
                                    applicationData.playingOtherServer === "No"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500"
                                      : "bg-[#080812] text-slate-400 border-white/10 hover:border-white/20"
                                  }`}
                                >
                                   NO
                                </button>
                             </div>
                          </div>

                          {/* DYNAMIC ROW: WHICH SERVER */}
                          {applicationData.playingOtherServer === "Yes" && (
                             <div className="sm:col-span-2 bg-amber-500/[0.02] border border-amber-500/10 p-4 rounded-2xl">
                                <label className="text-[10px] text-amber-400 font-bold uppercase block mb-1">🗺️ Which Server(s)?</label>
                                <input 
                                  type="text" 
                                  required={applicationData.playingOtherServer === "Yes"}
                                  placeholder="e.g. Grand RP RS Premium, Enigma Server, etc."
                                  value={applicationData.otherServerName}
                                  onChange={(e) => setApplicationData({...applicationData, otherServerName: e.target.value})}
                                  className="w-full bg-[#080812] border border-amber-500/30 text-white rounded-xl p-3 focus:outline-none focus:border-amber-400 font-semibold"
                                />
                             </div>
                          )}

                          {/* PLAYED IN ANY OTHER FAMILY ON SERVER 4 TOGGLE */}
                          <div className="sm:col-span-2 border-t border-white/5 pt-4">
                             <label className="text-[10px] text-slate-400 font-bold uppercase block mb-2">🛡️ Have you played in any other family on Server 4?</label>
                             <div className="flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => setApplicationData({...applicationData, playedOtherFamilyServer4: "Yes"})}
                                  className={`flex-1 p-3 rounded-xl border text-center font-bold tracking-wider transition cursor-pointer ${
                                    applicationData.playedOtherFamilyServer4 === "Yes"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500"
                                      : "bg-[#080812] text-slate-400 border-white/10 hover:border-white/20"
                                  }`}
                                >
                                   YES
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApplicationData({...applicationData, playedOtherFamilyServer4: "No", otherFamilyName: "", leaveReason: ""})}
                                  className={`flex-1 p-3 rounded-xl border text-center font-bold tracking-wider transition cursor-pointer ${
                                    applicationData.playedOtherFamilyServer4 === "No"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500"
                                      : "bg-[#080812] text-slate-400 border-white/10 hover:border-white/20"
                                  }`}
                                >
                                   NO
                                </button>
                             </div>
                          </div>

                          {/* DYNAMIC CARD: FAMILY NAME AND REASON FOR LEAVING */}
                          {applicationData.playedOtherFamilyServer4 === "Yes" && (
                             <div className="sm:col-span-2 bg-amber-500/[0.02] border border-amber-500/10 p-4 rounded-2xl space-y-4">
                                <div>
                                   <label className="text-[10px] text-amber-400 font-bold uppercase block mb-1">⚔️ Which family?</label>
                                   <input 
                                     type="text" 
                                     required={applicationData.playedOtherFamilyServer4 === "Yes"}
                                     placeholder="e.g. Phoenix Elite Corporation, etc."
                                     value={applicationData.otherFamilyName}
                                     onChange={(e) => setApplicationData({...applicationData, otherFamilyName: e.target.value})}
                                     className="w-full bg-[#080812] border border-amber-500/30 text-white rounded-xl p-3 focus:outline-none focus:border-amber-400 font-semibold"
                                   />
                                </div>
                                <div>
                                   <label className="text-[10px] text-amber-400 font-bold uppercase block mb-1">🚪 Reason for leaving?</label>
                                   <textarea 
                                     rows={2}
                                     required={applicationData.playedOtherFamilyServer4 === "Yes"}
                                     placeholder="Why did you leave?"
                                     value={applicationData.leaveReason}
                                     onChange={(e) => setApplicationData({...applicationData, leaveReason: e.target.value})}
                                     className="w-full bg-[#080812] border border-amber-500/30 text-white rounded-xl p-3 focus:outline-none focus:border-amber-400 font-semibold"
                                   />
                                </div>
                             </div>
                          )}
                       </div>

                       {/* Terms check */}
                       <div className="flex items-start gap-2.5 pt-2 select-none">
                          <input 
                            type="checkbox" 
                            id="rule-accept"
                            checked={applicationData.ruleAgreed}
                            onChange={(e) => setApplicationData({...applicationData, ruleAgreed: e.target.checked})}
                            className="mt-1 w-4 h-4 text-orange-500 bg-[#080812] border-white/10 border rounded focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor="rule-accept" className="text-[11.5px] text-slate-400 font-sans cursor-pointer leading-relaxed">
                             I certify that I have read the family rules above carefully and agree that disloyalty will result in absolute exile of character from any cooperative assets.
                          </label>
                       </div>

                       <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={!applicationData.ruleAgreed}
                            className={`px-6 py-4.5 text-xs font-display font-black tracking-widest uppercase rounded-2xl transition cursor-pointer flex items-center gap-2 ${
                              applicationData.ruleAgreed 
                                ? "bg-gradient-to-r from-red-650 via-orange-550 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg"
                                : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
                            }`}
                          >
                             Transmit Intake Examination
                          </button>
                       </div>
                    </form>
                  )}

               </div>

            </div>
          )}

        </main>

          {/* TAB 8: ENCRYPTED ADMINISTRATIVE CONTROL PORTAL */}
          {activeTab === "admin" && (
            <AdminPortal
              stats={stats}
              setStats={setStats}
              roster={roster}
              setRoster={setRoster}
              vehicles={vehicles}
              setVehicles={setVehicles}
              leaders={leaders}
              setLeaders={setLeaders}
              isNightMode={isNightMode}
              applications={applications}
              setApplications={setApplications}
            />
          )}

        {/* BOTTOM FLOATING CHAT: AI SENIOR ARCHITECT/COUNSELOR PORTAL PILL */}
        <div className="mt-12 border-t border-white/5 pt-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
             
             {/* General explanatory text context */}
             <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                         SECURE PORTAL ADVISORY
                      </span>
                   </div>
                   <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">
                      Counselor intelligence
                   </h3>
                   <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      This interactive panel utilizes Google's **Gemini 3.5 AI Model** proxy client directly to answer questions for beginners. No coding experience needed! Ask how safe-house assets get imported from GTA V, how to tweak physics coefficients in Blender, or explain standard React modules used in this portal.
                   </p>
                </div>

                {/* Core helpful shortcut tags */}
                <div className="mt-6">
                   <span className="text-[9.5px] text-slate-500 font-mono block uppercase mb-2">QUICK CONSULTATION SHORTCUTS</span>
                   <div className="flex flex-wrap gap-1.5">
                     {[
                       "How to extract safe-house models from GTA 5?",
                       "Best Blender settings for Draco .glb files?",
                       "How does standard React 19 handle ThreeJS viewport resizes?",
                       "Explain how to configure auto-updating roster logs."
                     ].map((qst, idx) => (
                       <button
                         key={idx}
                         onClick={() => selectQuickHint(qst)}
                         className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/5 text-[10px] text-left font-mono truncate max-w-full cursor-pointer"
                       >
                          {qst}
                       </button>
                     ))}
                   </div>
                </div>
             </div>

             {/* Live Chat Frame widget */}
             <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between h-[360px]">
                
                {/* Header banner */}
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center text-xs font-mono font-bold uppercase select-none">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>KAMMATTIPADAM FAMILY COUNSELOR CHAT v1.02</span>
                   </div>
                   <span className="text-emerald-400 text-[10px]">● INTERMEDIARY SECURE ENGINE</span>
                </div>

                {/* Message logs view scroll field */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/30 scrollbar-thin">
                   {chatMessages.map((msg, idx) => (
                     <div 
                       key={idx} 
                       className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                       <div className={`p-4 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                         msg.role === 'user' 
                           ? 'bg-gradient-to-br from-red-650 to-orange-600 text-white font-mono font-semibold' 
                           : 'bg-[#0f111a] border border-white/5 text-slate-300 font-sans'
                       }`}>
                          {msg.role === 'model' && (
                            <div className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest mb-1.5 border-b border-white/5 pb-1 flex items-center gap-1">
                               <span className="p-0.5 bg-orange-500 text-black rounded text-[8px]">AI</span>
                               <span>Senior Architect Counselor Specialist</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                       </div>
                     </div>
                   ))}
                   
                   {chatLoading && (
                     <div className="flex justify-start">
                       <div className="bg-[#0f111a] border border-white/5 p-4 rounded-xl flex items-center gap-2.5">
                          <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                          <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Thinking through blueprints logs...</span>
                       </div>
                     </div>
                   )}

                   <div ref={chatBottomRef} />
                </div>

                {/* Chat input prompt field */}
                <form onSubmit={sendChatMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                   <input
                     id="chat-counselor-input" 
                     type="text"
                     value={chatInput}
                     className="flex-1 bg-black/80 text-xs font-mono border border-white/5 text-white placeholder-slate-500 focus:outline-none p-3.5 rounded-xl text-xs focus:border-red-500"
                     placeholder="Inquire with family counselor about code, RP, supercars or ThreeJS models..."
                     onChange={(e) => setChatInput(e.target.value)}
                   />
                   <button
                     type="submit"
                     disabled={!chatInput.trim() || chatLoading}
                     className="p-3.5 bg-gradient-to-br from-red-650 to-orange-500 hover:from-red-500 hover:to-orange-450 text-white rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                </form>

             </div>

           </div>
        </div>

        {/* Footer info legend displaying real UTC clock */}
        <footer className="mt-12 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono tracking-wider gap-4">
          <div className="flex flex-wrap gap-4 uppercase">
            <span>Kammattipadam Gaming Organization</span>
            <span>Vercel Deploy Certified</span>
            <span>No Coding Required Path</span>
          </div>
          <div className="flex items-center gap-1.5 uppercase font-semibold text-slate-400">
             <Clock className="w-3.5 h-3.5 text-orange-550" />
             <span>SYSTEM RUNNING TIME: 2026.06.18_05:07_UTC</span>
          </div>
        </footer>

        {/* Unified Custom Modals Overlay System */}
        {isPlayerModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[999] overflow-y-auto">
            <div className="glass-card max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative my-8">
              <div className="flex justify-between items-center bg-white/5 p-5 border-b border-white/5">
                <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase">
                  {editingPlayer ? "⚡ UPDATE CLAN OPERATIVE" : "🔥 RECRUIT IN-GAME SOLDIER"}
                </h4>
                <button onClick={() => setIsPlayerModalOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSavePlayer} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">In-game Username</label>
                  <input type="text" required value={playerForm.name} onChange={(e) => setPlayerForm(v => ({...v, name: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Vikram Kovalan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Rank Title</label>
                    <select value={playerForm.rank} onChange={(e) => setPlayerForm(v => ({...v, rank: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-400 outline-none text-slate-200">
                      <option value="Boss" className="bg-[#0f111a]">Boss / Founder</option>
                      <option value="Co-Lead" className="bg-[#0f111a]">Co-Lead</option>
                      <option value="Captain" className="bg-[#0f111a]">Captain / Enforcer</option>
                      <option value="Soldier" className="bg-[#0f111a]">Soldier</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Status</label>
                    <select value={playerForm.status} onChange={(e) => setPlayerForm(v => ({...v, status: e.target.value as any}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-400 outline-none text-slate-200">
                      <option value="Online" className="bg-[#0f111a]">Online</option>
                      <option value="Offline" className="bg-[#0f111a]">Offline</option>
                      <option value="In Heist" className="bg-[#0f111a]">In Heist</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Assigned Syndicate Role</label>
                  <input type="text" required value={playerForm.role} onChange={(e) => setPlayerForm(v => ({...v, role: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Lead Safe Cracker / Ground Shooter" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Avatar Emoji</label>
                    <input type="text" required value={playerForm.avatar} onChange={(e) => setPlayerForm(v => ({...v, avatar: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none text-center" placeholder="e.g. 🦊" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">XP Points (Max 10000)</label>
                    <input type="number" required value={playerForm.xp} onChange={(e) => setPlayerForm(v => ({...v, xp: parseInt(e.target.value) || 0}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Discord Tag</label>
                  <input type="text" value={playerForm.discord} onChange={(e) => setPlayerForm(v => ({...v, discord: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. developer#0007" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1 font-mono">Tax Achievements (Comma-separated)</label>
                  <input type="text" value={playerForm.achievements} onChange={(e) => setPlayerForm(v => ({...v, achievements: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Weed Runner, Heist General, Elite Fighter" />
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="button" onClick={() => setIsPlayerModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white transition font-semibold cursor-pointer">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-550 hover:brightness-110 rounded-xl text-xs font-mono text-white transition font-semibold flex items-center justify-center gap-1.5 cursor-pointer"><Save className="w-3.5 h-3.5" /> SAVE OPERATIVE</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isVehicleModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[999] overflow-y-auto">
            <div className="glass-card max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative my-8">
              <div className="flex justify-between items-center bg-white/5 p-5 border-b border-white/5">
                <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase">
                  {editingVehicle ? "📦 EDIT SHOWROOM FLEET VEHICLE" : "🚘 REGISTER NEW ARMADA SUPERCAR"}
                </h4>
                <button onClick={() => setIsVehicleModalOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSaveVehicle} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Vehicle Name</label>
                    <input type="text" required value={vehicleForm.name} onChange={(e) => setVehicleFormState(v => ({...v, name: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Pegassi Osiris" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Category</label>
                    <select value={vehicleForm.category} onChange={(e) => setVehicleFormState(v => ({...v, category: e.target.value as any}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-400 outline-none text-slate-200">
                      <option value="Hypercar" className="bg-[#0f111a]">Hypercar</option>
                      <option value="Supercar" className="bg-[#0f111a]">Supercar</option>
                      <option value="SUV" className="bg-[#0f111a]">SUV</option>
                      <option value="Sports Bike" className="bg-[#0f111a]">Sports Bike</option>
                      <option value="Helicopter" className="bg-[#0f111a]">Helicopter</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Top Speed (KM/H)</label>
                    <input type="number" required value={vehicleForm.topSpeed} onChange={(e) => setVehicleFormState(v => ({...v, topSpeed: parseInt(e.target.value) || 0}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none text-center" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Acc (0-100s)</label>
                    <input type="number" step="0.1" required value={vehicleForm.acceleration} onChange={(e) => setVehicleFormState(v => ({...v, acceleration: parseFloat(e.target.value) || 0}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none text-center" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Handling val</label>
                    <input type="number" step="0.1" required value={vehicleForm.handling} onChange={(e) => setVehicleFormState(v => ({...v, handling: parseFloat(e.target.value) || 0}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none text-center" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Owner Name</label>
                    <input type="text" required value={vehicleForm.owner} onChange={(e) => setVehicleFormState(v => ({...v, owner: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">In-game Price tag</label>
                    <input type="text" required value={vehicleForm.priceInGc} onChange={(e) => setVehicleFormState(v => ({...v, priceInGc: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. 2,500 GC" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Color Hex</label>
                    <input type="text" required value={vehicleForm.colorHex} onChange={(e) => setVehicleFormState(v => ({...v, colorHex: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Color Title</label>
                    <input type="text" required value={vehicleForm.colorName} onChange={(e) => setVehicleFormState(v => ({...v, colorName: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Rosso Corsa" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Underglow style</label>
                    <input type="text" required value={vehicleForm.underglowColor} onChange={(e) => setVehicleFormState(v => ({...v, underglowColor: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none border-white/10" placeholder="rgba(255,0,0,0.8)" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Detailed Description</label>
                  <textarea required rows={2} value={vehicleForm.description} onChange={(e) => setVehicleFormState(v => ({...v, description: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none border-white/10" />
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="button" onClick={() => setIsVehicleModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white transition font-semibold cursor-pointer">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-red-650 to-orange-550 hover:brightness-110 rounded-xl text-xs font-mono text-white transition font-semibold flex items-center justify-center gap-1.5 cursor-pointer"><Save className="w-3.5 h-3.5" /> SAVE VEHICLE</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLeaderModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[999] overflow-y-auto w-full h-full">
            <div className="glass-card max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative my-8">
              <div className="flex justify-between items-center bg-white/5 p-5 border-b border-white/5">
                <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase">
                  {editingLeader ? "👑 CHOOSE SYNDICATE POSITION" : "⭐ APPOINT SYNDICATE FOUNDER"}
                </h4>
                <button onClick={() => setIsLeaderModalOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSaveLeader} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Leader name</label>
                    <input type="text" required value={leaderForm.name} onChange={(e) => setLeaderForm(v => ({...v, name: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Vikram Kovalan" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Nickname tag</label>
                    <input type="text" required value={leaderForm.nickname} onChange={(e) => setLeaderForm(v => ({...v, nickname: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Commander" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Rank Title</label>
                    <input type="text" required value={leaderForm.rank} onChange={(e) => setLeaderForm(v => ({...v, rank: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Lead Founder / Board General" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Syndicate Specialty</label>
                    <input type="text" required value={leaderForm.specialty} onChange={(e) => setLeaderForm(v => ({...v, specialty: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. Turf Conquests & Ops" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Leader portrait URL reference</label>
                  <input type="text" required value={leaderForm.avatar} onChange={(e) => setLeaderForm(v => ({...v, avatar: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="HTTPS Image address" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Biography</label>
                  <textarea required rows={2} value={leaderForm.bio} onChange={(e) => setLeaderForm(v => ({...v, bio: e.target.value}))} className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="Syndicate history..." />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Discord tag</label>
                  <input type="text" value={leaderForm.discord} onChange={(e) => setLeaderForm(v => ({...v, discord: e.target.value}))} className="w-full bg-[#040407] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" placeholder="e.g. name#0007" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1 font-mono">Special achievements (Comma Separated)</label>
                  <input type="text" value={leaderForm.achievements} onChange={(e) => setLeaderForm(v => ({...v, achievements: e.target.value}))} className="w-full bg-[#040407] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none" />
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="button" onClick={() => setIsLeaderModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white transition font-semibold cursor-pointer">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-red-650 to-orange-550 hover:brightness-110 rounded-xl text-xs font-mono text-white transition font-semibold flex items-center justify-center gap-1.5 cursor-pointer"><Save className="w-3.5 h-3.5" /> CONFIRM POSITION</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
