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
          setAnglePokemolette((ang) => ang + direction * 30);
        }
        return suivant;
      });
    },
    [total]
  );

  // Écouteur de molette non passif sur ordinateur pour piéger le scroll
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

  // Support tactile ultra-réactif pour mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = e.touches[0].clientY - touchStartYRef.current;
    // Seuil de détection rapide (18px) pour un glisser fluide
    if (Math.abs(diff) > 18) {
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
      <div className="py-12 text-center text-blue-200/80 font-mono text-sm">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  // 5 Pokémon visibles (-2 à +2)
  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-3 sm:gap-4 select-none w-full"
    >
      {/* BANDEAU SUPÉRIEUR SINNOH NINTENDO DS */}
      <div className="flex items-center justify-between border-b-2 border-blue-500/50 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-3.5 py-2 rounded-xl text-blue-200 font-mono text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold tracking-wider">
          <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs">POKÉDEX SINNOH · SYSTÈME TACTILE DS</span>
        </div>
        <div className="font-extrabold text-blue-300 tracking-wider text-[11px] sm:text-xs">
          N° {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DOUBLE ÉCRAN NINTENDO DS : ADAPTÉ MOBILE & DESKTOP */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-5 items-stretch">
        
        {/* ========================================================= */}
        {/* ÉCRAN HAUT (VISUALISATION & FICHE BIOMÉTRIQUE)            */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-blue-500/60 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 p-3 sm:p-5 md:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Grille radar Sinnoh */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          <div>
            <div className="relative flex flex-row items-center gap-3 sm:gap-6">
              
              {/* Cadre de l'Artwork Pokémon (Taille optimisée mobile 110px / desktop 220px) */}
              <div className="relative size-28 sm:size-44 md:size-52 shrink-0 flex items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-blue-400/60 bg-gradient-to-br from-blue-900/50 via-black to-slate-950 p-1.5 sm:p-2.5 shadow-xl shadow-blue-950/50">
                {/* Badge ID */}
                <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded bg-blue-600/90 border border-blue-400 px-1.5 py-0.5 font-mono text-[9px] sm:text-xs font-black text-white shadow">
                  #{String(pokemonActif.id).padStart(4, "0")}
                </span>

                {/* Piédestal holographique */}
                <div className="absolute bottom-1 inset-x-2 h-4 sm:h-6 rounded-full bg-blue-500/20 blur-sm pointer-events-none" />

                <Image
                  src={pokemonActif.image}
                  alt={pokemonActif.nomFr || pokemonActif.nom}
                  width={200}
                  height={200}
                  priority
                  className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.45)] transition-transform duration-200 hover:scale-105"
                />
              </div>

              {/* Fiche d'Identité : Hauteurs Fixes pour Éviter Tout Décalage */}
              <div className="flex-1 flex flex-col justify-between min-w-0 text-left">
                <div>
                  {/* Titre et Bouton Sacoche */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight truncate drop-shadow">
                      {pokemonActif.nomFr || pokemonActif.nom}
                    </h2>
                    <BoutonSacocheRapide pokemon={pokemonActif} />
                  </div>

                  {/* Ligne sous-titre de hauteur fixe constante (20px) pour 0 layout shift */}
                  <div className="h-5 flex items-center">
                    {pokemonActif.nomFr && pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() ? (
                      <p className="font-mono text-[10px] sm:text-xs text-blue-300/80 capitalize">
                        EN : {pokemonActif.nom}
                      </p>
                    ) : (
                      <p className="font-mono text-[10px] sm:text-xs text-blue-400/40">
                        Espèce Sinnoh
                      </p>
                    )}
                  </div>

                  {/* Catégorie officielle de hauteur fixe (24px) */}
                  <div className="h-6 flex items-center">
                    <span className="inline-block rounded-md bg-blue-950/80 border border-blue-400/40 px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold text-blue-300">
                      {pokemonActif.categorieFr || "Pokémon Répertorié"}
                    </span>
                  </div>

                  {/* Badges de types officiels */}
                  <div className="mt-1 sm:mt-2 flex flex-wrap gap-1.5 h-6 sm:h-7 items-center">
                    {pokemonActif.types.map((type) => (
                      <BadgeType key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Dimensions physiques (Hauteur & Poids) */}
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-black/70 border border-blue-500/30 px-2.5 py-1.5 font-mono text-[11px] sm:text-xs">
                  <div>
                    <span className="text-gray-400 font-bold">HAUTEUR:</span>{" "}
                    <strong className="text-blue-200">{pokemonActif.taille} m</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">POIDS:</span>{" "}
                    <strong className="text-blue-200">{pokemonActif.poids} kg</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION LORE SINNOH : HAUTEUR STRICTEMENT CONSTANTE (2 LIGNES FIXES) */}
            {/* z-index et hauteur fixe garantissent 0 décalage pendant le scroll rapide */}
            <div className="relative mt-2.5 sm:mt-4 rounded-xl border border-blue-400/40 bg-blue-950/30 px-3 py-2 sm:p-3 shadow-inner h-[76px] sm:h-[84px] flex flex-col justify-center overflow-hidden">
              <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-blue-400 tracking-wider">
                DONNÉES DU POKÉDEX SINNOH :
              </span>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-100 font-sans italic line-clamp-2 leading-relaxed">
                « {pokemonActif.descriptionFr || "Profil biométrique synchronisé avec le Pokédex de la région Sinnoh."} »
              </p>
            </div>
          </div>

          {/* Lien & Cri audio */}
          <div className="relative mt-2.5 flex items-center justify-between pt-2 border-t border-blue-500/20 text-xs">
            {pokemonActif.criAudio ? (
              <LecteurCri
                urlAudio={pokemonActif.criAudio}
                nomPokemon={pokemonActif.nomFr || pokemonActif.nom}
              />
            ) : (
              <span className="font-mono text-[10px] text-gray-500">Audio indisponible</span>
            )}

            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/50 bg-blue-600/30 px-3 py-1 font-mono text-[11px] font-bold text-white hover:bg-blue-600/50 transition"
            >
              <span>Fiche complète</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ÉCRAN BAS (TACTILE DS & POKÉ-MOLETTE IMMÉDIATEMENT ACCESSIBLE) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-blue-500/60 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-3 sm:p-5 shadow-2xl relative">
          
          {/* Header écran tactile */}
          <div className="flex items-center justify-between text-xs font-mono text-blue-300/90 border-b border-blue-500/30 pb-2">
            <span className="font-bold text-[11px] sm:text-xs">ÉCRAN TACTILE SINNOH</span>
            <span className="text-[10px] sm:text-[11px] text-blue-400 font-bold">JOG-DIAL POKÉBALL</span>
          </div>

          {/* Corps tactile : Liste compacte à gauche + Poké-molette épurée sans points à droite */}
          <div className="flex items-center gap-2 sm:gap-4 my-2.5 sm:my-4 flex-1">
            
            {/* Liste tactile centrale */}
            <div className="flex-1 flex flex-col gap-1.5 sm:gap-2">
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
                        setAnglePokemolette((ang) => ang + offset * 30);
                      }
                    }}
                    className={`flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border cursor-pointer transition ${
                      estSelectionne
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 border-white text-white font-black shadow-md shadow-blue-500/30 scale-[1.01]"
                        : "bg-black/50 border-gray-800 text-gray-300 hover:border-blue-400/60 hover:bg-black/70"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="relative size-7 sm:size-9 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.nomFr || p.nom}
                          fill
                          sizes="36px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[10px] sm:text-xs font-black">
                          #{String(p.id).padStart(4, "0")}
                        </span>
                        <span className={`text-xs sm:text-sm font-bold truncate max-w-[100px] sm:max-w-[140px] ${
                          estSelectionne ? "text-white" : "text-gray-200"
                        }`}>
                          {p.nomFr || p.nom}
                        </span>
                      </div>
                    </div>

                    {estSelectionne ? (
                      <span className="font-mono text-[9px] bg-white text-blue-900 font-extrabold px-1.5 py-0.5 rounded-full shadow">
                        ACTIF
                      </span>
                    ) : (
                      <span className="font-mono text-[8px] text-gray-400 uppercase hidden sm:inline">
                        {p.types[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* POKÉ-MOLETTE OFFICIELLE PARFAITEMENT PROPRE SANS POINTS GRIS */}
            <div className="flex flex-col items-center justify-center shrink-0">
              {/* Corps circulaire de la Poké-Molette */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  if (clickY < rect.height / 2) {
                    changerIndex(-1);
                  } else {
                    changerIndex(1);
                  }
                }}
                title="Touchez le haut ou le bas pour tourner, ou faites défiler"
                style={{
                  transform: `rotate(${anglePokemolette}deg)`,
                  transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
                className="relative size-28 sm:size-36 md:size-40 rounded-full border-4 border-gray-950 bg-white shadow-xl shadow-blue-500/20 cursor-pointer active:scale-95 transition-transform overflow-hidden select-none"
              >
                {/* Hémisphère supérieur rouge pur Pokéball (Lisse et éclatant, 0 points) */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500 via-red-600 to-red-700 border-b-4 border-gray-950">
                  {/* Reflet de lumière blanc discret en arc */}
                  <span className="absolute top-1.5 left-4 right-4 h-2 rounded-full bg-white/20 blur-[0.5px] pointer-events-none" />
                </div>

                {/* Hémisphère inférieur blanc pur Pokéball (Lisse et épuré, 0 points) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300" />

                {/* Bouton central rond Pokéball avec anneau chromé et lueur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 sm:size-11 rounded-full border-4 border-gray-950 bg-white shadow-md flex items-center justify-center pointer-events-none">
                  <div className="size-3.5 sm:size-4 rounded-full border border-gray-400 bg-gradient-to-tr from-gray-200 to-white shadow-inner animate-pulse" />
                </div>
              </div>

              {/* Libellé d'action épuré */}
              <span className="mt-1.5 font-mono text-[8px] sm:text-[9px] font-bold text-gray-400 text-center tracking-tight">
                TOURNER
              </span>
            </div>
          </div>

          {/* Onglets tactiles de saut rapide */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-2 border-t border-blue-500/20 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-lg border border-blue-400/40 bg-black/50 py-1.5 sm:py-2 text-blue-200 hover:bg-blue-600/40 hover:text-white transition text-center"
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
              className="rounded-lg border border-blue-400/40 bg-black/50 py-1.5 sm:py-2 text-blue-300 hover:bg-blue-600/40 hover:text-white transition text-center text-[11px]"
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
              className="rounded-lg border border-blue-400/40 bg-black/50 py-1.5 sm:py-2 text-blue-300 hover:bg-blue-600/40 hover:text-white transition text-center text-[11px]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-lg border border-blue-400/40 bg-black/50 py-1.5 sm:py-2 text-blue-200 hover:bg-blue-600/40 hover:text-white transition text-center"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
