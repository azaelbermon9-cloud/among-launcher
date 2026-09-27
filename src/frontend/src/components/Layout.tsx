import { SearchBar } from "@/components/SearchBar";
import { Rocket } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  query: string;
  onQueryChange: (value: string) => void;
  children: ReactNode;
}

export function Layout({ query, onQueryChange, children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window === "undefined" ? "" : window.location.hostname;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-starfield opacity-[var(--starfield-opacity)]"
      />

      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-hero"
            >
              <Rocket className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold tracking-tight text-foreground">
                Kratos launch
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Consola de lanzamiento
              </p>
            </div>
          </div>
          <div className="ml-auto w-full max-w-xs">
            <SearchBar value={query} onChange={onQueryChange} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-border bg-muted/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center md:flex-row md:px-6 md:text-left">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Protocolo de lanzamiento · amongus://
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground transition-smooth hover:text-accent"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
