import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SchoolPickupForm, { type PickupDetails } from "../components/SchoolPickupForm";
import CheckoutStepBar from "../components/CheckoutStepBar";

const STORAGE_KEY = "checkout_flow_v1";
const VERIFIED_SESSION_KEY = "checkout_verified_session";

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

type Step = "code" | "pickup" | "pay";

const POST_VERIFY_STEPS: Step[] = ["pickup", "pay"];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  const [source, setSource] = useState<CheckoutLocationState | null>(
    () => (location.state as CheckoutLocationState) || loadStoredState()
  );
  const [step, setStep] = useState<Step>("code");
  const [verified, setVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [pickupDetails, setPickupDetails] = useState<PickupDetails | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = (location.state as CheckoutLocationState) || loadStoredState();
    if (s) {
      setSource(s);
      saveStoredState(s);
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
  const effectiveFulfillment = useMemo((): "pickup" | "delivery" => {
    return source?.fulfillment || source?.buyNow?.fulfillment || "pickup";
  }, [source]);

  useEffect(() => {
    if (!verified && POST_VERIFY_STEPS.includes(step)) {
      setStep("code");
    }
  }, [verified, step]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(VERIFIED_SESSION_KEY);
    };
  }, []);

  if (!source) {
    return null;
  }

  async function verifyCode() {
    setErr(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/verify-checkout-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: codeInput.trim(), flowType: "bobcat" }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error || "Invalid code");
      }
      setVerified(true);
      sessionStorage.setItem(VERIFIED_SESSION_KEY, "1");
      setStep("pickup");
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
    if (!pickupDetails?.name.trim() || !pickupDetails?.grade.trim() || !pickupDetails?.email.trim()) {
      setErr("Submit school pickup details before paying.");
      setStep("pickup");
      return;
    }
    if (!pickupDetails.email.includes("@")) {
      setErr("Enter a valid parent email.");
      setStep("pickup");
      return;
    }
    setErr(null);
    setPaying(true);
    try {
      const baseUrl = window.location.origin;
      const body: Record<string, unknown> = {
        baseUrl,
        fulfillment: effectiveFulfillment,
        checkoutType: "bobcat",
        bobcat: {
          name: pickupDetails.name.trim(),
          grade: pickupDetails.grade.trim(),
          bobcatEmail: pickupDetails.email.trim(),
        },
      };
      if (isCart) {
        body.items = items.map(({ productId, quantity }) => ({ productId, quantity }));
      } else if (source.buyNow) {
        body.productId = source.buyNow.productId;
        body.quantity = source.buyNow.quantity;
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
        sessionStorage.removeItem(VERIFIED_SESSION_KEY);
        setStep("code");
        setErr(msg);
      } else {
        navigate("/checkout/payment-error");
      }
    } finally {
      setPaying(false);
    }
  }

  function completePickupAndPay(details: PickupDetails) {
    setPickupDetails(details);
    setErr(null);
    setStep("pay");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
      <CheckoutStepBar current={step} />
      <p className="text-sm text-slate-600 mb-4">
        Enter the checkout code, then school pickup details, to pay.
      </p>
      {verified ? (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
          Code accepted — complete school pickup below.
        </p>
      ) : (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          Step 1: Enter the 5-digit code from the shop.
        </p>
      )}
      {err && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {step === "code" && !verified && (
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
        </div>
      )}

      {verified && step === "pickup" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Step 2: School pickup and contact details.</p>
          <SchoolPickupForm
            sectionId="school-pickup-checkout"
            idSuffix="checkout"
            onSubmitted={completePickupAndPay}
          />
        </div>
      )}

      {verified && step === "pay" && pickupDetails && (
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Payment</h2>
          <p className="text-slate-600">
            Step 3: Order for <strong>{pickupDetails.name}</strong>, grade{" "}
            <strong>{pickupDetails.grade}</strong>. You will be sent to our secure payment page.
          </p>
          <button
            type="button"
            disabled={paying}
            onClick={goPay}
            className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50"
          >
            {paying ? "Redirecting…" : "Pay now with card"}
          </button>
          <button
            type="button"
            onClick={() => setStep("pickup")}
            className="text-sm text-brand-blue hover:underline"
          >
            ← Edit pickup details
          </button>
        </div>
      )}

      <Link to="/cart" className="mt-8 inline-block text-sm text-brand-blue hover:underline">
        ← Back to cart
      </Link>
    </div>
  );
}
