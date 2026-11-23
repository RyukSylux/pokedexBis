import { NextResponse } from "next/server";
import { recupererNomsParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";
import { correspondanceRecherche } from "@/lib/recherche-bilingue";

const POKEMONS_POPULAIRES = [
  "charizard",
  "pikachu",
  "gengar",
  "lucario",
  "greninja",
  "garchomp",
  "tyranitar",
  "mewtwo",
  "rayquaza",
  "snorlax",
  "gyarados",
  "gardevoir",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";

    // 1. Si aucun filtre, renvoyer les favoris du métagame
    if (!q && !type) {
      const populaires = await recupererPlusieurs(POKEMONS_POPULAIRES);
      return NextResponse.json({ pokemons: populaires });
    }

    // 2. Filtrer par type ou tous les noms
    let liste = type ? await recupererNomsParType(type) : await recupererTousLesNoms();

    // 3. Filtrer par recherche bilingue ou ID
    if (q) {
      liste = liste.filter((p) => {
        if (String(p.id) === q) return true;
        return correspondanceRecherche(p.nom, q);
      });
    }

    // Limiter aux 16 premiers pour un affichage ultra rapide
    const topNoms = liste.slice(0, 16).map((p) => p.nom);
    const pokemons = await recupererPlusieurs(topNoms);

    return NextResponse.json({ pokemons });
  } catch (erreur) {
    console.error("Erreur API recrutement:", erreur);
    return NextResponse.json({ pokemons: [] }, { status: 500 });
  }
}
