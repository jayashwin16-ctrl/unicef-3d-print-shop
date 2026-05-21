import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import SiteDisclaimer from "../components/SiteDisclaimer";

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-[700px] last:mb-0">
      <h3 className="mb-3 text-lg font-bold text-brand-heading">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-[#333]">{children}</div>
    </div>
  );
}

export default function WhyUnicef() {
  return (
    <>
      <PageHero
        label="Why we give"
        title={
          <>
            Why <span className="text-brand-blue">UNICEF USA</span>?
          </>
        }
        subtitle="UNICEF USA supports programs that help children in more than 190 countries and territories."
      />

      <div className="border-b border-brand-border bg-brand-card px-6 py-4">
        <SiteDisclaimer variant="banner" className="mx-auto max-w-3xl" />
      </div>

      <Section>
        <InfoBlock title="🌍 Focused on children">
          <p>
            UNICEF is the United Nations agency for children. It delivers vaccines, nutrition,
            education, and emergency relief—wherever children are most vulnerable.
          </p>
          <p>
            Our shop is independent. We donate a portion of proceeds to UNICEF USA because their work
            helps keep children safe, healthy, and learning.
          </p>
        </InfoBlock>
      </Section>

      <Section alt>
        <InfoBlock title="📚 What UNICEF does">
          <p>UNICEF&apos;s work includes:</p>
          <ul className="mt-3 list-none space-y-2 border-t border-brand-border pt-2">
            {[
              "Vaccines and health care for millions of children",
              "Safe water and sanitation in crisis zones",
              "Education supplies and school support",
              "Protection for children in conflict and disaster",
              "Nutrition programs for mothers and babies",
            ].map((item) => (
              <li key={item} className="border-b border-brand-border py-2 last:border-0">
                <span className="font-bold text-brand-blue">✓ </span>
                {item}
              </li>
            ))}
          </ul>
        </InfoBlock>
      </Section>

      <Section>
        <InfoBlock title="🛒 How our shop helps">
          <p>
            You can give directly at{" "}
            <a
              href="https://www.unicefusa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-blue underline"
            >
              unicefusa.org
            </a>
            —or buy a 3D print from us. A portion of each sale is donated to UNICEF USA.
          </p>
          <p>
            <Link to="/shop" className="font-bold text-brand-blue-dark underline">
              Browse the shop →
            </Link>
          </p>
        </InfoBlock>
      </Section>

      <CtaBanner
        title="Support children today"
        text="Shop our prints or donate directly through UNICEF USA."
        buttonLabel="Donate / Shop Now"
        to="/donate"
      />
    </>
  );
}
