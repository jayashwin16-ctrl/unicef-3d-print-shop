/** Shared site navigation — keep labels and paths in one place. */

export const LEARN_LINKS = [
  { path: "/problem", label: "The problem" },
  { path: "/stats", label: "Stats & data" },
  { path: "/why", label: "Why we give" },
  { path: "/donate", label: "Give to UNICEF USA" },
] as const;

export const SHOP_LINKS = [
  { path: "/shop", label: "Shop" },
  { path: "/cart", label: "Cart" },
] as const;

export const PROJECT_LINKS = [
  { path: "/about", label: "About" },
  { path: "/how-it-works", label: "How it works" },
] as const;

export const UNICEF_REGIONS_OVERVIEW = [
  { icon: "🌏", name: "East Asia & Pacific" },
  { icon: "🌍", name: "Eastern & Southern Africa" },
  { icon: "🏔️", name: "Europe & Central Asia" },
  { icon: "🌎", name: "Latin America & Caribbean" },
  { icon: "🕌", name: "Middle East & North Africa" },
  { icon: "🪷", name: "South Asia" },
  { icon: "🌍", name: "West & Central Africa" },
] as const;
