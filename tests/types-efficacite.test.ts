import { describe, it, expect } from "vitest";
import {
  calculerEfficacitesDefensives,
  grouperEfficacites,
} from "@/lib/types-efficacite";

describe("lib/types-efficacite - Moteur d'efficacité des 18 types Pokémon", () => {
  it("calcule correctement les efficacités d'un mono-type Eau (ex: Carapuce)", () => {
    const efficacites = calculerEfficacitesDefensives(["water"]);

    expect(efficacites["electric"]).toBe(2);
    expect(efficacites["grass"]).toBe(2);

    expect(efficacites["fire"]).toBe(0.5);
    expect(efficacites["water"]).toBe(0.5);
    expect(efficacites["ice"]).toBe(0.5);
    expect(efficacites["steel"]).toBe(0.5);

    expect(efficacites["normal"]).toBe(1);
    expect(efficacites["fighting"]).toBe(1);
  });

  it("gère les immunités pour le type Normal (ex: Ronflex)", () => {
    const efficacites = calculerEfficacitesDefensives(["normal"]);

    expect(efficacites["ghost"]).toBe(0); // Immunité totale
    expect(efficacites["fighting"]).toBe(2); // Faiblesse
    expect(efficacites["normal"]).toBe(1);
  });

  it("gère les immunités pour le type Spectre (ex: Fantominus)", () => {
    const efficacites = calculerEfficacitesDefensives(["ghost"]);

    expect(efficacites["normal"]).toBe(0);
    expect(efficacites["fighting"]).toBe(0);
    expect(efficacites["ghost"]).toBe(2);
    expect(efficacites["dark"]).toBe(2);
  });

  it("calcule les doubles faiblesses, doubles résistances et immunités d'un double type Feu/Vol (ex: Dracaufeu)", () => {
    const efficacites = calculerEfficacitesDefensives(["fire", "flying"]);

    // Double faiblesse (x4) : Roche (2 * 2)
    expect(efficacites["rock"]).toBe(4);

    // Faiblesses simples (x2) : Eau, Electrik
    expect(efficacites["water"]).toBe(2);
    expect(efficacites["electric"]).toBe(2);

    // Doubles résistances (x0.25) : Plante (0.5 * 0.5), Insecte (0.5 * 0.5)
    expect(efficacites["grass"]).toBe(0.25);
    expect(efficacites["bug"]).toBe(0.25);

    // Résistances simples (x0.5) : Combat, Feu, Acier, Fée
    expect(efficacites["fighting"]).toBe(0.5);
    expect(efficacites["fire"]).toBe(0.5);
    expect(efficacites["steel"]).toBe(0.5);
    expect(efficacites["fairy"]).toBe(0.5);

    // Immunité (x0) : Sol (grâce au type Vol : 2 * 0 = 0)
    expect(efficacites["ground"]).toBe(0);
  });

  it("calcule correctement le double type Eau/Sol (ex: Laggron - immunité Électrik et faiblesse critique Plante)", () => {
    const efficacites = calculerEfficacitesDefensives(["water", "ground"]);

    // Plante x4 (2 * 2)
    expect(efficacites["grass"]).toBe(4);
    // Électrik x0 (2 * 0 = 0 immunité Sol)
    expect(efficacites["electric"]).toBe(0);
    // Résistances x0.5 : Feu, Poison, Roche, Acier
    expect(efficacites["fire"]).toBe(0.5);
    expect(efficacites["poison"]).toBe(0.5);
    expect(efficacites["rock"]).toBe(0.5);
    expect(efficacites["steel"]).toBe(0.5);
  });

  it("groupe correctement les types par catégories pour l'affichage UI", () => {
    const groupes = grouperEfficacites(["fire", "flying"]);

    expect(groupes.faiblessesCritiques).toContain("rock");
    expect(groupes.faiblesses).toEqual(expect.arrayContaining(["water", "electric"]));
    expect(groupes.resistancesCritiques).toEqual(expect.arrayContaining(["grass", "bug"]));
    expect(groupes.immunités).toContain("ground");
  });
});
