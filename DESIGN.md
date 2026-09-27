# Design Brief

## Direction

Orbital Deck — a deep-space launcher cockpit where Among Us is the mission-critical payload.

## Tone

Retro-futuristic mission control: dark, technical, and confident, with signal-red accents that feel like launch alarms rather than decoration.

## Differentiation

A starfield-and-scanline cockpit deck where the Among Us hero card sits inside a pulsing orbit ring — the launcher reads as a ship console, not an app grid.

## Color Palette

| Token      | OKLCH        | Role                                              |
| ---------- | ------------ | ------------------------------------------------- |
| background | 0.145 0.028 268 | Deep space indigo-black, page canvas           |
| foreground | 0.95 0.012 265  | Near-white starlight text                      |
| card       | 0.19 0.032 268  | Elevated console panel surface                 |
| primary    | 0.62 0.22 22    | Signal red — "Abrir Among Us" hero action      |
| accent     | 0.78 0.14 196   | Ion cyan — secondary interactivity, focus ring |
| muted      | 0.24 0.034 268  | Recessed wells, inactive chips                 |

## Typography

- Display: Space Grotesk — headings, app names, hero title, numeric telemetry
- Body: DM Sans — descriptions, labels, buttons, search input
- Mono: Geist Mono — status readouts, protocol strings, `amongus://` link
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-xl md:text-2xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase text-muted-foreground`, body `text-sm md:text-base`

## Elevation & Depth

Layered panels: page carries a fixed dual radial glow (red top-left, cyan bottom-right), cards sit on `bg-card` with `shadow-elevated`, and the hero card gets `shadow-hero` plus a red orbit ring to read as the primary payload.

## Structural Zones

| Zone    | Background            | Border     | Notes                                                        |
| ------- | --------------------- | ---------- | ------------------------------------------------------------ |
| Header  | `bg-card/80` backdrop-blur | `border-b` | Search bar + brand mark; sticky, translucent over starfield |
| Content | `bg-background` + starfield | —      | Hero Among Us card, then Recientes row, then app grid        |
| Footer  | `bg-muted/40`         | `border-t` | Faint mono protocol note, low visual weight                  |

## Spacing & Rhythm

Generous 6–8 unit section gaps with tight 2–3 unit intra-card spacing; grid uses `gap-4 md:gap-5`; hero card breaks the grid with full-width span and extra vertical padding.

## Component Patterns

- Buttons: primary = signal-red filled, `rounded-full`, `shadow-hero` on hover lift; secondary = `bg-secondary` outline with cyan hover ring
- Cards: `rounded-2xl` (hero uses `rounded-3xl`), `bg-card`, 1px `border-border`, `shadow-elevated`, hover raises border to `border-accent/40`
- Badges: fully rounded pills, `bg-muted` with `text-muted-foreground`; active category chip flips to `bg-accent text-accent-foreground`

## Motion

- Entrance: staggered `fade-in-up` (0.4s ease-out, 60ms stagger) on grid cards
- Hover: 0.3s `transition-smooth` lift with shadow deepening; favorite star scales 1.15
- Decorative: slow `orbit-spin` ring on hero card, `pulse-glow` on launch status, `float` on hero icon

## Constraints

- Dark-only theme — no light mode; `.dark` mirrors `:root`
- No official store integration, no live friend-status widgets (per doNotBuild)
- Spanish UI copy throughout; Among Us opening is the single dominant action
- No raw color literals in components — semantic tokens only

## Signature Detail

The Among Us hero card is wrapped in a slow-rotating dashed orbit ring with a glowing red core — an interactive detail that makes the payload feel docked and ready for launch.
