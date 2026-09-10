import type { PlayerView, TeamView } from "@/types/domain";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function teamSpent(teamId: string, players: PlayerView[]) {
  return players
    .filter((player) => player.status === "sold" && player.soldTo === teamId)
    .reduce((sum, player) => sum + (player.soldPrice || 0), 0);
}

export function TeamGrid({ teams, players }: { teams: TeamView[]; players: PlayerView[] }) {
  if (!teams.length) {
    return <div className="empty">No teams registered yet.</div>;
  }

  return (
    <div className="team-grid">
      {teams.map((team) => {
        const squad = players.filter((player) => player.status === "sold" && player.soldTo === team.id);
        const spent = teamSpent(team.id, players);
        const remaining = Math.max(0, team.purse - spent);
        const spentPct = team.purse > 0 ? Math.min(100, Math.round((spent / team.purse) * 100)) : 0;

        return (
          <article className="team-card" key={team.id} style={{ borderTopColor: team.color }}>
            <div className="card-head">
              {team.photoDataUrl ? (
                <img className="team-photo" src={team.photoDataUrl} alt="" />
              ) : (
                <span className="avatar">{initialsOf(team.name)}</span>
              )}
              <div>
                <span className="swatch" style={{ background: team.color }} />
                <h3>{team.name}</h3>
              </div>
            </div>
            <div className="owner">
              {team.owner}
              {team.city ? ` · ${team.city}` : ""}
            </div>
            <div className="purse-bar">
              <div className="purse-bar-fill" style={{ width: `${spentPct}%` }} />
            </div>
            <div className="purse-text">
              <span>{remaining} left</span>
              <span>{team.purse} pts total</span>
            </div>
            <details className="squad-list">
              <summary>Squad ({squad.length})</summary>
              {squad.length ? (
                squad.map((player) => (
                  <div className="squad-row" key={player.id}>
                    <span>{player.name}</span>
                    <span>{player.soldPrice} pts</span>
                  </div>
                ))
              ) : (
                <div className="squad-row">
                  <span className="muted">No players yet</span>
                </div>
              )}
            </details>
          </article>
        );
      })}
    </div>
  );
}
