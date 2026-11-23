"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

export default function PageSacoche() {
  const equipe = useSacoche((etat) => etat.equipe);
  const retirer = useSacoche((etat) => etat.retirer);
  const renommer = useSacoche((etat) => etat.renommer);
  const vider = useSacoche((etat) => etat.vider);

  const [confirmerVider, setConfirmerVider] = useState(false);

  const typesCouverts = [...new Set(equipe.flatMap((membre) => membre.types))];
  const emplacementsLibres = Math.max(0, TAILLE_SACOCHE - equipe.length);

  const handleVider = () => {
    if (confirmerVider) {
      vider();
      setConfirmerVider(false);
    } else {
      setConfirmerVider(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Ma Sacoche de Dresseur
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {equipe.length} / {TAILLE_SACOCHE} Pokémon · {typesCouverts.length} type(s) couvert(s)
          </p>
        </div>

        {equipe.length > 0 && (
          <button
            type="button"
            onClick={handleVider}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
              confirmerVider
                ? "bg-red-600 text-white animate-pulse"
                : "border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {confirmerVider ? "Confirmer la réinitialisation ?" : "Vider la sacoche"}
          </button>
        )}
      </div>

      {typesCouverts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
            Types couverts :
          </span>
          {typesCouverts.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.map((membre) => (
          <li
            key={membre.id}
            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-gray-900"
          >
            <Link
              href={`/pokemon/${encodeURIComponent(membre.nom)}`}
              className="flex shrink-0 items-center justify-center rounded-xl bg-gray-50 p-1.5 transition hover:scale-105 dark:bg-gray-800"
            >
              <Image
                src={membre.image}
                alt={membre.nom}
                width={80}
                height={80}
                className="drop-shadow"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={membre.surnom}
                onChange={(e) => renommer(membre.id, e.target.value)}
                placeholder={membre.nom}
                maxLength={12}
                aria-label={`Surnom de ${membre.nom}`}
                title="Cliquez pour modifier le surnom"
                className="mb-1.5 w-full rounded-lg border border-transparent bg-transparent px-1.5 py-0.5 text-base font-bold capitalize text-gray-900 transition hover:border-gray-200 focus:border-pokedex focus:bg-white focus:outline-none dark:text-white dark:hover:border-gray-700 dark:focus:bg-gray-800"
              />
              <div className="flex flex-wrap gap-1">
                {membre.types.map((type) => (
                  <BadgeType key={type} type={type} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => retirer(membre.id)}
              aria-label={`Retirer ${membre.nom} de la sacoche`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
            >
              ✕
            </button>
          </li>
        ))}

        {Array.from({ length: emplacementsLibres }, (_, i) => (
          <li key={`libre-${i}`}>
            <Link
              href="/"
              className="grid min-h-32 place-items-center rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 transition hover:border-pokedex hover:text-pokedex dark:border-gray-800 dark:hover:border-pokedex"
            >
              + Emplacement libre
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
