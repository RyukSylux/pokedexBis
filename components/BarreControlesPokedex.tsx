"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { GENERATIONS, obtenirBornesGeneration } from "@/lib/generations";
import { TYPES } from "@/lib/types";
import { jouerBruitageMolette } from "@/lib/roulette";

type Props = {
  total: number;
};

export default function BarreControlesPokedex({ total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [tiroirOuvert, setTiroirOuvert] = useState(false);

  // Valeurs actuelles des paramètres
  const qActuel = searchParams.get("q") ?? "";
  const typeActuel = searchParams.get("type") ?? "";
  const genActuelle = searchParams.get("gen") ?? "";
  const vueActuelle = searchParams.get("vue") ?? "";
  const estModeGrille = vueActuelle === "grille";

  const [rechercheLocale, setRechercheLocale] = useState(qActuel);

  // Synchronisation avec les searchParams
  useEffect(() => {
    setRechercheLocale(qActuel);
  }, [qActuel]);

  // Debounce de recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rechercheLocale.trim() === qActuel.trim()) return;
      const params = new URLSearchParams(searchParams.toString());
      if (rechercheLocale.trim()) {
        params.set("q", rechercheLocale.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [rechercheLocale, qActuel, pathname, router, searchParams]);

  // Nombre de filtres actifs (hors recherche)
  const filtresActifsCount = (typeActuel ? 1 : 0) + (genActuelle ? 1 : 0);

  // Mettre à jour un paramètre
  const appliquerFiltre = (cle: "type" | "gen" | "vue", valeur: string) => {
    jouerBruitageMolette();
    const params = new URLSearchParams(searchParams.toString());
    if (valeur) {
      params.set(cle, valeur);
    } else {
      params.delete(cle);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Réinitialiser tous les filtres
  const reinitialiserTout = () => {
    jouerBruitageMolette();
    setRechercheLocale("");
    const params = new URLSearchParams();
    if (estModeGrille) params.set("vue", "grille");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const bornesGen = genActuelle ? obtenirBornesGeneration(genActuelle) : null;
  const regionActiveObj = GENERATIONS.find(
    (g) => g.cle.toLowerCase() === genActuelle.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* 1. BARRE DE COMMANDE PRINCIPALE (ULTRA-COMPACTE SUR MOBILE ET DESKTOP) */}
      <div className="flex items-center gap-2 w-full">
        
        {/* Champ de recherche avec look console DS */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={rechercheLocale}
            onChange={(e) => setRechercheLocale(e.target.value)}
            placeholder="Rechercher (ex: Lucario, Tiplouf, #390)..."
            aria-label="Rechercher un Pokémon"
            className="w-full rounded-xl border border-blue-500/40 bg-black/60 py-2 pl-9 pr-8 text-xs font-semibold text-white shadow-inner placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          {rechercheLocale && (
            <button
              type="button"
              onClick={() => setRechercheLocale("")}
              title="Effacer la recherche"
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bouton Filtres Tactile (Remplace les affreuses combo box !) */}
        <button
          type="button"
          onClick={() => {
            jouerBruitageMolette();
            setTiroirOuvert(true);
          }}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs font-bold transition shadow-sm shrink-0 active:scale-95 ${
            filtresActifsCount > 0
              ? "border-blue-400 bg-blue-600 text-white shadow-blue-500/40"
              : "border-blue-500/30 bg-black/50 text-blue-200 hover:bg-blue-950/60 hover:border-blue-400/60"
          }`}
          title="Ouvrir les filtres par région et type"
          aria-expanded={tiroirOuvert}
        >
          <span>⚡</span>
          <span className="hidden sm:inline">FILTRES</span>
          {filtresActifsCount > 0 && (
            <span className="size-4.5 rounded-full bg-white text-blue-900 font-black text-[10px] flex items-center justify-center">
              {filtresActifsCount}
            </span>
          )}
        </button>

        {/* Bascule de Vue (Molette DS / Grille) */}
        <div
          role="radiogroup"
          aria-label="Mode d'affichage du Pokédex"
          className="flex items-center rounded-xl border border-blue-500/30 bg-black/50 p-0.5 shrink-0"
        >
          <button
            type="button"
            role="radio"
            aria-checked={!estModeGrille}
            onClick={() => appliquerFiltre("vue", "")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              !estModeGrille
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
            title="Vue Poké-Molette DS"
          >
            <span>◓</span>
            <span className="hidden md:inline">Molette</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={estModeGrille}
            onClick={() => appliquerFiltre("vue", "grille")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              estModeGrille
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
            title="Vue Grille"
          >
            <span>▦</span>
            <span className="hidden md:inline">Grille</span>
          </button>
        </div>
      </div>

      {/* 2. BANDEAU DE RAPPEL DES FILTRES ACTIFS (SI ACTIFS) */}
      {(filtresActifsCount > 0 || qActuel) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono animate-in fade-in duration-150">
          <span className="text-gray-400 text-[10px]">Actif :</span>

          {regionActiveObj && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/50 bg-blue-950/80 px-2.5 py-0.5 text-blue-200">
              <span>🌍 Région {regionActiveObj.region}{bornesGen ? ` (#${bornesGen.debut}-${bornesGen.fin})` : ""}</span>
              <button
                type="button"
                onClick={() => appliquerFiltre("gen", "")}
                className="hover:text-white ml-0.5 font-bold"
                title="Supprimer le filtre de région"
              >
                ✕
              </button>
            </span>
          )}

          {typeActuel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/50 bg-blue-950/80 px-2.5 py-0.5 text-blue-200">
              <span>⚡ Type {TYPES[typeActuel]?.libelle || typeActuel}</span>
              <button
                type="button"
                onClick={() => appliquerFiltre("type", "")}
                className="hover:text-white ml-0.5 font-bold"
                title="Supprimer le filtre de type"
              >
                ✕
              </button>
            </span>
          )}

          {qActuel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/50 bg-blue-950/80 px-2.5 py-0.5 text-blue-200">
              <span>🔍 « {qActuel} »</span>
              <button
                type="button"
                onClick={() => setRechercheLocale("")}
                className="hover:text-white ml-0.5 font-bold"
                title="Effacer la recherche"
              >
                ✕
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={reinitialiserTout}
            className="text-[10px] text-red-400 hover:text-red-300 underline font-bold ml-1"
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* 3. TIROIR / BOTTOM SHEET DE FILTRES TACTILE SINNOH (MOBILE & DESKTOP) */}
      {tiroirOuvert && (
        <>
          {/* Backdrop sombre */}
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setTiroirOuvert(false)}
          />

          {/* Panneau Bottom-Sheet mobile / Modal desktop */}
          <div className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-20 sm:bottom-auto z-50 w-auto sm:w-[580px] max-h-[85vh] flex flex-col rounded-3xl border-3 border-blue-500 bg-slate-950 text-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Header du tiroir */}
            <div className="flex items-center justify-between border-b-2 border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-400 animate-ping" />
                <h3 className="font-mono text-xs font-black tracking-wider text-blue-300 uppercase">
                  RADAR SINNOH · FILTRES TACTILES
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTiroirOuvert(false)}
                className="size-7 rounded-full bg-black/50 border border-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Corps défilable sans combo-box */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* SECTION A : RÉGIONS / GÉNÉRATIONS (PAVÉS TACTILES) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-black text-blue-400 tracking-wider">
                    1. SÉLECTION DE LA RÉGION
                  </span>
                  {genActuelle && (
                    <button
                      type="button"
                      onClick={() => appliquerFiltre("gen", "")}
                      className="font-mono text-[10px] text-gray-400 hover:text-white underline"
                    >
                      Toutes les régions
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Bouton Toutes les régions */}
                  <button
                    type="button"
                    onClick={() => appliquerFiltre("gen", "")}
                    className={`col-span-2 sm:col-span-3 flex items-center justify-between px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition ${
                      !genActuelle
                        ? "border-blue-400 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-blue-400/50 hover:bg-gray-800"
                    }`}
                  >
                    <span>🌍 Toutes les régions</span>
                    <span className="text-[10px] opacity-80">1 025 Pokémon</span>
                  </button>

                  {/* 9 Régions */}
                  {GENERATIONS.map((gen) => {
                    const estActive = genActuelle.toLowerCase() === gen.cle.toLowerCase();
                    return (
                      <button
                        key={gen.cle}
                        type="button"
                        onClick={() => appliquerFiltre("gen", gen.cle)}
                        className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition ${
                          estActive
                            ? "border-blue-400 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-blue-400/50 hover:bg-gray-800"
                        }`}
                      >
                        <span className="font-bold text-xs">{gen.region}</span>
                        <span className={`text-[10px] font-mono ${
                          estActive ? "text-blue-100" : "text-gray-400"
                        }`}>
                          #{gen.debut}-{gen.fin}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B : TYPES ÉLÉMENTAIRES (BADGES OFFICIELS TACTILES) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-black text-blue-400 tracking-wider">
                    2. TYPE ÉLÉMENTAIRE
                  </span>
                  {typeActuel && (
                    <button
                      type="button"
                      onClick={() => appliquerFiltre("type", "")}
                      className="font-mono text-[10px] text-gray-400 hover:text-white underline"
                    >
                      Tous les types
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {/* Bouton Tous les types */}
                  <button
                    type="button"
                    onClick={() => appliquerFiltre("type", "")}
                    className={`col-span-3 sm:col-span-4 py-2 rounded-xl border font-mono text-xs font-bold transition text-center ${
                      !typeActuel
                        ? "border-blue-400 bg-blue-600 text-white shadow-md"
                        : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-blue-400/50"
                    }`}
                  >
                    Tous les types (18)
                  </button>

                  {/* Les 18 types avec couleurs officielles */}
                  {Object.entries(TYPES).map(([cle, { libelle, classe }]) => {
                    const estActif = typeActuel.toLowerCase() === cle.toLowerCase();
                    return (
                      <button
                        key={cle}
                        type="button"
                        onClick={() => appliquerFiltre("type", estActif ? "" : cle)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold text-white transition active:scale-95 ${classe} ${
                          estActif
                            ? "ring-4 ring-white border-white scale-[1.03] shadow-lg"
                            : "border-black/30 opacity-80 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                      >
                        <span>{libelle}</span>
                        {estActif && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer du tiroir */}
            <div className="flex items-center justify-between border-t-2 border-blue-500/30 bg-black/60 px-5 py-3">
              <button
                type="button"
                onClick={reinitialiserTout}
                className="font-mono text-xs font-bold text-red-400 hover:text-red-300"
              >
                Réinitialiser
              </button>

              <button
                type="button"
                onClick={() => {
                  jouerBruitageMolette();
                  setTiroirOuvert(false);
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400 px-5 py-2 font-mono text-xs font-black text-white shadow-md active:scale-95 transition"
              >
                SCANNER ({total})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
