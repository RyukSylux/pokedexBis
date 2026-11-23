export type ModelePokedexId =
  | "hgss"
  | "dppt"
  | "frlg"
  | "kanto"
  | "unova"
  | "rotom";

export interface ModelePokedexConfig {
  id: ModelePokedexId;
  nom: string;
  nomCourt: string;
  console: string;
  generation: string;
  annee: string;
  mecanique: string;
  couleurAccent: string;
  description: string;
  badge: string;
}

export const MODELES_POKEDEX: ModelePokedexConfig[] = [
  {
    id: "hgss",
    nom: "HeartGold & SoulSilver",
    nomCourt: "HG / SS",
    console: "Nintendo DS",
    generation: "Gen 4 (Johto)",
    annee: "2009",
    mecanique: "Carrousel rotatif tactile en arc de cercle",
    couleurAccent: "#c5a059", // Or / Argent
    description: "Le carrousel tactile mythique de la Nintendo DS : faites pivoter les Pokémon sur un arc de cercle avec le stylet ou la molette.",
    badge: "Tactile Culte",
  },
  {
    id: "dppt",
    nom: "Diamant, Perle & Platine",
    nomCourt: "D / P / Pt",
    console: "Nintendo DS",
    generation: "Gen 4 (Sinnoh)",
    annee: "2006",
    mecanique: "Poké-molette de défilement rapide",
    couleurAccent: "#3b82f6", // Bleu Diamant / Platine
    description: "Double écran Nintendo DS avec la fameuse molette Pokéball sur le bord droit de l'écran tactile inférieur pour un défilement ultra-réactif.",
    badge: "Double Écran DS",
  },
  {
    id: "frlg",
    nom: "Rouge Feu & Vert Feuille",
    nomCourt: "RF / VF",
    console: "Game Boy Advance",
    generation: "Gen 3 (Kanto)",
    annee: "2004",
    mecanique: "Roller mécanique vertical cranté",
    couleurAccent: "#ef4444", // Rouge Feu
    description: "Boîtier cylindrique rouge GBA avec son cylindre rotatif, son écran LCD rétro-éclairé et son roller latéral mécanique.",
    badge: "Rétro GBA",
  },
  {
    id: "kanto",
    nom: "Kanto Classique",
    nomCourt: "Dexter Animé",
    console: "Animé / Game Boy",
    generation: "Gen 1 (Kanto)",
    annee: "1996",
    mecanique: "Clapet rouge, grande lentille optique & diodes",
    couleurAccent: "#dc2626", // Rouge Kanto
    description: "Le légendaire Pokédex à clapet de Sacha avec son grand œil de bœuf bleu pulsant, son trio de LEDs et ses touches physiques.",
    badge: "Légende Originale",
  },
  {
    id: "unova",
    nom: "Noir & Blanc",
    nomCourt: "N / B (Unys)",
    console: "Nintendo DS",
    generation: "Gen 5 (Unys)",
    annee: "2010",
    mecanique: "Terminal tactile cybernétique & fiches holographiques",
    couleurAccent: "#06b6d4", // Cyan Cybernétique
    description: "Format smartphone moderne ultra-fin, fiches holographiques sombres et graphiques de statistiques dynamiques.",
    badge: "High-Tech Cyber",
  },
  {
    id: "rotom",
    nom: "Motisma-Dex",
    nomCourt: "Motisma",
    console: "Nintendo 3DS",
    generation: "Gen 7 (Alola)",
    annee: "2016",
    mecanique: "Yeux expressifs animés & cornes électriques",
    couleurAccent: "#f97316", // Orange Plasma
    description: "Le Pokédex habité par le Pokémon Motisma ! Yeux interactifs qui clignent et réagissent, coque rouge électrique avec cornes en plasma.",
    badge: "Pokédex Vivant",
  },
];

export const MODELE_PAR_DEFAUT: ModelePokedexId = "hgss";

export function obtenirModeleParId(id: string): ModelePokedexConfig {
  const trouve = MODELES_POKEDEX.find((m) => m.id === id);
  return trouve || MODELES_POKEDEX[0];
}

export function estModeleValide(id: string): id is ModelePokedexId {
  return MODELES_POKEDEX.some((m) => m.id === id);
}

/**
 * Calcule les coordonnées (x, y), l'échelle, l'opacité et l'angle de rotation
 * pour un élément sur le carrousel circulaire en arc de cercle HeartGold / SoulSilver.
 */
export function calculerPositionArcHGSS(
  offset: number,
  rayon: number = 220
): {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  zIndex: number;
} {
  // Angle par pas en degrés (14° entre chaque item)
  const angleDeg = offset * 15;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Calcul circulaire en arc
  const x = Math.sin(angleRad) * rayon;
  const y = (1 - Math.cos(angleRad)) * (rayon * 0.45);

  const distance = Math.abs(offset);
  const scale = Math.max(0.65, 1 - distance * 0.1);
  const opacity = Math.max(0.2, 1 - distance * 0.2);
  const rotation = angleDeg * 0.6;
  const zIndex = Math.max(1, 50 - Math.round(distance * 10));

  return { x, y, scale, opacity, rotation, zIndex };
}
