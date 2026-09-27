import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, getAppById } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const PROGRESS_STEP = 4;
const PROGRESS_INTERVAL_MS = 60;
const PROTOCOL_TIMEOUT_MS = 1800;
const COPY_FEEDBACK_MS = 2400;

function copyWithFallback(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

export function LaunchPage({ appId }: { appId: string }) {
  const navigate = useNavigate();
  const app = getAppById(appId);
  const [progress, setProgress] = useState(0);
  const [protocolFailed, setProtocolFailed] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const copyResetRef = useRef<number | null>(null);
  const protocolTimerRef = useRef<number | null>(null);
  // Set when the page loses visibility after a handoff attempt, which is the
  // only reliable signal that the native app actually took over.
  const handoffSucceededRef = useRef(false);

  // Reset the launch sequence whenever the target app changes.
  useEffect(() => {
    // `appId` keys this effect so switching apps restarts the sequence.
    void appId;
    setProgress(0);
    setProtocolFailed(false);
    handoffSucceededRef.current = false;
    const interval = window.setInterval(() => {
      setProgress((current) =>
        current >= 100 ? 100 : Math.min(100, current + PROGRESS_STEP),
      );
    }, PROGRESS_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [appId]);

  const clearProtocolTimer = useCallback(() => {
    if (protocolTimerRef.current !== null) {
      window.clearTimeout(protocolTimerRef.current);
      protocolTimerRef.current = null;
    }
  }, []);

  // Detect the user returning from the native app: when the page becomes
  // visible or focused again, dismiss the fallback notice and reset the
  // launch state so the screen is clean for the next attempt.
  useEffect(() => {
    const handleReturn = () => {
      if (document.visibilityState === "hidden") {
        // The handoff navigated away — the native app is taking over.
        handoffSucceededRef.current = true;
        return;
      }
      clearProtocolTimer();
      setProtocolFailed(false);
      setCopyState("idle");
    };

    document.addEventListener("visibilitychange", handleReturn);
    window.addEventListener("focus", handleReturn);
    return () => {
      document.removeEventListener("visibilitychange", handleReturn);
      window.removeEventListener("focus", handleReturn);
    };
  }, [clearProtocolTimer]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
      if (protocolTimerRef.current !== null) {
        window.clearTimeout(protocolTimerRef.current);
      }
    };
  }, []);

  const goBack = () => {
    void navigate({ to: "/", search: {} });
  };

  if (!app) {
    return (
      <Layout query="" onQueryChange={() => undefined}>
        <div
          data-ocid="launch.error_state"
          className="flex flex-col items-center gap-4 py-20 text-center"
        >
          <span aria-hidden="true" className="text-4xl">
            🛰️
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            App no encontrada
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Esta app no forma parte de la flota del launcher.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            data-ocid="launch.back_button"
            className="rounded-full border-border hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            Volver al launcher
          </Button>
        </div>
      </Layout>
    );
  }

  const protocol = app.protocol ?? `${app.id}://`;
  const ready = progress >= 100;

  const handleOpen = () => {
    setProtocolFailed(false);
    handoffSucceededRef.current = false;
    clearProtocolTimer();
    window.location.href = protocol;
    protocolTimerRef.current = window.setTimeout(() => {
      protocolTimerRef.current = null;
      // If the page never lost visibility, the protocol handoff did not take
      // over and the fallback notice is genuinely needed.
      if (!handoffSucceededRef.current) {
        setProtocolFailed(true);
      }
    }, PROTOCOL_TIMEOUT_MS);
  };

  const copyLink = async () => {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(protocol);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied) {
      copied = copyWithFallback(protocol);
    }

    setCopyState(copied ? "copied" : "error");
    if (copyResetRef.current !== null) {
      window.clearTimeout(copyResetRef.current);
    }
    copyResetRef.current = window.setTimeout(() => {
      setCopyState("idle");
      copyResetRef.current = null;
    }, COPY_FEEDBACK_MS);
  };

  return (
    <Layout query="" onQueryChange={() => undefined}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-6 text-center md:py-12">
        <div className="relative grid place-items-center">
          <span
            aria-hidden="true"
            className="absolute size-40 rounded-full border border-dashed border-primary/40 animate-orbit-spin md:size-52"
          />
          <span
            aria-hidden="true"
            className={cn(
              "grid size-24 place-items-center rounded-2xl bg-gradient-to-br text-5xl shadow-hero md:size-28",
              app.tileClass,
            )}
          >
            {app.glyph}
          </span>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Secuencia de lanzamiento
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {app.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {CATEGORY_LABELS[app.category]}
          </p>
        </div>

        <div className="w-full space-y-3">
          <div
            role="progressbar"
            tabIndex={0}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de lanzamiento"
            data-ocid="launch.loading_state"
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-gradient-primary transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {ready
              ? "Sistemas listos · listo para despegar"
              : `Preparando motores… ${progress}%`}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={handleOpen}
            disabled={!ready}
            data-ocid="launch.open_app_button"
            className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-hero transition-smooth hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <ExternalLink className="size-4" />
            Abrir {app.name}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            data-ocid="launch.back_button"
            className="h-11 rounded-full border-border hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            Volver al launcher
          </Button>
        </div>

        {protocolFailed ? (
          <div
            data-ocid="launch.protocol_notice"
            className="w-full space-y-3 rounded-2xl border border-warning/40 bg-muted/50 p-4 text-left"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldAlert className="size-4 text-warning" aria-hidden="true" />
              No se pudo abrir la app automáticamente
            </p>
            <p className="text-sm text-muted-foreground">
              Es posible que {app.name} no esté instalada o que el navegador
              bloquee enlaces de protocolo. Copia el enlace y ábrelo desde la
              barra de direcciones.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-background px-3 py-1.5 font-mono text-xs text-accent">
                {protocol}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void copyLink()}
                data-ocid="launch.copy_link_button"
                className={cn(
                  "rounded-full border-border transition-smooth hover:border-accent/40 hover:text-accent",
                  copyState === "copied" &&
                    "border-success/50 text-success hover:border-success/60 hover:text-success",
                )}
              >
                {copyState === "copied" ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                {copyState === "copied" ? "Enlace copiado" : "Copiar enlace"}
              </Button>
            </div>
            <output
              aria-live="polite"
              data-ocid="launch.copy_status"
              className={cn(
                "flex items-center gap-1.5 text-xs",
                copyState === "error" ? "text-destructive" : "text-success",
                copyState === "idle" && "sr-only",
              )}
            >
              {copyState === "copied" ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" />
                  Enlace copiado al portapapeles
                </>
              ) : null}
              {copyState === "error"
                ? "No se pudo copiar el enlace. Cópialo manualmente."
                : null}
            </output>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
