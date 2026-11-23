# Task Checklist: Véritable Appareil Pokédex (004-pokedex-device)

**Feature ID**: `004-pokedex-device`  
**Status**: In Progress  

---

- [x] **Phase 1 : Tests Unitaires TDD du Recrutement Direct & Logique Métier**
  - [x] 1.1 Écrire `tests/recrutement-direct.test.ts` (test de recherche rapide, suggestion de candidats, ajout direct dans le store sans doublon, respect du plafond de 6)
  - [x] 1.2 Valider l'exécution des tests avec `npm test`

- [x] **Phase 2 : Modal / Sélecteur de Recrutement Direct In-Situ (`ModalRecrutement.tsx`)**
  - [x] 2.1 Créer `components/ModalRecrutement.tsx` avec champ de recherche réactif, sélection de types/régions, aperçu immédiat des stats et bouton d'enrôlement en un clic
  - [x] 2.2 Intégrer `ModalRecrutement` dans `app/sacoche/page.tsx` en remplacement de la redirection vers `/`
  - [x] 2.3 Rendre tous les slots libres cliquables pour ouvrir ce modal et recruter instantanément

- [x] **Phase 3 : Châssis Pokédex Matériel Mobile-First (`ChassisPokedex.tsx`)**
  - [x] 3.1 Créer les styles de châssis Pokédex (coque rouge biseautée, bordures métalliques, relief 3D, reflets) dans `app/globals.css`
  - [x] 3.2 Créer le composant `components/ChassisPokedex.tsx` avec grand capteur bleu lumineux pulsant, 3 LED dynamiques, écran numérique biseauté avec texture LCD et touches physiques inférieures (D-Pad, boutons A/B)
  - [x] 3.3 Intégrer `ChassisPokedex` dans `app/layout.tsx` de façon harmonieuse : plein écran mobile-first, boîtier console ergonomique sur desktop

- [x] **Phase 4 : Métamorphose de l'Écran Numérique & Cartouches de Données**
  - [x] 4.1 Adapter `components/EnTete.tsx` pour s'intégrer élégamment avec le bandeau matériel supérieur
  - [x] 4.2 Rehausser les cartes (`components/CartePokemon.tsx`) avec un look cartouche électronique / puce de données Pokédex
  - [x] 4.3 Rehausser la fiche détaillée (`app/pokemon/[nom]/page.tsx`) avec un style terminal d'analyse haute fidélité

- [x] **Phase 5 : Contrôles Qualité Globaux & Tests Automatisés**
  - [x] 5.1 Exécuter la suite complète de tests `npm test` (tests existants + nouveaux tests)
  - [x] 5.2 Valider `npm run lint` (0 avertissement, 0 erreur)
  - [x] 5.3 Valider `npm run build` (build statique & dynamique Next.js 15)
  - [x] 5.4 Commit Git propre et structuré
