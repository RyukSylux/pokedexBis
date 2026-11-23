"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BasculeVue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mode par défaut : Roulette Pokédex Rétro
  const vueParam = searchParams.get("vue");
  const estGrille = vueParam === "grille";

  const changerVue = (nouvelleVue: "grille" | "roulette") => {
    const params = new URLSearchParams(searchParams.toString());
    if (nouvelleVue === "grille") {
      params.set("vue", "grille");
    } else {
      params.delete("vue");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Mode d'affichage du Pokédex"
      className="flex items-center rounded-xl border border-gray-300 bg-white/95 p-0.5 shadow-xs dark:border-gray-700 dark:bg-gray-900/90 shrink-0"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!estGrille}
        onClick={() => changerVue("roulette")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
          !estGrille
            ? "bg-blue-600 text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        <span>◓</span>
        <span>Molette DS</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={estGrille}
        onClick={() => changerVue("grille")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
          estGrille
            ? "bg-blue-600 text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        <span>▦</span>
        <span>Grille</span>
      </button>
    </div>
  );
}
