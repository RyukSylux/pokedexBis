import Image from "next/image";
import Link from "next/link";
import BadgeType from "./BadgeType";
import type { Pokemon } from "@/types/pokemon";
import type { EtapeEvolutionParsed } from "@/lib/evolution";

type Props = {
  pokemonActuel: string;
  etapes: EtapeEvolutionParsed[];
  pokemonsData: Pokemon[];
};

export default function FriseEvolution({
  pokemonActuel,
  etapes,
  pokemonsData,
}: Props) {
  if (etapes.length <= 1) return null;

  const mapPokemons = new Map(pokemonsData.map((p) => [p.nom.toLowerCase(), p]));

  return (
    <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <span>🧬</span>
          <span>Chaîne d&apos;évolution</span>
        </h2>
        <span className="text-xs text-gray-400 font-mono">
          {etapes.length} stade{etapes.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2">
        {etapes.map((etape, index) => {
          const pokemon = mapPokemons.get(etape.nom.toLowerCase());
          const estActuel = etape.nom.toLowerCase() === pokemonActuel.toLowerCase();

          return (
            <div key={etape.nom} className="flex items-center gap-3 sm:gap-6">
              {/* Flèche avec condition vers cette étape (si pas la première) */}
              {index > 0 && (
                <div className="flex flex-col items-center justify-center px-1">
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700 shadow-xs dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-900/60 whitespace-nowrap">
                    {etape.condition || "Évolution"}
                  </span>
                  <span className="text-xl text-gray-400 font-extrabold sm:block">
                    ➔
                  </span>
                </div>
              )}

              {/* Carte du Pokémon dans la frise */}
              <Link
                href={`/pokemon/${etape.nom}`}
                className={`group flex flex-col items-center rounded-2xl p-3 sm:p-4 transition duration-200 border ${
                  estActuel
                    ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 shadow-md ring-2 ring-red-500/20"
                    : "border-gray-100 bg-gray-50/80 hover:border-gray-300 hover:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                }`}
              >
                {pokemon ? (
                  <>
                    <div className="relative size-24 sm:size-28 flex items-center justify-center">
                      <Image
                        src={pokemon.image}
                        alt={pokemon.nom}
                        width={112}
                        height={112}
                        className="drop-shadow-md transition duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="mt-2 font-mono text-[11px] font-bold text-gray-400">
                      #{String(pokemon.id).padStart(3, "0")}
                    </span>
                    <span className="text-sm font-bold capitalize text-gray-900 dark:text-white">
                      {pokemon.nom}
                    </span>
                    <div className="mt-1.5 flex gap-1">
                      {pokemon.types.map((type) => (
                        <BadgeType key={type} type={type} taille="sm" />
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-sm font-bold capitalize text-gray-900 dark:text-white">
                    {etape.nom}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
