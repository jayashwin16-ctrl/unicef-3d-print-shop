type PlainEnglishProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/** Short “in simple terms” box so complex topics stay easy to understand. */
export default function PlainEnglish({
  title = "In simple terms",
  children,
  className = "",
}: PlainEnglishProps) {
  return (
    <aside
      className={`rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-soft ${className}`}
      role="note"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-cyan-800">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </aside>
  );
}
