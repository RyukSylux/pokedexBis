import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="py-20 text-center">
      <p className="mb-4 text-5xl">💨</p>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Ce Pokémon s’est enfui
      </h1>
      <p className="my-4 text-gray-500 dark:text-gray-400">
        La page demandée n’existe pas ou ce Pokémon est introuvable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-xl bg-pokedex px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        Retour au Pokédex
      </Link>
    </div>
  );
}
