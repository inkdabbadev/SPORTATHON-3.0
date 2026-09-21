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

function withoutPhotoDataUrl<T extends { photoDataUrl?: unknown }>(data: T) {
  const { photoDataUrl, ...fields } = data;
  void photoDataUrl;
  return fields;
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
    basePrice: 50
  });

  const playerFields = withoutPhotoDataUrl(parsed);
  await Player.create({ ...playerFields, soldTo: parsed.soldTo || null });
  revalidatePath("/admin/players");
  revalidatePath("/admin/dashboard");
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
    basePrice: 50
  });

  const playerFields = withoutPhotoDataUrl(parsed);
  await Player.findByIdAndUpdate(id, { ...playerFields, soldTo: parsed.soldTo || null }, { runValidators: true });
  revalidatePath("/admin/players");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/dashboard");
  redirect("/admin/players");
}

export async function deletePlayerAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  await Player.findByIdAndDelete(value(formData, "id"));
  revalidatePath("/admin/players");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/dashboard");
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

  const teamFields = withoutPhotoDataUrl(parsed);
  await Team.create(teamFields);
  revalidatePath("/admin/teams");
  revalidatePath("/admin/dashboard");
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

  const teamFields = withoutPhotoDataUrl(parsed);
  await Team.findByIdAndUpdate(id, teamFields, { runValidators: true });
  revalidatePath("/admin/teams");
  revalidatePath("/admin/dashboard");
  redirect("/admin/teams");
}

export async function deleteTeamAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const id = value(formData, "id");
  await Player.updateMany({ soldTo: id }, { $set: { soldTo: null, status: "unsold", soldPrice: null } });
  await Team.findByIdAndDelete(id);
  revalidatePath("/admin/teams");
  revalidatePath("/admin/players");
  revalidatePath("/admin/dashboard");
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();
  await connectDB();
  const parsed = eventSettingsSchema.parse({
    name: value(formData, "name"),
    tagline: value(formData, "tagline"),
    defaultPurse: value(formData, "defaultPurse")
  });

  const logoFile = formData.get("logo");
  const update: Record<string, unknown> = {
    name: parsed.name,
    tagline: parsed.tagline,
    defaultPurse: parsed.defaultPurse,
    singletonKey: "active-event"
  };

  if (logoFile instanceof File && logoFile.size > 0) {
    if (!logoFile.type.startsWith("image/")) {
      throw new Error("Logo must be an image file.");
    }
    if (logoFile.size > 2_000_000) {
      throw new Error("Logo is too large.");
    }
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    update.logo = { data: buffer, contentType: logoFile.type };
  }

  await EventSettings.findOneAndUpdate(
    { singletonKey: "active-event" },
    update,
    { upsert: true, runValidators: true }
  );
  revalidatePath("/admin/settings");
  revalidatePath("/admin/dashboard");
}
