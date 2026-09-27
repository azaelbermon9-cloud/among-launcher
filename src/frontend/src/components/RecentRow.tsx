import { cn } from "@/lib/utils";
import type { LauncherApp } from "@/types";
import { Clock } from "lucide-react";

interface RecentRowProps {
  apps: LauncherApp[];
  onOpen: (id: string) => void;
}

export function RecentRow({ apps, onOpen }: RecentRowProps) {
  if (apps.length === 0) return null;

  return (
    <section aria-labelledby="recientes-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock aria-hidden="true" className="size-4 text-accent" />
        <h2
          id="recientes-heading"
          className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Recientes
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {apps.map((app, index) => (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpen(app.id)}
            data-ocid={`launcher.recent_item.${index + 1}`}
            className="flex min-w-[9.5rem] shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 text-left shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-lg",
                app.tileClass,
              )}
            >
              {app.glyph}
            </span>
            <span className="min-w-0 truncate font-display text-sm font-semibold text-foreground">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
