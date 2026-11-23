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

export default function ModeleFRLG({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const [rotationRoller, setRotationRoller] = useState(0);
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
          setRotationRoller((r) => r + direction * 30);
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

  // Liste visible autour du Pokémon sélectionné
  const offsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* GBA SHOULDER TRIGGERS [L] & [R] & HEADER */}
      <div className="flex items-center justify-between border-b-4 border-red-950 bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-3 py-2 rounded-xl text-white font-mono text-xs shadow-md">
        <button
          type="button"
          onClick={() => {
            const saut = Math.max(0, indexActif - 10);
            setIndexActif(saut);
            jouerBruitageMolette();
          }}
          className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-1 font-black text-amber-300 hover:bg-black active:scale-95 shadow"
        >
          [L] -10
        </button>

        <div className="text-center font-bold">
          <span className="text-amber-200">GAME BOY ADVANCE</span> · POKÉDEX KANTO
        </div>

        <button
          type="button"
          onClick={() => {
            const saut = Math.min(total - 1, indexActif + 10);
            setIndexActif(saut);
            jouerBruitageMolette();
          }}
          className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-1 font-black text-amber-300 hover:bg-black active:scale-95 shadow"
        >
          +10 [R]
        </button>
      </div>

      {/* ÉCRAN PRINCIPAL GBA 16-BIT RETRO AVEC ROLLER CRANTÉ LATÉRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ÉCRAN GBA DE VISUALISATION (GAUCHE) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-4 border-gray-900 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 p-4 sm:p-5 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Boîte d'affichage LCD Rétro GBA */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border-4 border-emerald-900/60 bg-emerald-950/20 p-2 shadow-inner">
              <span className="absolute top-2 left-2 rounded bg-red-600 px-2 py-0.5 font-mono text-[9px] font-black text-white">
                N° {String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(239,68,68,0.35)]"
              />
            </div>

            {/* Infos Pokémon GBA */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {pokemonActif.nomFr || pokemonActif.nom}
                  </h2>
                  <BoutonSacocheRapide pokemon={pokemonActif} />
                </div>

                {pokemonActif.categorieFr && (
                  <p className="font-mono text-xs font-bold text-amber-400">
                    {pokemonActif.categorieFr}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {pokemonActif.types.map((type) => (
                    <BadgeType key={type} type={type} />
                  ))}
                </div>
              </div>

              {/* Poids / Taille GBA */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/50 border border-gray-800 p-2 font-mono text-xs">
                <div>
                  <span className="text-gray-400">TAILLE :</span>{" "}
                  <strong className="text-white">{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">POIDS :</span>{" "}
                  <strong className="text-white">{pokemonActif.poids} kg</strong>
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

          {/* Description Rétro RF/VF */}
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-red-400 tracking-wider">
              DONNÉES DU POKÉDEX KANTO (PROF. CHEN) :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed italic">
              « {pokemonActif.descriptionFr || "Pokémon répertorié dans les données officielles de Kanto."} »
            </p>
          </div>

          {/* Lien Fiche */}
          <div className="mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-600/20 px-3 py-1 font-mono text-xs font-bold text-red-200 hover:bg-red-600/40 transition"
            >
              <span>Fiche complète</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* LISTE AVEC ROLLER MÉCANIQUE GBA (DROITE) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border-4 border-gray-900 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-4 shadow-2xl relative min-h-[380px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-red-300 border-b border-gray-800 pb-2">
            <span>INDEX GBA · LISTE</span>
            <span>ROLLER MÉCANIQUE</span>
          </div>

          {/* Corps avec liste et roller latéral */}
          <div className="flex items-center gap-3 my-3 flex-1">
            
            {/* Liste de Pokémon GBA */}
            <div className="flex-1 flex flex-col gap-1.5">
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
                        setRotationRoller((r) => r + offset * 30);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition ${
                      estSelectionne
                        ? "bg-red-600 border-white text-white font-black shadow-lg scale-[1.02]"
                        : "bg-black/50 border-gray-800 text-gray-300 hover:border-red-500/60"
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
                      <span className="font-mono text-[9px] bg-white text-black font-black px-1.5 py-0.5 rounded">
                        SÉLECTION
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* LE ROLLER MÉCANIQUE VERTICAL CRANTÉ FRLG */}
            <div className="flex flex-col items-center justify-center shrink-0 w-12 sm:w-14">
              <span className="font-mono text-[8px] text-gray-400 font-bold mb-1">ROLLER</span>

              <div
                onClick={() => changerIndex(1)}
                title="Faire tourner le roller GBA"
                className="relative h-60 w-10 sm:w-12 rounded-xl border-2 border-gray-950 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 shadow-inner flex flex-col items-center justify-between py-2 cursor-pointer active:scale-95 transition-transform overflow-hidden"
              >
                {/* Texture de crans mécaniques animée par rotation */}
                <div
                  style={{
                    transform: `translateY(${(rotationRoller % 20)}px)`,
                    transition: "transform 0.15s ease-out",
                  }}
                  className="flex flex-col gap-2 w-full items-center"
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-7 rounded-full bg-gray-900 border-b border-gray-500 shadow-inner"
                    />
                  ))}
                </div>

                {/* Curseur de lecture rouge au centre du roller */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-4 bg-red-600/80 border-y border-white/60 pointer-events-none flex items-center justify-center">
                  <span className="size-1 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-1 w-full font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => changerIndex(-1)}
                  className="rounded bg-black/50 py-1 text-center hover:bg-red-600 hover:text-white"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => changerIndex(1)}
                  className="rounded bg-black/50 py-1 text-center hover:bg-red-600 hover:text-white"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Boutons de navigation */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-red-500/40 bg-black/40 py-2 font-bold text-red-200 hover:bg-red-600/30 transition"
            >
              ◀ POKÉMON PRÉCÉDENT
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-red-500/40 bg-black/40 py-2 font-bold text-red-200 hover:bg-red-600/30 transition"
            >
              POKÉMON SUIVANT ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
