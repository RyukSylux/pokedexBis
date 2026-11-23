"use client";

import { useEffect } from "react";
import { useFavoris } from "@/stores/favoris";
import { useSacoche } from "@/stores/sacoche";
import { useModelePokedexStore } from "@/stores/modelePokedex";

export default function HydratationStores() {
  useEffect(() => {
    useFavoris.persist.rehydrate();
    useSacoche.persist.rehydrate();
    useModelePokedexStore.persist.rehydrate();
  }, []);

  return null;
}
