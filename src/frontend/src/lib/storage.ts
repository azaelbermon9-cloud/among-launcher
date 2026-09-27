const FAVORITES_KEY = "orbital-deck:favorites";
const RECENTS_KEY = "orbital-deck:recents";

export const MAX_RECENTS = 6;

function readStringArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStringArray(key: string, values: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Storage may be unavailable (private mode, quota); the UI stays functional.
  }
}

export function loadFavorites(): string[] {
  return readStringArray(FAVORITES_KEY);
}

export function saveFavorites(ids: string[]): void {
  writeStringArray(FAVORITES_KEY, ids);
}

export function loadRecents(): string[] {
  return readStringArray(RECENTS_KEY);
}

export function saveRecents(ids: string[]): void {
  writeStringArray(RECENTS_KEY, ids);
}
