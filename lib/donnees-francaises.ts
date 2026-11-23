import donneesRaw from "@/data/pokemon-fr.json";
import { normaliserTexte } from "./recherche-bilingue";

export type DonneePokemonFr = {
  nomFr: string;
  categorieFr: string;
  descriptionFr: string;
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
