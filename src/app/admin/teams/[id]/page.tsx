import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { AdminTeamForm } from "@/components/AdminTeamForm";
import { requireAdmin } from "@/lib/auth";
import { getTeam } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const team = await getTeam(id);

  if (!team) notFound();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Edit Team</h2>
        <p className="desc">Update team identity, contact details, purse, and active state.</p>
        <AdminTeamForm team={team} />
      </section>
    </div>
  );
}
