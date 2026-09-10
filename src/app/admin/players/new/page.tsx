import { AdminNav } from "@/components/AdminNav";
import { AdminPlayerForm } from "@/components/AdminPlayerForm";
import { requireAdmin } from "@/lib/auth";
import { getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewPlayerPage() {
  await requireAdmin();
  const teams = await getTeams();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Add Player</h2>
        <p className="desc">Create a player manually from the admin panel.</p>
        <AdminPlayerForm teams={teams} />
      </section>
    </div>
  );
}
