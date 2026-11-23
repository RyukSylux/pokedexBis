"use client";

import { useState } from "react";
import {
  MODELES_POKEDEX,
  ModelePokedexId,
  obtenirModeleParId,
} from "@/lib/pokedex-modeles";
import { useModelePokedexStore } from "@/stores/modelePokedex";

export default function SelecteurModelePokedex() {
  const { modeleActif, definirModele } = useModelePokedexStore();
  const [estOuvert, setEstOuvert] = useState(false);

  const modeleCourant = obtenirModeleParId(modeleActif);

  const changerModele = (id: ModelePokedexId) => {
    definirModele(id);
    setEstOuvert(false);
  };

  return (
    <div className="relative">
      {/* Bouton principal de sélection de modèle */}
      <button
        type="button"
        onClick={() => setEstOuvert(!estOuvert)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-inner backdrop-blur-sm transition hover:bg-black/60 active:scale-95"
        title="Changer de modèle de Pokédex (6 modèles disponibles)"
        aria-expanded={estOuvert}
      >
        <span
          className="size-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: modeleCourant.couleurAccent }}
        />
        <span className="hidden sm:inline text-white/70">CHÂSSIS :</span>
        <span className="text-amber-300 font-extrabold">{modeleCourant.nomCourt}</span>
        <span className="text-[10px] text-white/60">▼</span>
      </button>

      {/* Modal / Tiroir de sélection des 6 modèles */}
      {estOuvert && (
        <>
          {/* Overlay de fermeture */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            onClick={() => setEstOuvert(false)}
          />

          <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 z-50 w-[95vw] sm:w-[420px] max-w-lg rounded-2xl border-2 border-red-500/50 bg-gray-950/95 p-4 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-mono text-xs font-black tracking-wider text-red-400 uppercase">
                  Sélecteur de Châssis Pokédex (6 Modèles)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEstOuvert(false)}
                className="size-6 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Sélectionnez un châssis authentique pour transformer instantanément l&apos;apparence, l&apos;écran et la mécanique de votre Pokédex :
            </p>

            <div className="mt-3 flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {MODELES_POKEDEX.map((mod) => {
                const estSelectionne = mod.id === modeleActif;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => changerModele(mod.id)}
                    className={`flex flex-col gap-1 rounded-xl border p-2.5 text-left transition ${
                      estSelectionne
                        ? "border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10"
                        : "border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: mod.couleurAccent }}
                        />
                        <span className="font-extrabold text-sm text-white">
                          {mod.nom}
                        </span>
                      </div>
                      <span className="rounded-full bg-black/40 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                        {mod.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                      <span>{mod.console}</span>
                      <span>·</span>
                      <span>{mod.generation} ({mod.annee})</span>
                    </div>

                    <p className="text-[11px] text-gray-300 line-clamp-2">
                      <strong className="text-amber-200">Mécanique :</strong> {mod.mecanique}
                    </p>

                    {estSelectionne && (
                      <span className="mt-1 text-[10px] font-bold text-emerald-400 font-mono">
                        ✓ Châssis actif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Changement instantané sans rechargement</span>
              <span className="text-emerald-400 font-bold">1 025 POKÉMON DISPONIBLES</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
