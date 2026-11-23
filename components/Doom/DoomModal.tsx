"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
};

export default function DoomModal({ ouvert, onFermer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [estPleinEcran, setEstPleinEcran] = useState(false);

  useEffect(() => {
    if (!ouvert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onFermer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ouvert, onFermer]);

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
      <header className="flex shrink-0 items-center justify-between border-b border-red-950/60 bg-gradient-to-r from-red-950/80 via-black to-red-950/80 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex size-3 rounded-full bg-red-600 animate-ping" />
          <div>
            <h2 className="font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
              DOOM (1993) · Knee-Deep in the Dead
            </h2>
            <p className="hidden text-xs text-gray-400 sm:block">
              Easter Egg débloqué : « But can it run DOOM? YES. »
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide des touches rapide */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-gray-400 font-mono pr-2 border-r border-gray-800">
            <span>Déplacement : <strong className="text-white">Flèches / ZQSD</strong></span>
            <span>Tir : <strong className="text-white">Ctrl</strong></span>
            <span>Ouvrir : <strong className="text-white">Espace</strong></span>
          </div>

          <button
            type="button"
            onClick={basculerPleinEcran}
            aria-label={estPleinEcran ? "Quitter le plein écran" : "Plein écran"}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 font-mono text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            {estPleinEcran ? "⛶ Fenêtré" : "⛶ Plein écran"}
          </button>

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

      {/* Zone du jeu : émulateur WebAssembly DOOM plein écran */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <iframe
          src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos"
          title="DOOM (1993) Player"
          className="size-full border-0"
          allow="autoplay; fullscreen; gamepad; keyboard"
        />

        {/* Effet cathodique scanlines subtil */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />
      </div>
    </div>
  );
}
