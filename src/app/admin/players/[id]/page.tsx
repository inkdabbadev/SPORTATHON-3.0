import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { AdminPlayerForm } from "@/components/AdminPlayerForm";
import { requireAdmin } from "@/lib/auth";
import { getPlayer, getTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [player, teams] = await Promise.all([getPlayer(id), getTeams()]);

  if (!player) notFound();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Edit Player</h2>
        <p className="desc">Update registration details, status, and team assignment.</p>
        <AdminPlayerForm player={player} teams={teams} />
      </section>
    </div>
  );
}
