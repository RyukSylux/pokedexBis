# Task Checklist: Le Véritable Pokédex (003-true-pokedex)

**Feature ID**: `003-true-pokedex`  
**Status**: In Progress  

---

- [x] **Phase 1 : Configuration des Tests & Extensions du Modèle de Données**
  - [x] 1.1 Configurer `vitest` et le script `npm test` dans `package.json`
  - [x] 1.2 Mettre à jour `types/pokemon.ts` pour supporter cri audio, sprite shiny, description FR, catégorie d'espèce, détails d'évolution et BST
  - [x] 1.3 Étendre `lib/conversion.ts` pour extraire ces propriétés depuis les payloads PokéAPI

- [x] **Phase 2 : Moteur d'Efficacité des Types & Tests TDD**
  - [x] 2.1 Écrire les tests unitaires `tests/types-efficacite.test.ts` (mono-type, bi-type, immunités, multiplicateurs ×4, ×2, ×0.5, ×0.25, ×0)
  - [x] 2.2 Implémenter le moteur de calcul d'efficacité dans `lib/types-efficacite.ts` pour les 18 types
  - [x] 2.3 Exécuter `npm test` et valider 100% de passage des tests d'efficacité

- [x] **Phase 3 : Immersion Fiche Pokédex (Cris, Shiny, Lore FR & Tableau des Faiblesses)**
  - [x] 3.1 Développer le composant audio `components/LecteurCri.tsx` (avec animation d'onde sonore et gestion d'erreur)
  - [x] 3.2 Développer `components/VisuelPokemon.tsx` avec bascule Normal / Shiny (Chromatique)
  - [x] 3.3 Développer `components/TableauFaiblesses.tsx` affichant les multiplicateurs de dégâts reçus
  - [x] 3.4 Enrichir `lib/pokeapi.ts` pour récupérer description et catégorie en français
  - [x] 3.5 Mettre à jour `app/pokemon/[nom]/page.tsx` avec toutes les données immersives (cri, shiny, description, catégorie, faiblesses, BST)

- [x] **Phase 4 : Chaîne d'Évolution Narrative & Conditions Réelles**
  - [x] 4.1 Écrire les tests unitaires `tests/evolution.test.ts` validant l'extraction des conditions (niveau, pierre, échange)
  - [x] 4.2 Implémenter l'analyseur récursif des conditions d'évolution dans `lib/pokeapi.ts`
  - [x] 4.3 Développer `components/FriseEvolution.tsx` avec flèches indicatrices et badges de conditions
  - [x] 4.4 Intégrer `FriseEvolution` dans `app/pokemon/[nom]/page.tsx`

- [x] **Phase 5 : Navigation par Régions (Gen 1-9) & Recherche Bilingue FR / EN**
  - [x] 5.1 Créer `lib/generations.ts` (plages de Kanto Gen 1 à Paldea Gen 9) et ses tests `tests/generations.test.ts`
  - [x] 5.2 Créer `lib/recherche-bilingue.ts` pour mapper les noms français/anglais et ses tests `tests/recherche-bilingue.test.ts`
  - [x] 5.3 Développer `components/SelecteurGeneration.tsx` (onglets régionaux sur la page d'accueil)
  - [x] 5.4 Mettre à jour `components/BarreRecherche.tsx` et `app/page.tsx` pour intégrer recherche bilingue et tris (numéro, nom, BST)

- [x] **Phase 6 : Analyseur de Synergie d'Équipe dans la Sacoche**
  - [x] 6.1 Écrire les tests unitaires `tests/sacoche-synergie.test.ts` (détection des faiblesses cumulées)
  - [x] 6.2 Implémenter l'algorithme d'analyse d'équipe dans `lib/synergie-equipe.ts`
  - [x] 6.3 Développer `components/AnalyseurEquipe.tsx` et l'intégrer dans `app/sacoche/page.tsx`

- [x] **Phase 7 : Contrôles Qualité Globaux & Finalisation**
  - [x] 7.1 Exécuter la suite complète de tests `npm test`
  - [x] 7.2 Vérifier la conformité TypeScript et ESLint (`npm run lint`)
  - [x] 7.3 Valider le build de production Next.js (`npm run build`)
  - [x] 7.4 Commit Git dédié

- [x] **Phase 8 : Refonte Ergonomique de la Sacoche & Ceinture de Dresseur**
  - [x] 8.1 Écrire les tests unitaires `tests/sacoche-store.test.ts` (ajout, retrait, réordonner `deplacer`, renommage)
  - [x] 8.2 Étendre `stores/sacoche.ts` avec la méthode `deplacer(from, to)` et le stockage des stats
  - [x] 8.3 Repenser intégralement l'UI de `app/sacoche/page.tsx` (6 slots combat numérotés, badge Lead #01, boutons monter/descendre, édition surnom intuitive, résumé des stats totales d'équipe)

- [x] **Phase 9 : Ergonomie Globale de l'Interface (Header, Cartes, Barre d'outils)**
  - [x] 9.1 Développer `components/BoutonSacocheRapide.tsx` et l'intégrer sur `components/CartePokemon.tsx`
  - [x] 9.2 Améliorer `components/EnTete.tsx` et `components/IndicateurSacoche.tsx` avec design Pokédex haut de gamme
  - [x] 9.3 Ajouter le bouton de vidage rapide (✕) dans `components/BarreRecherche.tsx`
  - [x] 9.4 Valider la suite de tests et le build complet
