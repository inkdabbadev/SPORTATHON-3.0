import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/players">Players</Link>
      <Link href="/admin/teams">Teams</Link>
      <Link href="/admin/settings">Settings</Link>
      <Link
        className="admin-nav-auction"
        href="/auction"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open auction in a new tab"
      >
        <span>Auction</span>
        <span aria-hidden="true">↗</span>
      </Link>
      <form action={logoutAction}>
        <button type="submit">Logout</button>
      </form>
    </nav>
  );
}
