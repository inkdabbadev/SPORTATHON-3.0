import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/players">Players</Link>
      <Link href="/admin/teams">Teams</Link>
      <Link href="/admin/settings">Settings</Link>
      <form action={logoutAction}>
        <button type="submit">Logout</button>
      </form>
    </nav>
  );
}
