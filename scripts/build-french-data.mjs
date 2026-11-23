import fs from "node:fs";
import path from "node:path";

const TYPE_NAMES = {
  1: "normal",
  2: "fighting",
  3: "flying",
  4: "poison",
  5: "ground",
  6: "rock",
  7: "bug",
  8: "ghost",
  9: "steel",
  10: "fire",
  11: "water",
  12: "grass",
  13: "electric",
  14: "psychic",
  15: "ice",
  16: "dragon",
  17: "dark",
  18: "fairy",
};

async function main() {
  console.log("1. Téléchargement des noms et catégories en français...");
  const resNames = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv"
  );
  const textNames = await resNames.text();

  const dataFr = {};

  for (const line of textNames.split(/\r?\n/)) {
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length >= 3) {
      const speciesId = parseInt(parts[0], 10);
      const langId = parseInt(parts[1], 10);
      if (langId === 5 && speciesId >= 1 && speciesId <= 1025) {
        const nomFr = parts[2].trim();
        const categorieFr = parts.slice(3).join(",").trim();
        dataFr[speciesId] = {
          id: speciesId,
          nom: "",
          nomFr,
          categorieFr: categorieFr || "Pokémon",
          descriptionFr: "",
          types: [],
          taille: 1.0,
          poids: 10.0,
          bst: 400,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`,
          imageShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${speciesId}.png`,
          criAudio: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${speciesId}.ogg`,
        };
      }
    }
  }

  console.log("2. Téléchargement des données de base des Pokémon (dimensions & nom EN)...");
  const resPoke = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv"
  );
  const textPoke = await resPoke.text();

  for (const line of textPoke.split(/\r?\n/)) {
    if (!line) continue;
    const parts = line.split(",");
    const id = parseInt(parts[0], 10);
    if (id >= 1 && id <= 1025 && dataFr[id]) {
      dataFr[id].nom = parts[1].trim();
      dataFr[id].taille = (parseInt(parts[3], 10) || 10) / 10;
      dataFr[id].poids = (parseInt(parts[4], 10) || 100) / 10;
    }
  }

  console.log("3. Téléchargement des types élémentaires...");
  const resTypes = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_types.csv"
  );
  const textTypes = await resTypes.text();

  for (const line of textTypes.split(/\r?\n/)) {
    if (!line) continue;
    const parts = line.split(",");
    const pokeId = parseInt(parts[0], 10);
    const typeId = parseInt(parts[1], 10);
    if (pokeId >= 1 && pokeId <= 1025 && dataFr[pokeId] && TYPE_NAMES[typeId]) {
      const typeName = TYPE_NAMES[typeId];
      if (!dataFr[pokeId].types.includes(typeName)) {
        dataFr[pokeId].types.push(typeName);
      }
    }
  }

  console.log("4. Téléchargement des statistiques de base (BST)...");
  const resStats = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_stats.csv"
  );
  const textStats = await resStats.text();

  const bstMap = {};
  for (const line of textStats.split(/\r?\n/)) {
    if (!line) continue;
    const parts = line.split(",");
    const pokeId = parseInt(parts[0], 10);
    const baseStat = parseInt(parts[2], 10) || 0;
    if (pokeId >= 1 && pokeId <= 1025) {
      bstMap[pokeId] = (bstMap[pokeId] || 0) + baseStat;
    }
  }

  for (let id = 1; id <= 1025; id++) {
    if (dataFr[id] && bstMap[id]) {
      dataFr[id].bst = bstMap[id];
    }
  }

  console.log("5. Téléchargement des descriptions de Pokédex en français...");
  const resFlavor = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_flavor_text.csv"
  );
  const textFlavor = await resFlavor.text();

  const regex = /(\d+),(\d+),(\d+),("[\s\S]*?"|[^\r\n]*)/g;
  let match;
  while ((match = regex.exec(textFlavor)) !== null) {
    const speciesId = parseInt(match[1], 10);
    const langId = parseInt(match[3], 10);
    if (langId === 5 && dataFr[speciesId]) {
      const rawText = match[4];
      const cleanText = rawText
        .replace(/^"|"$/g, "")
        .replace(/[\f\n\r]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (cleanText) {
        dataFr[speciesId].descriptionFr = cleanText;
      }
    }
  }

  // Nettoyage et fallback pour les Pokémon sans texte
  for (let id = 1; id <= 1025; id++) {
    if (!dataFr[id]) {
      dataFr[id] = {
        id,
        nom: `pokemon-${id}`,
        nomFr: `Pokémon #${id}`,
        categorieFr: "Pokémon",
        descriptionFr: "Données enregistrées dans le Pokédex.",
        types: ["normal"],
        taille: 1.0,
        poids: 10.0,
        bst: 400,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        imageShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`,
        criAudio: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`,
      };
    } else {
      if (!dataFr[id].nom) dataFr[id].nom = `pokemon-${id}`;
      if (!dataFr[id].types.length) dataFr[id].types = ["normal"];
      if (!dataFr[id].descriptionFr) {
        dataFr[id].descriptionFr = `Pokémon répertorié dans le Pokédex officiel sous le numéro #${String(id).padStart(3, "0")}.`;
      }
    }
  }

  const outDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, "pokemon-fr.json");
  fs.writeFileSync(outFile, JSON.stringify(dataFr, null, 2), "utf-8");

  console.log(`> Fichier enrichi avec succès : ${outFile} (${Object.keys(dataFr).length} Pokémon complets).`);
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
