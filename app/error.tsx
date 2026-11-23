"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur capturée par boundary :", error);
  }, [error]);

  return (
    <div className="py-20 text-center">
      <p className="mb-4 text-5xl">⚠️</p>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Une erreur est survenue
      </h1>
      <p className="my-4 text-gray-500 dark:text-gray-400">
        Impossible de charger les données pour le moment.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-pokedex px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
