import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SiteDisclaimer from "./SiteDisclaimer";
import HelpStrip from "./site/HelpStrip";
import Breadcrumbs from "./site/Breadcrumbs";
import LearnSidebar, { isLearnAreaPath, LearnMobileNav } from "./site/LearnSidebar";
import { LEARN_LINKS, PROJECT_LINKS, SHOP_LINKS } from "../config/siteNav";

function NavLink({
  to,
  label,
  active,
  onNavigate,
  className = "",
}: {
  to: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={
        active
          ? `font-semibold text-brand-heading ${className}`
          : `text-brand-muted hover:text-brand-heading ${className}`
      }
    >
      {label}
    </Link>
  );
}

function NavGroup({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-dim md:sr-only">
        {title}
      </p>
      <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3">{children}</ul>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const isActive = (path: string) =>
    path === "/"
      ? loc.pathname === "/"
      : loc.pathname === path || loc.pathname.startsWith(`${path}/`);

  const shopActive = loc.pathname === "/shop" || loc.pathname.startsWith("/product");
  const learnArea = isLearnAreaPath(loc.pathname);
  const showCrumbs = loc.pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-card px-4 py-3.5 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="shrink-0 text-[17px] font-bold text-brand-blue" onClick={close}>
            3D Prints for Good
          </Link>
          <button
            type="button"
            className="text-2xl text-brand-heading md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            ☰
          </button>

          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute left-0 right-0 top-full max-h-[85vh] flex-col gap-5 overflow-y-auto border-b border-brand-border bg-brand-card px-6 py-5 text-sm md:static md:max-h-none md:flex-row md:items-center md:gap-6 md:border-0 md:overflow-visible md:p-0`}
          >
            <NavGroup title="Shop">
              {SHOP_LINKS.map(({ path, label }) => (
                <li key={path}>
                  {path === "/shop" ? (
                    <Link
                      to="/shop"
                      onClick={close}
                      className={
                        shopActive
                          ? "inline-block rounded-md bg-brand-blue-dark px-3.5 py-1.5 font-bold text-white"
                          : "inline-block rounded-md bg-brand-blue px-3.5 py-1.5 font-bold text-white hover:opacity-90"
                      }
                    >
                      Shop
                    </Link>
                  ) : (
                    <NavLink
                      to={path}
                      label={`${label}${path === "/cart" && itemCount > 0 ? ` (${itemCount})` : ""}`}
                      active={isActive(path)}
                      onNavigate={close}
                    />
                  )}
                </li>
              ))}
            </NavGroup>

            <NavGroup title="Learn" className="md:border-l md:border-brand-border md:pl-6">
              {LEARN_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    label={label}
                    active={isActive(path)}
                    onNavigate={close}
                  />
                </li>
              ))}
            </NavGroup>

            <NavGroup title="Project" className="md:border-l md:border-brand-border md:pl-6">
              {PROJECT_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    label={label}
                    active={isActive(path)}
                    onNavigate={close}
                  />
                </li>
              ))}
            </NavGroup>

            <div className="md:hidden border-t border-brand-border pt-3">
              <Link
                to="/"
                onClick={close}
                className={`block py-1 ${isActive("/") ? "font-semibold text-brand-heading" : "text-brand-muted"}`}
              >
                Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <HelpStrip />

      <main className="flex-1">
        {showCrumbs && !learnArea && (
          <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8">
            <Breadcrumbs />
          </div>
        )}

        {learnArea ? (
          <div className="mx-auto max-w-6xl px-4 pb-10 md:px-8">
            {showCrumbs && <Breadcrumbs />}
            <LearnMobileNav />
            <div className="flex gap-8 lg:gap-10">
              <LearnSidebar />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="border-t border-brand-border bg-brand-card px-6 py-8">
        <div className="mx-auto grid max-w-4xl gap-8 text-sm md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-heading">Shop</p>
            <ul className="space-y-2 text-brand-muted">
              <li>
                <Link to="/shop" className="hover:text-brand-heading hover:underline">
                  Browse products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-heading hover:underline">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-brand-heading hover:underline">
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-heading">Learn</p>
            <ul className="space-y-2 text-brand-muted">
              {LEARN_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="hover:text-brand-heading hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/faq" className="hover:text-brand-heading hover:underline">
                  Q&A
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-heading">Project</p>
            <ul className="space-y-2 text-brand-muted">
              <li>
                <Link to="/about" className="hover:text-brand-heading hover:underline">
                  About Jay
                </Link>
              </li>
              <li>
                <a
                  href="https://www.unicefusa.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-heading hover:underline"
                >
                  unicefusa.org
                </a>
              </li>
            </ul>
          </div>
        </div>
        <SiteDisclaimer className="mx-auto mt-8 max-w-2xl text-center text-xs" />
        <p className="mt-3 text-center text-xs text-brand-dim">Created by Jay · parent supervised</p>
      </footer>
    </div>
  );
}
