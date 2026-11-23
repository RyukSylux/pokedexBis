import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";

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

export async function recupererTousLesNoms(): Promise<string[]> {
  const donnees = await appeler<{ results: { name: string }[] }>("/pokemon?limit=1025");
  return donnees ? donnees.results.map((r) => r.name) : [];
}

export async function recupererNomsParType(type: string): Promise<string[]> {
  const donnees = await appeler<{ pokemon: { pokemon: { name: string } }[] }>(`/type/${type.toLowerCase()}`);
  if (!donnees) return [];
  return donnees.pokemon.map((p) => p.pokemon.name);
}

type Maillon = {
  species: { name: string };
  evolves_to: Maillon[];
};

function aplatir(maillon: Maillon): string[] {
  return [maillon.species.name, ...maillon.evolves_to.flatMap(aplatir)];
}

export async function recupererEvolutions(idOuNom: number | string): Promise<string[]> {
  const espece = await appeler<{ evolution_chain?: { url: string } }>(`/pokemon-species/${String(idOuNom).toLowerCase()}`);
  if (!espece || !espece.evolution_chain?.url) return [];
  const chaine = await appeler<{ chain: Maillon }>(espece.evolution_chain.url);
  return chaine ? aplatir(chaine.chain) : [];
}

export async function recupererNomFrancais(idOuNom: number | string): Promise<string | null> {
  const espece = await appeler<{ names?: { name: string; language: { name: string } }[] }>(
    `/pokemon-species/${String(idOuNom).toLowerCase()}`
  );
  if (!espece || !espece.names) return null;
  const nomFr = espece.names.find((n) => n.language.name === "fr");
  return nomFr ? nomFr.name : null;
}
