import { updateSettingsAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getEventSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getEventSettings();

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-card">
        <h2 className="page-title">Event Settings</h2>
        <p className="desc">Manage event naming and defaults.</p>
        <form action={updateSettingsAction}>
          <div className="field">
            <label htmlFor="name">Event name</label>
            <input id="name" name="name" required defaultValue={settings.name} type="text" />
          </div>
          <div className="field">
            <label htmlFor="tagline">Tagline</label>
            <input id="tagline" name="tagline" required defaultValue={settings.tagline} type="text" />
          </div>
          <div className="field">
            <label htmlFor="logo">Event logo</label>
            <div className="photo-picker">
              <div className="photo-preview">
                <img src={settings.logoPath} alt="" />
              </div>
              <div>
                <input id="logo" accept="image/*" name="logo" type="file" />
                <div className="hint">Uploading replaces the current logo. Stored directly in the database.</div>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="defaultPurse">Default purse</label>
            <input id="defaultPurse" name="defaultPurse" min={0} required defaultValue={settings.defaultPurse} type="number" />
          </div>
          <button className="btn" type="submit">Save settings</button>
        </form>
      </section>
    </div>
  );
}
