# Tâches d'Implémentation : 6 Modèles de Pokédex Authentiques

- [x] **Phase 1 : Socle de données & Store des modèles**
  - [x] Créer `lib/pokedex-modeles.ts` définissant les 6 modèles (id, nom, sousTitre, console, epoque, description, couleurs, calcul d'arc HGSS).
  - [x] Créer `stores/modelePokedex.ts` pour stocker le modèle actif avec persistance localStorage.
  - [x] Écrire les tests unitaires TDD pour le store et les métadonnées (`tests/pokedex-modeles.test.ts`).

- [x] **Phase 2 : Composants des 6 Châssis & Écrans Signatures**
  - [x] Créer `components/modes/ModeleHGSS.tsx` avec carrousel tactile en arc de cercle et écran analytique double-écran.
  - [x] Créer `components/modes/ModeleDPPt.tsx` avec double écran et Poké-molette tactile droite rotative.
  - [x] Créer `components/modes/ModeleFRLG.tsx` avec coque cylindrique, écran LCD 16-bit et roller mécanique GBA.
  - [x] Créer `components/modes/ModeleKanto.tsx` avec clapet rétro, grande lentille optique bleue et diodes de Dexter.
  - [x] Créer `components/modes/ModeleUnova.tsx` avec design cybernétique et fiches holographiques sombres.
  - [x] Créer `components/modes/ModeleRotom.tsx` avec yeux expressifs animés, commentaires de Motisma et cornes électriques.

- [x] **Phase 3 : Sélecteur de Modèle & Intégration globale**
  - [x] Créer `components/selecteur/SelecteurModelePokedex.tsx` permettant de commuter en 1 clic entre les 6 modèles.
  - [x] Mettre à jour `components/ChassisPokedex.tsx` pour orchestrer le châssis actif et les finitions visuelles.
  - [x] Créer `components/modes/NavigateurPokedex.tsx` et mettre à jour `app/page.tsx`.

- [x] **Phase 4 : Tests & Validation**
  - [x] Exécuter la suite de tests Vitest complète (62 tests passés sur 62).
  - [x] Vérifier la compilation Next.js en production (`npm run build`).
  - [x] Redémarrer le serveur dev et valider.
