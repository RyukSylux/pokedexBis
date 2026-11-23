# Feature Specification: Easter Egg Konami Code & DOOM

**Feature ID**: `002-konami-doom`  
**Status**: Approved  
**Author**: Antigravity  

---

## 1. Description & Objectifs
Intégrer un Easter Egg déclenché par le célèbre **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`), permettant de lancer le jeu culte **DOOM (1993)** directement dans le navigateur, tant sur ordinateur (via clavier physique) que sur smartphone / tablette (via interactions tactiles et manette rétro virtuelle).

---

## 2. Exigences Fonctionnelles (User Stories)

### US1 : Détection Clavier Desktop
- **En tant qu'** utilisateur sur ordinateur, **je veux** taper la séquence `↑ ↑ ↓ ↓ ← → ← → B A` sur mon clavier physique à tout moment, **afin de** déverrouiller et lancer DOOM instantanément.
- **Critères d'acceptation** :
  - Buffer glissant de 10 touches écoutant les codes : `ArrowUp`, `ArrowUp`, `ArrowDown`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `ArrowLeft`, `ArrowRight`, `b`/`KeyB`, `a`/`KeyA`.
  - Insensible à la casse.
  - Déclenchement automatique dès la séquence complétée.

### US2 : Détection & Manette Virtuelle Mobile
- **En tant qu'** utilisateur sur smartphone ou tablette, **je veux** pouvoir saisir le Konami Code sans clavier physique, **afin de** profiter de l'expérience sur mobile.
- **Critères d'acceptation** :
  - **Déclencheur secret** : Tap rapide (5 fois) sur la Pokéball de l'en-tête (avec vibration haptique `navigator.vibrate`).
  - **Manette rétro pop-up** : Affichage d'un contrôleur rétro tactile (D-Pad directionnel + boutons B et A).
  - Validation tactile du code Konami avec son / animation rétro.

### US3 : Borne de jeu DOOM en WebAssembly
- **En tant que** joueur, **je veux** jouer à DOOM dans une fenêtre modale plein écran soignée avec son et contrôles, **afin de** revivre l'expérience originale.
- **Critères d'acceptation** :
  - Exécution fluide de DOOM (épisode 1 *Knee-Deep in the Dead*) via un runner WebAssembly / JS-DOS optimisé.
  - Ambiance rétro : bandeau cathodique CRT, bandeau de contrôle, boutons Plein écran et Fermer.
  - Fermeture facile via touche `Échap` ou bouton dédié `[ Quitter ]`.
  - Contrôles tactiles pris en charge pour les utilisateurs mobiles.

### US4 : Performance & Isolation
- **Critères d'acceptation** :
  - **Lazy-loading strict** : Aucun asset DOOM n'est téléchargé au chargement du Pokédex (`next/dynamic` avec `ssr: false`).
  - Aucun impact sur les temps de chargement, l'hydratation ou les scores Lighthouse du Pokédex.
  - Zéro warning ou erreur TypeScript et ESLint.
