import { createTeamAction, updateTeamAction } from "@/app/admin/actions";
import type { TeamView } from "@/types/domain";

export function AdminTeamForm({ team }: { team?: TeamView }) {
  const action = team ? updateTeamAction : createTeamAction;

  return (
    <form action={action}>
      {team ? <input name="id" type="hidden" value={team.id} /> : null}
      <div className="row2">
        <div className="field">
          <label htmlFor="name">Team name *</label>
          <input id="name" name="name" required defaultValue={team?.name} type="text" />
        </div>
        <div className="field">
          <label htmlFor="owner">Owner / captain *</label>
          <input id="owner" name="owner" required defaultValue={team?.owner} type="text" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="city">City / base</label>
          <input id="city" name="city" defaultValue={team?.city || ""} type="text" />
        </div>
        <div className="field">
          <label htmlFor="contact">Contact number</label>
          <input id="contact" name="contact" defaultValue={team?.contact || ""} type="tel" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" defaultValue={team?.email || ""} type="email" />
        </div>
        <div className="field">
          <label htmlFor="purse">Purse</label>
          <input id="purse" name="purse" defaultValue={team?.purse || 10000} min={0} type="number" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="color">Team colour</label>
          <input id="color" name="color" defaultValue={team?.color || "#19388A"} type="color" />
        </div>
        <div className="field">
          <label htmlFor="active">Active</label>
          <input id="active" name="active" defaultChecked={team?.active ?? true} type="checkbox" />
        </div>
      </div>

      <button className="btn" type="submit">
        {team ? "Save team" : "Create team"}
      </button>
    </form>
  );
}
