import donneesRaw from "@/data/pokemon-fr.json";
import { normaliserTexte } from "./recherche-bilingue";
import type { Pokemon } from "@/types/pokemon";

export type DonneePokemonFr = {
  id: number;
  nom: string;
  nomFr: string;
  categorieFr: string;
  descriptionFr: string;
  types: string[];
  taille: number;
  poids: number;
  bst: number;
  image: string;
  imageShiny?: string;
  criAudio?: string;
};

const donnees = donneesRaw as unknown as Record<string, DonneePokemonFr>;

export function obtenirDonneesFrancaises(id: number): DonneePokemonFr | null {
  return donnees[String(id)] ?? null;
}

export function obtenirNomFrancais(id: number): string | null {
  return donnees[String(id)]?.nomFr ?? null;
}

export function obtenirDescriptionFrancaise(id: number): string | null {
  return donnees[String(id)]?.descriptionFr ?? null;
}

export function obtenirCategorieFrancaise(id: number): string | null {
  return donnees[String(id)]?.categorieFr ?? null;
}

// Index inversé pour recherche instantanée par nom français
const indexNomsFr = new Map<string, number>();
for (const [idStr, info] of Object.entries(donnees)) {
  if (info.nomFr) {
    indexNomsFr.set(normaliserTexte(info.nomFr), parseInt(idStr, 10));
  }
}

export function rechercherIdParNomFrancais(nom: string): number | null {
  const norm = normaliserTexte(nom.trim());
  return indexNomsFr.get(norm) ?? null;
}

export function estNomFrancaisCorrespondant(id: number, motCle: string): boolean {
  const nomFr = obtenirNomFrancais(id);
  if (!nomFr) return false;
  return normaliserTexte(nomFr).includes(normaliserTexte(motCle.trim()));
}

/**
 * Retourne la liste complète des 1 025 Pokémon avec toutes leurs données intégrées
 * pour un affichage instantané sans dépendance réseau.
 */
export function obtenirTousLesPokemonsComplets(): Pokemon[] {
  return Object.values(donnees).map((d) => ({
    id: d.id,
    nom: d.nom || `pokemon-${d.id}`,
    nomFr: d.nomFr,
    categorieFr: d.categorieFr,
    descriptionFr: d.descriptionFr,
    types: d.types && d.types.length ? d.types : ["normal"],
    taille: d.taille || 1.0,
    poids: d.poids || 10.0,
    bst: d.bst || 400,
    image:
      d.image ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${d.id}.png`,
    imageShiny:
      d.imageShiny ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${d.id}.png`,
    criAudio:
      d.criAudio ||
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${d.id}.ogg`,
    stats: [
      { nom: "hp", valeur: Math.round((d.bst || 400) / 6) },
      { nom: "attack", valeur: Math.round((d.bst || 400) / 6) },
      { nom: "defense", valeur: Math.round((d.bst || 400) / 6) },
      { nom: "special-attack", valeur: Math.round((d.bst || 400) / 6) },
      { nom: "special-defense", valeur: Math.round((d.bst || 400) / 6) },
      { nom: "speed", valeur: Math.round((d.bst || 400) / 6) },
    ],
  }));
}
