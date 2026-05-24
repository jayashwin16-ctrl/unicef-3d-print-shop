import { useMemo, useState } from "react";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import PlainEnglish from "../components/site/PlainEnglish";
import { GLOSSARY_TERMS } from "../data/glossary";

export default function Glossary() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | "all">("all");

  const letters = useMemo(() => {
    const set = new Set(GLOSSARY_TERMS.map((t) => t.term[0]?.toUpperCase()).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((t) => {
      const matchLetter = letter === "all" || t.term.toUpperCase().startsWith(letter);
      const matchQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.simple.toLowerCase().includes(q) ||
        t.detail.toLowerCase().includes(q);
      return matchLetter && matchQuery;
    });
  }, [query, letter]);

  return (
    <>
      <PageHero
        label="Glossary"
        title={
          <>
            Words <span>explained simply</span>
          </>
        }
        subtitle="Tap a letter or search. Every term has a short version and a longer explanation."
      />

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            Not sure what a word means? Start here before reading stats or checkout pages.
          </p>
        </PlainEnglish>

        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setLetter("all")}
              className={`rounded-full px-3 py-1 text-xs font-bold ${letter === "all" ? "pill-active" : "pill-inactive"}`}
            >
              All
            </button>
            {letters.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLetter(l)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${letter === l ? "pill-active" : "pill-inactive"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <dl className="mx-auto mt-8 max-w-2xl space-y-4">
          {filtered.map((t) => (
            <div
              key={t.term}
              id={`term-${t.term.toLowerCase().replace(/\s+/g, "-")}`}
              className="card-premium !translate-y-0 p-5"
            >
              <dt className="text-lg font-bold text-brand-heading dark:text-white">{t.term}</dt>
              <dd className="mt-2">
                <p className="text-sm font-medium text-cyan-800 dark:text-cyan-300">{t.simple}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{t.detail}</p>
              </dd>
            </div>
          ))}
        </dl>
        {filtered.length === 0 && (
          <p className="mt-6 text-center text-sm text-brand-muted">No terms match your search.</p>
        )}
      </Section>
    </>
  );
}
