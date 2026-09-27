import { FILTERS } from "@/lib/apps";
import { cn } from "@/lib/utils";
import type { CategoryFilter } from "@/types";

interface CategoryChipsProps {
  active: CategoryFilter | null;
  onChange: (value: CategoryFilter | null) => void;
}

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <fieldset
      aria-label="Filtrar por categoría"
      className="flex flex-wrap gap-2 border-0 p-0"
    >
      {FILTERS.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            data-ocid={`launcher.filter.${filter.id}`}
            onClick={() => onChange(isActive ? null : filter.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              isActive
                ? "border-accent bg-accent text-accent-foreground shadow-subtle"
                : "border-border bg-muted/60 text-muted-foreground hover:border-accent/40 hover:text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </fieldset>
  );
}
