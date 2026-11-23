export function normaliserTexte(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Dictionnaire des correspondances FR -> EN pour les Pokémon les plus fréquents et légendaires
const DICTIONNAIRE_FR_EN: Record<string, string> = {
  bulbizarre: "bulbasaur",
  herbizarre: "ivysaur",
  florizarre: "venusaur",
  salameche: "charmander",
  reptincel: "charmeleon",
  dracaufeu: "charizard",
  carapuce: "squirtle",
  carabaffe: "wartortle",
  tortank: "blastoise",
  chenipan: "caterpie",
  chrysacier: "metapod",
  papilusion: "butterfree",
  aspicot: "weedle",
  coconfort: "kakuna",
  dardargnan: "beedrill",
  roucool: "pidgey",
  roucoups: "pidgeotto",
  roucarnage: "pidgeot",
  rattata: "rattata",
  rattatac: "raticate",
  piafabec: "spearow",
  rapasdepic: "fearow",
  abo: "ekans",
  arbok: "arbok",
  pikachu: "pikachu",
  raichu: "raichu",
  sabelette: "sandshrew",
  sablaireau: "sandslash",
  nidoran: "nidoran-m",
  melofee: "clefairy",
  melodelfe: "clefable",
  goupix: "vulpix",
  feunard: "ninetales",
  rondoudou: "jigglypuff",
  grodoudou: "wigglytuff",
  nosferapti: "zubat",
  nosferalto: "golbat",
  mystherbe: "oddish",
  ortide: "gloom",
  rafflesia: "vileplume",
  paras: "paras",
  parasect: "parasect",
  mimitoss: "venonat",
  aeromite: "venomoth",
  taupiqueur: "diglett",
  triopikeur: "dugtrio",
  miaouss: "meowth",
  persian: "persian",
  psykokwak: "psyduck",
  akwakwak: "golduck",
  ferosinge: "mankey",
  colossinge: "primeape",
  caninos: "growlithe",
  arcanin: "arcanine",
  ptitard: "poliwag",
  tetarte: "poliwhirl",
  tartard: "poliwrath",
  abra: "abra",
  kadabra: "kadabra",
  alakazam: "alakazam",
  machoc: "machop",
  machopeur: "machoke",
  mackogneur: "machamp",
  chetiflor: "bellsprout",
  boustiflor: "weepinbell",
  empiflor: "victreebel",
  tentacool: "tentacool",
  tentacruel: "tentacruel",
  racaillou: "geodude",
  gravalanch: "graveler",
  grolem: "golem",
  ponyta: "ponyta",
  galopa: "rapidash",
  ramoloss: "slowpoke",
  flagadoss: "slowbro",
  magneti: "magnemite",
  magneton: "magneton",
  canarticho: "farfetchd",
  doduo: "doduo",
  dodrio: "dodrio",
  otaria: "seel",
  lamantine: "dewgong",
  tadmorv: "grimer",
  grotadmorv: "muk",
  kokiyas: "shellder",
  crustabri: "cloyster",
  fantominus: "gastly",
  spectrum: "haunter",
  ectoplasma: "gengar",
  onix: "onix",
  soporifik: "drowzee",
  hypnomade: "hypno",
  krabby: "krabby",
  krabboss: "kingler",
  voltorbe: "voltorb",
  electrode: "electrode",
  noeunoeuf: "exeggcute",
  noadkoko: "exeggutor",
  osselait: "cubone",
  ossatueur: "marowak",
  kicklee: "hitmonlee",
  tygnon: "hitmonchan",
  excelangue: "lickitung",
  smogo: "koffing",
  smogogo: "weezing",
  rhinocorne: "rhyhorn",
  rhinoferos: "rhydon",
  leveinard: "chansey",
  saquedeneu: "tangela",
  kangourex: "kangaskhan",
  hypocean: "seadra",
  poissirene: "goldeen",
  poissorroy: "seaking",
  stari: "staryu",
  staross: "starmie",
  insecateur: "scyther",
  lipoutou: "jynx",
  eletek: "electabuzz",
  magmar: "magmar",
  scarabrute: "pinsir",
  tauros: "tauros",
  magicarpe: "magikarp",
  leviator: "gyarados",
  lokhlass: "lapras",
  metamorph: "ditto",
  evoli: "eevee",
  aquali: "vaporeon",
  voltali: "jolteon",
  pyroli: "flareon",
  porygon: "porygon",
  amonita: "omanyte",
  amonistar: "omastar",
  kabuto: "kabuto",
  kabutops: "kabutops",
  ptera: "aerodactyl",
  ronflex: "snorlax",
  artikodin: "articuno",
  electhor: "zapdos",
  sulfura: "moltres",
  minidraco: "dratini",
  draco: "dragonair",
  dracolosse: "dragonite",
  mewtwo: "mewtwo",
  mew: "mew",
  // Johto emblématiques
  germignon: "chikorita",
  hericendre: "cyndaquil",
  kaMinus: "totodile",
  lugia: "lugia",
  hooh: "ho-oh",
  entei: "entei",
  raikou: "raikou",
  suicune: "suicune",
  tyranocif: "tyranitar",
  celebii: "celebi",
  // Hoenn & au-delà
  arcko: "treecko",
  poussifeu: "torchic",
  gobou: "mudkip",
  kyogre: "kyogre",
  groudon: "groudon",
  rayquaza: "rayquaza",
  lucario: "lucario",
  grenousse: "froakie",
  amphinobi: "greninja",
};

// Dictionnaire inversé EN -> FR
const DICTIONNAIRE_EN_FR: Record<string, string> = {};
for (const [fr, en] of Object.entries(DICTIONNAIRE_FR_EN)) {
  DICTIONNAIRE_EN_FR[en] = fr;
}

export function traduireNomFrancaisVersAnglais(nomFr: string): string | null {
  const propre = normaliserTexte(nomFr);
  return DICTIONNAIRE_FR_EN[propre] || null;
}

export function traduireNomAnglaisVersFrancais(nomEn: string): string | null {
  const propre = normaliserTexte(nomEn);
  return DICTIONNAIRE_EN_FR[propre] || null;
}

/**
 * Détermine si un Pokémon correspond à la saisie de l'utilisateur
 * (recherche bilingue FR / EN).
 */
export function correspondanceRecherche(nomPokemonEn: string, saisieUtilisateur: string): boolean {
  if (!saisieUtilisateur || !saisieUtilisateur.trim()) return true;

  const cibleEn = normaliserTexte(nomPokemonEn);
  const requete = normaliserTexte(saisieUtilisateur);

  // 1. Correspondance directe en anglais
  if (cibleEn.includes(requete)) return true;

  // 2. Correspondance via le nom français associé
  const nomFr = DICTIONNAIRE_EN_FR[cibleEn];
  if (nomFr && nomFr.includes(requete)) return true;

  // 3. Correspondance si l'utilisateur a tapé un nom FR dont la traduction correspond
  const traduction = DICTIONNAIRE_FR_EN[requete];
  if (traduction && cibleEn.includes(traduction)) return true;

  return false;
}
