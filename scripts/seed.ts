import "dotenv/config";

import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import { AdminUser } from "../src/models/AdminUser";
import { EventSettings } from "../src/models/EventSettings";
import { EVENT_NAME } from "../src/types/domain";

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  if (!email || !password || password.length < 8) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD with at least 8 characters are required.");
  }

  await connectDB();

  await EventSettings.findOneAndUpdate(
    { singletonKey: "active-event" },
    {
      name: EVENT_NAME,
      tagline: "Player registration",
      logoPath: "/logo.png",
      defaultPurse: 10000,
      singletonKey: "active-event"
    },
    { upsert: true, new: true }
  );

  const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.create({ email, passwordHash, name: "SPORTATHON Admin" });
    console.log(`Created admin user: ${email}`);
  } else {
    console.log(`Admin user already exists: ${email}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
