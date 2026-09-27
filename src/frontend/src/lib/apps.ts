import type { AppCategory, CategoryFilter, LauncherApp } from "@/types";

export const CATEGORIES: AppCategory[] = [
  { id: "juegos", label: "Juegos" },
  { id: "social", label: "Social" },
  { id: "utilidades", label: "Utilidades" },
  { id: "productividad", label: "Productividad" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  juegos: "Juegos",
  social: "Social",
  utilidades: "Utilidades",
  productividad: "Productividad",
};

export const FILTERS: { id: CategoryFilter; label: string }[] = [
  ...CATEGORIES.map((category) => ({ id: category.id, label: category.label })),
  { id: "favoritos", label: "Favoritos" },
];

export const APPS: LauncherApp[] = [
  {
    id: "among-us",
    name: "Among Us",
    category: "juegos",
    description:
      "Tripulación a bordo: completa tareas en la nave mientras descubres al impostor antes de que sea tarde.",
    protocol: "amongus://",
    glyph: "🛰️",
    tileClass: "from-primary/90 to-primary/40",
    featured: true,
  },
  {
    id: "discord",
    name: "Discord",
    category: "social",
    description:
      "Voz, texto y video para coordinar partidas con tu tripulación en cualquier canal.",
    protocol: "discord://",
    glyph: "💬",
    tileClass: "from-indigo-500/80 to-indigo-500/30",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "social",
    description:
      "Mensajería directa y grupos para avisar a la tripulación de la próxima partida.",
    protocol: "whatsapp://",
    glyph: "📞",
    tileClass: "from-emerald-500/80 to-emerald-500/30",
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "social",
    description:
      "Canales y chats cifrados para mantener el contacto con tu escuadrón.",
    protocol: "tg://",
    glyph: "✈️",
    tileClass: "from-sky-500/80 to-sky-500/30",
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "utilidades",
    description:
      "Música y podcasts para ambientar la sala de espera antes del despegue.",
    protocol: "spotify://",
    glyph: "🎧",
    tileClass: "from-green-500/80 to-green-500/30",
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "utilidades",
    description:
      "Guías, partidas y tutoriales de estrategia para mejorar tu juego.",
    protocol: "vnd.youtube://",
    glyph: "▶️",
    tileClass: "from-red-500/80 to-red-500/30",
  },
  {
    id: "calculadora",
    name: "Calculadora",
    category: "utilidades",
    description:
      "Cálculos rápidos de combustible, distancias y probabilidades de sabotaje.",
    glyph: "🧮",
    tileClass: "from-amber-500/80 to-amber-500/30",
  },
  {
    id: "camara",
    name: "Cámara",
    category: "utilidades",
    description:
      "Captura y comparte momentos de la partida con la tripulación.",
    glyph: "📷",
    tileClass: "from-cyan-500/80 to-cyan-500/30",
  },
  {
    id: "notas",
    name: "Notas",
    category: "productividad",
    description:
      "Anota sospechosos, coartadas y rutas de tareas durante cada ronda.",
    glyph: "📝",
    tileClass: "from-violet-500/80 to-violet-500/30",
  },
  {
    id: "calendario",
    name: "Calendario",
    category: "productividad",
    description:
      "Agenda las noches de juego y no pierdas ninguna partida con amigos.",
    glyph: "📅",
    tileClass: "from-rose-500/80 to-rose-500/30",
  },
  {
    id: "correo",
    name: "Correo",
    category: "productividad",
    description:
      "Bandeja de entrada unificada para invitaciones y avisos de la tripulación.",
    glyph: "✉️",
    tileClass: "from-blue-500/80 to-blue-500/30",
  },
  {
    id: "reloj",
    name: "Reloj",
    category: "utilidades",
    description:
      "Cronómetro y temporizador para controlar los tiempos de ronda.",
    glyph: "⏱️",
    tileClass: "from-teal-500/80 to-teal-500/30",
  },
];

export function getAppById(id: string): LauncherApp | undefined {
  return APPS.find((app) => app.id === id);
}

export function getFeaturedApp(): LauncherApp {
  return APPS.find((app) => app.featured) ?? APPS[0];
}
