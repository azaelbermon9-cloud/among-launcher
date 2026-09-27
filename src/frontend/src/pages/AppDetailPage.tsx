import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLauncher } from "@/hooks/use-launcher";
import { CATEGORY_LABELS, getAppById } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Share2, Star } from "lucide-react";
import { toast } from "sonner";

interface AppDetailPageProps {
  appId: string;
}

export function AppDetailPage({ appId }: AppDetailPageProps) {
  const navigate = useNavigate();
  const launcher = useLauncher();
  const app = getAppById(appId);

  if (!app) {
    return (
      <Layout query="" onQueryChange={() => undefined}>
        <div
          data-ocid="launcher.error_state"
          className="flex flex-col items-center gap-4 py-20 text-center"
        >
          <span aria-hidden="true" className="text-4xl">
            🛰️
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            App no encontrada
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Esta app no está en el catálogo del launcher. Vuelve a la consola
            para elegir otra.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void navigate({ to: "/", search: {} })}
            data-ocid="launcher.back_button"
            className="rounded-full border-border hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            Volver al launcher
          </Button>
        </div>
      </Layout>
    );
  }

  const favorite = launcher.isFavorite(app.id);

  const share = async () => {
    const url = `${window.location.origin}/app/${app.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: app.name,
          text: app.description,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("No se pudo compartir la app");
    }
  };

  const play = () => {
    launcher.recordOpen(app.id);
    void navigate({ to: "/app/$appId/launch", params: { appId: app.id } });
  };

  return (
    <Layout query="" onQueryChange={() => undefined}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => void navigate({ to: "/", search: {} })}
          data-ocid="launcher.back_button"
          className="rounded-full text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Volver al launcher
        </Button>

        <section
          aria-labelledby="app-detail-heading"
          data-ocid="launcher.detail_panel"
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevated md:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full border border-dashed border-accent/25 animate-orbit-spin"
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
            <span
              aria-hidden="true"
              className={cn(
                "grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-5xl shadow-hero md:size-28",
                app.tileClass,
              )}
            >
              {app.glyph}
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Ficha de app
              </p>
              <h1
                id="app-detail-heading"
                className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              >
                {app.name}
              </h1>
              <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {CATEGORY_LABELS[app.category]}
              </span>
              <p className="text-sm text-muted-foreground md:text-base">
                {app.description}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={play}
            data-ocid="launcher.primary_button"
            className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-hero transition-smooth hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Play className="size-4" />
            Jugar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => launcher.toggleFavorite(app.id)}
            aria-pressed={favorite}
            data-ocid="launcher.favorite_button"
            className="h-11 rounded-full border-border hover:border-accent/40 hover:text-accent"
          >
            <Star
              className={cn("size-4", favorite && "fill-accent text-accent")}
            />
            {favorite ? "En favoritos" : "Añadir a favoritos"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void share()}
            data-ocid="launcher.share_button"
            className="h-11 rounded-full border-border hover:border-accent/40 hover:text-accent"
          >
            <Share2 className="size-4" />
            Compartir
          </Button>
        </div>
      </div>
    </Layout>
  );
}
