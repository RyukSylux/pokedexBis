import Link from "next/link";
import Image from "next/image";
import type { Pokemon } from "@/types/pokemon";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";

export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const numero = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <article className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-gray-900">
      {/* Bouton favori isolé du lien pour respecter l'accessibilité */}
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
            className="drop-shadow-md transition-transform duration-200 group-hover:scale-105"
            priority={pokemon.id <= 12}
          />
        </div>

        <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500">
          {numero}
        </span>

        <h2 className="mb-2 text-lg font-bold capitalize text-gray-900 group-hover:text-pokedex dark:text-white">
          {pokemon.nom}
        </h2>

        <div className="flex flex-wrap justify-center gap-1.5">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
      </Link>
    </article>
  );
}
