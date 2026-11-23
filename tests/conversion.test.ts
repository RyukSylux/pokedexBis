import { describe, it, expect } from "vitest";
import { versPokemon } from "@/lib/conversion";
import type { PokemonApi } from "@/types/pokemon";

describe("lib/conversion - versPokemon", () => {
  const mockApiData: PokemonApi = {
    id: 6,
    name: "charizard",
    height: 17,
    weight: 905,
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://example.com/charizard.png",
          front_shiny: "https://example.com/charizard-shiny.png",
        },
      },
    },
    types: [
      { type: { name: "fire" } },
      { type: { name: "flying" } },
    ],
    stats: [
      { base_stat: 78, stat: { name: "hp" } },
      { base_stat: 84, stat: { name: "attack" } },
      { base_stat: 78, stat: { name: "defense" } },
      { base_stat: 109, stat: { name: "special-attack" } },
      { base_stat: 85, stat: { name: "special-defense" } },
      { base_stat: 100, stat: { name: "speed" } },
    ],
    cries: {
      latest: "https://example.com/charizard-cry.ogg",
    },
    abilities: [
      { ability: { name: "blaze" }, is_hidden: false },
      { ability: { name: "solar-power" }, is_hidden: true },
    ],
  };

  it("transforme les unités correctement (taille en m, poids en kg)", () => {
    const p = versPokemon(mockApiData);
    expect(p.taille).toBe(1.7);
    expect(p.poids).toBe(90.5);
  });

  it("calcule le Base Stat Total (BST) avec exactitude", () => {
    const p = versPokemon(mockApiData);
    // 78 + 84 + 78 + 109 + 85 + 100 = 534
    expect(p.bst).toBe(534);
  });

  it("récupère l'image Shiny et le cri audio officiel", () => {
    const p = versPokemon(mockApiData);
    expect(p.imageShiny).toBe("https://example.com/charizard-shiny.png");
    expect(p.criAudio).toBe("https://example.com/charizard-cry.ogg");
    expect(p.talents).toEqual(["blaze", "solar-power"]);
  });

  it("utilise des fallbacks robustes si les données optionnelles sont absentes", () => {
    const sansOptionnels: PokemonApi = {
      ...mockApiData,
      sprites: {
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
        },
      },
      cries: undefined,
      abilities: undefined,
    };
    const p = versPokemon(sansOptionnels);
    expect(p.image).toContain("/6.png");
    expect(p.imageShiny).toContain("/shiny/6.png");
    expect(p.criAudio).toContain("/cries/pokemon/latest/6.ogg");
    expect(p.talents).toEqual([]);
  });
});
