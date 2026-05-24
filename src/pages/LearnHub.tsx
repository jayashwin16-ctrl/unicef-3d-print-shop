import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import PlainEnglish from "../components/site/PlainEnglish";

const TOPICS = [
  {
    path: "/problem",
    title: "The problem",
    simple: "Many children lack food, school, and safety. This page explains why help is needed.",
    time: "3 min read",
  },
  {
    path: "/stats",
    title: "Stats & data",
    simple: "Numbers from around the world, organized by region. Good for reports and curiosity.",
    time: "5 min read",
  },
  {
    path: "/why",
    title: "Why we give",
    simple: "Why Jay chose to donate part of each sale to UNICEF USA.",
    time: "3 min read",
  },
  {
    path: "/donate",
    title: "Give to UNICEF USA",
    simple: "Official links if you want to donate directly—not through our shop.",
    time: "2 min read",
  },
  {
    path: "/faq",
    title: "Questions & answers",
    simple: "Checkout code, pickup, payments, and donations—answered in plain language.",
    time: "4 min read",
  },
] as const;

const AUDIENCES = [
  {
    who: "I want to buy a print",
    steps: ["How it works", "Shop", "Cart → Checkout"],
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/shop", label: "Shop" },
    ],
  },
  {
    who: "I want to learn why this matters",
    steps: ["Learn overview", "The problem", "Stats"],
    links: [
      { to: "/learn", label: "You are here" },
      { to: "/problem", label: "The problem" },
    ],
  },
  {
    who: "I only want to donate",
    steps: ["Give to UNICEF USA", "unicefusa.org"],
    links: [{ to: "/donate", label: "Donate page" }],
  },
] as const;

export default function LearnHub() {
  return (
    <>
      <PageHero
        label="Learn"
        title={
          <>
            Understand the <span>big picture</span>
          </>
        }
        subtitle="This section has more detail—but each page starts with simple language so anyone can follow."
      />

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            <strong>This website has two parts:</strong> a small 3D print shop run by Jay, and
            educational pages about children in need. You can read as much or as little as you
            want. Use the menu on the left (on large screens) to jump between topics.
          </p>
        </PlainEnglish>
      </Section>

      <Section title="Who are you? Start here" alt>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.who} className="card-premium flex flex-col p-5 !translate-y-0 hover:!shadow-card">
              <h3 className="font-bold text-brand-heading">{a.who}</h3>
              <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-brand-muted">
                {a.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 hover:bg-cyan-100"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="All learn topics">
        <div className="mx-auto grid max-w-3xl gap-4">
          {TOPICS.map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="card-premium flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-bold text-brand-heading">{t.title}</h3>
                <p className="mt-1 text-sm text-brand-muted">{t.simple}</p>
              </div>
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-brand-accent">
                {t.time} →
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
