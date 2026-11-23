import Link from "next/link";

type Props = {
  pageCourante: number;
  totalElements: number;
  parPage?: number;
  recherche?: string;
  type?: string;
};

export default function Pagination({
  pageCourante,
  totalElements,
  parPage = 24,
  recherche,
  type,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalElements / parPage));

  if (totalPages <= 1) return null;

  const creerLien = (numPage: number) => {
    const params = new URLSearchParams();
    if (numPage > 1) params.set("page", String(numPage));
    if (recherche) params.set("q", recherche);
    if (type) params.set("type", type);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  const aPrecedent = pageCourante > 1;
  const aSuivant = pageCourante < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination des Pokémon"
      className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm"
    >
      {aPrecedent ? (
        <Link
          href={creerLien(pageCourante - 1)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          ← Précédent
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-xl border border-gray-200/60 bg-gray-100/60 px-4 py-2 font-semibold text-gray-400 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600">
          ← Précédent
        </span>
      )}

      <span className="px-3 font-medium text-gray-600 dark:text-gray-400">
        Page <strong className="text-gray-900 dark:text-white">{pageCourante}</strong> sur{" "}
        <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
      </span>

      {aSuivant ? (
        <Link
          href={creerLien(pageCourante + 1)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          Suivant →
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-xl border border-gray-200/60 bg-gray-100/60 px-4 py-2 font-semibold text-gray-400 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600">
          Suivant →
        </span>
      )}
    </nav>
  );
}
