type CheckoutStep = "code" | "pickup" | "pay";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "pickup", label: "Pickup details" },
  { id: "pay", label: "Pay" },
];

export default function CheckoutStepBar({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = s.id === current;
          return (
            <li key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? "bg-brand-blue text-white"
                    : done
                      ? "bg-brand-blue/20 text-brand-blue-dark"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`hidden text-center text-[11px] font-medium sm:block ${
                  active ? "text-brand-heading" : "text-brand-muted"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-2 flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full ${i <= currentIndex ? "bg-brand-blue" : "bg-slate-200"}`}
          />
        ))}
      </div>
    </nav>
  );
}
