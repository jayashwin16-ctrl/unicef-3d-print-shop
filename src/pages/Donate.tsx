import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";

const UNICEF_LINKS = [
  {
    title: "Donate to UNICEF",
    description:
      "Make a one-time or monthly gift on UNICEF’s official site. Your donation goes directly to their programs for children.",
    href: "https://www.unicef.org/donate",
    cta: "Donate on unicef.org",
    primary: true,
  },
  {
    title: "Emergency relief",
    description:
      "Support children in crises—conflicts, disasters, and displacement—through UNICEF’s emergency appeals.",
    href: "https://www.unicef.org/emergencies",
    cta: "View emergency appeals",
    primary: false,
  },
  {
    title: "Where your gift goes",
    description:
      "Read how UNICEF uses funds for health, nutrition, education, and protection in more than 190 countries.",
    href: "https://www.unicef.org/what-we-do",
    cta: "Learn what UNICEF does",
    primary: false,
  },
  {
    title: "Reports & transparency",
    description:
      "Explore UNICEF’s published data and annual reports on children worldwide.",
    href: "https://www.unicef.org/reports",
    cta: "Read UNICEF reports",
    primary: false,
  },
] as const;

export default function Donate() {
  return (
    <>
      <PageHero
        label="Give directly"
        title={
          <>
            Donate to <span className="text-brand-blue">UNICEF</span>
          </>
        }
        subtitle="This page is for direct giving through UNICEF—not our 3D print shop. Use the official links below to donate securely."
      />

      <Section title="Official UNICEF donation links">
        <p className="mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed text-[#333]">
          <strong className="text-brand-heading">3D Prints for Good</strong> is an independent
          student project. We are not UNICEF and cannot accept donations on their behalf. For the
          greatest impact, give through UNICEF’s own website.
        </p>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {UNICEF_LINKS.map((link) => (
            <div
              key={link.href}
              className={`flex flex-col rounded-[10px] border p-6 ${
                link.primary
                  ? "border-brand-blue bg-[#e8f7fc] sm:col-span-2"
                  : "border-brand-border bg-brand-card"
              }`}
            >
              <h3 className="text-lg font-bold text-brand-heading">{link.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#333]">{link.description}</p>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 inline-block text-center text-sm font-semibold ${
                  link.primary ? "btn-yellow" : "btn-primary"
                }`}
              >
                {link.cta} →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How this relates to our shop" alt>
        <div className="mx-auto max-w-xl space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            When you buy from our shop, we pledge about 50% of each sale toward children-focused
            giving aligned with UNICEF&apos;s mission. That is separate from donating on
            unicef.org.
          </p>
          <p>
            <strong className="text-brand-heading">Want prints instead?</strong> Browse our shop—we
            do not sell products on this page.
          </p>
          <p className="text-center">
            <Link to="/shop" className="font-semibold text-brand-blue hover:underline">
              Go to the shop →
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
