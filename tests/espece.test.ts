import { describe, it, expect } from "vitest";
import { nettoyerTextePokedex, parserDetailsEspece } from "@/lib/pokeapi";

describe("lib/pokeapi - Traitement des données d'espèce", () => {
  it("nettoie les sauts de page et sauts de ligne du texte Pokédex officiel", () => {
    const brut = "Il crache du feu\fqui peut faire fondre\ndes rochers.";
    expect(nettoyerTextePokedex(brut)).toBe("Il crache du feu qui peut faire fondre des rochers.");
  });

  it("extrait correctement le nom, la catégorie et la description en français", () => {
    const mockEspece = {
      names: [
        { name: "Charizard", language: { name: "en" } },
        { name: "Dracaufeu", language: { name: "fr" } },
      ],
      genera: [
        { genus: "Flame Pokémon", language: { name: "en" } },
        { genus: "Pokémon Flamme", language: { name: "fr" } },
      ],
      flavor_text_entries: [
        { flavor_text: "Spits fire that is hot enough to melt boulders.", language: { name: "en" } },
        { flavor_text: "Il crache du feu\fqui peut fondre les rochers.", language: { name: "fr" } },
      ],
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/2/" },
    };

    const details = parserDetailsEspece(mockEspece);
    expect(details.nomFr).toBe("Dracaufeu");
    expect(details.categorieFr).toBe("Pokémon Flamme");
    expect(details.descriptionFr).toBe("Il crache du feu qui peut fondre les rochers.");
    expect(details.evolutionChainUrl).toBe("https://pokeapi.co/api/v2/evolution-chain/2/");
  });

  it("gère gracieusement l'absence de données françaises", () => {
    const details = parserDetailsEspece({});
    expect(details.nomFr).toBeNull();
    expect(details.categorieFr).toBeNull();
    expect(details.descriptionFr).toBeNull();
    expect(details.evolutionChainUrl).toBeNull();
  });
});
