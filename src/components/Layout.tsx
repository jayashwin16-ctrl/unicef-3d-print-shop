import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { itemCount } = useCart();
  const nav = (path: string) =>
    loc.pathname === path
      ? "text-[#1CABE2] font-semibold"
      : "text-slate-600 hover:text-[#374EA2]";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1CABE2]/85 via-sky-100/80 to-[#FFC20E]/50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1CABE2] to-[#374EA2] flex items-center justify-center text-white font-bold text-sm">
              3D
            </span>
            <span className="font-bold text-slate-800 text-lg">Prints for UNICEF</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className={nav("/")}>Home</Link>
            <Link to="/shop" className={nav("/shop")}>Shop</Link>
            <Link to="/about" className={nav("/about")}>About</Link>
            <Link to="/cart" className="relative flex items-center gap-1.5 text-slate-600 hover:text-[#374EA2]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-[#1CABE2] text-white text-xs font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-[#374EA2] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-sm text-blue-100 mb-2">
            A portion of every purchase is pledged to support children through donation efforts.
          </p>
          <p className="text-xs text-blue-200/80">
            Independent site. For direct UNICEF donations visit{" "}
            <a href="https://www.unicef.org" target="_blank" rel="noopener noreferrer" className="underline text-[#FFC20E]">
              unicef.org
            </a>
            . Comply with official branding if partnering with UNICEF.
          </p>
        </div>
      </footer>
    </div>
  );
}
