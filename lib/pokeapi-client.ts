import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";
import { rechercherIdParNomFrancais } from "./donnees-francaises";

export async function chargerPokemon(nom: string): Promise<Pokemon | null> {
  try {
    let param = nom.toLowerCase().trim();
    const idFr = rechercherIdParNomFrancais(param);
    if (idFr) param = String(idFr);
    const reponse = await fetch(`${API}/pokemon/${encodeURIComponent(param)}`);
    if (reponse.status === 404) return null;
    if (!reponse.ok) throw new Error(`La PokéAPI a répondu ${reponse.status} pour ${nom}`);
    return versPokemon((await reponse.json()) as PokemonApi);
  } catch {
    return null;
  }
}
