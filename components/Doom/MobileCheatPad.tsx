"use client";

import { SEQUENCE_KONAMI } from "./useKonami";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
  onTouche: (touche: string) => void;
  progression: number;
};

export default function MobileCheatPad({
  ouvert,
  onFermer,
  onTouche,
  progression,
}: Props) {
  if (!ouvert) return null;

  const presser = (touche: string) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // Ignorer si vibration non autorisée
      }
    }
    onTouche(touche);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-xs sm:items-center">
      <div className="relative w-full max-w-sm rounded-3xl border-2 border-gray-700 bg-gray-900 p-6 text-white shadow-2xl">
        {/* Header de la manette */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
              Cheat Controller
            </span>
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer la manette"
            className="rounded-full bg-gray-800 p-1.5 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Indicateur de la séquence Konami */}
        <div className="my-4 flex flex-col items-center gap-1.5">
          <p className="font-mono text-[11px] text-gray-400">
            Séquence : ↑ ↑ ↓ ↓ ← → ← → B A
          </p>
          <div className="flex gap-1.5">
            {SEQUENCE_KONAMI.map((_, i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full transition-all duration-150 ${
                  i < progression
                    ? "bg-green-500 scale-125 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Corps de la manette (D-Pad + Boutons B / A) */}
        <div className="flex items-center justify-between pt-2">
          {/* D-Pad */}
          <div className="relative grid size-32 grid-cols-3 grid-rows-3 gap-1">
            <div />
            <button
              type="button"
              onClick={() => presser("ArrowUp")}
              aria-label="Haut"
              className="flex items-center justify-center rounded-t-lg bg-gray-800 text-lg font-bold transition active:bg-gray-700 active:scale-95 shadow-md"
            >
              ▲
            </button>
            <div />

            <button
              type="button"
              onClick={() => presser("ArrowLeft")}
              aria-label="Gauche"
              className="flex items-center justify-center rounded-l-lg bg-gray-800 text-lg font-bold transition active:bg-gray-700 active:scale-95 shadow-md"
            >
              ◀
            </button>
            <div className="bg-gray-800 flex items-center justify-center">
              <span className="size-2 rounded-full bg-gray-950" />
            </div>
            <button
              type="button"
              onClick={() => presser("ArrowRight")}
              aria-label="Droite"
              className="flex items-center justify-center rounded-r-lg bg-gray-800 text-lg font-bold transition active:bg-gray-700 active:scale-95 shadow-md"
            >
              ▶
            </button>

            <div />
            <button
              type="button"
              onClick={() => presser("ArrowDown")}
              aria-label="Bas"
              className="flex items-center justify-center rounded-b-lg bg-gray-800 text-lg font-bold transition active:bg-gray-700 active:scale-95 shadow-md"
            >
              ▼
            </button>
            <div />
          </div>

          {/* Boutons B et A */}
          <div className="flex items-center gap-4 rotate-[-15deg] pr-2">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => presser("b")}
                aria-label="Bouton B"
                className="size-13 rounded-full bg-red-600 text-lg font-extrabold text-white shadow-lg transition active:scale-90 active:bg-red-700 flex items-center justify-center"
              >
                B
              </button>
              <span className="mt-1 font-mono text-[10px] text-gray-400">B</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => presser("a")}
                aria-label="Bouton A"
                className="size-13 rounded-full bg-red-600 text-lg font-extrabold text-white shadow-lg transition active:scale-90 active:bg-red-700 flex items-center justify-center"
              >
                A
              </button>
              <span className="mt-1 font-mono text-[10px] text-gray-400">A</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-gray-500">
          Astuce : vous pouvez aussi brancher un clavier et taper le code !
        </p>
      </div>
    </div>
  );
}
