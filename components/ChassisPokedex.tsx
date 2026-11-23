"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompteurFavoris from "./CompteurFavoris";
import IndicateurSacoche from "./IndicateurSacoche";
import LogoPokeball from "./LogoPokeball";
import SelecteurModelePokedex from "./selecteur/SelecteurModelePokedex";
import { useModelePokedexStore } from "@/stores/modelePokedex";
import { obtenirModeleParId } from "@/lib/pokedex-modeles";

type Props = {
  children: React.ReactNode;
};

export default function ChassisPokedex({ children }: Props) {
  const [heureActuelle, setHeureActuelle] = useState<string>("");
  const modeleActif = useModelePokedexStore((state) => state.modeleActif);
  const config = obtenirModeleParId(modeleActif);

  useEffect(() => {
    const mettreAJourHeure = () => {
      const m = new Date();
      setHeureActuelle(
        `${String(m.getHours()).padStart(2, "0")}:${String(m.getMinutes()).padStart(2, "0")}`
      );
    };
    mettreAJourHeure();
    const intervalle = setInterval(mettreAJourHeure, 30000);
    return () => clearInterval(intervalle);
  }, []);

  const remonterEnHaut = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const descendreEnBas = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // Styles dynamiques selon le châssis actif
  const obtenirStylesChassis = () => {
    switch (modeleActif) {
      case "hgss":
        return {
          bordure: "border-amber-600/80",
          headerGradient: "from-amber-700 via-red-800 to-amber-950",
          bezelGradient: "from-amber-950 via-slate-900 to-gray-950",
          plaque: "SILPH CO. & PROF. ORME · MODEL HGSS-JOHTO",
          serie: "#2009-JOHTO-KANTO",
          accentTexte: "text-amber-300",
        };
      case "dppt":
        return {
          bordure: "border-blue-600/80",
          headerGradient: "from-blue-700 via-blue-900 to-slate-950",
          bezelGradient: "from-blue-950 via-slate-900 to-gray-950",
          plaque: "PROF. SORBIER · MODEL DPPT-SINNOH",
          serie: "#2006-SINNOH-DS",
          accentTexte: "text-blue-300",
        };
      case "frlg":
        return {
          bordure: "border-red-700/80",
          headerGradient: "from-red-700 via-red-800 to-red-950",
          bezelGradient: "from-red-950 via-gray-900 to-gray-950",
          plaque: "GAME BOY ADVANCE · MODEL FRLG-KANTO",
          serie: "#2004-KANTO-GBA",
          accentTexte: "text-red-300",
        };
      case "kanto":
        return {
          bordure: "border-red-600/80",
          headerGradient: "from-red-600 via-pokedex to-red-900",
          bezelGradient: "from-red-950 via-gray-900 to-black",
          plaque: "SILPH CO. · DEXTER MODEL PKDX-151",
          serie: "#1996-KANTO-ORIGIN",
          accentTexte: "text-emerald-400",
        };
      case "unova":
        return {
          bordure: "border-cyan-600/80",
          headerGradient: "from-gray-950 via-cyan-950 to-gray-950",
          bezelGradient: "from-black via-cyan-950/40 to-black",
          plaque: "PROF. KETTLERIA · MODEL CYBER-UNYS",
          serie: "#2010-UNYS-GEN5",
          accentTexte: "text-cyan-300",
        };
      case "rotom":
        return {
          bordure: "border-orange-500",
          headerGradient: "from-orange-600 via-red-600 to-orange-700",
          bezelGradient: "from-orange-950 via-slate-900 to-gray-950",
          plaque: "PROF. EUPHORBE · ROTOM-DEX ALOLA",
          serie: "#2016-ALOLA-3DS",
          accentTexte: "text-amber-300",
        };
    }
  };

  const styleChassis = obtenirStylesChassis();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-0 sm:p-4 md:p-6 lg:p-8">
      {/* Boîtier Châssis Pokédex */}
      <div
        className={`pokedex-chassis-shell relative flex w-full max-w-6xl flex-col rounded-none sm:rounded-[2.5rem] border-0 sm:border-4 ${styleChassis.bordure} shadow-2xl transition-colors duration-300 overflow-hidden`}
      >
        {/* Bandes de préhension latérales tactiles (Grip) */}
        <div className="absolute left-1.5 top-36 hidden h-48 w-1 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="h-4 w-full rounded-full bg-black/60" />
          ))}
        </div>
        <div className="absolute right-1.5 top-36 hidden h-48 w-1 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="h-4 w-full rounded-full bg-black/60" />
          ))}
        </div>

        {/* 1. TÊTE DE CONTRÔLE MATÉRIELLE DU POKÉDEX */}
        <header
          className={`relative border-b-4 border-black/40 bg-gradient-to-b ${styleChassis.headerGradient} px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-3.5 shadow-md`}
        >
          {/* Ligne 1 : Grand Capteur Bleu, Diodes & HUD Statut & Sélecteur de Modèle */}
          <div className="flex items-center justify-between gap-3">
            {/* Capteur optique & Diodes */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Grand Capteur Optique Bleu avec biseau chromé */}
              <div
                className="relative flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-lg shadow-black/40 cursor-pointer active:scale-95 transition-transform"
                title="Capteur optique Pokédex"
                onClick={remonterEnHaut}
              >
                <div className="pokedex-optical-lens flex size-full items-center justify-center rounded-full animate-pulse">
                  <span className="absolute left-2 top-2 size-3.5 sm:size-4 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>

              {/* Trio de LEDs indicatrices */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className="flex size-3.5 sm:size-4 items-center justify-center rounded-full border border-black/40 bg-red-500 shadow-sm shadow-red-500/80"
                  title="Statut alimentation : ACTIF"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-3.5 sm:size-4 items-center justify-center rounded-full border border-black/40 bg-amber-400 shadow-sm shadow-amber-400/80"
                  title="Base de données : SYNCHRONISÉE"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-3.5 sm:size-4 items-center justify-center rounded-full border border-black/40 bg-emerald-400 shadow-sm shadow-emerald-400/80"
                  title="Réseau PokéAPI : CONNECTÉ"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
              </div>
            </div>

            {/* HUD Statut Système Pokédex & Sélecteur de Châssis */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* SÉLECTEUR DE MODÈLE POKÉDEX (6 MODÈLES) */}
              <SelecteurModelePokedex />

              <div className="hidden sm:flex flex-col items-end font-mono text-[10px] text-white/90 leading-tight">
                <span className="font-extrabold tracking-wider">{config.nom}</span>
                <span className="text-white/70">{config.console} · {heureActuelle || "12:00"}</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-black/40 border border-white/10 px-2 py-1 font-mono text-[11px] font-bold text-white shadow-inner">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                <span className="text-[10px] sm:text-xs">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Ligne 2 : Navigation Pokédex & Accès Rapides */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15">
            <div className="flex items-center">
              <LogoPokeball />
            </div>

            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold">
              <Link
                href="/"
                className="rounded-full bg-black/20 hover:bg-black/35 border border-white/10 px-3 py-1.5 transition text-white active:scale-95 shadow-inner"
              >
                Encyclopédie
              </Link>
              <Link
                href="/favoris"
                className="flex items-center gap-1.5 rounded-full bg-black/20 hover:bg-black/35 border border-white/10 px-3 py-1.5 transition text-white active:scale-95 shadow-inner"
              >
                <span>Favoris</span>
                <CompteurFavoris />
              </Link>
              <Link
                href="/a-propos"
                className="hidden md:inline rounded-full bg-black/20 hover:bg-black/35 border border-white/10 px-3 py-1.5 transition text-white shadow-inner"
              >
                Manuel
              </Link>
              <IndicateurSacoche />
            </nav>
          </div>
        </header>

        {/* 2. CADRE DE L'ÉCRAN NUMÉRIQUE */}
        <div className={`p-2 sm:p-5 md:p-6 bg-gradient-to-b ${styleChassis.bezelGradient}`}>
          <div className="pokedex-bezel-frame relative rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-gray-900/90 p-2 sm:p-4 shadow-2xl overflow-hidden">
            
            {/* Haut-parleurs supérieurs du Bezel */}
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-600/80 shadow-xs" />
                <span className="size-2 rounded-full bg-red-600/80 shadow-xs" />
              </div>

              {/* Grille de haut-parleur */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-4 rounded-full bg-gray-800 border-b border-gray-700/60"
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600">
                <span>⊕</span>
              </div>
            </div>

            {/* 3. DALLE NUMÉRIQUE INTERACTIVE (ÉCRAN DU POKÉDEX) */}
            <main className="pokedex-digital-screen pokedex-scanlines min-h-[65vh] rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-800 p-4 sm:p-6 md:p-8 text-gray-900 dark:text-gray-100 overflow-x-hidden">
              {children}
            </main>

            {/* Voyants inférieurs du Bezel */}
            <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex size-3 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[8px]">
                  ●
                </span>
                <span className="hidden sm:inline text-gray-400">{config.badge}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i} className="h-1 w-5 rounded-full bg-gray-800" />
                ))}
              </div>
              <span>⊕</span>
            </div>
          </div>
        </div>

        {/* 4. CONSOLE DE COMMANDES PHYSIQUES INFÉRIEURES */}
        <footer className="border-t-4 border-black/40 bg-gradient-to-b from-gray-900 via-gray-950 to-black px-4 py-3 sm:px-6 sm:py-4 text-white shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Croix directionnelle (D-Pad) */}
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 rounded-full bg-gray-950 p-1 shadow-md border border-gray-800 flex items-center justify-center">
                <div className="relative size-10">
                  <button
                    type="button"
                    onClick={remonterEnHaut}
                    title="Défiler vers le haut"
                    aria-label="Défiler vers le haut"
                    className="absolute top-0 left-3 flex size-4 items-center justify-center rounded-t-sm bg-gray-800 text-[8px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={descendreEnBas}
                    title="Défiler vers le bas"
                    aria-label="Défiler vers le bas"
                    className="absolute bottom-0 left-3 flex size-4 items-center justify-center rounded-b-sm bg-gray-800 text-[8px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    title="Page précédente"
                    aria-label="Page précédente"
                    className="absolute left-0 top-3 flex size-4 items-center justify-center rounded-l-sm bg-gray-800 text-[8px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.forward()}
                    title="Page suivante"
                    aria-label="Page suivante"
                    className="absolute right-0 top-3 flex size-4 items-center justify-center rounded-r-sm bg-gray-800 text-[8px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▶
                  </button>
                  <div className="absolute left-3 top-3 size-4 bg-gray-850" />
                </div>
              </div>

              <div className="hidden sm:flex flex-col font-mono text-[10px] text-gray-400">
                <span className="font-bold text-white">CONTRÔLE PHYSIQUE</span>
                <span>CHÂSSIS {config.nomCourt}</span>
              </div>
            </div>

            {/* Boutons d'action matériels (A / B / Sacoche) */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex h-8 items-center rounded-full bg-blue-600 px-3.5 font-mono text-xs font-extrabold text-white shadow-md border-b-2 border-blue-900 active:translate-y-0.5 transition"
                title="Bouton A : Index Pokédex"
              >
                A · INDEX
              </Link>
              <Link
                href="/sacoche"
                className="flex h-8 items-center rounded-full bg-emerald-600 px-3.5 font-mono text-xs font-extrabold text-white shadow-md border-b-2 border-emerald-900 active:translate-y-0.5 transition"
                title="Bouton B : Sacoche dresseur"
              >
                B · ÉQUIPE
              </Link>
            </div>

            {/* Plaque d'immatriculation du modèle Pokédex */}
            <div className="text-right font-mono text-[10px] text-gray-400">
              <p className="font-bold text-white">{styleChassis.plaque}</p>
              <p className="text-[9px]">{styleChassis.serie}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
