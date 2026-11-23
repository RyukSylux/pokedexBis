# Plan d'Architecture Technique : Multi-Châssis 6 Pokédex Authentiques

## 1. Découpage Modulaire

```
lib/
├── pokedex-modeles.ts         # Types, définitions métadonnées, configuration des 6 modèles
stores/
├── useModelePokedexStore.ts   # Zustand store avec persistance localStorage pour le modèle actif
components/
├── selecteur/
│   └── SelecteurModelePokedex.tsx # Sélecteur ergonomique avec prévisualisations
├── chassis/
│   ├── ChassisHGSS.tsx        # Châssis & carrousel tactile circulaire HeartGold/SoulSilver
│   ├── ChassisDPPt.tsx        # Châssis double écran avec Poké-molette mécanique Diamant/Perle
│   ├── ChassisFRLG.tsx        # Châssis cylindrique avec roller mécanique latéral Rouge Feu/Vert Feuille
│   ├── ChassisKanto.tsx       # Châssis clapet rétro avec lentille bleue & diodes Sacha/Dexter
│   ├── ChassisUnova.tsx       # Châssis smartphone cybernétique Noir & Blanc
│   └── ChassisRotom.tsx       # Châssis Motisma-Dex avec yeux animés interactifs & cornes plasma
└── ChassisPokedex.tsx         # Orchestrateur réactif qui injecte le châssis sélectionné
```

## 2. Données & Intégrité
- Tous les modèles consomment la même source de données unifiée : les 1 025 Pokémon français avec descriptions officielles, cris audio et statistiques.
- Aucun impact sur DOOM (`components/Doom/` sanctuarisé).
- Aucun impact sur la sacoche et le recrutement direct en équipe.

## 3. Stratégie de Test TDD (Vitest)
- `tests/pokedex-modeles.test.ts` : Validation des configurations, des identifiants et des mécaniques associées.
- `tests/modele-store.test.ts` : Validation du store Zustand, changement d'état et persistance.
- `tests/carrousel-hgss.test.ts` : Validation mathématique du calcul d'arc de cercle pour le carrousel rotatif HGSS.
