# Feature Specification: Véritable Appareil Pokédex (004-pokedex-device)

**Feature Branch**: `004-pokedex-device`  
**Status**: In Progress  
**Author**: Antigravity  

---

## 1. Description & Vision
Transformer l'application en un **véritable appareil Pokédex immersif** (format console/châssis matériel « hardware ») pensé en **Mobile-First** puis décliné sur Desktop, tout en intégrant un **système de recrutement direct in-situ** dans la sacoche pour composer son équipe sans jamais quitter la page.

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 - Recrutement Direct In-Situ dans la Sacoche (Priority: P1)
**En tant que** dresseur consultant ma sacoche (`/sacoche`),  
**Je veux** pouvoir cliquer sur un emplacement vide ou un bouton « Recruter » et sélectionner directement un Pokémon dans un tiroir/modal interactif sans être redirigé vers l'accueil,  
**Afin de** compléter mon équipe de 6 rapidement et simplement avec aperçu immédiat des stats et types.

**Critères d'acceptation** :
1. **Given** un ou plusieurs emplacements vides dans `/sacoche`,  
   **When** le dresseur clique sur l'emplacement vide ou sur le bouton « Recruter »,  
   **Then** un sélecteur de recrutement direct (tiroir/modal immersif façon Pokédex) s'ouvre sur place sans rechargement ni redirection d'URL.
2. **Given** le modal de recrutement ouvert,  
   **When** le dresseur tape un nom (FR ou EN) ou filtre par type/région,  
   **Then** les résultats s'affichent instantanément avec leur illustration, types et BST.
3. **Given** un Pokémon affiché dans le sélecteur,  
   **When** le dresseur clique sur « Enrôler dans l'équipe »,  
   **Then** le Pokémon est immédiatement ajouté au premier slot disponible, les statistiques d'équipe s'actualisent en temps réel, et le modal se ferme ou notifie le succès.
4. **Given** une équipe complète de 6 Pokémon,  
   **When** le dresseur consulte la sacoche,  
   **Then** les boutons d'ajout sont désactivés ou indiquent clairement que l'équipe est au maximum (6/6).

---

### User Story 2 - Châssis Matériel & Design Pokédex Mobile-First (Priority: P1)
**En tant que** dresseur sur mobile ou desktop,  
**Je veux** que l'interface ressemble à un véritable boîtier Pokédex authentique (châssis rouge biseauté, capteur bleu scintillant, diodes, écran numérique intégré, touches matérielles),  
**Afin de** vivre une expérience d'immersion totale digne de la série Pokémon.

**Critères d'acceptation** :
1. **Mobile-First** :
   * L'application s'affiche comme une console portable tenue en main : coque rouge Pokédex profilée avec reflets métalliques, capteur bleu à lentille réfléchissante avec halo pulsé, 3 voyants lumineux (rouge, jaune, vert).
   * Écran numérique intérieur avec encadrement haute technologie (bords graphite, fentes de haut-parleur, texture de dalle numérique avec rétroéclairage subtil).
   * Boutons matériels ergonomiques (croix directionnelle / touches d'action Pokédex stylisées).
2. **Desktop** :
   * Le boîtier Pokédex s'étend avec élégance : coque Pokédex grand format avec double volet / châssis étendu, centré sur un arrière-plan épuré de laboratoire de recherche Pokémon.
   * Conservation de la réactivité, de l'accessibilité et du mode sombre.
3. **DOOM Easter Egg** :
   * Le jeu DOOM et le Konami code restent 100% fonctionnels et intouchés.

---

### User Story 3 - Ergonomie des Interactions & Fiches (Priority: P2)
**En tant que** dresseur explorant le Pokédex,  
**Je veux** une navigation fluide, un retour visuel haptique/sonore sur les actions et des fiches détaillées parfaitement intégrées dans l'écran du boîtier,  
**Afin d'** avoir une ergonomie maximale sur écran tactile comme à la souris.

**Critères d'acceptation** :
1. Les cartes de Pokémon dans l'écran ont un format de « cartouches de données » électroniques.
2. La fiche détaillée (`/pokemon/[nom]`) s'affiche comme un scan d'analyse du Pokédex.
3. La pagination et la recherche sont directement intégrées aux commandes du Pokédex.

---

## 3. Exigences Fonctionnelles (FR)

- **FR-001** : Composant `ModalRecrutement.tsx` permettant la recherche rapide et l'enrôlement direct dans `useSacoche`.
- **FR-002** : Recherche locale et asynchrone parmi tous les Pokémon (avec mapping bilingue FR/EN).
- **FR-003** : Composant de châssis matériel `ChassisPokedex.tsx` intégrant la coque rouge biseautée, les voyants LED, la lentille caméra bleue et l'écran numérique intérieur.
- **FR-004** : Respect strict du mobile-first : adapté à tous les formats d'écrans de 360px à 4K.
- **FR-005** : Conservation absolue des 40 tests Vitest existants + nouveaux tests unitaires pour le recrutement direct.
- **FR-006** : Build de production Next.js et conformité ESLint sans aucune erreur.
