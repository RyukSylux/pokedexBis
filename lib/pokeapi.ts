import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";
import {
  parserChaineEvolution,
  type ChaineEvolutionNoeudBrut,
  type EtapeEvolutionParsed,
} from "./evolution";

export async function appeler<T>(cheminOuUrl: string): Promise<T | null> {
  const url = cheminOuUrl.startsWith("http") ? cheminOuUrl : `${API}${cheminOuUrl}`;
  try {
    const reponse = await fetch(url, {
      next: { revalidate: 86400 }, // Cache 24 heures
    });
    if (reponse.status === 404) return null;
    if (!reponse.ok) throw new Error(`Erreur API ${reponse.status} sur ${url}`);
    return (await reponse.json()) as T;
  } catch (erreur) {
    console.error(`Échec de l'appel PokéAPI sur ${url}:`, erreur);
    return null;
  }
}

export async function recupererPokemon(nomOuId: string | number): Promise<Pokemon | null> {
  const brut = await appeler<PokemonApi>(`/pokemon/${String(nomOuId).toLowerCase()}`);
  return brut ? versPokemon(brut) : null;
}

export async function recupererPlusieurs(noms: string[]): Promise<Pokemon[]> {
  const resultats = await Promise.all(noms.map((nom) => recupererPokemon(nom)));
  return resultats.filter((p): p is Pokemon => p !== null);
}

export type PokemonResume = {
  nom: string;
  id: number;
};

export async function recupererTousLesNoms(): Promise<PokemonResume[]> {
  const donnees = await appeler<{ results: { name: string; url: string }[] }>("/pokemon?limit=1025");
  if (!donnees) return [];
  return donnees.results.map((r, i) => {
    const match = r.url?.match(/\/pokemon\/(\d+)\//);
    const id = match ? parseInt(match[1], 10) : i + 1;
    return { nom: r.name, id };
  });
}

export async function recupererNomsParType(type: string): Promise<PokemonResume[]> {
  const donnees = await appeler<{ pokemon: { pokemon: { name: string; url: string } }[] }>(`/type/${type.toLowerCase()}`);
  if (!donnees) return [];
  return donnees.pokemon
    .map((p) => {
      const match = p.pokemon.url?.match(/\/pokemon\/(\d+)\//);
      const id = match ? parseInt(match[1], 10) : 0;
      return { nom: p.pokemon.name, id };
    })
    .filter((p) => p.id > 0 && p.id <= 1025);
}

export type EspeceApiBrut = {
  names?: { name: string; language?: { name: string } }[];
  genera?: { genus: string; language?: { name: string } }[];
  flavor_text_entries?: { flavor_text: string; language?: { name: string } }[];
  evolution_chain?: { url: string };
};

export async function recupererEtapesEvolution(
  idOuNom: number | string
): Promise<EtapeEvolutionParsed[]> {
  const details = await recupererDetailsEspece(idOuNom);
  if (!details.evolutionChainUrl) return [];
  const chaine = await appeler<{ chain: ChaineEvolutionNoeudBrut }>(details.evolutionChainUrl);
  return chaine?.chain ? parserChaineEvolution(chaine.chain) : [];
}

export function nettoyerTextePokedex(texte: string): string {
  return texte
    .replace(/[\f\n\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type DetailsEspece = {
  nomFr: string | null;
  categorieFr: string | null;
  descriptionFr: string | null;
  evolutionChainUrl: string | null;
};

export function parserDetailsEspece(espece?: EspeceApiBrut | null): DetailsEspece {
  if (!espece || typeof espece !== "object") {
    return {
      nomFr: null,
      categorieFr: null,
      descriptionFr: null,
      evolutionChainUrl: null,
    };
  }

  const nomFr =
    espece.names?.find((n) => n.language?.name === "fr")?.name ?? null;

  const categorieFr =
    espece.genera?.find((g) => g.language?.name === "fr")?.genus ?? null;

  const entreesFr =
    espece.flavor_text_entries?.filter(
      (f) => f.language?.name === "fr"
    ) ?? [];

  const derniereEntree = entreesFr.length > 0 ? entreesFr[entreesFr.length - 1] : null;
  const descriptionFr = derniereEntree
    ? nettoyerTextePokedex(derniereEntree.flavor_text)
    : null;

  const evolutionChainUrl = espece.evolution_chain?.url ?? null;

  return {
    nomFr,
    categorieFr,
    descriptionFr,
    evolutionChainUrl,
  };
}

export async function recupererDetailsEspece(
  idOuNom: number | string
): Promise<DetailsEspece> {
  const donnees = await appeler<EspeceApiBrut>(
    `/pokemon-species/${String(idOuNom).toLowerCase()}`
  );
  return parserDetailsEspece(donnees);
}

export async function recupererNomFrancais(idOuNom: number | string): Promise<string | null> {
  const details = await recupererDetailsEspece(idOuNom);
  return details.nomFr;
}
