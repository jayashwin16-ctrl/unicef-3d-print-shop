/** Shown next to Buy now / cart checkout. */
export default function BobcatCheckoutNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-[#1CABE2]/40 bg-sky-50 px-4 py-3 text-sm text-slate-800 ${className}`.trim()}
      role="note"
    >
      <p className="font-semibold text-[#1CABE2]">Bobcat email required to buy</p>
      <p className="mt-1">
        Put your <strong>Bobcat</strong> school email before continuing to checkout.
      </p>
    </div>
  );
}
