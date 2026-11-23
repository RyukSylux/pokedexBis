export type Generation = {
  cle: string;
  nom: string;
  region: string;
  debut: number;
  fin: number;
};

export const GENERATIONS: Generation[] = [
  { cle: "kanto", nom: "Génération I", region: "Kanto", debut: 1, fin: 151 },
  { cle: "johto", nom: "Génération II", region: "Johto", debut: 152, fin: 251 },
  { cle: "hoenn", nom: "Génération III", region: "Hoenn", debut: 252, fin: 386 },
  { cle: "sinnoh", nom: "Génération IV", region: "Sinnoh", debut: 387, fin: 493 },
  { cle: "unova", nom: "Génération V", region: "Unys", debut: 494, fin: 649 },
  { cle: "kalos", nom: "Génération VI", region: "Kalos", debut: 650, fin: 721 },
  { cle: "alola", nom: "Génération VII", region: "Alola", debut: 722, fin: 809 },
  { cle: "galar", nom: "Génération VIII", region: "Galar", debut: 810, fin: 905 },
  { cle: "paldea", nom: "Génération IX", region: "Paldea", debut: 906, fin: 1025 },
];

export function obtenirBornesGeneration(
  cle: string
): { debut: number; fin: number } | null {
  const gen = GENERATIONS.find(
    (g) => g.cle.toLowerCase() === cle.toLowerCase() || g.region.toLowerCase() === cle.toLowerCase()
  );
  return gen ? { debut: gen.debut, fin: gen.fin } : null;
}

export function estDansGeneration(id: number, cle: string): boolean {
  const bornes = obtenirBornesGeneration(cle);
  if (!bornes) return true;
  return id >= bornes.debut && id <= bornes.fin;
}
