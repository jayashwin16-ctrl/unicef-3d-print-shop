const SHORTCUTS = [
  { keys: ["⌘", "K"], alt: ["Ctrl", "K"], desc: "Open search" },
  { keys: ["?"], desc: "Show keyboard shortcuts" },
  { keys: ["/"], desc: "Focus search (when palette closed)" },
  { keys: ["Esc"], desc: "Close dialogs" },
];

export default function KeyboardHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl dark:border-slate-600 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-brand-heading dark:text-white">Keyboard shortcuts</h2>
        <ul className="mt-4 space-y-3">
          {SHORTCUTS.map((s) => (
            <li key={s.desc} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-brand-muted">{s.desc}</span>
              <span className="flex shrink-0 gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-brand-border bg-slate-50 px-2 py-0.5 text-xs font-bold dark:border-slate-500 dark:bg-slate-700"
                  >
                    {k}
                  </kbd>
                ))}
                {s.alt?.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-brand-border bg-slate-50 px-2 py-0.5 text-xs font-bold dark:border-slate-500 dark:bg-slate-700"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          Got it
        </button>
      </div>
    </div>
  );
}
