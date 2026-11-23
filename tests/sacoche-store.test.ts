import { describe, it, expect, beforeEach } from "vitest";
import { useSacoche, TAILLE_SACOCHE } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

const mockPokemon = (id: number, nom: string): Pokemon => ({
  id,
  nom,
  image: `https://example.com/${id}.png`,
  types: ["fire"],
  taille: 1.5,
  poids: 50,
  bst: 500,
  stats: [
    { nom: "hp", valeur: 80 },
    { nom: "attack", valeur: 100 },
    { nom: "defense", valeur: 70 },
    { nom: "special-attack", valeur: 90 },
    { nom: "special-defense", valeur: 70 },
    { nom: "speed", valeur: 90 },
  ],
});

describe("stores/sacoche - Logique métier de la sacoche", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null,
    };
    useSacoche.getState().vider();
  });

  it("ajoute un Pokémon et conserve ses stats et son BST", () => {
    const p1 = mockPokemon(6, "charizard");
    useSacoche.getState().ajouter(p1);

    const equipe = useSacoche.getState().equipe;
    expect(equipe).toHaveLength(1);
    expect(equipe[0].id).toBe(6);
    expect(equipe[0].bst).toBe(500);
    expect(equipe[0].surnom).toBe("");
  });

  it("interdit les doublons du même Pokémon", () => {
    const p1 = mockPokemon(6, "charizard");
    useSacoche.getState().ajouter(p1);
    useSacoche.getState().ajouter(p1); // Doublon

    expect(useSacoche.getState().equipe).toHaveLength(1);
  });

  it(`plafonne l'équipe à ${TAILLE_SACOCHE} Pokémon maximum`, () => {
    for (let i = 1; i <= 8; i++) {
      useSacoche.getState().ajouter(mockPokemon(i, `poke-${i}`));
    }

    expect(useSacoche.getState().equipe).toHaveLength(TAILLE_SACOCHE);
  });

  it("retire un Pokémon par son identifiant", () => {
    useSacoche.getState().ajouter(mockPokemon(1, "bulbizarre"));
    useSacoche.getState().ajouter(mockPokemon(4, "salameche"));

    useSacoche.getState().retirer(1);

    const equipe = useSacoche.getState().equipe;
    expect(equipe).toHaveLength(1);
    expect(equipe[0].id).toBe(4);
  });

  it("renomme un membre en tronquant à 12 caractères", () => {
    useSacoche.getState().ajouter(mockPokemon(25, "pikachu"));
    useSacoche.getState().renommer(25, "ÉclairMagnifiqueEtSuperLong");

    const equipe = useSacoche.getState().equipe;
    expect(equipe[0].surnom).toBe("ÉclairMagnif");
  });

  it("réordonne les Pokémon dans l'équipe (deplacer)", () => {
    const p1 = mockPokemon(1, "poke-1");
    const p2 = mockPokemon(2, "poke-2");
    const p3 = mockPokemon(3, "poke-3");

    useSacoche.getState().ajouter(p1);
    useSacoche.getState().ajouter(p2);
    useSacoche.getState().ajouter(p3);

    // Déplacer poke-2 (index 1) vers l'index 0 (Lead)
    useSacoche.getState().deplacer(1, 0);

    const equipe = useSacoche.getState().equipe;
    expect(equipe[0].id).toBe(2);
    expect(equipe[1].id).toBe(1);
    expect(equipe[2].id).toBe(3);
  });

  it("ignore un déplacement avec des indices hors limites", () => {
    useSacoche.getState().ajouter(mockPokemon(1, "poke-1"));
    useSacoche.getState().ajouter(mockPokemon(2, "poke-2"));

    useSacoche.getState().deplacer(-1, 5); // Invalide

    const equipe = useSacoche.getState().equipe;
    expect(equipe[0].id).toBe(1);
    expect(equipe[1].id).toBe(2);
  });
});
