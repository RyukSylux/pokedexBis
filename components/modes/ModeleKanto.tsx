"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import BoutonSacocheRapide from "@/components/BoutonSacocheRapide";
import LecteurCri from "@/components/LecteurCri";
import { Pokemon } from "@/types/pokemon";
import { prochainIndex, jouerBruitageMolette } from "@/lib/roulette";

type Props = {
  pokemons: Pokemon[];
};

export default function ModeleKanto({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  const pokemonActif = pokemons[indexActif] ?? pokemons[0];
  const total = pokemons.length;

  const changerIndex = useCallback(
    (direction: 1 | -1) => {
      setIndexActif((actuel) => {
        const suivant = prochainIndex(actuel, direction, total);
        if (suivant !== actuel) {
          jouerBruitageMolette();
        }
        return suivant;
      });
    },
    [total]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dernierScroll = 0;
    const gererMolette = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const maintenant = Date.now();
      if (maintenant - dernierScroll < 65) return;
      dernierScroll = maintenant;

      if (e.deltaY > 0) changerIndex(1);
      else if (e.deltaY < 0) changerIndex(-1);
    };

    el.addEventListener("wheel", gererMolette, { passive: false });
    return () => el.removeEventListener("wheel", gererMolette);
  }, [changerIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(diff) > 35) {
      if (diff < 0) changerIndex(1);
      else changerIndex(-1);
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const onTouchEnd = () => {
    touchStartYRef.current = null;
  };

  if (!pokemonActif) {
    return (
      <div className="py-12 text-center text-red-200/80 font-mono">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* BANDEAU CLAPET RÉTRO AVEC CAPTEUR BLEU GÉANT DE DEXTER */}
      <div className="flex items-center justify-between border-b-4 border-red-950 bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-4 py-2.5 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3">
          {/* Œil de bœuf bleu rétro */}
          <div className="relative size-10 rounded-full border-2 border-white bg-blue-500 shadow-md flex items-center justify-center animate-pulse">
            <span className="size-3 rounded-full bg-white/80" />
          </div>
          {/* Trio de LED */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400 border border-black/40 shadow-xs" />
            <span className="size-2.5 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
            <span className="size-2.5 rounded-full bg-emerald-400 border border-black/40 shadow-xs" />
          </div>
        </div>

        <div className="font-mono text-xs font-black tracking-wider text-white">
          DEXTER · POKÉDEX KANTO ORIGINAL
        </div>

        <div className="font-mono text-xs font-bold text-amber-300">
          N° {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DISPOSITION EN 2 VOLETS (ÉCRAN LCD VERT + CONSOLE DE COMMANDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* VOLET 1 : ÉCRAN LCD RÉTRO STYLE GAME BOY (GAUCHE) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-4 border-gray-900 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 p-4 sm:p-5 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Écran d'analyse LCD avec scanlines vertes */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border-4 border-gray-800 bg-emerald-950/40 p-2 shadow-inner">
              <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] font-black text-emerald-400">
                KANTO #{String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(16,185,129,0.3)]"
              />
            </div>

            {/* Fiche d'identification Dexter */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight font-mono">
                    {pokemonActif.nomFr || pokemonActif.nom}
                  </h2>
                  <BoutonSacocheRapide pokemon={pokemonActif} />
                </div>

                {pokemonActif.categorieFr && (
                  <p className="font-mono text-xs font-bold text-amber-300">
                    {pokemonActif.categorieFr}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {pokemonActif.types.map((type) => (
                    <BadgeType key={type} type={type} />
                  ))}
                </div>
              </div>

              {/* Spécifications physiques */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/60 border border-emerald-500/30 p-2 font-mono text-xs text-emerald-200">
                <div>
                  <span className="text-gray-400">TAILLE :</span>{" "}
                  <strong>{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">POIDS :</span>{" "}
                  <strong>{pokemonActif.poids} kg</strong>
                </div>
              </div>

              {/* Cri audio */}
              {pokemonActif.criAudio && (
                <div className="mt-2">
                  <LecteurCri
                    urlAudio={pokemonActif.criAudio}
                    nomPokemon={pokemonActif.nomFr || pokemonActif.nom}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Synthèse vocale Dexter Lore */}
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              SYNTHÈSE VOCALE DEXTER :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 leading-relaxed font-mono">
              « {pokemonActif.descriptionFr || "Données enregistrées dans la mémoire principale du Pokédex."} »
            </p>
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-600/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-600/40 transition"
            >
              <span>Détails & Évolutions</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* VOLET 2 : CONSOLE DE COMMANDE & CLAVIER NUMÉRIQUE (DROITE) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border-4 border-gray-900 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-4 shadow-2xl relative min-h-[380px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-gray-800 pb-2">
            <span>INDEX SÉQUENTIEL</span>
            <span>CLAVIER DEXTER</span>
          </div>

          {/* Liste visible */}
          <div className="flex flex-col gap-2 my-3">
            {offsets.map((offset) => {
              const idx = indexActif + offset;
              if (idx < 0 || idx >= total) return null;
              const p = pokemons[idx];
              const estSelectionne = offset === 0;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!estSelectionne) {
                      jouerBruitageMolette();
                      setIndexActif(idx);
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition ${
                    estSelectionne
                      ? "bg-emerald-600 border-white text-white font-black shadow-lg scale-[1.02]"
                      : "bg-black/50 border-gray-800 text-gray-300 hover:border-emerald-500/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative size-8 shrink-0">
                      <Image
                        src={p.image}
                        alt={p.nomFr || p.nom}
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </div>
                    <span className="font-mono text-xs">
                      #{String(p.id).padStart(4, "0")} {p.nomFr || p.nom}
                    </span>
                  </div>

                  {estSelectionne && (
                    <span className="font-mono text-[9px] bg-white text-emerald-900 font-black px-1.5 py-0.5 rounded">
                      CIBLÉ
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clavier numérique jaune/bleu façon Dexter */}
          <div className="rounded-xl bg-black/60 border border-gray-800 p-3">
            <span className="font-mono text-[9px] text-gray-400 font-bold block mb-2 text-center">
              PAVÉ NUMÉRIQUE SILPH CO.
            </span>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs font-bold text-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    // Saut vers numéro
                    const cible = pokemons.findIndex((p) => p.id === num);
                    if (cible !== -1) {
                      jouerBruitageMolette();
                      setIndexActif(cible);
                    }
                  }}
                  className="rounded-lg bg-blue-600/30 border border-blue-400/40 py-1.5 text-blue-200 hover:bg-blue-600 hover:text-white transition"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Commandes directionnelles D-Pad */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-emerald-500/40 bg-black/40 py-2 font-bold text-emerald-200 hover:bg-emerald-600/30 transition"
            >
              ▲ PRÉCÉDENT
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-emerald-500/40 bg-black/40 py-2 font-bold text-emerald-200 hover:bg-emerald-600/30 transition"
            >
              SUIVANT ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
