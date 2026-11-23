# Spécification Multi-Châssis Pokédex : 6 Modèles Authentiques

## 1. Objectif & Vision
Offrir à l'utilisateur une expérience ultime de collection de Pokédex physiques et interactifs. L'utilisateur peut basculer instantanément entre **6 modèles emblématiques de Pokédex** issus des jeux vidéo officiels et de l'animé, reproduits fidèlement avec leurs proportions, leurs écrans et leurs mécanismes de navigation signatures (carrousel tactile HGSS, Poké-molette DPPt, roller GBA FRLG, clapet rétro Kanto, terminal cybernétique Unys, et Motisma-Dex expressif d'Alola).

---

## 2. Les 6 Modèles Disponibles

### Modèle 1 : Pokédex HeartGold & SoulSilver (`hgss`) — Nintendo DS
- **Châssis** : Boîtier double écran argenté et rouge rubis, finitions douces Nintendo DS Lite.
- **Mécanique Signature** : Le **carrousel tactile circulaire** (jog-dial en arc de cercle) au bas de l'écran avec les icônes Pokémon disposées sur une piste courbée que l'on fait tourner au doigt ou à la souris.
- **Écran Supérieur** : Fiche analytique complète (Sprite animé, numéro, empreinte, stats, cri sonore, description officielle en français).

### Modèle 2 : Pokédex Diamant & Perle / Platine (`dppt`) — Nintendo DS
- **Châssis** : Double écran avec charnière centrale foncée, bordeaux et métal.
- **Mécanique Signature** : La **Poké-molette mécanique** (Poké Ball jog-dial) sur le flanc droit de l'écran inférieur qui tourne et contrôle le défilement rapide. Boutons tactiles de filtre par habitat, poids et taille.
- **Écran Supérieur** : Radar matriciel avec affichage holographique du Pokémon actif.

### Modèle 3 : Pokédex Rouge Feu & Vert Feuille (`frlg`) — Game Boy Advance
- **Châssis** : Boîtier cylindrique rouge vif avec charnière rotative centrale noire.
- **Mécanique Signature** : Écran LCD rétro Game Boy Advance avec **roller cranté vertical sur la droite** qui s'anime et tourne pendant le scroll.
- **Ambiance** : Rétro 16-bit, indicateurs de boutons L/R de tranche pour sauter les sections.

### Modèle 4 : Pokédex Kanto Classique (`kanto`) — Animé (Sacha / "Dexter")
- **Châssis** : Le légendaire clapet rabattable rouge vif avec charnière gauche.
- **Mécanique Signature** : Grande lentille optique bleue pulsante ("œil de bœuf"), trio de diodes LED (rouge, jaune, verte), écran LCD vert/gris avec scanlines, pavé directionnel et clavier numérique.
- **Ambiance** : Bips sonores 8-bit, interface mécanique rétro-futuriste.

### Modèle 5 : Pokédex Noir & Blanc (`unova`) — Nintendo DS (Unys)
- **Châssis** : Format ultra-plat façon smartphone / PDA technologique noir laqué et liserés rouges néon.
- **Mécanique Signature** : Slider tactile moderne épuré, fiches holographiques sombres, radar de statistiques en polygone néon, animations de scan dynamiques.

### Modèle 6 : Motisma-Dex (`rotom`) — Nintendo 3DS (Alola)
- **Châssis** : Coque Motisma rouge électrique avec cornes en plasma orange lumineux et aileron supérieur.
- **Mécanique Signature** : **Yeux animés de Motisma** au sommet de l'appareil qui clignent, sourient et réagissent aux clics et interactions, interface vive et colorée.

---

## 3. Sélecteur de Modèle Pokédex
- Un composant dédié `SelecteurModelePokedex` accessible à tout moment dans l'en-tête ou la console Pokédex.
- Affiche la liste des 6 modèles avec leur nom d'origine, génération et badge visuel.
- Changement de modèle immédiat sans rechargement de page.
- Persistance du choix utilisateur dans le `localStorage` (`clef: pokedex-modele-chassis`).

---

## 4. Scénarios Gherkin (Acceptance Tests)

### Scénario 1 : Changement de modèle Pokédex et persistance
- **Étant donné** un utilisateur naviguant sur l'encyclopédie Pokédex
- **Quand** il sélectionne le modèle "HeartGold / SoulSilver" dans le sélecteur
- **Alors** le châssis et l'interface affichent le carrousel rotatif tactile et le boîtier HGSS
- **Et** le choix est sauvegardé dans le stockage local

### Scénario 2 : Interaction avec la Poké-molette Diamant & Perle
- **Étant donné** le Pokédex en mode "Diamant & Perle"
- **Quand** l'utilisateur fait tourner la Poké-molette sur l'écran inférieur
- **Alors** la liste des Pokémon défile en accord avec la rotation et le Pokémon actif est mis à jour sur l'écran supérieur

### Scénario 3 : Réactivité Mobile-First et Desktop
- **Étant donné** un écran smartphone (largeur < 640px)
- **Quand** n'importe lequel des 6 modèles est actif
- **Alors** l'appareil s'adapte harmonieusement sans débordement horizontal avec des contrôles tactiles confortables
