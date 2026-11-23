# Task Checklist: Application Web Pokédex

**Feature ID**: `001-pokedex-app`  
**Status**: Completed (20/20)  

---

- [x] **Phase 1 : Scaffolding & Dépendances**
  - [x] 1.1 Initialiser le projet Next.js avec TypeScript, Tailwind CSS, App Router et alias `@/*`
  - [x] 1.2 Installer `zustand`
  - [x] 1.3 Configurer `next.config.ts` (autorisation du domaine d'images `raw.githubusercontent.com`)
  - [x] 1.4 Commit initial du projet

- [x] **Phase 2 : Configuration du Thème & Types**
  - [x] 2.1 Définir la palette de couleurs par type et thème Pokédex dans `app/globals.css`
  - [x] 2.2 Créer `types/pokemon.ts` (`Pokemon`, `PokemonApi`, `Statistique`, `Membre`)
  - [x] 2.3 Créer `lib/types.ts` (constante `TYPES` avec libellés FR et classes CSS)
  - [x] 2.4 Commit phase 2

- [x] **Phase 3 : Couche d'accès aux données (PokéAPI)**
  - [x] 3.1 Créer `lib/conversion.ts` (`versPokemon`, calcul des unités)
  - [x] 3.2 Créer `lib/pokeapi.ts` (appels serveur, pagination, filtrage, recherche, arbre d'évolution récursif)
  - [x] 3.3 Créer `lib/pokeapi-client.ts` (appels client pour les favoris)
  - [x] 3.4 Commit phase 3

- [x] **Phase 4 : Stores Zustand & Hydratation**
  - [x] 4.1 Implémenter `stores/favoris.ts` avec persistance `localStorage` et `skipHydration: true`
  - [x] 4.2 Implémenter `stores/sacoche.ts` (règles des 6 Pokémon, pas de doublons, surnoms, vidage)
  - [x] 4.3 Créer `components/HydratationStores.tsx` pour réhydratation côté client
  - [x] 4.4 Commit phase 4

- [x] **Phase 5 : Composants d'interface (UI)**
  - [x] 5.1 Créer `components/EnTete.tsx` et `components/IndicateurSacoche.tsx`
  - [x] 5.2 Créer `components/BadgeType.tsx` et `components/BarresStats.tsx`
  - [x] 5.3 Créer `components/BoutonFavori.tsx` et `components/BoutonSacoche.tsx`
  - [x] 5.4 Créer `components/CartePokemon.tsx` et `components/GrillePokemons.tsx`
  - [x] 5.5 Créer `components/BarreRecherche.tsx`, `components/FiltreTypes.tsx`, `components/Pagination.tsx`
  - [x] 5.6 Créer `components/SqueletteGrille.tsx`
  - [x] 5.7 Commit phase 5

- [x] **Phase 6 : Pages & Routage**
  - [x] 6.1 Configurer `app/layout.tsx` (métadonnées, en-tête, conteneur)
  - [x] 6.2 Développer `app/page.tsx` (accueil dynamique avec filtres et pagination)
  - [x] 6.3 Développer `app/pokemon/[nom]/page.tsx` (fiche détaillée, métadonnées dynamiques, évolutions)
  - [x] 6.4 Développer `app/favoris/page.tsx` (page favoris client)
  - [x] 6.5 Développer `app/sacoche/page.tsx` (page sacoche avec slots et surnoms)
  - [x] 6.6 Développer `app/a-propos/page.tsx`
  - [x] 6.7 Créer `app/not-found.tsx`, `app/loading.tsx`, `app/error.tsx`
  - [x] 6.8 Commit phase 6

- [x] **Phase 7 : Validation finale**
  - [x] 7.1 Exécuter `npm run lint` et valider zéro erreur/avertissement
  - [x] 7.2 Exécuter `npm run build` et valider la génération statique/dynamique
  - [x] 7.3 Rédiger `README.md` avec description et instructions
  - [x] 7.4 Commit final de livraison
