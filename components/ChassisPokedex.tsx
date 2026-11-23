"use client";

import Link from "next/link";
import CompteurFavoris from "./CompteurFavoris";
import IndicateurSacoche from "./IndicateurSacoche";
import LogoPokeball from "./LogoPokeball";

type Props = {
  children: React.ReactNode;
};

export default function ChassisPokedex({ children }: Props) {
  const remonterEnHaut = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const descendreEnBas = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-0 sm:p-2 md:p-4 lg:p-6 bg-slate-950">
      {/* Boîtier Châssis Pokédex Agrandie (Max 1440px) */}
      <div className="pokedex-chassis-shell relative flex w-full max-w-7xl lg:max-w-[1440px] flex-col rounded-none sm:rounded-[2.5rem] border-0 sm:border-4 border-blue-600/90 shadow-2xl transition-all overflow-hidden bg-slate-950">
        
        {/* Bandes de préhension latérales tactiles (Grip) */}
        <div className="absolute left-1.5 top-36 hidden h-64 w-1.5 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="h-5 w-full rounded-full bg-black/70 shadow-xs" />
          ))}
        </div>
        <div className="absolute right-1.5 top-36 hidden h-64 w-1.5 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="h-5 w-full rounded-full bg-black/70 shadow-xs" />
          ))}
        </div>

        {/* 1. TÊTE DE CONTRÔLE MATÉRIELLE DU POKÉDEX (ÉPURÉE, SANS ENCOMBREMENT EN HAUT À DROITE) */}
        <header className="relative border-b-4 border-blue-950 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-950 px-4 py-2.5 sm:px-6 sm:py-3 shadow-md">
          <div className="flex items-center justify-between gap-3">
            
            {/* Côté Gauche : Capteur optique, Diodes & Logo Pokeball */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Grand Capteur Optique Bleu avec biseau chromé */}
              <div
                className="relative flex size-11 sm:size-13 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-lg shadow-black/40 cursor-pointer active:scale-95 transition-transform"
                title="Capteur optique Pokédex"
                onClick={remonterEnHaut}
              >
                <div className="pokedex-optical-lens flex size-full items-center justify-center rounded-full animate-pulse">
                  <span className="absolute left-1.5 top-1.5 size-3 sm:size-3.5 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>

              {/* Trio de LEDs indicatrices */}
              <div className="flex items-center gap-2">
                <div
                  className="flex size-3 sm:size-3.5 items-center justify-center rounded-full border border-black/40 bg-red-500 shadow-sm shadow-red-500/80"
                  title="Statut alimentation"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-3 sm:size-3.5 items-center justify-center rounded-full border border-black/40 bg-amber-400 shadow-sm shadow-amber-400/80"
                  title="Base de données synchronisée"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-3 sm:size-3.5 items-center justify-center rounded-full border border-black/40 bg-emerald-400 shadow-sm shadow-emerald-400/80"
                  title="Système connecté"
                >
                  <span className="size-1 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Logo Pokeball épuré */}
              <div className="hidden sm:flex pl-2 border-l border-blue-400/30">
                <LogoPokeball />
              </div>
            </div>

            {/* Côté Droit : Navigation Pokédex fluide (Plus aucun HUD ni gadget en haut à droite) */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold">
              <Link
                href="/"
                className="rounded-full bg-black/30 hover:bg-black/50 border border-white/10 px-3 py-1.5 transition text-white active:scale-95 shadow-inner"
              >
                Encyclopédie
              </Link>
              <Link
                href="/favoris"
                className="flex items-center gap-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 px-3 py-1.5 transition text-white active:scale-95 shadow-inner"
              >
                <span>Favoris</span>
                <CompteurFavoris />
              </Link>
              <IndicateurSacoche />
            </nav>
          </div>
        </header>

        {/* 2. CADRE DE L'ÉCRAN NUMÉRIQUE (BEZEL METALLIQUE DS) */}
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-b from-blue-950 via-slate-900 to-gray-950">
          <div className="pokedex-bezel-frame relative rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-gray-900/90 p-2 sm:p-4 shadow-2xl overflow-hidden bg-black/40">
            
            {/* Haut-parleurs et vis de fixation */}
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500/80 shadow-xs" />
                <span className="size-2 rounded-full bg-blue-500/80 shadow-xs" />
              </div>

              {/* Grille de haut-parleur stéréo DS */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-4 rounded-full bg-gray-800 border-b border-gray-700/60"
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                <span>⊕</span>
              </div>
            </div>

            {/* 3. DALLE NUMÉRIQUE INTERACTIVE (ÉCRAN DU POKÉDEX) */}
            <main className="pokedex-digital-screen pokedex-scanlines min-h-[70vh] rounded-xl sm:rounded-2xl border border-gray-800 p-3 sm:p-5 md:p-6 text-gray-100 overflow-x-hidden">
              {children}
            </main>

            {/* Fentes et voyants inférieurs du Bezel */}
            <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex size-3 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-[8px]">
                  ●
                </span>
                <span className="text-gray-400">POKÉDEX SINNOH · DOUBLE ÉCRAN ACTIF</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="h-1 w-5 rounded-full bg-gray-800" />
                ))}
              </div>
              <span>⊕</span>
            </div>
          </div>
        </div>

        {/* 4. CONSOLE DE COMMANDES PHYSIQUES INFÉRIEURES */}
        <footer className="border-t-4 border-blue-950 bg-gradient-to-b from-gray-950 via-slate-900 to-black px-4 py-3 sm:px-6 sm:py-4 text-white shadow-inner">
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

              <div className="hidden sm:flex flex-col font-mono text-[10px] text-blue-200">
                <span className="font-bold text-white">NINTENDO DS TOUCH SYSTEM</span>
                <span className="text-blue-300/80">JOG-DIAL MÉCANIQUE</span>
              </div>
            </div>

            {/* Boutons d'action matériels (A / B / Sacoche) */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex h-8 items-center rounded-full bg-blue-600 px-4 font-mono text-xs font-extrabold text-white shadow-md border-b-2 border-blue-900 active:translate-y-0.5 transition"
                title="Bouton A : Index Pokédex"
              >
                A · ENCYCLOPÉDIE
              </Link>
              <Link
                href="/sacoche"
                className="flex h-8 items-center rounded-full bg-emerald-600 px-4 font-mono text-xs font-extrabold text-white shadow-md border-b-2 border-emerald-900 active:translate-y-0.5 transition"
                title="Bouton B : Sacoche dresseur"
              >
                B · SACOCHE & ÉQUIPE
              </Link>
            </div>

            {/* Plaque d'immatriculation Sinnoh */}
            <div className="text-right font-mono text-[10px] text-blue-200/80">
              <p className="font-bold text-white">PROF. SORBIER · MODEL DPPT-SINNOH</p>
              <p className="text-[9px]">SÉRIE : #2006-SINNOH-DS</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
