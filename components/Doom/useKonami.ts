"use client";

import { useEffect, useState, useCallback } from "react";

export const SEQUENCE_KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(onSuccess: () => void) {
  const [saisie, setSaisie] = useState<string[]>([]);

  const normaliserTouche = (touche: string): string => {
    const min = touche.toLowerCase();
    if (min === "arrowup" || min === "up") return "ArrowUp";
    if (min === "arrowdown" || min === "down") return "ArrowDown";
    if (min === "arrowleft" || min === "left") return "ArrowLeft";
    if (min === "arrowright" || min === "right") return "ArrowRight";
    if (min === "b" || min === "keyb") return "b";
    if (min === "a" || min === "keya") return "a";
    return touche;
  };

  const verifierSequence = useCallback(
    (nouvelleSaisie: string[]) => {
      const longueur = SEQUENCE_KONAMI.length;
      if (nouvelleSaisie.length > longueur) {
        nouvelleSaisie = nouvelleSaisie.slice(-longueur);
      }

      const match = nouvelleSaisie.every(
        (val, index) => val === SEQUENCE_KONAMI[index]
      );

      if (match && nouvelleSaisie.length === longueur) {
        onSuccess();
        return [];
      }

      // Vérifie si le début correspond toujours
      const debutCorrect = nouvelleSaisie.every(
        (val, index) => val === SEQUENCE_KONAMI[index]
      );

      return debutCorrect ? nouvelleSaisie : [];
    },
    [onSuccess]
  );

  const ajouterTouche = useCallback(
    (toucheBrute: string) => {
      const touche = normaliserTouche(toucheBrute);
      setSaisie((precedente) => verifierSequence([...precedente, touche]));
    },
    [verifierSequence]
  );

  const reinitialiser = useCallback(() => {
    setSaisie([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si l'utilisateur est en train de taper dans un champ de formulaire
      const cible = event.target as HTMLElement | null;
      if (
        cible &&
        (cible.tagName === "INPUT" ||
          cible.tagName === "TEXTAREA" ||
          cible.isContentEditable)
      ) {
        return;
      }

      ajouterTouche(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ajouterTouche]);

  return {
    saisie,
    ajouterTouche,
    reinitialiser,
    progression: saisie.length,
    total: SEQUENCE_KONAMI.length,
  };
}
