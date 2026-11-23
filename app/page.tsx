import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import SelecteurGeneration from "@/components/SelecteurGeneration";
import SqueletteGrille from "@/components/SqueletteGrille";
import { estDansGeneration, obtenirBornesGeneration } from "@/lib/generations";
import {
  recupererNomsParType,
  recupererPlusieurs,
  recupererTousLesNoms,
} from "@/lib/pokeapi";
import { correspondanceRecherche } from "@/lib/recherche-bilingue";

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
    gen?: string;
  }>;
};

export default async function Accueil({ searchParams }: Props) {
  const { q, type, page, gen } = await searchParams;

  const pageCourante = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const parPage = 24;

  // 1. Récupération des Pokémon selon le type ou tous les Pokémon
  let liste = type ? await recupererNomsParType(type) : await recupererTousLesNoms();

  // 2. Filtrage par génération / région
  if (gen && gen.trim()) {
    liste = liste.filter((p) => estDansGeneration(p.id, gen));
  }

  // 3. Filtrage bilingue (FR / EN)
  if (q && q.trim()) {
    liste = liste.filter((p) => correspondanceRecherche(p.nom, q));
  }

  const total = liste.length;
  const debut = (pageCourante - 1) * parPage;
  const pageActuelle = liste.slice(debut, debut + parPage);
  const nomsPage = pageActuelle.map((p) => p.nom);

  const pokemons = await recupererPlusieurs(nomsPage);

  // Libellé de la région sélectionnée
  const bornesGen = gen ? obtenirBornesGeneration(gen) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {gen ? `Pokédex · Région ${gen.charAt(0).toUpperCase() + gen.slice(1)}` : "Tous les Pokémon"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {total} Pokémon répertorié{total > 1 ? "s" : ""}
              {bornesGen ? ` (#${bornesGen.debut} à #${bornesGen.fin})` : ""}
              {type ? ` pour le type « ${type} »` : ""}
              {q ? ` contenant « ${q} »` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <BarreRecherche />
            <FiltreTypes />
          </div>
        </div>

        {/* Barre des Régions / Générations */}
        <SelecteurGeneration />
      </div>

      <Suspense fallback={<SqueletteGrille count={parPage} />}>
        <GrillePokemons pokemons={pokemons} />
      </Suspense>

      <Pagination
        pageCourante={pageCourante}
        totalElements={total}
        parPage={parPage}
        recherche={q}
        type={type}
        gen={gen}
      />
    </div>
  );
}
