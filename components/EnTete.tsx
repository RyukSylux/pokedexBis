import Link from "next/link";
import IndicateurSacoche from "./IndicateurSacoche";
import CompteurFavoris from "./CompteurFavoris";
import LogoPokeball from "./LogoPokeball";

export default function EnTete() {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-700 via-pokedex to-red-700 text-white shadow-md border-b border-red-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
        {/* Partie gauche : Capteur bleu Pokédex + Diodes + Logo */}
        <div className="flex items-center gap-3">
          {/* Capteur bleu Pokédex */}
          <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-cyan-300 via-blue-500 to-blue-700 shadow-md shadow-blue-500/50">
            <span className="absolute top-1 left-1.5 size-2 rounded-full bg-white/70" />
          </div>

          {/* 3 mini diodes (rouge, jaune, vert) */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1">
            <span className="size-2 rounded-full bg-red-400 border border-red-200/50" />
            <span className="size-2 rounded-full bg-amber-300 border border-amber-100/50" />
            <span className="size-2 rounded-full bg-emerald-400 border border-emerald-200/50" />
          </div>

          <div className="pl-1">
            <LogoPokeball />
          </div>
        </div>

        {/* Partie droite : Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-semibold">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 transition hover:bg-white/15 active:scale-95 text-xs sm:text-sm"
          >
            Tous
          </Link>

          <Link
            href="/favoris"
            className="flex items-center rounded-full px-3 py-1.5 transition hover:bg-white/15 active:scale-95 text-xs sm:text-sm"
          >
            <span>Favoris</span>
            <CompteurFavoris />
          </Link>

          <Link
            href="/a-propos"
            className="hidden md:inline rounded-full px-3 py-1.5 transition hover:bg-white/15 text-xs sm:text-sm"
          >
            À propos
          </Link>

          <IndicateurSacoche />
        </nav>
      </div>
    </header>
  );
}
