import { describe, expect, it } from "vitest";

import {
  MAX_RECENTS,
  loadFavorites,
  loadRecents,
  saveFavorites,
  saveRecents,
} from "@/lib/storage";
import { parseSearch } from "@/pages/LauncherPage";

describe("parseSearch", () => {
  it("keeps a non-empty query and a category filter", () => {
    expect(parseSearch({ q: "among", cat: "juegos" })).toEqual({
      q: "among",
      cat: "juegos",
    });
  });

  it("drops an empty query and non-string values", () => {
    expect(parseSearch({ q: "", cat: 42 })).toEqual({});
    expect(parseSearch({})).toEqual({});
  });
});

describe("launcher storage", () => {
  it("round-trips favorites and recents through localStorage", () => {
    saveFavorites(["among-us", "discord"]);
    saveRecents(["discord"]);

    expect(loadFavorites()).toEqual(["among-us", "discord"]);
    expect(loadRecents()).toEqual(["discord"]);
  });

  it("returns an empty list for corrupt stored data", () => {
    window.localStorage.setItem("orbital-deck:favorites", "{not json");
    expect(loadFavorites()).toEqual([]);
  });

  it("exposes a bounded recents window", () => {
    expect(MAX_RECENTS).toBeGreaterThan(0);
  });
});
