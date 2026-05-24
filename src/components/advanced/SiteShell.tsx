import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import CommandPalette from "./CommandPalette";
import KeyboardHelp from "./KeyboardHelp";
import PreferencesPanel from "./PreferencesPanel";
import ScrollProgress from "./ScrollProgress";
import OnboardingTour from "./OnboardingTour";
import QuickNavFab from "./QuickNavFab";
import TableOfContents from "./TableOfContents";
import { isLearnAreaPath } from "../site/LearnSidebar";

type ShellApi = {
  openSearch: () => void;
  openPreferences: () => void;
  openKeyboardHelp: () => void;
};

const SiteShellContext = createContext<ShellApi | null>(null);

export function useSiteShell() {
  const ctx = useContext(SiteShellContext);
  if (!ctx) throw new Error("useSiteShell must be used within SiteShell");
  return ctx;
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const learnArea = isLearnAreaPath(pathname);

  const openSearch = useCallback(() => setPaletteOpen(true), []);
  const openPreferences = useCallback(() => setPrefsOpen(true), []);
  const openKeyboardHelp = useCallback(() => setHelpOpen(true), []);

  const api = useMemo(
    () => ({ openSearch, openPreferences, openKeyboardHelp }),
    [openSearch, openPreferences, openKeyboardHelp]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "?" && !mod) {
        e.preventDefault();
        openKeyboardHelp();
      }
      if (e.key === "/" && !mod) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch, openKeyboardHelp]);

  return (
    <SiteShellContext.Provider value={api}>
      {children}
      <ScrollProgress />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      <PreferencesPanel open={prefsOpen} onClose={() => setPrefsOpen(false)} />
      <OnboardingTour />
      <QuickNavFab onSearch={openSearch} />

      {learnArea && (
        <div className="pointer-events-none fixed right-4 top-28 z-30 hidden xl:block">
          <div className="pointer-events-auto">
            <TableOfContents />
          </div>
        </div>
      )}

      <div className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 lg:flex">
        <button
          type="button"
          onClick={openSearch}
          className="rounded-full border border-brand-border/80 bg-brand-card/95 px-3 py-2 text-xs font-bold text-brand-heading shadow-card backdrop-blur hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100"
        >
          ⌘K Search
        </button>
        <button
          type="button"
          onClick={openPreferences}
          className="rounded-full border border-brand-border/80 bg-brand-card/95 px-3 py-2 text-xs font-bold text-brand-heading shadow-card backdrop-blur hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100"
        >
          ⚙ Preferences
        </button>
      </div>
    </SiteShellContext.Provider>
  );
}

export function SiteHeaderTools() {
  const { openSearch, openPreferences } = useSiteShell();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={openSearch}
        className="hidden rounded-lg border border-brand-border px-2.5 py-1.5 text-xs font-bold text-brand-muted transition hover:border-cyan-300 hover:text-brand-heading md:inline-flex dark:border-slate-600"
        aria-label="Search site"
      >
        ⌘K
      </button>
      <button
        type="button"
        onClick={openPreferences}
        className="rounded-lg border border-brand-border p-1.5 text-sm transition hover:border-cyan-300 dark:border-slate-600"
        aria-label="Preferences"
      >
        ⚙
      </button>
    </div>
  );
}
