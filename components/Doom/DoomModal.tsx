"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
};

export default function DoomModal({ ouvert, onFermer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [estPleinEcran, setEstPleinEcran] = useState(false);
  const [keyRecharge, setKeyRecharge] = useState(0);

  // Donner le focus à l'iframe dès l'ouverture
  useEffect(() => {
    if (!ouvert) return;

    const timerFocus = setTimeout(() => {
      try {
        iframeRef.current?.focus();
        iframeRef.current?.contentWindow?.focus();
      } catch {}
    }, 300);

    return () => clearTimeout(timerFocus);
  }, [ouvert, keyRecharge]);

  // Fermeture avec Échap (si pas en plein écran matériel)
  useEffect(() => {
    if (!ouvert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
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

  const recharger = () => {
    setKeyRecharge((prev) => prev + 1);
  };

  if (!ouvert) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="DOOM (1993) WebAssembly Widescreen"
    >
      {/* Barre supérieure style borne d'arcade */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-red-950/70 bg-gradient-to-r from-red-950/90 via-black to-red-950/90 px-3 py-2 sm:px-4">
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
              <span className="rounded bg-red-950 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400 border border-red-800/60">
                PRBOOM WASM · 60 FPS · EN JEU DIRECT
              </span>
            </div>
            <p className="hidden text-xs text-gray-400 md:block">
              « But can it run DOOM? YES. » · Konami Code débloqué
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton recharger */}
          <button
            type="button"
            onClick={recharger}
            title="Recharger le jeu"
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
            {estPleinEcran ? "⛶ Fenêtré" : "⛶ Grand écran"}
          </button>

          {/* Quitter */}
          <button
            type="button"
            onClick={onFermer}
            aria-label="Quitter DOOM et revenir au Pokédex"
            className="rounded-lg bg-red-600 px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95"
          >
            ✕ Quitter
          </button>
        </div>
      </header>

      {/* Guide des touches & Astuces */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-900 bg-black/95 px-3 py-1 text-[11px] font-mono text-gray-400">
        <div className="flex flex-wrap items-center gap-x-4">
          <span>🎮 <strong className="text-gray-200">Cliquez dans le jeu</strong> pour verrouiller la visée souris</span>
          <span>🏃 <strong className="text-gray-200">ZQSD (AZERTY) / WASD / Flèches</strong> : Se déplacer</span>
          <span>💥 <strong className="text-gray-200">Clic gauche / Ctrl</strong> : Tirer</span>
          <span>🚪 <strong className="text-gray-200">Espace</strong> : Ouvrir portes</span>
          <span>⚡ <strong className="text-gray-200">Shift</strong> : Courir</span>
        </div>
        <span className="text-green-400/90 font-medium">
          ✓ Démarrage direct en E1M1 · Zéro démo automatique
        </span>
      </div>

      {/* Zone du jeu : VRAI GRAND ÉCRAN 100% RESPONSIVE */}
      <div
        className="relative flex-1 w-full min-h-0 bg-black flex items-center justify-center overflow-hidden"
        onClick={() => {
          try {
            iframeRef.current?.focus();
            iframeRef.current?.contentWindow?.focus();
          } catch {}
        }}
      >
        <iframe
          key={keyRecharge}
          ref={iframeRef}
          src="/doom/index.html"
          title="DOOM (1993) Wasm Direct Player"
          className="size-full border-0 object-contain shadow-2xl"
          allow="autoplay; fullscreen; gamepad; keyboard"
        />

        {/* Effet cathodique scanlines subtil */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>
    </div>
  );
}
