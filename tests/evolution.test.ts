import { describe, it, expect } from "vitest";
import { formaterConditionEvolution, parserChaineEvolution } from "@/lib/evolution";

describe("lib/evolution - Analyse des conditions d'évolution", () => {
  it("formate une évolution par niveau simple", () => {
    const details = {
      min_level: 16,
      trigger: { name: "level-up" },
    };
    expect(formaterConditionEvolution(details)).toBe("Niv. 16");
  });

  it("formate une évolution par pierre d'évolution", () => {
    const details = {
      trigger: { name: "use-item" },
      item: { name: "water-stone" },
    };
    expect(formaterConditionEvolution(details)).toBe("Pierre Eau");
  });

  it("formate une évolution par échange", () => {
    const detailsSimple = {
      trigger: { name: "trade" },
    };
    expect(formaterConditionEvolution(detailsSimple)).toBe("Échange");

    const detailsAvecObjet = {
      trigger: { name: "trade" },
      held_item: { name: "metal-coat" },
    };
    expect(formaterConditionEvolution(detailsAvecObjet)).toBe("Échange (Peau Métal)");
  });

  it("formate une évolution par bonheur", () => {
    const details = {
      min_happiness: 220,
      trigger: { name: "level-up" },
      time_of_day: "day",
    };
    expect(formaterConditionEvolution(details)).toBe("Bonheur (Jour)");
  });

  it("parse une chaîne complète linéaire (Salamèche -> Reptincel -> Dracaufeu)", () => {
    const mockChain = {
      species: { name: "charmander" },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: "charmeleon" },
          evolution_details: [{ min_level: 16, trigger: { name: "level-up" } }],
          evolves_to: [
            {
              species: { name: "charizard" },
              evolution_details: [{ min_level: 36, trigger: { name: "level-up" } }],
              evolves_to: [],
            },
          ],
        },
      ],
    };

    const etapes = parserChaineEvolution(mockChain);
    expect(etapes).toHaveLength(3);
    expect(etapes[0].nom).toBe("charmander");
    expect(etapes[0].condition).toBeNull();

    expect(etapes[1].nom).toBe("charmeleon");
    expect(etapes[1].condition).toBe("Niv. 16");

    expect(etapes[2].nom).toBe("charizard");
    expect(etapes[2].condition).toBe("Niv. 36");
  });

  it("parse une chaîne à embranchements (ex: Évoli)", () => {
    const mockEeveeChain = {
      species: { name: "eevee" },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: "vaporeon" },
          evolution_details: [{ trigger: { name: "use-item" }, item: { name: "water-stone" } }],
          evolves_to: [],
        },
        {
          species: { name: "jolteon" },
          evolution_details: [{ trigger: { name: "use-item" }, item: { name: "thunder-stone" } }],
          evolves_to: [],
        },
      ],
    };

    const etapes = parserChaineEvolution(mockEeveeChain);
    expect(etapes).toHaveLength(3);
    expect(etapes[1].nom).toBe("vaporeon");
    expect(etapes[1].condition).toBe("Pierre Eau");
    expect(etapes[2].nom).toBe("jolteon");
    expect(etapes[2].condition).toBe("Pierre Foudre");
  });
});
