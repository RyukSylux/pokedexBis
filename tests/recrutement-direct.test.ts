import { describe, it, expect } from "vitest";
import {
  filtrerCandidatsRecrutement,
  peutRecruter,
  type CandidatRecrutement,
} from "@/lib/recrutement";

const mockCandidats: CandidatRecrutement[] = [
  { id: 1, nom: "bulbasaur", nomFr: "Bulbizarre", types: ["grass", "poison"], bst: 318, image: "" },
  { id: 4, nom: "charmander", nomFr: "Salamèche", types: ["fire"], bst: 309, image: "" },
  { id: 6, nom: "charizard", nomFr: "Dracaufeu", types: ["fire", "flying"], bst: 534, image: "" },
  { id: 7, nom: "squirtle", nomFr: "Carapuce", types: ["water"], bst: 314, image: "" },
  { id: 25, nom: "pikachu", nomFr: "Pikachu", types: ["electric"], bst: 320, image: "" },
  { id: 94, nom: "gengar", nomFr: "Ectoplasma", types: ["ghost", "poison"], bst: 500, image: "" },
];

describe("lib/recrutement - Recrutement direct in-situ", () => {
  it("valide les règles d'éligibilité au recrutement avec peutRecruter", () => {
    const equipeVide: number[] = [];
    expect(peutRecruter(equipeVide, 6)).toEqual({ autorise: true });

    const equipeAvecDracaufeu = [6, 25];
    expect(peutRecruter(equipeAvecDracaufeu, 6)).toEqual({
      autorise: false,
      raison: "Déjà dans l'équipe",
    });

    const equipePleine = [1, 4, 6, 7, 25, 94];
    expect(peutRecruter(equipePleine, 150)).toEqual({
      autorise: false,
      raison: "Équipe déjà complète (6/6)",
    });
  });

  it("filtre les candidats par recherche bilingue (nom anglais ou français)", () => {
    // Recherche par nom français
    const resultatFr = filtrerCandidatsRecrutement(mockCandidats, {
      recherche: "dracaufeu",
      idsEquipe: [],
    });
    expect(resultatFr).toHaveLength(1);
    expect(resultatFr[0].id).toBe(6);

    // Recherche par nom anglais
    const resultatEn = filtrerCandidatsRecrutement(mockCandidats, {
      recherche: "char",
      idsEquipe: [],
    });
    expect(resultatEn.map((c) => c.nom)).toEqual(["charmander", "charizard"]);

    // Recherche par ID
    const resultatId = filtrerCandidatsRecrutement(mockCandidats, {
      recherche: "25",
      idsEquipe: [],
    });
    expect(resultatId).toHaveLength(1);
    expect(resultatId[0].nom).toBe("pikachu");
  });

  it("filtre les candidats par type élémentaire", () => {
    const resultatFeu = filtrerCandidatsRecrutement(mockCandidats, {
      type: "fire",
      idsEquipe: [],
    });
    expect(resultatFeu.map((c) => c.id)).toEqual([4, 6]);

    const resultatPlante = filtrerCandidatsRecrutement(mockCandidats, {
      type: "grass",
      idsEquipe: [],
    });
    expect(resultatPlante.map((c) => c.id)).toEqual([1]);
  });

  it("identifie les Pokémon déjà recrutés dans l'équipe", () => {
    const resultat = filtrerCandidatsRecrutement(mockCandidats, {
      idsEquipe: [6, 25],
    });
    const charizard = resultat.find((c) => c.id === 6);
    const squirtle = resultat.find((c) => c.id === 7);

    expect(charizard?.estDansEquipe).toBe(true);
    expect(squirtle?.estDansEquipe).toBe(false);
  });
});
