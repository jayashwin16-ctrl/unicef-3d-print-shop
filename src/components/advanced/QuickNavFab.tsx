import { useState } from "react";
import { Link } from "react-router-dom";

export default function QuickNavFab({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 md:bottom-6 md:right-6">
      {open && (
        <div className="mb-3 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => {
              onSearch();
              setOpen(false);
            }}
            className="rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm font-bold shadow-card dark:border-slate-600 dark:bg-slate-800"
          >
            Search ⌘K
          </button>
          <Link
            to="/shop"
            onClick={() => setOpen(false)}
            className="rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm font-bold shadow-card dark:border-slate-600 dark:bg-slate-800"
          >
            Shop
          </Link>
          <Link
            to="/learn"
            onClick={() => setOpen(false)}
            className="rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm font-bold shadow-card dark:border-slate-600 dark:bg-slate-800"
          >
            Learn
          </Link>
          <Link
            to="/tools"
            onClick={() => setOpen(false)}
            className="rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm font-bold shadow-card dark:border-slate-600 dark:bg-slate-800"
          >
            Tools
          </Link>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close quick menu" : "Open quick menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-2xl text-white shadow-card-hover"
      >
        {open ? "×" : "☰"}
      </button>
    </div>
  );
}
