import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import GrillePokemons from "@/components/GrillePokemons";
import {
  recupererEvolutions,
  recupererNomFrancais,
  recupererPlusieurs,
  recupererPokemon,
} from "@/lib/pokeapi";

type Props = {
  params: Promise<{
    nom: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  if (!pokemon) return { title: "Pokémon introuvable" };

  const nomCap = pokemon.nom.charAt(0).toUpperCase() + pokemon.nom.slice(1);
  return {
    title: nomCap,
    description: `Fiche détaillée de ${nomCap} : types, statistiques et chaîne d'évolution.`,
  };
}

export default async function PagePokemon({ params }: Props) {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);

  if (!pokemon) {
    notFound();
  }

  const [nomFr, evolutionsNoms] = await Promise.all([
    recupererNomFrancais(pokemon.id),
    recupererEvolutions(pokemon.id),
  ]);

  const evolutions = await recupererPlusieurs(evolutionsNoms);

  const numero = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-pokedex dark:text-gray-400 dark:hover:text-pokedex"
        >
          ← Retour à la liste
        </Link>
      </div>

      <div className="grid gap-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10 dark:border-white/10 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 p-6 dark:from-gray-800/50 dark:to-gray-800/20">
          <Image
            src={pokemon.image}
            alt={pokemon.nom}
            width={340}
            height={340}
            priority
            className="drop-shadow-2xl transition hover:scale-105 duration-300"
          />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-extrabold text-gray-400 dark:text-gray-500">
                {numero}
              </span>
              <BoutonFavori nom={pokemon.nom} />
            </div>

            <h1 className="mt-1 text-3xl font-extrabold capitalize text-gray-900 sm:text-4xl dark:text-white">
              {pokemon.nom}{" "}
              {nomFr && nomFr.toLowerCase() !== pokemon.nom.toLowerCase() && (
                <span className="text-xl font-normal text-gray-400 dark:text-gray-500">
                  ({nomFr})
                </span>
              )}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <BadgeType key={type} type={type} />
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-white">{pokemon.taille} m</span>{" "}
              ·{" "}
              <span className="font-bold text-gray-900 dark:text-white">{pokemon.poids} kg</span>
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Statistiques de base
            </h2>
            <BarresStats stats={pokemon.stats} />
          </div>

          <div className="pt-2">
            <BoutonSacoche pokemon={pokemon} />
          </div>
        </div>
      </div>

      {evolutions.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Chaîne d&apos;évolution
          </h2>
          <GrillePokemons pokemons={evolutions} />
        </section>
      )}
    </article>
  );
}
