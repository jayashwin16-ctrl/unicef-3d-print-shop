import { Link } from "react-router-dom";
import Section from "../components/site/Section";
import BarrierRow from "../components/site/BarrierRow";
import CtaBanner from "../components/site/CtaBanner";

export default function Problem() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#e3f2fd] via-[#f0f7fc] to-[#e3f2fd] px-8 py-16 text-center md:py-20">
        <div className="section-label">The Problem</div>
        <blockquote className="mx-auto max-w-xl text-[22px] italic leading-relaxed text-brand-heading">
          &ldquo;I want to be a doctor when I grow up, but my family cannot afford to send me to
          school.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-brand-muted">
          — A 10-year-old girl in rural Pakistan, via UNICEF field report
        </p>
      </section>

      <Section title="Barriers Children Face">
        <BarrierRow
          icon="💰"
          title="Poverty"
          body="For millions of families, school fees, uniforms, and supplies are out of reach. When survival comes first, education is often the first thing cut."
          stat="Nearly 1 in 5 children in South Asia live in extreme poverty"
        />
        <BarrierRow
          icon="🏫"
          title="Lack of Schools & Teachers"
          body="In many rural areas, the nearest school is hours away—or lacks trained teachers and safe facilities."
          stat="South Asia needs over 2 million more trained teachers"
        />
        <BarrierRow
          icon="⚕️"
          title="Gender Inequality"
          body="Girls are disproportionately kept out of school by poverty, safety concerns, and cultural barriers."
          stat="Over 12 million girls in South Asia are out of school"
        />
        <BarrierRow
          icon="⛏"
          title="Child Labor"
          body="Millions of children work instead of learning. When a family depends on a child's income, school is not an option."
          stat="South Asia has over 26 million child laborers—the highest globally"
        />
      </Section>

      <Section label="The Consequences" title="What Happens When Kids Can't Go to School?" alt>
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            When children are denied an education, the consequences go far beyond the classroom.
            Without skills and opportunity, many remain trapped in cycles of poverty and hardship.
          </p>
          <p>
            Education breaks those cycles. When we invest in a child—through direct giving or by
            shopping with purpose—we invest in a safer, stronger future for everyone.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/stats" className="btn-primary">
            View Stats & Data
          </Link>
          <Link to="/donate" className="rounded-md border border-brand-border bg-brand-card px-7 py-3 text-sm font-bold text-brand-heading hover:border-brand-blue">
            Donate / Shop Now
          </Link>
        </div>
      </Section>

      <CtaBanner
        title="See the Full Picture"
        text="Explore the data, then take action with a purchase or direct gift."
        buttonLabel="Donate / Shop Now"
        to="/donate"
      />
    </>
  );
}
