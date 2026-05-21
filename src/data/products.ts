export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  donationPercent: number;
  category: string;
  image?: string;
  images?: string[];
  imageGradient?: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "3D printed egg fidget",
    description: "Satisfying 3D-printed egg fidget toy—perfect for stress relief and focus. Made from durable PLA; a portion of each sale supports our donation pledge.",
    price: 10,
    currency: "USD",
    donationPercent: 60,
    category: "Fidget Toys",
    image: "/Photos/egg-fidget-2.jpg",
    images: ["/Photos/egg-fidget.jpg", "/Photos/egg-fidget-2.jpg"],
    imageGradient: "from-amber-200 to-orange-400",
  },
  {
    id: "2",
    title: "3D printed Samurai Sword",
    description: "Detailed 3D-printed samurai sword replica—perfect for display or cosplay. Printed in durable PLA; a share supports our donation pledge.",
    price: 20,
    currency: "USD",
    donationPercent: 60,
    category: "Collectibles",
    image: "/Photos/samurai-sword-2.jpg",
    images: ["/Photos/samurai-sword.jpg", "/Photos/samurai-sword-2.jpg"],
    imageGradient: "from-slate-600 to-slate-800",
  },
  {
    id: "3",
    title: "Articulated dragon",
    description: "Flexible articulated dragon figure with movable joints—great for posing and display. 3D-printed in durable PLA; proceeds support our donation efforts.",
    price: 18,
    currency: "USD",
    donationPercent: 60,
    category: "Figures",
    image: "/Photos/articulated-dragon.jpg",
    images: ["/Photos/articulated-dragon.jpg"],
    imageGradient: "from-red-600 to-amber-500",
  },
  {
    id: "4",
    title: "Shiny dragon",
    description: "Beautiful shiny/metallic finish dragon figure—eye-catching display piece. 3D-printed with special finish; a portion of each sale donated.",
    price: 28,
    currency: "USD",
    donationPercent: 60,
    category: "Figures",
    image: "/Photos/shiny-dragon.jpg",
    images: ["/Photos/shiny-dragon.jpg"],
    imageGradient: "from-yellow-400 to-amber-600",
  },
  {
    id: "5",
    title: "Skull pass-through toy",
    description: "Unique 3D-printed skull with pass-through design—fascinating fidget and display piece. Made from durable PLA; supports our donation pledge.",
    price: 16,
    currency: "USD",
    donationPercent: 60,
    category: "Fidget Toys",
    image: "/Photos/skull-pass-through-2.jpg",
    images: ["/Photos/skull-pass-through.jpg", "/Photos/skull-pass-through-2.jpg"],
    imageGradient: "from-gray-700 to-gray-900",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
