import { TYPES } from "@/lib/types";

export default function BadgeType({ type }: { type: string }) {
  const definition = TYPES[type.toLowerCase()];
  const libelle = definition ? definition.libelle : type;
  const classe = definition ? definition.classe : "bg-gray-500";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 ${classe}`}
    >
      {libelle}
    </span>
  );
}
