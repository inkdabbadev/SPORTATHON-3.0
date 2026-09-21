import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { AdminPlayersBoard } from "@/components/AdminPlayersBoard";
import { requireAdmin } from "@/lib/auth";
import { getPlayers, getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  await requireAdmin();
  const [players, teams] = await Promise.all([getPlayers(), getTeams()]);

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <div className="page-head">
          <div>
            <h2 className="page-title">Players</h2>
            <p className="desc">Alphabetical player list with duplicate checks, auction cards, and delete controls.</p>
          </div>
          <Link className="btn" href="/admin/players/new">Add player</Link>
        </div>

        <AdminPlayersBoard players={players} teams={teams} />
      </section>
    </div>
  );
}
