import Link from "next/link";
import { deleteTeamAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  await requireAdmin();
  const teams = await getTeams();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <div className="page-head">
          <div>
            <h2 className="page-title">Teams</h2>
            <p className="desc">Create, edit, deactivate, or remove teams.</p>
          </div>
          <Link className="btn" href="/admin/teams/new">Add team</Link>
        </div>
        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Owner</th>
                <th>City</th>
                <th>Purse</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length ? (
                teams.map((team) => (
                  <tr key={team.id}>
                    <td>
                      <div className={`table-avatar ${team.photoDataUrl ? "" : "empty"}`}>
                        {team.photoDataUrl ? <img src={team.photoDataUrl} alt="" /> : "No photo"}
                      </div>
                    </td>
                    <td>{team.name}</td>
                    <td>{team.owner}</td>
                    <td>{team.city || "-"}</td>
                    <td>{team.purse}</td>
                    <td>{team.active ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="admin-actions">
                        <Link className="btn ghost small" href={`/admin/teams/${team.id}`}>Edit</Link>
                        <form action={deleteTeamAction}>
                          <input name="id" type="hidden" value={team.id} />
                          <button className="btn ghost small" type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan={7}>No teams yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
