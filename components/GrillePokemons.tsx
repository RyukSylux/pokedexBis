import type { Pokemon } from "@/types/pokemon";
import CartePokemon from "./CartePokemon";

export default function GrillePokemons({ pokemons }: { pokemons: Pokemon[] }) {
  if (pokemons.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Aucun Pokémon ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {pokemons.map((pokemon) => (
        <CartePokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
