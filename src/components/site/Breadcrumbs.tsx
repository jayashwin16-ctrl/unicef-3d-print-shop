import { Link, useLocation } from "react-router-dom";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/shop": "Shop",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/checkout/success": "Order complete",
  "/checkout/cancel": "Checkout cancelled",
  "/checkout/payment-error": "Payment issue",
  "/about": "About",
  "/how-it-works": "How it works",
  "/learn": "Learn",
  "/problem": "The problem",
  "/stats": "Stats & data",
  "/why": "Why we give",
  "/donate": "Give to UNICEF USA",
  "/faq": "Questions & answers",
  "/tools": "Tools & calculators",
  "/glossary": "Glossary",
  "/product": "Product",
};

function crumbsFor(pathname: string): { to: string; label: string }[] {
  const items: { to: string; label: string }[] = [{ to: "/", label: "Home" }];

  if (pathname === "/") return items;

  if (pathname.startsWith("/product/")) {
    items.push({ to: "/shop", label: "Shop" });
    items.push({ to: pathname, label: "Product" });
    return items;
  }

  if (["/problem", "/stats", "/why", "/donate", "/faq", "/glossary", "/tools"].includes(pathname)) {
    items.push({ to: "/learn", label: "Learn" });
  }

  const label = LABELS[pathname];
  if (label) {
    items.push({ to: pathname, label });
  }

  return items;
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = crumbsFor(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-brand-muted">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.to} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-brand-dim">/</span>}
              {last ? (
                <span className="font-semibold text-brand-heading">{c.label}</span>
              ) : (
                <Link to={c.to} className="hover:text-brand-accent hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
