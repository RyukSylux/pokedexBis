import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import BasculeVue from "@/components/BasculeVue";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import NavigateurPokedex from "@/components/modes/NavigateurPokedex";
import SelecteurModelePokedex from "@/components/selecteur/SelecteurModelePokedex";
import SelecteurGeneration from "@/components/SelecteurGeneration";
import SqueletteGrille from "@/components/SqueletteGrille";
import { estDansGeneration, obtenirBornesGeneration } from "@/lib/generations";
import { obtenirTousLesPokemonsComplets } from "@/lib/donnees-francaises";
import { correspondanceRecherche, normaliserTexte } from "@/lib/recherche-bilingue";

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
    gen?: string;
    vue?: string;
  }>;
};

export default async function Accueil({ searchParams }: Props) {
  const { q, type, page, gen, vue } = await searchParams;

  const estModeGrille = vue === "grille";
  const pageCourante = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const parPage = 24;

  // Récupération instantanée de tous les Pokémon complets intégrés
  let liste = obtenirTousLesPokemonsComplets();

  // Filtrage par type
  if (type) {
    liste = liste.filter((p) => p.types.includes(type.toLowerCase()));
  }

  // Filtrage par génération / région
  if (gen && gen.trim()) {
    liste = liste.filter((p) => estDansGeneration(p.id, gen));
  }

  // Filtrage bilingue (FR / EN ou ID)
  if (q && q.trim()) {
    liste = liste.filter((p) => {
      if (String(p.id) === q.trim()) return true;
      if (p.nomFr && normaliserTexte(p.nomFr).includes(normaliserTexte(q))) return true;
      return (
        normaliserTexte(p.nom).includes(normaliserTexte(q)) ||
        correspondanceRecherche(p.nom, q)
      );
    });
  }

  const total = liste.length;

  // Découpage par page uniquement pour le mode grille
  const debut = (pageCourante - 1) * parPage;
  const pokemonsGrille = liste.slice(debut, debut + parPage);

  // Libellé de la région sélectionnée
  const bornesGen = gen ? obtenirBornesGeneration(gen) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-pokedex">
                {!estModeGrille
                  ? "Pokédex Rétro · Molette 3D"
                  : "Pokédex · Vue Grille Matricielle"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {gen ? `Pokédex · Région ${gen.charAt(0).toUpperCase() + gen.slice(1)}` : "Tous les Pokémon"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              {total} Pokémon répertorié{total > 1 ? "s" : ""}
              {bornesGen ? ` (#${bornesGen.debut} à #${bornesGen.fin})` : ""}
              {type ? ` pour le type « ${type} »` : ""}
              {q ? ` contenant « ${q} »` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SelecteurModelePokedex />
            <BasculeVue />
            <BarreRecherche />
            <FiltreTypes />
          </div>
        </div>

        {/* Barre des Régions / Générations */}
        <SelecteurGeneration />
      </div>

      {estModeGrille ? (
        <>
          <Suspense fallback={<SqueletteGrille count={parPage} />}>
            <GrillePokemons pokemons={pokemonsGrille} />
          </Suspense>

          <Pagination
            pageCourante={pageCourante}
            totalElements={total}
            parPage={parPage}
            recherche={q}
            type={type}
            gen={gen}
            vue={vue}
          />
        </>
      ) : (
        <NavigateurPokedex pokemons={liste} />
      )}
    </div>
  );
}
