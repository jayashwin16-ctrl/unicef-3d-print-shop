import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

type Preferences = {
  theme: ThemeMode;
  reducedMotion: boolean;
  largeText: boolean;
  compactMode: boolean;
};

type SitePreferencesContextValue = Preferences & {
  setTheme: (t: ThemeMode) => void;
  setReducedMotion: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
  setCompactMode: (v: boolean) => void;
  resolvedTheme: "light" | "dark";
};

const STORAGE_KEY = "site_prefs_v1";

const defaults: Preferences = {
  theme: "light",
  reducedMotion: false,
  largeText: false,
  compactMode: false,
};

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);

function loadPrefs(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(loadPrefs);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const persist = useCallback((next: Preferences) => {
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    const dark =
      prefs.theme === "dark" || (prefs.theme === "system" && systemDark());
    setResolvedTheme(dark ? "dark" : "light");

    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.classList.toggle("reduce-motion", prefs.reducedMotion);
    root.classList.toggle("text-large", prefs.largeText);
    root.classList.toggle("compact-ui", prefs.compactMode);
  }, [prefs]);

  useEffect(() => {
    if (prefs.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [prefs.theme]);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      ...prefs,
      resolvedTheme,
      setTheme: (theme) => persist({ ...prefs, theme }),
      setReducedMotion: (reducedMotion) => persist({ ...prefs, reducedMotion }),
      setLargeText: (largeText) => persist({ ...prefs, largeText }),
      setCompactMode: (compactMode) => persist({ ...prefs, compactMode }),
    }),
    [prefs, persist, resolvedTheme]
  );

  return (
    <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const ctx = useContext(SitePreferencesContext);
  if (!ctx) throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  return ctx;
}
