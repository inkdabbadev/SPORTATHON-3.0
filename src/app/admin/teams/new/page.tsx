import { AdminNav } from "@/components/AdminNav";
import { AdminTeamForm } from "@/components/AdminTeamForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewTeamPage() {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Add Team</h2>
        <p className="desc">Create a team for roster tracking and player assignment.</p>
        <AdminTeamForm />
      </section>
    </div>
  );
}
