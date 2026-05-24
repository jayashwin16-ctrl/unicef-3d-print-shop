/**
 * Total money raised — update this when you add up donations / sales.
 * Or set VITE_TOTAL_RAISED on Vercel (numbers only, e.g. 150.00).
 */
export const TOTAL_RAISED_MANUAL_USD = 0;

const fromEnv = import.meta.env.VITE_TOTAL_RAISED;
const parsed = fromEnv !== undefined && fromEnv !== "" ? Number(fromEnv) : NaN;

export const TOTAL_RAISED_USD = Number.isFinite(parsed) ? parsed : TOTAL_RAISED_MANUAL_USD;

export function formatRaisedUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
