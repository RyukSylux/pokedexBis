import { describe, it, expect } from "vitest";
import {
  calculerTransformationRoulette,
  prochainIndex,
  obtenirIndicesVisibles,
} from "@/lib/roulette";

describe("lib/roulette - Logique de la roulette cylindrique du Pokédex", () => {
  it("calcule la transformation de l'élément central (offset 0)", () => {
    const t = calculerTransformationRoulette(0);
    expect(t.angleDeg).toBe(0);
    expect(t.scale).toBe(1);
    expect(t.opacite).toBe(1);
    expect(t.estCentre).toBe(true);
  });

  it("calcule la transformation des éléments distants avec perspective", () => {
    const t1 = calculerTransformationRoulette(1); // Éléments en dessous
    expect(t1.angleDeg).toBeGreaterThan(0);
    expect(t1.scale).toBeLessThan(1);
    expect(t1.opacite).toBeLessThan(1);
    expect(t1.estCentre).toBe(false);

    const tMoins1 = calculerTransformationRoulette(-1); // Éléments au-dessus
    expect(tMoins1.angleDeg).toBeLessThan(0);
    expect(tMoins1.scale).toBeLessThan(1);
  });

  it("plafonne l'angle pour éviter les distorsions extrêmes", () => {
    const tLoin = calculerTransformationRoulette(10);
    expect(Math.abs(tLoin.angleDeg)).toBeLessThanOrEqual(80);
    expect(tLoin.opacite).toBeGreaterThanOrEqual(0.1);
  });

  it("calcule le prochain index sans déborder des bornes", () => {
    expect(prochainIndex(0, -1, 10)).toBe(0); // Borne basse
    expect(prochainIndex(0, 1, 10)).toBe(1);
    expect(prochainIndex(9, 1, 10)).toBe(9); // Borne haute
    expect(prochainIndex(5, -1, 10)).toBe(4);
  });

  it("retourne la fenêtre des indices visibles autour du centre", () => {
    const indicesDebut = obtenirIndicesVisibles(0, 24, 3);
    expect(indicesDebut).toEqual([0, 1, 2, 3]);

    const indicesMilieu = obtenirIndicesVisibles(5, 24, 2);
    expect(indicesMilieu).toEqual([3, 4, 5, 6, 7]);

    const indicesFin = obtenirIndicesVisibles(23, 24, 2);
    expect(indicesFin).toEqual([21, 22, 23]);
  });
});
