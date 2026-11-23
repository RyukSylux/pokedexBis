"use client";

import { useModelePokedexStore } from "@/stores/modelePokedex";
import { Pokemon } from "@/types/pokemon";
import ModeleHGSS from "./ModeleHGSS";
import ModeleDPPt from "./ModeleDPPt";
import ModeleFRLG from "./ModeleFRLG";
import ModeleKanto from "./ModeleKanto";
import ModeleUnova from "./ModeleUnova";
import ModeleRotom from "./ModeleRotom";

type Props = {
  pokemons: Pokemon[];
};

export default function NavigateurPokedex({ pokemons }: Props) {
  const modeleActif = useModelePokedexStore((state) => state.modeleActif);

  switch (modeleActif) {
    case "dppt":
      return <ModeleDPPt pokemons={pokemons} />;
    case "hgss":
      return <ModeleHGSS pokemons={pokemons} />;
    case "frlg":
      return <ModeleFRLG pokemons={pokemons} />;
    case "kanto":
      return <ModeleKanto pokemons={pokemons} />;
    case "unova":
      return <ModeleUnova pokemons={pokemons} />;
    case "rotom":
      return <ModeleRotom pokemons={pokemons} />;
    default:
      return <ModeleDPPt pokemons={pokemons} />;
  }
}
