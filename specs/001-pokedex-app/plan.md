# Implementation Plan: Application Web Pokédex

**Feature ID**: `001-pokedex-app`  
**Status**: Ready for Implementation  

---

## 1. Stack Technique
- **Framework** : Next.js 15+ (App Router, Turbopack)
- **Langage** : TypeScript 5+ (Strict mode)
- **Style** : Tailwind CSS v4 (`@theme`)
- **Gestion d'état** : Zustand v5 (`persist` middleware, `skipHydration: true`)
- **API Source** : PokéAPI v2 (`https://pokeapi.co/api/v2/`)
- **Optimisation images** : Next/Image avec domaine distant autorisé (`raw.githubusercontent.com`)

---

## 2. Structure de l'application

```text
pokedexBis/
├── app/
│   ├── layout.tsx              # Root layout, EnTete, HydratationStores
│   ├── page.tsx                # Accueil : pagination, recherche, filtres
│   ├── loading.tsx             # Skeletons
│   ├── error.tsx               # Erreur générale
│   ├── not-found.tsx           # 404 personnalisée
│   ├── globals.css             # @import "tailwindcss" + @theme
│   ├── pokemon/[nom]/page.tsx  # Fiche détaillée & évolutions
│   ├── favoris/page.tsx        # Favoris
│   ├── sacoche/page.tsx        # Sacoche dresseur
│   └── a-propos/page.tsx       # Page À propos
├── components/
│   ├── EnTete.tsx              # Header de navigation
│   ├── IndicateurSacoche.tsx   # 6 pastilles sacoche
│   ├── BoutonFavori.tsx        # Toggle étoile
│   ├── BoutonSacoche.tsx       # Ajout/retrait sacoche
│   ├── BadgeType.tsx           # Badge stylisé de type
│   ├── BarresStats.tsx         # Jauges de statistiques
│   ├── CartePokemon.tsx        # Carte individuelle
│   ├── GrillePokemons.tsx      # Grille de cartes
│   ├── BarreRecherche.tsx      # Input recherche debouncé
│   ├── FiltreTypes.tsx         # Sélecteur de type
│   ├── Pagination.tsx          # Contrôles de pagination
│   ├── SqueletteGrille.tsx     # Squelette de chargement
│   └── HydratationStores.tsx   # Réhydratation client Zustand
├── lib/
│   ├── conversion.ts           # Transformateurs de données
│   ├── pokeapi.ts              # Appels serveur avec cache
│   ├── pokeapi-client.ts       # Appels client pour favoris
│   └── types.ts                # Dictionnaire de types & couleurs
├── stores/
│   ├── favoris.ts              # Store Zustand favoris
│   └── sacoche.ts              # Store Zustand sacoche (max 6, surnoms)
├── types/
│   └── pokemon.ts              # Types TypeScript stricts
└── next.config.ts              # Configuration Next.js (images remotePatterns)
```

---

## 3. Jalons d'exécution
1. **Initialisation** : Scaffolding Next.js, tsconfig, packages (`zustand`), `.gitignore`.
2. **Design & Thème** : `globals.css` avec les variables de types et de thème, `next.config.ts`.
3. **Typage & Données** : `types/pokemon.ts`, `lib/conversion.ts`, `lib/types.ts`, `lib/pokeapi.ts`, `lib/pokeapi-client.ts`.
4. **Stores Zustand** : `stores/favoris.ts`, `stores/sacoche.ts`, `components/HydratationStores.tsx`.
5. **Composants** : Badges, barres de stats, boutons, cartes, recherche, pagination.
6. **Pages** : Accueil, fiche détail `/pokemon/[nom]`, `/favoris`, `/sacoche`, `/a-propos`, `not-found`, `error`, `loading`.
7. **Contrôle & Build** : Validation `npm run lint` et `npm run build`.
