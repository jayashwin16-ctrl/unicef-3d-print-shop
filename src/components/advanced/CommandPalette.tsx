import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildSiteIndex, searchSiteIndex, type SearchResult } from "../../data/siteIndex";

const GROUP_LABEL: Record<SearchResult["group"], string> = {
  page: "Pages",
  product: "Products",
  faq: "Q&A",
  glossary: "Glossary",
};

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const index = useMemo(() => buildSiteIndex(), []);
  const results = useMemo(() => searchSiteIndex(query, index), [query, index]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        e.preventDefault();
        navigate(results[active].path);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search site"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-brand-border/80 bg-brand-card shadow-2xl dark:border-slate-600 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-brand-border/80 px-4 py-3 dark:border-slate-600">
          <span className="text-lg text-brand-accent" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, products, FAQ, glossary…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-dim dark:text-slate-100"
            autoComplete="off"
          />
          <kbd className="hidden rounded border border-brand-border px-1.5 py-0.5 text-[10px] font-bold text-brand-dim sm:inline dark:border-slate-500">
            esc
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-brand-muted">No matches</li>
          ) : (
            results.map((r, i) => (
              <li key={r.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition ${
                    i === active ? "bg-cyan-50 dark:bg-cyan-950/50" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    navigate(r.path);
                    onClose();
                  }}
                >
                  <span className="mt-0.5 shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-muted dark:bg-slate-700">
                    {GROUP_LABEL[r.group]}
                  </span>
                  <span>
                    <span className="block font-semibold text-brand-heading dark:text-slate-100">
                      {r.title}
                    </span>
                    <span className="block text-xs text-brand-muted">{r.subtitle}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="border-t border-brand-border/80 px-4 py-2 text-[11px] text-brand-dim dark:border-slate-600">
          ↑↓ navigate · Enter open · Esc close
        </p>
      </div>
    </div>
  );
}
