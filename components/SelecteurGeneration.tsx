"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GENERATIONS } from "@/lib/generations";

export default function SelecteurGeneration() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genActuelle = searchParams.get("gen") || "";

  const changerGeneration = (cle: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cle) {
      params.set("gen", cle);
    } else {
      params.delete("gen");
    }
    // Réinitialiser la pagination lors du changement de région
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
      {/* Bouton Toutes les régions */}
      <button
        type="button"
        onClick={() => changerGeneration("")}
        className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs font-bold transition shadow-xs border ${
          !genActuelle
            ? "bg-red-600 text-white border-red-600 shadow-red-600/30"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
        }`}
      >
        Toutes
      </button>

      {/* Onglets par génération */}
      {GENERATIONS.map((gen) => {
        const estActive = genActuelle.toLowerCase() === gen.cle.toLowerCase();
        return (
          <button
            key={gen.cle}
            type="button"
            onClick={() => changerGeneration(gen.cle)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition shadow-xs border flex items-center gap-1.5 ${
              estActive
                ? "bg-red-600 text-white border-red-600 shadow-red-600/30"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            }`}
          >
            <span>{gen.region}</span>
            <span
              className={`text-[10px] font-mono opacity-80 ${
                estActive ? "text-red-100" : "text-gray-400"
              }`}
            >
              #{gen.debut}-{gen.fin}
            </span>
          </button>
        );
      })}
    </div>
  );
}
