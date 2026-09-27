import { CATEGORY_LABELS } from "@/lib/apps";
import { cn } from "@/lib/utils";
import type { LauncherApp } from "@/types";
import { Star } from "lucide-react";

interface AppCardProps {
  app: LauncherApp;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
}

export function AppCard({
  app,
  index,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: AppCardProps) {
  return (
    <div
      data-ocid={`launcher.app_card.${index + 1}`}
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(app.id)}
        data-ocid={`launcher.app_open_button.${index + 1}`}
        className="flex w-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-elevated transition-smooth hover:-translate-y-1 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-12 place-items-center rounded-xl bg-gradient-to-br text-2xl",
            app.tileClass,
          )}
        >
          {app.glyph}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold tracking-tight text-foreground">
            {app.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {CATEGORY_LABELS[app.category]}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(app.id)}
        aria-label={
          isFavorite
            ? `Quitar ${app.name} de favoritos`
            : `Añadir ${app.name} a favoritos`
        }
        aria-pressed={isFavorite}
        data-ocid={`launcher.favorite_button.${index + 1}`}
        className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-accent/15 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Star
          className={cn(
            "size-4 transition-transform group-hover:scale-110",
            isFavorite && "fill-accent text-accent",
          )}
        />
      </button>
    </div>
  );
}
