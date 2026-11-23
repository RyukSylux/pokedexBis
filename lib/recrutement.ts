import { correspondanceRecherche, normaliserTexte } from "./recherche-bilingue";

export type CandidatRecrutement = {
  id: number;
  nom: string;
  nomFr?: string;
  types: string[];
  bst?: number;
  image: string;
  estDansEquipe?: boolean;
};

export type FiltresRecrutement = {
  recherche?: string;
  type?: string;
  idsEquipe: number[];
  limite?: number;
};

export type StatutEligibilite = {
  autorise: boolean;
  raison?: string;
};

export const MAX_EQUIPE = 6;

/**
 * Détermine si un Pokémon peut être recruté dans l'équipe.
 */
export function peutRecruter(
  idsEquipe: number[],
  idPokemon: number
): StatutEligibilite {
  if (idsEquipe.includes(idPokemon)) {
    return {
      autorise: false,
      raison: "Déjà dans l'équipe",
    };
  }

  if (idsEquipe.length >= MAX_EQUIPE) {
    return {
      autorise: false,
      raison: "Équipe déjà complète (6/6)",
    };
  }

  return { autorise: true };
}

/**
 * Filtre une liste de candidats pour le recrutement direct in-situ.
 */
export function filtrerCandidatsRecrutement(
  candidats: CandidatRecrutement[],
  filtres: FiltresRecrutement
): CandidatRecrutement[] {
  const { recherche = "", type = "", idsEquipe, limite = 50 } = filtres;
  const rechercheNorm = normaliserTexte(recherche.trim());

  let resultats = candidats.map((c) => ({
    ...c,
    estDansEquipe: idsEquipe.includes(c.id),
  }));

  // Filtrage par type
  if (type) {
    resultats = resultats.filter((c) => c.types.includes(type.toLowerCase()));
  }

  // Filtrage par texte (nom EN, nom FR ou ID)
  if (rechercheNorm) {
    resultats = resultats.filter((c) => {
      // Correspondance par ID
      if (String(c.id) === rechercheNorm) return true;
      // Correspondance par nom français
      if (c.nomFr && normaliserTexte(c.nomFr).includes(rechercheNorm)) return true;
      // Correspondance par nom anglais ou bilingue
      return (
        normaliserTexte(c.nom).includes(rechercheNorm) ||
        correspondanceRecherche(c.nom, rechercheNorm)
      );
    });
  }

  return resultats.slice(0, limite);
}
