import { Link } from "react-router-dom";
import FavoritePrintSpotlight from "./FavoritePrintSpotlight";

export default function HomeFirstFold() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Photos/home-bg.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/70 to-brand-ink/90" />
      <div className="absolute inset-0 bg-mesh-hero opacity-90" />

      <div className="relative z-10 mx-auto max-w-site px-4 py-10 md:px-6 md:py-12 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/90">
              This project was created by Jay
            </p>
            <p className="mx-auto mt-4 max-w-prose text-base leading-relaxed text-slate-200 md:text-lg lg:mx-0">
              A student 3D print shop. 60% of proceeds goes to UNICEF USA.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link to="/shop" className="btn-primary">
                Shop prints
              </Link>
              <Link to="/how-it-works" className="btn-outline">
                How it works
              </Link>
            </div>
          </div>

          <FavoritePrintSpotlight embedded />
        </div>
      </div>
    </section>
  );
}
