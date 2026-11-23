import { describe, it, expect } from "vitest";
import {
  GENERATIONS,
  obtenirBornesGeneration,
  estDansGeneration,
} from "@/lib/generations";

describe("lib/generations - Découpage par Générations et Régions", () => {
  it("contient les 9 générations officielles", () => {
    expect(GENERATIONS).toHaveLength(9);
    expect(GENERATIONS[0].cle).toBe("kanto");
    expect(GENERATIONS[8].cle).toBe("paldea");
  });

  it("définit les bornes exactes pour Kanto (#1 à #151)", () => {
    const bornes = obtenirBornesGeneration("kanto");
    expect(bornes).toEqual({ debut: 1, fin: 151 });
    expect(estDansGeneration(1, "kanto")).toBe(true);
    expect(estDansGeneration(151, "kanto")).toBe(true);
    expect(estDansGeneration(152, "kanto")).toBe(false);
  });

  it("définit les bornes exactes pour Johto (#152 à #251)", () => {
    const bornes = obtenirBornesGeneration("johto");
    expect(bornes).toEqual({ debut: 152, fin: 251 });
    expect(estDansGeneration(152, "johto")).toBe(true);
    expect(estDansGeneration(251, "johto")).toBe(true);
  });

  it("définit les bornes exactes pour Paldea (#906 à #1025)", () => {
    const bornes = obtenirBornesGeneration("paldea");
    expect(bornes).toEqual({ debut: 906, fin: 1025 });
    expect(estDansGeneration(906, "paldea")).toBe(true);
    expect(estDansGeneration(1025, "paldea")).toBe(true);
  });

  it("renvoie null pour une région inconnue", () => {
    expect(obtenirBornesGeneration("inconnu")).toBeNull();
  });
});
