/** Father's Day sale — change percent to 40 for a bigger discount. Set active to false when the sale ends. */
export const FATHERS_DAY_SALE = {
  active: true,
  percentOff: 20,
  label: "Father's Day sale",
} as const;

export function isFathersDaySaleActive(): boolean {
  return FATHERS_DAY_SALE.active;
}

export function getDiscountedPrice(basePrice: number): number {
  if (!FATHERS_DAY_SALE.active) return basePrice;
  const multiplier = 1 - FATHERS_DAY_SALE.percentOff / 100;
  return Math.round(basePrice * multiplier * 100) / 100;
}

export function formatMoney(amount: number): string {
  return amount.toFixed(2);
}
