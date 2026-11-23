import { describe, it, expect } from "vitest";
import { analyserSynergieEquipe } from "@/lib/synergie-equipe";

describe("lib/synergie-equipe - Diagnostic tactique de l'équipe", () => {
  it("détecte les faiblesses critiques partagées par 3 Pokémon ou plus", () => {
    const equipe = [
      { id: 6, nom: "charizard", types: ["fire", "flying"] },
      { id: 130, nom: "gyarados", types: ["water", "flying"] },
      { id: 18, nom: "pidgeot", types: ["normal", "flying"] },
    ];

    const analyse = analyserSynergieEquipe(equipe);

    // Les 3 Pokémon ont le type Vol, donc tous les 3 sont faibles face au type Roche et Électrik !
    expect(analyse.faiblessesCommunes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "electric", count: 3 }),
        expect.objectContaining({ type: "rock", count: 3 }),
      ])
    );
  });

  it("gère une équipe équilibrée sans faiblesse partagée majeure", () => {
    const equipeEquilibree = [
      { id: 3, nom: "venusaur", types: ["grass", "poison"] },
      { id: 6, nom: "charizard", types: ["fire", "flying"] },
      { id: 9, nom: "blastoise", types: ["water"] },
      { id: 65, nom: "alakazam", types: ["psychic"] },
      { id: 68, nom: "machamp", types: ["fighting"] },
      { id: 94, nom: "gengar", types: ["ghost", "poison"] },
    ];

    const analyse = analyserSynergieEquipe(equipeEquilibree);
    expect(analyse.scoreEquilibre).toBe("Excellente");
    expect(analyse.nombreTypesUniques).toBeGreaterThanOrEqual(7);
  });

  it("gère une équipe vide ou à 1 seul membre sans planter", () => {
    const analyseVide = analyserSynergieEquipe([]);
    expect(analyseVide.faiblessesCommunes).toEqual([]);
    expect(analyseVide.scoreEquilibre).toBe("Incomplète");
  });
});
