import Stripe from "stripe";
import {
  CH_OK,
  formatClearCookieHeader,
  verifyOkCookie,
  type OkPayload,
} from "./checkout-cookies";
import { getCookieValue, jsonResponse, methodNotAllowed } from "./http";

export const runtime = "nodejs";

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

export async function POST(request: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { baseUrl, productId, quantity = 1, items: cartItems, fulfillment: rawFulfillment, checkoutType, bobcat, regular } = body;
  const fulfillment: "pickup" | "delivery" = rawFulfillment === "pickup" ? "pickup" : "delivery";

  const ok: OkPayload | null = verifyOkCookie(getCookieValue(request, CH_OK));
  if (!ok) {
    return jsonResponse({ error: "Complete email verification first (request a code, then enter it)" }, 401);
  }
  if (checkoutType !== "bobcat" && checkoutType !== "regular") {
    return jsonResponse({ error: "Missing checkout type" }, 400);
  }
  if (ok.f !== checkoutType) {
    return jsonResponse({ error: "Checkout type does not match verified code" }, 400);
  }
  if (checkoutType === "bobcat") {
    if (!bobcat?.name?.trim() || !bobcat?.grade?.trim() || !bobcat?.bobcatEmail?.trim()) {
      return jsonResponse({ error: "Bobcat: name, grade, and school email are required" }, 400);
    }
  } else {
    if (!regular?.name?.trim() || !regular?.email?.trim()) {
      return jsonResponse({ error: "Regular pickup: name and email are required" }, 400);
    }
  }
  if (!baseUrl) {
    return jsonResponse({ error: "Missing baseUrl" }, 400);
  }

  const origin = baseUrl.replace(/\/$/, "");
  const lineItemInputs: { productId: string; quantity: number }[] =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems
      : productId
        ? [{ productId, quantity }]
        : [];

  if (lineItemInputs.length === 0) {
    return jsonResponse({ error: "Missing items or productId" }, 400);
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const { productId: id, quantity: qty } of lineItemInputs) {
    const product = getProduct(id);
    if (!product) {
      return jsonResponse({ error: `Product not found: ${id}` }, 404);
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
    return jsonResponse({ url: session.url }, 200, [formatClearCookieHeader(CH_OK)]);
  } catch (e) {
    console.error("Stripe checkout error:", e);
    const msg = e instanceof Error ? e.message : "Could not create checkout session";
    return jsonResponse({ error: msg }, 500);
  }
}

export function GET(): Response {
  return methodNotAllowed();
}
