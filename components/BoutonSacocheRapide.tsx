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
          ? "border-red-500 bg-red-50 shadow-md shadow-red-500/20 scale-105 dark:bg-red-950/40 dark:border-red-600"
          : estPleine
          ? "border-gray-200/60 bg-gray-100/60 text-gray-300 cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-600"
          : "border-gray-200 bg-white/90 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:border-red-500 dark:hover:text-red-400 shadow-xs"
      }`}
    >
      <svg
        className="size-5 transition-transform duration-200 group-hover/btn:scale-110"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10"
          fill={estDansEquipe ? "#ef4444" : "currentColor"}
          stroke={estDansEquipe ? "#b91c1c" : "currentColor"}
          strokeWidth="1.5"
          fillOpacity={estDansEquipe ? 1 : 0.15}
        />
        <path
          d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12"
          fill={estDansEquipe ? "#ffffff" : "currentColor"}
          stroke={estDansEquipe ? "#94a3b8" : "currentColor"}
          strokeWidth="1.5"
          fillOpacity={estDansEquipe ? 0.95 : 0.05}
        />
        <line
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          stroke={estDansEquipe ? "#1e293b" : "currentColor"}
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill={estDansEquipe ? "#ffffff" : "currentColor"}
          stroke={estDansEquipe ? "#1e293b" : "currentColor"}
          strokeWidth="1.5"
          fillOpacity={estDansEquipe ? 1 : 0.2}
        />
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill={estDansEquipe ? "#ef4444" : "currentColor"}
        />
      </svg>
    </button>
  );
}
