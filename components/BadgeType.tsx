import { TYPES } from "@/lib/types";

type Props = {
  type: string;
  taille?: "sm" | "md" | "lg";
};

export default function BadgeType({ type, taille = "md" }: Props) {
  const definition = TYPES[type.toLowerCase()];
  const libelle = definition ? definition.libelle : type;
  const classe = definition ? definition.classe : "bg-gray-500";

  const stylesTaille =
    taille === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : taille === "lg"
      ? "px-3.5 py-1 text-sm"
      : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold text-white shadow-sm transition hover:brightness-105 ${stylesTaille} ${classe}`}
    >
      {libelle}
    </span>
  );
}
