"use client";

import { useSacoche, TAILLE_SACOCHE } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  pokemon: Pokemon;
};

export default function BoutonSacocheRapide({ pokemon }: Props) {
  const equipe = useSacoche((etat) => etat.equipe);
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);

  const estDansEquipe = equipe.some((m) => m.id === pokemon.id);
  const estPleine = equipe.length >= TAILLE_SACOCHE && !estDansEquipe;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (estDansEquipe) {
      retirer(pokemon.id);
    } else if (!estPleine) {
      ajouter(pokemon);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={estPleine}
      title={
        estDansEquipe
          ? `Retirer ${pokemon.nom} de votre équipe`
          : estPleine
          ? `Équipe complète (${TAILLE_SACOCHE}/${TAILLE_SACOCHE})`
          : `Ajouter ${pokemon.nom} à votre équipe`
      }
      aria-label={
        estDansEquipe
          ? `Retirer ${pokemon.nom} de votre équipe`
          : `Ajouter ${pokemon.nom} à votre équipe`
      }
      className={`group/btn relative flex size-8 items-center justify-center rounded-full border transition-all duration-200 ${
        estDansEquipe
          ? "border-red-500 bg-red-600 text-white shadow-md shadow-red-500/30 scale-105"
          : estPleine
          ? "border-gray-200/60 bg-gray-100/60 text-gray-300 cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-600"
          : "border-gray-200 bg-white/90 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:border-red-500 dark:hover:text-red-400 shadow-xs"
      }`}
    >
      <span className="text-sm transition-transform duration-200 group-hover/btn:scale-110">
        {estDansEquipe ? "🔴" : "⚪"}
      </span>
    </button>
  );
}
