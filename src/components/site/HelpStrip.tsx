import { Link, useLocation } from "react-router-dom";

export default function HelpStrip() {
  const { pathname } = useLocation();
  if (pathname === "/" || pathname === "/how-it-works" || pathname === "/learn") return null;

  return (
    <div className="border-b border-cyan-100 bg-cyan-50/80 px-4 py-2 text-center text-sm text-cyan-950">
      <span className="text-cyan-900">New here?</span>{" "}
      <Link to="/learn" className="font-bold underline hover:text-cyan-700">
        Read the simple guide
      </Link>
      {" · "}
      <Link to="/how-it-works" className="font-bold underline hover:text-cyan-700">
        How to buy
      </Link>
      {" · "}
      <Link to="/faq" className="font-bold underline hover:text-cyan-700">
        FAQ
      </Link>
    </div>
  );
}
