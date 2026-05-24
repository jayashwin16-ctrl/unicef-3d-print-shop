import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import PlainEnglish from "../components/site/PlainEnglish";
import Accordion from "../components/site/Accordion";
import { FAQ_CATEGORIES } from "../data/faq";

export default function FAQ() {
  return (
    <>
      <PageHero
        label="Help"
        title={
          <>
            Questions & <span>answers</span>
          </>
        }
        subtitle="Tap a question to open the answer. Written for students, parents, and teachers."
      />

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            Can&apos;t find what you need? Use the feedback form on the{" "}
            <a href="/about" className="font-bold text-cyan-700 underline">
              About
            </a>{" "}
            page. For official UNICEF USA questions, visit unicefusa.org.
          </p>
        </PlainEnglish>
      </Section>

      {FAQ_CATEGORIES.map((cat, i) => (
        <Section key={cat.title} title={cat.title} alt={i % 2 === 1}>
          <Accordion
            items={cat.items.map((item, j) => ({
              id: `${i}-${j}`,
              question: item.q,
              answer: item.a,
            }))}
          />
        </Section>
      ))}
    </>
  );
}
