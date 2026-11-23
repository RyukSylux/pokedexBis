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

export default function ModeleRotom({ pokemons }: Props) {
  const [indexActif, setIndexActif] = useState(0);
  const [expressionMotisma, setExpressionMotisma] = useState<"heureux" | "clin" | "electrik">("heureux");
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

  const interagirMotisma = () => {
    const expressions: ("heureux" | "clin" | "electrik")[] = ["heureux", "clin", "electrik"];
    const autre = expressions.filter((e) => e !== expressionMotisma);
    setExpressionMotisma(autre[Math.floor(Math.random() * autre.length)]);
    jouerBruitageMolette();
  };

  if (!pokemonActif) {
    return (
      <div className="py-12 text-center text-orange-200/80 font-mono">
        Aucun Pokémon ne correspond aux critères.
      </div>
    );
  }

  const offsets = [-2, -1, 0, 1, 2];

  // Commentaire amusant de Motisma selon le type du Pokémon actif
  const genererCommentaireMotisma = () => {
    const typePrincipal = pokemonActif.types[0] || "normal";
    switch (typePrincipal) {
      case "electric":
      case "électrik":
        return "Bzzzt ! Un confrère électrique ! Quelle énergie fantastique !";
      case "fire":
      case "feu":
        return "Zzzt ! Ça chauffe par ici ! Fais attention à ne pas te brûler !";
      case "water":
      case "eau":
        return "Glou-glou ! Zzzt ! N'éclabousse pas mes circuits électroniques !";
      case "grass":
      case "plante":
        return "Zzzt ! Un beau spécimen de la flore Pokémon !";
      case "dragon":
        return "Wouah ! Zzzt ! Une créature légendaire impressionnante !";
      default:
        return `Zzzt ! C'est ${pokemonActif.nomFr || pokemonActif.nom} ! Une donnée de plus dans notre Pokédex !`;
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-4 select-none w-full"
    >
      {/* BANDEAU SUPÉRIEUR AVEC LES YEUX ANIMÉS DE MOTISMA & CORNES PLASMA */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between border-4 border-orange-500 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 px-4 py-3 rounded-3xl text-white shadow-2xl overflow-hidden">
        
        {/* Cornes plasma électriques stylisées en arrière-plan */}
        <div className="absolute -top-6 left-8 w-12 h-16 bg-gradient-to-t from-orange-400 to-amber-300 rotate-12 blur-xs opacity-60 pointer-events-none" />
        <div className="absolute -top-6 right-8 w-12 h-16 bg-gradient-to-t from-orange-400 to-amber-300 -rotate-12 blur-xs opacity-60 pointer-events-none" />

        {/* Bloc Visage Motisma interactif */}
        <div
          onClick={interagirMotisma}
          className="flex items-center gap-3 cursor-pointer group bg-black/40 px-3 py-1.5 rounded-2xl border border-white/20 active:scale-95 transition-transform"
          title="Cliquez sur les yeux de Motisma pour interagir !"
        >
          {/* Yeux animés de Motisma */}
          <div className="flex items-center gap-2">
            {/* Œil gauche */}
            <div className="relative size-8 rounded-full bg-cyan-300 border-2 border-black flex items-center justify-center shadow-inner overflow-hidden">
              {expressionMotisma === "clin" ? (
                <div className="w-4 h-1 bg-black rounded-full" />
              ) : (
                <div className="size-3.5 rounded-full bg-black flex items-center justify-center">
                  <span className="size-1 rounded-full bg-white self-start ml-1 mt-0.5" />
                </div>
              )}
            </div>

            {/* Aileron nez */}
            <div className="size-1.5 rounded-full bg-orange-300" />

            {/* Œil droit */}
            <div className="relative size-8 rounded-full bg-cyan-300 border-2 border-black flex items-center justify-center shadow-inner overflow-hidden">
              <div className="size-3.5 rounded-full bg-black flex items-center justify-center">
                <span className="size-1 rounded-full bg-white self-start ml-1 mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-mono text-[10px] font-black text-amber-300 uppercase">
              MOTISMA-DEX ALOLA
            </span>
            <span className="text-[9px] text-white/80 font-mono">
              [Clique-moi ! Bzzzt]
            </span>
          </div>
        </div>

        {/* Bulle de dialogue parlante de Motisma */}
        <div className="my-2 sm:my-0 flex-1 px-4 text-center sm:text-left">
          <div className="inline-block rounded-2xl bg-white/90 text-gray-900 px-3 py-1 text-xs font-bold shadow-md border-2 border-orange-400">
            💬 {genererCommentaireMotisma()}
          </div>
        </div>

        {/* Numérotation */}
        <div className="font-mono text-xs font-bold text-amber-200 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
          N° {String(pokemonActif.id).padStart(4, "0")} / {total}
        </div>
      </div>

      {/* DOUBLE ÉCRAN COLORÉ STYLE 3DS ALOLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ÉCRAN HAUT : SCANNER MOTISMA (GAUCHE) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border-4 border-orange-400 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 p-4 sm:p-5 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Visuel Pokémon Alola */}
            <div className="relative size-40 sm:size-48 shrink-0 flex items-center justify-center rounded-2xl border-4 border-orange-400/50 bg-gradient-to-tr from-orange-950/40 to-black p-2 shadow-inner">
              <span className="absolute top-2 left-2 rounded-full bg-orange-500 px-2.5 py-0.5 font-mono text-[9px] font-black text-white">
                ALOLA #{String(pokemonActif.id).padStart(4, "0")}
              </span>
              <Image
                src={pokemonActif.image}
                alt={pokemonActif.nomFr || pokemonActif.nom}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_8px_16px_rgba(249,115,22,0.4)] transition-transform duration-200 hover:scale-105"
              />
            </div>

            {/* Identité */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-orange-200 tracking-tight">
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

              {/* Mensurations */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/50 border border-orange-500/30 p-2 font-mono text-xs">
                <div>
                  <span className="text-gray-400">Taille :</span>{" "}
                  <strong className="text-orange-200">{pokemonActif.taille} m</strong>
                </div>
                <div>
                  <span className="text-gray-400">Poids :</span>{" "}
                  <strong className="text-orange-200">{pokemonActif.poids} kg</strong>
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

          {/* Lore Motisma */}
          <div className="mt-4 rounded-xl border border-orange-400/40 bg-orange-950/20 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-orange-400 tracking-wider">
              DESCRIPTION MOTISMA-DEX :
            </span>
            <p className="mt-1 text-xs sm:text-sm text-gray-100 leading-relaxed italic">
              « {pokemonActif.descriptionFr || "Bzzzt ! Enregistré dans l'encyclopédie d'Alola par le Professeur Euphorbe !"} »
            </p>
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              href={`/pokemon/${encodeURIComponent(pokemonActif.nom)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-400/40 bg-orange-500/20 px-3 py-1 font-mono text-xs font-bold text-orange-200 hover:bg-orange-500/40 transition"
            >
              <span>Voir la fiche d&apos;évolution</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ÉCRAN BAS : LISTE TACTILE ALOLA (DROITE) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-4 border-orange-400 bg-gradient-to-b from-slate-900 via-gray-950 to-slate-900 p-4 shadow-2xl relative min-h-[380px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-orange-300 border-b border-orange-500/20 pb-2">
            <span>TOUCH SCREEN · ALOLA</span>
            <span>INDEX MOTISMA</span>
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
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl border cursor-pointer transition ${
                    estSelectionne
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 border-white text-black font-black shadow-lg shadow-orange-500/30 scale-[1.02]"
                      : "bg-black/50 border-gray-800 text-gray-300 hover:border-orange-400/60"
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
                    <span className="font-mono text-[9px] bg-black text-amber-300 font-black px-2 py-0.5 rounded-full">
                      BZZZT !
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Boutons Alola */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-orange-500/20 font-mono text-xs">
            <button
              type="button"
              onClick={() => changerIndex(-1)}
              className="rounded-xl border border-orange-500/40 bg-black/40 py-2 font-bold text-orange-200 hover:bg-orange-500/20 transition"
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
              className="rounded-xl border border-orange-500/40 bg-black/40 py-2 font-bold text-amber-300 hover:bg-orange-500/20 transition text-[11px]"
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
              className="rounded-xl border border-orange-500/40 bg-black/40 py-2 font-bold text-amber-300 hover:bg-orange-500/20 transition text-[11px]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => changerIndex(1)}
              className="rounded-xl border border-orange-500/40 bg-black/40 py-2 font-bold text-orange-200 hover:bg-orange-500/20 transition"
            >
              SUIV ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
