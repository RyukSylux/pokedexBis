export type Statistique = {
  nom: string;
  valeur: number;
};

export type Pokemon = {
  id: number;
  nom: string;
  nomFr?: string; // Nom officiel en français (ex: "Dracaufeu")
  image: string;
  imageShiny?: string;
  criAudio?: string;
  types: string[];
  taille: number; // en mètres
  poids: number; // en kilogrammes
  stats: Statistique[];
  bst: number; // Base Stat Total (somme des statistiques)
  categorieFr?: string; // ex: "Pokémon Flamme"
  descriptionFr?: string; // Flavor text officiel en français
  talents?: string[]; // Talents du Pokémon
};

export type PokemonApi = {
  id: number;
  name: string;
  height: number; // en décimètres
  weight: number; // en hectogrammes
  sprites: {
    front_default?: string | null;
    front_shiny?: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
        front_shiny?: string | null;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities?: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  cries?: {
    latest?: string | null;
    legacy?: string | null;
  };
};

export type ConditionEvolution = {
  niveauMin?: number | null;
  objet?: string | null;
  declencheur: string; // "level-up", "use-item", "trade", etc.
  texteFr?: string; // ex: "Niveau 16", "Pierre Eau", "Échange"
};

export type NoeudEvolution = {
  nom: string;
  condition: ConditionEvolution;
  evolvesTo: NoeudEvolution[];
};

export type Membre = Pick<Pokemon, "id" | "nom" | "nomFr" | "image" | "types"> & {
  surnom: string;
  stats?: Statistique[];
  bst?: number;
};
