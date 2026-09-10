import { PlayersTable } from "@/components/PlayersTable";
import { getPlayers, getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

async function loadPlayersPageData() {
  try {
    const [players, teams] = await Promise.all([getPlayers(), getTeams()]);
    return { players, teams };
  } catch {
    return null;
  }
}

export default async function PlayersPage() {
  const data = await loadPlayersPageData();

  if (!data) {
    return (
      <section className="panel">
        <h2>Players</h2>
        <p className="desc">MongoDB is not configured yet. Add `MONGODB_URI` to `.env` to load players.</p>
      </section>
    );
  }

  return (
    <>
      <h2 className="page-title">Players</h2>
      <PlayersTable players={data.players} teams={data.teams} />
    </>
  );
}
