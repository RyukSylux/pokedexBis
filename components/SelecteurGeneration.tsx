"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GENERATIONS } from "@/lib/generations";

export default function SelecteurGeneration() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genActuelle = searchParams.get("gen") || "";

  const changerGeneration = (cle: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cle) {
      params.set("gen", cle);
    } else {
      params.delete("gen");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-auto">
      <select
        value={genActuelle}
        onChange={(e) => changerGeneration(e.target.value)}
        aria-label="Filtrer par région ou génération"
        className="w-full sm:w-44 rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        <option value="">Toutes les régions</option>
        {GENERATIONS.map((gen) => (
          <option key={gen.cle} value={gen.cle}>
            {gen.region} (#{gen.debut} à #{gen.fin})
          </option>
        ))}
      </select>
    </div>
  );
}
