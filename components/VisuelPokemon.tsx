"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  nom: string;
  imageNormal: string;
  imageShiny?: string;
};

export default function VisuelPokemon({
  nom,
  imageNormal,
  imageShiny,
}: Props) {
  const [estShiny, setEstShiny] = useState(false);

  const imageAffichee = estShiny && imageShiny ? imageShiny : imageNormal;

  return (
    <div className="relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-gray-100/70 p-6 sm:p-8 dark:from-gray-800/60 dark:to-gray-900/40 border border-black/5 dark:border-white/5">
      {/* Bouton de bascule Shiny / Chromatique */}
      {imageShiny && (
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setEstShiny((prev) => !prev)}
            aria-pressed={estShiny}
            aria-label={
              estShiny
                ? "Afficher la version normale"
                : "Afficher la version chromatique (Shiny)"
            }
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition shadow-sm border ${
              estShiny
                ? "bg-amber-400 border-amber-300 text-gray-950 shadow-amber-400/30 scale-105"
                : "bg-white/90 border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-500 dark:bg-gray-800/90 dark:border-gray-700 dark:text-gray-300 dark:hover:border-amber-400"
            }`}
          >
            <span>✨</span>
            <span>{estShiny ? "Chromatique" : "Normal"}</span>
          </button>
        </div>
      )}

      {/* Image avec animation */}
      <div className="relative size-64 sm:size-80 flex items-center justify-center">
        <Image
          src={imageAffichee}
          alt={estShiny ? `${nom} (Chromatique / Shiny)` : nom}
          width={340}
          height={340}
          priority
          className={`drop-shadow-2xl transition duration-500 hover:scale-105 ${
            estShiny ? "filter drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]" : ""
          }`}
        />
      </div>

      {/* Mention Shiny en bas */}
      {estShiny && (
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-500 dark:text-amber-400 animate-pulse">
          <span>★</span>
          <span>Variante chromatique officielle (Shiny)</span>
          <span>★</span>
        </div>
      )}
    </div>
  );
}
