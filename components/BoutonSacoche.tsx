"use client";

import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 shadow-sm";

export default function BoutonSacoche({ pokemon }: { pokemon: Pokemon }) {
  const dedans = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const pleine = useSacoche((etat) => etat.equipe.length >= TAILLE_SACOCHE);
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);

  if (dedans) {
    return (
      <button
        type="button"
        onClick={() => retirer(pokemon.id)}
        className={`${BASE} border border-pokedex text-pokedex hover:bg-pokedex/10`}
      >
        <span className="size-2 rounded-full bg-red-600" />
        Retirer de la sacoche
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => ajouter(pokemon)}
      disabled={pleine}
      className={`${BASE} bg-pokedex text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <span className="size-2 rounded-full bg-white" />
      {pleine ? "Sacoche pleine (6/6)" : "Ajouter à la sacoche"}
    </button>
  );
}
