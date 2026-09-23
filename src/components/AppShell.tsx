"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT_NAME } from "@/types/domain";

type AppShellProps = Readonly<{
  children: React.ReactNode;
  logoPath: string;
}>;

export function AppShell({ children, logoPath }: AppShellProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/auction")) {
    return <>{children}</>;
  }

  return (
    <div className="admin-app-root">
      <header className="admin-topbar">
        <Link className="admin-brand" href="/admin">
          <img src={logoPath} alt={`${EVENT_NAME} logo`} />
          <span>
            <strong>{EVENT_NAME}</strong>
            <small>Admin console</small>
          </span>
        </Link>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
