import fs from "node:fs";
import path from "node:path";

async function main() {
  console.log("1. Téléchargement des noms et catégories en français...");
  const resNames = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv"
  );
  const textNames = await resNames.text();

  const dataFr = {};

  // Header: pokemon_species_id,local_language_id,name,genus
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
          nomFr,
          categorieFr: categorieFr || "Pokémon",
          descriptionFr: "",
        };
      }
    }
  }

  console.log(`> ${Object.keys(dataFr).length} noms français indexés.`);

  console.log("2. Téléchargement des descriptions de Pokédex en français...");
  const resFlavor = await fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_flavor_text.csv"
  );
  const textFlavor = await resFlavor.text();

  // Parser simple pour CSV multi-lignes avec guillemets
  // Format: species_id,version_id,language_id,flavor_text
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

  // Pour les Pokémon très récents de Gen 9 dont les descriptions ne sont pas encore dans le CSV PokéAPI,
  // fournir une description canonique par défaut
  for (let id = 1; id <= 1025; id++) {
    if (!dataFr[id]) {
      dataFr[id] = {
        nomFr: `Pokémon #${id}`,
        categorieFr: "Pokémon",
        descriptionFr: "Données de recherche enregistrées dans le Pokédex.",
      };
    } else if (!dataFr[id].descriptionFr) {
      dataFr[id].descriptionFr = `Pokémon répertorié dans le Pokédex sous le numéro #${String(id).padStart(3, "0")}.`;
    }
  }

  const outDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, "pokemon-fr.json");
  fs.writeFileSync(outFile, JSON.stringify(dataFr, null, 2), "utf-8");

  console.log(`> Fichier généré avec succès : ${outFile} (${Object.keys(dataFr).length} entrées).`);
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
