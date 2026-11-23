import { describe, it, expect, beforeEach } from "vitest";
import {
  MODELES_POKEDEX,
  MODELE_PAR_DEFAUT,
  obtenirModeleParId,
  estModeleValide,
  calculerPositionArcHGSS,
} from "@/lib/pokedex-modeles";
import { useModelePokedexStore } from "@/stores/modelePokedex";

describe("Configuration des 6 Modèles de Pokédex", () => {
  it("propose exactement les 6 modèles authentiques demandés", () => {
    expect(MODELES_POKEDEX).toHaveLength(6);
    const ids = MODELES_POKEDEX.map((m) => m.id);
    expect(ids).toContain("hgss");
    expect(ids).toContain("dppt");
    expect(ids).toContain("frlg");
    expect(ids).toContain("kanto");
    expect(ids).toContain("unova");
    expect(ids).toContain("rotom");
  });

  it("définit HeartGold / SoulSilver comme modèle par défaut", () => {
    expect(MODELE_PAR_DEFAUT).toBe("hgss");
  });

  it("permet de retrouver un modèle par son identifiant", () => {
    const hgss = obtenirModeleParId("hgss");
    expect(hgss.nom).toBe("HeartGold & SoulSilver");
    expect(hgss.console).toBe("Nintendo DS");

    const rotom = obtenirModeleParId("rotom");
    expect(rotom.nom).toBe("Motisma-Dex");
    expect(rotom.badge).toBe("Pokédex Vivant");

    // Fallback si id inconnu
    const fallback = obtenirModeleParId("inconnu-xyz");
    expect(fallback.id).toBe("hgss");
  });

  it("valide les identifiants avec estModeleValide", () => {
    expect(estModeleValide("hgss")).toBe(true);
    expect(estModeleValide("dppt")).toBe(true);
    expect(estModeleValide("frlg")).toBe(true);
    expect(estModeleValide("kanto")).toBe(true);
    expect(estModeleValide("unova")).toBe(true);
    expect(estModeleValide("rotom")).toBe(true);
    expect(estModeleValide("gameboy-color")).toBe(false);
  });

  it("calcule correctement les positions d'arc pour le carrousel HGSS", () => {
    const centre = calculerPositionArcHGSS(0, 200);
    expect(centre.x).toBeCloseTo(0, 1);
    expect(centre.y).toBeCloseTo(0, 1);
    expect(centre.scale).toBe(1);
    expect(centre.opacity).toBe(1);
    expect(centre.rotation).toBe(0);

    const droite = calculerPositionArcHGSS(1, 200);
    expect(droite.x).toBeGreaterThan(0);
    expect(droite.y).toBeGreaterThan(0);
    expect(droite.scale).toBeLessThan(1);
    expect(droite.rotation).toBeGreaterThan(0);

    const gauche = calculerPositionArcHGSS(-1, 200);
    expect(gauche.x).toBeLessThan(0);
    expect(gauche.y).toBeGreaterThan(0);
    expect(gauche.scale).toBeLessThan(1);
    expect(gauche.rotation).toBeLessThan(0);
  });
});

describe("Store Zustand ModelePokedex", () => {
  beforeEach(() => {
    useModelePokedexStore.getState().reinitialiserModele();
  });

  it("s'initialise avec le modèle par défaut", () => {
    expect(useModelePokedexStore.getState().modeleActif).toBe("hgss");
  });

  it("permet de basculer vers un autre modèle", () => {
    useModelePokedexStore.getState().definirModele("dppt");
    expect(useModelePokedexStore.getState().modeleActif).toBe("dppt");

    useModelePokedexStore.getState().definirModele("rotom");
    expect(useModelePokedexStore.getState().modeleActif).toBe("rotom");
  });

  it("ignore les identifiants non valides", () => {
    // @ts-expect-error test avec valeur invalide
    useModelePokedexStore.getState().definirModele("modele-fantome");
    expect(useModelePokedexStore.getState().modeleActif).toBe("hgss");
  });
});
