import Stripe from "stripe";

declare const process: { env: Record<string, string | undefined> };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: { bodyParser: true },
};

type Body = {
  baseUrl?: string;
  productId?: string;
  quantity?: number;
  items?: { productId: string; quantity: number }[];
  /** pickup = in person (no Stripe shipping). delivery = ship to address. */
  fulfillment?: "pickup" | "delivery";
};

function getAllowedCountries(): Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] {
  const raw = process.env.STRIPE_ALLOWED_COUNTRIES || "US";
  return raw
    .split(",")
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
}

function getShippingOptions(): Stripe.Checkout.SessionCreateParams.ShippingOption[] | undefined {
  const standardRate = process.env.STRIPE_SHIPPING_RATE_STANDARD;
  const expressRate = process.env.STRIPE_SHIPPING_RATE_EXPRESS;
  const options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];
  if (standardRate) options.push({ shipping_rate: standardRate });
  if (expressRate) options.push({ shipping_rate: expressRate });
  return options.length > 0 ? options : undefined;
}

export default async function handler(
  req: { method?: string; body?: Body },
  res: { status: (n: number) => { json: (o: object) => void }; setHeader: (a: string, b: string) => void }
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { baseUrl, productId, quantity = 1, items: cartItems, fulfillment: rawFulfillment } = req.body || {};
  const fulfillment: "pickup" | "delivery" = rawFulfillment === "pickup" ? "pickup" : "delivery";
  if (!baseUrl) {
    res.status(400).json({ error: "Missing baseUrl" });
    return;
  }

  const origin = baseUrl.replace(/\/$/, "");

  // Support either cart (items array) or single-item (productId)
  const lineItemInputs: { productId: string; quantity: number }[] = Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems
    : productId
      ? [{ productId, quantity }]
      : [];

  if (lineItemInputs.length === 0) {
    res.status(400).json({ error: "Missing items or productId" });
    return;
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const { productId: id, quantity: qty } of lineItemInputs) {
    const product = getProduct(id);
    if (!product) {
      res.status(404).json({ error: `Product not found: ${id}` });
      return;
    }
    line_items.push({
      quantity: qty,
      price_data: {
        currency: (product.currency || "usd").toLowerCase(),
        product_data: {
          name: product.title,
          description: product.description?.slice(0, 500),
          images: product.image ? [new URL(product.image, origin).href] : undefined,
        },
        unit_amount: Math.round(product.price * 100),
      },
    });
  }

  try {
    const shippingOptions = getShippingOptions();
    const pickupFormCartUrl = `${origin}/cart#school-pickup-cart`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    };

    if (fulfillment === "delivery") {
      sessionParams.shipping_address_collection = { allowed_countries: getAllowedCountries() };
      if (shippingOptions) sessionParams.shipping_options = shippingOptions;
      sessionParams.custom_text = {
        submit: {
          message: `Shipping: enter your address on this page. School pickup instead? Use “Get in person” on our Cart, or fill the pickup form: ${pickupFormCartUrl}`,
        },
      };
    } else {
      sessionParams.custom_text = {
        submit: {
          message: `In-person pickup: fill out the school pickup form on our site before or after paying: ${pickupFormCartUrl}`,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    res.status(500).json({ error: "Could not create checkout session" });
  }
}

// Minimal server-side product lookup (mirrors your frontend products for the API)
function getProduct(id: string): { title: string; description?: string; price: number; currency: string; image?: string } | null {
  const products: Record<string, { title: string; description?: string; price: number; currency: string; image?: string }> = {
    "1": { title: "3D printed egg fidget", description: "Satisfying 3D-printed egg fidget toy.", price: 10, currency: "usd", image: "/Photos/egg-fidget-2.jpg" },
    "2": { title: "3D printed Samurai Sword", description: "Detailed 3D-printed samurai sword replica.", price: 20, currency: "usd", image: "/Photos/samurai-sword-2.jpg" },
    "3": { title: "Articulated dragon", description: "Flexible articulated dragon figure.", price: 18, currency: "usd", image: "/Photos/articulated-dragon.jpg" },
    "4": { title: "Shiny dragon", description: "Beautiful shiny dragon figure.", price: 28, currency: "usd", image: "/Photos/shiny-dragon.jpg" },
    "5": { title: "Skull pass-through toy", description: "Unique 3D-printed skull with pass-through design.", price: 16, currency: "usd", image: "/Photos/skull-pass-through-2.jpg" },
  };
  return products[id] ?? null;
}
