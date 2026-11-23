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

export default function ModeleDPPt({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const [anglePokemolette, setAnglePokemolette] = useState(0);
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
          setAnglePokemolette((ang) => ang + direction * 35);
        }
        return suivant;
      });
    },
    [total]
  );

  // Écouteur de molette non passif
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dernierScroll = 0;
    const gererMolette = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const maintenant = Date.now();
      if (maintenant - dernierScroll < 60) return;
      dernierScroll = maintenant;

      if (e.deltaY > 0) changerIndex(1);
      else if (e.deltaY < 0) changerIndex(-1);
    };

    el.addEventListener("wheel", gererMolette, { passive: false });
    return () => el.removeEventListener("wheel", gererMolette);
  }, [changerIndex]);

  // Support tactile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(diff) > 30) {
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
      <div className="py-12 text-center text-blue-200/80 font-mono">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  // Indices de la liste visible sur l'écran tactile (-2 à +2)
  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* BANDEAU SUPÉRIEUR SINNOH */}
      <div className="flex items-center justify-between border-b-2 border-blue-600/40 bg-gradient-to-r from-blue-950/70 via-slate-900 to-blue-950/70 px-3 py-2 rounded-xl text-blue-200 font-mono text-xs">
        <div className="flex items-center gap-2 font-bold">
          <span className="size-2 rounded-full bg-blue-400 animate-ping" />
          <span>POKÉDEX DE SINNOH · DIAMANT & PERLE</span>
        </div>
        <div className="font-bold text-blue-300">
          N° {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DOUBLE ÉCRAN NINTENDO DS CLASSIC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ÉCRAN HAUT : RADAR SINNOH & FICHE HOLOGRAPHIQUE */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-2 border-blue-500/50 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 p-4 sm:p-5 shadow-xl relative overflow-hidden">
          
          {/* Grille radar en fond */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Hologramme Pokémon avec radar bleu */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border-2 border-blue-400/50 bg-gradient-to-br from-blue-900/40 via-black to-slate-950 p-2 shadow-inner">
              <span className="absolute top-2 left-2 rounded bg-blue-600/80 px-2 py-0.5 font-mono text-[9px] font-black text-white">
                SINNOH #{String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.4)]"
              />
            </div>

            {/* Identité Pokémon */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {pokemonActif.nomFr || pokemonActif.nom}
                  </h2>
                  <BoutonSacocheRapide pokemon={pokemonActif} />
                </div>

                {pokemonActif.categorieFr && (
                  <p className="font-mono text-xs font-bold text-blue-300">
                    {pokemonActif.categorieFr}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {pokemonActif.types.map((type) => (
                    <BadgeType key={type} type={type} />
                  ))}
                </div>
              </div>

              {/* Mensurations */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/60 border border-blue-500/30 p-2 font-mono text-xs">
                <div>
                  <span className="text-gray-400">Taille :</span>{" "}
                  <strong className="text-blue-300">{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">Poids :</span>{" "}
                  <strong className="text-blue-300">{pokemonActif.poids} kg</strong>
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

          {/* Description Lore de Sinnoh */}
          <div className="relative mt-4 rounded-xl border border-blue-500/30 bg-blue-950/30 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-blue-400 tracking-wider">
              DONNÉES DU POKÉDEX SINNOH :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed italic">
              « {pokemonActif.descriptionFr || "Enregistrement dans le Pokédex du Professeur Sorbier."} »
            </p>
          </div>

          {/* Lien Fiche */}
          <div className="relative mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/40 bg-blue-600/30 px-3 py-1 font-mono text-xs font-bold text-blue-200 hover:bg-blue-600/50 transition"
            >
              <span>Fiche d&apos;évolution</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ÉCRAN BAS : ÉCRAN TACTILE AVEC LA POKÉ-MOLETTE SUR LE FLANC DROIT */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border-2 border-blue-500/50 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-4 shadow-xl relative min-h-[380px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-blue-300/80 border-b border-blue-500/20 pb-2">
            <span>TOUCH SCREEN · SINNOH</span>
            <span>POKÉ-MOLETTE RAPIDE</span>
          </div>

          {/* Corps de l'écran tactile : Liste à gauche + Poké-molette à droite */}
          <div className="flex items-center gap-3 my-3 flex-1">
            
            {/* Liste tactile centrale */}
            <div className="flex-1 flex flex-col gap-2">
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
                        setAnglePokemolette((ang) => ang + offset * 35);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition ${
                      estSelectionne
                        ? "bg-blue-600 border-white text-white font-black shadow-lg scale-[1.02]"
                        : "bg-black/40 border-gray-800 text-gray-300 hover:border-blue-400/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
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
                      <span className="font-mono text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">
                        ACTIF
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* LA POKÉ-MOLETTE (Poké Ball Scroll Dial) */}
            <div className="flex flex-col items-center justify-center shrink-0 pl-1">
              <span className="font-mono text-[9px] text-blue-300 font-bold mb-1">
                JOG-DIAL
              </span>

              <div
                onClick={() => changerIndex(1)}
                title="Tourner la Poké-molette vers le bas"
                style={{
                  transform: `rotate(${anglePokemolette}deg)`,
                  transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
                className="relative size-28 sm:size-32 rounded-full border-4 border-gray-900 bg-white shadow-2xl shadow-blue-500/20 cursor-pointer active:scale-95 transition-transform overflow-hidden"
              >
                {/* Hémisphère supérieur rouge Pokéball */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500 to-red-600 border-b-4 border-gray-950">
                  {/* Crans de molette sur la tranche supérieure */}
                  <div className="absolute top-1 left-4 size-1.5 rounded-full bg-white/70" />
                  <div className="absolute top-1 right-4 size-1.5 rounded-full bg-white/70" />
                </div>

                {/* Hémisphère inférieur blanc Pokéball */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 to-gray-200">
                  {/* Crans de molette sur la tranche inférieure */}
                  <div className="absolute bottom-1 left-4 size-1.5 rounded-full bg-gray-400" />
                  <div className="absolute bottom-1 right-4 size-1.5 rounded-full bg-gray-400" />
                </div>

                {/* Bouton central de la Pokéball */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full border-4 border-gray-950 bg-white shadow-md flex items-center justify-center">
                  <div className="size-3.5 rounded-full border-2 border-gray-400 bg-gray-100 animate-pulse" />
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 font-mono text-[9px] text-gray-400">
                <button
                  type="button"
                  onClick={() => changerIndex(-1)}
                  className="rounded bg-black/40 px-2 py-1 hover:bg-blue-600 hover:text-white"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => changerIndex(1)}
                  className="rounded bg-black/40 px-2 py-1 hover:bg-blue-600 hover:text-white"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Onglets Sinnoh inférieurs */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-blue-500/20 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-blue-500/30 bg-black/40 py-2 font-bold text-blue-200 hover:bg-blue-600/30 transition"
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
              className="rounded-xl border border-blue-500/30 bg-black/40 py-2 font-bold text-blue-300 hover:bg-blue-600/30 transition text-[11px]"
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
              className="rounded-xl border border-blue-500/30 bg-black/40 py-2 font-bold text-blue-300 hover:bg-blue-600/30 transition text-[11px]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-blue-500/30 bg-black/40 py-2 font-bold text-blue-200 hover:bg-blue-600/30 transition"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
