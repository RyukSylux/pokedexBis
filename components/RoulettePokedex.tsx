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
  const rouletteRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const dernierTempsSon = useRef<number>(0);

  const total = pokemons.length;
  const indexSecurise = Math.max(0, Math.min(total - 1, indexActif));
  const pokemonActif = pokemons[indexSecurise] ?? pokemons[0];

  const declencherBruitage = useCallback(() => {
    const maintenant = Date.now();
    if (maintenant - dernierTempsSon.current > 55) {
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

  // Traitement non-passif de la molette pour piéger le scroll uniquement dans la roulette
  useEffect(() => {
    const conteneur = rouletteRef.current;
    if (!conteneur) return;

    const handleWheelCapture = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 10) {
        changerIndex(1);
      } else if (e.deltaY < -10) {
        changerIndex(-1);
      }
    };

    conteneur.addEventListener("wheel", handleWheelCapture, { passive: false });
    return () => {
      conteneur.removeEventListener("wheel", handleWheelCapture);
    };
  }, [changerIndex]);

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

  // Glissement tactile mobile (swipe au pouce)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(deltaY) > 20) {
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

  // Angle de rotation de la roue mécanique physique
  const angleRoueMecanique = (indexSecurise * 30) % 360;

  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* ======================================================== */}
      {/* 1. FICHE HOLOGRAPHIQUE ÉLÉGANTE DU POKÉMON SÉLECTIONNÉ */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-50/70 via-white to-red-50/40 p-4 sm:p-6 shadow-md dark:border-red-950/50 dark:from-red-950/30 dark:via-gray-900 dark:to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Bloc Visuel Pokémon avec Piédestal */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative flex size-28 sm:size-36 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-red-50 p-2 shadow-inner dark:from-gray-800/80 dark:to-gray-900">
              <div className="absolute size-24 rounded-full bg-red-500/10 blur-lg dark:bg-red-500/20" />
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={130}
                height={130}
                className="relative drop-shadow-xl transition-all duration-300 hover:scale-110 select-none"
                priority
              />
            </div>

            {/* Identité biologique */}
            <div className="space-y-1.5 min-w-0">
              <span className="font-mono text-xs font-black text-gray-400 dark:text-gray-500 tracking-wider">
                № {String(pokemonActif.id).padStart(3, "0")}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl sm:text-3xl font-black capitalize text-gray-900 dark:text-white tracking-tight">
                  {pokemonActif.nomFr || pokemonActif.nom}
                </h2>
                {pokemonActif.nomFr &&
                  pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() && (
                    <span className="font-mono text-xs text-gray-400 capitalize">
                      ({pokemonActif.nom})
                    </span>
                  )}
              </div>

              {pokemonActif.categorieFr && (
                <p className="font-bold text-xs text-red-600 dark:text-red-400">
                  « {pokemonActif.categorieFr} »
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {pokemonActif.types.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Description & Contrôles Rapides */}
          <div className="flex flex-col justify-between gap-3 md:max-w-md w-full">
            {pokemonActif.descriptionFr && (
              <p className="rounded-2xl border border-black/5 bg-white/90 p-3 text-xs leading-relaxed text-gray-700 shadow-xs dark:border-white/5 dark:bg-gray-800/80 dark:text-gray-300 italic">
                « {pokemonActif.descriptionFr} »
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <LecteurCri
                  urlAudio={pokemonActif.criAudio}
                  nomPokemon={pokemonActif.nomFr || pokemonActif.nom}
                />
                <BoutonSacocheRapide pokemon={pokemonActif} />
                <BoutonFavori nom={pokemonActif.nom} />
              </div>

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
      </div>

      {/* ======================================================== */}
      {/* 2. LA ROULETTE EN PLEINE LARGEUR DU POKÉDEX AVEC ROUE 3D */}
      {/* ======================================================== */}
      <div
        ref={rouletteRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ overscrollBehavior: "contain" }}
        className="relative w-full rounded-3xl border-4 border-gray-900 bg-gradient-to-b from-gray-950 via-[#0a0f18] to-gray-950 p-3 sm:p-5 text-white shadow-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        {/* Ombrage haut et bas pour l'effet de rouleau cylindrique infini */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

        {/* L'AGENCEMENT CENTRAL : ROUE MÉCANIQUE À GAUCHE + CRANS EN PLEINE LARGEUR */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-6 my-2 min-h-80">
          
          {/* LA ROUE DU POKÉDEX QUI TOURNE VISIBLEMENT AU SCROLL */}
          <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-24">
            <div className="relative size-20 flex items-center justify-center">
              {/* Roue dentée crantée animée en rotation */}
              <div
                style={{
                  transform: `rotate(${angleRoueMecanique}deg)`,
                  transition: "transform 150ms cubic-bezier(0.2, 0.8, 0.4, 1)",
                }}
                className="relative size-full rounded-full border-4 border-red-600 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg shadow-red-950/80 flex items-center justify-center"
              >
                {/* Dents et crans de la roulette */}
                {Array.from({ length: 8 }, (_, idx) => (
                  <span
                    key={idx}
                    style={{ transform: `rotate(${idx * 45}deg)` }}
                    className="absolute inset-y-1 w-1 bg-red-400/80 rounded-full"
                  />
                ))}
                {/* Moyeu central chromé */}
                <span className="relative size-7 rounded-full border-2 border-white/80 bg-red-600 shadow-sm flex items-center justify-center">
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>
            </div>
            <span className="mt-2 font-mono text-[9px] font-black uppercase text-red-400 tracking-wider">
              ROULETTE
            </span>
          </div>

          {/* Viseur / Curseur central rouge rétro */}
          <div className="pointer-events-none absolute inset-x-0 sm:left-28 top-1/2 -translate-y-1/2 h-16 rounded-2xl border-2 border-red-500 bg-red-600/25 shadow-xl shadow-red-500/30 z-10 flex items-center justify-between px-3">
            <span className="text-red-400 font-mono font-black text-base animate-pulse">▶</span>
            <span className="text-red-400 font-mono font-black text-base animate-pulse">◀</span>
          </div>

          {/* Les crans de la roulette qui défilent en 3D sur toute la longueur */}
          <div
            className="flex-1 w-full space-y-2 py-2"
            style={{ perspective: "750px" }}
          >
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
                  className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-all duration-150 cursor-pointer ${
                    estCentre
                      ? "bg-gradient-to-r from-red-600/40 via-red-600/60 to-red-600/40 text-white font-black shadow-lg border-y border-red-400/60"
                      : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {/* Côté gauche : Pokéball + Numéro + Nom en grand */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border shadow-xs ${
                        estCentre
                          ? "border-red-400 bg-red-500 shadow-red-500/80 scale-110"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-white" />
                    </span>

                    <span className="font-mono text-xs sm:text-sm font-bold text-gray-300">
                      № {String(p.id).padStart(3, "0")}
                    </span>

                    <span className="truncate text-base sm:text-lg capitalize tracking-tight font-black">
                      {p.nomFr || p.nom}
                    </span>
                  </div>

                  {/* Côté droit : Miniature du Pokémon + Badges de types */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      {p.types.map((type) => (
                        <span
                          key={type}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            estCentre
                              ? "bg-red-950/90 text-red-200 border border-red-500/50"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="relative size-8 shrink-0">
                      <Image
                        src={p.image}
                        alt={p.nom}
                        width={32}
                        height={32}
                        className="drop-shadow select-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barre de contrôle inférieure : Scrubber + Boutons tactiles */}
        <div className="relative z-20 space-y-2 pt-3 border-t-2 border-gray-800/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-gray-400 shrink-0">№ 001</span>
            <input
              type="range"
              min={0}
              max={total - 1}
              value={indexSecurise}
              onChange={(e) => allerAIndex(parseInt(e.target.value, 10))}
              aria-label="Navigation rapide sur la roulette"
              className="w-full accent-red-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[10px] text-gray-400 shrink-0">№ {total}</span>
          </div>

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

            <span className="text-[11px] font-mono text-gray-400">
              {indexSecurise + 1} / {total} · Molette / Swipe / Clavier ↑ ↓
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
