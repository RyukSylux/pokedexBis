"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnalyseurEquipe from "@/components/AnalyseurEquipe";
import BadgeType from "@/components/BadgeType";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

export default function PageSacoche() {
  const equipe = useSacoche((etat) => etat.equipe);
  const retirer = useSacoche((etat) => etat.retirer);
  const renommer = useSacoche((etat) => etat.renommer);
  const deplacer = useSacoche((etat) => etat.deplacer);
  const vider = useSacoche((etat) => etat.vider);

  const [confirmerVider, setConfirmerVider] = useState(false);
  const [slotEnEdition, setSlotEnEdition] = useState<number | null>(null);
  const [valeurSurnom, setValeurSurnom] = useState("");

  const typesCouverts = [...new Set(equipe.flatMap((membre) => membre.types))];
  const emplacementsLibres = Math.max(0, TAILLE_SACOCHE - equipe.length);

  // Calcul du BST total et moyen
  const bstTotal = equipe.reduce((acc, m) => acc + (m.bst || 0), 0);
  const bstMoyen = equipe.length > 0 ? Math.round(bstTotal / equipe.length) : 0;

  const handleDemarrerEdition = (id: number, surnomActuel: string, nomDefaut: string) => {
    setSlotEnEdition(id);
    setValeurSurnom(surnomActuel || nomDefaut);
  };

  const handleSauvegarderSurnom = (id: number) => {
    renommer(id, valeurSurnom);
    setSlotEnEdition(null);
  };

  const handleVider = () => {
    if (confirmerVider) {
      vider();
      setConfirmerVider(false);
    } else {
      setConfirmerVider(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête de la Sacoche & Résumé tactique */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-black/5 bg-gradient-to-r from-red-600/10 via-white to-red-600/5 p-6 shadow-xs dark:border-white/10 dark:from-red-950/30 dark:via-gray-900 dark:to-red-950/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-pokedex text-white shadow-md shadow-pokedex/30">
              🎒
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Équipe de Combat & Sacoche
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Gérez vos 6 compagnons actifs, réorganisez leur ordre et personnalisez leurs surnoms.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton Vider la sacoche avec sécurité */}
        {equipe.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmerVider ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVider}
                  className="rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 active:scale-95 transition"
                >
                  ✓ Confirmer vidage
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmerVider(false)}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVider}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 hover:border-red-300 hover:text-red-600 transition shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400"
              >
                🗑️ Vider l&apos;équipe
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cartouche des compteurs globaux */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Composition
          </span>
          <p className="mt-1 font-mono text-xl font-extrabold text-gray-900 dark:text-white">
            {equipe.length}{" "}
            <span className="text-xs font-normal text-gray-400">/ {TAILLE_SACOCHE}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Types couverts
          </span>
          <p className="mt-1 font-mono text-xl font-extrabold text-pokedex">
            {typesCouverts.length}{" "}
            <span className="text-xs font-normal text-gray-400">/ 18 types</span>
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            BST Cumulé
          </span>
          <p className="mt-1 font-mono text-xl font-extrabold text-gray-900 dark:text-white">
            {bstTotal > 0 ? bstTotal.toLocaleString() : "—"}{" "}
            <span className="text-xs font-normal text-gray-400">pts</span>
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Puissance moyenne
          </span>
          <p className="mt-1 font-mono text-xl font-extrabold text-gray-900 dark:text-white">
            {bstMoyen > 0 ? bstMoyen : "—"}{" "}
            <span className="text-xs font-normal text-gray-400">BST / Pokémon</span>
          </p>
        </div>
      </div>

      {/* Barre des types couverts avec badges */}
      {typesCouverts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-900">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
            Types couverts par l&apos;équipe :
          </span>
          {typesCouverts.map((type) => (
            <BadgeType key={type} type={type} taille="sm" />
          ))}
        </div>
      )}

      {/* Grille des 6 Emplacements Tactiques */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Emplacements de combat (Ordre de l&apos;équipe)
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipe.map((membre, index) => {
            const estLead = index === 0;
            const enEdition = slotEnEdition === membre.id;

            return (
              <div
                key={membre.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition hover:shadow-md ${
                  estLead
                    ? "border-red-400/80 bg-gradient-to-b from-red-50/40 via-white to-white dark:border-red-900/60 dark:from-red-950/20 dark:via-gray-900 dark:to-gray-900 ring-2 ring-red-500/10"
                    : "border-black/5 bg-white dark:border-white/10 dark:bg-gray-900"
                }`}
              >
                {/* Bandeau supérieur de la carte : Numéro de slot + Boutons réordonner */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-6 items-center justify-center rounded-lg font-mono text-xs font-extrabold ${
                        estLead
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {estLead && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-red-700 dark:bg-red-950 dark:text-red-300">
                        👑 LEAD
                      </span>
                    )}
                  </div>

                  {/* Contrôles de réorganisation d'ordre */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deplacer(index, index - 1)}
                      disabled={index === 0}
                      title="Avancer dans l'équipe"
                      aria-label="Avancer dans l'équipe"
                      className="flex size-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => deplacer(index, index + 1)}
                      disabled={index === equipe.length - 1}
                      title="Reculer dans l'équipe"
                      aria-label="Reculer dans l'équipe"
                      className="flex size-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => retirer(membre.id)}
                      title={`Retirer ${membre.nom} de la sacoche`}
                      aria-label={`Retirer ${membre.nom} de la sacoche`}
                      className="ml-1 flex size-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Corps de la carte : Image + Surnom + Types */}
                <div className="flex items-center gap-4 py-4">
                  <Link
                    href={`/pokemon/${encodeURIComponent(membre.nom)}`}
                    className="relative flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-2 transition hover:scale-105 dark:bg-gray-800/80 shadow-inner"
                  >
                    <Image
                      src={membre.image}
                      alt={membre.nom}
                      width={88}
                      height={88}
                      className="drop-shadow-md"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-gray-400">
                      #{String(membre.id).padStart(3, "0")}
                    </span>

                    {/* Édition intuitive du surnom */}
                    {enEdition ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={valeurSurnom}
                          onChange={(e) => setValeurSurnom(e.target.value)}
                          maxLength={12}
                          autoFocus
                          placeholder={membre.nom}
                          className="w-full rounded-lg border border-red-400 bg-white px-2 py-1 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-red-400/20 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleSauvegarderSurnom(membre.id)}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-base font-extrabold capitalize text-gray-900 dark:text-white">
                          {membre.surnom || membre.nom}
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            handleDemarrerEdition(membre.id, membre.surnom, membre.nom)
                          }
                          title="Modifier le surnom"
                          aria-label="Modifier le surnom"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                        >
                          ✏️
                        </button>
                      </div>
                    )}

                    {membre.surnom && (
                      <p className="text-[11px] text-gray-400 capitalize">
                        Espèce : {membre.nom}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {membre.types.map((type) => (
                        <BadgeType key={type} type={type} taille="sm" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pied de carte : BST du Pokémon */}
                {membre.bst && (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] font-mono text-gray-400 dark:border-gray-800">
                    <span>Puissance :</span>
                    <strong className="text-gray-800 dark:text-gray-200">
                      {membre.bst} BST
                    </strong>
                  </div>
                )}
              </div>
            );
          })}

          {/* Emplacements libres interactifs */}
          {Array.from({ length: emplacementsLibres }, (_, i) => {
            const numeroSlot = equipe.length + i + 1;
            return (
              <div
                key={`libre-${i}`}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-6 text-center transition hover:border-pokedex/60 hover:bg-red-50/20 dark:border-gray-800 dark:hover:border-pokedex/40 min-h-56"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 mb-2">
                  <span className="font-mono text-xs font-bold">
                    #{String(numeroSlot).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Emplacement #{numeroSlot} disponible
                </h3>
                <p className="mt-1 text-xs text-gray-400 max-w-44">
                  Complétez votre équipe pour optimiser votre couverture.
                </p>
                <Link
                  href="/"
                  className="mt-3.5 inline-flex items-center gap-1 rounded-xl bg-gray-900 px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-xs hover:bg-pokedex transition dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-pokedex dark:hover:text-white"
                >
                  + Recruter un Pokémon
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analyseur tactique de synergie */}
      <AnalyseurEquipe equipe={equipe} />
    </div>
  );
}
