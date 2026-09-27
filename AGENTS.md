# Project Guidance

## User Preferences

- Idioma de la interfaz: español
- Enfoque en abrir Among Us como acción principal
- Estética espacial para el launcher
- Nombre de la app: Kratos launch

## Verified Commands

- **typecheck**: `pnpm --dir app typecheck`
- **fix**: `pnpm --dir app fix`
- **build**: `pnpm --dir app build`

## Learnings

- Launcher app is frontend-only: static catalog in src/frontend/src/lib/apps.ts, persistence in lib/storage.ts, state in hooks/use-launcher.ts, pages in src/pages/ (LauncherPage, AppDetailPage, LaunchPage).
- TanStack Router code-based routes with validateSearch for URL-reflected search/filter state.
- Copy-to-clipboard feedback must be self-contained on the page (local state + aria-live output + execCommand fallback); a global toast may not be mounted on secondary routes.
- Vitest + React Testing Library suite lives in src/frontend/src/**/*.test.tsx; run with pnpm --dir app test.
- window.location.href to a custom protocol does not unload the SPA; detect a successful handoff via document.visibilityState going 'hidden' after the click, and show the fallback notice only when the page stayed visible.
- CSS variables declared in index.css are not Tailwind utilities until registered in tailwind.config.js colors; text-warning/border-success silently emit no CSS.
