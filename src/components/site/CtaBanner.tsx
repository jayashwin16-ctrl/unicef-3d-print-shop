import { Link } from "react-router-dom";

type CtaBannerProps = {
  title: string;
  text: string;
  buttonLabel: string;
  to: string;
};

export default function CtaBanner({ title, text, buttonLabel, to }: CtaBannerProps) {
  return (
    <div className="mx-8 my-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark px-8 py-9 text-center">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-blue-100">{text}</p>
      <Link to={to} className="btn-yellow mt-4 inline-block">
        {buttonLabel}
      </Link>
    </div>
  );
}
