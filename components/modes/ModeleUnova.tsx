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

export default function ModeleUnova({ pokemons }: Props) {
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
      <div className="py-12 text-center text-cyan-200/80 font-mono">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  const offsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* BANDEAU CYBERNETIQUE NOIR & BLANC */}
      <div className="flex items-center justify-between border-b-2 border-cyan-500/50 bg-gradient-to-r from-gray-950 via-cyan-950/40 to-gray-950 px-4 py-2.5 rounded-2xl text-cyan-200 font-mono text-xs shadow-lg shadow-cyan-950/30">
        <div className="flex items-center gap-2 font-bold tracking-widest uppercase">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>CYBER-TERMINAL UNYS · NOIR & BLANC</span>
        </div>
        <div className="font-bold text-cyan-300">
          INDEX # {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DISPOSITION PANORAMIQUE HAUTE TECHNOLOGIE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ÉCRAN HOLOGRAPHIQUE AMOLED (GAUCHE) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-cyan-500/40 bg-gray-950 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          
          {/* Lignes de balayage laser cybernétiques */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Hologramme néon cyan */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 to-black p-2 shadow-inner">
              <span className="absolute top-2 left-2 rounded bg-cyan-600/60 px-2 py-0.5 font-mono text-[9px] font-black text-white">
                UNYS #{String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.4)]"
              />
            </div>

            {/* Fiche d'identification */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {pokemonActif.nomFr || pokemonActif.nom}
                  </h2>
                  <BoutonSacocheRapide pokemon={pokemonActif} />
                </div>

                {pokemonActif.categorieFr && (
                  <p className="font-mono text-xs font-bold text-cyan-400">
                    {pokemonActif.categorieFr}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {pokemonActif.types.map((type) => (
                    <BadgeType key={type} type={type} />
                  ))}
                </div>
              </div>

              {/* Statistiques et dimensions */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/60 border border-cyan-500/20 p-2 font-mono text-xs">
                <div>
                  <span className="text-gray-400">TAILLE :</span>{" "}
                  <strong className="text-cyan-300">{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">POIDS :</span>{" "}
                  <strong className="text-cyan-300">{pokemonActif.poids} kg</strong>
                </div>
              </div>

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

          {/* Description Unys */}
          <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-cyan-400 tracking-wider">
              DONNÉES HOLOGRAPHIQUES DU POKÉDEX :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed italic">
              « {pokemonActif.descriptionFr || "Profil biométrique synthétisé par le terminal haute fréquence."} »
            </p>
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-600/20 px-3 py-1 font-mono text-xs font-bold text-cyan-200 hover:bg-cyan-600/40 transition"
            >
              <span>Matrice d&apos;évolution & statistiques</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* LISTE CYBERNETIQUE DYNAMIQUE (DROITE) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-cyan-500/40 bg-gray-950 p-4 shadow-2xl relative min-h-[380px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-gray-800 pb-2">
            <span>FLUX NUMÉRIQUE</span>
            <span>TACTILE CYBER</span>
          </div>

          {/* Liste tactile fluide */}
          <div className="flex flex-col gap-1.5 my-3 flex-1 justify-center">
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
                      ? "bg-cyan-600 border-cyan-300 text-white font-black shadow-lg shadow-cyan-500/20 scale-[1.02]"
                      : "bg-black/60 border-gray-800 text-gray-400 hover:border-cyan-500/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative size-7 shrink-0">
                      <Image
                        src={p.image}
                        alt={p.nomFr || p.nom}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                    <span className="font-mono text-xs">
                      #{String(p.id).padStart(4, "0")} {p.nomFr || p.nom}
                    </span>
                  </div>

                  {estSelectionne && (
                    <span className="font-mono text-[9px] bg-white text-cyan-900 font-bold px-1.5 py-0.5 rounded">
                      SYNCHRO
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Barre de contrôle tactile */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-cyan-500/40 bg-black/40 py-2 font-bold text-cyan-200 hover:bg-cyan-500/20 transition"
            >
              ◀ PRÉC
            </button>
            <button
              type="button"
              onClick={() => {
                const saut = Math.max(0, indexActif - 10);
                setIndexActif(saut);
                jouerBruitageMolette();
              }}
              className="rounded-xl border border-cyan-500/40 bg-black/40 py-2 font-bold text-cyan-300 hover:bg-cyan-500/20 transition text-[11px]"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => {
                const saut = Math.min(total - 1, indexActif + 10);
                setIndexActif(saut);
                jouerBruitageMolette();
              }}
              className="rounded-xl border border-cyan-500/40 bg-black/40 py-2 font-bold text-cyan-300 hover:bg-cyan-500/20 transition text-[11px]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-cyan-500/40 bg-black/40 py-2 font-bold text-cyan-200 hover:bg-cyan-500/20 transition"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
