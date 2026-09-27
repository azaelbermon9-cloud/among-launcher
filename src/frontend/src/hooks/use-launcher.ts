import { APPS, getAppById } from "@/lib/apps";
import {
  MAX_RECENTS,
  loadFavorites,
  loadRecents,
  saveFavorites,
  saveRecents,
} from "@/lib/storage";
import type { CategoryFilter, LauncherApp } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface LauncherState {
  query: string;
  setQuery: (value: string) => void;
  filter: CategoryFilter | null;
  setFilter: (value: CategoryFilter | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  recents: LauncherApp[];
  recordOpen: (id: string) => void;
  visibleApps: LauncherApp[];
  totalCount: number;
}

export function useLauncher(): LauncherState {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CategoryFilter | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
    setRecentIds(loadRecents());
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const recordOpen = useCallback((id: string) => {
    setRecentIds((current) => {
      const next = [id, ...current.filter((item) => item !== id)].slice(
        0,
        MAX_RECENTS,
      );
      saveRecents(next);
      return next;
    });
  }, []);

  const recents = useMemo(
    () =>
      recentIds
        .map((id) => getAppById(id))
        .filter((app): app is LauncherApp => Boolean(app)),
    [recentIds],
  );

  const visibleApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return APPS.filter((app) => {
      if (filter === "favoritos" && !favorites.includes(app.id)) return false;
      if (filter && filter !== "favoritos" && app.category !== filter)
        return false;
      if (normalized && !app.name.toLowerCase().includes(normalized))
        return false;
      return true;
    });
  }, [query, filter, favorites]);

  return {
    query,
    setQuery,
    filter,
    setFilter,
    favorites,
    toggleFavorite,
    isFavorite,
    recents,
    recordOpen,
    visibleApps,
    totalCount: APPS.length,
  };
}
