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
    price: 9.99,
    currency: "USD",
    donationPercent: 60,
    category: "Fidget Toys",
    image: "/Photos/egg-fidget-2.webp",
    images: ["/Photos/egg-fidget.webp", "/Photos/egg-fidget-2.webp"],
    imageGradient: "from-amber-200 to-orange-400",
  },
  {
    id: "2",
    title: "3D printed Samurai Sword",
    description: "Detailed 3D-printed samurai sword replica—perfect for display or cosplay. Printed in durable PLA; a share supports our donation pledge.",
    price: 19.99,
    currency: "USD",
    donationPercent: 60,
    category: "Collectibles",
    image: "/Photos/samurai-sword-2.webp",
    images: ["/Photos/samurai-sword.webp", "/Photos/samurai-sword-2.webp"],
    imageGradient: "from-slate-600 to-slate-800",
  },
  {
    id: "3",
    title: "Articulated dragon",
    description: "Flexible articulated dragon figure with movable joints—great for posing and display. 3D-printed in durable PLA; proceeds support our donation efforts.",
    price: 17.99,
    currency: "USD",
    donationPercent: 60,
    category: "Figures",
    image: "/Photos/articulated-dragon.webp",
    images: ["/Photos/articulated-dragon.webp"],
    imageGradient: "from-red-600 to-amber-500",
  },
  {
    id: "4",
    title: "Shiny dragon",
    description: "Beautiful shiny/metallic finish dragon figure—eye-catching display piece. 3D-printed with special finish; a portion of each sale donated.",
    price: 14.99,
    currency: "USD",
    donationPercent: 60,
    category: "Figures",
    image: "/Photos/shiny-dragon.webp",
    images: ["/Photos/shiny-dragon.webp"],
    imageGradient: "from-yellow-400 to-amber-600",
  },
  {
    id: "5",
    title: "Skull pass-through toy",
    description: "Unique 3D-printed skull with pass-through design—fascinating fidget and display piece. Made from durable PLA; supports our donation pledge.",
    price: 14.99,
    currency: "USD",
    donationPercent: 60,
    category: "Fidget Toys",
    image: "/Photos/skull-pass-through-2.webp",
    images: ["/Photos/skull-pass-through.webp", "/Photos/skull-pass-through-2.webp"],
    imageGradient: "from-gray-700 to-gray-900",
  },
  {
    id: "6",
    title: "World Cup trophy",
    description: "Detailed 3D-printed World Cup trophy replica—a must-have for any football fan. Printed in durable PLA; a portion of every sale supports our donation pledge.",
    price: 17.99,
    currency: "USD",
    donationPercent: 60,
    category: "Collectibles",
    image: "/Photos/worldcup.webp",
    images: ["/Photos/worldcup.webp"],
    imageGradient: "from-yellow-400 to-amber-600",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Jay's favorite print — featured in the site attention grabber. */
export const FAVORITE_PRODUCT_ID = "2";

export function getFavoriteProduct(): Product {
  const p = getProduct(FAVORITE_PRODUCT_ID);
  if (!p) throw new Error("Favorite product not found");
  return p;
}
