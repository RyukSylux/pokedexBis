import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import FriseEvolution from "@/components/FriseEvolution";
import LecteurCri from "@/components/LecteurCri";
import TableauFaiblesses from "@/components/TableauFaiblesses";
import VisuelPokemon from "@/components/VisuelPokemon";
import {
  recupererDetailsEspece,
  recupererEtapesEvolution,
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

  const [detailsEspece, etapesEvolution] = await Promise.all([
    recupererDetailsEspece(pokemon.id),
    recupererEtapesEvolution(pokemon.id),
  ]);

  const nomFr = detailsEspece.nomFr;
  const categorieFr = detailsEspece.categorieFr;
  const descriptionFr = detailsEspece.descriptionFr;

  const nomsEvolutions = etapesEvolution.map((e) => e.nom);
  const pokemonsEvolution = await recupererPlusieurs(nomsEvolutions);

  const numero = `#${String(pokemon.id).padStart(3, "0")}`;

  // Classification du BST
  const bstLabel =
    pokemon.bst >= 600
      ? "Légendaire / Semi-légendaire"
      : pokemon.bst >= 500
      ? "Très puissant"
      : pokemon.bst >= 400
      ? "Intermédiaire"
      : "Base";

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
        {/* Colonne gauche : Visuel Normal / Shiny + Cri audio */}
        <div className="flex flex-col items-center justify-between gap-4">
          <VisuelPokemon
            nom={pokemon.nom}
            imageNormal={pokemon.image}
            imageShiny={pokemon.imageShiny}
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <LecteurCri
              urlAudio={pokemon.criAudio}
              nomPokemon={nomFr || pokemon.nom}
            />
            {pokemon.talents && pokemon.talents.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Talents :{" "}
                <strong className="capitalize text-gray-700 dark:text-gray-200">
                  {pokemon.talents.join(", ")}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Colonne droite : Identité, Description, Stats & Faiblesses */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-extrabold text-gray-400 dark:text-gray-500">
                {numero}
              </span>
              <BoutonFavori nom={pokemon.nom} />
            </div>

            <div className="mt-1">
              <h1 className="text-3xl font-extrabold capitalize text-gray-900 sm:text-4xl dark:text-white">
                {pokemon.nom}{" "}
                {nomFr && nomFr.toLowerCase() !== pokemon.nom.toLowerCase() && (
                  <span className="text-xl font-normal text-gray-400 dark:text-gray-500">
                    ({nomFr})
                  </span>
                )}
              </h1>
              {categorieFr && (
                <p className="mt-0.5 font-medium text-sm text-red-600 dark:text-red-400">
                  {categorieFr}
                </p>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <BadgeType key={type} type={type} />
              ))}
            </div>

            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-white">
                {pokemon.taille} m
              </span>{" "}
              ·{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {pokemon.poids} kg
              </span>
            </p>

            {/* Description Pokédex officielle en français */}
            {descriptionFr && (
              <div className="mt-4 rounded-xl border border-red-950/10 bg-red-50/50 p-3.5 text-sm italic text-gray-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-gray-200">
                « {descriptionFr} »
              </div>
            )}
          </div>

          {/* Tableau des Statistiques de base avec BST */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Statistiques de base
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-gray-900 dark:text-white">
                  Total : {pokemon.bst}
                </span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {bstLabel}
                </span>
              </div>
            </div>
            <BarresStats stats={pokemon.stats} />
          </div>

          {/* Tableau des sensibilités et résistances de types */}
          <div>
            <TableauFaiblesses types={pokemon.types} />
          </div>

          <div className="pt-2">
            <BoutonSacoche pokemon={pokemon} />
          </div>
        </div>
      </div>

      {etapesEvolution.length > 1 && (
        <FriseEvolution
          pokemonActuel={pokemon.nom}
          etapes={etapesEvolution}
          pokemonsData={pokemonsEvolution}
        />
      )}
    </article>
  );
}
