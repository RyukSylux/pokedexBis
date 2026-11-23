import type { Metadata } from "next";
import "./globals.css";
import ChassisPokedex from "@/components/ChassisPokedex";
import HydratationStores from "@/components/HydratationStores";
import KonamiDetector from "@/components/Doom/KonamiDetector";

export const metadata: Metadata = {
  title: {
    default: "Pokédex",
    template: "%s · Pokédex",
  },
  description: "Les 1 025 Pokémon, leurs types et leurs statistiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body
        className="min-h-screen text-gray-900 antialiased dark:text-gray-100"
        suppressHydrationWarning
      >
        <HydratationStores />
        <KonamiDetector />
        <ChassisPokedex>{children}</ChassisPokedex>
      </body>
    </html>
  );
}
