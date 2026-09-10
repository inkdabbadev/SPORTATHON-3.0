import { TeamGrid } from "@/components/TeamGrid";
import { getPlayers, getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

async function loadTeamsPageData() {
  try {
    const [teams, players] = await Promise.all([getTeams(), getPlayers()]);
    return { teams, players };
  } catch {
    return null;
  }
}

export default async function TeamsPage() {
  const data = await loadTeamsPageData();

  if (!data) {
    return (
      <section className="panel">
        <h2>Teams</h2>
        <p className="desc">MongoDB is not configured yet. Add `MONGODB_URI` to `.env` to load teams.</p>
      </section>
    );
  }

  return (
    <>
      <h2 className="page-title">Teams</h2>
      <TeamGrid teams={data.teams} players={data.players} />
    </>
  );
}
