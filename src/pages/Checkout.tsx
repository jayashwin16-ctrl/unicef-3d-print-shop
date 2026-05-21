import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchCheckoutStatus } from "../lib/checkoutVerification";

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

type Step = "flow" | "code" | "fulfillment" | "form" | "pay";
type FlowType = "bobcat" | "regular" | null;

const POST_VERIFY_STEPS: Step[] = ["fulfillment", "form", "pay"];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  const [source, setSource] = useState<CheckoutLocationState | null>(
    () => (location.state as CheckoutLocationState) || loadStoredState()
  );
  const [localFulfillment, setLocalFulfillment] = useState<"pickup" | "delivery" | null>(null);
  const [step, setStep] = useState<Step>("flow");
  const [verified, setVerified] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [flowType, setFlowType] = useState<FlowType>(null);
  const [codeInput, setCodeInput] = useState("");
  const [bobcat, setBobcat] = useState({ name: "", grade: "", bobcatEmail: "" });
  const [regular, setRegular] = useState({ name: "", email: "" });
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const status = await fetchCheckoutStatus();
      if (cancelled) return;
      if (status.verified) {
        setVerified(true);
        if (status.flowType) setFlowType(status.flowType);
      }
      setStatusLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isCart = Boolean(source?.fromCart);
  const effectiveFulfillment = useMemo((): "pickup" | "delivery" | null => {
    if (isCart && source?.fulfillment) return source.fulfillment;
    if (source?.buyNow) return localFulfillment || source.buyNow.fulfillment || null;
    return null;
  }, [isCart, source, localFulfillment]);

  function stepAfterVerification() {
    if (!source) return;
    if (source.buyNow && !source.fromCart && !effectiveFulfillment) {
      setStep("fulfillment");
      return;
    }
    if (flowType) {
      setStep("form");
      return;
    }
    setStep("flow");
  }

  useEffect(() => {
    if (statusLoading) return;
    if (verified) {
      if (step === "flow" || step === "code") {
        stepAfterVerification();
      }
      return;
    }
    if (POST_VERIFY_STEPS.includes(step) || step === "pay") {
      setStep(flowType ? "code" : "flow");
    }
  }, [verified, statusLoading]);

  if (!source) {
    return null;
  }

  function goFulfillment(ful: "pickup" | "delivery") {
    if (!source) return;
    if (!verified) {
      setErr("Enter the checkout code before continuing.");
      setStep(flowType ? "code" : "flow");
      return;
    }
    setLocalFulfillment(ful);
    if (source.buyNow) {
      const next: CheckoutLocationState = {
        buyNow: { ...source.buyNow, fulfillment: ful },
      };
      setSource(next);
      saveStoredState(next);
    }
    setStep("form");
    setErr(null);
  }

  async function verifyCode() {
    if (!flowType) {
      setErr("Choose Bobcat or Regular first.");
      return;
    }
    setErr(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/verify-checkout-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: codeInput.trim(), flowType }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error || "Invalid code");
      }
      setVerified(true);
      stepAfterVerification();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setVerifying(false);
    }
  }

  async function goPay() {
    if (!source) return;
    if (!verified) {
      setErr("You must enter the correct checkout code before paying.");
      setStep("code");
      return;
    }
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
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("code") || msg.includes("verification")) {
        setVerified(false);
        setStep("code");
        setErr(msg);
      } else {
        navigate("/checkout/payment-error");
      }
    } finally {
      setPaying(false);
    }
  }

  function goToPayStep() {
    if (!verified) {
      setErr("Enter the checkout code before payment.");
      setStep("code");
      return;
    }
    setStep("pay");
  }

  if (statusLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <p className="text-slate-600">Checking verification…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
      <p className="text-sm text-slate-600 mb-4">
        Enter the 5-digit checkout code you were given to unlock payment. No email is sent.
      </p>
      {verified ? (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
          Code accepted — you can complete your order.
        </p>
      ) : (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          Step 1: Enter the 5-digit code before you can pay.
        </p>
      )}
      {err && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {step === "flow" && !verified && (
        <div className="space-y-4">
          <p className="font-medium text-slate-800">Who is checking out?</p>
          <button
            type="button"
            onClick={() => {
              setFlowType("bobcat");
              setStep("code");
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
              setStep("code");
              setErr(null);
            }}
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left font-semibold text-slate-900 hover:bg-slate-50"
          >
            Regular pickup
          </button>
        </div>
      )}

      {step === "code" && flowType && !verified && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter the 5-digit checkout code (ask the shop if you do not have it).
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tracking-widest"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="00000"
          />
          <button
            type="button"
            disabled={verifying || codeInput.length !== 5}
            onClick={verifyCode}
            className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white disabled:opacity-50"
          >
            {verifying ? "Checking…" : "Verify code to continue"}
          </button>
          <button
            type="button"
            onClick={() => setStep("flow")}
            className="text-sm text-brand-blue hover:underline"
          >
            ← Change checkout type
          </button>
        </div>
      )}

      {verified && source.buyNow && !source.fromCart && step === "fulfillment" && (
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

      {verified && step === "form" && flowType === "bobcat" && (
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
            onClick={goToPayStep}
            className="mt-2 w-full rounded-full bg-brand-blue py-3 font-semibold text-white"
          >
            Continue to payment
          </button>
        </div>
      )}

      {verified && step === "form" && flowType === "regular" && (
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
            onClick={goToPayStep}
            className="mt-2 w-full rounded-full bg-brand-blue py-3 font-semibold text-white"
          >
            Continue to payment
          </button>
        </div>
      )}

      {verified && step === "pay" && flowType && (
        <div className="space-y-4">
          <p className="text-slate-600">Code verified. You will be sent to our secure payment page.</p>
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
