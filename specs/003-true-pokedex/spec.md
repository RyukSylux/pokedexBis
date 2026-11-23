# Feature Specification: Le Véritable Pokédex (003-true-pokedex)

**Feature Branch**: `003-true-pokedex`  
**Created**: 2026-11-23  
**Status**: In Progress  
**Input**: Requête utilisateur : transformation du Pokédex en un véritable Pokédex immersif et complet avec tests automatisés Spec Kit, sans bouton aléatoire ni mini-jeu, axé sur les données officielles, l'audio, les types et la navigation régionale.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fiche Pokédex Authentique & Immersion Sensorielle (Priority: P1)

En tant que dresseur consultant la fiche d'un Pokémon, je veux accéder aux informations officielles et sensorielles du Pokédex (cris audio officiels, variante Shiny, description française du jeu, catégorie d'espèce, tableau des faiblesses/résistances et total de statistiques de base) afin de vivre une véritable expérience de dresseur.

**Why this priority**: C'est le cœur identitaire absolu d'un Pokédex. Sans lore textuel, sans cri audio officiel et sans tableau de vulnérabilité de types, l'application reste une simple liste et non une encyclopédie Pokémon.

**Independent Test**: Ouvrir la fiche d'un Pokémon (ex: Dracaufeu ou Bulbizarre), écouter son cri audio, basculer en mode Shiny, lire sa description officielle en français et vérifier que la table des faiblesses affiche correctement ses multiplicateurs (ex: Roche ×4 pour Dracaufeu).

**Acceptance Scenarios**:
1. **Given** un dresseur sur la fiche de Dracaufeu, **When** il clique sur le bouton du cri audio, **Then** le fichier audio officiel (`cries.latest`) est joué avec un retour visuel d'onde sonore.
2. **Given** un dresseur sur la fiche d'un Pokémon, **When** il active le commutateur « Shiny / Chromatique », **Then** l'illustration bascule sur l'artwork officiel chromatique avec une animation d'étoile scintillante.
3. **Given** un dresseur sur la fiche d'un Pokémon, **When** la page se charge, **Then** la catégorie officielle en français (ex: *« Pokémon Flamme »*) et la description officielle française issue des cartouches de jeu sont affichées.
4. **Given** un dresseur sur la fiche d'un Pokémon de types Feu/Vol, **When** il consulte la table des faiblesses, **Then** le système calcule et affiche : Roche (×4), Eau (×2), Électrik (×2), Combat (×0.5), Insecte (×0.25), Plante (×0.25), Acier (×0.5), Feu (×0.5), Fée (×0.5), Sol (×0 immunité).
5. **Given** un Pokémon avec ses 6 statistiques, **When** la fiche s'affiche, **Then** le Total des Statistiques de Base (BST) est calculé et affiché avec une jauge et un badge d'évaluation (ex: standard, puissant, légendaire).

---

### User Story 2 - Chaîne d'Évolution Narrative & Conditions Réelles (Priority: P1)

En tant que dresseur consultant les évolutions d'un Pokémon, je veux voir les conditions exactes requises pour chaque évolution (niveau requis, pierre d'évolution, bonheur, échange) présentées sur une frise chronologique reliée par des flèches, afin de savoir exactement comment faire évoluer mon Pokémon.

**Why this priority**: Dans un vrai Pokédex, connaître la méthode d'évolution (Pierre Feu pour Évoli, Niveau 16 pour Bulbizarre, etc.) est une information essentielle que tout dresseur consulte.

**Independent Test**: Consulter la chaîne d'évolution d'Évoli, de Salamèche et de Mackogneur, et vérifier que chaque transition affiche la flèche et la condition précise (Pierre, Niveau, Échange).

**Acceptance Scenarios**:
1. **Given** un Pokémon évoluant par niveau (ex: Salamèche vers Reptincel), **When** sa chaîne d'évolution s'affiche, **Then** une flèche indique « Niv. 16 ».
2. **Given** un Pokémon évoluant par pierre (ex: Évoli vers Aquali), **When** sa chaîne d'évolution s'affiche, **Then** une flèche indique « Pierre Eau ».
3. **Given** un Pokémon sans évolution (ex: Lockpin ou Ronflex sans pré-évolution dans l'équipe), **When** sa fiche s'affiche, **Then** le statut d'évolution est clair et ne génère aucune erreur d'affichage.

---

### User Story 3 - Navigation Régionale & Recherche Bilingue FR / EN (Priority: P2)

En tant que dresseur naviguant sur l'accueil, je veux filtrer les Pokémon par Génération / Région (de Kanto Gen 1 à Paldea Gen 9) et chercher indifféremment par nom français ou anglais afin de trouver n'importe quel Pokémon sans être bloqué par la langue.

**Why this priority**: Avec 1025 Pokémon, la pagination aveugle est fastidieuse. Les dresseurs recherchent naturellement par région (ex: « Pokémon de Johto ») et en français (ex: « Dracaufeu » au lieu de « charizard »).

**Independent Test**: Sélectionner la région « Johto » et vérifier que seuls les Pokémon #152 à #251 sont listés. Taper « Dracaufeu » dans la recherche et vérifier qu'il apparaît immédiatement.

**Acceptance Scenarios**:
1. **Given** l'accueil du Pokédex, **When** le dresseur sélectionne l'onglet « Kanto », **Then** seuls les Pokémon du #001 au #151 sont affichés.
2. **Given** la barre de recherche, **When** le dresseur tape « Dracaufeu » ou « Salameche », **Then** le système effectue la correspondance bilingue et affiche les résultats correspondants.
3. **Given** les résultats affichés, **When** le dresseur sélectionne le tri par « Total de stats (BST) », **Then** les Pokémon sont classés du plus puissant au moins puissant.

---

### User Story 4 - Outils Stratégiques de Dresseur (Comparateur & Synergie Sacoche) (Priority: P3)

En tant que dresseur composant son équipe dans la sacoche, je veux un analyseur de synergie révélant les faiblesses critiques communes de mon équipe de 6 ainsi que sa couverture offensive, et un comparateur de Pokémon en duel pour optimiser mes choix.

**Why this priority**: Donne une utilité concrète et tactique à la sacoche au-delà du simple inventaire.

**Independent Test**: Ajouter 3 Pokémon de type Plante dans la sacoche et vérifier que l'analyseur alerte sur une faiblesse critique commune face au Feu et au Vol.

**Acceptance Scenarios**:
1. **Given** une équipe de Pokémon dans `/sacoche`, **When** le dresseur consulte l'analyseur d'équipe, **Then** les vulnérabilités cumulées sont calculées et mises en évidence.
2. **Given** la page `/comparateur`, **When** le dresseur sélectionne 2 Pokémon, **Then** leurs statistiques sont superposées et l'avantage de type direct est calculé.

---

## Edge Cases

- Pokémon ayant un seul type vs double type : le calcul de multiplicateur de type doit gérer correctement les produits de coefficients (ex: 2 × 2 = 4, 2 × 0.5 = 1, 2 × 0 = 0).
- Pokémon sans fichier audio de cri disponible : le bouton audio doit être désactivé avec état gracieux sans faire planter l'interface.
- Recherche sans résultat : message convivial invitant à vérifier l'orthographe en français ou anglais.
- Chaînes d'évolutions complexes à branches multiples (ex: Évoli avec 8 évolutions distinctes, Débugant, Chenipotte) : l'affichage doit prendre en compte les arborescences.

---

## Functional Requirements

- **FR-001**: Le système DOIT fournir un lecteur audio pour le cri officiel de chaque Pokémon via PokéAPI (`cries.latest`).
- **FR-002**: Le système DOIT permettre de basculer l'affichage de l'artwork officiel entre la version Standard et la version Shiny (Chromatique).
- **FR-003**: Le système DOIT extraire et afficher la description textuelle (flavor text) officielle en français issue de `pokemon-species`.
- **FR-004**: Le système DOIT extraire et afficher le nom de genre/catégorie d'espèce en français (ex: « Pokémon Graine »).
- **FR-005**: Le système DOIT calculer la table d'efficacité complète des 18 types défensifs (faiblesses ×4/×2, résistances ×0.5/×0.25, immunités ×0) pour n'importe quelle combinaison mono ou bi-type.
- **FR-006**: Le système DOIT calculer le Total des Statistiques de Base (BST) de chaque Pokémon.
- **FR-007**: Le système DOIT analyser l'arbre d'évolution et extraire les détails de condition d'évolution (niveau minimal, objet/pierre, méthode).
- **FR-008**: Le système DOIT supporter le filtrage par région/génération (Générations 1 à 9) avec synchronisation d'URL.
- **FR-009**: Le système DOIT permettre la recherche bilingue (noms français et anglais).
- **FR-010**: Le système DOIT proposer des options de tri (Numéro, Nom alphabétique, BST).
- **FR-011**: Le système DOIT analyser la composition de la sacoche et afficher le diagnostic des faiblesses cumulées de l'équipe.
- **FR-012**: Le système DOIT disposer d'une suite de tests unitaires automatisés validant tous les calculs de type, parsers et transformations.

---

## Success Criteria

- **SC-001**: 100% des tests unitaires automatisés passent avec succès (`npm test`).
- **SC-002**: Le calcul d'efficacité des types est rigoureusement conforme aux règles de la 9ème génération Pokémon pour l'ensemble des 18 types.
- **SC-003**: Le temps de réponse pour la recherche bilingue et le filtrage régional reste inférieur à 150 ms.
- **SC-004**: Zéro erreur d'hydratation Next.js et conformité stricte ESLint / TypeScript (`npm run lint` & `npm run build`).
