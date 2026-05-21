import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import SiteDisclaimer from "../components/SiteDisclaimer";

const UNICEF_USA_LINKS = [
  {
    title: "Donate to UNICEF USA",
    description:
      "Make a one-time or monthly gift on UNICEF USA’s official site. Your donation goes directly to their programs for children.",
    href: "https://www.unicefusa.org/help/donate",
    cta: "Donate on unicefusa.org",
    primary: true,
  },
  {
    title: "Emergency relief",
    description:
      "Support children in crises—conflicts, disasters, and displacement—through UNICEF USA’s emergency appeals.",
    href: "https://www.unicefusa.org/emergency",
    cta: "View emergency appeals",
    primary: false,
  },
  {
    title: "Where your gift goes",
    description:
      "Read how UNICEF USA uses funds for health, nutrition, education, and protection for children worldwide.",
    href: "https://www.unicefusa.org/about-us",
    cta: "Learn about UNICEF USA",
    primary: false,
  },
  {
    title: "Reports & transparency",
    description:
      "Explore UNICEF USA’s published impact and financial reports.",
    href: "https://www.unicefusa.org/about-us/financials",
    cta: "Read reports",
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
            Donate to <span className="text-brand-blue">UNICEF USA</span>
          </>
        }
        subtitle="This page is for direct giving through UNICEF USA—not our 3D print shop. Use the official links below to donate securely."
      />

      <div className="border-b border-brand-border bg-brand-card px-6 py-4">
        <SiteDisclaimer variant="banner" className="mx-auto max-w-3xl" />
      </div>

      <Section title="Official UNICEF USA donation links">
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {UNICEF_USA_LINKS.map((link) => (
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
            When you buy from our shop, we donate 60% of proceeds from every purchase to UNICEF USA. That is
            separate from donating directly on unicefusa.org.
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
