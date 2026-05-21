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

type Step = "code" | "student" | "pay";

const POST_VERIFY_STEPS: Step[] = ["student", "pay"];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  const [source, setSource] = useState<CheckoutLocationState | null>(
    () => (location.state as CheckoutLocationState) || loadStoredState()
  );
  const [step, setStep] = useState<Step>("code");
  const [verified, setVerified] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [student, setStudent] = useState({ name: "", grade: "", email: "" });
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const status = await fetchCheckoutStatus();
      if (cancelled) return;
      if (status.verified) {
        setVerified(true);
      }
      setStatusLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isCart = Boolean(source?.fromCart);
  const effectiveFulfillment = useMemo((): "pickup" | "delivery" => {
    return source?.fulfillment || source?.buyNow?.fulfillment || "pickup";
  }, [source]);

  useEffect(() => {
    if (statusLoading) return;
    if (verified) {
      if (step === "code") {
        setStep("student");
      }
      return;
    }
    if (POST_VERIFY_STEPS.includes(step) || step === "pay") {
      setStep("code");
    }
  }, [verified, statusLoading, step]);

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
      setStep("student");
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
    if (!student.name.trim() || !student.grade.trim() || !student.email.trim()) {
      setErr("Enter your name, grade, and email.");
      return;
    }
    if (!student.email.includes("@")) {
      setErr("Enter a valid email address.");
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
          name: student.name.trim(),
          grade: student.grade.trim(),
          bobcatEmail: student.email.trim(),
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
    if (!student.name.trim() || !student.grade.trim()) {
      setErr("Enter your name and grade.");
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
        Enter the 5-digit checkout code, then your student details, to pay.
      </p>
      {verified ? (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
          Code accepted — enter your name and grade below.
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

      {verified && step === "student" && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900">Student details</h2>
          <p className="text-sm text-slate-600">Tell us who this order is for.</p>
          <div>
            <label htmlFor="student-name" className="text-sm font-medium">
              Student name
            </label>
            <input
              id="student-name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={student.name}
              onChange={(e) => setStudent((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="student-grade" className="text-sm font-medium">
              Grade
            </label>
            <input
              id="student-grade"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={student.grade}
              onChange={(e) => setStudent((s) => ({ ...s, grade: e.target.value }))}
              placeholder="e.g. 7th"
              required
            />
          </div>
          <div>
            <label htmlFor="student-email" className="text-sm font-medium">
              Email (for payment receipt)
            </label>
            <input
              id="student-email"
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={student.email}
              onChange={(e) => setStudent((s) => ({ ...s, email: e.target.value }))}
              required
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

      {verified && step === "pay" && (
        <div className="space-y-4">
          <p className="text-slate-600">
            Order for <strong>{student.name}</strong>, grade <strong>{student.grade}</strong>.
            You will be sent to our secure payment page.
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
            onClick={() => setStep("student")}
            className="text-sm text-brand-blue hover:underline"
          >
            ← Edit student details
          </button>
        </div>
      )}

      <Link to="/cart" className="mt-8 inline-block text-sm text-brand-blue hover:underline">
        ← Back to cart
      </Link>
    </div>
  );
}
