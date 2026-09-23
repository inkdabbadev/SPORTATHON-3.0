import { AuctionStage } from "@/components/AuctionStage";
import { getEventSettings, getPlayers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AuctionPage() {
  const [players, settings] = await Promise.all([getPlayers(), getEventSettings()]);

  return <AuctionStage logoPath={settings.logoPath} players={players} />;
}
