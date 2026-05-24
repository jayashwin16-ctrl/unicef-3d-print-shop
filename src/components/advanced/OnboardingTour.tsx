import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "onboarding_v2_done";

const STEPS = [
  {
    title: "Welcome to 3D Prints for Good",
    body: "This site has a shop and a learn section. Everything is written so anyone can understand.",
  },
  {
    title: "Press ⌘K to search",
    body: "Jump to any page, product, or FAQ answer instantly. On Windows, use Ctrl+K.",
  },
  {
    title: "Buy in three steps",
    body: "Checkout code → school pickup info → pay on Stripe. See How it works for details.",
  },
  {
    title: "Explore & customize",
    body: "Open preferences (gear icon) for dark mode, larger text, and reduced motion.",
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setStep(0), 800);
    return () => clearTimeout(t);
  }, []);

  if (step < 0 || step >= STEPS.length) return null;

  const current = STEPS[step];

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setStep(-1);
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">
          Quick tour · {step + 1} / {STEPS.length}
        </p>
        <h2 className="mt-2 text-xl font-bold text-brand-heading dark:text-white">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted">{current.body}</p>
        <div className="mt-4 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-cyan-500" : "bg-slate-200 dark:bg-slate-600"}`}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={finish} className="text-sm font-medium text-brand-muted hover:underline">
            Skip tour
          </button>
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary !py-2.5 !px-6">
              Next
            </button>
          ) : (
            <Link to="/learn" onClick={finish} className="btn-primary !py-2.5 !px-6">
              Start learning
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
