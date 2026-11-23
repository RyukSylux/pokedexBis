export type Statistique = {
  nom: string;
  valeur: number;
};

export type Pokemon = {
  id: number;
  nom: string;
  image: string;
  types: string[];
  taille: number; // en mètres
  poids: number; // en kilogrammes
  stats: Statistique[];
};

export type PokemonApi = {
  id: number;
  name: string;
  height: number; // en décimètres
  weight: number; // en hectogrammes
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
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
};

export type Membre = Pick<Pokemon, "id" | "nom" | "image" | "types"> & {
  surnom: string;
};
