"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import BoutonSacocheRapide from "@/components/BoutonSacocheRapide";
import LecteurCri from "@/components/LecteurCri";
import { Pokemon } from "@/types/pokemon";
import { calculerPositionArcHGSS } from "@/lib/pokedex-modeles";
import { prochainIndex, jouerBruitageMolette } from "@/lib/roulette";

type Props = {
  pokemons: Pokemon[];
};

export default function ModeleHGSS({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const [rotationMolette, setRotationMolette] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const pokemonActif = pokemons[indexActif] ?? pokemons[0];
  const total = pokemons.length;

  const changerIndex = useCallback(
    (direction: 1 | -1) => {
      setIndexActif((actuel) => {
        const suivant = prochainIndex(actuel, direction, total);
        if (suivant !== actuel) {
          jouerBruitageMolette();
          setRotationMolette((r) => r + direction * 28);
        }
        return suivant;
      });
    },
    [total]
  );

  // Écouteur de molette non passif pour piéger le scroll
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

  // Support tactile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) changerIndex(1);
      else changerIndex(-1);
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const onTouchEnd = () => {
    touchStartXRef.current = null;
  };

  if (!pokemonActif) {
    return (
      <div className="py-12 text-center text-amber-200/80 font-mono">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  // Indices visibles autour du Pokémon actif (-3 à +3 pour le carrousel en arc)
  const offsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* BANDEAU SUPÉRIEUR HGSS */}
      <div className="flex items-center justify-between border-b-2 border-amber-600/40 bg-gradient-to-r from-amber-950/60 via-red-950/60 to-amber-950/60 px-3 py-2 rounded-xl text-amber-200">
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
          <span>POKÉDEX JOHTO & NATIONAL · HGSS</span>
        </div>
        <div className="font-mono text-xs font-bold text-amber-300">
          N° {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DOUBLE ÉCRAN STYLE NINTENDO DS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ÉCRAN 1 (HAUT) : FICHE ANALYTIQUE DÉTAILLÉE */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Visuel Pokémon avec halo doré Johto */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/30 via-black to-slate-950 p-2 shadow-inner">
              <span className="absolute -top-2 -left-2 rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow">
                #{String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.35)] transition-transform duration-200 hover:scale-105"
              />
            </div>

            {/* Informations Identité */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight">
                    {pokemonActif.nomFr || pokemonActif.nom}
                  </h2>
                  <BoutonSacocheRapide pokemon={pokemonActif} />
                </div>

                {pokemonActif.nomFr && pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() && (
                  <p className="font-mono text-xs text-amber-400/70 capitalize">
                    Nom EN : {pokemonActif.nom}
                  </p>
                )}

                {pokemonActif.categorieFr && (
                  <p className="mt-1 font-mono text-xs font-semibold text-emerald-400">
                    {pokemonActif.categorieFr}
                  </p>
                )}

                {/* Types */}
                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {pokemonActif.types.map((type) => (
                    <BadgeType key={type} type={type} />
                  ))}
                </div>
              </div>

              {/* Mensurations & Cri */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/40 border border-amber-500/20 p-2 font-mono text-xs">
                <div>
                  <span className="text-gray-400">Taille :</span>{" "}
                  <strong className="text-amber-200">{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">Poids :</span>{" "}
                  <strong className="text-amber-200">{pokemonActif.poids} kg</strong>
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

          {/* Description Lore Officielle */}
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-amber-400 tracking-wider">
              DONNÉES DU POKÉDEX HGSS :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed italic">
              « {pokemonActif.descriptionFr || "Données biométriques synchronisées avec le Pokédex de la région Johto."} »
            </p>
          </div>

          {/* Lien Fiche Complète */}
          <div className="mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-200 hover:bg-amber-500/35 transition"
            >
              <span>Voir la fiche d&apos;évolution & faiblesses</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ÉCRAN 2 (BAS) : LE CARROUSEL ROTATIF EN ARC DE CERCLE HGSS */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-4 shadow-xl overflow-hidden relative min-h-[380px]">
          
          {/* Header écran tactile */}
          <div className="flex items-center justify-between text-xs font-mono text-amber-300/80 border-b border-amber-500/20 pb-2">
            <span>TOUCH SCREEN · CARROUSEL</span>
            <span>FAITES TOURNER L&apos;ARC</span>
          </div>

          {/* Zone de l'arc de cercle interactif */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden h-[240px]">
            
            {/* Ligne d'arc dorée visuelle en arrière-plan */}
            <div className="absolute w-[360px] h-[360px] rounded-full border-4 border-dashed border-amber-500/20 pointer-events-none -bottom-24" />

            {/* Badges Pokémon positionnés sur l'arc */}
            {offsets.map((offset) => {
              const idx = indexActif + offset;
              if (idx < 0 || idx >= total) return null;
              const p = pokemons[idx];
              const { x, y, scale, opacity, rotation, zIndex } = calculerPositionArcHGSS(offset, 140);
              const estSelectionne = offset === 0;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!estSelectionne) {
                      jouerBruitageMolette();
                      setIndexActif(idx);
                      setRotationMolette((r) => r + offset * 28);
                    }
                  }}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
                    opacity,
                    zIndex,
                    transition: "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s",
                  }}
                  className={`absolute flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer ${
                    estSelectionne
                      ? "size-28 bg-gradient-to-b from-amber-400 to-amber-600 text-black shadow-2xl shadow-amber-500/60 border-4 border-white"
                      : "size-20 bg-gray-900/90 text-white border-2 border-amber-500/30 hover:border-amber-400"
                  }`}
                >
                  <div className="relative size-14">
                    <Image
                      src={p.image}
                      alt={p.nomFr || p.nom}
                      fill
                      sizes="56px"
                      className="object-contain filter drop-shadow"
                    />
                  </div>
                  <span
                    className={`font-mono font-black text-[10px] truncate max-w-[80px] mt-0.5 ${
                      estSelectionne ? "text-black" : "text-amber-200"
                    }`}
                  >
                    {p.nomFr || p.nom}
                  </span>
                  <span
                    className={`font-mono text-[8px] font-bold ${
                      estSelectionne ? "text-black/80" : "text-gray-400"
                    }`}
                  >
                    #{String(p.id).padStart(4, "0")}
                  </span>
                </div>
              );
            })}

            {/* Jog-Dial Central Rotatif (Molette de contrôle HGSS) */}
            <div
              className="absolute -bottom-8 flex flex-col items-center justify-center size-24 rounded-full border-4 border-amber-400 bg-gradient-to-b from-amber-700 via-amber-900 to-black shadow-2xl shadow-black cursor-pointer active:scale-95 transition-transform"
              style={{
                transform: `rotate(${rotationMolette}deg)`,
                transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              title="Molette rotative centrale HGSS"
              onClick={() => changerIndex(1)}
            >
              <div className="size-10 rounded-full border-2 border-white/80 bg-gradient-to-tr from-amber-300 to-amber-500 shadow-inner flex items-center justify-center">
                <span className="size-3 rounded-full bg-white shadow-xs" />
              </div>
              <div className="absolute top-1 text-[8px] font-mono text-amber-200 font-black">▲</div>
              <div className="absolute bottom-1 text-[8px] font-mono text-amber-200 font-black">▼</div>
            </div>
          </div>

          {/* Boutons de navigation et de filtre tactiles */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-amber-500/20 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="col-span-1 rounded-xl border border-amber-500/40 bg-black/40 py-2 font-bold text-amber-200 hover:bg-amber-500/20 active:bg-amber-500/40 transition"
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
              className="col-span-1 rounded-xl border border-amber-500/40 bg-black/40 py-2 font-bold text-amber-300 hover:bg-amber-500/20 transition text-[11px]"
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
              className="col-span-1 rounded-xl border border-amber-500/40 bg-black/40 py-2 font-bold text-amber-300 hover:bg-amber-500/20 transition text-[11px]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="col-span-1 rounded-xl border border-amber-500/40 bg-black/40 py-2 font-bold text-amber-200 hover:bg-amber-500/20 active:bg-amber-500/40 transition"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
