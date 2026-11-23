export type TransformationRoulette = {
  angleDeg: number;
  scale: number;
  opacite: number;
  estCentre: boolean;
};

/**
 * Calcule l'inclinaison 3D, l'échelle et l'opacité d'un élément de la roulette
 * selon son écart (offset) par rapport au centre du tambour.
 */
export function calculerTransformationRoulette(offset: number): TransformationRoulette {
  // Angle courbé simulant un barillet cylindrique physique
  const angleDeg = Math.max(-70, Math.min(70, offset * 24));
  const scale = Math.max(0.75, 1 - Math.abs(offset) * 0.07);
  const opacite = Math.max(0.2, 1 - Math.abs(offset) * 0.2);
  const estCentre = offset === 0;

  return {
    angleDeg,
    scale,
    opacite,
    estCentre,
  };
}

/**
 * Calcule le prochain index sans déborder des bornes.
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
 * Retourne la liste ordonnée des indices visibles autour de l'élément sélectionné
 * pour un rendu fluide du tambour sans saturer le DOM.
 */
export function obtenirIndicesVisibles(
  indexActif: number,
  total: number,
  rayon = 4
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

/**
 * Petit son de cran mécanique rétro au défilement de la molette
 * via la Web Audio API native.
 */
export function jouerBruitageMolette(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // Ignorer si audio restreint par politique du navigateur
  }
}
