# Implementation Plan: Easter Egg Konami Code & DOOM

**Feature ID**: `002-konami-doom`  
**Status**: Ready for Implementation  

---

## 1. Architecture Technique

```text
components/
└── Doom/
    ├── KonamiDetector.tsx      # Composant global montant les écouteurs (clavier + trigger mobile)
    ├── MobileCheatPad.tsx      # Modal contrôleur rétro virtuel (D-Pad + B + A)
    ├── DoomModal.tsx           # Modal plein écran hébergeant l'émulateur WebAssembly DOOM
    └── useKonami.ts            # Hook personnalisé gérant la séquence et la détection
```

---

## 2. Choix d'implémentation

1. **Émulateur DOOM** :
   - Intégration d'un runner WebAssembly / JS-DOS embarqué sécurisé (`dos.zone` / HTML5 DOOM shareware) prenant en charge :
     - Les contrôles clavier natifs (flèches, ZQSD, Ctrl/Espace).
     - Les contrôles tactiles intégrés pour smartphone/tablette.
     - L'audio Sound Blaster / AdLib d'époque.

2. **Détection du code** :
   - Hook `useKonami` avec historique glissant des touches saisies.
   - Support des touches directionnelles physiques (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) et des touches d'action (`KeyB`, `KeyA`).
   - Détection mobile : écoute des taps répétés sur l'icône Pokéball (5 taps en 2.5 secondes) déclenchant l'ouverture de la manette virtuelle `MobileCheatPad`.

3. **Optimisation Next.js** :
   - Import dynamique sans SSR (`dynamic(() => import(...), { ssr: false })`) de la modal `DoomModal` afin de ne charger aucun script lourd dans le bundle initial du Pokédex.
