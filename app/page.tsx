import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import BasculeVue from "@/components/BasculeVue";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import NavigateurPokedex from "@/components/modes/NavigateurPokedex";
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
    <div className="space-y-4">
      {/* BARRE DE CONTRÔLE COMPACTE POKÉDEX SINNOH */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-300 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-mono text-sm font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {gen ? `POKÉDEX · RÉGION ${gen.toUpperCase()}` : "POKÉDEX NATIONAL"}
          </h1>
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            · {total} Pokémon{total > 1 ? "s" : ""}
            {bornesGen ? ` (#${bornesGen.debut} à #${bornesGen.fin})` : ""}
            {type ? ` [${type}]` : ""}
          </span>
        </div>

        {/* Commandes compactes sur une seule ligne */}
        <div className="flex flex-wrap items-center gap-2">
          <BarreRecherche />
          <SelecteurGeneration />
          <FiltreTypes />
          <BasculeVue />
        </div>
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
