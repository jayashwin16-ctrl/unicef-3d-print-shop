export type GlossaryTerm = {
  term: string;
  simple: string;
  detail: string;
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "UNICEF",
    simple: "A United Nations group that helps children around the world.",
    detail:
      "UNICEF works on health, education, nutrition, and safety for children in many countries. UNICEF USA is the American branch that raises funds in the United States.",
  },
  {
    term: "Proceeds",
    simple: "The money from a sale after basic costs.",
    detail: "When we say 60% of proceeds, we mean the portion of each purchase Jay sets aside for UNICEF USA as part of this student project.",
  },
  {
    term: "PLA",
    simple: "A common plastic used in school and hobby 3D printers.",
    detail: "Most prints on this shop are made from PLA filament. It is lightweight and works well for toys and display pieces.",
  },
  {
    term: "Stripe",
    simple: "The secure company that processes card payments at checkout.",
    detail: "When you pay, you are sent to Stripe’s checkout page. This site does not store your full card number.",
  },
  {
    term: "Checkout code",
    simple: "A 5-digit password that unlocks payment.",
    detail: "Jay shares this code with people allowed to buy from the school shop. You enter it once per browser session before paying.",
  },
  {
    term: "Verification PIN",
    simple: "A code in your receipt email used at school pickup.",
    detail: "After payment, you may receive a PIN so Jay can confirm your order when you pick up your print.",
  },
  {
    term: "Independent project",
    simple: "Not run by UNICEF or your school as an official store.",
    detail: "3D Prints for Good is Jay’s student project with parent supervision. Donations support UNICEF USA but we are not affiliated with UNICEF.",
  },
  {
    term: "Extreme poverty",
    simple: "Living on very little money per day—hard to afford food and school.",
    detail: "Hundreds of millions of children worldwide live in households that struggle to meet basic needs. That is why charities and projects like this exist.",
  },
];
