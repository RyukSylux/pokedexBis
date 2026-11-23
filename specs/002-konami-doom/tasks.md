# Task Checklist: Easter Egg Konami Code & DOOM

**Feature ID**: `002-konami-doom`  
**Status**: Completed  

---

- [x] **Phase 1 : Logique de détection & Hook Konami**
  - [x] 1.1 Créer `components/Doom/useKonami.ts` (séquence de 10 touches, validation, reset)
  - [x] 1.2 Ajouter le support des gestes / tap multi-clic secret pour mobile

- [x] **Phase 2 : Manette rétro virtuelle pour Mobile**
  - [x] 2.1 Développer `components/Doom/MobileCheatPad.tsx` avec D-Pad, boutons B/A, retours haptiques et sons rétro
  - [x] 2.2 Relier la manette virtuelle au validateur du Konami Code

- [x] **Phase 3 : Modal de jeu DOOM**
  - [x] 3.1 Développer `components/Doom/DoomModal.tsx` avec intégration WebAssembly, style borne CRT et bouton quitter
  - [x] 3.2 Ajouter le support des contrôles tactiles intégrés pour mobile

- [x] **Phase 4 : Intégration globale & Lazy Loading**
  - [x] 4.1 Développer `components/Doom/KonamiDetector.tsx` avec chargement différé
  - [x] 4.2 Intégrer `KonamiDetector` dans `app/layout.tsx` et connecter le logo Pokéball dans `components/EnTete.tsx`

- [x] **Phase 5 : Contrôles qualité & Tests**
  - [x] 5.1 Vérifier la conformité TypeScript et ESLint (`npm run lint`)
  - [x] 5.2 Valider le build de production Next.js (`npm run build`)
  - [x] 5.3 Commit Git dédié
