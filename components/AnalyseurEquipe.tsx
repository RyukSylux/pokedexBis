import BadgeType from "./BadgeType";
import { analyserSynergieEquipe } from "@/lib/synergie-equipe";
import type { Membre } from "@/types/pokemon";

type Props = {
  equipe: Membre[];
};

export default function AnalyseurEquipe({ equipe }: Props) {
  const analyse = analyserSynergieEquipe(equipe);

  if (equipe.length === 0) return null;

  const stylesScore =
    analyse.scoreEquilibre === "Excellente"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
      : analyse.scoreEquilibre === "Équilibrée"
      ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800"
      : analyse.scoreEquilibre === "Vulnérable"
      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800"
      : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

  return (
    <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            Bilan Tactique de l&apos;Équipe
          </h2>
        </div>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${stylesScore}`}
        >
          Synergie : {analyse.scoreEquilibre}
        </span>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 italic">
        💡 {analyse.conseilTactique}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 pt-1">
        {/* Faiblesses partagées */}
        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-3.5 dark:border-red-950/50 dark:bg-red-950/10">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Faiblesses communes</span>
          </h3>

          {analyse.faiblessesCommunes.length > 0 ? (
            <div className="space-y-2">
              {analyse.faiblessesCommunes.map((f) => (
                <div
                  key={f.type}
                  className="flex items-center justify-between text-xs"
                >
                  <BadgeType type={f.type} taille="sm" />
                  <span className="font-mono text-[11px] font-bold text-red-700 dark:text-red-300">
                    {f.count} Pokémon vulnérables
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Aucune faiblesse critique cumulée détectée.
            </p>
          )}
        </div>

        {/* Résistances d'équipe */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 dark:border-emerald-950/50 dark:bg-emerald-950/10">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Points forts défensifs</span>
          </h3>

          {analyse.resistancesFortes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {analyse.resistancesFortes.map((type) => (
                <BadgeType key={type} type={type} taille="sm" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Diversifiez vos types pour bloquer davantage d&apos;attaques.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
