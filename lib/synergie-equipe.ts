import {
  calculerEfficacitesDefensives,
  TOUS_LES_TYPES,
  type NomType,
} from "./types-efficacite";

export type MembreSimplifie = {
  id: number;
  nom: string;
  types: string[];
};

export type FaiblesseCommune = {
  type: NomType;
  count: number;
};

export type AnalyseSynergie = {
  faiblessesCommunes: FaiblesseCommune[];
  resistancesFortes: NomType[];
  nombreTypesUniques: number;
  scoreEquilibre: "Incomplète" | "Vulnérable" | "Équilibrée" | "Excellente";
  conseilTactique?: string;
};

export function analyserSynergieEquipe(equipe: MembreSimplifie[]): AnalyseSynergie {
  if (equipe.length === 0) {
    return {
      faiblessesCommunes: [],
      resistancesFortes: [],
      nombreTypesUniques: 0,
      scoreEquilibre: "Incomplète",
      conseilTactique: "Ajoutez des Pokémon à votre équipe pour évaluer vos forces et faiblesses.",
    };
  }

  // Compter les types uniques représentés
  const typesUniques = new Set(equipe.flatMap((m) => m.types.map((t) => t.toLowerCase())));

  // Dénombrer pour chaque type attaquant combien de membres y sont faibles ou résistants
  const compteursFaiblesses = {} as Record<NomType, number>;
  const compteursResistances = {} as Record<NomType, number>;

  for (const t of TOUS_LES_TYPES) {
    compteursFaiblesses[t] = 0;
    compteursResistances[t] = 0;
  }

  for (const membre of equipe) {
    const efficacites = calculerEfficacitesDefensives(membre.types);

    for (const [typeAttaquant, mult] of Object.entries(efficacites) as [NomType, number][]) {
      if (mult >= 2) {
        compteursFaiblesses[typeAttaquant] = (compteursFaiblesses[typeAttaquant] || 0) + 1;
      } else if (mult < 1) {
        compteursResistances[typeAttaquant] = (compteursResistances[typeAttaquant] || 0) + 1;
      }
    }
  }

  // Faiblesses partagées par au moins 3 Pokémon (ou >= la moitié de l'équipe si équipe < 6)
  const seuil = Math.max(2, Math.ceil(equipe.length / 2));
  const faiblessesCommunes: FaiblesseCommune[] = (
    Object.entries(compteursFaiblesses) as [NomType, number][]
  )
    .filter(([, count]) => count >= seuil)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const resistancesFortes = (Object.entries(compteursResistances) as [NomType, number][])
    .filter(([, count]) => count >= 3)
    .map(([type]) => type);

  let scoreEquilibre: "Incomplète" | "Vulnérable" | "Équilibrée" | "Excellente" = "Équilibrée";
  let conseilTactique = "Votre équipe présente un bon équilibre.";

  if (equipe.length < 3) {
    scoreEquilibre = "Incomplète";
    conseilTactique = "Continuez à recruter pour compléter votre équipe de 6 Pokémon.";
  } else if (faiblessesCommunes.length >= 2) {
    scoreEquilibre = "Vulnérable";
    conseilTactique = `Attention : votre équipe a plusieurs faiblesses partagées majeures (${faiblessesCommunes
      .map((f) => f.type)
      .join(", ")}). Envisagez un contre !`;
  } else if (typesUniques.size >= 7 && faiblessesCommunes.length <= 1) {
    scoreEquilibre = "Excellente";
    conseilTactique = "Remarquable couverture offensive et défensive avec de nombreux types variés !";
  }

  return {
    faiblessesCommunes,
    resistancesFortes,
    nombreTypesUniques: typesUniques.size,
    scoreEquilibre,
    conseilTactique,
  };
}
