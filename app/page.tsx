import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import SqueletteGrille from "@/components/SqueletteGrille";
import {
  recupererNomsParType,
  recupererPlusieurs,
  recupererTousLesNoms,
} from "@/lib/pokeapi";

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
  }>;
};

export default async function Accueil({ searchParams }: Props) {
  const { q, type, page } = await searchParams;

  const pageCourante = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const parPage = 24;

  // Récupération des noms selon le type ou tous les noms
  let noms = type ? await recupererNomsParType(type) : await recupererTousLesNoms();

  // Filtrage par nom si un mot-clé est saisi
  if (q && q.trim()) {
    const terme = q.trim().toLowerCase();
    noms = noms.filter((nom) => nom.toLowerCase().includes(terme));
  }

  const total = noms.length;
  const debut = (pageCourante - 1) * parPage;
  const nomsPage = noms.slice(debut, debut + parPage);

  const pokemons = await recupererPlusieurs(nomsPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Tous les Pokémon
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} Pokémon répertorié{total > 1 ? "s" : ""}
            {type ? ` pour le type « ${type} »` : ""}
            {q ? ` contenant « ${q} »` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <BarreRecherche />
          <FiltreTypes />
        </div>
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
      />
    </div>
  );
}
