export default function SqueletteGrille({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col items-center rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"
        >
          <div className="mb-3 size-36 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mb-2 h-3 w-12 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-3 h-5 w-28 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="flex gap-2">
            <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
