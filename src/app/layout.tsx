import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPORTATHON 3.0",
  description: "Player registration and roster management for SPORTATHON 3.0."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer>SPORTATHON 3.0 - built for this event only.</footer>
      </body>
    </html>
  );
}
