import { describe, it, expect } from "vitest";
import {
  normaliserTexte,
  traduireNomFrancaisVersAnglais,
  correspondanceRecherche,
} from "@/lib/recherche-bilingue";

describe("lib/recherche-bilingue - Recherche bilingue FR / EN", () => {
  it("normalise le texte en supprimant accents et casse", () => {
    expect(normaliserTexte("Dracaufeu")).toBe("dracaufeu");
    expect(normaliserTexte("Évoli")).toBe("evoli");
    expect(normaliserTexte("MÉGA-RAYQUAZA")).toBe("mega-rayquaza");
  });

  it("traduit les noms français emblématiques vers l'anglais", () => {
    expect(traduireNomFrancaisVersAnglais("dracaufeu")).toBe("charizard");
    expect(traduireNomFrancaisVersAnglais("salameche")).toBe("charmander");
    expect(traduireNomFrancaisVersAnglais("bulbizarre")).toBe("bulbasaur");
    expect(traduireNomFrancaisVersAnglais("carapuce")).toBe("squirtle");
    expect(traduireNomFrancaisVersAnglais("ronflex")).toBe("snorlax");
    expect(traduireNomFrancaisVersAnglais("ectoplasma")).toBe("gengar");
  });

  it("valide la correspondance d'un mot-clé en français ou anglais", () => {
    // Si l'utilisateur tape "dracaufeu", il trouve bien "charizard"
    expect(correspondanceRecherche("charizard", "dracaufeu")).toBe(true);

    // Si l'utilisateur tape "char", il trouve "charizard"
    expect(correspondanceRecherche("charizard", "char")).toBe(true);

    // Si l'utilisateur tape "sala", il trouve "charmander"
    expect(correspondanceRecherche("charmander", "sala")).toBe(true);

    // Si l'utilisateur tape "pikachu", il trouve "pikachu"
    expect(correspondanceRecherche("pikachu", "pika")).toBe(true);
  });
});
