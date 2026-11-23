import { describe, it, expect } from "vitest";
import { estDansGeneration } from "@/lib/generations";
import { correspondanceRecherche } from "@/lib/recherche-bilingue";

describe("Filtrage combiné (Région, Recherche bilingue)", () => {
  const mockListe = [
    { nom: "bulbasaur", id: 1 },
    { nom: "charmander", id: 4 },
    { nom: "charizard", id: 6 },
    { nom: "chikorita", id: 152 },
    { nom: "cyndaquil", id: 155 },
    { nom: "fuecoco", id: 909 },
  ];

  it("filtre les Pokémon par région Kanto (G1)", () => {
    const kanto = mockListe.filter((p) => estDansGeneration(p.id, "kanto"));
    expect(kanto.map((p) => p.nom)).toEqual(["bulbasaur", "charmander", "charizard"]);
  });

  it("filtre les Pokémon par région Johto (G2)", () => {
    const johto = mockListe.filter((p) => estDansGeneration(p.id, "johto"));
    expect(johto.map((p) => p.nom)).toEqual(["chikorita", "cyndaquil"]);
  });

  it("filtre par recherche bilingue française 'dracaufeu'", () => {
    const resultats = mockListe.filter((p) => correspondanceRecherche(p.nom, "dracaufeu"));
    expect(resultats).toHaveLength(1);
    expect(resultats[0].nom).toBe("charizard");
  });
});
