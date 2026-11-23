"use client";

import Link from "next/link";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

export default function IndicateurSacoche() {
  const nombre = useSacoche((etat) => etat.equipe.length);

  return (
    <Link
      href="/sacoche"
      aria-label={`Sacoche de dresseur : ${nombre} Pokémon sur ${TAILLE_SACOCHE}`}
      title={`Sacoche : ${nombre}/${TAILLE_SACOCHE} Pokémon`}
      className="flex items-center gap-2 rounded-full bg-black/20 hover:bg-black/30 border border-white/10 px-3 py-1.5 transition-all shadow-inner"
    >
      <span className="text-xs font-bold">🎒 Sacoche</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
          <span
            key={i}
            className={`flex size-2.5 items-center justify-center rounded-full border transition-all ${
              i < nombre
                ? "border-white bg-white scale-110 shadow-xs"
                : "border-white/30 bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] font-extrabold text-white/90">
        {nombre}/{TAILLE_SACOCHE}
      </span>
    </Link>
  );
}
