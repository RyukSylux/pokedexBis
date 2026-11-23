"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
};

const SOURCES_DOOM = [
  {
    id: "wasm",
    nom: "WASM Direct (Recommandé)",
    url: "https://diekmann.github.io/wasm-fizzbuzz/doom/",
    description: "LinuxDoom 1.10 pur WebAssembly · Ultra-rapide & contrôles tactiles intégrés",
  },
  {
    id: "archive",
    nom: "Archive.org (DOSBox)",
    url: "https://archive.org/embed/doom_dos",
    description: "Version originale MS-DOS 1993 émulée",
  },
];

export default function DoomModal({ ouvert, onFermer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [estPleinEcran, setEstPleinEcran] = useState(false);
  const [enChargement, setEnChargement] = useState(true);
  const [keyRecharge, setKeyRecharge] = useState(0);

  const sourceActive = SOURCES_DOOM[sourceIndex];

  useEffect(() => {
    if (!ouvert) return;

    setEnChargement(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onFermer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ouvert, onFermer, sourceIndex, keyRecharge]);

  const basculerPleinEcran = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setEstPleinEcran(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setEstPleinEcran(false);
    }
  };

  const recharger = () => {
    setEnChargement(true);
    setKeyRecharge((prev) => prev + 1);
  };

  if (!ouvert) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Jeu DOOM (1993)"
    >
      {/* Barre supérieure style borne d'arcade */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-red-950/60 bg-gradient-to-r from-red-950/90 via-black to-red-950/90 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-red-600" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm font-extrabold uppercase tracking-wider text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] sm:text-base">
                DOOM (1993)
              </h2>
              <span className="rounded bg-red-950 px-1.5 py-0.5 font-mono text-[10px] text-red-400 border border-red-800/50">
                WASM
              </span>
            </div>
            <p className="hidden text-xs text-gray-400 md:block">
              « But can it run DOOM? YES. » · Konami Code débloqué
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sélecteur de source */}
          <div className="flex items-center rounded-lg border border-gray-800 bg-gray-900/90 p-0.5 text-xs">
            {SOURCES_DOOM.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (sourceIndex !== idx) {
                    setSourceIndex(idx);
                    setEnChargement(true);
                  }
                }}
                className={`rounded-md px-2 py-1 font-mono text-[11px] transition ${
                  sourceIndex === idx
                    ? "bg-red-600 font-bold text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {s.nom.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Bouton recharger */}
          <button
            type="button"
            onClick={recharger}
            title="Recharger le moteur de jeu"
            className="rounded-lg border border-gray-800 bg-gray-900 px-2.5 py-1.5 font-mono text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            🔄
          </button>

          {/* Plein écran */}
          <button
            type="button"
            onClick={basculerPleinEcran}
            aria-label={estPleinEcran ? "Quitter le plein écran" : "Plein écran"}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 font-mono text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            {estPleinEcran ? "⛶ Fenêtré" : "⛶ Plein écran"}
          </button>

          {/* Quitter */}
          <button
            type="button"
            onClick={onFermer}
            aria-label="Quitter DOOM et revenir au Pokédex"
            className="rounded-lg bg-red-600 px-4 py-1.5 font-mono text-xs font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95"
          >
            ✕ Quitter
          </button>
        </div>
      </header>

      {/* Guide des touches & Astuce */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-900 bg-black/90 px-3 py-1.5 text-[11px] font-mono text-gray-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>🎮 <strong className="text-gray-200">Entrée</strong> : Démarrer</span>
          <span>🏃 <strong className="text-gray-200">Flèches</strong> : Déplacement</span>
          <span>💥 <strong className="text-gray-200">Ctrl</strong> : Tirer</span>
          <span>🚪 <strong className="text-gray-200">Espace</strong> : Ouvrir porte</span>
          <span>📱 <strong className="text-gray-200">Tactile</strong> : D-Pad & boutons sur mobile</span>
        </div>
        <span className="text-red-400/90 font-medium">
          💡 Cliquez dans l&apos;écran pour capturer les contrôles
        </span>
      </div>

      {/* Zone du jeu : conteneur de l'émulateur */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {/* Écran de chargement rétro */}
        {enChargement && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 p-4 text-center">
            <div className="size-12 rounded-full border-4 border-red-950 border-t-red-600 animate-spin mb-4" />
            <h3 className="font-mono text-lg font-bold text-red-500 uppercase tracking-widest animate-pulse">
              Initialisation WebAssembly...
            </h3>
            <p className="mt-2 font-mono text-xs text-gray-400 max-w-sm">
              Chargement de {sourceActive.nom} ({sourceActive.description})
            </p>
            <p className="mt-4 font-mono text-[11px] text-gray-500">
              Préparez-vous à affronter les démons de Phobos !
            </p>
          </div>
        )}

        <iframe
          key={`${sourceActive.id}-${keyRecharge}`}
          ref={iframeRef}
          src={sourceActive.url}
          title="DOOM WebAssembly Player"
          className="size-full border-0"
          allow="autoplay; fullscreen; gamepad; keyboard"
          onLoad={() => setEnChargement(false)}
        />

        {/* Effet cathodique scanlines subtil */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />
      </div>
    </div>
  );
}
