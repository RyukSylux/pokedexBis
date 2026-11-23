import Link from "next/link";
import Image from "next/image";
import type { Pokemon } from "@/types/pokemon";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";
import BoutonSacocheRapide from "./BoutonSacocheRapide";

export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const numero = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <article className="group relative flex flex-col items-center rounded-3xl border border-gray-200/80 bg-white/95 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-400 hover:ring-2 hover:ring-red-400/20 dark:border-gray-800 dark:bg-gray-900/90 dark:hover:border-red-500/60 dark:hover:ring-red-500/10">
      {/* Bouton sacoche rapide (en haut à gauche) */}
      <div className="absolute left-3 top-3 z-10">
        <BoutonSacocheRapide pokemon={pokemon} />
      </div>

      {/* Bouton favori (en haut à droite) */}
      <div className="absolute right-3 top-3 z-10">
        <BoutonFavori nom={pokemon.nom} />
      </div>

      <Link
        href={`/pokemon/${encodeURIComponent(pokemon.nom)}`}
        className="flex w-full flex-col items-center focus:outline-none"
      >
        {/* Halo de scan Pokédex autour de l'illustration */}
        <div className="relative mb-3 flex size-32 sm:size-36 items-center justify-center rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/50 p-2 shadow-inner dark:from-gray-800/40 dark:to-gray-900/80">
          <Image
            src={pokemon.image}
            alt={pokemon.nom}
            width={130}
            height={130}
            className="drop-shadow-md transition-transform duration-300 group-hover:scale-115"
            priority={pokemon.id <= 12}
          />
        </div>

        <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">
          {numero}
        </span>

        <h2 className="mb-2 text-base sm:text-lg font-extrabold capitalize text-gray-900 group-hover:text-pokedex transition-colors dark:text-white">
          {pokemon.nom}
        </h2>

        <div className="flex flex-wrap justify-center gap-1.5">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} taille="sm" />
          ))}
        </div>
      </Link>
    </article>
  );
}
