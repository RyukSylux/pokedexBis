"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BasculeVue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const vueActuelle = searchParams.get("vue") || "grille";

  const changerVue = (nouvelleVue: "grille" | "roulette") => {
    const params = new URLSearchParams(searchParams.toString());
    if (nouvelleVue === "roulette") {
      params.set("vue", "roulette");
    } else {
      params.delete("vue");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Mode d'affichage du Pokédex"
      className="flex items-center rounded-2xl border border-gray-200 bg-white/95 p-1 shadow-xs dark:border-gray-800 dark:bg-gray-900/90 shrink-0"
    >
      <button
        type="button"
        role="radio"
        aria-checked={vueActuelle !== "roulette"}
        onClick={() => changerVue("grille")}
        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
          vueActuelle !== "roulette"
            ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        <span>⊞</span>
        <span>Grille</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={vueActuelle === "roulette"}
        onClick={() => changerVue("roulette")}
        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
          vueActuelle === "roulette"
            ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        <span>🎡</span>
        <span>Roulette Rétro</span>
      </button>
    </div>
  );
}
