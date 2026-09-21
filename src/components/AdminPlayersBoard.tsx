"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deletePlayerAction } from "@/app/admin/actions";
import type { PlayerView, TeamView } from "@/types/domain";

function normalizedName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function formatBasePrice(price: number) {
  return `${price} Points`;
}

function playerSearchText(player: PlayerView, teamName: string) {
  return [
    player.name,
    player.category,
    player.gender,
    player.registeringAs,
    player.reference,
    player.contact,
    player.status,
    teamName
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function AdminPlayersBoard({ players, teams }: { players: PlayerView[]; teams: TeamView[] }) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [activePlayer, setActivePlayer] = useState<PlayerView | null>(null);

  const teamLookup = useMemo(() => new Map(teams.map((team) => [team.id, team.name])), [teams]);
  const teamName = (teamId?: string) => (teamId ? teamLookup.get(teamId) || "-" : "-");

  const duplicateNames = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();

    players.forEach((player) => {
      const key = normalizedName(player.name);
      if (!key) return;
      const current = counts.get(key);
      counts.set(key, { label: current?.label || player.name.trim(), count: (current?.count || 0) + 1 });
    });

    return counts;
  }, [players]);

  const duplicateGroups = useMemo(
    () => [...duplicateNames.values()].filter((item) => item.count > 1),
    [duplicateNames]
  );

  const visiblePlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return players;
    return players.filter((player) => playerSearchText(player, teamLookup.get(player.soldTo || "") || "-").includes(query));
  }, [players, search, teamLookup]);

  return (
    <>
      <div className={`duplicate-banner ${duplicateGroups.length ? "warn" : "ok"}`}>
        <strong>{duplicateGroups.length ? "Possible double entries found" : "No double entries found"}</strong>
        <span>
          {duplicateGroups.length
            ? duplicateGroups.map((item) => `${item.label} (${item.count})`).join(", ")
            : "Player names are unique after spacing and capitalization are normalized."}
        </span>
      </div>

      <div className="auction-list-head">
        <div>
          <h3>Auction Player List</h3>
          <p className="desc">Sorted A-Z. Every player is shown once with base price {formatBasePrice(50)}.</p>
        </div>
        <span>{visiblePlayers.length} / {players.length} players</span>
      </div>

      <div className="player-controls-panel">
        <div className="player-search-panel">
          <label htmlFor="playerSearch">Search player</label>
          <input
            id="playerSearch"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category, contact, reference, team..."
            type="search"
            value={search}
          />
        </div>
        <div className="player-view-panel">
          <span>View</span>
          <div className="player-view-toggle" aria-label="Player list view">
            <button className={viewMode === "cards" ? "active" : ""} type="button" onClick={() => setViewMode("cards")}>
              Auction cards
            </button>
            <button className={viewMode === "table" ? "active" : ""} type="button" onClick={() => setViewMode("table")}>
              Detailed table
            </button>
          </div>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="auction-player-grid">
          {visiblePlayers.length ? (
            visiblePlayers.map((player) => {
              const isDuplicate = (duplicateNames.get(normalizedName(player.name))?.count || 0) > 1;
              return (
                <article className={`auction-player-card ${isDuplicate ? "duplicate" : ""}`} key={player.id}>
                  <div className="auction-photo">
                    {player.photoDataUrl ? <img src={player.photoDataUrl} alt="" /> : <span>{player.name.charAt(0)}</span>}
                  </div>
                  <div className="auction-card-copy">
                    <span className="auction-category">{player.category}</span>
                    <h3>{player.name}</h3>
                    <div className="auction-card-meta">
                      <span>Age: {player.age || "-"}</span>
                    </div>
                    <div className="auction-base">
                      <span>Base Price</span>
                      <strong>{formatBasePrice(player.basePrice || 50)}</strong>
                    </div>
                    {isDuplicate ? <mark>Double entry?</mark> : null}
                    <div className="auction-card-actions">
                      <button className="btn ghost small" type="button" onClick={() => setActivePlayer(player)}>
                        Details
                      </button>
                      <Link className="btn ghost small" href={`/admin/players/${player.id}`}>Edit</Link>
                      <form action={deletePlayerAction}>
                        <input name="id" type="hidden" value={player.id} />
                        <button className="btn ghost small" type="submit">Delete</button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty">No players match your search.</div>
          )}
        </div>
      ) : (
        <div className="table-shell player-detail-table-shell">
          <table className="admin-table player-detail-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Registering as</th>
                <th>Category</th>
                <th>Batting</th>
                <th>Bowling</th>
                <th>Reference</th>
                <th>Base Price</th>
                <th>Status</th>
                <th>Team</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visiblePlayers.length ? (
                visiblePlayers.map((player) => {
                  const isDuplicate = (duplicateNames.get(normalizedName(player.name))?.count || 0) > 1;
                  return (
                    <tr className={isDuplicate ? "duplicate-row" : ""} key={player.id}>
                      <td>
                        <div className={`table-avatar ${player.photoDataUrl ? "" : "empty"}`}>
                          {player.photoDataUrl ? <img src={player.photoDataUrl} alt="" /> : "No photo"}
                        </div>
                      </td>
                      <td>
                        <strong>{player.name}</strong>
                        {isDuplicate ? <span className="inline-warning">Double</span> : null}
                      </td>
                      <td>{player.age || "-"}</td>
                      <td>{player.gender || "-"}</td>
                      <td>{player.registeringAs || "-"}</td>
                      <td>{player.category}</td>
                      <td>{player.batsmanStyle || "-"}</td>
                      <td>{player.bowlerStyle || "-"}</td>
                      <td>{player.reference || "-"}</td>
                      <td>{formatBasePrice(player.basePrice || 50)}</td>
                      <td>{player.status === "sold" ? "Sold" : "Unsold"}</td>
                      <td>{teamName(player.soldTo)}</td>
                      <td>{player.contact}</td>
                      <td>
                        <div className="admin-actions table-actions">
                          <button className="btn ghost small" type="button" onClick={() => setActivePlayer(player)}>Details</button>
                          <Link className="btn ghost small" href={`/admin/players/${player.id}`}>Edit</Link>
                          <form action={deletePlayerAction}>
                            <input name="id" type="hidden" value={player.id} />
                            <button className="btn ghost small" type="submit">Delete</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="empty" colSpan={14}>No players match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activePlayer ? (
        <div className="modal-backdrop show" onClick={() => setActivePlayer(null)}>
          <section className="modal wide player-admin-detail" onClick={(event) => event.stopPropagation()}>
            <div className="player-detail-head">
              <div className="player-detail-photo">
                {activePlayer.photoDataUrl ? <img src={activePlayer.photoDataUrl} alt="" /> : <span>{activePlayer.name.charAt(0)}</span>}
              </div>
              <div>
                <span className="auction-category">{activePlayer.category}</span>
                <h3>{activePlayer.name}</h3>
                <p>{formatBasePrice(activePlayer.basePrice || 50)} base price</p>
              </div>
            </div>
            <div className="player-detail-rows">
              <div><span>Age</span><span>{activePlayer.age || "-"}</span></div>
              <div><span>Gender</span><span>{activePlayer.gender || "-"}</span></div>
              <div><span>Registering as</span><span>{activePlayer.registeringAs || "-"}</span></div>
              <div><span>Reference</span><span>{activePlayer.reference || "-"}</span></div>
              <div><span>Contact</span><span>{activePlayer.contact || "-"}</span></div>
              <div><span>Team</span><span>{teamName(activePlayer.soldTo)}</span></div>
              <div><span>Status</span><span>{activePlayer.status === "sold" ? "Sold" : "Unsold"}</span></div>
              <div><span>Batsman style</span><span>{activePlayer.batsmanStyle || "-"}</span></div>
              <div><span>Bowling style</span><span>{activePlayer.bowlerStyle || "-"}</span></div>
            </div>
            <div className="modal-actions">
              <Link className="btn small" href={`/admin/players/${activePlayer.id}`}>Edit player</Link>
              <button className="btn ghost small" type="button" onClick={() => setActivePlayer(null)}>Close</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
