import type { Metadata } from "next";
import "./globals.css";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";

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
    <html lang="fr" className="h-full">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <HydratationStores />
        <EnTete />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-black/5 bg-white py-6 text-center text-xs text-gray-400 dark:border-white/10 dark:bg-gray-900">
          <p>Pokédex développé avec Next.js, React, Tailwind CSS et Zustand. Données issues de la PokéAPI.</p>
        </footer>
      </body>
    </html>
  );
}
