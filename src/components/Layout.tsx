import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const NAV = [
  { path: "/", label: "Home" },
  { path: "/problem", label: "The Problem" },
  { path: "/stats", label: "Stats & Data" },
  { path: "/why", label: "Why UNICEF" },
  { path: "/shop", label: "Shop" },
  { path: "/about", label: "About" },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) => {
    const active = loc.pathname === path;
    return active
      ? "border-b-2 border-brand-blue pb-0.5 font-semibold text-brand-heading"
      : "text-brand-muted hover:text-brand-heading";
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-card px-4 py-3.5 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="text-[17px] font-bold text-brand-blue">
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
            } absolute left-0 right-0 top-full flex-col gap-4 border-b border-brand-border bg-brand-card px-6 py-4 text-sm md:static md:flex md:flex-row md:items-center md:border-0 md:p-0`}
          >
            <ul className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
              {NAV.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className={linkClass(path)} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/donate"
                  className={`rounded-md px-3.5 py-1.5 font-bold text-white ${
                    loc.pathname === "/donate"
                      ? "bg-brand-blue-dark"
                      : "bg-brand-blue hover:opacity-90"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Donate
                </Link>
              </li>
            </ul>
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-brand-muted hover:text-brand-heading"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-blue px-1 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-brand-border bg-brand-card px-6 py-5 text-center">
        <p className="text-xs text-brand-dim">
          3D Prints for Good — Student-led 3D print shop · Pledged giving aligned with UNICEF values
        </p>
        <p className="mt-2 text-xs text-brand-dim">
          <Link to="/about" className="underline hover:text-brand-heading">
            About & school pickup
          </Link>
          {" · "}
          <a
            href="https://www.unicef.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-heading"
          >
            unicef.org
          </a>
        </p>
      </footer>
    </div>
  );
}
