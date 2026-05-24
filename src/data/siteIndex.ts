import { products } from "./products";
import { FAQ_CATEGORIES } from "./faq";
import { GLOSSARY_TERMS } from "./glossary";
import { LEARN_LINKS, PROJECT_LINKS, SHOP_LINKS } from "../config/siteNav";

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  group: "page" | "product" | "faq" | "glossary";
  keywords: string;
};

const STATIC_PAGES: SearchResult[] = [
  { id: "home", title: "Home", subtitle: "Start here", path: "/", group: "page", keywords: "start main" },
  { id: "learn", title: "Learn overview", subtitle: "Guide to all topics", path: "/learn", group: "page", keywords: "learn guide education" },
  { id: "tools", title: "Tools & calculators", subtitle: "Donation estimator", path: "/tools", group: "page", keywords: "calculator impact math" },
  { id: "glossary", title: "Glossary", subtitle: "Words explained simply", path: "/glossary", group: "page", keywords: "dictionary terms words" },
  ...SHOP_LINKS.map((l) => ({
    id: l.path,
    title: l.label,
    subtitle: "Shop area",
    path: l.path,
    group: "page" as const,
    keywords: "shop buy cart",
  })),
  ...LEARN_LINKS.filter((l) => l.path !== "/learn").map((l) => ({
    id: l.path,
    title: l.label,
    subtitle: "Learn area",
    path: l.path,
    group: "page" as const,
    keywords: "learn unicef children",
  })),
  ...PROJECT_LINKS.map((l) => ({
    id: l.path,
    title: l.label,
    subtitle: "Project info",
    path: l.path,
    group: "page" as const,
    keywords: "about faq how works jay",
  })),
];

export function buildSiteIndex(): SearchResult[] {
  const productItems: SearchResult[] = products.map((p) => ({
    id: `product-${p.id}`,
    title: p.title,
    subtitle: `${p.currency} ${p.price} · ${p.category}`,
    path: `/product/${p.id}`,
    group: "product",
    keywords: `${p.title} ${p.description} ${p.category} shop buy`.toLowerCase(),
  }));

  const faqItems: SearchResult[] = FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item, i) => ({
      id: `faq-${cat.title}-${i}`,
      title: item.q,
      subtitle: cat.title,
      path: "/faq",
      group: "faq" as const,
      keywords: `${item.q} ${item.a} ${cat.title}`.toLowerCase(),
    }))
  );

  const glossaryItems: SearchResult[] = GLOSSARY_TERMS.map((t) => ({
    id: `glossary-${t.term}`,
    title: t.term,
    subtitle: "Glossary",
    path: "/glossary",
    group: "glossary" as const,
    keywords: `${t.term} ${t.simple} ${t.detail}`.toLowerCase(),
  }));

  return [...STATIC_PAGES, ...productItems, ...faqItems, ...glossaryItems];
}

export function searchSiteIndex(query: string, index: SearchResult[]): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return index.slice(0, 12);
  return index
    .map((item) => {
      const hay = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
      const score =
        (hay.startsWith(q) ? 4 : 0) +
        (item.title.toLowerCase().includes(q) ? 3 : 0) +
        (hay.includes(q) ? 1 : 0);
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 14)
    .map((x) => x.item);
}
