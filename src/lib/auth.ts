import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

const COOKIE_NAME = "sportathon_admin";
const SESSION_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function loginAdmin(email: string, password: string) {
  await connectDB();
  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) return false;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return false;

  const token = await new SignJWT({
    sub: user._id.toString(),
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_AGE_SECONDS}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_AGE_SECONDS,
    path: "/"
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, getSecret());
    return {
      id: verified.payload.sub as string,
      email: verified.payload.email as string,
      name: verified.payload.name as string
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
