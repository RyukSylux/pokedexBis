export const TOUS_LES_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "steel",
  "dark",
  "fairy",
] as const;

export type NomType = (typeof TOUS_LES_TYPES)[number];

export type MultiplicateurType = 0 | 0.25 | 0.5 | 1 | 2 | 4;

// Table d'efficacité offensive : attaque -> [défenseur: multiplicateur]
// Par défaut 1 si non spécifié
const EFFICACITE_OFFENSIVE: Record<NomType, Partial<Record<NomType, number>>> = {
  normal: {
    rock: 0.5,
    steel: 0.5,
    ghost: 0,
  },
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: {
    fire: 2,
    ground: 2,
    rock: 2,
    water: 0.5,
    grass: 0.5,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    flying: 2,
    electric: 0.5,
    grass: 0.5,
    dragon: 0.5,
    ground: 0,
  },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    grass: 2,
    ground: 2,
    flying: 2,
    dragon: 2,
    fire: 0.5,
    water: 0.5,
    ice: 0.5,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    fairy: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: {
    grass: 2,
    fighting: 2,
    bug: 2,
    electric: 0.5,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    steel: 0.5,
    dark: 0,
  },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    flying: 2,
    bug: 2,
    fighting: 0.5,
    ground: 0.5,
    steel: 0.5,
  },
  ghost: {
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    normal: 0,
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0,
  },
  steel: {
    ice: 2,
    rock: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  dark: {
    psychic: 2,
    ghost: 2,
    fighting: 0.5,
    dark: 0.5,
    fairy: 0.5,
  },
  fairy: {
    fighting: 2,
    dragon: 2,
    dark: 2,
    fire: 0.5,
    poison: 0.5,
    steel: 0.5,
  },
};

/**
 * Calcule pour chaque type attaquant le multiplicateur de dégâts subis
 * par un Pokémon possédant les types défensifs donnés (1 ou 2 types).
 */
export function calculerEfficacitesDefensives(
  typesDefenseurs: string[]
): Record<NomType, MultiplicateurType> {
  const resultats: Partial<Record<NomType, MultiplicateurType>> = {};

  const typesNormalises = typesDefenseurs
    .map((t) => t.toLowerCase() as NomType)
    .filter((t) => TOUS_LES_TYPES.includes(t));

  for (const attaquant of TOUS_LES_TYPES) {
    let multiplicateur = 1;

    for (const defenseur of typesNormalises) {
      const efficacite = EFFICACITE_OFFENSIVE[attaquant]?.[defenseur];
      if (efficacite !== undefined) {
        multiplicateur *= efficacite;
      }
    }

    resultats[attaquant] = multiplicateur as MultiplicateurType;
  }

  return resultats as Record<NomType, MultiplicateurType>;
}

export type GroupesEfficacite = {
  faiblessesCritiques: NomType[]; // x4
  faiblesses: NomType[]; // x2
  resistances: NomType[]; // x0.5
  resistancesCritiques: NomType[]; // x0.25
  immunités: NomType[]; // x0
  degatsNormaux: NomType[]; // x1
};

export function grouperEfficacites(typesDefenseurs: string[]): GroupesEfficacite {
  const carte = calculerEfficacitesDefensives(typesDefenseurs);

  const groupes: GroupesEfficacite = {
    faiblessesCritiques: [],
    faiblesses: [],
    resistances: [],
    resistancesCritiques: [],
    immunités: [],
    degatsNormaux: [],
  };

  for (const [type, mult] of Object.entries(carte) as [NomType, MultiplicateurType][]) {
    if (mult === 4) groupes.faiblessesCritiques.push(type);
    else if (mult === 2) groupes.faiblesses.push(type);
    else if (mult === 0.5) groupes.resistances.push(type);
    else if (mult === 0.25) groupes.resistancesCritiques.push(type);
    else if (mult === 0) groupes.immunités.push(type);
    else groupes.degatsNormaux.push(type);
  }

  return groupes;
}
