"use client";

import { useFavoris } from "@/stores/favoris";

export default function CompteurFavoris() {
  const nombre = useFavoris((etat) => etat.noms.length);

  if (nombre === 0) return null;

  return (
    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-bold text-pokedex shadow-sm">
      {nombre}
    </span>
  );
}
