import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STORAGE_KEY = "checkout_flow_v1";

export type CheckoutLocationState = {
  fromCart?: true;
  fulfillment?: "pickup" | "delivery";
  buyNow?: { productId: string; quantity: number; fulfillment?: "pickup" | "delivery" };
};

function loadStoredState(): CheckoutLocationState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutLocationState;
  } catch {
    return null;
  }
}

function saveStoredState(s: CheckoutLocationState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

type Step = "fulfillment" | "flow" | "email" | "code" | "form" | "pay";
type FlowType = "bobcat" | "regular" | null;

function initialStep(s: CheckoutLocationState | null): Step {
  if (!s) return "flow";
  if (s.buyNow && !s.fromCart && !s.buyNow.fulfillment) return "fulfillment";
  return "flow";
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  const [source, setSource] = useState<CheckoutLocationState | null>(
    () => (location.state as CheckoutLocationState) || loadStoredState()
  );
  const [localFulfillment, setLocalFulfillment] = useState<"pickup" | "delivery" | null>(null);
  const [step, setStep] = useState<Step>(() =>
    initialStep((location.state as CheckoutLocationState) || loadStoredState() || null)
  );
  const [flowType, setFlowType] = useState<FlowType>(null);
  const [emailForCode, setEmailForCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [bobcat, setBobcat] = useState({ name: "", grade: "", bobcatEmail: "" });
  const [regular, setRegular] = useState({ name: "", email: "" });
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = (location.state as CheckoutLocationState) || loadStoredState();
    if (s) {
      setSource(s);
      saveStoredState(s);
      if (s.buyNow?.fulfillment) setLocalFulfillment(s.buyNow.fulfillment);
    }
  }, [location.state]);

  useEffect(() => {
    if (!source || (!source.fromCart && !source.buyNow)) {
      navigate("/cart", { replace: true });
    }
  }, [source, navigate]);

  useEffect(() => {
    if (source?.fromCart && itemCount === 0) {
      navigate("/cart", { replace: true });
    }
  }, [source, itemCount, navigate]);

  const isCart = Boolean(source?.fromCart);
  const effectiveFulfillment = useMemo((): "pickup" | "delivery" | null => {
    if (isCart && source?.fulfillment) return source.fulfillment;
    if (source?.buyNow) return localFulfillment || source.buyNow.fulfillment || null;
    return null;
  }, [isCart, source, localFulfillment]);

  const canShowTypeButtons = (isCart && !!source?.fulfillment) || (source?.buyNow && effectiveFulfillment !== null);

  if (!source) {
    return null;
  }

  function goFulfillment(ful: "pickup" | "delivery") {
    setLocalFulfillment(ful);
    if (source.buyNow) {
      const next: CheckoutLocationState = {
        buyNow: { ...source.buyNow, fulfillment: ful },
      };
      setSource(next);
      saveStoredState(next);
    }
    setStep("flow");
    setErr(null);
  }

  async function sendCode() {
    if (!flowType) {
      setErr("Choose Bobcat or Regular first.");
      return;
    }
    setErr(null);
    setSending(true);
    try {
      const res = await fetch("/api/send-checkout-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailForCode, flowType }),
      });
      if (!res.ok) {
        const raw = await res.text();
        let msg = "Could not send code";
        try {
          const d = JSON.parse(raw) as { error?: string };
          if (d.error) msg = d.error;
        } catch {
          if (res.status === 404) {
            msg = "API route not found. If testing locally, use Vercel deployment or `vercel dev`.";
          } else if (raw.trim()) {
            msg = raw.slice(0, 200);
          }
        }
        throw new Error(msg);
      }
      setStep("code");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setSending(false);
    }
  }

  async function verifyCode() {
    setErr(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/verify-checkout-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: codeInput.trim() }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error || "Invalid code");
      }
      setStep("form");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setVerifying(false);
    }
  }

  async function goPay() {
    if (!flowType || !effectiveFulfillment) {
      setErr("Missing checkout options.");
      return;
    }
    if (flowType === "bobcat") {
      if (!bobcat.name.trim() || !bobcat.grade.trim() || !bobcat.bobcatEmail.trim()) {
        setErr("Fill in name, grade, and school email.");
        return;
      }
    } else {
      if (!regular.name.trim() || !regular.email.trim()) {
        setErr("Fill in name and email.");
        return;
      }
    }
    setErr(null);
    setPaying(true);
    try {
      const baseUrl = window.location.origin;
      const body: Record<string, unknown> = {
        baseUrl,
        fulfillment: effectiveFulfillment,
        checkoutType: flowType,
      };
      if (isCart) {
        body.items = items.map(({ productId, quantity }) => ({ productId, quantity }));
      } else if (source.buyNow) {
        body.productId = source.buyNow.productId;
        body.quantity = source.buyNow.quantity;
      }
      if (flowType === "bobcat") {
        body.bobcat = { name: bobcat.name, grade: bobcat.grade, bobcatEmail: bobcat.bobcatEmail };
      } else {
        body.regular = { name: regular.name, email: regular.email };
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL");
    } catch (e) {
      navigate("/checkout/payment-error");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
      <p className="text-sm text-slate-600 mb-6">Complete each step, then you will go to payment.</p>
      {err && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {source.buyNow && !source.fromCart && step === "fulfillment" && (
        <div className="space-y-4">
          <p className="font-medium text-slate-800">How do you want this order?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => goFulfillment("pickup")}
              className="rounded-full border-2 border-brand-blue bg-brand-blue px-5 py-3 font-semibold text-white hover:bg-brand-blue-dark"
            >
              Get in person
            </button>
            <button
              type="button"
              onClick={() => goFulfillment("delivery")}
              className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white hover:bg-brand-blue-dark"
            >
              Delivered to you
            </button>
          </div>
        </div>
      )}

      {canShowTypeButtons && step === "flow" && (
        <div className="space-y-4">
          <p className="font-medium text-slate-800">Who is checking out?</p>
          <button
            type="button"
            onClick={() => {
              setFlowType("bobcat");
              setStep("email");
              setErr(null);
            }}
            className="w-full rounded-xl border-2 border-[#1CABE2] bg-sky-50 p-4 text-left font-semibold text-slate-900 hover:bg-sky-100"
          >
            Bobcat (school) checkout
          </button>
          <button
            type="button"
            onClick={() => {
              setFlowType("regular");
              setStep("email");
              setErr(null);
            }}
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left font-semibold text-slate-900 hover:bg-slate-50"
          >
            Regular pickup
          </button>
        </div>
      )}

      {step === "email" && flowType && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter the buyer email. We will send a one-time code here, and after verification this
            same email is passed into payment as the buyer email.
          </p>
          <div>
            <label htmlFor="cemail" className="mb-1 block text-sm font-medium text-slate-700">
              Buyer email
            </label>
            <input
              id="cemail"
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailForCode}
              onChange={(e) => setEmailForCode(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            disabled={sending}
            onClick={sendCode}
            className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send me the code"}
          </button>
        </div>
      )}

      {step === "code" && flowType && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Enter the 6-digit code we emailed you.</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tracking-widest"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
          />
          <button
            type="button"
            disabled={verifying || codeInput.length !== 6}
            onClick={verifyCode}
            className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white disabled:opacity-50"
          >
            {verifying ? "Verifying…" : "Verify code"}
          </button>
        </div>
      )}

      {step === "form" && flowType === "bobcat" && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900">Bobcat details</h2>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={bobcat.name}
              onChange={(e) => setBobcat((b) => ({ ...b, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Grade</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={bobcat.grade}
              onChange={(e) => setBobcat((b) => ({ ...b, grade: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bobcat school email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={bobcat.bobcatEmail}
              onChange={(e) => setBobcat((b) => ({ ...b, bobcatEmail: e.target.value }))}
            />
          </div>
          <button
            type="button"
            onClick={() => setStep("pay")}
            className="mt-2 w-full rounded-full bg-brand-blue py-3 font-semibold text-white"
          >
            Continue to payment
          </button>
        </div>
      )}

      {step === "form" && flowType === "regular" && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900">Regular pickup details</h2>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={regular.name}
              onChange={(e) => setRegular((r) => ({ ...r, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={regular.email}
              onChange={(e) => setRegular((r) => ({ ...r, email: e.target.value }))}
            />
          </div>
          <button
            type="button"
            onClick={() => setStep("pay")}
            className="mt-2 w-full rounded-full bg-brand-blue py-3 font-semibold text-white"
          >
            Continue to payment
          </button>
        </div>
      )}

      {step === "pay" && flowType && (
        <div className="space-y-4">
          <p className="text-slate-600">You will be sent to our secure payment page.</p>
          <button
            type="button"
            disabled={paying}
            onClick={goPay}
            className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50"
          >
            {paying ? "Redirecting…" : "Pay now with card"}
          </button>
        </div>
      )}

      <Link to="/cart" className="mt-8 inline-block text-sm text-brand-blue hover:underline">
        ← Back to cart
      </Link>
    </div>
  );
}
