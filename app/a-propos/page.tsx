import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description: "À propos du projet Pokédex développé avec Next.js et Tailwind CSS.",
};

export default function PageAPropos() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10 dark:border-white/10 dark:bg-gray-900">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          À propos du Pokédex
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Application web moderne conçue dans le cadre du cours complet Next.js et React.
        </p>
      </div>

      <section className="space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Technologies employées</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Next.js 15 (App Router)</strong> : Rendu hybride avec Server Components par défaut pour des performances optimales et un SEO irréprochable.
          </li>
          <li>
            <strong>React 19 & TypeScript</strong> : Typage strict séparant le schéma brut de l&apos;API du modèle applicatif.
          </li>
          <li>
            <strong>Tailwind CSS v4</strong> : Configuration native avec <code>@theme</code> pour la palette officielle de chaque type Pokémon.
          </li>
          <li>
            <strong>Zustand 5</strong> : Gestion globale légère pour les favoris et la sacoche de dresseur (6 membres max), persistée dans le stockage local sans mismatch SSR grâce à <code>skipHydration</code>.
          </li>
          <li>
            <strong>PokéAPI</strong> : API publique et ouverte fournissant les caractéristiques, statistiques et chaînes d&apos;évolutions récursives des 1 025 créatures.
          </li>
        </ul>
      </section>

      <section className="space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fonctionnalités principales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">🔍 Recherche & Filtres</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Recherche debouncée (300 ms) et filtre par type synchronisés avec l&apos;URL.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">📊 Fiches Détaillées</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Jauges de statistiques relatives, types colorés et parcours de la chaîne d&apos;évolution.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">🎒 Sacoche du Dresseur</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Composition d&apos;une équipe de 6 Pokémon maximum, surnoms éditables et analyse des types.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">⭐ Favoris</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sélection rapide en un clic avec compteur dans l&apos;en-tête et page dédiée.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-gray-600 dark:text-gray-300">
        <p className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
          🎮 Easter Egg
        </p>
        <p>
          Ce Pokédex contient un secret rétro culte... Entrez le <strong>Konami Code</strong> au clavier (<code>↑ ↑ ↓ ↓ ← → ← → B A</code>) ou tapez <strong>5 fois rapidement</strong> sur la Pokéball en haut à gauche pour déclencher l&apos;arcade !
        </p>
      </section>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-pokedex px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          Retourner au Pokédex
        </Link>
      </div>
    </article>
  );
}
