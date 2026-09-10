"use client";

import { useMemo, useState } from "react";
import type { PlayerView, TeamView } from "@/types/domain";

export function PlayersTable({ players, teams }: { players: PlayerView[]; teams: TeamView[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unsold" | "sold">("all");
  const [activePlayer, setActivePlayer] = useState<PlayerView | null>(null);

  const visiblePlayers = useMemo(() => {
    return players.filter((player) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        player.name.toLowerCase().includes(query) || (player.reference || "").toLowerCase().includes(query);
      const matchesFilter = filter === "all" || player.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, players, search]);

  function teamName(teamId?: string) {
    return teams.find((team) => team.id === teamId)?.name || "-";
  }

  return (
    <>
      <div className="table-toolbar">
        <input
          aria-label="Search players"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name"
          type="text"
          value={search}
        />
        <div className="chip-group" aria-label="Filter players">
          {(["all", "unsold", "sold"] as const).map((item) => (
            <button className={`chip ${filter === item ? "active" : ""}`} key={item} onClick={() => setFilter(item)}>
              {item === "all" ? "All" : item === "sold" ? "Sold" : "Unsold"}
            </button>
          ))}
        </div>
      </div>

      <div className="table-shell">
        <table className="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Team</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {visiblePlayers.length ? (
              visiblePlayers.map((player) => (
                <tr key={player.id}>
                  <td>
                    <button className="table-link" onClick={() => setActivePlayer(player)}>
                      {player.name}
                    </button>
                  </td>
                  <td>{player.category}</td>
                  <td>{player.reference || "-"}</td>
                  <td>
                    <span className={`status-pill ${player.status}`}>{player.status === "sold" ? "Sold" : "Unsold"}</span>
                  </td>
                  <td>{teamName(player.soldTo)}</td>
                  <td>{player.soldPrice != null ? `${player.soldPrice} pts` : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty" colSpan={6}>
                  No players match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activePlayer ? (
        <div className="modal-backdrop show" onClick={() => setActivePlayer(null)}>
          <div className="modal wide" onClick={(event) => event.stopPropagation()}>
            <div className="player-detail-head">
              <div className="player-detail-photo">
                {activePlayer.photoDataUrl ? <img src={activePlayer.photoDataUrl} alt="" /> : null}
              </div>
              <div>
                <h3>{activePlayer.name}</h3>
                <div className="muted">{activePlayer.category}</div>
              </div>
            </div>
            <div className="player-detail-rows">
              <div>
                <span>Age</span>
                <span>{activePlayer.age || "-"}</span>
              </div>
              <div>
                <span>Gender</span>
                <span>{activePlayer.gender || "-"}</span>
              </div>
              <div>
                <span>Registering as a</span>
                <span>{activePlayer.registeringAs || "-"}</span>
              </div>
              <div>
                <span>Reference</span>
                <span>{activePlayer.reference || "-"}</span>
              </div>
              {activePlayer.batsmanStyle ? (
                <div>
                  <span>Batsman style</span>
                  <span>{activePlayer.batsmanStyle}</span>
                </div>
              ) : null}
              {activePlayer.bowlerStyle ? (
                <div>
                  <span>Fast Bowler / Spinner style</span>
                  <span>{activePlayer.bowlerStyle}</span>
                </div>
              ) : null}
              <div>
                <span>Status</span>
                <span>{activePlayer.status === "sold" ? "Sold" : "Unsold"}</span>
              </div>
              {activePlayer.soldTo ? (
                <div>
                  <span>Team</span>
                  <span>{teamName(activePlayer.soldTo)}</span>
                </div>
              ) : null}
            </div>
            <button className="btn ghost small" onClick={() => setActivePlayer(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
