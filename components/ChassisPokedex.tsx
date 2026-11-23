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
    <div className="flex h-full h-[100dvh] max-h-[100dvh] flex-col items-center justify-center p-0 sm:p-1.5 md:p-2 bg-slate-950 overflow-hidden select-none">
      {/* Boîtier Châssis Pokédex Plein Écran (100dvh sans scroll de page) */}
      <div className="pokedex-chassis-shell relative flex w-full max-w-7xl lg:max-w-[1440px] h-full max-h-[100dvh] flex-col rounded-none sm:rounded-[2rem] border-0 sm:border-4 border-blue-600/90 shadow-2xl overflow-hidden bg-slate-950">
        
        {/* Bandes de préhension latérales tactiles (Grip) */}
        <div className="absolute left-1.5 top-28 hidden h-48 w-1.5 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="h-4 w-full rounded-full bg-black/70 shadow-xs" />
          ))}
        </div>
        <div className="absolute right-1.5 top-28 hidden h-48 w-1.5 flex-col justify-between sm:flex opacity-60">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="h-4 w-full rounded-full bg-black/70 shadow-xs" />
          ))}
        </div>

        {/* 1. TÊTE DE CONTRÔLE MATÉRIELLE DU POKÉDEX (COMPACTE & SANS SCROLL) */}
        <header className="shrink-0 relative border-b-2 sm:border-b-4 border-blue-950 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-950 px-3 py-1.5 sm:px-5 sm:py-2 shadow-md">
          <div className="flex items-center justify-between gap-3">
            
            {/* Côté Gauche : Capteur optique, Diodes & Logo Pokeball */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Grand Capteur Optique Bleu */}
              <div
                className="relative flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-full border-3 border-white bg-slate-200 shadow-lg shadow-black/40 cursor-pointer active:scale-95 transition-transform"
                title="Capteur optique Pokédex"
                onClick={remonterEnHaut}
              >
                <div className="pokedex-optical-lens flex size-full items-center justify-center rounded-full animate-pulse">
                  <span className="absolute left-1 top-1 size-2.5 sm:size-3 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>

              {/* Trio de LEDs indicatrices */}
              <div className="flex items-center gap-1.5">
                <div
                  className="flex size-2.5 sm:size-3 items-center justify-center rounded-full border border-black/40 bg-red-500 shadow-sm shadow-red-500/80"
                  title="Statut alimentation"
                >
                  <span className="size-0.5 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-2.5 sm:size-3 items-center justify-center rounded-full border border-black/40 bg-amber-400 shadow-sm shadow-amber-400/80"
                  title="Base de données synchronisée"
                >
                  <span className="size-0.5 rounded-full bg-white/80" />
                </div>
                <div
                  className="flex size-2.5 sm:size-3 items-center justify-center rounded-full border border-black/40 bg-emerald-400 shadow-sm shadow-emerald-400/80"
                  title="Système connecté"
                >
                  <span className="size-0.5 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Logo Pokeball */}
              <div className="hidden sm:flex pl-2 border-l border-blue-400/30">
                <LogoPokeball />
              </div>
            </div>

            {/* Côté Droit : Navigation Pokédex épurée */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold">
              <Link
                href="/"
                className="rounded-full bg-black/30 hover:bg-black/50 border border-white/10 px-3 py-1 transition text-white active:scale-95 shadow-inner"
              >
                Encyclopédie
              </Link>
              <Link
                href="/favoris"
                className="flex items-center gap-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 px-3 py-1 transition text-white active:scale-95 shadow-inner"
              >
                <span>Favoris</span>
                <CompteurFavoris />
              </Link>
              <IndicateurSacoche />
            </nav>
          </div>
        </header>

        {/* 2. CADRE DE L'ÉCRAN NUMÉRIQUE (BEZEL METALLIQUE DS) */}
        <div className="flex-1 min-h-0 flex flex-col p-1 sm:p-2 md:p-2.5 bg-gradient-to-b from-blue-950 via-slate-900 to-gray-950 overflow-hidden">
          <div className="pokedex-bezel-frame relative flex-1 min-h-0 flex flex-col rounded-xl sm:rounded-2xl border-2 sm:border-3 border-gray-900/90 p-1.5 sm:p-2.5 shadow-2xl overflow-hidden bg-black/40">
            
            {/* Haut-parleurs et vis de fixation */}
            <div className="shrink-0 flex items-center justify-between px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-blue-500/80 shadow-xs" />
                <span className="size-1.5 rounded-full bg-blue-500/80 shadow-xs" />
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <span
                    key={i}
                    className="h-1 w-3 sm:w-4 rounded-full bg-gray-800 border-b border-gray-700/60"
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <span>⊕</span>
              </div>
            </div>

            {/* 3. DALLE NUMÉRIQUE INTERACTIVE (ÉCRAN DU POKÉDEX) */}
            <main className="pokedex-digital-screen pokedex-scanlines flex-1 min-h-0 flex flex-col rounded-lg sm:rounded-xl border border-gray-800 p-2 sm:p-3 text-gray-100 overflow-hidden">
              {children}
            </main>

            {/* Fentes et voyants inférieurs du Bezel */}
            <div className="shrink-0 flex items-center justify-between px-1 pt-1 text-[9px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="flex size-2.5 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-[7px]">
                  ●
                </span>
                <span className="text-gray-400">POKÉDEX SINNOH DS · PLEIN ÉCRAN</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i} className="h-0.5 w-4 rounded-full bg-gray-800" />
                ))}
              </div>
              <span>⊕</span>
            </div>
          </div>
        </div>

        {/* 4. CONSOLE DE COMMANDES PHYSIQUES INFÉRIEURES */}
        <footer className="shrink-0 border-t-2 sm:border-t-3 border-blue-950 bg-gradient-to-b from-gray-950 via-slate-900 to-black px-3 py-1.5 sm:px-5 sm:py-2 text-white shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Croix directionnelle (D-Pad) */}
            <div className="flex items-center gap-2.5">
              <div className="relative size-11 sm:size-12 shrink-0 rounded-full bg-gray-950 p-1 shadow-md border border-gray-800 flex items-center justify-center">
                <div className="relative size-8">
                  <button
                    type="button"
                    onClick={remonterEnHaut}
                    title="Défiler vers le haut"
                    aria-label="Défiler vers le haut"
                    className="absolute top-0 left-2.5 flex size-3 items-center justify-center rounded-t-sm bg-gray-800 text-[7px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={descendreEnBas}
                    title="Défiler vers le bas"
                    aria-label="Défiler vers le bas"
                    className="absolute bottom-0 left-2.5 flex size-3 items-center justify-center rounded-b-sm bg-gray-800 text-[7px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    title="Page précédente"
                    aria-label="Page précédente"
                    className="absolute left-0 top-2.5 flex size-3 items-center justify-center rounded-l-sm bg-gray-800 text-[7px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.forward()}
                    title="Page suivante"
                    aria-label="Page suivante"
                    className="absolute right-0 top-2.5 flex size-3 items-center justify-center rounded-r-sm bg-gray-800 text-[7px] font-bold text-gray-400 hover:bg-gray-700 active:bg-gray-600"
                  >
                    ▶
                  </button>
                  <div className="absolute left-2.5 top-2.5 size-3 bg-gray-850" />
                </div>
              </div>

              <div className="hidden sm:flex flex-col font-mono text-[9px] text-blue-200">
                <span className="font-bold text-white">DS TOUCH SYSTEM</span>
                <span className="text-blue-300/80">JOG-DIAL SINNOH</span>
              </div>
            </div>

            {/* Boutons d'action matériels (A / B) */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex h-7 items-center rounded-full bg-blue-600 px-3 font-mono text-[11px] font-extrabold text-white shadow-md border-b-2 border-blue-900 active:translate-y-0.5 transition"
                title="Bouton A : Index Pokédex"
              >
                A · INDEX
              </Link>
              <Link
                href="/sacoche"
                className="flex h-7 items-center rounded-full bg-emerald-600 px-3 font-mono text-[11px] font-extrabold text-white shadow-md border-b-2 border-emerald-900 active:translate-y-0.5 transition"
                title="Bouton B : Sacoche dresseur"
              >
                B · ÉQUIPE
              </Link>
            </div>

            {/* Plaque d'immatriculation Sinnoh */}
            <div className="text-right font-mono text-[9px] text-blue-200/80">
              <p className="font-bold text-white">PROF. SORBIER · MODEL DPPT-SINNOH</p>
              <p className="text-[8px]">DS FULLSCREEN ENGINE</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
