export type CategoryId = "juegos" | "social" | "utilidades" | "productividad";

export interface AppCategory {
  id: CategoryId;
  label: string;
}

export interface LauncherApp {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Custom protocol used to hand off to the native app, e.g. "amongus://". */
  protocol?: string;
  /** Emoji glyph used as the app icon when no image asset exists. */
  glyph: string;
  /** Tailwind gradient utility classes for the icon tile. */
  tileClass: string;
  featured?: boolean;
}

export type CategoryFilter = CategoryId | "favoritos";
