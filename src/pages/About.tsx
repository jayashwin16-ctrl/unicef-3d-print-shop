import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About this shop</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
        <p>
          Hello my name is Jay Ashwin. I go to school at Open Window School. I am in fourth grade
          and I am 10 years old. This project is about Selling 3d prints and donating to unicef
          using the money we get from our 3d prints sold. I chose making 3d prints because 3d
          prints are very cool and they also take some skill to make but they are not too hard. I
          chose Unicef as the organization I am donating to because they are special by being the
          only U.N agency dedicated exclusively to children. We hope you like our products and
          give us feedback on what we should improve on! We also hope you like our website and
          recommend it to other people. This is 3d prints for good saying bye! Happy shopping!
        </p>
        <p>
          <strong className="text-slate-800">Independent initiative.</strong> This website is not
          affiliated with or endorsed by UNICEF. For official UNICEF donations, use{" "}
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
      </div>
      <Link to="/shop" className="inline-block mt-10 text-unicef-blue font-semibold hover:underline">
        Browse the shop →
      </Link>
    </div>
  );
}
