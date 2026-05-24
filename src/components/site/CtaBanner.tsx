import { Link } from "react-router-dom";

type CtaBannerProps = {
  title: string;
  text: string;
  buttonLabel: string;
  to: string;
};

export default function CtaBanner({ title, text, buttonLabel, to }: CtaBannerProps) {
  return (
    <div className="mx-auto max-w-site px-6 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-cta px-8 py-12 text-center shadow-card md:px-16 md:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative text-2xl font-extrabold tracking-tight text-white md:text-3xl">{title}</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-cyan-50/90 md:text-base">{text}</p>
        <Link to={to} className="btn-yellow relative mt-8 inline-block">
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
