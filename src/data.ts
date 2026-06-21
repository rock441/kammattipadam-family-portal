import { Player, Vehicle, Leader, MansionSpot, Achievement } from "./types";

export const familyStats = {
  totalMembers: 142,
  activeNow: 18,
  totalVehicles: 45,
  familyRank: "#4 Faction Chart",
  familyWealth: "$184,500,000",
  influencePercent: 78,
  dailyBountiesCompleted: 124,
  mansionLocation: "Richman Glen Mansion Close #144",
};

export const familyRoster: Player[] = [
  {
    id: "p1",
    name: "Devan Kammattipadam",
    rank: "FOUNDER",
    status: "Online",
    role: "Family Organizer & Faction Diplomat",
    joinDate: "2024-03-12",
    xp: 9800,
    avatar: "👑",
    achievements: ["Unstoppable Heist Boss", "Grand RP Pioneer", "Million-Dollar Safehouse Collector"],
    discord: "devan_kp#4050"
  },
  {
    id: "p2",
    name: "Vikram Kovalan",
    rank: "UNDERBOSS",
    status: "Online",
    role: "Heist Operations Command & Tactical Lead",
    joinDate: "2024-04-18",
    xp: 8750,
    avatar: "🦅",
    achievements: ["Ghost Rider", "Deadshot Pistol Expert", "Bank Vault Hacker Specialist"],
    discord: "vikram_k#1442"
  },
  {
    id: "p3",
    name: "Shaji Pothan",
    rank: "FAMILY DON",
    status: "In Heist",
    role: "Business Empire Strategist & Weed Farm Manager",
    joinDate: "2024-05-20",
    xp: 7900,
    avatar: "🎲",
    achievements: ["Weed Tycoon", "Underground Negotiator First Class", "Tactical Evader Level 50"],
    discord: "shaji_p#9980"
  },
  {
    id: "p4",
    name: "Kuttan Nair",
    rank: "KPM DEPUTY",
    status: "Online",
    role: "Combat Instructor & Turfs Defense Coordinator",
    joinDate: "2024-07-01",
    xp: 6400,
    avatar: "🗡️",
    achievements: ["Turf War MVP", "Bulletproof Escort Commander", "Full-Metal Jacketed Specialist"],
    discord: "kuttan_nair#2231"
  },
  {
    id: "p5",
    name: "Sunil Karadi",
    rank: "SUPERIORS",
    status: "Offline",
    role: "Chief Smuggler & Aircraft Operator",
    joinDate: "2024-09-11",
    xp: 4500,
    avatar: "🕶️",
    achievements: ["Sky-High Delivery", "Ace Pilot", "Cocaine Runner Veteran"],
    discord: "unnikaradi#8812"
  },
  {
    id: "p6",
    name: "Ashkar Ali",
    rank: "TRAINING LD",
    status: "Online",
    role: "New Blood Advisor & Training Scout",
    joinDate: "2024-10-05",
    xp: 3820,
    avatar: "🤝",
    achievements: ["Loyalty Mentor", "Event Coordinator Master", "Silent Whisperer"],
    discord: "ashkar_ali#3399"
  },
  {
    id: "p7",
    name: "Vinod Antony",
    rank: "FW MEMBERS",
    status: "In Heist",
    role: "Precision Getaway Driver",
    joinDate: "2024-11-12",
    xp: 3100,
    avatar: "🏁",
    achievements: ["Zero-Friction Racer", "Drift Champion", "Cops Avoidance Expert"],
    discord: "vinod_antony#7721"
  }
];

export const familyLeaders: Leader[] = [
  {
    id: "lead-1",
    name: "Devan Kammattipadam",
    nickname: "The Patriarch",
    rank: "FOUNDER",
    discord: "devan_kp#4050",
    steamName: "Devan_Kammattipadam_RP",
    specialty: "High-Stake Politics, Legal Maneuvers & Syndicate Infiltration",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
    bio: "Established Kammattipadam RP family in early 2024 with a vision of creating a tight-knit family that controls the industrial landscape of Los Santos. Famously resolved the South LS turf conflict through elegant treaty agreements.",
    achievements: ["Grand RP Governor's Shield", "Sovereign Leader Trophy", "Mastermind of the Century"]
  },
  {
    id: "lead-2",
    name: "Vikram Kovalan",
    nickname: "The Commander",
    rank: "GOD FATHER",
    discord: "vikram_k#1442",
    steamName: "Vikram_Kovalan_RP",
    specialty: "Tactical Shootouts, Heists Execution & Car Chase Navigation",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250",
    bio: "Handles all daily illegal operations. He plans bank vaults hacks, manages heavy weapon shipments, and organizes internal turf squads. None cross Kovalan without feeling the steel.",
    achievements: ["Combat Medal of Valor", "Heist King Crown", "Fastest Vault Opener"]
  },
  {
    id: "lead-3",
    name: "Shaji Pothan",
    nickname: "The Banker",
    rank: "FAMILY DON",
    discord: "shaji_p#9980",
    steamName: "Shaji_Pothan_Empire",
    specialty: "Money Laundering, Real Estate Acquisitions & Weed Farm Scale",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250",
    bio: "Brings the business brains. Under Shaji's guidance, family revenues grew from a humble garage setup to our multi-million dollar real estate, weed dispensary, and illegal chip factories portfolio.",
    achievements: ["Financial Wizard Cup", "Dispensary Emperor", "Mansion Investor Medal"]
  }
];

export const familyVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Chiron Pur Sport Grand",
    category: "Hypercar",
    topSpeed: 440,
    acceleration: 2.2,
    handling: 9.8,
    owner: "Devan Kammattipadam",
    priceInGc: "3,500 GC",
    description: "The crown jewel of our garage. Painted in the signature gold and obsidian black gradient representing the core Kammattipadam brotherhood. Equipped with premium custom turbos and neon gold underglow.",
    colorHex: "#D4AF37",
    colorName: "Gold Platinum",
    underglowColor: "rgba(235,178,50,0.8)"
  },
  {
    id: "v2",
    name: "Aventador SVJ Neon",
    category: "Supercar",
    topSpeed: 360,
    acceleration: 2.7,
    handling: 9.5,
    owner: "Vikram Kovalan",
    priceInGc: "2,400 GC",
    description: "Equipped with our signature red vinyl finish and deep pitch-black aerodynamic wings. A vicious predator that dominates both asphalt racetracks and getaway alleys in downtown Los Santos.",
    colorHex: "#FF0000",
    colorName: "Vicious Red",
    underglowColor: "rgba(255,0,0,0.8)"
  },
  {
    id: "v3",
    name: "Rolls-Royce Spectre Ghost",
    category: "SUV",
    topSpeed: 310,
    acceleration: 3.8,
    handling: 8.8,
    owner: "Shaji Pothan",
    priceInGc: "1,950 GC",
    description: "Absolute silent luxury, tailor-made for dispatching VIPs, co-leads, and storing black-market negotiation files. Comes with bulletproof plating and customized private passenger cabins.",
    colorHex: "#1a1a1a",
    colorName: "Void Obsidian Black",
    underglowColor: "rgba(168,85,247,0.8)"
  },
  {
    id: "v4",
    name: "Ducati Panigale V4 S",
    category: "Sports Bike",
    topSpeed: 330,
    acceleration: 2.5,
    handling: 9.9,
    owner: "Kuttan Nair",
    priceInGc: "850 GC",
    description: "Extremely agile for weaving through tight highway grids during heavy chasing. Fitted with orange headlights and a lightweight carbon body.",
    colorHex: "#ff5722",
    colorName: "Kammatti Flame Orange",
    underglowColor: "rgba(255,87,34,0.8)"
  }
];

export const mansionSpots: MansionSpot[] = [
  {
    id: "spot-1",
    name: "spot-garage",
    title: "1. The Grand Garage Bay",
    description: "Houses our $45 Million vehicular armada. Secure steel gates block outsiders, with built-in nitro refuel tanks and bullet-resistant shield calibrators.",
    hotspotX: 20,
    hotspotY: 65,
    color: "#E2BA39",
    detailPoints: ["Subterranean fireproofing", "Dual nitrous oxide ports", "25 Luxury parking slips"],
    cameraCoords: { x: -8, y: 3, z: 8 }
  },
  {
    id: "spot-2",
    name: "spot-conf",
    title: "2. Faction Briefing Chamber",
    description: "Where all grand strategies materialize. Fitted with a physical maps projector, heavy cryptographic secure networks, and emergency underground tunnel escape paths.",
    hotspotX: 48,
    hotspotY: 35,
    color: "#ff5722",
    detailPoints: ["256-bit encrypted comms", "Rival tracking status display", "Under-table weapons cache"],
    cameraCoords: { x: 0, y: 5, z: 12 }
  },
  {
    id: "spot-3",
    name: "spot-trophy",
    title: "3. Trophy & Armory Deck",
    description: "Draped in gold plating. It stores our heist bounties, custom assault carbines, and prestigious plaques awarded from Grand RP official events.",
    hotspotX: 75,
    hotspotY: 55,
    color: "#46b251",
    detailPoints: ["Class-IV certified vault doors", "Daily heavy-ammo dispenser", "Golden sovereign plaques"],
    cameraCoords: { x: 8, y: 3, z: 8 }
  }
];

export const familyAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Turf Reign Supremacy",
    description: "Successfully conquered and defended 8 core businesses across downtown for 30 consecutive calendar days.",
    tier: "Diamond",
    dateUnlocked: "2024-05",
    icon: "🔥"
  },
  {
    id: "ach-2",
    title: "The Ultimate Federal Vault",
    description: "Completed the Fleeca, Paleto, and Federal Reserve heists in one single night with zero casualty casualties.",
    tier: "Platinum",
    dateUnlocked: "2024-08",
    icon: "💎"
  },
  {
    id: "ach-3",
    title: "100 Million Asset Milestone",
    description: "Accumulated standard shared family safe-wealth of over $100,000,000, placing us in elite Grand RP status.",
    tier: "Gold",
    dateUnlocked: "2024-12",
    icon: "🏆"
  }
];

export const recruitmentRules = [
  "Must possess mature demeanor (minimum age limit 17+ recommended).",
  "Must speak and coordinate via Discord Voice channels fluently during raids.",
  "Must have basic knowledge of standard Grand RP server rules (NLR, DM, VDM, failRP/powergaming bounds).",
  "Must demonstrate loyalty. Intimacy with rival family members will result in immediate permanent expulsion.",
  "Must possess at least Level 10 ingame character state to apply for co-lead status."
];

export const recruitmentBenefits = [
  "Full salary protection with weekly activity bonuses (ranging from $150k to $1.2M depending on contribution).",
  "Immediate access to Tier 3 premium family weaponry and custom armor crates.",
  "Free driving privileges for our elite vehicle showroom, including the gold Bugatti Chiron.",
  "Comprehensive protection. The entire family is backed up to assist during state police encounters or turret territory disputes.",
  "Guaranteed participation in premium high-stake heists, air cargo drops, and weekly custom family tracks."
];

export const loadingHints = [
  "Rule #1: Always obey orders from the Grand Boss Devan or active captains.",
  "Rule #4: Keep family supercar headlights clean. Gold vinyl scratches easily.",
  "HINT: Draco Compression scales 3D mansion models efficiently for mobile browser loadtimes.",
  "Did you know? Kammattipadam represents the pinnacle of Grand RP coordination since early 2024.",
  "Raid Tip: Soundtracks generate real-time synthesized sine waves to build tension during getaway countdowns."
];
