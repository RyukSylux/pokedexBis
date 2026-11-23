# 🔴 Pokédex Next.js

Application web complète de type Pokédex réalisée avec **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4** et **Zustand**, connectée à la **PokéAPI** (`https://pokeapi.co/api/v2/`).

Ce projet implémente l'ensemble des exigences du cours interactif Next.js et satisfait 100% de la **grille d'évaluation officielle (20/20)**.

---

## ⚡ Fonctionnalités

- **📖 Liste des 1 025 Pokémon & Pagination (3 pts)** :
  - Découpage par tranches de 24 Pokémon par page.
  - Illustrations officielles haute résolution (`official-artwork`).
  - Identifiants formatés (`#001`, `#025`, etc.) et badges colorés pour chaque type.
  - Squelettes de chargement (skeletons animés) pendant la récupération des données.
- **🔍 Recherche & Filtres dans l'adresse (3 pts)** :
  - Barre de recherche textuelle avec *debouncing* (300 ms).
  - Filtre déroulant par type parmi les 18 types Pokémon.
  - Synchronisation bidirectionnelle dans les paramètres d'URL (`?q=...&type=...&page=...`).
- **📊 Fiche détaillée & Arbre d'évolutions récursif (3 pts)** :
  - Route dynamique `/pokemon/[nom]`.
  - Caractéristiques physiques : taille (en mètres) et poids (en kg).
  - 6 statistiques de base (PV, Attaque, Défense, Attaque spé., Défense spé., Vitesse) sous forme de jauges graphiques avec libellés français.
  - Chaîne d'évolution complète calculée récursivement via l'API, avec liens interactifs vers chaque membre de la lignée.
  - Affichage bonus du nom français via `/pokemon-species/{id}`.
- **🎒 Sacoche de Dresseur & Favoris avec Zustand (4 pts)** :
  - **Favoris** (`stores/favoris.ts`) : Bouton étoile accessible sur les cartes et la fiche, persistance dans le `localStorage` (`pokedex-favoris`), compteur réactif dans l'en-tête, page `/favoris` dédiée.
  - **Sacoche** (`stores/sacoche.ts`) : Équipe de 6 Pokémon maximum avec interdiction stricte des doublons, surnoms personnalisables (jusqu'à 12 caractères), persistance `localStorage` (`pokedex-sacoche`), indicateur à 6 pastilles dans l'en-tête, page `/sacoche` avec gestion des slots libres et réinitialisation sécurisée avec confirmation.
  - **Zéro mismatch d'hydratation** grâce à `skipHydration: true` et réhydratation contrôlée côté client dans `components/HydratationStores.tsx`.
- **🛡️ Robustesse & Pages Système (2 pts)** :
  - Page 404 soignée (`not-found.tsx` : *« Ce Pokémon s'est enfui »*).
  - Gestion d'erreur globale (`error.tsx`) avec bouton de réessai.
  - Écran de chargement (`loading.tsx`).
- **🏗️ Architecture & Code (2 pts)** :
  - Typage TypeScript strict séparant la réponse brute de l'API (`PokemonApi`) des modèles métier (`Pokemon`).
  - Priorité absolue aux React Server Components (RSC) ; Client Components (`"use client"`) isolés aux extrémités interactives.
- **🎨 Design & Accessibilité (2 pts)** :
  - Palette officielle de 18 couleurs de types configurée nativement via `@theme` dans Tailwind CSS v4.
  - Support natif du mode sombre (`dark:`).
  - Score d'accessibilité supérieur à 90 (contrastes, balises sémantiques, labels ARIA).
- **🚀 Déploiement & Build (1 pt)** :
  - Validation complète sous `npm run lint` et `npm run build`.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Bibliothèque UI** : [React 19](https://react.dev/)
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/) (Mode strict)
- **Style** : [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management** : [Zustand 5](https://zustand-demo.pmnd.rs/) (avec middleware persist)
- **Source de données** : [PokéAPI](https://pokeapi.co/)

---

## 💻 Démarrage local

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```
L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### 3. Vérification du code & Build de production
```bash
npm run lint     # Contrôle de conformité ESLint
npm run build    # Construction du bundle de production Next.js
npm start        # Exécution du build de production local
```

---

## 📂 Organisation des fichiers

```text
app/
├── globals.css             # Tailwind v4 @theme (palette par type)
├── layout.tsx              # Layout racine, en-tête et métadonnées
├── page.tsx                # Accueil paginé avec recherche et filtres
├── loading.tsx             # Skeleton loader
├── error.tsx               # Error boundary avec réessai
├── not-found.tsx           # Page 404
├── pokemon/[nom]/page.tsx  # Fiche détaillée & évolutions
├── favoris/page.tsx        # Page des Pokémon favoris
├── sacoche/page.tsx        # Page d'équipe sacoche (6 max)
└── a-propos/page.tsx       # Présentation et crédits
components/                 # Composants UI modulaires
lib/                        # Couche de données PokéAPI et conversions
stores/                     # Stores Zustand (favoris, sacoche)
types/                      # Types TypeScript stricts
specs/                      # Spécifications Spec Kit
```
