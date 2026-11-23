# Implementation Plan: Le Véritable Pokédex (003-true-pokedex)

**Branch**: `003-true-pokedex` | **Date**: 2026-11-23 | **Spec**: [specs/003-true-pokedex/spec.md](spec.md)

---

## Summary

Amélioration en profondeur du Pokédex Next.js pour en faire une véritable référence dresseur complète :
- Données officielles immersives : cri audio officiel (`cries.latest`), mode Chromatique (Shiny), description de jeu et catégorie en français, conditions réelles d'évolution.
- Moteur d'efficacité des 18 types Pokémon (calcul matriciel des faiblesses ×4/×2, résistances ×0.5/×0.25, immunités ×0).
- Total des statistiques de base (BST).
- Découpage par région/génération (Gen 1 Kanto à Gen 9 Paldea), recherche bilingue FR/EN, tris avancés.
- Analyseur de synergie d'équipe dans la sacoche.
- **Suite de tests automatisés (Vitest)** garantissant l'exactitude mathématique des types et la robustesse de chaque composant logique.

---

## Technical Context

- **Framework**: Next.js 15.1.7 (App Router, Server Components + minimal Client Components)
- **Language**: TypeScript 5.7.3 (mode strict)
- **Styles**: Tailwind CSS v4
- **State Management**: Zustand v5 (avec `skipHydration: true` et réhydratation contrôlée)
- **Data Source**: PokéAPI v2 (`https://pokeapi.co/api/v2`)
- **Testing**: Vitest (`npm test` / `vitest run`)
- **Audio**: Web Audio API / HTML5 Audio natif pour les cris officiels

---

## Constitution Check

| Principe Constitutionnel | Statut | Justification |
| :--- | :--- | :--- |
| **I. Conformité Grille & Qualité** | PASS | Renforce toutes les fonctionnalités sans casser l'existant. |
| **II. Server-First & Client-Isolated** | PASS | La fiche et la liste restent en React Server Components ; seuls le lecteur de cri, le toggle Shiny et les filtres interactifs sont isolés en Client Components. |
| **III. Zéro Hydration Mismatch** | PASS | `suppressHydrationWarning` en place, pas de `Math.random` ou `Date.now` dans le SSR. |
| **IV. Couche de données type-safe** | PASS | Typage strict étendu dans `types/pokemon.ts` et conversion centralisée dans `lib/conversion.ts`. |
| **V. Responsive & Accessible** | PASS | Rendu soigné desktop et mobile, contrastes respectés, accessibilité ARIA pour les lecteurs audio et sélecteurs. |

---

## Project Structure & Architecture

```text
pokedexBis/
├── specs/003-true-pokedex/
│   ├── spec.md             # Spécification détaillée
│   ├── plan.md             # Ce document d'architecture
│   └── tasks.md            # Checklist des tâches ordonnées et TDD
├── lib/
│   ├── conversion.ts       # Extensions du modèle Pokémon (cris, shiny, BST, etc.)
│   ├── pokeapi.ts          # Appels enrichis (flavor text, genera, evolution details)
│   ├── types-efficacite.ts # Moteur matriciel des 18 types (faiblesses/résistances)
│   ├── generations.ts      # Définition des 9 générations / régions (Kanto à Paldea)
│   └── recherche-bilingue.ts # Index bilingue FR/EN pour recherche instantanée
├── components/
│   ├── LecteurCri.tsx      # Composant audio officiel avec onde sonore
│   ├── VisuelPokemon.tsx   # Affichage officiel avec bascule Normal / Shiny
│   ├── TableauFaiblesses.tsx # Matrice visuelle des vulnérabilités / résistances
│   ├── FriseEvolution.tsx  # Arbre d'évolution narratif avec flèches et conditions
│   ├── SelecteurGeneration.tsx # Onglets de navigation par région/génération
│   └── AnalyseurEquipe.tsx # Diagnostic stratégique dans la sacoche
├── tests/
│   ├── types-efficacite.test.ts # Tests mathématiques des multiplicateurs de type
│   ├── conversion.test.ts       # Tests des transformations de données et BST
│   ├── generations.test.ts      # Tests des bornes de générations et régions
│   ├── recherche-bilingue.test.ts # Tests de la recherche FR/EN
│   └── sacoche-synergie.test.ts # Tests de détection des faiblesses d'équipe
```

---

## Testing Strategy (Vitest)

1. **Tests unitaires d'efficacité des types** :
   - Mono-type : Feu contre Eau (×2 dégâts reçus), Plante contre Eau (×0.5), Normal contre Spectre (×0 immunité).
   - Bi-type : Feu / Vol contre Roche (2 × 2 = ×4), contre Insecte (0.5 × 0.5 = ×0.25), contre Sol (immunité ×0).
   - Cas complexes : Ténèbres / Spectre, Acier / Fée, Eau / Sol.
2. **Tests du modèle et calculs** :
   - Calcul exact du BST (somme des 6 stats de base).
   - Construction des URLs audio et sprites Shiny.
   - Extraction des conditions d'évolution (Niveau, Pierre, Échange).
3. **Tests de recherche et régions** :
   - Filtre par génération (ex: Kanto renvoie 151 Pokémon).
   - Recherche bilingue : "dracaufeu" trouve Charizard (#6), "pikachu" trouve Pikachu (#25).
4. **Tests de synergie d'équipe** :
   - Détection des faiblesses prépondérantes (ex: 3 Pokémon faibles à l'Électrik).
