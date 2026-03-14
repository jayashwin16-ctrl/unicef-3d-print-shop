import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About this shop</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
        <p>
          This project is a storefront for 3D-printed items where a portion of each sale is
          pledged toward charitable impact aligned with supporting children—conceptually linked
          to the mission UNICEF represents worldwide.
        </p>
        <p>
          <strong className="text-slate-800">Independent initiative.</strong> This website is not
          affiliated with or endorsed by UNICEF unless you have formal partnership or licensing.
          For official UNICEF donations, use{" "}
          <a
            href="https://www.unicef.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-unicef-blue underline"
          >
            unicef.org
          </a>
          .
        </p>
        <p>
          If you run a real shop, work with UNICEF or local regulators on branding, fundraising,
          and donation flows so everything stays compliant.
        </p>
      </div>
      <Link to="/shop" className="inline-block mt-10 text-unicef-blue font-semibold hover:underline">
        Browse the shop →
      </Link>
    </div>
  );
}
