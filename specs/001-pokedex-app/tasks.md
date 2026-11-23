# Task Checklist: Application Web Pokédex

**Feature ID**: `001-pokedex-app`  
**Status**: Ready  

---

- [ ] **Phase 1 : Scaffolding & Dépendances**
  - [ ] 1.1 Initialiser le projet Next.js avec TypeScript, Tailwind CSS, App Router et alias `@/*`
  - [ ] 1.2 Installer `zustand`
  - [ ] 1.3 Configurer `next.config.ts` (autorisation du domaine d'images `raw.githubusercontent.com`)
  - [ ] 1.4 Commit initial du projet

- [ ] **Phase 2 : Configuration du Thème & Types**
  - [ ] 2.1 Définir la palette de couleurs par type et thème Pokédex dans `app/globals.css`
  - [ ] 2.2 Créer `types/pokemon.ts` (`Pokemon`, `PokemonApi`, `Statistique`, `Membre`)
  - [ ] 2.3 Créer `lib/types.ts` (constante `TYPES` avec libellés FR et classes CSS)
  - [ ] 2.4 Commit phase 2

- [ ] **Phase 3 : Couche d'accès aux données (PokéAPI)**
  - [ ] 3.1 Créer `lib/conversion.ts` (`versPokemon`, calcul des unités)
  - [ ] 3.2 Créer `lib/pokeapi.ts` (appels serveur, pagination, filtrage, recherche, arbre d'évolution récursif)
  - [ ] 3.3 Créer `lib/pokeapi-client.ts` (appels client pour les favoris)
  - [ ] 3.4 Commit phase 3

- [ ] **Phase 4 : Stores Zustand & Hydratation**
  - [ ] 4.1 Implémenter `stores/favoris.ts` avec persistance `localStorage` et `skipHydration: true`
  - [ ] 4.2 Implémenter `stores/sacoche.ts` (règles des 6 Pokémon, pas de doublons, surnoms, vidage)
  - [ ] 4.3 Créer `components/HydratationStores.tsx` pour réhydratation côté client
  - [ ] 4.4 Commit phase 4

- [ ] **Phase 5 : Composants d'interface (UI)**
  - [ ] 5.1 Créer `components/EnTete.tsx` et `components/IndicateurSacoche.tsx`
  - [ ] 5.2 Créer `components/BadgeType.tsx` et `components/BarresStats.tsx`
  - [ ] 5.3 Créer `components/BoutonFavori.tsx` et `components/BoutonSacoche.tsx`
  - [ ] 5.4 Créer `components/CartePokemon.tsx` et `components/GrillePokemons.tsx`
  - [ ] 5.5 Créer `components/BarreRecherche.tsx`, `components/FiltreTypes.tsx`, `components/Pagination.tsx`
  - [ ] 5.6 Créer `components/SqueletteGrille.tsx`
  - [ ] 5.7 Commit phase 5

- [ ] **Phase 6 : Pages & Routage**
  - [ ] 6.1 Configurer `app/layout.tsx` (métadonnées, en-tête, conteneur)
  - [ ] 6.2 Développer `app/page.tsx` (accueil dynamique avec filtres et pagination)
  - [ ] 6.3 Développer `app/pokemon/[nom]/page.tsx` (fiche détaillée, métadonnées dynamiques, évolutions)
  - [ ] 6.4 Développer `app/favoris/page.tsx` (page favoris client)
  - [ ] 6.5 Développer `app/sacoche/page.tsx` (page sacoche avec slots et surnoms)
  - [ ] 6.6 Développer `app/a-propos/page.tsx`
  - [ ] 6.7 Créer `app/not-found.tsx`, `app/loading.tsx`, `app/error.tsx`
  - [ ] 6.8 Commit phase 6

- [ ] **Phase 7 : Validation finale**
  - [ ] 7.1 Exécuter `npm run lint` et corriger tout avertissement
  - [ ] 7.2 Exécuter `npm run build` et valider la génération statique/dynamique
  - [ ] 7.3 Rédiger `README.md` avec description et instructions
  - [ ] 7.4 Commit final de livraison
