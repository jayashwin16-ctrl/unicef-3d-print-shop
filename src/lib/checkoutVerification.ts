export type CheckoutStatus = {
  verified: boolean;
  flowType?: "bobcat" | "regular";
  email?: string;
};

export async function fetchCheckoutStatus(): Promise<CheckoutStatus> {
  try {
    const res = await fetch("/api/checkout-status", { credentials: "include" });
    if (!res.ok) return { verified: false };
    return (await res.json()) as CheckoutStatus;
  } catch {
    return { verified: false };
  }
}
