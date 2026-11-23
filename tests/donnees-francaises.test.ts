import { describe, it, expect } from "vitest";
import {
  obtenirDonneesFrancaises,
  obtenirNomFrancais,
  obtenirDescriptionFrancaise,
  obtenirCategorieFrancaise,
  rechercherIdParNomFrancais,
} from "@/lib/donnees-francaises";
import { versPokemon } from "@/lib/conversion";
import type { PokemonApi } from "@/types/pokemon";

describe("lib/donnees-francaises - Chargement direct des 1 025 noms et descriptions FR", () => {
  it("charge directement les données du Pokémon #1 (Bulbizarre)", () => {
    const p1 = obtenirDonneesFrancaises(1);
    expect(p1).toBeDefined();
    expect(p1?.nomFr).toBe("Bulbizarre");
    expect(p1?.categorieFr).toBe("Pokémon Graine");
    expect(p1?.descriptionFr).toContain("bulbe");
  });

  it("charge directement les données du Pokémon #25 (Pikachu)", () => {
    expect(obtenirNomFrancais(25)).toBe("Pikachu");
    expect(obtenirCategorieFrancaise(25)).toBe("Pokémon Souris");
    expect(obtenirDescriptionFrancaise(25)).toContain("électricité");
  });

  it("charge directement le dernier Pokémon #1025 (Pêchaminus)", () => {
    const p1025 = obtenirDonneesFrancaises(1025);
    expect(p1025).toBeDefined();
    expect(p1025?.nomFr).toBe("Pêchaminus");
    expect(p1025?.categorieFr).toBe("Emprise");
  });

  it("recherche l'identifiant par nom français", () => {
    expect(rechercherIdParNomFrancais("dracaufeu")).toBe(6);
    expect(rechercherIdParNomFrancais("salameche")).toBe(4);
    expect(rechercherIdParNomFrancais("carapuce")).toBe(7);
    expect(rechercherIdParNomFrancais("mewtwo")).toBe(150);
  });

  it("enrichit automatiquement l'objet Pokemon dans versPokemon()", () => {
    const brut: PokemonApi = {
      id: 6,
      name: "charizard",
      height: 17,
      weight: 905,
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/6.png",
          },
        },
      },
      types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
      stats: [
        { base_stat: 78, stat: { name: "hp" } },
        { base_stat: 84, stat: { name: "attack" } },
        { base_stat: 78, stat: { name: "defense" } },
        { base_stat: 109, stat: { name: "special-attack" } },
        { base_stat: 85, stat: { name: "special-defense" } },
        { base_stat: 100, stat: { name: "speed" } },
      ],
    };

    const pokemon = versPokemon(brut);
    expect(pokemon.id).toBe(6);
    expect(pokemon.nom).toBe("charizard");
    expect(pokemon.nomFr).toBe("Dracaufeu");
    expect(pokemon.categorieFr).toBe("Pokémon Flamme");
    expect(pokemon.descriptionFr).toBeTruthy();
  });
});
