import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { getEventSettings } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPORTATHON 3.0",
  description: "Admin console for SPORTATHON 3.0 roster and team management."
};

async function loadLogoPath() {
  try {
    const settings = await getEventSettings();
    return settings.logoPath;
  } catch {
    return "/logo.png";
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const logoPath = await loadLogoPath();

  return (
    <html lang="en">
      <body>
        <AppShell logoPath={logoPath}>{children}</AppShell>
      </body>
    </html>
  );
}
