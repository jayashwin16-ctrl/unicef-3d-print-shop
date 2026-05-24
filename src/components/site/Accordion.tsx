import { useState } from "react";

type Item = { id: string; question: string; answer: string };

export default function Accordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="card-premium !translate-y-0 hover:!translate-y-0">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className="font-bold text-brand-heading">{item.question}</span>
              <span className="shrink-0 text-xl text-brand-accent">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="border-t border-brand-border/80 px-5 pb-5 pt-0">
                <p className="text-sm leading-relaxed text-brand-muted">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
