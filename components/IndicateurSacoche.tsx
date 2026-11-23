"use client";

import Link from "next/link";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

export default function IndicateurSacoche() {
  const nombre = useSacoche((etat) => etat.equipe.length);

  return (
    <Link
      href="/sacoche"
      aria-label={`Sacoche : ${nombre} Pokémon sur ${TAILLE_SACOCHE}`}
      title={`Sacoche : ${nombre}/${TAILLE_SACOCHE}`}
      className="flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1.5 transition hover:bg-black/25"
    >
      <span className="text-xs font-bold mr-1">Sacoche</span>
      <div className="flex gap-1">
        {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
          <span
            key={i}
            className={`size-2.5 rounded-full border border-white transition-all ${
              i < nombre ? "bg-white scale-110" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </Link>
  );
}
