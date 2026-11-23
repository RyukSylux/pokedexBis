const TRADUCTION_OBJETS: Record<string, string> = {
  "fire-stone": "Pierre Feu",
  "water-stone": "Pierre Eau",
  "thunder-stone": "Pierre Foudre",
  "leaf-stone": "Pierre Plante",
  "moon-stone": "Pierre Lune",
  "sun-stone": "Pierre Soleil",
  "shiny-stone": "Pierre Éclat",
  "dusk-stone": "Pierre Nuit",
  "dawn-stone": "Pierre Aube",
  "ice-stone": "Pierre Glace",
  "oval-stone": "Pierre Ovale",
  "metal-coat": "Peau Métal",
  "dragon-scale": "Écaille Draco",
  "kings-rock": "Roche Royale",
  "upgrade": "Améliorator",
  "dubious-disc": "CD Douteux",
  "protector": "Protecteur",
  "electirizer": "Électriseur",
  "magmarizer": "Magmariseur",
  "reaper-cloth": "Tissu Fauche",
  "prism-scale": "Bel'Écaille",
  "sweet-apple": "Pomme Douce",
  "tart-apple": "Pomme Acidulée",
};

export type DetailEvolutionBrut = {
  min_level?: number | null;
  trigger?: { name: string } | null;
  item?: { name: string } | null;
  held_item?: { name: string } | null;
  min_happiness?: number | null;
  time_of_day?: string | null;
  known_move?: { name: string } | null;
  location?: { name: string } | null;
};

export type ChaineEvolutionNoeudBrut = {
  species?: { name: string };
  evolution_details?: DetailEvolutionBrut[];
  evolves_to?: ChaineEvolutionNoeudBrut[];
};

export function formaterConditionEvolution(details?: DetailEvolutionBrut | null): string {
  if (!details || typeof details !== "object") return "Évolution";

  if (details.min_level) {
    return `Niv. ${details.min_level}`;
  }

  if (details.trigger?.name === "use-item" && details.item?.name) {
    const nomObjet = details.item.name;
    return TRADUCTION_OBJETS[nomObjet] || `Objet (${nomObjet})`;
  }

  if (details.trigger?.name === "trade") {
    if (details.held_item?.name) {
      const objet = TRADUCTION_OBJETS[details.held_item.name] || details.held_item.name;
      return `Échange (${objet})`;
    }
    return "Échange";
  }

  if (details.min_happiness) {
    if (details.time_of_day === "day") return "Bonheur (Jour)";
    if (details.time_of_day === "night") return "Bonheur (Nuit)";
    return "Bonheur élevé";
  }

  if (details.known_move?.name) {
    return `Capacité (${details.known_move.name})`;
  }

  if (details.location?.name) {
    return `Lieu spécial`;
  }

  return "Évolution spéciale";
}

export type EtapeEvolutionParsed = {
  nom: string;
  condition: string | null;
  evolvesFrom?: string | null;
};

export function parserChaineEvolution(chain?: ChaineEvolutionNoeudBrut | null): EtapeEvolutionParsed[] {
  const resultats: EtapeEvolutionParsed[] = [];

  function traverser(noeud?: ChaineEvolutionNoeudBrut | null, parentNom: string | null = null, condition: string | null = null) {
    if (!noeud || !noeud.species?.name) return;

    resultats.push({
      nom: noeud.species.name,
      condition,
      evolvesFrom: parentNom,
    });

    if (Array.isArray(noeud.evolves_to)) {
      for (const enfant of noeud.evolves_to) {
        const details = enfant.evolution_details?.[0];
        const conditionEnfant = details ? formaterConditionEvolution(details) : "Évolution";
        traverser(enfant, noeud.species.name, conditionEnfant);
      }
    }
  }

  traverser(chain);
  return resultats;
}
