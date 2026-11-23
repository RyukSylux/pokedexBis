import type { Statistique } from "@/types/pokemon";

const LIBELLES: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque spé.",
  "special-defense": "Défense spé.",
  speed: "Vitesse",
};

const MAXIMUM = 255;

export default function BarresStats({ stats }: { stats: Statistique[] }) {
  return (
    <dl className="grid gap-2.5">
      {stats.map((stat) => (
        <div key={stat.nom} className="grid grid-cols-[7rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {LIBELLES[stat.nom] ?? stat.nom}
          </dt>
          <dd className="text-right font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
            {stat.valeur}
          </dd>
          <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-pokedex transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (stat.valeur / MAXIMUM) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}
