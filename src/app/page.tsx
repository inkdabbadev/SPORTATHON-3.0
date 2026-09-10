import { Hero } from "@/components/Hero";
import { getDashboardStats, getEventSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

async function loadStats() {
  try {
    return await getDashboardStats();
  } catch {
    return { teamCount: 0, playerCount: 0, selectedCount: 0 };
  }
}

async function loadLogoPath() {
  try {
    const settings = await getEventSettings();
    return settings.logoPath;
  } catch {
    return "/logo.png";
  }
}

export default async function HomePage() {
  const [stats, logoPath] = await Promise.all([loadStats(), loadLogoPath()]);

  return (
    <>
      <Hero {...stats} logoPath={logoPath} />
      <section className="steps">
        <div className="step">
          <div className="stepnum">1</div>
          <h4>Register</h4>
          <p>Players sign up through this page. No login needed.</p>
        </div>
        <div className="step">
          <div className="stepnum">2</div>
          <h4>Review</h4>
          <p>Teams can review registered players and shortlist their squad picks.</p>
        </div>
        <div className="step">
          <div className="stepnum">3</div>
          <h4>Build a squad</h4>
          <p>Use the Teams and Players pages to track every roster in one place.</p>
        </div>
      </section>
    </>
  );
}
