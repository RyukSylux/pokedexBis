"use client";

import { useRef } from "react";
import Link from "next/link";
import { ouvrirCheatPadMobile } from "./Doom/KonamiDetector";

export default function LogoPokeball() {
  const tapsRef = useRef<number[]>([]);

  const handleTap = (e: React.MouseEvent) => {
    const maintenant = Date.now();
    // Conserver uniquement les clics/taps des 2 dernières secondes
    tapsRef.current = [
      ...tapsRef.current.filter((t) => maintenant - t < 2000),
      maintenant,
    ];

    if (tapsRef.current.length >= 5) {
      tapsRef.current = [];
      e.preventDefault();
      ouvrirCheatPadMobile();
    }
  };

  return (
    <Link
      href="/"
      onClick={handleTap}
      className="flex items-center gap-2 text-xl font-extrabold tracking-tight transition active:scale-95"
      title="Pokédex (Astuce mobile : tapez 5 fois rapidement sur le logo pour le cheat code !)"
    >
      <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-xs">
        <span className="size-2.5 rounded-full bg-white" />
      </span>
      Pokédex
    </Link>
  );
}
