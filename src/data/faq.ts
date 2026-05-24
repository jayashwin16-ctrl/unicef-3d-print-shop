export type FaqItem = { q: string; a: string };
export type FaqCategory = { title: string; items: FaqItem[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "About this shop",
    items: [
      {
        q: "Who runs 3D Prints for Good?",
        a: "Jay, a 10-year-old builder, runs this shop with parent supervision. It is an independent student project, not an official UNICEF or school store.",
      },
      {
        q: "Is this website part of UNICEF?",
        a: "No. We donate a portion of proceeds to UNICEF USA, but we are not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.",
      },
      {
        q: "What does “60% donated” mean?",
        a: "For each purchase, 60% of the money from that sale (after costs we track for the project) is set aside to donate to UNICEF USA. It is our pledge as a student project.",
      },
    ],
  },
  {
    title: "Buying & checkout",
    items: [
      {
        q: "Why do I need a 5-digit code?",
        a: "The code keeps the shop open only to people Jay’s family and school have shared it with. Enter it once at checkout before you pay.",
      },
      {
        q: "What are the checkout steps?",
        a: "1) Enter the code. 2) Fill in school pickup details (name, grade, email). 3) Pay with card on Stripe. You will get a receipt email.",
      },
      {
        q: "Is payment safe?",
        a: "Yes. Card payment happens on Stripe, a well-known secure payment company. We do not store your card number on this website.",
      },
      {
        q: "What is the verification PIN?",
        a: "After you pay, you get a PIN by email. Jay may ask for it at school pickup to confirm your order.",
      },
    ],
  },
  {
    title: "Pickup & products",
    items: [
      {
        q: "When do I pick up my print?",
        a: "Pickup is at school. Jay or a parent will share timing. Bring your receipt or PIN if asked.",
      },
      {
        q: "What material are the prints?",
        a: "Most items are 3D-printed in PLA plastic, a common material for hobby and school projects.",
      },
      {
        q: "Can I return a print?",
        a: "Because this is a small student project, returns are handled case by case. Use the feedback form on the About page to contact us.",
      },
    ],
  },
  {
    title: "Donating another way",
    items: [
      {
        q: "Can I donate without buying a print?",
        a: "Yes. Visit our Donate page for official UNICEF USA links, or go directly to unicefusa.org.",
      },
      {
        q: "Does buying here count as a tax-deductible UNICEF donation?",
        a: "Buying from our shop supports our student project and our pledge to UNICEF USA. For official tax-deductible donations, give directly through UNICEF USA’s website.",
      },
    ],
  },
];
