/** Keep in sync with src/lib/pricing.ts */
export const FATHERS_DAY_SALE = {
  active: true,
  percentOff: 20,
} as const;

export function getDiscountedPrice(basePrice: number): number {
  if (!FATHERS_DAY_SALE.active) return basePrice;
  const multiplier = 1 - FATHERS_DAY_SALE.percentOff / 100;
  return Math.round(basePrice * multiplier * 100) / 100;
}
