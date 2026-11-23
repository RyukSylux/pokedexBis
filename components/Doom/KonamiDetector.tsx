"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useKonami } from "./useKonami";

// Chargement différé pour préserver à 100% les performances et le bundle de base
const DoomModal = dynamic(() => import("./DoomModal"), {
  ssr: false,
});

const MobileCheatPad = dynamic(() => import("./MobileCheatPad"), {
  ssr: false,
});

export const EVENEMENT_CHEAT_PAD = "pokedex:ouvrir-cheat-pad";

export function ouvrirCheatPadMobile() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENEMENT_CHEAT_PAD));
  }
}

export default function KonamiDetector() {
  const [doomOuvert, setDoomOuvert] = useState(false);
  const [cheatPadOuvert, setCheatPadOuvert] = useState(false);

  const { progression, ajouterTouche, reinitialiser } = useKonami(() => {
    // Fermer la manette si ouverte et ouvrir DOOM
    setCheatPadOuvert(false);
    setDoomOuvert(true);
  });

  useEffect(() => {
    const handleOuvrirCheat = () => {
      reinitialiser();
      setCheatPadOuvert(true);
    };

    window.addEventListener(EVENEMENT_CHEAT_PAD, handleOuvrirCheat);
    return () => {
      window.removeEventListener(EVENEMENT_CHEAT_PAD, handleOuvrirCheat);
    };
  }, [reinitialiser]);

  return (
    <>
      {cheatPadOuvert && (
        <MobileCheatPad
          ouvert={cheatPadOuvert}
          onFermer={() => setCheatPadOuvert(false)}
          onTouche={ajouterTouche}
          progression={progression}
        />
      )}

      {doomOuvert && (
        <DoomModal
          ouvert={doomOuvert}
          onFermer={() => setDoomOuvert(false)}
        />
      )}
    </>
  );
}
