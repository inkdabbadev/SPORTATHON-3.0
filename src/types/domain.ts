export const EVENT_NAME = "SPORTATHON 3.0";

export const PLAYER_CATEGORIES = [
  "Batsman",
  "Fast Bowler",
  "Spinner",
  "Wicket Keeper",
  "All Rounder"
] as const;

export const BATSMAN_STYLES = ["Right-hand bat", "Left-hand bat"] as const;

export const PACE_BOWLER_STYLES = ["Right-arm pace", "Left-arm pace"] as const;

export const SPIN_BOWLER_STYLES = ["Right-arm spin", "Left-arm spin"] as const;

export const BOWLER_STYLES = [
  ...PACE_BOWLER_STYLES,
  ...SPIN_BOWLER_STYLES
] as const;

export const PLAYER_STATUSES = ["unsold", "sold"] as const;
export const PLAYER_GENDERS = ["Male", "Female", "Other"] as const;
export const REGISTRATION_TYPES = ["Member", "Guest"] as const;

export type PlayerCategory = (typeof PLAYER_CATEGORIES)[number];
export type BatsmanStyle = (typeof BATSMAN_STYLES)[number];
export type BowlerStyle = (typeof BOWLER_STYLES)[number];
export type PlayerStatus = (typeof PLAYER_STATUSES)[number];
export type PlayerGender = (typeof PLAYER_GENDERS)[number];
export type RegistrationType = (typeof REGISTRATION_TYPES)[number];

export type PlayerView = {
  id: string;
  name: string;
  age?: number;
  gender?: PlayerGender;
  registeringAs?: RegistrationType;
  reference?: string;
  category: PlayerCategory;
  batsmanStyle?: BatsmanStyle;
  bowlerStyle?: BowlerStyle;
  contact: string;
  photoDataUrl?: string;
  basePrice: number;
  status: PlayerStatus;
  soldTo?: string;
  soldPrice?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamView = {
  id: string;
  name: string;
  owner: string;
  city?: string;
  contact?: string;
  email?: string;
  color: string;
  purse: number;
  photoDataUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EventSettingsView = {
  id: string;
  name: string;
  tagline: string;
  logoPath: string;
  defaultPurse: number;
};
