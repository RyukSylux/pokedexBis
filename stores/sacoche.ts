import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Membre, Pokemon } from "@/types/pokemon";

export const TAILLE_SACOCHE = 6;

type EtatSacoche = {
  equipe: Membre[];
  ajouter: (pokemon: Pokemon) => void;
  retirer: (id: number) => void;
  renommer: (id: number, surnom: string) => void;
  vider: () => void;
};

export const useSacoche = create<EtatSacoche>()(
  persist(
    (set) => ({
      equipe: [],
      ajouter: (pokemon: Pokemon) =>
        set((etat) => {
          const dejaPresent = etat.equipe.some((membre) => membre.id === pokemon.id);
          if (dejaPresent || etat.equipe.length >= TAILLE_SACOCHE) return etat;
          const { id, nom, image, types } = pokemon;
          return {
            equipe: [...etat.equipe, { id, nom, image, types, surnom: "" }],
          };
        }),
      retirer: (id: number) =>
        set((etat) => ({
          equipe: etat.equipe.filter((membre) => membre.id !== id),
        })),
      renommer: (id: number, surnom: string) =>
        set((etat) => ({
          equipe: etat.equipe.map((membre) =>
            membre.id === id ? { ...membre, surnom: surnom.slice(0, 12) } : membre
          ),
        })),
      vider: () => set({ equipe: [] }),
    }),
    {
      name: "pokedex-sacoche",
      skipHydration: true,
    }
  )
);
