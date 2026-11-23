"use client";

import { useFavoris } from "@/stores/favoris";

export default function BoutonFavori({ nom }: { nom: string }) {
  const actif = useFavoris((etat) => etat.noms.includes(nom));
  const basculer = useFavoris((etat) => etat.basculer);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        basculer(nom);
      }}
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${nom} des favoris` : `Ajouter ${nom} aux favoris`}
      className={`size-9 rounded-full flex items-center justify-center text-xl transition-transform duration-150 active:scale-90 ${
        actif
          ? "text-yellow-400 drop-shadow-[0_1px_3px_rgba(234,179,8,0.5)]"
          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      }`}
    >
      {actif ? "★" : "☆"}
    </button>
  );
}
