import BadgeType from "./BadgeType";
import { grouperEfficacites } from "@/lib/types-efficacite";

type Props = {
  types: string[];
};

export default function TableauFaiblesses({ types }: Props) {
  const groupes = grouperEfficacites(types);

  const aDesFaiblesses =
    groupes.faiblessesCritiques.length > 0 || groupes.faiblesses.length > 0;
  const aDesResistances =
    groupes.resistancesCritiques.length > 0 ||
    groupes.resistances.length > 0 ||
    groupes.immunités.length > 0;

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-800/40">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Sensibilités & Résistances aux types
        </h3>
        <span className="text-[11px] font-medium text-gray-500">
          Dégâts subis
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Colonne Faiblesses */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <span>⚔️</span>
            <span>Vulnérabilités</span>
          </h4>

          {groupes.faiblessesCritiques.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-extrabold text-red-700 dark:bg-red-950/80 dark:text-red-300">
                ×4 (Faiblesse critique)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groupes.faiblessesCritiques.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          )}

          {groupes.faiblesses.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/80 dark:text-orange-300">
                ×2 (Faiblesse)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groupes.faiblesses.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          )}

          {!aDesFaiblesses && (
            <p className="text-xs text-gray-500 italic">
              Aucune faiblesse directe connue.
            </p>
          )}
        </div>

        {/* Colonne Défenses & Immunités */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Résistances & Immunités</span>
          </h4>

          {groupes.immunités.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-extrabold text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                ×0 (Immunité totale)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groupes.immunités.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          )}

          {groupes.resistancesCritiques.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                ¼ (Double résistance)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groupes.resistancesCritiques.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          )}

          {groupes.resistances.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-950/80 dark:text-green-300">
                ½ (Résistance)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groupes.resistances.map((type) => (
                  <BadgeType key={type} type={type} taille="sm" />
                ))}
              </div>
            </div>
          )}

          {!aDesResistances && (
            <p className="text-xs text-gray-500 italic">
              Aucune résistance particulière.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
