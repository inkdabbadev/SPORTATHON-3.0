"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Player } from "@/models/Player";

const saleSchema = z.object({
  playerId: z.string().min(1),
  soldPrice: z.coerce.number().int().min(0)
});

export async function confirmAuctionSale(playerId: string, soldPrice: number) {
  const parsed = saleSchema.parse({ playerId, soldPrice });

  await connectDB();
  await Player.findByIdAndUpdate(
    parsed.playerId,
    {
      $set: {
        status: "sold",
        soldPrice: parsed.soldPrice
      }
    },
    { runValidators: true }
  );

  revalidatePath("/auction");
  revalidatePath("/admin/players");
  revalidatePath("/admin/dashboard");
}

export async function markAuctionUnsold(playerId: string) {
  const parsed = z.string().min(1).parse(playerId);

  await connectDB();
  await Player.findByIdAndUpdate(
    parsed,
    {
      $set: {
        status: "unsold",
        soldTo: null,
        soldPrice: null
      }
    },
    { runValidators: true }
  );

  revalidatePath("/auction");
  revalidatePath("/admin/players");
  revalidatePath("/admin/dashboard");
}
