import Link from "next/link";
import IndicateurSacoche from "./IndicateurSacoche";
import CompteurFavoris from "./CompteurFavoris";

export default function EnTete() {
  return (
    <header className="sticky top-0 z-40 bg-pokedex text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-white/20">
            <span className="size-2.5 rounded-full bg-white" />
          </span>
          Pokédex
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold">
          <Link href="/" className="transition hover:text-white/80">
            Tous
          </Link>
          <Link href="/favoris" className="flex items-center transition hover:text-white/80">
            Favoris
            <CompteurFavoris />
          </Link>
          <Link href="/a-propos" className="hidden sm:inline transition hover:text-white/80">
            À propos
          </Link>
          <IndicateurSacoche />
        </nav>
      </div>
    </header>
  );
}
