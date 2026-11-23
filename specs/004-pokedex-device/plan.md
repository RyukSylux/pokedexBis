# Implementation Plan: Véritable Appareil Pokédex (004-pokedex-device)

## Technical Context
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, custom CSS variables in `globals.css`
- **State Management**: Zustand with `skipHydration: true` and persist
- **Testing**: Vitest (`npm test`), testing-library
- **Quality Gates**: `npm test` (100% pass), `npm run lint` (0 errors), `npm run build` (production build pass)

## Architecture & Components Design

### 1. Module de Recrutement Direct In-Situ (`ModalRecrutement.tsx`)
- Placé dans `app/sacoche/page.tsx`
- S'ouvre lorsqu'un dresseur clique sur un slot vide ou sur un bouton « + Recruter un Pokémon »
- Fournit une barre de recherche rapide (noms FR et EN), un filtre rapide par type, et une liste de Pokémon suggérés
- Chaque Pokémon est cliquable : appel direct à `ajouter(pokemon)` du store `useSacoche`
- Affichage instantané du statut (ajouté, déjà présent, ou équipe pleine)
- Fermeture avec bouton ✕ ou touche Échap ou clic en arrière-plan

### 2. Architecture Visuelle Pokédex Hardware (`ChassisPokedex.tsx`)
- **Structure physique du boîtier** :
  - **Châssis supérieur** : Bandeau rouge biseauté (`bg-gradient-to-b from-red-600 via-pokedex to-red-800`), grande lentille optique bleue rétroéclairée avec halo pulsant (`animate-pulse`), 3 diodes LED biseautées (rouge, ambre, vert).
  - **Encadrement d'écran** : Biseau sombre métallique (gris titane/ardoise), vis de fixation aux coins, fentes de haut-parleur stéréo gauche/droite.
  - **Dalle numérique intérieure** : Écran LCD haute technologie avec rétroéclairage subtil, grille de pixels microscopique, coins arrondis, lisibilité parfaite en mode sombre et clair.
  - **Touches et contrôles matériels inférieurs** : Croix directionnelle D-pad stylisée, boutons d'action A/B bicolores, bouton d'éjection/menu, et logo gravé Pokédex.
- **Mobile First** :
  - Sur mobile, le boîtier enveloppe l'écran naturellement comme un Pokédex physique portable dans la main du joueur.
  - Sur desktop, le boîtier prend l'allure d'un terminal de recherche Pokédex de luxe avec bordures arrondies, ombres portées profondes (`shadow-2xl`) et relief 3D.

### 3. Constitution Check
- **20/20 rubric compliant** : Tous les critères de la grille officielle Next.js sont strictement conservés et renforcés.
- **DOOM untouched** : Le composant DOOM WASM reste intact sous son code Konami.
- **TDD / Automated Tests** : Nouveaux tests pour le recrutement direct et conservation des 40 tests existants.
