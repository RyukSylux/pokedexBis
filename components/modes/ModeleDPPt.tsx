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

  // Écouteur de molette non passif pour piéger le scroll
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

  // Support tactile pour glisser vers le haut/bas
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(diff) > 25) {
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
      <div className="py-16 text-center text-blue-200/80 font-mono text-base">
        Aucun Pokémon ne correspond aux critères de recherche.
      </div>
    );
  }

  // 5 Pokémon visibles dans la liste tactile (-2 à +2)
  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-5 select-none w-full"
    >
      {/* BANDEAU SUPÉRIEUR SINNOH NINTENDO DS */}
      <div className="flex items-center justify-between border-b-2 border-blue-500/50 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-4 py-2.5 rounded-2xl text-blue-200 font-mono text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold tracking-wider">
          <span className="size-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span>POKÉDEX SINNOH · SYSTÈME TACTILE DS</span>
        </div>
        <div className="font-extrabold text-blue-300 tracking-wider">
          POKÉMON #{String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DOUBLE ÉCRAN NINTENDO DS CLASSIC (AGRANDI & SPACIEUX) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ========================================================= */}
        {/* ÉCRAN HAUT (7 COLONNES) : VISUALISATEUR HOLOGRAPHIQUE & FICHE */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border-2 sm:border-3 border-blue-500/60 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 p-5 sm:p-7 shadow-2xl relative overflow-hidden min-h-[480px]">
          
          {/* Grille radar futuriste Sinnoh en fond */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          <div>
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              {/* Grand Cadre Holographique du Pokémon */}
              <div className="relative size-48 sm:size-56 md:size-64 shrink-0 flex items-center justify-center rounded-3xl border-2 sm:border-3 border-blue-400/60 bg-gradient-to-br from-blue-900/50 via-black to-slate-950 p-3 shadow-2xl shadow-blue-950/60">
                {/* Badge ID */}
                <span className="absolute top-3 left-3 rounded-lg bg-blue-600/90 border border-blue-400 px-2.5 py-0.5 font-mono text-xs font-black text-white shadow">
                  #{String(pokemonActif.id).padStart(4, "0")}
                </span>

                {/* Piédestal holographique lumineux */}
                <div className="absolute bottom-2 inset-x-4 h-6 rounded-full bg-blue-500/20 blur-sm pointer-events-none" />

                <Image
                  src={pokemonActif.image}
                  alt={pokemonActif.nomFr || pokemonActif.nom}
                  width={220}
                  height={220}
                  priority
                  className="size-full object-contain filter drop-shadow-[0_12px_24px_rgba(59,130,246,0.5)] transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Fiche d'Identité & Typographie Haute Lisibilité */}
              <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
                <div>
                  {/* Titre & Bouton Sacoche */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow">
                      {pokemonActif.nomFr || pokemonActif.nom}
                    </h2>
                    <BoutonSacocheRapide pokemon={pokemonActif} />
                  </div>

                  {pokemonActif.nomFr && pokemonActif.nomFr.toLowerCase() !== pokemonActif.nom.toLowerCase() && (
                    <p className="font-mono text-xs text-blue-300/80 capitalize mt-0.5">
                      Nom international : {pokemonActif.nom}
                    </p>
                  )}

                  {/* Espèce & Catégorie Officielle */}
                  {pokemonActif.categorieFr && (
                    <div className="mt-1.5 inline-block rounded-lg bg-blue-950/80 border border-blue-400/40 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-300">
                      {pokemonActif.categorieFr}
                    </div>
                  )}

                  {/* Badges de types officiels */}
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                    {pokemonActif.types.map((type) => (
                      <BadgeType key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Dimensions physiques bien lisibles */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-black/70 border border-blue-500/30 p-3 font-mono text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-400 font-bold">HAUTEUR</span>
                    <strong className="text-blue-200 text-base font-black">{pokemonActif.taille} m</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 font-bold">POIDS</span>
                    <strong className="text-blue-200 text-base font-black">{pokemonActif.poids} kg</strong>
                  </div>
                </div>

                {/* Cri audio officiel */}
                {pokemonActif.criAudio && (
                  <div className="mt-3">
                    <LecteurCri
                      urlAudio={pokemonActif.criAudio}
                      nomPokemon={pokemonActif.nomFr || pokemonActif.nom}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description Lore de Sinnoh (Agrandie & Aérée) */}
            <div className="relative mt-5 rounded-2xl border border-blue-400/40 bg-blue-950/30 p-4 shadow-inner">
              <span className="font-mono text-[11px] font-black uppercase text-blue-400 tracking-wider">
                DONNÉES DU POKÉDEX SINNOH (PROF. SORBIER) :
              </span>
              <p className="mt-1.5 text-sm sm:text-base text-gray-100 leading-relaxed font-sans italic">
                « {pokemonActif.descriptionFr || "Profil biométrique synchronisé avec le Pokédex de la région Sinnoh."} »
              </p>
            </div>
          </div>

          {/* Lien vers la fiche complète */}
          <div className="relative mt-4 flex items-center justify-between pt-2 border-t border-blue-500/20">
            <span className="font-mono text-xs text-blue-300">
              Total Stats : <strong className="text-white font-extrabold">{pokemonActif.bst} BST</strong>
            </span>
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600/30 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-600/50 hover:border-blue-400 active:scale-95 transition"
            >
              <span>Fiche d&apos;évolution & statistiques</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ÉCRAN BAS (5 COLONNES) : ÉCRAN TACTILE AVEC LA POKÉ-MOLETTE */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-2 sm:border-3 border-blue-500/60 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-5 shadow-2xl relative min-h-[480px]">
          
          {/* Header écran tactile DS */}
          <div className="flex items-center justify-between text-xs font-mono text-blue-300/90 border-b border-blue-500/30 pb-2.5">
            <span className="font-bold">ÉCRAN TACTILE · LISTE SINNOH</span>
            <span className="text-[11px] text-blue-400 font-bold">POKÉ-MOLETTE ROTATIVE</span>
          </div>

          {/* Corps tactile : Liste des Pokémon à gauche + Grande Poké-molette à droite */}
          <div className="flex items-center gap-4 my-4 flex-1">
            
            {/* Liste tactile centrale avec typographie claire */}
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
                        setAnglePokemolette((ang) => ang + offset * 30);
                      }
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border cursor-pointer transition ${
                      estSelectionne
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 border-white text-white font-black shadow-lg shadow-blue-500/30 scale-[1.02]"
                        : "bg-black/50 border-gray-800 text-gray-300 hover:border-blue-400/60 hover:bg-black/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.nomFr || p.nom}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-xs font-black">
                          #{String(p.id).padStart(4, "0")}
                        </span>
                        <span className={`text-sm font-bold truncate max-w-[130px] sm:max-w-[160px] ${
                          estSelectionne ? "text-white" : "text-gray-200"
                        }`}>
                          {p.nomFr || p.nom}
                        </span>
                      </div>
                    </div>

                    {estSelectionne ? (
                      <span className="font-mono text-[10px] bg-white text-blue-900 font-extrabold px-2 py-0.5 rounded-full shadow">
                        ACTIF
                      </span>
                    ) : (
                      <div className="flex gap-1">
                        {p.types.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[9px] text-gray-400 uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* GRANDE POKÉ-MOLETTE SINNOH (JOG-DIAL MÉCANIQUE AUTONOME) */}
            <div className="flex flex-col items-center justify-center shrink-0 pr-1">
              <span className="font-mono text-[10px] text-blue-300 font-black mb-2 tracking-wider">
                MOLETTE
              </span>

              {/* Corps circulaire de la Poké-Molette (Agrandie : 144px à 176px) */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  // Si clic sur la moitié haute -> reculer, sinon avancer
                  if (clickY < rect.height / 2) {
                    changerIndex(-1);
                  } else {
                    changerIndex(1);
                  }
                }}
                title="Cliquez ou faites défiler la Poké-molette pour naviguer"
                style={{
                  transform: `rotate(${anglePokemolette}deg)`,
                  transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
                className="relative size-36 sm:size-40 md:size-44 rounded-full border-4 border-gray-950 bg-white shadow-2xl shadow-blue-500/30 cursor-pointer active:scale-95 transition-transform overflow-hidden select-none"
              >
                {/* Hémisphère supérieur rouge Pokéball */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500 via-red-600 to-red-700 border-b-4 border-gray-950 flex items-center justify-around px-3">
                  {/* Crans mécaniques texturés */}
                  <span className="size-2 rounded-full bg-white/80 shadow-xs" />
                  <span className="size-2 rounded-full bg-white/80 shadow-xs" />
                  <span className="size-2 rounded-full bg-white/80 shadow-xs" />
                </div>

                {/* Hémisphère inférieur blanc Pokéball */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex items-center justify-around px-3">
                  {/* Crans mécaniques texturés */}
                  <span className="size-2 rounded-full bg-gray-400 shadow-xs" />
                  <span className="size-2 rounded-full bg-gray-400 shadow-xs" />
                  <span className="size-2 rounded-full bg-gray-400 shadow-xs" />
                </div>

                {/* Bouton central de la Pokéball avec anneau chromé */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full border-4 border-gray-950 bg-white shadow-lg flex items-center justify-center">
                  <div className="size-5 rounded-full border-2 border-gray-400 bg-gradient-to-tr from-gray-200 to-white shadow-inner animate-pulse" />
                </div>
              </div>

              {/* Indicateur textuel épuré sous la molette (Plus de boutons flèches moches) */}
              <span className="mt-2.5 font-mono text-[9px] font-bold text-gray-400 text-center tracking-tight">
                FAIRE TOURNER
              </span>
            </div>
          </div>

          {/* Onglets Sinnoh tactiles inférieurs (Grands & Confortables) */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-blue-500/20 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-blue-400/40 bg-black/50 py-2.5 text-blue-200 hover:bg-blue-600/40 hover:text-white active:bg-blue-600 transition shadow-sm"
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
              className="rounded-xl border border-blue-400/40 bg-black/50 py-2.5 text-blue-300 hover:bg-blue-600/40 hover:text-white transition shadow-sm"
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
              className="rounded-xl border border-blue-400/40 bg-black/50 py-2.5 text-blue-300 hover:bg-blue-600/40 hover:text-white transition shadow-sm"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-blue-400/40 bg-black/50 py-2.5 text-blue-200 hover:bg-blue-600/40 hover:text-white active:bg-blue-600 transition shadow-sm"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
