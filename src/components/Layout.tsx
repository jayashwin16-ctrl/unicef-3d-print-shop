import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const nav = (path: string) =>
    loc.pathname === path
      ? "text-[#1CABE2] font-semibold"
      : "text-slate-600 hover:text-[#374EA2]";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1CABE2] to-[#374EA2] flex items-center justify-center text-white font-bold text-sm">
              3D
            </span>
            <span className="font-bold text-slate-800 text-lg">Prints for UNICEF</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/" className={nav("/")}>Home</Link>
            <Link to="/shop" className={nav("/shop")}>Shop</Link>
            <Link to="/about" className={nav("/about")}>About</Link>
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
