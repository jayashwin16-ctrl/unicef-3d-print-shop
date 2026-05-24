import { useSitePreferences, type ThemeMode } from "../../context/SitePreferencesContext";

export default function PreferencesPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const prefs = useSitePreferences();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-slate-900/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Site preferences"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-sm overflow-y-auto border-l border-brand-border bg-brand-card p-6 shadow-2xl dark:border-slate-600 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-heading dark:text-white">Site preferences</h2>
          <button type="button" onClick={onClose} className="text-brand-muted hover:text-brand-heading" aria-label="Close">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-brand-muted">Saved on this device. Plain language stays on everywhere.</p>

        <fieldset className="mt-8">
          <legend className="text-xs font-bold uppercase tracking-wider text-brand-accent">Theme</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["light", "dark", "system"] as ThemeMode[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => prefs.setTheme(t)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize ${
                  prefs.theme === t
                    ? "border-cyan-500 bg-cyan-50 text-cyan-900 dark:bg-cyan-950"
                    : "border-brand-border dark:border-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <Toggle
          label="Larger text"
          hint="Easier reading on every page"
          checked={prefs.largeText}
          onChange={prefs.setLargeText}
        />
        <Toggle
          label="Reduce motion"
          hint="Turns off animations"
          checked={prefs.reducedMotion}
          onChange={prefs.setReducedMotion}
        />
        <Toggle
          label="Compact layout"
          hint="Tighter spacing in navigation"
          checked={prefs.compactMode}
          onChange={prefs.setCompactMode}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="mt-6 flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block font-semibold text-brand-heading dark:text-slate-100">{label}</span>
        <span className="block text-xs text-brand-muted">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-brand-border text-cyan-600"
      />
    </label>
  );
}
