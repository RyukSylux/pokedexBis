import type { Pokemon, PokemonApi } from "@/types/pokemon";

export const API = "https://pokeapi.co/api/v2";

export function versPokemon(brut: PokemonApi): Pokemon {
  const stats = brut.stats.map((s) => ({
    nom: s.stat.name,
    valeur: s.base_stat,
  }));

  const bst = stats.reduce((acc, curr) => acc + curr.valeur, 0);

  const imageShiny =
    brut.sprites.other?.["official-artwork"]?.front_shiny ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${brut.id}.png`;

  const criAudio =
    brut.cries?.latest ??
    brut.cries?.legacy ??
    `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${brut.id}.ogg`;

  const talents = brut.abilities?.map((a) => a.ability.name) ?? [];

  return {
    id: brut.id,
    nom: brut.name,
    image:
      brut.sprites.other["official-artwork"].front_default ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${brut.id}.png`,
    imageShiny,
    criAudio,
    types: brut.types.map((t) => t.type.name),
    taille: brut.height / 10, // décimètres en mètres
    poids: brut.weight / 10, // hectogrammes en kilogrammes
    stats,
    bst,
    talents,
  };
}
