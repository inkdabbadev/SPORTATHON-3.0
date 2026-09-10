"use client";

import { useMemo, useState } from "react";
import { createPlayerAction, updatePlayerAction } from "@/app/admin/actions";
import {
  BATSMAN_STYLES,
  BOWLER_STYLES,
  PACE_BOWLER_STYLES,
  PLAYER_CATEGORIES,
  PLAYER_GENDERS,
  PLAYER_STATUSES,
  REGISTRATION_TYPES,
  SPIN_BOWLER_STYLES,
  type PlayerCategory,
  type PlayerView,
  type TeamView
} from "@/types/domain";

export function AdminPlayerForm({ player, teams }: { player?: PlayerView; teams: TeamView[] }) {
  const action = player ? updatePlayerAction : createPlayerAction;
  const [category, setCategory] = useState<PlayerCategory | "">(player?.category || "");
  const showBatsmanStyle = category === "Batsman" || category === "All Rounder";
  const showBowlerStyle = category === "Fast Bowler" || category === "Spinner" || category === "All Rounder";
  const bowlerOptions = useMemo(() => {
    if (category === "Fast Bowler") return PACE_BOWLER_STYLES;
    if (category === "Spinner") return SPIN_BOWLER_STYLES;
    if (category === "All Rounder") return BOWLER_STYLES;
    return [];
  }, [category]);

  return (
    <form action={action}>
      {player ? <input name="id" type="hidden" value={player.id} /> : null}
      <div className="row2">
        <div className="field">
          <label htmlFor="name">Full name *</label>
          <input id="name" name="name" required defaultValue={player?.name} type="text" />
        </div>
        <div className="field">
          <label htmlFor="age">Age *</label>
          <input id="age" name="age" required defaultValue={player?.age || ""} max={100} min={10} type="number" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="gender">Gender *</label>
          <select id="gender" name="gender" required defaultValue={player?.gender || ""}>
            <option value="">Select gender</option>
            {PLAYER_GENDERS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="registeringAs">Registering as a: *</label>
          <select id="registeringAs" name="registeringAs" required defaultValue={player?.registeringAs || ""}>
            <option value="">Select type</option>
            {REGISTRATION_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            onChange={(event) => setCategory(event.target.value as PlayerCategory | "")}
            required
            value={category}
          >
            <option value="">Select category</option>
            {PLAYER_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={player?.status || "unsold"}>
            {PLAYER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item === "sold" ? "Sold" : "Unsold"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row2">
        <div className={`field conditional-field ${showBatsmanStyle ? "" : "is-hidden"}`}>
          <label htmlFor="batsmanStyle">Batsman style *</label>
          <select
            disabled={!showBatsmanStyle}
            id="batsmanStyle"
            name="batsmanStyle"
            required={showBatsmanStyle}
            defaultValue={showBatsmanStyle ? player?.batsmanStyle || "" : ""}
          >
            <option value="">-</option>
            {BATSMAN_STYLES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className={`field conditional-field ${showBowlerStyle ? "" : "is-hidden"}`}>
          <label htmlFor="bowlerStyle">Fast Bowler / Spinner style *</label>
          <select
            disabled={!showBowlerStyle}
            id="bowlerStyle"
            key={category}
            name="bowlerStyle"
            required={showBowlerStyle}
            defaultValue={showBowlerStyle ? player?.bowlerStyle || "" : ""}
          >
            <option value="">-</option>
            {bowlerOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="contact">Contact number *</label>
          <input id="contact" name="contact" required defaultValue={player?.contact} type="tel" />
        </div>
        <div className="field">
          <label htmlFor="reference">Reference *</label>
          <input id="reference" name="reference" required defaultValue={player?.reference || ""} maxLength={80} type="text" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="soldTo">Assigned team</label>
          <select id="soldTo" name="soldTo" defaultValue={player?.soldTo || ""}>
            <option value="">No team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="soldPrice">Points / price</label>
          <input id="soldPrice" name="soldPrice" defaultValue={player?.soldPrice || ""} min={0} type="number" />
        </div>
      </div>

      <button className="btn" type="submit">
        {player ? "Save player" : "Create player"}
      </button>
    </form>
  );
}
