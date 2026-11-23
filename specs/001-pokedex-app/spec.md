# Feature Specification: Application Web Pokédex

**Feature ID**: `001-pokedex-app`  
**Status**: Approved  
**Author**: Antigravity  
**Target Score**: 20/20 (Grille officielle du cours Next.js)

---

## 1. Description & Objectifs
Développer une application web moderne de type Pokédex répertoriant les 1 025 Pokémon existants, exploitant l'App Router de Next.js, TypeScript, Tailwind CSS et Zustand. L'application consomme la PokéAPI publique (`https://pokeapi.co/api/v2/`).

---

## 2. Exigences Fonctionnelles (User Stories)

### US1 : Consultation du Pokédex & Pagination (3 pts)
- **En tant que** visiteur, **je veux** voir la liste des Pokémon par tranches de 24, avec leur illustration officielle, leur numéro formaté (`#001`) et leurs types, **afin de** parcourir l'ensemble des 1 025 Pokémon de façon fluide.
- **Critères d'acceptation** :
  - 24 Pokémon par page.
  - Pagination avec boutons « Précédent » et « Suivant », synchronisée via le paramètre URL `?page=`.
  - Affichage d'un squelette (Skeleton) animé pendant le chargement.

### US2 : Fiche détaillée & Chaîne d'évolutions (3 pts)
- **En tant que** dresseur, **je veux** cliquer sur un Pokémon pour ouvrir `/pokemon/[nom]` et consulter ses détails, **afin de** connaître sa taille, son poids, ses statistiques et ses évolutions.
- **Critères d'acceptation** :
  - Illustration officielle en grand format.
  - Nom capitalisé, identifiant, types sous forme de badges colorés, taille en mètres, poids en kg.
  - 6 statistiques présentées sous forme de barres horizontales (PV, Attaque, Défense, Attaque spé., Défense spé., Vitesse) calculées par rapport au maximum 255.
  - Chaîne d'évolution complète calculée récursivement (`pokemon-species` -> `evolution_chain`), chaque étape étant cliquable.
  - Erreur 404 déclenchée (`notFound()`) pour tout nom ou identifiant inexistant.

### US3 : Recherche et Filtres dans l'adresse (3 pts)
- **En tant que** visiteur, **je veux** chercher un Pokémon par nom et filtrer par type, **afin de** trouver rapidement les créatures recherchées.
- **Critères d'acceptation** :
  - Champ de recherche textuel avec debouncing (300 ms) répercuté dans l'URL (`?q=`).
  - Sélecteur de type parmi les 18 types existants répercuté dans l'URL (`?type=`).
  - Conservation conjointe des filtres et de la pagination.

### US4 : Favoris & Sacoche du Dresseur avec Zustand (4 pts)
- **En tant que** dresseur, **je veux** ajouter des Pokémon à mes favoris et composer une équipe de 6 Pokémon dans ma sacoche, **afin de** conserver mes choix d'une visite à l'autre.
- **Critères d'acceptation** :
  - **Favoris** (`stores/favoris.ts`) : Bouton étoile accessible sur les cartes et la fiche. Persistance `localStorage` (`pokedex-favoris`). Compteur de favoris dans l'en-tête. Page `/favoris` dédiée.
  - **Sacoche** (`stores/sacoche.ts`) : Max 6 Pokémon, pas de doublons autorisés, surnom personnalisable (12 caractères max), suppression d'un membre, bouton optionnel « Vider la sacoche ».
  - **Indicateur Sacoche** : En-tête avec 6 pastilles reflétant l'état de l'équipe et lien direct vers `/sacoche`.
  - **Page `/sacoche`** : Cartes des 6 membres + emplacements libres ("Emplacement libre") pointant vers l'accueil, affichage des types couverts.
  - **Zéro mismatch d'hydratation** grâce à `skipHydration: true` et réhydratation côté client dans `HydratationStores`.

### US5 : États système & Robustesse (2 pts)
- **Critères d'acceptation** :
  - `loading.tsx` avec grille de skeletons.
  - `error.tsx` avec message clair et bouton de réessai.
  - `not-found.tsx` avec titre *« Ce Pokémon s’est enfui »* et bouton retour vers l'accueil.

### US6 : Qualité du code & Architecture (2 pts)
- **Critères d'acceptation** :
  - Séparation `types/pokemon.ts`, `lib/conversion.ts`, `lib/pokeapi.ts`, `lib/pokeapi-client.ts`, `lib/types.ts`.
  - Composants serveur pour les pages et affichages statiques.
  - Composants client (`"use client"`) strictement limités aux feuilles interactives.

### US7 : Interface & Thème (2 pts)
- **Critères d'acceptation** :
  - Thème Tailwind CSS v4 avec rouge Pokédex (`#d2232f`) et 18 couleurs de types.
  - Responsive design (mobile, tablette, desktop).
  - Prise en charge du thème sombre (`dark:`).
  - Score d'accessibilité Lighthouse > 90.

### US8 : Déploiement & Build (1 pt)
- **Critères d'acceptation** :
  - `npm run lint` passe sans erreur ni avertissement.
  - `npm run build` génère le bundle de production sans encombre.
  - README.md complet et documenté.
