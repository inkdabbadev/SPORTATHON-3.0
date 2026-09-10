import Link from "next/link";
import { deletePlayerAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getPlayers, getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  await requireAdmin();
  const [players, teams] = await Promise.all([getPlayers(), getTeams()]);

  const teamName = (teamId?: string) => teams.find((team) => team.id === teamId)?.name || "-";

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <div className="page-head">
          <div>
            <h2 className="page-title">Players</h2>
            <p className="desc">Review, edit, assign, or remove player registrations.</p>
          </div>
          <Link className="btn" href="/admin/players/new">Add player</Link>
        </div>
        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Registering as</th>
                <th>Category</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Team</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.length ? (
                players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.gender || "-"}</td>
                    <td>{player.registeringAs || "-"}</td>
                    <td>{player.category}</td>
                    <td>{player.reference || "-"}</td>
                    <td>{player.status === "sold" ? "Sold" : "Unsold"}</td>
                    <td>{teamName(player.soldTo)}</td>
                    <td>{player.contact}</td>
                    <td>
                      <div className="admin-actions">
                        <Link className="btn ghost small" href={`/admin/players/${player.id}`}>Edit</Link>
                        <form action={deletePlayerAction}>
                          <input name="id" type="hidden" value={player.id} />
                          <button className="btn ghost small" type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan={9}>No players yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
