import Link from "next/link";
import Image from "next/image";
import type { Pokemon } from "@/types/pokemon";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";
import BoutonSacocheRapide from "./BoutonSacocheRapide";

export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const numero = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <article className="group relative flex flex-col items-center rounded-3xl border border-black/5 bg-gradient-to-b from-white to-gray-50/70 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200/60 dark:border-white/10 dark:from-gray-900 dark:to-gray-900/60 dark:hover:border-red-900/40">
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
        <div className="relative mb-3 flex size-36 items-center justify-center">
          <Image
            src={pokemon.image}
            alt={pokemon.nom}
            width={140}
            height={140}
            className="drop-shadow-md transition-transform duration-300 group-hover:scale-110"
            priority={pokemon.id <= 12}
          />
        </div>

        <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500">
          {numero}
        </span>

        <h2 className="mb-2 text-lg font-extrabold capitalize text-gray-900 group-hover:text-pokedex transition-colors dark:text-white">
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
