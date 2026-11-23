"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BadgeType from "./BadgeType";
import { TYPES } from "@/lib/types";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
  slotCible?: number | null;
};

export default function ModalRecrutement({ ouvert, onFermer, slotCible }: Props) {
  const equipe = useSacoche((etat) => etat.equipe);
  const ajouter = useSacoche((etat) => etat.ajouter);

  const [recherche, setRecherche] = useState("");
  const [typeSelectionne, setTypeSelectionne] = useState("");
  const [resultats, setResultats] = useState<Pokemon[]>([]);
  const [chargement, setChargement] = useState(false);
  const [messageSucces, setMessageSucces] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const estPleine = equipe.length >= TAILLE_SACOCHE;
  const idsEquipe = equipe.map((m) => m.id);

  // Charger les résultats lors de l'ouverture ou du changement de filtres
  useEffect(() => {
    if (!ouvert) {
      setRecherche("");
      setTypeSelectionne("");
      setMessageSucces(null);
      return;
    }

    // Focus automatique sur le champ de recherche
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const charger = async () => {
      setChargement(true);
      try {
        const params = new URLSearchParams();
        if (recherche.trim()) params.set("q", recherche.trim());
        if (typeSelectionne) params.set("type", typeSelectionne);

        const res = await fetch(`/api/recrutement?${params.toString()}`);
        if (res.ok) {
          const data = (await res.json()) as { pokemons: Pokemon[] };
          setResultats(data.pokemons || []);
        }
      } catch (err) {
        console.error("Erreur de chargement des recrues:", err);
      } finally {
        setChargement(false);
      }
    };

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(charger, 250);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [ouvert, recherche, typeSelectionne]);

  // Fermeture par touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ouvert) {
        onFermer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  const handleRecruter = (pokemon: Pokemon) => {
    if (estPleine || idsEquipe.includes(pokemon.id)) return;
    ajouter(pokemon);
    setMessageSucces(`${pokemon.nom.toUpperCase()} a rejoint l'équipe !`);
    setTimeout(() => {
      setMessageSucces(null);
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-modal-recrutement"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onFermer}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border-2 border-red-500/30 bg-gray-900 text-white shadow-2xl shadow-red-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bandeau d'en-tête façon Pokédex */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-gradient-to-r from-red-700 via-pokedex to-red-800 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full border border-white/60 bg-blue-500 shadow-sm shadow-blue-400">
              <span className="size-2 rounded-full bg-white" />
            </span>
            <div>
              <h2
                id="titre-modal-recrutement"
                className="text-base font-extrabold tracking-tight text-white flex items-center gap-2"
              >
                <span>Recrutement Direct In-Situ</span>
                {slotCible && (
                  <span className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-xs text-red-200">
                    Slot #{String(slotCible).padStart(2, "0")}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-red-100">
                Équipe actuelle : {equipe.length}/{TAILLE_SACOCHE} membres
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer le modal"
            className="flex size-8 items-center justify-center rounded-full bg-black/20 text-white/80 hover:bg-black/40 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Alerte succès temporaire */}
        {messageSucces && (
          <div className="bg-emerald-600 px-4 py-2 text-center text-xs font-bold text-white transition-all animate-in slide-in-from-top-2">
            ✓ {messageSucces}
          </div>
        )}

        {/* Zone de recherche & Filtres */}
        <div className="space-y-2.5 border-b border-gray-800 bg-gray-950/80 p-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher par nom (FR ou EN) ou numéro #ID..."
              className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-2.5 pl-10 text-sm font-semibold text-white placeholder-gray-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <span className="absolute left-3.5 top-3 text-sm text-gray-500">🔍</span>
            {recherche && (
              <button
                type="button"
                onClick={() => setRecherche("")}
                className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtres de types rapides */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setTypeSelectionne("")}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition border ${
                !typeSelectionne
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-200"
              }`}
            >
              Tous
            </button>
            {Object.keys(TYPES).map((typeKey) => {
              const actif = typeSelectionne === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setTypeSelectionne(actif ? "" : typeKey)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition border ${
                    actif
                      ? "bg-red-600 text-white border-red-500 scale-105"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-200"
                  }`}
                >
                  {TYPES[typeKey].libelle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des Pokémon trouvés */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-64 max-h-[50vh]">
          {chargement ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
              <span className="size-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              <p className="text-xs">Scan du Pokédex en cours...</p>
            </div>
          ) : resultats.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-1">
              <p className="text-2xl">📡</p>
              <p className="text-sm font-semibold">Aucun Pokémon trouvé pour ces critères</p>
              <p className="text-xs">Essayez un autre nom, type ou identifiant.</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {resultats.map((p) => {
                const estDansEquipe = idsEquipe.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition ${
                      estDansEquipe
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-gray-800 bg-gray-900/90 hover:border-gray-700 hover:bg-gray-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-gray-950/60 p-1">
                        <Image
                          src={p.image}
                          alt={p.nom}
                          width={48}
                          height={48}
                          className="drop-shadow"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-gray-500">
                            #{String(p.id).padStart(3, "0")}
                          </span>
                          <h4 className="truncate text-sm font-extrabold capitalize text-white">
                            {p.nomFr || p.nom}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.types.map((type) => (
                            <BadgeType key={type} type={type} taille="sm" />
                          ))}
                        </div>
                        {p.bst && (
                          <p className="font-mono text-[10px] text-gray-400">
                            Puissance : <strong className="text-gray-300">{p.bst} BST</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={estDansEquipe || estPleine}
                      onClick={() => handleRecruter(p)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                        estDansEquipe
                          ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 cursor-default"
                          : estPleine
                          ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-red-600/30"
                      }`}
                    >
                      {estDansEquipe ? "✓ Équipe" : estPleine ? "Plein" : "+ Recruter"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied de modal avec résumé */}
        <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-5 py-3 text-xs text-gray-400">
          <span>
            {TAILLE_SACOCHE - equipe.length} place
            {TAILLE_SACOCHE - equipe.length > 1 ? "s" : ""} restante
            {TAILLE_SACOCHE - equipe.length > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={onFermer}
            className="rounded-xl border border-gray-700 px-3.5 py-1 font-semibold text-gray-300 hover:bg-gray-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
