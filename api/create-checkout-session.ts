import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import {
  CH_OK,
  formatClearCookieHeader,
  getCookieValue,
  verifyOkCookie,
  type OkPayload,
} from "../lib/checkout-cookies";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

type Body = {
  baseUrl?: string;
  productId?: string;
  quantity?: number;
  items?: { productId: string; quantity: number }[];
  fulfillment?: "pickup" | "delivery";
  checkoutType?: "bobcat" | "regular";
  bobcat?: { name: string; grade: string; bobcatEmail: string };
  regular?: { name: string; email: string };
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body || {}) as Body;
  const { baseUrl, productId, quantity = 1, items: cartItems, fulfillment: rawFulfillment, checkoutType, bobcat, regular } = body;
  const fulfillment: "pickup" | "delivery" = rawFulfillment === "pickup" ? "pickup" : "delivery";

  const cookieHeader = typeof req.headers.cookie === "string" ? req.headers.cookie : undefined;
  const ok: OkPayload | null = verifyOkCookie(getCookieValue(cookieHeader, CH_OK));
  if (!ok) {
    res.status(401).json({ error: "Complete email verification first (request a code, then enter it)" });
    return;
  }
  if (checkoutType !== "bobcat" && checkoutType !== "regular") {
    res.status(400).json({ error: "Missing checkout type" });
    return;
  }
  if (ok.f !== checkoutType) {
    res.status(400).json({ error: "Checkout type does not match verified code" });
    return;
  }
  if (checkoutType === "bobcat") {
    if (!bobcat?.name?.trim() || !bobcat?.grade?.trim() || !bobcat?.bobcatEmail?.trim()) {
      res.status(400).json({ error: "Bobcat: name, grade, and school email are required" });
      return;
    }
  } else {
    if (!regular?.name?.trim() || !regular?.email?.trim()) {
      res.status(400).json({ error: "Regular pickup: name and email are required" });
      return;
    }
  }
  if (!baseUrl) {
    res.status(400).json({ error: "Missing baseUrl" });
    return;
  }

  const origin = baseUrl.replace(/\/$/, "");
  const lineItemInputs: { productId: string; quantity: number }[] =
    Array.isArray(cartItems) && cartItems.length > 0
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

    const meta: NonNullable<Stripe.Checkout.SessionCreateParams["metadata"]> = {
      code_verified_email: truncate(ok.e, 500),
      checkout_type: checkoutType,
      fulfillment,
    };
    if (checkoutType === "bobcat" && bobcat) {
      meta.bobcat_name = truncate(bobcat.name.trim(), 500);
      meta.bobcat_grade = truncate(bobcat.grade.trim(), 500);
      meta.bobcat_school_email = truncate(bobcat.bobcatEmail.trim(), 500);
    }
    if (checkoutType === "regular" && regular) {
      meta.regular_name = truncate(regular.name.trim(), 500);
      meta.regular_email = truncate(regular.email.trim(), 500);
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: ok.e,
      metadata: meta,
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

    const session = await getStripe().checkout.sessions.create(sessionParams);
    res.setHeader("Set-Cookie", formatClearCookieHeader(CH_OK));
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    const msg = e instanceof Error ? e.message : "Could not create checkout session";
    res.status(500).json({ error: msg });
  }
}
