"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function BarreRecherche() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [valeur, setValeur] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValeur(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const qActuel = searchParams.get("q") ?? "";
      if (valeur.trim() === qActuel.trim()) return;

      const params = new URLSearchParams(searchParams.toString());
      if (valeur.trim()) {
        params.set("q", valeur.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // Réinitialise la pagination sur nouvelle recherche

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [valeur, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        placeholder="Rechercher un Pokémon..."
        aria-label="Rechercher un Pokémon"
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-pokedex focus:outline-none focus:ring-2 focus:ring-pokedex/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
      />
    </div>
  );
}
