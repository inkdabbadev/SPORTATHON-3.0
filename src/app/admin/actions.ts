"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { loginAdmin, logoutAdmin, requireAdmin } from "@/lib/auth";
import { eventSettingsSchema, loginSchema, playerSchema, teamSchema } from "@/lib/validation";
import { EventSettings } from "@/models/EventSettings";
import { Player } from "@/models/Player";
import { Team } from "@/models/Team";

function value(formData: FormData, key: string) {
  return formData.get(key)?.toString() || "";
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password")
  });

  if (!parsed.success) redirect("/admin/login?error=1");

  const ok = await loginAdmin(parsed.data.email, parsed.data.password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function createPlayerAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const parsed = playerSchema.parse({
    name: value(formData, "name"),
    age: value(formData, "age"),
    gender: value(formData, "gender"),
    registeringAs: value(formData, "registeringAs"),
    reference: value(formData, "reference"),
    category: value(formData, "category"),
    batsmanStyle: value(formData, "batsmanStyle"),
    bowlerStyle: value(formData, "bowlerStyle"),
    contact: value(formData, "contact"),
    status: value(formData, "status") || "unsold",
    soldTo: value(formData, "soldTo"),
    soldPrice: value(formData, "soldPrice"),
    basePrice: 100
  });

  await Player.create({ ...parsed, soldTo: parsed.soldTo || null });
  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function updatePlayerAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const id = value(formData, "id");
  const parsed = playerSchema.parse({
    name: value(formData, "name"),
    age: value(formData, "age"),
    gender: value(formData, "gender"),
    registeringAs: value(formData, "registeringAs"),
    reference: value(formData, "reference"),
    category: value(formData, "category"),
    batsmanStyle: value(formData, "batsmanStyle"),
    bowlerStyle: value(formData, "bowlerStyle"),
    contact: value(formData, "contact"),
    status: value(formData, "status") || "unsold",
    soldTo: value(formData, "soldTo"),
    soldPrice: value(formData, "soldPrice"),
    basePrice: 100
  });

  await Player.findByIdAndUpdate(id, { ...parsed, soldTo: parsed.soldTo || null }, { runValidators: true });
  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/teams");
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function deletePlayerAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  await Player.findByIdAndDelete(value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/teams");
  revalidatePath("/admin/players");
}

export async function createTeamAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const parsed = teamSchema.parse({
    name: value(formData, "name"),
    owner: value(formData, "owner"),
    city: value(formData, "city"),
    contact: value(formData, "contact"),
    email: value(formData, "email"),
    color: value(formData, "color") || "#19388A",
    purse: value(formData, "purse") || 10000,
    active: boolValue(formData, "active")
  });

  await Team.create(parsed);
  revalidatePath("/");
  revalidatePath("/teams");
  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function updateTeamAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const id = value(formData, "id");
  const parsed = teamSchema.parse({
    name: value(formData, "name"),
    owner: value(formData, "owner"),
    city: value(formData, "city"),
    contact: value(formData, "contact"),
    email: value(formData, "email"),
    color: value(formData, "color") || "#19388A",
    purse: value(formData, "purse") || 10000,
    active: boolValue(formData, "active")
  });

  await Team.findByIdAndUpdate(id, parsed, { runValidators: true });
  revalidatePath("/");
  revalidatePath("/teams");
  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeamAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const id = value(formData, "id");
  await Player.updateMany({ soldTo: id }, { $set: { soldTo: null, status: "unsold", soldPrice: null } });
  await Team.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/teams");
  revalidatePath("/players");
  revalidatePath("/admin/teams");
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const parsed = eventSettingsSchema.parse({
    name: value(formData, "name"),
    tagline: value(formData, "tagline"),
    logoPath: value(formData, "logoPath"),
    defaultPurse: value(formData, "defaultPurse")
  });

  await EventSettings.findOneAndUpdate(
    { singletonKey: "active-event" },
    { ...parsed, singletonKey: "active-event" },
    { upsert: true, runValidators: true }
  );
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
