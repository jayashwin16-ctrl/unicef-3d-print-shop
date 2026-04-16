/** Shown next to Buy now / cart checkout: remind shoppers to use @ows.org. */
export default function BobcatCheckoutNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-[#1CABE2]/40 bg-sky-50 px-4 py-3 text-sm text-slate-800 ${className}`.trim()}
      role="note"
    >
      <p className="font-semibold text-[#1CABE2]">Bobcat email required to buy</p>
      <p className="mt-1">
        Put your <strong>Bobcat</strong> school address — it must end with <strong>@ows.org</strong> (for
        example <span className="whitespace-nowrap">first.last@ows.org</span>).
      </p>
    </div>
  );
}
