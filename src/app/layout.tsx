import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getEventSettings } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPORTATHON 3.0",
  description: "Player registration and roster management for SPORTATHON 3.0."
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
        <Header logoPath={logoPath} />
        <main>{children}</main>
        <footer>SPORTATHON 3.0 - built for this event only.</footer>
      </body>
    </html>
  );
}
