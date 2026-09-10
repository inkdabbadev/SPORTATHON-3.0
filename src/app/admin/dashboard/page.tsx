import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Dashboard</h2>
        <p className="desc">Signed in as {admin.email}.</p>
        <div className="scoreboard" style={{ color: "var(--ink)", marginBottom: 24 }}>
          <div className="score-item">
            <div className="num">{stats.teamCount}</div>
            <div className="label" style={{ color: "var(--ink)" }}>Teams</div>
          </div>
          <div className="score-item">
            <div className="num">{stats.playerCount}</div>
            <div className="label" style={{ color: "var(--ink)" }}>Players</div>
          </div>
          <div className="score-item">
            <div className="num">{stats.selectedCount}</div>
            <div className="label" style={{ color: "var(--ink)" }}>Selected</div>
          </div>
        </div>
        <div className="admin-actions">
          <Link className="btn" href="/admin/players/new">Add player</Link>
          <Link className="btn ghost" href="/admin/teams/new">Add team</Link>
          <Link className="btn ghost" href="/admin/settings">Event settings</Link>
        </div>
      </section>
    </div>
  );
}
