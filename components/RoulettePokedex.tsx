"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";
import BoutonSacocheRapide from "./BoutonSacocheRapide";
import LecteurCri from "./LecteurCri";
import {
  calculerTransformationRoulette,
  prochainIndex,
  obtenirIndicesVisibles,
} from "@/lib/roulette";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  pokemons: Pokemon[];
};

export default function RoulettePokedex({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const total = pokemons.length;
  const pokemonActif = pokemons[indexActif] ?? pokemons[0];

  // Gestion des touches du clavier pour faire tourner la roulette
  const changerIndex = useCallback(
    (direction: 1 | -1) => {
      setIndexActif((actuel) => prochainIndex(actuel, direction, total));
    },
    [total]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        changerIndex(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        changerIndex(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changerIndex]);

  // Gestion du défilement à la molette de la souris
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 15) {
      changerIndex(1);
    } else if (e.deltaY < -15) {
      changerIndex(-1);
    }
  };

  // Gestion du glissement tactile (swipe) sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(deltaY) > 28) {
      changerIndex(deltaY > 0 ? 1 : -1);
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  if (!pokemonActif || total === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>Aucun Pokémon à afficher dans la roulette.</p>
      </div>
    );
  }

  const indicesVisibles = obtenirIndicesVisibles(indexActif, total, 4);

  return (
    <div className="relative flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 rounded-3xl border border-gray-200/80 bg-white/95 p-4 sm:p-6 shadow-md dark:border-gray-800 dark:bg-gray-900/90">
      
      {/* 1. VOLET GAUCHE : ÉCRAN DE SCAN HOLOGRAPHIQUE DU POKÉMON ACTIF */}
      <div className="flex flex-col justify-between rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-50/50 via-white to-white p-5 shadow-inner lg:col-span-6 dark:border-red-950/40 dark:from-red-950/20 dark:via-gray-900 dark:to-gray-900">
        {/* En-tête du volet de scan */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex size-3 items-center justify-center rounded-full bg-red-600 animate-pulse">
              <span className="size-1 rounded-full bg-white" />
            </span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-pokedex">
              Analyse Biologique
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BoutonSacocheRapide pokemon={pokemonActif} />
            <BoutonFavori nom={pokemonActif.nom} />
          </div>
        </div>

        {/* Illustration du Pokémon avec halo circulaire */}
        <div className="relative my-4 flex items-center justify-center py-4">
          <div className="absolute size-44 sm:size-52 rounded-full bg-gradient-to-tr from-red-500/10 via-amber-500/5 to-cyan-500/10 blur-xl dark:from-red-600/20 dark:to-cyan-600/20" />
          <Image
            src={pokemonActif.image}
            alt={pokemonActif.nomFr || pokemonActif.nom}
            width={180}
            height={180}
            className="relative drop-shadow-xl transition-all duration-300 hover:scale-110"
            priority
          />
        </div>

        {/* Données d'identité du Pokémon */}
        <div className="space-y-3">
          <div>
            <span className="font-mono text-xs font-extrabold text-gray-400 dark:text-gray-500">
              #{String(pokemonActif.id).padStart(3, "0")}
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black capitalize text-gray-900 dark:text-white">
                {pokemonActif.nomFr || pokemonActif.nom}
              </h3>
              {pokemonActif.nomFr &&
                pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() && (
                  <span className="font-mono text-xs text-gray-400 capitalize">
                    ({pokemonActif.nom})
                  </span>
                )}
            </div>
            {pokemonActif.categorieFr && (
              <p className="font-medium text-xs text-red-600 dark:text-red-400">
                {pokemonActif.categorieFr}
              </p>
            )}
          </div>

          {/* Badges de types */}
          <div className="flex flex-wrap gap-1.5">
            {pokemonActif.types.map((type) => (
              <BadgeType key={type} type={type} taille="sm" />
            ))}
          </div>

          {/* Description Pokédex */}
          {pokemonActif.descriptionFr && (
            <p className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 italic">
              « {pokemonActif.descriptionFr} »
            </p>
          )}

          {/* Cri audio et lien vers fiche complète */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <LecteurCri
              urlAudio={pokemonActif.criAudio}
              nomPokemon={pokemonActif.nomFr || pokemonActif.nom}
            />

            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 font-mono text-xs font-bold text-white shadow-xs hover:bg-pokedex transition active:scale-95 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-pokedex dark:hover:text-white"
            >
              <span>Fiche Complète</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. VOLET DROIT : LA ROULETTE CYLINDRIQUE 3D RÉTRO */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-950 p-4 text-white shadow-2xl lg:col-span-6 dark:border-gray-800">
        {/* En-tête de la roulette */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🎡</span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-red-400">
              Roulette Pokédex 3D
            </span>
          </div>
          <span className="font-mono text-xs text-gray-400">
            {indexActif + 1} / {total}
          </span>
        </div>

        {/* Cylindre de défilement 3D */}
        <div
          ref={conteneurRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative my-2 flex h-80 flex-col items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ perspective: "650px" }}
        >
          {/* Viseur central rouge rétro */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 rounded-2xl border-2 border-red-500/80 bg-red-600/15 shadow-lg shadow-red-500/20 z-0" />

          {/* Liste des entrées de la roulette */}
          <div className="relative z-10 w-full space-y-1">
            {indicesVisibles.map((i) => {
              const p = pokemons[i];
              if (!p) return null;
              const offset = i - indexActif;
              const { angleDeg, scale, opacite, estCentre } =
                calculerTransformationRoulette(offset);

              return (
                <div
                  key={p.id}
                  onClick={() => setIndexActif(i)}
                  style={{
                    transform: `perspective(650px) rotateX(${angleDeg}deg) scale(${scale})`,
                    opacity: opacite,
                    transformOrigin: "center center",
                  }}
                  className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2 transition-all duration-150 cursor-pointer ${
                    estCentre
                      ? "bg-red-600/30 text-white font-extrabold shadow-md scale-100"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {/* Miniature Pokéball + Numéro */}
                  <div className="flex items-center gap-2.5">
                    {/* Icône Pokéball rétro */}
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${
                        estCentre
                          ? "border-red-400 bg-red-500 shadow-xs"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    >
                      <span className="size-1 rounded-full bg-white" />
                    </span>

                    <span className="font-mono text-xs text-gray-400">
                      #{String(p.id).padStart(3, "0")}
                    </span>

                    <span className="truncate text-sm capitalize">
                      {p.nomFr || p.nom}
                    </span>
                  </div>

                  {/* Types ou miniature */}
                  <div className="flex items-center gap-1.5">
                    {p.types.map((type) => (
                      <span
                        key={type}
                        className="rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-gray-800 text-gray-300"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Boutons de contrôle physiques de la roulette */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-3">
          <button
            type="button"
            onClick={() => changerIndex(-1)}
            disabled={indexActif === 0}
            title="Précédent (Flèche Haut)"
            className="flex items-center gap-1 rounded-xl bg-gray-800 px-3.5 py-1.5 font-mono text-xs font-bold text-gray-200 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <span>▲</span>
            <span>Précédent</span>
          </button>

          <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
            Molette / Swipe / Clavier ↑ ↓
          </span>

          <button
            type="button"
            onClick={() => changerIndex(1)}
            disabled={indexActif === total - 1}
            title="Suivant (Flèche Bas)"
            className="flex items-center gap-1 rounded-xl bg-gray-800 px-3.5 py-1.5 font-mono text-xs font-bold text-gray-200 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <span>Suivant</span>
            <span>▼</span>
          </button>
        </div>
      </div>
    </div>
  );
}
