"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GrillePokemons from "@/components/GrillePokemons";
import SqueletteGrille from "@/components/SqueletteGrille";
import { chargerPokemon } from "@/lib/pokeapi-client";
import { useFavoris } from "@/stores/favoris";
import type { Pokemon } from "@/types/pokemon";

export default function PageFavoris() {
  const noms = useFavoris((etat) => etat.noms);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [etat, setEtat] = useState<"chargement" | "pret" | "erreur">("chargement");

  useEffect(() => {
    let annule = false;

    if (noms.length === 0) {
      setPokemons([]);
      setEtat("pret");
      return;
    }

    setEtat("chargement");
    Promise.all(noms.map((nom) => chargerPokemon(nom)))
      .then((resultats) => {
        if (annule) return;
        setPokemons(resultats.filter((p): p is Pokemon => p !== null));
        setEtat("pret");
      })
      .catch(() => {
        if (!annule) setEtat("erreur");
      });

    return () => {
      annule = true;
    };
  }, [noms]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Mes Favoris
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {noms.length} Pokémon enregistré{noms.length > 1 ? "s" : ""}
        </p>
      </div>

      {etat === "chargement" && <SqueletteGrille count={Math.min(noms.length || 4, 12)} />}

      {etat === "erreur" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <p>Impossible de charger vos favoris pour le moment. Veuillez réessayer ultérieurement.</p>
        </div>
      )}

      {etat === "pret" && pokemons.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center dark:border-gray-800">
          <p className="text-4xl mb-3">⭐</p>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Aucun favori pour le moment
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
            Cliquez sur l’étoile sur la fiche ou la carte d’un Pokémon pour l’ajouter à vos favoris.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-pokedex px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Explorer le Pokédex
          </Link>
        </div>
      )}

      {etat === "pret" && pokemons.length > 0 && <GrillePokemons pokemons={pokemons} />}
    </div>
  );
}
