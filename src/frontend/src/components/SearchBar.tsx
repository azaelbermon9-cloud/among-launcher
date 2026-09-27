import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar apps"
        aria-label="Buscar apps"
        data-ocid="launcher.search_input"
        className="h-10 rounded-full border-border bg-secondary/60 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent/40"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          data-ocid="launcher.search_clear_button"
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-accent/15 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
