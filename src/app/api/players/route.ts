import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { playerSchema } from "@/lib/validation";
import { Player } from "@/models/Player";

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json();
    const parsed = playerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid player details." }, { status: 400 });
    }

    const player = await Player.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/players");

    return NextResponse.json({
      player: {
        id: player._id.toString(),
        name: player.name
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not register right now." }, { status: 500 });
  }
}
