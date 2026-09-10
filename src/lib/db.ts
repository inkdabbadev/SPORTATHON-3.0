import dns from "node:dns";
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? { conn: null, promise: null };
globalWithMongoose.mongooseCache = cache;

function configureDns(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) return;

  const dnsServers = process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1";
  dns.setServers(
    dnsServers
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  );
}

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  configureDns(uri);

  try {
    cache.promise ??= mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    });

    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
