import { AppCard } from "@/components/AppCard";
import { CategoryChips } from "@/components/CategoryChips";
import { Layout } from "@/components/Layout";
import { RecentRow } from "@/components/RecentRow";
import { Button } from "@/components/ui/button";
import { useLauncher } from "@/hooks/use-launcher";
import { APPS, getFeaturedApp } from "@/lib/apps";
import type { CategoryFilter } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useMemo } from "react";

export interface LauncherSearch {
  q?: string;
  cat?: CategoryFilter;
}

export function parseSearch(search: Record<string, unknown>): LauncherSearch {
  const result: LauncherSearch = {};
  if (typeof search.q === "string" && search.q.length > 0) result.q = search.q;
  if (typeof search.cat === "string") result.cat = search.cat as CategoryFilter;
  return result;
}

function HeroCard({ onOpen }: { onOpen: (id: string) => void }) {
  const app = getFeaturedApp();
  return (
    <section
      aria-labelledby="hero-heading"
      data-ocid="launcher.hero"
      className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 shadow-hero md:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-dashed border-primary/40 animate-orbit-spin"
      />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
        <span
          aria-hidden="true"
          className="grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-5xl shadow-hero animate-float md:size-28"
        >
          {app.glyph}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            Carga principal
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl"
          >
            {app.name}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {app.description}
          </p>
          <Button
            type="button"
            onClick={() => onOpen(app.id)}
            data-ocid="launcher.hero_play_button"
            className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-hero transition-smooth hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Play className="size-4" />
            Jugar
          </Button>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      data-ocid="launcher.empty_state"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center"
    >
      <span aria-hidden="true" className="text-4xl">
        🔭
      </span>
      <h3 className="font-display text-lg font-bold text-foreground">
        Sin resultados en este sector
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Ninguna app coincide con tu búsqueda o filtro. Ajusta los criterios para
        volver a explorar la flota.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        data-ocid="launcher.empty_reset_button"
        className="rounded-full border-border hover:border-accent/40 hover:text-accent"
      >
        Limpiar filtros
      </Button>
    </div>
  );
}

export function LauncherPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const launcher = useLauncher();

  const query = search.q ?? "";
  const filter = search.cat ?? null;

  const setQuery = (value: string) => {
    void navigate({
      to: "/",
      search: (prev) => ({ ...prev, q: value || undefined }),
      replace: true,
    });
  };

  const setFilter = (value: CategoryFilter | null) => {
    void navigate({
      to: "/",
      search: (prev) => ({ ...prev, cat: value ?? undefined }),
      replace: true,
    });
  };

  const visibleApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return APPS.filter((app) => {
      if (filter === "favoritos" && !launcher.favorites.includes(app.id))
        return false;
      if (filter && filter !== "favoritos" && app.category !== filter)
        return false;
      if (normalized && !app.name.toLowerCase().includes(normalized))
        return false;
      return true;
    });
  }, [query, filter, launcher.favorites]);

  const openApp = (id: string) => {
    launcher.recordOpen(id);
    void navigate({ to: "/app/$appId", params: { appId: id } });
  };

  const resetFilters = () => {
    void navigate({ to: "/", search: {}, replace: true });
  };

  return (
    <Layout query={query} onQueryChange={setQuery}>
      <div className="space-y-8 md:space-y-10">
        <HeroCard onOpen={openApp} />

        <RecentRow apps={launcher.recents} onOpen={openApp} />

        <section aria-labelledby="todas-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="todas-heading"
              className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Todas las apps
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {visibleApps.length} / {launcher.totalCount} en órbita
            </p>
          </div>

          <CategoryChips active={filter} onChange={setFilter} />

          {visibleApps.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <div
              data-ocid="launcher.app_grid"
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
            >
              {visibleApps.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={index}
                  isFavorite={launcher.isFavorite(app.id)}
                  onToggleFavorite={launcher.toggleFavorite}
                  onOpen={openApp}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
