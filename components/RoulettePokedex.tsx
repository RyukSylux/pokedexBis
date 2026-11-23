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
  jouerBruitageMolette,
} from "@/lib/roulette";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  pokemons: Pokemon[];
};

export default function RoulettePokedex({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const dernierTempsSon = useRef<number>(0);

  const total = pokemons.length;
  // S'assurer que l'index actif reste dans les bornes si la liste change (recherche, région)
  const indexSecurise = Math.max(0, Math.min(total - 1, indexActif));
  const pokemonActif = pokemons[indexSecurise] ?? pokemons[0];

  const declencherBruitage = useCallback(() => {
    const maintenant = Date.now();
    if (maintenant - dernierTempsSon.current > 60) {
      jouerBruitageMolette();
      dernierTempsSon.current = maintenant;
    }
  }, []);

  const changerIndex = useCallback(
    (direction: 1 | -1) => {
      setIndexActif((actuel) => {
        const nouvelIndex = prochainIndex(actuel, direction, total);
        if (nouvelIndex !== actuel) {
          declencherBruitage();
        }
        return nouvelIndex;
      });
    },
    [total, declencherBruitage]
  );

  const allerAIndex = useCallback(
    (nouvelIndex: number) => {
      const borne = Math.max(0, Math.min(total - 1, nouvelIndex));
      if (borne !== indexActif) {
        declencherBruitage();
        setIndexActif(borne);
      }
    },
    [total, indexActif, declencherBruitage]
  );

  // Contrôles au clavier (Flèches Haut/Bas, Page Up/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        changerIndex(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        changerIndex(1);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        setIndexActif((i) => Math.max(0, i - 10));
        declencherBruitage();
      } else if (e.key === "PageDown") {
        e.preventDefault();
        setIndexActif((i) => Math.min(total - 1, i + 10));
        declencherBruitage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changerIndex, total, declencherBruitage]);

  // Molette de souris sur le tambour
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 12) {
      changerIndex(1);
    } else if (e.deltaY < -12) {
      changerIndex(-1);
    }
  };

  // Glissement tactile mobile (swipe au pouce)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(deltaY) > 22) {
      changerIndex(deltaY > 0 ? 1 : -1);
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  if (!pokemonActif || total === 0) {
    return (
      <div className="py-16 text-center text-gray-500 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
        <p className="text-3xl mb-2">📡</p>
        <p className="font-bold text-base">Aucun Pokémon ne correspond à ces critères</p>
        <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou la recherche pour afficher la roulette.</p>
      </div>
    );
  }

  const indicesVisibles = obtenirIndicesVisibles(indexSecurise, total, 4);

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-6 rounded-3xl border border-gray-200/90 bg-white/95 p-3 sm:p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900/95 overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. ÉCRAN DE SCAN HOLOGRAPHIQUE (Gauche Desktop / Haut Mobile) */}
      {/* ======================================================== */}
      <div className="flex flex-col justify-between rounded-2xl border-2 border-red-500/30 bg-gradient-to-b from-red-50/60 via-white to-gray-50/40 p-4 sm:p-5 shadow-inner lg:col-span-6 dark:border-red-950/60 dark:from-red-950/30 dark:via-gray-900 dark:to-gray-950">
        
        {/* Bandeau d'état du scanner */}
        <div className="flex items-center justify-between border-b border-red-200/60 pb-2.5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex size-3.5 items-center justify-center rounded-full bg-red-600 animate-pulse shadow-sm shadow-red-500/80">
              <span className="size-1.5 rounded-full bg-white" />
            </span>
            <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-pokedex">
              Analyse Biologique Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BoutonSacocheRapide pokemon={pokemonActif} />
            <BoutonFavori nom={pokemonActif.nom} />
          </div>
        </div>

        {/* Illustration du Pokémon avec piédestal circulaire */}
        <div className="relative my-2 sm:my-4 flex items-center justify-center py-2 sm:py-4">
          {/* Halo d'énergie de scan */}
          <div className="absolute size-44 sm:size-56 rounded-full bg-gradient-to-tr from-red-500/15 via-amber-500/10 to-cyan-500/15 blur-2xl dark:from-red-600/25 dark:to-cyan-600/25 pointer-events-none" />
          
          {/* Piédestal holographique elliptique */}
          <div className="absolute bottom-2 size-36 sm:size-44 rounded-full border-2 border-red-400/40 bg-red-500/5 dark:border-red-500/30 dark:bg-red-950/20 [transform:rotateX(65deg)] pointer-events-none" />

          <Image
            src={pokemonActif.image}
            alt={pokemonActif.nomFr || pokemonActif.nom}
            width={190}
            height={190}
            className="relative drop-shadow-2xl transition-all duration-300 hover:scale-105 select-none"
            priority
          />
        </div>

        {/* Fiche d'identité biologique du Pokémon */}
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono text-xs font-black text-gray-400 dark:text-gray-500 tracking-wider">
                № {String(pokemonActif.id).padStart(3, "0")}
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-black capitalize text-gray-900 dark:text-white tracking-tight">
                  {pokemonActif.nomFr || pokemonActif.nom}
                </h3>
                {pokemonActif.nomFr &&
                  pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() && (
                    <span className="font-mono text-xs text-gray-400 capitalize">
                      ({pokemonActif.nom})
                    </span>
                  )}
              </div>
            </div>

            {pokemonActif.bst && (
              <div className="text-right">
                <span className="font-mono text-[10px] text-gray-400 uppercase">Puissance</span>
                <p className="font-mono text-base font-extrabold text-pokedex">
                  {pokemonActif.bst} <span className="text-[10px] text-gray-400">BST</span>
                </p>
              </div>
            )}
          </div>

          {pokemonActif.categorieFr && (
            <p className="font-bold text-xs text-red-600 dark:text-red-400">
              « {pokemonActif.categorieFr} »
            </p>
          )}

          {/* Badges de types */}
          <div className="flex flex-wrap gap-1.5">
            {pokemonActif.types.map((type) => (
              <BadgeType key={type} type={type} taille="sm" />
            ))}
          </div>

          {/* Données morphologiques (taille & poids) */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100/70 p-2 text-xs font-mono dark:bg-gray-800/60">
            <div>
              <span className="text-gray-400 text-[10px]">TAILLE : </span>
              <strong className="text-gray-800 dark:text-gray-200">
                {pokemonActif.taille} m
              </strong>
            </div>
            <div>
              <span className="text-gray-400 text-[10px]">POIDS : </span>
              <strong className="text-gray-800 dark:text-gray-200">
                {pokemonActif.poids} kg
              </strong>
            </div>
          </div>

          {/* Description officielle Pokédex */}
          {pokemonActif.descriptionFr && (
            <p className="rounded-xl border border-black/5 bg-white p-3 text-xs leading-relaxed text-gray-700 shadow-xs dark:border-white/5 dark:bg-gray-800 dark:text-gray-300 italic">
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 font-mono text-xs font-bold text-white shadow-xs hover:bg-pokedex transition active:scale-95 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-pokedex dark:hover:text-white"
            >
              <span>Fiche Complète</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. LE TAMBOUR CYLINDRIQUE 3D DU JEU (Droite Desktop / Bas Mobile) */}
      {/* ======================================================== */}
      <div className="flex flex-col justify-between rounded-2xl border-4 border-gray-900 bg-gradient-to-b from-gray-950 via-[#0d1117] to-gray-950 p-4 text-white shadow-2xl lg:col-span-6">
        
        {/* En-tête mécanique du barillet */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-red-400">
              Tambour Cylindrique Pokédex
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-gray-400">
            {indexSecurise + 1} / {total}
          </span>
        </div>

        {/* Le Barillet 3D avec perspective cylindrique */}
        <div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative my-3 flex h-96 flex-col items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing rounded-xl bg-radial from-gray-900 via-gray-950 to-black border border-gray-800/80 shadow-inner"
          style={{ perspective: "750px" }}
          title="Faites défiler à la souris, au doigt ou avec les flèches Haut/Bas"
        >
          {/* Ombrage haut et bas pour créer l'illusion de rotation cylindrique dans une fente */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

          {/* Viseur / Curseur central rouge rétro façon cartouche de jeu */}
          <div className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 h-16 rounded-2xl border-2 border-red-500 bg-red-600/20 shadow-lg shadow-red-500/30 z-10 flex items-center justify-between px-3">
            <span className="text-red-400 font-mono font-black text-sm animate-pulse">▶</span>
            <span className="text-red-400 font-mono font-black text-sm animate-pulse">◀</span>
          </div>

          {/* Les crans du cylindre */}
          <div className="relative z-10 w-full space-y-1.5 px-3">
            {indicesVisibles.map((i) => {
              const p = pokemons[i];
              if (!p) return null;
              const offset = i - indexSecurise;
              const { angleDeg, scale, opacite, estCentre } =
                calculerTransformationRoulette(offset);

              return (
                <div
                  key={p.id}
                  onClick={() => allerAIndex(i)}
                  style={{
                    transform: `perspective(750px) rotateX(${angleDeg}deg) scale(${scale})`,
                    opacity: opacite,
                    transformOrigin: "center center",
                  }}
                  className={`flex items-center justify-between gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 transition-all duration-150 cursor-pointer ${
                    estCentre
                      ? "bg-gradient-to-r from-red-600/40 via-red-600/60 to-red-600/40 text-white font-black shadow-md border-y border-red-400/60"
                      : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {/* Miniature Pokéball officielle + Numéro */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border shadow-xs ${
                        estCentre
                          ? "border-red-400 bg-red-500 shadow-red-500/60 scale-110"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-white" />
                    </span>

                    <span className="font-mono text-xs font-bold text-gray-300">
                      № {String(p.id).padStart(3, "0")}
                    </span>

                    <span className="truncate text-sm sm:text-base capitalize tracking-tight font-extrabold">
                      {p.nomFr || p.nom}
                    </span>
                  </div>

                  {/* Badges de types abrégés */}
                  <div className="flex items-center gap-1 shrink-0">
                    {p.types.map((type) => (
                      <span
                        key={type}
                        className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          estCentre
                            ? "bg-red-950/80 text-red-200 border border-red-500/40"
                            : "bg-gray-800 text-gray-400"
                        }`}
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

        {/* Barre de navigation rapide / Scrubber de position */}
        <div className="space-y-2 pt-2 border-t-2 border-gray-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-gray-400">№ 001</span>
            <input
              type="range"
              min={0}
              max={total - 1}
              value={indexSecurise}
              onChange={(e) => allerAIndex(parseInt(e.target.value, 10))}
              aria-label="Navigation rapide sur la roulette"
              className="w-full accent-red-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[10px] text-gray-400">№ {total}</span>
          </div>

          {/* Boutons mécaniques physiques de rotation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              disabled={indexSecurise === 0}
              title="Tourner vers le haut (Flèche Haut)"
              className="flex items-center gap-1.5 rounded-xl bg-gray-800 px-4 py-2 font-mono text-xs font-bold text-gray-200 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm border border-gray-700"
            >
              <span>▲</span>
              <span>Précédent</span>
            </button>

            <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
              Faites glisser au pouce ou molette
            </span>

            <button
              type="button"
              onClick={() => changerIndex(1)}
              disabled={indexSecurise === total - 1}
              title="Tourner vers le bas (Flèche Bas)"
              className="flex items-center gap-1.5 rounded-xl bg-gray-800 px-4 py-2 font-mono text-xs font-bold text-gray-200 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm border border-gray-700"
            >
              <span>Suivant</span>
              <span>▼</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
