export interface Player {
  id: string;
  name: string;
  rank: string;
  status: "Online" | "Offline" | "In Heist";
  role: string;
  joinDate: string;
  xp: number;
  avatar: string;
  achievements: string[];
  discord?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: "Supercar" | "Hypercar" | "SUV" | "Sports Bike" | "Helicopter";
  topSpeed: number; // in km/h
  acceleration: number; // 0-100 in sec
  handling: number; // 1-10 string or value
  owner: string;
  priceInGc: string; // Grand Coins or In-game cash
  description: string;
  colorHex: string;
  colorName: string;
  underglowColor: string;
}

export interface Leader {
  id: string;
  name: string;
  nickname: string;
  rank: "FOUNDER" | "GOD FATHER" | "FAMILY DON" | "KPM DEPUTY" | "UNDERBOSS" | "TRAINING LD" | "SUPERIORS" | "FW MEMBERS" | "KPM MEMBERS" | "QUEENS" | "TRAINEE";
  discord: string;
  steamName?: string;
  specialty: string;
  avatar: string;
  bio: string;
  achievements: string[];
}

export interface MansionSpot {
  id: string;
  name: string;
  title: string;
  description: string;
  hotspotX: number; // percentage in 2D space
  hotspotY: number;
  color: string;
  detailPoints: string[];
  cameraCoords: { x: number; y: number; z: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: "Gold" | "Platinum" | "Diamond";
  dateUnlocked: string;
  icon: string;
}

export interface FamilyApplication {
  id: string;
  username: string;
  realName: string;
  characterLevel: string;
  age: string;
  realHouse: string;
  playingOtherServer: string;
  otherServerName?: string;
  playedOtherFamilyServer4: string;
  otherFamilyName?: string;
  leaveReason?: string;
  inGamePhone: string;
  instagramId: string;
  discordTag: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}
