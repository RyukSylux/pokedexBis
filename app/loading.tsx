import SqueletteGrille from "@/components/SqueletteGrille";

export default function Chargement() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      <SqueletteGrille count={24} />
    </div>
  );
}
