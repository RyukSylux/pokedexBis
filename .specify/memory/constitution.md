# Pokédex Project Constitution

## Core Principles

### I. Spec-Driven & Grille-Conformant (20/20)
All features implemented must directly satisfy the official evaluation grid from the Next.js Pokédex course:
- Paginated list (24/page) with official artwork, formatted IDs, and type badges (3 pts)
- Detailed Pokémon view with stats bars and recursive evolution tree (3 pts)
- Search and type filtering synchronized via URL search params (3 pts)
- Zustand global stores for favorites and trainer bag with business rules & persistence (4 pts)
- Loading skeletons, API error recovery, and custom 404 page (2 pts)
- Strict TypeScript contracts and clean layered architecture (2 pts)
- High-quality responsive UI, Tailwind CSS v4, dark mode, Lighthouse a11y > 90 (2 pts)
- Production-ready linting, build, and documentation (1 pt)

### II. Server-First & Client-Isolated
Components are React Server Components by default. Interactivity is isolated into minimal Client Components (`"use client"`) at the leaves of the render tree.

### III. Zero Hydration Mismatches
Persistent stores (Zustand) must use `skipHydration: true` and explicit rehydration inside `useEffect` (`HydratationStores`) to prevent SSR/client divergence.

### IV. Type-Safe Data Layer
Clear separation between PokéAPI raw response types (`PokemonApi`) and internal application domain types (`Pokemon`). Conversion logic is centralized in `lib/conversion.ts`.

### V. Responsive & Accessible UI
Semantic HTML elements, ARIA attributes, keyboard navigation, and responsive grid layouts tailored for mobile and desktop viewports.

## Governance
This constitution guides all development iterations and commits. Every milestone must compile cleanly with `npm run build` and pass `npm run lint`.

**Version**: 1.0.0 | **Ratified**: 2026-11-23
