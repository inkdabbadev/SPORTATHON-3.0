import Link from "next/link";
import { EVENT_NAME } from "@/types/domain";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register player" },
  { href: "/teams", label: "Teams" },
  { href: "/players", label: "Players" }
];

export function Header() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/">
            <img className="brand-logo" src="/logo.png" alt={`${EVENT_NAME} logo`} />
            <div className="brand-copy">
              <h1>{EVENT_NAME}</h1>
              <span className="tagline">Player registration</span>
            </div>
          </Link>
          <nav className="tabs" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link className="tab-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="orbit-bar" />
    </>
  );
}
