export type TransformationRoulette = {
  angleDeg: number;
  scale: number;
  opacite: number;
  estCentre: boolean;
};

/**
 * Calcule l'inclinaison 3D, l'échelle et l'opacité d'un élément de la roulette
 * selon son écart (offset) par rapport au centre.
 */
export function calculerTransformationRoulette(offset: number): TransformationRoulette {
  const angleDeg = Math.max(-75, Math.min(75, offset * 22));
  const scale = Math.max(0.72, 1 - Math.abs(offset) * 0.08);
  const opacite = Math.max(0.15, 1 - Math.abs(offset) * 0.22);
  const estCentre = offset === 0;

  return {
    angleDeg,
    scale,
    opacite,
    estCentre,
  };
}

/**
 * Calcule l'index suivant ou précédent avec protection contre les dépassements.
 */
export function prochainIndex(
  indexActif: number,
  direction: 1 | -1,
  total: number
): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(total - 1, indexActif + direction));
}

/**
 * Retourne la liste ordonnée des indices visibles autour de l'élément sélectionné.
 */
export function obtenirIndicesVisibles(
  indexActif: number,
  total: number,
  rayon = 3
): number[] {
  if (total <= 0) return [];
  const debut = Math.max(0, indexActif - rayon);
  const fin = Math.min(total - 1, indexActif + rayon);

  const indices: number[] = [];
  for (let i = debut; i <= fin; i++) {
    indices.push(i);
  }
  return indices;
}
