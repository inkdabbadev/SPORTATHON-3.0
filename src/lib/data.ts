import { connectDB } from "@/lib/db";
import { photoToDataUrl } from "@/lib/photo";
import { EventSettings } from "@/models/EventSettings";
import { Player } from "@/models/Player";
import { Team } from "@/models/Team";
import {
  EVENT_NAME,
  type BatsmanStyle,
  type BowlerStyle,
  type EventSettingsView,
  type PlayerCategory,
  type PlayerGender,
  type PlayerStatus,
  type PlayerView,
  type RegistrationType,
  type TeamView
} from "@/types/domain";

type DocLike = {
  _id: { toString(): string };
  createdAt?: Date;
  updatedAt?: Date;
};

type PlayerDoc = DocLike & {
  name: string;
  age?: number;
  gender?: PlayerGender;
  registeringAs?: RegistrationType;
  reference?: string;
  category: PlayerCategory;
  batsmanStyle?: BatsmanStyle | "";
  bowlerStyle?: BowlerStyle | "";
  contact: string;
  photo?: { data?: Buffer; contentType?: string } | null;
  status: PlayerStatus;
  soldTo?: { toString(): string } | null;
  soldPrice?: number | null;
};

type TeamDoc = DocLike & {
  name: string;
  owner: string;
  city?: string;
  contact?: string;
  email?: string;
  color?: string;
  purse?: number;
  photo?: { data?: Buffer; contentType?: string } | null;
  active?: boolean;
};

type EventDoc = DocLike & {
  name?: string;
  tagline?: string;
  logoPath?: string;
  logo?: { data?: Buffer; contentType?: string } | null;
  defaultPurse?: number;
};

function dateToString(value?: Date) {
  return value ? value.toISOString() : undefined;
}

function serializePlayer(doc: PlayerDoc): PlayerView {
  return {
    id: doc._id.toString(),
    name: doc.name,
    age: doc.age,
    gender: doc.gender,
    registeringAs: doc.registeringAs,
    reference: doc.reference || undefined,
    category: doc.category,
    batsmanStyle: doc.batsmanStyle || undefined,
    bowlerStyle: doc.bowlerStyle || undefined,
    contact: doc.contact,
    photoDataUrl: photoToDataUrl(doc.photo),
    status: doc.status,
    soldTo: doc.soldTo ? doc.soldTo.toString() : undefined,
    soldPrice: doc.soldPrice ?? undefined,
    createdAt: dateToString(doc.createdAt),
    updatedAt: dateToString(doc.updatedAt)
  };
}

function serializeTeam(doc: TeamDoc): TeamView {
  return {
    id: doc._id.toString(),
    name: doc.name,
    owner: doc.owner,
    city: doc.city || undefined,
    contact: doc.contact || undefined,
    email: doc.email || undefined,
    color: doc.color || "#19388A",
    purse: doc.purse ?? 10000,
    photoDataUrl: photoToDataUrl(doc.photo),
    active: doc.active !== false,
    createdAt: dateToString(doc.createdAt),
    updatedAt: dateToString(doc.updatedAt)
  };
}

function serializeEvent(doc: EventDoc): EventSettingsView {
  return {
    id: doc._id.toString(),
    name: doc.name || EVENT_NAME,
    tagline: doc.tagline || "Player registration",
    logoPath: photoToDataUrl(doc.logo) || doc.logoPath || "/logo.png",
    defaultPurse: doc.defaultPurse ?? 10000
  };
}

export async function getEventSettings() {
  await connectDB();
  const doc = await EventSettings.findOneAndUpdate(
    { singletonKey: "active-event" },
    {
      $setOnInsert: {
        name: EVENT_NAME,
        tagline: "Player registration",
        logoPath: "/logo.png",
        defaultPurse: 10000,
        singletonKey: "active-event"
      }
    },
    { new: true, upsert: true }
  ).lean();

  return serializeEvent(doc as unknown as EventDoc);
}

export async function getPlayers() {
  await connectDB();
  const docs = await Player.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((doc) => serializePlayer(doc as unknown as PlayerDoc));
}

export async function getPlayer(id: string) {
  await connectDB();
  const doc = await Player.findById(id).lean();
  return doc ? serializePlayer(doc as unknown as PlayerDoc) : null;
}

export async function getTeams() {
  await connectDB();
  const docs = await Team.find({}).sort({ active: -1, name: 1 }).lean();
  return docs.map((doc) => serializeTeam(doc as unknown as TeamDoc));
}

export async function getTeam(id: string) {
  await connectDB();
  const doc = await Team.findById(id).lean();
  return doc ? serializeTeam(doc as unknown as TeamDoc) : null;
}

export async function getActiveTeams() {
  await connectDB();
  const docs = await Team.find({ active: true }).sort({ name: 1 }).lean();
  return docs.map((doc) => serializeTeam(doc as unknown as TeamDoc));
}

export async function getDashboardStats() {
  await connectDB();
  const [playerCount, teamCount, selectedCount] = await Promise.all([
    Player.countDocuments(),
    Team.countDocuments(),
    Player.countDocuments({ status: "sold" })
  ]);

  return { playerCount, teamCount, selectedCount };
}
