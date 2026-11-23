import { Suspense } from "react";
import BarreControlesPokedex from "@/components/BarreControlesPokedex";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import NavigateurPokedex from "@/components/modes/NavigateurPokedex";
import SqueletteGrille from "@/components/SqueletteGrille";
import { estDansGeneration } from "@/lib/generations";
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
  return (
    <div className="space-y-3.5">
      {/* BARRE TACTILE SINNOH SANS AUCUNE COMBO-BOX */}
      <BarreControlesPokedex total={total} />

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
