"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TYPES } from "@/lib/types";

export default function FiltreTypes() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const typeActif = searchParams.get("type") ?? "";

  const changerType = (nouveauType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nouveauType) {
      params.set("type", nouveauType);
    } else {
      params.delete("type");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-auto">
      <select
        value={typeActif}
        onChange={(e) => changerType(e.target.value)}
        aria-label="Filtrer par type de Pokémon"
        className="w-full sm:w-36 rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        <option value="">Tous les types</option>
        {Object.entries(TYPES).map(([cle, { libelle }]) => (
          <option key={cle} value={cle}>
            {libelle}
          </option>
        ))}
      </select>
    </div>
  );
}
