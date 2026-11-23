import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ModelePokedexId,
  MODELE_PAR_DEFAUT,
  estModeleValide,
} from "@/lib/pokedex-modeles";

type EtatModelePokedex = {
  modeleActif: ModelePokedexId;
  definirModele: (modele: ModelePokedexId) => void;
  reinitialiserModele: () => void;
};

export const useModelePokedexStore = create<EtatModelePokedex>()(
  persist(
    (set) => ({
      modeleActif: MODELE_PAR_DEFAUT,
      definirModele: (modele: ModelePokedexId) => {
        if (estModeleValide(modele)) {
          set({ modeleActif: modele });
        }
      },
      reinitialiserModele: () => set({ modeleActif: MODELE_PAR_DEFAUT }),
    }),
    {
      name: "pokedex-modele-chassis",
      skipHydration: true,
    }
  )
);
